"""Dịch bài LITFL trong kho/goc sang tiếng Việt bằng Claude API, lưu vào kho/dich.

Cần: pip install anthropic, và khoá API (biến môi trường ANTHROPIC_API_KEY hoặc `ant auth login`).

    python cong-cu/dich_litfl.py --uoc-tinh                  # xem số bài chờ dịch và chi phí ước lượng
    python cong-cu/dich_litfl.py --toi-da 5                  # dịch thử 5 bài (gọi trực tiếp)
    python cong-cu/dich_litfl.py --chuyen-muc ecg-library    # chỉ dịch một chuyên mục (slug)
    python cong-cu/dich_litfl.py --lo gui                    # gửi cả lô (Batches API, rẻ hơn 50%, xong trong ≤24 giờ)
    python cong-cu/dich_litfl.py --lo nhan                   # nhận kết quả lô đã gửi

Bài dài được chia thành nhiều phần theo khối HTML; mỗi phần dịch riêng, ghép lại khi đủ.
Chạy lại lệnh bất kỳ lúc nào: phần đã dịch được giữ, chỉ dịch phần còn thiếu hoặc bài gốc đã sửa.
"""
import argparse
import glob
import os
import re
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from chung import KHO_DICH, KHO_GOC, dem_the, doc_json, ghi_json, nhom_khoi, tach_khoi  # noqa: E402

THU_MUC = os.path.dirname(os.path.abspath(__file__))
TAM = os.path.join(KHO_DICH, "_tam")
FILE_LO = os.path.join(KHO_DICH, "_lo.json")
FILE_NHAN = os.path.join(KHO_DICH, "_nhan.json")

MO_HINH = "claude-opus-5-5"
# Giá USD / 1 triệu token (vào, ra) theo bảng giá hiện hành; Batches API = 50%.
GIA = {
    "claude-opus-5-5": (4.0, 20.0),
    "claude-sonnet-5-5": (2.0, 10.0),
    "claude-haiku-5-5": (0.10, 0.50),
    "claude-fable-5-1": (10.0, 50.0),
}
# Mô hình nhận tham số dự phòng phía máy chủ khi bị từ chối (fallbacks: "default").
DU_PHONG = {"claude-opus-5-5", "claude-opus-5", "claude-sonnet-5-5", "claude-fable-5-1"}

khoa = threading.Lock()


class TuChoi(Exception):
    pass


class QuaDai(Exception):
    pass


# ---------- chuẩn bị ----------

def he_thong():
    with open(os.path.join(THU_MUC, "quy-uoc-dich.md"), encoding="utf-8") as f:
        quy_uoc = f.read()
    return [{
        "type": "text",
        "text": "Bạn là người dịch y khoa chuyên nghiệp Anh → Việt, dịch tài liệu học tập về cấp cứu và hồi sức "
                "(Life in the Fast Lane, LITFL) cho bác sĩ Việt Nam đọc cá nhân.\n\n" + quy_uoc,
        "cache_control": {"type": "ephemeral"},
    }]


def loi_nhac(tieu_de, html, k, n):
    dau = f'Bài: "{tieu_de}" — phần {k + 1}/{n}.\n'
    if k == 0:
        yeu_cau = ("Dịch tiêu đề và đoạn HTML dưới đây sang tiếng Việt theo quy ước. Trả lời đúng định dạng, không thêm gì khác:\n"
                   "<tieu_de>tiêu đề tiếng Việt</tieu_de>\n<noi_dung>\nHTML đã dịch\n</noi_dung>\n\n")
    else:
        yeu_cau = ("Dịch đoạn HTML dưới đây sang tiếng Việt theo quy ước. Trả lời đúng định dạng, không thêm gì khác:\n"
                   "<noi_dung>\nHTML đã dịch\n</noi_dung>\n\n")
    return dau + yeu_cau + "<html_goc>\n" + html + "\n</html_goc>"


def tham_so(args, tieu_de, html, k, n):
    p = {
        "model": args.mo_hinh,
        "max_tokens": 32000,
        "system": he_thong(),
        "messages": [{"role": "user", "content": loi_nhac(tieu_de, html, k, n)}],
        "output_config": {"effort": args.effort},
    }
    return p


def doc_ket_qua(van_ban, k):
    m = re.search(r"<noi_dung>\s*(.*?)\s*(?:</noi_dung>|$)", van_ban, re.S)
    noi_dung = m.group(1) if m else van_ban.strip()
    noi_dung = re.sub(r"^```(?:html)?\s*|\s*```$", "", noi_dung.strip())
    tieu_de = None
    if k == 0:
        t = re.search(r"<tieu_de>\s*(.*?)\s*</tieu_de>", van_ban, re.S)
        tieu_de = t.group(1).strip() if t else None
    return tieu_de, noi_dung


def bai_cho_dich(args):
    """Danh sách (bài gốc, các phần) cần dịch."""
    chuyen_muc = {}
    if args.chuyen_muc:
        for c in doc_json(os.path.join(KHO_GOC, "_categories.json"), []):
            chuyen_muc[c["slug"]] = c["id"]
        muon = {chuyen_muc[s] for s in args.chuyen_muc.split(",") if s in chuyen_muc}
        thieu = [s for s in args.chuyen_muc.split(",") if s not in chuyen_muc]
        if thieu:
            print("Không thấy chuyên mục:", ", ".join(thieu), "(xem slug trong kho/goc/_categories.json)")
    ket_qua = []
    for f in sorted(glob.glob(os.path.join(KHO_GOC, "[0-9]*.json")), key=lambda x: int(os.path.basename(x)[:-5])):
        goc = doc_json(f)
        if args.chuyen_muc and not (set(goc.get("categories", [])) & muon):
            continue
        if args.tim and not re.search(args.tim, goc["title"], re.I):
            continue
        da = doc_json(os.path.join(KHO_DICH, f"{goc['id']}.json"))
        if da and da.get("modified_goc") == goc.get("modified") and not args.dich_lai:
            continue
        phan = nhom_khoi(tach_khoi(goc["content"]), args.co_phan) or [""]
        tam = doc_json(os.path.join(TAM, f"{goc['id']}.json"))
        if not tam or tam.get("modified_goc") != goc.get("modified") or tam.get("so_phan") != len(phan) or args.dich_lai:
            tam = {"modified_goc": goc.get("modified"), "so_phan": len(phan), "phan": {}}
            ghi_json(os.path.join(TAM, f"{goc['id']}.json"), tam)
        ket_qua.append((goc, phan, tam))
        if args.toi_da and len(ket_qua) >= args.toi_da:
            break
    return ket_qua


# ---------- gọi API ----------

def tao_client():
    try:
        import anthropic
    except ImportError:
        sys.exit("Chưa cài thư viện: pip install anthropic")
    return anthropic.Anthropic(max_retries=6)


def goi_truc_tiep(client, args, p):
    if args.gia_lap:
        return gia_lap(p)
    them = {}
    if args.mo_hinh in DU_PHONG and not args.khong_du_phong:
        them = {"betas": ["server-side-fallback-2026-07-01"], "fallbacks": "default"}
    with client.beta.messages.stream(**p, **them) as s:
        msg = s.get_final_message()
    if msg.stop_reason == "refusal":
        raise TuChoi(getattr(msg, "stop_details", None))
    if msg.stop_reason == "max_tokens":
        raise QuaDai()
    return "".join(b.text for b in msg.content if b.type == "text"), msg.usage


def gia_lap(p):
    """Chế độ thử không gọi API: trả lại chính HTML gốc, tiêu đề gắn [VI]."""
    nd = p["messages"][0]["content"]
    html = re.search(r"<html_goc>\n(.*)\n</html_goc>", nd, re.S).group(1)
    td = re.search(r'Bài: "(.*)" — phần', nd).group(1)
    return f"<tieu_de>[VI] {td}</tieu_de>\n<noi_dung>\n{html}\n</noi_dung>", None


def dich_phan(client, args, goc, html, k, n):
    """Dịch một phần; nếu bản dịch vượt giới hạn đầu ra thì chia đôi phần đó."""
    try:
        van_ban, usage = goi_truc_tiep(client, args, tham_so(args, goc["title"], html, k, n))
        return doc_ket_qua(van_ban, k)
    except QuaDai:
        khoi = tach_khoi(html)
        if len(khoi) < 2:
            raise
        g = len(khoi) // 2
        t1, h1 = dich_phan(client, args, goc, "\n".join(khoi[:g]), k, n)
        _, h2 = dich_phan(client, args, goc, "\n".join(khoi[g:]), max(k, 1), n)
        return t1, h1 + "\n" + h2


def luu_phan(goc, k, tieu_de, noi_dung):
    with khoa:
        duong = os.path.join(TAM, f"{goc['id']}.json")
        tam = doc_json(duong)
        tam["phan"][str(k)] = {"html": noi_dung, **({"tieu_de": tieu_de} if tieu_de else {})}
        ghi_json(duong, tam)
        return tam


def ghep_neu_du(goc, tam, mo_hinh):
    if len(tam["phan"]) < tam["so_phan"]:
        return False
    phan = [tam["phan"][str(i)] for i in range(tam["so_phan"])]
    html = "\n".join(p["html"] for p in phan)
    canh_bao = []
    a, b = dem_the(goc["content"]), dem_the(html)
    for t in a:
        if a[t] != b[t]:
            canh_bao.append(f"{t}: gốc {a[t]}, dịch {b[t]}")
    ghi_json(os.path.join(KHO_DICH, f"{goc['id']}.json"), {
        "id": goc["id"],
        "modified_goc": goc.get("modified"),
        "tieu_de": phan[0].get("tieu_de") or goc["title"],
        "html": html,
        "mo_hinh": mo_hinh,
        "ngay_dich": time.strftime("%Y-%m-%d"),
        "canh_bao": canh_bao,
    })
    os.remove(os.path.join(TAM, f"{goc['id']}.json"))
    if canh_bao:
        print(f"  ! {goc['title']}: số thẻ lệch ({'; '.join(canh_bao)}) — nên xem lại")
    return True


def chay_truc_tiep(args, ds):
    client = None if args.gia_lap else tao_client()
    viec = [(goc, phan, k) for goc, phan, tam in ds for k in range(len(phan)) if str(k) not in tam["phan"]]
    print(f"Dịch trực tiếp {len(viec)} phần của {len(ds)} bài, {args.luong} luồng song song, mô hình {args.mo_hinh}.")
    xong_bai, loi = 0, 0
    with ThreadPoolExecutor(max_workers=args.luong) as ex:
        tuong_lai = {ex.submit(dich_phan, client, args, goc, phan[k], k, len(phan)): (goc, k) for goc, phan, k in viec}
        for f in as_completed(tuong_lai):
            goc, k = tuong_lai[f]
            try:
                tieu_de, noi_dung = f.result()
            except TuChoi as e:
                loi += 1
                print(f"  × Bị từ chối: {goc['title']} phần {k + 1} ({e})")
                continue
            except Exception as e:  # lỗi mạng/API sau khi SDK đã tự thử lại
                loi += 1
                print(f"  × Lỗi: {goc['title']} phần {k + 1}: {type(e).__name__}: {e}")
                continue
            tam = luu_phan(goc, k, tieu_de, noi_dung)
            with khoa:
                if ghep_neu_du(goc, tam, args.mo_hinh):
                    xong_bai += 1
                    print(f"  ✓ {xong_bai}. {goc['title']}")
    print(f"Xong {xong_bai} bài. Lỗi {loi} phần (chạy lại lệnh để thử lại).")


# ---------- Batches API ----------

def gui_lo(args, ds):
    client = tao_client()
    yeu_cau, ban_do = [], {}
    for goc, phan, tam in ds:
        for k, html in enumerate(phan):
            if str(k) in tam["phan"]:
                continue
            ma = f"b{goc['id']}-p{k}"
            yeu_cau.append({"custom_id": ma, "params": tham_so(args, goc["title"], html, k, len(phan))})
    if not yeu_cau:
        print("Không còn phần nào cần dịch.")
        return
    lo = doc_json(FILE_LO, [])
    co = 5000
    for i in range(0, len(yeu_cau), co):
        b = client.messages.batches.create(requests=yeu_cau[i:i + co])
        lo.append({"id": b.id, "ngay": time.strftime("%Y-%m-%d %H:%M"), "so": len(yeu_cau[i:i + co]),
                   "mo_hinh": args.mo_hinh, "da_nhan": False})
        ghi_json(FILE_LO, lo)
        print(f"Đã gửi lô {b.id}: {len(yeu_cau[i:i + co])} phần")
    print("Lô thường xong trong vòng 1 giờ (tối đa 24 giờ). Sau đó chạy: python cong-cu/dich_litfl.py --lo nhan")


def nhan_lo(args):
    client = tao_client()
    lo = doc_json(FILE_LO, [])
    for b in lo:
        if b["da_nhan"]:
            continue
        tt = client.messages.batches.retrieve(b["id"])
        if tt.processing_status != "ended":
            c = tt.request_counts
            print(f"Lô {b['id']}: đang xử lý ({c.processing} chờ, {c.succeeded} xong)")
            continue
        ok, hong = 0, 0
        for r in client.messages.batches.results(b["id"]):
            m = re.match(r"b(\d+)-p(\d+)$", r.custom_id)
            goc = doc_json(os.path.join(KHO_GOC, f"{m.group(1)}.json"))
            k = int(m.group(2))
            if r.result.type != "succeeded" or r.result.message.stop_reason in ("refusal", "max_tokens"):
                hong += 1
                continue
            tam = doc_json(os.path.join(TAM, f"{goc['id']}.json"))
            if not tam or tam.get("modified_goc") != goc.get("modified"):
                continue   # bài gốc đã đổi sau khi gửi lô
            van_ban = "".join(x.text for x in r.result.message.content if x.type == "text")
            tieu_de, noi_dung = doc_ket_qua(van_ban, k)
            tam = luu_phan(goc, k, tieu_de, noi_dung)
            ghep_neu_du(goc, tam, b["mo_hinh"])
            ok += 1
        b["da_nhan"] = True
        ghi_json(FILE_LO, lo)
        print(f"Lô {b['id']}: nhận {ok} phần; {hong} phần lỗi/bị từ chối/quá dài "
              f"— chạy lệnh dịch trực tiếp để dịch nốt các phần này.")


# ---------- tên chuyên mục và thẻ ----------

def dich_nhan(args):
    nhan = doc_json(FILE_NHAN, {})
    can = []
    for loai in ("categories", "tags"):
        for x in doc_json(os.path.join(KHO_GOC, f"_{loai}.json"), []):
            if x["name"] not in nhan:
                can.append(x["name"])
    for f in glob.glob(os.path.join(KHO_GOC, "[0-9]*.json")):
        for ten in doc_json(f).get("category_names", []):
            if ten not in nhan and ten not in can:
                can.append(ten)
    if not can:
        return
    print(f"Dịch {len(can)} tên chuyên mục/thẻ…")
    client = None if args.gia_lap else tao_client()
    for i in range(0, len(can), 150):
        nhom = can[i:i + 150]
        if args.gia_lap:
            nhan.update({t: t for t in nhom})
            ghi_json(FILE_NHAN, nhan)
            continue
        p = {
            "model": args.mo_hinh, "max_tokens": 16000, "system": he_thong(),
            "output_config": {"effort": args.effort},
            "messages": [{"role": "user", "content":
                          "Dịch các tên chuyên mục/thẻ sau sang tiếng Việt ngắn gọn (tên người, eponym, viết tắt giữ nguyên). "
                          "Mỗi dòng trả lời đúng dạng: số thứ tự<TAB>bản dịch. Không thêm gì khác.\n\n"
                          + "\n".join(f"{j}\t{t}" for j, t in enumerate(nhom))}],
        }
        van_ban, _ = goi_truc_tiep(client, args, p)
        for dong in van_ban.splitlines():
            m = re.match(r"\s*(\d+)\t(.+)", dong)
            if m and int(m.group(1)) < len(nhom):
                nhan[nhom[int(m.group(1))]] = m.group(2).strip()
        ghi_json(FILE_NHAN, nhan)


# ---------- ước tính ----------

def uoc_tinh(args, ds):
    ky_tu = sum(len(phan[k]) for goc, phan, tam in ds for k in range(len(phan)) if str(k) not in tam["phan"])
    so_phan = sum(len(phan) - len(tam["phan"]) for goc, phan, tam in ds)
    vao = ky_tu / 3.2 + so_phan * 1500        # HTML tiếng Anh ~3,2 ký tự/token + phần hệ thống
    ra = ky_tu / 3.2 * 1.6                    # tiếng Việt tốn token hơn tiếng Anh
    print(f"Chờ dịch: {len(ds)} bài, {so_phan} phần, {ky_tu / 1e6:.1f} triệu ký tự HTML.")
    print(f"Ước lượng thô: ~{vao / 1e6:.1f} triệu token vào, ~{ra / 1e6:.1f} triệu token ra (chưa tính token suy nghĩ).")
    for m, (gv, gr) in GIA.items():
        tien = vao / 1e6 * gv + ra / 1e6 * gr
        print(f"  {m:20s} trực tiếp ≈ ${tien:,.0f}   lô (Batches) ≈ ${tien / 2:,.0f}")
    print("Đây là con số ước lượng; dịch thử vài bài rồi xem chi phí thật trong Claude Console.")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--mo-hinh", default=MO_HINH, help=f"mô hình Claude (mặc định {MO_HINH})")
    p.add_argument("--effort", default="medium", choices=["low", "medium", "high", "xhigh", "max"])
    p.add_argument("--luong", type=int, default=4, help="số phần dịch song song (chế độ trực tiếp)")
    p.add_argument("--co-phan", type=int, default=9000, help="số ký tự HTML tối đa mỗi phần")
    p.add_argument("--toi-da", type=int, default=0, help="chỉ dịch N bài")
    p.add_argument("--chuyen-muc", help="chỉ dịch các chuyên mục (slug, cách nhau dấu phẩy)")
    p.add_argument("--tim", help="chỉ dịch bài có tiêu đề khớp biểu thức này")
    p.add_argument("--dich-lai", action="store_true", help="dịch lại cả bài đã dịch")
    p.add_argument("--lo", choices=["gui", "nhan"], help="dùng Batches API: gửi lô / nhận kết quả")
    p.add_argument("--uoc-tinh", action="store_true", help="chỉ in số lượng và chi phí ước lượng")
    p.add_argument("--khong-du-phong", action="store_true", help="tắt dự phòng phía máy chủ khi bị từ chối")
    p.add_argument("--gia-lap", action="store_true", help="thử quy trình, không gọi API (giữ nguyên tiếng Anh)")
    args = p.parse_args()

    if not os.path.isdir(KHO_GOC):
        sys.exit("Chưa có kho/goc. Chạy trước: python cong-cu/tai_litfl.py")
    if args.lo == "nhan":
        nhan_lo(args)
        return
    ds = bai_cho_dich(args)
    if args.uoc_tinh:
        uoc_tinh(args, ds)
        return
    dich_nhan(args)
    if args.lo == "gui":
        gui_lo(args, ds)
    else:
        chay_truc_tiep(args, ds)


if __name__ == "__main__":
    main()

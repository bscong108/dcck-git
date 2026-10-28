"""Đóng gói kho/goc + kho/dich thành dữ liệu cho ứng dụng (thư mục data/).

    python cong-cu/dong_goi.py            # tạo data/muc-luc.json, data/bai/*.json, data/tv/*.json
    python cong-cu/dong_goi.py --tai-anh  # tải thêm ảnh về data/anh để đọc ngoại tuyến hoàn toàn

Bài chưa dịch vẫn được đưa vào (hiển thị bản tiếng Anh, có nhãn "chưa dịch").
"""
import argparse
import glob
import hashlib
import os
import re
import shutil
import sys
import time
import urllib.parse
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from chung import DATA, KHO_DICH, KHO_GOC, doc_json, ghi_json, tach_khoi, van_ban  # noqa: E402

UA = "LITFL-VI-personal-study/1.0"


def danh_so_khoi(html):
    """Gắn data-k vào từng khối cấp cao nhất để ứng dụng khớp bản dịch với bản gốc."""
    ra = []
    for i, k in enumerate(tach_khoi(html)):
        if k.startswith("<") and not k.startswith("</"):
            k = re.sub(r"^<([a-zA-Z0-9]+)", lambda m: f'<{m.group(1)} data-k="{i}"', k, count=1)
        else:
            k = f'<p data-k="{i}">{k}</p>'
        ra.append(k)
    return "\n".join(ra), len(ra)


def tai_anh(html, thu_muc_anh, da_tai):
    def doi(m):
        url = m.group(2)
        if not url.startswith("http"):
            return m.group(0)
        if url not in da_tai:
            duoi = os.path.splitext(urllib.parse.urlparse(url).path)[1].lower()[:5] or ".img"
            ten = hashlib.sha1(url.encode()).hexdigest()[:16] + duoi
            duong = os.path.join(thu_muc_anh, ten)
            if not os.path.exists(duong):
                try:
                    req = urllib.request.Request(url, headers={"User-Agent": UA})
                    with urllib.request.urlopen(req, timeout=60) as r, open(duong, "wb") as f:
                        shutil.copyfileobj(r, f)
                    time.sleep(0.3)
                except Exception as e:
                    print(f"  không tải được ảnh {url}: {e}")
                    return m.group(0)
            da_tai[url] = "data/anh/" + ten
        return f'{m.group(1)}"{da_tai[url]}"'
    html = re.sub(r'\s(srcset|sizes)="[^"]*"', "", html)
    return re.sub(r'(<img[^>]*?\ssrc=)"([^"]+)"', doi, html)


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--tai-anh", action="store_true", help="tải ảnh về máy (đọc ngoại tuyến cả hình ECG)")
    p.add_argument("--chi-ban-dich", action="store_true", help="chỉ đưa vào các bài đã dịch")
    args = p.parse_args()

    if not os.path.isdir(KHO_GOC):
        sys.exit("Chưa có kho/goc. Chạy trước: python cong-cu/tai_litfl.py")
    nhan_vi = doc_json(os.path.join(KHO_DICH, "_nhan.json"), {})
    cats = {c["id"]: c for c in doc_json(os.path.join(KHO_GOC, "_categories.json"), [])}
    tags = {t["id"]: t for t in doc_json(os.path.join(KHO_GOC, "_tags.json"), [])}
    ten_sang_id = {c["name"]: c["id"] for c in cats.values()}

    thu_muc_bai = os.path.join(DATA, "bai")
    thu_muc_anh = os.path.join(DATA, "anh")
    shutil.rmtree(thu_muc_bai, ignore_errors=True)
    shutil.rmtree(os.path.join(DATA, "tv"), ignore_errors=True)
    os.makedirs(thu_muc_bai)
    if args.tai_anh:
        os.makedirs(thu_muc_anh, exist_ok=True)
    da_tai_anh = doc_json(os.path.join(DATA, "anh", "_ban-do.json"), {}) if args.tai_anh else {}

    ds, toan_van, dem_cat, dem_tag = [], [], {}, {}
    files = sorted(glob.glob(os.path.join(KHO_GOC, "[0-9]*.json")))
    for f in files:
        goc = doc_json(f)
        dich = doc_json(os.path.join(KHO_DICH, f"{goc['id']}.json"))
        if dich and dich.get("modified_goc") != goc.get("modified"):
            dich_cu = True     # bản dịch của phiên bản cũ: vẫn dùng, đánh dấu
        else:
            dich_cu = False
        if args.chi_ban_dich and not dich:
            continue
        cat_ids = list(goc.get("categories", []))
        for ten in goc.get("category_names", []):      # bài tải theo chế độ HTML
            if ten not in ten_sang_id:
                moi = -(len(ten_sang_id) + 1)
                ten_sang_id[ten] = moi
                cats[moi] = {"id": moi, "name": ten, "slug": re.sub(r"\W+", "-", ten.lower()).strip("-"), "parent": 0}
            cat_ids.append(ten_sang_id[ten])
        for c in cat_ids:
            dem_cat[c] = dem_cat.get(c, 0) + 1
        for t in goc.get("tags", []):
            dem_tag[t] = dem_tag.get(t, 0) + 1

        en, so_en = danh_so_khoi(goc["content"])
        vi, so_vi = danh_so_khoi(dich["html"]) if dich else ("", 0)
        if args.tai_anh:
            en = tai_anh(en, thu_muc_anh, da_tai_anh)
            vi = tai_anh(vi, thu_muc_anh, da_tai_anh) if vi else vi
        tieu_de_vi = dich["tieu_de"] if dich else ""
        ghi_json(os.path.join(thu_muc_bai, f"{goc['id']}.json"), {
            "id": goc["id"], "slug": goc["slug"], "url": goc["link"],
            "te": goc["title"], "tv": tieu_de_vi,
            "en": en, "vi": vi, "khop": bool(vi) and so_en == so_vi,
            "m": (goc.get("modified") or "")[:10], "dich_cu": dich_cu,
            "canh_bao": (dich or {}).get("canh_bao", []),
        }, gon=True)
        tom_tat = van_ban(vi or en)[:180]
        ds.append({
            "id": goc["id"], "s": goc["slug"], "t": tieu_de_vi or goc["title"], "te": goc["title"],
            "c": cat_ids, "g": goc.get("tags", []), "m": (goc.get("modified") or "")[:10],
            "d": 1 if dich else 0, "x": tom_tat, "k": goc.get("type", "post"),
        })
        toan_van.append([goc["id"], van_ban(vi)[:20000] if vi else "", van_ban(en)[:20000]])

    ds.sort(key=lambda b: b["te"].lower())
    chuyen_muc = [{"id": c["id"], "s": c["slug"], "en": c["name"], "vi": nhan_vi.get(c["name"], ""),
                   "cha": c.get("parent", 0), "n": dem_cat.get(c["id"], 0)}
                  for c in cats.values() if dem_cat.get(c["id"])]
    chuyen_muc.sort(key=lambda c: -c["n"])
    the = {t["id"]: [t["name"], nhan_vi.get(t["name"], "")] for t in tags.values() if dem_tag.get(t["id"])}

    # toàn văn chia nhóm 300 bài để tải dần khi cần tìm trong nội dung
    for i in range(0, len(toan_van), 300):
        ghi_json(os.path.join(DATA, "tv", f"{i // 300}.json"), toan_van[i:i + 300], gon=True)

    ghi_json(os.path.join(DATA, "muc-luc.json"), {
        "phien_ban": time.strftime("%Y%m%d%H%M%S"),
        "ngay": time.strftime("%Y-%m-%d"),
        "so_bai": len(ds), "so_da_dich": sum(b["d"] for b in ds),
        "so_tv": (len(toan_van) + 299) // 300,
        "chuyen_muc": chuyen_muc, "the": the, "bai": ds,
    }, gon=True)
    if args.tai_anh:
        ghi_json(os.path.join(thu_muc_anh, "_ban-do.json"), da_tai_anh)
    print(f"Đã đóng gói {len(ds)} bài ({sum(b['d'] for b in ds)} đã dịch), {len(chuyen_muc)} chuyên mục → {DATA}")


if __name__ == "__main__":
    main()

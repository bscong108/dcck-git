#!/usr/bin/env python3
"""Đóng gói nội dung ĐCCK thành data/noi-dung.js để ứng dụng học đọc được (mở index.html, không cần máy chủ).

Cách dùng:
    python cong-cu/dong_goi.py                      # quét thư mục mặc định + thư mục trong cong-cu/cau-hinh.json
    python cong-cu/dong_goi.py "G:/Cowork/ĐCCK"     # quét thư mục chỉ định (có thể nhiều thư mục)

Quét đệ quy, nhận các file:
    MUC-LUC-9-CUON.md, PHUONG-PHAP-HOC.md
    <MÃ>_bai.md, <MÃ>_Handout.html, <MÃ>_anki.apkg   (MÃ dạng YC-01, ECG-12, HD-04...)
Trùng mã thì lấy file sửa gần nhất.

Thư mục mặc định (thiếu thì bỏ qua): noi-dung/, G:/Cowork/ĐCCK, thư mục ĐCCK nằm cạnh thư mục ứng dụng.
cong-cu/cau-hinh.json là cấu hình riêng của máy, không có trong file ZIP nên không bị ghi đè khi cập nhật.
Bài có ở lần đóng gói trước mà lần này không tìm thấy (ví dụ ổ G chưa cắm) vẫn được giữ lại.
"""
import json
import os
import re
import sqlite3
import sys
import tempfile
import zipfile
from datetime import datetime

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CAU_HINH = os.path.join(GOC, "cong-cu", "cau-hinh.json")
NGUON_MAC_DINH = ["noi-dung", "G:/Cowork/ĐCCK", "G:/Cowork/DCCK", "../ĐCCK", "../DCCK"]
DAU_RA = os.path.join(GOC, "data", "noi-dung.js")

MAU_FILE = re.compile(r"^([A-Z]{2,4}-\d{2,3})_(bai\.md|handout\.html|anki\.apkg)$", re.IGNORECASE)
LOAI = {"bai.md": "md", "handout.html": "handout", "anki.apkg": "anki"}
BO_QUA_THU_MUC = {".git", "node_modules", "__pycache__", "app", "data"}


def doc_cau_hinh():
    nguon = list(NGUON_MAC_DINH)
    if os.path.exists(CAU_HINH):
        try:
            with open(CAU_HINH, encoding="utf-8-sig") as f:
                them = json.load(f).get("nguon", [])
        except Exception as e:
            print(f"  ! Không đọc được {CAU_HINH}: {e} — dùng thư mục mặc định")
            them = []
        for t in them:
            if t not in nguon:
                nguon.append(t)
    else:
        with open(CAU_HINH, "w", encoding="utf-8") as f:
            json.dump({"_ghi_chu": "Thêm thư mục chứa bài do Cowork tạo vào danh sách nguon, dùng dấu / (ví dụ \"D:/TaiLieu/ĐCCK\"). File này không bị ghi đè khi cập nhật chương trình.",
                       "nguon": []}, f, ensure_ascii=False, indent=2)
    return nguon


def doc_goi_cu():
    if not os.path.exists(DAU_RA):
        return {}
    try:
        with open(DAU_RA, encoding="utf-8") as f:
            t = f.read()
        return json.loads(t[t.index("=") + 1:].split(";\n")[0].strip()).get("bai", {})
    except Exception:
        return {}


def doc_anki(duong_dan):
    """Trả về danh sách note: {guid, loai, truong[], the[]}."""
    with zipfile.ZipFile(duong_dan) as z:
        ten = set(z.namelist())
        if "collection.anki21" in ten:
            muc = "collection.anki21"
        elif "collection.anki2" in ten:
            muc = "collection.anki2"
        else:
            raise ValueError("apkg định dạng mới (anki21b), hãy xuất lại bằng 'Support older Anki versions'")
        du_lieu = z.read(muc)
    with tempfile.NamedTemporaryFile(suffix=".sqlite", delete=False) as t:
        t.write(du_lieu)
        tam = t.name
    try:
        c = sqlite3.connect(tam)
        mo_hinh = {}
        try:
            models = json.loads(c.execute("select models from col").fetchone()[0] or "{}")
            for mid, m in models.items():
                mo_hinh[int(mid)] = {"ten": m.get("name", ""), "cloze": m.get("type") == 1,
                                     "truong": [f["name"] for f in m.get("flds", [])]}
        except Exception:
            pass
        notes = []
        for guid, mid, tags, flds in c.execute("select guid, mid, tags, flds from notes order by id"):
            m = mo_hinh.get(mid, {})
            truong = flds.split("\x1f")
            cloze = m.get("cloze") if m else bool(re.search(r"\{\{c\d+::", truong[0]))
            notes.append({"guid": guid, "loai": "cloze" if cloze else "hoi-dap",
                          "tenTruong": m.get("truong", []), "truong": truong, "the": tags.split()})
        c.close()
        return notes
    finally:
        os.unlink(tam)


def quet(thu_muc_list):
    tim = {}       # (mã, loại) -> (mtime, path)
    chung = {}     # mucLuc / phuongPhap -> (mtime, path)
    for td in thu_muc_list:
        td = td if os.path.isabs(td) else os.path.join(GOC, td)
        td = os.path.normpath(td)
        if not os.path.isdir(td):
            print(f"  - Bỏ qua (không có trên máy này): {td}")
            continue
        print(f"  + Quét: {td}")
        for goc, dirs, files in os.walk(td):
            dirs[:] = [d for d in dirs if d not in BO_QUA_THU_MUC]
            for fn in files:
                p = os.path.join(goc, fn)
                mt = os.path.getmtime(p)
                khoa = None
                if fn.upper() == "MUC-LUC-9-CUON.MD":
                    khoa = "mucLuc"
                elif fn.upper() == "PHUONG-PHAP-HOC.MD":
                    khoa = "phuongPhap"
                if khoa:
                    if khoa not in chung or chung[khoa][0] < mt:
                        chung[khoa] = (mt, p)
                    continue
                m = MAU_FILE.match(fn)
                if not m:
                    continue
                k = (m.group(1).upper(), LOAI[m.group(2).lower()])
                if k not in tim or tim[k][0] < mt:
                    tim[k] = (mt, p)
    return chung, tim


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
    nguon = sys.argv[1:] or doc_cau_hinh()
    goi_cu = doc_goi_cu()
    chung, tim = quet(nguon)
    ket_qua = {"taoLuc": datetime.now().isoformat(timespec="seconds"), "bai": {}}
    for khoa, (_, p) in chung.items():
        with open(p, encoding="utf-8") as f:
            ket_qua[khoa] = f.read()
    for (ma, loai), (mt, p) in sorted(tim.items()):
        b = ket_qua["bai"].setdefault(ma, {})
        try:
            if loai == "anki":
                b["anki"] = doc_anki(p)
            else:
                with open(p, encoding="utf-8") as f:
                    b[loai] = f.read()
            b.setdefault("capNhat", {})[loai] = datetime.fromtimestamp(mt).isoformat(timespec="seconds")
        except Exception as e:
            print(f"  ! Lỗi đọc {p}: {e}")
    giu = sorted(set(goi_cu) - set(ket_qua["bai"]))
    for ma in giu:
        ket_qua["bai"][ma] = goi_cu[ma]
    if giu:
        print(f"  Giữ lại {len(giu)} bài từ lần đóng gói trước (lần này không tìm thấy file): {', '.join(giu)}")
    os.makedirs(os.path.dirname(DAU_RA), exist_ok=True)
    with open(DAU_RA, "w", encoding="utf-8") as f:
        f.write("/* Tạo tự động bởi cong-cu/dong_goi.py — không sửa tay. */\n")
        f.write("window.DCCK_NOI_DUNG = ")
        json.dump(ket_qua, f, ensure_ascii=False)
        f.write(";\n")
    print(f"Mục lục: {'có' if 'mucLuc' in ket_qua else 'KHÔNG CÓ'} · Phương pháp: {'có' if 'phuongPhap' in ket_qua else 'không'}")
    for ma, b in ket_qua["bai"].items():
        phan = [k for k in ("md", "handout", "anki") if k in b]
        so_the = len(b.get("anki", []))
        print(f"  {ma}: {', '.join(phan)}" + (f" ({so_the} note Anki)" if so_the else ""))
    print(f"Đã ghi {os.path.relpath(DAU_RA, GOC)} — {len(ket_qua['bai'])} bài.")
    if len(ket_qua["bai"]) <= 1:
        print("  ! Chỉ có bài mẫu. Nếu bài Cowork nằm ở thư mục khác G:/Cowork/ĐCCK, mở cong-cu/cau-hinh.json và thêm đường dẫn vào \"nguon\".")


if __name__ == "__main__":
    main()

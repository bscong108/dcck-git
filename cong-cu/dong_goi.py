#!/usr/bin/env python3
"""Đóng gói nội dung ĐCCK thành data/noi-dung.js để ứng dụng học đọc được (mở index.html, không cần máy chủ).

Cách dùng:
    python cong-cu/dong_goi.py                      # quét thư mục trong cong-cu/cau-hinh.json (mặc định: noi-dung/)
    python cong-cu/dong_goi.py "G:/Cowork/ĐCCK"     # quét thư mục chỉ định (có thể nhiều thư mục)

Quét đệ quy, nhận các file:
    MUC-LUC-9-CUON.md, PHUONG-PHAP-HOC.md
    <MÃ>_bai.md, <MÃ>_Handout.html, <MÃ>_anki.apkg   (MÃ dạng YC-01, ECG-12, HD-04...)
Trùng mã thì lấy file sửa gần nhất.
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
DAU_RA = os.path.join(GOC, "data", "noi-dung.js")

MAU_FILE = re.compile(r"^([A-Z]{2,4}-\d{2,3})_(bai\.md|handout\.html|anki\.apkg)$", re.IGNORECASE)
LOAI = {"bai.md": "md", "handout.html": "handout", "anki.apkg": "anki"}
BO_QUA_THU_MUC = {".git", "node_modules", "__pycache__", "app", "data"}


def doc_cau_hinh():
    if os.path.exists(CAU_HINH):
        with open(CAU_HINH, encoding="utf-8") as f:
            return json.load(f).get("nguon", ["noi-dung"])
    return ["noi-dung"]


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
        if not os.path.isdir(td):
            print(f"  ! Không thấy thư mục: {td}")
            continue
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
    nguon = sys.argv[1:] or doc_cau_hinh()
    print("Quét:", ", ".join(nguon))
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


if __name__ == "__main__":
    main()

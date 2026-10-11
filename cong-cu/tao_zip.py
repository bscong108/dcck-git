#!/usr/bin/env python3
"""Tạo DCCK-Hoc.zip để gửi/cập nhật. KHÔNG đưa vào ZIP cấu hình riêng của máy (cong-cu/cau-hinh.json)
và nội dung đã đóng gói (data/noi-dung.js), để giải nén đè không làm mất bài và đường dẫn đã cài."""
import os
import zipfile

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DUA_VAO = ["index.html", "app", "data", "noi-dung", "cong-cu", "cap-nhat-noi-dung.bat", "README.md", "HUONG-DAN-SU-DUNG.md"]
BO_QUA = {os.path.join("cong-cu", "cau-hinh.json"), os.path.join("data", "noi-dung.js")}

with zipfile.ZipFile(os.path.join(GOC, "DCCK-Hoc.zip"), "w", zipfile.ZIP_DEFLATED) as z:
    for muc in DUA_VAO:
        p = os.path.join(GOC, muc)
        tep = [p] if os.path.isfile(p) else [os.path.join(r, f) for r, d, fs in os.walk(p) if "__pycache__" not in r for f in fs]
        for f in tep:
            rel = os.path.relpath(f, GOC)
            if rel in BO_QUA:
                continue
            z.write(f, os.path.join("DCCK-Hoc", rel))
print("Đã tạo DCCK-Hoc.zip")

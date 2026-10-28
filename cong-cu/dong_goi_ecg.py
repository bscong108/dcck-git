#!/usr/bin/env python3
"""Gộp ứng dụng ECG Cấp cứu (ecg/) thành MỘT file HTML để mở trên điện thoại hoặc đăng bản trực tuyến.

    python cong-cu/dong_goi_ecg.py   # -> ban-truc-tuyen/ecg-cap-cuu.html
"""
import os
import re

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
THU_MUC = os.path.join(GOC, "ecg")
DAU_RA = os.path.join(GOC, "ban-truc-tuyen", "ecg-cap-cuu.html")


def doc(p):
    with open(os.path.join(THU_MUC, p), encoding="utf-8") as f:
        return f.read()


def main():
    html = doc("index.html")
    css = doc("css/ecg.css")
    html = html.replace('<link rel="stylesheet" href="css/ecg.css">', "<style>\n" + css + "\n</style>")
    def nhung_js(m):
        js = doc(m.group(1)).replace("</script", "<\\/script")
        return "<script>\n" + js + "\n</script>"
    html = re.sub(r'<script src="([^"]+)"></script>', nhung_js, html)
    os.makedirs(os.path.dirname(DAU_RA), exist_ok=True)
    with open(DAU_RA, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Đã ghi {os.path.relpath(DAU_RA, GOC)} ({len(html.encode('utf-8')) // 1024} KB)")


if __name__ == "__main__":
    main()

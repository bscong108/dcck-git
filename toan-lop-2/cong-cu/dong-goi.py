#!/usr/bin/env python3
"""Đóng gói Đảo Toán Lớp 2 thành MỘT file HTML (gộp CSS, JS và bài của cô).

Dùng khi muốn chép ứng dụng sang máy tính bảng / điện thoại: chỉ cần gửi một file.
Chạy:  python cong-cu/dong-goi.py                 → tạo Dao-Toan-Lop-2.html
       python cong-cu/dong-goi.py --artifact x.html → bản không có thẻ <html>/<head> (để đăng lên claude.ai)
"""
import re
import sys
from pathlib import Path

GOC = Path(__file__).resolve().parent.parent


def doc(p):
    return (GOC / p).read_text(encoding="utf-8")


def dong_goi(artifact=False):
    html = doc("index.html")

    def thay_css(m):
        return "<style>\n" + doc(m.group(1)) + "\n</style>"

    def thay_js(m):
        ma = doc(m.group(1)).replace("</script", "<\\/script")
        return "<script>\n/* ---- " + m.group(1) + " ---- */\n" + ma + "\n</script>"

    html = re.sub(r'<link rel="stylesheet" href="(css/[^"]+)">', thay_css, html)
    html = re.sub(r'<script src="([^"]+)"></script>', thay_js, html)
    if artifact:
        # Trang được bọc sẵn khung <html><head><body> khi đăng: giữ lại title, link font, style và phần thân.
        dau = re.search(r"<head>(.*?)</head>", html, re.S).group(1)
        than = re.search(r"<body>(.*)</body>", html, re.S).group(1)
        dau = re.sub(r'<meta charset[^>]*>\s*|<meta name="viewport"[^>]*>\s*', "", dau)
        html = dau.strip() + "\n" + than.strip() + "\n"
    return html


def main():
    if len(sys.argv) >= 3 and sys.argv[1] == "--artifact":
        Path(sys.argv[2]).write_text(dong_goi(True), encoding="utf-8")
        print("Đã tạo", sys.argv[2])
        return
    ra = GOC / "Dao-Toan-Lop-2.html"
    ra.write_text(dong_goi(False), encoding="utf-8")
    print(f"Đã tạo {ra.name} ({ra.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()

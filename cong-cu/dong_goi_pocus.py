#!/usr/bin/env python3
"""Gộp ứng dụng POCUS (HTML + CSS + JS + nội dung) thành MỘT file để mở trên mọi thiết bị hoặc đăng bản trực tuyến.

    python cong-cu/dong_goi_pocus.py   # -> ban-truc-tuyen/pocus-cap-cuu.html
"""
import os
import re

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POCUS = os.path.join(GOC, "pocus")
DAU_RA = os.path.join(GOC, "ban-truc-tuyen", "pocus-cap-cuu.html")


def doc(p):
    with open(os.path.join(POCUS, p), encoding="utf-8") as f:
        return f.read()


def main():
    html = doc("index.html")
    head = re.search(r"<head>(.*?)</head>", html, re.S).group(1)
    body = re.search(r"<body>(.*?)</body>", html, re.S).group(1)
    giu = "\n".join(re.findall(r"<title>.*?</title>|<meta name=\"claude:[^>]*>|<link rel=\"(?:icon|preconnect)\"[^>]*>|<link rel=\"stylesheet\" href=\"https://[^>]*>", head))
    css = doc("pocus.css")

    def nhung_js(m):
        return "<script>\n" + doc(m.group(1)).replace("</script", "<\\/script") + "\n</script>"

    body = re.sub(r'<script src="([^"]+)"></script>', nhung_js, body)
    out = giu + "\n<style>\n" + css + "\n</style>\n" + body.strip() + "\n"
    os.makedirs(os.path.dirname(DAU_RA), exist_ok=True)
    with open(DAU_RA, "w", encoding="utf-8") as f:
        f.write(out)
    print(f"Đã ghi {os.path.relpath(DAU_RA, GOC)} ({len(out.encode('utf-8')) // 1024} KB)")


if __name__ == "__main__":
    main()

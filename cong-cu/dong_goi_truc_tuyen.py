#!/usr/bin/env python3
"""Gộp ứng dụng (HTML + CSS + JS + nội dung) thành MỘT file để đăng bản trực tuyến trên claude.ai.

    python cong-cu/dong_goi.py              # đóng gói nội dung trước
    python cong-cu/dong_goi_truc_tuyen.py   # -> ban-truc-tuyen/dcck-hoc.html
"""
import os
import re

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DAU_RA = os.path.join(GOC, "ban-truc-tuyen", "dcck-hoc.html")


def doc(p):
    with open(os.path.join(GOC, p), encoding="utf-8") as f:
        return f.read()


def main():
    html = doc("index.html")
    head = re.search(r"<head>(.*?)</head>", html, re.S).group(1)
    body = re.search(r"<body>(.*?)</body>", html, re.S).group(1)
    title = re.search(r"<title>.*?</title>", head, re.S).group(0)
    css = doc("app/style.css")
    def nhung_js(m):
        js = doc(m.group(1)).replace("</script", "<\\/script")
        return "<script>\n" + js + "\n</script>"
    body = re.sub(r'<script src="([^"]+)"></script>', nhung_js, body)
    out = title + "\n<style>\n" + css + "\n</style>\n" + body.strip() + "\n"
    os.makedirs(os.path.dirname(DAU_RA), exist_ok=True)
    with open(DAU_RA, "w", encoding="utf-8") as f:
        f.write(out)
    print(f"Đã ghi {os.path.relpath(DAU_RA, GOC)} ({len(out.encode('utf-8')) // 1024} KB)")


if __name__ == "__main__":
    main()

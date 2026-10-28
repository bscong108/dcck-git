"""Mở ứng dụng LITFL VI trên máy: chạy máy chủ web nhỏ rồi mở trình duyệt.

    python cong-cu/chay.py              # http://localhost:8080 (chỉ máy này truy cập)
    python cong-cu/chay.py --cong 9000

Mở bằng localhost thì trình duyệt cho phép cài ứng dụng (PWA) và đọc ngoại tuyến.
"""
import argparse
import functools
import http.server
import os
import threading
import webbrowser

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class XuLy(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map,
                      ".webmanifest": "application/manifest+json", ".json": "application/json", ".js": "text/javascript"}

    def end_headers(self):
        if self.path.split("?")[0].endswith(("sw.js", ".html", "/")):
            self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def log_message(self, *a):
        pass


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--cong", type=int, default=8080)
    p.add_argument("--khong-mo", action="store_true", help="không tự mở trình duyệt")
    p.add_argument("--mang-noi-bo", action="store_true", help="cho máy khác cùng Wi-Fi (điện thoại) truy cập")
    a = p.parse_args()
    may = http.server.ThreadingHTTPServer(("0.0.0.0" if a.mang_noi_bo else "127.0.0.1", a.cong), functools.partial(XuLy, directory=GOC))
    url = f"http://localhost:{a.cong}/"
    print(f"LITFL VI đang chạy tại {url}  (Ctrl+C để dừng)")
    if a.mang_noi_bo:
        print(f"Điện thoại cùng Wi-Fi: mở http://<địa chỉ IP của máy này>:{a.cong}/ (xem IP bằng lệnh ipconfig / ifconfig)")
    if not a.khong_mo:
        threading.Timer(0.5, lambda: webbrowser.open(url)).start()
    try:
        may.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()

"""Máy chủ giả lập WordPress REST API để kiểm thử công cụ (nội dung giả, không phải LITFL)."""
import json
import sys
import urllib.parse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

CATS = [{"id": 1, "name": "ECG Library", "slug": "ecg-library", "parent": 0, "count": 2},
        {"id": 2, "name": "Toxicology Library", "slug": "toxicology-library", "parent": 0, "count": 1}]
TAGS = [{"id": 10, "name": "Test tag", "slug": "test-tag", "parent": 0, "count": 1}]


def bai(i, slug, title, cats, body, mod="2026-01-01T00:00:00"):
    return {"id": i, "slug": slug, "link": f"https://litfl.com/{slug}/", "date_gmt": mod, "modified_gmt": mod,
            "type": "post", "title": {"rendered": title}, "content": {"rendered": body},
            "excerpt": {"rendered": "<p>Fixture</p>"}, "categories": cats, "tags": [10]}


POSTS = [
    bai(101, "fixture-alpha", "Fixture Alpha &#8211; test", [1],
        '<p>Paragraph one with <a href="https://litfl.com/fixture-beta/">link to beta</a>.</p>\n'
        '<h2>Heading</h2>\n<ul><li>item 1</li><li>item 2</li></ul>\n'
        '<figure><img src="data:image/gif;base64,R0lGOD" data-src="http://HOST/anh.png" alt="test image"></figure>\n'
        '<div class="sharedaddy">SHARE</div><script>bad()</script>\n'
        '<table><tr><td>a</td><td>b</td></tr></table>'),
    bai(102, "fixture-beta", "Fixture Beta", [1], "<p>" + "Long text block. " * 400 + "</p>\n" * 3),
    bai(103, "fixture-gamma", "Fixture Gamma", [2], "<p>Gamma body</p>"),
]


class H(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def do_GET(self):
        u = urllib.parse.urlparse(self.path)
        q = dict(urllib.parse.parse_qsl(u.query))
        host = self.headers["Host"]
        if u.path == "/anh.png":
            self.send_response(200); self.send_header("Content-Type", "image/png"); self.end_headers()
            self.wfile.write(b"\x89PNG\r\n\x1a\nfake"); return
        if u.path.endswith("/categories"):
            data = CATS
        elif u.path.endswith("/tags"):
            data = TAGS
        elif u.path.endswith("/posts"):
            data = [p for p in POSTS if p["modified_gmt"] > q.get("modified_after", "")]
            per = int(q.get("per_page", 100)); page = int(q.get("page", 1))
            tong = max(1, -(-len(data) // per))
            if page > tong:
                self.send_response(400); self.end_headers(); return
            data = data[(page - 1) * per: page * per]
        elif u.path.endswith("/pages"):
            data = []
        else:
            self.send_response(404); self.end_headers(); return
        body = json.dumps(data).replace("HOST", host).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("X-WP-TotalPages", "1")
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    ThreadingHTTPServer(("127.0.0.1", int(sys.argv[1])), H).serve_forever()

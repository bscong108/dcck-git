"""Tải nội dung LITFL (tiếng Anh) về kho/goc để dịch và đọc ngoại tuyến.

Chạy trên máy cá nhân, cần mạng:
    python cong-cu/tai_litfl.py                # tải mới / cập nhật bài đã sửa
    python cong-cu/tai_litfl.py --toi-da 50    # thử với 50 bài
    python cong-cu/tai_litfl.py --che-do html  # nếu REST API của trang bị tắt

Cách 1 (mặc định): WordPress REST API (/wp-json/wp/v2/...), lấy cả bài viết (posts) và trang (pages).
Cách 2 (--che-do html): đọc sitemap rồi tải từng trang HTML, cắt phần thân bài.
Tải chậm có chủ ý (mặc định 1 giây/lượt) để không làm phiền máy chủ.
"""
import argparse
import gzip
import hashlib
import html
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from chung import KHO_GOC, doc_json, ghi_json, tach_khoi  # noqa: E402

UA = "LITFL-VI-personal-study/1.0 (ban doc ca nhan, khong cong khai)"
TRUONG = "id,slug,link,date_gmt,modified_gmt,title,content,excerpt,categories,tags,type,parent"


class Tai:
    def __init__(self, goc, cho):
        self.goc = goc.rstrip("/")
        self.cho = cho
        self.lan_cuoi = 0.0

    def lay(self, url, thu=5):
        if not url.startswith("http"):
            url = self.goc + url
        for i in range(thu):
            nghi = self.cho - (time.time() - self.lan_cuoi)
            if nghi > 0:
                time.sleep(nghi)
            self.lan_cuoi = time.time()
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Encoding": "gzip"})
            try:
                with urllib.request.urlopen(req, timeout=60) as r:
                    du_lieu = r.read()
                    if r.headers.get("Content-Encoding") == "gzip":
                        du_lieu = gzip.decompress(du_lieu)
                    return du_lieu, r.headers
            except urllib.error.HTTPError as e:
                if e.code in (429, 500, 502, 503, 504) and i < thu - 1:
                    doi = int(e.headers.get("Retry-After") or 0) or 5 * 2 ** i
                    print(f"  HTTP {e.code}, chờ {doi}s rồi thử lại: {url}")
                    time.sleep(doi)
                    continue
                raise
            except (urllib.error.URLError, TimeoutError) as e:
                if i < thu - 1:
                    print(f"  Lỗi mạng ({e}), thử lại sau {5 * 2 ** i}s")
                    time.sleep(5 * 2 ** i)
                    continue
                raise

    def lay_json(self, url):
        du_lieu, headers = self.lay(url)
        return json.loads(du_lieu.decode("utf-8")), headers


# ---------- làm sạch thân bài ----------

LOP_BO = re.compile(r"sharedaddy|jp-relatedposts|share-|social|addtoany|wpcnt|code-block|adsbygoogle|"
                    r"wp-block-buttons|post-navigation|comments?-area|ninja-forms|mc4wp|newsletter", re.I)


def lam_sach(noi_dung):
    t = re.sub(r"<(script|style|noscript|form)\b[^>]*>.*?</\1>", "", noi_dung, flags=re.S | re.I)
    t = re.sub(r"<!--.*?-->", "", t, flags=re.S)
    khoi = []
    for k in tach_khoi(t):
        mo = re.match(r"<[a-zA-Z0-9]+([^>]*)>", k)
        if mo and LOP_BO.search(" ".join(re.findall(r'class="([^"]*)"', mo.group(1)))):
            continue
        khoi.append(k)
    # ảnh lazy-load: đưa data-src thành src
    t = "\n".join(khoi)
    t = re.sub(r'<img([^>]*?)\sdata-(?:lazy-)?src="([^"]+)"', lambda m: '<img%s src="%s"' % (
        re.sub(r'\ssrc="data:[^"]*"', "", m.group(1)), m.group(2)), t)
    return t.strip()


def luu_bai(bai, nguon):
    tieu_de = re.sub(r"<[^>]+>", "", bai["title"]["rendered"] if isinstance(bai["title"], dict) else bai["title"])
    noi_dung = bai["content"]["rendered"] if isinstance(bai["content"], dict) else bai["content"]
    tom_tat = bai.get("excerpt", {})
    tom_tat = tom_tat.get("rendered", "") if isinstance(tom_tat, dict) else (tom_tat or "")
    ban_ghi = {
        "id": bai["id"],
        "slug": bai["slug"],
        "link": bai["link"],
        "type": bai.get("type", "post"),
        "date": bai.get("date_gmt"),
        "modified": bai.get("modified_gmt"),
        "title": _giai_ma(tieu_de),
        "categories": bai.get("categories", []),
        "tags": bai.get("tags", []),
        "excerpt": tom_tat,
        "content": lam_sach(noi_dung),
        "nguon": nguon,
    }
    if bai.get("category_names"):
        ban_ghi["category_names"] = bai["category_names"]
    ghi_json(os.path.join(KHO_GOC, f"{bai['id']}.json"), ban_ghi)


def _giai_ma(s):
    return html.unescape(s).strip()


# ---------- cách 1: REST API ----------

def tai_rest(tai, args, chi_muc):
    # chuyên mục và thẻ (tags)
    for loai in ("categories", "tags"):
        tat_ca, trang = [], 1
        while True:
            ds, h = tai.lay_json(f"/wp-json/wp/v2/{loai}?per_page=100&page={trang}&_fields=id,name,slug,parent,count")
            tat_ca += ds
            if trang >= int(h.get("X-WP-TotalPages") or 1):
                break
            trang += 1
        ghi_json(os.path.join(KHO_GOC, f"_{loai}.json"), tat_ca)
        print(f"{loai}: {len(tat_ca)}")

    da_tai = 0
    for kieu in args.kieu.split(","):
        moc = chi_muc.get("moc_" + kieu)
        tham_so = {"per_page": 100, "orderby": "modified", "order": "asc", "_fields": TRUONG}
        if moc and not args.tai_lai:
            tham_so["modified_after"] = moc
        trang, moc_moi = 1, moc
        while True:
            tham_so["page"] = trang
            try:
                ds, h = tai.lay_json(f"/wp-json/wp/v2/{kieu}?" + urllib.parse.urlencode(tham_so))
            except urllib.error.HTTPError as e:
                if e.code == 400 and trang > 1:   # hết trang
                    break
                raise
            tong = int(h.get("X-WP-TotalPages") or 1)
            for bai in ds:
                cu = chi_muc["bai"].get(str(bai["id"]))
                if cu and cu == bai.get("modified_gmt") and not args.tai_lai:
                    continue
                luu_bai(bai, "rest")
                chi_muc["bai"][str(bai["id"])] = bai.get("modified_gmt")
                moc_moi = max(moc_moi or "", bai.get("modified_gmt") or "")
                da_tai += 1
                if args.toi_da and da_tai >= args.toi_da:
                    break
            print(f"{kieu}: trang {trang}/{tong} (tổng đã lưu {da_tai} bài)")
            ghi_json(os.path.join(KHO_GOC, "_chi_muc.json"), chi_muc)
            if trang >= tong or (args.toi_da and da_tai >= args.toi_da):
                break
            trang += 1
        if moc_moi and not args.toi_da:
            chi_muc["moc_" + kieu] = moc_moi
    return da_tai


# ---------- cách 2: sitemap + HTML ----------

def doc_sitemap(tai, url, tat_ca):
    du_lieu, _ = tai.lay(url)
    xml = du_lieu.decode("utf-8", "replace")
    for loc in re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", xml):
        if re.search(r"sitemap[^/]*\.xml", loc):
            if re.search(r"(post|page)", loc, re.I) and not re.search(r"(tag|categor|author|user|taxonom)", loc, re.I):
                doc_sitemap(tai, loc, tat_ca)
        else:
            tat_ca.append(loc)


def cat_than_bai(trang):
    """Lấy phần div.entry-content (cắt theo độ sâu thẻ div)."""
    m = re.search(r'<div[^>]*class="[^"]*\bentry-content\b[^"]*"[^>]*>', trang)
    if not m:
        m = re.search(r"<article\b[^>]*>", trang)
        if not m:
            return ""
    i, sau = m.end(), 1
    for t in re.finditer(r"<(/?)(div|article)\b[^>]*>", trang[m.end():]):
        sau += -1 if t.group(1) else 1
        if sau == 0:
            return trang[m.end(): m.end() + t.start()]
    return trang[i:]


def tai_html(tai, args, chi_muc):
    ds = []
    for duong in ("/wp-sitemap.xml", "/sitemap_index.xml", "/sitemap.xml"):
        try:
            doc_sitemap(tai, duong, ds)
            if ds:
                break
        except urllib.error.HTTPError:
            continue
    print(f"Sitemap: {len(ds)} địa chỉ")
    da_tai = 0
    for url in ds:
        slug = urllib.parse.urlparse(url).path.strip("/").split("/")[-1] or "trang-chu"
        id_gia = int(hashlib.md5(slug.encode()).hexdigest()[:8], 16)
        if str(id_gia) in chi_muc["bai"] and not args.tai_lai:
            continue
        du_lieu, _ = tai.lay(url)
        trang = du_lieu.decode("utf-8", "replace")
        tieu_de = re.search(r'<meta property="og:title" content="([^"]*)"', trang) or re.search(r"<h1[^>]*>(.*?)</h1>", trang, re.S)
        sua = re.search(r'<meta property="article:modified_time" content="([^"]*)"', trang)
        bai = {
            "id": id_gia, "slug": slug, "link": url, "type": "post",
            "modified_gmt": sua.group(1)[:19] if sua else None,
            "title": re.sub(r"\s*[-–|]\s*LITFL.*$", "", tieu_de.group(1)) if tieu_de else slug,
            "content": cat_than_bai(trang), "categories": [], "tags": [],
            "category_names": sorted({_giai_ma(c) for c in re.findall(r'rel="[^"]*category[^"]*"[^>]*>([^<]+)<', trang)}),
        }
        luu_bai(bai, "html")
        chi_muc["bai"][str(id_gia)] = bai["modified_gmt"] or "?"
        da_tai += 1
        if da_tai % 20 == 0:
            ghi_json(os.path.join(KHO_GOC, "_chi_muc.json"), chi_muc)
            print(f"  đã lưu {da_tai}")
        if args.toi_da and da_tai >= args.toi_da:
            break
    return da_tai


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--goc", default="https://litfl.com", help="địa chỉ trang (mặc định https://litfl.com)")
    p.add_argument("--che-do", choices=["rest", "html"], default="rest")
    p.add_argument("--kieu", default="posts,pages", help="loại nội dung REST: posts,pages")
    p.add_argument("--cho", type=float, default=1.0, help="số giây nghỉ giữa hai lượt tải")
    p.add_argument("--toi-da", type=int, default=0, help="chỉ tải tối đa N bài (để thử)")
    p.add_argument("--tai-lai", action="store_true", help="tải lại tất cả, bỏ qua mốc cập nhật")
    args = p.parse_args()

    os.makedirs(KHO_GOC, exist_ok=True)
    chi_muc = doc_json(os.path.join(KHO_GOC, "_chi_muc.json"), {"bai": {}})
    tai = Tai(args.goc, args.cho)
    if args.che_do == "rest":
        try:
            n = tai_rest(tai, args, chi_muc)
        except urllib.error.HTTPError as e:
            if e.code in (401, 403, 404):
                print(f"REST API trả về {e.code}; chuyển sang đọc sitemap + HTML.")
                n = tai_html(tai, args, chi_muc)
            else:
                raise
    else:
        n = tai_html(tai, args, chi_muc)
    ghi_json(os.path.join(KHO_GOC, "_chi_muc.json"), chi_muc)
    print(f"Xong: {n} bài mới hoặc đã sửa. Tổng trong kho: {len(chi_muc['bai'])}.")


if __name__ == "__main__":
    main()

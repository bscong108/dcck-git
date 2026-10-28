"""Hàm dùng chung cho bộ công cụ LITFL tiếng Việt (chỉ dùng thư viện chuẩn)."""
import html
import json
import os
import re

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # thư mục litfl-vi/
KHO = os.path.join(GOC, "kho")              # dữ liệu thô: kho/goc (tiếng Anh), kho/dich (tiếng Việt)
KHO_GOC = os.path.join(KHO, "goc")
KHO_DICH = os.path.join(KHO, "dich")
DATA = os.path.join(GOC, "data")            # dữ liệu ứng dụng đọc

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta",
        "param", "source", "track", "wbr"}


def doc_json(duong_dan, mac_dinh=None):
    try:
        with open(duong_dan, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return mac_dinh


def ghi_json(duong_dan, du_lieu, gon=False):
    os.makedirs(os.path.dirname(duong_dan), exist_ok=True)
    tam = duong_dan + ".tam"
    with open(tam, "w", encoding="utf-8") as f:
        if gon:
            json.dump(du_lieu, f, ensure_ascii=False, separators=(",", ":"))
        else:
            json.dump(du_lieu, f, ensure_ascii=False, indent=1)
    os.replace(tam, duong_dan)


def tach_khoi(noi_dung):
    """Tách HTML thành danh sách chuỗi khối cấp cao nhất (đoạn, bảng, hình...).

    Dùng để chia bài dài khi dịch và để khớp từng khối tiếng Việt với bản gốc.
    Cách làm: theo dõi độ sâu thẻ rồi cắt ở chỗ độ sâu trở về 0.
    """
    ket_qua, buf, sau = [], [], 0
    for m in re.finditer(r"<!--.*?-->|<[^>]+>|[^<]+", noi_dung, re.S):
        tok = m.group(0)
        if tok.startswith("<!--"):
            continue
        if tok.startswith("</"):
            buf.append(tok)
            sau = max(0, sau - 1)
            if sau == 0:
                ket_qua.append("".join(buf).strip())
                buf = []
            continue
        if tok.startswith("<"):
            ten = re.match(r"<\s*([a-zA-Z0-9]+)", tok)
            ten = ten.group(1).lower() if ten else ""
            buf.append(tok)
            if ten in VOID or tok.endswith("/>") or tok.startswith("<!") or tok.startswith("<?"):
                if sau == 0:
                    ket_qua.append("".join(buf).strip())
                    buf = []
            else:
                sau += 1
            continue
        if sau == 0:
            if tok.strip():
                ket_qua.append(tok.strip())
        else:
            buf.append(tok)
    if buf and "".join(buf).strip():
        ket_qua.append("".join(buf).strip())
    return [k for k in ket_qua if k]


def nhom_khoi(khoi, toi_da=9000):
    """Gộp các khối liền nhau thành phần (chunk) không quá `toi_da` ký tự."""
    phan, hien = [], []
    dai = 0
    for k in khoi:
        if hien and dai + len(k) > toi_da:
            phan.append("\n".join(hien))
            hien, dai = [], 0
        hien.append(k)
        dai += len(k)
    if hien:
        phan.append("\n".join(hien))
    return phan


def van_ban(noi_dung):
    """Bỏ thẻ HTML, trả về chữ thuần."""
    t = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", noi_dung, flags=re.S | re.I)
    t = re.sub(r"<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", html.unescape(t)).strip()


def dem_the(noi_dung):
    """Đếm thẻ quan trọng để kiểm bản dịch có giữ nguyên cấu trúc."""
    return {t: len(re.findall(r"<%s[\s>]" % t, noi_dung, re.I)) for t in ("img", "a", "table", "li", "h2", "h3")}

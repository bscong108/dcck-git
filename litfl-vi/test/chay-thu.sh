#!/bin/sh
# Chạy toàn bộ quy trình trên máy chủ giả lập: tải → dịch giả → đóng gói → kiểm giao diện.
# Dùng thư mục tạm cho kho/ và data/ để không đụng dữ liệu thật.
set -e
cd "$(dirname "$0")/.."
TAM=$(mktemp -d)
cp -r app icons cong-cu index.html manifest.webmanifest sw.js "$TAM"/
python3 test/may_chu_gia.py 8765 & GIA=$!
trap 'kill $GIA $WEB 2>/dev/null; rm -rf "$TAM"' EXIT
sleep 1
python3 "$TAM/cong-cu/tai_litfl.py" --goc http://127.0.0.1:8765 --cho 0
python3 "$TAM/cong-cu/dich_litfl.py" --gia-lap --co-phan 3000
python3 "$TAM/cong-cu/dong_goi.py" --tai-anh
python3 "$TAM/cong-cu/chay.py" --cong 8091 --khong-mo & WEB=$!
sleep 1
node test/giao-dien.js http://localhost:8091/

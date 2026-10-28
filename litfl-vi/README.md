# LITFL Tiếng Việt — ứng dụng học cá nhân

Ứng dụng đọc và học toàn bộ kiến thức trên [Life in the Fast Lane (litfl.com)](https://litfl.com) bằng tiếng Việt. Cài được lên laptop và điện thoại (PWA), đọc được khi không có mạng. Dùng cá nhân, không công khai.

## Ứng dụng có gì

| Phần | Chức năng |
|---|---|
| Trang chủ | Số bài đã đọc/đang ôn, đọc tiếp bài gần đây, các chuyên mục kèm thanh tiến độ |
| Chuyên mục | Lọc theo tên, trạng thái (chưa đọc, đã đọc, đang ôn, chưa dịch), xếp A–Z hoặc mới cập nhật |
| Đọc bài | Ba chế độ: **Tiếng Việt**, **Song ngữ** (mỗi đoạn kèm câu gốc), **Bản gốc**; chạm vào một đoạn để xem câu tiếng Anh; chạm ảnh (ECG) để phóng to; liên kết sang bài LITFL khác mở ngay trong ứng dụng; nhớ vị trí đang đọc; chỉnh cỡ chữ; ghi chú riêng từng bài; bài trước/sau trong chuyên mục |
| Tìm kiếm | Theo tên bài tiếng Việt hoặc tiếng Anh, thẻ, chuyên mục; gõ không dấu được; **Tìm trong nội dung** để tìm trong toàn văn |
| Ôn tập | Bấm “Đã học xong” → bài vào lịch ôn giãn cách sau 1, 3, 7, 21, 60, 120 ngày; mỗi lần ôn chọn “Nhớ được”/“Chưa nhớ” |
| Đánh dấu | Bài đánh dấu ☆ và bài có ghi chú |
| Cài đặt | Tải cả chuyên mục (kèm ảnh) để đọc ngoại tuyến; sáng/tối; sao lưu và khôi phục tiến độ sang máy khác |

Tiến độ, đánh dấu, ghi chú lưu trong trình duyệt của từng máy. Chuyển máy: Cài đặt → Tải bản sao lưu → mở ở máy kia → Khôi phục.

## Dữ liệu đến từ đâu

Ứng dụng không kèm sẵn nội dung LITFL. Bộ công cụ trong `cong-cu/` chạy trên máy anh để:

1. **Tải** (`tai_litfl.py`): lấy toàn bộ bài viết và trang của litfl.com qua WordPress REST API (`/wp-json/wp/v2/`); nếu API bị tắt thì tự chuyển sang đọc sitemap rồi tải từng trang HTML. Tải chậm (1 giây/lượt), lần sau chỉ tải bài mới hoặc đã sửa.
2. **Dịch** (`dich_litfl.py`): dịch sang tiếng Việt bằng Claude API theo quy ước trong `cong-cu/quy-uoc-dich.md` (giữ nguyên eponym, viết tắt, tên thuốc, số liệu, tài liệu tham khảo; thuật ngữ lần đầu kèm tiếng Anh trong ngoặc). Giữ nguyên cấu trúc HTML, ảnh, bảng, liên kết; tự kiểm số thẻ của bản dịch so với bản gốc và cảnh báo nếu lệch.
3. **Đóng gói** (`dong_goi.py`): tạo thư mục `data/` cho ứng dụng; tuỳ chọn tải ảnh về máy.
4. **Chạy** (`chay.py`): mở ứng dụng tại `http://localhost:8080`.

Thư mục `kho/` (dữ liệu thô) và `data/` (dữ liệu ứng dụng) nằm trong `.gitignore`, không được đưa lên GitHub.

## Cài đặt lần đầu (Windows, macOS, Linux)

Cần Python 3.10 trở lên.

```bash
pip install anthropic
```

Khoá API Claude: tạo tại Claude Console, rồi đặt biến môi trường `ANTHROPIC_API_KEY` (Windows: *Edit the system environment variables* → *Environment Variables* → *New*).

Các lệnh dưới đây chạy trong thư mục `litfl-vi`.

**1. Tải nội dung tiếng Anh**

```bash
python cong-cu/tai_litfl.py
```

Thử trước với ít bài: thêm `--toi-da 30`. Chạy lại bất kỳ lúc nào để cập nhật.

**2. Xem khối lượng và chi phí ước lượng trước khi dịch**

```bash
python cong-cu/dich_litfl.py --uoc-tinh
```

Lệnh in số bài, số ký tự và chi phí ước lượng cho từng mô hình (gọi trực tiếp và gửi lô). Đây là ước lượng thô; dịch thử vài bài rồi xem chi phí thật trong Claude Console.

**3. Dịch**

Dịch thử 5 bài:

```bash
python cong-cu/dich_litfl.py --toi-da 5
```

Dịch theo chuyên mục (slug xem trong `kho/goc/_categories.json`), ví dụ thư viện ECG trước:

```bash
python cong-cu/dich_litfl.py --chuyen-muc ecg-library
```

Dịch toàn bộ bằng Batches API (rẻ hơn 50%, xong trong vòng 24 giờ): gửi lô, sau đó nhận kết quả:

```bash
python cong-cu/dich_litfl.py --lo gui
```

```bash
python cong-cu/dich_litfl.py --lo nhan
```

Tuỳ chọn khác: `--mo-hinh` (mặc định `claude-opus-5-5`; có thể chọn `claude-sonnet-5-5` hoặc `claude-haiku-5-5` để rẻ hơn), `--effort` (mặc định `medium`), `--luong` (số phần dịch song song), `--dich-lai`. Lệnh dịch chạy lại được nhiều lần: phần đã dịch được giữ, chỉ dịch phần còn thiếu hoặc bài LITFL đã sửa. Với mô hình Opus 5.5 / Sonnet 5.5, nếu một phần bị bộ lọc an toàn từ chối (có thể gặp ở bài độc chất), API tự chuyển sang mô hình dự phòng; phần vẫn bị từ chối được báo tên để xử lý riêng.

**4. Đóng gói và mở**

```bash
python cong-cu/dong_goi.py --tai-anh
```

```bash
python cong-cu/chay.py
```

Bỏ `--tai-anh` nếu muốn dữ liệu nhẹ (ảnh lấy từ litfl.com khi có mạng). Trên Windows có thể bấm đúp `chay.bat` (đóng gói lại rồi mở ứng dụng).

## Cài lên laptop

Mở `python cong-cu/chay.py` bằng Chrome hoặc Edge → biểu tượng **Cài đặt** trên thanh địa chỉ (hoặc nút “Cài ứng dụng lên máy” ở trang chủ). Ứng dụng có biểu tượng riêng, mở như phần mềm. Mỗi lần dùng cần chạy `chay.py` (hoặc để nó chạy nền); bài đã tải ngoại tuyến vẫn đọc được khi mất mạng.

## Dùng trên điện thoại

Trình duyệt chỉ cho cài PWA và đọc ngoại tuyến khi trang mở qua `https://` hoặc `localhost`. Hai cách:

1. **Cùng mạng Wi-Fi, chỉ đọc trực tuyến:** chạy `python cong-cu/chay.py --mang-noi-bo`, rồi mở `http://<IP laptop>:8080` trên điện thoại. Đọc được, nhưng không cài và không đọc ngoại tuyến được (không phải https).
2. **Trang riêng có https và đăng nhập (khuyên dùng để cài lên điện thoại):** đưa thư mục `litfl-vi` (sau khi đóng gói, gồm `data/`) lên một dịch vụ lưu trữ web tĩnh có chặn truy cập bằng đăng nhập, ví dụ Cloudflare Pages kèm Cloudflare Access giới hạn đúng email của anh. Như vậy chỉ anh vào được, điện thoại cài được ứng dụng, và tải ngoại tuyến từng chuyên mục trong Cài đặt. Không đưa lên trang công khai.

## Bản quyền

Nội dung thuộc tác giả LITFL. LITFL công bố nội dung theo giấy phép Creative Commons (theo hiểu biết của tôi là CC BY-NC-SA 4.0 — anh kiểm lại ở chân trang litfl.com). Ứng dụng giữ tên bài gốc, đường dẫn về bài gốc và dòng ghi nguồn ở cuối mỗi bài; chỉ dùng cho học tập cá nhân, không thương mại, không phát tán.

## Kiểm thử

```bash
sh test/chay-thu.sh
```

Chạy cả quy trình trên một máy chủ WordPress giả lập (`test/may_chu_gia.py`, nội dung giả), dịch giả lập không gọi API (`--gia-lap`), đóng gói, rồi kiểm giao diện bằng Playwright (`test/giao-dien.js`): mở chuyên mục, đọc bài, song ngữ, phóng ảnh, liên kết nội bộ, đánh dấu, ghi chú, ôn tập, tìm kiếm không dấu và toàn văn, tải ngoại tuyến rồi đọc khi mất mạng.

## Cấu trúc

```
index.html, manifest.webmanifest, sw.js, icons/   ứng dụng PWA
app/kho.js        tiến độ, lịch ôn, sao lưu (localStorage)
app/app.js        giao diện
app/style.css     giao diện sáng/tối
cong-cu/          tai_litfl.py, dich_litfl.py, dong_goi.py, chay.py, chung.py, quy-uoc-dich.md
test/             máy chủ giả lập và kiểm thử giao diện
kho/  data/       tạo khi chạy công cụ, không đưa lên git
```

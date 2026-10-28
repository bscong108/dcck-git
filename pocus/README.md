# POCUS Cấp cứu: ứng dụng tự học siêu âm tại giường

Mở `pocus/index.html` bằng trình duyệt (Chrome, Edge, Safari, Firefox) trên máy tính, máy tính bảng hoặc điện thoại. Không cần cài đặt, không cần mạng (có mạng thì tải thêm phông chữ).

Bản một file để chép sang điện thoại hoặc đăng trực tuyến: `python cong-cu/dong_goi_pocus.py` → `ban-truc-tuyen/pocus-cap-cuu.html`.

## Nội dung

20 bài theo 4 giai đoạn:

| Giai đoạn | Bài |
|---|---|
| 1. Nền tảng | Vật lý, đầu dò, núm chỉnh, định hướng · Ảnh giả |
| 2. Ứng dụng cốt lõi | E-FAST · 4 mặt cắt tim · Thất trái, thất phải · Màng ngoài tim, ép tim · TMC dưới, VTI, đáp ứng dịch · Phổi: trượt, đường A/B, tràn khí · Tràn dịch màng phổi, đông đặc · ĐMC bụng · Huyết khối TM sâu · Thận, bàng quang · Túi mật · Thai sớm, thai ngoài tử cung |
| 3. Quy trình tích hợp | Ngừng tuần hoàn · RUSH · BLUE |
| 4. Thủ thuật và mở rộng | Đặt đường truyền · Chọc dịch · Mắt (ONSD, bong võng mạc) |

Mỗi bài có 5 phần: **Lý thuyết** · **Cầm tay chỉ việc** (chuẩn bị, từng bước với hình vị trí đầu dò, tiêu chuẩn "Đạt khi", mẹo, hình mong đợi, bảng kiểm kỹ năng) · **Đọc kết quả** (hình bình thường/bất thường, bảng quyết định, "Clip của tôi") · **Ý nghĩa lâm sàng** và bẫy · **Tự kiểm tra**.

Ngoài ra: Thư viện hình động, 7 ca lâm sàng tích hợp, 6 công cụ tính (thể tích bàng quang, dịch màng phổi Balik, thể tích nhát bóp/cung lượng tim, % thay đổi VTI khi nâng chân, áp lực nhĩ phải từ TMC dưới, tỉ lệ thất phải/thất trái), Sổ thực hành đếm ca theo ứng dụng.

## Hình ảnh

- Hình siêu âm là **mô phỏng canvas** (`js/sim.js`, 20 cảnh có tham số, có chuyển động tim, nhịp thở, trượt màng phổi, ép tĩnh mạch, M-mode, Doppler), có nút bật/tắt chú thích để tự đọc. Không phải ảnh người bệnh.
- Hình vị trí đầu dò và 5 động tác đầu dò là SVG (`js/figs.js`).
- Clip thật: người học tự thêm vào mục "Clip của tôi" (lưu IndexedDB trên thiết bị) và liên kết thư viện mở trong mục Thư viện hình động.

## Nguồn

Nội dung dựa trên kiến thức chuẩn trong các sách và khuyến cáo liệt kê ở trang **Tham khảo** (Ma & Mateer's Emergency Ultrasound 4e; Noble & Nelson; Soni, Arntfield & Kory; Lichtenstein; ACEP Ultrasound Guidelines; khuyến cáo quốc tế về siêu âm phổi và siêu âm tim tập trung; ASE; ESC…). Trích dẫn ở mức sách/bài báo, không ghi số trang. Chưa đối chiếu với các sách tiếng Việt trong kho G:\ (Cuốn 5 Siêu âm cấp cứu của ĐCCK) vì kho không có trên máy này.

## Cấu trúc

```
pocus/index.html        trang
pocus/pocus.css         giao diện (sáng/tối)
pocus/js/sim.js         mô phỏng hình siêu âm
pocus/js/figs.js        hình SVG vị trí đầu dò
pocus/js/bai/*.js       nội dung 20 bài, tài liệu tham khảo, ca lâm sàng
pocus/js/app.js         điều hướng, tiến độ, công cụ, sổ thực hành
```

Thêm bài: tạo file trong `js/bai/` gọi `POCUS.them({...})` theo khung ở `00-khung.js`, thêm thẻ `<script>` vào `index.html`.

Kiểm tra: `node test/pocus.js`.

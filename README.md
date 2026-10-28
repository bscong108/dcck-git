# ĐCCK · Học sâu

**Mới dùng lần đầu: đọc [HUONG-DAN-SU-DUNG.md](HUONG-DAN-SU-DUNG.md).**

**Bản trực tuyến (điện thoại, máy tính bảng, tự đồng bộ tiến độ):** https://claude.ai/artifact/EJnXNYjbramUPWCR9nDEgB — tạo bằng `python cong-cu/dong_goi_truc_tuyen.py` (file `ban-truc-tuyen/dcck-hoc.html`), đồng bộ ở `app/sync.js`.

Ứng dụng học tập cho bộ 9 cuốn ĐCCK (464 bài). Chạy hoàn toàn trên máy: mở `index.html` bằng trình duyệt (Chrome, Edge, Firefox), không cần cài đặt, không cần mạng.

Ứng dụng đi theo đúng chu trình trong `PHUONG-PHAP-HOC.md`: truy hồi chủ động, ôn giãn cách, tự giải thích (Feynman).

| Bước | Ở đâu trong ứng dụng |
|---|---|
| 1. Đọc chủ động | Tab **1 · Đọc chủ động**: tự trả lời câu hỏi dẫn dắt trước khi đọc; nút **?** cạnh mỗi đoạn để đánh dấu chỗ chưa tự giải thích lại được; che khối CHỐT LẠI để tự nhắc lại trước khi mở; trả lời lại câu hỏi sau khi đọc |
| 2. Vẽ lại | Tab **2 · Vẽ lại Handout**: bấm ô trống để mở đáp án, bấm lần nữa để đánh dấu điền sai; chuyển bản Key; in A3; lưu kết quả → đánh dấu *learned* |
| 3. Giảng lại | Tab **3 · Giảng lại**: đồng hồ 10/5/3 phút, ghi âm (lưu trong trình duyệt, tải về được), tự chấm theo 4 tiêu chí “đã hiểu”, ghi chỗ vấp và thuật ngữ lấp chỗ trống, mở bản giảng mẫu sau khi giảng xong, vấn đáp nhanh 60 giây, sao chép để giảng cho Claude (skill `dcck-feynman`) |
| 4. Vá lỗ hổng | Tab **Nhật ký bài**: chỗ đánh dấu khi đọc, câu tự kiểm tra làm sai, chỗ vấp; xuất `NHAT-KY-FEYNMAN.md` |
| 5. Ôn giãn cách | Trang **Hôm nay** báo bài đến hạn (ngày 1, 3, 7, 21, 60, 120) và lịch 14 ngày; **Ôn thẻ** Anki hằng ngày (thuật toán SM-2, trộn xen kẽ các bài); **Tự kiểm tra** trắc nghiệm chấm tự động |
| 6–7. Giảng thật, đối chiếu lâm sàng | Ghi ở Nhật ký bài |

Ngoài ra: **Mục lục** 9 cuốn có lọc theo cuốn, ưu tiên, giai đoạn, trạng thái; cảnh báo khi số bài đã viết chưa học vượt 8; **Vấn đáp** rút câu hỏi xen kẽ giữa các bài đã học; xuất lệnh đồng bộ `tracker.py`.

## ECG Cấp cứu (`ecg/`)

Phần mềm học và thực hành đọc điện tâm đồ cho bác sĩ cấp cứu, đi theo mục lục **Cuốn 2** (ECG-01 → ECG-47). Mở `ecg/index.html` (hoặc menu **ECG Cấp cứu** trong ứng dụng chính); chạy hoàn toàn trên máy, không cần mạng.

| Mục | Nội dung |
|---|---|
| Bài học | 47 bài, 7 phần; tiêu chuẩn chẩn đoán, bảng phân biệt, cảnh báo, mẹo, ECG minh hoạ, câu tự kiểm tra, liên kết tra cứu LITFL |
| Atlas | Các mẫu ECG 12 chuyển đạo mô phỏng theo nhóm; thước đo (ms, mm, tần số), phóng to, dải nhịp DII/V1, toàn màn hình |
| Ca lâm sàng | 30 ca cấp cứu, trả lời từng bước (nhận diện → chẩn đoán → xử trí) có giải thích |
| Luyện nhanh | Nhận diện ECG có tính giờ, thống kê mẫu hay sai |
| Thẻ ôn | Ôn giãn cách các tiêu chuẩn, ngưỡng, liều thuốc |
| Công cụ | QTc, tần số, trục, Sgarbossa (Smith), tắc LAD vs tái cực sớm (công thức Smith), LVH, thuật toán Brugada và aVR |

ECG được **mô phỏng** bằng `ecg/js/engine.js` (chuyển đạo chi chiếu từ vector mặt phẳng trán, giấy 25 mm/s – 10 mm/mV); mẫu ở `ecg/js/patterns.js`, bài ở `ecg/js/lessons-*.js`, ca ở `ecg/js/cases.js`. Bản trực tuyến: https://claude.ai/artifact/8XktUxxMupeRfjmLkMPYgB (tiến độ lưu riêng trong trình duyệt; nút sao lưu chỉ hoạt động ở bản chạy trên máy). Bản một file: `python cong-cu/dong_goi_ecg.py` → `ban-truc-tuyen/ecg-cap-cuu.html`. Kiểm tra: `node test/ecg.js`.

## Thêm bài mới do Cowork tạo

Mỗi bài nhận 3 file theo tên: `MÃ_bai.md`, `MÃ_Handout.html`, `MÃ_anki.apkg` (ví dụ `YC-01_bai.md`). Có hai cách:

1. **Đóng gói (khuyên dùng):** công cụ tự quét `noi-dung/`, `G:/Cowork/ĐCCK` và thư mục `ĐCCK` cạnh thư mục ứng dụng; thư mục khác thêm vào `cong-cu/cau-hinh.json` (riêng từng máy, không nằm trong ZIP). Chạy `cap-nhat-noi-dung.bat` (Windows) hoặc `python cong-cu/dong_goi.py`. Công cụ quét đệ quy, lấy bản sửa gần nhất của mỗi file, ghi vào `data/noi-dung.js` rồi mở ứng dụng. Cần Python 3.
2. **Kéo thả:** trang **Dữ liệu** → thả file vào. Nội dung lưu trong trình duyệt đó (kể cả `.apkg`, đọc trực tiếp không cần thư viện ngoài).

`.apkg` phải là định dạng cũ (`collection.anki2`/`anki21`). Nếu Anki xuất dạng mới, chọn “Support older Anki versions”.

## Tiến độ học

Lưu trong trình duyệt (localStorage, ghi âm trong IndexedDB). Sao lưu định kỳ ở trang **Dữ liệu** → “Tải bản sao lưu”; dùng file đó để khôi phục hoặc chuyển máy.

Giả định của ứng dụng (tracker.py gốc không có ở đây): các mốc ôn tính từ ngày học (ngày 0); lần ôn “chưa đạt” giữ nguyên mốc và hẹn ôn lại hôm sau.

## Cấu trúc

```
index.html              ứng dụng
app/                    md.js (hiển thị Markdown), parse.js (mục lục, bài, Anki, đọc .apkg), store.js (tiến độ, lịch, SM-2), app.js (giao diện)
data/noi-dung.js        nội dung đã đóng gói (tạo tự động, không đưa vào git/ZIP)
data/noi-dung-mau.js    gói mẫu (YC-01), dùng khi chưa đóng gói
noi-dung/               file nguồn mẫu: mục lục, phương pháp, YC-01
cong-cu/dong_goi.py     công cụ đóng gói
test/                   kiem-tra.js (bộ phân tích), giao-dien.js (Playwright)
```

Kiểm tra: `node test/kiem-tra.js`.

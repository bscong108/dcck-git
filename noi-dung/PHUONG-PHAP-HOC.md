# Phương pháp học ĐCCK

Viết là việc của Claude, hiểu là việc của người học. Một bài chỉ được coi là "đã thành kiến thức" khi đi qua đủ chu trình dưới đây. Chu trình dựa trên ba cơ chế: truy hồi chủ động, ôn giãn cách, tự giải thích (lõi của phương pháp Feynman).

## 1. Chu trình một bài

| Bước | Thời điểm | Việc làm | Ghi vào tracker |
|---|---|---|---|
| 1. Đọc chủ động | Ngày 0 | Đọc câu hỏi dẫn dắt, tự trả lời trước. Đọc bài, đánh dấu chỗ không tự giải thích lại được | |
| 2. Vẽ lại | Ngày 0 | Mở Handout, tự điền; đối chiếu Key; tô màu ô sai | `tracker.py learned MÃ` |
| 3. Giảng lại | Ngày 1 | Giảng 10 phút cho một sinh viên tưởng tượng, có ghi âm. Nghe lại, ghi chỗ vấp và chỗ phải dùng thuật ngữ để lấp chỗ chưa hiểu. Có thể giảng cho Claude bằng skill `dcck-feynman` | `tracker.py taught MÃ` |
| 4. Vá lỗ hổng | Ngày 1 | Quay lại đúng đoạn nguồn. Câu hỏi bài chưa trả lời: ghi vào `HOC-TAP/NHAT-KY-FEYNMAN.md` để bổ sung bài | |
| 5. Ôn giãn cách | Ngày 3, 7, 21, 60, 120 | Vẽ lại Handout từ trí nhớ, làm câu hỏi tự kiểm tra; Anki hằng ngày | `tracker.py reviewed MÃ` (chưa đạt: thêm `--kho`) |
| 6. Giảng thật | Hằng tháng | Trình bày một bài trong sinh hoạt khoa học hoặc dạy học viên, dùng file slide | ghi chú |
| 7. Đối chiếu lâm sàng | Khi gặp ca | Mở bản Key, so với thực tế, ghi ngoại lệ vào nhật ký | |

## 2. Quy tắc tiến độ

- Số bài đã viết nhưng chưa học không vượt quá 8 (`tracker.py status` cảnh báo khi vượt).
- Học xen kẽ theo cụm liên cuốn (bảng cụm trong `MUC-LUC-9-CUON.md` và file đề xuất): cùng tuần học các bài của nhiều cuốn xoay quanh một vấn đề.
- Giai đoạn 1 (nền móng sinh lý, 49 bài): HD-01 đến HD-19, TK-01 đến TK-12, ECG-01 đến ECG-07, DL-01 đến DL-11.
- Lịch viết theo ngày: `LICH-VIET-BAI.md` (bản đọc) và `LICH-VIET-BAI.csv` (tracker dùng), lập bằng `CONG-CU/lap_lich.py`. Từ 04/10/2026: 3 bài/ngày (phiên tự động 6:30, 12:00, 19:30), Thứ Bảy là ngày đệm. Thứ tự: giai đoạn 1, rồi các cụm với bài A (mỗi cụm mở bằng bài YC khung), rồi lượt bài B theo cùng thứ tự cụm. `tracker.py next` theo lịch này; `tracker.py lich` xem bài trong ngày và số bài trễ.

## 3. Tiêu chí "đã hiểu" khi giảng lại

- Giải thích được mỗi dấu hiệu lâm sàng bằng một mắt xích cơ chế.
- Giải thích được lý do của mỗi bước xử trí, không chỉ thứ tự.
- Trả lời được 3–5 câu hỏi dẫn dắt ở đầu bài mà không nhìn tài liệu.
- Không cần dùng thuật ngữ nào mà mình không định nghĩa được bằng lời thường.

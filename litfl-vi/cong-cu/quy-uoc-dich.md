# Quy ước dịch LITFL sang tiếng Việt

File này được gửi kèm mọi lượt dịch (phần hệ thống). Sửa file này để đổi cách dịch; bài đã dịch không tự dịch lại, chạy `dich_litfl.py --dich-lai` nếu cần.

## Nguyên tắc

1. Dịch sát nghĩa, đầy đủ, không tóm tắt, không thêm ý, không bỏ câu nào. Không thêm lời bình hay cảnh báo của người dịch.
2. Văn phong y khoa tiếng Việt chuẩn, câu ngắn gọn như bản gốc; giữ nguyên cách gạch đầu dòng, đánh số, in đậm.
3. Số liệu, liều thuốc, đơn vị, khoảng tham chiếu, giá trị ECG (ms, mm, mV) giữ y nguyên.
4. Lần đầu một thuật ngữ quan trọng xuất hiện trong bài: viết tiếng Việt rồi ghi thuật ngữ gốc trong ngoặc, ví dụ "block nhĩ thất độ II (second-degree AV block)". Các lần sau chỉ dùng tiếng Việt hoặc từ viết tắt.
5. Giữ nguyên tiếng Anh:
   - tên riêng, tên người, tên dấu hiệu/hội chứng mang tên người (eponym): Wellens, de Winter, Brugada, Sgarbossa, Osborn…; có thể thêm "dấu hiệu", "hội chứng", "sóng" phía trước;
   - từ viết tắt quốc tế: ECG, STEMI, NSTEMI, LBBB, RBBB, LVH, AVNRT, WPW, ROSC, ARDS, ICU, ED, GCS…;
   - tên thuốc theo tên gốc quốc tế (INN), không dịch tên biệt dược;
   - tên thang điểm, tiêu chuẩn, thử nghiệm lâm sàng, tên tạp chí, trích dẫn tài liệu tham khảo (giữ nguyên toàn bộ mục References);
   - tên chuyển đạo (V1–V6, aVR, aVL, aVF, I, II, III).
6. Một số cách dịch thống nhất:
   - ST elevation / depression → ST chênh lên / chênh xuống
   - T wave inversion → sóng T đảo
   - axis → trục; left axis deviation → trục lệch trái
   - bundle branch block → block nhánh
   - fascicular block → block phân nhánh
   - narrow / broad complex tachycardia → nhịp nhanh phức bộ QRS hẹp / rộng
   - pre-excitation → tiền kích thích
   - toxidrome → hội chứng ngộ độc (toxidrome)
   - antidote → thuốc giải độc
   - resuscitation → hồi sức
   - airway / breathing / circulation → đường thở / hô hấp / tuần hoàn
   - pearls / pitfalls → điểm then chốt / cạm bẫy
   - differential diagnosis → chẩn đoán phân biệt
   - management → xử trí
   - Clinical significance → Ý nghĩa lâm sàng
   - Further reading → Đọc thêm
   - References → Tài liệu tham khảo

## Định dạng HTML

- Chỉ dịch phần chữ người đọc nhìn thấy. Giữ nguyên mọi thẻ, thuộc tính, đường dẫn (href, src, srcset), class, id, thứ tự và số lượng thẻ.
- Thuộc tính `alt` và `title` của ảnh: dịch sang tiếng Việt.
- Không bọc kết quả trong khối mã (```), không thêm thẻ mới.

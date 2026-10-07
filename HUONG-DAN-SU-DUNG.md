# Hướng dẫn sử dụng ứng dụng học ĐCCK

Dành cho người chưa dùng GitHub. Máy Windows, trình duyệt Chrome hoặc Edge.

## Phần 1. Cài đặt lần đầu (5 phút)

### Bước 1. Lấy chương trình về máy

**Cách A: dùng file ZIP được gửi trong cuộc trò chuyện với Claude (dễ nhất)**

1. Bấm tải file `DCCK-Hoc.zip`.
2. Mở thư mục **Downloads** (Tải xuống), tìm `DCCK-Hoc.zip`.

**Cách B: tải từ GitHub**

1. Mở trình duyệt, vào địa chỉ:
   `https://github.com/bscong108/dcck-git/tree/claude/fervent-euler-knusva`
   (đăng nhập GitHub nếu được hỏi, vì kho là riêng tư).
2. Bấm nút màu xanh **Code** → chọn **Download ZIP**.
3. File tải về có tên `dcck-git-claude-fervent-euler-knusva.zip`.

### Bước 2. Giải nén vào một chỗ cố định

1. Bấm chuột phải vào file ZIP → **Extract All…** (Giải nén tất cả).
2. Ở ô đường dẫn, gõ một thư mục cố định, ví dụ `G:\Cowork\DCCK-Hoc`, rồi bấm **Extract**.
3. Thư mục sau khi giải nén có các mục: `index.html`, `app`, `data`, `noi-dung`, `cong-cu`, `cap-nhat-noi-dung.bat`…

> Quan trọng: để thư mục này **cố định một chỗ**, không đổi tên, không di chuyển. Tiến độ học được trình duyệt lưu theo vị trí file; dời thư mục có thể làm mất tiến độ (xem Phần 5 để sao lưu).

### Bước 3. Mở chương trình

1. Vào thư mục vừa giải nén, bấm đúp `index.html`.
2. Nếu máy mở bằng trình duyệt khác: chuột phải `index.html` → **Open with** → **Google Chrome** (hoặc Microsoft Edge).
3. Tạo lối tắt cho nhanh: khi trang đã mở, bấm `Ctrl + D` để đánh dấu trang (bookmark). Lần sau mở từ thanh dấu trang.

Không cần mạng, không cần cài thêm gì để học. Bài YC-01 đã có sẵn.

### Bước 4 (chỉ cần khi muốn tự động nạp bài mới). Cài Python

1. Vào `https://www.python.org/downloads/`, bấm **Download Python 3.x**.
2. Chạy file cài. **Ở màn hình đầu tiên, tích ô "Add python.exe to PATH"**, rồi bấm **Install Now**.
3. Kiểm tra: bấm phím Windows, gõ `cmd`, Enter. Trong cửa sổ đen gõ `python --version`, Enter. Hiện `Python 3.x.x` là được.

## Phần 2. Nạp bài mới do Cowork viết

Mỗi bài Cowork tạo gồm 3 file, tên bắt đầu bằng mã bài:
`HD-04_bai.md`, `HD-04_Handout.html`, `HD-04_anki.apkg`. Chương trình nhận diện bài nhờ tên file, nên **giữ nguyên tên file**.

### Cách 1. Tự động quét thư mục Cowork (khuyên dùng)

Làm một lần:

1. Trong thư mục chương trình, vào `cong-cu`, chuột phải `cau-hinh.json` → **Open with** → **Notepad**.
2. Sửa dòng `"nguon"` thành (thay bằng thư mục thật Cowork lưu bài trên máy):
   ```
   "nguon": ["noi-dung", "G:/Cowork/ĐCCK"]
   ```
   Lưu ý: dùng dấu `/` thay cho `\`, giữ nguyên dấu ngoặc kép và dấu phẩy.
3. `Ctrl + S` để lưu, đóng Notepad.

Mỗi khi Cowork viết xong bài mới:

1. Đóng trang chương trình (nếu đang mở).
2. Bấm đúp `cap-nhat-noi-dung.bat`.
3. Cửa sổ đen hiện danh sách bài đã đọc được, rồi chương trình tự mở. Bài mới xuất hiện ở trang **Hôm nay** mục "Bài mới viết, chờ học" và trong **Mục lục**.

Chương trình quét cả các thư mục con. Nếu có nhiều bản của cùng một file, lấy bản sửa gần nhất.

### Cách 2. Kéo thả từng bài (không cần Python)

1. Mở chương trình → bấm **Dữ liệu** trên thanh trên cùng.
2. Mở File Explorer, chọn 3 file của bài (giữ `Ctrl` để chọn nhiều), kéo thả vào ô "Thả file vào đây".
3. Dòng kết quả hiện ví dụ `HD-04: bai.md`, `HD-04: 38 note Anki` là xong.

Bài nạp kiểu này chỉ nằm trong trình duyệt đang dùng.

## Phần 3. Học một bài mới: làm theo thứ tự

Mở bài: **Mục lục** → bấm vào tên bài (hoặc từ trang **Hôm nay** bấm "Bắt đầu học"). Đầu trang bài có 7 ô là 7 bước của chu trình; ô viền cam là bước đang cần làm, ô xanh có dấu ✓ là đã xong.

### Ngày 0: đọc và vẽ lại (khoảng 60–90 phút)

**Tab "1 · Đọc chủ động"**

1. Đọc ca lâm sàng mở đầu (bấm để mở).
2. Tự trả lời 3–5 câu hỏi dẫn dắt vào các ô trống. Đoán cũng được, không mở sách. Chữ tự lưu.
3. Bấm **Bắt đầu đọc bài**.
4. Khi đọc, gặp đoạn nào mình **không tự giải thích lại được bằng lời của mình**, bấm nút **?** ở lề trái đoạn đó. Đoạn chuyển màu vàng.
5. Các khung "CHỐT LẠI" bị làm mờ: tự nhắc lại ý chính của mục vừa đọc trong đầu, rồi mới bấm vào khung để mở và so.
6. Đọc hết, cuối bài có phần **Sau khi đọc**: trả lời lại các câu hỏi dẫn dắt (không nhìn bài), so với câu trả lời ban đầu. Bấm **Đã đọc xong**.

**Tab "2 · Vẽ lại Handout"**

1. Lấy một tờ giấy, vẽ lại sơ đồ và điền các ô gạch ngang từ trí nhớ.
2. Bấm vào từng ô gạch trên màn hình để mở đáp án. Mình điền sai ô nào thì **bấm thêm lần nữa** vào ô đó: ô viền đỏ.
3. Bấm **Lưu kết quả lần vẽ** → chọn **OK** khi được hỏi "Đánh dấu đã học hôm nay". Từ đây chương trình bắt đầu tính lịch ôn.
4. Muốn in ra giấy A3: bấm **In**. Muốn xem bản đầy đủ: tích **Bản Key**.

### Ngày 1: giảng lại và vá lỗ hổng (khoảng 30 phút)

Trang **Hôm nay** sẽ báo bài đến hạn "Giảng lại".

**Tab "3 · Giảng lại"**

1. Chọn 10 phút, bấm **● Bắt đầu giảng**. Lần đầu trình duyệt hỏi quyền dùng micro: bấm **Allow / Cho phép**.
2. Giảng to thành tiếng như đang dạy một sinh viên năm 3, không nhìn tài liệu. Bí quá thì mở "Xem dàn ý" (chỉ có tiêu đề mục).
3. Bấm **■ Dừng**. Bản ghi âm hiện ở mục "Bản ghi âm": bấm ▶ để nghe lại, **Tải** để lưu về máy.
4. Nghe lại, rồi điền phần **Tự chấm**: tích tiêu chí nào đạt; ghi chỗ vấp; ghi thuật ngữ đã nói ra mà không giải thích được; ghi câu hỏi bài chưa trả lời (mỗi dòng một câu).
5. Bấm **Mở bản mẫu** để so với bản "Giảng lại trong 5 phút" của bài.
6. Bấm **Lưu lần giảng**.
7. Muốn Claude nghe giảng và bắt lỗi: gõ bài giảng vào ô "Bản giảng viết", bấm **Sao chép để giảng cho Claude**, rồi dán vào Cowork (skill dcck-feynman).
8. Phần **Vấn đáp nhanh** cuối trang: bấm **Rút câu hỏi**, nói to câu trả lời trong 60 giây, rồi mở đáp án và tự đánh giá.

**Tab "Nhật ký bài"** (bước 4, vá lỗ hổng)

1. Xem danh sách đoạn đã đánh dấu **?**, chỗ vấp, câu tự kiểm tra làm sai (tự động gom về đây).
2. Quay lại đúng đoạn trong bài hoặc trong sách nguồn để hiểu lại.
3. Xong bấm **Đánh dấu đã vá xong**.

### Ngày 3, 7, 21, 60, 120: ôn (15–20 phút mỗi lần)

Trang **Hôm nay** báo bài đến hạn ôn. Bấm **Ôn**, rồi:

1. Tab **2 · Vẽ lại Handout**: vẽ lại từ trí nhớ như ngày 0, lưu kết quả. Chương trình sẽ hỏi lần ôn này đạt hay chưa:
   - **OK** = đạt → chuyển sang mốc ôn tiếp theo.
   - **Cancel** = chưa đạt → hẹn ôn lại ngày mai.
2. Tab **Tự kiểm tra**: làm các câu hỏi. Câu trắc nghiệm bấm chọn là chấm ngay; câu tự luận gõ trả lời, bấm **Xem đáp án**, rồi tự chấm. Cuối cùng bấm **Lưu kết quả**.
3. Cũng có thể ghi kết quả ôn ở tab **Chu trình** bằng nút **✓ Ôn đạt** / **Chưa đạt**.

### Hằng tháng, khi gặp ca: bước 6 và 7

Tab **Nhật ký bài** → khung "Thêm ghi chép" → chọn loại **Giảng thật** (khi trình bày ở sinh hoạt khoa học, dạy học viên) hoặc **Đối chiếu lâm sàng** (ca thực tế khác bài ở điểm nào) → gõ nội dung → **Thêm**.

## Phần 4. Việc hằng ngày (10–20 phút)

1. Mở chương trình, xem trang **Hôm nay**:
   - "Thẻ Anki đến hạn": số thẻ cần ôn.
   - "Việc đến hạn": bài cần giảng lại hoặc ôn.
   - "Đã viết, chưa học": nếu quá 8 bài, khung đỏ nhắc tạm ngừng viết bài mới.
   - "14 ngày tới": ngày nào có bao nhiêu bài đến hạn.
2. Bấm **Ôn thẻ** (thanh trên cùng):
   - Đọc câu hỏi, tự trả lời trong đầu (hoặc gõ vào ô).
   - Bấm **Hiện đáp án** (hoặc phím `Space`).
   - Tự chấm: **Lại** (quên, phím 1), **Khó** (2), **Được** (3), **Dễ** (4). Chữ nhỏ dưới mỗi nút là bao lâu nữa thẻ quay lại.
   - Thẻ mới chỉ lấy từ bài đã đánh dấu học, tối đa 20 thẻ mới/ngày (đổi ở **Dữ liệu** → Cài đặt).
3. Làm các việc trong "Việc đến hạn".
4. Rảnh thì vào **Vấn đáp**: câu hỏi rút ngẫu nhiên, trộn nhiều bài, luyện giải thích to thành lời.

## Phần 5. Sao lưu tiến độ (làm mỗi tuần)

Tiến độ học (lịch ôn, thẻ, nhật ký, ghi âm) lưu **trong trình duyệt**, không nằm trong thư mục chương trình. Xóa lịch sử duyệt web, đổi trình duyệt hoặc đổi máy là mất nếu không sao lưu.

- **Sao lưu:** **Dữ liệu** → **Tải bản sao lưu** → file `dcck-tien-do-NGÀY.json` vào thư mục Downloads. Chép file này vào chỗ an toàn (Google Drive, USB).
- **Khôi phục / chuyển máy:** trên máy mới, mở chương trình → **Dữ liệu** → **Khôi phục…** → chọn file `.json`.
- Bản ghi âm không nằm trong file sao lưu: muốn giữ thì bấm **Tải** từng bản ở tab Giảng lại.
- Khi xóa dữ liệu trình duyệt (Clear browsing data), **không** tích "Cookies and other site data" nếu chưa sao lưu.

## Phần 6. Đồng bộ với tracker.py và nhật ký trong thư mục ĐCCK

Trang **Nhật ký**:

- **Tải NHAT-KY-FEYNMAN.md**: file gom mọi lỗ hổng, câu hỏi chưa trả lời, theo từng bài. Mở bằng Notepad, chép phần cần thiết vào `HOC-TAP/NHAT-KY-FEYNMAN.md` (hoặc đưa cho Cowork để bổ sung bài).
- **Đồng bộ tracker.py**: chương trình liệt kê sẵn các lệnh, ví dụ `python tracker.py learned YC-01`. Bấm **Sao chép lệnh**, mở `cmd` tại thư mục có `tracker.py`, dán (chuột phải) rồi Enter. Xong bấm **Đánh dấu đã đồng bộ**.

## Phần 7. Cập nhật khi có phiên bản chương trình mới

1. Sao lưu tiến độ (Phần 5).
2. Tải bản mới (ZIP), giải nén **đè vào đúng thư mục cũ** (chọn "Replace" khi được hỏi). File `cong-cu/cau-hinh.json` của anh sẽ bị thay: mở lại và sửa như Phần 2.
3. Chạy `cap-nhat-noi-dung.bat` để nạp lại bài.

## Phần 8. Gặp sự cố

| Hiện tượng | Cách xử lý |
|---|---|
| Bấm đúp `index.html` mở ra Notepad hoặc trình duyệt lạ | Chuột phải → Open with → Chrome. Hoặc kéo file `index.html` thả vào cửa sổ Chrome |
| Trang trắng hoặc "Đang tải…" mãi | Kiểm tra thư mục `data` có file `noi-dung.js`; chạy lại `cap-nhat-noi-dung.bat` |
| Chạy `.bat` báo "python is not recognized" hoặc mở Microsoft Store | Cài lại Python, nhớ tích "Add python.exe to PATH" (Phần 1, Bước 4) |
| Cửa sổ `.bat` báo "Không thấy thư mục" | Đường dẫn trong `cau-hinh.json` sai; mở thư mục đó trong File Explorer, chép đường dẫn trên thanh địa chỉ, đổi `\` thành `/` |
| Bài mới không hiện | Tên file phải đúng mẫu `MÃ_bai.md`, `MÃ_Handout.html`, `MÃ_anki.apkg` (mã viết hoa, gạch dưới) |
| Nhập `.apkg` báo "định dạng mới" | Trong Anki: File → Export → tích "Support older Anki versions" rồi xuất lại |
| Không ghi âm được | Bấm biểu tượng ổ khóa/micro bên trái thanh địa chỉ → cho phép Microphone; hoặc ghi âm bằng điện thoại, vẫn dùng đồng hồ của chương trình |
| Mất tiến độ | Dữ liệu → Khôi phục… từ file sao lưu gần nhất |

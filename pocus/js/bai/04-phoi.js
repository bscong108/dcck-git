/* Giai đoạn 2: Siêu âm phổi */
POCUS.them({
  id: "phoi", gd: 2, ten: "Siêu âm phổi: trượt màng phổi, đường A, đường B, tràn khí", phut: 50,
  ngan: "Đọc hệ thống ảnh giả của màng phổi để loại trừ/xác định tràn khí và nhận ra hội chứng kẽ.",
  cauHoi: ["Có tràn khí màng phổi tại vùng khám không?", "Có hội chứng kẽ (đường B) lan tỏa hai bên không?"],
  mucTieu: ["Tìm hình con dơi và đường màng phổi.", "Nhận ra trượt màng phổi trên B-mode và M-mode (bờ biển / mã vạch).", "Phân biệt đường A và đường B; đếm đường B.", "Tìm điểm phổi; biết các nguyên nhân mất trượt không phải tràn khí."],
  lyThuyet: `
<p>Phổi chứa khí nên siêu âm không xuyên vào nhu mô bình thường. Thông tin đến từ <b>đường màng phổi</b> và các <b>ảnh giả</b> nó tạo ra.</p>
<ul>
<li><b>Hình con dơi</b> (cắt dọc): hai xương sườn (cánh) với bóng lưng, đường màng phổi sáng nằm giữa, sâu hơn bề mặt xương sườn khoảng 0,5 cm ở người lớn.</li>
<li><b>Trượt màng phổi</b>: lá tạng trượt trên lá thành theo nhịp thở, thấy như đường màng phổi "lấp lánh". M-mode: phía trên màng phổi là các vạch ngang (thành ngực đứng yên), phía dưới là hạt cát: <b>dấu bờ biển</b>. Mất trượt: toàn bộ là vạch ngang: <b>dấu mã vạch</b> (tầng bình lưu).</li>
<li><b>Đường A</b>: vạch ngang lặp lại song song màng phổi ở bội số khoảng cách da – màng phổi; dưới màng phổi là khí (phổi thông khí bình thường hoặc tràn khí).</li>
<li><b>Đường B</b>: ảnh giả dạng tia laser, xuất phát từ màng phổi, chạy đến đáy màn hình không mờ dần, xóa đường A, di động theo trượt màng phổi. <b>≥ 3 đường B</b> trong một khoang liên sườn (giữa hai xương sườn, cắt dọc) là vùng dương tính (hội chứng kẽ). Đường B hợp lưu tạo "phổi trắng".</li>
<li><b>Mạch phổi (lung pulse)</b>: màng phổi rung theo nhịp tim khi không có trượt (ngừng thở, phổi không được thông khí): chứng tỏ hai lá màng phổi còn áp nhau → không tràn khí tại đó.</li>
<li><b>Điểm phổi</b>: chỗ chuyển tiếp giữa vùng có trượt và vùng không trượt, di chuyển theo nhịp thở. Độ đặc hiệu cho tràn khí khoảng 100% (Lichtenstein 2000). Vị trí điểm phổi càng ra sau – xuống dưới thì tràn khí càng lớn.</li>
</ul>
<h3>Logic chẩn đoán tràn khí màng phổi</h3>
<ol>
<li>Có trượt <b>hoặc</b> có đường B <b>hoặc</b> có mạch phổi → loại trừ tràn khí tại điểm khám.</li>
<li>Không trượt + chỉ có đường A → nghi tràn khí; tìm điểm phổi.</li>
<li>Thấy điểm phổi → xác định tràn khí.</li>
</ol>
<p><b>Mất trượt không phải tràn khí</b>: ngừng thở/thở rất nông, đặt nội khí quản vào phế quản gốc bên đối diện, dính màng phổi (sau viêm, làm dính), ARDS hoặc viêm phổi nặng, xơ phổi, kén khí lớn, sau cắt phổi.</p>`,
  chuanBi: { dauDo: "Thẳng (độ sâu 4–8 cm) để đánh giá màng phổi; cong hoặc tim (độ sâu 12–16 cm) khi đếm đường B toàn phổi.", cheDo: "Preset phổi nếu có; tắt lọc ảnh (harmonic, compound) nếu máy cho phép. Tiêu điểm ngang màng phổi.", tuThe: "Nằm ngửa (khí lên trước). Có thể nửa ngồi khi đánh giá phù phổi.", tth: ["ngua", "nuaNgoi"], khac: "" },
  buoc: [
    { ten: "Tìm hình con dơi", hinh: { than: "nguc", dd: [{ x: 70, y: 62, a: -90, n: 1 }] }, sim: { c: "phoi", p: {} },
      lam: ["Đầu dò thẳng, cắt dọc ở khoang liên sườn 2–3 đường giữa đòn, dấu về phía đầu.", "Đặt hai xương sườn ở hai bên, đường màng phổi ở giữa.", "Giảm độ sâu 4–6 cm; tiêu điểm ngang màng phổi."],
      dat: "Hai xương sườn + bóng lưng, đường màng phổi rõ ở giữa.", meo: "Không chắc đâu là màng phổi: đường sáng nằm ngay dưới mức bề mặt xương sườn." },
    { ten: "Đánh giá trượt bằng B-mode và M-mode", hinh: { than: "nguc", dd: [{ x: 70, y: 62, a: -90 }] }, sim: { c: "mPhoi", p: {} },
      lam: ["Giữ đầu dò thật yên, quan sát ít nhất 3–5 nhịp thở.", "Bật M-mode, đặt đường M giữa hai xương sườn, qua màng phổi.", "Đọc: bờ biển (có trượt) hay mã vạch (không trượt)."],
      dat: "Đường M không đi qua bóng xương sườn.", meo: "Bệnh nhân cử động/thở mạnh có thể tạo hình giả bờ biển: đối chiếu với B-mode." },
    { ten: "Tìm điểm phổi", hinh: { than: "nguc", dd: [{ x: 70, y: 62, a: -90, n: 1, mv: "truot", ten: "Vùng trước: không trượt, chỉ đường A", sim: { c: "phoi", p: { truot: false } } }, { x: 52, y: 112, a: -90, n: 2, ten: "Ra ngoài – xuống dưới: điểm phổi", sim: { c: "phoi", p: { diem: 1 } } }, { x: 30, y: 130, a: -90, n: 3, ten: "Vùng bên: phổi áp thành, trượt bình thường", sim: { c: "phoi", p: {} } }] }, sim: { c: "phoi", p: { diem: 1 } },
      lam: ["Khi không có trượt ở vùng trước: trượt đầu dò dần ra ngoài và xuống dưới theo từng khoang liên sườn.", "Dừng ở chỗ thấy trượt xuất hiện rồi mất theo nhịp thở ở cùng một vị trí.", "Ghi clip/M-mode: xen kẽ bờ biển và mã vạch."],
      dat: "Ranh giới trượt/không trượt nằm trong hình và di chuyển theo nhịp thở.", meo: "" },
    { ten: "Đếm đường B 8 vùng", hinh: { than: "nguc", dd: [{ x: 70, y: 62, a: -90, n: 1, ten: "P1 trước trên: 3 đường B (dương tính)", sim: { c: "phoi", p: { b: 3 } } }, { x: 66, y: 104, a: -90, n: 2, ten: "P2 trước dưới: 5 đường B", sim: { c: "phoi", p: { b: 5 } } }, { x: 36, y: 70, a: -90, n: 3, ten: "P3 bên trên: 4 đường B", sim: { c: "phoi", p: { b: 4 } } }, { x: 32, y: 112, a: -90, n: 4, ten: "P4 bên dưới: đường B hợp lưu", sim: { c: "phoi", p: { b: 9 } } }, { x: 130, y: 62, a: -90, n: 5, ten: "T1 trước trên: đường A, không đường B (âm tính)", sim: { c: "phoi", p: {} } }, { x: 134, y: 104, a: -90, n: 6, ten: "T2 trước dưới: 4 đường B", sim: { c: "phoi", p: { b: 4 } } }, { x: 164, y: 70, a: -90, n: 7, ten: "T3 bên trên: 3 đường B", sim: { c: "phoi", p: { b: 3 } } }, { x: 168, y: 112, a: -90, n: 8, ten: "T4 bên dưới: 6 đường B", sim: { c: "phoi", p: { b: 6 } } }] }, sim: { c: "phoi", p: { b: 4 } },
      lam: ["Ví dụ minh họa dưới đây là một bệnh nhân phù phổi: 7/8 vùng dương tính.", "Mỗi bên chia 4 vùng: trước trên, trước dưới, bên trên, bên dưới (ranh giới: đường cạnh ức – nách trước – nách sau).", "Ở mỗi vùng, đếm số đường B trong khoang liên sườn tốt nhất.", "Vùng dương tính: ≥ 3 đường B.", "Hội chứng kẽ lan tỏa: ≥ 2 vùng dương tính mỗi bên."],
      dat: "Ghi nhận bảng 8 vùng.", meo: "Dùng đầu dò cong độ sâu ~12–16 cm giúp thấy rõ đường B chạy đến đáy." },
  ],
  ketQua: [
    { ten: "Bình thường: trượt + đường A", sim: { c: "phoi", p: {} }, mo: "Phổi thông khí bình thường tại vùng khám." },
    { ten: "M-mode bờ biển", sim: { c: "mPhoi", p: {} }, mo: "Có trượt màng phổi." },
    { ten: "M-mode mã vạch", sim: { c: "mPhoi", p: { truot: false } }, mo: "Không trượt: nghi tràn khí (cần điểm phổi), hoặc nguyên nhân khác." },
    { ten: "Không trượt + đường A", sim: { c: "phoi", p: { truot: false } }, mo: "Hồ sơ A': nghi tràn khí màng phổi." },
    { ten: "Điểm phổi", sim: { c: "phoi", p: { diem: 1 } }, mo: "Xác định tràn khí." },
    { ten: "M-mode tại điểm phổi", sim: { c: "mPhoi", p: { diem: 1 } }, mo: "Bờ biển xen kẽ mã vạch theo nhịp thở." },
    { ten: "Đường B (3–4/khoang)", sim: { c: "phoi", p: { b: 4 } }, mo: "Vùng dương tính hội chứng kẽ; loại trừ tràn khí tại đây." },
    { ten: "Đường B hợp lưu", sim: { c: "phoi", p: { b: 9 } }, mo: "Phổi trắng: phù phổi nặng, ARDS, viêm phổi kẽ." },
  ],
  lamSang: `<p><b>Tràn khí màng phổi</b>: siêu âm nhạy hơn X quang ngực tư thế nằm, nhanh và làm tại giường (chấn thương, sau thủ thuật, khó thở đột ngột, sau đặt catheter tĩnh mạch trung tâm). Tràn khí áp lực là chẩn đoán lâm sàng: không trì hoãn giải áp để siêu âm.</p>
<p><b>Đường B lan tỏa hai bên</b> + khó thở cấp: gợi ý phù phổi do tim (nhất là khi kèm thất trái giảm co bóp, TMC dưới căng, đường màng phổi mịn). Đường B khu trú/một bên: viêm phổi, đụng dập phổi, xẹp phổi. ARDS: đường B không đều, vùng lành xen kẽ, màng phổi dày không đều, đông đặc dưới màng phổi.</p>
<p>Đường B giảm theo điều trị (lợi tiểu, lọc máu) và có thể theo dõi tại giường.</p>`,
  bay: ["Kết luận tràn khí chỉ dựa vào mất trượt (không tìm điểm phổi).", "Khám không đúng vùng cao nhất: ở tư thế nằm ngửa, khí tụ phía trước – dưới, cạnh tim.", "Nhầm vạch đuôi sao chổi ngắn (Z-line, không đến đáy màn) với đường B.", "Nhầm cử động thành ngực/cử động thở với trượt màng phổi.", "Dùng preset bụng có lọc ảnh làm mất đường B."],
  kiemTra: ["Tìm hình con dơi trong 10 giây.", "Dùng M-mode chứng minh trượt.", "Mô tả quy trình tìm điểm phổi.", "Hoàn thành bảng 8 vùng đường B."],
  tuKiem: [
    { q: "Điểm khám không có trượt, chỉ có đường A. Bước tiếp theo?", a: ["Kết luận tràn khí", "Tìm điểm phổi ở vùng bên/dưới", "Kết luận bình thường", "Tăng gain"], d: 1, giai: "Hồ sơ A' gợi ý tràn khí; điểm phổi xác định chẩn đoán." },
    { q: "Thấy 2 đường B ở một vùng trước. Kết luận tại vùng đó?", a: ["Vùng dương tính hội chứng kẽ", "Không tràn khí màng phổi tại đó; vùng chưa đạt ngưỡng dương tính", "Tràn khí lượng ít", "Phù phổi"], d: 1, giai: "Có đường B thì lá tạng áp lá thành → không tràn khí tại đó. Ngưỡng vùng dương tính là ≥ 3." },
    { q: "Bệnh nhân vừa đặt nội khí quản, phổi trái mất trượt nhưng thấy mạch phổi. Nghĩ gì trước?", a: ["Tràn khí màng phổi trái", "Ống nội khí quản vào phế quản gốc phải", "Phù phổi", "Bình thường"], d: 1, giai: "Mạch phổi chứng tỏ màng phổi còn áp nhau; phổi trái không được thông khí → nghĩ ống vào phế quản gốc phải." },
    { q: "Dấu mã vạch trên M-mode nghĩa là gì?", a: ["Có trượt màng phổi", "Không có trượt màng phổi tại đường M", "Có dịch màng phổi", "Có đường B"], d: 1, giai: "Mã vạch (tầng bình lưu): mất chuyển động dưới màng phổi." },
  ],
  tk: ["volpicelli", "lichtBook", "lichtLungPoint", "kirkpatrick", "noble"],
});

POCUS.them({
  id: "phoi-dich", gd: 2, ten: "Tràn dịch màng phổi và đông đặc phổi", phut: 40,
  ngan: "Xác định dịch màng phổi, ước lượng thể tích, đánh giá tính chất; nhận ra đông đặc và khí phế quản đồ động.",
  cauHoi: ["Có dịch màng phổi không, lượng bao nhiêu, đơn giản hay phức tạp?", "Có đông đặc phổi không, gợi ý viêm phổi hay xẹp phổi?"],
  mucTieu: ["Nhận diện dịch màng phổi bằng 4 dấu hiệu: ranh giới cơ hoành, dấu cột sống, mất ảnh gương, phổi xẹp bập bềnh.", "Ước lượng thể tích bằng công thức Balik.", "Phân biệt dịch đơn giản và phức tạp.", "Nhận ra đông đặc, bờ xé vụn và khí phế quản đồ động."],
  lyThuyet: `
<h3>Dịch màng phổi</h3>
<p>Khám ở điểm PLAPS (sau – bên, trên cơ hoành), cắt đứng ngang, dấu về phía đầu. Dịch là vùng trống âm (hoặc có hồi âm) phía trên cơ hoành, được giới hạn bởi cơ hoành, thành ngực và bề mặt phổi.</p>
<ul>
<li><b>Dấu cột sống</b>: thấy thân đốt sống kéo dài lên trên cơ hoành.</li>
<li><b>Mất ảnh gương</b> của gan/lách trên cơ hoành.</li>
<li><b>Phổi xẹp bập bềnh</b> trong dịch ("lưỡi" phổi đông đặc chuyển động).</li>
<li><b>Dấu hình sin</b> (M-mode): đường phổi di chuyển về phía màng phổi thành khi hít vào.</li>
<li><b>Dấu bốn cạnh</b>: dịch giới hạn bởi màng phổi thành, bóng hai xương sườn và đường phổi.</li>
</ul>
<p><b>Thể tích</b> (Balik 2006): V (mL) ≈ 20 × Sep (mm), với Sep là khoảng cách lớn nhất giữa màng phổi thành và tạng ở đáy phổi, tư thế nằm ngửa, cuối thì thở ra.</p>
<p><b>Tính chất</b>: dịch trống âm có thể là dịch thấm hoặc dịch tiết. Dịch có hồi âm xoáy, có vách, có hồi âm đồng nhất, màng phổi dày gợi ý dịch tiết, mủ hoặc máu.</p>
<h3>Đông đặc phổi</h3>
<ul>
<li><b>Hình gan hóa</b>: nhu mô phổi mất khí trông như mô gan.</li>
<li><b>Bờ xé vụn (shred sign)</b>: ranh giới sâu không đều với phổi còn khí. Đông đặc cả thùy thì bờ sâu có thể đều.</li>
<li><b>Khí phế quản đồ động</b>: chấm/vệt sáng trong vùng đông đặc di chuyển theo nhịp thở → đường thở thông, gợi ý viêm phổi, gần như loại trừ xẹp phổi do tắc nghẽn (Lichtenstein 2009). Khí phế quản đồ tĩnh gặp ở cả xẹp phổi và viêm phổi.</li>
<li><b>Dịch phế quản đồ</b>: ống trống âm phân nhánh không có dòng Doppler, gợi ý tắc nghẽn.</li>
<li>Xẹp phổi: giảm thể tích, cơ hoành nâng, cấu trúc kéo lại; thường có mạch phổi.</li>
</ul>`,
  chuanBi: { dauDo: "Cong hoặc tim.", cheDo: "Bụng hoặc phổi, độ sâu 12–18 cm.", tuThe: "Nằm ngửa: khám đường nách giữa – sau. Ngồi: khám từ phía lưng (khi chuẩn bị chọc dịch).", tth: ["ngua", "ngoiCui"], khac: "" },
  buoc: [
    { ten: "Tìm dịch ở điểm PLAPS", hinh: { than: "nguc", dd: [{ x: 28, y: 130, a: -90, n: 1, ten: "PLAPS phải: dịch trên cơ hoành, dấu cột sống", sim: { c: "ruq", p: { mp: 1 } } }, { x: 172, y: 124, a: -90, n: 2, ten: "PLAPS trái: dịch trên cơ hoành quanh lách", sim: { c: "luq", p: { mp: 1 } } }] }, sim: { c: "ruq", p: { mp: 1 } },
      lam: ["Bắt đầu như cửa sổ FAST hạ sườn, tìm cơ hoành.", "Trượt lên trên một – hai khoang liên sườn, đầu dò ra sau tối đa (sát giường).", "Xác định cơ hoành trước, rồi mới gọi tên dịch ở phía trên nó.", "Tìm dấu cột sống, phổi xẹp bập bềnh."],
      dat: "Thấy cơ hoành, gan/lách, dịch phía trên cơ hoành và nhu mô phổi.", meo: "Luôn xác định cơ hoành: dịch dưới hoành (cổ trướng, máu) dễ bị gọi nhầm là dịch màng phổi." },
    { ten: "Ước lượng thể tích", tth: ["ngua"], hinh: { than: "nguc", dd: [{ x: 28, y: 130, a: -90 }] }, sim: { c: "ruq", p: { mp: 2 } },
      lam: ["Bệnh nhân nằm ngửa, đầu dò ở đường nách sau, ngang đáy phổi.", "Cuối thì thở ra, đo khoảng cách lớn nhất giữa màng phổi thành và tạng (mm).", "Thể tích ≈ 20 × Sep (mL). Dùng công cụ tính trong ứng dụng."],
      dat: "Đo vuông góc thành ngực ở vị trí khoảng cách lớn nhất.", meo: "Công thức là ước lượng; dùng để theo dõi và quyết định, không thay đo chính xác." },
    { ten: "Đánh giá đông đặc", hinh: { than: "nguc", dd: [{ x: 30, y: 112, a: -90, n: 1 }] }, sim: { c: "dongDac", p: {} },
      lam: ["Quét các vùng trước, bên, PLAPS.", "Tìm vùng nhu mô như gan ngay dưới màng phổi.", "Quan sát khí phế quản đồ có di chuyển theo nhịp thở không.", "Dùng Doppler màu nếu thấy ống trống âm (phân biệt mạch máu và dịch phế quản đồ)."],
      dat: "Ghi clip ≥ 2 nhịp thở để đánh giá khí phế quản đồ động.", meo: "" },
  ],
  ketQua: [
    { ten: "Dịch màng phổi đơn giản", sim: { c: "ruq", p: { mp: 1 } }, mo: "Trống âm, phổi xẹp bập bềnh, dấu cột sống." },
    { ten: "Dịch có hồi âm", sim: { c: "ruq", p: { mp: 2 } }, mo: "Hồi âm lơ lửng: dịch tiết, máu, mủ." },
    { ten: "Đông đặc, khí phế quản đồ động", sim: { c: "dongDac", p: {} }, mo: "Gợi ý viêm phổi." },
    { ten: "Khí phế quản đồ tĩnh", sim: { c: "dongDac", p: { tinh: 1 } }, mo: "Gặp ở xẹp phổi hoặc viêm phổi; không đủ phân biệt." },
  ],
  lamSang: `<p>Siêu âm nhạy hơn X quang ngực trong phát hiện dịch màng phổi và đông đặc, nhất là ở tư thế nằm. Trong E-FAST, dịch trên cơ hoành ở bệnh nhân chấn thương được coi là máu cho đến khi chứng minh khác.</p>
<p>Chọc dịch màng phổi nên được hướng dẫn bằng siêu âm (BTS 2023): đánh dấu ngay trước thủ thuật, ở cùng tư thế, chọn vị trí không có phổi, cơ hoành, gan, lách, tim trên đường kim ở cả hai thì hô hấp (xem bài Chọc dịch).</p>`,
  bay: ["Gọi dịch dưới hoành là dịch màng phổi vì không xác định cơ hoành.", "Nhầm lách/gan nằm cao với đông đặc phổi.", "Đánh giá dịch 'nhiều/ít' theo cảm giác thay vì đo.", "Kết luận dịch thấm vì trống âm."],
  kiemTra: ["Xác định cơ hoành trước khi gọi tên dịch.", "Nêu 3 dấu hiệu dịch màng phổi.", "Ước lượng thể tích bằng công thức Balik.", "Mô tả khí phế quản đồ động."],
  tuKiem: [
    { q: "Sep đo được 30 mm ở đáy phổi, nằm ngửa. Thể tích ước lượng?", a: ["≈ 150 mL", "≈ 300 mL", "≈ 600 mL", "≈ 1200 mL"], d: 2, giai: "V ≈ 20 × 30 = 600 mL." },
    { q: "Khí phế quản đồ di chuyển theo nhịp thở trong vùng đông đặc gợi ý?", a: ["Xẹp phổi do tắc nghẽn", "Viêm phổi (đường thở thông)", "Tràn khí màng phổi", "Phù phổi"], d: 1, giai: "Khí phế quản đồ động gần như loại trừ xẹp phổi do tắc nghẽn." },
    { q: "Dịch màng phổi trống âm hoàn toàn. Kết luận đúng?", a: ["Chắc chắn dịch thấm", "Có thể là dịch thấm hoặc dịch tiết", "Chắc chắn mủ", "Chắc chắn máu"], d: 1, giai: "Dịch tiết cũng có thể trống âm; cần xét nghiệm dịch." },
  ],
  tk: ["volpicelli", "balik", "lichtBronch", "bts2023", "soni"],
});

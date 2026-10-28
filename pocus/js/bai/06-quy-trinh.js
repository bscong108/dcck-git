/* Giai đoạn 3: Quy trình tích hợp */
POCUS.them({
  id: "ngung-tim", gd: 3, ten: "Siêu âm trong ngừng tuần hoàn", phut: 35,
  ngan: "Tìm nguyên nhân hồi phục được và hoạt động tim, không kéo dài thời gian ngừng ép tim.",
  cauHoi: ["Có hoạt động cơ tim không (PEA thật hay giả)?", "Có ép tim, tràn khí, thất phải giãn, giảm thể tích không?", "Có rung thất sóng nhỏ không?"],
  mucTieu: ["Chuẩn bị và thực hiện khám trong khoảng dừng kiểm tra mạch ≤ 10 giây.", "Ghi clip để xem lại khi đã ép tim lại.", "Diễn giải: hoạt động tim, ép tim, thất phải giãn (và giới hạn), giảm thể tích.", "Không dùng siêu âm đơn độc để quyết định ngừng hồi sức."],
  lyThuyet: `
<p>Siêu âm trong hồi sinh tim phổi nâng cao phải tuân thủ nguyên tắc: <b>không làm dài khoảng ngừng ép tim</b>. Nghiên cứu cho thấy dùng siêu âm khi kiểm tra mạch làm khoảng dừng kéo dài hơn khuyến cáo (Huis in 't Veld 2017). Do đó cần quy trình có vai trò rõ ràng (ví dụ FEEL, CASA).</p>
<h3>Quy trình gợi ý</h3>
<ol>
<li>Trong lúc ép tim: đặt sẵn đầu dò ở dưới mũi ức (hoặc cạnh ức), chỉnh độ sâu; một người đếm thời gian to.</li>
<li>Khi dừng kiểm tra mạch: <b>bấm ghi clip ngay</b>, quan sát tối đa 10 giây (người khác bắt mạch bẹn/cảnh).</li>
<li>Hết 10 giây: ép tim lại ngay dù chưa thấy rõ. Xem lại clip trong lúc ép tim.</li>
<li>Báo cáo ngắn gọn cho trưởng nhóm: hoạt động tim có/không, dịch màng tim, thất phải.</li>
</ol>
<p>Siêu âm tim qua thực quản (khi có sẵn và được đào tạo) cho phép quan sát liên tục, đánh giá chất lượng ép tim mà không cần dừng.</p>
<h3>Diễn giải</h3>
<ul>
<li><b>Hoạt động tim</b>: bất kỳ chuyển động nào của cơ tim (không tính rung van đơn thuần, máu xoáy hay chuyển động do thở máy). Không có hoạt động tim liên quan với tiên lượng rất xấu: trong nghiên cứu REASON (Gaspari 2016), tỉ lệ sống đến ra viện ở nhóm không có hoạt động tim rất thấp (dưới 1%), nhưng không phải bằng 0. Kết hợp với các yếu tố lâm sàng và phác đồ cơ sở, không quyết định ngừng hồi sức chỉ bằng siêu âm.</li>
<li><b>PEA giả</b> (có co bóp tổ chức nhưng không bắt được mạch): tình trạng sốc rất nặng; tìm và điều trị nguyên nhân; cách xử trí (tiếp tục ép tim, thuốc vận mạch) theo phác đồ cơ sở.</li>
<li><b>Ép tim</b>: dịch màng tim kèm tim xẹp → chọc dịch màng tim dưới hướng dẫn siêu âm.</li>
<li><b>Thất phải giãn</b>: gợi ý thuyên tắc phổi, nhưng thất phải giãn rất thường gặp sau vài phút ngừng tuần hoàn do bất kỳ nguyên nhân nào → không đặc hiệu. Tìm thêm bối cảnh lâm sàng, huyết khối tĩnh mạch sâu.</li>
<li><b>Thất trái nhỏ, tăng động sau tái lập tuần hoàn/TMC dưới xẹp</b>: giảm thể tích; kết hợp FAST, ĐMC.</li>
<li><b>Rung thất sóng nhỏ</b>: cơ tim rung lăn tăn không đồng bộ → sốc điện.</li>
<li><b>Tràn khí màng phổi</b>: mất trượt hai bên hoặc một bên, phù hợp bối cảnh (chấn thương, thở máy).</li>
</ul>
<h3>Sau tái lập tuần hoàn</h3>
<p>Đánh giá co bóp thất trái/phải, dịch màng tim, vị trí ống nội khí quản (trượt màng phổi hai bên), tràn khí do ép tim/đặt catheter, TMC dưới và đáp ứng dịch.</p>`,
  chuanBi: { dauDo: "Tim (cong nếu không có).", cheDo: "Preset tim; chế độ ghi clip sẵn sàng (lùi lại/ghi hồi cứu).", tuThe: "Nằm ngửa trên nền cứng.", khac: "Phân vai: người siêu âm, người bấm giờ, người bắt mạch, trưởng nhóm quyết định." },
  buoc: [
    { ten: "Chuẩn bị trong lúc ép tim", hinh: { than: "nguc", dd: [{ x: 100, y: 124, a: 0, n: 1 }] }, sim: { c: "duoiUc", p: { ngung: "dung" } },
      lam: ["Bôi gel, đặt đầu dò dưới mũi ức khi đồng đội đang ép tim.", "Chỉnh độ sâu 20–24 cm.", "Chuẩn bị nút ghi clip.", "Thống nhất người đếm 10 giây."],
      dat: "Sẵn sàng trước thời điểm kiểm tra mạch.", meo: "Không lấy được dưới mũi ức: dùng cạnh ức trục dọc (không cản trở ép tim nếu ép đúng vị trí)." },
    { ten: "Khám trong 10 giây", hinh: { than: "nguc", dd: [{ x: 100, y: 124, a: 0 }] }, sim: { c: "duoiUc", p: { ngung: "yeu" } },
      lam: ["Dừng ép: ghi clip ngay.", "Nhìn: cơ tim co? dịch quanh tim? thất phải?", "Đếm to: 10 giây là ép lại ngay.", "Xem lại clip trong khi ép tim và báo cáo."],
      dat: "Khoảng dừng ≤ 10 giây.", meo: "" },
  ],
  ketQua: [
    { ten: "Tim đứng yên", sim: { c: "duoiUc", p: { ngung: "dung" } }, mo: "Không có hoạt động cơ tim; máu ứ có thể xoáy chậm (không tính là hoạt động)." },
    { ten: "Co bóp yếu (PEA giả)", sim: { c: "duoiUc", p: { ngung: "yeu" } }, mo: "Có co bóp tổ chức nhưng không bắt được mạch." },
    { ten: "Rung thất sóng nhỏ", sim: { c: "duoiUc", p: { ngung: "rung" } }, mo: "Cơ tim rung lăn tăn, không co bóp tổ chức → sốc điện." },
    { ten: "Ép tim", sim: { c: "duoiUc", p: { dich: 2, chen: 1 } }, mo: "Dịch lớn, buồng tim phải xẹp → chọc dịch." },
  ],
  lamSang: `<p>Siêu âm là một công cụ trong ACLS, không phải trung tâm. Ưu tiên luôn là ép tim chất lượng cao và sốc điện sớm. Các phát hiện có giá trị hành động lớn nhất: <b>ép tim</b>, <b>tràn khí màng phổi</b>, <b>rung thất sóng nhỏ</b>, <b>có/không hoạt động tim</b> (kết hợp với bối cảnh để quyết định).</p>`,
  bay: ["Kéo dài khoảng dừng để 'tìm hình đẹp'.", "Nhầm chuyển động do thở máy hoặc rung van là hoạt động tim.", "Coi thất phải giãn là thuyên tắc phổi.", "Kết luận tim đứng yên khi mặt cắt kém hoặc gain thấp.", "Dùng siêu âm đơn độc để ngừng hồi sức."],
  kiemTra: ["Thực hiện mô phỏng ngừng tuần hoàn với khoảng dừng ≤ 10 giây.", "Ghi và xem lại clip trong lúc ép tim.", "Báo cáo theo mẫu ngắn."],
  tuKiem: [
    { q: "Thời gian tối đa của khoảng dừng ép tim để kiểm tra mạch kèm siêu âm?", a: ["5 giây", "10 giây", "20 giây", "Không giới hạn nếu đang thấy hình"], d: 1, giai: "≤ 10 giây; ghi clip để xem lại." },
    { q: "Thất phải giãn ở bệnh nhân ngừng tuần hoàn 15 phút. Kết luận?", a: ["Chắc chắn thuyên tắc phổi, tiêu sợi huyết", "Không đặc hiệu; kết hợp bối cảnh lâm sàng", "Ép tim", "Giảm thể tích"], d: 1, giai: "Thất phải giãn thường gặp trong ngừng tuần hoàn kéo dài do mọi nguyên nhân." },
    { q: "Màn hình monitor: vô tâm thu. Siêu âm: cơ tim rung lăn tăn không đồng bộ. Xử trí?", a: ["Adrenalin và tiếp tục", "Sốc điện (rung thất sóng nhỏ)", "Chọc dịch màng tim", "Ngừng hồi sức"], d: 1, giai: "Rung thất sóng nhỏ có thể không thấy trên monitor." },
  ],
  tk: ["gaspari", "huis", "breitkreutz", "acep", "soni"],
});

POCUS.them({
  id: "rush", gd: 3, ten: "Sốc không rõ nguyên nhân: RUSH (Bơm – Bể – Ống)", phut: 45,
  ngan: "Khám theo thứ tự tim → thể tích → mạch máu để phân loại sốc trong vài phút.",
  cauHoi: ["Sốc thuộc loại nào: giảm thể tích, tim, tắc nghẽn, phân bố?", "Có nguyên nhân cần can thiệp ngay không (ép tim, tràn khí, phình vỡ, chảy máu)?"],
  mucTieu: ["Thực hiện RUSH theo thứ tự Bơm – Bể – Ống.", "Ghép các phát hiện thành kiểu hình sốc.", "Hiểu giá trị và giới hạn: định hướng chẩn đoán, không thay thế đánh giá lâm sàng."],
  lyThuyet: `
<p>RUSH (Rapid Ultrasound in SHock, Perera 2010) chia khám thành ba phần:</p>
<div class="bang-wrap"><table>
<tr><th>Phần</th><th>Khám</th><th>Tìm</th></tr>
<tr><td><b>Bơm</b> (tim)</td><td>Dưới mũi ức, cạnh ức, mỏm</td><td>Dịch màng tim/ép tim; co bóp thất trái; kích thước thất phải</td></tr>
<tr><td><b>Bể</b> (thể tích)</td><td>TMC dưới; E-FAST (ổ bụng, màng phổi); phổi (đường B, tràn khí)</td><td>Áp lực đổ đầy; mất máu/dịch tự do; phù phổi; tràn khí áp lực</td></tr>
<tr><td><b>Ống</b> (mạch máu)</td><td>ĐMC (gốc ở cạnh ức, bụng); tĩnh mạch đùi, khoeo</td><td>Phình/tách ĐMC; huyết khối tĩnh mạch sâu</td></tr>
</table></div>
<h3>Kiểu hình sốc</h3>
<div class="bang-wrap"><table>
<tr><th></th><th>Giảm thể tích</th><th>Sốc tim</th><th>Tắc nghẽn</th><th>Phân bố</th></tr>
<tr><td>Bơm</td><td>Tăng động, buồng nhỏ</td><td>Giảm co bóp, giãn</td><td>Ép tim (dịch + xẹp buồng phải); thất phải giãn (thuyên tắc phổi)</td><td>Tăng động (sớm) hoặc giảm (nhiễm khuẩn muộn)</td></tr>
<tr><td>Bể</td><td>TMC dưới nhỏ, xẹp; dịch tự do (máu); phổi khô</td><td>TMC dưới căng; đường B lan tỏa; dịch màng phổi</td><td>TMC dưới căng; mất trượt màng phổi (tràn khí)</td><td>TMC dưới bình thường/nhỏ; ổ nhiễm (đông đặc phổi, dịch ổ bụng)</td></tr>
<tr><td>Ống</td><td>Phình ĐMC bụng (vỡ), tách ĐMC</td><td>Bình thường</td><td>Huyết khối tĩnh mạch sâu</td><td>Bình thường</td></tr>
</table></div>
<p>Thử nghiệm ngẫu nhiên SHoC-ED (Atkinson 2018) ở bệnh nhân tụt huyết áp không rõ nguyên nhân tại cấp cứu không cho thấy siêu âm theo quy trình cải thiện tử vong. Giá trị của RUSH nằm ở việc <b>định hướng chẩn đoán nhanh</b> và phát hiện các nguyên nhân cần can thiệp ngay; kết quả phải được tích hợp với lâm sàng.</p>
<p>Các quy trình tương tự: ACES, SIMPLE, FALLS (Lichtenstein: truyền dịch có giới hạn theo đường B), SESAME.</p>`,
  chuanBi: { dauDo: "Tim (cho tim, phổi sâu, TMC dưới, bụng); thẳng cho màng phổi và tĩnh mạch.", cheDo: "Chuyển preset theo vùng nếu có thời gian.", tuThe: "Nằm ngửa.", khac: "Làm song song với hồi sức; lặp lại sau mỗi can thiệp." },
  buoc: [
    { ten: "Bơm: tim", hinh: { than: "nguc", dd: [{ x: 100, y: 124, a: 0, n: 1 }, { x: 112, y: 78, a: -140, n: 2 }, { x: 142, y: 98, a: 0, n: 3 }] }, sim: { c: "canhUcDoc", p: { ef: "tang" } },
      lam: ["Dưới mũi ức: dịch màng tim?", "Cạnh ức trục dọc: co bóp thất trái (tăng/bình thường/giảm), gốc ĐMC (&gt; 4 cm gợi ý bệnh ĐMC ngực).", "Mỏm 4 buồng: thất phải so với thất trái."],
      dat: "", meo: "" },
    { ten: "Bể: thể tích và các khoang", hinh: { than: "nguc", dd: [{ x: 104, y: 130, a: -90, n: 1 }, { x: 30, y: 142, a: -90, n: 2 }, { x: 170, y: 120, a: -90, n: 3 }, { x: 100, y: 222, a: -90, n: 4 }, { x: 70, y: 62, a: -90, n: 5 }, { x: 130, y: 62, a: -90, n: 6 }] }, sim: { c: "ivc", p: { kieu: "xep" } },
      lam: ["TMC dưới: kích thước, mức xẹp.", "E-FAST: dịch ổ bụng, dịch màng phổi.", "Phổi trước: trượt màng phổi (tràn khí), đường B (phù phổi)."],
      dat: "", meo: "" },
    { ten: "Ống: mạch máu", hinh: { than: "nguc", dd: [{ x: 100, y: 128, a: 180, n: 1 }, { x: 100, y: 170, a: 180, n: 2 }] }, sim: { c: "dmc", p: {} },
      lam: ["ĐMC bụng từ mũi ức đến chỗ chia đôi.", "Ép tĩnh mạch đùi chung và khoeo hai bên."],
      dat: "", meo: "" },
  ],
  ketQua: [
    { ten: "Bơm tăng động", sim: { c: "canhUcDoc", p: { ef: "tang" } }, mo: "Giảm thể tích hoặc phân bố." },
    { ten: "Bơm yếu", sim: { c: "canhUcDoc", p: { ef: "giam" } }, mo: "Sốc tim." },
    { ten: "Ép tim", sim: { c: "duoiUc", p: { dich: 2, chen: 1 } }, mo: "Sốc tắc nghẽn." },
    { ten: "Thất phải giãn", sim: { c: "mom4", p: { rv: 1 } }, mo: "Gợi ý thuyên tắc phổi." },
    { ten: "TMC dưới xẹp", sim: { c: "ivc", p: { kieu: "xep" } }, mo: "Áp lực đổ đầy thấp." },
    { ten: "TMC dưới căng", sim: { c: "ivc", p: { kieu: "gian" } }, mo: "Tắc nghẽn hoặc sốc tim." },
    { ten: "Phổi B lan tỏa", sim: { c: "phoi", p: { b: 6 } }, mo: "Phù phổi: thận trọng truyền dịch." },
    { ten: "Phình ĐMC", sim: { c: "dmc", p: { phinh: 1 } }, mo: "Nghi vỡ phình." },
  ],
  lamSang: `<p>Báo cáo theo câu: "Bơm …, Bể …, Ống … → kiểu hình sốc … → hành động …". Lặp lại RUSH sau mỗi can thiệp lớn (bolus dịch, vận mạch, chọc dịch) để xem đáp ứng.</p>`,
  bay: ["Dừng khám khi thấy phát hiện đầu tiên (sốc thường có nhiều cơ chế phối hợp).", "Dùng TMC dưới đơn độc để quyết định truyền dịch.", "Bỏ qua phần 'Ống' ở người cao tuổi.", "Không lặp lại sau can thiệp."],
  kiemTra: ["Thực hiện RUSH trên người mẫu trong 6–8 phút.", "Ghép 3 bộ phát hiện mẫu thành kiểu hình sốc.", "Báo cáo theo mẫu Bơm – Bể – Ống."],
  tuKiem: [
    { q: "Tim tăng động, TMC dưới xẹp, dịch khoang Morison. Kiểu hình?", a: ["Sốc tim", "Giảm thể tích do mất máu", "Tắc nghẽn", "Phân bố"], d: 1, giai: "Bơm tăng động + bể rỗng + dịch tự do: mất máu trong ổ bụng." },
    { q: "Thất trái giảm nặng, TMC dưới căng, đường B lan tỏa hai bên. Kiểu hình?", a: ["Sốc tim", "Giảm thể tích", "Phân bố", "Tràn khí áp lực"], d: 0, giai: "Bơm yếu + bể đầy + phổi ướt." },
    { q: "Kết quả chính của thử nghiệm SHoC-ED (Atkinson 2018)?", a: ["Giảm tử vong rõ", "Không thấy cải thiện tử vong khi dùng siêu âm theo quy trình", "Tăng tử vong", "Chưa có kết quả"], d: 1, giai: "Không khác biệt tử vong; siêu âm vẫn có giá trị định hướng chẩn đoán." },
  ],
  tk: ["rush", "atkinson", "mateer", "soni"],
});

POCUS.them({
  id: "blue", gd: 3, ten: "Suy hô hấp cấp: quy trình BLUE", phut: 40,
  ngan: "Ba điểm BLUE mỗi bên + tĩnh mạch → hồ sơ → chẩn đoán nguyên nhân suy hô hấp.",
  cauHoi: ["Nguyên nhân suy hô hấp cấp là phù phổi, viêm phổi, thuyên tắc phổi, COPD/hen hay tràn khí?"],
  mucTieu: ["Xác định điểm BLUE trên, điểm BLUE dưới, điểm PLAPS.", "Gọi tên các hồ sơ A, A', B, B', A/B, C.", "Đi theo cây quyết định BLUE.", "Kết hợp với siêu âm tim để tăng độ chính xác."],
  lyThuyet: `
<p>Quy trình BLUE (Lichtenstein 2008) dùng cho bệnh nhân suy hô hấp cấp: nghiên cứu ban đầu ở 260 bệnh nhân hồi sức cho độ chính xác chẩn đoán khoảng 90%.</p>
<h3>Vị trí khám</h3>
<p>Đặt hai bàn tay (cỡ tay bệnh nhân) lên ngực: ngón út tay trên chạm xương đòn, các ngón tay không tính ngón cái. <b>Điểm BLUE trên</b>: giữa gốc ngón 3–4 của tay trên. <b>Điểm BLUE dưới</b>: giữa lòng bàn tay dưới. <b>Điểm PLAPS</b>: giao của đường ngang qua điểm BLUE dưới với đường nách sau.</p>
<h3>Hồ sơ</h3>
<div class="bang-wrap"><table>
<tr><th>Hồ sơ</th><th>Định nghĩa</th></tr>
<tr><td>A</td><td>Trượt màng phổi + đường A ở vùng trước hai bên</td></tr>
<tr><td>A'</td><td>Mất trượt + đường A</td></tr>
<tr><td>B</td><td>Trượt + đường B lan tỏa vùng trước hai bên</td></tr>
<tr><td>B'</td><td>Đường B nhưng mất trượt</td></tr>
<tr><td>A/B</td><td>Đường B một bên, đường A bên kia</td></tr>
<tr><td>C</td><td>Đông đặc vùng trước</td></tr>
</table></div>
<h3>Cây quyết định</h3>
<div class="cay">
<div><b>Hồ sơ B</b> → phù phổi huyết động</div>
<div><b>Hồ sơ B', A/B, C</b> → viêm phổi</div>
<div><b>Hồ sơ A'</b> → tìm điểm phổi → có: tràn khí màng phổi (không có: cần đánh giá thêm)</div>
<div><b>Hồ sơ A</b> → siêu âm tĩnh mạch sâu:
  <div>có huyết khối → thuyên tắc phổi</div>
  <div>không → tìm PLAPS (đông đặc/dịch sau – bên):
    <div>có → viêm phổi</div>
    <div>không ("hồ sơ trần") → COPD/hen</div>
  </div>
</div>
</div>
<p>Kết hợp siêu âm tim (thất trái, thất phải, dịch màng tim, TMC dưới) giúp phân biệt phù phổi do tim với nguyên nhân khác của đường B (ARDS, viêm phổi kẽ).</p>`,
  chuanBi: { dauDo: "Cong hoặc tim (Lichtenstein dùng đầu dò vi lồi); thẳng cho màng phổi khi cần.", cheDo: "Phổi; không lọc ảnh.", tuThe: "Nửa ngồi hoặc nằm, không di chuyển bệnh nhân nặng.", khac: "Thời gian mục tiêu < 3 phút." },
  buoc: [
    { ten: "Điểm BLUE trên và dưới hai bên", hinh: { than: "nguc", dd: [{ x: 70, y: 60, a: -90, n: 1 }, { x: 64, y: 104, a: -90, n: 2 }, { x: 130, y: 60, a: -90, n: 1, nx: 0 }, { x: 136, y: 104, a: -90, n: 2 }] }, sim: { c: "phoi", p: {} },
      lam: ["Xác định điểm bằng hai bàn tay.", "Ở mỗi điểm: trượt? đường A hay B? đông đặc?", "Ghi hồ sơ vùng trước hai bên."],
      dat: "", meo: "" },
    { ten: "Siêu âm tĩnh mạch (khi hồ sơ A)", hinh: { than: "chan", dd: [{ x: 62, y: 70, a: 180, n: 1 }, { x: 138, y: 70, a: 180, n: 2 }] }, sim: { c: "dvt", p: { hk: 1 } },
      lam: ["Ép tĩnh mạch đùi chung, đùi, khoeo hai bên."],
      dat: "", meo: "" },
    { ten: "Điểm PLAPS", hinh: { than: "nguc", dd: [{ x: 26, y: 110, a: -90, n: 3 }, { x: 174, y: 110, a: -90, n: 3 }] }, sim: { c: "dongDac", p: {} },
      lam: ["Đường nách sau ngang điểm BLUE dưới, đầu dò hướng ra sau.", "Tìm đông đặc hoặc dịch màng phổi."],
      dat: "", meo: "Ở bệnh nhân nằm, luồn đầu dò sát giường." },
  ],
  ketQua: [
    { ten: "Hồ sơ A", sim: { c: "phoi", p: {} }, mo: "Tiếp tục với tĩnh mạch và PLAPS." },
    { ten: "Hồ sơ B", sim: { c: "phoi", p: { b: 5 } }, mo: "Hai bên: phù phổi huyết động." },
    { ten: "Hồ sơ A'", sim: { c: "phoi", p: { truot: false } }, mo: "Tìm điểm phổi." },
    { ten: "Hồ sơ C / PLAPS", sim: { c: "dongDac", p: {} }, mo: "Viêm phổi." },
  ],
  lamSang: `<p>BLUE trả lời nhanh câu hỏi nguyên nhân; kết quả cần đối chiếu bệnh sử, khám, khí máu, X quang, siêu âm tim. Ví dụ: hồ sơ B + thất trái giảm co bóp + TMC dưới căng → phù phổi cấp do tim: nitrat, lợi tiểu, thông khí không xâm nhập. Hồ sơ A + huyết khối tĩnh mạch sâu + thất phải giãn → thuyên tắc phổi.</p>`,
  bay: ["Chỉ khám một bên rồi gọi tên hồ sơ.", "Gọi hồ sơ B khi chỉ có vài đường B ở vùng thấp (có thể bình thường ở vùng đáy).", "Bỏ qua bước tĩnh mạch khi hồ sơ A.", "Áp dụng máy móc ở bệnh nhân nhiều bệnh phối hợp."],
  kiemTra: ["Xác định 3 điểm BLUE trên người mẫu.", "Gọi tên hồ sơ từ 6 clip.", "Vẽ lại cây quyết định từ trí nhớ."],
  tuKiem: [
    { q: "Hồ sơ A hai bên, không huyết khối tĩnh mạch, PLAPS có đông đặc. Chẩn đoán theo BLUE?", a: ["COPD/hen", "Viêm phổi", "Thuyên tắc phổi", "Phù phổi"], d: 1, giai: "Hồ sơ A + không DVT + PLAPS (+) → viêm phổi." },
    { q: "Hồ sơ A, không huyết khối tĩnh mạch, không PLAPS?", a: ["Viêm phổi", "COPD/hen", "Tràn khí", "Phù phổi"], d: 1, giai: "'Hồ sơ trần' → COPD hoặc hen." },
    { q: "Đường B một bên, đường A bên kia (A/B)?", a: ["Phù phổi", "Viêm phổi", "Thuyên tắc phổi", "Bình thường"], d: 1, giai: "Hồ sơ A/B gợi ý viêm phổi." },
  ],
  tk: ["blue", "lichtBook", "volpicelli"],
});

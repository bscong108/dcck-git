/* Giai đoạn 4: Thủ thuật và mở rộng */
POCUS.them({
  id: "mach-mau", gd: 4, ten: "Đặt đường truyền dưới hướng dẫn siêu âm", phut: 45,
  ngan: "Catheter tĩnh mạch cảnh trong theo thời gian thực; đường truyền ngoại vi khó.",
  cauHoi: ["Tĩnh mạch đích ở đâu, bao sâu, có huyết khối không, động mạch nằm đâu?", "Đầu kim đang ở đâu?", "Dây dẫn đã nằm trong tĩnh mạch chưa?"],
  mucTieu: ["Khảo sát trước thủ thuật: phân biệt tĩnh mạch – động mạch.", "Theo dõi đầu kim ngoài mặt phẳng (trục ngắn) và trong mặt phẳng (trục dọc).", "Xác nhận dây dẫn trong tĩnh mạch trước khi nong.", "Kiểm tra sau thủ thuật: tràn khí màng phổi, vị trí catheter."],
  lyThuyet: `
<p>Hướng dẫn siêu âm thời gian thực khi đặt catheter tĩnh mạch cảnh trong giảm tỉ lệ thất bại, số lần chọc và chọc nhầm động mạch so với dùng mốc giải phẫu (tổng quan Cochrane, Brass 2015).</p>
<div class="bang-wrap"><table>
<tr><th></th><th>Tĩnh mạch cảnh trong</th><th>Động mạch cảnh chung</th></tr>
<tr><td>Vị trí</td><td>Ngoài, thường trước – ngoài</td><td>Trong, sâu hơn</td></tr>
<tr><td>Hình dạng</td><td>Bầu dục/tam giác, thay đổi theo hô hấp, to lên khi Valsalva/Trendelenburg</td><td>Tròn, đập</td></tr>
<tr><td>Ép</td><td>Xẹp dễ</td><td>Không xẹp</td></tr>
<tr><td>Thành</td><td>Mỏng</td><td>Dày, sáng</td></tr>
</table></div>
<h3>Hai kỹ thuật</h3>
<ul>
<li><b>Ngoài mặt phẳng (trục ngắn)</b>: thấy cả động mạch và tĩnh mạch; kim hiện là một <b>chấm sáng</b>. Nguy cơ: chấm sáng có thể là thân kim, đầu kim đã đi xa hơn (xuyên thành sau). Khắc phục: kỹ thuật <b>"đi bộ" theo đầu kim</b>: trượt đầu dò ra trước một chút đến khi chấm biến mất, đẩy kim đến khi chấm hiện lại, lặp lại.</li>
<li><b>Trong mặt phẳng (trục dọc)</b>: thấy toàn bộ thân và đầu kim; khó giữ kim trong mặt phẳng mỏng của chùm âm.</li>
<li>Mặt cắt chéo kết hợp ưu điểm của cả hai.</li>
</ul>
<p>Dấu hiệu kim vào: thành trước tĩnh mạch bị <b>đẩy lõm</b> (lều) rồi bật lại khi kim xuyên qua.</p>`,
  chuanBi: { dauDo: "Thẳng tần số cao.", cheDo: "Mạch máu, độ sâu 3–4 cm.", tuThe: "Trendelenburg 10–15°, đầu quay nhẹ sang bên đối diện (≤ 30°, quay nhiều làm tĩnh mạch chồng lên động mạch).", tth: ["trend"], khac: "Vô khuẩn tối đa, bọc đầu dò vô khuẩn dài, gel vô khuẩn trong và ngoài bọc. Màn hình đặt thẳng tầm nhìn người làm, phía bên kia bệnh nhân." },
  buoc: [
    { ten: "Khảo sát trước", tth: ["trend"], hinh: { than: "co", dd: [{ x: 84, y: 160, a: 180, n: 1 }] }, sim: { c: "tmCanh", p: {} },
      lam: ["Cắt ngang ở đỉnh tam giác hai bó cơ ức đòn chũm, dấu đầu dò về phía trái màn hình tương ứng tay trái người làm.", "Xác định TM cảnh trong và ĐM cảnh: ép, xem đập, Doppler màu nếu cần.", "Trượt dọc cổ tìm đoạn TM to nhất, không nằm đè lên ĐM, không có huyết khối.", "Đo độ sâu thành trước và đường kính TM."],
      dat: "TM lớn, nằm ngoài ĐM, không huyết khối.", meo: "TM nhỏ: tăng Trendelenburg, Valsalva (nếu bệnh nhân hợp tác), cân nhắc bên đối diện." },
    { ten: "Chọc kim ngoài mặt phẳng", hinh: { than: "co", dd: [{ x: 84, y: 160, a: 180 }] }, sim: { c: "tmCanh", p: { kim: "ngang" } },
      lam: ["Đặt TM ở giữa màn hình (giữa màn = giữa mặt đầu dò).", "Đâm kim ở đường giữa đầu dò, cách đầu dò khoảng bằng độ sâu TM, góc khoảng 45°.", "Tìm chấm sáng đầu kim, 'đi bộ' theo đầu kim xuống TM.", "Thấy thành trước lõm rồi bật lại; hút ra máu đỏ sẫm không phun."],
      dat: "Luôn thấy đầu kim, không phải thân kim.", meo: "Không thấy kim: lắc nhẹ đầu dò về phía kim, không đẩy kim mù." },
    { ten: "Trong mặt phẳng và xác nhận dây dẫn", hinh: { than: "co", dd: [{ x: 84, y: 160, a: -90, n: 2 }] }, sim: { c: "tmCanh", p: { kim: "doc" } },
      lam: ["Xoay đầu dò dọc theo TM.", "Giữ kim nằm trong mặt phẳng đầu dò: thấy cả thân và đầu kim.", "Sau khi luồn dây dẫn: <b>thấy dây dẫn trong lòng TM trên cả trục ngắn và trục dọc</b> trước khi nong.", "Sau đặt: khám trượt màng phổi hai bên; có thể làm test bọt nước muối (bơm nhanh nước muối, thấy bọt vào nhĩ phải ở dưới mũi ức trong vòng khoảng 2 giây)."],
      dat: "Dây dẫn nằm trong TM, không trong ĐM.", meo: "" },
  ],
  ketQua: [
    { ten: "TM cảnh trong và ĐM cảnh", sim: { c: "tmCanh", p: {} }, mo: "TM bầu dục bên ngoài, ĐM tròn đập bên trong." },
    { ten: "Đầu kim trục ngắn", sim: { c: "tmCanh", p: { kim: "ngang" } }, mo: "Chấm sáng đi xuống, lõm thành trước rồi vào lòng mạch." },
    { ten: "Kim trục dọc", sim: { c: "tmCanh", p: { kim: "doc" } }, mo: "Thấy toàn bộ kim tiến vào lòng TM." },
  ],
  lamSang: `<p><b>Đường truyền ngoại vi khó</b>: tìm TM nền hoặc TM cánh tay ở cánh tay (độ sâu khoảng 0,3–1,5 cm), tránh ĐM cánh tay và thần kinh giữa đi kèm TM cánh tay. Dùng catheter dài hơn bình thường để phần nằm trong lòng mạch đủ dài (thường khuyên ít nhất khoảng 2/3 chiều dài catheter nằm trong mạch), giảm tuột ra ngoài.</p>
<p><b>Catheter động mạch quay</b>: cắt ngang tìm ĐM quay ở cổ tay, kỹ thuật tương tự.</p>`,
  bay: ["Nhầm thân kim là đầu kim → xuyên thành sau, chọc ĐM.", "Quay đầu quá nhiều làm TM chồng lên ĐM.", "Không kiểm tra dây dẫn trước khi nong.", "Mất vô khuẩn khi chạm đầu dò.", "Không khám tràn khí sau thủ thuật."],
  kiemTra: ["Khảo sát và đánh dấu TM cảnh trên người mẫu.", "Trên mô hình (phantom): theo dõi đầu kim liên tục bằng cả hai kỹ thuật.", "Xác nhận dây dẫn ở hai mặt cắt."],
  tuKiem: [
    { q: "Nguy cơ chính của kỹ thuật ngoài mặt phẳng?", a: ["Không thấy động mạch", "Chấm sáng có thể là thân kim, đầu kim đã đi sâu hơn", "Kim quá sáng", "Không có"], d: 1, giai: "Phải theo dõi đầu kim bằng cách trượt đầu dò theo." },
    { q: "Bước bắt buộc trước khi nong?", a: ["Chụp X quang", "Xác nhận dây dẫn trong lòng tĩnh mạch trên siêu âm", "Đo áp lực", "Bơm thuốc"], d: 1, giai: "Xác nhận dây dẫn trong TM ở trục ngắn và trục dọc giúp tránh nong vào động mạch." },
  ],
  tk: ["brass", "soni", "mateer"],
});

POCUS.them({
  id: "choc-dich", gd: 4, ten: "Chọc dịch màng phổi, màng bụng, màng tim dưới hướng dẫn siêu âm", phut: 35,
  ngan: "Chọn điểm chọc an toàn, tránh tạng và mạch máu, kiểm tra sau thủ thuật.",
  cauHoi: ["Túi dịch ở đâu, sâu bao nhiêu, có tạng hoặc mạch máu trên đường kim không?"],
  mucTieu: ["Đánh dấu vị trí chọc dịch màng phổi, màng bụng ở đúng tư thế làm thủ thuật.", "Dùng Doppler màu tìm mạch máu thành bụng/thành ngực.", "Chọn đường vào chọc dịch màng tim theo vị trí túi dịch."],
  lyThuyet: `
<h3>Màng phổi</h3>
<ul>
<li>Đánh dấu ngay trước thủ thuật, ở <b>đúng tư thế</b> sẽ làm (thường ngồi cúi về trước hoặc nằm nghiêng), BTS 2023 khuyến cáo dùng siêu âm.</li>
<li>Chọn khoang liên sườn có túi dịch đủ sâu, không có phổi, cơ hoành, gan, lách, tim trên đường kim ở <b>cả hai thì hô hấp</b>.</li>
<li>Đâm sát bờ trên xương sườn dưới (bó mạch – thần kinh liên sườn chạy ở bờ dưới xương sườn); ở người cao tuổi ĐM liên sườn có thể ngoằn ngoèo: dùng Doppler màu.</li>
<li>Sau thủ thuật: kiểm tra trượt màng phổi (tràn khí) và lượng dịch còn lại.</li>
</ul>
<h3>Màng bụng</h3>
<ul>
<li>Thường ở hố chậu trái, ngoài cơ thẳng bụng; tránh <b>ĐM thượng vị dưới</b> (dùng Doppler màu/đầu dò thẳng tìm), tránh quai ruột dính, bàng quang, gan/lách to.</li>
<li>Chọn túi dịch sâu, quai ruột không nằm trên đường kim.</li>
</ul>
<h3>Màng ngoài tim</h3>
<ul>
<li>Chọn đường vào nơi <b>túi dịch lớn nhất, gần da nhất</b>, không có cấu trúc quan trọng trên đường kim: cạnh ức, mỏm hoặc dưới mũi ức.</li>
<li>Đường cạnh ức: chú ý ĐM ngực trong chạy dọc cách bờ xương ức khoảng 1–2 cm (xác định bằng Doppler màu).</li>
<li>Theo dõi kim trong mặt phẳng; xác nhận đầu kim/catheter trong khoang màng tim bằng bơm nước muối khuấy (thấy bọt trong khoang dịch).</li>
</ul>`,
  chuanBi: { dauDo: "Cong/tim để tìm túi dịch; thẳng để tìm mạch máu thành bụng/ngực và theo dõi kim nông.", cheDo: "Bụng/phổi; Doppler màu.", tuThe: "Đúng tư thế làm thủ thuật: màng phổi ngồi cúi ra trước; màng bụng nằm ngửa hoặc nghiêng nhẹ; màng tim nửa ngồi 30–45°.", tth: ["ngoiCui", "ngua", "nuaNgoi"], khac: "Vô khuẩn; bọc đầu dò nếu hướng dẫn thời gian thực." },
  buoc: [
    { ten: "Đánh dấu chọc dịch màng phổi", tth: ["ngoiCui"], hinh: { than: "nguc", dd: [{ x: 28, y: 126, a: -90, n: 1 }] }, sim: { c: "ruq", p: { mp: 1 } },
      lam: ["Bệnh nhân ngồi cúi về trước (hoặc nằm nghiêng).", "Tìm cơ hoành, gan/lách, túi dịch lớn nhất.", "Quan sát cơ hoành qua cả hai thì thở; chọn khoang trên mức cơ hoành lên cao nhất.", "Đo độ sâu đến màng phổi thành và độ dày túi dịch; đánh dấu, không để bệnh nhân đổi tư thế."],
      dat: "Túi dịch đủ sâu, không tạng trên đường kim ở cả hai thì thở.", meo: "" },
    { ten: "Đánh dấu chọc dịch màng bụng", hinh: { than: "nguc", dd: [{ x: 150, y: 192, a: -90, n: 2 }] }, sim: { c: "chau", p: { dich: 2, nu: 1 } },
      lam: ["Quét hai hố chậu, tìm túi dịch sâu nhất ngoài cơ thẳng bụng.", "Đầu dò thẳng + Doppler màu: tìm ĐM thượng vị dưới.", "Kiểm tra quai ruột không dính thành bụng tại điểm chọc."],
      dat: "", meo: "" },
    { ten: "Chọn đường chọc màng tim", hinh: { than: "nguc", dd: [{ x: 100, y: 124, a: 0, n: 1, ten: "Dưới mũi ức: đo khoảng da – dịch", sim: { c: "duoiUc", p: { dich: 2, chen: 1 } } }, { x: 116, y: 82, a: -140, n: 2, ten: "Cạnh ức: dịch trước tim", sim: { c: "canhUcDoc", p: { dich: 1 } } }, { x: 142, y: 98, a: 0, n: 3, ten: "Mỏm: dịch quanh mỏm", sim: { c: "mom4", p: { dich: 1 } } }] }, sim: { c: "duoiUc", p: { dich: 2, chen: 1 } },
      lam: ["Khám dưới mũi ức, cạnh ức, mỏm: nơi dịch dày nhất gần da nhất.", "Ước lượng độ sâu và góc kim.", "Ở cạnh ức: Doppler màu tìm ĐM ngực trong."],
      dat: "", meo: "" },
  ],
  ketQua: [
    { ten: "Túi dịch màng phổi", sim: { c: "ruq", p: { mp: 1 } }, mo: "Dịch trên cơ hoành, phổi xẹp bập bềnh." },
    { ten: "Dịch ổ bụng nhiều", sim: { c: "chau", p: { dich: 2, nu: 1 } }, mo: "Quai ruột bập bềnh trong dịch." },
  ],
  lamSang: `<p>Siêu âm giảm biến chứng (tràn khí, chọc vào tạng, chảy máu) và tăng tỉ lệ thành công. Với bệnh nhân rối loạn đông máu, siêu âm giúp chọn điểm tránh mạch máu thành ngực/bụng.</p>`,
  bay: ["Đánh dấu ở tư thế khác với tư thế làm thủ thuật.", "Chỉ đánh giá một thì thở.", "Không tìm mạch máu thành bụng/thành ngực.", "Chọn đường dưới mũi ức theo thói quen dù dịch ở đó mỏng."],
  kiemTra: ["Đánh dấu điểm chọc dịch màng phổi trên người mẫu ngồi.", "Tìm ĐM thượng vị dưới bằng Doppler màu.", "Nêu tiêu chí chọn đường chọc màng tim."],
  tuKiem: [
    { q: "Khi chọc dịch màng phổi, kim đi ở vị trí nào so với xương sườn?", a: ["Bờ dưới xương sườn trên", "Bờ trên xương sườn dưới", "Xuyên qua xương", "Không quan trọng"], d: 1, giai: "Bó mạch – thần kinh liên sườn chạy ở bờ dưới xương sườn." },
    { q: "Mạch máu thành bụng cần tránh khi chọc dịch màng bụng?", a: ["ĐM thượng vị dưới", "ĐM mạc treo tràng trên", "TMC dưới", "ĐM thận"], d: 0, giai: "ĐM thượng vị dưới chạy sau cơ thẳng bụng; chọn điểm ngoài cơ thẳng và kiểm tra bằng Doppler." },
  ],
  tk: ["bts2023", "esc2015", "soni", "mateer"],
});

POCUS.them({
  id: "mat-onsd", gd: 4, ten: "Siêu âm mắt: đường kính bao thần kinh thị và bong võng mạc", phut: 30,
  ngan: "Đo ONSD 3 mm sau nhãn cầu để gợi ý tăng áp lực nội sọ; nhận ra bong võng mạc.",
  cauHoi: ["ONSD có gợi ý tăng áp lực nội sọ không?", "Có bong võng mạc không?"],
  mucTieu: ["Khám mắt an toàn (preset mắt, không ép).", "Đo ONSD đúng vị trí, cả hai mặt cắt, hai mắt.", "Phân biệt bong võng mạc với bong dịch kính."],
  lyThuyet: `
<p>Bao thần kinh thị liên tục với khoang dưới nhện; khi áp lực nội sọ tăng, bao giãn. Đo <b>đường kính bao thần kinh thị (ONSD) ở 3 mm sau nhãn cầu</b> (sau đĩa thị).</p>
<p>Ngưỡng gợi ý tăng áp lực nội sọ khác nhau giữa các nghiên cứu, thường trong khoảng 5,0–5,9 mm (tổng quan Dubourg 2011). ONSD là công cụ hỗ trợ, không thay thế CT/đo áp lực nội sọ.</p>
<h3>Bong võng mạc và dịch kính</h3>
<ul>
<li><b>Bong võng mạc</b>: màng sáng dày, <b>dính vào đĩa thị</b> phía sau (hình chữ V), di động ít khi mắt chuyển động.</li>
<li><b>Bong dịch kính sau</b>: màng mỏng, không dính đĩa thị, di động nhiều, "sóng" sau khi mắt ngừng chuyển động.</li>
<li><b>Xuất huyết dịch kính</b>: hồi âm lơ lửng trong dịch kính.</li>
</ul>
<p class="canh">Chống chỉ định khi nghi <b>vỡ nhãn cầu</b>: không ép lên mắt.</p>`,
  chuanBi: { dauDo: "Thẳng tần số cao.", cheDo: "Preset mắt (Ocular) hoặc giảm công suất (MI, TI thấp) theo ALARA.", tuThe: "Nằm ngửa, đầu cao 20–30°, mắt nhắm, nhìn thẳng.", tth: ["nuaNgoi"], khac: "Phủ nhiều gel lên mí mắt (có thể dán băng trong suốt trước), tựa tay lên trán/sống mũi để không ép lên mắt." },
  buoc: [
    { ten: "Đặt đầu dò và tìm thần kinh thị", hinh: { than: "mat", dd: [{ x: 69, y: 110, a: 0, n: 1 }] }, sim: { c: "mat", p: {} },
      lam: ["Đầu dò ngang trên mí mắt nhắm, phủ nhiều gel, không ép.", "Tìm nhãn cầu tròn trống âm, thủy tinh thể phía trước.", "Quạt nhẹ đến khi thấy dải giảm âm phía sau nhãn cầu (bao thần kinh thị) thẳng trục."],
      dat: "Thần kinh thị nằm giữa hình, vuông góc thành sau nhãn cầu.", meo: "" },
    { ten: "Đo ONSD", hinh: { than: "mat", dd: [{ x: 69, y: 110, a: -90, n: 2 }] }, sim: { c: "mat", p: { tang: 1 } },
      lam: ["Đông cứng hình. Đo 3 mm từ thành sau nhãn cầu dọc trục thần kinh.", "Tại đó đo đường kính ngang của bao.", "Làm ở mặt cắt ngang và dọc, hai mắt; lấy trung bình."],
      dat: "", meo: "Đo sai độ sâu hoặc trên mặt cắt chéo làm sai kết quả." },
  ],
  ketQua: [
    { ten: "ONSD bình thường", sim: { c: "mat", p: {} }, mo: "4,6 mm." },
    { ten: "ONSD tăng", sim: { c: "mat", p: { tang: 1 } }, mo: "6,4 mm: gợi ý tăng áp lực nội sọ." },
    { ten: "Bong võng mạc", sim: { c: "mat", p: { bong: 1 } }, mo: "Màng sáng dính vào đĩa thị." },
  ],
  lamSang: `<p>ONSD giúp phân tầng nguy cơ tại giường (chấn thương sọ não khi chưa có CT, bệnh nhân hôn mê), theo dõi xu hướng. Bong võng mạc: hội chẩn nhãn khoa cấp, nhất là khi điểm vàng còn chưa bị bong.</p>`,
  bay: ["Ép lên mắt (nguy hiểm khi vỡ nhãn cầu).", "Dùng preset không phải preset mắt (năng lượng cao).", "Đo không đúng 3 mm.", "Nhầm bóng lưng của mảnh sàng với bao thần kinh."],
  kiemTra: ["Khám mắt đúng kỹ thuật không ép.", "Đo ONSD hai mặt cắt hai mắt.", "Mô tả khác biệt bong võng mạc và bong dịch kính."],
  tuKiem: [
    { q: "ONSD đo ở đâu?", a: ["Tại đĩa thị", "3 mm sau nhãn cầu", "10 mm sau nhãn cầu", "Ở thủy tinh thể"], d: 1, giai: "3 mm sau thành sau nhãn cầu." },
    { q: "Màng sáng trong nhãn cầu dính vào đĩa thị, ít di động. Nghĩ đến?", a: ["Bong dịch kính sau", "Bong võng mạc", "Xuất huyết dịch kính", "Bình thường"], d: 1, giai: "Võng mạc dính chặt ở đĩa thị." },
    { q: "Chống chỉ định khám siêu âm mắt?", a: ["Hôn mê", "Nghi vỡ nhãn cầu (không được ép)", "Đang thở máy", "Trẻ em"], d: 1, giai: "Không ép lên nhãn cầu nghi vỡ." },
  ],
  tk: ["dubourg", "mateer", "soni"],
});

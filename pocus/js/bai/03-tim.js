/* Giai đoạn 2: Siêu âm tim tập trung */
POCUS.them({
  id: "tim-mat-cat", gd: 2, ten: "Siêu âm tim tập trung: 4 mặt cắt cơ bản", phut: 60,
  ngan: "Cạnh ức trục dọc, cạnh ức trục ngắn, mỏm 4 buồng, dưới mũi ức và tĩnh mạch chủ dưới.",
  cauHoi: ["Tôi có lấy được mặt cắt đủ chất lượng để trả lời câu hỏi không?", "Có ít nhất hai mặt cắt cùng xác nhận một phát hiện chưa?"],
  mucTieu: ["Lấy được 4 mặt cắt tim và mặt cắt TMC dưới trên người mẫu trong 5 phút.", "Nêu được tiêu chuẩn đạt của từng mặt cắt.", "Sửa được các lỗi thường gặp: mặt cắt chéo, mỏm ngắn (foreshortening), thất trái hình bầu dục ở trục ngắn."],
  lyThuyet: `
<p>Siêu âm tim tập trung (FoCUS) trả lời câu hỏi định tính có/không: có dịch màng tim không, thất trái co bóp ra sao, thất phải có giãn không, thể tích tuần hoàn gợi ý gì, có hoạt động tim trong ngừng tuần hoàn không. Đây không phải siêu âm tim toàn diện.</p>
<p><b>Nguyên tắc</b>: không kết luận từ một mặt cắt. Mỗi phát hiện quan trọng cần được thấy ở ít nhất hai mặt cắt. Bệnh nhân nằm nghiêng trái (nếu được) đưa tim sát thành ngực, cải thiện cạnh ức và mỏm.</p>
<div class="bang-wrap"><table>
<tr><th>Mặt cắt</th><th>Vị trí, dấu đầu dò (quy ước tim, chấm phải màn hình)</th><th>Dùng để</th></tr>
<tr><td>Cạnh ức trục dọc (PSLA)</td><td>Bờ trái xương ức, khoang liên sườn 3–4; dấu hướng vai phải</td><td>Co bóp thất trái, EPSS, dịch màng tim (so với ĐMC ngực xuống), kích thước gốc ĐMC, đường ra thất phải</td></tr>
<tr><td>Cạnh ức trục ngắn (PSSA)</td><td>Từ PSLA xoay 90° theo chiều kim đồng hồ; dấu hướng vai trái</td><td>Co bóp vòng thất trái theo vùng, hình dạng vách liên thất (dấu D)</td></tr>
<tr><td>Mỏm 4 buồng (A4C)</td><td>Mỏm tim (thường khoang liên sườn 5, đường nách trước – giữa đòn); dấu hướng 3 giờ (về bên trái bệnh nhân)</td><td>So sánh thất phải/thất trái, MAPSE, TAPSE, van, dịch; nghiêng lên thành 5 buồng để đo VTI</td></tr>
<tr><td>Dưới mũi ức (SX)</td><td>Dưới mũi ức, đầu dò gần như nằm phẳng; dấu về bên trái bệnh nhân, chùm âm hướng vai trái</td><td>Dịch màng tim, ngừng tuần hoàn, thở máy, phổi khí phế thũng (khi cạnh ức không thấy)</td></tr>
<tr><td>TMC dưới</td><td>Từ dưới mũi ức xoay dấu về phía đầu, quạt sang phải bệnh nhân</td><td>Ước tính áp lực nhĩ phải, gợi ý thể tích, ép tim</td></tr>
</table></div>`,
  chuanBi: { dauDo: "Tim (phased array).", cheDo: "Preset tim (chấm định hướng bên phải màn hình). Độ sâu ban đầu 16–20 cm.", tuThe: "Nằm ngửa hoặc nghiêng trái 30–45°, tay trái đưa lên đầu để mở khoang liên sườn.", khac: "Gắn điện tim của máy nếu có để biết thì tâm thu – tâm trương." },
  buoc: [
    { ten: "Cạnh ức trục dọc", hinh: { than: "nguc", dd: [{ x: 112, y: 78, a: -140, n: 1 }] }, sim: { c: "canhUcDoc", p: {} },
      lam: ["Đặt đầu dò sát bờ trái xương ức, khoang liên sườn 3–4.", "Dấu hướng vai phải bệnh nhân (khoảng 10 giờ).", "Chùm âm vuông góc thành ngực.", "Trượt lên/xuống một khoang và ra/vào để tìm cửa sổ tốt nhất.", "Xoay nhẹ đến khi vách liên thất và thành sau nằm gần như ngang, thấy cùng lúc van ĐMC và van hai lá.", "Tăng độ sâu đến khi thấy ĐMC ngực xuống sau nhĩ trái."],
      dat: "Thất phải ở trên, vách liên thất và thành sau song song, van ĐMC và van hai lá cùng thấy, ĐMC ngực xuống ở rãnh nhĩ thất.", meo: "Thấy thất trái tròn: đang chéo sang trục ngắn, xoay ngược lại. Hình bị phổi che: thở ra hết, nghiêng trái, trượt gần xương ức hơn." },
    { ten: "Cạnh ức trục ngắn", hinh: { than: "nguc", dd: [{ x: 112, y: 78, a: -40, n: 2 }] }, sim: { c: "canhUcNgang", p: {} },
      lam: ["Giữ thất trái ở giữa hình PSLA.", "Xoay 90° theo chiều kim đồng hồ, dấu hướng vai trái.", "Quạt về phía đáy tim: van ĐMC ('logo Mercedes'), rồi van hai lá ('miệng cá').", "Quạt về phía mỏm đến mức <b>cơ nhú</b>: mức chuẩn đánh giá co bóp."],
      dat: "Thất trái tròn như 'bánh donut', hai cơ nhú ở khoảng 4 giờ và 8 giờ, thất phải hình lưỡi liềm phía trước trái.", meo: "Thất trái bầu dục: mặt cắt đang chéo; xoay nhẹ thêm hoặc bớt cho đến khi tròn." },
    { ten: "Mỏm 4 buồng", hinh: { than: "nguc", dd: [{ x: 142, y: 98, a: 0, n: 3 }] }, sim: { c: "mom4", p: {} },
      lam: ["Sờ mỏm tim hoặc đặt dưới vú trái, khoảng đường nách trước (nghiêng trái giúp nhiều).", "Dấu hướng 3 giờ (về bên trái bệnh nhân).", "Chùm âm hướng về vai phải.", "Trượt đến khi mỏm tim nằm ở đỉnh hình và vách liên thất thẳng đứng giữa màn.", "Nếu thấy đường ra ĐMC: đó là 5 buồng, quạt chùm âm xuống dưới để về 4 buồng."],
      dat: "Mỏm ở đỉnh hình, đủ 4 buồng, vách liên thất – liên nhĩ thẳng đứng, thấy van hai lá và van ba lá.", meo: "Thất trái ngắn và mỏm tròn (foreshortening): đầu dò đang đặt quá cao/quá trong, trượt xuống một khoang và ra ngoài." },
    { ten: "Dưới mũi ức", hinh: { than: "nguc", dd: [{ x: 100, y: 124, a: 0, n: 4 }] }, sim: { c: "duoiUc", p: {} },
      lam: ["Cầm đầu dò từ phía trên (lòng bàn tay úp), đặt ngay dưới mũi ức hơi lệch phải.", "Đầu dò gần như nằm phẳng sát bụng, dấu hướng về bên trái bệnh nhân.", "Ấn nhẹ, chĩa chùm âm về vai trái.", "Tăng độ sâu 18–24 cm. Bảo bệnh nhân gập gối, hít sâu và nín."],
      dat: "Gan ở trường gần, thất phải ngay dưới gan, đủ 4 buồng, màng ngoài tim sáng bao quanh.", meo: "Mặt cắt quan trọng nhất trong ngừng tuần hoàn vì không cản trở ép tim." },
    { ten: "Tĩnh mạch chủ dưới", hinh: { than: "nguc", dd: [{ x: 104, y: 130, a: -90, n: 5 }] }, sim: { c: "ivc", p: {} },
      lam: ["Từ dưới mũi ức, giữ nhĩ phải ở giữa hình.", "Xoay dấu về phía đầu (cắt dọc).", "Quạt nhẹ sang phải bệnh nhân đến khi thấy TMC dưới đổ vào nhĩ phải.", "Xác nhận có tĩnh mạch gan đổ vào TMC dưới.", "Đo đường kính cách chỗ đổ vào nhĩ phải 1–2 cm (hoặc ngay dưới chỗ tĩnh mạch gan đổ vào)."],
      dat: "TMC dưới thấy liên tục đổ vào nhĩ phải, có tĩnh mạch gan đổ vào, trục dài nằm ngang.", meo: "Nhầm với ĐMC bụng: ĐMC thành dày, đập theo nhịp tim, nằm bên trái, không có tĩnh mạch gan đổ vào." },
  ],
  ketQua: [
    { ten: "PSLA bình thường", sim: { c: "canhUcDoc", p: {} }, mo: "Lá trước van hai lá gần chạm vách liên thất trong tâm trương." },
    { ten: "PSSA bình thường", sim: { c: "canhUcNgang", p: {} }, mo: "Thất trái tròn, dày lên và nhỏ lại đều." },
    { ten: "A4C bình thường", sim: { c: "mom4", p: {} }, mo: "Thất phải nhỏ hơn khoảng 2/3 thất trái, mỏm do thất trái tạo nên." },
    { ten: "Dưới mũi ức bình thường", sim: { c: "duoiUc", p: {} }, mo: "Không có dải dịch giữa màng ngoài tim và cơ tim." },
  ],
  lamSang: `<p>FoCUS được dùng trong: tụt huyết áp/sốc không rõ nguyên nhân, khó thở cấp, đau ngực, ngừng tuần hoàn, chấn thương ngực, nghi ép tim. Kết quả cần đặt cạnh bệnh cảnh và kiểm chứng bằng siêu âm tim toàn diện khi bệnh nhân ổn định.</p>`,
  bay: ["Kết luận từ một mặt cắt chéo.", "Mỏm ngắn ở A4C làm đánh giá sai kích thước thất phải và co bóp mỏm.", "Thất trái bầu dục ở trục ngắn làm sai đánh giá vách liên thất.", "Nhầm ĐMC bụng với TMC dưới.", "Không đủ độ sâu nên không thấy dịch phía sau tim."],
  kiemTra: ["Lấy được 4 mặt cắt và TMC dưới trong 5 phút.", "Nói được tiêu chuẩn đạt của mỗi mặt cắt.", "Sửa được mỏm ngắn và trục ngắn bầu dục.", "Lưu clip mỗi mặt cắt ≥ 3 nhịp tim."],
  tuKiem: [
    { q: "Theo quy ước tim, ở cạnh ức trục dọc dấu đầu dò hướng về đâu?", a: ["Vai trái", "Vai phải", "Rốn", "Nách trái"], d: 1, giai: "PSLA: dấu hướng vai phải; xoay 90° theo chiều kim đồng hồ (dấu hướng vai trái) để có trục ngắn." },
    { q: "Ở mặt cắt trục ngắn, mức nào là mức chuẩn để đánh giá co bóp toàn bộ thất trái?", a: ["Van ĐMC", "Van hai lá", "Cơ nhú", "Mỏm"], d: 2, giai: "Mức cơ nhú thể hiện các vùng cấp máu của cả ba động mạch vành." },
    { q: "Ở mỏm 4 buồng, thất trái trông ngắn và mỏm tròn. Lỗi gì và sửa thế nào?", a: ["Gain cao, giảm gain", "Mỏm ngắn (foreshortening): trượt xuống/ra ngoài một khoang", "Sai preset", "Bình thường"], d: 1, giai: "Đầu dò không nằm ở mỏm thật; trượt xuống dưới và ra ngoài." },
    { q: "Cách phân biệt TMC dưới với ĐMC bụng trên mặt cắt dọc dưới mũi ức?", a: ["TMC dưới đập mạnh hơn", "TMC dưới đổ vào nhĩ phải và có tĩnh mạch gan đổ vào", "ĐMC luôn xẹp khi hít vào", "Không phân biệt được"], d: 1, giai: "TMC dưới nối với nhĩ phải, có tĩnh mạch gan đổ vào, thành mỏng. ĐMC thành dày, đập, nằm bên trái." },
  ],
  tk: ["via", "mateer", "soni", "lang"],
});

POCUS.them({
  id: "tim-chuc-nang", gd: 2, ten: "Đánh giá thất trái và thất phải", phut: 50,
  ngan: "Ước lượng co bóp thất trái bằng mắt và EPSS, MAPSE; nhận ra thất phải giãn, dấu D, McConnell, TAPSE.",
  cauHoi: ["Thất trái co bóp tăng, bình thường, giảm hay giảm nặng?", "Thất phải có giãn và quá tải áp lực không?"],
  mucTieu: ["Phân loại co bóp thất trái bằng mắt thành 4 mức.", "Đo EPSS, MAPSE, TAPSE và biết ngưỡng.", "Nhận ra thất phải giãn (tỉ lệ thất phải/thất trái), dấu D, McConnell và phân biệt cấp với mạn."],
  lyThuyet: `
<h3>Thất trái: đánh giá bằng mắt</h3>
<p>Nhìn ba thành phần trên nhiều mặt cắt: (1) cơ tim <b>dày lên</b> trong tâm thu, (2) nội mạc <b>di chuyển vào trong</b>, (3) lá trước van hai lá <b>mở chạm gần vách</b>. Phân loại: <b>tăng động</b> (buồng gần như xẹp cuối tâm thu: giảm thể tích, nhiễm khuẩn giai đoạn sớm, thiếu máu), <b>bình thường</b>, <b>giảm vừa</b>, <b>giảm nặng</b>. Bác sĩ cấp cứu được huấn luyện ước lượng bằng mắt tương đối tốt so với đo chuẩn.</p>
<h3>Thông số hỗ trợ</h3>
<div class="bang-wrap"><table>
<tr><th>Thông số</th><th>Cách đo</th><th>Ngưỡng thường dùng</th><th>Giới hạn</th></tr>
<tr><td><b>EPSS</b> (khoảng cách điểm E – vách)</td><td>PSLA, M-mode qua đầu lá trước van hai lá; khoảng cách nhỏ nhất giữa đỉnh sóng E và vách liên thất</td><td>&gt; 7 mm gợi ý phân suất tống máu giảm; càng lớn càng giảm</td><td>Không dùng khi hẹp van hai lá, hở chủ nặng, vách phì đại không đối xứng</td></tr>
<tr><td><b>MAPSE</b></td><td>A4C, M-mode qua vòng van hai lá thành bên</td><td>≥ 10 mm thường bình thường; &lt; 8 mm gợi ý EF giảm</td><td>Phụ thuộc góc; đo ở thành bên</td></tr>
<tr><td><b>VTI đường ra thất trái</b></td><td>A5C, Doppler xung</td><td>Khoảng 18–22 cm ở người lớn; thấp gợi ý thể tích nhát bóp thấp</td><td>Xem bài TMC dưới và VTI</td></tr>
</table></div>
<h3>Thất phải</h3>
<p>Thất phải bình thường mỏng, hình tam giác, nhỏ hơn khoảng 2/3 thất trái ở A4C và mỏm tim do thất trái tạo nên.</p>
<ul>
<li><b>Giãn</b>: tỉ lệ đường kính đáy thất phải/thất trái &gt; 1 là giãn rõ; đường kính đáy thất phải &gt; 41 mm là giãn (ASE 2015). Thất phải tham gia tạo mỏm tim.</li>
<li><b>Dấu D</b> (PSSA): vách liên thất bị đẩy dẹt về phía thất trái. Dẹt chủ yếu trong <b>tâm trương</b>: quá tải thể tích; dẹt cả <b>tâm thu</b>: quá tải áp lực.</li>
<li><b>McConnell</b>: thành tự do thất phải đoạn giữa giảm động trong khi mỏm vẫn co tốt: gợi ý thuyên tắc phổi cấp (đặc hiệu tương đối cao, độ nhạy thấp).</li>
<li><b>TAPSE</b> &lt; 17 mm: rối loạn chức năng tâm thu thất phải.</li>
<li><b>Cấp hay mạn</b>: thành tự do thất phải dày &gt; 5 mm gợi ý quá tải mạn (tăng áp phổi mạn), thất phải cấp thường thành mỏng. Áp lực tâm thu thất phải rất cao (ước từ dòng hở ba lá) cũng gợi ý bệnh mạn vì thất phải bình thường không tạo được áp lực cao đột ngột.</li>
</ul>`,
  chuanBi: { dauDo: "Tim.", cheDo: "Preset tim; M-mode cho EPSS/MAPSE/TAPSE.", tuThe: "Nghiêng trái nếu được.", khac: "" },
  buoc: [
    { ten: "Ước lượng thất trái bằng mắt", hinh: { than: "nguc", dd: [{ x: 112, y: 78, a: -140, n: 1 }, { x: 142, y: 98, a: 0, n: 2 }] }, sim: { c: "canhUcDoc", p: {} },
      lam: ["Lấy PSLA, PSSA mức cơ nhú, A4C.", "Ở mỗi mặt cắt, quan sát 3 thành phần: dày lên, di chuyển vào trong, van hai lá chạm vách.", "Xếp vào 1 trong 4 mức; so với các clip mẫu."],
      dat: "Kết luận nhất quán ở ít nhất hai mặt cắt.", meo: "Xem clip chậm hoặc từng khung hình nếu tim nhanh." },
    { ten: "Đo EPSS", hinh: { than: "nguc", dd: [{ x: 112, y: 78, a: -140 }] }, sim: { c: "canhUcDoc", p: { ef: "giam" } },
      lam: ["Ở PSLA, đặt đường M-mode qua đầu lá trước van hai lá.", "Bật M-mode, ghi 3–4 nhịp.", "Đo từ đỉnh sóng E (lá van mở rộng nhất đầu tâm trương) đến vách liên thất."],
      dat: "Đường M-mode vuông góc vách liên thất qua đầu lá van.", meo: "" },
    { ten: "MAPSE và TAPSE", hinh: { than: "nguc", dd: [{ x: 142, y: 98, a: 0 }] }, sim: { c: "mom4", p: { do: 1 } },
      lam: ["Ở A4C, đặt đường M-mode qua vòng van ba lá thành bên (TAPSE) rồi vòng van hai lá thành bên (MAPSE).", "Đường M-mode song song với hướng di chuyển của vòng van (dọc trục tim).", "Đo biên độ di chuyển từ cuối tâm trương đến cuối tâm thu."],
      dat: "Vòng van chạy dọc đường M-mode, đường cong đều.", meo: "Góc lệch lớn làm đo thấp hơn thật." },
    { ten: "So sánh thất phải và thất trái", hinh: { than: "nguc", dd: [{ x: 142, y: 98, a: 0, n: 3 }, { x: 112, y: 78, a: -40, n: 4 }] }, sim: { c: "mom4", p: { rv: 1 } },
      lam: ["A4C không mỏm ngắn: so đường kính đáy thất phải và thất trái cuối tâm trương.", "Xem ai tạo mỏm tim.", "Chuyển PSSA mức cơ nhú: tìm dấu D, xem thì tâm thu hay tâm trương.", "Quan sát thành tự do thất phải: giảm động đoạn giữa với mỏm còn co (McConnell)."],
      dat: "Thấy rõ thất phải và vách liên thất ở hai mặt cắt.", meo: "A4C xoay lệch có thể làm thất phải trông to hoặc nhỏ giả: xác nhận bằng PSSA và dưới mũi ức." },
  ],
  ketQua: [
    { ten: "Co bóp bình thường", sim: { c: "canhUcDoc", p: {} }, mo: "Lá trước van hai lá gần chạm vách, thành dày lên rõ." },
    { ten: "Tăng động", sim: { c: "canhUcDoc", p: { ef: "tang" } }, mo: "Buồng gần xẹp cuối tâm thu, tim nhanh: giảm thể tích, sốc phân bố." },
    { ten: "Giảm nặng, EPSS lớn", sim: { c: "canhUcDoc", p: { ef: "giam" } }, mo: "Thất trái giãn, ít co, lá van mở xa vách." },
    { ten: "Thất phải giãn ở A4C", sim: { c: "mom4", p: { rv: 1 } }, mo: "Thất phải lớn hơn thất trái, tạo mỏm, TAPSE thấp." },
    { ten: "Dấu D", sim: { c: "canhUcNgang", p: { rv: 1 } }, mo: "Vách dẹt, thất trái hình chữ D: quá tải thất phải." },
    { ten: "Trục ngắn bình thường", sim: { c: "canhUcNgang", p: {} }, mo: "Thất trái tròn." },
  ],
  lamSang: `<p><b>Sốc + thất trái giảm nặng</b>: sốc tim; tìm thêm đường B, TMC dưới căng, điện tim (hội chứng vành cấp).</p>
<p><b>Sốc + thất trái tăng động + TMC dưới nhỏ</b>: giảm thể tích hoặc sốc phân bố.</p>
<p><b>Sốc + thất phải giãn cấp + dấu D</b>: nghĩ thuyên tắc phổi lớn; tìm huyết khối tĩnh mạch sâu. Theo ESC 2019, ở bệnh nhân nghi thuyên tắc phổi nguy cơ cao không làm CT ngay được, rối loạn chức năng thất phải trên siêu âm tim cho phép xử trí như thuyên tắc phổi (kể cả tái tưới máu) khi không có chẩn đoán khác. Thất phải giãn cũng gặp trong nhồi máu thất phải, tăng áp phổi mạn, ARDS, thở máy áp lực cao.</p>`,
  bay: ["Ước lượng EF trên một mặt cắt chéo.", "Dùng EPSS khi có hẹp van hai lá hoặc hở chủ nặng.", "Kết luận thất phải giãn từ A4C xoay lệch về phía thất phải.", "Coi mọi thất phải giãn là thuyên tắc phổi cấp, bỏ qua dấu hiệu mạn (thành dày)."],
  kiemTra: ["Phân loại đúng 4 clip co bóp thất trái.", "Đo EPSS, MAPSE, TAPSE trên người mẫu.", "Mô tả dấu D và McConnell bằng lời."],
  tuKiem: [
    { q: "EPSS đo được 15 mm ở bệnh nhân không có bệnh van. Gợi ý gì?", a: ["Phân suất tống máu thất trái giảm", "Tăng động", "Ép tim", "Bình thường"], d: 0, giai: "EPSS > 7 mm gợi ý EF giảm; 15 mm gợi ý giảm đáng kể." },
    { q: "Vách liên thất dẹt cả thì tâm thu và tâm trương ở trục ngắn gợi ý gì?", a: ["Quá tải thể tích thất phải", "Quá tải áp lực thất phải", "Thất trái phì đại", "Bình thường"], d: 1, giai: "Dẹt chủ yếu tâm trương: quá tải thể tích; dẹt cả tâm thu: quá tải áp lực." },
    { q: "TAPSE 12 mm. Kết luận?", a: ["Bình thường", "Rối loạn chức năng tâm thu thất phải", "Rối loạn chức năng thất trái", "Không có ý nghĩa"], d: 1, giai: "TAPSE < 17 mm là bất thường." },
    { q: "Thất phải giãn với thành tự do dày 9 mm. Gợi ý gì?", a: ["Thuyên tắc phổi cấp đơn thuần", "Quá tải thất phải mạn (tăng áp phổi mạn)", "Tràn dịch màng tim", "Giảm thể tích"], d: 1, giai: "Thành tự do > 5 mm gợi ý quá trình mạn tính; thất phải không kịp phì đại trong thuyên tắc cấp." },
  ],
  tk: ["via", "lang", "rudski", "esc2019", "soni"],
});

POCUS.them({
  id: "mang-tim", gd: 2, ten: "Tràn dịch màng ngoài tim và ép tim", phut: 40,
  ngan: "Phát hiện dịch, phân biệt với mỡ và dịch màng phổi, nhận ra dấu hiệu ép tim.",
  cauHoi: ["Có dịch màng ngoài tim không?", "Dịch có gây ép tim không?"],
  mucTieu: ["Đo kích thước dịch cuối tâm trương và phân độ.", "Phân biệt dịch màng tim với mỡ thượng tâm mạc, dịch màng phổi trái, cổ trướng.", "Nhận ra 4 dấu hiệu ép tim trên siêu âm và nhớ rằng ép tim là chẩn đoán lâm sàng – huyết động."],
  lyThuyet: `
<p>Dịch màng ngoài tim là dải trống âm giữa lá thành (đường sáng ngoài cùng) và thượng tâm mạc. Dịch tự do tụ phía sau (vùng thấp) trước khi lan ra trước. Kích thước đo ở <b>cuối tâm trương</b>: nhỏ &lt; 10 mm, vừa 10–20 mm, lớn &gt; 20 mm (ESC 2015).</p>
<h3>Phân biệt</h3>
<ul>
<li><b>Dịch màng phổi trái</b> ở PSLA: nằm <b>sau</b> ĐMC ngực xuống; dịch màng tim nằm <b>trước</b> ĐMC ngực xuống (giữa ĐMC và thất trái).</li>
<li><b>Mỡ thượng tâm mạc</b>: thường ở phía trước, có hồi âm hạt, di chuyển cùng tim, không có ở phía sau.</li>
<li><b>Cổ trướng</b> ở cửa sổ dưới mũi ức: nằm dưới gan, có dây chằng liềm.</li>
</ul>
<h3>Ép tim</h3>
<p>Áp lực trong khoang màng tim vượt áp lực đổ đầy buồng tim. Tốc độ tích tụ quan trọng hơn lượng dịch: 100–200 mL tích tụ nhanh (chấn thương, vỡ tim, tách ĐMC) có thể gây ép tim, trong khi dịch mạn hàng lít có thể dung nạp được.</p>
<div class="bang-wrap"><table>
<tr><th>Dấu hiệu</th><th>Ý nghĩa</th></tr>
<tr><td>Nhĩ phải xẹp trong tâm thu</td><td>Sớm, nhạy; xẹp kéo dài hơn 1/3 chu chuyển tim đặc hiệu hơn</td></tr>
<tr><td>Thất phải xẹp trong tâm trương</td><td>Đặc hiệu hơn</td></tr>
<tr><td>TMC dưới giãn, ít thay đổi theo hô hấp (&gt; 2,1 cm, xẹp &lt; 50%)</td><td>Rất nhạy; không có dấu này thì ép tim ít khả năng; không đặc hiệu</td></tr>
<tr><td>Thay đổi dòng qua van theo hô hấp (Doppler: van hai lá &gt; 25%, van ba lá &gt; 40%)</td><td>Tương đương mạch nghịch thường trên siêu âm</td></tr>
<tr><td>Tim "đong đưa" trong dịch lớn</td><td>Gặp trong dịch lượng lớn; tương ứng điện thế luân phiên trên ECG</td></tr>
</table></div>
<p>Các dấu xẹp buồng tim có thể không xuất hiện khi áp lực buồng tim phải cao (tăng áp phổi, thất phải phì đại) hoặc ép tim khu trú (sau mổ tim).</p>`,
  chuanBi: { dauDo: "Tim.", cheDo: "Preset tim, độ sâu đủ thấy toàn bộ tim và phía sau.", tuThe: "Nằm ngửa hoặc nửa ngồi.", khac: "M-mode để xác định thì tâm thu – tâm trương khi đánh giá xẹp buồng tim." },
  buoc: [
    { ten: "Tìm dịch ở dưới mũi ức và PSLA", hinh: { than: "nguc", dd: [{ x: 100, y: 124, a: 0, n: 1 }, { x: 112, y: 78, a: -140, n: 2 }] }, sim: { c: "duoiUc", p: { dich: 1 } },
      lam: ["Dưới mũi ức: tìm dải đen giữa màng ngoài tim và thất phải/thất trái.", "PSLA: tăng độ sâu, tìm ĐMC ngực xuống, xác định dịch ở trước hay sau ĐMC.", "Đo bề dày dịch lớn nhất cuối tâm trương."],
      dat: "Dịch thấy ở ít nhất hai mặt cắt.", meo: "" },
    { ten: "Tìm dấu hiệu ép tim", hinh: { than: "nguc", dd: [{ x: 142, y: 98, a: 0, n: 3 }, { x: 104, y: 130, a: -90, n: 4 }] }, sim: { c: "duoiUc", p: { dich: 2, chen: 1 } },
      lam: ["A4C hoặc dưới mũi ức: quan sát thành tự do thất phải trong tâm trương và nhĩ phải trong tâm thu.", "M-mode qua thành tự do thất phải ở PSLA để xác định thì xẹp.", "Đánh giá TMC dưới.", "Nếu có kinh nghiệm Doppler: đo biến thiên dòng qua van hai lá theo hô hấp."],
      dat: "Xác định rõ thì xẹp so với điện tim hoặc so với van mở/đóng.", meo: "Thất phải xẹp khi van hai lá đang mở = tâm trương." },
  ],
  ketQua: [
    { ten: "Dịch lượng vừa", sim: { c: "duoiUc", p: { dich: 1 } }, mo: "Dải đen quanh tim, buồng tim không xẹp." },
    { ten: "Dịch lớn, ép tim", sim: { c: "duoiUc", p: { dich: 2, chen: 1 } }, mo: "Tim đong đưa, thất phải xẹp thì tâm trương, nhĩ phải xẹp." },
    { ten: "Dịch màng tim ở PSLA", sim: { c: "canhUcDoc", p: { dich: 1 } }, mo: "Dịch nằm trước ĐMC ngực xuống." },
    { ten: "Dịch màng phổi ở PSLA", sim: { c: "canhUcDoc", p: { mp: 1 } }, mo: "Dịch nằm sau ĐMC ngực xuống: không phải dịch màng tim." },
    { ten: "TMC dưới căng", sim: { c: "ivc", p: { kieu: "gian" } }, mo: "Giãn, gần như không xẹp: phù hợp ép tim (nhạy, không đặc hiệu)." },
  ],
  lamSang: `<p>Ép tim gây tụt huyết áp: dịch truyền chỉ là biện pháp tạm thời; xử trí là <b>giải ép</b>. Chọc dịch màng tim dưới hướng dẫn siêu âm, chọn đường vào nơi túi dịch lớn nhất gần da nhất, không có cấu trúc quan trọng trên đường kim (thường là cạnh ức hoặc mỏm, không nhất thiết dưới mũi ức).</p>
<p><b>Chấn thương</b> (máu màng tim) và <b>tách ĐMC týp A</b> có ép tim: ưu tiên phẫu thuật; chọc dẫn lưu chỉ hạn chế để duy trì sống khi không thể mổ ngay.</p>
<p>Dịch màng tim không có dấu ép tim ở bệnh nhân ổn định: tìm nguyên nhân, siêu âm tim chuyên khoa, theo dõi.</p>`,
  bay: ["Nhầm mỡ thượng tâm mạc phía trước là dịch.", "Nhầm dịch màng phổi trái là dịch màng tim (không xác định ĐMC ngực xuống).", "Máu đông màng tim có hồi âm, dễ bị bỏ sót hoặc nhầm là cơ tim.", "Loại trừ ép tim vì dịch 'ít' trong bệnh cảnh tích tụ nhanh.", "Đánh giá xẹp buồng tim mà không xác định thì tim."],
  kiemTra: ["Phân biệt dịch màng tim và màng phổi trên PSLA.", "Đo dịch cuối tâm trương.", "Nêu 4 dấu hiệu ép tim và độ nhạy/đặc hiệu tương đối."],
  tuKiem: [
    { q: "Ở PSLA, dải dịch nằm sau ĐMC ngực xuống. Đó là?", a: ["Dịch màng ngoài tim", "Dịch màng phổi trái", "Mỡ thượng tâm mạc", "Cổ trướng"], d: 1, giai: "Dịch màng tim nằm trước ĐMC ngực xuống; dịch màng phổi nằm sau." },
    { q: "Dấu hiệu siêu âm nào nhạy nhất (khi không có, ép tim ít khả năng)?", a: ["Thất phải xẹp thì tâm trương", "TMC dưới giãn, ít thay đổi theo hô hấp", "Tim đong đưa", "Dịch > 2 cm"], d: 1, giai: "TMC dưới căng rất nhạy nhưng không đặc hiệu." },
    { q: "Bệnh nhân đâm vào ngực trái, HA 70/40, dưới mũi ức có dịch màng tim. Xử trí ưu tiên?", a: ["Chọc dịch rồi theo dõi", "Phẫu thuật cấp cứu; chọc dịch chỉ là cầu nối khi không thể mổ ngay", "Chụp CT ngực", "Truyền dịch và chờ"], d: 1, giai: "Máu màng tim do chấn thương xuyên thấu cần phẫu thuật." },
  ],
  tk: ["esc2015", "via", "mateer", "noble"],
});

POCUS.them({
  id: "tmcd-vti", gd: 2, ten: "Tĩnh mạch chủ dưới và VTI: thể tích và đáp ứng dịch", phut: 50,
  ngan: "Đo TMC dưới đúng cách, hiểu giới hạn; đo VTI đường ra thất trái và nâng chân thụ động.",
  cauHoi: ["Áp lực nhĩ phải ước tính thấp, trung bình hay cao?", "Bệnh nhân có đáp ứng truyền dịch không (tăng cung lượng tim khi tăng tiền gánh)?"],
  mucTieu: ["Đo đường kính và chỉ số xẹp TMC dưới đúng vị trí.", "Ước tính áp lực nhĩ phải theo ASE.", "Đo VTI đường ra thất trái, tính thể tích nhát bóp và cung lượng tim.", "Làm test nâng chân thụ động và đọc kết quả."],
  lyThuyet: `
<h3>Tĩnh mạch chủ dưới</h3>
<p>Đo trên trục dọc, cách chỗ đổ vào nhĩ phải 1–2 cm (hoặc ngay xa chỗ tĩnh mạch gan đổ vào), vuông góc với trục mạch, đường kính lớn nhất (Dmax) và nhỏ nhất (Dmin) trong chu kỳ thở. Chỉ số xẹp = (Dmax − Dmin)/Dmax.</p>
<div class="bang-wrap"><table>
<tr><th>TMC dưới</th><th>Xẹp khi hít vào/hít mạnh</th><th>Áp lực nhĩ phải ước tính</th></tr>
<tr><td>≤ 2,1 cm</td><td>&gt; 50%</td><td>khoảng 3 mmHg (0–5)</td></tr>
<tr><td>&gt; 2,1 cm</td><td>&lt; 50%</td><td>khoảng 15 mmHg (10–20)</td></tr>
<tr><td colspan="2">Không thuộc hai nhóm trên</td><td>khoảng 8 mmHg (5–10)</td></tr>
</table></div>
<p class="nho">Ngưỡng theo khuyến cáo đánh giá tim phải của ASE (Rudski 2010) và ASE 2015.</p>
<h3>Giới hạn</h3>
<ul>
<li>TMC dưới phản ánh <b>áp lực</b> nhĩ phải, không đo trực tiếp "thể tích" và không dự đoán đáp ứng dịch tốt ở bệnh nhân <b>tự thở</b> (gắng sức hô hấp thay đổi rất khác nhau).</li>
<li>Bệnh nhân <b>thở máy kiểm soát hoàn toàn</b> (không tự thở): chỉ số giãn TMC dưới &gt; 18% gợi ý đáp ứng dịch (Barbier 2004).</li>
<li>TMC dưới căng gặp trong: ép tim, tràn khí áp lực, thuyên tắc phổi lớn, suy thất phải, hở ba lá nặng, quá tải dịch, PEEP cao, vận động viên (có thể giãn sinh lý).</li>
<li>Tăng áp lực ổ bụng, mặt cắt lệch (hiệu ứng hình trụ: cắt lệch tâm làm đường kính nhỏ giả), TMC di chuyển ra khỏi mặt cắt khi thở.</li>
<li>Ý nghĩa thực hành mạnh nhất ở hai cực: TMC dưới nhỏ, xẹp hoàn toàn ở bệnh nhân sốc → ít nghĩ đến nguyên nhân tắc nghẽn/sốc tim; TMC dưới căng → thận trọng truyền dịch, tìm nguyên nhân tắc nghẽn.</li>
</ul>
<h3>VTI đường ra thất trái</h3>
<p>Tích phân vận tốc – thời gian (VTI) là quãng đường cột máu đi được trong một nhát bóp (cm). Thể tích nhát bóp = VTI × diện tích đường ra thất trái (π × (đường kính/2)²; đường kính đo ở PSLA giữa tâm thu, thường khoảng 2 cm). Cung lượng tim = thể tích nhát bóp × tần số. VTI người lớn bình thường khoảng 18–22 cm.</p>
<p><b>Đáp ứng dịch</b>: VTI (hoặc thể tích nhát bóp) tăng ≥ 10–15% khi nâng chân thụ động (PLR) hoặc sau nghiệm pháp truyền nhanh lượng nhỏ gợi ý đáp ứng. PLR là nghiệm pháp đảo ngược được, dùng được ở bệnh nhân tự thở và loạn nhịp (Monnet 2016).</p>`,
  chuanBi: { dauDo: "Tim (cong cũng dùng được cho TMC dưới).", cheDo: "Preset tim; M-mode cho TMC dưới; Doppler xung cho VTI.", tuThe: "Nằm ngửa. PLR bắt đầu ở tư thế nửa ngồi 45°.", khac: "Ghi điện tim của máy nếu có." },
  buoc: [
    { ten: "Đo TMC dưới", hinh: { than: "nguc", dd: [{ x: 104, y: 130, a: -90, n: 1 }] }, sim: { c: "ivc", p: {} },
      lam: ["Lấy trục dọc TMC dưới đổ vào nhĩ phải, có tĩnh mạch gan.", "Lắc/quạt để mặt cắt đi qua giữa mạch (đường kính lớn nhất).", "Đặt điểm đo cách chỗ đổ vào nhĩ phải 1–2 cm.", "Ghi cine loop hoặc M-mode qua ít nhất 2 chu kỳ thở; đo Dmax, Dmin.", "Nếu xẹp không rõ, bảo bệnh nhân hít mạnh (sniff)."],
      dat: "Hai thành mạch song song, sắc nét suốt chu kỳ thở.", meo: "Khi dùng M-mode, kiểm tra mạch không trượt ra khỏi đường M khi thở." },
    { ten: "Đo VTI đường ra thất trái", hinh: { than: "nguc", dd: [{ x: 142, y: 98, a: 0, n: 2 }] }, sim: { c: "vti", p: {} },
      lam: ["Từ A4C quạt chùm âm lên trên để thấy van ĐMC (mỏm 5 buồng).", "Đặt cửa sổ mẫu Doppler xung trong đường ra thất trái, khoảng 5 mm dưới van ĐMC.", "Đường Doppler song song với dòng máu (góc lệch &lt; 20°).", "Ghi phổ: dòng tâm thu đi xa đầu dò (dưới đường gốc), đường bao rõ, có 'cửa sổ' trống giữa phổ.", "Vẽ theo đường bao 3 nhịp (5 nhịp nếu rung nhĩ), lấy trung bình."],
      dat: "Phổ hẹp, đường bao sắc, có tiếng click đóng van ĐMC ở cuối phổ.", meo: "Thấy click mở và đóng van: cửa sổ mẫu đặt quá sát van; lùi về phía mỏm." },
    { ten: "Nâng chân thụ động", hinh: { than: "nguc", dd: [{ x: 142, y: 98, a: 0, n: 3 }] }, sim: { c: "vti", p: { vti: 17 } },
      lam: ["Bệnh nhân nửa ngồi 45°: đo VTI nền.", "Dùng giường hạ thân xuống phẳng và nâng chân 45° (không nâng chân bằng tay gây đau).", "Đo lại VTI trong 30–90 giây (hiệu ứng tối đa thường trong khoảng 1 phút).", "Tính % thay đổi; đưa bệnh nhân về tư thế ban đầu."],
      dat: "Giữ cùng một vị trí cửa sổ mẫu và góc ở hai lần đo.", meo: "Đau, ho, kích thích làm tăng giao cảm, sai kết quả. Tăng áp lực ổ bụng làm giảm độ tin cậy." },
  ],
  ketQua: [
    { ten: "TMC dưới bình thường", sim: { c: "ivc", p: { kieu: "bt" } }, mo: "Đường kính trung bình, xẹp > 50%: áp lực nhĩ phải thấp." },
    { ten: "TMC dưới căng", sim: { c: "ivc", p: { kieu: "gian" } }, mo: "> 2,1 cm, xẹp < 50%: áp lực nhĩ phải cao." },
    { ten: "TMC dưới nhỏ, xẹp hoàn toàn", sim: { c: "ivc", p: { kieu: "xep" } }, mo: "Gợi ý áp lực nhĩ phải rất thấp." },
    { ten: "VTI bình thường", sim: { c: "vti", p: { vti: 20 } }, mo: "Khoảng 20 cm." },
    { ten: "VTI thấp", sim: { c: "vti", p: { vti: 10 } }, mo: "Khoảng 10 cm, tim nhanh: thể tích nhát bóp thấp." },
  ],
  lamSang: `<p>Không dùng TMC dưới đơn độc để quyết định truyền dịch. Đặt nó trong bức tranh: co bóp thất trái, thất phải, đường B ở phổi, VExUS (khi có kinh nghiệm), và đáp ứng thực tế với PLR/VTI.</p>
<p>Câu hỏi đúng không chỉ là "có đáp ứng dịch không" mà còn "có cần tăng cung lượng tim không" và "truyền dịch có gây hại không" (đường B tăng, TMC dưới căng, thất phải suy).</p>`,
  bay: ["Đo TMC dưới ở trục ngang lệch hoặc trục dọc lệch tâm (đường kính nhỏ giả).", "Nhầm ĐMC bụng với TMC dưới.", "Dùng chỉ số xẹp ở bệnh nhân tự thở để dự đoán đáp ứng dịch.", "Đo VTI với góc Doppler lệch lớn (đo thấp giả).", "Đổi vị trí cửa sổ mẫu giữa hai lần đo trước và sau PLR."],
  kiemTra: ["Đo TMC dưới đúng vị trí, nêu ước tính áp lực nhĩ phải.", "Ghi phổ VTI đạt chuẩn và vẽ đường bao.", "Thực hiện đúng quy trình PLR và tính % thay đổi."],
  tuKiem: [
    { q: "TMC dưới 2,4 cm, xẹp 20% khi hít mạnh. Áp lực nhĩ phải ước tính?", a: ["≈ 3 mmHg", "≈ 8 mmHg", "≈ 15 mmHg", "Không ước tính được"], d: 2, giai: "> 2,1 cm và xẹp < 50%: khoảng 15 mmHg (10–20)." },
    { q: "VTI trước PLR 15 cm, trong PLR 17,5 cm. Kết luận?", a: ["Không đáp ứng dịch", "Có khả năng đáp ứng dịch (tăng ≈ 17%)", "Quá tải dịch", "Đo sai"], d: 1, giai: "(17,5 − 15)/15 ≈ 17% ≥ 10–15%: gợi ý đáp ứng." },
    { q: "Chỉ số giãn TMC dưới > 18% có ý nghĩa dự đoán đáp ứng dịch ở bệnh nhân nào?", a: ["Tự thở", "Thở máy kiểm soát hoàn toàn, không tự thở", "Mọi bệnh nhân", "Tăng áp lực ổ bụng"], d: 1, giai: "Barbier 2004: bệnh nhân thở máy, an thần, không gắng sức." },
    { q: "Thể tích nhát bóp nếu VTI 20 cm và đường kính đường ra thất trái 2,0 cm?", a: ["≈ 31 mL", "≈ 63 mL", "≈ 80 mL", "≈ 126 mL"], d: 1, giai: "Diện tích = 3,14 × 1² = 3,14 cm²; × 20 cm ≈ 63 mL." },
  ],
  tk: ["rudski", "lang", "barbier", "monnet", "soni"],
});

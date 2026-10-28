/* Giai đoạn 2: Bụng và mạch máu */
POCUS.them({
  id: "dmc-bung", gd: 2, ten: "Động mạch chủ bụng: phình ĐMC", phut: 35,
  ngan: "Quét liên tục từ mũi ức đến chỗ chia đôi, đo ngoài – ngoài, nhận ra phình.",
  cauHoi: ["ĐMC bụng có phình (≥ 3 cm) không?"],
  mucTieu: ["Nhận diện ĐMC dựa vào thân đốt sống, phân biệt với TMC dưới.", "Quét toàn bộ chiều dài trên hai mặt cắt.", "Đo đúng: ngoài – ngoài, vuông góc trục mạch.", "Ra quyết định theo huyết động."],
  lyThuyet: `
<p>ĐMC bụng chạy trước cột sống, hơi lệch trái, từ lỗ cơ hoành đến chỗ chia đôi (khoảng ngang rốn, L4). <b>Phình ĐMC bụng</b>: đường kính ngoài – ngoài ≥ 3,0 cm. Động mạch chậu chung &gt; 1,5 cm là phình. Đa số phình nằm dưới động mạch thận.</p>
<p>Mốc giải phẫu khi đi từ trên xuống ở mặt cắt ngang: <b>thân tạng</b> (hình "chim hải âu" với ĐM gan chung và ĐM lách), <b>ĐM mạc treo tràng trên</b> (bao quanh bởi lớp mỡ sáng, chạy song song phía trước ĐMC), ĐM thận, rồi chỗ chia đôi.</p>
<p>Siêu âm tại khoa cấp cứu phát hiện phình ĐMC bụng với độ nhạy và độ đặc hiệu rất cao (tổng quan Rubano 2013: khoảng 99% và 98%). Nhưng siêu âm <b>không loại trừ được vỡ</b>: máu vỡ thường đi sau phúc mạc, FAST hay âm tính.</p>
<div class="bang-wrap"><table>
<tr><th></th><th>ĐMC bụng</th><th>TMC dưới</th></tr>
<tr><td>Vị trí</td><td>Trước cột sống, lệch trái (bên phải màn hình ở mặt cắt ngang)</td><td>Bên phải (bên trái màn hình), trước cột sống/gan</td></tr>
<tr><td>Thành</td><td>Dày, sáng</td><td>Mỏng</td></tr>
<tr><td>Hình dạng</td><td>Tròn, đập theo mạch</td><td>Bầu dục/dẹt, thay đổi theo hô hấp, đẩy xẹp được</td></tr>
<tr><td>Nhánh</td><td>Thân tạng, MTTT, ĐM thận</td><td>Tĩnh mạch gan đổ vào</td></tr>
</table></div>`,
  chuanBi: { dauDo: "Cong.", cheDo: "Bụng, độ sâu 15–20 cm (tùy thể trạng).", tuThe: "Nằm ngửa, gập gối. Nếu khí nhiều: nghiêng trái và dùng gan làm cửa sổ (mặt cắt đứng ngang bên phải).", tth: ["gapGoi", "nghiengTrai"], khac: "Bệnh nhân nhịn ăn lý tưởng nhưng không bắt buộc trong cấp cứu." },
  buoc: [
    { ten: "Tìm ĐMC ở mũi ức (cắt ngang)", hinh: { than: "nguc", dd: [{ x: 100, y: 128, a: 180, n: 1 }] }, sim: { c: "dmc", p: { ep: 1 } },
      lam: ["Đặt đầu dò ngay dưới mũi ức, cắt ngang, dấu về bên phải bệnh nhân.", "Tìm thân đốt sống (vòm sáng với bóng lưng phía sau).", "ĐMC: vòng tròn trống âm ngay trước thân đốt sống, hơi lệch trái; TMC dưới bên phải.", "Chỉnh độ sâu để ĐMC ở giữa màn hình."],
      dat: "Thấy thân đốt sống, ĐMC tròn và TMC dưới cùng lúc.", meo: "Khí ruột che: ép đầu dò đều, từ từ và giữ vài giây để đẩy khí; hoặc dời đầu dò sang trái/phải và nghiêng chùm âm về ĐMC." },
    { ten: "Quét xuống đến chỗ chia đôi", hinh: { than: "nguc", dd: [{ x: 100, y: 128, a: 180, n: 1, mv: "truot", ten: "Đoạn trên: ngang ĐM mạc treo tràng trên", sim: { c: "dmc", p: {} } }, { x: 100, y: 170, a: 180, n: 2, ten: "Ngang rốn: chỗ chia đôi thành 2 ĐM chậu chung", sim: { c: "dmc", p: { chia: 1 } } }] }, sim: { c: "dmc", p: {} },
      lam: ["Trượt đầu dò từ từ xuống rốn, giữ ĐMC ở giữa hình.", "Nhận ra thân tạng, ĐM mạc treo tràng trên, ĐM thận khi đi qua.", "Tiếp tục đến chỗ chia đôi; quét thêm đoạn đầu ĐM chậu chung hai bên.", "Đo đường kính lớn nhất trước – sau và ngang, ngoài – ngoài."],
      dat: "Không bỏ đoạn nào; đo ở ít nhất 3 mức: gần, giữa, xa.", meo: "" },
    { ten: "Xác nhận trên mặt cắt dọc", hinh: { than: "nguc", dd: [{ x: 104, y: 140, a: -90, n: 3 }] }, sim: { c: "dmcDoc", p: {} },
      lam: ["Xoay 90°, dấu về phía đầu.", "Đi dọc ĐMC, đo đường kính trước – sau vuông góc trục mạch.", "Tìm đoạn phình hình thoi hoặc túi."],
      dat: "Trục dọc thấy được ĐMC liên tục.", meo: "Cắt chéo làm đường kính lớn giả (hiệu ứng hình trụ): luôn đo vuông góc trục mạch." },
  ],
  ketQua: [
    { ten: "ĐMC bình thường", sim: { c: "dmc", p: {} }, mo: "Đường kính ngoài – ngoài 1,9 cm." },
    { ten: "Phình ĐMC có huyết khối thành", sim: { c: "dmc", p: { phinh: 1 } }, mo: "5,2 cm ngoài – ngoài; lòng mạch chỉ là phần trống âm, huyết khối xám bám thành." },
  ],
  lamSang: `<p><b>Đau bụng/lưng/hông, ngất, tụt huyết áp ở người &gt; 50 tuổi</b> (nhất là nam, hút thuốc): luôn siêu âm ĐMC. Phình vỡ có thể giả dạng cơn đau quặn thận.</p>
<ul>
<li>Phình + triệu chứng + huyết động không ổn định → hồi sức hạ huyết áp có kiểm soát theo phác đồ, gọi ngay phẫu thuật mạch máu/can thiệp, không chờ CT.</li>
<li>Phình + triệu chứng + ổn định → CT mạch máu khẩn, hội chẩn mạch máu.</li>
<li>Phình không triệu chứng (phát hiện tình cờ) → hẹn theo dõi chuyên khoa.</li>
<li>ĐMC bình thường trên toàn bộ chiều dài → phình ĐMC bụng gần như bị loại trừ là nguyên nhân (tách ĐMC thì không loại trừ được).</li>
</ul>`,
  bay: ["Đo đường kính lòng mạch (trong huyết khối) thay vì ngoài – ngoài.", "Không quét toàn bộ chiều dài, bỏ sót phình đoạn dưới.", "Nhầm TMC dưới, cột sống, hạch hoặc khối ruột với ĐMC.", "Cho rằng FAST âm tính là loại trừ vỡ phình.", "Cắt chéo làm phóng đại đường kính."],
  kiemTra: ["Quét liên tục từ mũi ức đến chỗ chia đôi trên người mẫu.", "Chỉ ra thân tạng và ĐM MTTT.", "Đo ngoài – ngoài đúng kỹ thuật ở 3 mức."],
  tuKiem: [
    { q: "Ngưỡng định nghĩa phình ĐMC bụng?", a: ["≥ 2,0 cm", "≥ 2,5 cm", "≥ 3,0 cm", "≥ 5,5 cm"], d: 2, giai: "≥ 3,0 cm ngoài – ngoài." },
    { q: "Nam 72 tuổi đau hông trái, HA 80/50, ĐMC bụng 6,1 cm, FAST âm tính. Xử trí?", a: ["Chụp CT trước rồi mới gọi phẫu thuật", "Gọi ngay phẫu thuật mạch máu/can thiệp; FAST âm tính không loại trừ vỡ", "Điều trị cơn đau quặn thận", "Truyền dịch tự do để HA về 120"], d: 1, giai: "Vỡ phình thường sau phúc mạc. Không ổn định + phình có triệu chứng: không chờ CT." },
    { q: "Đo phình có huyết khối thành thế nào?", a: ["Đo lòng trống âm", "Đo ngoài – ngoài, bao gồm huyết khối", "Đo nội mạc – nội mạc", "Lấy trung bình"], d: 1, giai: "Huyết khối là một phần của túi phình." },
  ],
  tk: ["mateer", "acep", "rubano", "noble"],
});

POCUS.them({
  id: "dvt", gd: 2, ten: "Huyết khối tĩnh mạch sâu: ép 2 điểm và 3 điểm", phut: 35,
  ngan: "Ép tĩnh mạch đùi chung và tĩnh mạch khoeo; tĩnh mạch không xẹp hoàn toàn là huyết khối.",
  cauHoi: ["Có huyết khối tĩnh mạch sâu đoạn gần ở chi dưới không?"],
  mucTieu: ["Nhận diện bộ ba 'chuột Mickey' ở bẹn và mạch máu ở hõm khoeo.", "Ép đúng lực, đúng vị trí, đúng mặt cắt (ngang).", "Đọc kết quả và kết hợp với xác suất lâm sàng, D-dimer."],
  lyThuyet: `
<p>Nguyên lý: tĩnh mạch bình thường <b>xẹp hoàn toàn</b> khi ép bằng đầu dò; có huyết khối thì không xẹp hoàn toàn. Tiêu chuẩn chẩn đoán là <b>không ép xẹp được</b>, không phải nhìn thấy huyết khối (huyết khối mới có thể trống âm).</p>
<ul>
<li><b>Ép 2 điểm</b>: tĩnh mạch đùi chung (từ dây chằng bẹn, gồm chỗ đổ của tĩnh mạch hiển lớn, đến chỗ chia tĩnh mạch đùi sâu) và tĩnh mạch khoeo (từ hõm khoeo đến chỗ chia ba).</li>
<li><b>Ép 3 điểm</b>: thêm tĩnh mạch đùi (đoạn giữa đùi). Nhiều quy trình cấp cứu ép liên tục mỗi 1–2 cm dọc các đoạn này.</li>
<li>Siêu âm do bác sĩ cấp cứu thực hiện có độ nhạy và độ đặc hiệu gộp khoảng 96% và 97% (tổng quan Pomero 2013).</li>
<li>Không khảo sát tĩnh mạch cẳng chân: huyết khối đoạn xa có thể bị bỏ sót.</li>
</ul>`,
  chuanBi: { dauDo: "Thẳng 5–10 MHz (cong nếu chân to/phù).", cheDo: "Mạch máu (vascular/venous), độ sâu 3–5 cm.", tuThe: "Nằm ngửa, đầu cao (Trendelenburg ngược) để tĩnh mạch đầy; đùi xoay ngoài, gối gập nhẹ (tư thế ếch). Khoeo: gập gối, hoặc nằm nghiêng/sấp.", tth: ["trendNguoc", "ech", "sapKhoeo"], khac: "" },
  buoc: [
    { ten: "Tĩnh mạch đùi chung ở bẹn", tth: ["ech"], hinh: { than: "chan", dd: [{ x: 62, y: 70, a: 180, n: 1 }] }, sim: { c: "dvt", p: { tmh: 1 } },
      lam: ["Đặt đầu dò ngang ngay dưới nếp bẹn, dấu về bên phải bệnh nhân.", "Tìm ĐM đùi chung (tròn, đập, thành dày) và TM đùi chung nằm phía trong.", "Trượt lên đến dây chằng bẹn, rồi xuống: thấy TM hiển lớn đổ vào (hình 'chuột Mickey').", "Ép thẳng đứng đến khi ĐM bắt đầu biến dạng: TM phải xẹp hoàn toàn (hai thành chạm nhau).", "Trượt xuống mỗi 1–2 cm và ép lại, đến chỗ chia TM đùi sâu."],
      dat: "Mặt cắt ngang, thấy cả ĐM và TM, ép đủ lực.", meo: "Ép trên mặt cắt dọc dễ trượt mạch ra khỏi mặt cắt và tạo hình 'xẹp giả'." },
    { ten: "Tĩnh mạch đùi đoạn giữa (3 điểm)", hinh: { than: "chan", dd: [{ x: 70, y: 130, a: 180, n: 2 }] }, sim: { c: "dvt", p: {} },
      lam: ["Trượt dọc mặt trong đùi theo bó mạch.", "Ép mỗi 1–2 cm."],
      dat: "", meo: "TM đùi đoạn ống cơ khép nằm sâu: dùng đầu dò cong nếu cần." },
    { ten: "Tĩnh mạch khoeo", tth: ["sapKhoeo"], hinh: { than: "khoeo", dd: [{ x: 100, y: 124, a: 180, n: 3 }] }, sim: { c: "dvt", p: { vt: "khoeo" } },
      lam: ["Gập gối, đặt đầu dò ngang ở hõm khoeo.", "TM khoeo nằm <b>nông hơn</b> (gần đầu dò hơn) ĐM khoeo.", "Ép; trượt xuống đến chỗ chia ba."],
      dat: "Thấy TM nông, ĐM sâu, ép xẹp hoàn toàn TM.", meo: "Ép quá mạnh ngay từ đầu có thể làm TM khoeo xẹp trước khi nhìn thấy: tìm trước khi ép." },
  ],
  ketQua: [
    { ten: "Bình thường: xẹp hoàn toàn", sim: { c: "dvt", p: { tmh: 1 } }, mo: "TM đùi chung xẹp hoàn toàn khi ép." },
    { ten: "Huyết khối: không xẹp", sim: { c: "dvt", p: { hk: 1 } }, mo: "TM giãn, có hồi âm trong lòng, không xẹp khi ép đủ lực (ĐM đã biến dạng)." },
    { ten: "TM khoeo bình thường", sim: { c: "dvt", p: { vt: "khoeo" } }, mo: "TM khoeo nông, xẹp hoàn toàn." },
  ],
  lamSang: `<ul>
<li><b>Dương tính</b>: điều trị huyết khối tĩnh mạch sâu; ở bệnh nhân nghi thuyên tắc phổi có sốc, huyết khối tĩnh mạch sâu cùng thất phải giãn ủng hộ mạnh chẩn đoán.</li>
<li><b>Âm tính + xác suất lâm sàng thấp/D-dimer âm tính</b>: loại trừ.</li>
<li><b>Âm tính + xác suất cao hoặc D-dimer dương tính</b>: siêu âm toàn bộ chân (duplex) hoặc lặp lại siêu âm ép sau khoảng 1 tuần, theo phác đồ cơ sở.</li>
</ul>`,
  bay: ["Ép không đủ lực (ĐM chưa biến dạng) → dương tính giả.", "Ép trên mặt cắt dọc → âm tính giả.", "Nhầm hạch bẹn, nang Baker, khối máu tụ với tĩnh mạch.", "Bỏ qua tĩnh mạch đùi đôi (biến thể giải phẫu).", "Chỉ ép một điểm ở bẹn, bỏ chỗ chia TM đùi sâu."],
  kiemTra: ["Nhận diện 'chuột Mickey' ở bẹn.", "Ép đúng kỹ thuật ở 2 vùng, mỗi 1–2 cm.", "Báo cáo kết quả kèm phần không khảo sát được."],
  tuKiem: [
    { q: "Tiêu chuẩn chính chẩn đoán huyết khối tĩnh mạch sâu trên siêu âm ép?", a: ["Nhìn thấy cục máu đông", "Tĩnh mạch không xẹp hoàn toàn khi ép", "Tĩnh mạch giãn", "Không có tín hiệu Doppler"], d: 1, giai: "Huyết khối mới có thể trống âm; tiêu chuẩn là không ép xẹp." },
    { q: "Ở hõm khoeo, vị trí tĩnh mạch so với động mạch?", a: ["Nông hơn (gần đầu dò)", "Sâu hơn", "Ngang hàng", "Thay đổi"], d: 0, giai: "TM khoeo nằm nông hơn ĐM khoeo khi đặt đầu dò ở phía sau." },
    { q: "Ép 2 điểm âm tính, xác suất lâm sàng cao, D-dimer dương tính. Bước tiếp?", a: ["Loại trừ, cho về", "Siêu âm toàn bộ chân hoặc lặp lại siêu âm ép sau khoảng 1 tuần", "Chụp CT bụng", "Điều trị chống đông ngay vĩnh viễn"], d: 1, giai: "Ép 2 điểm không đánh giá TM cẳng chân." },
  ],
  tk: ["mateer", "pomero", "acep", "noble"],
});

POCUS.them({
  id: "than-bq", gd: 2, ten: "Thận, bàng quang: ứ nước và bí tiểu", phut: 30,
  ngan: "Phân độ thận ứ nước, đo thể tích bàng quang.",
  cauHoi: ["Có thận ứ nước không, mức độ nào?", "Bàng quang có căng (bí tiểu) không?"],
  mucTieu: ["Lấy trục dọc và trục ngang hai thận.", "Phân độ ứ nước nhẹ – vừa – nặng.", "Đo thể tích bàng quang bằng công thức."],
  lyThuyet: `
<p>Thận bình thường: vỏ giảm âm hơn hoặc bằng gan, tháp thận giảm âm, xoang thận (mỡ, mạch, hệ góp) tăng âm ở giữa. <b>Ứ nước</b>: hệ góp giãn tạo vùng trống âm trong xoang thận.</p>
<div class="bang-wrap"><table>
<tr><th>Mức</th><th>Hình ảnh</th></tr>
<tr><td>Nhẹ</td><td>Bể thận giãn tách đôi xoang thận, đài thận chưa giãn rõ</td></tr>
<tr><td>Vừa</td><td>Bể thận và các đài thận giãn tròn ("chân gấu"), nhú thận tù</td></tr>
<tr><td>Nặng</td><td>Hệ góp giãn lớn dạng bóng, vỏ thận mỏng</td></tr>
</table></div>
<p><b>Thể tích bàng quang</b> ≈ ngang × trước – sau × dọc × 0,52 (cm → mL). Hệ số thay đổi theo hình dạng bàng quang; kết quả là ước lượng.</p>`,
  chuanBi: { dauDo: "Cong.", cheDo: "Bụng/thận, độ sâu 14–18 cm.", tuThe: "Nằm ngửa; nghiêng sang bên đối diện nếu khó thấy.", tth: ["ngua"], khac: "Khám bàng quang trước khi bệnh nhân đi tiểu, rồi sau tiểu nếu cần." },
  buoc: [
    { ten: "Thận phải", hinh: { than: "nguc", dd: [{ x: 30, y: 148, a: -90, n: 1 }] }, sim: { c: "than", p: {} },
      lam: ["Đầu dò đường nách giữa – trước bên phải, dùng gan làm cửa sổ, dấu về phía đầu.", "Xoay nhẹ theo trục dọc thận (cực trên hướng ra sau – vào trong).", "Quạt qua toàn bộ thận; xoay 90° để có trục ngang.", "Bảo bệnh nhân hít vào sâu để thận đi xuống khỏi xương sườn."],
      dat: "Thấy trọn thận từ cực trên đến cực dưới trên trục dọc.", meo: "" },
    { ten: "Thận trái", tth: ["ngua"], hinh: { than: "nguc", dd: [{ x: 172, y: 130, a: -90, n: 2 }] }, sim: { c: "than", p: { do: 1 } },
      lam: ["Đầu dò cao và sau hơn bên phải: đường nách sau, mu bàn tay chạm giường.", "Dùng lách làm cửa sổ.", "So sánh với thận phải."],
      dat: "", meo: "" },
    { ten: "Bàng quang và thể tích", hinh: { than: "nguc", dd: [{ x: 100, y: 222, a: 180, n: "a", ten: "Cắt ngang: đo ngang và trước – sau", sim: { c: "bangQuang", p: {} } }, { x: 100, y: 234, a: -90, n: "b", ny: 16, ten: "Cắt dọc: đo chiều dọc", sim: { c: "bangQuang", p: { doc: 1 } } }] }, sim: { c: "bangQuang", p: {} },
      lam: ["Cắt ngang trên xương mu: đo chiều ngang lớn nhất và trước – sau.", "Xoay sang cắt dọc: đo chiều dọc lớn nhất.", "Tính thể tích (có công cụ tính trong ứng dụng).", "Xem có tia nước tiểu từ niệu quản bằng Doppler màu (nâng cao)."],
      dat: "Đo ở mặt cắt lớn nhất mỗi chiều.", meo: "" },
  ],
  ketQua: [
    { ten: "Thận bình thường", sim: { c: "than", p: {} }, mo: "Xoang thận sáng liền khối." },
    { ten: "Ứ nước nhẹ", sim: { c: "than", p: { do: 1 } }, mo: "Dải trống âm mảnh tách xoang thận." },
    { ten: "Ứ nước vừa", sim: { c: "than", p: { do: 2 } }, mo: "Đài thận giãn tròn nối với bể thận." },
    { ten: "Ứ nước nặng", sim: { c: "than", p: { do: 3 } }, mo: "Hệ góp giãn lớn, vỏ mỏng." },
    { ten: "Bàng quang ~250 mL", sim: { c: "bangQuang", p: {} }, mo: "" },
    { ten: "Bàng quang căng ~600 mL", sim: { c: "bangQuang", p: { lon: 1 } }, mo: "Bí tiểu nếu bệnh nhân không tự tiểu được." },
  ],
  lamSang: `<ul>
<li><b>Nghi cơn đau quặn thận</b>: ứ nước một bên ủng hộ tắc nghẽn do sỏi. Thử nghiệm STONE (Smith-Bindman 2014) cho thấy bắt đầu bằng siêu âm thay vì CT giảm phơi nhiễm tia xạ mà không tăng chẩn đoán bỏ sót nguy hiểm. Ứ nước nặng gợi ý sỏi lớn hơn.</li>
<li><b>Ứ nước + sốt/nhiễm khuẩn</b>: thận tắc nghẽn nhiễm khuẩn cần giải áp cấp cứu (dẫn lưu thận/đặt JJ).</li>
<li><b>Người &gt; 50 tuổi "đau quặn thận"</b>: siêu âm ĐMC bụng trước.</li>
<li><b>Suy thận cấp</b>: ứ nước hai bên hoặc bàng quang căng gợi ý nguyên nhân sau thận.</li>
<li><b>Bàng quang</b>: xác nhận bí tiểu, kiểm tra vị trí bóng sonde tiểu (sonde tắc), đo nước tiểu tồn lưu sau tiểu.</li>
</ul>`,
  bay: ["Nhầm bể thận ngoài xoang, nang cạnh bể thận, mạch máu thận (Doppler) với ứ nước.", "Bàng quang quá căng gây giãn nhẹ hai bên: khám lại sau khi tiểu.", "Mất nước làm không thấy ứ nước dù có tắc.", "Thai kỳ: giãn đài bể thận sinh lý (thường bên phải)."],
  kiemTra: ["Lấy trục dọc hai thận.", "Phân độ đúng 4 clip mẫu.", "Đo và tính thể tích bàng quang."],
  tuKiem: [
    { q: "Bàng quang ngang 10 cm, trước – sau 7 cm, dọc 9 cm. Thể tích ước lượng?", a: ["≈ 160 mL", "≈ 330 mL", "≈ 630 mL", "≈ 900 mL"], d: 1, giai: "10 × 7 × 9 × 0,52 ≈ 328 mL." },
    { q: "Đài thận giãn tròn nối với bể thận, vỏ thận còn dày. Mức độ?", a: ["Nhẹ", "Vừa", "Nặng", "Bình thường"], d: 1, giai: "Vừa: đài thận giãn tròn; nặng thì vỏ mỏng." },
    { q: "Nam 68 tuổi đau hông trái lan bẹn, tiểu máu vi thể. Siêu âm gì trước tiên ngoài thận?", a: ["Túi mật", "ĐMC bụng", "Tinh hoàn", "Tim"], d: 1, giai: "Phình ĐMC có thể giả dạng cơn đau quặn thận ở người lớn tuổi." },
  ],
  tk: ["mateer", "stone", "noble"],
});

POCUS.them({
  id: "tui-mat", gd: 2, ten: "Túi mật: sỏi và viêm túi mật cấp", phut: 35,
  ngan: "Tìm sỏi, đánh giá dấu hiệu viêm, đo thành túi mật và ống mật chủ.",
  cauHoi: ["Có sỏi túi mật không?", "Có dấu hiệu viêm túi mật cấp không?"],
  mucTieu: ["Tìm túi mật qua mốc khe thùy chính – TM cửa.", "Nhận ra sỏi (bóng lưng sạch, di động), dấu WES.", "Đánh giá Murphy siêu âm, thành dày, dịch quanh túi mật, ống mật chủ."],
  lyThuyet: `
<p>Túi mật nằm dưới gan, ở hố túi mật. Mốc tìm: <b>khe thùy chính</b> (đường sáng) nối cổ túi mật với nhánh phải TM cửa ("dấu chấm than").</p>
<ul>
<li><b>Sỏi</b>: cấu trúc tăng âm trong lòng, bóng lưng sạch phía sau, <b>di động</b> khi đổi tư thế (trừ sỏi kẹt cổ).</li>
<li><b>Dấu WES</b> (thành – hồi âm – bóng): túi mật co nhỏ chứa đầy sỏi: thấy thành, đường sáng của sỏi rồi bóng lưng.</li>
<li><b>Bùn mật</b>: hồi âm thấp lắng đọng theo tư thế, không bóng lưng.</li>
<li><b>Murphy siêu âm</b>: điểm đau nhất nằm đúng dưới đầu dò khi ép lên túi mật đã nhìn thấy.</li>
<li><b>Thành dày</b> &gt; 3 mm (đo thành trước, vuông góc), <b>dịch quanh túi mật</b>, túi mật căng to.</li>
<li><b>Ống mật chủ</b>: ở bộ ba cửa ("chuột Mickey": TM cửa, ĐM gan, ống mật chủ). &gt; 6 mm gợi ý giãn (người cao tuổi hoặc đã cắt túi mật có thể lớn hơn bình thường). Đo trong – trong.</li>
</ul>
<p>Sỏi + Murphy siêu âm dương tính có giá trị dự báo dương tính cao cho viêm túi mật cấp (Ralls 1985). Thành dày đơn độc không đặc hiệu: suy tim, cổ trướng, viêm gan, giảm albumin, sau ăn, viêm tụy.</p>`,
  chuanBi: { dauDo: "Cong.", cheDo: "Bụng, độ sâu 12–16 cm.", tuThe: "Nằm ngửa; nghiêng trái 45° hoặc ngồi nếu khó thấy.", tth: ["ngua", "nghiengTrai"], khac: "Nhịn ăn giúp túi mật căng (sau ăn túi mật co, thành trông dày)." },
  buoc: [
    { ten: "Tìm túi mật dưới bờ sườn", hinh: { than: "nguc", dd: [{ x: 72, y: 142, a: -90, n: 1, ten: "Dưới bờ sườn, cắt dọc", sim: { c: "tuiMat", p: {} } }, { x: 42, y: 122, a: -60, n: 2, mv: "truot", ten: "Liên sườn đường nách trước (khi dưới sườn không thấy)", sim: { c: "tuiMat", p: {} } }] }, sim: { c: "tuiMat", p: {} },
      lam: ["Đặt đầu dò dọc dưới bờ sườn phải, đường giữa đòn, dấu về phía đầu.", "Bảo hít sâu và nín: gan và túi mật đi xuống.", "Trượt dọc bờ sườn ra ngoài (quét 'cần gạt nước') đến khi thấy túi mật.", "Nếu không thấy: đặt liên sườn ở đường nách trước, hoặc cho nghiêng trái."],
      dat: "Trục dọc túi mật từ đáy đến cổ, thấy khe thùy chính và TM cửa.", meo: "" },
    { ten: "Quét toàn bộ túi mật", hinh: { than: "nguc", dd: [{ x: 72, y: 142, a: -90, n: 1, ten: "Trục dọc: sỏi ở vùng thấp", sim: { c: "tuiMat", p: { soi: 1 } } }, { x: 72, y: 142, a: 0, n: 2, ny: 14, ten: "Trục ngang: xác nhận sỏi trong lòng túi mật", sim: { c: "tuiMat", p: { soi: 1, ngang: 1 } } }] }, sim: { c: "tuiMat", p: { soi: 1 } },
      lam: ["Quạt qua toàn bộ trục dọc.", "Xoay 90°, quạt từ đáy đến cổ trên trục ngang.", "Chú ý cổ túi mật (sỏi kẹt).", "Cho bệnh nhân nghiêng trái: sỏi lăn."],
      dat: "Hai mặt cắt, thấy cả cổ túi mật.", meo: "" },
    { ten: "Dấu hiệu viêm", hinh: { than: "nguc", dd: [{ x: 72, y: 142, a: -90, mv: "ep" }] }, sim: { c: "tuiMat", p: { viem: 1 } },
      lam: ["Ép đầu dò lên túi mật đang nhìn thấy: hỏi điểm đau nhất (Murphy siêu âm).", "Đo thành trước túi mật.", "Tìm dịch quanh túi mật.", "Tìm ống mật chủ ở bộ ba cửa, đo."],
      dat: "", meo: "Đã dùng thuốc giảm đau mạnh có thể làm Murphy siêu âm âm tính." },
  ],
  ketQua: [
    { ten: "Túi mật bình thường", sim: { c: "tuiMat", p: {} }, mo: "Trống âm, thành mỏng." },
    { ten: "Sỏi túi mật", sim: { c: "tuiMat", p: { soi: 1 } }, mo: "Sỏi ở vùng thấp, bóng lưng sạch." },
    { ten: "Viêm túi mật cấp", sim: { c: "tuiMat", p: { viem: 1 } }, mo: "Sỏi, thành dày nhiều lớp, bùn mật, dịch quanh túi mật." },
  ],
  lamSang: `<p>Đau hạ sườn phải + sỏi + Murphy siêu âm dương tính: viêm túi mật cấp cho đến khi chứng minh khác → kháng sinh, hội chẩn ngoại khoa. Thành không đều, màng trong lòng, khí trong thành (bóng lưng bẩn) gợi ý thể hoại tử/sinh hơi → mổ cấp. Ống mật chủ giãn + vàng da/sốt → nghĩ sỏi ống mật chủ/viêm đường mật.</p>`,
  bay: ["Nhầm khí tá tràng hoặc đại tràng (bóng bẩn) với sỏi.", "Nhầm nếp gấp cổ túi mật (van Heister) với sỏi.", "Nhầm bóng bờ với bóng lưng.", "Polyp: không di động, không bóng lưng.", "Túi mật co sau ăn trông thành dày."],
  kiemTra: ["Tìm túi mật bằng mốc khe thùy chính.", "Quét hai mặt cắt qua cổ túi mật.", "Đo thành trước và ống mật chủ."],
  tuKiem: [
    { q: "Đặc điểm giúp phân biệt sỏi với polyp túi mật?", a: ["Sỏi tăng âm", "Sỏi có bóng lưng và di động", "Sỏi nằm ở đáy", "Sỏi to hơn"], d: 1, giai: "Polyp bám thành, không di động, thường không có bóng lưng." },
    { q: "Thành túi mật dày 5 mm, không sỏi, bệnh nhân suy tim có cổ trướng. Kết luận?", a: ["Chắc chắn viêm túi mật", "Thành dày không đặc hiệu, có thể do suy tim/cổ trướng", "Ung thư túi mật", "Sỏi kẹt"], d: 1, giai: "Thành dày có nhiều nguyên nhân ngoài túi mật." },
    { q: "Ngưỡng thường dùng cho ống mật chủ giãn ở người lớn chưa cắt túi mật?", a: ["> 3 mm", "> 6 mm", "> 10 mm", "> 15 mm"], d: 1, giai: "> 6 mm, lưu ý người cao tuổi và sau cắt túi mật." },
  ],
  tk: ["mateer", "ralls", "noble", "acep"],
});

POCUS.them({
  id: "thai-som", gd: 2, ten: "Thai sớm và thai ngoài tử cung", phut: 35,
  ngan: "Xác định có thai trong tử cung qua đường bụng; nhận ra dấu hiệu thai ngoài tử cung vỡ.",
  cauHoi: ["Có thai trong tử cung chắc chắn không?", "Có dịch tự do ổ bụng ở phụ nữ có thai không?"],
  mucTieu: ["Nhận diện tử cung và bàng quang trên hai mặt cắt.", "Áp dụng tiêu chuẩn thai trong tử cung chắc chắn.", "Nhận ra túi thai giả.", "Xử trí theo kết quả: thai trong tử cung, chưa xác định vị trí, nghi thai ngoài vỡ."],
  lyThuyet: `
<p>Ở phụ nữ có hCG dương tính và đau bụng/ra máu ba tháng đầu, câu hỏi tại giường là <b>có thai trong tử cung (IUP) chắc chắn không</b>. Khi có IUP chắc chắn, khả năng thai ngoài rất thấp, trừ <b>thai cùng lúc trong và ngoài tử cung</b> (khoảng 1/30.000 ở thai tự nhiên, cao hơn nhiều ở hỗ trợ sinh sản, ước tính tới khoảng 1%).</p>
<h3>Tiêu chuẩn thai trong tử cung chắc chắn</h3>
<ul>
<li>Túi thai nằm trong tử cung chứa <b>túi noãn hoàng</b> hoặc <b>phôi</b> (có/không có tim thai).</li>
<li>Túi thai được bao quanh bởi lớp cơ tử cung đủ dày (nhiều tài liệu cấp cứu dùng ≥ 8 mm; một số dùng 5–7 mm) để loại trừ thai ở đoạn kẽ.</li>
<li>Thấy được liên tục từ cổ tử cung đến túi thai (túi thai nằm trong buồng tử cung).</li>
</ul>
<p><b>Túi thai giả</b>: dịch/máu trong lòng tử cung, ở giữa buồng, bờ không có vòng màng rụng kép, không có túi noãn hoàng, thay đổi hình dạng. Túi thai thật nằm lệch tâm trong màng rụng.</p>
<p>Qua đường âm đạo thấy túi noãn hoàng sớm hơn (khoảng tuần 5,5) so với đường bụng. Ngưỡng phân biệt hCG (khoảng 1.500–3.500 mUI/mL cho siêu âm đầu dò âm đạo) thay đổi theo tài liệu và không được dùng để loại trừ thai ngoài.</p>
<p>Tim thai: ghi bằng <b>M-mode</b>, không dùng Doppler ở thai sớm (nguyên tắc ALARA).</p>`,
  chuanBi: { dauDo: "Cong (đường bụng). Đầu dò âm đạo nếu được đào tạo.", cheDo: "Sản/bụng.", tuThe: "Nằm ngửa; bàng quang đầy giúp làm cửa sổ.", tth: ["ngua"], khac: "Có người đi kèm khi khám vùng chậu; tôn trọng riêng tư." },
  buoc: [
    { ten: "Mặt cắt dọc giữa", hinh: { than: "nguc", dd: [{ x: 100, y: 224, a: -90, n: 1 }] }, sim: { c: "tuCung", p: { iup: 1 } },
      lam: ["Đặt đầu dò trên xương mu, cắt dọc, dấu về phía đầu.", "Tìm bàng quang (trường gần), tử cung phía sau.", "Đi theo đường nội mạc từ cổ tử cung đến đáy.", "Quạt sang hai bên qua toàn bộ tử cung.", "Tìm túi thai, túi noãn hoàng, phôi; ghi M-mode tim thai nếu có phôi."],
      dat: "Thấy tử cung từ cổ đến đáy, đường nội mạc liên tục.", meo: "Tử cung ngả sau khó thấy qua đường bụng: chuyển đường âm đạo hoặc siêu âm chuyên khoa." },
    { ten: "Mặt cắt ngang", hinh: { than: "nguc", dd: [{ x: 100, y: 224, a: 180, n: 2 }] }, sim: { c: "chauNgang", p: { nu: 1, iup: 1 } },
      lam: ["Xoay 90°, dấu về bên phải bệnh nhân.", "Quạt từ đáy xuống cổ tử cung.", "Xác nhận túi thai nằm trong tử cung và đo lớp cơ bao quanh."],
      dat: "", meo: "" },
    { ten: "Khoang Morison và túi cùng", hinh: { than: "nguc", dd: [{ x: 30, y: 142, a: -90, n: 3, ten: "Khoang Morison: dịch tự do (máu)", sim: { c: "ruq", p: { dich: 1 } } }, { x: 100, y: 224, a: -90, n: 4, ten: "Túi cùng: dịch có hồi âm, tử cung rỗng", sim: { c: "tuCung", p: { ngoai: 1 } } }] }, sim: { c: "ruq", p: { dich: 1 } },
      lam: ["Luôn khám khoang Morison khi không thấy IUP hoặc bệnh nhân đau/tụt huyết áp.", "Tìm dịch ở túi cùng sau tử cung, nhất là dịch có hồi âm (máu)."],
      dat: "", meo: "Dịch ở khoang Morison ở phụ nữ có thai nghi ngoài tử cung là dấu hiệu nặng." },
  ],
  ketQua: [
    { ten: "Thai trong tử cung chắc chắn", sim: { c: "tuCung", p: { iup: 1 } }, mo: "Túi thai có túi noãn hoàng và phôi, lớp cơ bao quanh đủ dày." },
    { ten: "Tử cung rỗng + dịch có máu", sim: { c: "tuCung", p: { ngoai: 1 } }, mo: "Nghi thai ngoài tử cung vỡ." },
    { ten: "Dịch khoang Morison", sim: { c: "ruq", p: { dich: 1 } }, mo: "Chảy máu nhiều trong ổ bụng." },
  ],
  bang: `<div class="bang-wrap"><table>
<tr><th>Kết quả</th><th>Hướng xử trí thường gặp</th></tr>
<tr><td>IUP chắc chắn, không dịch tự do đáng kể</td><td>Thai ngoài ít khả năng (lưu ý hỗ trợ sinh sản); xử trí theo chẩn đoán dọa sẩy/ra máu thai sớm, hẹn sản khoa</td></tr>
<tr><td>Không thấy IUP, không dịch tự do, ổn định</td><td>Thai chưa xác định vị trí: hCG định lượng, siêu âm chuyên khoa (đầu dò âm đạo), theo dõi sát, dặn dấu hiệu nặng</td></tr>
<tr><td>Không thấy IUP + dịch tự do (nhất là Morison) hoặc tụt huyết áp</td><td>Nghi thai ngoài tử cung vỡ: hồi sức, máu, gọi sản khoa mổ cấp cứu</td></tr>
</table></div>`,
  lamSang: `<p>Siêu âm tại giường giúp rút ngắn thời gian đến phẫu thuật ở thai ngoài vỡ và giảm thời gian lưu cấp cứu khi thấy IUP chắc chắn. "Không thấy IUP" không có nghĩa là thai ngoài, nhưng cũng không bao giờ được coi là an toàn.</p>`,
  bay: ["Gọi túi thai giả là IUP.", "Bỏ sót thai đoạn kẽ do không đo lớp cơ bao quanh.", "Bỏ qua thai cùng lúc trong và ngoài tử cung ở bệnh nhân hỗ trợ sinh sản.", "Nhầm dịch trong âm đạo/cổ tử cung hoặc bàng quang với túi thai.", "Không khám khoang Morison."],
  kiemTra: ["Lấy hai mặt cắt tử cung qua đường bụng.", "Nêu tiêu chuẩn IUP chắc chắn.", "Kết hợp khám Morison trong mọi ca không thấy IUP."],
  tuKiem: [
    { q: "Thấy túi dịch ở giữa lòng tử cung, không có túi noãn hoàng, không vòng kép. Kết luận?", a: ["IUP chắc chắn", "Không đủ tiêu chuẩn IUP; có thể là túi thai giả", "Thai trứng", "Bình thường"], d: 1, giai: "IUP chắc chắn cần túi noãn hoàng hoặc phôi." },
    { q: "Nữ 26 tuổi hCG (+), HA 85/50, tử cung rỗng, dịch khoang Morison. Xử trí?", a: ["Hẹn siêu âm sau 48 giờ", "Hồi sức, gọi sản khoa mổ cấp cứu", "Định lượng hCG và chờ", "Cho methotrexate"], d: 1, giai: "Nghi thai ngoài vỡ có sốc." },
    { q: "IUP chắc chắn ở bệnh nhân thụ tinh trong ống nghiệm, đau hố chậu phải, dịch tự do nhiều. Nghĩ đến?", a: ["Bình thường", "Thai cùng lúc trong và ngoài tử cung", "Viêm ruột thừa chắc chắn", "Nang hoàng thể"], d: 1, giai: "Nguy cơ thai cùng lúc trong – ngoài tăng rõ ở hỗ trợ sinh sản." },
  ],
  tk: ["mateer", "acep", "noble"],
});

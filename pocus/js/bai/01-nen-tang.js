/* Giai đoạn 1: Nền tảng */
POCUS.them({
  id: "nen-tang", gd: 1, ten: "Vật lý vừa đủ, đầu dò, núm chỉnh và định hướng", phut: 45,
  ngan: "Hiểu máy tạo hình thế nào để biết chỉnh gì khi hình xấu.",
  cauHoi: ["Hình đang thấy là mặt phẳng nào của cơ thể, phía nào là đầu, phía nào là bên phải bệnh nhân?", "Hình xấu vì cửa sổ, vì đầu dò hay vì chỉnh máy?"],
  mucTieu: [
    "Giải thích được vì sao dịch đen, xương và khí trắng, và vì sao phía sau khí không thấy gì.",
    "Chọn đúng đầu dò và chế độ cài đặt sẵn (preset) cho từng ứng dụng.",
    "Chỉnh độ sâu, gain, tiêu điểm theo thứ tự cố định trong 10 giây.",
    "Định hướng đúng quy ước: dấu đầu dò ↔ dấu trên màn hình; phân biệt quy ước bụng và quy ước tim.",
    "Thực hiện 5 động tác đầu dò: trượt, xoay, quạt, lắc, ép.",
  ],
  lyThuyet: `
<h3>Siêu âm tạo hình như thế nào</h3>
<p>Đầu dò phát xung âm tần số 2–15 MHz rồi chuyển sang chế độ nghe. Máy đo thời gian từ lúc phát tới lúc nhận tiếng vọng và giả định âm đi trong mô mềm với tốc độ trung bình <b>1540 m/s</b> để tính độ sâu. Cường độ tiếng vọng quyết định độ sáng điểm ảnh.</p>
<p>Tiếng vọng mạnh khi âm gặp ranh giới giữa hai môi trường có <b>trở kháng âm</b> chênh nhau nhiều. Mô mềm – khí và mô mềm – xương chênh lệch rất lớn nên gần như toàn bộ âm bị phản xạ: bề mặt rất sáng và phía sau là <b>bóng lưng</b>. Vì vậy cần gel để đuổi lớp khí giữa đầu dò và da, và vì vậy phổi chứa khí không cho "nhìn vào trong" mà chỉ tạo ảnh giả có quy luật (xem bài Ảnh giả).</p>
<div class="bang-wrap"><table>
<tr><th>Thuật ngữ</th><th>Hình trên màn</th><th>Ví dụ</th></tr>
<tr><td>Trống âm (anechoic)</td><td>Đen hoàn toàn</td><td>Dịch trong: máu mới, nước tiểu, mật, dịch màng phổi thấm</td></tr>
<tr><td>Giảm âm (hypoechoic)</td><td>Xám tối hơn mô xung quanh</td><td>Cơ, hạch, máu đông mới, khối áp xe</td></tr>
<tr><td>Đồng âm (isoechoic)</td><td>Giống mô xung quanh</td><td>Máu đông đã tổ chức (dễ bỏ sót trong FAST)</td></tr>
<tr><td>Tăng âm (hyperechoic)</td><td>Trắng sáng</td><td>Xương, sỏi, màng phổi, cơ hoành, mỡ xoang thận, thành tĩnh mạch cửa</td></tr>
</table></div>
<h3>Tần số và độ sâu: luôn phải đánh đổi</h3>
<p>Tần số cao cho độ phân giải tốt nhưng bị suy giảm nhanh nên xuyên thấu nông; tần số thấp xuyên sâu nhưng hình thô. Mức suy giảm trong mô mềm khoảng 0,5 dB/cm/MHz, nên đầu dò 10 MHz mất năng lượng nhanh gấp khoảng 3 lần đầu dò 3,5 MHz.</p>
<div class="loai-dd-cho"></div>
<h3>Các chế độ</h3>
<ul>
<li><b>B-mode (2D)</b>: hình thang xám, dùng cho gần như mọi câu hỏi tại giường.</li>
<li><b>M-mode</b>: ghi chuyển động dọc một đường quét theo thời gian. Dùng cho trượt màng phổi (bờ biển / mã vạch), TAPSE, MAPSE, EPSS, tim thai, đường kính tĩnh mạch chủ dưới.</li>
<li><b>Doppler màu</b>: tô màu dòng chảy theo hướng so với đầu dò: <b>đỏ đi về phía đầu dò, xanh đi ra xa</b> (không phải đỏ là động mạch). Phân biệt mạch máu với cấu trúc chứa dịch khác.</li>
<li><b>Doppler xung (PW)</b>: vận tốc tại một vị trí chọn (cửa sổ mẫu): đo VTI đường ra thất trái, dòng qua van hai lá, sóng tĩnh mạch trong VExUS.</li>
<li><b>Doppler liên tục (CW)</b>: đo được vận tốc rất cao nhưng không biết vị trí trên đường quét: chênh áp qua van ba lá, hẹp chủ.</li>
<li><b>Power Doppler</b>: nhạy với dòng chậm, không cho hướng: tưới máu tinh hoàn, buồng trứng.</li>
</ul>
<h3>Quy ước định hướng</h3>
<p>Mỗi đầu dò có một <b>dấu</b> (gờ, rãnh hoặc đèn) tương ứng với <b>chấm đánh dấu trên màn hình</b>. Trong chế độ bụng (quy ước chẩn đoán hình ảnh, cấp cứu dùng mặc định) chấm nằm bên <b>trái</b> màn hình:</p>
<ul>
<li>Cắt dọc: dấu đầu dò hướng về <b>đầu</b> bệnh nhân → phía đầu nằm bên trái màn hình.</li>
<li>Cắt ngang: dấu đầu dò hướng về <b>bên phải</b> bệnh nhân → bên phải bệnh nhân nằm bên trái màn hình, giống cách đọc CT (nhìn từ chân lên).</li>
</ul>
<p>Chế độ tim (quy ước tim mạch) đặt chấm bên <b>phải</b> màn hình. Các hướng dẫn mặt cắt tim trong ứng dụng này dùng quy ước tim. Nếu khám tim bằng preset bụng, xoay dấu đầu dò ngược 180° so với mô tả để có hình giống sách.</p>
<p class="meo">Thói quen chống nhầm: trước mỗi lần quét, chạm ngón tay vào một đầu mặt đầu dò có gel và nhìn bên nào trên màn hình động đậy.</p>
<h3>Núm chỉnh: thứ tự 10 giây</h3>
<ol>
<li><b>Đầu dò và preset</b> đúng ứng dụng (preset phổi tắt các bộ lọc làm mất ảnh giả; preset tim có tốc độ khung hình cao).</li>
<li><b>Độ sâu</b>: cấu trúc đích nằm khoảng giữa đến 2/3 màn hình, thấy được cả cấu trúc phía sau nó (ví dụ thấy ĐMC ngực xuống trong mặt cắt cạnh ức trục dọc để phân biệt dịch màng tim và màng phổi).</li>
<li><b>Gain</b> tổng: dịch phải đen, mô đặc có hạt rõ. Gain quá cao lấp mất dịch ít; quá thấp làm mô đặc giống dịch.</li>
<li><b>TGC</b> (bù suy giảm theo độ sâu): để các thanh thẳng hàng, chỉ chỉnh khi một dải độ sâu tối/sáng bất thường.</li>
<li><b>Tiêu điểm</b> (nếu máy có): đặt ngang hoặc ngay dưới cấu trúc đích.</li>
<li><b>Đông cứng, cuộn lại, đo, lưu clip</b>: lưu clip động (thường 3–6 giây) thay vì ảnh tĩnh cho mọi ứng dụng có chuyển động.</li>
</ol>
<h3>Năm động tác đầu dò</h3>
<div class="dong-tac-cho"></div>
<p>Cầm đầu dò như cầm bút, gần mặt đầu dò; tựa mép bàn tay hoặc ngón út lên người bệnh để cố định. Thay đổi <b>một động tác mỗi lần</b>, chậm, quan sát màn hình chứ không nhìn tay.</p>
<h3>An toàn</h3>
<ul>
<li>Nguyên tắc <b>ALARA</b> (thấp nhất có thể đạt được): theo dõi chỉ số cơ học (MI) và nhiệt (TI), nhất là khi khám mắt (dùng preset mắt) và thai sớm (dùng M-mode thay Doppler để ghi tim thai).</li>
<li>Khử khuẩn đầu dò giữa các bệnh nhân theo quy định của cơ sở; bọc vô khuẩn và gel vô khuẩn khi làm thủ thuật.</li>
<li>Siêu âm tại giường trả lời một câu hỏi tập trung. Kết quả âm tính không loại trừ bệnh nằm ngoài câu hỏi đó; khi nghi ngờ vượt khả năng, cần siêu âm chuyên khoa hoặc phương tiện khác.</li>
</ul>`,
  chuanBi: { dauDo: "Bắt đầu với đầu dò cong; thử lại với đầu dò thẳng và đầu dò tim trên cùng một vùng.", cheDo: "Preset bụng (Abdomen).", tuThe: "Người mẫu khỏe mạnh nằm ngửa; máy đặt đối diện người khám, màn hình ngang tầm mắt.", khac: "Gel, khăn lau; giảm ánh sáng phòng." },
  buoc: [
    { ten: "Kiểm tra định hướng", hinh: { than: "nguc", dd: [{ x: 30, y: 140, a: -90, n: 1 }] }, sim: { c: "ruq", p: {} },
      lam: ["Bôi gel lên đầu dò cong.", "Chạm ngón tay vào đầu mặt đầu dò phía có dấu; xác định bên tương ứng trên màn hình (chấm cam).", "Đặt đầu dò đường nách giữa bên phải, khoang liên sườn 8–9, dấu hướng về đầu bệnh nhân."],
      dat: "Gan ở giữa, cơ hoành bên trái màn hình (phía đầu), thận phải ở sâu bên phải màn hình.", meo: "Nếu cơ hoành lại nằm bên phải màn hình: dấu đầu dò đang hướng xuống chân, xoay 180°." },
    { ten: "Chỉnh độ sâu và gain", hinh: { than: "nguc", dd: [{ x: 30, y: 140, a: -90 }] }, sim: { c: "ruq", p: { dich: 1 }, dk: true },
      lam: ["Tăng độ sâu tới khi thấy cột sống phía sau thận, rồi giảm sao cho thận nằm khoảng 2/3 màn hình.", "Kéo gain lên quá mức: dải dịch mỏng ở khoang Morison bị lấp xám.", "Hạ gain quá mức: gan tối gần như dịch.", "Đưa gain về mức dịch đen, gan có hạt rõ."],
      dat: "Dải dịch đen nổi rõ trên nền gan xám; thấy trọn thận và cơ hoành.", meo: "Thử ngay với thanh trượt bên dưới hình mô phỏng." },
    { ten: "Tập 5 động tác", hinh: { than: "nguc", dd: [{ x: 104, y: 130, a: -90, mv: "truot" }] }, sim: { c: "ivc", p: {} },
      lam: ["Đặt đầu dò dưới mũi ức, cắt dọc, dấu về phía đầu.", "Trượt nhẹ sang phải bệnh nhân để tìm tĩnh mạch chủ dưới.", "Quạt sang hai bên để quét qua toàn bộ chiều ngang mạch.", "Lắc để đưa chỗ TMC dưới đổ vào nhĩ phải vào giữa hình.", "Xoay 90° để chuyển sang trục ngắn; ép nhẹ để thấy mạch thay đổi."],
      dat: "Giữ được mạch trong mặt cắt suốt chu kỳ thở mà không phải nhấc đầu dò.", meo: "Mỗi lần chỉ làm một động tác, biên độ nhỏ (vài độ hoặc vài mm)." },
  ],
  ketQua: [
    { ten: "Gain đúng", sim: { c: "ruq", p: { dich: 1 } }, mo: "Dịch đen, gan có hạt mịn, cơ hoành sáng." },
    { ten: "Gain quá cao", sim: { c: "ruq", p: { dich: 1, gain: 1.8 } }, mo: "Hình bị phủ mờ, dịch xám: dễ bỏ sót dịch ít." },
    { ten: "Gain quá thấp", sim: { c: "ruq", p: { dich: 1, gain: 0.45 } }, mo: "Mô đặc tối, dễ nhầm với dịch; khó thấy bờ thận." },
  ],
  lamSang: `<p>Phần lớn "siêu âm không thấy gì" ở người mới học là do <b>cửa sổ</b> (khí ruột, xương sườn, béo phì), không phải do bệnh nhân không có bệnh. Trước khi kết luận âm tính, tự hỏi: đã đủ độ sâu chưa, đã quét qua hết cơ quan bằng động tác quạt chưa, gain có lấp dịch không, đã thử cửa sổ khác hoặc tư thế khác chưa.</p>
<p>Ghi kết quả theo cấu trúc: <b>chỉ định – cửa sổ khảo sát – chất lượng hình – kết quả – kết luận trả lời câu hỏi lâm sàng</b>. Nếu chất lượng không đủ, ghi "không xác định" thay vì "âm tính".</p>`,
  bay: [
    "Nhầm bên vì không kiểm tra dấu đầu dò, nhất là khi chuyển giữa preset tim và preset bụng.",
    "Để độ sâu quá nông nên bỏ sót cấu trúc phía sau (dịch sau tim, cột sống trên cơ hoành).",
    "Gain quá cao che dịch ít; gain quá thấp biến mô đặc thành 'dịch'.",
    "Lưu ảnh tĩnh cho cấu trúc động (tim, màng phổi) nên không thể xem lại để đánh giá.",
    "Kết luận âm tính khi hình không đủ chất lượng.",
  ],
  kiemTra: [
    "Nói được quy ước dấu đầu dò cho mặt cắt dọc và ngang.",
    "Chỉnh độ sâu, gain, tiêu điểm theo thứ tự trong 10 giây.",
    "Thực hiện đúng 5 động tác khi được gọi tên.",
    "Lưu được một clip động và đặt tên/ghi chú.",
  ],
  tuKiem: [
    { q: "Vì sao không nhìn thấy cấu trúc nằm sau xương sườn?", a: ["Vì gain quá thấp", "Vì xương phản xạ và hấp thu gần hết chùm âm, tạo bóng lưng", "Vì tần số quá cao", "Vì máy giả định tốc độ âm 1540 m/s"], d: 1, giai: "Ranh giới mô mềm – xương chênh lệch trở kháng rất lớn nên âm hầu như không đi qua: phía sau là bóng lưng. Cách xử lý là đặt đầu dò vào khoang liên sườn hoặc xoay song song xương sườn." },
    { q: "Ở mặt cắt ngang bụng theo quy ước bụng, dấu đầu dò hướng về đâu?", a: ["Về bên phải bệnh nhân", "Về bên trái bệnh nhân", "Về phía đầu", "Về phía chân"], d: 0, giai: "Cắt ngang: dấu hướng về bên phải bệnh nhân, bên phải bệnh nhân hiện ở bên trái màn hình như phim CT." },
    { q: "Doppler màu hiển thị đỏ nghĩa là gì?", a: ["Động mạch", "Máu oxy hóa", "Dòng chảy hướng về phía đầu dò", "Vận tốc cao"], d: 2, giai: "Màu chỉ hướng dòng chảy so với đầu dò (đỏ: về phía đầu dò, xanh: ra xa), không phân biệt động mạch – tĩnh mạch." },
    { q: "Muốn đánh giá màng phổi và mô mềm nông với độ phân giải cao nhất, chọn đầu dò nào?", a: ["Cong", "Tim", "Thẳng", "Đầu dò nào cũng như nhau"], d: 2, giai: "Đầu dò thẳng tần số cao cho độ phân giải tốt ở vùng nông." },
    { q: "Động tác nào giữ nguyên điểm tiếp xúc và quét lát cắt qua cả cơ quan như lật trang sách?", a: ["Trượt", "Quạt", "Xoay", "Ép"], d: 1, giai: "Quạt (nghiêng) theo chiều ngắn của mặt đầu dò quét qua toàn bộ thể tích cơ quan; bắt buộc khi tìm dịch ít hoặc sỏi." },
  ],
  tk: ["mateer", "noble", "soni", "acep"],
});

POCUS.them({
  id: "anh-gia", gd: 1, ten: "Ảnh giả: hiểu để tận dụng", phut: 30,
  ngan: "Bóng lưng, tăng âm, dội lại, ảnh gương, đuôi sao chổi: phần lớn là công cụ chẩn đoán.",
  cauHoi: ["Hình sáng/tối này là cấu trúc thật hay ảnh giả?", "Ảnh giả này nói gì về môi trường âm đi qua (dịch, khí, vôi)?"],
  mucTieu: ["Nhận diện 7 ảnh giả thường gặp và cơ chế.", "Dùng ảnh giả để chẩn đoán: sỏi (bóng lưng), dịch (tăng âm), phổi (đường A, B, ảnh gương).", "Tránh nhầm ảnh giả với bệnh lý."],
  lyThuyet: `
<p>Máy giả định: âm đi thẳng, tốc độ không đổi, mỗi tiếng vọng chỉ phản xạ một lần, suy giảm đều. Khi giả định bị phá vỡ, máy tạo <b>ảnh giả</b>. Nhiều ảnh giả là dấu hiệu chẩn đoán.</p>
<div class="bang-wrap"><table>
<tr><th>Ảnh giả</th><th>Cơ chế</th><th>Hình</th><th>Ý nghĩa</th></tr>
<tr><td><b>Bóng lưng</b></td><td>Cấu trúc phản xạ/hấp thu gần hết âm</td><td>Dải đen sau sỏi, xương. Bóng "sạch" (đen đều) sau sỏi/xương; bóng "bẩn" (xám, có vệt) sau khí</td><td>Xác nhận sỏi mật, sỏi thận; nhận diện xương sườn</td></tr>
<tr><td><b>Tăng âm phía sau</b></td><td>Dịch suy giảm âm ít hơn mô quanh nên mô phía sau được bù quá mức</td><td>Vùng sáng phía sau bàng quang, túi mật, nang</td><td>Gợi ý cấu trúc chứa dịch; lưu ý có thể che dịch ít ở túi cùng sau bàng quang → giảm gain vùng xa</td></tr>
<tr><td><b>Dội lại (reverberation)</b></td><td>Âm nảy qua lại giữa hai mặt phản xạ mạnh song song</td><td>Các vạch ngang cách đều nhau</td><td><b>Đường A</b> ở phổi; dội lại sau kim, sau thành bàng quang trước</td></tr>
<tr><td><b>Đuôi sao chổi / ring-down</b></td><td>Dội lại rất sát nhau ở cấu trúc nhỏ (bọt khí, kim loại) hoặc vách liên tiểu thùy dày, có dịch</td><td>Vệt sáng thẳng đứng</td><td><b>Đường B</b> (từ màng phổi đến đáy màn, xóa đường A, di động theo trượt phổi) = hội chứng kẽ</td></tr>
<tr><td><b>Ảnh gương</b></td><td>Âm phản xạ trên mặt cong rất mạnh (cơ hoành – phổi chứa khí) rồi quay về muộn</td><td>Hình gan/lách lặp lại phía trên cơ hoành</td><td>Bình thường. <b>Mất ảnh gương</b> + thấy cột sống trên cơ hoành = dịch màng phổi</td></tr>
<tr><td><b>Bóng bờ (edge)</b></td><td>Khúc xạ ở bờ cấu trúc tròn chứa dịch</td><td>Dải tối mảnh từ bờ túi mật, thận, mạch máu</td><td>Không nhầm với bóng lưng của sỏi: không có cấu trúc sáng đứng trước</td></tr>
<tr><td><b>Thùy bên / độ dày lát cắt</b></td><td>Năng lượng ngoài chùm chính hoặc lát cắt có độ dày</td><td>Hồi âm mờ trong lòng cấu trúc dịch</td><td>Giả bùn mật, giả cặn bàng quang → đổi góc, đổi tư thế: ảnh giả biến mất</td></tr>
</table></div>
<p>Hai nguyên tắc chung: (1) ảnh giả thường <b>đổi hoặc mất</b> khi đổi góc đầu dò, cấu trúc thật thì không; (2) ở phổi, ta không nhìn nhu mô mà đọc <b>hệ thống ảnh giả</b> có quy luật.</p>`,
  chuanBi: { dauDo: "Cong cho bụng; thẳng cho phổi.", cheDo: "Bụng; phổi (tắt harmonic/compound nếu máy cho phép).", tuThe: "Nằm ngửa.", khac: "Người mẫu nên uống nước trước để bàng quang đầy." },
  buoc: [
    { ten: "Đường A: dội lại ở phổi", hinh: { than: "nguc", dd: [{ x: 70, y: 62, a: -90, n: 1 }] }, sim: { c: "phoi", p: {} },
      lam: ["Đầu dò thẳng, cắt dọc khoang liên sườn 2–3 đường giữa đòn.", "Tìm hình 'con dơi': 2 xương sườn và đường màng phổi ở giữa.", "Đếm khoảng cách da – màng phổi; đường A nằm ở bội số khoảng cách đó."],
      dat: "Thấy ít nhất 2 đường A song song màng phổi.", meo: "Đường A rõ nhất khi tia âm vuông góc màng phổi: lắc nhẹ đầu dò." },
    { ten: "Ảnh gương trên cơ hoành", hinh: { than: "nguc", dd: [{ x: 30, y: 140, a: -90, n: 2 }] }, sim: { c: "ruq", p: {} },
      lam: ["Đầu dò cong ở hạ sườn phải như FAST.", "Quạt lên trên cơ hoành.", "Nhận ra hình nhu mô gan lặp lại phía trên cơ hoành; cột sống dừng lại ở cơ hoành."],
      dat: "Thấy ảnh gương và 'màn che' của phổi chuyển động theo nhịp thở.", meo: "Đây là hình bình thường; mất nó là dấu hiệu đầu tiên của dịch màng phổi." },
    { ten: "Tăng âm sau bàng quang", hinh: { than: "nguc", dd: [{ x: 100, y: 222, a: 180, n: 3 }] }, sim: { c: "bangQuang", p: {} },
      lam: ["Đặt đầu dò trên xương mu, cắt ngang.", "Quan sát vùng sáng hơn phía sau bàng quang.", "Giảm gain vùng xa (TGC) để không che dịch túi cùng."],
      dat: "Phân biệt được tăng âm (ảnh giả) với cấu trúc thật phía sau.", meo: "" },
    { ten: "Bóng lưng sau sỏi", hinh: { than: "nguc", dd: [{ x: 72, y: 142, a: -90, n: 4 }] }, sim: { c: "tuiMat", p: { soi: 1 } },
      lam: ["Tìm túi mật dưới bờ sườn phải.", "Quan sát cấu trúc sáng ở đáy túi mật và dải đen đều phía sau.", "Xoay bệnh nhân nghiêng trái: sỏi lăn, bóng lưng đi theo."],
      dat: "Bóng lưng sạch nằm ngay sau cấu trúc sáng, đi theo khi sỏi di động.", meo: "Bóng lưng rõ hơn khi đặt tiêu điểm ngang mức sỏi và dùng tần số cao hơn." },
  ],
  ketQua: [
    { ten: "Đường A (dội lại)", sim: { c: "phoi", p: {} }, mo: "Phổi chứa khí bình thường hoặc tràn khí màng phổi: phải xem thêm trượt màng phổi." },
    { ten: "Đường B (đuôi sao chổi)", sim: { c: "phoi", p: { b: 4 } }, mo: "Vệt dọc từ màng phổi đến đáy màn, xóa đường A, di động." },
    { ten: "Mất ảnh gương, cột sống trên cơ hoành", sim: { c: "ruq", p: { mp: 1 } }, mo: "Dịch màng phổi: âm truyền qua dịch nên thấy được cột sống phía trên cơ hoành (dấu cột sống)." },
    { ten: "Bóng lưng sạch sau sỏi", sim: { c: "tuiMat", p: { soi: 1 } }, mo: "Sỏi mật." },
  ],
  lamSang: `<p>Trong cấp cứu, ba nhóm ảnh giả quyết định nhiều chẩn đoán nhất: <b>đường A/B và trượt màng phổi</b> (khó thở, tràn khí), <b>dấu cột sống và mất ảnh gương</b> (tràn dịch/tràn máu màng phổi trong E-FAST), <b>bóng lưng sạch</b> (sỏi mật, sỏi thận).</p>`,
  bay: ["Nhầm bóng bờ của túi mật với bóng lưng của sỏi.", "Nhầm hồi âm thùy bên trong bàng quang/túi mật với cặn hoặc bùn: đổi góc để kiểm tra.", "Gain vùng xa quá cao (tăng âm) che mất dịch ít ở túi cùng.", "Dùng preset có lọc ảnh (compound, harmonic) khi khám phổi làm mờ đường B."],
  kiemTra: ["Chỉ ra đường A và giải thích cơ chế.", "Chỉ ra ảnh gương trên cơ hoành ở người bình thường.", "Phân biệt bóng lưng và bóng bờ trên một hình túi mật."],
  tuKiem: [
    { q: "Đường A được tạo ra do cơ chế nào?", a: ["Đuôi sao chổi", "Dội lại giữa màng phổi và mặt đầu dò", "Ảnh gương", "Khúc xạ"], d: 1, giai: "Màng phổi – khí là mặt phản xạ rất mạnh; âm nảy qua lại giữa màng phổi và đầu dò tạo các vạch cách đều ở bội số khoảng cách da – màng phổi." },
    { q: "Thấy cột sống ngực kéo dài lên trên cơ hoành ở cửa sổ hạ sườn phải. Ý nghĩa?", a: ["Bình thường", "Gợi ý dịch màng phổi phải", "Tràn khí màng phổi", "Ảnh gương"], d: 1, giai: "Phổi chứa khí bình thường che cột sống trên cơ hoành. Dịch truyền âm tốt nên cột sống hiện ra: dấu cột sống." },
    { q: "Dải tối mảnh xuất phát từ bờ túi mật, không có cấu trúc sáng phía trước, là gì?", a: ["Sỏi kẹt cổ túi mật", "Bóng bờ (khúc xạ)", "Khí trong thành túi mật", "Dịch quanh túi mật"], d: 1, giai: "Bóng bờ do khúc xạ ở bờ cấu trúc tròn chứa dịch, không phải sỏi." },
    { q: "Vì sao cần giảm gain vùng xa khi tìm dịch ở túi cùng sau bàng quang?", a: ["Để tiết kiệm pin", "Vì tăng âm phía sau bàng quang có thể làm dịch ít trông xám như mô", "Vì dịch ở túi cùng luôn tăng âm", "Không cần"], d: 1, giai: "Tăng âm phía sau làm vùng sau bàng quang sáng quá mức, dải dịch mỏng có thể bị che." },
  ],
  tk: ["mateer", "noble", "lichtBook"],
});

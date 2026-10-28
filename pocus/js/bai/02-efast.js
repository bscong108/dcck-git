/* Giai đoạn 2: E-FAST */
POCUS.them({
  id: "efast", gd: 2, ten: "E-FAST trong chấn thương", phut: 50,
  ngan: "Tìm dịch tự do ổ bụng, dịch màng tim, tràn máu và tràn khí màng phổi trong vài phút.",
  cauHoi: ["Có dịch tự do trong ổ bụng không?", "Có dịch màng ngoài tim không?", "Có tràn khí màng phổi không?", "Có tràn máu màng phổi không?"],
  mucTieu: [
    "Thực hiện đủ 6 cửa sổ theo thứ tự cố định, mỗi cửa sổ quét hết vùng dịch dễ tụ.",
    "Nhận ra dịch tự do ở khoang Morison, đầu dưới gan, dưới hoành trái, quanh lách, túi cùng.",
    "Ra quyết định theo huyết động: mổ, CT hay theo dõi và lặp lại.",
    "Biết các giới hạn: E-FAST âm tính không loại trừ tổn thương.",
  ],
  lyThuyet: `
<p>FAST (Focused Assessment with Sonography for Trauma) tìm <b>dịch tự do</b>, trong bối cảnh chấn thương được coi là máu. E-FAST mở rộng thêm khảo sát màng phổi hai bên để tìm tràn khí và tràn máu màng phổi. Kỹ thuật làm song song với hồi sức trong đánh giá ban đầu, không làm chậm cấp cứu đường thở – hô hấp – tuần hoàn.</p>
<h3>Dịch tụ ở đâu</h3>
<ul>
<li><b>Hạ sườn phải</b>: dịch tụ ở khoang gan – thận (Morison) và rất thường ở <b>đầu dưới gan, rãnh cạnh đại tràng phải</b>. Phải quét đến tận cực dưới thận và đầu dưới gan, không dừng ở khoang Morison.</li>
<li><b>Hạ sườn trái</b>: dây chằng lách – đại tràng cản dịch chảy xuống, nên dịch thường tụ trước tiên ở <b>khoang dưới hoành, quanh cực trên lách</b>, không phải giữa lách và thận.</li>
<li><b>Chậu hông</b>: điểm thấp nhất khi nằm ngửa: túi cùng trực tràng – bàng quang ở nam, túi cùng Douglas (sau tử cung) ở nữ.</li>
<li>Tư thế Trendelenburg làm dịch dồn về hạ sườn; tư thế Fowler làm dịch dồn về chậu.</li>
</ul>
<p>Lượng dịch tối thiểu phát hiện được thay đổi nhiều giữa các nghiên cứu (từ khoảng 100 mL đến vài trăm mL), phụ thuộc người làm, tư thế và cửa sổ. Hệ quả thực hành: <b>lặp lại FAST</b> khi lâm sàng thay đổi.</p>
<h3>Màng ngoài tim</h3>
<p>Cửa sổ dưới mũi ức dùng gan làm cửa sổ âm. Nếu không thấy (khí dạ dày, đau, béo phì), chuyển sang cạnh ức trục dọc. Trong chấn thương xuyên thấu vùng tim, dịch màng tim là chỉ định phẫu thuật cấp cứu.</p>
<h3>Màng phổi</h3>
<p>Bệnh nhân nằm ngửa, khí tụ ở phía trước: khảo sát vùng trước ngực (khoang liên sườn 2–3 đường giữa đòn, rồi xuống dưới và ra ngoài). Có trượt màng phổi, đường B hoặc mạch phổi (lung pulse) tại điểm khám thì loại trừ tràn khí ở điểm đó. Tràn máu màng phổi thấy khi quạt lên trên cơ hoành ở hai cửa sổ hạ sườn: mất ảnh gương, dịch trên cơ hoành, dấu cột sống.</p>
<p>Siêu âm phát hiện tràn khí màng phổi nhạy hơn rõ rệt so với phim X quang ngực tư thế nằm, độ đặc hiệu của cả hai đều cao.</p>`,
  chuanBi: { dauDo: "Cong (hoặc tim) cho bụng và tim; thẳng cho màng phổi (có thể dùng đầu dò cong/tim với độ sâu nông nếu cần nhanh).", cheDo: "Bụng/FAST; chuyển preset tim cho cửa sổ tim nếu máy cho phép.", tuThe: "Nằm ngửa. Người khám đứng bên phải bệnh nhân. Trendelenburg làm dịch dồn lên hạ sườn, Fowler (nửa ngồi) làm dịch dồn xuống chậu.", tth: ["ngua", "trend", "nuaNgoi"], khac: "Không cần chờ bàng quang đầy; nếu đã đặt sonde tiểu, có thể kẹp sonde hoặc bơm nước muối để tạo cửa sổ." },
  buoc: [
    { ten: "Cửa sổ 1: Hạ sườn phải", hinh: { than: "nguc", dd: [{ x: 30, y: 142, a: -90, n: 1 }] }, sim: { c: "ruq", p: {} },
      lam: ["Đầu dò đường nách giữa – sau bên phải, khoang liên sườn 8–11, dấu về phía đầu.", "Xoay nhẹ (dấu hơi ra sau) để mặt đầu dò nằm giữa hai xương sườn.", "Tìm gan, thận phải và khoang Morison giữa chúng.", "Quạt trước – sau qua toàn bộ thận.", "Trượt xuống để thấy <b>đầu dưới gan và cực dưới thận</b>.", "Trượt lên, quạt qua cơ hoành: tìm dịch màng phổi (mất ảnh gương, dấu cột sống)."],
      dat: "Thấy cơ hoành, gan, toàn bộ thận từ cực trên đến cực dưới, đầu dưới gan.", meo: "Bóng xương sườn che hình: bảo bệnh nhân hít vào sâu (nếu tỉnh) hoặc trượt xuống một khoang." },
    { ten: "Cửa sổ 2: Hạ sườn trái", hinh: { than: "nguc", dd: [{ x: 170, y: 120, a: -90, n: 2 }] }, sim: { c: "luq", p: {} },
      lam: ["Đặt đầu dò <b>cao và sau hơn</b> bên phải: đường nách sau, khoang liên sườn 6–9. Mu bàn tay chạm giường.", "Dấu về phía đầu, xoay nhẹ theo khoang liên sườn.", "Tìm lách, cơ hoành, thận trái.", "Quét kỹ khoang dưới hoành quanh cực trên lách, sau đó khoang lách – thận và cực dưới lách.", "Quạt lên trên cơ hoành tìm dịch màng phổi trái."],
      dat: "Thấy cơ hoành, toàn bộ lách và khoang dưới hoành, thận trái.", meo: "Không thấy lách thường do đặt quá thấp và quá trước: lùi ra sau và lên trên." },
    { ten: "Cửa sổ 3: Chậu hông", hinh: { than: "nguc", dd: [{ x: 100, y: 222, a: -90, n: "3a", ten: "Cắt dọc (dấu về phía đầu)", sim: { c: "chau", p: {} } }, { x: 100, y: 234, a: 180, n: "3b", ny: 16, ten: "Cắt ngang (dấu về bên phải bệnh nhân)", sim: { c: "chauNgang", p: {} } }] }, sim: { c: "chau", p: {} },
      lam: ["Đặt đầu dò ngay trên xương mu, cắt dọc, dấu về phía đầu; hướng chùm âm xuống chậu.", "Quạt sang hai bên qua toàn bộ bàng quang.", "Xoay 90° sang cắt ngang (dấu về bên phải bệnh nhân) và quạt từ trên xuống.", "Tìm dịch ở góc sau – trên bàng quang (nam) hoặc sau tử cung (nữ)."],
      dat: "Thấy bàng quang ở hai mặt cắt và vùng ngay phía sau nó.", meo: "Hạ gain vùng xa vì tăng âm phía sau bàng quang có thể che dịch ít." },
    { ten: "Cửa sổ 4: Dưới mũi ức (tim)", hinh: { than: "nguc", dd: [{ x: 100, y: 124, a: 0, n: 4 }] }, sim: { c: "duoiUc", p: {} },
      lam: ["Đặt đầu dò ngay dưới mũi ức, gần như nằm phẳng trên bụng (cầm đầu dò từ phía trên).", "Dấu hướng về bên trái bệnh nhân; chĩa chùm âm về vai trái.", "Đẩy sâu đủ độ sâu (16–20 cm) để thấy cả thành sau tim.", "Tìm dải đen giữa lá thành màng ngoài tim (sáng) và cơ tim, nhất là phía sau (vùng thấp)."],
      dat: "Thấy gan ở trường gần, 4 buồng tim và màng ngoài tim bao quanh.", meo: "Không thấy: bảo gập gối, hít sâu; trượt sang phải bệnh nhân để dùng gan làm cửa sổ; hoặc chuyển sang cạnh ức trục dọc." },
    { ten: "Cửa sổ 5–6: Màng phổi trước hai bên", hinh: { than: "nguc", dd: [{ x: 70, y: 62, a: -90, n: 5, ten: "Phổi trước phải: B-mode, có trượt + đường A", sim: { c: "phoi", p: {} } }, { x: 130, y: 62, a: -90, n: 6, ten: "Phổi trước trái: M-mode dấu bờ biển", sim: { c: "mPhoi", p: {} } }] }, sim: { c: "phoi", p: {} },
      lam: ["Đầu dò thẳng, cắt dọc, khoang liên sườn 2–3 đường giữa đòn, dấu về phía đầu.", "Tìm hình con dơi, đặt đường màng phổi vào giữa.", "Quan sát trượt màng phổi ít nhất vài nhịp thở; dùng M-mode nếu cần.", "Nếu không thấy trượt: trượt đầu dò ra ngoài và xuống dưới tìm <b>điểm phổi</b>.", "Làm cả hai bên."],
      dat: "Thấy rõ đường màng phổi giữa hai xương sườn và đánh giá được trượt.", meo: "Ở bệnh nhân thở máy hoặc thở yếu, trượt mảnh: giảm độ sâu, phóng to, tìm đường B hoặc mạch phổi để loại trừ tràn khí." },
  ],
  ketQua: [
    { ten: "Hạ sườn phải bình thường", sim: { c: "ruq", p: {} }, mo: "Gan và thận áp sát nhau, ảnh gương trên cơ hoành." },
    { ten: "Dịch khoang Morison", sim: { c: "ruq", p: { dich: 2 } }, mo: "Dải trống âm giữa gan và thận, lan đến đầu dưới gan: FAST dương tính." },
    { ten: "Dịch dưới hoành trái", sim: { c: "luq", p: { dich: 1 } }, mo: "Dịch giữa cơ hoành và lách và giữa lách – thận." },
    { ten: "Dịch túi cùng (nam)", sim: { c: "chau", p: { dich: 1 } }, mo: "Dịch góc nhọn sau – trên bàng quang." },
    { ten: "Dịch túi cùng Douglas (nữ)", sim: { c: "chau", p: { nu: 1, dich: 2 } }, mo: "Dịch sau tử cung, nhiều thì lan lên quanh quai ruột." },
    { ten: "Dịch màng tim", sim: { c: "duoiUc", p: { dich: 1, dongMau: 1 } }, mo: "Dải đen bao quanh tim, có thể có máu đông hồi âm." },
    { ten: "Tràn máu màng phổi", sim: { c: "ruq", p: { mp: 2 } }, mo: "Dịch trên cơ hoành, mất ảnh gương, thấy cột sống trên cơ hoành." },
    { ten: "Tràn khí: điểm phổi", sim: { c: "phoi", p: { diem: 1 } }, mo: "Ranh giới giữa vùng có trượt và vùng không trượt di chuyển theo nhịp thở: đặc hiệu cho tràn khí." },
  ],
  bang: `<div class="bang-wrap"><table>
<tr><th>Tình huống</th><th>Kết quả E-FAST</th><th>Hướng xử trí thường gặp</th></tr>
<tr><td>Huyết động không ổn định</td><td>Dịch ổ bụng (+)</td><td>Hồi sức cầm máu, chuyển phòng mổ/can thiệp cầm máu theo quy trình chấn thương của cơ sở</td></tr>
<tr><td>Huyết động không ổn định</td><td>Dịch ổ bụng (–)</td><td>Tìm nguồn khác: ngực (tràn máu, tràn khí áp lực), màng tim, khung chậu, sau phúc mạc, chi, ngoài cơ thể, sốc tủy; lặp lại FAST</td></tr>
<tr><td>Huyết động ổn định</td><td>Dịch ổ bụng (+)</td><td>CT có thuốc cản quang để xác định tạng tổn thương</td></tr>
<tr><td>Huyết động ổn định</td><td>Âm tính</td><td>Theo cơ chế chấn thương và khám: CT hoặc theo dõi, lặp lại FAST</td></tr>
<tr><td>Chấn thương xuyên thấu vùng tim</td><td>Dịch màng tim (+)</td><td>Phẫu thuật cấp cứu (mở ngực/mở xương ức); chọc dẫn lưu chỉ là cầu nối khi không thể mổ ngay</td></tr>
<tr><td>Bất kỳ</td><td>Không trượt màng phổi + điểm phổi</td><td>Tràn khí màng phổi: dẫn lưu theo lâm sàng; tràn khí áp lực là chẩn đoán lâm sàng, không chờ siêu âm</td></tr>
</table></div>`,
  lamSang: `<p>Giá trị lớn nhất của E-FAST là ở bệnh nhân <b>tụt huyết áp</b>: một FAST dương tính chỉ ra nguồn chảy máu trong ổ bụng và rút ngắn thời gian đến cầm máu. Độ đặc hiệu cho dịch tự do cao; độ nhạy thay đổi nhiều và thấp hơn ở bệnh nhân ổn định.</p>
<p><b>FAST âm tính không loại trừ</b>: tổn thương tạng đặc chưa chảy máu nhiều, tạng rỗng, cơ hoành, tụy, tổn thương sau phúc mạc (thận, mạch máu lớn, gãy khung chậu chảy máu sau phúc mạc).</p>
<p>Ở phụ nữ tuổi sinh sản, một lượng dịch rất ít chỉ ở túi cùng có thể là sinh lý; dịch ở khoang Morison hoặc dịch lượng nhiều thì không. Ở bệnh nhân có cổ trướng, lọc màng bụng, hoặc đã truyền nhiều dịch, dịch tự do không đồng nghĩa với máu.</p>`,
  bay: [
    "Chỉ nhìn khoang Morison mà không quét đầu dưới gan và cực dưới thận.",
    "Đặt đầu dò hạ sườn trái quá thấp, quá trước nên không thấy khoang dưới hoành.",
    "Máu đông có hồi âm (đồng âm với gan/lách) nên bị bỏ sót.",
    "Nhầm mỡ quanh thận, túi mật, dạ dày chứa dịch, quai ruột chứa dịch, nang thận với dịch tự do.",
    "Nhầm lớp mỡ thượng tâm mạc phía trước (hồi âm hạt, di chuyển cùng tim) với dịch màng tim.",
    "Ở cửa sổ tim, nhầm dịch màng phổi trái hoặc dịch cổ trướng với dịch màng tim.",
    "Kết luận không có tràn khí khi chỉ khám một điểm; tràn khí nhỏ ở vị trí cao nhất (trước – dưới) có thể bị bỏ sót.",
    "Trì hoãn chuyển mổ ở bệnh nhân không ổn định để làm thêm hình ảnh.",
  ],
  kiemTra: [
    "Hoàn thành 6 cửa sổ dưới 5 phút trên người mẫu, đúng thứ tự.",
    "Ở mỗi cửa sổ, nói được tiêu chuẩn mặt cắt đạt.",
    "Hạ sườn phải: quét đến đầu dưới gan; hạ sườn trái: thấy khoang dưới hoành.",
    "Chậu: hai mặt cắt dọc và ngang.",
    "Màng phổi: mô tả trượt, dùng M-mode khi nghi ngờ.",
    "Báo cáo kết quả theo từng cửa sổ và trả lời 4 câu hỏi lâm sàng.",
  ],
  tuKiem: [
    { q: "Ở hạ sườn phải, vị trí nào nhạy nhất để phát hiện dịch tự do theo nhiều nghiên cứu và sách hướng dẫn?", a: ["Giữa gan và cơ hoành", "Đầu dưới gan, cạnh cực dưới thận", "Trong nhu mô gan", "Quanh túi mật"], d: 1, giai: "Dịch thường xuất hiện sớm ở đầu dưới gan và rãnh cạnh đại tràng phải; phải quét đến đây chứ không chỉ khoang Morison." },
    { q: "Ở hạ sườn trái, dịch thường tụ trước tiên ở đâu?", a: ["Giữa lách và thận", "Khoang dưới hoành quanh cực trên lách", "Trước dạ dày", "Rãnh cạnh đại tràng trái"], d: 1, giai: "Dây chằng lách – đại tràng cản dịch, dịch tụ trước ở khoang dưới hoành. Đặt đầu dò cao và ra sau." },
    { q: "Bệnh nhân tai nạn, HA 75/40 sau 1 lít dịch, FAST: dịch khoang Morison. Bước tiếp theo hợp lý?", a: ["Chụp CT bụng có cản quang", "Hồi sức cầm máu và chuyển can thiệp cầm máu (mổ) theo quy trình", "Lặp lại FAST sau 30 phút", "Chọc rửa ổ bụng"], d: 1, giai: "Huyết động không ổn định + FAST bụng dương tính: không đưa đi CT, chuyển cầm máu." },
    { q: "Trượt màng phổi có ở điểm khám. Kết luận đúng nhất?", a: ["Loại trừ tràn khí màng phổi tại điểm đó", "Loại trừ tràn khí toàn bộ phổi", "Có tràn khí lượng ít", "Không kết luận được"], d: 0, giai: "Có trượt (hoặc đường B, mạch phổi) loại trừ tràn khí ngay dưới đầu dò. Phải khám vùng cao nhất và nhiều điểm." },
    { q: "FAST âm tính ở bệnh nhân ổn định bị đá vào hông trái, đái máu. Điều nào đúng?", a: ["Loại trừ tổn thương thận", "FAST không đánh giá tốt tổn thương sau phúc mạc; cần CT", "Không cần theo dõi", "Lặp lại FAST là đủ"], d: 1, giai: "Thận nằm sau phúc mạc; chảy máu sau phúc mạc thường không tạo dịch tự do ổ bụng." },
  ],
  tk: ["mateer", "noble", "acep", "rozycki", "kirkpatrick"],
});

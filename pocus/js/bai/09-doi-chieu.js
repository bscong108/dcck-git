/* Ảnh đối chiếu theo từng mặt bệnh: mỗi cặp gồm hình bình thường và hình bệnh lý cùng mặt cắt. */
(function () {
  const S = (c, p) => ({ c, p: p || {} });
  const CAP = {
    efast: [
      { benh: "Dịch tự do khoang Morison", bt: [S("ruq"), "Gan áp sát thận, không có dải đen."], bl: [S("ruq", { dich: 2 }), "Dải trống âm giữa gan và thận, lan đến đầu dưới gan."] },
      { benh: "Dịch quanh lách", bt: [S("luq"), "Lách áp sát cơ hoành và thận."], bl: [S("luq", { dich: 1 }), "Dịch dưới hoành và giữa lách – thận."] },
      { benh: "Dịch túi cùng (nam), cắt dọc", bt: [S("chau"), "Không có dịch sau bàng quang."], bl: [S("chau", { dich: 1 }), "Dịch góc nhọn sau – trên bàng quang."] },
      { benh: "Dịch túi cùng (nam), cắt ngang", bt: [S("chauNgang"), "Bàng quang, tiền liệt tuyến phía sau."], bl: [S("chauNgang", { dich: 1 }), "Dịch ở hai góc sau bàng quang."] },
      { benh: "Dịch túi cùng Douglas (nữ)", bt: [S("chau", { nu: 1 }), "Tử cung sau bàng quang, không dịch."], bl: [S("chau", { nu: 1, dich: 2 }), "Dịch sau tử cung lan quanh quai ruột."] },
      { benh: "Dịch/máu màng ngoài tim", bt: [S("duoiUc"), "Màng ngoài tim áp sát cơ tim."], bl: [S("duoiUc", { dich: 1, dongMau: 1 }), "Dải đen quanh tim, có cục máu đông hồi âm."] },
      { benh: "Tràn máu màng phổi phải", bt: [S("ruq"), "Ảnh gương trên cơ hoành, cột sống dừng ở cơ hoành."], bl: [S("ruq", { mp: 2 }), "Dịch có hồi âm trên cơ hoành, dấu cột sống."] },
      { benh: "Tràn máu màng phổi trái", bt: [S("luq"), "Ảnh gương trên cơ hoành."], bl: [S("luq", { mp: 1 }), "Dịch trên cơ hoành trái, dấu cột sống."] },
      { benh: "Tràn khí màng phổi (B-mode)", bt: [S("phoi"), "Có trượt màng phổi + đường A."], bl: [S("phoi", { diem: 1 }), "Điểm phổi: chỗ chuyển tiếp trượt/không trượt."] },
      { benh: "Tràn khí màng phổi (M-mode)", bt: [S("mPhoi"), "Dấu bờ biển."], bl: [S("mPhoi", { truot: false }), "Dấu mã vạch."] },
    ],
    "tim-mat-cat": [
      { benh: "Cạnh ức trục dọc: dịch màng tim", bt: [S("canhUcDoc"), "Không có dải đen quanh thất trái."], bl: [S("canhUcDoc", { dich: 1 }), "Dịch trước ĐMC ngực xuống."] },
      { benh: "Cạnh ức trục ngắn: quá tải thất phải", bt: [S("canhUcNgang"), "Thất trái tròn."], bl: [S("canhUcNgang", { rv: 1 }), "Vách dẹt, dấu D."] },
      { benh: "Mỏm 4 buồng: thất phải giãn", bt: [S("mom4"), "Thất phải < 2/3 thất trái."], bl: [S("mom4", { rv: 1 }), "Thất phải lớn hơn thất trái, tạo mỏm."] },
      { benh: "Dưới mũi ức: dịch màng tim", bt: [S("duoiUc"), "Không có dịch."], bl: [S("duoiUc", { dich: 1 }), "Dải dịch quanh tim."] },
      { benh: "TMC dưới", bt: [S("ivc", { kieu: "bt" }), "Xẹp > 50% khi hít vào."], bl: [S("ivc", { kieu: "gian" }), "Giãn, không xẹp."] },
    ],
    "tim-chuc-nang": [
      { benh: "Giảm co bóp thất trái (trục dọc)", bt: [S("canhUcDoc"), "Lá trước van hai lá gần chạm vách."], bl: [S("canhUcDoc", { ef: "giam" }), "Thất trái giãn, ít co, EPSS lớn."] },
      { benh: "Giảm co bóp thất trái (trục ngắn)", bt: [S("canhUcNgang"), "Buồng nhỏ lại đều, thành dày lên."], bl: [S("canhUcNgang", { ef: "giam" }), "Buồng to, gần như không đổi."] },
      { benh: "Tăng động thất trái", bt: [S("canhUcNgang"), "Co bóp bình thường."], bl: [S("canhUcNgang", { ef: "tang" }), "Buồng gần xẹp cuối tâm thu, tim nhanh."] },
      { benh: "Thất phải giãn (mỏm)", bt: [S("mom4", { do: 1 }), "TAPSE bình thường."], bl: [S("mom4", { rv: 1, do: 1 }), "Thất phải giãn, TAPSE thấp."] },
      { benh: "Dấu D", bt: [S("canhUcNgang"), "Vách cong về thất phải."], bl: [S("canhUcNgang", { rv: 1 }), "Vách dẹt."] },
      { benh: "Thất phải giãn (dưới mũi ức)", bt: [S("duoiUc"), "Thất phải nhỏ dưới gan."], bl: [S("duoiUc", { rv: 1 }), "Thất phải giãn, thất trái nhỏ."] },
    ],
    "mang-tim": [
      { benh: "Dịch màng tim (dưới mũi ức)", bt: [S("duoiUc"), "Không dịch."], bl: [S("duoiUc", { dich: 1 }), "Dịch lượng vừa."] },
      { benh: "Ép tim", bt: [S("duoiUc"), "Buồng tim phải không xẹp."], bl: [S("duoiUc", { dich: 2, chen: 1 }), "Thất phải xẹp thì tâm trương, tim đong đưa."] },
      { benh: "Dịch màng tim hay màng phổi (PSLA)", bt: [S("canhUcDoc", { dich: 1 }), "Dịch màng tim: trước ĐMC xuống."], bl: [S("canhUcDoc", { mp: 1 }), "Dịch màng phổi: sau ĐMC xuống."] },
      { benh: "Dịch màng tim (mỏm)", bt: [S("mom4"), "Không dịch."], bl: [S("mom4", { dich: 1 }), "Dịch quanh mỏm và thành bên."] },
      { benh: "TMC dưới trong ép tim", bt: [S("ivc", { kieu: "bt" }), "Xẹp theo hô hấp."], bl: [S("ivc", { kieu: "gian" }), "Căng, không xẹp."] },
    ],
    "tmcd-vti": [
      { benh: "Áp lực nhĩ phải cao", bt: [S("ivc", { kieu: "bt" }), "≤ 2,1 cm, xẹp > 50%."], bl: [S("ivc", { kieu: "gian" }), "> 2,1 cm, xẹp < 50%."] },
      { benh: "Áp lực đổ đầy rất thấp", bt: [S("ivc", { kieu: "bt" }), "Đường kính trung bình."], bl: [S("ivc", { kieu: "xep" }), "Nhỏ, xẹp gần hoàn toàn."] },
      { benh: "Thể tích nhát bóp thấp", bt: [S("vti", { vti: 20 }), "VTI ≈ 20 cm."], bl: [S("vti", { vti: 10 }), "VTI ≈ 10 cm, tim nhanh."] },
    ],
    phoi: [
      { benh: "Tràn khí màng phổi", bt: [S("phoi"), "Có trượt + đường A."], bl: [S("phoi", { truot: false }), "Mất trượt, chỉ còn đường A."] },
      { benh: "Điểm phổi", bt: [S("mPhoi"), "Bờ biển liên tục."], bl: [S("mPhoi", { diem: 1 }), "Bờ biển xen kẽ mã vạch."] },
      { benh: "Hội chứng kẽ", bt: [S("phoi"), "Không đường B."], bl: [S("phoi", { b: 4 }), "≥ 3 đường B/khoang."] },
      { benh: "Phổi trắng", bt: [S("phoi"), "Đường A rõ."], bl: [S("phoi", { b: 9 }), "Đường B hợp lưu."] },
    ],
    "phoi-dich": [
      { benh: "Dịch màng phổi phải", bt: [S("ruq"), "Ảnh gương, không thấy cột sống trên cơ hoành."], bl: [S("ruq", { mp: 1 }), "Dịch trống âm, phổi xẹp, dấu cột sống."] },
      { benh: "Dịch màng phổi trái", bt: [S("luq"), "Ảnh gương trên cơ hoành."], bl: [S("luq", { mp: 1 }), "Dịch trên cơ hoành trái."] },
      { benh: "Dịch phức tạp / máu", bt: [S("ruq", { mp: 1 }), "Dịch trống âm."], bl: [S("ruq", { mp: 2 }), "Hồi âm lơ lửng."] },
      { benh: "Đông đặc phổi", bt: [S("phoi"), "Phổi thông khí: chỉ thấy ảnh giả."], bl: [S("dongDac"), "Hình gan hóa, khí phế quản đồ động."] },
      { benh: "Xẹp phổi hay viêm phổi", bt: [S("dongDac"), "Khí phế quản đồ động: viêm phổi."], bl: [S("dongDac", { tinh: 1 }), "Khí phế quản đồ tĩnh: xẹp phổi hoặc viêm phổi."] },
    ],
    "dmc-bung": [
      { benh: "Phình ĐMC (cắt ngang)", bt: [S("dmc"), "1,9 cm ngoài – ngoài."], bl: [S("dmc", { phinh: 1 }), "5,2 cm, huyết khối thành."] },
      { benh: "Phình ĐMC (cắt dọc)", bt: [S("dmcDoc"), "Đường kính đều, thấy thân tạng, ĐM MTTT."], bl: [S("dmcDoc", { phinh: 1 }), "Phình hình thoi đoạn dưới."] },
      { benh: "Tách thành ĐMC", bt: [S("dmc"), "Lòng mạch trống âm đều."], bl: [S("dmc", { bong: 1 }), "Vạt nội mạc di động trong lòng mạch."] },
      { benh: "Chỗ chia đôi", bt: [S("dmc", { chia: 1 }), "Hai ĐM chậu chung < 1,5 cm."], bl: [S("dmc", { phinh: 1 }), "Phình ngay trên chỗ chia: đo trước khi kết luận."] },
    ],
    dvt: [
      { benh: "Huyết khối TM đùi chung", bt: [S("dvt", { tmh: 1 }), "Xẹp hoàn toàn khi ép."], bl: [S("dvt", { hk: 1 }), "Không xẹp, có hồi âm trong lòng."] },
      { benh: "Huyết khối TM khoeo", bt: [S("dvt", { vt: "khoeo" }), "TM khoeo nông, xẹp hoàn toàn."], bl: [S("dvt", { vt: "khoeo", hk: 1 }), "TM khoeo không xẹp."] },
    ],
    "than-bq": [
      { benh: "Ứ nước nhẹ", bt: [S("than"), "Xoang thận sáng liền."], bl: [S("than", { do: 1 }), "Bể thận tách đôi xoang."] },
      { benh: "Ứ nước vừa", bt: [S("than"), "Bình thường."], bl: [S("than", { do: 2 }), "Đài thận giãn tròn."] },
      { benh: "Ứ nước nặng", bt: [S("than"), "Vỏ thận dày."], bl: [S("than", { do: 3 }), "Hệ góp giãn lớn, vỏ mỏng."] },
      { benh: "Bí tiểu (cắt ngang)", bt: [S("bangQuang"), "≈ 250 mL."], bl: [S("bangQuang", { lon: 1 }), "≈ 600 mL."] },
      { benh: "Bí tiểu (cắt dọc)", bt: [S("bangQuang", { doc: 1 }), "Chiều dọc 8 cm."], bl: [S("bangQuang", { doc: 1, lon: 1 }), "Chiều dọc 11 cm."] },
    ],
    "tui-mat": [
      { benh: "Sỏi túi mật (trục dọc)", bt: [S("tuiMat"), "Lòng trống âm, thành mỏng."], bl: [S("tuiMat", { soi: 1 }), "Sỏi ở vùng thấp, bóng lưng sạch."] },
      { benh: "Sỏi túi mật (trục ngang)", bt: [S("tuiMat", { ngang: 1 }), "Hình tròn trống âm."], bl: [S("tuiMat", { ngang: 1, soi: 1 }), "Sỏi + bóng lưng."] },
      { benh: "Viêm túi mật cấp", bt: [S("tuiMat"), "Thành < 3 mm."], bl: [S("tuiMat", { viem: 1 }), "Thành dày nhiều lớp, bùn mật, dịch quanh túi mật."] },
      { benh: "Viêm túi mật (trục ngang)", bt: [S("tuiMat", { ngang: 1 }), "Thành mỏng."], bl: [S("tuiMat", { ngang: 1, viem: 1 }), "Thành dày, sỏi."] },
      { benh: "Túi mật đầy sỏi (dấu WES)", bt: [S("tuiMat"), "Thấy rõ lòng túi mật."], bl: [S("tuiMat", { wes: 1 }), "Thành – hồi âm sỏi – bóng lưng."] },
      { benh: "Polyp hay sỏi", bt: [S("tuiMat", { soi: 1 }), "Sỏi: vùng thấp, di động, có bóng lưng."], bl: [S("tuiMat", { polyp: 1 }), "Polyp: bám thành, không bóng lưng, không di động."] },
    ],
    "thai-som": [
      { benh: "Thai trong tử cung (cắt dọc)", bt: [S("tuCung", { iup: 1 }), "Túi thai có noãn hoàng, phôi."], bl: [S("tuCung", { ngoai: 1 }), "Tử cung rỗng, dịch có máu, khối phần phụ."] },
      { benh: "Thai trong tử cung (cắt ngang)", bt: [S("chauNgang", { nu: 1, iup: 1 }), "Túi thai trong tử cung."], bl: [S("chauNgang", { nu: 1, dich: 2 }), "Tử cung rỗng, dịch sau tử cung."] },
      { benh: "Túi thai giả", bt: [S("tuCung", { iup: 1 }), "Túi thai thật: lệch tâm, vòng kép, có noãn hoàng."], bl: [S("tuCung", { gia: 1 }), "Dịch giữa buồng, không noãn hoàng."] },
      { benh: "Chảy máu ổ bụng", bt: [S("ruq"), "Không dịch Morison."], bl: [S("ruq", { dich: 1 }), "Dịch Morison: nghi thai ngoài vỡ."] },
    ],
    "ngung-tim": [
      { benh: "Có hay không hoạt động tim", bt: [S("duoiUc"), "Co bóp tổ chức."], bl: [S("duoiUc", { ngung: "dung" }), "Tim đứng yên."] },
      { benh: "PEA giả", bt: [S("duoiUc"), "Co bóp bình thường."], bl: [S("duoiUc", { ngung: "yeu" }), "Co bóp yếu, không bắt được mạch."] },
      { benh: "Rung thất sóng nhỏ", bt: [S("duoiUc", { ngung: "dung" }), "Đứng yên thật."], bl: [S("duoiUc", { ngung: "rung" }), "Rung lăn tăn → sốc điện."] },
      { benh: "Ép tim", bt: [S("duoiUc"), "Không dịch."], bl: [S("duoiUc", { dich: 2, chen: 1 }), "Dịch lớn, buồng phải xẹp."] },
      { benh: "Thất phải giãn", bt: [S("duoiUc"), "Thất phải nhỏ."], bl: [S("duoiUc", { rv: 1 }), "Thất phải giãn (không đặc hiệu trong ngừng tim)."] },
      { benh: "Tràn khí màng phổi", bt: [S("mPhoi"), "Bờ biển."], bl: [S("mPhoi", { truot: false }), "Mã vạch hai bên/một bên."] },
    ],
    rush: [
      { benh: "Bơm: sốc tim", bt: [S("canhUcDoc"), "Co bóp bình thường."], bl: [S("canhUcDoc", { ef: "giam" }), "Giảm nặng."] },
      { benh: "Bơm: giảm thể tích/phân bố", bt: [S("canhUcNgang"), "Bình thường."], bl: [S("canhUcNgang", { ef: "tang" }), "Tăng động."] },
      { benh: "Bơm: tắc nghẽn (ép tim)", bt: [S("duoiUc"), "Không dịch."], bl: [S("duoiUc", { dich: 2, chen: 1 }), "Ép tim."] },
      { benh: "Bơm: tắc nghẽn (thuyên tắc phổi)", bt: [S("mom4"), "Thất phải nhỏ."], bl: [S("mom4", { rv: 1 }), "Thất phải giãn."] },
      { benh: "Bể: TMC dưới", bt: [S("ivc", { kieu: "bt" }), "Bình thường."], bl: [S("ivc", { kieu: "xep" }), "Xẹp: bể rỗng."] },
      { benh: "Bể: rò rỉ (dịch tự do)", bt: [S("ruq"), "Không dịch."], bl: [S("ruq", { dich: 2 }), "Dịch Morison."] },
      { benh: "Bể: phổi ướt", bt: [S("phoi"), "Đường A."], bl: [S("phoi", { b: 6 }), "Đường B lan tỏa."] },
      { benh: "Bể: tràn khí áp lực", bt: [S("mPhoi"), "Bờ biển."], bl: [S("mPhoi", { truot: false }), "Mã vạch."] },
      { benh: "Ống: ĐMC", bt: [S("dmc"), "Bình thường."], bl: [S("dmc", { phinh: 1 }), "Phình."] },
      { benh: "Ống: tĩnh mạch sâu", bt: [S("dvt"), "Xẹp khi ép."], bl: [S("dvt", { hk: 1 }), "Huyết khối."] },
    ],
    blue: [
      { benh: "Hồ sơ B (phù phổi)", bt: [S("phoi"), "Hồ sơ A."], bl: [S("phoi", { b: 5 }), "Đường B lan tỏa hai bên."] },
      { benh: "Hồ sơ A' (tràn khí)", bt: [S("mPhoi"), "Có trượt."], bl: [S("mPhoi", { diem: 1 }), "Điểm phổi."] },
      { benh: "PLAPS (viêm phổi)", bt: [S("ruq"), "Không dịch, không đông đặc."], bl: [S("dongDac"), "Đông đặc sau – bên."] },
      { benh: "Huyết khối TM sâu (hồ sơ A → thuyên tắc phổi)", bt: [S("dvt"), "Xẹp."], bl: [S("dvt", { hk: 1 }), "Không xẹp."] },
    ],
    "mach-mau": [
      { benh: "Huyết khối TM cảnh trong", bt: [S("tmCanh"), "TM trống âm, xẹp khi ép."], bl: [S("tmCanh", { hk: 1 }), "Hồi âm trong lòng: chọn vị trí/bên khác."] },
      { benh: "Theo dõi đầu kim", bt: [S("tmCanh", { kim: "ngang" }), "Trục ngắn: chấm sáng đầu kim."], bl: [S("tmCanh", { kim: "doc" }), "Trục dọc: thấy toàn bộ kim."] },
    ],
    "choc-dich": [
      { benh: "Túi dịch màng phổi", bt: [S("ruq"), "Không dịch: không chọc."], bl: [S("ruq", { mp: 1 }), "Dịch đủ sâu trên cơ hoành."] },
      { benh: "Dịch ổ bụng", bt: [S("chau", { nu: 1 }), "Không dịch."], bl: [S("chau", { nu: 1, dich: 2 }), "Dịch nhiều, quai ruột bập bềnh."] },
      { benh: "Dịch màng tim", bt: [S("mom4"), "Không dịch."], bl: [S("mom4", { dich: 1 }), "Dịch quanh mỏm."] },
    ],
    "mat-onsd": [
      { benh: "Tăng áp lực nội sọ", bt: [S("mat"), "ONSD 4,6 mm."], bl: [S("mat", { tang: 1 }), "ONSD 6,4 mm."] },
      { benh: "Bong võng mạc", bt: [S("mat"), "Dịch kính trống âm."], bl: [S("mat", { bong: 1 }), "Màng sáng dính vào đĩa thị."] },
    ],
  };
  POCUS.bai.forEach((b) => { if (CAP[b.id]) b.cap = CAP[b.id]; });
})();

/* Ca lâm sàng tích hợp: mỗi bước có hình, câu hỏi và giải thích. Tình huống giả định để học. */
POCUS.CA = [
  {
    id: "ca-chan-thuong", ten: "Tai nạn giao thông, tụt huyết áp", bai: ["efast"],
    mo: "Nam 32 tuổi, tai nạn xe máy, va đập bụng. Mạch 128, HA 82/50 sau 1 lít dịch tinh thể. GCS 14. Đường thở thông, thở 24 lần/phút, SpO2 96%.",
    buoc: [
      { mo: "Cửa sổ hạ sườn phải:", sim: { c: "ruq", p: { dich: 2 } }, q: "Bạn thấy gì?", a: ["Bình thường", "Dịch tự do khoang Morison và đầu dưới gan", "Dịch màng phổi phải", "Thận ứ nước"], d: 1, giai: "Dải trống âm giữa gan – thận lan đến đầu dưới gan." },
      { mo: "Màng phổi trước hai bên: có trượt, đường A. Dưới mũi ức: không dịch màng tim.", sim: { c: "phoi", p: {} }, q: "Bước tiếp theo phù hợp nhất?", a: ["Chụp CT bụng", "Hồi sức cầm máu (máu, kiểm soát tổn thương), chuyển mổ/can thiệp cầm máu", "Đặt dẫn lưu màng phổi", "Lặp lại FAST sau 1 giờ"], d: 1, giai: "Không ổn định + FAST bụng dương tính: chuyển cầm máu, không đưa đi CT." },
    ],
    ket: "Bài học: ở bệnh nhân chấn thương không ổn định, FAST trả lời câu hỏi 'chảy máu ở ổ bụng không' để rút ngắn thời gian đến cầm máu.",
  },
  {
    id: "ca-thai-ngoai", ten: "Đau bụng, trễ kinh, choáng váng", bai: ["thai-som", "efast"],
    mo: "Nữ 27 tuổi, trễ kinh 6 tuần, đau hạ vị, choáng khi đứng. Mạch 118, HA 88/56. hCG nước tiểu dương tính.",
    buoc: [
      { mo: "Mặt cắt dọc trên xương mu:", sim: { c: "tuCung", p: { ngoai: 1 } }, q: "Kết luận?", a: ["Thai trong tử cung chắc chắn", "Không thấy thai trong tử cung; dịch có máu ở túi cùng; khối phần phụ", "Bình thường", "U xơ tử cung"], d: 1, giai: "Tử cung rỗng, dịch có hồi âm, khối cạnh tử cung." },
      { mo: "Hạ sườn phải:", sim: { c: "ruq", p: { dich: 1 } }, q: "Xử trí?", a: ["Hẹn khám sản sau 48 giờ", "Hồi sức, truyền máu, gọi sản khoa mổ cấp cứu", "Methotrexate", "Chụp CT"], d: 1, giai: "Không IUP + dịch Morison + sốc: thai ngoài tử cung vỡ." },
    ],
    ket: "Bài học: ở phụ nữ có thai và tụt huyết áp, khám khoang Morison là bắt buộc.",
  },
  {
    id: "ca-dmc", ten: "Đau thắt lưng và ngất ở người lớn tuổi", bai: ["dmc-bung", "than-bq"],
    mo: "Nam 74 tuổi, hút thuốc, đột ngột đau thắt lưng trái, ngất một lần. Mạch 104, HA 96/60. Tiền sử 'sỏi thận'.",
    buoc: [
      { mo: "Thận trái: ứ nước nhẹ.", sim: { c: "than", p: { do: 1 } }, q: "Có đủ để kết luận cơn đau quặn thận?", a: ["Có", "Không, cần khám ĐMC bụng trước", "Có nếu có tiểu máu", "Có nếu đau lan bẹn"], d: 1, giai: "Ở người > 50 tuổi, phình ĐMC có thể giả dạng cơn đau quặn thận; ứ nước nhẹ có thể do khối máu tụ sau phúc mạc chèn." },
      { mo: "ĐMC bụng mặt cắt ngang ngang rốn:", sim: { c: "dmc", p: { phinh: 1 } }, q: "Xử trí?", a: ["Giảm đau, cho về", "Gọi ngay phẫu thuật mạch máu, chuẩn bị máu, hồi sức hạ huyết áp có kiểm soát; CT chỉ khi đủ ổn định và không làm chậm", "Siêu âm lại sau 6 tháng", "Tán sỏi"], d: 1, giai: "Phình 5,2 cm có triệu chứng + ngất + HA thấp: nghi vỡ." },
    ],
    ket: "Bài học: 'đau quặn thận' ở người cao tuổi luôn kèm câu hỏi về ĐMC bụng.",
  },
  {
    id: "ca-kho-tho", ten: "Khó thở cấp ở người cao tuổi", bai: ["phoi", "tim-chuc-nang", "blue"],
    mo: "Nữ 71 tuổi, tăng huyết áp, khó thở tăng dần 2 ngày, nặng về đêm. Thở 30 lần/phút, SpO2 86%, HA 172/96, ran ẩm hai đáy.",
    buoc: [
      { mo: "Vùng trước hai bên (BLUE trên và dưới):", sim: { c: "phoi", p: { b: 6 } }, q: "Hồ sơ BLUE?", a: ["Hồ sơ A", "Hồ sơ B", "Hồ sơ A'", "Hồ sơ C"], d: 1, giai: "Trượt + đường B lan tỏa hai bên." },
      { mo: "Cạnh ức trục dọc:", sim: { c: "canhUcDoc", p: { ef: "giam" } }, q: "Chẩn đoán phù hợp nhất?", a: ["Viêm phổi", "Phù phổi cấp do tim (thất trái giảm co bóp)", "Thuyên tắc phổi", "Đợt cấp COPD"], d: 1, giai: "Hồ sơ B + thất trái giãn, EPSS lớn." },
      { mo: "TMC dưới:", sim: { c: "ivc", p: { kieu: "gian" } }, q: "Điều trị ban đầu phù hợp?", a: ["Truyền 30 mL/kg dịch", "Thông khí không xâm nhập, nitrat (HA cao), lợi tiểu", "Kháng sinh đơn độc", "Tiêu sợi huyết"], d: 1, giai: "Phù phổi với HA cao: giảm hậu gánh, CPAP/BiPAP, lợi tiểu." },
    ],
    ket: "Bài học: phổi + tim + TMC dưới cho chẩn đoán phù phổi do tim trong vài phút; theo dõi đường B giảm khi điều trị.",
  },
  {
    id: "ca-ttp", ten: "Khó thở đột ngột sau phẫu thuật", bai: ["tim-chuc-nang", "dvt", "rush"],
    mo: "Nam 58 tuổi, ngày thứ 5 sau thay khớp háng, đột ngột khó thở, ngất. Mạch 124, HA 84/52, SpO2 88%. Phổi nghe trong.",
    buoc: [
      { mo: "Phổi trước hai bên: trượt + đường A.", sim: { c: "phoi", p: {} }, q: "Theo BLUE, bước tiếp?", a: ["Kết luận COPD", "Siêu âm tĩnh mạch sâu", "Tìm điểm phổi", "Chẩn đoán phù phổi"], d: 1, giai: "Hồ sơ A → khảo sát tĩnh mạch." },
      { mo: "Tĩnh mạch đùi chung phải khi ép:", sim: { c: "dvt", p: { hk: 1 } }, q: "Kết quả?", a: ["Bình thường", "Huyết khối tĩnh mạch sâu", "Hạch bẹn", "Không kết luận được"], d: 1, giai: "TM không xẹp khi ép đủ lực." },
      { mo: "Mỏm 4 buồng:", sim: { c: "mom4", p: { rv: 1 } }, q: "Diễn giải và hướng xử trí?", a: ["Bình thường, theo dõi", "Thất phải giãn cấp: thuyên tắc phổi nguy cơ cao; cân nhắc tái tưới máu theo phác đồ (đánh giá chống chỉ định sau mổ)", "Ép tim, chọc dịch", "Sốc tim do nhồi máu thất trái"], d: 1, giai: "Huyết khối TM sâu + thất phải giãn + sốc: thuyên tắc phổi nguy cơ cao (ESC 2019). Sau mổ lớn là chống chỉ định tương đối với tiêu sợi huyết: cân nhắc can thiệp qua catheter/phẫu thuật theo nguồn lực." },
    ],
    ket: "Bài học: ghép phổi (hồ sơ A) + tĩnh mạch + tim thất phải để nhận ra thuyên tắc phổi tại giường.",
  },
  {
    id: "ca-ngung-tim", ten: "Ngừng tuần hoàn PEA", bai: ["ngung-tim", "mang-tim"],
    mo: "Nữ 64 tuổi, ung thư phổi đang hóa trị, khó thở tăng dần rồi ngừng tuần hoàn tại khoa. Monitor: nhịp nhanh xoang 120, không bắt được mạch.",
    buoc: [
      { mo: "Kiểm tra mạch 10 giây, dưới mũi ức:", sim: { c: "duoiUc", p: { dich: 2, chen: 1 } }, q: "Phát hiện quan trọng?", a: ["Tim đứng yên", "Dịch màng tim lớn, thất phải xẹp: ép tim", "Thất phải giãn", "Bình thường"], d: 1, giai: "Dịch màng tim lớn, buồng phải xẹp ở bệnh nhân ung thư." },
      { mo: "Ép tim lại. Trưởng nhóm hỏi hành động tiếp theo.", sim: { c: "duoiUc", p: { dich: 2, chen: 1 } }, q: "Hành động?", a: ["Tiếp tục ACLS đơn thuần", "Chọc dịch màng tim dưới hướng dẫn siêu âm ngay, tiếp tục hồi sức", "Sốc điện", "Ngừng hồi sức"], d: 1, giai: "Ép tim là nguyên nhân hồi phục được." },
    ],
    ket: "Bài học: PEA + dịch màng tim lớn → giải ép. Khoảng dừng ≤ 10 giây, xem lại clip khi ép tim.",
  },
  {
    id: "ca-nhiem-khuan", ten: "Sốt, tụt huyết áp", bai: ["rush", "tmcd-vti", "phoi-dich"],
    mo: "Nữ 46 tuổi, sốt 3 ngày, ho đờm, lơ mơ. Mạch 122, HA 78/44, thở 28 lần/phút, SpO2 91%.",
    buoc: [
      { mo: "Cạnh ức trục dọc:", sim: { c: "canhUcDoc", p: { ef: "tang" } }, q: "Bơm?", a: ["Giảm co bóp nặng", "Tăng động", "Ép tim", "Thất phải giãn"], d: 1, giai: "Buồng thất trái gần xẹp cuối tâm thu." },
      { mo: "TMC dưới:", sim: { c: "ivc", p: { kieu: "xep" } }, q: "Bể?", a: ["Áp lực nhĩ phải cao", "Áp lực nhĩ phải thấp, TMC dưới xẹp", "Ép tim", "Không đo được"], d: 1, giai: "TMC dưới nhỏ, xẹp hoàn toàn." },
      { mo: "Điểm PLAPS phải:", sim: { c: "dongDac", p: {} }, q: "Ổ nhiễm khuẩn?", a: ["Không có", "Đông đặc phổi có khí phế quản đồ động: viêm phổi", "Tràn khí màng phổi", "Phù phổi"], d: 1, giai: "Viêm phổi gây sốc nhiễm khuẩn." },
      { mo: "VTI nền 14 cm; khi nâng chân thụ động 17 cm.", sim: { c: "vti", p: { vti: 17 } }, q: "Diễn giải?", a: ["Không đáp ứng dịch", "Đáp ứng dịch (tăng ≈ 21%): truyền dịch có mục tiêu, đánh giá lại; vận mạch nếu HA vẫn thấp", "Quá tải dịch", "Đo sai"], d: 1, giai: "(17 − 14)/14 ≈ 21% ≥ 10–15%." },
    ],
    ket: "Bài học: RUSH cho kiểu hình phân bố, tìm ổ nhiễm và dùng PLR/VTI để cá thể hóa truyền dịch.",
  },
];

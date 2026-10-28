/* Ca lâm sàng cấp cứu. Mỗi ca: bệnh cảnh + ECG mô phỏng (mẫu trong patterns.js) + câu hỏi từng bước + giải thích. */
(function (root) {
  "use strict";
  const C = [];
  const add = (o) => C.push(o);

  add({ id: "c01", ecg: "stemi_ant", seed: 11, level: 1, title: "Đau ngực trái 40 phút", tags: ["Đau ngực"],
    vignette: "Nam 58 tuổi, hút thuốc, đau ngực sau xương ức lan tay trái 40 phút, vã mồ hôi. HA 150/90 mmHg, mạch 96/ph, SpO₂ 96%.",
    qs: [
      { q: "Bất thường chính trên ECG là gì?", o: ["ST chênh lên lõm lan toả kèm PR chênh xuống", "ST chênh lên V1–V5, DI, aVL kèm ST chênh xuống thành dưới", "ST chênh xuống V1–V3", "Không có bất thường ST"], a: 1, why: "ST chênh lên theo vùng LAD (V1–V5) và bên cao (DI, aVL), có soi gương ở DII, DIII, aVF — không phải kiểu lan toả của viêm màng ngoài tim." },
      { q: "Động mạch thủ phạm nhiều khả năng nhất?", o: ["RCA", "LCx", "LAD đoạn gần", "LAD đoạn xa"], a: 2, why: "ST chênh lên ở aVL/DI và V1 kèm ST chênh xuống thành dưới gợi ý tắc LAD trước nhánh chéo 1 và nhánh vách 1." },
      { q: "Xử trí ưu tiên?", o: ["Làm troponin rồi quyết định", "Kích hoạt can thiệp mạch vành cấp (PCI tiên phát) — nếu không kịp trong 120 phút thì tiêu sợi huyết", "Nghiệm pháp gắng sức", "Cho về theo dõi ngoại trú"], a: 1, why: "STEMI: tái thông ngay, không chờ troponin. Mục tiêu ECG chẩn đoán → đầu dây ≤ 90 phút (≤ 120 phút nếu phải chuyển viện), nếu không đạt được → tiêu sợi huyết trong 10 phút sau chẩn đoán." }
    ], take: "STEMI trước rộng do tắc LAD đoạn gần. Soi gương thành dưới giúp phân biệt với viêm màng ngoài tim.", lesson: "ECG-17" });

  add({ id: "c02", ecg: "stemi_inf", seed: 12, level: 1, title: "Đau thượng vị, tụt huyết áp sau ngậm nitroglycerin", tags: ["Đau ngực"],
    vignette: "Nữ 67 tuổi, đái tháo đường, đau thượng vị, buồn nôn 1 giờ. Sau 1 viên nitroglycerin dưới lưỡi tại tuyến trước, HA tụt từ 120/70 xuống 80/50 mmHg. Mạch 58/ph. Phổi trong.",
    qs: [
      { q: "Vùng nhồi máu?", o: ["Trước vách", "Sau dưới, có thể kèm thất phải", "Bên cao", "Không phải nhồi máu"], a: 1, why: "ST chênh lên DII, DIII, aVF (DIII > DII), soi gương aVL, kèm ST chênh lên V1." },
      { q: "Bước tiếp theo trên ECG?", o: ["Ghi V4R (ST chênh lên ≥ 1 mm gợi ý nhồi máu thất phải)", "Ghi lại sau 24 giờ", "Ghi V7–V9 là đủ", "Không cần ghi thêm"], a: 0, why: "ST chênh lên V1 + tụt áp sau nitrat → nghi nhồi máu thất phải; V4R là chuyển đạo nhạy và đặc hiệu nhất." },
      { q: "Xử trí tụt áp?", o: ["Furosemide TM", "Thêm nitroglycerin truyền", "Ngừng nitrat, truyền dịch thận trọng (bolus nhỏ, đánh giá đáp ứng), tái thông mạch vành cấp", "Morphin liều cao"], a: 2, why: "Thất phải nhồi máu phụ thuộc tiền gánh: tránh nitrat/lợi tiểu/morphin; truyền dịch thận trọng, tái thông cấp; chuẩn bị xử trí nhịp chậm/block AV." }
    ], take: "STEMI sau dưới (RCA) kèm nhồi máu thất phải: DIII > DII, ST chênh xuống DI/aVL, ST chênh lên V1.", lesson: "ECG-17" });

  add({ id: "c03", ecg: "stemi_post", seed: 13, level: 2, title: "Đau ngực, ‘chỉ có ST chênh xuống’", tags: ["Đau ngực", "OMI"],
    vignette: "Nam 52 tuổi, đau ngực đè nặng 2 giờ, đang đau. Máy đọc: “ST chênh xuống V1–V3, thiếu máu dưới nội mạc”.",
    qs: [
      { q: "Đặc điểm ST chênh xuống ở V1–V3?", o: ["Dốc lên, T thấp", "Nằm ngang, T dương, R V2 cao", "Võng hình đáy chén", "Thứ phát sau block nhánh phải"], a: 1, why: "ST chênh xuống nằm ngang tối đa V2–V3 với T dương và R cao là hình soi gương của tổn thương thành sau." },
      { q: "Chẩn đoán phù hợp nhất?", o: ["NSTEMI thành trước", "Nhồi máu thành sau (OMI) — tương đương STEMI", "Ngấm digoxin", "Tái cực sớm"], a: 1, why: "ST chênh xuống tối đa V1–V4 trong đau ngực đang tiếp diễn là nhồi máu thành sau cho đến khi chứng minh ngược lại." },
      { q: "Xác nhận bằng cách nào?", o: ["Ghi V7–V9 (ST chênh lên ≥ 0,5 mm)", "Ghi V3R–V4R", "Đợi troponin 6 giờ", "Holter 24 giờ"], a: 0, why: "Chuyển đạo thành sau V7–V9 bộc lộ ST chênh lên; xử trí như STEMI (can thiệp cấp)." }
    ], take: "ST chênh xuống V1–V3 nằm ngang + T dương + đau ngực = nhồi máu thành sau.", lesson: "ECG-18" });

  add({ id: "c04", ecg: "dewinter", seed: 14, level: 2, title: "Đau ngực, máy đọc ‘không có ST chênh lên’", tags: ["Đau ngực", "OMI"],
    vignette: "Nam 49 tuổi, đau ngực dữ dội 30 phút, vã mồ hôi. Máy đọc: “ST chênh xuống không đặc hiệu”.",
    qs: [
      { q: "Mô tả ST–T ở V2–V5?", o: ["ST chênh lên lõm, khía điểm J", "ST chênh xuống dốc lên tại điểm J nối tiếp T cao, nhọn, đối xứng", "T âm sâu đối xứng", "T hai pha"], a: 1, why: "Đây là hình ảnh sóng T de Winter." },
      { q: "Ý nghĩa?", o: ["Thiếu máu dưới nội mạc do nhịp nhanh", "Tắc LAD đoạn gần — tương đương STEMI", "Tăng kali máu", "Biến thể bình thường"], a: 1, why: "de Winter gặp ở khoảng 2% tắc LAD đoạn gần; cần can thiệp mạch vành cấp như STEMI." },
      { q: "Xử trí?", o: ["Kích hoạt can thiệp mạch vành cấp", "Chờ troponin lần 2", "Calci TM", "Nghiệm pháp gắng sức"], a: 0, why: "Không đạt ‘tiêu chuẩn mm’ nhưng là OMI — tái thông ngay." }
    ], take: "de Winter: ST chênh xuống dốc lên + T cao nhọn đối xứng ở trước tim, ST chênh lên nhẹ aVR.", lesson: "ECG-18" });

  add({ id: "c05", ecg: "wellens_a", seed: 15, level: 2, title: "Đã hết đau ngực khi đến viện", tags: ["Đau ngực", "OMI"],
    vignette: "Nam 61 tuổi, 2 ngày nay có các cơn đau ngực khi gắng sức, cơn gần nhất 3 giờ trước, hiện hết đau. Troponin lần 1 tăng nhẹ.",
    qs: [
      { q: "Bất thường ở V2–V3?", o: ["T hai pha dương – âm", "ST chênh lên ≥ 2 mm", "Sóng Q sâu", "T cao nhọn"], a: 0, why: "T hai pha (dương rồi âm) ở V2–V3 với ST đẳng điện: Wellens typ A." },
      { q: "Không nên làm gì?", o: ["Chụp mạch vành sớm", "Nghiệm pháp gắng sức", "Theo dõi monitor", "Kháng kết tập tiểu cầu"], a: 1, why: "Wellens phản ánh hẹp khít LAD đoạn gần; gắng sức có thể gây nhồi máu trước rộng/đột tử." },
      { q: "Chiến lược phù hợp?", o: ["Cho về, hẹn khám", "Nhập viện, điều trị NSTE-ACS, chụp mạch vành sớm", "Tiêu sợi huyết ngay", "Chỉ theo dõi ECG sau 1 tuần"], a: 1, why: "Nguy cơ cao tái tắc; nếu đau tái phát và T ‘giả bình thường hoá’/ST chênh lên → can thiệp cấp." }
    ], take: "Wellens: T hai pha hoặc âm sâu V2–V3 ở bệnh nhân vừa hết đau ngực — hẹp LAD đoạn gần.", lesson: "ECG-18" });

  add({ id: "c06", ecg: "lbbb_ami", seed: 16, level: 3, title: "Đau ngực trên nền block nhánh trái", tags: ["Đau ngực", "OMI"],
    vignette: "Nữ 74 tuổi, có LBBB biết từ trước, đau ngực 1 giờ, HA 95/60 mmHg.",
    qs: [
      { q: "Ở DI, aVL, V5–V6 (QRS dương), ST thế nào?", o: ["Chênh xuống, bất hoà (bình thường của LBBB)", "Chênh lên đồng hướng ≥ 1 mm", "Đẳng điện", "Không đánh giá được"], a: 1, why: "ST chênh lên cùng chiều QRS dương là bất thường trong LBBB." },
      { q: "Áp dụng Sgarbossa cải tiến (Smith)?", o: ["Âm tính", "Dương tính (ST chênh lên đồng hướng; ST chênh lên bất hoà quá mức V2–V3)", "Không áp dụng cho LBBB cũ", "Chỉ dùng cho máy tạo nhịp"], a: 1, why: "Tiêu chuẩn 1 (đồng hướng ≥ 1 mm) đã đủ; ST/S ở V2–V3 ≥ 25% cũng dương." },
      { q: "Xử trí?", o: ["Như STEMI — can thiệp mạch vành cấp", "Chờ troponin", "Bỏ qua vì LBBB cũ", "Chỉ dùng nitrat"], a: 0, why: "Sgarbossa (Smith) dương + tụt áp → xử trí như STEMI." }
    ], take: "LBBB: tìm ST đồng hướng và bất hoà quá mức (ST/S ≥ 25%).", lesson: "ECG-19" });

  add({ id: "c07", ecg: "pericarditis", seed: 17, level: 2, title: "Đau ngực tăng khi nằm, sau cúm", tags: ["Đau ngực"],
    vignette: "Nam 26 tuổi, sốt nhẹ, ho 1 tuần, nay đau ngực kiểu màng phổi, giảm khi ngồi cúi ra trước. Nghe có tiếng cọ.",
    qs: [
      { q: "Đặc điểm ECG?", o: ["ST chênh lên theo vùng LAD có soi gương", "ST chênh lên lõm lan toả, PR chênh xuống, PR chênh lên ở aVR", "ST chênh xuống lan toả", "Sóng delta"], a: 1, why: "Hình ảnh điển hình viêm màng ngoài tim cấp, không có soi gương ngoài aVR/V1." },
      { q: "Việc cần làm thêm quan trọng nhất?", o: ["Siêu âm tim tìm tràn dịch, theo dõi troponin (viêm cơ màng ngoài tim)", "Tiêu sợi huyết", "Adenosine", "Không cần gì"], a: 0, why: "Đánh giá tràn dịch/ép tim và tổn thương cơ tim kèm theo." }
    ], take: "Viêm màng ngoài tim: ST chênh lõm lan toả + PR chênh xuống; aVR ngược lại.", lesson: "ECG-40" });

  add({ id: "c08", ecg: "ber", seed: 18, level: 2, title: "Nam trẻ đau ngực sau tập gym", tags: ["Đau ngực"],
    vignette: "Nam 22 tuổi, vận động viên, đau ngực nhói vùng cơ ngực trái sau tập tạ, ấn đau. Sinh hiệu bình thường.",
    qs: [
      { q: "ST chênh lên V2–V5 có đặc điểm?", o: ["Lồi, có soi gương", "Lõm, khía điểm J, T cao không đối xứng, không soi gương", "Dạng vòm dốc xuống vào T âm", "Kèm PR chênh xuống lan toả"], a: 1, why: "Hình ảnh tái cực sớm lành tính." },
      { q: "Xử lý hợp lý?", o: ["Kích hoạt can thiệp cấp", "So sánh ECG cũ/ghi lại ECG, đánh giá lâm sàng, troponin nếu cần — không chẩn đoán STEMI", "Calci TM", "Sốc điện"], a: 1, why: "Tái cực sớm là chẩn đoán loại trừ: ổn định theo thời gian, không soi gương, phù hợp lâm sàng." }
    ], take: "Tái cực sớm lành tính: ST lõm, khía J, T cao, không soi gương, không đổi theo thời gian.", lesson: "ECG-07" });

  add({ id: "c09", ecg: "hyperk", seed: 19, level: 1, title: "Bệnh nhân suy thận bỏ lọc máu", tags: ["Điện giải"],
    vignette: "Nam 55 tuổi, suy thận mạn lọc máu, bỏ 2 buổi lọc, mệt, yếu chi. Đang chờ kết quả điện giải.",
    qs: [
      { q: "Dấu hiệu nổi bật?", o: ["T rộng gốc ‘phồng’ theo vùng LAD", "T cao, nhọn, hẹp đáy, đối xứng lan toả", "Sóng U nổi", "QT dài"], a: 1, why: "T nhọn hình lều – tăng kali." },
      { q: "Xử trí?", o: ["Chờ kết quả kali rồi xử trí", "Calci TM (nếu có biến đổi ECG), insulin–glucose, salbutamol, chuẩn bị lọc máu cấp", "Furosemide đơn thuần", "Bù kali"], a: 1, why: "Bối cảnh + ECG đủ để điều trị ngay; lọc máu là điều trị thải kali triệt để." }
    ], take: "T nhọn hẹp đáy ở bệnh nhân suy thận → điều trị tăng kali ngay.", lesson: "ECG-37" });

  add({ id: "c10", ecg: "hyperk_sev", seed: 20, level: 2, title: "Nhịp chậm, QRS rộng ở bệnh nhân đái tháo đường", tags: ["Điện giải", "Nhịp chậm"],
    vignette: "Nữ 72 tuổi, đái tháo đường, bệnh thận mạn, đang dùng spironolactone + enalapril. Lơ mơ, HA 80/50 mmHg, mạch 48/ph.",
    qs: [
      { q: "Mô tả nhịp?", o: ["Rung nhĩ đáp ứng chậm", "Nhịp chậm không thấy P, QRS rất rộng, T nhọn", "Block AV độ I", "Nhịp xoang bình thường"], a: 1, why: "Mất P + QRS rộng kỳ dị + T nhọn: tăng kali nặng, sắp sóng sin." },
      { q: "Thuốc đầu tiên?", o: ["Atropine", "Calci clorid/gluconat TM", "Amiodarone", "Adenosine"], a: 1, why: "Ổn định màng tế bào cơ tim ngay; sau đó insulin–glucose, salbutamol, ± bicarbonate, lọc máu. Tạo nhịp thường kém hiệu quả khi chưa hạ kali." }
    ], take: "Nhịp chậm + QRS rộng + mất P = tăng kali cho đến khi chứng minh ngược lại → calci TM.", lesson: "ECG-37" });

  add({ id: "c11", ecg: "tca", seed: 21, level: 2, title: "Uống thuốc tự tử, co giật", tags: ["Ngộ độc"],
    vignette: "Nữ 31 tuổi, trầm cảm, được tìm thấy bên vỉ amitriptyline rỗng. GCS 10, vừa co giật 1 cơn. Mạch 128/ph, HA 90/60 mmHg.",
    qs: [
      { q: "Dấu hiệu ECG quan trọng?", o: ["T nhọn", "QRS rộng + R tận cùng cao ở aVR + S tận cùng ở DI/aVL", "ST chênh lên V1–V2 dạng vòm", "Sóng delta"], a: 1, why: "Hội chứng chẹn kênh natri." },
      { q: "Điều trị đặc hiệu?", o: ["Natri bicarbonate 1–2 mmol/kg TM, nhắc lại theo QRS", "Flumazenil", "Physostigmine", "Amiodarone"], a: 0, why: "Bicarbonate (tải natri + kiềm hoá) đảo ngược chẹn kênh Na⁺; tránh nhóm IA/IC; flumazenil chống chỉ định (nguy cơ co giật)." },
      { q: "QRS bao nhiêu dự báo rối loạn nhịp thất trong ngộ độc TCA?", o: ["> 80 ms", "> 100 ms", "> 160 ms", "> 200 ms"], a: 2, why: "QRS > 100 ms dự báo co giật; > 160 ms dự báo rối loạn nhịp thất (Boehnert & Lovejoy)." }
    ], take: "Nhịp nhanh + QRS rộng + R aVR = chẹn kênh Na⁺ → bicarbonate.", lesson: "ECG-38" });

  add({ id: "c12", ecg: "digoxin", seed: 22, level: 2, title: "Người già suy tim, buồn nôn, nhìn vàng", tags: ["Ngộ độc"],
    vignette: "Nữ 84 tuổi, suy tim, rung nhĩ cũ đã chuyển nhịp, đang dùng digoxin; buồn nôn, chán ăn, nhìn thấy quầng vàng. Creatinin tăng.",
    qs: [
      { q: "Hình ảnh ST ở V4–V6?", o: ["ST chênh xuống võng (dấu tích ngược)", "ST chênh lên lõm", "ST bình thường", "ST chênh xuống dốc lên + T cao"], a: 0, why: "Ngấm digoxin (Salvador Dali)." },
      { q: "Hình ảnh ST này có nghĩa là ngộ độc?", o: ["Có, chắc chắn ngộ độc", "Không — chỉ chứng tỏ có dùng digoxin; ngộ độc dựa vào lâm sàng, rối loạn nhịp, K⁺, nồng độ", "Có nếu QT ngắn", "Không liên quan digoxin"], a: 1, why: "Triệu chứng tiêu hoá, thị giác + suy thận gợi ý ngộ độc; tìm rối loạn nhịp (PVC, nhịp nhanh nhĩ kèm block, VT hai hướng), K⁺, nồng độ digoxin; cân nhắc kháng thể Fab." }
    ], take: "ST võng là tác dụng của digoxin; ngộ độc thể hiện bằng rối loạn nhịp tăng kích thích + ức chế dẫn truyền.", lesson: "ECG-38" });

  add({ id: "c13", ecg: "af_rvr", seed: 23, level: 1, title: "Hồi hộp, khó thở 3 giờ", tags: ["Nhịp nhanh"],
    vignette: "Nam 70 tuổi, tăng huyết áp, hồi hộp khó thở 3 giờ. HA 128/78 mmHg, không đau ngực, phổi không ran.",
    qs: [
      { q: "Nhịp?", o: ["Nhịp nhanh xoang", "Rung nhĩ đáp ứng thất nhanh", "Cuồng nhĩ 2:1", "AVNRT"], a: 1, why: "Không P, RR không đều hoàn toàn, QRS hẹp ~150/ph." },
      { q: "Xử trí phù hợp (huyết động ổn định, EF chưa rõ)?", o: ["Sốc điện ngay", "Kiểm soát tần số (chẹn bêta/chẹn canxi nếu không suy tim), đánh giá kháng đông, tìm yếu tố thúc đẩy; cân nhắc chuyển nhịp nếu < 48 giờ", "Adenosine", "Atropine"], a: 1, why: "Ổn định → kiểm soát tần số/nhịp + kháng đông theo CHA₂DS₂-VA; sốc điện khi không ổn định." }
    ], take: "Rung nhĩ: không P + RR không đều hoàn toàn.", lesson: "ECG-27" });

  add({ id: "c14", ecg: "flutter21", seed: 24, level: 2, title: "Nhịp nhanh đều 150/ph", tags: ["Nhịp nhanh"],
    vignette: "Nam 66 tuổi, COPD, hồi hộp 1 ngày. Monitor: nhịp đều 150/ph, QRS hẹp. Huyết động ổn định.",
    qs: [
      { q: "Tần số thất đều 150/ph gợi ý ngay?", o: ["Nhịp nhanh xoang", "Cuồng nhĩ dẫn truyền 2:1", "Nhịp nhanh thất", "Rung nhĩ"], a: 1, why: "Tần số nhĩ ~300/ph với block 2:1 cho thất ~150/ph." },
      { q: "Tìm sóng F ở đâu?", o: ["DI và aVL", "DII, DIII, aVF (răng cưa âm) và V1", "V5–V6", "aVR"], a: 1, why: "Sóng F răng cưa rõ nhất ở chuyển đạo dưới; ở V1 thường dương, rời rạc giống P." },
      { q: "Adenosine sẽ…?", o: ["Cắt cơn cuồng nhĩ", "Làm chậm thất tạm thời, bộc lộ sóng F, không cắt cơn", "Gây rung thất", "Không có tác dụng gì"], a: 1, why: "Vòng vào lại nằm ở nhĩ; adenosine chỉ block nút AV thoáng qua." }
    ], take: "Nhịp đều 150/ph QRS hẹp = cuồng nhĩ 2:1 cho đến khi chứng minh khác.", lesson: "ECG-28" });

  add({ id: "c15", ecg: "avnrt", seed: 25, level: 1, title: "Phụ nữ trẻ hồi hộp đột ngột", tags: ["Nhịp nhanh"],
    vignette: "Nữ 28 tuổi, hồi hộp khởi phát đột ngột khi cúi người, 40 phút. HA 110/70 mmHg, tỉnh táo.",
    qs: [
      { q: "Chẩn đoán?", o: ["Nhịp nhanh xoang", "AVNRT (giả r’ V1, giả S thành dưới)", "Rung nhĩ", "VT"], a: 1, why: "QRS hẹp rất đều ~180/ph, không thấy P trước QRS, giả r’ ở V1." },
      { q: "Bước đầu tiên?", o: ["Adenosine 12 mg", "Nghiệm pháp phế vị cải tiến (REVERT)", "Sốc điện đồng bộ", "Amiodarone"], a: 1, why: "Ổn định → phế vị cải tiến trước, thất bại → adenosine 6 mg, rồi 12 mg." }
    ], take: "AVNRT: QRS hẹp đều, P ẩn, giả r’ V1.", lesson: "ECG-29" });

  add({ id: "c16", ecg: "wpw_af", seed: 26, level: 3, title: "Nhịp nhanh rất nhanh, không đều, QRS rộng", tags: ["Nhịp nhanh"],
    vignette: "Nam 24 tuổi, hồi hộp, choáng váng sau uống rượu. Mạch 220–250/ph, HA 100/60 mmHg.",
    qs: [
      { q: "Chẩn đoán?", o: ["VT đơn hình", "Rung nhĩ tiền kích thích (WPW)", "Rung nhĩ + block nhánh trái", "Xoắn đỉnh"], a: 1, why: "Rất nhanh, RR không đều, QRS rộng hình dạng thay đổi từng nhịp, xen nhịp hẹp." },
      { q: "Thuốc nào CẤM?", o: ["Procainamide", "Ibutilide", "Verapamil/diltiazem, chẹn bêta, adenosine, digoxin", "Sốc điện"], a: 2, why: "Ức chế nút AV làm xung dẫn ưu tiên qua đường phụ → rung thất." },
      { q: "Xử trí phù hợp?", o: ["Sốc điện đồng bộ (đặc biệt nếu không ổn định) hoặc procainamide TM", "Adenosine 6 mg", "Amiodarone + digoxin", "Theo dõi"], a: 0, why: "Chuyển nhịp điện là an toàn nhất; procainamide nếu ổn định." }
    ], take: "Nhanh – không đều – rộng – thay đổi hình dạng = rung nhĩ tiền kích thích: KHÔNG ức chế nút AV.", lesson: "ECG-15" });

  add({ id: "c17", ecg: "vt", seed: 27, level: 2, title: "Nhịp nhanh QRS rộng ở người nhồi máu cũ", tags: ["Nhịp nhanh"],
    vignette: "Nam 68 tuổi, nhồi máu cơ tim cũ, EF 30%. Hồi hộp, đau ngực nhẹ. Mạch 180/ph, HA 105/70 mmHg, tỉnh.",
    qs: [
      { q: "Dấu hiệu ủng hộ VT trên ECG?", o: ["QRS hẹp", "Trục tây bắc, R ưu thế aVR, QRS rất rộng, phân ly nhĩ thất", "Sóng delta", "rSR’ điển hình V1 với QRS 110 ms"], a: 1, why: "Nhiều tiêu chuẩn VT; bệnh tim cấu trúc làm xác suất VT > 90%." },
      { q: "Thuốc nào nguy hiểm?", o: ["Amiodarone", "Procainamide", "Verapamil", "Sốc điện đồng bộ"], a: 2, why: "Chẹn canxi trong VT có thể gây trụy tim mạch." },
      { q: "Xử trí (đang có dấu hiệu thiếu máu cơ tim)?", o: ["Sốc điện đồng bộ (sau an thần)", "Adenosine", "Chỉ theo dõi", "Atropine"], a: 0, why: "VT có mạch nhưng có dấu hiệu nguy hiểm (đau ngực) → sốc điện đồng bộ; sau đó amiodarone." }
    ], take: "QRS rộng đều + bệnh tim cấu trúc = VT.", lesson: "ECG-32" });

  add({ id: "c18", ecg: "tdp", seed: 28, level: 2, title: "Ngất tái diễn khi dùng kháng sinh", tags: ["Nhịp nhanh", "Ngất"],
    vignette: "Nữ 63 tuổi, viêm phổi đang dùng levofloxacin, kèm ondansetron; tiêu chảy. Ngất 2 lần, monitor ghi được cơn sau.",
    qs: [
      { q: "Nhịp trong cơn?", o: ["Rung thất", "Xoắn đỉnh trên nền QT dài", "VT đơn hình", "Rung nhĩ"], a: 1, why: "QT dài ở nhịp nền, sau đó VT đa hình xoắn quanh đường đẳng điện." },
      { q: "Thuốc đầu tay?", o: ["Amiodarone", "Magie sulfat 2 g TM", "Procainamide", "Sotalol"], a: 1, why: "Magie là điều trị đầu tay; amiodarone/procainamide/sotalol kéo dài QT thêm." },
      { q: "Biện pháp ngăn tái phát?", o: ["Ngừng thuốc kéo dài QT, bù K⁺/Mg²⁺, tăng tần số tim (tạo nhịp vượt tần số/isoprenaline)", "Chẹn bêta liều cao", "Thêm macrolide", "Không cần"], a: 0, why: "Rút ngắn QT phụ thuộc tần số, loại yếu tố thúc đẩy." }
    ], take: "Xoắn đỉnh: QT dài + VT đa hình xoắn → magie, bỏ thuốc, bù điện giải, tăng tần số.", lesson: "ECG-34" });

  add({ id: "c19", ecg: "vf", seed: 29, level: 1, title: "Ngừng tim tại phòng chờ", tags: ["Ngừng tuần hoàn"],
    vignette: "Nam 60 tuổi gục xuống tại phòng chờ, không thở, không mạch. Gắn bản điện cực máy sốc điện.",
    qs: [
      { q: "Nhịp?", o: ["Vô tâm thu", "Rung thất", "PEA", "Nhiễu"], a: 1, why: "Dao động hỗn loạn không có QRS." },
      { q: "Hành động tiếp theo?", o: ["Adrenaline 1 mg rồi đánh giá", "Sốc điện không đồng bộ ngay rồi ép tim 2 phút", "Sốc điện đồng bộ", "Atropine"], a: 1, why: "Nhịp sốc được: sốc ngay, ép tim tiếp ngay sau sốc; adrenaline và amiodarone sau lần sốc thứ 3." }
    ], take: "VF: sốc điện sớm + CPR chất lượng cao.", lesson: "ECG-35" });

  add({ id: "c20", ecg: "asystole", seed: 30, level: 1, title: "Đường thẳng trên monitor", tags: ["Ngừng tuần hoàn"],
    vignette: "Bệnh nhân ngừng tim, monitor hiện gần như đường thẳng ở DII.",
    qs: [
      { q: "Trước khi kết luận vô tâm thu cần?", o: ["Sốc điện thử", "Kiểm tra điện cực, tăng gain, xem chuyển đạo khác", "Tiêm atropine", "Dừng hồi sức"], a: 1, why: "Loại trừ rung thất sóng nhỏ và lỗi kỹ thuật." },
      { q: "Xử trí vô tâm thu?", o: ["Sốc điện", "CPR + adrenaline 1 mg càng sớm càng tốt, tìm 4H–4T", "Amiodarone", "Adenosine"], a: 1, why: "Nhịp không sốc được." }
    ], take: "Vô tâm thu: kiểm tra kỹ thuật; CPR + adrenaline sớm.", lesson: "ECG-35" });

  add({ id: "c21", ecg: "chb_wide", seed: 31, level: 2, title: "Ngất, mạch chậm 30/ph", tags: ["Nhịp chậm", "Ngất"],
    vignette: "Nam 80 tuổi, ngất 2 lần trong ngày. Mạch 32/ph, HA 85/50 mmHg, da lạnh.",
    qs: [
      { q: "Chẩn đoán nhịp?", o: ["Nhịp chậm xoang", "Block AV độ III với nhịp thoát thất", "Wenckebach", "Rung nhĩ chậm"], a: 1, why: "P đều độc lập với QRS rộng, chậm ~32/ph." },
      { q: "Xử trí?", o: ["Atropine (có thể không hiệu quả) → adrenaline/isoprenaline truyền, tạo nhịp qua da, chuẩn bị tạo nhịp tĩnh mạch; tìm nguyên nhân hồi phục (K⁺, thuốc, thiếu máu)", "Amiodarone", "Lidocaine ức chế nhịp thoát", "Chờ đợi"], a: 0, why: "Block dưới His (thoát thất QRS rộng) thường không đáp ứng atropine." }
    ], take: "Block AV hoàn toàn thoát thất: không ổn định → tạo nhịp.", lesson: "ECG-12" });

  add({ id: "c22", ecg: "mobitz2", seed: 32, level: 3, title: "Choáng váng, QRS rộng và nhịp rơi", tags: ["Nhịp chậm", "Ngất"],
    vignette: "Nữ 76 tuổi, choáng váng từng cơn. Mạch 56/ph không đều.",
    qs: [
      { q: "PR trước nhịp rơi?", o: ["Dài dần", "Cố định", "Ngắn dần", "Không có P"], a: 1, why: "PR cố định rồi đột ngột một P không dẫn: Mobitz II." },
      { q: "Vị trí block và nguy cơ?", o: ["Nút AV, lành tính", "Dưới His, nguy cơ block hoàn toàn/vô tâm thu", "Nút xoang", "Không có nguy cơ"], a: 1, why: "Mobitz II + QRS rộng (RBBB + LAFB) → dưới His." },
      { q: "Xử trí?", o: ["Theo dõi monitor, dán sẵn bản tạo nhịp qua da, hội chẩn đặt máy tạo nhịp", "Cho về", "Chẹn bêta", "Digoxin"], a: 0, why: "Chỉ định máy tạo nhịp; chuẩn bị tạo nhịp tạm thời." }
    ], take: "Mobitz II: PR cố định + rơi nhịp đột ngột, thường QRS rộng — nguy hiểm.", lesson: "ECG-12" });

  add({ id: "c23", ecg: "brugada", seed: 33, level: 2, title: "Nam trẻ ngất khi sốt", tags: ["Ngất"],
    vignette: "Nam 34 tuổi, sốt 39 °C, ngất khi đang nằm nghỉ. Anh trai đột tử năm 38 tuổi.",
    qs: [
      { q: "Bất thường ở V1–V2?", o: ["rSR’ với T âm thứ phát của RBBB", "ST chênh lên dạng vòm ≥ 2 mm dốc xuống vào T âm", "ST chênh lên lõm", "Sóng epsilon"], a: 1, why: "Brugada typ 1." },
      { q: "Xử trí ban đầu?", o: ["Hạ sốt tích cực, theo dõi monitor, tránh thuốc chẹn Na⁺, hội chẩn tim mạch (ICD)", "Flecainide", "Cho về", "Tiêu sợi huyết"], a: 0, why: "Sốt làm nặng Brugada; ngất + typ 1 + tiền sử gia đình đột tử → nguy cơ cao." }
    ], take: "Brugada typ 1: ST vòm ≥ 2 mm V1–V2 + T âm; hạ sốt, tránh chẹn Na⁺.", lesson: "ECG-42" });

  add({ id: "c24", ecg: "wpw", seed: 34, level: 2, title: "Học sinh ngất khi chạy", tags: ["Ngất"],
    vignette: "Nam 17 tuổi, hay hồi hộp từng cơn, lần này ngất khi chạy. Hiện tỉnh, sinh hiệu bình thường.",
    qs: [
      { q: "Dấu hiệu ECG?", o: ["PR ngắn, sóng delta, QRS rộng", "QT dài", "Brugada typ 1", "Bình thường"], a: 0, why: "Kiểu WPW." },
      { q: "Nguy cơ chính?", o: ["Rung nhĩ tiền kích thích → rung thất", "Block AV hoàn toàn", "Tăng kali", "Không có"], a: 0, why: "Đường phụ dẫn nhanh có thể truyền rung nhĩ xuống thất rất nhanh." },
      { q: "Hướng xử trí?", o: ["Chuyển chuyên khoa điện sinh lý để đánh giá và triệt đốt đường phụ", "Dùng digoxin dự phòng", "Verapamil dài hạn", "Không cần theo dõi"], a: 0, why: "WPW có triệu chứng (ngất) → triệt đốt qua catheter." }
    ], take: "Ngất + PR ngắn + delta → WPW có triệu chứng.", lesson: "ECG-15" });

  add({ id: "c25", ecg: "pe", seed: 35, level: 2, title: "Khó thở sau phẫu thuật thay khớp háng", tags: ["Khó thở"],
    vignette: "Nữ 71 tuổi, ngày thứ 5 sau thay khớp háng, khó thở đột ngột, SpO₂ 88%, mạch 116/ph, HA 100/65 mmHg.",
    qs: [
      { q: "Dấu hiệu ECG?", o: ["Nhịp nhanh xoang, S1Q3T3, T âm V1–V4, block nhánh phải không hoàn toàn", "ST chênh lên V1–V4 do tắc LAD", "Rung nhĩ", "Bình thường"], a: 0, why: "Căng giãn thất phải cấp." },
      { q: "Ý nghĩa của ECG trong nghi thuyên tắc phổi?", o: ["Đủ để chẩn đoán xác định", "Gợi ý, đánh giá mức độ nặng và loại trừ chẩn đoán khác; ECG bình thường không loại trừ", "Không có giá trị", "Thay thế CT mạch phổi"], a: 1, why: "Cần CTPA/siêu âm tim tại giường; T âm V1–V4 liên quan thuyên tắc phổi nặng hơn." }
    ], take: "Thuyên tắc phổi: nhịp nhanh xoang + căng thất phải (T âm V1–V4, S1Q3T3, RBBB).", lesson: "ECG-39" });

  add({ id: "c26", ecg: "tamponade", seed: 36, level: 3, title: "Ung thư phổi, khó thở tăng dần", tags: ["Khó thở"],
    vignette: "Nam 64 tuổi, ung thư phổi, khó thở tăng dần 1 tuần, tĩnh mạch cổ nổi, HA 88/60 mmHg, mạch nghịch.",
    qs: [
      { q: "Bộ ba trên ECG?", o: ["Nhịp nhanh xoang, điện thế thấp, luân phiên điện học", "T nhọn, QRS rộng, mất P", "Sóng delta, PR ngắn", "ST chênh lên V1–V4"], a: 0, why: "Gợi ý tràn dịch màng ngoài tim lượng nhiều/ép tim." },
      { q: "Bước tiếp?", o: ["Siêu âm tại giường ngay, chuẩn bị chọc tháo dịch màng ngoài tim", "Lợi tiểu", "Nitrat", "Chẹn bêta làm chậm nhịp"], a: 0, why: "Ép tim là cấp cứu; tránh giảm tiền gánh và làm chậm nhịp bù trừ." }
    ], take: "Nhịp nhanh + điện thế thấp + luân phiên điện học → ép tim.", lesson: "ECG-40" });

  add({ id: "c27", ecg: "hypothermia", seed: 37, level: 2, title: "Người vô gia cư được tìm thấy sáng sớm", tags: ["Môi trường"],
    vignette: "Nam 50 tuổi nằm ngoài trời mùa đông, lơ mơ, nhiệt độ trung tâm 29 °C, mạch 40/ph.",
    qs: [
      { q: "Sóng đặc trưng?", o: ["Sóng delta", "Sóng Osborn (J) ở điểm J", "Sóng epsilon", "Sóng U"], a: 1, why: "Bướu dương tại điểm J, kèm nhịp chậm, QT dài, nhiễu run cơ." },
      { q: "Xử trí nhịp chậm này?", o: ["Tạo nhịp qua da ngay", "Làm ấm tích cực, xử lý nhẹ nhàng, theo dõi monitor — nhịp chậm thường là sinh lý và cải thiện khi ấm lên", "Atropine liều cao", "Sốc điện"], a: 1, why: "Nhịp chậm do hạ thân nhiệt đáp ứng với làm ấm; tim lạnh dễ rung thất khi kích thích." }
    ], take: "Hạ thân nhiệt: nhịp chậm, sóng Osborn, QT dài, nhiễu run cơ.", lesson: "ECG-41" });

  add({ id: "c28", ecg: "cerebral_t", seed: 38, level: 3, title: "Đau đầu dữ dội rồi lơ mơ", tags: ["Thần kinh"],
    vignette: "Nữ 45 tuổi, đột ngột ‘đau đầu dữ dội nhất đời’, nôn, sau đó lơ mơ. HA 190/100 mmHg, mạch 54/ph.",
    qs: [
      { q: "Biến đổi ECG?", o: ["T âm sâu rộng lan toả, QT dài", "ST chênh lên lõm lan toả", "Sóng delta", "T nhọn hẹp đáy"], a: 0, why: "Sóng T ‘não’ trong xuất huyết dưới nhện/tăng áp lực nội sọ." },
      { q: "Ưu tiên?", o: ["Chụp mạch vành cấp", "CT sọ não không cản quang khẩn", "Tiêu sợi huyết", "Heparin"], a: 1, why: "ECG ‘thiếu máu’ do nguyên nhân thần kinh — chống đông/tiêu sợi huyết có thể gây thảm hoạ." }
    ], take: "T âm khổng lồ + QT dài + bối cảnh thần kinh → nghĩ xuất huyết dưới nhện.", lesson: "ECG-41" });

  add({ id: "c29", ecg: "fail_capture", seed: 39, level: 2, title: "Bệnh nhân mang máy tạo nhịp choáng váng", tags: ["Máy tạo nhịp"],
    vignette: "Nam 79 tuổi mang máy tạo nhịp VVI 3 năm, choáng váng 1 ngày. K⁺ 6,4 mmol/L.",
    qs: [
      { q: "Rối loạn chức năng nào?", o: ["Mất cảm nhận", "Mất dẫn (gai không có QRS theo sau)", "Nhịp nhanh qua trung gian máy", "Bình thường"], a: 1, why: "Có gai thất nhưng không có QRS theo sau ở một số nhịp." },
      { q: "Nguyên nhân có thể đảo ngược?", o: ["Tăng kali làm tăng ngưỡng kích thích", "Nam châm", "Sốt", "Hạ calci"], a: 0, why: "Tăng K⁺, thiếu máu, thuốc làm tăng ngưỡng; ngoài ra tuột/gãy dây. Xử trí: calci/hạ kali, tăng output, tạo nhịp qua da, gọi chuyên khoa." }
    ], take: "Gai tạo nhịp không có QRS = mất dẫn; tìm tăng K⁺, dây điện cực.", lesson: "ECG-43" });

  add({ id: "c30", ecg: "avr_std", seed: 40, level: 3, title: "Đau ngực kèm khó thở, phù phổi", tags: ["Đau ngực", "OMI"],
    vignette: "Nam 72 tuổi, đau ngực 2 giờ, khó thở, ran ẩm hai phổi, HA 92/60 mmHg.",
    qs: [
      { q: "Mô tả ST?", o: ["ST chênh xuống lan toả nhiều chuyển đạo + ST chênh lên aVR", "ST chênh lên lõm lan toả", "ST chênh lên DII, DIII, aVF", "Bình thường"], a: 0, why: "Thiếu máu dưới nội mạc lan toả." },
      { q: "Nghĩ tới tổn thương gì?", o: ["Hẹp thân chung/bệnh 3 nhánh (hoặc nguyên nhân ngoài vành)", "Viêm màng ngoài tim", "Tái cực sớm", "WPW"], a: 0, why: "Kèm sốc/phù phổi → nguy cơ rất cao; chiến lược xâm lấn cấp cứu, hội chẩn can thiệp và phẫu thuật." }
    ], take: "ST chênh lên aVR + ST chênh xuống lan toả + huyết động không ổn định → can thiệp cấp.", lesson: "ECG-18" });

  root.CASES = C;
})(typeof window !== "undefined" ? window : globalThis);

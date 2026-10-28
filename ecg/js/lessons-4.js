/* Bài học Phần VI–VII */
(function (root) {
  "use strict";
  const B = (root.LESSONS = root.LESSONS || []);
  const add = (o) => B.push(o);

  /* ================= PHẦN VI. ECG TRONG BỆNH TOÀN THÂN VÀ DI TRUYỀN ================= */
  add({ id: "ECG-37", part: 6, prio: "A", title: "Rối loạn điện giải: kali, canxi, magie",
    tom: "Tăng kali giết người nhanh nhất — nhận ra từ ECG và điều trị trước khi có kết quả xét nghiệm.",
    md: `
## Tăng kali máu — tiến triển điển hình (tương quan với nồng độ không chặt)
| K⁺ (mmol/L, ước lượng) | ECG |
|---|---|
| 5,5–6,5 | **T cao nhọn**, hẹp đáy, đối xứng |
| 6,5–8,0 | P dẹt/rộng, PR dài, **QRS giãn rộng**, R cao/sóng S sâu, có thể ST chênh lên giả |
| > 8,0 | **Mất P**, QRS rất rộng kỳ dị → **dạng sóng sin** → VF/vô tâm thu/PEA |
- Kèm theo: nhịp chậm, block AV, nhịp bộ nối chậm, block nhánh mới, hình Brugada.

[[ecg:hyperk]]
[[ecg:hyperk_sev]]

> ! Nhịp chậm QRS rộng + mất P ở bệnh nhân suy thận/đái tháo đường/dùng ức chế men chuyển–kháng aldosteron → **calci TM ngay**, không chờ kết quả kali.

**Xử trí cấp**: ổn định màng tế bào — **calci gluconat 10% 30 mL** hoặc **calci clorid 10% 10 mL** TM (nhắc lại tới khi ECG cải thiện); chuyển K⁺ vào tế bào — **insulin 10 UI + glucose** (theo dõi đường huyết), **salbutamol** khí dung 10–20 mg; ± natri bicarbonate khi toan chuyển hoá; thải K⁺ — lọc máu, nhựa trao đổi, lợi tiểu.

## Hạ kali máu
- T dẹt/đảo, **sóng U nổi bật** (V2–V3), ST chênh xuống, **QU dài**; P cao, PR dài nhẹ.
- Nguy cơ: ngoại tâm thu, nhịp nhanh nhĩ/thất, **xoắn đỉnh**, tăng độc tính digoxin.

[[ecg:hypok]]

## Calci
| Hạ calci | Tăng calci |
|---|---|
| **QT dài** do ST dài (T bình thường) | **QT ngắn** do ST ngắn/mất |
| Có thể xoắn đỉnh (hiếm) | Nặng: sóng J (Osborn), block AV, rung thất |

[[ecg:hypoca]]
[[ecg:hyperca]]

## Magie
- Hạ Mg²⁺ đi kèm hạ K⁺/Ca²⁺ → QT dài, xoắn đỉnh, rối loạn nhịp nhĩ/thất; bù Mg²⁺ để bù được K⁺.
`,
    cards: [["Dấu hiệu ECG sớm nhất của tăng kali?", "T cao nhọn, hẹp đáy, đối xứng."], ["Thứ tự biến đổi ECG khi kali tăng dần?", "T nhọn → P dẹt, PR dài → QRS rộng → mất P → sóng sin → VF/vô tâm thu."], ["Liều calci trong tăng kali có biến đổi ECG?", "Calci gluconat 10% 30 mL hoặc calci clorid 10% 10 mL TM, nhắc lại tới khi ECG cải thiện."], ["Dấu hiệu ECG hạ kali?", "T dẹt, sóng U nổi bật, ST chênh xuống, QU dài."], ["Hạ calci và tăng calci ảnh hưởng QT thế nào?", "Hạ calci: QT dài (ST dài); tăng calci: QT ngắn (ST ngắn)."]],
    litfl: ["Hyperkalaemia", "Hypokalaemia", "Hypocalcaemia", "Hypercalcaemia", "Hypomagnesaemia"] });

  add({ id: "ECG-38", part: 6, prio: "A", title: "ECG trong ngộ độc: digoxin, thuốc chẹn kênh natri, thuốc kéo dài QT",
    tom: "Ba hội chứng ECG độc chất cần nhận ra trong 1 phút.",
    md: `
## 1. Chẹn kênh natri (chống trầm cảm ba vòng, flecainide, cocaine, diphenhydramine, quinine, carbamazepine…)
- **Nhịp nhanh xoang** (kháng cholinergic).
- **QRS > 100 ms**; **R tận cùng ở aVR > 3 mm**, **R/S aVR > 0,7**; S tận cùng rộng ở DI, aVL (trục phần cuối lệch phải).
- QTc dài; nặng: nhịp nhanh QRS rộng (giống VT), Brugada dạng, nhịp chậm, hạ huyết áp.
- Ở ngộ độc TCA: **QRS > 100 ms** dự báo co giật, **> 160 ms** dự báo rối loạn nhịp thất.

[[ecg:tca]]

**Xử trí**: **natri bicarbonate 8,4% 1–2 mmol/kg TM** nhắc lại tới khi QRS hẹp lại/pH 7,50–7,55; tăng thông khí nếu đặt nội khí quản; lidocaine cho VT kháng trị (TCA); tránh thuốc nhóm IA/IC.

## 2. Digoxin
- **Ngấm thuốc (không phải ngộ độc)**: ST chênh xuống dạng **võng/“dấu tích ngược”**, T dẹt/hai pha, QT ngắn, U nổi.
- **Ngộ độc** (tăng tính kích thích + ức chế dẫn truyền): ngoại tâm thu thất (nhịp đôi), **nhịp nhanh nhĩ kèm block AV**, nhịp bộ nối gia tốc, **rung nhĩ có RR đều chậm**, **VT hai hướng** (gần như đặc trưng), mọi dạng nhịp chậm/block AV.
- Tăng K⁺ trong ngộ độc cấp là yếu tố tiên lượng xấu.

[[ecg:digoxin]]

**Xử trí**: kháng thể kháng digoxin (Fab) khi rối loạn nhịp đe doạ tính mạng, K⁺ > 5–5,5 trong ngộ độc cấp, hoặc nồng độ cao; điều chỉnh K⁺/Mg²⁺; atropine cho nhịp chậm; thận trọng sốc điện.

## 3. Thuốc kéo dài QT (xem ECG-34)
- QTc > 500 ms → theo dõi monitor, bù K⁺/Mg²⁺, tránh thuốc kéo dài QT khác; xoắn đỉnh → magie.

## Khác
- **Chẹn bêta / chẹn canxi**: nhịp chậm, block AV, nhịp bộ nối; chẹn canxi non-DHP gây nhịp chậm nặng kèm tụt áp, tăng đường huyết.
- **Cocaine**: nhịp nhanh, thiếu máu cơ tim (co thắt), chẹn Na⁺ (QRS rộng).
`,
    cards: [["Dấu hiệu ECG chẹn kênh Na⁺?", "Nhịp nhanh, QRS > 100 ms, R tận cùng aVR > 3 mm (R/S aVR > 0,7), S tận cùng DI/aVL, QTc dài."], ["Điều trị ECG chẹn kênh Na⁺?", "Natri bicarbonate 1–2 mmol/kg TM nhắc lại."], ["Rối loạn nhịp gần như đặc trưng ngộ độc digoxin?", "VT hai hướng (bidirectional VT); cũng gợi ý: nhịp nhanh nhĩ kèm block, rung nhĩ RR đều chậm."], ["Ngấm digoxin trên ECG?", "ST võng (dấu tích ngược), T dẹt/hai pha, QT ngắn — không phải ngộ độc."]],
    litfl: ["Sodium channel blocker toxicity", "Tricyclic overdose", "Digoxin toxicity", "Digoxin effect", "Bidirectional VT"] });

  add({ id: "ECG-39", part: 6, prio: "B", title: "ECG trong thuyên tắc phổi",
    tom: "Nhịp nhanh xoang, căng giãn thất phải — và giới hạn của ECG.",
    md: `
[[ecg:pe]]

## Dấu hiệu
- **Nhịp nhanh xoang** — hay gặp nhất.
- **Căng giãn thất phải**: **T âm V1–V4** (± DII, DIII, aVF) — liên quan thuyên tắc phổi nặng hơn.
- **S1Q3T3**: S sâu ở DI, Q và T âm ở DIII — kinh điển nhưng **không nhạy, không đặc hiệu**.
- Block nhánh phải (hoàn toàn/không), trục lệch phải, P phế, rung/cuồng nhĩ mới.
- ST chênh lên aVR, V1 (đôi khi); điện thế thấp.

> ! ECG bình thường **không loại trừ** thuyên tắc phổi. Vai trò chính của ECG: loại trừ chẩn đoán khác (STEMI, viêm màng ngoài tim) và gợi ý mức độ nặng.

> * T âm V1–V4 + T âm DIII ủng hộ thuyên tắc phổi hơn hội chứng vành cấp thành trước (Wellens).
`,
    cards: [["Dấu hiệu ECG hay gặp nhất trong thuyên tắc phổi?", "Nhịp nhanh xoang."], ["S1Q3T3 là gì, giá trị?", "S sâu DI, Q và T âm DIII — kinh điển nhưng không nhạy, không đặc hiệu."]],
    litfl: ["Pulmonary embolism", "Right ventricular strain", "S1Q3T3"] });

  add({ id: "ECG-40", part: 6, prio: "B", title: "Viêm màng ngoài tim và tràn dịch màng ngoài tim",
    tom: "ST chênh lõm lan toả, PR chênh xuống; điện thế thấp và luân phiên điện học.",
    md: `
## Viêm màng ngoài tim cấp
- **ST chênh lên lõm lan toả** (DI, DII, aVL, aVF, V2–V6), thường < 5 mm.
- **PR chênh xuống** lan toả; **PR chênh lên + ST chênh xuống ở aVR** (± V1).
- Không có soi gương (trừ aVR, V1); không sóng Q.
- **Dấu Spodick**: đoạn TP dốc xuống.
- Tiến triển 4 giai đoạn: ST chênh lên → ST về đẳng điện, T dẹt → T âm lan toả → bình thường (giai đoạn có thể không đủ).
- Nhịp nhanh xoang hay gặp.

[[ecg:pericarditis]]

## Tràn dịch màng ngoài tim / ép tim
- **Điện thế thấp** (QRS < 5 mm ở chi, < 10 mm ở trước tim).
- **Luân phiên điện học** (QRS thay đổi biên độ xen kẽ từng nhịp) — do tim đung đưa trong dịch.
- **Nhịp nhanh xoang**.
- Bộ ba nhịp nhanh + điện thế thấp + luân phiên điện học → **siêu âm tại giường ngay**.

[[ecg:tamponade]]
[[ecg:low_volt]]
`,
    cards: [["Dấu hiệu aVR trong viêm màng ngoài tim?", "PR chênh lên và ST chênh xuống."], ["Bộ ba ECG gợi ý ép tim?", "Nhịp nhanh xoang, điện thế thấp, luân phiên điện học."], ["Dấu Spodick?", "Đoạn TP dốc xuống trong viêm màng ngoài tim."]],
    litfl: ["Pericarditis", "Pericardial effusion", "Electrical alternans", "Spodick sign"] });

  add({ id: "ECG-41", part: 6, prio: "B", title: "Hạ thân nhiệt, tổn thương thần kinh trung ương và các dạng sóng đặc biệt",
    tom: "Sóng Osborn, sóng T ‘não’, sóng epsilon và các dạng hiếm gặp.",
    md: `
## Hạ thân nhiệt
- **Nhịp chậm** xoang, kéo dài PR, QRS, **QT**.
- **Sóng J (Osborn)**: bướu dương tại điểm J, rõ ở chuyển đạo trước tim và dưới; biên độ tăng khi nhiệt độ càng thấp.
- Nhiễu **run cơ** (rét run); rung nhĩ, nhịp bộ nối; < 30 °C nguy cơ VF/vô tâm thu cao.

[[ecg:hypothermia]]

> * Hồi sức ngừng tim do hạ thân nhiệt: “chưa ấm thì chưa chết” — hạn chế sốc điện/adrenaline khi < 30 °C theo hướng dẫn, ưu tiên làm ấm (ECMO nếu có).

## Tổn thương thần kinh (xuất huyết dưới nhện, tăng áp lực nội sọ, chấn thương sọ não)
- **T âm sâu, rộng khổng lồ** (“T não”), **QT dài**, sóng U nổi; có thể ST chênh lên/xuống giống thiếu máu.
- Nhịp chậm (phản xạ Cushing: tăng huyết áp + nhịp chậm + thở bất thường), rối loạn nhịp.

[[ecg:cerebral_t]]

## Sóng J/Osborn – các nguyên nhân khác
- Hạ thân nhiệt, tăng calci máu, tổn thương thần kinh, tái cực sớm, Brugada.

## Sóng khác
| Sóng | Gặp trong |
|---|---|
| Sóng **epsilon** (khía nhỏ sau QRS ở V1–V3) | ARVC |
| Sóng **delta** | Tiền kích thích (WPW) |
| Sóng **U** nổi | Hạ kali, nhịp chậm, thuốc, tăng áp lực nội sọ |
| **Luân phiên điện học** | Tràn dịch màng ngoài tim lượng nhiều, nhịp nhanh (AVRT) |
`,
    cards: [["Sóng Osborn là gì và gặp trong bệnh gì?", "Bướu dương tại điểm J; điển hình hạ thân nhiệt (còn: tăng Ca²⁺, tổn thương thần kinh, Brugada, tái cực sớm)."], ["ECG trong xuất huyết dưới nhện?", "T âm sâu rộng khổng lồ, QT dài, U nổi, có thể giống thiếu máu; nhịp chậm."]],
    litfl: ["Hypothermia", "Osborn wave", "Raised intracranial pressure", "Epsilon wave"] });

  add({ id: "ECG-42", part: 6, prio: "A", title: "Bệnh kênh ion và bệnh cơ tim di truyền: Brugada, QT dài bẩm sinh, ARVC, HCM",
    tom: "Những ECG phải nhớ ở bệnh nhân trẻ ngất hoặc ngừng tim.",
    md: `
## Hội chứng Brugada
- **Typ 1 (chẩn đoán)**: ST chênh lên **dạng vòm (coved) ≥ 2 mm** ở ≥ 1 chuyển đạo V1–V2 (vị trí chuẩn hoặc cao lên KLS 2–3), dốc xuống liên tục vào **T âm**.
- Typ 2 (“yên ngựa”): gợi ý, không chẩn đoán.
- Bộc lộ/nặng lên khi **sốt**, thuốc chẹn Na⁺, cocaine, rượu, hạ K⁺, tăng K⁺ (Brugada phenocopy).
- Nguy cơ VF/đột tử khi nghỉ/ngủ. Ngất + Brugada typ 1 → hội chẩn, chỉ định ICD. **Hạ sốt tích cực**.

[[ecg:brugada]]

## QT dài bẩm sinh
- QTc kéo dài (thường > 480 ms), hình dạng T gợi ý typ: LQT1 (T rộng gốc – ngất khi gắng sức, bơi), LQT2 (T thấp, khía – giật mình, âm thanh), LQT3 (đoạn ST dài, T muộn – khi ngủ).
- Xoắn đỉnh → magie; chẹn bêta (LQT1, LQT2).

## ARVC (bệnh cơ tim thất phải gây loạn nhịp)
- **T âm V1–V3** (> 14 tuổi, không RBBB), **sóng epsilon**, thời gian hoạt hoá tận cùng V1–V3 ≥ 55 ms; VT dạng LBBB.

[[ecg:arvc]]

## Bệnh cơ tim phì đại (HCM)
- Tăng điện thế, biến đổi ST–T, **Q sâu, hẹp (‘dao găm’)** ở chuyển đạo bên và dưới, lớn nhĩ trái.
- Thể mỏm (Yamaguchi): **T âm khổng lồ** V2–V5.

[[ecg:hcm]]

## Khác cần biết
- **WPW** (ECG-15), **CPVT** (ECG lúc nghỉ bình thường; VT hai hướng khi gắng sức), **QT ngắn** (QTc ≤ 340–360 ms).

> ! Người trẻ **ngất khi gắng sức**, ngất kèm đánh trống ngực, tiền sử gia đình đột tử < 40 tuổi → soi kỹ ECG tìm: Brugada, QT dài/ngắn, WPW, HCM, ARVC, block dẫn truyền.
`,
    cards: [["Tiêu chuẩn Brugada typ 1?", "ST chênh lên dạng vòm ≥ 2 mm ở ≥ 1 chuyển đạo V1–V2, dốc xuống vào T âm."], ["Yếu tố làm lộ Brugada?", "Sốt, thuốc chẹn Na⁺, cocaine, rượu, rối loạn kali."], ["ECG của ARVC?", "T âm V1–V3, sóng epsilon, hoạt hoá tận cùng kéo dài V1–V3."], ["Dấu hiệu Q đặc trưng HCM?", "Q sâu, hẹp (‘dao găm’) ở chuyển đạo bên/dưới."], ["6 ECG cần tìm ở người trẻ ngất?", "Brugada, QT dài, QT ngắn, WPW, HCM, ARVC (và block dẫn truyền)."]],
    litfl: ["Brugada syndrome", "Long QT syndrome", "Arrhythmogenic right ventricular cardiomyopathy", "Hypertrophic cardiomyopathy"] });

  /* ================= PHẦN VII. MÁY TẠO NHỊP VÀ TÍCH HỢP LÂM SÀNG ================= */
  add({ id: "ECG-43", part: 7, prio: "B", title: "ECG máy tạo nhịp và rối loạn chức năng máy",
    tom: "Đọc nhịp tạo nhịp bình thường và nhận ra mất dẫn, mất cảm nhận, ngừng phát.",
    md: `
## Mã máy tạo nhịp (NBG)
- Ký tự 1: buồng **tạo nhịp** (A, V, D); 2: buồng **cảm nhận** (A, V, D, O); 3: **đáp ứng** khi cảm nhận (I – ức chế, T – kích hoạt, D – cả hai); 4: R – điều chỉnh tần số.
- VVI: tạo nhịp và cảm nhận thất, ức chế khi có nhịp tự thân. DDD: hai buồng.

## ECG bình thường
- **Gai tạo nhịp** trước P (nhĩ) và/hoặc trước QRS (thất).
- Tạo nhịp thất phải: **QRS rộng dạng LBBB**, thường trục trái; ST–T bất hoà bình thường.

[[ecg:paced]]
[[ecg:paced_ddd]]

## Rối loạn chức năng
| Rối loạn | ECG | Nguyên nhân |
|---|---|---|
| **Mất dẫn (failure to capture)** | Gai không có QRS/P theo sau | Tuột/gãy dây, ngưỡng tăng (tăng K⁺, thiếu máu, thuốc), xơ hoá |
| **Ngừng phát xung (failure to pace)** | Không có gai dù nhịp tự thân chậm | **Cảm nhận quá mức** (nhiễu cơ, điện từ), hết pin, đứt dây |
| **Mất cảm nhận (undersensing)** | Gai phát ra bất chấp nhịp tự thân (có thể rơi vào T → R-on-T) | Điện cực lệch, ngưỡng cảm nhận |
| Nhịp nhanh qua trung gian máy (PMT) | Nhịp nhanh tạo nhịp ở tần số giới hạn trên | Dẫn ngược nhĩ được cảm nhận (máy hai buồng) |

[[ecg:fail_capture]]

> * Đặt **nam châm** lên máy tạo nhịp → chuyển sang chế độ tạo nhịp cố định (VOO/DOO) — xử trí nhanh ngừng phát do cảm nhận quá mức hoặc PMT. (Với ICD, nam châm thường chỉ tắt chức năng sốc.)

> ! Nhồi máu trên nền nhịp tạo nhịp thất: dùng **Sgarbossa cải tiến** (ECG-19).
`,
    cards: [["VVI nghĩa là gì?", "Tạo nhịp thất, cảm nhận thất, ức chế khi cảm nhận nhịp tự thân."], ["Mất dẫn trên ECG?", "Có gai tạo nhịp nhưng không có QRS (hoặc P) theo sau."], ["Nam châm trên máy tạo nhịp có tác dụng gì?", "Chuyển sang tạo nhịp cố định không đồng bộ (VOO/DOO)."]],
    litfl: ["Pacemaker rhythms", "Pacemaker malfunction", "Pacemaker mediated tachycardia"] });

  add({ id: "ECG-44", part: 7, prio: "B", title: "ECG trong và sau ngừng tuần hoàn",
    tom: "Đánh giá nhịp trong CPR và ECG 12 chuyển đạo sau ROSC.",
    md: `
## Trong hồi sức
- Kiểm tra nhịp **mỗi 2 phút**, ngắt ép tim < 10 giây; nhận diện nhóm sốc được/không sốc được (ECG-35).
- Nhịp có tổ chức → kiểm tra mạch (± siêu âm tại giường) để phân biệt PEA và ROSC.

## Sau khi có tuần hoàn tự nhiên trở lại (ROSC)
- **Ghi ECG 12 chuyển đạo càng sớm càng tốt** (sau vài phút ổn định để giảm ST lệch thoáng qua ngay sau sốc điện/adrenaline).
- **ST chênh lên/LBBB-Sgarbossa dương tính** → chụp mạch vành cấp.
- Không có ST chênh lên nhưng nghi ngờ nguyên nhân tim cao (VF, sốc tim) → cân nhắc chụp mạch sớm theo từng trường hợp.
- Tìm nguyên nhân khác: **tăng K⁺** (T nhọn, QRS rộng), **ngộ độc chẹn Na⁺** (R aVR), **QT dài**, **Brugada**, **WPW**, thuyên tắc phổi (căng thất phải), hạ thân nhiệt.

[[ecg:vf]]
[[ecg:stemi_ant]]

> * ST chênh xuống lan toả + ST chênh lên aVR ngay sau ROSC thường do thiếu máu toàn thể/adrenaline — ghi lại sau 10–15 phút trước khi kết luận.
`,
    cards: [["Sau ROSC, ECG nào chỉ định chụp mạch vành cấp?", "ST chênh lên (hoặc tương đương STEMI như LBBB với Sgarbossa dương tính)."]],
    litfl: ["Post cardiac arrest ECG", "Cardiac arrest rhythms"] });

  add({ id: "ECG-45", part: 7, prio: "B", title: "Đặc điểm ECG ở trẻ em",
    tom: "Những gì bình thường ở trẻ nhưng bất thường ở người lớn.",
    md: `
## Thay đổi theo tuổi
| Đặc điểm | Trẻ em |
|---|---|
| Tần số | Sơ sinh 110–160/ph (có thể tới 180), giảm dần theo tuổi |
| Trục | Sơ sinh lệch phải (tới +180°), về bình thường dần trong năm đầu |
| V1 | **R ưu thế** ở sơ sinh – nhũ nhi |
| T ở V1–V3 | **Âm** từ sau ~ tuần 1 tới tuổi thiếu niên (T dương V1 sau ngày 7 → nghĩ phì đại thất phải) |
| Khoảng | PR, QRS, QT ngắn hơn người lớn |
| Loạn nhịp xoang | Rất hay gặp |

## Những gì cần chú ý ở cấp cứu nhi
- **SVT** ở nhũ nhi: tần số thường > 220/ph, P khó thấy; nhịp nhanh xoang thường < 220/ph và thay đổi theo hoạt động.
- Nhịp chậm ở trẻ thường do **thiếu oxy** → thông khí, oxy trước tiên.
- Ngất ở trẻ lớn: tìm QT dài, WPW, HCM, Brugada (ECG-42).
- Tăng K⁺, ngộ độc (TCA) có biểu hiện như người lớn.

> * Dùng bảng giá trị theo tuổi khi đánh giá điện thế và trục; tiêu chuẩn phì đại của người lớn không áp dụng cho trẻ em.
`,
    cards: [["T âm V1–V3 ở trẻ 5 tuổi có bình thường không?", "Có (kiểu T thiếu niên)."], ["Tần số gợi ý SVT hơn nhịp nhanh xoang ở nhũ nhi?", "Thường > 220/ph, cố định, P khó thấy."]],
    litfl: ["Paediatric ECG", "Persistent juvenile T wave pattern"] });

  add({ id: "ECG-46", part: 7, prio: "A", title: "Tiếp cận ECG theo tình huống: đau ngực, ngất, hồi hộp",
    tom: "Danh sách kiểm tra theo triệu chứng — dùng ở phòng cấp cứu.",
    md: `
## Đau ngực
1. **OMI/STEMI**: ST chênh lên theo vùng + soi gương; ghi thêm **V4R, V7–V9** khi cần.
2. **Tương đương STEMI**: de Winter, T tối cấp, thành sau, LBBB/tạo nhịp + Sgarbossa (Smith), ST chênh lên aVR + ST chênh xuống lan toả.
3. **Wellens** (đã hết đau).
4. **Kẻ giả mạo**: viêm màng ngoài tim, tái cực sớm, LVH, phình thất, Brugada, Takotsubo.
5. **Nguyên nhân khác**: thuyên tắc phổi (nhịp nhanh, căng thất phải), bóc tách ĐMC (ECG có thể bình thường hoặc STEMI dưới do lan vào RCA).
6. **Ghi lại** sau 15–30 phút hoặc khi đau thay đổi.

## Ngất — tìm nguyên nhân rối loạn nhịp
| Nhóm | Dấu hiệu |
|---|---|
| Nhịp chậm/dẫn truyền | Block AV Mobitz II, độ III, **block hai phân nhánh**, ngưng xoang > 3 s, nhịp chậm xoang < 40/ph |
| Tiền kích thích | **PR ngắn + delta** |
| Kênh ion | **Brugada typ 1**, **QT dài**, QT ngắn |
| Bệnh cơ tim | **HCM** (Q dao găm, LVH), **ARVC** (epsilon, T âm V1–V3) |
| Thiếu máu | Nhồi máu cấp/cũ (VT trên sẹo) |
| Khác | Thuyên tắc phổi, nhịp nhanh thất không bền bỉ, máy tạo nhịp rối loạn |

## Hồi hộp / nhịp nhanh
1. **Ổn định không?** (sốc, ngất, đau ngực, suy tim) → không → sốc điện đồng bộ.
2. **QRS hẹp hay rộng?** **Đều hay không đều?**
3. Hẹp – đều: AVNRT/AVRT/cuồng nhĩ/nhịp nhanh nhĩ/xoang → phế vị, adenosine.
4. Hẹp – không đều: rung nhĩ, cuồng nhĩ thay đổi, MAT.
5. Rộng – đều: **VT** cho đến khi chứng minh ngược lại.
6. Rộng – không đều: rung nhĩ + block nhánh, **rung nhĩ tiền kích thích**, VT đa hình/xoắn đỉnh.
7. Sau chuyển nhịp: tìm delta, QT dài, Brugada, dấu thiếu máu.

> * Dùng mục **Ca lâm sàng** để luyện các tình huống này theo từng bước.
`,
    cards: [["Ngất + ECG: kể 8 dấu hiệu nguy cơ cao.", "Mobitz II/độ III, block hai phân nhánh, ngưng xoang > 3 s, WPW, Brugada typ 1, QT dài/ngắn, HCM, ARVC (và thiếu máu/nhồi máu, VT không bền bỉ)."], ["Nhịp nhanh QRS rộng không đều: 3 nguyên nhân?", "Rung nhĩ + block nhánh/lệch hướng, rung nhĩ tiền kích thích, VT đa hình/xoắn đỉnh."]],
    litfl: ["Syncope ECG", "Chest pain ECG", "Tachycardia approach"] });

  add({ id: "ECG-47", part: 7, prio: "A", title: "Thực hành tổng hợp: ca ECG cấp cứu có giải thích",
    tom: "Bài thực hành — chuyển sang mục Ca lâm sàng và Luyện nhanh.",
    md: `
Bài này là phần **thực hành**. Quy trình gợi ý mỗi ngày:
1. **Luyện nhanh** 10 ECG (nhận diện trong 30–60 giây mỗi ECG) — mục tiêu ≥ 80% đúng.
2. **1–2 ca lâm sàng** đầy đủ: đọc theo 9 bước, trả lời từng câu, đọc giải thích.
3. Mở **Atlas**, dùng **Thước đo** đo lại PR, QRS, QT các ECG đã sai.
4. **Thẻ ôn** các thẻ đến hạn.

> * Mỗi ECG trong ứng dụng là **ECG mô phỏng** do máy tạo ra theo tiêu chuẩn hình thái trong bài học, dùng để luyện nhận diện. Sau khi thành thạo, luyện tiếp trên ECG thật (thư viện LITFL ECG Library, ECG của chính bệnh nhân trong khoa).
`,
    cards: [],
    litfl: ["ECG library", "Top 150 ECG"] });
})(typeof window !== "undefined" ? window : globalThis);

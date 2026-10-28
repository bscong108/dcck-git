/* Bài học Phần IV: Thiếu máu và nhồi máu cơ tim */
(function (root) {
  "use strict";
  const B = (root.LESSONS = root.LESSONS || []);
  const add = (o) => B.push(o);

  add({ id: "ECG-16", part: 4, prio: "A", title: "Cơ sở điện sinh lý của thiếu máu cơ tim: dòng tổn thương",
    tom: "Vì sao thiếu máu dưới nội mạc gây ST chênh xuống còn thiếu máu xuyên thành gây ST chênh lên.",
    md: `
## Dòng tổn thương
- Tế bào thiếu máu có điện thế nghỉ kém âm hơn và điện thế hoạt động ngắn, thấp → tạo **chênh lệch điện thế** với vùng lành (dòng tổn thương).
- **Thiếu máu dưới nội mạc** (hẹp, tăng nhu cầu): vector ST hướng vào buồng thất → **ST chênh xuống** ở các chuyển đạo nhìn vùng đó, thường lan toả, **không định khu** chính xác động mạch; ST chênh lên aVR soi gương.
- **Thiếu máu xuyên thành** (tắc hoàn toàn): vector ST hướng ra thượng tâm mạc → **ST chênh lên** ở chuyển đạo nhìn trực tiếp, **ST chênh xuống soi gương** ở chuyển đạo đối diện.

## Diễn tiến điển hình của tắc mạch
1. **Sóng T tối cấp** (vài phút đầu): T rộng gốc, cao, đối xứng, “phồng”.
2. **ST chênh lên** lồi/thẳng, kéo T lên (“bia mộ” khi nặng); soi gương.
3. **Sóng Q** (vài giờ), R giảm.
4. **T đảo** (giờ–ngày, đặc biệt sau tái tưới máu); ST trở về.
5. Q tồn tại; ST chênh lên kéo dài > vài tuần → nghĩ **phình thất**.

[[ecg:hyperacute]]
[[ecg:stemi_ant]]

## Từ “STEMI” đến “OMI”
- Khoảng 25–30% nhồi máu do **tắc mạch cấp** không đạt tiêu chuẩn ST chênh lên kinh điển (thành sau, LCx, tắc ở giai đoạn T tối cấp, de Winter…).
- Khái niệm **OMI (Occlusion MI)** — nhồi máu do tắc cần tái thông cấp — nhấn mạnh tìm các dấu hiệu tinh tế: T tối cấp, ST chênh xuống soi gương đơn độc, biến dạng phần cuối QRS, ST chênh lên không tương xứng, và **ghi ECG lặp lại**.

> * Thay đổi **động** giữa hai ECG cách nhau 15–30 phút có giá trị hơn nhiều so với một ngưỡng mm cố định.
`,
    cards: [["Thiếu máu dưới nội mạc biểu hiện trên ECG?", "ST chênh xuống (thường lan toả, không định khu), ± ST chênh lên aVR."], ["Diễn tiến ECG của tắc động mạch vành?", "T tối cấp → ST chênh lên + soi gương → sóng Q → T đảo → Q tồn tại."], ["OMI là gì?", "Nhồi máu do tắc động mạch vành cấp cần tái thông ngay, kể cả khi không đạt tiêu chuẩn ST chênh lên kinh điển."]],
    litfl: ["Myocardial ischaemia", "Hyperacute T waves", "Occlusion myocardial infarction"] });

  add({ id: "ECG-17", part: 4, prio: "A", title: "STEMI: định khu và dự đoán động mạch thủ phạm",
    tom: "Tiêu chuẩn STEMI (UDMI lần 4), định khu theo vùng và các mẹo đoán động mạch thủ phạm.",
    md: `
## Tiêu chuẩn ST chênh lên (Định nghĩa toàn cầu nhồi máu cơ tim lần 4)
ST chênh lên **mới** tại điểm J ở **≥ 2 chuyển đạo liên tiếp**:
| Chuyển đạo | Ngưỡng |
|---|---|
| Mọi chuyển đạo trừ V2–V3 | ≥ 1 mm |
| V2–V3 – nam ≥ 40 tuổi | ≥ 2 mm |
| V2–V3 – nam < 40 tuổi | ≥ 2,5 mm |
| V2–V3 – nữ | ≥ 1,5 mm |
| V7–V9 (thành sau) | ≥ 0,5 mm (nam < 40 tuổi ≥ 1 mm) |
| V3R–V4R (thất phải) | ≥ 0,5 mm (nam < 30 tuổi ≥ 1 mm) |

> ! Không đạt ngưỡng **không** loại trừ tắc mạch. Kết hợp hình dạng ST (lồi/thẳng), soi gương, T tối cấp, và ECG lặp lại.

## Định khu
| Vùng | Chuyển đạo ST chênh lên | Soi gương | Động mạch |
|---|---|---|---|
| Vách | V1–V2 | | LAD (nhánh vách) |
| Trước | V3–V4 | | LAD |
| Trước rộng | V1–V6, DI, aVL | DII, DIII, aVF | LAD đoạn gần |
| Bên cao | DI, aVL (± V2: “lá cờ”) | DIII, aVF | Nhánh chéo 1, LCx (bờ tù) |
| Bên | V5–V6, DI, aVL | | LCx |
| Dưới | DII, DIII, aVF | aVL (± DI) | RCA (~80%) hoặc LCx |
| Thành sau | V7–V9 | **ST chênh xuống V1–V3** | RCA nhánh sau/LCx |
| Thất phải | V1, V4R | | RCA đoạn gần |

[[ecg:stemi_inf]]
[[ecg:stemi_lat]]

## Đoán động mạch thủ phạm
**Nhồi máu thành dưới**
- **RCA**: ST DIII > DII; ST chênh xuống ở **DI** (và aVL); ST chênh lên V1 hoặc V4R (thất phải).
- **LCx**: ST DII ≥ DIII; **không** có ST chênh xuống DI (hoặc ST chênh lên DI, aVL, V5–V6).
- **Thất phải**: ST chênh lên V4R ≥ 1 mm (nhạy, đặc hiệu nhất), ST chênh lên V1 + ST chênh xuống V2. → **Tránh nitrat**, truyền dịch thận trọng nếu tụt áp, chuẩn bị nhịp chậm/block AV.

**Nhồi máu thành trước – LAD đoạn gần** (trước nhánh vách 1 và chéo 1):
- ST chênh lên ở **aVL, DI**, aVR, V1; ST chênh xuống ở DII, DIII, aVF; **RBBB/LAFB mới**.
- LAD đoạn xa (“quấn mỏm”) → ST chênh lên cả DII, DIII, aVF cùng V3–V6.

[[ecg:stemi_ant]]

> * ST chênh lên ở aVL kèm ST chênh xuống ở DIII có thể là dấu hiệu sớm nhất của nhồi máu thành dưới (soi gương xuất hiện trước).
`,
    cards: [["Ngưỡng ST chênh lên ở V2–V3 cho nữ?", "≥ 1,5 mm."], ["Dấu hiệu gợi ý RCA trong nhồi máu dưới?", "ST DIII > DII, ST chênh xuống DI, ± ST chênh lên V1/V4R."], ["Dấu hiệu nhồi máu thất phải?", "ST chênh lên V4R ≥ 1 mm; ST chênh lên V1 (± V1 > V2) trong nhồi máu dưới."], ["Thất phải nhồi máu: tránh thuốc gì?", "Nitrat và thuốc giảm tiền gánh (morphin, lợi tiểu); cần thận trọng duy trì tiền gánh."], ["Dấu hiệu tắc LAD đoạn gần?", "ST chênh lên aVL/DI, aVR, V1; ST chênh xuống thành dưới; RBBB/LAFB mới."]],
    litfl: ["Anterior STEMI", "Inferior STEMI", "Lateral STEMI", "Right ventricular infarction", "South African flag sign"] });

  add({ id: "ECG-18", part: 4, prio: "A", title: "Nhồi máu do tắc mạch không kèm ST chênh điển hình: de Winter, Wellens, thành sau, aVR, T tối cấp",
    tom: "Các ‘tương đương STEMI’ và dấu hiệu nguy cơ cao mà bác sĩ cấp cứu không được bỏ sót.",
    md: `
## 1. Nhồi máu thành sau (posterior OMI)
- **ST chênh xuống nằm ngang V1–V3 (thường tối đa ở V2–V3)**, T dương; R cao rộng V2 (R/S > 1) giai đoạn muộn.
- Ghi **V7–V9**: ST chênh lên ≥ 0,5 mm. Hay kèm nhồi máu dưới/bên.
- ST chênh xuống tối đa ở V1–V4 trong đau ngực = **thành sau cho đến khi chứng minh ngược lại**.

[[ecg:stemi_post]]

## 2. Sóng T de Winter
- ST chênh xuống **dốc lên** 1–3 mm tại điểm J ở V1–V6, nối tiếp **T cao, nhọn, đối xứng**.
- Không ST chênh lên ở chuyển đạo trước tim; ST chênh lên 0,5–1 mm ở aVR.
- Tắc **LAD đoạn gần** → chỉ định can thiệp cấp như STEMI.

[[ecg:dewinter]]

## 3. Hội chứng Wellens (hẹp nặng LAD đoạn gần – giai đoạn tái tưới máu)
- **Typ A** (~25%): T **hai pha** (dương rồi âm) V2–V3. **Typ B** (~75%): T **âm sâu, đối xứng** V2–V3 (có thể V1–V6).
- ST đẳng điện hoặc chênh < 1 mm, **không Q**, R tiến triển bình thường.
- Tiền sử đau ngực, **hiện đã hết đau**; troponin bình thường hoặc tăng nhẹ.
- **Chống chỉ định nghiệm pháp gắng sức**; chụp mạch vành sớm (thường trong 24 h). Có thể tái tắc → đau trở lại kèm “giả bình thường hoá” T rồi ST chênh lên.

[[ecg:wellens_a]]
[[ecg:wellens_b]]

## 4. Sóng T tối cấp
- T **rộng gốc, cao, cân đối, diện tích lớn** so với QRS; có thể kèm ST chênh lên nhẹ, hoặc mất ST đẳng điện thẳng.
- Phân biệt T nhọn tăng kali (hẹp đáy, nhọn như lều, QT bình thường/ngắn).

[[ecg:hyperacute]]

## 5. ST chênh lên aVR + ST chênh xuống lan toả
- ST chênh xuống ≥ 1 mm ở ≥ 6–8 chuyển đạo, ST chênh lên aVR (± V1).
- Gợi ý **thiếu máu dưới nội mạc lan toả**: hẹp thân chung, bệnh 3 nhánh — hoặc nguyên nhân **ngoài vành** (nhịp nhanh, sốc, thiếu máu nặng, thuyên tắc phổi, bóc tách ĐMC).
- Không phải lúc nào cũng là tắc mạch cấp; trong NSTE-ACS có thiếu máu kéo dài/không ổn định → chiến lược xâm lấn cấp cứu (< 2 giờ).

[[ecg:avr_std]]

## 6. Các dấu hiệu tinh tế khác
- ST chênh lên DI/aVL nhẹ kèm ST chênh xuống DIII (bên cao).
- ST chênh xuống **đơn độc** ở aVL trong đau ngực (soi gương sớm của nhồi máu dưới).
- **Biến dạng phần cuối QRS** (mất S ở V2–V3 khi có ST chênh lên).
- **ST chênh lên ‘không tương xứng’** trên nền LBBB, máy tạo nhịp, LVH.

> ! Lâm sàng nghi ngờ cao + ECG “không chẩn đoán”: ghi lại ECG mỗi 15–30 phút, thêm V7–V9 và V4R, hội chẩn tim mạch can thiệp sớm. Thiếu máu tiếp diễn khó chữa/sốc/rối loạn nhịp nguy hiểm → can thiệp cấp dù ECG không có ST chênh lên.
`,
    cards: [["Tiêu chuẩn sóng T de Winter?", "ST chênh xuống dốc lên 1–3 mm tại điểm J ở V1–V6 + T cao nhọn đối xứng; không ST chênh lên trước tim; ST chênh lên nhẹ aVR. Tắc LAD đoạn gần."], ["Hai typ Wellens?", "Typ A: T hai pha V2–V3; Typ B: T âm sâu đối xứng V2–V3. ST đẳng điện, không Q, bệnh nhân hết đau."], ["Wellens chống chỉ định gì?", "Nghiệm pháp gắng sức (nguy cơ nhồi máu trước rộng, đột tử)."], ["ST chênh xuống tối đa V1–V3 kèm đau ngực: nghĩ gì, làm gì?", "Nhồi máu thành sau; ghi V7–V9 (ST chênh lên ≥ 0,5 mm), xử trí như STEMI."], ["ST chênh lên aVR + ST chênh xuống lan toả gợi ý?", "Thiếu máu dưới nội mạc lan toả (hẹp thân chung/3 nhánh) hoặc nguyên nhân ngoài vành."]],
    litfl: ["Posterior myocardial infarction", "De Winter T wave", "Wellens syndrome", "Hyperacute T waves", "Left main coronary artery occlusion"] });

  add({ id: "ECG-19", part: 4, prio: "A", title: "Nhồi máu cơ tim trên nền block nhánh trái và nhịp máy tạo nhịp (Sgarbossa)",
    tom: "Sgarbossa gốc, Smith cải tiến — công cụ chẩn đoán OMI khi QRS rộng.",
    md: `
## Nguyên tắc
LBBB và tạo nhịp thất phải có **ST–T bất hoà bình thường**. Bất thường là khi ST **đồng hướng** với QRS hoặc **bất hoà quá mức**.

## Tiêu chuẩn Sgarbossa gốc (1996)
| Tiêu chuẩn | Điểm |
|---|---|
| ST chênh lên **đồng hướng** ≥ 1 mm ở chuyển đạo có QRS dương | 5 |
| ST chênh xuống **đồng hướng** ≥ 1 mm ở V1, V2 hoặc V3 | 3 |
| ST chênh lên **bất hoà** ≥ 5 mm ở chuyển đạo có QRS âm | 2 |
≥ 3 điểm: đặc hiệu cao (~90%) nhưng độ nhạy thấp.

## Tiêu chuẩn Sgarbossa cải tiến (Smith) — dương tính khi có ≥ 1
1. ST chênh lên **đồng hướng** ≥ 1 mm ở ≥ 1 chuyển đạo.
2. ST chênh xuống **đồng hướng** ≥ 1 mm ở ≥ 1 chuyển đạo V1–V3.
3. ST chênh lên **bất hoà quá mức**: ST/S ≤ −0,25 (ST chênh lên ≥ 25% độ sâu sóng S đứng trước) ở ≥ 1 chuyển đạo.

→ Độ nhạy tốt hơn hẳn tiêu chuẩn gốc, độ đặc hiệu tương đương. Áp dụng được cho **nhịp máy tạo nhịp thất**.

[[ecg:lbbb]]
[[ecg:lbbb_ami]]

> * Dùng **Công cụ → Sgarbossa (Smith)** để tính tỷ lệ ST/S cho từng chuyển đạo.

## Tiêu chuẩn Barcelona (tham khảo)
ST lệch ≥ 1 mm đồng hướng ở bất kỳ chuyển đạo nào, hoặc ST lệch bất hoà ≥ 1 mm ở chuyển đạo có biên độ QRS tối đa (R hoặc S) ≤ 6 mm.

> ! Bệnh nhân LBBB/máy tạo nhịp + đau ngực + **huyết động không ổn định** hoặc nghi ngờ cao → hội chẩn can thiệp cấp dù Sgarbossa âm tính. Hướng dẫn ESC hiện nay xử trí LBBB/RBBB/nhịp tạo nhịp kèm triệu chứng thiếu máu kéo dài theo chiến lược như STEMI.
`,
    cards: [["3 tiêu chuẩn Sgarbossa cải tiến (Smith)?", "(1) ST chênh lên đồng hướng ≥ 1 mm ở ≥ 1 chuyển đạo; (2) ST chênh xuống đồng hướng ≥ 1 mm ở V1–V3; (3) ST chênh lên bất hoà với ST/S ≤ −0,25."], ["Điểm Sgarbossa gốc?", "ST chênh lên đồng hướng ≥ 1 mm: 5; ST chênh xuống V1–V3 ≥ 1 mm: 3; ST chênh lên bất hoà ≥ 5 mm: 2; ≥ 3 điểm có ý nghĩa."]],
    litfl: ["Sgarbossa criteria", "Modified Sgarbossa", "Paced rhythm STEMI"] });

  add({ id: "ECG-20", part: 4, prio: "A", title: "ST chênh xuống và ECG trong hội chứng vành cấp không ST chênh",
    tom: "Ý nghĩa của ST chênh xuống, T âm và các bẫy ‘NSTEMI’ thực chất là OMI.",
    md: `
## Tiêu chuẩn thiếu máu (không ST chênh lên)
- ST chênh xuống **nằm ngang hoặc dốc xuống ≥ 0,5 mm** ở ≥ 2 chuyển đạo liên tiếp.
- T âm ≥ 1 mm ở ≥ 2 chuyển đạo liên tiếp có R ưu thế hoặc R/S > 1.
- ST chênh xuống **dốc lên** thường kém đặc hiệu (trừ de Winter).

[[ecg:nste]]
[[ecg:avr_std]]

## Hình dạng ST chênh xuống
| Hình dạng | Gợi ý |
|---|---|
| Nằm ngang / dốc xuống | Thiếu máu |
| Dốc lên | Nhịp nhanh, gắng sức; de Winter nếu kèm T cao nhọn |
| “Đáy chén”/võng | Digoxin |
| Dốc xuống + T âm không đối xứng ở chuyển đạo R cao | Strain thất trái (LVH) |
| Thứ phát sau QRS rộng | Block nhánh, WPW, tạo nhịp |

## Bẫy: ST chênh xuống là soi gương của tắc mạch
- ST chênh xuống **V1–V4** → nhồi máu thành sau.
- ST chênh xuống **DIII, aVF** + ST chênh lên nhẹ DI/aVL → nhồi máu bên cao.
- ST chênh xuống **aVL** đơn độc → có thể nhồi máu dưới sớm.

> ! ECG bình thường không loại trừ hội chứng vành cấp (đặc biệt tắc LCx). Kết hợp troponin độ nhạy cao theo phác đồ 0/1h hoặc 0/2h và ghi ECG lặp lại.

> * Nhịp nhanh (SVT, rung nhĩ nhanh) gây ST chênh xuống lan toả — đánh giá lại sau khi kiểm soát tần số trước khi kết luận thiếu máu.
`,
    cards: [["Tiêu chuẩn ST chênh xuống có ý nghĩa thiếu máu?", "Nằm ngang/dốc xuống ≥ 0,5 mm ở ≥ 2 chuyển đạo liên tiếp."], ["ST chênh xuống V1–V3 trong đau ngực cần làm gì?", "Ghi V7–V9 tìm nhồi máu thành sau (OMI)."]],
    litfl: ["Myocardial ischaemia", "ST segment depression", "NSTEMI"] });

  add({ id: "ECG-21", part: 4, prio: "B", title: "Tiến triển theo thời gian: sóng Q, phình thất, nhồi máu cũ",
    tom: "Sóng Q bệnh lý, phân biệt ST chênh lên của phình thất với nhồi máu cấp.",
    md: `
## Sóng Q bệnh lý (UDMI lần 4)
- Bất kỳ Q ≥ 20 ms hoặc phức bộ QS ở **V2–V3**.
- Q ≥ 30 ms **và** sâu ≥ 1 mm (hoặc QS) ở ≥ 2 chuyển đạo liên tiếp thuộc DI, aVL, V4–V6, DII, DIII, aVF.
- R ≥ 40 ms ở V1–V2 với R/S ≥ 1 và T dương đồng hướng (không có nguyên nhân dẫn truyền) → nhồi máu thành sau cũ.
- Q bình thường: Q nhỏ ở DIII, aVR, V1; q vách nhỏ ở DI, aVL, V5–V6.

[[ecg:old_inf]]

## Phình thất trái
- ST chênh lên **tồn tại > 2 tuần** sau nhồi máu, với Q sâu/QS (thường V1–V4).
- T **nhỏ so với QRS**. Quy tắc Smith: nếu **ở bất kỳ** chuyển đạo nào V1–V4 tỷ lệ biên độ T/QRS **> 0,36** → nghĩ nhồi máu cấp; nếu tất cả < 0,36 → nhiều khả năng phình thất (cần đối chiếu lâm sàng, ECG cũ, troponin).

[[ecg:lv_aneur]]

> * Luôn tìm ECG cũ. ST chênh lên “không đổi” so với ECG cũ hàng tháng là phình thất; thay đổi mới là cấp.
`,
    cards: [["Q bệnh lý ở V2–V3?", "Bất kỳ Q ≥ 20 ms hoặc QS."], ["Quy tắc T/QRS (Smith) để phân biệt phình thất với nhồi máu cấp?", "Ở V1–V4, nếu có chuyển đạo T/QRS > 0,36 → nghĩ nhồi máu cấp; tất cả < 0,36 → nghĩ phình thất."]],
    litfl: ["Left ventricular aneurysm", "Pathological Q waves"] });

  add({ id: "ECG-22", part: 4, prio: "A", title: "Chẩn đoán phân biệt ST chênh lên",
    tom: "STEMI/OMI hay ‘kẻ giả mạo’? Bảng so sánh và mẹo thực hành.",
    md: `
## Nguyên nhân ST chênh lên
- **Tắc mạch vành cấp (OMI)**, co thắt (Prinzmetal), bóc tách ĐMC lan vào động mạch vành.
- **Tái cực sớm lành tính**, biến thể vận động viên.
- **Viêm màng ngoài tim**, viêm cơ tim.
- **LBBB, máy tạo nhịp, LVH** (bất hoà thứ phát).
- **Phình thất trái**.
- **Brugada**, **tăng kali**, hạ thân nhiệt (sóng J), sau sốc điện, xuất huyết dưới nhện, **Takotsubo**, thuyên tắc phổi (hiếm, V1–V3/aVR).

## So sánh nhanh
| Đặc điểm | OMI/STEMI | Viêm màng ngoài tim | Tái cực sớm |
|---|---|---|---|
| Hình dạng ST | Lồi/thẳng | Lõm | Lõm, khía điểm J |
| Phân bố | Theo vùng động mạch | Lan toả | V2–V5 (± dưới) |
| Soi gương | **Có** | Không (trừ aVR, V1) | Không |
| PR chênh xuống | Không | **Có** (PR chênh lên aVR) | Không |
| Sóng Q | Có thể | Không | Không |
| Động học | Thay đổi nhanh | Thay đổi qua ngày | Ổn định |
| DII vs DIII | ST DIII > DII (RCA) | ST DII > DIII | — |

[[ecg:pericarditis]]
[[ecg:ber]]

## Mẹo thực hành
- **Tỷ lệ ST/T ở V6 > 0,25** gợi ý viêm màng ngoài tim hơn tái cực sớm.
- **Công thức 4 biến (Smith)** phân biệt tắc LAD tinh tế với tái cực sớm (chỉ dùng khi ST chênh lên V2–V4 không rõ ràng; loại trừ khi có soi gương, T âm, QRS bất thường): xem **Công cụ**.
- Soi gương ở **aVL** khi có ST chênh lên thành dưới gần như loại trừ viêm màng ngoài tim.

> ! Đau ngực + ST chênh lên không điển hình: ghi lại ECG, so ECG cũ, siêu âm tại giường (rối loạn vận động vùng), hội chẩn sớm. Đừng gán “viêm màng ngoài tim” hay “tái cực sớm” khi chưa loại trừ OMI.
`,
    cards: [["3 dấu hiệu ủng hộ STEMI hơn viêm màng ngoài tim?", "ST chênh lồi/thẳng theo vùng mạch; có soi gương (ngoài aVR); ST DIII > DII; có Q; thay đổi động."], ["Dấu hiệu ECG đặc trưng viêm màng ngoài tim?", "ST chênh lõm lan toả, PR chênh xuống (PR chênh lên ở aVR), không soi gương, dấu Spodick."], ["Tỷ lệ ST/T V6 > 0,25 gợi ý?", "Viêm màng ngoài tim hơn tái cực sớm."]],
    litfl: ["ST segment elevation", "Pericarditis", "Benign early repolarisation", "Takotsubo"] });

  add({ id: "ECG-23", part: 4, prio: "B", title: "Chẩn đoán phân biệt sóng T đảo và T cao nhọn",
    tom: "Hai danh sách cần thuộc để không nhầm tăng kali với tắc LAD, Wellens với strain.",
    md: `
## T cao nhọn
| Nguyên nhân | Đặc điểm phân biệt |
|---|---|
| **Tăng kali** | Hẹp đáy, nhọn, đối xứng (“lều”), QT bình thường/ngắn; kèm P dẹt, QRS rộng khi nặng |
| **T tối cấp (OMI sớm)** | Rộng gốc, “phồng”, diện tích lớn so với QRS, theo vùng mạch |
| Tái cực sớm | Không đối xứng, kèm ST chênh lõm, khía J |
| LVH / LBBB | T cao V1–V3 bất hoà sau S sâu |
| Biến thể bình thường | Người trẻ, vận động viên |

[[ecg:hyperk]]

## T đảo
| Nhóm | Nguyên nhân |
|---|---|
| Bình thường | aVR, V1 (± DIII, aVF đơn độc), T thiếu niên V1–V3 ở trẻ em |
| Thiếu máu | Thiếu máu/nhồi máu (T đối xứng), **Wellens**, sau nhồi máu |
| Thất phải | **Thuyên tắc phổi**, tâm phế cấp, ARVC (V1–V3) |
| Thứ phát | LVH strain, RVH strain, block nhánh, WPW, nhịp tạo nhịp, “T trí nhớ” sau tạo nhịp/nhịp nhanh |
| Bệnh cơ tim | HCM (vùng mỏm: T âm khổng lồ), Takotsubo, viêm cơ tim |
| Thần kinh | **Xuất huyết dưới nhện**, tăng áp lực nội sọ (T âm rộng, sâu, QT dài) |
| Khác | Digoxin, hạ kali (T dẹt), sau cơn nhịp nhanh |

[[ecg:wellens_b]]
[[ecg:cerebral_t]]

> * T âm V1–V4 + đau ngực/khó thở: nghĩ cả **Wellens** (hẹp LAD) lẫn **thuyên tắc phổi** — T âm cả ở DIII/aVF ủng hộ thuyên tắc phổi.
`,
    cards: [["Phân biệt T nhọn tăng kali và T tối cấp?", "Tăng kali: hẹp đáy, nhọn như lều, đối xứng, QT bình thường/ngắn; tối cấp: rộng gốc, phồng, diện tích lớn so với QRS, theo vùng mạch."], ["T âm V1–V4 và DIII trong khó thở cấp gợi ý gì?", "Thuyên tắc phổi (căng giãn thất phải)."]],
    litfl: ["T wave", "T wave inversion", "Peaked T waves"] });
})(typeof window !== "undefined" ? window : globalThis);

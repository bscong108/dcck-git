/* Bài học Phần V: Rối loạn nhịp */
(function (root) {
  "use strict";
  const B = (root.LESSONS = root.LESSONS || []);
  const add = (o) => B.push(o);

  add({ id: "ECG-24", part: 5, prio: "A", title: "Cơ chế rối loạn nhịp: tăng tính tự động, vòng vào lại, hoạt động nảy cò",
    tom: "Ba cơ chế và vì sao chúng quyết định cách điều trị.",
    md: `
| Cơ chế | Đặc điểm lâm sàng/ECG | Ví dụ | Hệ quả điều trị |
|---|---|---|---|
| **Tăng tính tự động** | Khởi phát và kết thúc từ từ (“khởi động – nguội dần”), không cắt bằng sốc điện | Nhịp nhanh xoang, nhịp nhanh nhĩ ổ, AIVR, nhịp bộ nối gia tốc | Điều trị nguyên nhân; sốc điện vô ích |
| **Vòng vào lại** | Khởi phát/kết thúc đột ngột, thường do ngoại tâm thu khởi phát, rất đều | AVNRT, AVRT, cuồng nhĩ, VT trên sẹo | Cắt vòng: nghiệm pháp phế vị, adenosine (nếu vòng qua nút AV), sốc điện đồng bộ |
| **Hoạt động nảy cò** – hậu khử cực sớm (EAD) | Phụ thuộc nhịp chậm, QT dài | Xoắn đỉnh | Magie, tăng tần số tim, bỏ thuốc kéo dài QT |
| **Hậu khử cực muộn** (DAD) | Quá tải Ca²⁺ nội bào, phụ thuộc nhịp nhanh | Ngộ độc digoxin (VT hai hướng), VT đường ra nhạy catecholamine | Kháng thể kháng digoxin; chẹn bêta |

## Điều kiện vòng vào lại
- Hai đường dẫn có **tốc độ dẫn và thời gian trơ khác nhau**, **block một chiều** ở một đường, và dẫn đủ chậm để vùng trơ hồi phục.

> * Nhịp nhanh không đáp ứng sốc điện + khởi phát từ từ → nghĩ tăng tính tự động (ví dụ nhịp nhanh xoang do giảm thể tích) — điều trị nguyên nhân, đừng sốc điện lặp lại.
`,
    cards: [["Nhịp nhanh do tăng tính tự động có đáp ứng sốc điện không?", "Không — tái xuất hiện ngay; điều trị nguyên nhân."], ["Cơ chế xoắn đỉnh?", "Hậu khử cực sớm trên nền QT dài, phụ thuộc nhịp chậm."], ["Cơ chế VT hai hướng do digoxin?", "Hậu khử cực muộn do quá tải Ca²⁺ nội bào."]],
    litfl: ["Mechanisms of arrhythmia", "Re-entry"] });

  add({ id: "ECG-25", part: 5, prio: "B", title: "Nhịp xoang, nhịp nhanh xoang, loạn nhịp xoang",
    tom: "Tiêu chuẩn nhịp xoang và cái bẫy ‘nhịp nhanh xoang’ ở bệnh nhân nặng.",
    md: `
## Tiêu chuẩn nhịp xoang
- P **dương ở DI, DII**, âm ở aVR; trục P 0° đến +75°.
- Mỗi P theo sau bởi QRS, PR hằng định 120–200 ms.

[[ecg:normal]]
[[ecg:sinus_tach]]
[[ecg:sinus_brady]]
[[ecg:sinus_arr]]

## Nhịp nhanh xoang
- Tần số > 100/ph, tối đa xấp xỉ **220 − tuổi**. Tăng/giảm dần.
- Luôn là **dấu hiệu**, không phải chẩn đoán: sốt, đau, lo âu, giảm thể tích/xuất huyết, nhiễm khuẩn, thiếu oxy, **thuyên tắc phổi**, cường giáp, thiếu máu, ngộ độc (giao cảm, kháng cholinergic), cai rượu.

> ! Nhịp nhanh đều ~150/ph với QRS hẹp: luôn nghĩ **cuồng nhĩ 2:1** — tìm sóng F ở DII, DIII, aVF, V1.

> ! Tần số > 150/ph ở người già nằm yên: ít khả năng là nhịp nhanh xoang — nghĩ SVT hoặc cuồng nhĩ.

## Loạn nhịp xoang hô hấp
- RR thay đổi theo hô hấp (nhanh khi hít vào), P đồng nhất. Lành tính ở người trẻ.
`,
    cards: [["Tiêu chuẩn nhịp xoang?", "P dương DI, DII, âm aVR; mỗi P có QRS theo sau; PR hằng định."], ["Nhịp nhanh QRS hẹp đều 150/ph: phải nghĩ gì?", "Cuồng nhĩ 2:1 — tìm sóng F ở chuyển đạo dưới và V1."]],
    litfl: ["Sinus tachycardia", "Sinus arrhythmia", "Sinus bradycardia"] });

  add({ id: "ECG-26", part: 5, prio: "B", title: "Ngoại tâm thu nhĩ, bộ nối và thất",
    tom: "Nhận diện, phân biệt với dẫn truyền lệch hướng, và khi nào ngoại tâm thu là dấu hiệu nguy hiểm.",
    md: `
| | Nhĩ (PAC) | Bộ nối (PJC) | Thất (PVC) |
|---|---|---|---|
| P | P đến sớm, hình dạng khác P xoang (có thể ẩn trong T trước) | Không P hoặc P ngược dòng ngay trước/sau QRS | Không có P đi trước (P xoang có thể lẫn trong QRS/T) |
| QRS | Hẹp (có thể lệch hướng – thường dạng RBBB) | Hẹp | **Rộng, kỳ dị**, ST–T ngược hướng |
| Nghỉ bù | Thường không hoàn toàn (đặt lại nút xoang) | Thay đổi | Thường **hoàn toàn** |

[[ecg:pvc]]

## Thuật ngữ
- Nhịp đôi (bigeminy), nhịp ba (trigeminy), cặp đôi (couplet), **chuỗi ≥ 3 PVC liên tiếp = VT** (< 30 giây: không bền bỉ).
- **R-on-T**: PVC rơi vào đỉnh T → có thể khởi phát VF, đặc biệt trong thiếu máu cấp hoặc QT dài.

## Đầu mối cấp cứu
- PVC đa ổ, cặp đôi, R-on-T trong thiếu máu cấp; PVC xuất hiện nhiều trong **ngộ độc digoxin**, hạ K⁺/Mg²⁺.
- Hình dạng PVC: **dạng LBBB + trục dưới** → đường ra thất phải (thường lành tính); dạng RBBB → nguồn gốc thất trái.

> * PAC không dẫn (P sớm rơi vào T, không có QRS theo sau) là nguyên nhân thường gặp nhất của “ngưng nhịp” — đừng nhầm với block AV độ II.
`,
    cards: [["Đặc điểm PVC?", "QRS rộng kỳ dị đến sớm, không P đi trước, ST–T ngược hướng, nghỉ bù hoàn toàn."], ["Bao nhiêu PVC liên tiếp gọi là VT?", "≥ 3 nhịp liên tiếp (tần số > 100/ph)."], ["Nguyên nhân hay gặp nhất của ngưng nhịp trên ECG?", "Ngoại tâm thu nhĩ không dẫn (P sớm ẩn trong T)."]],
    litfl: ["Premature ventricular complex", "Premature atrial complex", "Junctional premature complex"] });

  add({ id: "ECG-27", part: 5, prio: "A", title: "Rung nhĩ",
    tom: "Nhận diện, các dạng nguy hiểm (đáp ứng nhanh, tiền kích thích, kèm block) và xử trí cấp.",
    md: `
## ECG
- **Không có sóng P**; sóng f lăn tăn (rõ nhất V1), có thể rất mảnh (rung nhĩ sóng nhỏ).
- **RR không đều hoàn toàn** — không có quy luật.
- Tần số thất thường 100–160/ph nếu chưa điều trị; QRS hẹp (trừ lệch hướng, block nhánh, tiền kích thích).

[[ecg:af]]
[[ecg:af_rvr]]

## Các dạng cần cảnh giác
| Dạng | Dấu hiệu | Ý nghĩa |
|---|---|---|
| Đáp ứng thất nhanh | > 150/ph | Tìm nguyên nhân (nhiễm khuẩn, giảm thể tích, cường giáp, suy tim); rung nhĩ có thể là hậu quả |
| **Tiền kích thích** | > 250/ph, QRS rộng thay đổi | Cấm thuốc ức chế nút AV → sốc điện/procainamide |
| Rung nhĩ + **RR đều** | Đều, chậm | Block AV hoàn toàn với nhịp thoát → **nghĩ ngộ độc digoxin** |
| Đáp ứng thất chậm | < 50/ph chưa dùng thuốc | Bệnh hệ dẫn truyền, thuốc |
| QRS rộng không đều | | Rung nhĩ + block nhánh/lệch hướng (Ashman) hoặc tiền kích thích |

[[ecg:wpw_af]]

## Xử trí cấp (tóm tắt)
- **Không ổn định** (sốc, thiếu máu cơ tim, phù phổi, ngất): **sốc điện đồng bộ** (năng lượng tối đa của máy thường được khuyến cáo cho rung nhĩ).
- **Ổn định**: kiểm soát tần số (chẹn bêta, diltiazem/verapamil nếu không suy tim EF giảm; digoxin/amiodarone khi suy tim/tụt áp), xem xét chuyển nhịp nếu khởi phát < 48 giờ (hoặc đã kháng đông đủ), đánh giá **kháng đông** theo CHA₂DS₂-VA(Sc).
- Tìm và điều trị yếu tố thúc đẩy.

> * Hiện tượng Ashman: nhịp QRS rộng dạng RBBB xuất hiện sau chu kỳ dài – ngắn trong rung nhĩ là dẫn truyền lệch hướng, không phải PVC.
`,
    cards: [["Hai đặc điểm ECG của rung nhĩ?", "Không có sóng P (có sóng f) và RR không đều hoàn toàn."], ["Rung nhĩ có RR đều, chậm gợi ý gì?", "Block AV hoàn toàn với nhịp thoát — nghĩ ngộ độc digoxin."], ["Rung nhĩ không ổn định xử trí thế nào?", "Sốc điện đồng bộ."], ["Hiện tượng Ashman?", "Nhịp dẫn truyền lệch hướng (thường dạng RBBB) sau chu kỳ RR dài – ngắn trong rung nhĩ."]],
    litfl: ["Atrial fibrillation", "Ashman phenomenon", "Pre-excited atrial fibrillation"] });

  add({ id: "ECG-28", part: 5, prio: "A", title: "Cuồng nhĩ và nhịp nhanh nhĩ",
    tom: "Sóng F răng cưa, dẫn truyền 2:1 và các nhịp nhanh nhĩ khác.",
    md: `
## Cuồng nhĩ điển hình (vòng vào lại qua eo van ba lá, ngược chiều kim đồng hồ)
- **Sóng F răng cưa** ~ 300/ph (250–350), **âm** ở DII, DIII, aVF; dương ở V1.
- Không có đường đẳng điện giữa các sóng F ở chuyển đạo dưới.
- Dẫn truyền thường **2:1 → thất ~ 150/ph**; 4:1 → ~75/ph; có thể thay đổi (RR không đều theo bội số).
- Dẫn truyền **1:1** (hiếm, nguy hiểm): ~300/ph, thường QRS rộng — gặp khi dùng thuốc nhóm IC không kèm chẹn nút AV, tiền kích thích, cường giao cảm.

[[ecg:flutter21]]
[[ecg:flutter41]]

> * Khó thấy sóng F? Lật ngược ECG xem DII, dùng thước đo đánh dấu các sóng cách đều 200 ms, hoặc nghiệm pháp phế vị/adenosine làm chậm thất để bộc lộ F (adenosine **không** cắt cuồng nhĩ).

## Nhịp nhanh nhĩ
| Loại | ECG | Gợi ý |
|---|---|---|
| Nhịp nhanh nhĩ ổ | P khác P xoang, có đường đẳng điện giữa các P, 100–250/ph | Có thể kèm block AV — **nghĩ ngộ độc digoxin** |
| **Nhịp nhanh nhĩ đa ổ (MAT)** | ≥ 3 hình dạng P khác nhau, PR và RR thay đổi, > 100/ph | COPD, suy hô hấp, hạ K⁺/Mg²⁺ — điều trị bệnh nền, không sốc điện |

## Xử trí cuồng nhĩ
- Như rung nhĩ: kiểm soát tần số khó hơn; **sốc điện đồng bộ năng lượng thấp** thường hiệu quả; kháng đông như rung nhĩ.
`,
    cards: [["Tần số nhĩ trong cuồng nhĩ điển hình?", "Khoảng 300/ph (250–350); sóng F âm ở DII, DIII, aVF."], ["Nhịp nhanh đa ổ (MAT) cần ít nhất bao nhiêu hình dạng P?", "≥ 3 hình dạng P khác nhau, tần số > 100/ph."], ["Adenosine có cắt cuồng nhĩ không?", "Không — chỉ làm chậm thất tạm thời giúp bộc lộ sóng F."]],
    litfl: ["Atrial flutter", "Multifocal atrial tachycardia", "Focal atrial tachycardia"] });

  add({ id: "ECG-29", part: 5, prio: "A", title: "Nhịp nhanh vào lại nút nhĩ thất (AVNRT)",
    tom: "SVT hay gặp nhất: giả r’ V1, giả S thành dưới, và xử trí từng bước.",
    md: `
## ECG
- Nhịp nhanh **QRS hẹp, rất đều**, 140–280/ph.
- Thể điển hình (chậm – nhanh): P ngược dòng **ẩn trong QRS** hoặc ngay sau QRS → **giả r’ ở V1**, **giả S ở DII, DIII, aVF**; RP < 70 ms.
- Có thể có ST chênh xuống lan toả do tần số (không đặc hiệu thiếu máu).
- Thể không điển hình (nhanh – chậm): RP dài, P âm thành dưới trước QRS.

[[ecg:avnrt]]

## Xử trí (ổn định)
1. **Nghiệm pháp phế vị cải tiến** (Valsalva tư thế ngồi, thổi 15 giây rồi nằm ngửa nâng chân 45° trong 15 giây — REVERT).
2. **Adenosine** 6 mg tiêm nhanh TM (tĩnh mạch lớn, bơm đuổi bằng 20 mL NaCl) → 12 mg nếu không đáp ứng (ERC cho thêm 18 mg). Ghi ECG liên tục khi tiêm.
3. Thay thế: verapamil/diltiazem TM (nếu không suy tim EF giảm, không tụt áp), chẹn bêta.
4. **Không ổn định**: sốc điện đồng bộ.

> ! Trước adenosine: báo bệnh nhân cảm giác khó chịu thoáng qua; thận trọng hen nặng; giảm liều (3 mg) khi dùng qua catheter tĩnh mạch trung tâm, ghép tim hoặc đang dùng dipyridamole/carbamazepine.

> * ECG sau chuyển nhịp: tìm **sóng delta** (đường phụ) — đổi hướng chẩn đoán sang AVRT.
`,
    cards: [["Dấu hiệu ECG của AVNRT điển hình?", "QRS hẹp rất đều 140–280/ph; P ẩn trong QRS, giả r’ ở V1, giả S ở thành dưới; RP < 70 ms."], ["Liều adenosine?", "6 mg tiêm nhanh TM + bơm đuổi; nếu không đáp ứng 12 mg (ERC: thêm 18 mg)."], ["Nghiệm pháp phế vị cải tiến (REVERT)?", "Valsalva (thổi 40 mmHg, 15 giây) ở tư thế ngồi rồi ngay lập tức nằm ngửa nâng chân 45° trong 15 giây."]],
    litfl: ["Supraventricular tachycardia", "AVNRT", "Adenosine"] });

  add({ id: "ECG-30", part: 5, prio: "A", title: "Nhịp nhanh vào lại nhĩ thất qua đường phụ (AVRT)",
    tom: "Chiều xuôi, chiều ngược và các điểm khác với AVNRT.",
    md: `
## AVRT chiều xuôi (orthodromic, > 90%)
- Xuống qua nút AV, ngược lên đường phụ → **QRS hẹp** (trừ lệch hướng), đều, thường 200–300/ph.
- P ngược dòng **sau QRS, RP > 70 ms** (thường trong đoạn ST).
- QRS luân phiên biên độ (QRS alternans), ST chênh xuống rõ.
- Lúc nhịp xoang có thể thấy kiểu WPW, hoặc không (đường phụ ẩn).

## AVRT chiều ngược (antidromic)
- Xuống qua đường phụ → **QRS rộng, đều** — không phân biệt được với VT trên ECG → xử trí như VT.

## Rung nhĩ tiền kích thích (xem ECG-15)
[[ecg:wpw_af]]

## So sánh nhanh AVNRT – AVRT
| | AVNRT | AVRT chiều xuôi |
|---|---|---|
| Vị trí P ngược dòng | Trong/ngay sau QRS (RP < 70 ms) | Trong ST (RP > 70 ms) |
| Giả r’ V1 | Có | Không |
| Delta khi nhịp xoang | Không | Có thể |
| Xử trí cấp | Như nhau: phế vị → adenosine → chẹn canxi/bêta → sốc điện | |
`,
    cards: [["Phân biệt AVRT chiều xuôi với AVNRT dựa vào P?", "AVRT: P ngược dòng trong đoạn ST với RP > 70 ms; AVNRT: P ẩn trong/ngay sau QRS, RP < 70 ms."], ["AVRT chiều ngược trên ECG?", "Nhịp nhanh QRS rộng đều — xử trí như VT."]],
    litfl: ["AVRT", "Wolff-Parkinson-White syndrome"] });

  add({ id: "ECG-31", part: 5, prio: "A", title: "Tiếp cận nhịp nhanh QRS hẹp",
    tom: "Đều hay không đều — có P không — RP ngắn hay dài.",
    md: `
## Bước 1: Đều hay không đều?
- **Không đều**: rung nhĩ, cuồng nhĩ dẫn truyền thay đổi, nhịp nhanh nhĩ đa ổ, nhịp xoang nhiều ngoại tâm thu nhĩ.
- **Đều**: nhịp nhanh xoang, nhịp nhanh nhĩ, cuồng nhĩ (dẫn truyền cố định), AVNRT, AVRT, nhịp nhanh bộ nối.

## Bước 2 (nhịp đều): tìm P và đo RP
| RP | Chẩn đoán |
|---|---|
| Không thấy P / P ngay sau QRS (RP < 70 ms) | **AVNRT** điển hình |
| RP ngắn > 70 ms (RP < PR) | **AVRT** chiều xuôi |
| RP dài (RP > PR) | Nhịp nhanh xoang, nhịp nhanh nhĩ, AVNRT không điển hình, PJRT |
| Nhiều P hơn QRS | Cuồng nhĩ, nhịp nhanh nhĩ kèm block |

## Bước 3: thử nghiệm điều trị – chẩn đoán
- **Nghiệm pháp phế vị/adenosine**: cắt cơn → vòng vào lại qua nút AV (AVNRT/AVRT); chậm thất tạm thời bộc lộ F/P → cuồng nhĩ/nhịp nhanh nhĩ; không đổi → nhịp nhanh xoang/kỹ thuật kém.

[[ecg:avnrt]]
[[ecg:flutter21]]
[[ecg:sinus_tach]]

> ! Đánh giá huyết động trước tiên: **sốc, ngất, thiếu máu cơ tim, suy tim cấp** → sốc điện đồng bộ (sau an thần nếu tỉnh).
`,
    cards: [["Nhịp nhanh QRS hẹp không đều: 3 chẩn đoán?", "Rung nhĩ, cuồng nhĩ dẫn truyền thay đổi, nhịp nhanh nhĩ đa ổ."], ["Nhịp nhanh RP dài gồm những gì?", "Nhịp nhanh xoang, nhịp nhanh nhĩ, AVNRT không điển hình, PJRT."]],
    litfl: ["Narrow complex tachycardia", "Supraventricular tachycardia"] });

  add({ id: "ECG-32", part: 5, prio: "A", title: "Nhịp nhanh thất đơn hình",
    tom: "Dấu hiệu đặc hiệu VT và xử trí theo huyết động.",
    md: `
[[ecg:vt]]

## Dấu hiệu ủng hộ VT
- **Phân ly nhĩ thất** (P độc lập, tần số nhĩ < thất) — đặc hiệu cao.
- **Nhát bắt được (capture)**: một QRS hẹp bình thường xen giữa; **nhát hỗn hợp (fusion)**: QRS trung gian.
- QRS **rất rộng** (> 140 ms dạng RBBB, > 160 ms dạng LBBB).
- **Trục tây bắc** (−90° đến ±180°): R ưu thế aVR.
- **Đồng hướng chuyển đạo trước tim** (toàn bộ V1–V6 dương hoặc âm).
- Không có RS ở mọi chuyển đạo trước tim, hoặc **R đến đáy S > 100 ms**.
- Dấu Josephson (khía gần đáy S), dấu Brugada.

## Lâm sàng
- **> 35 tuổi, bệnh tim thiếu máu/nhồi máu cũ, suy tim** → VT đến > 90% trường hợp nhịp nhanh QRS rộng.
- Huyết động ổn định **không** loại trừ VT.

## Xử trí
- **Mất mạch**: như rung thất (sốc điện không đồng bộ, CPR).
- **Có mạch, không ổn định**: sốc điện **đồng bộ** (tối đa 3 lần), sau đó amiodarone 300 mg TM trong 10–20 phút.
- **Ổn định**: amiodarone 300 mg TM trong 10–60 phút (hoặc procainamide), chuẩn bị sốc điện; tìm thiếu máu, điện giải (K⁺, Mg²⁺).

> ! Nhịp nhanh QRS rộng đều: **coi là VT cho đến khi chứng minh ngược lại**. Verapamil/diltiazem có thể gây trụy tim mạch nếu là VT.
`,
    cards: [["Dấu hiệu đặc hiệu nhất của VT trên ECG?", "Phân ly nhĩ thất, nhát bắt được, nhát hỗn hợp."], ["VT có mạch không ổn định xử trí thế nào?", "Sốc điện đồng bộ (tối đa 3 lần), sau đó amiodarone 300 mg TM."], ["Đồng hướng chuyển đạo trước tim là gì?", "Mọi QRS từ V1 đến V6 cùng dương hoặc cùng âm — gợi ý VT."]],
    litfl: ["Ventricular tachycardia monomorphic", "VT versus SVT", "Fusion beats"] });

  add({ id: "ECG-33", part: 5, prio: "A", title: "Tiếp cận nhịp nhanh QRS rộng: các thuật toán phân biệt",
    tom: "Brugada 1991, Vereckei aVR — và vì sao lâm sàng quan trọng hơn thuật toán.",
    md: `
## Chẩn đoán phân biệt nhịp nhanh QRS rộng
- **VT** (≈ 80%).
- SVT dẫn truyền lệch hướng hoặc trên nền block nhánh.
- SVT qua đường phụ (AVRT chiều ngược, rung/cuồng nhĩ tiền kích thích).
- Nhịp nhanh do **tăng kali**, **chẹn kênh Na⁺**, máy tạo nhịp (nhịp nhanh qua trung gian máy).

## Thuật toán Brugada (1991) — VT nếu “có” ở bất kỳ bước nào
1. **Không có phức bộ RS** ở mọi chuyển đạo trước tim?
2. Khoảng **từ đầu R đến đáy S > 100 ms** ở bất kỳ chuyển đạo trước tim nào?
3. **Phân ly nhĩ thất**?
4. Tiêu chuẩn hình thái VT ở cả V1–V2 và V6?
→ Nếu tất cả “không”: SVT dẫn truyền lệch hướng.

## Thuật toán aVR (Vereckei 2008) — VT nếu “có”
1. **R khởi đầu** ở aVR?
2. r hoặc q khởi đầu **> 40 ms** ở aVR?
3. **Khía** ở nhánh xuống của QRS âm ưu thế ở aVR?
4. **vi/vt ≤ 1** (biên độ 40 ms đầu / 40 ms cuối)?
→ Tất cả “không”: SVT.

> * Thực hành bằng **Công cụ → Thuật toán VT** (từng bước có giải thích).

> ! Không có thuật toán nào hoàn hảo (độ chính xác khoảng 75–90%). Tuổi > 35, bệnh tim cấu trúc → VT. **Không chắc chắn → xử trí như VT** (sốc điện đồng bộ hoặc amiodarone/procainamide).

[[ecg:vt]]
[[ecg:rbbb]]
`,
    cards: [["4 bước thuật toán Brugada?", "(1) Không có RS ở mọi chuyển đạo trước tim; (2) R đến đáy S > 100 ms; (3) phân ly nhĩ thất; (4) hình thái VT ở V1–V2 và V6. Có bất kỳ → VT."], ["Thuật toán aVR (Vereckei) bước 1?", "Có sóng R khởi đầu ở aVR → VT."], ["Không chắc VT hay SVT lệch hướng: làm gì?", "Xử trí như VT."]],
    litfl: ["VT versus SVT", "Brugada algorithm", "Vereckei algorithm", "Wide complex tachycardia"] });

  add({ id: "ECG-34", part: 5, prio: "A", title: "Nhịp nhanh thất đa hình, xoắn đỉnh và QT kéo dài",
    tom: "Đo QT đúng, nguyên nhân QT dài và xử trí xoắn đỉnh.",
    md: `
## Đo QT
- Từ đầu QRS đến cuối T (tiếp tuyến dốc xuống của T cắt đường đẳng điện), ở DII hoặc V5–V6; lấy chuyển đạo có QT dài nhất; không tính sóng U tách rời.
- **Hiệu chỉnh**: Bazett QTc = QT/√RR (sai số khi tần số < 60 hoặc > 100/ph) → ưu tiên **Fridericia** (QT/∛RR) hoặc Framingham khi nhịp nhanh.
- **Mẹo nhanh**: QT > một nửa khoảng RR (tần số 60–100) gợi ý QT dài.
- QTc **> 500 ms** hoặc tăng **> 60 ms** so với ban đầu: nguy cơ xoắn đỉnh cao.

[[ecg:lqt]]

## Nguyên nhân QT dài
- **Thuốc**: kháng loạn nhịp IA/III (sotalol, amiodarone…), macrolide, fluoroquinolone, chống loạn thần (haloperidol), ondansetron, methadone, chống trầm cảm…
- **Điện giải**: hạ **K⁺**, hạ **Mg²⁺**, hạ **Ca²⁺**.
- Nhịp chậm, block AV; thiếu máu cơ tim; tổn thương thần kinh (SAH); hạ thân nhiệt; suy giáp; QT dài bẩm sinh.

## Xoắn đỉnh (TdP)
- VT đa hình, QRS **xoắn quanh đường đẳng điện**, biên độ tăng giảm; khởi phát sau chuỗi **ngắn – dài – ngắn** trên nền QT dài.

[[ecg:tdp]]

## Xử trí
- **Magie sulfat 2 g TM** (trong vài phút nếu có mạch không ổn định; nhắc lại được) — kể cả khi Mg²⁺ máu bình thường.
- Mất mạch → **sốc điện không đồng bộ** (VT đa hình không đồng bộ được).
- Ngăn tái phát: **tăng tần số tim** (tạo nhịp vượt tần số, isoprenaline nếu QT dài mắc phải), bù K⁺ lên mức bình thường cao (~4,5–5 mmol/L), ngừng thuốc kéo dài QT.
- **VT đa hình QT bình thường** → nghĩ **thiếu máu cơ tim cấp** (chụp mạch), CPVT, Brugada.
`,
    cards: [["Công thức Bazett?", "QTc = QT / √RR (giây)."], ["QTc bao nhiêu thì nguy cơ xoắn đỉnh cao?", "> 500 ms (hoặc tăng > 60 ms so với ban đầu)."], ["Thuốc đầu tay trong xoắn đỉnh?", "Magie sulfat 2 g TM."], ["VT đa hình với QT bình thường gợi ý?", "Thiếu máu cơ tim cấp (cũng: CPVT, Brugada)."]],
    litfl: ["QT interval", "Torsades de pointes", "Polymorphic VT", "QTc calculator"] });

  add({ id: "ECG-35", part: 5, prio: "A", title: "Rung thất và các nhịp trong ngừng tuần hoàn",
    tom: "Bốn nhịp ngừng tim, nhận diện nhanh và bẫy rung thất sóng nhỏ.",
    md: `
| Nhịp | ECG | Nhóm |
|---|---|---|
| **Rung thất (VF)** | Dao động hỗn loạn, không QRS | Sốc điện được |
| **VT vô mạch** | QRS rộng đều, không mạch | Sốc điện được |
| **Vô tâm thu** | Gần thẳng ± sóng P | Không sốc điện |
| **Hoạt động điện vô mạch (PEA)** | Có nhịp có tổ chức nhưng không mạch | Không sốc điện |

[[ecg:vf]]
[[ecg:asystole]]
[[ecg:p_asystole]]

## Xử trí theo ALS (tóm tắt)
- **Sốc được**: sốc điện ngay → CPR 2 phút → đánh giá nhịp; **adrenaline 1 mg** và **amiodarone 300 mg** sau lần sốc thứ 3 (amiodarone 150 mg sau lần thứ 5); adrenaline nhắc lại mỗi 3–5 phút.
- **Không sốc được**: CPR + **adrenaline 1 mg càng sớm càng tốt**, nhắc lại mỗi 3–5 phút.
- Tìm và xử trí **4H – 4T**: thiếu oxy, giảm thể tích, tăng/hạ kali – rối loạn chuyển hoá, hạ thân nhiệt / huyết khối (mạch vành, phổi), tràn khí màng phổi áp lực, ép tim cấp, độc chất.

> ! “Vô tâm thu”: kiểm tra **điện cực, gain, ít nhất 2 chuyển đạo** — rung thất sóng nhỏ có thể trông như đường thẳng ở một chuyển đạo.

> * PEA nhịp nhanh, QRS hẹp → nghĩ nguyên nhân cơ học (giảm thể tích, ép tim, tràn khí, thuyên tắc phổi); PEA nhịp chậm, QRS rộng → nghĩ chuyển hoá (tăng K⁺, ngộ độc) hoặc nhồi máu rộng.
`,
    cards: [["4 nhịp ngừng tuần hoàn?", "Rung thất, VT vô mạch (sốc được); vô tâm thu, PEA (không sốc được)."], ["Thời điểm dùng amiodarone trong VF?", "300 mg sau lần sốc thứ 3; 150 mg sau lần thứ 5."], ["PEA QRS rộng, chậm gợi ý nguyên nhân gì?", "Chuyển hoá (tăng kali, ngộ độc chẹn Na⁺) hoặc nhồi máu rộng."]],
    litfl: ["Ventricular fibrillation", "Asystole", "Pulseless electrical activity"] });

  add({ id: "ECG-36", part: 5, prio: "B", title: "Nhịp thoát, phân ly nhĩ thất, nhịp tự thất gia tốc",
    tom: "Nhịp ‘cứu hộ’ không được ức chế, và AIVR — dấu tái tưới máu.",
    md: `
## Nhịp thoát
- Xuất hiện khi ổ tạo nhịp trên **không phát xung** hoặc **bị block**: thoát bộ nối 40–60/ph (QRS hẹp), thoát thất 20–40/ph (QRS rộng).
- **Không dùng thuốc chống loạn nhịp** ức chế nhịp thoát — điều trị nhịp chậm nguyên nhân.

[[ecg:junctional]]

## Phân ly nhĩ thất
- Nhĩ và thất hoạt động độc lập. Có hai cơ chế: **block AV hoàn toàn** (nhĩ nhanh hơn thất) hoặc **tần số thoát/ổ thất nhanh hơn nút xoang** (“phân ly đẳng nhịp”, AIVR, VT).

## Nhịp tự thất gia tốc (AIVR)
- QRS rộng, đều, **50–110/ph**; có thể có nhát hỗn hợp, nhát bắt được khi nút xoang nhanh lên.
- Gặp sau **tái tưới máu** (tiêu sợi huyết, PCI), ngộ độc digoxin, cocaine, bệnh cơ tim.
- Thường lành tính, tự hết; **không** điều trị bằng thuốc chống loạn nhịp.

[[ecg:aivr]]

## Nhịp bộ nối gia tốc
- QRS hẹp 60–100/ph (> 100: nhịp nhanh bộ nối). Gặp trong ngộ độc digoxin, viêm cơ tim, sau phẫu thuật tim, nhồi máu dưới.
`,
    cards: [["Tần số AIVR?", "50–110/ph, QRS rộng đều."], ["Có nên ức chế nhịp thoát thất bằng lidocaine/amiodarone?", "Không — nhịp thoát duy trì cung lượng; xử trí nhịp chậm nguyên nhân (tạo nhịp)."]],
    litfl: ["Accelerated idioventricular rhythm", "Junctional rhythm", "AV dissociation", "Escape rhythms"] });
})(typeof window !== "undefined" ? window : globalThis);

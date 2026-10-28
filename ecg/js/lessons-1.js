/* Bài học Phần I–III. Cú pháp nội dung: ## tiêu đề, - gạch đầu dòng, | bảng |, > ! cảnh báo, > * mẹo, > ghi chú,
   [[ecg:id]] chèn ECG mô phỏng, **đậm**. Thẻ ôn: [câu hỏi, đáp án]. litfl: từ khoá tra trên LITFL. */
(function (root) {
  "use strict";
  const B = (root.LESSONS = root.LESSONS || []);
  const add = (o) => B.push(o);

  /* ================= PHẦN I. NỀN TẢNG ================= */
  add({ id: "ECG-01", part: 1, prio: "A", title: "Giải phẫu hệ thống dẫn truyền và tưới máu cơ tim liên quan đến ECG",
    tom: "Đường đi của xung động và động mạch nuôi từng vùng — nền cho định khu nhồi máu và block.",
    md: `
## Hệ thống dẫn truyền
- **Nút xoang** (đỉnh nhĩ phải, gần chỗ đổ tĩnh mạch chủ trên): chủ nhịp, 60–100 lần/phút.
- **Nút nhĩ thất (AV)**: làm chậm dẫn truyền (tạo phần lớn khoảng PR), lọc bớt xung khi nhĩ quá nhanh (rung/cuồng nhĩ).
- **Bó His** → **nhánh phải** và **nhánh trái**; nhánh trái chia **phân nhánh trái trước** (mảnh, dễ block) và **phân nhánh trái sau** (dày, khó block).
- **Mạng Purkinje**: dẫn nhanh → QRS hẹp khi thất được khử cực qua đường dẫn truyền bình thường.

| Ổ tạo nhịp | Tần số thoát | QRS |
|---|---|---|
| Nút xoang | 60–100/ph | hẹp |
| Bộ nối (AV/His) | 40–60/ph | hẹp |
| Thất (Purkinje/cơ thất) | 20–40/ph | rộng |

## Tưới máu
| Động mạch | Vùng nuôi | Liên quan ECG |
|---|---|---|
| LAD | Thành trước, vách liên thất 2/3 trước, mỏm; nhánh vách nuôi nhánh phải và phân nhánh trái trước | V1–V4 (± DI, aVL); tắc đoạn gần → RBBB/LAFB mới |
| LCx | Thành bên, thành sau (một phần) | DI, aVL, V5–V6; thành sau: ST chênh xuống V1–V3 |
| RCA | Thất phải, thành dưới, thành sau; **nút xoang (~60%)**, **nút AV (~80–90%, ưu thế phải)** | DII, DIII, aVF, V1/V4R; kèm nhịp chậm, block AV |

> * Nhồi máu thành dưới hay kèm block AV (thiếu máu nút AV, cường phế vị) — thường QRS hẹp, đáp ứng atropine, hồi phục. Nhồi máu thành trước kèm block AV thường là tổn thương hệ His–Purkinje rộng — QRS rộng, tiên lượng xấu.

## Đối chiếu nhanh
- Vách liên thất khử cực **từ trái sang phải** → sóng q nhỏ ở DI, aVL, V5–V6 (q vách) và r nhỏ ở V1.
- Mất q vách ở V5–V6 là một dấu hiệu của block nhánh trái.
`,
    cards: [["Nút AV được tưới máu chủ yếu bởi động mạch nào?", "Động mạch vành phải (khoảng 80–90% ở tuần hoàn ưu thế phải)."], ["Tần số thoát của bộ nối và của thất?", "Bộ nối 40–60/ph (QRS hẹp); thất 20–40/ph (QRS rộng)."], ["Vì sao block AV trong nhồi máu thành dưới thường lành tính hơn nhồi máu thành trước?", "Thường tổn thương ở nút AV (thiếu máu/cường phế vị), QRS hẹp, đáp ứng atropine, hồi phục; ở thành trước là tổn thương His–Purkinje rộng, thoát thất, nhiều cơ tim hoại tử."]],
    litfl: ["Cardiac conduction system", "Coronary artery anatomy"] });

  add({ id: "ECG-02", part: 1, prio: "A", title: "Điện sinh lý tế bào cơ tim: kênh ion và điện thế hoạt động",
    tom: "Các pha điện thế hoạt động và ý nghĩa với thuốc, điện giải, rối loạn nhịp.",
    md: `
## Điện thế hoạt động tế bào cơ thất (đáp ứng nhanh)
| Pha | Dòng ion chính | Trên ECG |
|---|---|---|
| 0 – khử cực nhanh | Na⁺ vào (I_Na) | QRS |
| 1 – tái cực sớm | K⁺ ra (I_to) | điểm J; I_to ưu thế thượng tâm mạc → sóng J/Osborn, Brugada |
| 2 – bình nguyên | Ca²⁺ vào (I_CaL) cân bằng K⁺ ra | đoạn ST |
| 3 – tái cực | K⁺ ra (I_Kr, I_Ks) | sóng T |
| 4 – nghỉ | I_K1 giữ điện thế nghỉ ~ −90 mV | đoạn TP |

## Tế bào nút (đáp ứng chậm)
- Pha 0 do **Ca²⁺** (không phải Na⁺) → dẫn chậm; pha 4 có dòng **I_f** (khử cực tâm trương tự động) → tính tự động.
- Giao cảm tăng I_f và I_CaL → tim nhanh; phế vị (acetylcholine) mở I_KACh → tim chậm.

## Ứng dụng cấp cứu
- **Chẹn kênh Na⁺** (TCA, flecainide, cocaine, …) làm chậm pha 0 → **QRS rộng**, R tận cùng aVR.
- **Chẹn I_Kr** (nhiều thuốc kéo dài QT) → kéo dài pha 3 → **QT dài**, hậu khử cực sớm → **xoắn đỉnh**.
- **Kali**: tăng K⁺ ngoại bào → giảm điện thế nghỉ, tăng I_Kr → T nhọn, sau đó bất hoạt kênh Na⁺ → QRS rộng, mất P. Hạ K⁺ → giảm I_Kr → T dẹt, U nổi, QU dài.
- **Calci**: Ca²⁺ ảnh hưởng thời gian pha 2 → hạ Ca kéo dài ST (QT dài), tăng Ca rút ngắn ST.
- **Digoxin** ức chế Na⁺/K⁺-ATPase → tăng Ca²⁺ nội bào → hậu khử cực muộn (nhịp nhanh nhĩ, VT hai hướng) + cường phế vị (chậm nút AV).
`,
    cards: [["Pha 0 của tế bào cơ thất và tế bào nút khác nhau thế nào?", "Cơ thất: dòng Na⁺ nhanh; tế bào nút: dòng Ca²⁺ chậm."], ["Chẹn kênh Na⁺ biểu hiện trên ECG thế nào?", "QRS giãn rộng, R tận cùng ở aVR, S tận cùng ở DI/aVL; nặng → nhịp nhanh QRS rộng."], ["Cơ chế xoắn đỉnh do thuốc?", "Chẹn I_Kr kéo dài pha 3 (QT dài) → hậu khử cực sớm → nhát bóp khởi phát xoắn đỉnh."]],
    litfl: ["Cardiac action potential", "Sodium channel blocker toxicity"] });

  add({ id: "ECG-03", part: 1, prio: "A", title: "Từ vector đến sóng: nguyên lý hình thành ECG và hệ thống chuyển đạo",
    tom: "Hướng vector so với chuyển đạo quyết định sóng dương hay âm; hệ 6 trục và chuyển đạo trước tim.",
    md: `
## Nguyên tắc
- Xung khử cực đi **về phía** điện cực dương → sóng **dương**; đi **ra xa** → sóng **âm**; **vuông góc** → sóng hai pha/đẳng điện.
- Tái cực bình thường của thất đi từ thượng tâm mạc vào nội tâm mạc → T thường **cùng chiều** QRS.

## Chuyển đạo chi (mặt phẳng trán) – hệ 6 trục
| Chuyển đạo | Góc | “Nhìn” vùng |
|---|---|---|
| DI | 0° | bên cao |
| DII | +60° | dưới |
| DIII | +120° | dưới |
| aVF | +90° | dưới |
| aVL | −30° | bên cao |
| aVR | −150° | buồng tim từ phía phải trên (thân chung, đáy vách) |

- **Định luật Einthoven**: DII = DI + DIII. Kiểm tra nhanh khi nghi mắc nhầm điện cực.

## Chuyển đạo trước tim (mặt phẳng ngang)
| Chuyển đạo | Vị trí | Vùng |
|---|---|---|
| V1 | KLS 4 bờ phải xương ức | vách, thất phải |
| V2 | KLS 4 bờ trái xương ức | vách–trước |
| V3 | giữa V2 và V4 | trước |
| V4 | KLS 5 đường giữa đòn | mỏm |
| V5 | đường nách trước, ngang V4 | bên |
| V6 | đường nách giữa, ngang V4 | bên |
| V7–V9 | nách sau, góc xương bả vai, cạnh sống – ngang V6 | thành sau |
| V3R–V4R | đối xứng V3–V4 bên phải | thất phải |

## Các nhóm chuyển đạo “liên tiếp”
- Dưới: DII, DIII, aVF · Bên: DI, aVL, V5, V6 · Vách: V1–V2 · Trước: V3–V4.
- **Thứ tự Cabrera** (aVL, DI, −aVR, DII, aVF, DIII) giúp nhìn liên tục mặt phẳng trán.
`,
    cards: [["Chuyển đạo nào khảo sát thành sau thất trái?", "V7–V9 (ngang V6 ở nách sau, góc dưới xương bả vai, cạnh cột sống); trên ECG thường quy là hình soi gương ở V1–V3."], ["Định luật Einthoven?", "DII = DI + DIII (biên độ đồng thời)."], ["Ghi V4R ở đâu?", "Khoang liên sườn 5, đường giữa đòn bên phải."]],
    litfl: ["ECG lead positioning", "Cabrera"] });

  add({ id: "ECG-04", part: 1, prio: "B", title: "Kỹ thuật ghi, nhiễu và lỗi mắc điện cực",
    tom: "Nhận ra nhiễu và mắc nhầm điện cực trước khi chẩn đoán bệnh.",
    md: `
## Chuẩn ghi
- Tốc độ giấy **25 mm/s**: 1 ô nhỏ = 40 ms, 1 ô lớn = 200 ms. Biên độ **10 mm/mV**: 1 ô nhỏ = 0,1 mV.
- Luôn kiểm tra **xung chuẩn** (calibration) ở đầu dòng: nửa biên độ (5 mm/mV) làm “mất” điện thế, gấp đôi gây “phì đại giả”.

## Nhiễu thường gặp
- **Run cơ, rét run, Parkinson**: dao động tần số cao → có thể giống rung nhĩ hoặc rung thất. QRS “thật” vẫn đi xuyên qua nhiễu với nhịp đều.
- **Dao động đường nền** (thở, cử động, gel khô).
- **Nhiễu điện 50 Hz**: dao động đều, mịn.

[[ecg:artifact]]

## Mắc nhầm điện cực
| Kiểu | Dấu hiệu |
|---|---|
| **Tay trái ↔ tay phải** (hay gặp nhất) | DI đảo ngược toàn bộ (P, QRS, T âm), aVR dương, aVL ↔ aVR; trước tim bình thường |
| Tay phải ↔ chân trái | DI, DII, DIII đều đảo; aVF dương ngược thường |
| Có điện cực chân phải bị mắc sang tay | Một chuyển đạo chi gần như **phẳng** |
| Đặt V1–V2 quá cao (KLS 2–3) | r’ giả ở V1, T âm, P âm ở V1 |

> ! Đảo ngược DI + aVR dương: nếu R **giảm dần** từ V1 → V6 là **đảo ngược phủ tạng** (dextrocardia); nếu chuyển đạo trước tim bình thường là **mắc nhầm điện cực**.

[[ecg:lead_rev]]
`,
    cards: [["1 ô nhỏ trên giấy ECG chuẩn bằng bao nhiêu?", "40 ms và 0,1 mV (25 mm/s; 10 mm/mV)."], ["Dấu hiệu mắc nhầm điện cực tay trái–tay phải?", "DI âm toàn bộ (P, QRS, T), aVR dương, chuyển đạo trước tim bình thường."], ["Phân biệt mắc nhầm tay với đảo ngược phủ tạng?", "Đảo ngược phủ tạng: R giảm dần từ V1→V6 (mất tiến triển R); mắc nhầm tay: chuyển đạo trước tim bình thường."]],
    litfl: ["Limb lead reversal", "ECG artefacts"] });

  add({ id: "ECG-05", part: 1, prio: "A", title: "ECG bình thường: sóng, khoảng, trục điện tim",
    tom: "Giá trị bình thường cần thuộc lòng và cách xác định trục nhanh.",
    md: `
[[ecg:normal]]

## Giá trị bình thường ở người lớn
| Thành phần | Bình thường | Bất thường thường gặp |
|---|---|---|
| Tần số | 60–100/ph | < 60 chậm; > 100 nhanh |
| Sóng P | < 120 ms, < 2,5 mm (DII); dương DI, DII, âm aVR | P rộng (lớn nhĩ trái), P cao (lớn nhĩ phải) |
| PR | 120–200 ms | < 120: tiền kích thích/nhịp bộ nối; > 200: block AV độ I |
| QRS | < 120 ms (thường ≤ 100 ms) | ≥ 120: block nhánh, nhịp thất, tăng K⁺, chẹn Na⁺, tiền kích thích, máy tạo nhịp |
| QTc | nam < 440–450 ms, nữ < 460 ms | > 500 ms: nguy cơ xoắn đỉnh cao; < 350–360 ms: QT ngắn |
| Trục | −30° đến +90° | < −30°: lệch trái; > +90°: lệch phải |
| Chuyển tiếp R/S | V3–V4 | sớm (V1–V2), muộn (V5–V6) |

## Tính tần số
- Nhịp đều: **300 / số ô lớn** giữa hai R (hoặc 1500 / số ô nhỏ).
- Nhịp không đều: đếm số QRS trên dải 10 giây × 6.

## Xác định trục nhanh (phương pháp hai chuyển đạo DI – aVF)
| DI | aVF | Trục |
|---|---|---|
| + | + | Bình thường (0° đến +90°) |
| + | − | Lệch trái **hoặc** bình thường (0° đến −90°) → xem DII: DII dương = bình thường (> −30°), DII âm = lệch trái |
| − | + | Lệch phải (+90° đến +180°) |
| − | − | Vô định / “tây bắc” (−90° đến ±180°) |

> * Tìm chuyển đạo chi có QRS **đẳng điện** (dương = âm): trục vuông góc với chuyển đạo đó. Dùng **Công cụ → Tính trục** để luyện.

## Nguyên nhân trục lệch
- **Lệch trái**: block phân nhánh trái trước, phì đại thất trái, nhồi máu thành dưới, tạo nhịp thất phải, WPW, tăng K⁺.
- **Lệch phải**: phì đại thất phải, thuyên tắc phổi, COPD, block phân nhánh trái sau, nhồi máu thành bên, mắc nhầm điện cực, đảo ngược phủ tạng, chẹn kênh Na⁺, người gầy cao, trẻ em.
- **Tây bắc**: nhịp nhanh thất, tăng K⁺ nặng, máy tạo nhịp, mắc nhầm điện cực.
`,
    cards: [["Khoảng PR bình thường?", "120–200 ms (3–5 ô nhỏ)."], ["Cách tính tần số khi nhịp không đều?", "Đếm số QRS trên 10 giây × 6."], ["DI dương, aVF âm, DII âm: trục?", "Lệch trái (< −30°)."], ["Kể 4 nguyên nhân trục lệch phải.", "Phì đại thất phải, thuyên tắc phổi/tâm phế, block phân nhánh trái sau, nhồi máu thành bên; (còn: mắc nhầm điện cực, dextrocardia, chẹn Na⁺, trẻ em)."]],
    litfl: ["ECG axis interpretation", "ECG rate interpretation", "PR interval", "QT interval"] });

  add({ id: "ECG-06", part: 1, prio: "A", title: "Phương pháp đọc ECG có hệ thống",
    tom: "Trình tự 9 bước để không bỏ sót — và ‘quét nhanh 30 giây’ ở phòng cấp cứu.",
    md: `
## Quét nhanh 30 giây (bệnh nhân nặng)
1. **Có cần sốc điện / tạo nhịp ngay không?** (VF, VT vô mạch, nhịp nhanh/chậm không ổn định)
2. **Có OMI/STEMI hay tương đương STEMI?** (ST chênh lên, de Winter, thành sau, LBBB + Sgarbossa, aVR + ST chênh xuống lan toả)
3. **Có tăng kali / ngộ độc đe doạ tính mạng?** (T nhọn, QRS rộng, mất P; QRS rộng + R aVR)

## Đọc đầy đủ — 9 bước
1. **Thông tin & kỹ thuật**: tên, giờ ghi, xung chuẩn, tốc độ giấy, nhiễu, mắc điện cực.
2. **Tần số**.
3. **Nhịp**: đều/không đều; có P? P–QRS liên hệ 1:1? QRS hẹp/rộng?
4. **Trục**.
5. **Sóng P** (lớn nhĩ) và **PR** (block AV, tiền kích thích, PR chênh).
6. **QRS**: thời gian, biên độ (phì đại, điện thế thấp), hình dạng (block nhánh, sóng Q, delta, epsilon, R tận cùng aVR).
7. **ST**: chênh lên/xuống, hình dạng, phân bố theo vùng, soi gương.
8. **T** (và U): nhọn, đảo, hai pha, tối cấp; sóng U.
9. **QT/QTc**.

**Kết luận** = nhịp + tần số + trục + các bất thường → **đối chiếu lâm sàng** và **ECG cũ**, ghi lại nếu cần (mỗi 15–30 phút khi đau ngực tiếp diễn).

> ! Không đọc kết luận tự động của máy trước khi tự đọc. Máy hay bỏ sót OMI không ST chênh điển hình và đọc sai nhịp có nhiễu.

> * Trong ứng dụng: mở **Atlas** hoặc **Ca lâm sàng**, bật **Thước đo** để đo PR, QRS, QT trực tiếp trên giấy.
`,
    cards: [["3 câu hỏi quét nhanh 30 giây?", "Cần sốc điện/tạo nhịp ngay? Có OMI/STEMI hoặc tương đương? Có tăng K⁺/ngộ độc đe doạ tính mạng?"], ["9 bước đọc ECG?", "Kỹ thuật – tần số – nhịp – trục – P/PR – QRS – ST – T/U – QT."]],
    litfl: ["ECG interpretation", "ECG library basics"] });

  add({ id: "ECG-07", part: 1, prio: "B", title: "Biến thể bình thường: vận động viên, tái cực sớm, trẻ em",
    tom: "Biết cái ‘bình thường mà trông bất thường’ để không chẩn đoán quá mức — và không bỏ sót.",
    md: `
## Tái cực sớm lành tính (BER)
- ST chênh lên **lõm**, lan toả, chủ yếu V2–V5; thường < 2 mm (hiếm khi > 5 mm ở chuyển đạo trước tim).
- **Khía/móc ở điểm J** (fish-hook) rõ nhất V4.
- T **cao, rộng, không đối xứng**, cùng hướng QRS.
- **Không** có ST chênh xuống soi gương (trừ aVR), **không** thay đổi theo thời gian.
- Người trẻ, nam, vận động viên, người da đen.

[[ecg:ber]]

> ! BER là chẩn đoán loại trừ. Phân biệt với tắc LAD: QTc dài, R V4 thấp, ST V3 chênh nhiều, T ‘phồng’ tối cấp → nghĩ OMI. Dùng **Công cụ → Công thức 4 biến (Smith)**.

## Tim vận động viên (không cần làm thêm nếu không triệu chứng)
- Nhịp chậm xoang, loạn nhịp xoang, block AV độ I, Wenckebach khi ngủ, nhịp bộ nối.
- Tăng điện thế QRS đơn độc (đạt tiêu chuẩn phì đại thất trái), block nhánh phải không hoàn toàn, tái cực sớm.
- **Bất thường cần đánh giá** (theo tiêu chuẩn quốc tế cho vận động viên): T âm ngoài V1–V2 (trừ vận động viên da đen V1–V4 sau ST chênh lõm), ST chênh xuống, Q bệnh lý, LBBB, QRS ≥ 140 ms, tiền kích thích, QT dài, Brugada typ 1, nhịp chậm < 30/ph, block AV độ II Mobitz II/độ III, ngoại tâm thu thất ≥ 2.

## Trẻ em (xem thêm ECG-45)
- Tần số cao hơn, trục lệch phải, R ưu thế ở V1 (sơ sinh), **T âm V1–V3 là bình thường** từ sau tuần đầu đến tuổi thiếu niên.
`,
    cards: [["Đặc điểm tái cực sớm lành tính?", "ST chênh lõm lan toả V2–V5, khía điểm J, T cao không đối xứng, không soi gương, không thay đổi theo thời gian."], ["T âm ở V1–V3 ở trẻ 6 tuổi có bình thường không?", "Có — kiểu T thiếu niên (juvenile T) bình thường từ sau tuần đầu đến tuổi thiếu niên."]],
    litfl: ["Benign early repolarisation", "Athlete ECG", "Persistent juvenile T wave pattern"] });

  /* ================= PHẦN II. LỚN NHĨ – PHÌ ĐẠI THẤT ================= */
  add({ id: "ECG-08", part: 2, prio: "B", title: "Lớn nhĩ trái, lớn nhĩ phải",
    tom: "P rộng hai đỉnh (trái) và P cao nhọn (phải).",
    md: `
| | Lớn nhĩ phải (P pulmonale) | Lớn nhĩ trái (P mitrale) |
|---|---|---|
| DII | P cao **> 2,5 mm** | P rộng **≥ 120 ms**, hai đỉnh cách nhau > 40 ms |
| V1 | P dương cao > 1,5 mm | **Pha âm cuối** sâu ≥ 1 mm, rộng ≥ 40 ms (≥ 1 ô nhỏ × 1 ô nhỏ) |
| Nguyên nhân | Tăng áp phổi, COPD, tâm phế, hẹp van ba lá, bệnh tim bẩm sinh | Hẹp/hở van hai lá, tăng huyết áp, phì đại thất trái, suy tim |

[[ecg:lae]]
[[ecg:rae]]

> * Lớn nhĩ trái là yếu tố thuận lợi rung nhĩ; lớn nhĩ phải ở bệnh nhân khó thở gợi ý bệnh phổi mạn hoặc tăng áp phổi.
`,
    cards: [["Tiêu chuẩn lớn nhĩ phải ở DII?", "P cao > 2,5 mm."], ["Dấu lớn nhĩ trái ở V1?", "Pha âm cuối của P sâu ≥ 1 mm và rộng ≥ 40 ms."]],
    litfl: ["Left atrial enlargement", "Right atrial enlargement", "P wave"] });

  add({ id: "ECG-09", part: 2, prio: "B", title: "Phì đại thất trái và rối loạn tái cực thứ phát",
    tom: "Tiêu chuẩn điện thế, kiểu ‘strain’, và vì sao LVH là kẻ giả mạo STEMI.",
    md: `
[[ecg:lvh]]

## Tiêu chuẩn điện thế (cần thêm dấu hỗ trợ; độ nhạy thấp, đặc hiệu cao hơn)
| Tiêu chuẩn | Ngưỡng |
|---|---|
| **Sokolow–Lyon** | S V1 + R V5 hoặc V6 **≥ 35 mm**; hoặc R aVL **≥ 11 mm** |
| **Cornell** | R aVL + S V3 **> 28 mm (nam)**, **> 20 mm (nữ)** |
| Chi | R DI + S DIII > 25 mm |

## Dấu hỗ trợ
- **Strain**: ST chênh xuống dốc xuống, T âm **không đối xứng** ở DI, aVL, V5–V6.
- Lớn nhĩ trái, trục lệch trái, thời gian đạt đỉnh R ở V5–V6 > 50 ms, QRS hơi rộng.

> ! LVH gây **ST chênh lên ‘bất hoà’ ở V1–V3** (sau S sâu) — dễ bị gọi nhầm STEMI trước. Gợi ý OMI khi ST chênh lên vượt tỷ lệ ~25% biên độ S đứng trước, T phồng to, hoặc ST thay đổi theo thời gian.

> * T âm ở V5–V6 kiểu strain thường **không đối xứng** (xuống chậm – lên nhanh); T âm **đối xứng, sâu** gợi ý thiếu máu.

## Lưu ý
- Người trẻ, gầy, vận động viên: điện thế cao không có nghĩa là phì đại.
- Phì đại vùng mỏm (apical HCM): T âm khổng lồ V2–V5 (xem ECG-42).
`,
    cards: [["Tiêu chuẩn Sokolow–Lyon?", "S V1 + R V5/V6 ≥ 35 mm, hoặc R aVL ≥ 11 mm."], ["Tiêu chuẩn Cornell?", "R aVL + S V3 > 28 mm (nam), > 20 mm (nữ)."], ["LVH có thể giả STEMI ở đâu?", "ST chênh lên bất hoà ở V1–V3 sau S sâu."]],
    litfl: ["Left ventricular hypertrophy", "LVH strain"] });

  add({ id: "ECG-10", part: 2, prio: "B", title: "Phì đại thất phải, tăng áp động mạch phổi, tâm phế cấp",
    tom: "R ưu thế V1, trục phải, strain thất phải — và nhận ra tâm phế cấp do thuyên tắc phổi.",
    md: `
[[ecg:rvh]]

## Phì đại thất phải (mạn)
- **Trục lệch phải** (≥ +110° ở người lớn).
- **R ưu thế ở V1** (R/S > 1, R ≥ 7 mm) hoặc qR ở V1; S sâu V5–V6 (R/S < 1).
- Strain thất phải: ST chênh xuống, T âm V1–V3 (± DII, DIII, aVF).
- Lớn nhĩ phải. Có thể block nhánh phải.

## Chẩn đoán phân biệt R cao ở V1
- Phì đại thất phải · **Nhồi máu thành sau** · Block nhánh phải · WPW (đường phụ bên trái) · Bệnh cơ tim phì đại · Đặt điện cực sai · Dextrocardia · Trẻ em (bình thường) · Loạn dưỡng cơ Duchenne.

> ! R cao ở V1 + ST chênh xuống V1–V3 + đau ngực = **nhồi máu thành sau** cho đến khi chứng minh khác — ghi V7–V9.

## Tâm phế cấp (thuyên tắc phổi lớn)
- Nhịp nhanh xoang, **T âm V1–V4** và DIII, S1Q3T3, RBBB mới, trục phải, P phế. Xem ECG-39.
`,
    cards: [["Kể 5 nguyên nhân R cao ưu thế ở V1.", "Phì đại thất phải, nhồi máu thành sau, block nhánh phải, WPW (đường phụ trái), HCM; (khác: trẻ em, dextrocardia, đặt điện cực sai, Duchenne)."]],
    litfl: ["Right ventricular hypertrophy", "Dominant R wave in V1", "Right ventricular strain"] });

  /* ================= PHẦN III. RỐI LOẠN DẪN TRUYỀN ================= */
  add({ id: "ECG-11", part: 3, prio: "B", title: "Rối loạn chức năng nút xoang và block xoang nhĩ",
    tom: "Nhịp chậm xoang, ngưng xoang, block xoang nhĩ, hội chứng nhịp nhanh – nhịp chậm.",
    md: `
## Các dạng
- **Nhịp chậm xoang** không tương xứng.
- **Ngưng xoang (sinus arrest/pause)**: mất P đột ngột, khoảng ngưng **không** là bội số PP.
- **Block xoang nhĩ**: khoảng ngưng **bằng bội số** của PP (typ II); typ I: PP ngắn dần rồi mất P.
- **Hội chứng nhịp nhanh – nhịp chậm**: cơn rung/cuồng nhĩ xen kẽ nhịp chậm, ngưng dài sau khi cơn nhanh kết thúc.
- Mất khả năng tăng tần số khi gắng sức (chronotropic incompetence).

[[ecg:pause]]

## Nguyên nhân cần loại trừ ở cấp cứu (“nhịp chậm có thể đảo ngược”)
- Thuốc (chẹn bêta, chẹn canxi non-DHP, digoxin, amiodarone, ivabradine, clonidine), **tăng kali**, hạ thân nhiệt, suy giáp, thiếu máu cơ tim (thành dưới), tăng áp lực nội sọ, cường phế vị, ngưng thở khi ngủ.

> * Ngưng > 3 giây khi thức hoặc ngất kèm ngưng xoang → chỉ định máy tạo nhịp (sau khi loại trừ nguyên nhân hồi phục).
`,
    cards: [["Phân biệt ngưng xoang và block xoang nhĩ typ II?", "Block xoang nhĩ: khoảng ngưng là bội số PP; ngưng xoang: không là bội số."], ["Hội chứng nhịp nhanh – nhịp chậm là gì?", "Rối loạn nút xoang với cơn nhịp nhanh nhĩ (thường rung nhĩ) xen nhịp chậm/ngưng xoang dài khi cơn nhanh kết thúc."]],
    litfl: ["Sick sinus syndrome", "Sinoatrial exit block", "Bradyarrhythmias"] });

  add({ id: "ECG-12", part: 3, prio: "A", title: "Block nhĩ thất các độ",
    tom: "Độ I, Mobitz I, Mobitz II, 2:1, cao độ, hoàn toàn — vị trí block và quyết định tạo nhịp.",
    md: `
| Loại | ECG | Vị trí thường gặp | Nguy cơ |
|---|---|---|---|
| Độ I | PR > 200 ms cố định, mọi P đều dẫn | Nút AV | Thấp |
| Độ II Mobitz I (Wenckebach) | PR dài dần → một P không dẫn; RR ngắn dần; nhịp theo nhóm | Nút AV | Thường lành tính |
| Độ II Mobitz II | PR **cố định** rồi đột ngột P không dẫn; QRS thường rộng | Dưới His | **Cao** – có thể ngừng tim |
| 2:1 | Cứ 2 P có 1 QRS | Không xác định từ ECG | Xem QRS rộng/hẹp, đáp ứng atropine |
| Cao độ | ≥ 2 P liên tiếp không dẫn (3:1, 4:1…) | Thường dưới His | Cao |
| Độ III (hoàn toàn) | P và QRS độc lập (phân ly nhĩ thất), tần số nhĩ > thất | Nút hoặc dưới His | Cao |

[[ecg:avb1]]
[[ecg:wenck]]
[[ecg:mobitz2]]
[[ecg:avb21]]
[[ecg:chb]]
[[ecg:chb_wide]]

## Xử trí theo ECG + huyết động
- Có **dấu hiệu nguy hiểm** (tụt huyết áp, sốc, ngất, thiếu máu cơ tim, suy tim): **atropine** TM — 1 mg mỗi 3–5 phút (AHA) hoặc 0,5 mg (ERC 2021), tổng tối đa 3 mg → nếu không đáp ứng: **adrenaline** 2–10 µg/phút hoặc **isoprenaline**/dopamine, **tạo nhịp qua da** → tạo nhịp tĩnh mạch.
- Atropine thường **kém hiệu quả** với block dưới His (Mobitz II, độ III QRS rộng) và ở tim ghép.
- Luôn tìm nguyên nhân hồi phục: **tăng K⁺**, thuốc (chẹn bêta, chẹn canxi, digoxin), nhồi máu thành dưới, viêm cơ tim, bệnh Lyme.

> ! Block 2:1 với QRS rộng ở bệnh nhân ngất: coi như block dưới His — theo dõi monitor, chuẩn bị tạo nhịp.

> * Phân biệt block AV độ III với phân ly nhĩ thất do tăng tần số thoát: trong block độ III, **tần số nhĩ > tần số thất** và P rơi vào thời điểm lẽ ra phải dẫn nhưng không dẫn.
`,
    cards: [["Phân biệt Mobitz I và Mobitz II?", "Mobitz I: PR dài dần rồi rơi nhịp, thường ở nút AV, lành tính. Mobitz II: PR cố định rồi rơi nhịp đột ngột, dưới His, QRS thường rộng, nguy cơ block hoàn toàn."], ["Block AV độ III trên ECG?", "Phân ly nhĩ thất hoàn toàn: P đều, QRS đều, không liên hệ, tần số nhĩ > thất."], ["Atropine kém hiệu quả trong trường hợp nào?", "Block dưới His (Mobitz II, độ III QRS rộng), tim ghép."], ["Liều atropine trong nhịp chậm có triệu chứng?", "AHA: 1 mg TM mỗi 3–5 phút; ERC 2021: 0,5 mg TM nhắc lại; tổng tối đa 3 mg."]],
    litfl: ["AV block 1st degree", "Mobitz I Wenckebach", "Mobitz II", "Complete heart block", "High grade AV block"] });

  add({ id: "ECG-13", part: 3, prio: "A", title: "Block nhánh phải, block nhánh trái",
    tom: "Tiêu chuẩn chẩn đoán, biến đổi ST–T thứ phát, và ý nghĩa khi block nhánh mới xuất hiện.",
    md: `
## Block nhánh phải (RBBB)
- QRS **≥ 120 ms** (không hoàn toàn: 110–120 ms).
- **rSR’** (“tai thỏ”) ở V1–V3; **S rộng, trát đậm** ở DI, aVL, V5–V6.
- T âm, ST chênh xuống nhẹ ở V1–V3 là **thứ phát** (bình thường trong RBBB).
- Nguyên nhân: có thể bình thường; thuyên tắc phổi, nhồi máu thành trước (LAD đoạn gần), bệnh tim bẩm sinh (thông liên nhĩ), Brugada, tăng K⁺, chẹn Na⁺.

[[ecg:rbbb]]

## Block nhánh trái (LBBB)
- QRS **≥ 120 ms**; S sâu ưu thế ở V1 (QS hoặc rS).
- R **rộng, đơn pha hoặc khía (chữ M)** ở DI, aVL, V5–V6; **mất q vách** ở DI, V5–V6.
- Thời gian đạt đỉnh R ở V5–V6 > 60 ms.
- **ST–T bất hoà** (ngược hướng phần lớn QRS) là bình thường: ST chênh lên V1–V3, ST chênh xuống + T âm DI, aVL, V5–V6.
- Gần như luôn có bệnh tim nền: tăng huyết áp, bệnh tim thiếu máu, bệnh cơ tim, bệnh van động mạch chủ, thoái hoá hệ dẫn truyền.

[[ecg:lbbb]]

> ! Trong LBBB **không dùng tiêu chuẩn ST chênh lên thông thường**. Dùng **Sgarbossa cải tiến (Smith)** — xem ECG-19. Hướng dẫn hiện nay không còn coi “LBBB mới/được cho là mới” đơn thuần tương đương STEMI; quyết định dựa vào Sgarbossa và tình trạng lâm sàng (sốc, đau ngực kéo dài).

> * Mẹo nhớ “WiLLiaM MaRRoW”: LBBB – W ở V1, M ở V6; RBBB – M ở V1, W ở V6.
`,
    cards: [["Tiêu chuẩn RBBB?", "QRS ≥ 120 ms, rSR’ ở V1–V3, S rộng trát ở DI, aVL, V5–V6."], ["Tiêu chuẩn LBBB?", "QRS ≥ 120 ms, S sâu ưu thế V1, R rộng khía DI/aVL/V5–V6, mất q vách, đạt đỉnh R V5–V6 > 60 ms."], ["ST–T trong LBBB bình thường thế nào?", "Bất hoà: ngược hướng phần chính QRS (ST chênh lên V1–V3; ST chênh xuống, T âm ở DI, aVL, V5–V6)."]],
    litfl: ["Right bundle branch block", "Left bundle branch block", "Incomplete RBBB"] });

  add({ id: "ECG-14", part: 3, prio: "B", title: "Block phân nhánh, block hai và ba phân nhánh",
    tom: "LAFB, LPFB, block hai phân nhánh và ý nghĩa ở bệnh nhân ngất.",
    md: `
| | Block phân nhánh trái trước (LAFB) | Block phân nhánh trái sau (LPFB) |
|---|---|---|
| Trục | **Lệch trái −45° đến −90°** | **Lệch phải +90° đến +180°** |
| Chi | **qR** ở DI, aVL; **rS** ở DII, DIII, aVF | **rS** ở DI, aVL; **qR** ở DII, DIII, aVF |
| QRS | < 120 ms | < 120 ms |
| Ghi chú | Hay gặp; thời gian đạt đỉnh R aVL ≥ 45 ms | Hiếm; chẩn đoán loại trừ (RVH, tâm phế, nhồi máu bên, người gầy) |

[[ecg:lafb]]
[[ecg:lpfb]]

## Block hai phân nhánh
- **RBBB + LAFB** (hay gặp nhất) hoặc RBBB + LPFB.
- “Block ba phân nhánh” (thuật ngữ cũ): block hai phân nhánh + block AV độ I — **PR dài không chứng minh** block ở phân nhánh thứ ba (thường ở nút AV).

[[ecg:bifasc]]

> ! Ngất + block hai phân nhánh: nghĩ tới **block AV cao độ từng cơn** — nhập viện theo dõi monitor, đánh giá chỉ định máy tạo nhịp.

> * RBBB + LAFB **mới** trong nhồi máu thành trước gợi ý tắc **LAD đoạn gần** (nhánh vách), nguy cơ block hoàn toàn.
`,
    cards: [["Tiêu chuẩn LAFB?", "Trục −45° đến −90°, qR ở DI/aVL, rS ở DII/DIII/aVF, QRS < 120 ms."], ["Block hai phân nhánh hay gặp nhất?", "RBBB + LAFB."], ["Ngất kèm block hai phân nhánh: nghĩ đến gì?", "Block AV cao độ từng cơn → theo dõi monitor, đánh giá máy tạo nhịp."]],
    litfl: ["Left anterior fascicular block", "Left posterior fascicular block", "Bifascicular block", "Trifascicular block"] });

  add({ id: "ECG-15", part: 3, prio: "A", title: "Hội chứng tiền kích thích (Wolff–Parkinson–White)",
    tom: "PR ngắn, sóng delta — và nguy cơ rung nhĩ tiền kích thích.",
    md: `
[[ecg:wpw]]

## Kiểu WPW (lúc nhịp xoang)
- **PR < 120 ms**.
- **Sóng delta**: nét lên trát đậm đầu QRS.
- **QRS rộng > 110–120 ms**, ST–T biến đổi thứ phát (ngược hướng delta).
- Delta âm có thể tạo **sóng Q giả** (giả nhồi máu thành dưới hoặc bên).
- **Typ A**: delta/QRS dương ở V1 (đường phụ bên trái) — R cao V1 giống RBBB/thành sau. **Typ B**: delta/QRS âm ở V1 (đường phụ bên phải).

## Hội chứng WPW = kiểu WPW + nhịp nhanh
| Rối loạn nhịp | ECG | Ghi chú |
|---|---|---|
| **AVRT chiều xuôi** (orthodromic, ~95%) | QRS hẹp, đều, 150–250/ph, P ngược dòng RP > 70 ms | Xuống nút AV, ngược lên đường phụ; xử trí như SVT |
| AVRT chiều ngược (antidromic) | QRS rộng, đều – giống VT | Xử trí như VT |
| **Rung nhĩ tiền kích thích** | **Rất nhanh (> 250/ph), không đều, QRS rộng thay đổi hình dạng** | Có thể thoái hoá thành rung thất |

[[ecg:wpw_af]]

> ! **Rung nhĩ + WPW: KHÔNG dùng** adenosine, chẹn bêta, chẹn canxi, digoxin (và tránh amiodarone TM) — ức chế nút AV làm xung đi ưu tiên qua đường phụ → rung thất. **Không ổn định → sốc điện đồng bộ. Ổn định → procainamide** (hoặc ibutilide) / sốc điện chủ động.

## Biến thể khác
- **PR ngắn không delta** (kiểu LGL — thuật ngữ cũ), đường phụ ẩn (chỉ dẫn ngược, ECG lúc nghỉ bình thường).
`,
    cards: [["Bộ ba ECG của kiểu WPW?", "PR < 120 ms, sóng delta, QRS rộng (kèm ST–T thứ phát)."], ["Rung nhĩ tiền kích thích trông thế nào?", "Rất nhanh, không đều, QRS rộng hình dạng thay đổi từng nhịp."], ["Thuốc cấm trong rung nhĩ tiền kích thích?", "Thuốc ức chế nút AV: adenosine, chẹn bêta, chẹn canxi non-DHP, digoxin; tránh amiodarone TM. Dùng sốc điện hoặc procainamide."]],
    litfl: ["Wolff-Parkinson-White syndrome", "Pre-excited atrial fibrillation", "AVRT"] });
})(typeof window !== "undefined" ? window : globalThis);

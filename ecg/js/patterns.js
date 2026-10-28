/* Thư viện mẫu ECG mô phỏng. Mỗi mẫu: tên, nhóm, bài liên quan, các dấu hiệu chính, cấu hình bộ mô phỏng.
   cfg(seed) trả về cấu hình cho ECG.generate. Biên độ tính bằng mV (1 mV = 10 mm). */
(function (root) {
  "use strict";
  const V13 = ["V1", "V2", "V3"], V46 = ["V4", "V5", "V6"], INF = ["II", "III", "aVF"], LAT = ["I", "aVL", "V5", "V6"];

  /* ---- Template dùng lại ---- */
  const RBBB = {
    qrs: 0.14, pos: { r: 0.3, rp: 0.8 }, sig: { r: 0.075, rp: 0.1 },
    frontal: { rp: [0.42, 165], s: [0.08, -140] },
    prec: {
      V1: { r: 0.3, s: -0.42, rp: 0.9, t: -0.28 }, V2: { r: 0.4, s: -0.85, rp: 0.75, t: -0.18 },
      V3: { r: 0.65, s: -0.7, rp: 0.3, t: 0.12 }, V4: { s: -0.25, rp: -0.25 },
      V5: { s: -0.05, rp: -0.42, w: { wrp: 1.6 } }, V6: { s: -0.05, rp: -0.38, w: { wrp: 1.6 } }
    },
    mods: [[["I", "aVL"], { wrp: 0.6 }]]
  };
  const LBBB = {
    qrs: 0.15, pos: { r: 0.38, rp: 0.7, s: 0.55 }, sig: { r: 0.13, rp: 0.13, s: 0.2 },
    frontal: { q: [0, 0], r: [0.85, 10], rp: [0.75, 10], s: [0.05, 160], t: [0.32, 165] },
    prec: {
      V1: { r: 0.05, s: -1.5, t: 0.45, st: 0.2 }, V2: { r: 0.08, s: -2.1, t: 0.6, st: 0.3 },
      V3: { r: 0.14, s: -1.6, t: 0.5, st: 0.25 }, V4: { r: 0.5, s: -1.0, t: 0.25, st: 0.1 },
      V5: { q: 0, r: 0.95, rp: 0.95, s: 0, t: -0.3, st: -0.1 }, V6: { q: 0, r: 0.9, rp: 0.9, s: 0, t: -0.35, st: -0.12 }
    },
    mods: [[["I", "aVL"], { st: -0.08 }], [["aVR"], { st: 0.05 }]]
  };
  const LAFB_FR = { q: [0.16, 120], r: [1.15, -55], s: [0.1, -110] };
  const VTPL = { // ổ ngoại vị thất (ngoại tâm thu thất) - đường ra thất phải, dạng block nhánh trái, trục dưới
    qrs: 0.15, sig: { r: 0.15, s: 0.16 }, pos: { r: 0.4, s: 0.6 },
    frontal: { q: [0, 0], r: [1.5, 85], s: [0.1, -90], t: [0.55, -95] },
    prec: {
      V1: { r: 0.1, s: -1.4, t: 0.5 }, V2: { r: 0.15, s: -1.7, t: 0.55 }, V3: { r: 0.5, s: -1.3, t: 0.3 },
      V4: { r: 1.0, s: -0.6, t: -0.2 }, V5: { q: 0, r: 1.4, s: -0.1, t: -0.4 }, V6: { q: 0, r: 1.3, s: 0, t: -0.4 }
    }
  };
  const VT = { // nhịp nhanh thất dạng block nhánh phải, trục tây bắc
    qrs: 0.17, qt: 0.32, sig: { r: 0.16, s: 0.16 }, pos: { r: 0.42, s: 0.62 },
    frontal: { p: [0.1, 60], q: [0, 0], r: [1.35, -130], s: [0.15, 60], t: [0.4, 70] },
    prec: {
      V1: { r: 1.25, s: 0, t: -0.35 }, V2: { r: 1.15, s: -0.1, t: -0.3 }, V3: { r: 0.9, s: -0.45, t: -0.15 },
      V4: { r: 0.45, s: -0.9, t: 0.15 }, V5: { q: 0, r: 0.22, s: -1.15, t: 0.25 }, V6: { q: 0, r: 0.12, s: -1.25, t: 0.3 }
    }
  };
  const PACED = {
    qrs: 0.16, sig: { r: 0.14, s: 0.2 }, pos: { r: 0.42, s: 0.55 },
    frontal: { q: [0, 0], r: [1.2, -70], s: [0.1, 90], t: [0.35, 110] },
    prec: {
      V1: { r: 0.05, s: -1.5, t: 0.4, st: 0.15 }, V2: { r: 0.08, s: -1.9, t: 0.5, st: 0.2 }, V3: { r: 0.1, s: -1.7, t: 0.45, st: 0.15 },
      V4: { r: 0.15, s: -1.4, t: 0.35 }, V5: { q: 0, r: 0.2, s: -1.1, t: 0.25 }, V6: { q: 0, r: 0.25, s: -0.9, t: 0.2 }
    }
  };
  const WPW = {
    pr: 0.1, qrs: 0.12, pos: { r: 0.48, s: 0.72, delta: 0.22 }, sig: { delta: 0.15 },
    frontal: { delta: [0.42, 100], q: [0, 0], t: [0.25, 20] },
    prec: {
      V1: { delta: 0.25, r: 0.7, s: -0.35, t: -0.1 }, V2: { delta: 0.35, r: 1.0, s: -0.5, t: -0.05 }, V3: { delta: 0.4, r: 1.2, s: -0.3 },
      V4: { delta: 0.4, r: 1.4, s: -0.2 }, V5: { q: 0, delta: 0.35, r: 1.3 }, V6: { q: 0, delta: 0.3, r: 1.1 }
    }
  };
  const LVH = {
    qrs: 0.1, pDur: 0.12,
    frontal: { r: [1.75, 15], t: [0.28, 195], p: [0.14, 55] },
    prec: {
      V1: { r: 0.2, s: -2.6, t: 0.35, st: 0.12, p2: -0.1 }, V2: { r: 0.35, s: -3.1, t: 0.55, st: 0.18 }, V3: { r: 0.6, s: -2.0, t: 0.35, st: 0.08 },
      V4: { r: 2.2, s: -0.7, t: 0.0 }, V5: { r: 3.0, s: -0.15, t: -0.3, st: -0.1, stSlope: -0.06 }, V6: { r: 2.4, s: -0.05, t: -0.32, st: -0.1, stSlope: -0.06 }
    },
    mods: [[["I", "aVL"], { st: -0.08, stSlope: -0.04 }], [["I", "II", "aVF"], { p2: 0.08 }]]
  };
  const merge = (...a) => {
    const o = {};
    for (const x of a) for (const k of Object.keys(x)) {
      if (["frontal", "prec", "pos", "sig", "w"].includes(k)) {
        o[k] = Object.assign({}, o[k] || {});
        for (const kk of Object.keys(x[k])) o[k][kk] = k === "prec" ? Object.assign({}, (o[k] || {})[kk] || {}, x[k][kk]) : x[k][kk];
      } else if (k === "mods") o.mods = (o.mods || []).concat(x.mods);
      else o[k] = x[k];
    }
    return o;
  };
  const sinus = (rate, extra) => Object.assign({ type: "sinus", rate }, extra || {});

  const L = [];
  const def = (o) => L.push(o);

  /* ================= Bình thường, biến thể, kỹ thuật ================= */
  def({ id: "normal", name: "Nhịp xoang bình thường", group: "Bình thường & kỹ thuật", lesson: "ECG-05",
    findings: ["Nhịp xoang 72/ph: P dương ở DI, DII, âm ở aVR, mỗi P theo sau bởi QRS", "PR 160 ms, QRS 90 ms, QTc ~410 ms", "Trục ~ +55°", "Chuyển tiếp R/S ở V3–V4"],
    cfg: (s) => ({ seed: s, rhythm: sinus(72, { pr: 0.16 }) }) });
  def({ id: "sinus_brady", name: "Nhịp chậm xoang", group: "Nhịp chậm & block", lesson: "ECG-25",
    findings: ["Nhịp xoang, tần số ~45/ph", "PR, QRS bình thường"], cfg: (s) => ({ seed: s, rhythm: sinus(45) }) });
  def({ id: "sinus_tach", name: "Nhịp nhanh xoang", group: "Nhịp nhanh", lesson: "ECG-25",
    findings: ["Nhịp xoang 125/ph, P dương DII đứng trước mỗi QRS", "Đều, QRS hẹp", "Luôn tìm nguyên nhân: sốt, giảm thể tích, đau, thiếu oxy, thuyên tắc phổi, cường giáp…"],
    cfg: (s) => ({ seed: s, rhythm: sinus(125, { pr: 0.14 }) }) });
  def({ id: "sinus_arr", name: "Loạn nhịp xoang hô hấp", group: "Bình thường & kỹ thuật", lesson: "ECG-25",
    findings: ["P xoang đồng nhất, PR hằng định", "RR thay đổi theo chu kỳ hô hấp (chênh >120 ms)", "Lành tính, hay gặp ở người trẻ"],
    cfg: (s) => ({ seed: s, rhythm: sinus(66, { arrhythmia: 0.22 }) }) });
  def({ id: "ber", name: "Tái cực sớm lành tính", group: "Bình thường & kỹ thuật", lesson: "ECG-07",
    findings: ["ST chênh lên lõm (concave) lan toả V2–V5, ≤ 2 mm", "Khía/móc ở điểm J (fish-hook) V4", "T cao, rộng, không đối xứng; không có ST chênh xuống soi gương (trừ aVR)", "Không thay đổi theo thời gian; phải loại trừ STEMI và viêm màng ngoài tim"],
    cfg: (s) => ({ seed: s, rhythm: sinus(62), templates: { N: { prec: { V2: { st: 0.16, stSlope: 0.06, t: 0.6, r: 0.6 }, V3: { st: 0.2, stSlope: 0.06, t: 0.65, r: 1.0 }, V4: { st: 0.18, stSlope: 0.04, t: 0.6, osborn: 0.1, r: 1.6 }, V5: { st: 0.1, t: 0.45, osborn: 0.07, r: 1.6 } }, mods: [[["II", "aVF"], { st: 0.06, osborn: 0.04 }]] } } }) });
  def({ id: "lead_rev", name: "Mắc nhầm điện cực tay trái – tay phải", group: "Bình thường & kỹ thuật", lesson: "ECG-04",
    findings: ["DI đảo ngược toàn bộ: P âm, QRS âm, T âm", "aVR dương (P, QRS, T dương)", "Chuyển đạo trước tim bình thường → giúp phân biệt với đảo ngược phủ tạng (dextrocardia)", "DII và DIII đổi chỗ, aVL và aVR đổi chỗ"],
    cfg: (s) => ({ seed: s, rhythm: sinus(78), reversal: "LA-RA" }) });
  def({ id: "artifact", name: "Nhiễu do run cơ", group: "Bình thường & kỹ thuật", lesson: "ECG-04",
    findings: ["Dao động tần số cao, không đều ở đường đẳng điện", "Phức bộ QRS vẫn nhìn thấy xuyên qua nhiễu, RR đều", "Dễ nhầm với rung nhĩ/rung thất: luôn đối chiếu bệnh nhân"],
    cfg: (s) => ({ seed: s, rhythm: sinus(84), tremor: 0.07, wander: 0.08 }) });
  def({ id: "low_volt", name: "Điện thế thấp", group: "Bình thường & kỹ thuật", lesson: "ECG-40",
    findings: ["Biên độ QRS < 5 mm ở mọi chuyển đạo chi và < 10 mm ở chuyển đạo trước tim", "Nguyên nhân: tràn dịch màng ngoài tim, COPD, béo phì, phù niêm, bệnh cơ tim thâm nhiễm"],
    cfg: (s) => ({ seed: s, rhythm: sinus(88), templates: { N: { allScale: 0.38 } } }) });

  /* ================= Lớn nhĩ, phì đại thất ================= */
  def({ id: "lae", name: "Lớn nhĩ trái (P mitrale)", group: "Lớn nhĩ & phì đại", lesson: "ECG-08",
    findings: ["P rộng ≥ 120 ms, hai đỉnh ở DII (khoảng cách giữa hai đỉnh > 40 ms)", "Pha âm cuối của P ở V1 sâu ≥ 1 mm và rộng ≥ 40 ms"],
    cfg: (s) => ({ seed: s, rhythm: sinus(70, { pr: 0.2 }), templates: { N: { pDur: 0.13, frontal: { p: [0.1, 55] }, mods: [[["I", "II", "aVF"], { p2: 0.1 }], [["V1"], { p: 0.04, p2: -0.13 }, "="]] } } }) });
  def({ id: "rae", name: "Lớn nhĩ phải (P pulmonale)", group: "Lớn nhĩ & phì đại", lesson: "ECG-08",
    findings: ["P nhọn, cao > 2,5 mm ở DII, DIII, aVF", "P dương cao > 1,5 mm ở V1–V2", "Gặp trong tăng áp phổi, COPD, tâm phế"],
    cfg: (s) => ({ seed: s, rhythm: sinus(96), templates: { N: { frontal: { p: [0.33, 78] }, prec: { V1: { p: 0.17, p2: 0 }, V2: { p: 0.15 } } } } }) });
  def({ id: "lvh", name: "Phì đại thất trái kèm biến đổi tái cực (strain)", group: "Lớn nhĩ & phì đại", lesson: "ECG-09",
    findings: ["S V1 + R V5 ≥ 35 mm (Sokolow–Lyon); R aVL ≥ 11 mm", "ST chênh xuống dốc xuống + T âm không đối xứng ở DI, aVL, V5–V6 (strain)", "ST chênh lên ‘bất hoà’ ở V1–V3 (đừng nhầm STEMI)", "Kèm dấu lớn nhĩ trái"],
    cfg: (s) => ({ seed: s, rhythm: sinus(76, { pr: 0.18 }), templates: { N: LVH } }) });
  def({ id: "rvh", name: "Phì đại thất phải", group: "Lớn nhĩ & phì đại", lesson: "ECG-10",
    findings: ["Trục lệch phải (~ +120°)", "R ưu thế ở V1 (R/S > 1), S sâu ở V5–V6", "ST chênh xuống + T âm V1–V3 (strain thất phải)", "Thường kèm lớn nhĩ phải"],
    cfg: (s) => ({ seed: s, rhythm: sinus(92), templates: { N: { axis: 120, frontal: { r: [1.2, 120], p: [0.3, 75] }, prec: { V1: { r: 1.05, s: -0.25, t: -0.28, st: -0.06, p: 0.16, p2: 0 }, V2: { r: 1.0, s: -0.6, t: -0.22, st: -0.05 }, V3: { r: 0.9, s: -0.8, t: -0.1 }, V4: { r: 0.8, s: -0.9 }, V5: { r: 0.5, s: -0.8 }, V6: { r: 0.35, s: -0.6 } } } } }) });

  /* ================= Dẫn truyền ================= */
  def({ id: "avb1", name: "Block nhĩ thất độ I", group: "Nhịp chậm & block", lesson: "ECG-12",
    findings: ["PR kéo dài cố định ≈ 300 ms (> 200 ms)", "Mỗi P đều dẫn xuống thất"], cfg: (s) => ({ seed: s, rhythm: sinus(68, { pr: 0.3 }) }) });
  def({ id: "wenck", name: "Block nhĩ thất độ II Mobitz I (Wenckebach)", group: "Nhịp chậm & block", lesson: "ECG-12",
    findings: ["PR dài dần qua từng nhịp rồi một P không dẫn (tỷ lệ 4:3)", "RR ngắn dần trước nhịp rơi; nhịp ‘theo nhóm’", "QRS hẹp → block thường ở nút nhĩ thất, tiên lượng tốt hơn Mobitz II"],
    cfg: (s) => ({ seed: s, rhythm: { type: "avblock", mode: "wenck", atrialRate: 88, ratio: 4 } }) });
  def({ id: "mobitz2", name: "Block nhĩ thất độ II Mobitz II", group: "Nhịp chậm & block", lesson: "ECG-12",
    findings: ["PR hằng định ở các nhịp dẫn, đột ngột một P không dẫn", "QRS rộng (block hai phân nhánh nền) → tổn thương dưới bó His", "Nguy cơ tiến triển block hoàn toàn: chuẩn bị tạo nhịp"],
    cfg: (s) => ({ seed: s, rhythm: { type: "avblock", mode: "mobitz2", atrialRate: 84, ratio: 3, pr: 0.18 }, templates: { N: merge(RBBB, { frontal: Object.assign({}, LAFB_FR, { rp: [0.42, 165] }) }) } }) });
  def({ id: "avb21", name: "Block nhĩ thất 2:1", group: "Nhịp chậm & block", lesson: "ECG-12",
    findings: ["Cứ 2 sóng P có 1 QRS; P không dẫn có thể lẫn vào sóng T", "Không xác định được Mobitz I hay II từ một đoạn 2:1; QRS rộng gợi ý dưới His"],
    cfg: (s) => ({ seed: s, rhythm: { type: "avblock", mode: "2to1", atrialRate: 92, pr: 0.2 } }) });
  def({ id: "chb", name: "Block nhĩ thất hoàn toàn (độ III), thoát bộ nối", group: "Nhịp chậm & block", lesson: "ECG-12",
    findings: ["P đều (~80/ph) và QRS đều (~42/ph) hoàn toàn độc lập: phân ly nhĩ thất", "PR thay đổi ngẫu nhiên, P ‘đi xuyên’ qua QRS và T", "QRS hẹp → nhịp thoát bộ nối"],
    cfg: (s) => ({ seed: s, rhythm: { type: "avblock", mode: "chb", atrialRate: 80, ventRate: 42 }, templates: { ESC: {} } }) });
  def({ id: "chb_wide", name: "Block nhĩ thất hoàn toàn, thoát thất", group: "Nhịp chậm & block", lesson: "ECG-12",
    findings: ["Phân ly nhĩ thất hoàn toàn", "Nhịp thoát QRS rộng ~ 32/ph → thoát thất, không ổn định", "Chỉ định tạo nhịp qua da/tĩnh mạch nếu có triệu chứng"],
    cfg: (s) => ({ seed: s, rhythm: { type: "avblock", mode: "chb", atrialRate: 75, ventRate: 32 }, templates: { ESC: VTPL } }) });
  def({ id: "rbbb", name: "Block nhánh phải hoàn toàn", group: "Dẫn truyền", lesson: "ECG-13",
    findings: ["QRS ≥ 120 ms", "rSR’ (‘tai thỏ’) ở V1–V2", "S rộng, trát đậm ở DI, aVL, V5–V6", "T âm thứ phát ở V1–V3 là bình thường trong RBBB"],
    cfg: (s) => ({ seed: s, rhythm: sinus(74), templates: { N: RBBB } }) });
  def({ id: "lbbb", name: "Block nhánh trái hoàn toàn", group: "Dẫn truyền", lesson: "ECG-13",
    findings: ["QRS ≥ 120 ms, S sâu rộng (QS/rS) ở V1", "R rộng, khía (hình chữ M) ở DI, aVL, V5–V6, mất sóng q vách", "ST–T ‘bất hoà’ (ngược hướng QRS) là bình thường của LBBB", "Không dùng tiêu chuẩn STEMI thường → dùng Sgarbossa (Smith)"],
    cfg: (s) => ({ seed: s, rhythm: sinus(76), templates: { N: LBBB } }) });
  def({ id: "lafb", name: "Block phân nhánh trái trước", group: "Dẫn truyền", lesson: "ECG-14",
    findings: ["Trục lệch trái ~ −60° (−45° đến −90°)", "qR ở DI, aVL; rS ở DII, DIII, aVF", "QRS < 120 ms"],
    cfg: (s) => ({ seed: s, rhythm: sinus(72), templates: { N: { qrs: 0.1, frontal: LAFB_FR } } }) });
  def({ id: "lpfb", name: "Block phân nhánh trái sau", group: "Dẫn truyền", lesson: "ECG-14",
    findings: ["Trục lệch phải ~ +115°", "rS ở DI, aVL; qR ở DII, DIII, aVF", "Chẩn đoán loại trừ: không RVH, không tâm phế, không người gầy cao"],
    cfg: (s) => ({ seed: s, rhythm: sinus(70), templates: { N: { qrs: 0.1, frontal: { q: [0.16, -55], r: [1.2, 115], s: [0.08, 10], t: [0.3, 60] } } } }) });
  def({ id: "bifasc", name: "Block hai phân nhánh (RBBB + LAFB) kèm block AV độ I", group: "Dẫn truyền", lesson: "ECG-14",
    findings: ["RBBB: rSR’ V1, S rộng DI/V6", "Trục lệch trái −60° (LAFB)", "PR 260 ms", "Ở bệnh nhân ngất: cân nhắc block AV cao độ từng lúc"],
    cfg: (s) => ({ seed: s, rhythm: sinus(70, { pr: 0.26 }), templates: { N: merge(RBBB, { frontal: Object.assign({}, LAFB_FR, { rp: [0.42, 165] }) }) } }) });
  def({ id: "wpw", name: "Tiền kích thích (Wolff–Parkinson–White)", group: "Dẫn truyền", lesson: "ECG-15",
    findings: ["PR ngắn < 120 ms", "Sóng delta: nét lên trát đậm đầu QRS", "QRS rộng ~ 120 ms, ST–T biến đổi thứ phát", "Delta âm ở DI/aVL có thể giả sóng Q nhồi máu"],
    cfg: (s) => ({ seed: s, rhythm: sinus(76, { pr: 0.1 }), templates: { N: WPW } }) });
  def({ id: "pause", name: "Ngưng xoang", group: "Nhịp chậm & block", lesson: "ECG-11",
    findings: ["Mất đột ngột sóng P và QRS kéo dài ~ 2,6 s", "Khoảng ngưng không là bội số của PP → ngưng xoang (khác block xoang nhĩ)"],
    cfg: (s) => ({ seed: s, rhythm: sinus(70, { pause: { at: 4, dur: 2.6 } }) }) });

  /* ================= Thiếu máu – nhồi máu ================= */
  def({ id: "stemi_ant", name: "STEMI trước rộng (tắc LAD đoạn gần)", group: "Thiếu máu & nhồi máu", lesson: "ECG-17",
    findings: ["ST chênh lên lồi/thẳng V1–V5, DI, aVL", "ST chênh xuống soi gương DII, DIII, aVF", "Sóng Q bắt đầu ở V1–V3", "ST chênh lên ở aVL + V1 gợi ý tắc LAD đoạn gần (trước nhánh chéo 1)"],
    cfg: (s) => ({ seed: s, rhythm: sinus(96), templates: { N: { prec: { V1: { st: 0.18, t: 0.3 }, V2: { q: -0.3, r: 0.1, st: 0.42, t: 0.75 }, V3: { q: -0.2, r: 0.3, st: 0.48, t: 0.8 }, V4: { st: 0.36, t: 0.65 }, V5: { st: 0.2, t: 0.45 }, V6: { st: 0.08 } }, mods: [[["I"], { st: 0.1 }], [["aVL"], { st: 0.16, t: 0.15 }], [INF, { st: -0.1, t: -0.08 }]] } } }) });
  def({ id: "stemi_inf", name: "STEMI sau dưới kèm thất phải (tắc RCA)", group: "Thiếu máu & nhồi máu", lesson: "ECG-17",
    findings: ["ST chênh lên DII, DIII, aVF; ST DIII > DII", "ST chênh xuống soi gương aVL (và DI)", "ST chênh lên V1 → nghi nhồi máu thất phải: ghi V4R", "Tránh nitrat, thận trọng thuốc giảm tiền gánh"],
    cfg: (s) => ({ seed: s, rhythm: sinus(58), templates: { N: { prec: { V1: { st: 0.1, t: 0.15 }, V2: { st: -0.04 } }, mods: [[["II"], { st: 0.2, t: 0.3 }], [["III"], { st: 0.32, t: 0.35, q: -0.2 }], [["aVF"], { st: 0.26, t: 0.32, q: -0.1 }], [["aVL"], { st: -0.22, t: -0.2 }], [["I"], { st: -0.08, t: -0.05 }]] } } }) });
  def({ id: "stemi_lat", name: "STEMI thành bên cao (nhánh chéo 1/LCx)", group: "Thiếu máu & nhồi máu", lesson: "ECG-17",
    findings: ["ST chênh lên DI, aVL và V2 (‘lá cờ Nam Phi’)", "ST chênh xuống DIII (soi gương) — đôi khi rõ hơn cả chỗ chênh lên", "ST chênh nhẹ, dễ bỏ sót"],
    cfg: (s) => ({ seed: s, rhythm: sinus(84), templates: { N: { prec: { V2: { st: 0.16, t: 0.6 } }, mods: [[["I"], { st: 0.14, t: 0.15 }], [["aVL"], { st: 0.18, t: 0.2 }], [["III"], { st: -0.2, t: -0.15 }], [["aVF"], { st: -0.12, t: -0.08 }], [["II"], { st: -0.04 }]] } } }) });
  def({ id: "stemi_post", name: "Nhồi máu thành sau (OMI thành sau)", group: "Thiếu máu & nhồi máu", lesson: "ECG-18",
    findings: ["ST chênh xuống nằm ngang V1–V3, sóng T dương", "R cao, rộng ở V2 (R/S > 1)", "Đây là ST chênh lên ‘soi gương’ của thành sau → ghi V7–V9 (ST chênh lên ≥ 0,5 mm)", "Điều trị như STEMI"],
    cfg: (s) => ({ seed: s, rhythm: sinus(78), templates: { N: { prec: { V1: { r: 0.55, s: -0.45, st: -0.22, t: 0.3 }, V2: { r: 1.0, s: -0.55, st: -0.32, t: 0.42 }, V3: { r: 1.1, s: -0.5, st: -0.28, t: 0.38 }, V4: { st: -0.12 } } } } }) });
  def({ id: "dewinter", name: "Sóng T de Winter (tắc LAD đoạn gần)", group: "Thiếu máu & nhồi máu", lesson: "ECG-18",
    findings: ["ST chênh xuống dốc lên 1–3 mm tại điểm J ở V1–V6", "Sóng T cao, nhọn, đối xứng nối tiếp", "ST chênh lên nhẹ 0,5–1 mm ở aVR", "Tương đương STEMI → can thiệp mạch vành cấp"],
    cfg: (s) => ({ seed: s, rhythm: sinus(82), templates: { N: { prec: { V1: { st: -0.06, t: 0.3 }, V2: { st: -0.3, stSlope: 0.2, t: 1.0, r: 0.5 }, V3: { st: -0.36, stSlope: 0.24, t: 1.15 }, V4: { st: -0.33, stSlope: 0.22, t: 1.05 }, V5: { st: -0.22, stSlope: 0.15, t: 0.75 }, V6: { st: -0.14, stSlope: 0.09, t: 0.5 } }, mods: [[["aVR"], { st: 0.08 }], [["I", "II"], { st: -0.06, stSlope: 0.04 }]], w: { wt: 0.85 } } } }) });
  def({ id: "wellens_a", name: "Hội chứng Wellens typ A", group: "Thiếu máu & nhồi máu", lesson: "ECG-18",
    findings: ["T hai pha (dương rồi âm) ở V2–V3", "ST đẳng điện hoặc chênh < 1 mm, còn sóng R, không Q", "Bệnh nhân thường hết đau lúc ghi ECG", "Hẹp khít LAD đoạn gần: KHÔNG làm nghiệm pháp gắng sức, chụp mạch sớm"],
    cfg: (s) => ({ seed: s, rhythm: sinus(70), templates: { N: { prec: { V1: { t: 0.05, t2: -0.1 }, V2: { t: 0.2, t2: -0.38, st: 0.04 }, V3: { t: 0.22, t2: -0.42, st: 0.04 }, V4: { t: 0.2, t2: -0.2 } } } } }) });
  def({ id: "wellens_b", name: "Hội chứng Wellens typ B", group: "Thiếu máu & nhồi máu", lesson: "ECG-18",
    findings: ["T âm sâu, đối xứng ở V2–V3 (có thể lan V1–V6)", "ST đẳng điện, R còn, không Q", "Gợi ý hẹp nặng LAD đoạn gần – tái thông giai đoạn sau đau"],
    cfg: (s) => ({ seed: s, rhythm: sinus(66), templates: { N: { qtc: 0.44, prec: { V1: { t: -0.22 }, V2: { t: -0.65 }, V3: { t: -0.75 }, V4: { t: -0.55 }, V5: { t: -0.25 } }, mods: [[V13.concat(V46), { wt: 0.75 }, "="]] } } }) });
  def({ id: "hyperacute", name: "Sóng T tối cấp (giai đoạn sớm tắc LAD)", group: "Thiếu máu & nhồi máu", lesson: "ECG-18",
    findings: ["T rộng gốc, cao, ‘phồng’, diện tích lớn so với QRS ở V2–V4", "ST chênh lên nhẹ bắt đầu xuất hiện", "Ghi ECG lặp lại mỗi 15–30 phút"],
    cfg: (s) => ({ seed: s, rhythm: sinus(88), templates: { N: { prec: { V2: { t: 1.05, st: 0.08, w: { wt: 1.35 } }, V3: { t: 1.2, st: 0.1, w: { wt: 1.35 } }, V4: { t: 1.0, st: 0.06, w: { wt: 1.3 } }, V5: { t: 0.55 } }, mods: [[["aVL"], { t: 0.1 }], [["III"], { t: -0.1 }]] } } }) });
  def({ id: "avr_std", name: "ST chênh xuống lan toả + ST chênh lên aVR", group: "Thiếu máu & nhồi máu", lesson: "ECG-20",
    findings: ["ST chênh xuống ≥ 1 mm ở ≥ 6 chuyển đạo (DI, DII, V4–V6…)", "ST chênh lên aVR (± V1)", "Thiếu máu dưới nội mạc lan toả: hẹp thân chung/3 nhánh hoặc nguyên nhân ngoài vành (sốc, nhịp nhanh, thiếu máu)"],
    cfg: (s) => ({ seed: s, rhythm: sinus(104), templates: { N: { prec: { V1: { st: 0.06 }, V3: { st: -0.1 }, V4: { st: -0.2, stSlope: -0.03, t: 0.15 }, V5: { st: -0.24, stSlope: -0.03, t: 0.12 }, V6: { st: -0.2, stSlope: -0.03, t: 0.1 } }, mods: [[["I", "II", "aVF"], { st: -0.14, stSlope: -0.02 }], [["III"], { st: -0.06 }], [["aVR"], { st: 0.2 }]] } } }) });
  def({ id: "nste", name: "ST chênh xuống vùng bên (NSTE-ACS)", group: "Thiếu máu & nhồi máu", lesson: "ECG-20",
    findings: ["ST chênh xuống nằm ngang 1,5–2 mm V4–V6, DI, aVL", "Không có ST chênh lên ngoài aVR", "Hội chứng vành cấp không ST chênh – phân tầng nguy cơ, troponin; nhớ loại trừ nhồi máu thành sau (V7–V9)"],
    cfg: (s) => ({ seed: s, rhythm: sinus(86), templates: { N: { prec: { V4: { st: -0.15, t: 0.12 }, V5: { st: -0.2, t: 0.1 }, V6: { st: -0.16, t: 0.06 } }, mods: [[["I", "aVL"], { st: -0.1 }], [["aVR"], { st: 0.05 }]] } } }) });
  def({ id: "lbbb_ami", name: "LBBB kèm nhồi máu cấp (Sgarbossa dương tính)", group: "Thiếu máu & nhồi máu", lesson: "ECG-19",
    findings: ["Nền block nhánh trái", "ST chênh lên ĐỒNG HƯỚNG ≥ 1 mm ở V5, V6, DI, aVL (cùng chiều QRS dương)", "ST chênh lên ngược hướng quá mức ở V2–V3 (ST/S ≥ 25%)", "Smith–Sgarbossa dương tính → xử trí như STEMI"],
    cfg: (s) => ({ seed: s, rhythm: sinus(92), templates: { N: merge(LBBB, { prec: { V2: { st: 0.65, t: 0.75 }, V3: { st: 0.55, t: 0.6 }, V5: { st: 0.18, t: 0.25 }, V6: { st: 0.2, t: 0.25 } }, mods: [[["I", "aVL"], { st: 0.2, t: 0.45 }], [INF, { st: -0.1 }]] }) } }) });
  def({ id: "old_inf", name: "Nhồi máu sau dưới cũ (sóng Q bệnh lý)", group: "Thiếu máu & nhồi máu", lesson: "ECG-21",
    findings: ["Sóng Q rộng ≥ 40 ms, sâu ở DII, DIII, aVF", "Không có ST chênh lên cấp; T dẹt/âm nhẹ", "Đối chiếu ECG cũ và lâm sàng"],
    cfg: (s) => ({ seed: s, rhythm: sinus(68), templates: { N: { mods: [[["III"], { q: -0.45, r: -0.2, t: -0.25 }], [["aVF"], { q: -0.35, r: -0.3, t: -0.15 }], [["II"], { q: -0.28, t: -0.1 }], [INF, { wq: 2.2 }, "="]] } } }) });
  def({ id: "lv_aneur", name: "Phình thất trái (ST chênh lên tồn tại)", group: "Thiếu máu & nhồi máu", lesson: "ECG-21",
    findings: ["QS sâu ở V1–V4, ST chênh lên kéo dài nhiều tuần sau nhồi máu", "T thấp so với QRS: tỷ lệ T/QRS < 0,36 ở mọi chuyển đạo V1–V4 (quy tắc Smith)", "So với ECG cũ; nghi ngờ thì làm troponin, siêu âm"],
    cfg: (s) => ({ seed: s, rhythm: sinus(76), templates: { N: { prec: { V1: { r: 0.02, s: -1.1, st: 0.12, t: 0.1 }, V2: { r: 0, q: 0, s: -1.6, st: 0.22, t: 0.18 }, V3: { r: 0.05, s: -1.4, st: 0.2, t: 0.16 }, V4: { r: 0.25, q: -0.6, s: -0.6, st: 0.15, t: 0.12 } } } } }) });

  /* ================= Nhịp nhanh ================= */
  def({ id: "pvc", name: "Ngoại tâm thu thất nhịp đôi", group: "Nhịp nhanh", lesson: "ECG-26",
    findings: ["Cứ một nhịp xoang xen một nhịp QRS rộng, đến sớm, không có P đi trước", "ST–T ngược hướng QRS ngoại tâm thu", "Nghỉ bù hoàn toàn"],
    cfg: (s) => ({ seed: s, rhythm: sinus(76, { ectopic: [{ every: 2, kind: "pvc", coupling: 0.52 }] }), templates: { V: VTPL } }) });
  def({ id: "af", name: "Rung nhĩ", group: "Nhịp nhanh", lesson: "ECG-27",
    findings: ["Không có sóng P; đường nền dao động lăn tăn (sóng f) rõ ở V1", "RR không đều hoàn toàn (‘bất thường không đều’)", "QRS hẹp; tần số thất ~ 110/ph"],
    cfg: (s) => ({ seed: s, rhythm: { type: "af", rate: 110 }, templates: { N: { frontal: { p: [0, 0] }, mods: [["prec", { p: 0, p2: 0 }, "="]] } } }) });
  def({ id: "af_rvr", name: "Rung nhĩ đáp ứng thất nhanh", group: "Nhịp nhanh", lesson: "ECG-27",
    findings: ["RR không đều hoàn toàn, tần số thất ~ 150/ph", "Không sóng P", "ST chênh xuống lan toả nhẹ có thể do tần số (không đặc hiệu thiếu máu)"],
    cfg: (s) => ({ seed: s, rhythm: { type: "af", rate: 150, fAmp: 0.05 }, templates: { N: { frontal: { p: [0, 0] }, mods: [["prec", { p: 0, p2: 0 }, "="], [["V4", "V5", "V6", "II"], { st: -0.07 }]] } } }) });
  def({ id: "flutter21", name: "Cuồng nhĩ dẫn truyền 2:1", group: "Nhịp nhanh", lesson: "ECG-28",
    findings: ["Nhịp đều, QRS hẹp ~ 150/ph (gợi ý ngay cuồng nhĩ 2:1)", "Sóng F răng cưa âm ở DII, DIII, aVF (tần số nhĩ ~ 300/ph); một sóng F lẫn trong QRS/T", "Sóng F dương ở V1 dễ nhầm với P"],
    cfg: (s) => ({ seed: s, rhythm: { type: "flutter", atrialRate: 300, ratio: 2 }, templates: { N: { frontal: { p: [0, 0] }, mods: [["prec", { p: 0, p2: 0 }, "="]] } } }) });
  def({ id: "flutter41", name: "Cuồng nhĩ dẫn truyền 4:1", group: "Nhịp nhanh", lesson: "ECG-28",
    findings: ["Sóng F răng cưa rõ ở DII, DIII, aVF, tần số nhĩ ~ 300/ph", "Cứ 4 sóng F có 1 QRS → tần số thất ~ 75/ph"],
    cfg: (s) => ({ seed: s, rhythm: { type: "flutter", atrialRate: 300, ratio: 4 }, templates: { N: { frontal: { p: [0, 0] }, mods: [["prec", { p: 0, p2: 0 }, "="]] } } }) });
  def({ id: "avnrt", name: "Nhịp nhanh vào lại nút nhĩ thất (AVNRT)", group: "Nhịp nhanh", lesson: "ECG-29",
    findings: ["Nhịp nhanh QRS hẹp, rất đều ~ 180/ph", "Không thấy P trước QRS; giả r’ ở V1, giả S ở DII, DIII, aVF (P ngược dòng ngay sau QRS, RP < 70 ms)", "Khởi đầu và kết thúc đột ngột; đáp ứng nghiệm pháp phế vị/adenosine"],
    cfg: (s) => ({ seed: s, rhythm: { type: "svt", rate: 182 }, templates: { N: { frontal: { p: [0, 0] }, prec: { V1: { p: 0, p2: 0, rp: 0.14 } }, mods: [["prec", { p: 0, p2: 0 }, "="], [INF, { rp: -0.12 }], [["V4", "V5", "V6"], { st: -0.08 }]], pos: { rp: 1.05 }, sig: { rp: 0.08 } } } }) });
  def({ id: "wpw_af", name: "Rung nhĩ tiền kích thích (WPW + AF)", group: "Nhịp nhanh", lesson: "ECG-30",
    findings: ["Rất nhanh (có lúc > 250/ph), RR không đều", "QRS rộng, hình dạng thay đổi từng nhịp (mức độ tiền kích thích khác nhau)", "CẤM thuốc ức chế nút nhĩ thất (adenosine, chẹn bêta, chẹn canxi, digoxin, amiodarone)", "Không ổn định → sốc điện; ổn định → procainamide (hoặc ibutilide)"],
    cfg: (s) => ({ seed: s, rhythm: { type: "af", rate: 215, tpls: [["W", 5], ["W2", 3], ["N", 1]], fAmp: 0.03 }, templates: {
      N: { frontal: { p: [0, 0] }, mods: [["prec", { p: 0, p2: 0 }, "="]] },
      W: merge(WPW, { qrs: 0.15, qt: 0.28, frontal: { p: [0, 0], delta: [0.8, 100], r: [1.3, 80] }, mods: [["prec", { p: 0, p2: 0, delta: 0.3 }, "="]] }),
      W2: merge(WPW, { qrs: 0.12, qt: 0.28, frontal: { p: [0, 0], delta: [0.4, 100] }, mods: [["prec", { p: 0, p2: 0 }, "="]] }) } }) });
  def({ id: "vt", name: "Nhịp nhanh thất đơn hình", group: "Nhịp nhanh", lesson: "ECG-32",
    findings: ["Nhịp nhanh QRS rộng (~170 ms), đều ~ 180/ph", "Trục ‘tây bắc’ (−90° đến ±180°): QRS âm ở DI và aVF, R ưu thế aVR", "Phân ly nhĩ thất: sóng P độc lập thỉnh thoảng thấy được", "Không có RS ở V5–V6 dạng điển hình; R đơn pha V1", "Bệnh tim cấu trúc + QRS rộng đều → coi là VT cho đến khi chứng minh ngược lại"],
    cfg: (s) => ({ seed: s, rhythm: { type: "vt", rate: 180, tpl: "VT", dissociatedP: 78 }, templates: { VT } }) });
  def({ id: "tdp", name: "Xoắn đỉnh (Torsades de pointes)", group: "Nhịp nhanh", lesson: "ECG-34",
    findings: ["Trước cơn: nhịp xoang chậm với QT kéo dài rõ (QTc > 500 ms)", "Nhịp nhanh thất đa hình, trục QRS ‘xoắn’ quanh đường đẳng điện, biên độ tăng giảm luân phiên", "Xử trí: magie sulfat 2 g TM; sốc điện không đồng bộ nếu mất mạch; tăng tần số tim; ngừng thuốc kéo dài QT"],
    cfg: (s) => ({ seed: s, segments: [{ type: "sinus", rate: 58, dur: 3.6, offset: 0.3 }, { type: "torsades", rate: 240 }], templates: { N: { qt: 0.6, prec: { V2: { t: 0.5, u: 0.15 }, V3: { t: 0.5, u: 0.15 } }, tWide: 1.3 } } }) });
  def({ id: "vf", name: "Rung thất", group: "Ngừng tuần hoàn", lesson: "ECG-35",
    findings: ["Dao động hỗn loạn, không đều, không nhận ra QRS, sóng T", "Nhịp có chỉ định sốc điện: sốc ngay, ép tim chất lượng cao", "Rung thất sóng nhỏ dễ nhầm vô tâm thu → kiểm tra gain, điện cực, ≥ 2 chuyển đạo"],
    cfg: (s) => ({ seed: s, rhythm: { type: "vf", amp: 0.7 }, noise: 0.01 }) });
  def({ id: "asystole", name: "Vô tâm thu", group: "Ngừng tuần hoàn", lesson: "ECG-35",
    findings: ["Đường gần như thẳng, không có hoạt động thất", "Kiểm tra: điện cực, gain, chuyển đạo khác (loại trừ rung thất sóng nhỏ)", "Nhịp không sốc điện: CPR + adrenaline sớm, tìm nguyên nhân 4H–4T"],
    cfg: (s) => ({ seed: s, rhythm: { type: "asystole" }, noise: 0.012, wander: 0.04 }) });
  def({ id: "p_asystole", name: "Vô tâm thu thất (chỉ còn sóng P)", group: "Ngừng tuần hoàn", lesson: "ECG-35",
    findings: ["Sóng P đều nhưng không có QRS (ventricular standstill)", "Block AV hoàn toàn không có nhịp thoát", "Ép tim; tạo nhịp có thể hiệu quả hơn vô tâm thu thực sự"],
    cfg: (s) => ({ seed: s, rhythm: { type: "asystole", pWaves: 70 }, noise: 0.01 }) });
  def({ id: "junctional", name: "Nhịp bộ nối", group: "Nhịp chậm & block", lesson: "ECG-36",
    findings: ["QRS hẹp đều ~ 50/ph", "Không có P trước QRS; P ngược dòng (âm DII, DIII, aVF) ngay sau QRS"],
    cfg: (s) => ({ seed: s, rhythm: { type: "junctional", rate: 50, retro: true } }) });
  def({ id: "aivr", name: "Nhịp tự thất gia tốc (AIVR)", group: "Nhịp chậm & block", lesson: "ECG-36",
    findings: ["QRS rộng đều ~ 85/ph (50–110/ph)", "Sóng P xoang chậm hơn, phân ly nhĩ thất", "Hay gặp sau tái tưới máu nhồi máu cơ tim; lành tính, thường không cần điều trị"],
    cfg: (s) => ({ seed: s, rhythm: { type: "aivr", rate: 84, tpl: "V", dissociatedP: 68 }, templates: { V: VTPL } }) });
  def({ id: "paced", name: "Nhịp máy tạo nhịp thất (VVI)", group: "Máy tạo nhịp", lesson: "ECG-43",
    findings: ["Gai tạo nhịp ngay trước mỗi QRS", "QRS rộng dạng block nhánh trái, trục trái (điện cực mỏm thất phải)", "ST–T bất hoà là bình thường; nhồi máu: dùng Sgarbossa"],
    cfg: (s) => ({ seed: s, rhythm: { type: "paced", rate: 70, mode: "VVI" }, templates: { PACED } }) });
  def({ id: "paced_ddd", name: "Máy tạo nhịp hai buồng (DDD)", group: "Máy tạo nhịp", lesson: "ECG-43",
    findings: ["Gai nhĩ trước sóng P và gai thất trước QRS", "Khoảng AV cố định ~ 160 ms", "QRS rộng dạng LBBB do tạo nhịp thất phải"],
    cfg: (s) => ({ seed: s, rhythm: { type: "paced", rate: 72, mode: "DDD" }, templates: { PACED } }) });
  def({ id: "fail_capture", name: "Máy tạo nhịp mất dẫn (failure to capture)", group: "Máy tạo nhịp", lesson: "ECG-43",
    findings: ["Có gai tạo nhịp nhưng không có QRS theo sau (mỗi 3 gai mất 1)", "Nguyên nhân: tuột/gãy dây, ngưỡng tăng (tăng kali, thiếu máu, thuốc), xơ hoá đầu điện cực", "Xử trí: tăng output, tạo nhịp qua da, điều chỉnh điện giải"],
    cfg: (s) => ({ seed: s, rhythm: { type: "paced", rate: 70, mode: "VVI", failEvery: 3, underlyingP: 64 }, templates: { PACED } }) });

  /* ================= Điện giải, ngộ độc, bệnh khác ================= */
  def({ id: "hyperk", name: "Tăng kali máu (sóng T nhọn)", group: "Điện giải & ngộ độc", lesson: "ECG-37",
    findings: ["T cao, nhọn, hẹp đáy, đối xứng (‘lều’) rõ ở V2–V4", "QT bình thường hoặc ngắn", "Thường K+ 5,5–6,5 mmol/L; tương quan ECG–kali không chặt"],
    cfg: (s) => ({ seed: s, rhythm: sinus(78), templates: { N: { tPeaked: true, qt: 0.34, frontal: { t: [0.62, 50] }, prec: { V2: { t: 1.15 }, V3: { t: 1.25 }, V4: { t: 1.05 }, V5: { t: 0.75 }, V6: { t: 0.5 }, V1: { t: 0.2 } } } } }) });
  def({ id: "hyperk_sev", name: "Tăng kali máu nặng", group: "Điện giải & ngộ độc", lesson: "ECG-37",
    findings: ["Mất sóng P", "QRS rất rộng, kỳ dị, hoà vào T nhọn → tiến tới dạng sóng sin", "Nhịp chậm", "Cấp cứu ngay: calci TM, insulin–glucose, salbutamol, ± bicarbonate, lọc máu; theo dõi monitor"],
    cfg: (s) => ({ seed: s, rhythm: { type: "junctional", rate: 48 }, templates: { N: { qrs: 0.2, qt: 0.4, tPeaked: true, tWide: 1.5, sig: { r: 0.16, s: 0.2 }, pos: { r: 0.32, s: 0.62 }, frontal: { p: [0, 0], q: [0, 0], r: [0.75, 20], s: [0.6, 200], t: [0.8, 40] }, mods: [["prec", { p: 0, p2: 0, q: 0 }, "="]], prec: { V1: { r: 0.25, s: -0.9, t: 0.6 }, V2: { r: 0.4, s: -1.2, t: 1.2 }, V3: { r: 0.6, s: -1.0, t: 1.3 }, V4: { r: 0.8, s: -0.8, t: 1.1 }, V5: { r: 0.8, s: -0.6, t: 0.8 }, V6: { r: 0.6, s: -0.4, t: 0.6 } } } } }) });
  def({ id: "hypok", name: "Hạ kali máu", group: "Điện giải & ngộ độc", lesson: "ECG-37",
    findings: ["T dẹt, ST chênh xuống nhẹ", "Sóng U nổi bật (rõ ở V2–V3), có thể cao hơn T", "QU kéo dài (dễ đo nhầm thành QT dài); tăng nguy cơ xoắn đỉnh"],
    cfg: (s) => ({ seed: s, rhythm: sinus(84), templates: { N: { frontal: { t: [0.1, 45] }, prec: { V1: { t: 0, u: 0.08 }, V2: { t: 0.12, u: 0.32, st: -0.06 }, V3: { t: 0.12, u: 0.34, st: -0.07 }, V4: { t: 0.1, u: 0.25, st: -0.08 }, V5: { t: 0.08, u: 0.15, st: -0.06 }, V6: { t: 0.06, u: 0.1, st: -0.05 } }, mods: [[INF, { u: 0.1, st: -0.04 }]] } } }) });
  def({ id: "hypoca", name: "Hạ canxi máu (QT dài do ST dài)", group: "Điện giải & ngộ độc", lesson: "ECG-37",
    findings: ["QTc kéo dài (~ 520 ms) do đoạn ST dài, phẳng", "Sóng T hình dạng gần bình thường"],
    cfg: (s) => ({ seed: s, rhythm: sinus(72), templates: { N: { qtc: 0.53, tWide: 0.85 } } }) });
  def({ id: "hyperca", name: "Tăng canxi máu (QT ngắn)", group: "Điện giải & ngộ độc", lesson: "ECG-37",
    findings: ["Đoạn ST rất ngắn hoặc mất, T bắt đầu ngay sau QRS", "QTc ngắn (~ 330 ms)", "Nặng: có thể có sóng J (Osborn), block AV"],
    cfg: (s) => ({ seed: s, rhythm: sinus(70), templates: { N: { qtc: 0.33 } } }) });
  def({ id: "digoxin", name: "Ngấm digoxin (ST hình ‘đáy chén’)", group: "Điện giải & ngộ độc", lesson: "ECG-38",
    findings: ["ST chênh xuống dạng võng/‘dấu tích ngược’ (Salvador Dali) rõ ở chuyển đạo có R cao (V4–V6, DII)", "T dẹt hoặc hai pha, QT ngắn", "Đây là TÁC DỤNG của thuốc, chưa phải ngộ độc; ngộ độc → ngoại tâm thu thất, nhịp đôi, nhịp nhanh nhĩ kèm block, VT hai hướng, nhịp chậm"],
    cfg: (s) => ({ seed: s, rhythm: sinus(64, { pr: 0.21 }), templates: { N: { qtc: 0.36, prec: { V4: { st: -0.06, stSlope: -0.14, t: 0.06 }, V5: { st: -0.06, stSlope: -0.16, t: 0.05 }, V6: { st: -0.05, stSlope: -0.14, t: 0.04 }, V3: { st: -0.03, stSlope: -0.08, t: 0.1 } }, mods: [[["II", "aVF", "I"], { st: -0.04, stSlope: -0.1, t: -0.2 }]] } } }) });
  def({ id: "tca", name: "Ngộ độc thuốc chẹn kênh natri (chống trầm cảm ba vòng)", group: "Điện giải & ngộ độc", lesson: "ECG-38",
    findings: ["Nhịp nhanh xoang", "QRS giãn rộng > 100 ms", "Sóng R tận cùng ở aVR > 3 mm (R/S aVR > 0,7); S tận cùng rộng ở DI, aVL (trục phần cuối lệch phải)", "QTc kéo dài", "Natri bicarbonate 1–2 mmol/kg TM nhắc lại theo QRS"],
    cfg: (s) => ({ seed: s, rhythm: sinus(128, { pr: 0.17 }), templates: { N: { qrs: 0.13, qtc: 0.48, pos: { rp: 0.85 }, sig: { rp: 0.11 }, frontal: { rp: [0.62, -165], s: [0.1, -140] }, prec: { V1: { rp: 0.15 }, V5: { rp: -0.2 }, V6: { rp: -0.2 } } } } }) });
  def({ id: "pe", name: "Thuyên tắc phổi (căng giãn thất phải)", group: "Bệnh khác", lesson: "ECG-39",
    findings: ["Nhịp nhanh xoang (dấu hay gặp nhất)", "S1Q3T3: S sâu DI, Q và T âm ở DIII", "T âm V1–V4 (căng thất phải) ± DIII, aVF", "Block nhánh phải không hoàn toàn, trục lệch phải", "ECG bình thường cũng KHÔNG loại trừ thuyên tắc phổi"],
    cfg: (s) => ({ seed: s, rhythm: sinus(116), templates: { N: { axis: 95, frontal: { s: [0.42, -150], t: [0.15, -20] }, prec: { V1: { rp: 0.3, t: -0.3 }, V2: { t: -0.38 }, V3: { t: -0.3 }, V4: { t: -0.18 } }, mods: [[["III"], { q: -0.18, t: -0.12 }], [["aVF"], { t: -0.05 }]] } } }) });
  def({ id: "pericarditis", name: "Viêm màng ngoài tim cấp", group: "Bệnh khác", lesson: "ECG-40",
    findings: ["ST chênh lên lõm, lan toả nhiều vùng (DI, DII, aVF, aVL, V2–V6)", "PR chênh xuống lan toả; PR chênh lên + ST chênh xuống ở aVR", "Không có ST chênh xuống soi gương (trừ aVR, V1)", "Dấu Spodick: đoạn TP dốc xuống"],
    cfg: (s) => ({ seed: s, rhythm: sinus(102), templates: { N: { prec: { V1: { st: -0.03, prSeg: 0.03 }, V2: { st: 0.12, stSlope: 0.04, prSeg: -0.06 }, V3: { st: 0.16, stSlope: 0.04, prSeg: -0.07 }, V4: { st: 0.17, stSlope: 0.04, prSeg: -0.07 }, V5: { st: 0.15, stSlope: 0.03, prSeg: -0.07 }, V6: { st: 0.13, stSlope: 0.03, prSeg: -0.07 } }, mods: [[["I", "II", "aVF"], { st: 0.13, stSlope: 0.03, prSeg: -0.08 }], [["aVL"], { st: 0.07, prSeg: -0.03 }], [["III"], { st: 0.05, prSeg: -0.04 }], [["aVR"], { st: -0.13, prSeg: 0.09 }]] } } }) });
  def({ id: "tamponade", name: "Tràn dịch màng ngoài tim lượng nhiều / ép tim", group: "Bệnh khác", lesson: "ECG-40",
    findings: ["Nhịp nhanh xoang", "Điện thế thấp", "Luân phiên điện học (biên độ QRS thay đổi xen kẽ từng nhịp) do tim ‘đung đưa’ trong dịch", "Siêu âm tại giường ngay"],
    cfg: (s) => ({ seed: s, rhythm: sinus(118, { alternans: true }), templates: { N: { allScale: 0.42 } } }) });
  def({ id: "hypothermia", name: "Hạ thân nhiệt (sóng Osborn)", group: "Bệnh khác", lesson: "ECG-41",
    findings: ["Nhịp chậm xoang", "Sóng J (Osborn): bướu dương tại điểm J, rõ ở chuyển đạo trước tim và dưới", "PR, QRS, QT kéo dài", "Nhiễu run cơ (rét run)"],
    cfg: (s) => ({ seed: s, rhythm: sinus(42, { pr: 0.22 }), tremor: 0.035, templates: { N: { qrs: 0.11, qtc: 0.5, prec: { V2: { osborn: 0.2 }, V3: { osborn: 0.3 }, V4: { osborn: 0.32 }, V5: { osborn: 0.26 }, V6: { osborn: 0.2 } }, mods: [[["II", "aVF"], { osborn: 0.2 }], [["III", "I"], { osborn: 0.1 }]] } } }) });
  def({ id: "cerebral_t", name: "Sóng T ‘não’ (xuất huyết dưới nhện, tăng áp lực nội sọ)", group: "Bệnh khác", lesson: "ECG-41",
    findings: ["T âm sâu, rộng khổng lồ lan toả chuyển đạo trước tim", "QT kéo dài rõ", "Có thể nhịp chậm (phản xạ Cushing)"],
    cfg: (s) => ({ seed: s, rhythm: sinus(54), templates: { N: { qtc: 0.58, prec: { V2: { t: -0.6 }, V3: { t: -1.0 }, V4: { t: -1.1 }, V5: { t: -0.9 }, V6: { t: -0.6 } }, frontal: { t: [0.5, -130] }, w: { wt: 1.35 } } } }) });
  def({ id: "brugada", name: "Hình ảnh Brugada typ 1", group: "Bệnh khác", lesson: "ECG-42",
    findings: ["ST chênh lên dạng vòm (coved) ≥ 2 mm ở V1–V2, dốc xuống liên tục vào sóng T âm", "Dạng giả block nhánh phải", "Ở bệnh nhân ngất/ngừng tim: nguy cơ đột tử – hội chẩn tim mạch, cân nhắc ICD; sốt làm lộ/nặng thêm"],
    cfg: (s) => ({ seed: s, rhythm: sinus(70), templates: { N: { prec: { V1: { r: 0.2, s: -0.5, rp: 0.3, st: 0.45, stSlope: -0.36, t: -0.24 }, V2: { r: 0.3, s: -0.9, rp: 0.3, st: 0.32, stSlope: -0.26, t: -0.15 }, V3: { st: 0.06 } }, pos: { rp: 0.95 }, sig: { rp: 0.08 } } } }) });
  def({ id: "lqt", name: "QT dài", group: "Bệnh khác", lesson: "ECG-34",
    findings: ["QTc ≈ 560 ms (> 500 ms: nguy cơ xoắn đỉnh cao)", "T rộng, có khía", "Tìm thuốc kéo dài QT, hạ K/Mg/Ca, QT dài bẩm sinh"],
    cfg: (s) => ({ seed: s, rhythm: sinus(62), templates: { N: { qtc: 0.56, tWide: 1.3, prec: { V2: { t2: 0.18 }, V3: { t2: 0.2 }, V4: { t2: 0.15 } } } } }) });
  def({ id: "arvc", name: "Bệnh cơ tim thất phải gây loạn nhịp (ARVC)", group: "Bệnh khác", lesson: "ECG-42",
    findings: ["T âm V1–V3 ở người > 14 tuổi (không có RBBB)", "Sóng epsilon: khía nhỏ ở cuối QRS V1–V2", "Thời gian hoạt hoá tận cùng V1–V3 kéo dài ≥ 55 ms"],
    cfg: (s) => ({ seed: s, rhythm: sinus(74), templates: { N: { prec: { V1: { t: -0.25, eps: 0.13 }, V2: { t: -0.3, eps: 0.12 }, V3: { t: -0.22, eps: 0.05 } } } } }) });
  def({ id: "hcm", name: "Bệnh cơ tim phì đại", group: "Bệnh khác", lesson: "ECG-42",
    findings: ["Điện thế QRS cao (phì đại thất trái)", "Sóng Q sâu, hẹp (‘dao găm’) ở DI, aVL, V5–V6 (± DII, DIII, aVF)", "Biến đổi ST–T; ngất khi gắng sức ở người trẻ → nghĩ HCM"],
    cfg: (s) => ({ seed: s, rhythm: sinus(70), templates: { N: merge(LVH, { prec: { V5: { q: -0.4 }, V6: { q: -0.38 }, V4: { q: -0.2 } }, mods: [[["I", "aVL"], { q: -0.32 }], [INF, { q: -0.25 }], [["I", "aVL", "V4", "V5", "V6"].concat(INF), { wq: 0.8 }, "="]] }) } }) });

  const BY = {}; for (const p of L) BY[p.id] = p;
  root.PATTERNS = L; root.PATTERN = BY;
})(typeof window !== "undefined" ? window : globalThis);

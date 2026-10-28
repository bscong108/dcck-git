/* Công cụ tính toán ECG. Mỗi công cụ: {id, name, desc, html, bind(el)} */
(function (root) {
  "use strict";
  const T = [];
  const num = (el, id) => { const v = parseFloat(String(el.querySelector("#" + id).value).replace(",", ".")); return isFinite(v) ? v : NaN; };
  const f = (x, d) => (isFinite(x) ? x.toFixed(d == null ? 0 : d).replace(".", ",") : "—");
  const inp = (id, label, ph, val) => `<label class="fld"><span>${label}</span><input id="${id}" type="text" inputmode="decimal" placeholder="${ph || ""}" value="${val == null ? "" : val}"></label>`;
  const live = (el, fn) => { el.addEventListener("input", fn); el.addEventListener("change", fn); fn(); };

  T.push({ id: "qtc", name: "QTc", desc: "Hiệu chỉnh QT theo tần số: Bazett, Fridericia, Framingham, Hodges.",
    html: `<div class="fgrid">${inp("qt", "QT đo được (ms)", "vd 440", 440)}${inp("hr", "Tần số tim (/ph)", "vd 75", 75)}</div><div id="out" class="out"></div>
      <p class="muted small">Đo QT ở DII hoặc V5–V6 (chuyển đạo QT dài nhất), từ đầu QRS đến điểm tiếp tuyến dốc xuống của T cắt đường đẳng điện. Bazett sai số khi tần số &lt; 60 hoặc &gt; 100/ph — ưu tiên Fridericia/Framingham khi nhịp nhanh.</p>`,
    bind(el) {
      live(el, () => {
        const qt = num(el, "qt"), hr = num(el, "hr"), o = el.querySelector("#out");
        if (!(qt > 0 && hr > 0)) { o.innerHTML = ""; return; }
        const rr = 60 / hr;
        const r = { Bazett: qt / Math.sqrt(rr), Fridericia: qt / Math.cbrt(rr), Framingham: qt + 154 * (1 - rr), Hodges: qt + 1.75 * (hr - 60) };
        const ref = r.Fridericia;
        const lv = ref > 500 ? ["nguy", "QTc > 500 ms: nguy cơ xoắn đỉnh cao — monitor, bù K⁺/Mg²⁺, ngừng thuốc kéo dài QT."] : ref > 460 ? ["bay", "QTc kéo dài (nam > 440–450, nữ > 460 ms)."] : ref < 350 ? ["bay", "QTc ngắn — cân nhắc tăng Ca²⁺, digoxin, QT ngắn bẩm sinh (≤ 340–360 ms)."] : ["xanh", "QTc trong giới hạn bình thường."];
        o.innerHTML = `<div class="kq">${Object.entries(r).map(([k, v]) => `<div><b>${f(v)}</b><span>${k} (ms)</span></div>`).join("")}</div><div class="note ${lv[0]}">${lv[1]}</div><p class="muted small">RR = ${f(rr * 1000)} ms · QT/RR = ${f(qt / (rr * 1000), 2)} (&gt; 0,5 gợi ý QT dài khi tần số 60–100).</p>`;
      });
    } });

  T.push({ id: "rate", name: "Tần số tim", desc: "Từ khoảng RR (ms), số ô nhỏ, số ô lớn hoặc số QRS trong 10 giây.",
    html: `<div class="fgrid">${inp("rr", "Khoảng RR (ms)", "vd 800")}${inp("sm", "Số ô nhỏ giữa 2 R", "vd 20")}${inp("lg", "Số ô lớn giữa 2 R", "vd 4")}${inp("n10", "Số QRS trong 10 giây", "vd 13")}</div><div id="out" class="out"></div>
      <p class="muted small">25 mm/s: 1 ô nhỏ = 40 ms, 1 ô lớn = 200 ms. Tần số = 1500/số ô nhỏ = 300/số ô lớn. Nhịp không đều: số QRS/10 giây × 6.</p>`,
    bind(el) {
      live(el, () => {
        const rr = num(el, "rr"), sm = num(el, "sm"), lg = num(el, "lg"), n = num(el, "n10");
        const rows = [];
        if (rr > 0) rows.push(["Từ RR", 60000 / rr]);
        if (sm > 0) rows.push(["Từ ô nhỏ", 1500 / sm]);
        if (lg > 0) rows.push(["Từ ô lớn", 300 / lg]);
        if (n > 0) rows.push(["Từ dải 10 giây", n * 6]);
        el.querySelector("#out").innerHTML = rows.length ? `<div class="kq">${rows.map(([k, v]) => `<div><b>${f(v)}</b><span>${k} (/ph)</span></div>`).join("")}</div>` : "";
      });
    } });

  T.push({ id: "axis", name: "Trục điện tim", desc: "Ước tính trục từ biên độ QRS thuần (R − S) ở DI và aVF.",
    html: `<div class="fgrid">${inp("i", "QRS thuần ở DI (mm, R − |S|)", "vd 6", 6)}${inp("f", "QRS thuần ở aVF (mm)", "vd 8", 8)}</div><div class="axis-wrap"><svg id="hex" viewBox="-60 -60 120 120" width="220" height="220" aria-label="Hệ trục"></svg><div id="out" class="out"></div></div>
      <p class="muted small">DI (0°) và aVF (+90°) vuông góc nên góc ≈ arctan(aVF/DI). Kiểm tra lại bằng chuyển đạo có QRS đẳng điện (trục vuông góc với nó).</p>`,
    bind(el) {
      const leads = [["I", 0], ["II", 60], ["III", 120], ["aVR", -150], ["aVL", -30], ["aVF", 90]];
      live(el, () => {
        const a = num(el, "i"), b = num(el, "f"), svg = el.querySelector("#hex");
        let g = '<circle r="50" fill="none" class="hx-c"/>';
        g += `<path d="M0 0 L43.3 -25 A50 50 0 0 1 0 50 Z" class="hx-n"/>`;
        for (const [n, d] of leads) {
          const r = (d * Math.PI) / 180, x = 50 * Math.cos(r), y = 50 * Math.sin(r);
          g += `<line x1="${-x}" y1="${-y}" x2="${x}" y2="${y}" class="hx-l"/><text x="${x * 1.16}" y="${y * 1.16 + 2}" class="hx-t" text-anchor="middle">${n}</text>`;
        }
        const o = el.querySelector("#out");
        if (!isFinite(a) || !isFinite(b) || (a === 0 && b === 0)) { svg.innerHTML = g; o.innerHTML = ""; return; }
        const deg = Math.round((Math.atan2(b, a) * 180) / Math.PI);
        const r = (deg * Math.PI) / 180;
        g += `<line x1="0" y1="0" x2="${44 * Math.cos(r)}" y2="${44 * Math.sin(r)}" class="hx-a"/><circle cx="${44 * Math.cos(r)}" cy="${44 * Math.sin(r)}" r="2.6" class="hx-ad"/>`;
        svg.innerHTML = g;
        const cls = deg >= -30 && deg <= 90 ? ["xanh", "Trục bình thường (−30° đến +90°)."] : deg < -30 && deg >= -90 ? ["bay", "Trục lệch trái: LAFB (−45° đến −90°), LVH, nhồi máu dưới, tạo nhịp thất phải, WPW, tăng K⁺."] : deg > 90 && deg <= 180 ? ["bay", "Trục lệch phải: RVH, thuyên tắc phổi, COPD, LPFB, nhồi máu bên, chẹn Na⁺, mắc nhầm điện cực, trẻ em."] : ["nguy", "Trục vô định (‘tây bắc’): nghĩ VT, tăng K⁺ nặng, máy tạo nhịp, mắc nhầm điện cực."];
        o.innerHTML = `<div class="kq"><div><b>${deg > 0 ? "+" : ""}${deg}°</b><span>Trục QRS</span></div></div><div class="note ${cls[0]}">${cls[1]}</div>`;
      });
    } });

  T.push({ id: "sgarbossa", name: "Sgarbossa (Smith)", desc: "Nhồi máu cấp trên nền LBBB hoặc nhịp tạo nhịp thất.",
    html: `<div class="chk"><label><input type="checkbox" id="c1"> ST chênh lên <b>đồng hướng</b> ≥ 1 mm ở ≥ 1 chuyển đạo (chuyển đạo có QRS dương)</label>
      <label><input type="checkbox" id="c2"> ST chênh xuống <b>đồng hướng</b> ≥ 1 mm ở ≥ 1 chuyển đạo V1–V3</label></div>
      <h4>Tiêu chuẩn 3 — ST chênh lên bất hoà quá mức (chuyển đạo có QRS âm)</h4>
      <div class="fgrid">${inp("st", "ST chênh lên tại điểm J (mm)", "vd 4")}${inp("s", "Độ sâu sóng S đứng trước (mm)", "vd 14")}</div>
      <div id="out" class="out"></div>
      <p class="muted small">Sgarbossa gốc: đồng hướng chênh lên 5 điểm; đồng hướng chênh xuống V1–V3 3 điểm; bất hoà ≥ 5 mm 2 điểm (≥ 3 điểm có ý nghĩa). Smith cải tiến thay tiêu chuẩn 3 bằng tỷ lệ ST/S ≤ −0,25 — nhạy hơn.</p>`,
    bind(el) {
      live(el, () => {
        const c1 = el.querySelector("#c1").checked, c2 = el.querySelector("#c2").checked, st = num(el, "st"), s = num(el, "s");
        const ratio = st > 0 && s > 0 ? st / s : NaN;
        const c3 = ratio >= 0.25;
        const pos = c1 || c2 || c3;
        el.querySelector("#out").innerHTML = (isFinite(ratio) ? `<div class="kq"><div><b>${f(-ratio, 2)}</b><span>Tỷ lệ ST/S</span></div></div>` : "") +
          `<div class="note ${pos ? "nguy" : "xanh"}">${pos ? "Smith–Sgarbossa DƯƠNG TÍNH → nghĩ nhồi máu do tắc mạch: hội chẩn can thiệp mạch vành cấp." : "Chưa đạt tiêu chuẩn. Âm tính không loại trừ OMI — ghi lại ECG, troponin, lâm sàng (sốc, đau kéo dài → hội chẩn)."}</div>`;
      });
    } });

  T.push({ id: "lad", name: "Tắc LAD hay tái cực sớm (công thức Smith)", desc: "Công thức 4 biến và 3 biến cho ST chênh lên V2–V4 không rõ ràng.",
    html: `<div class="fgrid">${inp("qtc", "QTc Bazett (ms)", "vd 420")}${inp("qrs2", "Biên độ QRS V2 (mm, R + S)", "vd 25")}${inp("r4", "Biên độ R V4 (mm)", "vd 15")}${inp("st3", "ST chênh lên 60 ms sau J ở V3 (mm)", "vd 2")}</div><div id="out" class="out"></div>
      <p class="muted small">Chỉ áp dụng khi nghi ngờ giữa tái cực sớm và tắc LAD; <b>không</b> dùng khi đã có dấu hiệu rõ (ST chênh lên rõ, soi gương ở thành dưới, T âm/T hai pha V2–V6, sóng Q V2–V4, QRS bất thường, LVH, LBBB). Công thức hỗ trợ — không thay thế đánh giá lâm sàng và ECG lặp lại.</p>`,
    bind(el) {
      live(el, () => {
        const q = num(el, "qtc"), a = num(el, "qrs2"), r = num(el, "r4"), s = num(el, "st3"), o = el.querySelector("#out");
        if (![q, r, s].every(isFinite)) { o.innerHTML = ""; return; }
        const v3 = 1.196 * s + 0.059 * q - 0.326 * r;
        let h = `<div class="kq"><div><b>${f(v3, 2)}</b><span>3 biến (ngưỡng 23,4)</span></div>`;
        let v4 = NaN;
        if (isFinite(a)) { v4 = 0.052 * q - 0.151 * a - 0.268 * r + 1.062 * s; h += `<div><b>${f(v4, 2)}</b><span>4 biến (ngưỡng 18,2)</span></div>`; }
        h += "</div>";
        const lad = isFinite(v4) ? v4 > 18.2 : v3 > 23.4;
        h += `<div class="note ${lad ? "nguy" : "xanh"}">${lad ? "Gợi ý TẮC LAD — hội chẩn can thiệp, ghi lại ECG." : "Gợi ý tái cực sớm — vẫn ghi ECG lặp lại nếu lâm sàng nghi ngờ."}</div>`;
        o.innerHTML = h;
      });
    } });

  T.push({ id: "lvh", name: "Phì đại thất trái", desc: "Sokolow–Lyon và Cornell.",
    html: `<div class="fgrid">${inp("sv1", "S V1 (mm)", "")}${inp("rv5", "R V5 (mm)", "")}${inp("rv6", "R V6 (mm)", "")}${inp("ravl", "R aVL (mm)", "")}${inp("sv3", "S V3 (mm)", "")}<label class="fld"><span>Giới</span><select id="sex"><option value="m">Nam</option><option value="f">Nữ</option></select></label></div><div id="out" class="out"></div>`,
    bind(el) {
      live(el, () => {
        const sv1 = num(el, "sv1"), rv5 = num(el, "rv5"), rv6 = num(el, "rv6"), ravl = num(el, "ravl"), sv3 = num(el, "sv3"), sex = el.querySelector("#sex").value;
        const out = [];
        const rmax = Math.max(isFinite(rv5) ? rv5 : -1, isFinite(rv6) ? rv6 : -1);
        if (isFinite(sv1) && rmax >= 0) { const v = sv1 + rmax; out.push([`Sokolow–Lyon: ${f(v)} mm`, v >= 35]); }
        if (isFinite(ravl)) out.push([`R aVL: ${f(ravl)} mm`, ravl >= 11]);
        if (isFinite(ravl) && isFinite(sv3)) { const v = ravl + sv3, t = sex === "m" ? 28 : 20; out.push([`Cornell: ${f(v)} mm (ngưỡng > ${t})`, v > t]); }
        el.querySelector("#out").innerHTML = out.map(([t, p]) => `<div class="note ${p ? "bay" : "xanh"}">${t} — ${p ? "đạt tiêu chuẩn" : "không đạt"}</div>`).join("") + (out.length ? '<p class="muted small">Tiêu chuẩn điện thế có độ nhạy thấp; người trẻ, gầy dễ dương tính giả. Tìm thêm strain, lớn nhĩ trái.</p>' : "");
      });
    } });

  function stepper(steps, endVT, endSVT) {
    return {
      html: `<div class="steps"></div>`,
      bind(el) {
        const box = el.querySelector(".steps");
        let i = 0;
        const draw = () => {
          let h = steps.slice(0, i + 1).map((s, k) => `<div class="step ${k < i ? "done" : ""}"><div class="sn">${k + 1}</div><div><b>${s[0]}</b><div class="muted small">${s[1]}</div>${k === i ? `<div class="row" style="margin-top:8px"><button class="btn nguy-b" data-a="y">Có → VT</button><button class="btn" data-a="n">Không → bước tiếp</button></div>` : '<div class="small">→ Không</div>'}</div></div>`).join("");
          box.innerHTML = h;
          box.querySelectorAll("button").forEach((b) => b.onclick = () => {
            if (b.dataset.a === "y") box.innerHTML += `<div class="note nguy">${endVT}</div><button class="btn" data-r>Làm lại</button>`;
            else if (i < steps.length - 1) { i++; draw(); return; }
            else box.innerHTML += `<div class="note bay">${endSVT}</div><button class="btn" data-r>Làm lại</button>`;
            box.querySelectorAll("button[data-a]").forEach((x) => (x.disabled = true));
            box.querySelector("[data-r]").onclick = () => { i = 0; draw(); };
          });
        };
        draw();
      }
    };
  }
  const br = stepper([
    ["Không có phức bộ RS ở mọi chuyển đạo trước tim?", "Tất cả V1–V6 là R đơn thuần, QS hoặc qR (không có rS/RS)."],
    ["Khoảng từ đầu R đến đáy S > 100 ms ở bất kỳ chuyển đạo trước tim nào?", "Đo ở chuyển đạo có RS."],
    ["Có phân ly nhĩ thất?", "P độc lập, nhát bắt được, nhát hỗn hợp."],
    ["Tiêu chuẩn hình thái VT ở cả V1–V2 và V6?", "Dạng RBBB: V1 R đơn pha/qR/Rr’ (R trái cao hơn), V6 R/S < 1 hoặc QS/qR. Dạng LBBB: V1–V2 r rộng > 30 ms, khía nhánh xuống S, R–đáy S > 60 ms; V6 qR/QS."]
  ], "Chẩn đoán VT (thuật toán Brugada). Xử trí như VT.", "Ủng hộ SVT dẫn truyền lệch hướng — nhưng nếu bệnh tim cấu trúc/không chắc chắn vẫn xử trí như VT.");
  T.push({ id: "brugada-alg", name: "Thuật toán Brugada (VT hay SVT)", desc: "4 bước cho nhịp nhanh QRS rộng đều.", html: br.html, bind: br.bind });
  const vk = stepper([
    ["Sóng R khởi đầu ở aVR?", "QRS ở aVR bắt đầu bằng sóng dương (R hoặc Rs)."],
    ["Sóng r hoặc q khởi đầu ở aVR rộng > 40 ms?", ""],
    ["Có khía ở nhánh xuống của QRS âm ưu thế ở aVR?", ""],
    ["vi/vt ≤ 1?", "vi: biên độ dịch chuyển trong 40 ms đầu; vt: trong 40 ms cuối của QRS ở aVR."]
  ], "Chẩn đoán VT (thuật toán aVR – Vereckei).", "Ủng hộ SVT — vẫn xử trí như VT nếu không chắc chắn.");
  T.push({ id: "avr-alg", name: "Thuật toán aVR (Vereckei)", desc: "Chỉ dùng chuyển đạo aVR.", html: vk.html, bind: vk.bind });

  root.TOOLS = T;
})(typeof window !== "undefined" ? window : globalThis);

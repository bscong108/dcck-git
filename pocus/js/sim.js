/* Mô phỏng hình siêu âm bằng canvas (sơ đồ động để học, không phải ảnh bệnh nhân thật).
   Mỗi cảnh vẽ "bản đồ hồi âm" (xám 0 = trống âm … 1 = tăng âm) lên một canvas nửa độ phân giải,
   sau đó nhân với nền hạt (speckle), suy giảm theo độ sâu và cắt theo hình quạt của đầu dò. */
(function () {
  "use strict";
  const W = 480, H = 360;
  const GEO = {
    // đầu dò cong (convex): quạt rộng, đỉnh ở trên ngoài màn hình
    cong: { kieu: "quat", ax: 240, ay: -90, r0: 105, r1: 446, goc: 0.56, tren: 15, duoi: 356 },
    // đầu dò tim (phased array): quạt hẹp ở đỉnh
    tim: { kieu: "quat", ax: 240, ay: 8, r0: 0, r1: 348, goc: 0.76, tren: 8, duoi: 356 },
    // đầu dò thẳng (linear): hình chữ nhật
    thang: { kieu: "chu", x0: 80, x1: 400, tren: 10, duoi: 352 },
  };

  /* ---------- Số ngẫu nhiên có hạt giống ---------- */
  function rng(seed) { let s = (seed % 2147483646) + 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

  /* ---------- Nền hạt dùng chung ---------- */
  let HAT = null;
  function nenHat() {
    if (HAT) return HAT;
    const nho = document.createElement("canvas"); nho.width = 480; nho.height = 240;
    const x = nho.getContext("2d"); const img = x.createImageData(480, 240); const r = rng(7);
    for (let i = 0; i < img.data.length; i += 4) {
      const ray = Math.sqrt(-2 * Math.log(r() + 1e-6));
      const v = Math.min(255, Math.round((0.28 + 0.42 * ray) * 255));
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
    }
    x.putImageData(img, 0, 0);
    HAT = document.createElement("canvas"); HAT.width = 2 * W; HAT.height = H;
    const y = HAT.getContext("2d"); y.imageSmoothingEnabled = true; y.drawImage(nho, 0, 0, 2 * W, H);
    return HAT;
  }

  function duongQuat(c, g) {
    c.beginPath();
    if (g.kieu === "chu") { c.rect(g.x0, g.tren, g.x1 - g.x0, g.duoi - g.tren); return; }
    const a0 = Math.PI / 2 - g.goc, a1 = Math.PI / 2 + g.goc;
    if (g.r0 > 0) c.arc(g.ax, g.ay, g.r0, a1, a0, true); else c.moveTo(g.ax, g.ay);
    c.arc(g.ax, g.ay, g.r1, a0, a1, false);
    c.closePath();
  }

  /* ---------- Bộ vẽ cho cảnh ---------- */
  function taoS(c, g) {
    const xam = (v) => { const k = Math.round(Math.max(0, Math.min(1, v)) * 255); return "rgb(" + k + "," + k + "," + k + ")"; };
    const S = {
      c, g, xam, W, H,
      nen(v) { c.fillStyle = xam(v); c.fillRect(-W, -H, 3 * W, 3 * H); },
      elip(x, y, rx, ry, v, rot) { c.beginPath(); c.ellipse(x, y, Math.max(0.5, rx), Math.max(0.5, ry), rot || 0, 0, Math.PI * 2); c.fillStyle = xam(v); c.fill(); },
      vong(x, y, rx, ry, w, v, rot) { c.beginPath(); c.ellipse(x, y, Math.max(0.5, rx), Math.max(0.5, ry), rot || 0, 0, Math.PI * 2); c.lineWidth = w; c.strokeStyle = xam(v); c.stroke(); },
      cungElip(x, y, rx, ry, a0, a1, w, v, rot) { c.beginPath(); c.ellipse(x, y, rx, ry, rot || 0, a0, a1); c.lineWidth = w; c.strokeStyle = xam(v); c.lineCap = "round"; c.stroke(); },
      da(pts, v) { c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.closePath(); c.fillStyle = xam(v); c.fill(); },
      duong(pts, w, v) { c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.lineWidth = w; c.lineJoin = "round"; c.lineCap = "round"; c.strokeStyle = xam(v); c.stroke(); },
      cong(pts, w, v) { // đường cong mượt qua các điểm
        c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length - 1; i++) { const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2; c.quadraticCurveTo(pts[i][0], pts[i][1], mx, my); }
        const l = pts[pts.length - 1]; c.lineTo(l[0], l[1]);
        c.lineWidth = w; c.lineCap = "round"; c.strokeStyle = xam(v); c.stroke();
      },
      cn(x, y, w, h, v) { c.fillStyle = xam(v); c.fillRect(x, y, w, h); },
      /** dải mô theo độ sâu d0..d1 (px tính từ mặt da), uốn theo hình đầu dò */
      dai(d0, d1, v) {
        c.fillStyle = xam(v); c.beginPath();
        if (g.kieu === "chu") { c.rect(-W, g.tren + d0, 3 * W, d1 - d0); }
        else { c.arc(g.ax, g.ay, g.r0 + d1, 0, Math.PI * 2, false); c.arc(g.ax, g.ay, Math.max(0.1, g.r0 + d0), 0, Math.PI * 2, true); }
        c.fill("evenodd");
      },
      /** vạch mảnh song song mặt da (sợi cơ, vách mỡ) */
      vach(d, w, v, hatGiong) {
        const r = rng(hatGiong || 3);
        for (let x = 0; x < W; x += 18 + r() * 30) {
          const len = 20 + r() * 50, dd = d + (r() - 0.5) * 4;
          if (g.kieu === "chu") S.duong([[x, g.tren + dd], [x + len, g.tren + dd + (r() - 0.5) * 3]], w, v);
          else { const a = Math.PI / 2 + ((x - 240) / 240) * g.goc, a2 = a + len / (g.r0 + dd + 1) * 0.9; c.beginPath(); c.arc(g.ax, g.ay, g.r0 + dd, Math.min(a, a2), Math.max(a, a2)); c.lineWidth = w; c.strokeStyle = xam(v); c.stroke(); }
        }
      },
      /** thành ngực/bụng: da, mỡ dưới da, cơ */
      thanh(day) {
        const k = day || 1;
        S.dai(0, 5 * k, 0.62); S.dai(5 * k, 22 * k, 0.2); S.vach(13 * k, 2, 0.45, 11);
        S.dai(22 * k, 26 * k, 0.6); S.dai(26 * k, 44 * k, 0.32); S.vach(32 * k, 2, 0.5, 5); S.vach(39 * k, 2, 0.48, 9); S.dai(44 * k, 47 * k, 0.55);
      },
      /** tia âm từ điểm (x,y): hướng đi ra xa đầu dò */
      tia(x, y) {
        if (g.kieu === "chu") return [0, 1];
        const dx = x - g.ax, dy = y - g.ay, l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l];
      },
      /** bóng lưng sau một đoạn x1..x2 ở độ sâu y */
      bong(x1, y1, x2, y2, k) {
        const t1 = S.tia(x1, y1), t2 = S.tia(x2, y2), L = 900;
        c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.lineTo(x2 + t2[0] * L, y2 + t2[1] * L); c.lineTo(x1 + t1[0] * L, y1 + t1[1] * L); c.closePath();
        c.fillStyle = "rgba(0,0,0," + (k == null ? 0.9 : k) + ")"; c.fill();
      },
      /** tăng âm phía sau cấu trúc chứa dịch */
      tangAm(x1, y, x2, dai, k) {
        const t1 = S.tia(x1, y), t2 = S.tia(x2, y);
        const gr = c.createLinearGradient(0, y, 0, y + dai);
        gr.addColorStop(0, "rgba(255,255,255," + k + ")"); gr.addColorStop(1, "rgba(255,255,255,0)");
        c.save(); c.globalCompositeOperation = "lighter";
        c.beginPath(); c.moveTo(x1, y); c.lineTo(x2, y); c.lineTo(x2 + t2[0] * dai, y + t2[1] * dai); c.lineTo(x1 + t1[0] * dai, y + t1[1] * dai); c.closePath();
        c.fillStyle = gr; c.fill(); c.restore();
      },
      /** khối bờ không đều */
      khoi(x, y, r, v, hatGiong, bien, rx2) {
        const rr = rng(hatGiong || 1), n = 22, pts = [], ph = [rr() * 6, rr() * 6, rr() * 6];
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2;
          const k = 1 + (bien || 0.15) * (Math.sin(3 * a + ph[0]) * 0.5 + Math.sin(5 * a + ph[1]) * 0.3 + Math.sin(7 * a + ph[2]) * 0.2);
          pts.push([x + Math.cos(a) * (rx2 || r) * k, y + Math.sin(a) * r * k]);
        }
        S.da(pts, v);
      },
      /** chấm hồi âm rải rác (máu đông, cặn) */
      hat(x0, y0, x1, y1, n, v, hatGiong, co) {
        const r = rng(hatGiong || 2); c.fillStyle = xam(v);
        for (let i = 0; i < n; i++) { c.beginPath(); c.ellipse(x0 + r() * (x1 - x0), y0 + r() * (y1 - y0), (co || 3) * (0.6 + r()), (co || 3) * 0.6, 0, 0, 7); c.fill(); }
      },
      /** vẽ trong vùng cắt (clip) */
      trong(vePath, fn) { c.save(); c.beginPath(); vePath(c); c.clip(); fn(); c.restore(); },
    };
    return S;
  }

  /* ---------- Nhịp tim, nhịp thở ---------- */
  const NHIP = 0.8, THO = 4;
  /** mức co bóp thất 0 (tâm trương) … 1 (cuối tâm thu) */
  function tamThu(t, chuKy) { const T = chuKy || NHIP, ph = ((t % T) + T) % T / T; return ph < 0.38 ? Math.sin((Math.PI * ph) / 0.38) : 0; }
  /** mức hít vào 0 … 1 */
  function hitVao(t) { const ph = ((t % THO) + THO) % THO / THO; return ph < 0.4 ? Math.sin((Math.PI * ph) / 0.4) : 0; }
  const so = (x, n) => x.toFixed(n == null ? 1 : n).replace(".", ",");

  /* =====================================================================
     CẢNH
     ===================================================================== */
  const C = {};

  /* ----- Hạ sườn phải: khoang Morison (mặt cắt đứng ngang, đầu ở trái màn hình) ----- */
  C.ruq = {
    ten: "Hạ sườn phải: khoang gan – thận (Morison)", dau: "cong", sau: 16,
    ve(S, t, p) {
      const c = S.c, th = hitVao(t), dx = th * 10;
      S.nen(0.1);
      c.save(); c.translate(dx, 0);
      const coHoanh = []; for (let a = -1.05; a <= 0.9; a += 0.05) coHoanh.push([20 + 165 * Math.cos(a), 205 + 165 * Math.sin(a)]);
      // phía trên cơ hoành: phổi (ảnh gương) hoặc dịch màng phổi
      S.da([[-60, 0], [coHoanh[0][0], -20]].concat(coHoanh).concat([[-60, 400]]), p.mp ? 0 : 0.42);
      if (p.mp) {
        const s = Math.sin(t * 1.6) * 6;
        S.da([[-20, 30], [95 + s, 60], [120 + s, 95], [70 + s, 120], [-20, 140]], 0.58); // phổi xẹp bập bềnh
        S.hat(10, 150, 120, 320, p.mp === 2 ? 40 : 0, 0.35, 9, 2);
      }
      // gan
      const gan = coHoanh.slice(0, 38).concat([[200, 262], [300, 222], [400, 204], [520, 182], [520, 0], [100, 0]]);
      S.da(gan, 0.5);
      S.hat(170, 60, 480, 200, 20, 0.62, 4, 4); // mạch máu nhỏ trong gan
      S.elip(330, 120, 14, 9, 0, 0.3); S.vong(330, 120, 14, 9, 3, 0.8, 0.3); // nhánh TM cửa
      S.elip(250, 150, 10, 7, 0, -0.2);
      // dịch khoang Morison
      if (p.dich) {
        const k = p.dich === 2 ? 1.6 : 1;
        S.duong([[160, 300], [205, 262], [300, 228], [400, 210], [520, 188]], 12 * k, 0);
        S.da([[430, 195], [520, 170], [520, 235], [470, 225]], 0);
        S.elip(305, 276, 112, 50 + 6 * k, 0, -0.12);
      }
      // thận phải
      S.elip(305, 276, 106, 46, 0.72, -0.12);
      S.elip(305, 276, 100, 41, 0.36, -0.12);
      for (let i = 0; i < 7; i++) { const a = -2.6 + i * 0.75; S.elip(305 + Math.cos(a) * 66, 276 + Math.sin(a) * 25, 11, 8, 0.2, a); }
      S.khoi(305, 277, 17, 0.84, 5, 0.2, 58);
      // cơ thắt lưng, cột sống
      S.da([[180, 330], [520, 310], [520, 400], [150, 400]], 0.27);
      for (let x = p.mp ? -10 : 175; x < 470; x += 46) { S.cn(x, 336, 32, 7, 0.95); S.bong(x, 343, x + 32, 343, 0.85); }
      // cơ hoành
      S.cong(coHoanh, 7, 0.95);
      c.restore();
      S.thanh(1);
    },
    nhan(t, p) {
      const dx = hitVao(t) * 10;
      const n = [[300 + dx, 120, "Gan"], [305 + dx, 282, "Thận phải"], [118 + dx, 248, "Cơ hoành"]];
      n.push(p.mp ? [55 + dx, 200, p.mp === 2 ? "Máu màng phổi" : "Dịch màng phổi"] : [60 + dx, 170, "Phổi (ảnh gương)"]);
      if (p.mp) n.push([60 + dx, 330, "Cột sống trên cơ hoành"]);
      if (p.dich) { n.push([258 + dx, 226, "Dịch khoang Morison"]); n.push([455 + dx, 202, "Dịch đầu dưới gan"]); }
      else n.push([258 + dx, 232, "Khoang Morison"]);
      return n;
    },
  };

  /* ----- Hạ sườn trái: quanh lách ----- */
  C.luq = {
    ten: "Hạ sườn trái: quanh lách", dau: "cong", sau: 15,
    ve(S, t, p) {
      const c = S.c, dx = hitVao(t) * 8;
      S.nen(0.12);
      c.save(); c.translate(dx, 0);
      const coHoanh = []; for (let a = -1.0; a <= 0.95; a += 0.05) coHoanh.push([-10 + 175 * Math.cos(a), 190 + 175 * Math.sin(a)]);
      S.da([[-60, 0], [coHoanh[0][0], -20]].concat(coHoanh).concat([[-60, 400]]), p.mp ? 0 : 0.42);
      // dịch dưới hoành
      if (p.dich) S.cong(coHoanh.slice(4, 32).map((q) => [q[0] + 12, q[1]]), p.dich === 2 ? 26 : 16, 0);
      // lách
      const lach = coHoanh.slice(5, 30).map((q) => [q[0] + 22, q[1]]).concat([[250, 262], [330, 232], [350, 170], [300, 105]]);
      S.da(lach, 0.52); S.hat(190, 120, 320, 230, 6, 0.65, 8, 4);
      if (p.dich) { S.duong([[230, 270], [300, 245], [345, 236]], p.dich === 2 ? 16 : 9, 0); }
      // thận trái
      S.elip(330, 286, 96, 40, 0.72, -0.05); S.elip(330, 286, 90, 36, 0.36, -0.05);
      for (let i = 0; i < 6; i++) { const a = -2.5 + i * 0.85; S.elip(330 + Math.cos(a) * 58, 286 + Math.sin(a) * 22, 10, 7, 0.2, a); }
      S.khoi(330, 287, 15, 0.84, 9, 0.2, 52);
      // ruột, khí
      S.elip(420, 150, 60, 40, 0.38); S.cungElip(420, 150, 60, 40, 3.6, 5.8, 5, 0.95); S.bong(375, 125, 465, 125, 0.6);
      for (let x = 210; x < 470; x += 46) { S.cn(x, 338, 30, 7, 0.9); S.bong(x, 345, x + 30, 345, 0.85); }
      S.cong(coHoanh, 7, 0.95);
      c.restore();
      S.thanh(1);
    },
    nhan(t, p) {
      const dx = hitVao(t) * 8;
      const n = [[255 + dx, 175, "Lách"], [330 + dx, 292, "Thận trái"], [130 + dx, 270, "Cơ hoành"], [420 + dx, 112, "Khí ruột"]];
      n.push(p.mp ? [50 + dx, 190, "Dịch màng phổi"] : [55 + dx, 170, "Phổi (ảnh gương)"]);
      if (p.dich) { n.push([165 + dx, 92, "Dịch dưới hoành"]); n.push([300 + dx, 232, "Dịch lách – thận"]); }
      return n;
    },
  };

  /* ----- Chậu hông: mặt cắt dọc trên xương mu ----- */
  C.chau = {
    ten: "Chậu hông: mặt cắt dọc trên xương mu", dau: "cong", sau: 14,
    ve(S, t, p) {
      S.nen(0.3);
      S.hat(0, 60, 480, 360, 30, 0.45, 12, 5);
      // ruột phía sau
      S.da([[0, 300], [480, 290], [480, 400], [0, 400]], 0.36);
      S.cungElip(330, 330, 70, 25, 3.3, 6.1, 5, 0.9); S.bong(270, 318, 390, 318, 0.55);
      if (p.nu) { // tử cung phía sau bàng quang
        S.elip(215, 262, 120, 44, 0.42, -0.22); S.duong([[120, 290], [215, 262], [315, 232]], 5, 0.72);
      } else { // tiền liệt tuyến, trực tràng
        S.elip(355, 248, 50, 36, 0.4); S.elip(180, 272, 70, 22, 0.35); S.cungElip(180, 272, 70, 22, 3.4, 6.0, 4, 0.8);
      }
      if (p.dich) {
        const k = p.dich === 2 ? 1.5 : 1;
        if (p.nu) S.da([[200, 312], [300, 288], [340, 292], [260, 330 + 8 * k], [150, 335]], 0);
        else S.da([[95, 220], [175, 222 - 6 * k], [240, 240], [200, 248 + 6 * k], [110, 255]], 0);
        if (k > 1) { S.da([[60, 150], [120, 120], [125, 200], [70, 215]], 0); S.elip(85, 168, 26, 16, 0.38); }
      }
      // bàng quang
      const bq = []; for (let a = 0; a < Math.PI * 2; a += 0.12) { const cs = Math.cos(a), sn = Math.sin(a); bq.push([245 + 118 * Math.sign(cs) * Math.pow(Math.abs(cs), 0.8), 152 + 70 * Math.sign(sn) * Math.pow(Math.abs(sn), 0.8)]); }
      S.da(bq, 0.68); S.da(bq.map((q) => [245 + (q[0] - 245) * 0.96, 152 + (q[1] - 152) * 0.94]), 0);
      S.tangAm(140, 222, 350, 90, 0.18);
      S.thanh(1.1);
    },
    nhan(t, p) {
      const n = [[245, 150, "Bàng quang"], [p.nu ? 215 : 355, p.nu ? 258 : 252, p.nu ? "Tử cung" : "Tiền liệt tuyến"], [330, 352, "Ruột"]];
      if (p.dich) n.push(p.nu ? [250, 316, "Dịch túi cùng Douglas"] : [160, 236, "Dịch túi cùng trực tràng – bàng quang"]);
      n.push([300, 214, "Tăng âm phía sau"]);
      return n;
    },
  };

  /* ----- Dưới mũi ức (dưới sườn) 4 buồng ----- */
  C.duoiUc = {
    ten: "Dưới mũi ức: 4 buồng tim", dau: "tim", sau: 18, mau: "R",
    ve(S, t, p) {
      const c = S.c;
      let s = tamThu(t), bien = 1;
      if (p.ngung === "dung") s = 0; else if (p.ngung === "rung") s = 0.06 * (0.5 + 0.5 * Math.sin(t * 47) * Math.sin(t * 13)); else if (p.ngung === "yeu") bien = 0.18;
      s *= bien;
      const lac = p.dich === 2 ? 14 * Math.sin((2 * Math.PI * t) / (NHIP * 2)) : 0;
      S.nen(0.1);
      // gan ở trường gần
      S.da([[-20, 8], [500, 8], [500, 72], [380, 96], [250, 108], [140, 120], [-20, 150]], 0.5);
      S.hat(0, 15, 480, 110, 12, 0.62, 3, 4);
      c.save(); c.translate(240 + lac, 215); c.rotate(-0.28);
      // màng ngoài tim và dịch
      const rx = 176, ry = 104;
      if (p.dich) S.elip(0, 0, rx, ry, 0);
      const k = p.dich === 2 ? 0.8 : p.dich ? 0.88 : 0.97;
      S.elip(0, 0, rx * k, ry * k, 0.38);
      if (p.dich && p.dongMau) S.hat(-150, 50, 150, 95, 40, 0.42, 21, 4);
      // buồng tim
      const ep = p.chen ? 0.25 + 0.75 * s : 1; // ép tim: thất phải xẹp trong tâm trương
      S.elip(-8, -55 * k, 108 * k * (1 - 0.12 * s), 27 * k * (1 - 0.3 * s) * ep, 0);
      S.elip(52 * k, 20 * k, 92 * k * (1 - 0.2 * s), 40 * k * (1 - 0.35 * s), 0);
      S.elip(-78 * k, 40 * k, 44 * k * (0.86 + 0.2 * s), 32 * k * (0.86 + 0.2 * s) * (p.chen ? 0.5 + 0.5 * s : 1), 0);
      S.elip(-8 * k, 72 * k, 44 * k * (0.86 + 0.18 * s), 24 * k, 0);
      // van nhĩ thất
      const mo = 1 - s;
      S.duong([[-46 * k, 12 * k], [-46 * k + 18 * mo, 12 * k - 22 * mo - 6]], 3, 0.85);
      S.duong([[16 * k, 46 * k], [16 * k + 22 * mo, 46 * k - 18 * mo - 6]], 3, 0.85);
      if (p.ngung === "dung") S.hat(-60, -80, 120, 50, 26, 0.18, 31 + Math.floor(t * 2), 3);
      S.vong(0, 0, rx, ry, 6, 0.95);
      c.restore();
      S.thanh(0.55);
    },
    nhan(t, p) {
      const n = [[120, 52, "Gan"], [224, 170, "Thất phải"], [300, 236, "Thất trái"], [160, 268, "Nhĩ phải"], [236, 298, "Nhĩ trái"]];
      if (p.dich) n.push([400, 150, p.dongMau ? "Máu màng tim (có cục đông)" : "Dịch màng ngoài tim"]); else n.push([418, 182, "Màng ngoài tim"]);
      if (p.chen) n.push([110, 170, "Thất phải xẹp thì tâm trương"]);
      return n;
    },
  };

  /* ----- Cạnh ức trục dọc ----- */
  C.canhUcDoc = {
    ten: "Cạnh ức trục dọc (PSLA)", dau: "tim", sau: 16, mau: "R",
    ve(S, t, p) {
      const giam = p.ef === "giam", tang = p.ef === "tang";
      const s = tamThu(t, tang ? 0.55 : NHIP) * (giam ? 0.14 : tang ? 1.25 : 1);
      S.nen(0.1);
      S.thanh(0.6);
      S.dai(28, 40, 0.4); // thành tự do thất phải
      S.da([[40, 42], [420, 40], [420, 92], [40, 108]], 0); // thất phải (đường ra)
      if (p.dich) { S.dai(25, 31, 0); }
      // ĐMC xuống, dịch màng phổi (sau ĐMC)
      const dyA = p.dich ? 16 : 0;
      if (p.mp) S.da([[150, 300], [480, 280], [480, 360], [150, 360]], 0);
      S.elip(330, 266 + dyA, 18, 17, 0); S.vong(330, 266 + dyA, 18, 17, 3, 0.72);
      // màng ngoài tim (đi trước ĐMC xuống)
      const ry = giam ? 64 : 44, rx = giam ? 165 : 142;
      const day = giam ? 18 : 24 + 10 * s;
      if (p.dich) S.da([[20, 215 + 4], [180, 232], [300, 232], [318, 240], [300, 258], [180, 264], [20, 252]], 0);
      S.elip(185, 160, rx + day + 6, ry * (1 - 0.3 * s) + day + 24, 0.42, -0.04);
      S.elip(185, 160, rx * (1 - 0.12 * s), ry * (1 - 0.34 * s), 0, -0.04);
      // gốc ĐMC, nhĩ trái
      S.da([[320, 88], [480, 84], [480, 132], [320, 134]], 0);
      S.duong([[300, 88], [480, 84]], 4, 0.82); S.duong([[300, 134], [480, 132]], 4, 0.82);
      const vc = 4 + 18 * s; S.duong([[345, 111 - vc], [372, 111 - vc]], 2, 0.85); S.duong([[345, 111 + vc], [372, 111 + vc]], 2, 0.85);
      S.elip(392, 205, 72, 42, 0);
      // van hai lá
      const mo = Math.max(0, 1 - 1.6 * s), giamMo = giam ? 0.35 : 1;
      const lt = [300 - 55 * mo * giamMo, 185 - 62 * mo * giamMo];
      S.duong([[318, 136], [lt[0], lt[1]]], 4, 0.85);
      S.duong([[336, 216], [300 - 20 * mo * giamMo, 186 + 18 * mo * giamMo]], 4, 0.8);
      const ngoai = p.dich ? 264 : 242;
      S.cong([[10, ngoai - 22], [120, ngoai - 4], [220, ngoai], [300, ngoai - 4], [350, 238], [430, 232], [480, 228]], 6, 0.95);
    },
    nhan(t, p) {
      const n = [[220, 66, "Thất phải"], [170, 160, "Thất trái"], [400, 110, "Gốc ĐMC"], [395, 206, "Nhĩ trái"], [330, 293 + (p.dich ? 16 : 0), "ĐMC ngực xuống"], [250, 182, "Van hai lá"]];
      if (p.dich) n.push([150, 252, "Dịch màng tim (trước ĐMC xuống)"]);
      if (p.mp) n.push([400, 332, "Dịch màng phổi (sau ĐMC xuống)"]);
      if (p.ef === "giam") n.push([228, 112, "EPSS lớn"]);
      return n;
    },
  };

  /* ----- Cạnh ức trục ngắn (mức cơ nhú) ----- */
  C.canhUcNgang = {
    ten: "Cạnh ức trục ngắn (PSSA) mức cơ nhú", dau: "tim", sau: 16, mau: "R",
    ve(S, t, p) {
      const c = S.c, s = tamThu(t) * (p.ef === "giam" ? 0.15 : 1);
      S.nen(0.1); S.thanh(0.6);
      const rvx = p.rv ? 168 : 118, rvy = p.rv ? 72 : 46;
      S.elip(185, 112, rvx, rvy, 0.4, 0.38); S.elip(185, 112, rvx - 14, rvy - 14, 0, 0.38);
      S.elip(255, 192, 90, 90, 0.42);
      const r0 = (p.ef === "giam" ? 70 : 58) * (1 - 0.36 * s), pts = [], ds = p.rv ? 0.5 : 0, as = -2.25;
      for (let a = 0; a < Math.PI * 2; a += 0.08) { const f = 1 - ds * Math.pow(Math.max(0, Math.cos(a - as)), 3); pts.push([255 + Math.cos(a) * r0 * f, 192 + Math.sin(a) * r0 * f]); }
      S.da(pts, 0);
      const cn = 11 * (1 + 0.4 * s);
      S.elip(255 + Math.cos(0.75) * r0 * 0.62, 192 + Math.sin(0.75) * r0 * 0.62, cn, cn * 0.8, 0.44);
      S.elip(255 + Math.cos(2.35) * r0 * 0.62, 192 + Math.sin(2.35) * r0 * 0.62, cn, cn * 0.8, 0.44);
      S.vong(240, 176, 196, 132, 5, 0.9, 0.12);
      c.globalAlpha = 1;
    },
    nhan(t, p) {
      const n = [[150, 92, "Thất phải"], [255, 190, "Thất trái"], [330, 248, "Cơ nhú"]];
      if (p.rv) n.push([200, 160, "Vách dẹt: dấu D"]);
      return n;
    },
  };

  /* ----- Mỏm 4 buồng ----- */
  C.mom4 = {
    ten: "Mỏm tim 4 buồng (A4C)", dau: "tim", sau: 18, mau: "R",
    ve(S, t, p) {
      const giam = p.ef === "giam", rv = !!p.rv;
      const s = tamThu(t) * (giam ? 0.2 : 1);
      const vong = 250 - (giam ? 8 : 22) * s, vong3 = 258 - (rv ? 10 : 34) * tamThu(t);
      S.nen(0.1); S.thanh(0.45);
      if (p.dich) S.elip(242, 185, 175, 160, 0);
      const lvx = (rv ? 40 : giam ? 62 : 52) * (1 - 0.22 * s), rvx = (rv ? 78 : 40) * (1 - (rv ? 0.06 : 0.2) * tamThu(t));
      const lvC = [292, (40 + vong) / 2], rvC = [rv ? 170 : 190, (48 + vong3) / 2];
      S.elip(lvC[0], lvC[1], lvx + 18, (vong - 40) / 2 + 14, 0.4, 0.1);
      S.elip(rvC[0], rvC[1], rvx + 9, (vong3 - 48) / 2 + 10, 0.38, -0.15);
      S.elip(296, vong + 46, 54, 44, 0.38); S.elip(190, vong3 + 40, 48, 42, 0.38);
      S.elip(lvC[0], lvC[1], lvx, (vong - 40) / 2, 0, 0.1);
      S.elip(rvC[0], rvC[1], rvx, (vong3 - 48) / 2, 0, -0.15);
      S.elip(298, vong + 46, 48, 38, 0); S.elip(188, vong3 + 40, 42, 36, 0);
      S.duong([[240, 60], [242, vong + 20]], 12, 0.42); // vách liên thất
      S.duong([[242, vong + 4], [244, vong + 90]], 7, 0.42); // vách liên nhĩ
      const mo = Math.max(0, 1 - 1.6 * s);
      S.duong([[250, vong], [262 + 12 * mo, vong - 30 * mo]], 3, 0.85); S.duong([[345, vong], [330 - 10 * mo, vong - 30 * mo]], 3, 0.85);
      S.duong([[232, vong3], [220 - 10 * mo, vong3 - 28 * mo]], 3, 0.85); S.duong([[rv ? 110 : 145, vong3], [rv ? 125 : 158 + 10 * mo, vong3 - 28 * mo]], 3, 0.85);
      S.cong([[60, 330], [70, 200], [140, 70], [240, 32], [340, 70], [400, 200], [410, 330]], 5, 0.9);
    },
    nhan(t, p) {
      const n = [[p.rv ? 165 : 190, 140, "Thất phải"], [295, 140, "Thất trái"], [188, 302, "Nhĩ phải"], [298, 300, "Nhĩ trái"]];
      if (p.rv) n.push([190, 210, "TP > TT"]);
      if (p.dich) n.push([420, 120, "Dịch màng tim"]);
      return n;
    },
    phu(c, t, p, m) {
      if (!p.do) return;
      const mapse = p.ef === "giam" ? 4 : 11.4, tapse = p.rv ? 5.2 : 17.6;
      c.save(); c.font = "600 12px system-ui, sans-serif"; c.fillStyle = "#f2c94c"; c.strokeStyle = "#f2c94c"; c.setLineDash([4, 4]);
      const y1 = m(0, 250)[1], y3 = m(0, 258)[1];
      const a = m(345, 250), b = m(145, 258);
      c.beginPath(); c.moveTo(a[0] + 10, y1); c.lineTo(a[0] + 40, y1); c.stroke();
      c.beginPath(); c.moveTo(b[0] - 40, y3); c.lineTo(b[0] - 10, y3); c.stroke();
      c.setLineDash([]); c.fillText("MAPSE ≈ " + so(mapse, 0) + " mm", a[0] - 30, y1 + 22); c.fillText("TAPSE ≈ " + so(tapse, 0) + " mm", Math.max(84, b[0] - 70), y3 + 22);
      c.restore();
    },
  };

  /* ----- Tĩnh mạch chủ dưới trục dọc ----- */
  const KIEU_IVC = { bt: [1.9, 0.75], gian: [2.5, 2.4], xep: [1.1, 0.2] };
  function dkIVC(t, p) { const k = KIEU_IVC[p.kieu || "bt"]; return k[0] - (k[0] - k[1]) * hitVao(t); }
  C.ivc = {
    ten: "Tĩnh mạch chủ dưới trục dọc", dau: "cong", sau: 16,
    ve(S, t, p) {
      const ppc = (356 - 15) / 16, d = dkIVC(t, p) * ppc, y = 225;
      S.nen(0.5); S.hat(60, 40, 480, 200, 18, 0.64, 6, 4);
      S.da([[-20, 300], [480, 290], [480, 400], [-20, 400]], 0.3);
      S.elip(30, 222, 70, 60, 0); S.vong(30, 222, 70, 60, 4, 0.7);
      S.da([[200, 110], [222, 120], [168, 220], [140, 215]], 0); // tĩnh mạch gan
      S.da([[70, y - d / 2 - 10], [470, y - d / 2], [470, y + d / 2], [70, y + d / 2 + 10]], 0);
      S.duong([[70, y - d / 2 - 10], [470, y - d / 2]], 3, 0.78); S.duong([[70, y + d / 2 + 10], [470, y + d / 2]], 3, 0.78);
      S.thanh(1);
    },
    nhan() { return [[30, 222, "Nhĩ phải"], [300, 120, "Gan"], [192, 148, "TM gan"], [380, 225, "TMC dưới"]]; },
    phu(c, t, p, m) {
      const ppc = (356 - 15) / 16, d = dkIVC(t, p), x = 130 + 1.5 * ppc;
      const a = m(x, 225 - (d * ppc) / 2), b = m(x, 225 + (d * ppc) / 2);
      c.save(); c.strokeStyle = "#f2c94c"; c.fillStyle = "#f2c94c"; c.lineWidth = 1.5;
      c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
      [a, b].forEach((q) => { c.beginPath(); c.moveTo(q[0] - 6, q[1]); c.lineTo(q[0] + 6, q[1]); c.stroke(); });
      const k = KIEU_IVC[p.kieu || "bt"], xep = Math.round(((k[0] - k[1]) / k[0]) * 100);
      c.font = "600 12px system-ui, sans-serif";
      c.fillText("Đường kính hiện tại " + so(d) + " cm", 150, 320);
      c.fillText("Dmax " + so(k[0]) + " · Dmin " + so(k[1]) + " cm → xẹp " + xep + "%", 150, 338);
      c.restore();
    },
  };

  /* ----- Phổi: đầu dò thẳng, dọc qua 2 xương sườn ----- */
  const truotPhoi = (t, p) => (p.truot === false ? 0 : 9 * Math.sin((2 * Math.PI * t) / THO));
  const diemPhoi = (t) => 225 + 55 * Math.sin((2 * Math.PI * t) / THO);
  C.phoi = {
    ten: "Phổi trước: đầu dò thẳng dọc qua hai xương sườn", dau: "thang", sau: 8,
    truot: { y: 88, dx: truotPhoi, x1: (t, p) => (p.diem ? diemPhoi(t) : 400) },
    ve(S, t, p) {
      const dx = truotPhoi(t, p), yp = 88;
      S.nen(0.07);
      S.thanh(1.15);
      // đường A (dội lại)
      const cuongA = p.b ? 0.12 : 1;
      [[164, 0.6], [240, 0.42], [316, 0.28]].forEach((a) => S.duong([[140, a[0] + 2], [340, a[0] + 2]], 4, a[1] * cuongA));
      // đường B
      if (p.b) {
        const n = p.b, r = rng(4);
        for (let i = 0; i < n; i++) {
          const x = 140 + ((i + 0.5) / n) * 200 + (r() - 0.5) * 20 + (p.diem ? 0 : dx);
          S.da([[x - 4, yp], [x + 4, yp], [x + 5, 360], [x - 5, 360]], n >= 8 ? 0.6 : 0.85);
        }
      }
      // màng phổi
      const r = rng(2), x1 = p.diem ? diemPhoi(t) : 400;
      for (let x = 112; x < 368; x += 3) {
        const di = x < x1 ? dx : 0, v = 0.62 + 0.35 * Math.abs(Math.sin((x - di) * 0.37) * Math.cos((x - di) * 0.11));
        S.cn(x, yp - 2 + (r() - 0.5) * 1.5, 3, 4, v);
      }
      // xương sườn và bóng lưng
      [105, 375].forEach((x) => { S.cungElip(x, 82, 44, 18, Math.PI * 1.05, Math.PI * 1.95, 7, 0.95); S.bong(x - 44, 80, x + 44, 80, 0.94); });
    },
    nhan(t, p) {
      const n = [[105, 54, "Xương sườn"], [105, 230, "Bóng lưng"], [240, 74, "Đường màng phổi"]];
      if (!p.b) n.push([240, 162, "Đường A"]);
      else n.push([240, 250, p.b >= 8 ? "Đường B hợp lưu (phổi trắng)" : "Đường B"]);
      if (p.diem) n.push([diemPhoi(t), 120, "Điểm phổi"]);
      return n;
    },
  };

  /* ----- M-mode phổi ----- */
  C.mPhoi = {
    ten: "M-mode màng phổi", dau: "thang", sau: 8, kieu: "m",
    khoiTao() {
      const r = rng(17), tinh = new Float32Array(H);
      for (let y = 0; y < H; y++) {
        let v = 0.06 + r() * 0.08;
        if (y < 14) v = 0.7; else if (y < 34) v = 0.2 + r() * 0.15; else if (y < 38) v = 0.6; else if (y < 62) v = 0.3 + r() * 0.2; else if (y < 66) v = 0.55; else if (y < 86) v = 0.28 + r() * 0.15;
        else if (y < 92) v = 0.95;
        else if (Math.abs(y - 166) < 3) v = 0.55; else if (Math.abs(y - 242) < 3) v = 0.4; else if (Math.abs(y - 318) < 3) v = 0.28;
        tinh[y] = v;
      }
      return tinh;
    },
    cot(y, t, p, r, tinh) {
      if (y < 92) return tinh[y] * (0.85 + 0.3 * r());
      const truot = p.truot === false ? false : p.diem ? hitVao(t) > 0.15 : true;
      if (truot) return 0.12 + 0.5 * r() * r() + (Math.abs(y - 166) < 3 ? 0.05 : 0);
      return tinh[y] * (0.9 + 0.2 * r()) + 0.04;
    },
    nhan(t, p) {
      const n = [[240, 50, "Thành ngực (bất động)"], [240, 80, "Màng phổi"]];
      n.push(p.truot === false ? [240, 220, "Mã vạch: không trượt"] : p.diem ? [240, 220, "Xen kẽ bờ biển – mã vạch: điểm phổi"] : [240, 220, "Bờ biển: có trượt"]);
      return n;
    },
  };

  /* ----- Đông đặc phổi ----- */
  C.dongDac = {
    ten: "Đông đặc phổi: hình gan hóa, khí phế quản đồ", dau: "cong", sau: 12,
    ve(S, t, p) {
      const th = hitVao(t);
      S.nen(0.08); S.thanh(0.9);
      const bo = []; const r = rng(8);
      for (let x = -20; x <= 500; x += 20) bo.push([x, 215 + Math.sin(x * 0.05) * 18 + (r() - 0.5) * 22]);
      S.da([[-20, 48], [500, 48]].concat(bo.slice().reverse()), 0.46);
      S.hat(0, 60, 480, 210, 30, 0.6, 3, 4);
      // khí phế quản đồ (động: sáng lên, dịch chuyển khi hít vào)
      const sang = p.tinh ? 0.88 : 0.6 + 0.4 * th, dy = p.tinh ? 0 : 4 * th;
      [[[150, 100], [210, 140], [250, 190]], [[210, 140], [270, 125], [330, 140]], [[260, 90], [300, 150], [360, 190]], [[120, 160], [180, 175]]].forEach((l) => S.duong(l.map((q) => [q[0], q[1] + dy]), 4, sang));
      S.cong(bo, 6, 0.85);
      for (let i = 3; i < bo.length - 2; i += 6) S.da([[bo[i][0] - 2, bo[i][1]], [bo[i][0] + 2, bo[i][1]], [bo[i][0] + 3, 360], [bo[i][0] - 3, 360]], 0.28);
      S.cong([[-20, 52], [120, 50], [240, 48], [360, 50], [500, 52]], 5, 0.8);
    },
    nhan() { return [[240, 70, "Màng phổi"], [180, 130, "Nhu mô đông đặc (gan hóa)"], [300, 150, "Khí phế quản đồ"], [240, 250, "Bờ xé vụn (shred)"]]; },
  };

  /* ----- Động mạch chủ bụng mặt cắt ngang ----- */
  C.dmc = {
    ten: "Động mạch chủ bụng mặt cắt ngang", dau: "cong", sau: 16,
    ve(S, t, p) {
      const ppc = (356 - 15) / 16, s = tamThu(t);
      S.nen(0.32); S.hat(0, 60, 480, 300, 30, 0.5, 14, 5);
      if (!p.ep) { S.elip(150, 105, 50, 26, 0.4); S.cungElip(150, 105, 50, 26, 3.4, 6.0, 5, 0.95); S.bong(105, 95, 195, 95, 0.55); }
      S.elip(150, 300, 48, 36, 0.28); S.elip(330, 300, 48, 36, 0.28);
      S.cungElip(240, 318, 58, 26, Math.PI * 1.0, Math.PI * 2.0, 9, 0.95); S.bong(182, 318, 298, 318, 0.95);
      S.elip(195, 266, 27, 13, 0); // TMC dưới
      if (p.phinh) {
        const R = (5.2 / 2) * ppc * (1 + 0.03 * s);
        S.elip(264, 232, R, R * 0.96, 0.75); S.elip(264, 232, R - 3, R * 0.96 - 3, 0.3);
        S.khoi(272, 222, 30 * (1 + 0.05 * s), 0, 6, 0.08);
      } else {
        const R = (1.9 / 2) * ppc * (1 + 0.05 * s);
        S.elip(264, 262, R, R, 0.8); S.elip(264, 262, R - 3, R - 3, 0);
        S.elip(264, 214, 15, 13, 0.82); S.elip(264, 214, 6, 6, 0); // ĐM mạc treo tràng trên trong lớp mỡ sáng
      }
      S.thanh(1.2);
    },
    nhan(t, p) {
      const n = [[240, 344, "Thân đốt sống"], [190, 266, "TMC dưới"], [150, 300, "Cơ thắt lưng"]];
      if (p.phinh) { n.push([264, 165, "Phình ĐMC"]); n.push([300, 270, "Huyết khối thành"]); }
      else { n.push([300, 262, "ĐMC bụng"]); n.push([300, 210, "ĐM MTTT"]); }
      if (!p.ep) n.push([150, 76, "Khí ruột"]);
      return n;
    },
    phu(c, t, p, m) {
      const ppc = (356 - 15) / 16, d = p.phinh ? 5.2 : 1.9, cy = p.phinh ? 232 : 262, R = (d / 2) * ppc;
      const a = m(264 - R, cy), b = m(264 + R, cy), u = m(264, cy - R), v = m(264, cy + R);
      c.save(); c.strokeStyle = "#f2c94c"; c.fillStyle = "#f2c94c"; c.lineWidth = 1.5; c.setLineDash([3, 3]);
      c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.moveTo(u[0], u[1]); c.lineTo(v[0], v[1]); c.stroke(); c.setLineDash([]);
      [a, b].forEach((q) => { c.beginPath(); c.moveTo(q[0], q[1] - 6); c.lineTo(q[0], q[1] + 6); c.stroke(); });
      [u, v].forEach((q) => { c.beginPath(); c.moveTo(q[0] - 6, q[1]); c.lineTo(q[0] + 6, q[1]); c.stroke(); });
      c.font = "600 12px system-ui, sans-serif"; c.fillText("Ngoài – ngoài: " + so(d) + " cm", 300, 340); c.restore();
    },
  };

  /* ----- Huyết khối tĩnh mạch sâu: ép ----- */
  function mucEp(t) { const ph = (t % 3) / 3; return ph < 0.5 ? Math.sin(Math.PI * ph / 0.5) : 0; }
  C.dvt = {
    ten: "Ép tĩnh mạch đùi chung", dau: "thang", sau: 4,
    ve(S, t, p) {
      const c = S.c, e = mucEp(t), khoeo = p.vt === "khoeo";
      c.save(); c.translate(0, 10); c.scale(1, 1 - 0.1 * e); c.translate(0, -10);
      S.nen(0.3); S.hat(80, 120, 400, 352, 20, 0.45, 5, 4);
      S.dai(0, 4, 0.62); S.dai(4, 64, 0.22); S.vach(30, 2, 0.45, 7); S.dai(64, 68, 0.62);
      const A = khoeo ? [240, 222, 26] : [190, 168, 30], V = khoeo ? [240, 150, 34, 30] : [292, 176, 48, 38];
      const huyetKhoi = !!p.hk;
      const vry = huyetKhoi ? V[3] * 1.12 * (1 - 0.06 * e) : Math.max(1.2, V[3] * (1 - e));
      S.elip(V[0], V[1] + (huyetKhoi ? 0 : V[3] - vry) * 0.6, V[2] * (huyetKhoi ? 1.08 : 1 + 0.08 * e), vry, huyetKhoi ? 0.3 : 0);
      if (huyetKhoi) S.khoi(V[0] + 4, V[1] + 2, vry * 0.7, 0.42, 3, 0.2, V[2] * 0.7);
      S.vong(V[0], V[1] + (huyetKhoi ? 0 : V[3] - vry) * 0.6, V[2] * (huyetKhoi ? 1.08 : 1 + 0.08 * e), vry, 2, 0.6);
      const s = tamThu(t);
      S.elip(A[0], A[1], A[2] * (1 + 0.04 * s), A[2] * (1 - 0.12 * e) * (1 + 0.04 * s), 0); S.vong(A[0], A[1], A[2] * (1 + 0.04 * s), A[2] * (1 - 0.12 * e) * (1 + 0.04 * s), 4, 0.82);
      if (!khoeo && p.tmh) { S.elip(330, 110, 18, 14, 0); S.vong(330, 110, 18, 14, 2, 0.55); }
      S.tangAm(A[0] - A[2], A[1] + A[2], A[0] + A[2], 80, 0.12);
      c.restore();
    },
    nhan(t, p) {
      const khoeo = p.vt === "khoeo", e = mucEp(t);
      const n = khoeo ? [[240, 150, "TM khoeo"], [240, 222, "ĐM khoeo"]] : [[190, 168, "ĐM đùi chung"], [292, 176, "TM đùi chung"]];
      if (!khoeo && p.tmh) n.push([330, 92, "TM hiển lớn"]);
      n.push([240, 30, e > 0.25 ? (p.hk ? "Đang ép: TM KHÔNG xẹp" : "Đang ép: TM xẹp hoàn toàn") : "Thả: TM tròn"]);
      return n;
    },
  };

  /* ----- Thận: ứ nước ----- */
  C.than = {
    ten: "Thận phải trục dọc", dau: "cong", sau: 14,
    ve(S, t, p) {
      const g = p.do || 0, dx = hitVao(t) * 6, c = S.c;
      S.nen(0.28);
      c.save(); c.translate(dx, 0);
      S.da([[-20, 30], [500, 30], [500, 130], [380, 150], [250, 140], [120, 160], [-20, 150]], 0.5);
      S.elip(250, 218, 124, 58, 0.72, 0.05); S.elip(250, 218, 118, 53, g === 3 ? 0.34 : 0.36, 0.05);
      if (g < 3) for (let i = 0; i < 8; i++) { const a = -2.9 + i * 0.78; S.elip(250 + Math.cos(a) * 80, 218 + Math.sin(a) * 32, 12, 9, 0.18, a); }
      S.khoi(250, 219, 20, 0.84, 5, 0.2, 72);
      if (g === 1) S.khoi(250, 219, 5, 0, 7, 0.2, 52);
      if (g === 2) { S.elip(245, 220, 40, 13, 0); [[-58, -14], [-30, -22], [0, -24], [30, -22], [58, -12], [40, 18], [-40, 18]].forEach((q) => { S.elip(250 + q[0], 219 + q[1], 13, 10, 0); S.duong([[245, 220], [250 + q[0], 219 + q[1]]], 7, 0); }); }
      if (g === 3) { S.khoi(250, 219, 40, 0, 12, 0.14, 96); [[-70, -10], [-40, -30], [0, -34], [40, -30], [72, -8]].forEach((q) => S.elip(250 + q[0], 219 + q[1], 20, 16, 0)); }
      c.restore();
      S.thanh(1);
    },
    nhan(t, p) {
      const dx = hitVao(t) * 6, g = p.do || 0;
      const n = [[300 + dx, 90, "Gan"], [250 + dx, 282, g === 3 ? "Vỏ thận mỏng" : "Vỏ thận"]];
      n.push(g ? [250 + dx, 222, ["", "Ứ nước nhẹ", "Ứ nước vừa", "Ứ nước nặng"][g]] : [250 + dx, 222, "Xoang thận (sáng)"]);
      if (g < 3) n.push([150 + dx, 210, "Tháp thận"]);
      return n;
    },
  };

  /* ----- Bàng quang mặt cắt ngang: đo thể tích ----- */
  C.bangQuang = {
    ten: "Bàng quang mặt cắt ngang", dau: "cong", sau: 14,
    kt: (p) => (p.lon ? { r: 12.2, s: 8.6, d: 11 } : { r: 9.6, s: 6.2, d: 8 }),
    ve(S, t, p) {
      const ppc = (356 - 15) / 14, k = this.kt(p), rx = (k.r / 2) * ppc, ry = (k.s / 2) * ppc, cy = 64 + ry;
      S.nen(0.3); S.hat(0, 60, 480, 360, 26, 0.45, 13, 5);
      const bq = []; for (let a = 0; a < Math.PI * 2; a += 0.1) { const cs = Math.cos(a), sn = Math.sin(a); bq.push([240 + rx * Math.sign(cs) * Math.pow(Math.abs(cs), 0.7), cy + ry * Math.sign(sn) * Math.pow(Math.abs(sn), 0.7)]); }
      S.da(bq, 0.68); S.da(bq.map((q) => [240 + (q[0] - 240) * 0.97, cy + (q[1] - cy) * 0.96]), 0);
      S.tangAm(240 - rx * 0.8, cy + ry, 240 + rx * 0.8, 70, 0.2);
      S.thanh(1.1);
    },
    nhan() { return [[240, 140, "Bàng quang"]]; },
    phu(c, t, p, m) {
      const ppc = (356 - 15) / 14, k = this.kt(p), rx = (k.r / 2) * ppc, ry = (k.s / 2) * ppc, cy = 64 + ry;
      const a = m(240 - rx * 0.97, cy), b = m(240 + rx * 0.97, cy), u = m(240, cy - ry * 0.96), v = m(240, cy + ry * 0.96);
      c.save(); c.strokeStyle = "#f2c94c"; c.fillStyle = "#f2c94c"; c.lineWidth = 1.5; c.setLineDash([3, 3]);
      c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.moveTo(u[0], u[1]); c.lineTo(v[0], v[1]); c.stroke(); c.setLineDash([]);
      c.font = "600 12px system-ui, sans-serif";
      const V = Math.round(0.52 * k.r * k.s * k.d);
      c.fillText("Ngang " + so(k.r) + " cm · Trước–sau " + so(k.s) + " cm", 24, 318);
      c.fillText("(Dọc " + so(k.d, 0) + " cm ở mặt cắt dọc) → V ≈ 0,52 × " + so(k.r) + " × " + so(k.s) + " × " + so(k.d, 0) + " ≈ " + V + " mL", 24, 338);
      c.restore();
    },
  };

  /* ----- Túi mật trục dọc ----- */
  C.tuiMat = {
    ten: "Túi mật trục dọc", dau: "cong", sau: 14,
    ve(S, t, p) {
      const c = S.c, dx = hitVao(t) * 6, viem = !!p.viem;
      S.nen(0.32);
      c.save(); c.translate(dx, 0);
      S.da([[-20, 20], [500, 20], [500, 290], [-20, 310]], 0.5); S.hat(0, 40, 480, 290, 18, 0.62, 5, 4);
      S.duong([[110, 238], [340, 262]], 26, 0.85); S.duong([[110, 238], [340, 262]], 18, 0); // TM cửa thành sáng
      S.duong([[165, 186], [180, 232]], 3, 0.85); // khe thùy chính
      S.elip(420, 280, 60, 34, 0.38); S.cungElip(420, 280, 60, 34, 3.5, 5.9, 5, 0.9); S.bong(370, 262, 470, 262, 0.55); // tá tràng có khí
      c.save(); c.translate(282, 172); c.rotate(0.12);
      if (viem) { S.elip(18, 28, 120, 26, 0); S.elip(0, 0, 112, 44, 0.82); S.elip(0, 0, 106, 39, 0.16); S.elip(0, 0, 101, 34, 0.7); }
      else S.elip(0, 0, 100, 34, 0.75);
      S.elip(0, 0, viem ? 98 : 97, viem ? 31 : 31, 0);
      if (viem) S.da([[-90, 30], [90, 28], [96, 12], [-92, 14]], 0.22); // bùn mật
      c.restore();
      if (p.soi || viem) [[318, 205], [340, 202], [296, 204]].forEach((q, i) => { S.cungElip(q[0], q[1], 11, 8, Math.PI, Math.PI * 2, 6, 1); S.bong(q[0] - 10, q[1] - 2, q[0] + 10, q[1] - 2, 0.93); if (i > 1 && !viem) return; });
      c.restore();
      S.thanh(1);
    },
    nhan(t, p) {
      const dx = hitVao(t) * 6, viem = !!p.viem;
      const n = [[120, 90, "Gan"], [250, 168, "Túi mật"], [175, 254, "TM cửa"], [125, 205, "Khe thùy chính"]];
      if (p.soi || viem) { n.push([320, 222, "Sỏi"]); n.push([330, 316, "Bóng lưng sạch"]); }
      if (viem) { n.push([250, 128, "Thành dày ≥ 3 mm"]); n.push([390, 224, "Dịch quanh túi mật"]); }
      return n.map((q) => [q[0] + dx, q[1], q[2]]);
    },
  };

  /* ----- Tử cung qua đường bụng ----- */
  C.tuCung = {
    ten: "Tử cung mặt cắt dọc qua đường bụng", dau: "cong", sau: 16,
    ve(S, t, p) {
      S.nen(0.3); S.hat(0, 60, 480, 360, 24, 0.45, 15, 5);
      S.da([[0, 310], [480, 300], [480, 400], [0, 400]], 0.36);
      if (p.ngoai) { S.da([[180, 300], [330, 276], [380, 300], [300, 338], [170, 340]], 0); S.hat(190, 290, 360, 336, 30, 0.45, 9, 3); S.khoi(90, 262, 26, 0.45, 4, 0.25); S.vong(90, 262, 24, 22, 4, 0.8); }
      // bàng quang
      const bq = []; for (let a = 0; a < Math.PI * 2; a += 0.12) { const cs = Math.cos(a), sn = Math.sin(a); bq.push([300 + 130 * Math.sign(cs) * Math.pow(Math.abs(cs), 0.8), 115 + 55 * Math.sign(sn) * Math.pow(Math.abs(sn), 0.8)]); }
      S.da(bq, 0.68); S.da(bq.map((q) => [300 + (q[0] - 300) * 0.96, 115 + (q[1] - 115) * 0.93]), 0);
      S.tangAm(200, 168, 400, 60, 0.15);
      // tử cung
      S.elip(215, 218, 128, 54, 0.42, -0.18); S.elip(372, 250, 46, 28, 0.42, -0.1);
      if (p.iup) {
        S.elip(185, 220, 30, 27, 0.85); S.elip(185, 220, 25, 22, 0);
        S.vong(185, 220, 36, 33, 2, 0.6);
        S.vong(175, 213, 6, 6, 2, 0.95);
        const tim = 0.45 + 0.45 * Math.max(0, Math.sin(2 * Math.PI * t * 2.5));
        S.elip(194, 228, 9, 5, 0.42, 0.4); S.elip(194, 227, 2.5, 2.5, tim);
      } else S.duong([[110, 240], [215, 218], [320, 194]], 4, 0.8);
      S.thanh(1.1);
    },
    nhan(t, p) {
      const n = [[300, 112, "Bàng quang"], [270, 212, "Tử cung"]];
      if (p.iup) { n.push([180, 168, "Túi thai"]); n.push([140, 206, "Túi noãn hoàng"]); n.push([222, 246, "Phôi, tim thai"]); }
      else n.push([215, 236, "Lòng tử cung rỗng"]);
      if (p.ngoai) { n.push([270, 330, "Dịch tự do có cục máu"]); n.push([90, 296, "Khối phần phụ"]); }
      return n;
    },
    phu(c, t, p, m) {
      if (!p.iup) return;
      const a = m(155, 220), b = m(98, 230);
      c.save(); c.strokeStyle = "#f2c94c"; c.fillStyle = "#f2c94c"; c.lineWidth = 1.5;
      c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
      c.font = "600 12px system-ui, sans-serif"; c.fillText("Lớp cơ bao quanh ≈ 12 mm", 24, 338); c.restore();
    },
  };

  /* ----- Tĩnh mạch cảnh trong + kim ----- */
  C.tmCanh = {
    ten: "Tĩnh mạch cảnh trong: đường vào", dau: "thang", sau: 4,
    ve(S, t, p) {
      const th = hitVao(t), s = tamThu(t), doc = p.kim === "doc";
      S.nen(0.3); S.hat(80, 200, 400, 352, 18, 0.45, 8, 4);
      S.dai(0, 4, 0.62); S.dai(4, 24, 0.2); S.dai(24, 27, 0.6);
      const ph = (t % 6) / 6, sau = ph < 0.65 ? 18 + ph / 0.65 * 150 : 168;
      if (doc) {
        S.da([[60, 30], [420, 30], [420, 96], [60, 108]], 0.32); S.vach(55, 2, 0.48, 3); S.vach(80, 2, 0.48, 4);
        const tren = 128 + 6 * th, duoi = 184;
        const lom = (x) => (sau > 110 && sau < 140 && Math.abs(x - 255) < 50 ? (1 - Math.abs(x - 255) / 50) * Math.min(20, sau - 110) : 0);
        const tr = []; for (let x = 60; x <= 420; x += 10) tr.push([x, tren + lom(x)]);
        S.da(tr.concat([[420, duoi], [60, duoi]]), 0); S.duong(tr, 2, 0.6); S.duong([[60, duoi], [420, duoi]], 2, 0.6);
        const goc = 0.52, L = (sau - 18) / Math.sin(goc), x0 = 120, y0 = 10, xt = x0 + Math.cos(goc) * L, yt = y0 + Math.sin(goc) * L;
        S.duong([[x0, y0], [xt, yt]], 4, 1);
        for (let i = 1; i < 4; i++) S.duong([[x0 + 10 * i, y0 + 10 * i * 0.6], [xt, yt + 9 * i]], 1.5, 0.35 - i * 0.07);
      } else {
        S.da([[60, 26], [420, 26], [400, 88], [80, 100]], 0.32); S.vach(52, 2, 0.48, 3); S.vach(72, 2, 0.48, 6);
        S.elip(395, 160, 70, 60, 0.48);
        const lom = sau > 100 && sau < 128 ? Math.min(18, sau - 100) : 0;
        const vry = 40 * (1 + 0.12 * th);
        const tm = []; for (let a = 0; a < Math.PI * 2; a += 0.1) { const x = 200 + Math.cos(a) * 58, y = 150 + Math.sin(a) * vry; tm.push([x, y + (Math.sin(a) < 0 ? lom * Math.max(0, 1 - Math.abs(x - 200) / 40) : 0)]); }
        S.da(tm, 0); S.duong(tm.concat([tm[0]]), 2, 0.55);
        S.elip(305, 172, 29 * (1 + 0.05 * s), 29 * (1 + 0.05 * s), 0); S.vong(305, 172, 29 * (1 + 0.05 * s), 29 * (1 + 0.05 * s), 4, 0.85);
        const y = sau > 128 ? 150 : sau;
        if (p.kim) { S.elip(200, y, 4, 3, 1); S.duong([[200, y + 6], [200, y + 22]], 2, 0.4); }
      }
    },
    nhan(t, p) {
      if (p.kim === "doc") return [[240, 60, "Cơ ức đòn chũm"], [320, 160, "TM cảnh trong (trục dọc)"], [150, 50, "Thân kim"]];
      const n = [[200, 150, "TM cảnh trong"], [305, 172, "ĐM cảnh chung"], [240, 60, "Cơ ức đòn chũm"], [395, 160, "Tuyến giáp"]];
      if (p.kim) n.push([150, 120, "Đầu kim (chấm sáng)"]);
      return n;
    },
  };

  /* ----- Mắt: đường kính bao thần kinh thị ----- */
  C.mat = {
    ten: "Mắt: đường kính bao thần kinh thị (ONSD)", dau: "thang", sau: 5,
    onsd: (p) => (p.tang ? 6.4 : 4.6),
    ve(S, t, p) {
      const ppc = (352 - 10) / 5, w = this.onsd(p) * 0.1 * ppc;
      S.nen(0.55); S.hat(80, 200, 400, 352, 30, 0.75, 4, 4);
      S.dai(0, 3, 0.7); S.dai(3, 12, 0.3);
      S.elip(240, 112, 86, 86, 0.82); S.elip(240, 112, 82, 82, 0);
      S.vong(240, 52, 42, 13, 2.5, 0.85);
      S.duong([[160, 64], [196, 60]], 3, 0.7); S.duong([[284, 60], [320, 64]], 3, 0.7);
      S.da([[240 - w / 2 - 3, 196], [240 + w / 2 + 3, 196], [240 + w / 2 + 6, 352], [240 - w / 2 - 6, 352]], 0.08);
      S.da([[240 - w / 2 + 5, 198], [240 + w / 2 - 5, 198], [240 + w / 2 - 3, 352], [240 - w / 2 + 3, 352]], 0.2);
      if (p.bong) { const s = Math.sin(t * 2) * 6; S.cong([[166, 150], [190, 175 + s], [222, 190], [240, 196]], 3, 0.95); S.cong([[314, 150], [290, 175 - s], [258, 190], [240, 196]], 3, 0.95); }
    },
    nhan(t, p) { const n = [[240, 112, "Nhãn cầu (dịch kính)"], [240, 40, "Thủy tinh thể"], [240, 300, "Bao thần kinh thị"]]; if (p.bong) n.push([240, 160, "Bong võng mạc (dính vào đĩa thị)"]); return n; },
    phu(c, t, p, m) {
      const ppc = (352 - 10) / 5, w = this.onsd(p) * 0.1 * ppc, y = 198 + 0.3 * ppc;
      const a = m(240 - w / 2 - 4, y), b = m(240 + w / 2 + 4, y), o = m(240, 198), q = m(240, y);
      c.save(); c.strokeStyle = "#f2c94c"; c.fillStyle = "#f2c94c"; c.lineWidth = 1.5; c.setLineDash([3, 3]);
      c.beginPath(); c.moveTo(o[0] + 40, o[1]); c.lineTo(q[0] + 40, q[1]); c.stroke(); c.setLineDash([]);
      c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
      c.font = "600 12px system-ui, sans-serif"; c.fillText("3 mm", o[0] + 46, (o[1] + q[1]) / 2 + 4);
      c.fillText("ONSD " + so(this.onsd(p)) + " mm", b[0] + 10, y + 24); c.restore();
    },
  };

  /* ----- Doppler xung đường ra thất trái: VTI ----- */
  C.vti = {
    ten: "Doppler xung đường ra thất trái (mỏm 5 buồng)", dau: "tim", sau: 16, kieu: "d",
    van: (p) => p.vti || 20,
    nhan() { return []; },
  };

  /* =====================================================================
     VẼ KHUNG HÌNH
     ===================================================================== */
  function anhXa(g, z) {
    const ox = 240, oy = g.tren;
    return (x, y) => [ox + (x - ox) * z, oy + (y - oy) * z];
  }

  function veNhan(c, ds, m) {
    c.save(); c.font = "600 11.5px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle";
    for (const n of ds) {
      const q = m(n[0], n[1]), x = Math.max(60, Math.min(W - 60, q[0])), y = Math.max(14, Math.min(H - 12, q[1]));
      const w = c.measureText(n[2]).width + 10;
      c.fillStyle = "rgba(8,18,28,.72)"; c.beginPath(); c.roundRect ? c.roundRect(x - w / 2, y - 9, w, 18, 5) : c.rect(x - w / 2, y - 9, w, 18); c.fill();
      c.fillStyle = "#9fe6ff"; c.fillText(n[2], x, y);
    }
    c.restore();
  }

  function veKhung(v, t) {
    const sc = v.canh, p = v.p, g = GEO[sc.dau], c = v.ctx;
    const sau = p.sau || sc.sau, z = sc.sau / sau;
    c.setTransform(v.dpr, 0, 0, v.dpr, 0, 0);
    c.fillStyle = "#04070a"; c.fillRect(0, 0, W, H);
    if (sc.kieu === "m" || sc.kieu === "d") return veCuon(v, t);
    // 1. bản đồ hồi âm (nửa độ phân giải để mềm bờ)
    const tc = v.tctx; tc.setTransform(1, 0, 0, 1, 0, 0); tc.globalCompositeOperation = "source-over"; tc.globalAlpha = 1;
    tc.fillStyle = "#000"; tc.fillRect(0, 0, W / 2, H / 2);
    tc.setTransform(0.5, 0, 0, 0.5, 0, 0);
    if (z !== 1) { tc.translate(240, g.tren); tc.scale(z, z); tc.translate(-240, -g.tren); }
    sc.ve(taoS(tc, g), t, p);
    // 2. ghép với nền hạt, cắt theo quạt
    c.save(); duongQuat(c, g); c.clip();
    c.imageSmoothingEnabled = true; c.drawImage(v.tcan, 0, 0, W, H);
    c.globalCompositeOperation = "multiply";
    const hat = nenHat();
    if (sc.truot) {
      const tr = sc.truot, dx = tr.dx(t, p), x1 = tr.x1(t, p), yz = g.tren + (tr.y - g.tren) * z;
      c.save(); c.beginPath(); c.rect(0, 0, W, H); c.rect(0, yz, x1, H - yz); c.clip("evenodd"); c.drawImage(hat, -240, 0); c.restore();
      c.save(); c.beginPath(); c.rect(0, yz, x1, H - yz); c.clip(); c.drawImage(hat, -240 + dx * 1.4, 0); c.restore();
    } else c.drawImage(hat, -240, 0);
    const gr = c.createLinearGradient(0, g.tren, 0, g.duoi);
    gr.addColorStop(0, "#ffffff"); gr.addColorStop(1, "#8a8a8a");
    c.fillStyle = gr; c.fillRect(0, 0, W, H);
    c.globalCompositeOperation = "source-over";
    const gain = p.gain == null ? 1 : p.gain;
    if (gain < 1) { c.fillStyle = "rgba(0,0,0," + (1 - gain) * 0.9 + ")"; c.fillRect(0, 0, W, H); }
    if (gain > 1) { c.globalCompositeOperation = "screen"; const k = Math.round(Math.min(1, (gain - 1)) * 120); c.fillStyle = "rgb(" + k + "," + k + "," + k + ")"; c.fillRect(0, 0, W, H); c.globalCompositeOperation = "source-over"; }
    c.restore();
    // 3. lớp phủ
    veThuoc(c, g, sau);
    veDauMau(c, g, sc.mau);
    const m = anhXa(g, z);
    if (sc.phu) sc.phu(c, t, p, m);
    if (v.nhan && sc.nhan) veNhan(c, sc.nhan(t, p), m);
    c.save(); c.font = "600 10px system-ui, sans-serif"; c.fillStyle = "rgba(255,255,255,.45)"; c.fillText("MÔ PHỎNG", 10, H - 8); c.restore();
  }

  function veThuoc(c, g, sau) {
    const ppc = (g.duoi - g.tren) / sau, x = g.kieu === "chu" ? g.x1 + 12 : 456;
    c.save(); c.strokeStyle = "rgba(255,255,255,.55)"; c.fillStyle = "rgba(255,255,255,.7)"; c.font = "10px system-ui, sans-serif"; c.lineWidth = 1;
    for (let i = 0; i <= sau; i++) {
      const y = g.tren + i * ppc; if (y > H - 2) break;
      const dai = i % 5 === 0 ? 8 : 4;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + dai, y); c.stroke();
      if (i % 5 === 0 && i) c.fillText(String(i), x + 10, y + 3);
    }
    c.textAlign = "right"; c.fillText(so(sau, 0) + " cm", W - 4, H - 4);
    c.restore();
  }
  function veDauMau(c, g, ben) {
    const phai = ben === "R", x = g.kieu === "chu" ? (phai ? g.x1 - 10 : g.x0 + 10) : phai ? 420 : 60;
    c.save(); c.fillStyle = "#f5a524"; c.beginPath(); c.arc(x, 14, 5, 0, Math.PI * 2); c.fill(); c.restore();
  }

  /* ----- M-mode và Doppler: hình cuộn theo thời gian ----- */
  const tocDo = (v) => (v.canh.kieu === "d" ? 150 : 70); // px mỗi giây
  function cotM(v, t) {
    const sc = v.canh, p = v.p, col = new Uint8ClampedArray(H * 4), r = v.rnd;
    for (let y = 0; y < H; y++) { const g = Math.max(0, Math.min(1, sc.cot(y, t, p, r, v.tinh))) * 255; col[y * 4] = col[y * 4 + 1] = col[y * 4 + 2] = g; col[y * 4 + 3] = 255; }
    return col;
  }
  function vanToc(t, p) { // cm/s, dương = xa đầu dò (vẽ dưới đường gốc)
    const T = p.vti && p.vti < 14 ? 0.62 : NHIP, ET = 0.3, ph = ((t % T) + T) % T;
    const vmax = (Math.PI * (p.vti || 20)) / (2 * ET);
    return ph < ET ? vmax * Math.sin((Math.PI * ph) / ET) : 0;
  }
  const GOC_D = 52, TL_D = 2.2; // đường gốc, px mỗi cm/s
  function cotD(v, t) {
    const p = v.p, col = new Uint8ClampedArray(H * 4), r = v.rnd, vel = vanToc(t, p), bao = GOC_D + vel * TL_D;
    const T = p.vti && p.vti < 14 ? 0.62 : NHIP, ph = ((t % T) + T) % T;
    for (let y = 0; y < H; y++) {
      let g = 0.03 * r();
      if (y > GOC_D && y < bao) { const k = (y - GOC_D) / Math.max(1, bao - GOC_D); g = (k > 0.72 ? 0.85 : 0.18 + 0.25 * k) * (0.7 + 0.5 * r()); }
      if (y === GOC_D) g = 0.6;
      const ecg = 330 - (ph < 0.02 ? -40 * Math.sin((ph / 0.02) * Math.PI) : ph > 0.3 && ph < 0.42 ? 8 * Math.sin(((ph - 0.3) / 0.12) * Math.PI) : 0);
      if (Math.abs(y - ecg) < 1.5) g = 0.9;
      col[y * 4] = Math.round(g * 255 * (y > 300 ? 0.4 : 1)); col[y * 4 + 1] = Math.round(g * 255); col[y * 4 + 2] = Math.round(g * 255 * (y > 300 ? 0.5 : 1)); col[y * 4 + 3] = 255;
    }
    return col;
  }
  function napCuon(v, t0) {
    const bx = v.bctx, n = W;
    const img = bx.createImageData(n, H);
    for (let i = 0; i < n; i++) {
      const col = v.canh.kieu === "m" ? cotM(v, t0 - (n - i) / tocDo(v)) : cotD(v, t0 - (n - i) / tocDo(v));
      for (let y = 0; y < H; y++) { const o = (y * n + i) * 4; img.data[o] = col[y * 4]; img.data[o + 1] = col[y * 4 + 1]; img.data[o + 2] = col[y * 4 + 2]; img.data[o + 3] = 255; }
    }
    bx.putImageData(img, 0, 0); v.tCuon = t0;
  }
  function veCuon(v, t) {
    const c = v.ctx, bx = v.bctx;
    if (v.tCuon == null || t < v.tCuon || t - v.tCuon > 3) napCuon(v, t);
    let k = Math.floor((t - v.tCuon) * tocDo(v));
    if (k > 0) {
      bx.drawImage(v.bcan, -k, 0);
      const img = bx.createImageData(k, H);
      for (let i = 0; i < k; i++) {
        const tt = v.tCuon + (i + 1) / tocDo(v), col = v.canh.kieu === "m" ? cotM(v, tt) : cotD(v, tt);
        for (let y = 0; y < H; y++) { const o = (y * k + i) * 4; img.data[o] = col[y * 4]; img.data[o + 1] = col[y * 4 + 1]; img.data[o + 2] = col[y * 4 + 2]; img.data[o + 3] = 255; }
      }
      bx.putImageData(img, W - k, 0); v.tCuon += k / tocDo(v);
    }
    c.drawImage(v.bcan, 0, 0, W, H);
    c.save(); c.font = "10px system-ui, sans-serif"; c.fillStyle = "rgba(255,255,255,.6)"; c.strokeStyle = "rgba(255,255,255,.35)";
    const td = tocDo(v); for (let x = W - ((v.tCuon * td) % td); x > 0; x -= td) { c.beginPath(); c.moveTo(x, H - 18); c.lineTo(x, H - 12); c.stroke(); }
    c.fillText("1 vạch = 1 giây", W - 90, H - 4);
    if (v.canh.kieu === "d") {
      c.fillStyle = "rgba(255,255,255,.75)";
      [0, 50, 100, 150].forEach((u) => { const y = GOC_D + u * TL_D; if (y < 300) { c.fillText(u ? "-" + u : "0", 8, y + 3); c.beginPath(); c.moveTo(30, y); c.lineTo(36, y); c.stroke(); } });
      c.fillText("cm/s", 8, 20);
      c.font = "600 12px system-ui, sans-serif"; c.fillStyle = "#f2c94c";
      const T = v.p.vti && v.p.vti < 14 ? 0.62 : NHIP;
      c.fillText("VTI ≈ " + so(v.canh.van(v.p), 0) + " cm · tần số " + Math.round(60 / T) + "/phút", 160, 290);
      c.fillStyle = "rgba(255,255,255,.55)"; c.font = "10px system-ui, sans-serif"; c.fillText("ECG", 8, 334);
    }
    c.restore();
    if (v.nhan && v.canh.nhan) veNhan(c, v.canh.nhan(t, v.p), (x, y) => [x, y]);
    c.save(); c.font = "600 10px system-ui, sans-serif"; c.fillStyle = "rgba(255,255,255,.45)"; c.fillText("MÔ PHỎNG", 10, H - 4); c.restore();
  }

  /* =====================================================================
     GẮN VÀO TRANG
     ===================================================================== */
  const VIEW = new Set();
  const itMotion = (() => { try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } })();
  let chay = false;

  function vong(now) {
    for (const v of VIEW) {
      if (!v.el.isConnected) { VIEW.delete(v); if (v.io) v.io.disconnect(); continue; }
      if (!v.thay || v.dung) continue;
      if (now - v.lan < 33) continue;
      v.t += Math.min(0.1, (now - (v.lan || now)) / 1000); v.lan = now;
      veKhung(v, v.t);
    }
    if (VIEW.size) requestAnimationFrame(vong); else chay = false;
  }

  /** Gắn mô phỏng vào phần tử. opt: {canh, p, nhan, dung} */
  function gan(el, opt) {
    const sc = C[opt.canh]; if (!sc) { el.textContent = "Không có cảnh " + opt.canh; return null; }
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const cv = document.createElement("canvas"); cv.width = W * dpr; cv.height = H * dpr; cv.className = "sim-cv";
    cv.setAttribute("role", "img"); cv.setAttribute("aria-label", "Mô phỏng siêu âm: " + sc.ten);
    el.appendChild(cv);
    const tcan = document.createElement("canvas"); tcan.width = W / 2; tcan.height = H / 2;
    const v = { el, canh: sc, p: Object.assign({}, opt.p || {}), ctx: cv.getContext("2d"), tcan, tctx: tcan.getContext("2d"), dpr, t: opt.t0 || 1.2, lan: 0, thay: true, dung: !!opt.dung || itMotion, nhan: opt.nhan !== false, rnd: rng(99) };
    if (sc.kieu) { v.bcan = document.createElement("canvas"); v.bcan.width = W; v.bcan.height = H; v.bctx = v.bcan.getContext("2d"); if (sc.khoiTao) v.tinh = sc.khoiTao(); }
    veKhung(v, v.t);
    if ("IntersectionObserver" in window) { v.io = new IntersectionObserver((es) => { v.thay = es[0].isIntersecting; }); v.io.observe(el); }
    VIEW.add(v);
    if (!chay) { chay = true; requestAnimationFrame(vong); }
    return {
      v,
      dat(k, val) { v.p[k] = val; if (sc.kieu) v.tCuon = null; veKhung(v, v.t); },
      dungLai(b) { v.dung = b; v.lan = 0; if (b) veKhung(v, v.t); },
      dangDung: () => v.dung,
      batNhan(b) { v.nhan = b; veKhung(v, v.t); },
      coNhan: () => v.nhan,
    };
  }

  window.POCUS_SIM = { gan, CANH: C, W, H };
})();

/* Hình minh họa SVG: vị trí đặt đầu dò trên cơ thể, động tác cầm đầu dò, các loại đầu dò. */
(function () {
  "use strict";

  /* Bệnh nhân nằm ngửa nhìn từ phía chân/phía trước: bên PHẢI bệnh nhân nằm bên TRÁI hình. */
  const THAN = {
    nguc: {
      vb: "0 0 200 250",
      ve: `<path class="fg-than" d="M86 4 C86 14 84 20 78 24 L44 34 C30 38 24 48 23 62 L22 120 C22 160 26 190 30 214 L34 246 L166 246 L170 214 C174 190 178 160 178 120 L177 62 C176 48 170 38 156 34 L122 24 C116 20 114 14 114 4 Z"/>
        <path class="fg-moc" d="M44 36 L96 44 M156 36 L104 44"/>
        <path class="fg-moc" d="M100 44 L100 112"/>
        <path class="fg-moc" d="M100 112 C86 124 64 140 40 156 M100 112 C114 124 136 140 160 156"/>
        <path class="fg-moc nhat" d="M34 70 C60 74 80 72 98 66 M166 70 C140 74 120 72 102 66 M30 96 C56 102 80 100 98 92 M170 96 C144 102 120 100 102 92"/>
        <circle class="fg-diem" cx="66" cy="86" r="2.4"/><circle class="fg-diem" cx="134" cy="86" r="2.4"/>
        <circle class="fg-diem" cx="100" cy="172" r="2.6"/>
        <path class="fg-moc" d="M44 206 L80 238 M156 206 L120 238 M80 240 L120 240"/>
        <text class="fg-ben" x="8" y="20">P</text><text class="fg-ben" x="184" y="20">T</text>`,
    },
    chan: {
      vb: "0 0 200 250",
      ve: `<path class="fg-than" d="M20 6 L180 6 L178 40 C176 70 168 110 160 150 L152 246 L112 246 L108 150 L100 92 L92 150 L88 246 L48 246 L40 150 C32 110 24 70 22 40 Z"/>
        <path class="fg-moc" d="M24 30 C40 46 62 60 90 70 M176 30 C160 46 138 60 110 70"/>
        <ellipse class="fg-moc nhat" cx="70" cy="214" rx="18" ry="12"/><ellipse class="fg-moc nhat" cx="130" cy="214" rx="18" ry="12"/>
        <text class="fg-chu" x="38" y="22">nếp bẹn</text><text class="fg-chu" x="52" y="236">gối</text>
        <text class="fg-ben" x="6" y="248">P</text><text class="fg-ben" x="186" y="248">T</text>`,
    },
    khoeo: {
      vb: "0 0 200 250",
      ve: `<path class="fg-than" d="M50 6 L150 6 L146 110 C144 130 146 150 150 170 L146 246 L54 246 L50 170 C54 150 56 130 54 110 Z"/>
        <path class="fg-moc nhat" d="M60 128 C80 120 120 120 140 128"/>
        <path class="fg-moc" d="M70 92 L100 128 L130 92 M70 164 L100 128 L130 164"/>
        <text class="fg-chu" x="58" y="20">mặt sau đùi phải</text><text class="fg-chu" x="140" y="140">hõm khoeo</text>`,
    },
    co: {
      vb: "0 0 200 250",
      ve: `<ellipse class="fg-than" cx="100" cy="62" rx="44" ry="54"/>
        <path class="fg-than" d="M72 108 L66 170 L20 196 L20 246 L180 246 L180 196 L134 170 L128 108 Z"/>
        <path class="fg-moc" d="M80 120 L96 182 M120 120 L104 182"/>
        <path class="fg-moc" d="M30 196 L94 186 M170 196 L106 186"/>
        <path class="fg-moc nhat" d="M86 150 C94 154 106 154 114 150"/>
        <text class="fg-chu" x="24" y="160">cơ ức đòn chũm</text><text class="fg-chu" x="128" y="214">xương đòn</text>
        <text class="fg-ben" x="8" y="20">P</text><text class="fg-ben" x="184" y="20">T</text>`,
    },
    mat: {
      vb: "0 0 200 250",
      ve: `<ellipse class="fg-than" cx="100" cy="122" rx="72" ry="96"/>
        <path class="fg-moc" d="M50 108 C60 100 78 100 88 108 M112 108 C122 100 140 100 150 108"/>
        <path class="fg-moc nhat" d="M52 112 C62 118 78 118 86 112 M114 112 C124 118 140 118 148 112"/>
        <path class="fg-moc nhat" d="M100 116 L94 154 L106 154 M82 182 C94 188 106 188 118 182"/>
        <text class="fg-chu" x="44" y="236">mắt nhắm, phủ nhiều gel</text>`,
    },
  };

  function dauDo(d, i, chon) {
    const so = d.n ? `<g transform="translate(${d.x + (d.nx || 0)} ${d.y + (d.ny == null ? -16 : d.ny)})"><circle class="fg-so" r="7.5"/><text class="fg-so-chu" y="3.4">${d.n}</text></g>` : "";
    const dt = d.mv ? ` class="mv-${d.mv}"` : "";
    const mo = chon != null && chon !== i ? ' opacity=".22"' : "";
    const dai = d.l || 30, ngan = d.w || 9;
    return `<g${mo}><g transform="translate(${d.x} ${d.y}) rotate(${d.a || 0})"><g${dt}>
      <rect class="fg-dd" x="${-dai / 2}" y="${-ngan / 2}" width="${dai}" height="${ngan}" rx="3"/>
      <circle class="fg-mau" cx="${dai / 2 + 2.5}" cy="0" r="3"/></g></g>${so}</g>`;
  }

  /** Hình vị trí đầu dò. spec: {than, dd:[{x,y,a,n,mv}], chu} */
  function viTri(spec) {
    const t = THAN[spec.than || "nguc"];
    const ds = (spec.dd || []).map((d, i) => dauDo(d, i, spec.chon)).join("");
    const chu = spec.chu ? `<text class="fg-chu" x="100" y="${spec.chuY || 14}" text-anchor="middle">${spec.chu}</text>` : "";
    return `<svg class="fig-than" viewBox="${t.vb}" role="img" aria-label="Vị trí đặt đầu dò${spec.alt ? ": " + spec.alt : ""}">${t.ve}${ds}${chu}</svg>`;
  }

  /* Động tác cầm đầu dò (nhìn nghiêng) */
  const DONG_TAC = {
    truot: { ten: "Trượt", mo: "Di chuyển cả đầu dò trên da sang vị trí mới, giữ nguyên góc. Dùng để tìm cửa sổ, đi theo một cấu trúc (ĐMC, tĩnh mạch)." },
    xoay: { ten: "Xoay", mo: "Giữ nguyên điểm tiếp xúc, xoay quanh trục dọc của đầu dò (ví dụ 90° để chuyển trục dọc ↔ trục ngắn)." },
    quat: { ten: "Quạt (nghiêng)", mo: "Giữ điểm tiếp xúc, nghiêng thân đầu dò theo chiều ngắn của mặt đầu dò: lát cắt quét qua cả cơ quan như lật trang sách." },
    lac: { ten: "Lắc (bập bênh)", mo: "Nghiêng theo chiều dài mặt đầu dò (gót – mũi), giữ cấu trúc trong mặt cắt: đưa cấu trúc vào giữa màn hình, mở rộng trường nhìn." },
    ep: { ten: "Ép", mo: "Ấn đầu dò vuông góc với da: đẩy khí ruột, thử ép tĩnh mạch (huyết khối), đánh giá điểm đau (Murphy siêu âm)." },
  };
  function dongTac(k) {
    const d = DONG_TAC[k];
    const thanDD = `<rect class="fg-dd" x="-9" y="-46" width="18" height="44" rx="5"/><path class="fg-day" d="M0 -46 C0 -60 10 -66 22 -70"/>`;
    const mat = k === "xoay"
      ? `<ellipse class="fg-moc" cx="80" cy="78" rx="44" ry="10"/><g transform="translate(80 78)"><g class="mv-xoay-tren"><rect class="fg-dd" x="-22" y="-5" width="44" height="10" rx="3"/><circle class="fg-mau" cx="24.5" cy="0" r="3"/></g></g>`
      : `<path class="fg-da" d="M6 80 L154 80"/><path class="fg-moc nhat" d="M6 84 L154 84 M6 92 L154 92"/><g transform="translate(80 80)"><g class="mv-${k}">${thanDD}</g></g>`;
    return `<figure class="dong-tac"><svg viewBox="0 0 160 104" role="img" aria-label="Động tác ${d.ten}">${mat}</svg><figcaption><b>${d.ten}</b><span>${d.mo}</span></figcaption></figure>`;
  }

  /* Ba loại đầu dò */
  function loaiDauDo() {
    const o = [
      ["Thẳng (linear)", "5–15 MHz · độ phân giải cao, nông", "Mạch máu, màng phổi, mô mềm, mắt, thủ thuật", `<rect class="fg-dd" x="40" y="20" width="18" height="52" rx="4"/><rect class="fg-dd dam" x="30" y="70" width="38" height="10" rx="2"/>`],
      ["Cong (convex)", "2–5 MHz · xuyên sâu, trường rộng", "Bụng, FAST, ĐMC, thai, phổi sâu", `<rect class="fg-dd" x="40" y="20" width="18" height="46" rx="4"/><path class="fg-dd dam" d="M26 66 L72 66 C72 80 60 86 49 86 C38 86 26 80 26 66 Z"/>`],
      ["Tim (phased array)", "1–5 MHz · mặt nhỏ, lọt khe liên sườn", "Tim, TMC dưới, ngừng tuần hoàn; dùng tạm cho bụng/phổi", `<rect class="fg-dd" x="40" y="20" width="18" height="50" rx="4"/><rect class="fg-dd dam" x="37" y="68" width="24" height="12" rx="3"/>`],
    ];
    return `<div class="loai-dd">${o.map((x) => `<figure><svg viewBox="0 0 98 92" aria-hidden="true">${x[3]}</svg><figcaption><b>${x[0]}</b><span>${x[1]}</span><span class="muted">${x[2]}</span></figcaption></figure>`).join("")}</div>`;
  }

  /* Tư thế bệnh nhân (nhìn nghiêng, đầu bên trái) */
  const NGUOI = (o) => {
    const t = o.than, l = o.chan, h = o.dau, ta = o.tay;
    return `<circle class="tt-dau" cx="${h[0]}" cy="${h[1]}" r="9"/>
      <path class="tt-than" d="M${t.map((q) => q.join(" ")).join(" L")}"/>
      <path class="tt-chan" d="M${l.map((q) => q.join(" ")).join(" L")}"/>
      ${ta ? `<path class="tt-tay" d="M${ta.map((q) => q.join(" ")).join(" L")}"/>` : ""}`;
  };
  const GIUONG = (goc) => `<g transform="rotate(${goc || 0} 100 80)"><rect class="tt-giuong" x="14" y="78" width="172" height="6" rx="2"/></g><path class="tt-chan-giuong" d="M30 84 L30 104 M170 84 L170 104"/>`;
  const TU_THE = {
    ngua: { ten: "Nằm ngửa", ve: () => GIUONG() + NGUOI({ dau: [28, 64], than: [[42, 68], [108, 68]], chan: [[108, 70], [176, 70]], tay: [[48, 66], [98, 63]] }) },
    gapGoi: { ten: "Nằm ngửa, gập gối (chùng cơ bụng)", ve: () => GIUONG() + NGUOI({ dau: [28, 64], than: [[42, 68], [108, 68]], chan: [[108, 70], [138, 44], [168, 70]], tay: [[48, 66], [98, 63]] }) },
    nghiengTrai: { ten: "Nghiêng trái 30–45°, tay trái lên đầu", ve: () => GIUONG() + `<ellipse class="tt-than-day" cx="76" cy="62" rx="36" ry="14"/>` + NGUOI({ dau: [28, 60], than: [[42, 64], [44, 64]], chan: [[108, 68], [140, 60], [174, 70]], tay: [[46, 56], [30, 38], [14, 40]] }) + `<path class="tt-mui" d="M84 30 C70 22 58 26 52 36"/><text class="fg-chu" x="86" y="30">nghiêng trái</text>` },
    nuaNgoi: { ten: "Nửa ngồi 30–45°", ve: () => `<path class="tt-giuong-n" d="M20 82 L120 82 L176 82 M120 82 L64 38"/>` + GIUONG() + NGUOI({ dau: [56, 26], than: [[66, 38], [112, 72]], chan: [[112, 72], [176, 72]], tay: [[72, 44], [104, 60]] }) },
    ngoiCui: { ten: "Ngồi mép giường, cúi ra trước tì lên bàn", ve: () => `<rect class="tt-giuong" x="20" y="72" width="96" height="6" rx="2"/><path class="tt-chan-giuong" d="M30 78 L30 104 M108 78 L108 104"/><rect class="tt-ban" x="138" y="50" width="52" height="5" rx="2"/><path class="tt-chan-giuong" d="M182 55 L182 104"/>` + NGUOI({ dau: [138, 28], than: [[96, 68], [128, 38]], chan: [[96, 70], [122, 72], [120, 104]], tay: [[124, 42], [150, 50]] }) + `<text class="fg-chu" x="22" y="56">lưng (vị trí chọc)</text>` },
    trend: { ten: "Đầu thấp (Trendelenburg) 10–15°", ve: () => `<g transform="rotate(-10 100 80)">` + GIUONG() + NGUOI({ dau: [28, 64], than: [[42, 68], [108, 68]], chan: [[108, 70], [176, 70]], tay: [[48, 66], [98, 63]] }) + `</g><text class="fg-chu" x="10" y="104">đầu thấp</text>` },
    trendNguoc: { ten: "Đầu cao (Trendelenburg ngược) cho tĩnh mạch chân đầy", ve: () => `<g transform="rotate(10 100 80)">` + GIUONG() + NGUOI({ dau: [28, 64], than: [[42, 68], [108, 68]], chan: [[108, 70], [176, 70]], tay: [[48, 66], [98, 63]] }) + `</g><text class="fg-chu" x="10" y="20">đầu cao</text>` },
    ech: { ten: "Tư thế ếch: đùi xoay ngoài, gối gập nhẹ", ve: () => GIUONG() + NGUOI({ dau: [28, 64], than: [[42, 68], [108, 68]], chan: [[108, 70], [140, 54], [170, 72]], tay: [[48, 66], [98, 63]] }) + `<path class="tt-mui" d="M132 40 C146 32 158 38 160 50"/><text class="fg-chu" x="120" y="30">xoay ngoài</text>` },
    sapKhoeo: { ten: "Nằm sấp hoặc nghiêng, gối gập 20–30° (khám khoeo)", ve: () => GIUONG() + NGUOI({ dau: [28, 66], than: [[42, 66], [108, 66]], chan: [[108, 68], [146, 68], [176, 52]], tay: [[46, 72], [36, 76]] }) + `<text class="fg-chu" x="128" y="44">gối gập</text>` },
    plr: { ten: "Nâng chân thụ động: nửa ngồi 45° → thân nằm, chân nâng 45°", ve: () => `<g transform="translate(0 0) scale(.5)"><path class="tt-giuong-n" d="M20 82 L120 82 L176 82 M120 82 L64 38"/>${GIUONG()}${NGUOI({ dau: [56, 26], than: [[66, 38], [112, 72]], chan: [[112, 72], [176, 72]] })}</g><path class="tt-mui" d="M92 40 L108 40"/><path class="tt-mui-dau" d="M108 40 L102 36 L102 44 Z"/><g transform="translate(100 0) scale(.5)"><path class="tt-giuong-n" d="M20 82 L120 82 M120 82 L170 36"/>${GIUONG()}${NGUOI({ dau: [28, 64], than: [[42, 68], [112, 70]], chan: [[118, 72], [168, 36]] })}</g><text class="fg-chu" x="10" y="70">trước</text><text class="fg-chu" x="112" y="70">trong 60–90 giây</text>` },
  };
  function tuThe(k) {
    const t = TU_THE[k]; if (!t) return "";
    return `<figure class="tu-the"><svg viewBox="0 0 200 108" role="img" aria-label="Tư thế: ${t.ten}">${t.ve()}</svg><figcaption>${t.ten}</figcaption></figure>`;
  }

  window.POCUS_FIG = { viTri, dongTac, DONG_TAC, loaiDauDo, tuThe, TU_THE };
})();

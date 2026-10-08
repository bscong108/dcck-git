/* Hình minh họa. Mỗi hình mô tả bằng dữ liệu {kieu:'...', ...} để lưu được vào Sổ ôn lỗi.
   HV.ve(hinh) trả về chuỗi HTML. Ô trống [[i]] trong chuỗi sẽ được biến thành ô nhập. */
(function (g) {
  'use strict';
  const HV = {};
  const VE = {};
  HV.dangKy = (ten, f) => { VE[ten] = f; };

  HV.ve = function (h) {
    if (!h) return '';
    if (Array.isArray(h)) return h.map(HV.ve).join('');
    if (typeof h === 'string') return `<div class="hv">${h}</div>`;
    const f = VE[h.kieu];
    return f ? `<div class="hv hv-${h.kieu}">${f(h)}</div>` : '';
  };

  /* ---- Chữ / HTML tự do ---- */
  VE.chu = h => h.chu;

  /* ---- Hàng đồ vật: {vat:'🍎', so:7, hang:10} ---- */
  VE.vat = h => {
    const hang = h.hang || 10, ds = [];
    for (let i = 0; i < h.so; i += hang) ds.push(`<div class="vat-hang">${(h.vat).repeat(Math.min(hang, h.so - i))}</div>`);
    return (h.nhan ? `<div class="hv-nhan">${h.nhan}</div>` : '') + ds.join('');
  };

  /* ---- Nhóm đồ vật: {vat, soNhom, moi} ---- */
  VE.nhom = h => {
    let s = '<div class="nhom-wrap">';
    for (let i = 0; i < h.soNhom; i++) s += `<div class="nhom">${h.vat.repeat(h.moi)}</div>`;
    return s + '</div>';
  };

  /* ---- Khối trăm, chục, đơn vị: {tram, chuc, dv} ---- */
  VE.khoi = h => {
    let s = '<div class="khoi-wrap">';
    for (let i = 0; i < (h.tram || 0); i++) s += '<div class="k-tram" title="1 trăm"></div>';
    for (let i = 0; i < (h.chuc || 0); i++) s += '<div class="k-chuc" title="1 chục"></div>';
    if (h.dv) { s += '<div class="k-dv-cot">'; for (let i = 0; i < h.dv; i++) s += '<div class="k-dv"></div>'; s += '</div>'; }
    s += '</div><div class="khoi-chu">';
    if (h.tram) s += '<span><i class="k-mau-tram"></i> 1 trăm</span>';
    if (h.chuc) s += '<span><i class="k-mau-chuc"></i> 1 chục</span>';
    if (h.dv) s += '<span><i class="k-mau-dv"></i> 1 đơn vị</span>';
    return s + '</div>';
  };

  /* ---- Khung 10 chấm: {a, b} vẽ a chấm màu 1 rồi b chấm màu 2 ---- */
  VE.khung10 = h => {
    const tong = h.a + (h.b || 0), soKhung = Math.max(1, Math.ceil(tong / 10));
    let s = '<div class="k10-wrap">';
    for (let k = 0; k < soKhung; k++) {
      s += '<div class="k10">';
      for (let i = 0; i < 10; i++) {
        const vt = k * 10 + i;
        const cls = vt < h.a ? 'c1' : vt < tong ? 'c2' : '';
        s += `<span class="k10-o"><i class="${cls}"></i></span>`;
      }
      s += '</div>';
    }
    return s + '</div>';
  };

  /* ---- Tia số: {dau, buoc, so, o:{viTri: chiSoO}} ---- */
  VE.tia = h => {
    let s = '<div class="tia"><div class="tia-truc"></div><div class="tia-vach">';
    for (let i = 0; i < h.so; i++) {
      const gt = h.dau + i * h.buoc;
      const nhan = h.o && h.o[i] !== undefined ? `[[${h.o[i]}]]` : `<b>${gt}</b>`;
      s += `<div class="tia-moc"><i></i><div>${nhan}</div></div>`;
    }
    return s + '</div></div>';
  };

  /* ---- Đồng hồ kim: {gio, phut} ---- */
  HV.dongHoSvg = function (gio, phut, kichThuoc, id) {
    const k = kichThuoc || 180;
    let so = '';
    for (let i = 1; i <= 12; i++) {
      const a = (i * 30 - 90) * Math.PI / 180;
      so += `<text x="${100 + 70 * Math.cos(a)}" y="${100 + 70 * Math.sin(a) + 7}" text-anchor="middle" class="dh-so">${i}</text>`;
    }
    let vach = '';
    for (let i = 0; i < 60; i++) {
      const a = (i * 6) * Math.PI / 180, r1 = i % 5 ? 86 : 82;
      vach += `<line x1="${100 + r1 * Math.sin(a)}" y1="${100 - r1 * Math.cos(a)}" x2="${100 + 90 * Math.sin(a)}" y2="${100 - 90 * Math.cos(a)}" class="${i % 5 ? 'dh-v' : 'dh-V'}"/>`;
    }
    const gocP = phut * 6, gocG = ((gio % 12) + phut / 60) * 30;
    return `<svg viewBox="0 0 200 200" width="${k}" height="${k}" class="dong-ho" ${id ? `id="${id}"` : ''} role="img" aria-label="Đồng hồ">
      <circle cx="100" cy="100" r="95" class="dh-mat"/>${vach}${so}
      <line x1="100" y1="100" x2="100" y2="52" class="dh-kim-gio" transform="rotate(${gocG} 100 100)"/>
      <line x1="100" y1="100" x2="100" y2="24" class="dh-kim-phut" transform="rotate(${gocP} 100 100)"/>
      <circle cx="100" cy="100" r="6" class="dh-tam"/></svg>`;
  };
  VE.dongHo = h => HV.dongHoSvg(h.gio, h.phut, h.co);

  /* ---- Tờ lịch tháng: {nam, thang, danhDau:[ngay]} (ngày thật theo lịch) ---- */
  HV.soNgay = (nam, thang) => new Date(nam, thang, 0).getDate();
  HV.thu = (nam, thang, ngay) => new Date(nam, thang - 1, ngay).getDay(); // 0 = Chủ nhật
  HV.tenThu = d => d === 0 ? 'Chủ nhật' : 'Thứ ' + ['', 'hai', 'ba', 'tư', 'năm', 'sáu', 'bảy'][d];
  VE.lich = h => {
    const n = HV.soNgay(h.nam, h.thang), dau = HV.thu(h.nam, h.thang, 1);
    const cot = (dau + 6) % 7;           // thứ hai đứng đầu
    let s = `<div class="lich"><div class="lich-dau">Tháng ${h.thang} năm ${h.nam}</div><div class="lich-luoi">`;
    ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].forEach(t => { s += `<b class="lich-thu">${t}</b>`; });
    for (let i = 0; i < cot; i++) s += '<span></span>';
    for (let d = 1; d <= n; d++) {
      const dd = h.danhDau && h.danhDau.includes(d) ? ' danh-dau' : '';
      const an = h.an && h.an.includes(d) ? '' : d;
      s += `<span class="lich-ngay${dd}">${an}</span>`;
    }
    return s + '</div></div>';
  };

  /* ---- Cân hai đĩa: {trai:['🍉','2kg'], phai:['5kg'], nghieng:-1|0|1} ---- */
  const quaCan = x => /kg$/.test(x) ? `<span class="qua-can">${x.replace('kg', '')}<small>kg</small></span>` : `<span class="vat-can">${x}</span>`;
  VE.can = h => {
    const ng = h.nghieng || 0;          // -1: bên trái nặng hơn (đĩa trái thấp)
    return `<div class="can" style="--ng:${ng * 8}deg">
      <div class="can-don"><div class="can-dia trai">${h.trai.map(quaCan).join('')}</div><div class="can-dia phai">${h.phai.map(quaCan).join('')}</div></div>
      <div class="can-chan"></div></div>`;
  };

  /* ---- Bình nước: {lit, max} ---- */
  VE.binh = h => {
    let s = '<div class="binh-wrap">';
    (h.ds || [{ lit: h.lit, max: h.max || 10, nhan: h.nhan }]).forEach(b => {
      const pt = Math.round(b.lit / b.max * 100);
      s += `<div class="binh-mot"><div class="binh"><div class="binh-nuoc" style="height:${pt}%"></div>`;
      for (let i = 1; i < b.max; i++) s += `<i style="bottom:${i / b.max * 100}%"></i>`;
      s += `</div><div class="hv-nhan">${b.nhan || ''}</div></div>`;
    });
    return s + '</div>';
  };

  /* ---- Tiền Việt Nam: {to:[500, 200, ...]} ---- */
  const MAU_TIEN = { 100: 'tien-100', 200: 'tien-200', 500: 'tien-500', 1000: 'tien-1000', 2000: 'tien-2000', 5000: 'tien-5000', 10000: 'tien-10000' };
  HV.toTien = m => `<span class="to-tien ${MAU_TIEN[m] || ''}"><b>${T.so(m)}</b><small>đồng</small></span>`;
  VE.tien = h => `<div class="tien-wrap">${h.to.map(HV.toTien).join('')}</div>`;

  /* ---- Sơ đồ đoạn thẳng: {hang:[{nhan:'An', doan:[{dai:5, chu:'15'}], ngoac:'?'}]} ---- */
  VE.thanh = h => {
    const max = Math.max(...h.hang.map(r => T.tong(r.doan.map(d => d.dai))));
    let s = '<div class="so-do">';
    h.hang.forEach(r => {
      s += `<div class="sd-hang"><div class="sd-nhan">${r.nhan}</div><div class="sd-thanh">`;
      r.doan.forEach((d, i) => {
        s += `<div class="sd-doan ${d.loai || ''}" style="width:${d.dai / max * 100}%"><span>${d.chu == null ? '' : d.chu}</span></div>`;
      });
      s += `</div>${r.sau ? `<div class="sd-sau">${r.sau}</div>` : ''}</div>`;
    });
    if (h.ghiChu) s += `<div class="hv-nhan">${h.ghiChu}</div>`;
    return s + '</div>';
  };

  /* ---- Hình học bằng SVG ---- */
  HV.hinhPhang = function (ten, k) {
    const kk = k || 90;
    const svg = inner => `<svg viewBox="0 0 100 100" width="${kk}" height="${kk}" class="hp">${inner}</svg>`;
    switch (ten) {
      case 'tamGiac': return svg('<polygon points="50,12 90,86 10,86" class="hp-to"/>');
      case 'tuGiac': return svg('<polygon points="18,20 82,12 90,84 12,72" class="hp-to"/>');
      case 'vuong': return svg('<rect x="18" y="18" width="64" height="64" class="hp-to"/>');
      case 'chuNhat': return svg('<rect x="8" y="28" width="84" height="46" class="hp-to"/>');
      case 'tron': return svg('<circle cx="50" cy="50" r="38" class="hp-to"/>');
      case 'nguGiac': return svg('<polygon points="50,10 90,40 75,88 25,88 10,40" class="hp-to"/>');
      case 'doanThang': return svg('<line x1="12" y1="62" x2="88" y2="38" class="hp-net"/><circle cx="12" cy="62" r="4" class="hp-diem"/><circle cx="88" cy="38" r="4" class="hp-diem"/>');
      case 'duongThang': return svg('<line x1="0" y1="66" x2="100" y2="34" class="hp-net"/>');
      case 'duongCong': return svg('<path d="M8,70 C30,10 60,100 92,30" class="hp-net"/>');
      case 'gapKhuc': return svg('<polyline points="8,80 32,30 60,70 92,22" class="hp-net"/><g class="hp-diem"><circle cx="8" cy="80" r="4"/><circle cx="32" cy="30" r="4"/><circle cx="60" cy="70" r="4"/><circle cx="92" cy="22" r="4"/></g>');
      case 'diem': return svg('<circle cx="50" cy="50" r="6" class="hp-diem"/><text x="58" y="44" class="hp-chu">A</text>');
      default: return '';
    }
  };
  VE.hinhPhang = h => HV.hinhPhang(h.ten, h.co);

  HV.khoi3d = function (ten, k) {
    const kk = k || 100;
    const svg = inner => `<svg viewBox="0 0 100 100" width="${kk}" height="${kk}" class="k3">${inner}</svg>`;
    switch (ten) {
      case 'tru': return svg('<path d="M22,22 v56 a28,10 0 0 0 56,0 v-56" class="k3-mat"/><ellipse cx="50" cy="22" rx="28" ry="10" class="k3-tren"/>');
      case 'cau': return svg('<circle cx="50" cy="52" r="36" class="k3-mat"/><ellipse cx="50" cy="52" rx="36" ry="11" class="k3-vien"/><circle cx="38" cy="38" r="8" class="k3-sang"/>');
      case 'lapPhuong': return svg('<polygon points="20,34 62,34 62,80 20,80" class="k3-mat"/><polygon points="20,34 38,18 80,18 62,34" class="k3-tren"/><polygon points="62,34 80,18 80,64 62,80" class="k3-ben"/>');
      case 'hopCN': return svg('<polygon points="8,44 70,44 70,82 8,82" class="k3-mat"/><polygon points="8,44 28,28 90,28 70,44" class="k3-tren"/><polygon points="70,44 90,28 90,66 70,82" class="k3-ben"/>');
      default: return '';
    }
  };
  VE.khoi3d = h => HV.khoi3d(h.ten, h.co);

  /* Hình điểm – đoạn: {diem:[{x,y,ten}], doan:[[i,j,'3 cm']], gap:true} trong khung 0..300 x 0..h */
  VE.diem = h => {
    const H = h.cao || 160;
    let s = `<svg viewBox="0 0 300 ${H}" class="hv-svg" role="img">`;
    (h.doan || []).forEach(([i, j, nhan]) => {
      const a = h.diem[i], b = h.diem[j];
      s += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" class="hp-net"/>`;
      if (nhan) {
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        const dx = b.y - a.y, dy = a.x - b.x, l = Math.hypot(dx, dy) || 1;
        s += `<text x="${mx + dx / l * 16}" y="${my + dy / l * 16 + 5}" text-anchor="middle" class="hp-do">${nhan}</text>`;
      }
    });
    h.diem.forEach(p => {
      s += `<circle cx="${p.x}" cy="${p.y}" r="5" class="hp-diem"/>`;
      if (p.ten) s += `<text x="${p.x + (p.dx || 0)}" y="${p.y + (p.dy || -12)}" text-anchor="middle" class="hp-chu">${p.ten}</text>`;
    });
    return s + '</svg>';
  };

  /* Hình quạt tam giác: đỉnh A, đáy có k điểm → đếm hình tam giác */
  VE.quat = h => {
    const k = h.k, A = { x: 150, y: 18 }, ten = 'BCDEFGH';
    let s = '<svg viewBox="0 0 300 170" class="hv-svg">';
    const day = T.lap(k, i => ({ x: 30 + i * (240 / (k - 1)), y: 150 }));
    s += `<line x1="${day[0].x}" y1="150" x2="${day[k - 1].x}" y2="150" class="hp-net"/>`;
    day.forEach(p => { s += `<line x1="${A.x}" y1="${A.y}" x2="${p.x}" y2="${p.y}" class="hp-net"/>`; });
    s += `<circle cx="${A.x}" cy="${A.y}" r="4" class="hp-diem"/><text x="${A.x}" y="${A.y - 6}" text-anchor="middle" class="hp-chu">A</text>`;
    day.forEach((p, i) => { s += `<circle cx="${p.x}" cy="150" r="4" class="hp-diem"/><text x="${p.x}" y="168" text-anchor="middle" class="hp-chu">${ten[i]}</text>`; });
    return s + '</svg>';
  };

  /* Hình chữ nhật chia thành các phần dọc (đếm hình chữ nhật / tứ giác) */
  VE.oDoc = h => {
    const k = h.k;
    let s = '<svg viewBox="0 0 300 110" class="hv-svg"><rect x="20" y="15" width="260" height="80" class="hp-to-nhat"/>';
    for (let i = 1; i < k; i++) { const x = 20 + i * 260 / k; s += `<line x1="${x}" y1="15" x2="${x}" y2="95" class="hp-net"/>`; }
    return s + '</svg>';
  };

  /* ---- Biểu đồ tranh: {hang:[{ten, bieu, so}], chuThich} ---- */
  VE.bieuDo = h => {
    let s = '<table class="bieu-do"><tbody>';
    h.hang.forEach(r => { s += `<tr><th>${r.ten}</th><td>${r.bieu.repeat(r.so)}</td></tr>`; });
    s += '</tbody></table>';
    if (h.chuThich) s += `<div class="hv-nhan">${h.chuThich}</div>`;
    return s;
  };

  /* ---- Hộp bi: {bi:[['🔴',3],['🔵',5]]} ---- */
  VE.hop = h => `<div class="hop-bi">${h.bi.map(([b, n]) => b.repeat(n)).join('')}</div>${h.nhan ? `<div class="hv-nhan">${h.nhan}</div>` : ''}`;

  /* ---- Toà nhà nhiều tầng ---- */
  VE.toaNha = h => {
    let s = '<div class="toa-nha">';
    for (let t = h.tang; t >= 1; t--) s += `<div class="tang${h.danhDau && h.danhDau.includes(t) ? ' danh-dau' : ''}">Tầng ${t}${h.nguoi === t ? ' 🧒' : ''}</div>`;
    return s + '</div>';
  };

  /* ---- Cỗ máy: ô đầu → bước → … → kết quả. {dau:'?', buoc:['+3','+2'], cuoi:16} ---- */
  VE.coMay = h => {
    let s = `<div class="co-may"><div class="cm-o">${h.dau}</div>`;
    h.buoc.forEach((b, i) => {
      s += `<div class="cm-mui">${b}<span>➜</span></div><div class="cm-o">${i === h.buoc.length - 1 ? h.cuoi : (h.giua && h.giua[i] != null ? h.giua[i] : '…')}</div>`;
    });
    return s + '</div>';
  };

  /* ---- Hàng lặp lại theo quy luật: {ds:['🔴','🔵',...]} ---- */
  VE.hang = h => `<div class="hang-ql">${h.ds.map(x => `<span>${x}</span>`).join('')}</div>`;

  /* ---- Phép tính đặt cột: {dong:[['', '4','7'], ['+','2','5']], kq:['[[0]]','[[1]]']} ---- */
  VE.datTinh = h => {
    const w = Math.max(...h.dong.map(r => r.length), h.kq.length + 1);
    const pad = r => T.lap(w - r.length, () => '').concat(r);
    let s = '<div class="dat-tinh">';
    h.dong.forEach((r, i) => { s += `<div class="dt-hang${i === h.dong.length - 1 ? ' dt-gach' : ''}">${pad(r).map(c => `<span>${c}</span>`).join('')}</div>`; });
    s += `<div class="dt-hang dt-kq">${pad(h.kq).map(c => `<span>${c}</span>`).join('')}</div>`;
    return s + '</div>';
  };

  /* ---- Bảng điền số (như bảng Số hạng – Tổng) ---- */
  VE.bang = h => {
    let s = '<div class="bang-cuon"><table class="bang-dien"><tbody>';
    h.hang.forEach(r => { s += `<tr><th>${r[0]}</th>${r.slice(1).map(c => `<td>${c}</td>`).join('')}</tr>`; });
    return s + '</tbody></table></div>';
  };

  g.HV = HV;
})(typeof window !== 'undefined' ? window : globalThis);

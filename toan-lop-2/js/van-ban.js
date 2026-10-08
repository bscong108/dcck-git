/* Đọc bài tập do phụ huynh soạn bằng chữ thường (xem HUONG-DAN.md, mục "Thêm bài của cô").
   VB.phanTich(chuoi) → { ds: [ {id, ten, nguon, cau:[...]} ], loi: ['dòng 12: ...'] } */
(function (g) {
  'use strict';
  const VB = {};
  const boDau = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  /* Các kiểu câu tự chấm được: ứng dụng tự tính đáp án từ đề. */
  const KIEU_TU_TINH = {
    'cau-dat-tinh': /^cau dat tinh\s*:/, 'cau-tinh-cm': /^cau tinh\s*\(cm\)\s*:/, 'cau-tinh': /^cau tinh\s*:/,
    'cau-so-sanh': /^cau so sanh\s*:/, 'cau-dung-sai': /^cau dung sai\s*:/, 'cau-dien-dau': /^cau dien dau\s*:/,
    'cau-xep-tang': /^cau xep tang\s*:/, 'cau-xep-giam': /^cau xep giam\s*:/, 'cau-doc-so': /^cau doc so\s*:/,
    'cau-tach-gop': /^cau tach gop\s*:/, 'cau-chon-nhieu': /^cau chon nhieu\s*:/
  };
  const KHOA = Object.entries(KIEU_TU_TINH).concat([
    ['hinh-json', /^hinh json\s*:/], ['dong-ho', /^dong ho\s*:/],
    ['cau-giai', /^cau giai toan\s*:/], ['cau', /^cau\s*\d*\s*:/], ['dap-an', /^dap an\s*:/], ['lua-chon', /^lua chon\s*:/],
    ['goi-y', /^goi y\s*:/], ['cach-giai', /^cach giai\s*:/], ['sai', /^sai thuong gap\s*:/], ['don-vi', /^don vi\s*:/],
    ['loi-giai', /^loi giai\s*:/], ['phep-tinh', /^phep tinh\s*:/], ['dap-so', /^dap so\s*:/], ['nguon', /^nguon\s*:/],
    ['khong-thu-tu', /^khong can thu tu\s*$/], ['tu-cham', /^tu cham\s*$/], ['hinh', /^hinh\s*:/]
  ]);
  /* Tính một dãy cộng trừ từ trái sang phải: "90 − 10 − 20" → 60. Bỏ qua chữ cm, kg, l. */
  const tinhDay = s => {
    const t = String(s).replace(/(\d)\s*(cm|dm|kg|l|m)\b/g, '$1').replace(/[−–]/g, '-').replace(/\s+/g, '');
    if (!/^\d+([+\-]\d+)*$/.test(t)) return null;
    const so = t.split(/[+\-]/).map(Number), dau = t.replace(/\d+/g, '').split('');
    let kq = so[0];
    dau.forEach((d, i) => { kq = d === '+' ? kq + so[i + 1] : kq - so[i + 1]; });
    return kq;
  };
  const viet = s => String(s).replace(/-/g, '−').replace(/\s*([+−])\s*/g, ' $1 ').trim();
  const soSanh = (a, b) => a < b ? '<' : a > b ? '>' : '=';
  const tachDs = s => String(s).split(';').map(x => x.trim()).filter(Boolean);
  const docSo = s => { const t = String(s).replace(/[\s .]/g, ''); return /^\d+$/.test(t) ? Number(t) : null; };
  const tachPhep = s => {
    const m = String(s).replace(/\s+/g, ' ').match(/^\s*([\d\s.]+?)\s*([+\-−×x*:\/])\s*([\d\s.]+?)\s*=\s*([\d\s.]+?)\s*(\(.*\))?\s*$/);
    if (!m) return null;
    const dau = { '+': '+', '-': '−', '−': '−', '×': '×', 'x': '×', '*': '×', ':': ':', '/': ':' }[m[2]];
    const a = docSo(m[1]), b = docSo(m[3]), kq = docSo(m[4]);
    if (a == null || b == null || kq == null) return null;
    const dung = dau === '+' ? a + b : dau === '−' ? a - b : dau === '×' ? a * b : b ? a / b : NaN;
    return { a, dau, b, kq, dung: dung === kq };
  };

  VB.phanTich = function (chuoi) {
    const dong = String(chuoi || '').replace(/\r/g, '').split('\n');
    const ds = [], loi = [];
    let phieu = null, cau = null, khoaTruoc = null;

    function moPhieu(ten) { phieu = { id: 'p-' + boDau(ten).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + ds.length, ten, nguon: '', cau: [] }; ds.push(phieu); }
    function dongCau() {
      if (!cau) return;
      const q = dungCau(cau, loi);
      if (q) { if (!phieu) moPhieu('Bài của cô'); phieu.cau.push(q); }
      cau = null;
    }

    dong.forEach((raw, i) => {
      const s = raw.replace(/^\s*[-•]\s+/, '').trim();
      if (!s || s.startsWith('//')) { if (!s) khoaTruoc = null; return; }
      if (s.startsWith('#')) { dongCau(); moPhieu(s.replace(/^#+\s*/, '')); return; }
      const kd = boDau(s);
      const k = KHOA.find(([, re]) => re.test(kd));
      if (!k) {
        if (cau && cau.dapAn == null && !cau.phepTinh.length && (khoaTruoc === 'cau' || khoaTruoc === 'cau-giai' || khoaTruoc === 'hinh' || khoaTruoc === 'hinh-json' || khoaTruoc === 'dong-ho')) { cau.de += '<br>' + T.esc(s); return; }
        if (cau && khoaTruoc === 'goi-y') { cau.goiY[cau.goiY.length - 1] += ' ' + s; return; }
        if (cau && khoaTruoc === 'cach-giai') { cau.cachGiai.push(s); return; }
        loi.push(`Dòng ${i + 1}: không hiểu “${s.slice(0, 40)}”. Dòng phải bắt đầu bằng Câu:, Đáp án:, Gợi ý:…`); return;
      }
      const giaTri = s.replace(/^[^:]*:\s*/, '').trim();
      khoaTruoc = k[0];
      switch (k[0]) {
        case 'cau': case 'cau-giai': case 'cau-dat-tinh': case 'cau-tinh-cm': case 'cau-tinh': case 'cau-so-sanh': case 'cau-dung-sai':
        case 'cau-dien-dau': case 'cau-xep-tang': case 'cau-xep-giam': case 'cau-doc-so': case 'cau-tach-gop': case 'cau-chon-nhieu':
          dongCau();
          cau = { dong: i + 1, kieu: k[0], tho: giaTri, giaiToan: k[0] === 'cau-giai', de: T.esc(giaTri), hinhJson: null, dongHo: null, dapAn: null, luaChon: null, goiY: [], cachGiai: [], sai: {}, donVi: '', loiGiai: [], phepTinh: [], dapSo: null, khongThuTu: false, tuCham: false, hinh: '' };
          break;
        case 'nguon': if (phieu) phieu.nguon = giaTri; break;
        default:
          if (!cau) { loi.push(`Dòng ${i + 1}: “${s.slice(0, 30)}” phải nằm sau một dòng Câu:`); return; }
          if (k[0] === 'dap-an') cau.dapAn = giaTri;
          else if (k[0] === 'lua-chon') cau.luaChon = giaTri.split('|').map(x => x.trim()).filter(Boolean);
          else if (k[0] === 'goi-y') cau.goiY.push(giaTri);
          else if (k[0] === 'cach-giai') cau.cachGiai.push(giaTri);
          else if (k[0] === 'sai') { const m = giaTri.match(/^(\d+)\s*=>\s*(.+)$/); if (m) cau.sai[m[1]] = m[2]; else loi.push(`Dòng ${i + 1}: viết “Sai thường gặp: 15 => lời nhắc”`); }
          else if (k[0] === 'don-vi') cau.donVi = giaTri;
          else if (k[0] === 'loi-giai') cau.loiGiai.push(giaTri);
          else if (k[0] === 'phep-tinh') cau.phepTinh.push(giaTri);
          else if (k[0] === 'dap-so') cau.dapSo = giaTri;
          else if (k[0] === 'khong-thu-tu') cau.khongThuTu = true;
          else if (k[0] === 'tu-cham') cau.tuCham = true;
          else if (k[0] === 'hinh') cau.hinh = giaTri;
          else if (k[0] === 'hinh-json') { try { cau.hinhJson = JSON.parse(giaTri); } catch (e) { loi.push(`Dòng ${i + 1}: Hình JSON viết sai`); } }
          else if (k[0] === 'dong-ho') { const m = giaTri.match(/^(\d{1,2})\s*[:h]\s*(\d{1,2})$/); if (m) cau.dongHo = { gio: +m[1], phut: +m[2] }; else loi.push(`Dòng ${i + 1}: viết “Đồng hồ: 8:30”`); }
      }
    });
    dongCau();
    return { ds: ds.filter(p => p.cau.length), loi };
  };

  function goiYTuChu(ds) {
    return ds.map(x => { const m = x.match(/^(.*?)\s*=\s*(\d[\d\s]*)\s*$/); return m ? { hoi: m[1], dap: docSo(m[2]) } : x; });
  }

  function dungCau(c, loi) {
    const bao = m => loi.push(`Câu ở dòng ${c.dong}: ${m}`);
    const chung = { goiY: goiYTuChu(c.goiY), loiGiai: c.cachGiai.slice(), nguonPhieu: true };
    const hinh = [];
    if (c.hinh) hinh.push({ kieu: 'chu', chu: `<div class="bieu-to">${T.esc(c.hinh)}</div>` });
    if (c.dongHo) hinh.push({ kieu: 'dongHo', gio: c.dongHo.gio, phut: c.dongHo.phut });
    if (c.hinhJson) hinh.push(...[].concat(c.hinhJson));
    if (hinh.length) chung.hinh = hinh.length === 1 ? hinh[0] : hinh;
    if (c.kieu && KIEU_TU_TINH[c.kieu]) { const q = dungTuTinh(c, chung, bao); return q ? Object.assign(q, { nguonPhieu: true }) : null; }
    if (Object.keys(c.sai).length) chung.saiThuong = c.sai;

    /* --- Bài giải toán có lời văn --- */
    if (c.giaiToan || c.phepTinh.length) {
      const phep = [];
      for (let i = 0; i < c.phepTinh.length; i++) {
        const p = tachPhep(c.phepTinh[i]);
        if (!p) { bao(`không đọc được phép tính “${c.phepTinh[i]}” (viết như 43 + 5 = 48)`); return null; }
        if (!p.dung) { bao(`phép tính “${c.phepTinh[i]}” chưa đúng`); return null; }
        phep.push(Object.assign(p, { cau: c.loiGiai[i] || '' }));
      }
      if (!phep.length) { bao('bài giải toán cần ít nhất một dòng Phép tính:'); return null; }
      const ds = String(c.dapSo || '').match(/^\s*([\d\s.]+)\s*(.*?)\.?\s*$/);
      const donVi = ds ? ds[2] : c.donVi;
      const dapSo = ds ? docSo(ds[1]) : phep[phep.length - 1].kq;
      const q = Q.giaiToan({
        de: c.de, donVi: donVi || '', dapSo,
        phep: phep.map(p => ({ hoi: p.cau ? p.cau.replace(/\s*là\s*:?\s*$/i, '').replace(/^./, x => x.toLowerCase()) : 'kết quả', cau: p.cau, a: p.a, dau: p.dau, b: p.b, kq: p.kq })),
        goiY: chung.goiY,
        loiGiai: chung.loiGiai.length ? chung.loiGiai : undefined
      });
      if (chung.hinh) q.hinh = chung.hinh;
      return Object.assign(q, { nguonPhieu: true });
    }

    /* --- Tự chấm (bài vẽ, bài giải thích) --- */
    if (c.tuCham || (c.dapAn != null && !c.luaChon && docSo(c.dapAn) == null && !/[;,]/.test(c.dapAn))) {
      return Object.assign({ loai: 'tuCham', de: c.de, dapAnChu: c.dapAn || '' }, chung, { loiGiai: chung.loiGiai.length ? chung.loiGiai : [c.dapAn || ''] });
    }
    if (c.dapAn == null) { bao('thiếu dòng Đáp án:'); return null; }

    /* --- Chọn đáp án --- */
    if (c.luaChon) {
      const da = c.dapAn.trim();
      let idx = c.luaChon.findIndex(x => boDau(x) === boDau(da));
      if (idx < 0 && /^[A-Ha-h]$/.test(da)) idx = da.toUpperCase().charCodeAt(0) - 65;
      if (idx < 0 || idx >= c.luaChon.length) { bao(`đáp án “${da}” không có trong Lựa chọn`); return null; }
      return Object.assign(Q.chon(c.de, c.luaChon.map(T.esc), idx, { giuThuTu: true }), chung, { loiGiai: chung.loiGiai.length ? chung.loiGiai : [`Đáp án: ${c.luaChon[idx]}`] });
    }

    /* --- Điền số --- */
    const so = c.dapAn.split(/[;,]/).map(docSo);
    if (so.some(x => x == null)) { bao(`đáp án “${c.dapAn}” phải là số (nhiều số thì cách nhau bằng dấu ; hoặc ,)`); return null; }
    let de = c.de, k = 0;
    de = de.replace(/□|\[\s*\]|\.{3,}|…+/g, () => `[[${k++}]]`);
    const oTrongHinh = (HV.ve(chung.hinh).match(/\[\[\d+\]\]/g) || []).length;
    if (!k && oTrongHinh) k = oTrongHinh;
    const loiGiai = chung.loiGiai.length ? chung.loiGiai : ['Đáp án: ' + so.join('; ')];
    if (k && k !== so.length) { bao(`đề có ${k} ô trống nhưng đáp án có ${so.length} số`); return null; }
    if (!k) {
      if (so.length === 1) return Object.assign(Q.so(de, so[0], { donVi: c.donVi }), chung, { loiGiai });
      de += `<div class="dong-tinh">${so.map((_, i) => `[[${i}]]`).join(' ; ')}</div>`;
    }
    if (so.length === 1) return Object.assign(Q.so(de, so[0], { donVi: c.donVi }), chung, { loiGiai });
    const q = Object.assign(Q.o(de, so), chung, { loiGiai });
    if (c.khongThuTu) q.khongThuTu = true;
    return q;
  }

  /* ---------- Các kiểu câu ứng dụng tự tính đáp án ---------- */
  function dungTuTinh(c, chung, bao) {
    const lg = chung.loiGiai.length ? chung.loiGiai : null;
    switch (c.kieu) {
      case 'cau-tinh': case 'cau-tinh-cm': {
        const cm = c.kieu === 'cau-tinh-cm', ds = tachDs(c.tho), kq = ds.map(tinhDay);
        if (!ds.length || kq.some(x => x == null || x < 0)) { bao('không tính được dãy “' + c.tho + '”'); return null; }
        const hien = e => cm ? viet(e).replace(/(\d+)/g, '$1cm') : viet(e);
        return Q.o('Tính:' + ds.map((e, i) => `<div class="dong-tinh">${hien(e)} = [[${i}]]${cm ? ' <span class="don-vi">cm</span>' : ''}</div>`).join(''), kq,
          Object.assign({}, chung, { goiY: chung.goiY.length ? chung.goiY : ['Tính lần lượt từ trái sang phải.', cm ? 'Tính với các số trước, rồi viết thêm “cm” ở kết quả.' : 'Gặp phép tính khó thì đặt tính ra nháp.'], loiGiai: lg || ds.map((e, i) => `${hien(e)} = ${kq[i]}${cm ? 'cm' : ''}`) }));
      }
      case 'cau-dat-tinh': {
        const buoc = [];
        for (const e of tachDs(c.tho)) {
          const m = viet(e).match(/^(\d+) ([+−]) (\d+)$/);
          if (!m) { bao('đặt tính chỉ nhận phép tính hai số: “' + e + '”'); return null; }
          const a = +m[1], dau = m[2], b = +m[3], kq = dau === '+' ? a + b : a - b;
          if (kq < 0) { bao('phép trừ ra số âm: ' + e); return null; }
          const nho = dau === '+' ? a % 10 + b % 10 >= 10 : a % 10 < b % 10;
          buoc.push(Q.o(`Đặt tính rồi tính: <b>${a} ${dau} ${b}</b>`, String(kq).split('').map(Number), {
            hinh: CT.datTinh(a, b, dau, kq, true), ghiMau: `${a} ${dau} ${b} = ${kq}`,
            goiY: [dau === '+' ? { hoi: `Hàng đơn vị: ${a % 10} + ${b % 10} = ?`, dap: a % 10 + b % 10 } : (nho ? `Hàng đơn vị: ${a % 10} không trừ được ${b % 10}, lấy ${a % 10 + 10} − ${b % 10} rồi nhớ 1.` : { hoi: `Hàng đơn vị: ${a % 10} − ${b % 10} = ?`, dap: a % 10 - b % 10 }),
              nho ? (dau === '+' ? 'Được 10 trở lên thì viết chữ số hàng đơn vị, nhớ 1 sang hàng chục.' : 'Nhớ 1 thì cộng thêm 1 vào chữ số hàng chục của số trừ.') : 'Rồi tính tiếp hàng chục.']
          }));
        }
        return Q.buoc('Đặt tính rồi tính từng phép (thẳng hàng: đơn vị dưới đơn vị, chục dưới chục).', buoc, Object.assign({}, chung, { loiGiai: lg || buoc.map(b => b.ghiMau) }));
      }
      case 'cau-so-sanh': {
        const cap = [];
        for (const e of tachDs(c.tho)) {
          const [L, R] = e.split('?').map(x => x && x.trim()), a = tinhDay(L), b = tinhDay(R);
          if (a == null || b == null) { bao('không so sánh được “' + e + '”'); return null; }
          cap.push({ L: viet(L), R: viet(R), a, b });
        }
        return Q.tha('Kéo dấu &lt;, &gt;, = vào ô trống:<div class="cot-ss">' + cap.map((p, i) => `<div>${p.L} {{${i}}} ${p.R}</div>`).join('') + '</div>',
          ['<', '>', '='], cap.map(p => soSanh(p.a, p.b)), Object.assign({}, chung, { dungLai: true, goiY: chung.goiY.length ? chung.goiY : ['Tính kết quả mỗi bên ra nháp trước, rồi mới so sánh.'], loiGiai: lg || cap.map(p => `${p.L === String(p.a) ? p.a : p.L + ' = ' + p.a}; ${p.R === String(p.b) ? p.b : p.R + ' = ' + p.b} → ${p.a} ${soSanh(p.a, p.b)} ${p.b}`) }));
      }
      case 'cau-dung-sai': {
        let dung = null, giaiThich = '';
        if (c.dapAn) dung = /^(d|đ|dung|đúng)$/i.test(c.dapAn.trim()) ? true : /^(s|sai)$/i.test(c.dapAn.trim()) ? false : null;
        else {
          const m = c.tho.match(/^(.+?)\s*(=|<|>)\s*(.+)$/);
          const a = m && tinhDay(m[1]), b = m && tinhDay(m[3]);
          if (a == null || b == null) { bao('cần dòng “Đáp án: Đ” hoặc “Đáp án: S”'); return null; }
          dung = soSanh(a, b) === m[2];
          giaiThich = `${viet(m[1])} = ${a}; ${viet(m[3])} = ${b}. Vì ${a} ${soSanh(a, b)} ${b} nên câu này ${dung ? 'đúng' : 'sai'}.`;
        }
        if (dung == null) { bao('Đáp án phải là Đ hoặc S'); return null; }
        return Q.chon(`Đúng ghi Đ, sai ghi S:<div class="dong-tinh">${T.esc(viet(c.tho))}</div>`, ['Đ (đúng)', 'S (sai)'], dung ? 0 : 1,
          Object.assign({}, chung, { giuThuTu: true, cot: 2, goiY: chung.goiY.length ? chung.goiY : ['Tính từng bên rồi kiểm tra.', 'Nếu có đơn vị đo (cm, kg…) thì các số phải viết đủ đơn vị.'], loiGiai: lg || [giaiThich || (dung ? 'Câu này đúng.' : 'Câu này sai.')] }));
      }
      case 'cau-dien-dau': {
        const m = c.tho.match(/^(.+?)=\s*(\d+)\s*$/);
        const so = m ? m[1].split('?').map(x => docSo(x)) : [];
        if (!m || so.length < 2 || so.some(x => x == null)) { bao('viết “Câu điền dấu: 12 ? 3 ? 1 = 14”'); return null; }
        const kq = Number(m[2]), loiDung = [];
        const thu = (i, v, dau) => { if (i === so.length) { if (v === kq) loiDung.push(dau.slice()); return; } ['+', '−'].forEach(d => { dau.push(d); thu(i + 1, d === '+' ? v + so[i] : v - so[i], dau); dau.pop(); }); };
        thu(1, so[0], []);
        if (!loiDung.length) { bao('không có cách điền dấu nào đúng'); return null; }
        const de = so.map((x, i) => i < so.length - 1 ? `${x} {{${i}}}` : `${x}`).join(' ') + ` = ${kq}`;
        return Q.tha(`Kéo dấu + hoặc − vào ô trống cho đúng:<div class="dong-tinh">${de}</div>`, ['+', '−'], loiDung[0], Object.assign({}, chung, {
          dungLai: true, dapAnKhac: loiDung.slice(1), goiY: chung.goiY.length ? chung.goiY : ['Thử dấu + trước, tính từ trái sang phải. Không đúng thì đổi sang dấu −.', 'Kết quả bé hơn số đầu tiên thì chắc chắn phải có dấu −.'],
          loiGiai: lg || loiDung.map(d => so.map((x, i) => i < so.length - 1 ? `${x} ${d[i]}` : `${x}`).join(' ') + ` = ${kq}`)
        }));
      }
      case 'cau-xep-tang': case 'cau-xep-giam': {
        const ds = String(c.dapAn || '').split(/[;,]/).map(docSo);
        if (ds.length < 2 || ds.some(x => x == null)) { bao('Đáp án phải là các số cần xếp, cách nhau bằng dấu phẩy'); return null; }
        const tang = c.kieu === 'cau-xep-tang', sx = ds.slice().sort((a, b) => tang ? a - b : b - a);
        return Q.sapXep(c.de, ds, sx, Object.assign({}, chung, { goiY: chung.goiY.length ? chung.goiY : [`Tìm số ${tang ? 'bé' : 'lớn'} nhất trước, chạm vào nó. Rồi tìm số ${tang ? 'bé' : 'lớn'} nhất trong các số còn lại.`, 'So sánh chữ số hàng chục trước, hàng chục bằng nhau thì so sánh hàng đơn vị.'], loiGiai: lg || [sx.join(tang ? ' < ' : ' > ')] }));
      }
      case 'cau-doc-so': {
        const buoc = tachDs(c.tho).map(docSo);
        if (buoc.some(x => x == null || x > 1000)) { bao('đọc số chỉ nhận số từ 0 đến 1000'); return null; }
        return Q.buoc('Chọn cách đọc đúng của mỗi số.', buoc.map(x => {
          const sai = new Set();
          const dao = x >= 10 && x < 100 ? Number(String(x).split('').reverse().join('')) : null;
          [dao, x + 1, x - 1, x + 10, x - 10].forEach(y => { if (y != null && y >= 0 && y <= 1000 && y !== x && sai.size < 3) sai.add(y); });
          const lc = [T.soChu(x)].concat([...sai].map(T.soChu));
          if (x % 10 === 5 && x > 10) lc[1] = T.soChu(x).replace(/lăm$/, 'năm');
          if (x % 10 === 1 && x > 20) lc[1] = T.soChu(x).replace(/mốt$/, 'một');
          return Q.chon(`Số <b>${x}</b> đọc là:`, [...new Set(lc)], 0, { ghi: `${x}: ${T.soChu(x)}`, goiY: ['Đọc hàng chục trước rồi đến hàng đơn vị. Hàng đơn vị là 5 thì đọc “lăm”, là 1 (từ 21 trở đi) thì đọc “mốt”, là 4 có thể đọc “tư”.'] });
        }), Object.assign({}, chung, { loiGiai: lg || buoc.map(x => `${x}: ${T.soChu(x)}`) }));
      }
      case 'cau-tach-gop': {
        const buoc = [];
        for (const e of tachDs(c.tho)) {
          const m = viet(e).match(/^(\d) \+ (\d)$/), a = m && +m[1], b = m && +m[2];
          if (!m || a + b <= 10) { bao('tách gộp cần hai số có một chữ số, tổng lớn hơn 10: “' + e + '”'); return null; }
          const bu = 10 - a, du = b - bu;
          buoc.push(Q.o(`<div class="dong-tinh">${a} + ${b} = ${a} + [[0]] + [[1]] = 10 + [[2]] = [[3]]</div>`, [bu, du, du, a + b], {
            ghiMau: `${a} + ${b} = ${a} + ${bu} + ${du} = 10 + ${du} = ${a + b}`, hinh: { kieu: 'khung10', a, b },
            goiY: [{ hoi: `${a} cần thêm mấy để được 10?`, dap: bu }, { hoi: `Tách ${b} thành ${bu} và mấy?`, dap: du }]
          }));
        }
        return Q.buoc('Tách – gộp để cộng có nhớ (mẫu: 9 + 7 = 9 + 1 + 6 = 10 + 6 = 16).', buoc, Object.assign({}, chung, { loiGiai: lg || buoc.map(b => b.ghiMau) }));
      }
      case 'cau-chon-nhieu': {
        if (!c.luaChon) { bao('cần dòng Lựa chọn:'); return null; }
        const dung = String(c.dapAn || '').split('|').map(x => x.trim()).filter(Boolean).map(x => c.luaChon.findIndex(y => boDau(y) === boDau(x)));
        if (!dung.length || dung.some(i => i < 0)) { bao('mỗi đáp án phải có trong Lựa chọn (cách nhau bằng |)'); return null; }
        return Q.nhieu(c.de, c.luaChon.map(T.esc), dung, Object.assign({}, chung, { luoi: c.luaChon.length > 6 ? 5 : Math.min(4, c.luaChon.length), loiGiai: lg || ['Đáp án: ' + dung.map(i => c.luaChon[i]).join('; ')] }));
      }
    }
    return null;
  }

  /* Mẫu dùng cho nút "Chèn mẫu" ở Góc phụ huynh */
  VB.MAU = {
    so: 'Câu: Lấy hiệu của 25 và 12 rồi cộng với 36 được kết quả là:\nĐáp án: 49\nGợi ý: Hiệu của 25 và 12 là bao nhiêu? = 13\nGợi ý: Lấy 13 cộng với 36 được bao nhiêu? = 49\nCách giải: 25 − 12 = 13\nCách giải: 13 + 36 = 49\n',
    o: 'Câu: Điền số: 9 + □ = 7 + 8\nĐáp án: 6\nGợi ý: 7 + 8 bằng bao nhiêu? = 15\nCách giải: 7 + 8 = 15; 9 + 6 = 15\n',
    nhieu: 'Câu: Tìm hai số tự nhiên liên tiếp mà tổng của chúng là số lớn nhất có một chữ số.\nĐáp án: 4; 5\nKhông cần thứ tự\nGợi ý: Số lớn nhất có một chữ số là? = 9\nCách giải: 4 + 5 = 9\n',
    chon: 'Câu: An + Ba = Hương + Lan. An nhiều tuổi hơn Lan. Hỏi Ba nhiều tuổi hơn hay ít tuổi hơn Hương?\nLựa chọn: Ba nhiều tuổi hơn Hương | Ba ít tuổi hơn Hương | Bằng tuổi nhau\nĐáp án: Ba ít tuổi hơn Hương\nGợi ý: Hai tổng bằng nhau giống như cân thăng bằng.\n',
    giai: 'Câu giải toán: Nhà bạn Tú có một đàn gà. Sau khi mẹ bán đi 5 con gà thì còn lại 43 con gà. Hỏi trước khi bán, nhà bạn Tú có bao nhiêu con gà?\nLời giải: Trước khi bán, nhà bạn Tú có số con gà là:\nPhép tính: 43 + 5 = 48\nĐáp số: 48 con gà\nGợi ý: Đã bán đi thì lúc đầu nhiều hơn hay ít hơn bây giờ?\n',
    tuCham: 'Câu: Vẽ một đường gấp khúc gồm 3 đoạn thẳng vào vở.\nTự chấm\nĐáp án: Ba đoạn thẳng nối tiếp nhau, không cùng nằm trên một đường thẳng.\n',
    tinh: 'Câu tính: 27 + 18 − 16; 63 − 27 + 19; 92 − 46 − 18\n',
    datTinh: 'Câu đặt tính: 38 + 27; 45 + 36; 96 − 38; 84 − 27\n',
    soSanh: 'Câu so sánh: 72 + 19 ? 65 + 28; 83 − 27 ? 64 − 19\n',
    dungSai: 'Câu đúng sai: 45 + 23 > 25 + 31\n\nCâu đúng sai: 42 − 2cm = 40cm\nĐáp án: S\nCách giải: Số 42 thiếu đơn vị cm.\n',
    dienDau: 'Câu điền dấu: 18 ? 4 ? 2 ? 3 = 13\n'
  };

  g.VB = VB;
})(typeof window !== 'undefined' ? window : globalThis);

/* Đọc bài tập do phụ huynh soạn bằng chữ thường (xem HUONG-DAN.md, mục "Thêm bài của cô").
   VB.phanTich(chuoi) → { ds: [ {id, ten, nguon, cau:[...]} ], loi: ['dòng 12: ...'] } */
(function (g) {
  'use strict';
  const VB = {};
  const boDau = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  const KHOA = [
    ['cau-giai', /^cau giai toan\s*:/], ['cau', /^cau\s*\d*\s*:/], ['dap-an', /^dap an\s*:/], ['lua-chon', /^lua chon\s*:/],
    ['goi-y', /^goi y\s*:/], ['cach-giai', /^cach giai\s*:/], ['sai', /^sai thuong gap\s*:/], ['don-vi', /^don vi\s*:/],
    ['loi-giai', /^loi giai\s*:/], ['phep-tinh', /^phep tinh\s*:/], ['dap-so', /^dap so\s*:/], ['nguon', /^nguon\s*:/],
    ['khong-thu-tu', /^khong can thu tu\s*$/], ['tu-cham', /^tu cham\s*$/], ['hinh', /^hinh\s*:/]
  ];
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
        if (cau && (khoaTruoc === 'cau' || khoaTruoc === 'cau-giai')) { cau.de += '<br>' + T.esc(s); return; }
        if (cau && khoaTruoc === 'goi-y') { cau.goiY[cau.goiY.length - 1] += ' ' + s; return; }
        if (cau && khoaTruoc === 'cach-giai') { cau.cachGiai.push(s); return; }
        loi.push(`Dòng ${i + 1}: không hiểu “${s.slice(0, 40)}”. Dòng phải bắt đầu bằng Câu:, Đáp án:, Gợi ý:…`); return;
      }
      const giaTri = s.replace(/^[^:]*:\s*/, '').trim();
      khoaTruoc = k[0];
      switch (k[0]) {
        case 'cau': case 'cau-giai':
          dongCau();
          cau = { dong: i + 1, giaiToan: k[0] === 'cau-giai', de: T.esc(giaTri), dapAn: null, luaChon: null, goiY: [], cachGiai: [], sai: {}, donVi: '', loiGiai: [], phepTinh: [], dapSo: null, khongThuTu: false, tuCham: false, hinh: '' };
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
    if (c.hinh) chung.hinh = { kieu: 'chu', chu: `<div class="bieu-to">${T.esc(c.hinh)}</div>` };
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
    de = de.replace(/□|\[\s*\]|\.{3,}|…/g, () => `[[${k++}]]`);
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

  /* Mẫu dùng cho nút "Chèn mẫu" ở Góc phụ huynh */
  VB.MAU = {
    so: 'Câu: Lấy hiệu của 25 và 12 rồi cộng với 36 được kết quả là:\nĐáp án: 49\nGợi ý: Hiệu của 25 và 12 là bao nhiêu? = 13\nGợi ý: Lấy 13 cộng với 36 được bao nhiêu? = 49\nCách giải: 25 − 12 = 13\nCách giải: 13 + 36 = 49\n',
    o: 'Câu: Điền số: 9 + □ = 7 + 8\nĐáp án: 6\nGợi ý: 7 + 8 bằng bao nhiêu? = 15\nCách giải: 7 + 8 = 15; 9 + 6 = 15\n',
    nhieu: 'Câu: Tìm hai số tự nhiên liên tiếp mà tổng của chúng là số lớn nhất có một chữ số.\nĐáp án: 4; 5\nKhông cần thứ tự\nGợi ý: Số lớn nhất có một chữ số là? = 9\nCách giải: 4 + 5 = 9\n',
    chon: 'Câu: An + Ba = Hương + Lan. An nhiều tuổi hơn Lan. Hỏi Ba nhiều tuổi hơn hay ít tuổi hơn Hương?\nLựa chọn: Ba nhiều tuổi hơn Hương | Ba ít tuổi hơn Hương | Bằng tuổi nhau\nĐáp án: Ba ít tuổi hơn Hương\nGợi ý: Hai tổng bằng nhau giống như cân thăng bằng.\n',
    giai: 'Câu giải toán: Nhà bạn Tú có một đàn gà. Sau khi mẹ bán đi 5 con gà thì còn lại 43 con gà. Hỏi trước khi bán, nhà bạn Tú có bao nhiêu con gà?\nLời giải: Trước khi bán, nhà bạn Tú có số con gà là:\nPhép tính: 43 + 5 = 48\nĐáp số: 48 con gà\nGợi ý: Đã bán đi thì lúc đầu nhiều hơn hay ít hơn bây giờ?\n',
    tuCham: 'Câu: Vẽ một đường gấp khúc gồm 3 đoạn thẳng vào vở.\nTự chấm\nĐáp án: Ba đoạn thẳng nối tiếp nhau, không cùng nằm trên một đường thẳng.\n'
  };

  g.VB = VB;
})(typeof window !== 'undefined' ? window : globalThis);

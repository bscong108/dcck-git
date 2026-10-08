/* Khung chương trình: các Đảo (theo chủ đề Toán 2 Cánh Diều) và các Dạng bài.
   Mỗi dạng bài có 3 mức: 1 Cơ bản · 2 Vận dụng · 3 Nâng cao. Mỗi mức là một hàm sinh câu hỏi ngẫu nhiên.
   Thêm dạng mới: CT.them({ id, dao, ten, bieu, ghiNho, cap:[f1, f2, f3] }) trong một file de-*.js. */
(function (g) {
  'use strict';
  const CT = { dao: [], dang: {} };

  CT.dao = [
    { id: 'so100', ten: 'Đảo Số Đến 100', bieu: '🏝️', mau: 'var(--d1)', hk: 1, cd: 'Chủ đề 1 · Ôn tập và bổ sung', dang: [] },
    { id: 'qua10', ten: 'Đảo Qua Mười', bieu: '🔟', mau: 'var(--d2)', hk: 1, cd: 'Chủ đề 2 · Cộng, trừ trong phạm vi 20', dang: [] },
    { id: 'can', ten: 'Đảo Cân và Bình', bieu: '⚖️', mau: 'var(--d3)', hk: 1, cd: 'Chủ đề 3 · Ki-lô-gam, lít', dang: [] },
    { id: 'conho', ten: 'Đảo Có Nhớ', bieu: '🧮', mau: 'var(--d4)', hk: 1, cd: 'Chủ đề 4 · Cộng, trừ có nhớ trong phạm vi 100', dang: [] },
    { id: 'hinh', ten: 'Đảo Hình Học', bieu: '📐', mau: 'var(--d5)', hk: 1, cd: 'Chủ đề 5 và 9 · Hình phẳng, hình khối', dang: [] },
    { id: 'gio', ten: 'Đảo Thời Gian', bieu: '⏰', mau: 'var(--d6)', hk: 1, cd: 'Chủ đề 6 · Ngày – giờ, giờ – phút, ngày – tháng', dang: [] },
    { id: 'nhan', ten: 'Đảo Nhân Chia', bieu: '✖️', mau: 'var(--d7)', hk: 2, cd: 'Chủ đề 8 · Phép nhân, phép chia', dang: [] },
    { id: 'so1000', ten: 'Đảo Số Đến 1000', bieu: '💯', mau: 'var(--d8)', hk: 2, cd: 'Chủ đề 10 · Các số trong phạm vi 1 000', dang: [] },
    { id: 'dodai', ten: 'Đảo Đo Dài và Tiền', bieu: '📏', mau: 'var(--d9)', hk: 2, cd: 'Chủ đề 11 · Độ dài, tiền Việt Nam', dang: [] },
    { id: 'cong1000', ten: 'Đảo Cộng Trừ 1000', bieu: '➕', mau: 'var(--d10)', hk: 2, cd: 'Chủ đề 12 · Cộng, trừ trong phạm vi 1 000', dang: [] },
    { id: 'thongke', ten: 'Đảo Thống Kê', bieu: '📊', mau: 'var(--d11)', hk: 2, cd: 'Chủ đề 13 · Thống kê, xác suất', dang: [] },
    { id: 'thamtu', ten: 'Đảo Thám Tử', bieu: '🕵️', mau: 'var(--d12)', hk: 0, cd: 'Tư duy nâng cao · dùng được cả năm', dang: [] }
  ];
  CT.timDao = id => CT.dao.find(d => d.id === id);
  CT.TEN_CAP = ['', 'Cơ bản', 'Vận dụng', 'Nâng cao'];

  CT.them = function (d) {
    CT.dang[d.id] = d;
    const dao = CT.timDao(d.dao);
    if (dao) dao.dang.push(d.id);
  };

  /* Sinh 1 câu của dạng ở mức cap; gắn mã dạng để thống kê. */
  CT.sinh = function (idDang, cap) {
    const d = CT.dang[idDang];
    const f = d.cap[cap - 1] || d.cap[d.cap.length - 1];
    const c = f();
    c.dang = idDang; c.cap = cap;
    return c;
  };

  /* ------------------------------------------------------------------
     Q: hàm dựng câu hỏi. Mọi câu đều là dữ liệu thuần (lưu được).
       goiY: ['chữ', {hoi:'...', dap:13}]  – gợi ý dạng câu hỏi nhỏ con tự trả lời
       loiGiai: ['dòng 1', 'dòng 2']          – cách giải hiện sau khi làm xong
       saiThuong: {'15': 'Lời nhắc khi con trả lời 15'}
     ------------------------------------------------------------------ */
  const Q = {};
  Q.so = (de, dapAn, o) => Object.assign({ loai: 'so', de, dapAn }, o);
  Q.o = (de, dapAn, o) => Object.assign({ loai: 'o', de, dapAn }, o);
  Q.chon = (de, luaChon, dapAn, o) => Object.assign({ loai: 'chon', de, luaChon, dapAn }, o);
  Q.nhieu = (de, luaChon, dung, o) => Object.assign({ loai: 'chonNhieu', de, luaChon, dung }, o);
  Q.sapXep = (de, luaChon, dapAn, o) => Object.assign({ loai: 'sapXep', de, luaChon, dapAn }, o);
  Q.tha = (de, luaChon, dapAn, o) => Object.assign({ loai: 'keoTha', de, luaChon, dapAn }, o);
  Q.dongHo = (de, gio, phut, o) => Object.assign({ loai: 'dongHo', de, dapAn: { gio, phut } }, o);
  Q.buoc = (de, buoc, o) => Object.assign({ loai: 'nhieuBuoc', de, buoc }, o);

  /* Câu chọn số: tự tạo phương án nhiễu gần đáp án (±1, ±10, đảo chữ số). */
  Q.chonSo = function (de, dung, them, o) {
    const ung = new Set();
    (them || []).forEach(x => { if (x !== dung && x >= 0) ung.add(x); });
    const gan = [dung + 1, dung - 1, dung + 10, dung - 10, dung + 2, dung - 2];
    if (dung >= 10 && dung < 100 && dung % 11) gan.push(Number(String(dung).split('').reverse().join('')));
    T.tron(gan).forEach(x => { if (ung.size < 3 && x >= 0 && x !== dung) ung.add(x); });
    const ds = [dung].concat([...ung].slice(0, 3));
    return Q.chon(de, ds, 0, o);
  };

  /* Bài toán có lời văn theo đúng cách trình bày "Bài giải" trên lớp.
     phep: [{hoi:'số viên bi của hai bạn', a:16, dau:'+', b:3, kq:19}], donVi:'viên bi'
     Mỗi phép tính gồm 2 bước: chọn phép tính → viết phép tính. Cuối cùng: đáp số. */
  const TEN_PHEP = { '+': 'Phép cộng (+)', '−': 'Phép trừ (−)', '×': 'Phép nhân (×)', ':': 'Phép chia (:)' };
  Q.giaiToan = function (o) {
    const buoc = [];
    const dsPhep = o.phep.length > 1 || o.phep.some(p => p.dau === '×' || p.dau === ':') ? ['+', '−', '×', ':'] : ['+', '−'];
    o.phep.forEach((p, i) => {
      const cau = p.cau || p.hoi.charAt(0).toUpperCase() + p.hoi.slice(1) + ' là:';
      const dv = p.donVi || o.donVi;
      buoc.push(Q.chon(p.cau ? `<b>Bước ${i * 2 + 1}.</b> Câu lời giải: “${p.cau}”<br>Con làm phép tính gì?` : `<b>Bước ${i * 2 + 1}.</b> Muốn tìm <b>${p.hoi}</b>, con làm phép tính gì?`,
        dsPhep.map(x => TEN_PHEP[x]), dsPhep.indexOf(p.dau),
        { giuThuTu: true, ghi: cau, goiY: p.goiYPhep || o.goiYPhep, saiThuong: p.saiPhep }));
      const khac = (p.dau === '+' || p.dau === '×') && p.a !== p.b ? { dapAnKhac: [[p.b, p.a, p.kq]] } : {};
      const ngoac = dv ? ` (${dv})` : '';
      buoc.push(Q.o(`<b>Bước ${i * 2 + 2}.</b> Viết phép tính:<div class="dong-tinh">[[0]] ${p.dau} [[1]] = [[2]] <span class="don-vi">${ngoac}</span></div>`,
        [p.a, p.b, p.kq], Object.assign({ ghiMau: `${p.a} ${p.dau} ${p.b} = ${p.kq}${ngoac}`, goiY: p.goiY }, khac)));
    });
    const cuoi = o.phep[o.phep.length - 1];
    buoc.push(Q.o(`<b>Bước cuối.</b> Viết đáp số:<div class="dong-tinh">Đáp số: [[0]] <span class="don-vi">${o.donVi}</span></div>`,
      [o.dapSo != null ? o.dapSo : cuoi.kq], { ghiMau: `Đáp số: ${o.dapSo != null ? o.dapSo : cuoi.kq}${o.donVi ? ' ' + o.donVi : ''}.` }));
    return Q.buoc(o.de, buoc, {
      hinh: o.hinh, goiY: o.goiY, giaiToan: true,
      loiGiai: o.loiGiai || o.phep.map(p => `${p.cau || p.hoi.charAt(0).toUpperCase() + p.hoi.slice(1) + ' là:'} ${p.a} ${p.dau} ${p.b} = ${p.kq}${(p.donVi || o.donVi) ? ` (${p.donVi || o.donVi})` : ''}`)
        .concat([`Đáp số: ${o.dapSo != null ? o.dapSo : cuoi.kq}${o.donVi ? ' ' + o.donVi : ''}.`])
    });
  };

  /* Những số đặc biệt dùng trong đề nâng cao (theo cách gọi trên phiếu bài tập). */
  CT.SO_DB = [
    { ten: 'số bé nhất có một chữ số', gt: 0 },
    { ten: 'số lớn nhất có một chữ số', gt: 9 },
    { ten: 'số bé nhất có hai chữ số', gt: 10 },
    { ten: 'số lớn nhất có hai chữ số', gt: 99 },
    { ten: 'số bé nhất có hai chữ số giống nhau', gt: 11 },
    { ten: 'số lớn nhất có hai chữ số giống nhau', gt: 99 },
    { ten: 'số bé nhất có hai chữ số khác nhau', gt: 10 },
    { ten: 'số lớn nhất có hai chữ số khác nhau', gt: 98 },
    { ten: 'số tròn chục bé nhất có hai chữ số', gt: 10 },
    { ten: 'số tròn chục lớn nhất có hai chữ số', gt: 90 }
  ];
  CT.BANG_SO_DB = `<table class="bang-bk"><tbody>${CT.SO_DB.map(s => `<tr><td>${s.ten.charAt(0).toUpperCase() + s.ten.slice(1)}</td><td><b>${s.gt}</b></td></tr>`).join('')}</tbody></table>
    <p>“Số <b>nhỏ</b> nhất” cũng là “số <b>bé</b> nhất”.</p>`;

  g.CT = CT; g.Q = Q;
})(typeof window !== 'undefined' ? window : globalThis);

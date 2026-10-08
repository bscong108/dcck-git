/* Kiểm tra mọi dạng bài: sinh nhiều câu, xác nhận cấu trúc và đáp án hợp lệ.
   Chạy: node toan-lop-2/test/kiem-tra-de.js [số lần] */
'use strict';
const path = require('path'), fs = require('fs');
global.window = global;
const goc = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(goc, 'index.html'), 'utf8');
const ds = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]).filter(f => !/ung-dung|kieu-cau/.test(f));
ds.forEach(f => require(path.join(goc, f)));

const LAN = Number(process.argv[2] || 400);
let loi = 0;
const daBao = new Set();
const bao = (id, cap, cau, msg) => { loi++; const k = id + cap + msg.slice(0, 30); if (daBao.has(k)) return; daBao.add(k); console.log(`✗ ${id} mức ${cap}: ${msg}\n   ${String(cau.de).replace(/<[^>]+>/g, ' ').slice(0, 160)}`); };
const demO = s => (String(s).match(/\[\[\d+\]\]/g) || []).length;
const demTha = s => (String(s).match(/\{\{\d+\}\}/g) || []).length;
const soHopLe = x => typeof x === 'number' && Number.isInteger(x) && x >= 0 && x <= 10000;

function kiem(id, cap, q, laBuoc) {
  const toanBo = String(q.de) + HV.ve(q.hinh);
  switch (q.loai) {
    case 'so':
      if (!soHopLe(q.dapAn)) bao(id, cap, q, 'đáp án không hợp lệ: ' + q.dapAn);
      if (demO(toanBo) > 1) bao(id, cap, q, 'câu "so" có nhiều hơn 1 ô');
      break;
    case 'o': {
      const k = demO(toanBo);
      if (k !== q.dapAn.length) bao(id, cap, q, `số ô (${k}) khác số đáp án (${q.dapAn.length})`);
      q.dapAn.forEach(x => { if (!soHopLe(x)) bao(id, cap, q, 'đáp án ô không hợp lệ: ' + x); });
      (q.dapAnKhac || []).forEach(a => { if (a.length !== q.dapAn.length) bao(id, cap, q, 'dapAnKhac sai độ dài'); });
      break;
    }
    case 'chon': {
      const s = q.luaChon.map(String);
      if (new Set(s).size !== s.length) bao(id, cap, q, 'phương án trùng: ' + s.join(' | '));
      if (!(q.dapAn >= 0 && q.dapAn < s.length)) bao(id, cap, q, 'chỉ số đáp án sai');
      if (s.length < 2) bao(id, cap, q, 'ít phương án');
      break;
    }
    case 'chonNhieu':
      if (!q.dung.length && q.kiem !== 'tong') bao(id, cap, q, 'không có ô đúng');
      if (q.dung.some(i => i < 0 || i >= q.luaChon.length)) bao(id, cap, q, 'chỉ số đúng vượt');
      if (new Set(q.luaChon.map(x => typeof x === 'object' ? x.nhan + x.gt : String(x))).size !== q.luaChon.length && !q.kiem) bao(id, cap, q, 'ô trùng');
      break;
    case 'sapXep':
      if (q.dapAn.length !== q.luaChon.length) bao(id, cap, q, 'sapXep lệch');
      if (new Set(q.luaChon.map(String)).size !== q.luaChon.length) bao(id, cap, q, 'sapXep trùng');
      break;
    case 'keoTha': {
      const k = demTha(q.de);
      if (k !== q.dapAn.length) bao(id, cap, q, `số ô thả (${k}) khác đáp án (${q.dapAn.length})`);
      q.dapAn.forEach(x => { if (!q.luaChon.includes(x)) bao(id, cap, q, 'đáp án không có trong thẻ: ' + x); });
      break;
    }
    case 'dongHo':
      if (!(q.dapAn.gio >= 0 && q.dapAn.gio <= 24 && q.dapAn.phut >= 0 && q.dapAn.phut < 60)) bao(id, cap, q, 'giờ sai');
      break;
    case 'chiaDeu':
      if (q.tong % q.dia) bao(id, cap, q, 'chia không đều');
      break;
    case 'nhieuBuoc':
      if (laBuoc) bao(id, cap, q, 'lồng nhiều bước');
      q.buoc.forEach(b => kiem(id, cap, b, true));
      break;
    default: bao(id, cap, q, 'loại lạ ' + q.loai);
  }
  (q.goiY || []).forEach(g => { if (typeof g === 'object' && !soHopLe(g.dap)) bao(id, cap, q, 'gợi ý có đáp số sai: ' + JSON.stringify(g)); });
  if (/undefined|NaN/.test(toanBo + JSON.stringify(q.loiGiai || '') + JSON.stringify(q.goiY || ''))) bao(id, cap, q, 'có undefined/NaN');
  if (!laBuoc && !(q.loiGiai && q.loiGiai.length)) bao(id, cap, q, 'thiếu lời giải');
}

let tong = 0;
for (const id in CT.dang) {
  const d = CT.dang[id];
  if (!d.ghiNho) bao(id, 0, { de: '' }, 'thiếu ghi nhớ');
  for (let cap = 1; cap <= 3; cap++) {
    const t0 = Date.now();
    for (let i = 0; i < LAN; i++) { const q = CT.sinh(id, cap); kiem(id, cap, q); tong++; }
    if (Date.now() - t0 > 3000) console.log(`⚠ ${id} mức ${cap} chậm: ${Date.now() - t0} ms`);
  }
}
// Phiếu của cô
const phieu = VB.phanTich(window.PHIEU_CUA_CO || '');
phieu.loi.forEach(e => { console.log('✗ phiếu: ' + e); loi++; });
phieu.ds.forEach(p => p.cau.forEach(q => kiem('phieu:' + p.ten, 0, q)));
console.log(`${Object.keys(CT.dang).length} dạng bài, ${tong} câu sinh thử, ${phieu.ds.length} phiếu (${phieu.ds.reduce((s, p) => s + p.cau.length, 0)} câu). Lỗi: ${loi}`);
process.exit(loi ? 1 : 0);

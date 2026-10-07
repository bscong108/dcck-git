/* Phân tích nội dung ĐCCK: mục lục 9 cuốn, bài .md, thẻ Anki; đọc .apkg ngay trong trình duyệt
   (giải nén zip + đọc SQLite tối giản, không cần thư viện ngoài). */
(function (root) {
  "use strict";

  const RE_MA = /^[A-Z]{2,4}-\d{2,3}$/;
  const norm = (s) => (s || "").toLowerCase().normalize("NFC");

  /* ---------------- Mục lục ---------------- */
  function parseMucLuc(md) {
    const lines = md.replace(/\r\n?/g, "\n").split("\n");
    const sach = [];
    const bai = {};
    let cuon = null, phan = null, cot = null;
    let phienBan = "";
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      let m;
      if (!phienBan && /^Phiên bản/i.test(l)) phienBan = l.trim();
      if ((m = l.match(/^##\s+Cuốn\s+(\d+)\.\s*(.+)$/))) {
        cuon = { so: +m[1], ten: m[2].trim(), moTa: [], phan: [], tienTo: null };
        sach.push(cuon);
        phan = null;
        continue;
      }
      if ((m = l.match(/^###\s+(Phần\s+[IVXLC]+)\.\s*(.+)$/)) && cuon) {
        phan = { ma: m[1], ten: m[2].trim(), bai: [] };
        cuon.phan.push(phan);
        continue;
      }
      if (cuon && !phan && l.trim() && !/^#/.test(l) && !/^\|/.test(l)) cuon.moTa.push(l.trim());
      if (/^\|\s*Mã\s*\|/.test(l)) { cot = l.split("|").slice(1, -1).map((c) => c.trim()); continue; }
      if ((m = l.match(/^\|\s*([A-Z]{2,4}-\d{2,3})\s*\|/)) && cuon && phan && cot) {
        const o = l.split("|").slice(1, -1).map((c) => c.trim());
        const g = (ten) => { const k = cot.indexOf(ten); return k >= 0 ? o[k] : ""; };
        const b = {
          ma: o[0], ten: g("Tên bài"), uuTien: g("Ưu tiên"), loai: g("Loại"), gd: g("GĐ"),
          cxxx: g("Cxxx"), cuon: cuon.so, tenCuon: cuon.ten, phan: phan.ma + ". " + phan.ten,
        };
        bai[b.ma] = b;
        phan.bai.push(b.ma);
        if (!cuon.tienTo) cuon.tienTo = b.ma.split("-")[0];
      }
    }
    return { sach, bai, phienBan };
  }

  /* ---------------- Bài học ---------------- */
  function tachMuc(md, cap) {
    // tách theo tiêu đề cấp `cap` (2 → "## ", 3 → "### "), bỏ qua trong khối mã
    const lines = md.split("\n");
    const re = new RegExp("^#{" + cap + "}\\s+(.*)$");
    const muc = [];
    let cur = { tieuDe: "", dong: [] };
    let trongMa = false;
    for (const l of lines) {
      if (/^```/.test(l)) trongMa = !trongMa;
      const m = !trongMa && l.match(re);
      if (m) { muc.push(cur); cur = { tieuDe: m[1].trim(), dong: [] }; }
      else cur.dong.push(l);
    }
    muc.push(cur);
    return muc.map((x) => ({ tieuDe: x.tieuDe, noiDung: x.dong.join("\n").trim() }));
  }

  function timMuc(ds, ...tuKhoa) {
    return ds.find((x) => tuKhoa.some((k) => norm(x.tieuDe).includes(norm(k))));
  }

  function danhSach(text) {
    // các mục danh sách cấp ngoài cùng; dòng thụt lề nối vào mục trước
    const out = [];
    for (const l of (text || "").split("\n")) {
      const m = l.match(/^(?:[-*+]|\d+[.)])\s+(.*)$/);
      if (m) out.push(m[1]);
      else if (out.length && /^\s+\S/.test(l)) out[out.length - 1] += "\n" + l.trim();
    }
    return out;
  }

  function bang(text) {
    const lines = (text || "").split("\n").filter((l) => /^\s*\|/.test(l));
    if (lines.length < 2) return null;
    const tach = (l) => l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
    const dau = tach(lines[0]);
    const rows = lines.slice(2).map(tach);
    return { dau, rows };
  }

  function parseCauHoiTuKiemTra(text) {
    const items = [];
    let cur = null;
    for (const l of (text || "").split("\n")) {
      const m = l.match(/^(\d+)\.\s+(.*)$/);
      if (m) { cur = { so: +m[1], dong: [m[2]] }; items.push(cur); }
      else if (cur && l.trim()) cur.dong.push(l.trim());
    }
    return items.map((it) => {
      const full = it.dong.join("\n");
      const k = full.search(/Đáp án\b/);
      let hoi = k >= 0 ? full.slice(0, k).trim() : full;
      const dap = k >= 0 ? full.slice(k).replace(/^Đáp án\s*:?\s*/, "").trim() : "";
      let nhan = "";
      const mn = hoi.match(/^\(([^)]+)\)\s*/);
      if (mn) { nhan = mn[1]; hoi = hoi.slice(mn[0].length); }
      // phương án A. B. C. D.
      let luaChon = null, dung = null;
      const viTriA = hoi.search(/(^|\s)A\.\s/);
      if (viTriA >= 0) {
        const phanLC = hoi.slice(viTriA);
        const parts = phanLC.split(/(?:^|\s)([A-F])\.\s/).slice(1);
        const lc = [];
        for (let j = 0; j < parts.length; j += 2) lc.push({ chu: parts[j], text: (parts[j + 1] || "").trim() });
        const thuTu = lc.map((x) => x.chu).join("");
        if (lc.length >= 2 && "ABCDEF".startsWith(thuTu)) {
          luaChon = lc;
          hoi = hoi.slice(0, viTriA).trim();
          const md = dap.match(/^([A-F])\b[.:]?\s*/);
          if (md) dung = md[1];
        }
      }
      return { so: it.so, nhan, hoi, luaChon, dung, dapAn: dap };
    });
  }

  function parseBai(md, ma) {
    md = md.replace(/\r\n?/g, "\n");
    const lines = md.split("\n");
    let tieuDe = "", meta = "";
    const iH1 = lines.findIndex((l) => /^#\s+/.test(l));
    if (iH1 >= 0) {
      tieuDe = lines[iH1].replace(/^#\s+/, "").trim();
      if (ma && tieuDe.startsWith(ma)) tieuDe = tieuDe.slice(ma.length).trim();
      const j = lines.slice(iH1 + 1).findIndex((l) => l.trim());
      if (j >= 0) meta = lines[iH1 + 1 + j].trim();
    }
    const muc2 = tachMuc(md, 2);
    const tat = muc2.flatMap((m) => tachMuc(m.noiDung, 3).filter((x) => x.tieuDe));
    const mo = timMuc(muc2, "Mở đầu");
    const cauHoiDanDat = danhSach((timMuc(tat, "Câu hỏi dẫn dắt") || {}).noiDung);
    const tomTat = danhSach((timMuc(tat, "Tóm tắt 60 giây", "Tóm tắt") || {}).noiDung);
    const hopDong = danhSach((timMuc(tat, "Hợp đồng đầu ra") || {}).noiDung);
    const ca = timMuc(muc2, "Ca lâm sàng mở đầu", "Ca lâm sàng");
    const quayLai = timMuc(muc2, "Quay lại ca");
    const giangLai = timMuc(muc2, "Giảng lại");
    const camBay = timMuc(muc2, "Cạm bẫy");
    const meo = timMuc(muc2, "Mẹo nhớ");
    const takeHome = danhSach((timMuc(tat, "Take-home", "Take home") || {}).noiDung);
    const diemNhan = danhSach((timMuc(tat, "Điểm cần nhấn") || {}).noiDung);
    const tuKiemTra = parseCauHoiTuKiemTra((timMuc(tat, "Câu hỏi tự kiểm tra", "tự kiểm tra") || {}).noiDung);
    const mauThuan = bang((timMuc(tat, "Mâu thuẫn nguồn") || {}).noiDung);
    const chot = [];
    const reChot = /^> CHỐT LẠI:?\s*(.*)\n((?:>.*\n?)*)/gm;
    let m;
    while ((m = reChot.exec(md))) chot.push({ tieuDe: m[1].trim(), y: m[2].split("\n").map((l) => l.replace(/^>\s?-?\s*/, "").trim()).filter(Boolean) });
    const lienKet = Array.from(new Set((md.match(/\[→\s*([A-Z]{2,4}-\d{2,3})\]/g) || []).map((x) => x.replace(/[\[\]→\s]/g, ""))));
    const coBai = (mo || ca) ? true : false;
    return {
      ma, tieuDe, meta, muc2, hopDong, cauHoiDanDat, tomTat,
      ca: ca ? ca.noiDung : "", quayLai: quayLai ? quayLai.noiDung : "",
      giangLai: giangLai ? giangLai.noiDung : "", diemNhan, takeHome, tuKiemTra,
      camBay: camBay ? bang(camBay.noiDung) : null, meoNho: meo ? bang(meo.noiDung) : null,
      mauThuan, chot, lienKet, dayDu: coBai,
      mucLon: muc2.filter((x) => x.tieuDe).map((x) => x.tieuDe),
    };
  }

  /* ---------------- Thẻ Anki ---------------- */
  const NHOM_THE = { "co-che": "Cơ chế", "lam-sang": "Lâm sàng", "cam-bay": "Cạm bẫy", "nguong-lieu": "Ngưỡng, liều" };

  function lamThe(notes, maBai) {
    const the = [];
    for (const n of notes || []) {
      const ten = n.tenTruong || [];
      const lay = (tenCo, viTri) => { const k = ten.indexOf(tenCo); return (k >= 0 ? n.truong[k] : n.truong[viTri]) || ""; };
      const nhom = (n.the || []).find((t) => NHOM_THE[t]) || "";
      const ma = lay("MaBai", 3) || maBai;
      if (n.loai === "cloze" || /\{\{c\d+::/.test(n.truong[0] || "")) {
        const text = lay("Text", 0);
        const so = Array.from(new Set((text.match(/\{\{c(\d+)::/g) || []).map((x) => +x.match(/\d+/)[0]))).sort((a, b) => a - b);
        for (const c of so) the.push({ id: n.guid + "#c" + c, loai: "cloze", text, c, them: lay("Them", 1), nguon: lay("Nguon", 2), ma, nhom });
      } else {
        the.push({ id: n.guid, loai: "hoi-dap", truoc: lay("Truoc", 0), sau: lay("Sau", 1), nguon: lay("Nguon", 2), ma, nhom });
      }
    }
    return the;
  }

  function hienCloze(text, c, matSau) {
    return text.replace(/\{\{c(\d+)::(.*?)(?:::(.*?))?\}\}/g, (_, n, dap, goiY) => {
      if (+n !== c) return dap;
      return matSau ? '<span class="cloze">' + dap + "</span>" : '<span class="cloze">[' + (goiY || "…") + "]</span>";
    });
  }

  /* ---------------- Đọc .apkg trong trình duyệt ---------------- */
  async function giaiNenZip(buf) {
    const dv = new DataView(buf);
    let eocd = -1;
    for (let i = buf.byteLength - 22; i >= Math.max(0, buf.byteLength - 65557); i--) {
      if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) throw new Error("Không phải file zip hợp lệ");
    const soMuc = dv.getUint16(eocd + 10, true);
    let p = dv.getUint32(eocd + 16, true);
    const files = {};
    const dec = new TextDecoder();
    for (let k = 0; k < soMuc; k++) {
      if (dv.getUint32(p, true) !== 0x02014b50) break;
      const nen = dv.getUint16(p + 10, true);
      const coNen = dv.getUint32(p + 20, true);
      const dai = dv.getUint16(p + 28, true), phu = dv.getUint16(p + 30, true), gc = dv.getUint16(p + 32, true);
      const off = dv.getUint32(p + 42, true);
      const ten = dec.decode(new Uint8Array(buf, p + 46, dai));
      files[ten] = { nen, coNen, off };
      p += 46 + dai + phu + gc;
    }
    return {
      ten: Object.keys(files),
      async doc(ten) {
        const f = files[ten];
        const n = dv.getUint16(f.off + 26, true), x = dv.getUint16(f.off + 28, true);
        const data = new Uint8Array(buf, f.off + 30 + n + x, f.coNen);
        if (f.nen === 0) return data.slice().buffer;
        if (f.nen !== 8) throw new Error("Kiểu nén zip không hỗ trợ: " + f.nen);
        const ds = new DecompressionStream("deflate-raw");
        const stream = new Blob([data]).stream().pipeThrough(ds);
        return await new Response(stream).arrayBuffer();
      },
    };
  }

  function docSqlite(buf) {
    const u8 = new Uint8Array(buf);
    const dv = new DataView(buf);
    const dau = new TextDecoder().decode(u8.slice(0, 15));
    if (dau !== "SQLite format 3") throw new Error("Không phải cơ sở dữ liệu SQLite");
    let pageSize = dv.getUint16(16);
    if (pageSize === 1) pageSize = 65536;
    const U = pageSize - u8[20];
    const td = new TextDecoder("utf-8");
    const varint = (pos) => {
      let v = 0;
      for (let i = 0; i < 9; i++) {
        const b = u8[pos + i];
        if (i === 8) { v = v * 256 + b; return [v, pos + 9]; }
        v = v * 128 + (b & 0x7f);
        if (!(b & 0x80)) return [v, pos + i + 1];
      }
      return [v, pos + 9];
    };
    const trang = (n) => (n - 1) * pageSize;
    function payload(pos, P) {
      const X = U - 35;
      if (P <= X) return u8.subarray(pos, pos + P);
      const M = Math.floor(((U - 12) * 32) / 255) - 23;
      const K = M + ((P - M) % (U - 4));
      const local = K <= X ? K : M;
      const out = new Uint8Array(P);
      out.set(u8.subarray(pos, pos + local), 0);
      let da = local;
      let tiep = dv.getUint32(pos + local);
      while (tiep && da < P) {
        const o = trang(tiep);
        const lay = Math.min(U - 4, P - da);
        out.set(u8.subarray(o + 4, o + 4 + lay), da);
        da += lay;
        tiep = dv.getUint32(o);
      }
      return out;
    }
    function banGhi(p) {
      const d = new DataView(p.buffer, p.byteOffset, p.byteLength);
      let [hs, q] = (function () { let v = 0, i = 0; for (; i < 9; i++) { const b = p[i]; v = v * 128 + (b & 0x7f); if (!(b & 0x80)) break; } return [v, i + 1]; })();
      const kieu = [];
      while (q < hs) {
        let v = 0, i = 0;
        for (; i < 9; i++) { const b = p[q + i]; v = v * 128 + (b & 0x7f); if (!(b & 0x80)) break; }
        kieu.push(v);
        q += i + 1;
      }
      let o = hs;
      const cot = [];
      for (const t of kieu) {
        if (t === 0) cot.push(null);
        else if (t >= 1 && t <= 6) {
          const n = [0, 1, 2, 3, 4, 6, 8][t];
          let v = 0;
          for (let i = 0; i < n; i++) v = v * 256 + p[o + i];
          if (p[o] & 0x80) v -= Math.pow(2, 8 * n);
          cot.push(v);
          o += n;
        } else if (t === 7) { cot.push(d.getFloat64(o)); o += 8; }
        else if (t === 8) cot.push(0);
        else if (t === 9) cot.push(1);
        else if (t >= 12) {
          const n = t % 2 === 0 ? (t - 12) / 2 : (t - 13) / 2;
          cot.push(t % 2 === 0 ? p.slice(o, o + n) : td.decode(p.subarray(o, o + n)));
          o += n;
        }
      }
      return cot;
    }
    function duyetBang(goc) {
      const rows = [];
      const stack = [goc];
      while (stack.length) {
        const n = stack.pop();
        const base = trang(n);
        const h = n === 1 ? base + 100 : base;
        const loai = u8[h];
        const so = dv.getUint16(h + 3);
        if (loai === 0x05) {
          const ptr = h + 12;
          stack.push(dv.getUint32(h + 8));
          for (let i = so - 1; i >= 0; i--) stack.push(dv.getUint32(base + dv.getUint16(ptr + 2 * i)));
        } else if (loai === 0x0d) {
          const ptr = h + 8;
          for (let i = 0; i < so; i++) {
            let pos = base + dv.getUint16(ptr + 2 * i);
            let P, rowid;
            [P, pos] = varint(pos);
            [rowid, pos] = varint(pos);
            const r = banGhi(payload(pos, P));
            r.rowid = rowid;
            rows.push(r);
          }
        }
      }
      return rows;
    }
    const master = duyetBang(1);
    const bangGoc = {};
    for (const r of master) if (r[0] === "table") bangGoc[r[1]] = r[3];
    return { bang: (ten) => (bangGoc[ten] ? duyetBang(bangGoc[ten]) : []), coBang: (ten) => !!bangGoc[ten] };
  }

  async function docApkg(arrayBuffer) {
    const z = await giaiNenZip(arrayBuffer);
    const ten = z.ten.includes("collection.anki21") ? "collection.anki21" : z.ten.includes("collection.anki2") ? "collection.anki2" : null;
    if (!ten) throw new Error("File .apkg dạng mới (anki21b). Trong Anki hãy xuất lại với tùy chọn 'Support older Anki versions'.");
    const db = docSqlite(await z.doc(ten));
    const moHinh = {};
    try {
      const col = db.bang("col")[0];
      const models = JSON.parse(col[9] || "{}");
      for (const k in models) moHinh[k] = { cloze: models[k].type === 1, truong: (models[k].flds || []).map((f) => f.name) };
    } catch (e) { /* không đọc được models: đoán theo nội dung */ }
    return db.bang("notes").sort((a, b) => a.rowid - b.rowid).map((r) => {
      const m = moHinh[String(r[2])] || {};
      const truong = String(r[6] || "").split("\x1f");
      const cloze = m.cloze !== undefined ? m.cloze : /\{\{c\d+::/.test(truong[0]);
      return { guid: r[1], loai: cloze ? "cloze" : "hoi-dap", tenTruong: m.truong || [], truong, the: String(r[5] || "").trim().split(/\s+/).filter(Boolean) };
    });
  }

  const api = { parseMucLuc, parseBai, parseCauHoiTuKiemTra, lamThe, hienCloze, docApkg, docSqlite, giaiNenZip, NHOM_THE, RE_MA };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.DCCK = root.DCCK || {};
  root.DCCK.parse = api;
})(typeof window !== "undefined" ? window : globalThis);

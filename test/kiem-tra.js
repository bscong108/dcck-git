// Kiểm tra bộ phân tích: node test/kiem-tra.js
const fs = require("fs");
const path = require("path");
const assert = require("assert");
const P = require("../app/parse.js");
const M = require("../app/md.js");
const goc = path.join(__dirname, "..", "noi-dung");

(async () => {
  const ml = P.parseMucLuc(fs.readFileSync(path.join(goc, "MUC-LUC-9-CUON.md"), "utf8"));
  const tong = Object.keys(ml.bai).length;
  assert.strictEqual(ml.sach.length, 9, "9 cuốn");
  assert.strictEqual(tong, 464, "464 bài");
  assert.strictEqual(Object.values(ml.bai).filter((b) => b.uuTien === "A").length, 272, "272 bài ưu tiên A");
  assert.strictEqual(Object.values(ml.bai).filter((b) => b.gd === "1").length, 49, "49 bài giai đoạn 1");
  assert.strictEqual(ml.bai["YC-01"].cxxx, "C012");
  console.log("Mục lục:", ml.sach.map((s) => s.tienTo + ":" + s.phan.reduce((a, p) => a + p.bai.length, 0)).join(" "));

  const md = fs.readFileSync(path.join(goc, "YC-01", "YC-01_bai.md"), "utf8");
  const b = P.parseBai(md, "YC-01");
  assert.strictEqual(b.cauHoiDanDat.length, 5);
  assert.strictEqual(b.tomTat.length, 7);
  assert.strictEqual(b.takeHome.length, 10);
  assert.strictEqual(b.tuKiemTra.length, 13);
  const q1 = b.tuKiemTra[0];
  assert.strictEqual(q1.luaChon.length, 4); assert.strictEqual(q1.dung, "B"); assert.strictEqual(q1.nhan, "Ca ngắn");
  assert.strictEqual(b.tuKiemTra[2].dung, "B");
  assert.ok(!b.tuKiemTra[1].luaChon && b.tuKiemTra[1].dapAn.startsWith("thiếu oxy mô"));
  assert.strictEqual(b.camBay.rows.length, 13);
  assert.strictEqual(b.meoNho.rows.length, 7);
  assert.ok(b.giangLai.startsWith("Hãy tưởng tượng"));
  assert.ok(b.chot.length >= 5, "khối CHỐT LẠI");
  assert.ok(b.lienKet.includes("YC-03"));
  console.log("Bài:", b.tieuDe, "| chốt:", b.chot.length, "| liên kết:", b.lienKet.length, "| mục:", b.mucLon.length);

  const r = M.render(md);
  assert.ok(r.html.includes('<a class="xref" href="#/bai/YC-03">'));
  assert.ok(r.html.includes('class="src suy"'));
  assert.ok(/<blockquote data-b="\d+" class="chot"/.test(r.html));
  assert.ok((r.html.match(/<table>/g) || []).length >= 10);
  assert.ok(!/\u0000/.test(r.html));
  console.log("Markdown: khối", r.nextIndex, "| tiêu đề", r.headings.length);

  const buf = fs.readFileSync(path.join(goc, "YC-01", "YC-01_anki.apkg"));
  const notes = await P.docApkg(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  assert.strictEqual(notes.length, 40);
  const the = P.lamThe(notes, "YC-01");
  const cloze = the.filter((t) => t.loai === "cloze");
  console.log("Anki (đọc trong JS):", notes.length, "note →", the.length, "thẻ (", cloze.length, "cloze )");
  // so với bản Python
  const data = fs.readFileSync(path.join(__dirname, "..", "data", "noi-dung.js"), "utf8");
  const nd = JSON.parse(data.slice(data.indexOf("=") + 1).trim().replace(/;$/, ""));
  assert.deepStrictEqual(notes.map((n) => n.truong), nd.bai["YC-01"].anki.map((n) => n.truong), "JS và Python đọc giống nhau");
  assert.strictEqual(P.hienCloze("A {{c1::x}} B {{c2::y::gợi ý}}", 2, false), 'A x B <span class="cloze">[gợi ý]</span>');
  console.log("TẤT CẢ ĐẠT");
})().catch((e) => { console.error(e); process.exit(1); });

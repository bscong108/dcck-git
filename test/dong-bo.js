// Kiểm thử đồng bộ hai thiết bị với claude.use("db") giả lập: node test/dong-bo.js
const { chromium } = require(process.env.PW || "playwright");
const path = require("path");
const kv = new Map();
const MOCK = () => {
  const call = (op, p, d) => window.__kv(op, p, d);
  const snap = (p, r) => ({ id: p.split("/").pop(), exists: !!r, data: () => r || undefined, metadata: {} });
  const docRef = (p) => ({
    id: p.split("/").pop(), path: p,
    get: async () => snap(p, await call("get", p)),
    set: async (d) => { await call("set", p, d); },
    delete: async () => { await call("del", p); },
    collection: (c) => colRef(p + "/" + c),
  });
  const colRef = (p) => ({
    path: p, doc: (id) => docRef(p + "/" + id),
    get: async () => { const rows = await call("list", p); const docs = rows.map(([k, v]) => snap(k, v)); return { docs, size: docs.length, empty: !docs.length }; },
  });
  const db = { doc: docRef, collection: colRef };
  const user = { id: async () => "nguoi-dung-1" };
  window.claude = { use: async (n) => (n === "db" ? db : n === "user" ? user : null) };
};
(async () => {
  const browser = await chromium.launch();
  const url = "file://" + path.resolve(__dirname, "..", "index.html");
  const moTB = async () => {
    const ctx = await browser.newContext();
    await ctx.exposeBinding("__kv", (_, op, p, d) => {
      if (op === "get") return kv.get(p) || null;
      if (op === "set") { kv.set(p, d); return null; }
      if (op === "del") { kv.delete(p); return null; }
      if (op === "list") return [...kv.entries()].filter(([k]) => k.startsWith(p + "/") && k.slice(p.length + 1).indexOf("/") < 0);
    });
    await ctx.addInitScript(MOCK);
    const page = await ctx.newPage();
    page.on("pageerror", (e) => console.log("LỖI", e.message));
    await page.goto(url); await page.waitForTimeout(800);
    return page;
  };
  const A = await moTB();
  console.log("A trạng thái:", await A.textContent("#dong-bo"));
  await A.goto(url + "#/bai/YC-01"); await A.waitForTimeout(300);
  await A.click("#hoc-nay"); await A.waitForTimeout(200);
  await A.goto(url + "#/du-lieu"); await A.waitForTimeout(300);
  await A.setInputFiles("#file", [path.resolve(__dirname, "..", "noi-dung/YC-01/YC-01_bai.md")].map((f) => f));
  await A.waitForTimeout(500);
  // giả lập bài mới YC-03 nhập trên A
  await A.evaluate(async () => {
    const f = new File(["# YC-03 Phân loại cấp cứu\n\nThử nghiệm.\n\n## 0. Mở đầu\n\n### Câu hỏi dẫn dắt\n\n1. Câu hỏi?\n"], "YC-03_bai.md");
    const dt = new DataTransfer(); dt.items.add(f);
    const inp = document.querySelector("#file"); inp.files = dt.files; inp.dispatchEvent(new Event("change"));
  });
  await A.waitForTimeout(800);
  await A.click("#db-ngay"); await A.waitForTimeout(800);
  console.log("Số tài liệu trên đám mây:", kv.size, [...kv.keys()].filter((k) => k.includes("noi-dung")));
  const B = await moTB();
  await B.waitForTimeout(800);
  const st = await B.evaluate(() => JSON.parse(localStorage.getItem("dcck-hoc-v1") || "{}").bai);
  console.log("B nhận YC-01 hoc =", st && st["YC-01"] && st["YC-01"].hoc);
  await B.goto(url + "#/bai/YC-03"); await B.waitForTimeout(400);
  console.log("B thấy bài YC-03:", await B.$eval("h1", (h) => h.textContent), "| có tab đọc:", !!(await B.$('a[href="#/bai/YC-03/doc"]')));
  // B học thẻ -> A kéo về khi quay lại tab
  await B.goto(url + "#/bai/YC-01/the"); await B.waitForTimeout(300); await B.click("#tt-on"); await B.keyboard.press("Space"); await B.keyboard.press("3");
  await B.evaluate(() => window.DCCK.sync.day()); await B.waitForTimeout(300);
  await A.evaluate(() => window.DCCK.sync.keoVe()); await A.waitForTimeout(300);
  console.log("A nhận số thẻ đã học:", await A.evaluate(() => Object.keys(window.DCCK.store.S.the).length));
  await browser.close();
})();

// Kiểm thử ứng dụng ECG Cấp cứu bằng Playwright: node test/ecg.js [thư-mục-ảnh]
const { chromium } = require(process.env.PW || "playwright");
const path = require("path");
const out = process.argv[2] || "";
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1360, height: 900 } });
  const loi = [];
  page.on("pageerror", (e) => loi.push("pageerror: " + e.message));
  page.on("console", (m) => { if (m.type() === "error") loi.push("console: " + m.text()); });
  page.on("dialog", (d) => d.accept());
  const url = "file://" + path.resolve(__dirname, "..", "ecg", "index.html");
  const shot = (n) => out && page.screenshot({ path: path.join(out, n + ".png") });
  const goto = async (h) => { await page.goto(url + h); await page.waitForTimeout(250); };
  const fail = [];
  const check = (ok, msg) => { if (!ok) fail.push(msg); };

  await goto("#/"); await shot("01-tong-quan");
  check(await page.$(".viewer svg.ecg-svg"), "Tổng quan thiếu ECG hôm nay");

  // Mọi mẫu ECG tạo được và không có giá trị NaN
  const bad = await page.evaluate(() => {
    const out = [];
    for (const p of PATTERNS) {
      for (const seed of [3, 41]) {
        const d = ECG.generate(p.cfg(seed));
        for (const L of ECG.LEADS) { const s = d.leads[L]; for (let i = 0; i < s.length; i++) if (!isFinite(s[i]) || Math.abs(s[i]) > 6) { out.push(p.id + " " + L); break; } }
      }
    }
    return out;
  });
  check(!bad.length, "Tín hiệu bất thường: " + bad.join(", "));

  // Bài học: tất cả bài hiển thị, mọi [[ecg:..]] trỏ tới mẫu có thật
  const missing = await page.evaluate(() => {
    const m = [];
    for (const l of LESSONS) for (const x of l.md.matchAll(/\[\[ecg:([\w-]+)\]\]/g)) if (!PATTERN[x[1]]) m.push(l.id + ":" + x[1]);
    for (const c of CASES) { if (!PATTERN[c.ecg]) m.push(c.id + ":" + c.ecg); for (const q of c.qs) if (!(q.a >= 0 && q.a < q.o.length)) m.push(c.id + " đáp án"); }
    for (const p of PATTERNS) if (!LESSONS.some((l) => l.id === p.lesson)) m.push(p.id + " bài " + p.lesson);
    return m;
  });
  check(!missing.length, "Tham chiếu hỏng: " + missing.join(", "));
  const nL = await page.evaluate(() => LESSONS.length);
  check(nL === 47, "Số bài = " + nL);

  await goto("#/bai"); check((await page.$$(".lrow")).length === 47, "Danh sách bài"); await shot("02-bai-hoc");
  for (const id of ["ECG-05", "ECG-17", "ECG-37"]) {
    await goto("#/bai/" + id);
    check(await page.$(".prose h2"), "Bài " + id + " không hiển thị");
  }
  await goto("#/bai/ECG-18"); await page.waitForTimeout(200); await shot("03-bai-ECG-18");
  await page.click("#learn"); await page.waitForTimeout(100);
  check((await page.textContent("#learn")).includes("Đã học"), "Đánh dấu đã học");

  await goto("#/atlas"); await page.waitForTimeout(600); await shot("04-atlas");
  check((await page.$$(".acard")).length > 50, "Atlas");
  await goto("#/atlas/vt"); await page.waitForTimeout(200);
  await page.click('[data-act="cal"]');
  const box = await page.$(".v-paper svg").then((s) => s.boundingBox());
  await page.mouse.click(box.x + box.width * 0.2, box.y + box.height * 0.5);
  await page.mouse.click(box.x + box.width * 0.3, box.y + box.height * 0.4);
  await page.waitForTimeout(100);
  const rd = await page.textContent(".v-read");
  check(/ms/.test(rd), "Thước đo không hiển thị kết quả");
  await shot("05-atlas-vt-thuoc-do");
  await page.click('[data-lay="V1"]'); await page.waitForTimeout(100);
  check((await page.$$(".v-paper .tr")).length === 2, "Bố cục DII+V1");

  await goto("#/ca"); await shot("06-ca");
  await goto("#/ca/c04");
  for (let k = 0; k < 3; k++) {
    await page.click(`.q:nth-of-type(${k + 1}) .opt[data-j="1"]`).catch(() => {});
    await page.waitForTimeout(80);
    const nb = await page.$(".why .btn.chinh"); if (nb) { await nb.click(); await page.waitForTimeout(80); }
  }
  await page.waitForTimeout(200);
  check(await page.$(".end"), "Ca lâm sàng không kết thúc");
  await shot("07-ca-de-winter");

  await goto("#/luyen"); await page.selectOption("#n", "5"); await page.selectOption("#t", "0"); await page.click("#start"); await page.waitForTimeout(200);
  for (let k = 0; k < 5; k++) { await page.click(".opt >> nth=0"); await page.waitForTimeout(60); if (k === 0) await shot("08-luyen"); await page.click("#nx"); await page.waitForTimeout(150); }
  check((await page.textContent("h1")).startsWith("Kết quả"), "Luyện nhanh không ra kết quả");

  await goto("#/the"); await page.selectOption("#sc", "all"); await page.waitForTimeout(100);
  await page.click("#flip"); await shot("09-the"); await page.click('.grade [data-g="2"]'); await page.waitForTimeout(100);
  check(await page.$(".fq"), "Thẻ ôn");

  for (const t of ["qtc", "axis", "sgarbossa", "lad", "lvh", "rate", "brugada-alg", "avr-alg"]) { await goto("#/cong-cu/" + t); }
  await goto("#/cong-cu/axis"); await page.fill("#i", "-4"); await page.fill("#f", "9"); await page.waitForTimeout(80);
  check((await page.textContent("#out")).includes("lệch phải"), "Công cụ trục");
  await shot("10-cong-cu-truc");
  await goto("#/cong-cu/qtc"); await page.fill("#qt", "480"); await page.fill("#hr", "60");
  check((await page.textContent("#out")).includes("480"), "QTc ở tần số 60 phải bằng QT");
  await goto("#/huong-dan"); await shot("11-huong-dan");

  // Điện thoại
  await page.setViewportSize({ width: 390, height: 844 });
  await goto("#/"); await shot("12-dien-thoai");
  const ovf = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check(ovf <= 1, "Tràn ngang trên điện thoại: " + ovf + "px");
  await goto("#/bai/ECG-27"); await shot("13-dien-thoai-bai");

  await browser.close();
  const all = loi.concat(fail);
  if (all.length) { console.log("LỖI:\n" + all.join("\n")); process.exit(1); }
  console.log("Tất cả kiểm tra đạt.");
})();

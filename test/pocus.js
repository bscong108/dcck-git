// Kiểm thử ứng dụng POCUS: node test/pocus.js [thư-mục-ảnh]
const { chromium } = require(process.env.PW || "playwright");
const path = require("path");
const out = process.argv[2] || "/tmp";
(async () => {
  const browser = await chromium.launch();
  const loi = [];
  const url = "file://" + path.resolve(__dirname, "..", "pocus", "index.html");
  for (const [ten, vp] of [["may", { width: 1360, height: 900 }], ["dt", { width: 390, height: 844 }]]) {
    const page = await (await browser.newContext({ viewport: vp })).newPage();
    page.on("pageerror", (e) => loi.push(ten + " pageerror: " + e.message));
    page.on("console", (m) => { if (m.type() === "error" && !/fonts\.g/.test(m.text()) && !/ERR_/.test(m.text())) loi.push(ten + " console: " + m.text()); });
    const shot = (n) => page.screenshot({ path: path.join(out, ten + "-" + n + ".png") });
    await page.goto(url); await page.waitForTimeout(500); await shot("01-lo-trinh");
    const baiIds = await page.$$eval(".the-bai", (a) => a.map((x) => x.getAttribute("href").slice(1)));
    console.log(ten, "số bài:", baiIds.length);
    for (const id of baiIds) {
      for (const t of ["ly-thuyet", "thuc-hanh", "ket-qua", "lam-sang", "kiem-tra"]) {
        await page.goto(url + "#" + id); await page.waitForTimeout(60);
        await page.click("#tab-" + t); await page.waitForTimeout(60);
      }
    }
    await page.goto(url + "#b-efast"); await page.click("#tab-thuc-hanh"); await page.waitForTimeout(500); await shot("02-efast-thuc-hanh");
    await page.evaluate(() => window.scrollTo(0, 900)); await page.waitForTimeout(400); await shot("03-efast-buoc");
    await page.click("#tab-ket-qua"); await page.waitForTimeout(500); await shot("04-efast-ket-qua");
    await page.goto(url + "#b-nen-tang"); await page.waitForTimeout(300); await page.evaluate(() => window.scrollTo(0, 1500)); await page.waitForTimeout(300); await shot("05-nen-tang");
    await page.click("#tab-kiem-tra"); await page.click('.cau[data-i="0"] .lc button[data-j="1"]'); await page.waitForTimeout(100); await shot("06-kiem-tra");
    await page.goto(url + "#ca-lam-sang"); await page.waitForTimeout(200);
    await page.goto(url + "#ca-kho-tho"); await page.waitForTimeout(300);
    await page.click('.ca-buoc[data-i="0"] .lc button[data-j="1"]'); await page.waitForTimeout(400); await shot("07-ca");
    await page.goto(url + "#cong-cu"); await page.waitForTimeout(200); await shot("08-cong-cu");
    console.log(ten, "bàng quang:", await page.textContent('[data-c="bq"] .kq'));
    await page.goto(url + "#so-tay"); await page.fill("#so-mo", "thử"); await page.click("#f-so button[type=submit]"); await page.waitForTimeout(200);
    console.log(ten, "số ca:", await page.$$eval("#so-ds tr", (r) => r.length - 1)); await shot("09-so");
    await page.goto(url + "#thu-vien"); await page.waitForTimeout(600); await shot("10-thu-vien");
    const tran = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(ten, "tràn ngang:", tran);
    await page.goto(url + "#tham-khao"); await page.waitForTimeout(100);
  }
  console.log("lỗi:", loi.length ? loi : "không");
  await browser.close();
  process.exit(loi.length ? 1 : 0);
})();

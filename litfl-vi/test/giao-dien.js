/* Kiểm thử giao diện bằng Playwright trên dữ liệu giả lập (chạy: node test/chay-thu.js). */
const { chromium } = require('playwright');
const assert = require('assert');
const URL = process.argv[2] || 'http://localhost:8091/';

(async () => {
  const trinh = await chromium.launch();
  const ctx = await trinh.newContext({ viewport: { width: 390, height: 800 } });
  const p = await ctx.newPage();
  const loi = [];
  p.on('pageerror', e => loi.push(e.message));
  p.on('console', m => { if (m.type() === 'error') loi.push(m.text()); });

  await p.goto(URL);
  await p.waitForSelector('text=Chuyên mục');
  assert.ok(await p.isVisible('text=ECG Library'), 'trang chủ có chuyên mục');

  await p.click('text=ECG Library');
  await p.waitForSelector('.ds li');
  assert.strictEqual(await p.locator('.ds li').count(), 2);

  await p.click('text=[VI] Fixture Alpha – test');
  await p.waitForSelector('#bai');
  assert.ok(await p.isVisible('h1:has-text("[VI] Fixture Alpha")'));
  assert.strictEqual(await p.locator('#bai .sharedaddy').count(), 0, 'đã bỏ khối chia sẻ');
  assert.strictEqual(await p.locator('#bai script').count(), 0);

  // chạm đoạn → hiện bản gốc
  await p.click('#bai > p[data-k="0"]', { position: { x: 5, y: 5 } });
  assert.strictEqual(await p.locator('#bai .goc').count(), 1, 'hiện câu gốc');
  // song ngữ
  await p.click('[data-cd="song"]');
  assert.ok(await p.locator('#bai .goc').count() >= 4, 'chế độ song ngữ');
  await p.click('[data-cd="vi"]');

  // ảnh phóng to
  await p.click('#bai img');
  assert.ok(await p.isVisible('#phong'));
  await p.click('#phong');

  // liên kết nội bộ litfl → mở trong ứng dụng
  await p.click('#bai a:has-text("link to beta")');
  await p.waitForSelector('h1:has-text("[VI] Fixture Beta")');
  assert.ok((await p.url()).includes('#/b/102'));

  // đánh dấu + học + ghi chú
  await p.click('#nut-dau');
  await p.click('#nut-hoc');
  await p.fill('#ghi', 'ghi chú thử');
  await p.waitForTimeout(600);
  const tt = await p.evaluate(() => JSON.parse(localStorage.getItem('litfl-vi')));
  assert.ok(tt.dau['102'] && tt.tien_do['102'].han && tt.ghi['102'] === 'ghi chú thử');

  // ôn tập: giả hạn đã đến
  await p.evaluate(() => { Kho.tt().tien_do['102'].han = '2000-01-01'; Kho.luu(); location.hash = '#/on'; });
  await p.waitForSelector('text=Đến hạn hôm nay (1)');
  assert.strictEqual(await p.textContent('#dem-on'), '1');
  await p.click('.ds a');
  await p.click('[data-on="1"]');
  const t2 = await p.evaluate(() => JSON.parse(localStorage.getItem('litfl-vi')).tien_do['102']);
  assert.strictEqual(t2.moc, 1);

  // tìm kiếm không dấu + toàn văn
  await p.goto(URL + '#/tim/gamma');
  await p.waitForSelector('text=1 bài khớp');
  await p.fill('#tim-trang', 'long text block');
  await p.click('#tim-tv');
  await p.waitForSelector('text=bài có "long text block"');
  assert.ok(await p.isVisible('mark'));

  // tải ngoại tuyến rồi đọc khi mất mạng
  await p.goto(URL + '#/cd');
  await p.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller);
  await p.check('#cm-tat-ca');
  await p.click('#tai-nt');
  await p.waitForSelector('text=Xong: 3/3 bài');
  await ctx.setOffline(true);
  await p.goto(URL + '#/b/103');
  await p.waitForSelector('h1:has-text("[VI] Fixture Gamma")');
  await ctx.setOffline(false);

  // máy tính: thanh điều hướng trên
  await p.setViewportSize({ width: 1280, height: 800 });
  await p.goto(URL);
  await p.waitForSelector('text=Đọc tiếp');
  if (process.env.ANH) await p.screenshot({ path: process.env.ANH });

  assert.deepStrictEqual(loi, [], 'không có lỗi JS: ' + loi.join(' | '));
  await trinh.close();
  console.log('Giao diện: đạt');
})().catch(e => { console.error(e); process.exit(1); });

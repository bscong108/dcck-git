/* Kiểm thử giao diện bằng Playwright: chơi thật mọi dạng bài, mọi mức, các phiếu, góc phụ huynh.
   Chạy: node toan-lop-2/test/giao-dien.js [thư-mục-ảnh]   (cần gói playwright) */
'use strict';
const { chromium } = require(process.env.PW || 'playwright');
const path = require('path');
const out = process.argv[2] || '/tmp';
const url = 'file://' + path.resolve(process.env.TRANG || path.join(__dirname, '..', 'index.html'));

async function traLoiBuoc(page) {
  const { q } = await page.evaluate(() => { const S = __toan2.S; const q = S.q.loai === 'nhieuBuoc' ? S.q.buoc[S.buoc] : S.q; return { q: JSON.parse(JSON.stringify(q)) }; });
  const go = async (o, so) => { if (so == null) throw new Error('thiếu đáp án cho ô'); await o.click(); for (const ch of String(so)) await page.click(`.bp-phim[data-k="${ch}"]`); };
  switch (q.loai) {
    case 'so': case 'o': case 'chiaDeu': {
      const ds = await page.$$('#cau-chinh .o-nhap');
      const sx = []; for (const o of ds) sx.push([Number(await o.getAttribute('data-i')), o]);
      sx.sort((a, b) => a[0] - b[0]);
      const da = q.loai === 'o' ? q.dapAn : [q.dapAn];
      for (let i = 0; i < sx.length; i++) await go(sx[i][1], da[i]);
      await page.click('#nut-kiem'); break;
    }
    case 'chon': await page.click(`#cau-chinh .lc[data-i="${q.dapAn}"]`); break;
    case 'chonNhieu': {
      let chon = q.dung;
      if (q.kiem === 'tong') { chon = []; let con = q.dich; q.luaChon.map((x, i) => [x.gt, i]).sort((a, b) => b[0] - a[0]).forEach(([g, i]) => { if (g <= con) { chon.push(i); con -= g; } }); }
      for (const i of chon) await page.click(`#cau-chinh .cn[data-i="${i}"]`);
      await page.click('#nut-kiem'); break;
    }
    case 'sapXep': {
      for (const v of q.dapAn) { const i = q.luaChon.findIndex(x => String(x) === String(v)); await page.click(`#cau-chinh .nguon .the-xep[data-i="${i}"]`); }
      await page.click('#nut-kiem'); break;
    }
    case 'keoTha': {
      for (let i = 0; i < q.dapAn.length; i++) {
        const the = page.locator(`#cau-chinh .the-tha[data-gt="${q.dapAn[i]}"]:visible`).first();
        await the.click(); await page.click(`#cau-chinh .o-tha[data-i="${i}"]`);
      }
      await page.click('#nut-kiem'); break;
    }
    case 'dongHo': {
      const g = q.dapAn.gio % 12; for (let k = 0; k < g; k++) await page.click('#cau-chinh [data-k="g+"]');
      const p = q.dapAn.phut / (q.buocPhut || 5); for (let k = 0; k < p; k++) await page.click('#cau-chinh [data-k="p+"]');
      await page.click('#nut-kiem'); break;
    }
    case 'tuCham': await page.click('#cau-chinh .xem-da'); await page.click('#cau-chinh [data-v="1"]'); break;
    default: throw new Error('loại lạ ' + q.loai);
  }
}
async function traLoiCau(page) {
  for (let k = 0; k < 12; k++) {
    await traLoiBuoc(page);
    await page.waitForTimeout(30);
    if (await page.evaluate(() => __toan2.S.xong)) break;
  }
  const ok = await page.evaluate(() => { const k = __toan2.P.kq; return k[k.length - 1] && k[k.length - 1].dung; });
  if (!ok) throw new Error('trả lời đúng mà không được chấm đúng: ' + await page.evaluate(() => __toan2.S.q.de));
  await page.click('#nut-tiep');
}
async function choiHet(page) {
  for (let i = 0; i < 40; i++) {
    if (await page.$('.ket-qua')) return true;
    await traLoiCau(page);
  }
  return false;
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.PW_CHROME || undefined });
  const loi = [];
  const moTrang = async (opt) => {
    const ctx = await browser.newContext(Object.assign({ viewport: { width: 1280, height: 900 } }, opt));
    const page = await ctx.newPage();
    page.on('pageerror', e => loi.push('pageerror: ' + e.message));
    page.on('console', m => { if (m.type() === 'error' && !/fonts\.g/.test(m.text() + ((m.location() || {}).url || ''))) loi.push('console: ' + m.text()); });
    await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    return { ctx, page };
  };
  const { ctx, page } = await moTrang();
  const anh = n => page.screenshot({ path: path.join(out, n + '.png') });

  /* 1. Hồ sơ lần đầu */
  await page.goto(url); await page.waitForSelector('#ten-be'); await anh('01-ho-so');
  await page.fill('#ten-be', 'Bé Na'); await page.click('.av[data-a="🐰"]'); await page.click('#bat-dau');
  await page.waitForSelector('.ban-do'); await anh('02-trang-chu');
  console.log('đảo:', await page.$$eval('.dao-the', x => x.length));

  /* 2. Một đảo, một màn có sai – gợi ý – xem cách giải */
  await page.click('.dao-the[data-id="so100"]'); await page.waitForSelector('.duong-dao'); await anh('03-dao');
  const khoa = await page.$$eval('.cap.khoa', x => x.length); console.log('màn đang khoá ở đảo 1:', khoa);
  await page.click('.cap[data-d="cau-tao-so"][data-c="1"]');
  await page.waitForSelector('.hop-thoai'); await anh('04-bi-kip'); await page.click('.ht-dong');
  // câu 1: cố tình sai 2 lần → gợi ý tự mở → xem cách giải
  const q1 = await page.evaluate(() => JSON.parse(JSON.stringify(__toan2.S.q)));
  if (q1.loai === 'chon') {
    const sai = [0, 1, 2, 3].filter(i => i !== q1.dapAn && i < q1.luaChon.length).slice(0, 2);
    for (const i of sai) { await page.click(`#cau-chinh .lc[data-i="${i}"]`); await page.waitForTimeout(450); }
  } else {
    for (let lan = 0; lan < 2; lan++) {
      const ds = await page.$$('#cau-chinh .o-nhap');
      for (const o of ds) { await o.click(); await page.click('.bp-phim[data-k="xoa"]'); await page.click('.bp-phim[data-k="xoa"]'); await page.click('.bp-phim[data-k="7"]'); await page.click('.bp-phim[data-k="7"]'); }
      await page.click('#nut-kiem'); await page.waitForTimeout(450);
    }
  }
  await anh('05-sai-goi-y');
  const coGoiY = await page.$$eval('.goi-y', x => x.length); console.log('gợi ý tự mở sau 2 lần sai:', coGoiY);
  await page.click('#nut-xem'); await page.waitForTimeout(100); await anh('06-xem-cach-giai');
  await page.click('#nut-tiep');
  await choiHet(page); await anh('07-ket-qua');
  console.log('sổ ôn lỗi có:', await page.evaluate(() => __toan2.TD.soLoi.length), 'câu');

  /* 3. Bài giải nhiều bước */
  await page.evaluate(() => { __toan2.TD.daXemBK['tinh-nguoc'] = true; __toan2.batDau({ kieu: 'dang', id: 'tinh-nguoc', cap: 1 }); });
  await page.waitForSelector('#cau-chinh');
  await traLoiBuoc(page); await traLoiBuoc(page); await page.waitForTimeout(80); await anh('08-bai-giai-buoc');
  await page.click('#nut-goiy').catch(() => { }); await page.waitForTimeout(80); await anh('09-goi-y-tuong-tac');

  /* 4. Chơi tất cả dạng × 3 mức (mở khoá hết, 3 câu mỗi màn) */
  await page.evaluate(() => { __toan2.TD.hs.caiDat.moKhoa = true; __toan2.TD.hs.caiDat.soCau = 3; __toan2.TD.ghi(); });
  const ids = await page.evaluate(() => Object.keys(CT.dang));
  let soMan = 0;
  for (const id of ids) for (const cap of [1, 2, 3]) {
    await page.evaluate(([id, cap]) => { __toan2.TD.daXemBK[id] = true; __toan2.batDau({ kieu: 'dang', id, cap }); }, [id, cap]);
    await page.waitForSelector('#cau-chinh');
    if (id === 'xem-dong-ho' && cap === 1) await anh('10-dong-ho');
    if (id === 'phep-chia' && cap === 1) await anh('11-chia-deu');
    if (id === 'chu-so' && cap === 2) await anh('12-bang-so');
    if (id === 'so-sanh' && cap === 1) await anh('13-keo-tha');
    try { if (!(await choiHet(page))) throw new Error('không kết thúc'); }
    catch (e) { throw new Error(`màn ${id}:${cap} — ${e.message.split('\n')[0]}\n${await page.evaluate(() => JSON.stringify(__toan2.S && (__toan2.S.q.buoc ? __toan2.S.q.buoc[__toan2.S.buoc] : __toan2.S.q)).slice(0, 600))}`); }
    soMan++;
  }
  console.log('đã chơi hết', soMan, 'màn');

  /* 5. Phiếu trên lớp: mở danh sách, rồi làm hết mọi phần của mọi phiếu */
  await page.evaluate(() => __toan2.veTrangChu()); await page.click('#nut-phieu'); await page.waitForSelector('.nhom-phieu'); await anh('14-ds-phieu');
  await page.evaluate(() => { const d = document.querySelector('.nhom-phieu'); if (d) d.open = true; });
  await page.click('.nhom-phieu[open] .nut-phan >> nth=0'); await page.waitForSelector('#cau-chinh');
  await page.waitForSelector('.hop-thoai', { timeout: 1500 }).catch(() => null);
  if (await page.$('.hop-thoai')) { await anh('14b-kien-thuc-phieu'); await page.click('.ht-dong'); }
  await anh('15-phieu-cau');
  const phan = await page.evaluate(() => [...document.querySelectorAll('.nut-phan')].map(b => [b.dataset.id, +b.dataset.k]));
  const chup = { 'cau-dat-tinh': 0, 'cau-so-sanh': 0, 'cau-dung-sai': 0, 'thapSo': 0, 'luoiSo': 0, 'tach': 0, 'thuoc': 0 };
  let soCauPhieu = 0;
  for (const [id, k] of phan) {
    await page.evaluate(([id, k]) => { __toan2.TD.daXemBK['phieu:' + id] = true; __toan2.batDau({ kieu: 'phieu', id, phan: k }); }, [id, k]);
    await page.waitForSelector('#cau-chinh');
    for (let i = 0; i < 40; i++) {
      if (await page.$('.ket-qua')) break;
      const loai = await page.evaluate(() => { const q = __toan2.S.q, h = JSON.stringify(q.hinh || '') + JSON.stringify(q.buoc ? q.buoc[0].hinh || '' : ''); return /Đặt tính rồi tính từng/.test(q.de) ? 'cau-dat-tinh' : /Kéo dấu &lt;/.test(q.de) ? 'cau-so-sanh' : /Đúng ghi Đ/.test(q.de) ? 'cau-dung-sai' : /thapSo/.test(h) ? 'thapSo' : /luoiSo/.test(h) ? 'luoiSo' : /Tách – gộp/.test(q.de) ? 'tach' : /thuoc/.test(h) ? 'thuoc' : ''; });
      if (loai && !chup[loai]++) await anh('16-phieu-' + loai);
      try { await traLoiCau(page); } catch (e) { throw new Error(`phiếu ${id} phần ${k}: ${e.message.split('\n')[0]}\n${await page.evaluate(() => JSON.stringify(__toan2.S.q).slice(0, 500))}`); }
      soCauPhieu++;
    }
  }
  console.log('đã làm hết', phan.length, 'phần phiếu,', soCauPhieu, 'câu');

  /* 6. Thử thách hôm nay, ôn lỗi, tia chớp */
  await page.evaluate(() => __toan2.veTrangChu()); await page.click('#nut-thu-thach'); await page.waitForSelector('#cau-chinh'); await choiHet(page);
  await page.evaluate(() => __toan2.veTrangChu()); await page.click('#nut-tia-chop'); await page.click('.phieu-the >> nth=0'); await page.waitForSelector('.tc-phep');
  for (let k = 0; k < 3; k++) { const s = await page.$eval('.tc-phep', e => e.textContent); const m = s.match(/(\d+)\s*([+−×:])\s*(\d+)/); const a = +m[1], b = +m[3]; const kq = m[2] === '+' ? a + b : m[2] === '−' ? a - b : m[2] === '×' ? a * b : a / b; for (const ch of String(kq)) await page.click(`.bp-phim[data-k="${ch}"]`); await page.click('.bp-phim[data-k="ok"]'); }
  await anh('16-tia-chop'); console.log('tia chớp đúng:', await page.$eval('#tc-dung', e => e.textContent));
  await page.click('#ve');

  /* 7. Góc phụ huynh: thêm bài */
  await page.evaluate(() => __toan2.veTrangChu()); await page.click('#nut-phu-huynh');
  const phep = await page.$eval('.hop-thoai .dong-tinh', e => e.textContent); const [, x, y] = phep.match(/(\d+)\s*×\s*(\d+)/);
  await page.fill('#ma-ph', String(x * y)); await page.click('#vao-ph'); await page.waitForSelector('.o-so'); await anh('17-phu-huynh');
  await page.click('.tab-ph [data-t="them"]');
  await page.fill('#f-de', 'Số liền sau của 99 là:'); await page.fill('#f-da', '100'); await page.fill('#f-gy', 'Số liền sau thì thêm 1. 99 + 1 = ? = 100'); await page.click('#f-dua');
  await page.click('.mau[data-m="giai"]'); await page.click('.mau[data-m="chon"]');
  await page.click('#xem-truoc'); await anh('18-them-bai');
  const bao = await page.$eval('#ket-qua-soan', e => e.textContent); console.log('soạn bài:', bao.slice(0, 80));
  await page.click('#luu-bai'); await page.waitForSelector('#da-them');
  await page.evaluate(() => __toan2.veTrangChu());
  console.log('phiếu sau khi thêm:', await page.$eval('#nut-phieu small', e => e.textContent));
  await page.click('#nut-album'); await anh('19-album');
  await page.evaluate(() => __toan2.veTrangChu()); await page.click('#nut-bi-kip'); await anh('20-so-bi-kip');

  /* 8. Điện thoại + chế độ tối */
  for (const [ten, opt] of [['dt', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }], ['toi', { viewport: { width: 1280, height: 900 }, colorScheme: 'dark' }], ['dt-toi', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: 'dark' }]]) {
    const t = await moTrang(Object.assign({ storageState: await ctx.storageState() }, opt));
    await t.page.goto(url); await t.page.waitForSelector('#ten-be, .ban-do');
    if (await t.page.$('#ten-be')) { await t.page.fill('#ten-be', 'Bé Na'); await t.page.click('#bat-dau'); await t.page.waitForSelector('.ban-do'); }
    const tran = await t.page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); if (tran > 0) loi.push(`${ten}: trang chủ tràn ngang ${tran}px`);
    await t.page.screenshot({ path: path.join(out, `21-${ten}-trang-chu.png`), fullPage: false });
    for (const [id, cap] of [['cong-tru-khong-nho', 1], ['them-bot', 1], ['chu-so', 1], ['xem-lich', 1], ['dem-hinh', 3]]) {
      await t.page.evaluate(([id, cap]) => { __toan2.TD.daXemBK[id] = true; __toan2.batDau({ kieu: 'dang', id, cap }); }, [id, cap]);
      await t.page.waitForSelector('#cau-chinh'); await t.page.waitForTimeout(80);
      const tr = await t.page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); if (tr > 0) loi.push(`${ten}: ${id} tràn ngang ${tr}px`);
      await t.page.screenshot({ path: path.join(out, `22-${ten}-${id}.png`), fullPage: false });
    }
    await t.ctx.close();
  }

  await browser.close();
  if (loi.length) { console.log('LỖI:\n' + [...new Set(loi)].join('\n')); process.exit(1); }
  console.log('Giao diện: không có lỗi.');
})().catch(e => { console.error(e); process.exit(1); });

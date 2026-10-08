/* Đảo Số Đến 100 — Chủ đề 1: Ôn tập và bổ sung (kèm các dạng nâng cao trên phiếu Tuần 1, 2, 4, 5). */
(function () {
  'use strict';
  const { n, c, tron, lap } = T;
  const DB = CT.SO_DB;
  const hoa = s => s.charAt(0).toUpperCase() + s.slice(1);

  /* ================= 1. Chục và đơn vị ================= */
  const MO_TA_CHUC = [
    k => ({ ten: `số liền trước của ${k + 1}`, gt: k, hoi: `Số liền trước của ${k + 1} là?` }),
    k => ({ ten: `số liền sau của ${k - 1}`, gt: k, hoi: `Số liền sau của ${k - 1} là?` })
  ];
  CT.them({
    id: 'cau-tao-so', dao: 'so100', ten: 'Chục và đơn vị', bieu: '🧱',
    ghiNho: `<p><b>1 chục = 10 đơn vị.</b> Số có hai chữ số gồm <b>chữ số hàng chục</b> (bên trái) và <b>chữ số hàng đơn vị</b> (bên phải).</p>
      <p>Ví dụ: 47 gồm 4 chục và 7 đơn vị. Viết thành tổng: 47 = 40 + 7.</p>
      <p>Chữ số 0 không đứng ở hàng chục của số có hai chữ số.</p>`,
    cap: [
      () => {
        const ch = n(1, 9), dv = n(0, 9), so = ch * 10 + dv;
        return c([
          () => Q.so('Hình dưới đây biểu diễn số nào?', so, {
            hinh: { kieu: 'khoi', chuc: ch, dv },
            goiY: ['Mỗi thanh dài là 1 chục, tức là 10 khối nhỏ.', { hoi: 'Có mấy thanh chục?', dap: ch }, { hoi: 'Có mấy khối nhỏ lẻ?', dap: dv }],
            loiGiai: [`${ch} chục và ${dv} đơn vị viết là ${so}.`]
          }),
          () => Q.so(`Số gồm <b>${ch} chục</b> và <b>${dv} đơn vị</b> là:`, so, {
            goiY: ['Chữ số hàng chục viết trước, chữ số hàng đơn vị viết sau.'],
            loiGiai: [`Hàng chục là ${ch}, hàng đơn vị là ${dv} → ${so}.`],
            saiThuong: { [dv * 10 + ch]: 'Con viết ngược rồi. Hàng chục đứng trước nhé.' }
          }),
          () => Q.o(`Số <b>${so}</b> gồm [[0]] chục và [[1]] đơn vị.`, [ch, dv], {
            goiY: [`Chữ số bên trái của ${so} là hàng chục.`], loiGiai: [`${so} gồm ${ch} chục và ${dv} đơn vị.`]
          }),
          () => {
            const sai = new Set();
            [dv * 10 + ch, so + 1, so - 1, so + 10, so - 10].forEach(x => { if (x >= 10 && x <= 99 && x !== so) sai.add(x); });
            const ds = [so].concat(tron([...sai]).slice(0, 3));
            return Q.chon(`Số <b>${so}</b> đọc là:`, ds.map(T.soChu), 0, { loiGiai: [`${so} đọc là “${T.soChu(so)}”.`] });
          },
          () => Q.so(`Số “<b>${T.soChu(so)}</b>” viết là:`, so, { loiGiai: [`“${T.soChu(so)}” viết là ${so}.`] })
        ])();
      },
      () => {
        const ch = n(1, 9), dv = n(1, 9), so = ch * 10 + dv;
        return c([
          () => Q.o(`Viết số thành tổng của số tròn chục và số đơn vị:<div class="dong-tinh">${so} = [[0]] + [[1]]</div>`, [ch * 10, dv], {
            goiY: [`${so} gồm ${ch} chục và ${dv} đơn vị. ${ch} chục là mấy?`], loiGiai: [`${so} = ${ch * 10} + ${dv}`]
          }),
          () => {
            const ch2 = n(1, 7), le = n(11, 19), tong = ch2 * 10 + le;
            return Q.so(`Số gồm <b>${ch2} chục</b> và <b>${le} đơn vị</b> là:`, tong, {
              goiY: [{ hoi: `${le} đơn vị gồm 1 chục và mấy đơn vị?`, dap: le - 10 }, { hoi: `Vậy có tất cả mấy chục?`, dap: ch2 + 1 }],
              loiGiai: [`${le} đơn vị = 1 chục và ${le - 10} đơn vị.`, `${ch2} chục + 1 chục = ${ch2 + 1} chục. Số đó là ${tong}.`],
              saiThuong: { [ch2 * 10 + le - 10]: 'Gần đúng! 10 đơn vị đổi thành 1 chục, con nhớ cộng thêm 1 chục nhé.' }
            });
          },
          () => {
            const t = n(1, 7), so2 = t * 10 + t + 2;
            return Q.so(`Tìm số có hai chữ số, biết chữ số hàng chục là ${t} và chữ số hàng đơn vị hơn chữ số hàng chục 2 đơn vị.`, so2, {
              goiY: [{ hoi: 'Chữ số hàng đơn vị là?', dap: t + 2 }], loiGiai: [`Hàng đơn vị: ${t} + 2 = ${t + 2}. Số đó là ${so2}.`]
            });
          },
          () => Q.so(`<b>${ch} chục</b> viết là:`, ch * 10, { loiGiai: [`${ch} chục = ${ch * 10}.`] })
        ])();
      },
      () => c([
        () => {
          const ch = n(1, 9);
          const A = ch === 9 ? { ten: 'số lớn nhất có một chữ số', gt: 9, hoi: 'Số lớn nhất có một chữ số là?' } : c(MO_TA_CHUC)(ch);
          const dvLuaChon = [
            { ten: 'số lớn nhất có một chữ số', gt: 9, hoi: 'Số lớn nhất có một chữ số là?' },
            { ten: 'số bé nhất có một chữ số', gt: 0, hoi: 'Số bé nhất có một chữ số là?' },
            { ten: 'chữ số hàng chục', gt: ch, hoi: 'Chữ số hàng đơn vị bằng chữ số hàng chục, vậy là?' }
          ];
          const k = n(1, 8); dvLuaChon.push({ ten: `số liền sau của ${k - 1}`, gt: k, hoi: `Số liền sau của ${k - 1} là?` });
          if (ch <= 8) dvLuaChon.push({ ten: 'hơn chữ số hàng chục 1 đơn vị', gt: ch + 1, hoi: `${ch} + 1 = ?` });
          const B = c(dvLuaChon), so = ch * 10 + B.gt;
          return Q.so(`Tìm một số có hai chữ số, biết rằng chữ số hàng chục là ${A.ten}. Chữ số hàng đơn vị ${B.ten === 'chữ số hàng chục' ? 'bằng chữ số hàng chục' : B.ten === 'hơn chữ số hàng chục 1 đơn vị' ? B.ten : 'là ' + B.ten}. Vậy số đó là:`, so, {
            goiY: ['Tìm từng chữ số một.', { hoi: 'Chữ số hàng chục: ' + A.hoi, dap: ch }, { hoi: 'Chữ số hàng đơn vị: ' + B.hoi, dap: B.gt }],
            loiGiai: [`Chữ số hàng chục: ${ch}.`, `Chữ số hàng đơn vị: ${B.gt}.`, `Số đó là ${so}.`]
          });
        },
        () => {
          const coKhong = Math.random() < 0.6;
          let ds;
          do { ds = coKhong ? [0, n(1, 9), n(1, 9)] : [n(1, 9), n(1, 9), n(1, 9)]; } while (new Set(ds).size < 3);
          const lon = Math.random() < 0.5;
          const sx = ds.slice().sort((a, b) => b - a);
          let so;
          if (lon) so = sx[0] * 10 + sx[1];
          else { const kKhong = ds.filter(x => x > 0).sort((a, b) => a - b); const ch = kKhong[0]; const con = ds.filter(x => x !== ch).sort((a, b) => a - b); so = ch * 10 + con[0]; }
          return Q.so(`Từ ba chữ số <b>${ds.join(', ')}</b>, hãy lập số <b>${lon ? 'lớn nhất' : 'bé nhất'}</b> có hai chữ số khác nhau.`, so, {
            goiY: lon ? ['Muốn số lớn nhất: chữ số lớn nhất đặt ở hàng chục.', { hoi: 'Chữ số hàng chục là?', dap: Math.floor(so / 10) }, 'Hàng đơn vị lấy chữ số lớn nhất còn lại.']
              : ['Muốn số bé nhất: chữ số bé nhất đặt ở hàng chục, nhưng chữ số 0 không được đứng ở hàng chục.', { hoi: 'Chữ số hàng chục là?', dap: Math.floor(so / 10) }, 'Hàng đơn vị lấy chữ số bé nhất còn lại (có thể là 0).'],
            loiGiai: [`Hàng chục: ${Math.floor(so / 10)}, hàng đơn vị: ${so % 10}.`, `Số cần lập là ${so}.`],
            saiThuong: lon ? {} : { [ds.slice().sort((a, b) => a - b)[0] * 10 + ds.slice().sort((a, b) => a - b)[1]]: 'Số bắt đầu bằng 0 không phải số có hai chữ số đâu con.' }
          });
        }
      ])()
    ]
  });

  /* ================= 2. Số liền trước, số liền sau, tia số ================= */
  function tiaSo(buoc, dauMin) {
    const so = 7, dau = n(dauMin, Math.floor((99 - buoc * (so - 1)) / buoc)) * buoc;
    const vt = tron(lap(so, i => i).slice(1)).slice(0, 3).sort((a, b) => a - b);
    const o = {}; vt.forEach((v, i) => { o[v] = i; });
    return Q.o(`Điền số còn thiếu trên tia số:`, vt.map(v => dau + v * buoc), {
      hinh: { kieu: 'tia', dau, buoc, so, o },
      goiY: [`Hai vạch liền nhau hơn kém nhau ${buoc} đơn vị.`, { hoi: `Số đứng sau ${dau} là?`, dap: dau + buoc }],
      loiGiai: [`Các số trên tia: ${lap(so, i => dau + i * buoc).join(', ')}.`]
    });
  }
  CT.them({
    id: 'lien-truoc-sau', dao: 'so100', ten: 'Liền trước, liền sau, tia số', bieu: '➡️',
    ghiNho: `<p><b>Số liền sau</b> của một số thì lớn hơn số đó 1 đơn vị (cộng 1). <b>Số liền trước</b> thì bé hơn 1 đơn vị (trừ 1).</p>
      <p>Ví dụ: số liền trước của 40 là 39, số liền sau của 40 là 41.</p>
      <p>Trên tia số, số bên phải lớn hơn số bên trái.</p>`,
    cap: [
      () => {
        const x = n(11, 98);
        return c([
          () => Q.so(`Số liền sau của <b>${x}</b> là:`, x + 1, { goiY: ['Số liền sau thì thêm 1.'], loiGiai: [`${x} + 1 = ${x + 1}`], saiThuong: { [x - 1]: 'Đó là số liền trước. Liền sau thì đếm tiếp lên.' } }),
          () => Q.so(`Số liền trước của <b>${x}</b> là:`, x - 1, { goiY: ['Số liền trước thì bớt 1.'], loiGiai: [`${x} − 1 = ${x - 1}`], saiThuong: { [x + 1]: 'Đó là số liền sau. Liền trước thì đếm lùi xuống.' } }),
          () => Q.so(`Số ở giữa <b>${x - 1}</b> và <b>${x + 1}</b> là:`, x, { loiGiai: [`${x - 1}, ${x}, ${x + 1}`] }),
          () => tiaSo(1, 1)
        ])();
      },
      () => {
        const x = n(12, 97);
        return c([
          () => tiaSo(c([2, 5, 10]), 0),
          () => Q.so(`Số liền trước của số liền sau của <b>${x}</b> là:`, x, {
            goiY: [{ hoi: `Số liền sau của ${x} là?`, dap: x + 1 }, { hoi: `Số liền trước của ${x + 1} là?`, dap: x }],
            loiGiai: [`Số liền sau của ${x} là ${x + 1}.`, `Số liền trước của ${x + 1} là ${x}.`]
          }),
          () => Q.so(`<b>${x}</b> là số liền sau của số nào?`, x - 1, { goiY: ['Số liền sau lớn hơn 1 đơn vị, vậy số cần tìm bé hơn.'], loiGiai: [`${x} là số liền sau của ${x - 1}.`], saiThuong: { [x + 1]: `${x + 1} là số liền sau của ${x} mới đúng. Con đọc lại đề nhé.` } }),
          () => Q.o(`Viết ba số liên tiếp, biết số ở giữa là <b>${x}</b>:<div class="dong-tinh">[[0]], ${x}, [[1]]</div>`, [x - 1, x + 1], { loiGiai: [`${x - 1}, ${x}, ${x + 1}`] })
        ])();
      },
      () => {
        const ds = DB.filter(s => s.gt > 0 && s.gt < 99);
        const truoc = Math.random() < 0.5;
        return c([
          () => {
            const B = c(DB.filter(s => s.gt > 0));
            const kq = truoc ? B.gt - 1 : B.gt + 1;
            return Q.so(`Số liền ${truoc ? 'trước' : 'sau'} của ${B.ten} là:`, kq, {
              goiY: [{ hoi: hoa(B.ten) + ' là?', dap: B.gt }, { hoi: `Số liền ${truoc ? 'trước' : 'sau'} của ${B.gt} là?`, dap: kq }],
              loiGiai: [`${hoa(B.ten)} là ${B.gt}.`, `Số liền ${truoc ? 'trước' : 'sau'} của ${B.gt} là ${kq}.`]
            });
          },
          () => Q.so('Số liền sau của số liền trước của số lớn nhất có hai chữ số là:', 99, {
            goiY: [{ hoi: 'Số lớn nhất có hai chữ số là?', dap: 99 }, { hoi: 'Số liền trước của 99 là?', dap: 98 }, { hoi: 'Số liền sau của 98 là?', dap: 99 }],
            loiGiai: ['Số lớn nhất có hai chữ số: 99.', 'Liền trước của 99 là 98.', 'Liền sau của 98 là 99.']
          }),
          () => {
            const B = c(ds);
            return Q.o(`Viết số liền trước và số liền sau của ${B.ten}:<div class="dong-tinh">[[0]], ${B.gt}, [[1]]</div>`, [B.gt - 1, B.gt + 1], {
              goiY: [{ hoi: hoa(B.ten) + ' là?', dap: B.gt }], loiGiai: [`${hoa(B.ten)} là ${B.gt}.`, `${B.gt - 1}, ${B.gt}, ${B.gt + 1}`]
            });
          }
        ])();
      }
    ]
  });

  /* ================= 3. Những số đặc biệt ================= */
  CT.them({
    id: 'so-dac-biet', dao: 'so100', ten: 'Những số đặc biệt', bieu: '💎',
    ghiNho: `<p>Phiếu nâng cao hay hỏi các “số đặc biệt”. Con thuộc bảng này nhé:</p>${CT.BANG_SO_DB}`,
    cap: [
      () => c([
        () => { const A = c(DB); return Q.so(hoa(A.ten) + ' là:', A.gt, { goiY: [A.ten.includes('khác nhau') ? 'Hai chữ số phải khác nhau.' : A.ten.includes('giống nhau') ? 'Hai chữ số phải giống nhau, ví dụ 33.' : 'Nhớ lại bảng số đặc biệt trong Bí kíp 📖.'], loiGiai: [`${hoa(A.ten)} là ${A.gt}.`] }); },
        () => {
          const A = c(DB.filter(s => DB.filter(t => t.gt === s.gt).length === 1));
          const sai = tron(DB.filter(s => s.gt !== A.gt)).slice(0, 3);
          return Q.chon(`Số <b>${A.gt}</b> là:`, [A].concat(sai).map(s => hoa(s.ten)), 0, { loiGiai: [`${A.gt} là ${A.ten}.`] });
        }
      ])(),
      () => {
        const chon = []; tron(DB).forEach(s => { if (chon.length < 4 && !chon.some(t => t.gt === s.gt)) chon.push(s); });
        return Q.tha('Kéo số vào đúng chỗ:<div class="bang-noi">' + chon.map((s, i) => `<div>${hoa(s.ten)}</div><div>{{${i}}}</div>`).join('') + '</div>',
          tron(chon.map(s => String(s.gt))), chon.map(s => String(s.gt)), { loiGiai: chon.map(s => `${hoa(s.ten)}: ${s.gt}`) });
      },
      () => {
        let A, B, cong;
        do { A = c(DB); B = c(DB); cong = Math.random() < 0.5; } while (A === B || (cong ? A.gt + B.gt > 100 : A.gt <= B.gt));
        const kq = cong ? A.gt + B.gt : A.gt - B.gt;
        return Q.so(`${cong ? 'Tổng' : 'Hiệu'} của ${A.ten} và ${B.ten} là:`, kq, {
          goiY: [{ hoi: hoa(A.ten) + ' là?', dap: A.gt }, { hoi: hoa(B.ten) + ' là?', dap: B.gt }, cong ? 'Tổng là phép cộng.' : 'Hiệu là phép trừ: lấy số thứ nhất trừ số thứ hai.'],
          loiGiai: [`${hoa(A.ten)}: ${A.gt}.`, `${hoa(B.ten)}: ${B.gt}.`, `${A.gt} ${cong ? '+' : '−'} ${B.gt} = ${kq}.`]
        });
      }
    ]
  });

  /* ================= 4. So sánh, sắp xếp ================= */
  const dauSS = (a, b) => a < b ? '<' : a > b ? '>' : '=';
  CT.them({
    id: 'so-sanh', dao: 'so100', ten: 'So sánh và sắp xếp', bieu: '⚖️',
    ghiNho: `<p>So sánh hai số có hai chữ số: <b>so sánh hàng chục trước</b>. Hàng chục bằng nhau thì so sánh hàng đơn vị.</p>
      <p>Ví dụ: 45 &lt; 54 vì 4 chục &lt; 5 chục. 67 &gt; 63 vì cùng 6 chục và 7 &gt; 3.</p>
      <p>Mẹo nhớ dấu: miệng cá sấu há về phía số lớn hơn.</p>`,
    cap: [
      () => {
        const cap = lap(3, i => { let a = n(10, 99), b = i === 2 && Math.random() < 0.4 ? a : (Math.random() < 0.5 ? Number(String(a).split('').reverse().join('')) : n(10, 99)); if (b < 10) b = a; return [a, b]; });
        return Q.tha('Kéo dấu &lt;, &gt;, = vào ô trống:<div class="cot-ss">' + cap.map((p, i) => `<div>${p[0]} {{${i}}} ${p[1]}</div>`).join('') + '</div>',
          ['<', '>', '='], cap.map(p => dauSS(p[0], p[1])), { dungLai: true, goiY: ['So sánh chữ số hàng chục trước.'], loiGiai: cap.map(p => `${p[0]} ${dauSS(p[0], p[1])} ${p[1]}`) });
      },
      () => c([
        () => {
          const s = new Set(); while (s.size < 5) s.add(n(10, 99));
          const ds = [...s], tang = Math.random() < 0.5;
          return Q.sapXep(`Xếp các số theo thứ tự từ <b>${tang ? 'bé đến lớn' : 'lớn đến bé'}</b>:`, ds, ds.slice().sort((a, b) => tang ? a - b : b - a),
            { goiY: [`Tìm số ${tang ? 'bé' : 'lớn'} nhất trước.`], loiGiai: [ds.slice().sort((a, b) => tang ? a - b : b - a).join(tang ? ' < ' : ' > ')] });
        },
        () => {
          const cap = lap(3, () => { const ch = n(1, 9), dv = n(0, 9), b = Math.random() < 0.4 ? ch * 10 + dv : n(10, 99); return [ch, dv, b]; });
          return Q.tha('Kéo dấu &lt;, &gt;, = vào ô trống:<div class="cot-ss">' + cap.map((p, i) => `<div>${p[0] * 10} + ${p[1]} {{${i}}} ${p[2]}</div>`).join('') + '</div>',
            ['<', '>', '='], cap.map(p => dauSS(p[0] * 10 + p[1], p[2])), { dungLai: true, goiY: ['Tính vế trái trước rồi mới so sánh.'], loiGiai: cap.map(p => `${p[0] * 10} + ${p[1]} = ${p[0] * 10 + p[1]}, nên ${p[0] * 10 + p[1]} ${dauSS(p[0] * 10 + p[1], p[2])} ${p[2]}`) });
        }
      ])(),
      () => c([
        () => {
          const s = new Set(); while (s.size < 5) s.add(n(10, 89));
          const ds = [...s], be = Math.min(...ds), lon = Math.max(...ds);
          return Q.so(`Tổng của số nhỏ nhất và số lớn nhất trong các số: <b>${ds.join(', ')}</b> là:`, be + lon, {
            goiY: [{ hoi: 'Số nhỏ nhất là?', dap: be }, { hoi: 'Số lớn nhất là?', dap: lon }, 'Tổng là phép cộng.'],
            loiGiai: [`Số nhỏ nhất: ${be}. Số lớn nhất: ${lon}.`, `${be} + ${lon} = ${be + lon}.`]
          });
        },
        () => {
          const ch = n(1, 9), d = n(1, 8), lonHon = Math.random() < 0.5;
          const dung = lap(10, i => i).filter(x => lonHon ? x > d : x < d);
          return Q.nhieu(`Chọn <b>tất cả</b> chữ số có thể điền vào ô trống:<div class="dong-tinh">${ch}<span class="o-mau">?</span> ${lonHon ? '&gt;' : '&lt;'} ${ch}${d}</div>`,
            lap(10, i => i), dung, {
              luoi: 5, goiY: ['Hai số có cùng chữ số hàng chục, vậy chỉ cần so sánh hàng đơn vị.', `Chữ số ở ô trống phải ${lonHon ? 'lớn' : 'bé'} hơn ${d}.`],
              loiGiai: [`Các chữ số ${lonHon ? 'lớn' : 'bé'} hơn ${d}: ${dung.join(', ')}.`]
            });
        },
        () => {
          const ds = lap(4, () => n(12, 98));
          while (new Set(ds).size < 4) ds[n(0, 3)] = n(12, 98);
          const lon = Math.max(...ds);
          const viet = ds.map((x, i) => i % 2 ? `${Math.floor(x / 10)} chục ${x % 10} đơn vị` : String(x));
          return Q.chon('Số nào <b>lớn nhất</b>?', viet, ds.indexOf(lon), { goiY: ['Đổi tất cả về cùng một cách viết số rồi so sánh.'], loiGiai: [ds.map((x, i) => `${viet[i]} = ${x}`).join('; '), `Số lớn nhất: ${lon}.`] });
        }
      ])()
    ]
  });

  /* ================= 5. Số hạng – Tổng, Số bị trừ – Số trừ – Hiệu ================= */
  CT.them({
    id: 'thanh-phan', dao: 'so100', ten: 'Số hạng, tổng, hiệu', bieu: '🏷️',
    ghiNho: `<p><b>34 + 25 = 59</b>: 34 và 25 là <b>số hạng</b>, 59 là <b>tổng</b>. “34 + 25” cũng gọi là tổng.</p>
      <p><b>59 − 25 = 34</b>: 59 là <b>số bị trừ</b>, 25 là <b>số trừ</b>, 34 là <b>hiệu</b>.</p>
      <p>“Tổng của a và b” → làm a + b. “Hiệu của a và b” → làm a − b.</p>`,
    cap: [
      () => c([
        () => {
          const ps = lap(3, () => { const a = n(1, 9), b = n(1, 9); return [a, b]; });
          return Q.o('Điền số thích hợp vào ô trống:', ps.map(p => p[0] + p[1]), {
            hinh: { kieu: 'bang', hang: [['Số hạng'].concat(ps.map(p => p[0])), ['Số hạng'].concat(ps.map(p => p[1])), ['Tổng', '[[0]]', '[[1]]', '[[2]]']] },
            goiY: ['Tổng = số hạng + số hạng.'], loiGiai: ps.map(p => `${p[0]} + ${p[1]} = ${p[0] + p[1]}`)
          });
        },
        () => {
          const ps = lap(3, () => { const a = n(11, 18), b = n(a - 9, 9); return [a, b]; });
          return Q.o('Điền số thích hợp vào ô trống:', ps.map(p => p[0] - p[1]), {
            hinh: { kieu: 'bang', hang: [['Số bị trừ'].concat(ps.map(p => p[0])), ['Số trừ'].concat(ps.map(p => p[1])), ['Hiệu', '[[0]]', '[[1]]', '[[2]]']] },
            goiY: ['Hiệu = số bị trừ − số trừ.'], loiGiai: ps.map(p => `${p[0]} − ${p[1]} = ${p[0] - p[1]}`)
          });
        },
        () => { const [a, b] = capKhongNho(true); return Q.so(`Tổng của <b>${a}</b> và <b>${b}</b> là:`, a + b, { goiY: ['Tổng là phép cộng.'], loiGiai: [`${a} + ${b} = ${a + b}`] }); },
        () => { const [a, b] = capKhongNho(false); return Q.so(`Hiệu của <b>${a}</b> và <b>${b}</b> là:`, a - b, { goiY: ['Hiệu là phép trừ: số thứ nhất trừ số thứ hai.'], loiGiai: [`${a} − ${b} = ${a - b}`], saiThuong: { [a + b]: 'Hiệu là phép trừ, không phải phép cộng.' } }); }
      ])(),
      () => c([
        () => {
          const cong = Math.random() < 0.5, a = n(30, 79), b = n(11, 20), k = cong ? a + b : a - b;
          const de = cong ? `${a} + ${b} = ${k}` : `${a} − ${b} = ${k}`;
          const vai = cong ? c([['tổng', k], ['số hạng thứ hai', b], ['số hạng thứ nhất', a]]) : c([['số bị trừ', a], ['số trừ', b], ['hiệu', k]]);
          const ds = [vai[1]].concat([a, b, k].filter(x => x !== vai[1]));
          return Q.chon(`Trong phép tính <b>${de}</b>, ${vai[0]} là:`, ds.map(String), 0, {
            loiGiai: [cong ? `${de}: ${a} và ${b} là số hạng, ${k} là tổng.` : `${de}: ${a} là số bị trừ, ${b} là số trừ, ${k} là hiệu.`]
          });
        },
        () => {
          const cong = Math.random() < 0.5, a = n(20, 60), b = n(10, 30);
          const dau = cong ? '+' : '−', k = cong ? a + b : a - b;
          const dap = cong ? ['Số hạng', 'Số hạng', 'Tổng'] : ['Số bị trừ', 'Số trừ', 'Hiệu'];
          return Q.tha(`Kéo tên gọi vào đúng chỗ:<div class="ten-goi"><div>${a}</div><div>${dau}</div><div>${b}</div><div>=</div><div>${k}</div><div>{{0}}</div><div></div><div>{{1}}</div><div></div><div>{{2}}</div></div>`,
            ['Số hạng', 'Tổng', 'Số bị trừ', 'Số trừ', 'Hiệu'], dap, { dungLai: true, loiGiai: [`${a} ${dau} ${b} = ${k}: ${dap.join(', ')}.`] });
        }
      ])(),
      () => c([
        () => {
          const a = n(20, 59), b = n(10, a - 10), h = a - b, cc = n(10, 99 - h);
          return Q.so(`Lấy hiệu của <b>${a}</b> và <b>${b}</b> rồi cộng với <b>${cc}</b> được kết quả là:`, h + cc, {
            goiY: [{ hoi: `Hiệu của ${a} và ${b} là?`, dap: h }, { hoi: `Lấy ${h} cộng với ${cc} được?`, dap: h + cc }],
            loiGiai: [`${a} − ${b} = ${h}`, `${h} + ${cc} = ${h + cc}`]
          });
        },
        () => {
          const A = c(DB.filter(s => s.gt < 50)), S = n(Math.max(A.gt + 10, 20), 99);
          return Q.o(`Viết một phép cộng có tổng bằng <b>${S}</b>, biết một số hạng là ${A.ten}.<div class="dong-tinh">[[0]] + [[1]] = ${S}</div>`, [A.gt, S - A.gt], {
            dapAnKhac: [[S - A.gt, A.gt]],
            goiY: [{ hoi: hoa(A.ten) + ' là?', dap: A.gt }, { hoi: `Số hạng kia = ${S} − ${A.gt} = ?`, dap: S - A.gt }],
            loiGiai: [`Số hạng đã biết: ${A.gt}.`, `Số hạng kia: ${S} − ${A.gt} = ${S - A.gt}.`, `Phép cộng: ${A.gt} + ${S - A.gt} = ${S}.`]
          });
        },
        () => {
          const A = c(DB.filter(s => s.gt <= 40)), x = n(12, 55), kq = A.gt + 1 + x - 1;
          return Q.so(`Viết kết quả của phép cộng số liền sau của ${A.ten} với số liền trước của ${x}.`, kq, {
            goiY: [{ hoi: hoa(A.ten) + ' là?', dap: A.gt }, { hoi: `Số liền sau của ${A.gt} là?`, dap: A.gt + 1 }, { hoi: `Số liền trước của ${x} là?`, dap: x - 1 }],
            loiGiai: [`Liền sau của ${A.gt} là ${A.gt + 1}.`, `Liền trước của ${x} là ${x - 1}.`, `${A.gt + 1} + ${x - 1} = ${kq}.`]
          });
        }
      ])()
    ]
  });

  /* ================= 6. Hơn, kém nhau bao nhiêu ================= */
  const VAT_HK = [['🍎', 'quả táo'], ['🌸', 'bông hoa'], ['⭐', 'ngôi sao'], ['🐟', 'con cá'], ['🎈', 'quả bóng']];
  CT.them({
    id: 'hon-kem', dao: 'so100', ten: 'Hơn, kém nhau bao nhiêu', bieu: '📏',
    ghiNho: `<p>Muốn biết số lớn <b>hơn</b> số bé bao nhiêu, hay số bé <b>kém</b> số lớn bao nhiêu, ta lấy <b>số lớn trừ số bé</b>.</p>
      <p>Ví dụ: 8 hơn 5 là 3 đơn vị vì 8 − 5 = 3. Cũng nói: 5 kém 8 là 3 đơn vị.</p>`,
    cap: [
      () => {
        const [v, ten] = c(VAT_HK), a = n(5, 10), b = n(1, a - 1);
        return c([
          () => Q.so(`Hàng trên nhiều hơn hàng dưới mấy ${ten}?`, a - b, { hinh: [{ kieu: 'vat', vat: v, so: a }, { kieu: 'vat', vat: v, so: b }], goiY: ['Nối mỗi hình hàng dưới với một hình hàng trên, đếm số hình thừa ra.'], loiGiai: [`${a} − ${b} = ${a - b}`] }),
          () => Q.so(`<b>${a}</b> hơn <b>${b}</b> bao nhiêu đơn vị?`, a - b, { loiGiai: [`${a} − ${b} = ${a - b}`], saiThuong: { [a + b]: 'Hơn kém thì làm phép trừ.' } })
        ])();
      },
      () => {
        const a = n(30, 99), b = n(10, a - 5);
        const bb = b - (a % 10 < b % 10 ? b % 10 - a % 10 : 0);
        return c([
          () => Q.giaiToan({ de: `Lan có ${a} nhãn vở, Mai có ${bb} nhãn vở. Hỏi Lan có nhiều hơn Mai bao nhiêu nhãn vở?`, phep: [{ hoi: 'số nhãn vở Lan nhiều hơn Mai', a, dau: '−', b: bb, kq: a - bb }], donVi: 'nhãn vở', goiYPhep: ['Hỏi “nhiều hơn bao nhiêu” thì lấy số lớn trừ số bé.'] }),
          () => Q.so(`<b>${bb}</b> kém <b>${a}</b> bao nhiêu đơn vị?`, a - bb, { goiY: ['Lấy số lớn trừ số bé.'], loiGiai: [`${a} − ${bb} = ${a - bb}`] })
        ])();
      },
      () => {
        const ds = [
          ['số lớn nhất có hai chữ số', 99, 'số bé nhất có hai chữ số', 10],
          ['số lớn nhất có hai chữ số khác nhau', 98, 'số bé nhất có hai chữ số giống nhau', 11],
          ['số tròn chục lớn nhất có hai chữ số', 90, 'số lớn nhất có một chữ số', 9],
          ['số lớn nhất có hai chữ số giống nhau', 99, 'số bé nhất có hai chữ số khác nhau', 10]
        ];
        const x = n(21, 89);
        return c([
          () => { const p = c(ds); return Q.so(`${hoa(p[0])} hơn ${p[2]} bao nhiêu đơn vị?`, p[1] - p[3], { goiY: [{ hoi: hoa(p[0]) + ' là?', dap: p[1] }, { hoi: hoa(p[2]) + ' là?', dap: p[3] }], loiGiai: [`${p[1]} − ${p[3]} = ${p[1] - p[3]}`] }); },
          () => { const t = (Math.floor(x / 10) + 1) * 10; return Q.so(`Số tròn chục liền sau của <b>${x}</b> hơn <b>${x}</b> bao nhiêu đơn vị?`, t - x, { goiY: [{ hoi: `Số tròn chục liền sau của ${x} là?`, dap: t }], loiGiai: [`Số tròn chục liền sau của ${x} là ${t}.`, `${t} − ${x} = ${t - x}.`] }); }
        ])();
      }
    ]
  });

  /* ================= 7. Cộng, trừ không nhớ trong phạm vi 100 ================= */
  function capKhongNho(cong) {
    if (cong) { const a1 = n(1, 8), a2 = n(0, 8), b1 = n(0, 9 - a1), b2 = n(0, 9 - a2); return [a1 * 10 + a2, b1 * 10 + b2 || 1]; }
    const a1 = n(2, 9), a2 = n(1, 9), b1 = n(0, a1 - 1), b2 = n(0, a2); return [a1 * 10 + a2, b1 * 10 + b2 || 1];
  }
  const datTinh = (a, b, dau, kq, an) => {
    const sa = String(a).split(''), sb = String(b).split(''), sk = String(kq).split('');
    return { kieu: 'datTinh', dong: [sa, [dau].concat(sb)], kq: an ? sk.map((_, i) => `[[${i}]]`) : sk };
  };
  CT.datTinh = datTinh;
  CT.them({
    id: 'cong-tru-khong-nho', dao: 'so100', ten: 'Cộng, trừ không nhớ', bieu: '➕',
    ghiNho: `<p><b>Đặt tính</b>: viết các chữ số cùng hàng thẳng cột với nhau (đơn vị dưới đơn vị, chục dưới chục).</p>
      <p><b>Tính</b>: từ phải sang trái — hàng đơn vị trước, hàng chục sau.</p>
      <p>Tìm số còn thiếu: số hạng = tổng − số hạng kia; số bị trừ = hiệu + số trừ; số trừ = số bị trừ − hiệu.</p>`,
    cap: [
      () => {
        const cong = Math.random() < 0.5, [a, b] = capKhongNho(cong), kq = cong ? a + b : a - b, dau = cong ? '+' : '−';
        return c([
          () => Q.so(`<div class="dong-tinh">${a} ${dau} ${b} = [[0]]</div>`, kq, { goiY: ['Tính hàng đơn vị trước, rồi đến hàng chục.'], loiGiai: [`${a} ${dau} ${b} = ${kq}`] }),
          () => Q.o('Đặt tính rồi tính (điền chữ số vào kết quả):', String(kq).split('').map(Number), {
            hinh: datTinh(a, b, dau, kq, true),
            goiY: [{ hoi: `Hàng đơn vị: ${a % 10} ${dau} ${b % 10} = ?`, dap: cong ? a % 10 + b % 10 : a % 10 - b % 10 }, 'Rồi tính hàng chục.'],
            loiGiai: [`Đơn vị: ${a % 10} ${dau} ${b % 10} = ${cong ? a % 10 + b % 10 : a % 10 - b % 10}`, `Chục: ${Math.floor(a / 10)} ${dau} ${Math.floor(b / 10)} = ${cong ? Math.floor(a / 10) + Math.floor(b / 10) : Math.floor(a / 10) - Math.floor(b / 10)}`, `Kết quả: ${kq}`]
          })
        ])();
      },
      () => {
        const cong = Math.random() < 0.5, [a, b] = capKhongNho(cong), kq = cong ? a + b : a - b;
        return c([
          () => cong ? Q.so(`<div class="dong-tinh">[[0]] + ${b} = ${kq}</div>`, a, { goiY: ['Số hạng chưa biết = tổng − số hạng đã biết.', { hoi: `${kq} − ${b} = ?`, dap: a }], loiGiai: [`${kq} − ${b} = ${a}`] })
            : Q.so(`<div class="dong-tinh">${a} − [[0]] = ${kq}</div>`, b, { goiY: ['Số trừ = số bị trừ − hiệu.', { hoi: `${a} − ${kq} = ?`, dap: b }], loiGiai: [`${a} − ${kq} = ${b}`] }),
          () => { const t1 = n(1, 5) * 10, t2 = n(1, 4) * 10, t3 = n(1, Math.floor((t1 + t2) / 10)) * 10; return Q.so(`<div class="dong-tinh">${t1} + ${t2} − ${t3} = [[0]]</div>`, t1 + t2 - t3, { goiY: [{ hoi: `${t1} + ${t2} = ?`, dap: t1 + t2 }], loiGiai: [`${t1} + ${t2} = ${t1 + t2}`, `${t1 + t2} − ${t3} = ${t1 + t2 - t3}`] }); },
          () => cong ? Q.so(`<div class="dong-tinh">[[0]] − ${b} = ${a}</div>`, kq, { goiY: ['Số bị trừ = hiệu + số trừ.'], loiGiai: [`${a} + ${b} = ${kq}`], saiThuong: { [a - b]: 'Muốn tìm số bị trừ, con lấy hiệu cộng với số trừ.' } }) : Q.so(`<div class="dong-tinh">${b} + [[0]] = ${a}</div>`, kq, { loiGiai: [`${a} − ${b} = ${kq}`] })
        ])();
      },
      () => {
        const cong = Math.random() < 0.5, [a, b] = capKhongNho(cong), kq = cong ? a + b : a - b, dau = cong ? '+' : '−';
        const sa = String(a).split(''), sb = String(b).padStart(2, '0').split(''), sk = String(kq).padStart(2, '0').split('');
        if (b < 10 || kq < 10) return Q.so(`<div class="dong-tinh">${a} ${dau} [[0]] = ${kq}</div>`, b, { loiGiai: [`${b}`] });
        const hang = [[sa[0], '[[0]]'], [dau, '[[1]]', sb[1]]];
        return Q.o('Điền chữ số thích hợp vào ô trống:', [Number(sa[1]), Number(sb[0])], {
          hinh: { kieu: 'datTinh', dong: hang, kq: sk },
          goiY: [cong ? `Hàng đơn vị: ô trống + ${sb[1]} = ${sk[1]}.` : `Hàng đơn vị: ô trống − ${sb[1]} = ${sk[1]}.`, { hoi: 'Chữ số hàng đơn vị của số trên là?', dap: Number(sa[1]) }, cong ? `Hàng chục: ${sa[0]} + ô trống = ${sk[0]}.` : `Hàng chục: ${sa[0]} − ô trống = ${sk[0]}.`],
          loiGiai: [`${a} ${dau} ${b} = ${kq}`]
        });
      }
    ]
  });

  /* ================= 8. Đếm số các số trong dãy (Phiếu Tuần 4 số 2) ================= */
  CT.them({
    id: 'dem-day-so', dao: 'so100', ten: 'Đếm số các số trong dãy', bieu: '🔢',
    ghiNho: `<p>Trong dãy số tự nhiên liên tiếp, muốn tìm số các số hạng, ta tính:</p>
      <p class="cong-thuc">Số các số hạng = (Số cuối − Số đầu) + 1</p>
      <p><b>Ví dụ:</b> Từ số 31 đến số 78 có bao nhiêu số có hai chữ số?<br>Ta có: (78 − 31) + 1 = 48. Vậy có 48 số.</p>
      <p>“Lớn hơn 34 nhưng nhỏ hơn 79”: không lấy 34 và 79 → đếm từ <b>35</b> đến <b>78</b>.</p>
      <p>Số có hai chữ số bắt đầu từ <b>10</b> và kết thúc ở <b>99</b>.</p>`,
    cap: [
      () => {
        const a = n(1, 40), b = a + n(4, 9);
        return Q.so(`Từ <b>${a}</b> đến <b>${b}</b> có tất cả bao nhiêu số?`, b - a + 1, {
          hinh: { kieu: 'chu', chu: `<div class="dai-so">${lap(b - a + 1, i => `<span>${a + i}</span>`).join('')}</div>` },
          goiY: ['Con đếm từng số trên dải số, nhớ đếm cả số đầu và số cuối.', `Cách nhanh: (${b} − ${a}) + 1.`],
          loiGiai: [`(${b} − ${a}) + 1 = ${b - a + 1}`, `Có ${b - a + 1} số.`],
          saiThuong: { [b - a]: 'Gần đúng! Con quên đếm số đầu tiên rồi: phải cộng thêm 1.' }
        });
      },
      () => {
        const a = n(10, 60), b = n(a + 8, 99);
        return Q.so(`Từ số <b>${a}</b> đến số <b>${b}</b> có tất cả bao nhiêu số có hai chữ số?`, b - a + 1, {
          goiY: [{ hoi: `Số cuối trừ số đầu: ${b} − ${a} = ?`, dap: b - a }, { hoi: 'Cộng thêm 1 được?', dap: b - a + 1 }],
          loiGiai: [`(${b} − ${a}) + 1 = ${b - a + 1}`],
          saiThuong: { [b - a]: 'Con quên cộng 1 rồi. Phải tính cả số đầu.', [b - a + 2]: 'Con cộng thừa rồi. Chỉ cộng thêm 1 thôi.' }
        });
      },
      () => c([
        () => {
          const a = n(10, 60), b = n(a + 10, 99), dau = a + 1, cuoi = b - 1, kq = cuoi - dau + 1;
          return Q.so(`Có bao nhiêu số lớn hơn <b>${a}</b> nhưng nhỏ hơn <b>${b}</b>?`, kq, {
            goiY: [{ hoi: `Số đầu tiên lớn hơn ${a} là?`, dap: dau }, { hoi: `Số cuối cùng nhỏ hơn ${b} là?`, dap: cuoi }, { hoi: `(${cuoi} − ${dau}) + 1 = ?`, dap: kq }],
            loiGiai: [`Các số đó là ${dau}, ${dau + 1}, …, ${cuoi}.`, `(${cuoi} − ${dau}) + 1 = ${kq}`],
            saiThuong: { [b - a + 1]: `Không lấy ${a} và ${b} con nhé, vì đề nói “lớn hơn” và “nhỏ hơn”.`, [b - a]: `Không lấy cả ${a} và ${b}. Số đầu là ${dau}, số cuối là ${cuoi}.` }
          });
        },
        () => {
          const x = n(20, 90), be = Math.random() < 0.5;
          const kq = be ? x - 10 : 99 - x;
          return Q.so(`Có bao nhiêu số có hai chữ số ${be ? 'bé' : 'lớn'} hơn <b>${x}</b>?`, kq, {
            goiY: be ? [{ hoi: 'Số có hai chữ số bé nhất là?', dap: 10 }, { hoi: `Số cuối cùng bé hơn ${x} là?`, dap: x - 1 }, { hoi: `(${x - 1} − 10) + 1 = ?`, dap: kq }]
              : [{ hoi: `Số đầu tiên lớn hơn ${x} là?`, dap: x + 1 }, { hoi: 'Số có hai chữ số lớn nhất là?', dap: 99 }, { hoi: `(99 − ${x + 1}) + 1 = ?`, dap: kq }],
            loiGiai: be ? [`Các số từ 10 đến ${x - 1}.`, `(${x - 1} − 10) + 1 = ${kq}`] : [`Các số từ ${x + 1} đến 99.`, `(99 − ${x + 1}) + 1 = ${kq}`],
            saiThuong: be ? { [x]: 'Số có hai chữ số bắt đầu từ 10, không phải từ 0 hay 1.', [x - 1]: 'Số có hai chữ số bắt đầu từ 10.' } : { [99 - x + 1]: `Không lấy số ${x} vì đề nói “lớn hơn”.` }
          });
        },
        () => {
          const loai = c([['một chữ số', 10, 'Các số có một chữ số: 0, 1, 2, …, 9.'], ['hai chữ số', 90, 'Các số có hai chữ số: từ 10 đến 99 → (99 − 10) + 1 = 90.'], ['ba chữ số', 1, 'Chỉ có số 100.']]);
          return Q.so(`Trong các số từ 0 đến 100, có bao nhiêu số có ${loai[0]}?`, loai[1], { goiY: [loai[0] === 'một chữ số' ? 'Đừng quên số 0 cũng là số có một chữ số.' : 'Tìm số đầu và số cuối của nhóm đó.'], loiGiai: [loai[2]], saiThuong: { 9: 'Con quên số 0 rồi.', 89: 'Con quên cộng 1 rồi.' } });
        }
      ])()
    ]
  });

  /* ================= 9. Tìm số theo điều kiện chữ số (bảng số) ================= */
  const BANG = lap(90, i => i + 10);
  const tongCS = x => Math.floor(x / 10) + x % 10;
  function bang(de, loc, goiY, loiGiai) {
    const dung = BANG.map((x, i) => loc(x) ? i : -1).filter(i => i >= 0);
    return Q.nhieu(de, BANG, dung, { luoi: 10, nho: true, goiY, loiGiai: loiGiai || [BANG.filter(loc).join(', ')] });
  }
  CT.them({
    id: 'chu-so', dao: 'so100', ten: 'Tìm số theo chữ số', bieu: '🔎',
    ghiNho: `<p>Muốn tìm tất cả các số thỏa mãn điều kiện, con <b>đi lần lượt từng hàng chục</b> từ 1 đến 9 để không bỏ sót.</p>
      <p>Ví dụ: số có hai chữ số mà tổng hai chữ số bằng 5: hàng chục 1 → 14; 2 → 23; 3 → 32; 4 → 41; 5 → 50. Có 5 số.</p>
      <p>“Hai chữ số khác nhau” thì bỏ các số như 33.</p>`,
    cap: [
      () => {
        if (Math.random() < 0.5) { const ch = n(1, 9); return bang(`Chọn tất cả các số có chữ số <b>hàng chục là ${ch}</b>:`, x => Math.floor(x / 10) === ch, ['Hàng chục là chữ số bên trái.']); }
        const d = n(0, 9); return bang(`Chọn tất cả các số có chữ số <b>hàng đơn vị là ${d}</b>:`, x => x % 10 === d, ['Hàng đơn vị là chữ số bên phải. Các số này nằm cùng một cột.']);
      },
      () => {
        if (Math.random() < 0.6) { const k = n(3, 9); return bang(`Chọn tất cả các số có hai chữ số mà <b>tổng hai chữ số bằng ${k}</b>:`, x => tongCS(x) === k, ['Thử lần lượt hàng chục 1, 2, 3…', `Hàng chục là 1 thì hàng đơn vị là ${k - 1}.`]); }
        return bang('Chọn tất cả các số có hai chữ số mà khi đọc từ trái sang phải hay từ phải sang trái thì <b>giá trị số không đổi</b>:', x => Math.floor(x / 10) === x % 10, ['Ví dụ 23 đọc ngược thành 32 — khác nhau. Số nào đọc ngược vẫn như cũ?']);
      },
      () => c([
        () => { const k = n(4, 12); return bang(`Chọn tất cả các số có hai chữ số <b>khác nhau</b> mà tổng hai chữ số bằng <b>${k}</b>:`, x => tongCS(x) === k && Math.floor(x / 10) !== x % 10, ['Tìm hết các số có tổng chữ số bằng ' + k + ', rồi bỏ số có hai chữ số giống nhau.']); },
        () => {
          const k = n(2, 15), ds = BANG.filter(x => tongCS(x) === k);
          return Q.so(`Có bao nhiêu số có hai chữ số mà tổng hai chữ số bằng <b>${k}</b>?`, ds.length, { goiY: ['Viết lần lượt từng số theo hàng chục tăng dần.', { hoi: 'Số bé nhất như vậy là?', dap: ds[0] }], loiGiai: [`Các số: ${ds.join(', ')}.`, `Có ${ds.length} số.`] });
        },
        () => {
          const k = n(2, 17), lon = Math.random() < 0.5, ds = BANG.filter(x => tongCS(x) === k), kq = lon ? ds[ds.length - 1] : ds[0];
          return Q.so(`Số ${lon ? 'lớn' : 'nhỏ'} nhất có hai chữ số mà tổng các chữ số bằng <b>${k}</b> là:`, kq, {
            goiY: [lon ? 'Muốn số lớn nhất, chữ số hàng chục phải lớn nhất có thể.' : 'Muốn số nhỏ nhất, chữ số hàng chục phải nhỏ nhất có thể.', { hoi: 'Chữ số hàng chục là?', dap: Math.floor(kq / 10) }, { hoi: 'Chữ số hàng đơn vị là?', dap: kq % 10 }],
            loiGiai: [`Hàng chục ${Math.floor(kq / 10)}, hàng đơn vị ${kq % 10}: ${Math.floor(kq / 10)} + ${kq % 10} = ${k}.`, `Số đó là ${kq}.`]
          });
        }
      ])()
    ]
  });

  /* ================= 10. Chuỗi suy luận nhiều bước (Phiếu Tuần 5) ================= */
  const DB_PLUS = [
    { ten: 'số lớn nhất có hai chữ số mà tổng các chữ số bằng 3', gt: 30 },
    { ten: 'số lớn nhất có hai chữ số mà tổng các chữ số bằng 2', gt: 20 },
    { ten: 'số bé nhất có hai chữ số', gt: 10 },
    { ten: 'số lớn nhất có một chữ số', gt: 9 },
    { ten: 'số bé nhất có hai chữ số giống nhau', gt: 11 },
    { ten: 'số tròn chục bé nhất có hai chữ số', gt: 10 }
  ];
  CT.them({
    id: 'nhieu-buoc', dao: 'so100', ten: 'Thám tử nhiều bước', bieu: '🧩',
    ghiNho: `<p>Đề dài thì <b>chia nhỏ</b>: đọc từng câu, tìm từng số một, viết ra giấy rồi mới tính tiếp.</p>
      <p><b>Trong một phép cộng, tổng hơn số hạng thứ nhất bao nhiêu thì số hạng thứ hai bằng bấy nhiêu.</b> Ví dụ: tổng hơn số hạng thứ nhất 22 đơn vị → số hạng thứ hai là 22.</p>`,
    cap: [
      () => { const a = n(10, 40), b = n(5, 30), cc = n(1, a + b - 1); return Q.so(`Lấy <b>${a}</b> cộng với <b>${b}</b> rồi trừ đi <b>${cc}</b> được kết quả là:`, a + b - cc, { goiY: [{ hoi: `${a} + ${b} = ?`, dap: a + b }, { hoi: `${a + b} − ${cc} = ?`, dap: a + b - cc }], loiGiai: [`${a} + ${b} = ${a + b}`, `${a + b} − ${cc} = ${a + b - cc}`] }); },
      () => {
        const a = n(30, 90), b = n(10, a - 5), h = a - b, cc = n(5, 99 - h), cong = Math.random() < 0.5 || h < 10;
        const kq = cong ? h + cc : h - Math.min(cc, h);
        const c2 = cong ? cc : Math.min(cc, h);
        return Q.so(`Lấy hiệu của <b>${a}</b> và <b>${b}</b> rồi ${cong ? 'cộng với' : 'trừ đi'} <b>${c2}</b> được kết quả là:`, kq, { goiY: [{ hoi: `Hiệu của ${a} và ${b} là?`, dap: h }, { hoi: `${h} ${cong ? '+' : '−'} ${c2} = ?`, dap: kq }], loiGiai: [`${a} − ${b} = ${h}`, `${h} ${cong ? '+' : '−'} ${c2} = ${kq}`] });
      },
      () => c([
        () => {
          let A, B, x, s1, s2;
          do { A = c(DB_PLUS); B = c(DB.filter(s => s.gt >= 9 && s.gt <= 30)); x = n(5, 30); s1 = x + A.gt; s2 = s1 + B.gt; } while (s1 + s2 > 100);
          return Q.so(`Số thứ nhất là tổng của ${x} và ${A.ten}. Số thứ hai là tổng của số thứ nhất và ${B.ten}. Tìm tổng của hai số đó.`, s1 + s2, {
            goiY: [{ hoi: hoa(A.ten) + ' là?', dap: A.gt }, { hoi: `Số thứ nhất: ${x} + ${A.gt} = ?`, dap: s1 }, { hoi: hoa(B.ten) + ' là?', dap: B.gt }, { hoi: `Số thứ hai: ${s1} + ${B.gt} = ?`, dap: s2 }, { hoi: `Tổng hai số: ${s1} + ${s2} = ?`, dap: s1 + s2 }],
            loiGiai: [`${hoa(A.ten)} là ${A.gt}.`, `Số thứ nhất: ${x} + ${A.gt} = ${s1}.`, `Số thứ hai: ${s1} + ${B.gt} = ${s2}.`, `Tổng: ${s1} + ${s2} = ${s1 + s2}.`],
            saiThuong: { [s2]: 'Đó mới là số thứ hai. Đề hỏi tổng của hai số.' }
          });
        },
        () => {
          let t, s, d, sh1;
          do { t = n(2, 7); s = n(10, 30); d = n(10, 30); sh1 = t * 10 + s + 1; } while (sh1 + d > 99);
          return Q.so(`Trong một phép cộng, tổng hơn số hạng thứ nhất ${d} đơn vị. Số hạng thứ nhất là tổng của số tròn chục có chữ số hàng chục là ${t} và số liền sau của ${s}. Tính tổng của phép tính đó.`, sh1 + d, {
            goiY: [{ hoi: `Số tròn chục có chữ số hàng chục là ${t} là?`, dap: t * 10 }, { hoi: `Số liền sau của ${s} là?`, dap: s + 1 }, { hoi: `Số hạng thứ nhất: ${t * 10} + ${s + 1} = ?`, dap: sh1 }, `Tổng hơn số hạng thứ nhất ${d} đơn vị nghĩa là tổng = số hạng thứ nhất + ${d}.`],
            loiGiai: [`Số tròn chục: ${t * 10}. Liền sau của ${s}: ${s + 1}.`, `Số hạng thứ nhất: ${t * 10} + ${s + 1} = ${sh1}.`, `Tổng: ${sh1} + ${d} = ${sh1 + d}.`],
            saiThuong: { [sh1]: 'Đó là số hạng thứ nhất. Tổng còn hơn nó ' + d + ' đơn vị nữa.', [sh1 - d]: 'Tổng hơn số hạng thứ nhất, vậy phải cộng thêm.' }
          });
        },
        () => {
          const d = n(11, 40), a = n(10, 50);
          return Q.so(`Trong một phép cộng, tổng hơn số hạng thứ nhất <b>${d}</b> đơn vị. Số hạng thứ hai là:`, d, {
            goiY: ['Tổng = số hạng thứ nhất + số hạng thứ hai.', `Phần tổng hơn số hạng thứ nhất chính là số hạng thứ hai.`],
            hinh: { kieu: 'thanh', hang: [{ nhan: 'Tổng', doan: [{ dai: a, chu: 'Số hạng thứ nhất' }, { dai: d, chu: '?', loai: 'nhan-manh' }] }], ghiChu: `Phần tô đậm chính là ${d} đơn vị.` },
            loiGiai: [`Số hạng thứ hai = tổng − số hạng thứ nhất = ${d}.`]
          });
        }
      ])()
    ]
  });
})();

/* Các đảo học kì 2: Nhân Chia (CĐ8), Số Đến 1000 (CĐ10), Đo Dài và Tiền (CĐ11), Cộng Trừ 1000 (CĐ12), Thống Kê (CĐ13). */
(function () {
  'use strict';
  const { n, c, tron, lap } = T;
  const VAT = [['🍎', 'quả táo'], ['🌼', 'bông hoa'], ['🐟', 'con cá'], ['🍬', 'cái kẹo'], ['⭐', 'ngôi sao']];

  /* ================= Phép nhân ================= */
  CT.them({
    id: 'phep-nhan', dao: 'nhan', ten: 'Phép nhân', bieu: '✖️',
    ghiNho: `<p><b>2 × 3 = 6</b> đọc là “hai nhân ba bằng sáu”. Nghĩa là <b>2 được lấy 3 lần</b>: 2 + 2 + 2 = 6.</p>
      <p>Trong 2 × 3 = 6: 2 và 3 là <b>thừa số</b>, 6 là <b>tích</b>. “2 × 3” cũng gọi là tích.</p>
      <p>3 nhóm, mỗi nhóm 2 quả → 2 × 3 (số trong mỗi nhóm × số nhóm).</p>`,
    cap: [
      () => {
        const [v, ten] = c(VAT), moi = c([2, 5, n(2, 5)]), nhom = n(2, 5);
        return c([
          () => Q.o(`Có ${nhom} nhóm, mỗi nhóm ${moi} ${ten}. Viết phép nhân:<div class="dong-tinh">[[0]] × [[1]] = [[2]]</div>`, [moi, nhom, moi * nhom], {
            hinh: { kieu: 'nhom', vat: v, soNhom: nhom, moi },
            goiY: [{ hoi: 'Mỗi nhóm có mấy?', dap: moi }, { hoi: 'Có mấy nhóm?', dap: nhom }, `${moi} được lấy ${nhom} lần.`],
            loiGiai: [`${lap(nhom, () => moi).join(' + ')} = ${moi * nhom}`, `${moi} × ${nhom} = ${moi * nhom}`]
          }),
          () => Q.o(`Chuyển tổng thành phép nhân:<div class="dong-tinh">${lap(nhom, () => moi).join(' + ')} = [[0]] × [[1]]</div>`, [moi, nhom], { goiY: ['Số nào được lấy mấy lần?'], loiGiai: [`${moi} được lấy ${nhom} lần: ${moi} × ${nhom}`] })
        ])();
      },
      () => {
        const a = c([2, 5]), b = n(2, 10), k = a * b;
        return c([
          () => { const hoi = c([['tích', k], ['thừa số thứ nhất', a], ['thừa số thứ hai', b]]); const ds = [hoi[1]].concat([a, b, k, a + b].filter((x, i, arr) => x !== hoi[1] && arr.indexOf(x) === i)).slice(0, 4); return Q.chon(`Trong phép nhân <b>${a} × ${b} = ${k}</b>, ${hoi[0]} là:`, ds.map(String), 0, { loiGiai: [`${a} và ${b} là thừa số, ${k} là tích.`] }); },
          () => Q.so(`Tích của <b>${a}</b> và <b>${b}</b> là:`, k, { goiY: ['Tích là kết quả phép nhân.'], loiGiai: [`${a} × ${b} = ${k}`], saiThuong: { [a + b]: 'Tích là phép nhân, không phải phép cộng.' } })
        ])();
      },
      () => {
        const a = c([2, 5]), b = n(2, 8);
        return c([
          () => { const lan = n(2, 6), v1 = a * b, v2 = a * lan, d = v1 < v2 ? '<' : v1 > v2 ? '>' : '='; return Q.tha(`Kéo dấu &lt;, &gt;, = vào ô trống:<div class="dong-tinh">${a} × ${b} {{0}} ${lap(lan, () => a).join(' + ')}</div>`, ['<', '>', '='], [d], { dungLai: true, goiY: [`${lap(lan, () => a).join(' + ')} = ${a} × ${lan}.`], loiGiai: [`${a} × ${b} = ${v1}; ${a} × ${lan} = ${v2} → ${v1} ${d} ${v2}`] }); },
          () => Q.so(`<div class="dong-tinh">${a} × ${b} + ${a} = ${a} × [[0]]</div>`, b + 1, { goiY: [`${a} × ${b} là ${a} được lấy ${b} lần. Thêm một ${a} nữa là lấy mấy lần?`], loiGiai: [`${a} × ${b} + ${a} = ${a} × ${b + 1} = ${a * (b + 1)}`] }),
          () => Q.so(`<div class="dong-tinh">${a} × ${b} − ${a} = ${a} × [[0]]</div>`, b - 1, { goiY: [`Bớt đi một ${a} thì còn lấy mấy lần?`], loiGiai: [`${a} × ${b} − ${a} = ${a} × ${b - 1} = ${a * (b - 1)}`] })
        ])();
      }
    ]
  });

  /* ================= Bảng nhân 2, bảng nhân 5 ================= */
  CT.them({
    id: 'bang-nhan', dao: 'nhan', ten: 'Bảng nhân 2 và 5', bieu: '🖐️',
    ghiNho: `<p><b>Bảng nhân 2</b>: đếm thêm 2 — 2, 4, 6, 8, 10, 12, 14, 16, 18, 20.</p>
      <p><b>Bảng nhân 5</b>: đếm thêm 5 — 5, 10, 15, 20, 25, 30, 35, 40, 45, 50.</p>
      <p>Đổi chỗ các thừa số thì tích không đổi: 2 × 5 = 5 × 2.</p>`,
    cap: [
      () => { const a = c([2, 5]), b = n(1, 10); return Q.so(`<div class="dong-tinh">${a} × ${b} = [[0]]</div>`, a * b, { goiY: [`Đếm thêm ${a}, ${b} lần.`], loiGiai: [`${a} × ${b} = ${a * b}`] }); },
      () => c([
        () => { const a = c([2, 5]), bs = tron(lap(10, i => i + 1)).slice(0, 4); return Q.o(`Điền kết quả bảng nhân ${a}:`, bs.map(b => a * b), { hinh: { kieu: 'bang', hang: [['Phép tính'].concat(bs.map(b => `${a} × ${b}`)), ['Kết quả'].concat(bs.map((_, i) => `[[${i}]]`))] }, loiGiai: bs.map(b => `${a} × ${b} = ${a * b}`) }); },
        () => { const a = c([2, 5]), d = n(1, 6); return Q.o(`Đếm thêm ${a}:<div class="dong-tinh">${a * d}, ${a * (d + 1)}, [[0]], [[1]], ${a * (d + 4)}</div>`, [a * (d + 2), a * (d + 3)], { loiGiai: [lap(5, i => a * (d + i)).join(', ')] }); }
      ])(),
      () => c([
        () => { const k = n(3, 9); return Q.giaiToan({ de: `Mỗi bàn tay có 5 ngón tay. Hỏi ${k} bàn tay có bao nhiêu ngón tay?`, hinh: { kieu: 'vat', vat: '🖐️', so: k }, phep: [{ hoi: `số ngón tay của ${k} bàn tay`, a: 5, dau: '×', b: k, kq: 5 * k }], donVi: 'ngón tay', goiYPhep: ['5 được lấy ' + k + ' lần → phép nhân.'] }); },
        () => { const k = n(3, 10); return Q.giaiToan({ de: `Mỗi con gà có 2 chân. Hỏi ${k} con gà có bao nhiêu chân?`, phep: [{ hoi: `số chân của ${k} con gà`, a: 2, dau: '×', b: k, kq: 2 * k }], donVi: 'chân' }); },
        () => { const k = n(2, 8), them = n(1, 9); return Q.so(`Mỗi hộp có 5 cái bút. Mẹ mua ${k} hộp bút và ${them} cái bút lẻ. Hỏi mẹ mua tất cả bao nhiêu cái bút?`, 5 * k + them, { donVi: 'cái bút', goiY: [{ hoi: `${k} hộp có bao nhiêu bút? 5 × ${k} = ?`, dap: 5 * k }, `Cộng thêm ${them} bút lẻ.`], loiGiai: [`5 × ${k} = ${5 * k}`, `${5 * k} + ${them} = ${5 * k + them} (cái bút)`] }); }
      ])()
    ]
  });

  /* ================= Phép chia ================= */
  CT.them({
    id: 'phep-chia', dao: 'nhan', ten: 'Phép chia', bieu: '➗',
    ghiNho: `<p>Chia đều 10 quả vào 2 đĩa, mỗi đĩa được 5 quả: <b>10 : 2 = 5</b>.</p>
      <p>Trong 10 : 2 = 5: 10 là <b>số bị chia</b>, 2 là <b>số chia</b>, 5 là <b>thương</b>.</p>
      <p>Từ phép nhân 2 × 5 = 10 ta có hai phép chia: 10 : 2 = 5 và 10 : 5 = 2.</p>`,
    cap: [
      () => {
        const dia = c([2, 2, 5, 3]), moi = n(2, dia === 5 ? 4 : 5), [v, ten] = c(VAT);
        return Object.assign(Q.so(`Chạm vào đĩa để chia đều <b>${dia * moi}</b> ${ten} vào <b>${dia}</b> đĩa. Mỗi đĩa có mấy ${ten}?`, moi, {
          goiY: ['Chia lần lượt: mỗi lần cho mỗi đĩa 1 cái, đến khi hết.'], loiGiai: [`${dia * moi} : ${dia} = ${moi}`]
        }), { loai: 'chiaDeu', tong: dia * moi, dia, vat: v });
      },
      () => {
        const a = c([2, 5]), b = n(1, 10), k = a * b;
        return c([
          () => Q.so(`<div class="dong-tinh">${k} : ${a} = [[0]]</div>`, b, { goiY: [`${a} nhân mấy thì bằng ${k}?`], loiGiai: [`Vì ${a} × ${b} = ${k} nên ${k} : ${a} = ${b}`] }),
          () => Q.o(`Từ phép nhân, viết hai phép chia:<div class="dong-tinh">${a} × ${b} = ${k}</div><div class="dong-tinh">${k} : ${a} = [[0]] &nbsp;&nbsp; ${k} : ${b} = [[1]]</div>`, [b, a], { loiGiai: [`${k} : ${a} = ${b}; ${k} : ${b} = ${a}`] }),
          () => { const hoi = c([['số bị chia', k], ['số chia', a], ['thương', b]]); const ds = [hoi[1]].concat([k, a, b].filter((x, i, arr) => x !== hoi[1] && arr.indexOf(x) === i)); if (ds.length < 2) ds.push(k + a); return Q.chon(`Trong phép chia <b>${k} : ${a} = ${b}</b>, ${hoi[0]} là:`, ds.map(String), 0, { loiGiai: [`${k} là số bị chia, ${a} là số chia, ${b} là thương.`] }); }
        ])();
      },
      () => {
        const chia = c([2, 5]), thuong = n(2, 9), tong = chia * thuong;
        if (Math.random() < 0.5) return Q.giaiToan({ de: `Có ${tong} quả cam chia đều vào ${chia} đĩa. Hỏi mỗi đĩa có mấy quả cam?`, phep: [{ hoi: 'số quả cam mỗi đĩa có', a: tong, dau: ':', b: chia, kq: thuong }], donVi: 'quả cam', goiYPhep: ['Chia đều thành các phần bằng nhau → phép chia.'] });
        return Q.giaiToan({ de: `Có ${tong} quả cam xếp vào các đĩa, mỗi đĩa ${chia} quả. Hỏi xếp được mấy đĩa?`, phep: [{ hoi: 'số đĩa xếp được', a: tong, dau: ':', b: chia, kq: thuong }], donVi: 'đĩa', goiYPhep: [`Mỗi đĩa ${chia} quả: cứ ${chia} quả lại thành 1 đĩa → phép chia.`] });
      }
    ]
  });

  /* ================= Trăm, chục, đơn vị ================= */
  CT.them({
    id: 'tram-chuc', dao: 'so1000', ten: 'Trăm, chục, đơn vị', bieu: '🟦',
    ghiNho: `<p><b>10 đơn vị = 1 chục; 10 chục = 1 trăm; 10 trăm = 1 nghìn.</b></p>
      <p>Số có ba chữ số: hàng trăm – hàng chục – hàng đơn vị. Ví dụ 352 gồm 3 trăm, 5 chục, 2 đơn vị.</p>
      <p>Viết thành tổng: 352 = 300 + 50 + 2. Số 405 đọc là “bốn trăm linh năm”.</p>`,
    cap: [
      () => {
        const tr = n(1, 9), ch = n(0, 9), dv = n(0, 9), so = tr * 100 + ch * 10 + dv;
        return c([
          () => { const t2 = n(1, 5), so2 = t2 * 100 + ch * 10 + dv; return Q.so('Hình dưới đây biểu diễn số nào?', so2, { hinh: { kieu: 'khoi', tram: t2, chuc: ch, dv }, goiY: ['Mỗi tấm vuông lớn là 1 trăm, mỗi thanh là 1 chục, mỗi khối nhỏ là 1 đơn vị.', { hoi: 'Có mấy tấm trăm?', dap: t2 }, { hoi: 'Có mấy thanh chục?', dap: ch }], loiGiai: [`${t2} trăm, ${ch} chục, ${dv} đơn vị: ${so2}`] }); },
          () => Q.so(`Số gồm <b>${tr} trăm, ${ch} chục và ${dv} đơn vị</b> là:`, so, { loiGiai: [`${so}`], saiThuong: ch === 0 ? { [tr * 10 + dv]: 'Hàng chục là 0 thì vẫn phải viết chữ số 0.' } : {} }),
          () => Q.o(`Số <b>${so}</b> gồm [[0]] trăm, [[1]] chục và [[2]] đơn vị.`, [tr, ch, dv], { loiGiai: [`${so}: ${tr} trăm, ${ch} chục, ${dv} đơn vị.`] })
        ])();
      },
      () => {
        const so = n(101, 999);
        return c([
          () => { const sai = new Set(); [so + 1, so + 10, Number(String(so).split('').reverse().join('')), so - 10].forEach(x => { if (x > 100 && x < 1000 && x !== so) sai.add(x); }); return Q.chon(`Số <b>${so}</b> đọc là:`, [so].concat([...sai].slice(0, 3)).map(T.soChu), 0, { loiGiai: [`${so}: ${T.soChu(so)}.`] }); },
          () => { const tr = Math.floor(so / 100), ch = Math.floor(so / 10) % 10, dv = so % 10; return Q.o(`Viết số thành tổng các trăm, chục, đơn vị:<div class="dong-tinh">${so} = [[0]] + [[1]] + [[2]]</div>`, [tr * 100, ch * 10, dv], { goiY: [`${so} gồm ${tr} trăm, ${ch} chục, ${dv} đơn vị.`], loiGiai: [`${so} = ${tr * 100} + ${ch * 10} + ${dv}`] }); },
          () => Q.so(`Số “<b>${T.soChu(so)}</b>” viết là:`, so, { loiGiai: [`${so}`] })
        ])();
      },
      () => c([
        () => { const tr = n(1, 8), le = n(11, 19); return Q.so(`Số gồm ${tr} trăm và ${le} đơn vị là:`, tr * 100 + le, { goiY: [`${le} đơn vị = 1 chục và ${le - 10} đơn vị.`], loiGiai: [`${tr * 100} + ${le} = ${tr * 100 + le}`], saiThuong: { [tr * 1000 + le]: 'Số có ba chữ số thôi con.' } }); },
        () => { const k = c([['1 trăm = [[0]] chục', [10]], ['1 nghìn = [[0]] trăm', [10]], ['1 trăm = [[0]] đơn vị', [100]], ['5 trăm = [[0]] chục', [50]], ['30 chục = [[0]] trăm', [3]]]); return Q.o(`<div class="dong-tinh">${k[0]}</div>`, k[1], { goiY: ['10 đơn vị = 1 chục; 10 chục = 1 trăm; 10 trăm = 1 nghìn.'], loiGiai: [k[0].replace('[[0]]', k[1][0])] }); },
        () => { const tr = n(2, 9), ch = n(1, 9); return Q.so(`Số có ba chữ số, chữ số hàng trăm là ${tr}, chữ số hàng chục là ${ch}, chữ số hàng đơn vị là số liền trước của chữ số hàng chục. Số đó là:`, tr * 100 + ch * 10 + ch - 1, { goiY: [{ hoi: `Số liền trước của ${ch} là?`, dap: ch - 1 }], loiGiai: [`${tr * 100 + ch * 10 + ch - 1}`] }); }
      ])()
    ]
  });

  /* ================= So sánh số có ba chữ số ================= */
  CT.them({
    id: 'so-sanh-1000', dao: 'so1000', ten: 'So sánh số có ba chữ số', bieu: '🏔️',
    ghiNho: `<p>So sánh <b>hàng trăm</b> trước; bằng nhau thì so sánh <b>hàng chục</b>; bằng nhau nữa thì so sánh <b>hàng đơn vị</b>.</p>
      <p>Số bé nhất có ba chữ số: 100. Số lớn nhất có ba chữ số: 999.<br>Số bé nhất có ba chữ số khác nhau: 102. Số lớn nhất có ba chữ số khác nhau: 987.</p>`,
    cap: [
      () => {
        const cap = lap(3, () => { const a = n(100, 999); const b = c([a, a + c([1, 10, 100, -1, -10]), n(100, 999)]); return [a, Math.min(999, Math.max(100, b))]; });
        const d = p => p[0] < p[1] ? '<' : p[0] > p[1] ? '>' : '=';
        return Q.tha('Kéo dấu &lt;, &gt;, = vào ô trống:<div class="cot-ss">' + cap.map((p, i) => `<div>${p[0]} {{${i}}} ${p[1]}</div>`).join('') + '</div>', ['<', '>', '='], cap.map(d), { dungLai: true, goiY: ['So sánh hàng trăm trước.'], loiGiai: cap.map(p => `${p[0]} ${d(p)} ${p[1]}`) });
      },
      () => {
        if (Math.random() < 0.5) { const s = new Set(); const tr = n(1, 9); while (s.size < 4) s.add(Math.random() < 0.6 ? tr * 100 + n(0, 99) : n(100, 999)); const ds = [...s], tang = Math.random() < 0.5; const kq = ds.slice().sort((a, b) => tang ? a - b : b - a); return Q.sapXep(`Xếp theo thứ tự từ <b>${tang ? 'bé đến lớn' : 'lớn đến bé'}</b>:`, ds, kq, { loiGiai: [kq.join(tang ? ' < ' : ' > ')] }); }
        const x = n(101, 989), tc = Math.random() < 0.5;
        const kq = tc ? (Math.floor(x / 10) + 1) * 10 : (Math.floor(x / 100) + 1) * 100;
        return Q.so(`Số tròn ${tc ? 'chục' : 'trăm'} liền sau của <b>${x}</b> là:`, kq, { goiY: [tc ? 'Số tròn chục có chữ số hàng đơn vị là 0.' : 'Số tròn trăm có hai chữ số cuối là 00.'], loiGiai: [`${kq}`] });
      },
      () => c([
        () => { const k = c([['Số lớn nhất có ba chữ số khác nhau', 987], ['Số bé nhất có ba chữ số khác nhau', 102], ['Số bé nhất có ba chữ số', 100], ['Số lớn nhất có ba chữ số', 999], ['Số tròn trăm lớn nhất có ba chữ số', 900], ['Số lớn nhất có ba chữ số giống nhau', 999], ['Số bé nhất có ba chữ số giống nhau', 111]]); return Q.so(`${k[0]} là:`, k[1], { goiY: [k[0].includes('khác nhau') ? 'Ba chữ số phải khác nhau. Chọn chữ số phù hợp cho từng hàng, bắt đầu từ hàng trăm.' : 'Nghĩ từng hàng một, bắt đầu từ hàng trăm.'], loiGiai: [`${k[0]}: ${k[1]}.`] }); },
        () => {
          let ds; do { ds = [n(0, 9), n(1, 9), n(1, 9)]; } while (new Set(ds).size < 3);
          const lon = Math.random() < 0.5, sx = ds.slice().sort((a, b) => b - a);
          let kq; if (lon) kq = sx[0] * 100 + sx[1] * 10 + sx[2]; else { const t = ds.filter(x => x > 0).sort((a, b) => a - b)[0]; const con = ds.filter(x => x !== t).sort((a, b) => a - b); kq = t * 100 + con[0] * 10 + con[1]; }
          return Q.so(`Từ ba chữ số <b>${ds.join(', ')}</b>, lập số <b>${lon ? 'lớn nhất' : 'bé nhất'}</b> có ba chữ số khác nhau.`, kq, { goiY: [lon ? 'Chữ số lớn nhất đặt ở hàng trăm.' : 'Chữ số bé nhất (khác 0) đặt ở hàng trăm.'], loiGiai: [`${kq}`] });
        },
        () => { const a = n(1, 8) * 100, b = a + n(2, 9) * 100; return Q.so(`Từ ${a} đến ${b} có bao nhiêu số tròn trăm?`, (b - a) / 100 + 1, { goiY: ['Viết ra: ' + a + ', ' + (a + 100) + ', … rồi đếm.', 'Nhớ đếm cả số đầu và số cuối.'], loiGiai: [lap((b - a) / 100 + 1, i => a + i * 100).join(', '), `Có ${(b - a) / 100 + 1} số.`] }); }
      ])()
    ]
  });

  /* ================= Đơn vị đo độ dài ================= */
  const VAT_DO = [['Cái bút chì dài khoảng 15', 'cm'], ['Gang tay của em dài khoảng 1', 'dm'], ['Cửa ra vào cao khoảng 2', 'm'], ['Quãng đường từ nhà ông bà đến thành phố dài khoảng 20', 'km'], ['Chiếc tẩy dài khoảng 3', 'cm'], ['Cây cột điện cao khoảng 8', 'm'], ['Bàn học dài khoảng 12', 'dm']];
  CT.them({
    id: 'don-vi-do-dai', dao: 'dodai', ten: 'Xăng-ti-mét, đề-xi-mét, mét, ki-lô-mét', bieu: '📏',
    ghiNho: `<p><b>1 dm = 10 cm</b>; <b>1 m = 10 dm = 100 cm</b>; <b>1 km = 1 000 m</b>.</p>
      <p>Đồ vật nhỏ đo bằng cm; lớp học, cây cối đo bằng m; quãng đường dài đo bằng km.</p>
      <p>Đổi trước rồi mới so sánh: 4 dm = 40 cm, nên 4 dm &gt; 38 cm.</p>`,
    cap: [
      () => c([
        () => { const v = c(VAT_DO); return Q.chon(`${v[0]} …`, ['cm', 'dm', 'm', 'km'], ['cm', 'dm', 'm', 'km'].indexOf(v[1]), { giuThuTu: true, cot: 4, goiY: ['Tưởng tượng độ dài thật của đồ vật đó.'], loiGiai: [`${v[0]} ${v[1]}.`] }); },
        () => { const k = c([['1 dm = [[0]] cm', 10], ['1 m = [[0]] dm', 10], ['1 m = [[0]] cm', 100], ['1 km = [[0]] m', 1000]]); return Q.so(`<div class="dong-tinh">${k[0]}</div>`, k[1], { loiGiai: [k[0].replace('[[0]]', k[1])] }); },
        () => { const a = n(5, 60), b = n(3, 39), dv = c(['cm', 'dm', 'm', 'km']); return Q.so(`<div class="dong-tinh">${a} ${dv} + ${b} ${dv} = [[0]] ${dv}</div>`, a + b, { loiGiai: [`${a} + ${b} = ${a + b}`] }); }
      ])(),
      () => c([
        () => { const k = n(2, 9), loai = c([['dm', 'cm', 10], ['m', 'dm', 10], ['m', 'cm', 100]]); return Q.so(`<div class="dong-tinh">${k} ${loai[0]} = [[0]] ${loai[1]}</div>`, k * loai[2], { goiY: [`1 ${loai[0]} = ${loai[2]} ${loai[1]}.`], loiGiai: [`${k} ${loai[0]} = ${k * loai[2]} ${loai[1]}`] }); },
        () => { const cap = lap(3, () => { const dm = n(2, 9), cm = c([dm * 10, dm * 10 + n(1, 9), dm * 10 - n(1, 9)]); return [dm, cm]; }); const d = p => p[0] * 10 < p[1] ? '<' : p[0] * 10 > p[1] ? '>' : '='; return Q.tha('Kéo dấu &lt;, &gt;, = vào ô trống:<div class="cot-ss">' + cap.map((p, i) => `<div>${p[0]} dm {{${i}}} ${p[1]} cm</div>`).join('') + '</div>', ['<', '>', '='], cap.map(d), { dungLai: true, goiY: ['Đổi dm ra cm trước: 1 dm = 10 cm.'], loiGiai: cap.map(p => `${p[0]} dm = ${p[0] * 10} cm ${d(p)} ${p[1]} cm`) }); }
      ])(),
      () => c([
        () => { const dm = n(1, 9), cm = n(1, 9); return Q.so(`<div class="dong-tinh">${dm} dm ${cm} cm = [[0]] cm</div>`, dm * 10 + cm, { goiY: [{ hoi: `${dm} dm = ? cm`, dap: dm * 10 }], loiGiai: [`${dm * 10} + ${cm} = ${dm * 10 + cm} (cm)`] }); },
        () => { const a = n(25, 60), b = n(10, a - 5); return Q.giaiToan({ de: `Một thanh gỗ dài ${a} cm, người ta muốn làm một cái kệ dài ${b} cm. Hỏi người ta phải cắt bớt đi bao nhiêu xăng-ti-mét của thanh gỗ để được cái kệ?`, phep: [{ hoi: 'độ dài phải cắt bớt', a, dau: '−', b, kq: a - b }], donVi: 'cm' }); },
        () => { const ng = n(2, 8) * 10; return Q.so(`Đoạn thẳng AB dài 1 m. Đoạn thẳng CD ngắn hơn AB ${ng} cm. Đoạn thẳng CD dài bao nhiêu xăng-ti-mét?`, 100 - ng, { donVi: 'cm', goiY: [{ hoi: '1 m = ? cm', dap: 100 }, `Ngắn hơn → làm phép trừ.`], loiGiai: ['1 m = 100 cm', `100 − ${ng} = ${100 - ng} (cm)`], saiThuong: { [1 - ng]: 'Đổi 1 m ra cm trước nhé.' } }); }
      ])()
    ]
  });

  /* ================= Tiền Việt Nam ================= */
  const MENH = [100, 200, 500, 1000];
  CT.them({
    id: 'tien', dao: 'dodai', ten: 'Tiền Việt Nam', bieu: '💵',
    ghiNho: `<p>Đơn vị tiền Việt Nam là <b>đồng</b>. Một số tờ tiền: 100 đồng, 200 đồng, 500 đồng, 1 000 đồng.</p>
      <p>Ví dụ: 1 tờ 500 đồng và 2 tờ 200 đồng là 500 + 200 + 200 = 900 đồng.</p>
      <p>Tiền trả lại = tiền đưa − tiền hàng.</p>`,
    cap: [
      () => { let to; do { to = lap(n(2, 3), () => c(MENH)); } while (T.tong(to) > 1000); return Q.so('Có tất cả bao nhiêu đồng?', T.tong(to), { donVi: 'đồng', hinh: { kieu: 'tien', to }, goiY: ['Cộng giá trị các tờ tiền lại.'], loiGiai: [`${to.join(' + ')} = ${T.tong(to)} (đồng)`] }); },
      () => {
        const dich = c([300, 400, 600, 700, 800, 900]);
        const to = [100, 200, 200, 500, 100, 500];
        const mau = []; let con = dich; [500, 500, 200, 200, 100, 100].forEach(m => { if (m <= con) { mau.push(m); con -= m; } });
        return Q.nhieu(`Chọn các tờ tiền để trả vừa đúng <b>${dich} đồng</b>:`, to.map((m, i) => ({ nhan: HV.toTien(m), gt: m, k: i })), [], {
          kiem: 'tong', dich, luoi: 3, goiY: ['Bắt đầu với tờ có giá trị lớn nhất mà không vượt quá số tiền cần trả.', 'Chọn xong con cộng lại thử.'],
          loiGiai: [`Ví dụ: ${mau.join(' + ')} = ${dich} (đồng). Có thể có cách chọn khác cũng đúng.`]
        });
      },
      () => {
        const a = c([200, 300, 500]), b = c([100, 200, 300]), dua = 1000;
        if (a + b >= dua) return Q.so(`Mai mua một cái bút giá ${a} đồng. Mai đưa cô bán hàng tờ 1 000 đồng. Hỏi cô bán hàng phải trả lại Mai bao nhiêu tiền?`, dua - a, { donVi: 'đồng', loiGiai: [`1 000 − ${a} = ${dua - a} (đồng)`] });
        return Q.giaiToan({ de: `Mai mua một cái bút giá ${a} đồng và một quyển vở giá ${b} đồng. Mai đưa cô bán hàng tờ 1 000 đồng. Hỏi cô bán hàng phải trả lại Mai bao nhiêu tiền?`, phep: [{ hoi: 'số tiền Mai phải trả', a, dau: '+', b, kq: a + b }, { hoi: 'số tiền cô trả lại Mai', a: dua, dau: '−', b: a + b, kq: dua - a - b }], donVi: 'đồng', goiY: ['Tính số tiền phải trả trước.'] });
      }
    ]
  });

  /* ================= Cộng, trừ trong phạm vi 1000 ================= */
  function capTron(cong) { const a = n(1, 8) * 100, b = n(1, cong ? 9 - a / 100 : a / 100) * 100; return cong ? [a, b] : [Math.max(a, b), Math.min(a, b)]; }
  function cap3(cong, nho) {
    for (; ;) {
      const a = n(110, 899), b = n(10, cong ? 999 - a : a - 1);
      const dv = cong ? a % 10 + b % 10 >= 10 : a % 10 < b % 10;
      const ch = cong ? Math.floor(a / 10) % 10 + Math.floor(b / 10) % 10 + (dv ? 1 : 0) >= 10 : (Math.floor(a / 10) % 10) - (dv ? 1 : 0) < Math.floor(b / 10) % 10;
      if (ch) continue;                // lớp 2 chỉ nhớ một lần (hàng đơn vị sang hàng chục)
      if (nho !== dv) continue;
      if (cong && a + b > 999) continue;
      return [a, b];
    }
  }
  function tinh1000(cong) {
    return [
      () => { const [a, b] = capTron(cong); return Q.so(`<div class="dong-tinh">${a} ${cong ? '+' : '−'} ${b} = [[0]]</div>`, cong ? a + b : a - b, { goiY: [`${a / 100} trăm ${cong ? '+' : '−'} ${b / 100} trăm = ? trăm`], loiGiai: [`${a / 100} trăm ${cong ? '+' : '−'} ${b / 100} trăm = ${(cong ? a + b : a - b) / 100} trăm = ${cong ? a + b : a - b}`] }); },
      () => { const [a, b] = cap3(cong, false), kq = cong ? a + b : a - b; return Q.o('Đặt tính rồi tính:', String(kq).split('').map(Number), { hinh: CT.datTinh(a, b, cong ? '+' : '−', kq, true), goiY: ['Tính từ hàng đơn vị, đến hàng chục, rồi hàng trăm.'], loiGiai: [`${a} ${cong ? '+' : '−'} ${b} = ${kq}`] }); },
      () => {
        const [a, b] = cap3(cong, true), kq = cong ? a + b : a - b;
        if (Math.random() < 0.5) return Q.o('Đặt tính rồi tính (có nhớ):', String(kq).split('').map(Number), { hinh: CT.datTinh(a, b, cong ? '+' : '−', kq, true), goiY: [cong ? `Hàng đơn vị: ${a % 10} + ${b % 10} = ${a % 10 + b % 10}, viết ${(a % 10 + b % 10) % 10} nhớ 1.` : `Hàng đơn vị: ${a % 10} không trừ được ${b % 10}, lấy ${a % 10 + 10} − ${b % 10} = ${a % 10 + 10 - b % 10}, nhớ 1.`], loiGiai: [`${a} ${cong ? '+' : '−'} ${b} = ${kq}`] });
        return cong ? Q.giaiToan({ de: `Trường em có ${a} học sinh nam và ${b} học sinh nữ. Hỏi trường em có tất cả bao nhiêu học sinh?`, phep: [{ hoi: 'số học sinh của trường em', a, dau: '+', b, kq }], donVi: 'học sinh' })
          : Q.giaiToan({ de: `Một cửa hàng có ${a} kg gạo, đã bán ${b} kg gạo. Hỏi cửa hàng còn lại bao nhiêu ki-lô-gam gạo?`, phep: [{ hoi: 'số ki-lô-gam gạo còn lại', a, dau: '−', b, kq }], donVi: 'kg' });
      }
    ];
  }
  CT.them({ id: 'cong-1000', dao: 'cong1000', ten: 'Phép cộng trong phạm vi 1000', bieu: '➕', ghiNho: `<p>Đặt tính thẳng hàng: trăm dưới trăm, chục dưới chục, đơn vị dưới đơn vị.</p><p>Tính từ phải sang trái. Hàng nào cộng được 10 trở lên thì <b>viết chữ số hàng đơn vị, nhớ 1</b> sang hàng bên trái.</p><p>Cộng số tròn trăm: 300 + 400 = 3 trăm + 4 trăm = 7 trăm = 700.</p>`, cap: tinh1000(true) });
  CT.them({ id: 'tru-1000', dao: 'cong1000', ten: 'Phép trừ trong phạm vi 1000', bieu: '➖', ghiNho: `<p>Đặt tính thẳng hàng rồi trừ từ phải sang trái.</p><p>Hàng đơn vị không trừ được thì <b>mượn 1 chục</b> (thêm 10), rồi <b>nhớ 1</b> vào số trừ ở hàng chục.</p><p>Thử lại: hiệu + số trừ = số bị trừ.</p>`, cap: tinh1000(false) });

  /* ================= Biểu đồ tranh ================= */
  const LOAI_BD = [{ ten: ['Táo', 'Cam', 'Chuối', 'Lê'], bieu: ['🍎', '🍊', '🍌', '🍐'], de: 'Số quả mỗi loại trong giỏ', dv: 'quả' }, { ten: ['Thỏ', 'Gà', 'Vịt', 'Mèo'], bieu: ['🐰', '🐔', '🦆', '🐱'], de: 'Số con vật trong vườn', dv: 'con' }];
  CT.them({
    id: 'bieu-do-tranh', dao: 'thongke', ten: 'Biểu đồ tranh', bieu: '📊',
    ghiNho: `<p><b>Biểu đồ tranh</b> dùng hình vẽ để biểu diễn số lượng. Mỗi hình là 1 đơn vị.</p>
      <p>Đếm số hình ở mỗi hàng. Hàng dài nhất là nhiều nhất, hàng ngắn nhất là ít nhất.</p>`,
    cap: [
      () => { const L = c(LOAI_BD), so = lap(4, () => n(2, 8)), i = n(0, 3); return Q.so(`Có bao nhiêu ${L.dv} ${L.ten[i].toLowerCase()}?`, so[i], { hinh: { kieu: 'bieuDo', hang: L.ten.map((t, k) => ({ ten: t, bieu: L.bieu[k], so: so[k] })), chuThich: L.de + ' (mỗi hình là 1 ' + L.dv + ')' }, loiGiai: [`Hàng ${L.ten[i]} có ${so[i]} hình.`] }); },
      () => {
        const L = c(LOAI_BD); let so; do { so = lap(4, () => n(2, 9)); } while (new Set(so).size < 4);
        const hinh = { kieu: 'bieuDo', hang: L.ten.map((t, k) => ({ ten: t, bieu: L.bieu[k], so: so[k] })), chuThich: L.de };
        if (Math.random() < 0.5) { const nhieu = Math.random() < 0.5, kq = so.indexOf(nhieu ? Math.max(...so) : Math.min(...so)); return Q.chon(`Loại nào có <b>${nhieu ? 'nhiều' : 'ít'} nhất</b>?`, L.ten, kq, { giuThuTu: true, cot: 4, hinh, loiGiai: [`${L.ten[kq]}: ${so[kq]} ${L.dv}.`] }); }
        const [i, j] = tron([0, 1, 2, 3]).slice(0, 2), lon = so[i] > so[j] ? i : j, be = lon === i ? j : i;
        return Q.so(`${L.ten[lon]} nhiều hơn ${L.ten[be].toLowerCase()} bao nhiêu ${L.dv}?`, so[lon] - so[be], { hinh, goiY: [{ hoi: `Có mấy ${L.ten[lon].toLowerCase()}?`, dap: so[lon] }, { hoi: `Có mấy ${L.ten[be].toLowerCase()}?`, dap: so[be] }], loiGiai: [`${so[lon]} − ${so[be]} = ${so[lon] - so[be]}`] });
      },
      () => {
        const L = c(LOAI_BD), so = lap(4, () => n(2, 9)), hinh = { kieu: 'bieuDo', hang: L.ten.map((t, k) => ({ ten: t, bieu: L.bieu[k], so: so[k] })), chuThich: L.de };
        if (Math.random() < 0.5) return Q.so(`Có tất cả bao nhiêu ${L.dv}?`, T.tong(so), { hinh, goiY: ['Đếm từng hàng rồi cộng lại.'], loiGiai: [`${so.join(' + ')} = ${T.tong(so)}`] });
        const i = n(0, 3), them = n(2, 5);
        return Q.so(`Nếu có thêm ${them} ${L.dv} ${L.ten[i].toLowerCase()} nữa thì ${L.ten[i].toLowerCase()} có tất cả bao nhiêu ${L.dv}?`, so[i] + them, { hinh, goiY: [{ hoi: `Bây giờ có mấy ${L.ten[i].toLowerCase()}?`, dap: so[i] }], loiGiai: [`${so[i]} + ${them} = ${so[i] + them}`] });
      }
    ]
  });

  /* ================= Chắc chắn, có thể, không thể ================= */
  const KN = ['Chắc chắn', 'Có thể', 'Không thể'];
  CT.them({
    id: 'kha-nang', dao: 'thongke', ten: 'Chắc chắn, có thể, không thể', bieu: '🎲',
    ghiNho: `<p><b>Chắc chắn</b>: luôn luôn xảy ra. <b>Có thể</b>: lúc xảy ra, lúc không. <b>Không thể</b>: không bao giờ xảy ra.</p>
      <p>Hộp toàn bi đỏ: lấy 1 viên <b>chắc chắn</b> là bi đỏ, <b>không thể</b> là bi xanh.</p>
      <p><b>Nâng cao</b> – muốn <b>chắc chắn</b> lấy được bi xanh: nghĩ đến trường hợp <b>xui nhất</b> — lấy hết các bi màu khác trước, rồi thêm 1 viên.</p>`,
    cap: [
      () => {
        const loai = n(0, 2), soDo = n(3, 6), soXanh = loai === 0 ? 0 : n(2, 5);
        const bi = loai === 0 ? [['🔴', soDo]] : [['🔴', soDo], ['🔵', soXanh]];
        const hoiMau = loai === 2 ? c(['🔴', '🟡']) : '🔴';
        const kq = loai === 0 ? 0 : loai === 2 && hoiMau === '🟡' ? 2 : 1;
        return Q.chon(`Không nhìn, lấy 1 viên bi trong hộp. ${'Lấy được bi ' + (hoiMau === '🔴' ? 'đỏ' : 'vàng')} là:`, KN, kq, { giuThuTu: true, cot: 3, hinh: { kieu: 'hop', bi }, loiGiai: [kq === 0 ? 'Hộp toàn bi đỏ nên chắc chắn lấy được bi đỏ.' : kq === 1 ? 'Hộp có cả bi đỏ và bi xanh nên có thể lấy được bi đỏ.' : 'Hộp không có bi vàng nên không thể lấy được bi vàng.'] });
      },
      () => {
        const cau = c([['Ngày mai mặt trời mọc ở phía đông.', 0], ['Hôm nay trời có mưa.', 1], ['Con mèo biết bay lên trời.', 2], ['Gieo xúc xắc được mặt 7 chấm.', 2], ['Gieo xúc xắc được mặt 6 chấm.', 1], ['Sau thứ hai là thứ ba.', 0], ['Em được điểm 10 bài kiểm tra tới.', 1], ['Tháng 2 có 32 ngày.', 2]]);
        return Q.chon(`“${cau[0]}” — sự việc này:`, KN, cau[1], { giuThuTu: true, cot: 3, loiGiai: [`${KN[cau[1]]} xảy ra.`] });
      },
      () => {
        const soDo = n(2, 6), soXanh = n(2, 6), muon = c(['xanh', 'đỏ']);
        const kq = (muon === 'xanh' ? soDo : soXanh) + 1;
        return Q.so(`Hộp có ${soDo} bi đỏ và ${soXanh} bi xanh. Không nhìn vào hộp, phải lấy ít nhất bao nhiêu viên bi để <b>chắc chắn</b> có 1 viên bi ${muon}?`, kq, {
          donVi: 'viên bi', hinh: { kieu: 'hop', bi: [['🔴', soDo], ['🔵', soXanh]] },
          goiY: ['Nghĩ đến trường hợp xui nhất: lấy mãi mà chưa được màu mình cần.', { hoi: `Xui nhất là lấy hết bi ${muon === 'xanh' ? 'đỏ' : 'xanh'} trước. Có mấy viên như vậy?`, dap: muon === 'xanh' ? soDo : soXanh }, 'Lấy thêm 1 viên nữa thì chắc chắn được màu cần.'],
          loiGiai: [`Xui nhất: lấy hết ${muon === 'xanh' ? soDo + ' bi đỏ' : soXanh + ' bi xanh'} trước.`, `Lấy thêm 1 viên: ${kq - 1} + 1 = ${kq} (viên bi)`], saiThuong: { 1: 'Lấy 1 viên có thể được, nhưng chưa chắc chắn. Nghĩ trường hợp xui nhất.', [kq - 1]: 'Gần đúng! Lấy hết màu kia rồi, cần thêm 1 viên nữa.' }
        });
      }
    ]
  });
})();

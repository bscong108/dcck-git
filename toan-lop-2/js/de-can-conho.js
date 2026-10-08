/* Đảo Cân và Bình (Chủ đề 3: ki-lô-gam, lít) và Đảo Có Nhớ (Chủ đề 4: cộng, trừ có nhớ trong phạm vi 100). */
(function () {
  'use strict';
  const { n, c, tron, lap } = T;
  const VAT_CAN = [['🍉', 'quả dưa hấu'], ['🎃', 'quả bí'], ['🍍', 'quả dứa'], ['🐱', 'con mèo'], ['🎒', 'cái cặp']];
  const qc = so => { const ds = []; let r = so; [5, 2, 1].forEach(k => { while (r >= k) { ds.push(k + 'kg'); r -= k; } }); return ds; };

  /* ================= Ki-lô-gam ================= */
  CT.them({
    id: 'ki-lo-gam', dao: 'can', ten: 'Ki-lô-gam', bieu: '⚖️',
    ghiNho: `<p>Ki-lô-gam viết tắt là <b>kg</b>. Cân dùng để biết vật nặng bao nhiêu.</p>
      <p>Cân <b>thăng bằng</b>: hai đĩa nặng bằng nhau. Đĩa nào <b>thấp xuống</b> thì đĩa đó <b>nặng hơn</b>.</p>
      <p>Tính với số đo: 5 kg + 3 kg = 8 kg (nhớ viết kg ở kết quả).</p>`,
    cap: [
      () => {
        const [v, ten] = c(VAT_CAN), so = n(2, 9);
        return c([
          () => Q.so(`Cân thăng bằng. ${ten.charAt(0).toUpperCase() + ten.slice(1)} nặng mấy ki-lô-gam?`, so, { donVi: 'kg', hinh: { kieu: 'can', trai: [v], phai: qc(so) }, goiY: ['Cân thăng bằng nên vật nặng bằng tổng các quả cân.'], loiGiai: [`${qc(so).map(x => x.replace('kg', '')).join(' + ')} = ${so} (kg)`] }),
          () => { const a = n(2, 40), b = n(2, 40); return Q.so(`<div class="dong-tinh">${a} kg + ${b} kg = [[0]] kg</div>`, a + b, { loiGiai: [`${a} + ${b} = ${a + b}, viết ${a + b} kg`] }); },
          () => { const a = n(20, 60), b = n(2, a - 5); return Q.so(`<div class="dong-tinh">${a} kg − ${b} kg = [[0]] kg</div>`, a - b, { loiGiai: [`${a} − ${b} = ${a - b}, viết ${a - b} kg`] }); }
        ])();
      },
      () => c([
        () => {
          const [[v1, t1], [v2, t2]] = tron(VAT_CAN).slice(0, 2), trai = Math.random() < 0.5;
          return Q.chon(`Nhìn cân, vật nào <b>nặng hơn</b>?`, [`${v1} ${t1}`, `${v2} ${t2}`], trai ? 0 : 1, {
            giuThuTu: true, hinh: { kieu: 'can', trai: [v1], phai: [v2], nghieng: trai ? -1 : 1 },
            goiY: ['Đĩa nào thấp xuống thì vật trên đĩa đó nặng hơn.'], loiGiai: [`Đĩa ${trai ? 'bên trái' : 'bên phải'} thấp hơn, nên ${trai ? t1 : t2} nặng hơn.`]
          });
        },
        () => {
          const a = n(20, 60), d = n(3, 15), nang = Math.random() < 0.5, kq = nang ? a + d : a - d;
          return Q.giaiToan({ de: `Bao gạo nặng ${a} kg. Bao ngô ${nang ? 'nặng' : 'nhẹ'} hơn bao gạo ${d} kg. Hỏi bao ngô nặng bao nhiêu ki-lô-gam?`, phep: [{ hoi: 'bao ngô nặng', a, dau: nang ? '+' : '−', b: d, kq }], donVi: 'kg', goiYPhep: [nang ? 'Nặng hơn → nhiều ki-lô-gam hơn.' : 'Nhẹ hơn → ít ki-lô-gam hơn.'] });
        }
      ])(),
      () => c([
        () => {
          const [v, ten] = c(VAT_CAN), x = n(1, 6), bTrai = n(1, 3), phai = x + bTrai;
          return Q.so(`Cân thăng bằng. ${ten.charAt(0).toUpperCase() + ten.slice(1)} nặng mấy ki-lô-gam?`, x, {
            donVi: 'kg', hinh: { kieu: 'can', trai: [v].concat(qc(bTrai)), phai: qc(phai) },
            goiY: [{ hoi: 'Đĩa bên phải nặng tất cả bao nhiêu kg?', dap: phai }, `Đĩa trái có ${ten} và quả cân ${bTrai} kg.`, { hoi: `${phai} − ${bTrai} = ?`, dap: x }],
            loiGiai: [`Đĩa phải: ${phai} kg.`, `${ten.charAt(0).toUpperCase() + ten.slice(1)}: ${phai} − ${bTrai} = ${x} (kg)`], saiThuong: { [phai]: `Bên trái còn có quả cân ${bTrai} kg nữa đấy.` }
          });
        },
        () => {
          const [v, ten] = c(VAT_CAN.slice(0, 3)), x = n(1, 4);
          return Q.so(`Cân thăng bằng. Hai ${ten} nặng như nhau. Mỗi ${ten} nặng mấy ki-lô-gam?`, x, {
            donVi: 'kg', hinh: { kieu: 'can', trai: [v, v], phai: qc(2 * x) },
            goiY: [{ hoi: 'Đĩa phải nặng bao nhiêu kg?', dap: 2 * x }, `Số nào cộng với chính nó thì được ${2 * x}?`],
            loiGiai: [`${x} + ${x} = ${2 * x}`, `Mỗi ${ten} nặng ${x} kg.`]
          });
        },
        () => {
          const ten = tron(['túi gạo', 'túi đường', 'túi muối']);
          return Q.chon(`${ten[0].charAt(0).toUpperCase() + ten[0].slice(1)} nặng hơn ${ten[1]}. ${ten[1].charAt(0).toUpperCase() + ten[1].slice(1)} nặng hơn ${ten[2]}. Túi nào <b>nhẹ nhất</b>?`, ten.map(t => t.charAt(0).toUpperCase() + t.slice(1)), 2, {
            goiY: ['Xếp ba túi từ nặng đến nhẹ.', `${ten[0]} > ${ten[1]} > ${ten[2]}`], loiGiai: [`${ten[0]} nặng nhất, ${ten[2]} nhẹ nhất.`]
          });
        }
      ])()
    ]
  });

  /* ================= Lít ================= */
  CT.them({
    id: 'lit', dao: 'can', ten: 'Lít', bieu: '🫗',
    ghiNho: `<p>Lít viết tắt là <b>l</b>. Dùng để đo lượng nước, sữa, dầu… trong bình, can, xô.</p>
      <p>Tính với số đo: 4 l + 3 l = 7 l; 10 l − 6 l = 4 l.</p>`,
    cap: [
      () => c([
        () => { const max = c([5, 10]), l = n(1, max); return Q.so('Bình có bao nhiêu lít nước? (mỗi vạch là 1 lít)', l, { donVi: 'l', hinh: { kieu: 'binh', lit: l, max }, goiY: ['Đếm số vạch từ đáy bình lên mặt nước.'], loiGiai: [`Nước ngang vạch ${l}: ${l} l.`] }); },
        () => { const a = n(2, 30), b = n(2, 30); return Q.so(`<div class="dong-tinh">${a} l + ${b} l = [[0]] l</div>`, a + b, { loiGiai: [`${a} + ${b} = ${a + b}`] }); },
        () => { const k = n(2, 9); return Q.so(`Đổ ${k} ca nước, mỗi ca 1 lít, vào một cái xô (lúc đầu xô không có nước). Xô có bao nhiêu lít nước?`, k, { donVi: 'l', hinh: { kieu: 'vat', vat: '🥤', so: k }, loiGiai: [`${lap(k, () => 1).join(' + ')} = ${k} (l)`] }); }
      ])(),
      () => {
        const a = n(10, 40), b = n(2, a - 3), rot = Math.random() < 0.5;
        if (rot) return Q.giaiToan({ de: `Can có ${a} l dầu. Người ta rót ra ${b} l dầu. Hỏi trong can còn lại bao nhiêu lít dầu?`, phep: [{ hoi: 'số lít dầu còn lại trong can', a, dau: '−', b, kq: a - b }], donVi: 'l' });
        return Q.giaiToan({ de: `Thùng thứ nhất có ${a} l nước, thùng thứ hai có ${b} l nước. Hỏi cả hai thùng có bao nhiêu lít nước?`, phep: [{ hoi: 'số lít nước cả hai thùng có', a, dau: '+', b, kq: a + b }], donVi: 'l' });
      },
      () => {
        const a = n(15, 45), d = n(3, a - 5), be = a - d;
        return Q.giaiToan({
          de: `Can to có ${a} l nước. Can bé có ít hơn can to ${d} l nước. Hỏi cả hai can có bao nhiêu lít nước?`,
          hinh: { kieu: 'binh', ds: [{ lit: a, max: 50, nhan: 'Can to' }, { lit: be, max: 50, nhan: 'Can bé ?' }] },
          phep: [{ hoi: 'số lít nước can bé có', a, dau: '−', b: d, kq: be }, { hoi: 'số lít nước cả hai can có', a, dau: '+', b: be, kq: a + be }], donVi: 'l',
          goiY: ['Bài toán hai bước: tìm can bé trước, rồi mới tìm cả hai can.']
        });
      }
    ]
  });

  /* ================= Cộng có nhớ ================= */
  function congCoNho(hai) {
    let a, b;
    do { a = n(11, 89); b = hai ? n(11, 89) : n(2, 9); } while (a % 10 + b % 10 < 10 || a + b > 100);
    return [a, b];
  }
  function truCoNho(hai) {
    let a, b;
    do { a = n(20, 99); b = hai ? n(11, a - 1) : n(2, 9); } while (a % 10 >= b % 10 || a - b < 1);
    return [a, b];
  }
  function cotTinh(a, b, dau) {
    const kq = dau === '+' ? a + b : a - b;
    const dv = dau === '+' ? a % 10 + b % 10 : a % 10 + 10 - b % 10;
    const chA = Math.floor(a / 10), chB = Math.floor(b / 10);
    const goiY = dau === '+'
      ? [{ hoi: `Hàng đơn vị: ${a % 10} + ${b % 10} = ?`, dap: dv }, `Viết ${dv % 10}, nhớ 1 sang hàng chục.`, { hoi: `Hàng chục: ${chA} + ${chB} + 1 (nhớ) = ?`, dap: chA + chB + 1 }]
      : [`Hàng đơn vị: ${a % 10} không trừ được ${b % 10}, lấy ${a % 10 + 10} trừ ${b % 10}.`, { hoi: `${a % 10 + 10} − ${b % 10} = ?`, dap: dv }, `Viết ${dv}, nhớ 1 sang hàng chục.`, { hoi: `Hàng chục: ${chB} thêm 1 là ${chB + 1}; ${chA} − ${chB + 1} = ?`, dap: chA - chB - 1 }];
    const loiGiai = dau === '+'
      ? [`${a % 10} + ${b % 10} = ${dv}, viết ${dv % 10} nhớ 1.`, `${chA} + ${chB} = ${chA + chB}, thêm 1 bằng ${chA + chB + 1}, viết ${chA + chB + 1}.`, `${a} + ${b} = ${kq}`]
      : [`${a % 10 + 10} − ${b % 10} = ${dv}, viết ${dv} nhớ 1.`, chA - chB - 1 ? `${chB} thêm 1 bằng ${chB + 1}; ${chA} − ${chB + 1} = ${chA - chB - 1}, viết ${chA - chB - 1}.` : `${chB} thêm 1 bằng ${chB + 1}; ${chA} − ${chB + 1} = 0, không cần viết.`, `${a} − ${b} = ${kq}`];
    return { kq, goiY, loiGiai };
  }
  function datTinhCau(a, b, dau) {
    const r = cotTinh(a, b, dau), sk = String(r.kq).split('');
    return Q.o('Đặt tính rồi tính (điền chữ số vào kết quả):', sk.map(Number), { hinh: CT.datTinh(a, b, dau, r.kq, true), goiY: r.goiY, loiGiai: r.loiGiai });
  }
  function thieuChuSo(dau) {
    // a = x?  b = ?y ; một chữ số ẩn ở mỗi số, phép tính có nhớ, đáp án duy nhất
    for (; ;) {
      const [a, b] = dau === '+' ? congCoNho(true) : truCoNho(true);
      const kq = dau === '+' ? a + b : a - b;
      if (kq >= 100 || kq < 10) continue;
      const anA = Math.random() < 0.5 ? 0 : 1, anB = 1 - anA;
      const sa = String(a).split(''), sb = String(b).split('');
      // kiểm tra đáp án duy nhất
      let dem = 0;
      for (let x = 0; x <= 9; x++) for (let y = 0; y <= 9; y++) {
        const ta = sa.slice(), tb = sb.slice(); ta[anA] = String(x); tb[anB] = String(y);
        if (ta[0] === '0' || tb[0] === '0') continue;
        const A = Number(ta.join('')), B = Number(tb.join(''));
        if ((dau === '+' ? A + B : A - B) === kq) dem++;
      }
      if (dem !== 1) continue;
      const ha = sa.slice(), hb = sb.slice(); ha[anA] = '[[0]]'; hb[anB] = '[[1]]';
      return Q.o('Điền chữ số thích hợp vào ô trống:', [Number(sa[anA]), Number(sb[anB])], {
        hinh: { kieu: 'datTinh', dong: [ha, [dau].concat(hb)], kq: String(kq).split('') },
        goiY: ['Bắt đầu từ hàng đơn vị. Nhớ xem có “nhớ 1” sang hàng chục không.', dau === '+' ? 'Hàng đơn vị cộng lại có tận cùng là chữ số hàng đơn vị của kết quả.' : 'Thử từng chữ số rồi kiểm tra lại.'],
        loiGiai: [`${a} ${dau} ${b} = ${kq}`, 'Thử lại bằng cách tính lại cả phép tính.']
      });
    }
  }

  CT.them({
    id: 'cong-co-nho', dao: 'conho', ten: 'Cộng có nhớ', bieu: '➕',
    ghiNho: `<p>Đặt tính thẳng cột. Tính từ <b>phải sang trái</b>.</p>
      <p>Ví dụ 38 + 25: 8 + 5 = 13, viết 3 <b>nhớ 1</b>. 3 + 2 = 5, thêm 1 bằng 6, viết 6. Kết quả 63.</p>
      <p>Cộng nhẩm: 28 + 9 = 28 + 10 − 1 = 37.</p>`,
    cap: [
      () => { const [a, b] = congCoNho(false); return Math.random() < 0.5 ? datTinhCau(a, b, '+') : Q.so(`<div class="dong-tinh">${a} + ${b} = [[0]]</div>`, a + b, { goiY: cotTinh(a, b, '+').goiY, loiGiai: cotTinh(a, b, '+').loiGiai }); },
      () => { const [a, b] = congCoNho(true); return Math.random() < 0.6 ? datTinhCau(a, b, '+') : Q.so(`<div class="dong-tinh">${a} + ${b} = [[0]]</div>`, a + b, { goiY: cotTinh(a, b, '+').goiY, loiGiai: cotTinh(a, b, '+').loiGiai, saiThuong: { [a + b - 10]: 'Con quên nhớ 1 sang hàng chục rồi.' } }); },
      () => Math.random() < 0.6 ? thieuChuSo('+') : (() => {
        const [a, b] = congCoNho(true), t = a + b; let x; do { x = n(11, t - 11); } while (x === a || x === b);
        return Q.so(`<div class="dong-tinh">${x} + [[0]] = ${a} + ${b}</div>`, t - x, { goiY: [{ hoi: `${a} + ${b} = ?`, dap: t }, { hoi: `${t} − ${x} = ?`, dap: t - x }], loiGiai: [`${a} + ${b} = ${t}`, `${t} − ${x} = ${t - x}`] });
      })()
    ]
  });

  CT.them({
    id: 'tru-co-nho', dao: 'conho', ten: 'Trừ có nhớ', bieu: '➖',
    ghiNho: `<p>Ví dụ 62 − 35: 2 không trừ được 5, lấy 12 − 5 = 7, viết 7 <b>nhớ 1</b>. 3 thêm 1 bằng 4; 6 − 4 = 2, viết 2. Kết quả 27.</p>
      <p>Thử lại bằng phép cộng: 27 + 35 = 62 ✓.</p>`,
    cap: [
      () => { const [a, b] = truCoNho(false); return Math.random() < 0.5 ? datTinhCau(a, b, '−') : Q.so(`<div class="dong-tinh">${a} − ${b} = [[0]]</div>`, a - b, { goiY: cotTinh(a, b, '−').goiY, loiGiai: cotTinh(a, b, '−').loiGiai }); },
      () => { const [a, b] = truCoNho(true); return Math.random() < 0.6 ? datTinhCau(a, b, '−') : Q.so(`<div class="dong-tinh">${a} − ${b} = [[0]]</div>`, a - b, { goiY: cotTinh(a, b, '−').goiY, loiGiai: cotTinh(a, b, '−').loiGiai, saiThuong: { [a - b + 10]: 'Con quên nhớ 1 sang hàng chục của số trừ rồi.' } }); },
      () => Math.random() < 0.6 ? thieuChuSo('−') : (() => {
        const [a, b] = truCoNho(true), h = a - b;
        return Q.so(`<div class="dong-tinh">[[0]] − ${b} = ${h}</div>`, a, { goiY: ['Số bị trừ = hiệu + số trừ.', { hoi: `${h} + ${b} = ?`, dap: a }], loiGiai: [`${h} + ${b} = ${a}`] });
      })()
    ]
  });

  /* ================= Tính nhanh, tính nhẩm ================= */
  CT.them({
    id: 'tinh-nhanh', dao: 'conho', ten: 'Mẹo tính nhanh', bieu: '⚡',
    ghiNho: `<p><b>Cộng 9:</b> cộng 10 rồi bớt 1. 46 + 9 = 46 + 10 − 1 = 55.</p>
      <p><b>Trừ 9:</b> trừ 10 rồi thêm 1. 53 − 9 = 53 − 10 + 1 = 44.</p>
      <p><b>Ghép số tròn chục:</b> 17 + 25 + 3 = (17 + 3) + 25 = 20 + 25 = 45.</p>`,
    cap: [
      () => {
        const k = c([9, 8]), cong = Math.random() < 0.5, a = cong ? n(15, 90 - k) : n(20, 95);
        const kq = cong ? a + k : a - k, bu = 10 - k;
        return Q.so(`Tính nhẩm:<div class="dong-tinh">${a} ${cong ? '+' : '−'} ${k} = [[0]]</div>`, kq, {
          goiY: [cong ? `${cong ? 'Cộng' : 'Trừ'} 10 rồi ${cong ? 'bớt' : 'thêm'} ${bu}.` : `Trừ 10 rồi thêm ${bu}.`, { hoi: `${a} ${cong ? '+' : '−'} 10 = ?`, dap: cong ? a + 10 : a - 10 }],
          loiGiai: [`${a} ${cong ? '+' : '−'} ${k} = ${a} ${cong ? '+' : '−'} 10 ${cong ? '−' : '+'} ${bu} = ${kq}`]
        });
      },
      () => {
        let a, cc, b;
        do { a = n(11, 49); cc = (Math.ceil(a / 10) * 10 - a) || 10; b = n(11, 40); } while (a + cc + b > 100 || cc === 10);
        const ts = tron([a, b, cc]);
        return Q.so(`Tính nhanh:<div class="dong-tinh">${ts.join(' + ')} = [[0]]</div>`, a + b + cc, {
          goiY: ['Tìm hai số cộng lại được số tròn chục.', { hoi: `${a} + ${cc} = ?`, dap: a + cc }],
          loiGiai: [`${a} + ${cc} = ${a + cc}`, `${a + cc} + ${b} = ${a + b + cc}`]
        });
      },
      () => c([
        () => {
          const ds = [2, 4, 6, 8, 12, 14, 16, 18];
          return Q.so(`Tính nhanh:<div class="dong-tinh">${ds.join(' + ')} = [[0]]</div>`, 80, {
            goiY: ['Ghép số đầu với số cuối: 2 + 18 = 20.', { hoi: '4 + 16 = ?', dap: 20 }, { hoi: 'Có mấy cặp bằng 20?', dap: 4 }],
            loiGiai: ['(2 + 18) + (4 + 16) + (6 + 14) + (8 + 12)', '= 20 + 20 + 20 + 20 = 80']
          });
        },
        () => {
          const a = n(10, 20), b = a + 1, cc = a + 2, x = n(1, 5), y = x + 1, z = x + 2;
          const kq = a + b + cc - x - y - z;
          return Q.so(`Tính nhanh:<div class="dong-tinh">${a} + ${b} + ${cc} − ${x} − ${y} − ${z} = [[0]]</div>`, kq, {
            goiY: [`Ghép từng cặp: (${a} − ${x}) + (${b} − ${y}) + (${cc} − ${z}).`, { hoi: `${a} − ${x} = ?`, dap: a - x }],
            loiGiai: [`(${a} − ${x}) + (${b} − ${y}) + (${cc} − ${z})`, `= ${a - x} + ${b - y} + ${cc - z} = ${kq}`]
          });
        },
        () => {
          const ds = lap(9, i => i + 1);
          return Q.so(`Tính nhanh tổng các số từ 1 đến 9:<div class="dong-tinh">${ds.join(' + ')} = [[0]]</div>`, 45, {
            goiY: ['Ghép 1 + 9, 2 + 8, 3 + 7, 4 + 6 — mỗi cặp bằng 10.', 'Còn lại số 5 đứng một mình.'],
            loiGiai: ['(1 + 9) + (2 + 8) + (3 + 7) + (4 + 6) + 5', '= 10 + 10 + 10 + 10 + 5 = 45']
          });
        }
      ])()
    ]
  });

  /* ================= Giải toán trong phạm vi 100 ================= */
  CT.them({
    id: 'giai-toan-100', dao: 'conho', ten: 'Giải toán có lời văn', bieu: '📝',
    ghiNho: `<p><b>4 bước giải toán:</b></p>
      <p>1. Đọc kĩ đề: bài cho biết gì? hỏi gì?<br>2. Chọn phép tính: thêm/nhiều hơn → cộng; bớt/ít hơn/còn lại → trừ.<br>3. Viết câu lời giải và phép tính (ghi đơn vị trong ngoặc).<br>4. Viết đáp số.</p>`,
    cap: [
      () => {
        const them = Math.random() < 0.5;
        if (them) { const [a, b] = congCoNho(true); return Q.giaiToan({ de: `Lớp 2A có ${a} bạn, lớp 2B có ${b} bạn tham gia trồng cây. Hỏi cả hai lớp có bao nhiêu bạn tham gia trồng cây?`, phep: [{ hoi: 'số bạn cả hai lớp tham gia trồng cây', a, dau: '+', b, kq: a + b }], donVi: 'bạn' }); }
        const [a, b] = truCoNho(true);
        return Q.giaiToan({ de: `Một cửa hàng có ${a} quả bóng, đã bán ${b} quả bóng. Hỏi cửa hàng còn lại bao nhiêu quả bóng?`, phep: [{ hoi: 'số quả bóng cửa hàng còn lại', a, dau: '−', b, kq: a - b }], donVi: 'quả bóng' });
      },
      () => {
        const nhieu = Math.random() < 0.5;
        if (nhieu) { const [a, b] = congCoNho(true); return Q.giaiToan({ de: `Đàn gà có ${a} con. Đàn vịt nhiều hơn đàn gà ${b} con. Hỏi đàn vịt có bao nhiêu con?`, phep: [{ hoi: 'số con vịt', a, dau: '+', b, kq: a + b }], donVi: 'con' }); }
        const [a, b] = truCoNho(true);
        return Q.giaiToan({ de: `Sợi dây dài ${a} cm. Bố cắt đi ${b} cm để buộc hàng. Hỏi sợi dây còn lại dài bao nhiêu xăng-ti-mét?`, phep: [{ hoi: 'sợi dây còn lại dài', a, dau: '−', b, kq: a - b }], donVi: 'cm' });
      },
      () => {
        if (Math.random() < 0.5) {
          const x = n(15, 40), y = n(10, Math.max(11, 99 - x - 10)), tong = Math.min(99, x + y + n(10, 30));
          const z = tong - x - y;
          return Q.giaiToan({
            de: `Ba bạn hái được ${tong} bông hoa. Lan hái được ${x} bông, Huệ hái được ${y} bông, còn lại là của Cúc. Hỏi Cúc hái được bao nhiêu bông hoa?`,
            phep: [{ hoi: 'số bông hoa Lan và Huệ hái được', a: x, dau: '+', b: y, kq: x + y }, { hoi: 'số bông hoa Cúc hái được', a: tong, dau: '−', b: x + y, kq: z }],
            donVi: 'bông hoa', goiY: ['Tìm số hoa của Lan và Huệ trước.']
          });
        }
        let x, d;
        do { x = n(30, 60); d = n(5, x - 10); } while (x + (x - d) > 100 || (x % 10) >= (d % 10));
        return Q.giaiToan({
          de: `Thùng thứ nhất có ${x} l dầu. Thùng thứ hai có ít hơn thùng thứ nhất ${d} l dầu. Hỏi cả hai thùng có bao nhiêu lít dầu?`,
          phep: [{ hoi: 'số lít dầu thùng thứ hai có', a: x, dau: '−', b: d, kq: x - d }, { hoi: 'số lít dầu cả hai thùng có', a: x, dau: '+', b: x - d, kq: 2 * x - d }],
          donVi: 'l', goiY: ['Tìm thùng thứ hai trước.']
        });
      }
    ]
  });

  /* ================= Điền dấu + − và so sánh ================= */
  function dienDau(soSo) {
    for (; ;) {
      const ds = lap(soSo, () => n(2, 30)), dau = lap(soSo - 1, () => c(['+', '−']));
      let kq = ds[0], ok = true;
      dau.forEach((d, i) => { kq = d === '+' ? kq + ds[i + 1] : kq - ds[i + 1]; if (kq < 0 || kq > 100) ok = false; });
      if (!ok) continue;
      // đáp án duy nhất
      let dem = 0; const tat = soSo === 2 ? [['+'], ['−']] : [['+', '+'], ['+', '−'], ['−', '+'], ['−', '−']];
      tat.forEach(t => { let v = ds[0]; t.forEach((d, i) => { v = d === '+' ? v + ds[i + 1] : v - ds[i + 1]; }); if (v === kq) dem++; });
      if (dem !== 1) continue;
      const de = ds.map((x, i) => i < soSo - 1 ? `${x} {{${i}}}` : `${x}`).join(' ') + ` = ${kq}`;
      return Q.tha(`Kéo dấu + hoặc − vào ô trống cho đúng:<div class="dong-tinh">${de}</div>`, ['+', '−'], dau, { dungLai: true, goiY: ['Thử dấu + trước, tính xem có ra đúng kết quả không. Nếu không, đổi sang dấu −.'], loiGiai: [ds.map((x, i) => i < soSo - 1 ? `${x} ${dau[i]}` : `${x}`).join(' ') + ` = ${kq}`] });
    }
  }
  CT.them({
    id: 'dien-dau', dao: 'conho', ten: 'Điền dấu, so sánh', bieu: '🎯',
    ghiNho: `<p>Điền dấu + hay −: <b>thử</b> từng dấu, tính ra rồi so với kết quả.</p>
      <p>Kết quả lớn hơn số đầu thì thường có dấu +; nhỏ hơn thì thường có dấu −.</p>
      <p>So sánh hai phép tính: tính kết quả từng bên rồi mới so sánh.</p>`,
    cap: [() => dienDau(2), () => dienDau(3),
      () => {
        const cap = lap(3, () => { const [a, b] = congCoNho(true); const [x, y] = truCoNho(true); return [a, b, x, y]; });
        const d = p => (p[0] + p[1]) < (p[2] - p[3]) ? '<' : (p[0] + p[1]) > (p[2] - p[3]) ? '>' : '=';
        return Q.tha('Kéo dấu &lt;, &gt;, = vào ô trống:<div class="cot-ss">' + cap.map((p, i) => `<div>${p[0]} + ${p[1]} {{${i}}} ${p[2]} − ${p[3]}</div>`).join('') + '</div>',
          ['<', '>', '='], cap.map(d), { dungLai: true, goiY: ['Tính từng bên ra nháp rồi so sánh.'], loiGiai: cap.map(p => `${p[0] + p[1]} ${d(p)} ${p[2] - p[3]}`) });
      }]
  });
})();

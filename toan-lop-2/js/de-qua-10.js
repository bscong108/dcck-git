/* Đảo Qua Mười — Chủ đề 2: Phép cộng, phép trừ trong phạm vi 20; bài toán thêm, bớt; nhiều hơn, ít hơn;
   cùng các dạng nâng cao trên phiếu: tìm số ban đầu, thay đổi thành phần của phép tính. */
(function () {
  'use strict';
  const { n, c, tron, lap } = T;

  /* ================= 1. Cộng qua 10 ================= */
  const capCongQua10 = () => { const a = n(2, 9), b = n(11 - a, 9); return [a, b]; };
  CT.them({
    id: 'cong-qua-10', dao: 'qua10', ten: 'Cộng qua 10', bieu: '🔟',
    ghiNho: `<p><b>Tách để làm tròn 10:</b> 8 + 5 = 8 + 2 + 3 = 10 + 3 = 13.</p>
      <p>Thuộc các cặp cộng lại bằng 10: 1 + 9, 2 + 8, 3 + 7, 4 + 6, 5 + 5.</p>
      <p>Đổi chỗ các số hạng thì tổng không đổi: 5 + 8 = 8 + 5.</p>`,
    cap: [
      () => {
        const [a, b] = capCongQua10(), can = 10 - a, du = b - can;
        return c([
          () => Q.so(`<div class="dong-tinh">${a} + ${b} = [[0]]</div>`, a + b, {
            hinh: { kieu: 'khung10', a, b },
            goiY: [{ hoi: `${a} cần thêm mấy để được 10?`, dap: can }, { hoi: `Tách ${b} thành ${can} và mấy?`, dap: du }, { hoi: `10 + ${du} = ?`, dap: 10 + du }],
            loiGiai: [`${a} + ${b} = ${a} + ${can} + ${du} = 10 + ${du} = ${a + b}`]
          }),
          () => Q.o(`Tách số để tính:<div class="dong-tinh">${a} + ${b} = ${a} + [[0]] + [[1]] = [[2]]</div>`, [can, du, a + b], {
            goiY: [`${a} cộng mấy thì được 10?`], loiGiai: [`${a} + ${b} = ${a} + ${can} + ${du} = 10 + ${du} = ${a + b}`]
          })
        ])();
      },
      () => c([
        () => {
          const a = n(6, 9), bs = tron(lap(9, i => i + 1).filter(b => a + b > 10)).slice(0, 4);
          return Q.o(`Điền kết quả bảng cộng ${a}:`, bs.map(b => a + b), {
            hinh: { kieu: 'bang', hang: [['Phép tính'].concat(bs.map(b => `${a} + ${b}`)), ['Kết quả'].concat(bs.map((_, i) => `[[${i}]]`))] },
            goiY: [`${a} + ${10 - a} = 10, từ đó đếm thêm.`], loiGiai: bs.map(b => `${a} + ${b} = ${a + b}`)
          });
        },
        () => {
          const k = n(11, 16), ds = [];
          const dung = []; while (dung.length < 3) { const a = n(k - 9, 9), s = `${a} + ${k - a}`; if (!dung.includes(s)) dung.push(s); }
          const sai = []; while (sai.length < 3) { const [a, b] = capCongQua10(); const s = `${a} + ${b}`; if (a + b !== k && !sai.includes(s)) sai.push(s); }
          dung.concat(sai).forEach(x => ds.push(x));
          const ts = tron(ds);
          return Q.nhieu(`Chọn <b>tất cả</b> các phép tính có kết quả bằng <b>${k}</b>:`, ts, ts.map((x, i) => dung.includes(x) ? i : -1).filter(i => i >= 0), { luoi: 3, goiY: ['Tính từng phép rồi so với ' + k + '.'], loiGiai: dung.map(s => `${s} = ${k}`) });
        }
      ])(),
      () => c([
        () => {
          let a, b, t, x; do { [a, b] = capCongQua10(); t = a + b; x = n(t - 9, 9); } while (x === a || x === b || t - x < 2 || t - x > 9);
          return Q.so(`<div class="dong-tinh">${x} + [[0]] = ${a} + ${b}</div>`, t - x, { goiY: [{ hoi: `Vế phải: ${a} + ${b} = ?`, dap: t }, { hoi: `${x} + mấy = ${t}?`, dap: t - x }], loiGiai: [`${a} + ${b} = ${t}`, `${x} + ${t - x} = ${t}`] });
        },
        () => {
          const k = n(5, 9), s = 2 * k + 1;
          return Q.o(`Tìm hai số liên tiếp có tổng bằng <b>${s}</b>:<div class="dong-tinh">[[0]] + [[1]] = ${s}</div>`, [k, k + 1], {
            dapAnKhac: [[k + 1, k]], goiY: ['Hai số liên tiếp hơn kém nhau 1 đơn vị, ví dụ 6 và 7.', 'Hai số đó gần bằng nhau, mỗi số khoảng một nửa của ' + s + '.', { hoi: `Số bé là?`, dap: k }],
            loiGiai: [`${k} và ${k + 1} là hai số liên tiếp.`, `${k} + ${k + 1} = ${s}`]
          });
        },
        () => {
          const a = n(1, 9), cc = 10 - a, b = n(2, 9);
          const thu = tron([a, b, cc]);
          return Q.so(`Tính nhanh:<div class="dong-tinh">${thu.join(' + ')} = [[0]]</div>`, 10 + b, {
            goiY: ['Tìm hai số cộng lại bằng 10 rồi cộng trước.', { hoi: `${a} + ${cc} = ?`, dap: 10 }],
            loiGiai: [`${a} + ${cc} = 10`, `10 + ${b} = ${10 + b}`]
          });
        }
      ])()
    ]
  });

  /* ================= 2. Trừ qua 10 ================= */
  const capTruQua10 = () => { const a = n(11, 18), b = n(a - 9, 9); return [a, b]; };
  CT.them({
    id: 'tru-qua-10', dao: 'qua10', ten: 'Trừ qua 10', bieu: '➖',
    ghiNho: `<p><b>Cách 1 – tách số trừ:</b> 15 − 7: tách 7 = 5 + 2. 15 − 5 = 10, 10 − 2 = 8.</p>
      <p><b>Cách 2 – nghĩ phép cộng:</b> 7 + mấy = 15? Vì 7 + 8 = 15 nên 15 − 7 = 8.</p>`,
    cap: [
      () => {
        const [a, b] = capTruQua10(), le = a - 10, con = b - le;
        return c([
          () => Q.so(`<div class="dong-tinh">${a} − ${b} = [[0]]</div>`, a - b, {
            hinh: { kieu: 'khung10', a },
            goiY: [{ hoi: `${a} trừ mấy thì được 10?`, dap: le }, { hoi: `Tách ${b} thành ${le} và mấy?`, dap: con }, { hoi: `10 − ${con} = ?`, dap: 10 - con }],
            loiGiai: [`${a} − ${b} = ${a} − ${le} − ${con} = 10 − ${con} = ${a - b}`]
          }),
          () => Q.o(`Tách số để tính:<div class="dong-tinh">${a} − ${b} = ${a} − [[0]] − [[1]] = [[2]]</div>`, [le, con, a - b], { goiY: [`${a} trừ mấy được 10?`], loiGiai: [`${a} − ${le} = 10, 10 − ${con} = ${a - b}`] })
        ])();
      },
      () => c([
        () => {
          const ps = lap(3, capTruQua10);
          return Q.o('Điền số thích hợp vào ô trống:', ps.map(p => p[0] - p[1]), {
            hinh: { kieu: 'bang', hang: [['Số bị trừ'].concat(ps.map(p => p[0])), ['Số trừ'].concat(ps.map(p => p[1])), ['Hiệu', '[[0]]', '[[1]]', '[[2]]']] },
            goiY: ['Hiệu = số bị trừ − số trừ.'], loiGiai: ps.map(p => `${p[0]} − ${p[1]} = ${p[0] - p[1]}`)
          });
        },
        () => {
          const k = n(4, 8), dung = [], sai = [];
          while (dung.length < 3) { const a = n(Math.max(11, k + 1), Math.min(18, k + 9)), s = `${a} − ${a - k}`; if (a - k <= 9 && !dung.includes(s)) dung.push(s); }
          while (sai.length < 3) { const [a, b] = capTruQua10(); const s = `${a} − ${b}`; if (a - b !== k && !sai.includes(s)) sai.push(s); }
          const ts = tron(dung.concat(sai));
          return Q.nhieu(`Chọn <b>tất cả</b> các phép tính có kết quả bằng <b>${k}</b>:`, ts, ts.map((x, i) => dung.includes(x) ? i : -1).filter(i => i >= 0), { luoi: 3, loiGiai: dung.map(s => `${s} = ${k}`) });
        }
      ])(),
      () => c([
        () => {
          const cap = lap(3, () => { const [a, b] = capTruQua10(); const [x, y] = capTruQua10(); return [a, b, x, y]; });
          const d = p => (p[0] - p[1]) < (p[2] - p[3]) ? '<' : (p[0] - p[1]) > (p[2] - p[3]) ? '>' : '=';
          return Q.tha('Kéo dấu &lt;, &gt;, = vào ô trống:<div class="cot-ss">' + cap.map((p, i) => `<div>${p[0]} − ${p[1]} {{${i}}} ${p[2]} − ${p[3]}</div>`).join('') + '</div>',
            ['<', '>', '='], cap.map(d), { dungLai: true, goiY: ['Tính kết quả mỗi bên trước rồi so sánh.'], loiGiai: cap.map(p => `${p[0] - p[1]} ${d(p)} ${p[2] - p[3]}`) });
        },
        () => {
          const x = n(2, 7), y = n(2, 9 - x), v = x + y, a = n(Math.max(11, v + 2), Math.min(18, v + 9));
          return Q.so(`<div class="dong-tinh">${a} − [[0]] = ${x} + ${y}</div>`, a - v, { goiY: [{ hoi: `${x} + ${y} = ?`, dap: v }, { hoi: `${a} − mấy = ${v}?`, dap: a - v }], loiGiai: [`${x} + ${y} = ${v}`, `${a} − ${a - v} = ${v}`] });
        }
      ])()
    ]
  });

  /* ================= 3. Tìm số còn thiếu ================= */
  CT.them({
    id: 'tim-thanh-phan', dao: 'qua10', ten: 'Tìm số còn thiếu', bieu: '❓',
    ghiNho: `<p><b>? + 7 = 15</b> → số hạng = tổng − số hạng kia: 15 − 7 = 8.</p>
      <p><b>? − 6 = 9</b> → số bị trừ = hiệu + số trừ: 9 + 6 = 15.</p>
      <p><b>14 − ? = 5</b> → số trừ = số bị trừ − hiệu: 14 − 5 = 9.</p>
      <p>Làm xong con <b>thử lại</b>: điền số vừa tìm vào phép tính xem có đúng không.</p>`,
    cap: [
      () => {
        const [a, b] = capCongQua10(), t = a + b;
        return c([
          () => Q.so(`<div class="dong-tinh">[[0]] + ${b} = ${t}</div>`, a, { goiY: ['Số hạng chưa biết = tổng − số hạng kia.', { hoi: `${t} − ${b} = ?`, dap: a }], loiGiai: [`${t} − ${b} = ${a}`], saiThuong: { [t + b]: 'Muốn tìm số hạng, con lấy tổng trừ đi số hạng kia.' } }),
          () => Q.so(`<div class="dong-tinh">[[0]] − ${b} = ${a}</div>`, t, { goiY: ['Số bị trừ = hiệu + số trừ.', { hoi: `${a} + ${b} = ?`, dap: t }], loiGiai: [`${a} + ${b} = ${t}`], saiThuong: { [Math.abs(a - b)]: 'Muốn tìm số bị trừ, con lấy hiệu cộng với số trừ.' } }),
          () => Q.so(`<div class="dong-tinh">${t} − [[0]] = ${a}</div>`, b, { goiY: ['Số trừ = số bị trừ − hiệu.', { hoi: `${t} − ${a} = ?`, dap: b }], loiGiai: [`${t} − ${a} = ${b}`] })
        ])();
      },
      () => {
        const a = n(12, 60), b = n(11, 39), t = a + b;
        return c([
          () => Q.so(`<div class="dong-tinh">${a} + [[0]] = ${t}</div>`, b, { goiY: ['Số hạng chưa biết = tổng − số hạng kia.'], loiGiai: [`${t} − ${a} = ${b}`] }),
          () => Q.so(`<div class="dong-tinh">[[0]] − ${a} = ${b}</div>`, t, { goiY: ['Số bị trừ = hiệu + số trừ.'], loiGiai: [`${b} + ${a} = ${t}`] }),
          () => Q.so(`<div class="dong-tinh">${t} − [[0]] = ${b}</div>`, a, { goiY: ['Số trừ = số bị trừ − hiệu.'], loiGiai: [`${t} − ${b} = ${a}`] })
        ])();
      },
      () => {
        const x = n(10, 50), a = n(5, 30), b = n(3, x + a - 1), kq = x + a - b;
        return Q.so(`Tìm một số, biết rằng lấy số đó cộng với <b>${a}</b> rồi trừ đi <b>${b}</b> thì được <b>${kq}</b>.`, x, {
          hinh: { kieu: 'coMay', dau: '?', buoc: [`+ ${a}`, `− ${b}`], cuoi: kq },
          goiY: ['Đi ngược từ cuối: phép trừ đổi thành phép cộng, phép cộng đổi thành phép trừ.', { hoi: `Trước khi trừ ${b}, số đó là ${kq} + ${b} = ?`, dap: kq + b }, { hoi: `Trước khi cộng ${a}: ${kq + b} − ${a} = ?`, dap: x }],
          loiGiai: [`${kq} + ${b} = ${kq + b}`, `${kq + b} − ${a} = ${x}`, `Thử lại: ${x} + ${a} − ${b} = ${kq} ✓`]
        });
      }
    ]
  });

  /* ================= 4. Bài toán thêm, bớt ================= */
  const THEM = [
    { vat: 'con chim', bieu: '🐦', chu: (a, b) => `Trên cành có ${a} con chim, có thêm ${b} con chim bay đến. Hỏi trên cành có tất cả bao nhiêu con chim?`, hoi: 'số con chim trên cành có tất cả' },
    { vat: 'quả bóng', bieu: '🎈', chu: (a, b) => `Lan có ${a} quả bóng bay, mẹ mua thêm cho Lan ${b} quả. Hỏi Lan có tất cả bao nhiêu quả bóng bay?`, hoi: 'số quả bóng bay Lan có', dv: 'quả bóng bay' },
    { vat: 'viên bi', bieu: '🔵', chu: (a, b) => `Hùng và Dũng có ${a} viên bi. Nếu Hùng có thêm ${b} viên bi thì tổng số viên bi của hai bạn là bao nhiêu?`, hoi: 'tổng số viên bi của hai bạn', dv: 'viên bi' },
    { vat: 'quyển truyện', bieu: '📚', chu: (a, b) => `Giá sách có ${a} quyển truyện. Cô thư viện xếp thêm ${b} quyển truyện. Hỏi giá sách có bao nhiêu quyển truyện?`, hoi: 'số quyển truyện trên giá sách', dv: 'quyển truyện' }
  ];
  const BOT = [
    { vat: 'quả cam', bieu: '🍊', chu: (a, b) => `Mẹ có ${a} quả cam, mẹ biếu bà ${b} quả. Hỏi mẹ còn lại bao nhiêu quả cam?`, hoi: 'số quả cam mẹ còn lại', dv: 'quả cam' },
    { vat: 'con vịt', bieu: '🦆', chu: (a, b) => `Dưới ao có ${a} con vịt, có ${b} con vịt lên bờ. Hỏi dưới ao còn lại bao nhiêu con vịt?`, hoi: 'số con vịt dưới ao còn lại', dv: 'con vịt' },
    { vat: 'cái bánh', bieu: '🧁', chu: (a, b) => `Cửa hàng có ${a} cái bánh, đã bán ${b} cái bánh. Hỏi cửa hàng còn lại bao nhiêu cái bánh?`, hoi: 'số cái bánh cửa hàng còn lại', dv: 'cái bánh' },
    { vat: 'ô tô', bieu: '🚗', chu: (a, b) => `Bến xe có ${a} ô tô, có ${b} ô tô rời bến. Hỏi bến xe còn lại bao nhiêu ô tô?`, hoi: 'số ô tô còn lại ở bến', dv: 'ô tô' }
  ];
  function baiThemBot(lon) {
    const them = Math.random() < 0.5, ng = c(them ? THEM : BOT);
    let a, b;
    if (lon) { if (them) { a = n(20, 70); b = n(5, 99 - a); } else { a = n(30, 99); b = n(5, a - 10); } }
    else if (them) { const p = capCongQua10(); a = Math.max(p[0], p[1]); b = Math.min(p[0], p[1]); }
    else { [a, b] = capTruQua10(); }
    const kq = them ? a + b : a - b;
    return Q.giaiToan({
      de: ng.chu(a, b), phep: [{ hoi: ng.hoi, a, dau: them ? '+' : '−', b, kq }], donVi: ng.dv || ng.vat,
      goiYPhep: [them ? 'Có thêm vào thì nhiều lên hay ít đi?' : 'Bớt đi (cho, bán, rời đi) thì nhiều lên hay ít đi?']
    });
  }
  CT.them({
    id: 'them-bot', dao: 'qua10', ten: 'Bài toán thêm, bớt', bieu: '🛒',
    ghiNho: `<p><b>Cách trình bày bài giải</b> (như trong vở):</p>
      <div class="vo-mau"><b>Bài giải</b><br>Số viên bi của hai bạn là:<br>16 + 3 = 19 (viên bi)<br>Đáp số: 19 viên bi.</div>
      <p><b>Thêm</b> (cho thêm, mua thêm, bay đến) → phép cộng. <b>Bớt</b> (cho đi, bán đi, bay đi, ăn mất) → phép trừ.</p>
      <p>Câu lời giải lấy từ câu hỏi: “Hỏi … bao nhiêu …?” → “Số … là:”.</p>`,
    cap: [
      () => baiThemBot(false),
      () => baiThemBot(true),
      () => {
        const a = n(20, 60), b = n(5, a - 5), cc = n(5, 30), kq = a - b + cc;
        return Q.giaiToan({
          de: `Bến xe có ${a} ô tô. Có ${b} ô tô rời bến, sau đó có thêm ${cc} ô tô vào bến. Hỏi lúc này bến xe có bao nhiêu ô tô?`,
          phep: [{ hoi: `số ô tô còn lại sau khi ${b} ô tô rời bến`, a, dau: '−', b, kq: a - b }, { hoi: 'số ô tô lúc này ở bến', a: a - b, dau: '+', b: cc, kq }],
          donVi: 'ô tô', goiY: ['Bài này có hai việc xảy ra lần lượt. Tính việc thứ nhất trước.']
        });
      }
    ]
  });

  /* ================= 5. Nhiều hơn, ít hơn ================= */
  const NGUOI = [['An', 'Bình'], ['Lan', 'Mai'], ['Nam', 'Hà'], ['Hoa', 'Minh']];
  const DO = [['nhãn vở', '🏷️'], ['quả táo', '🍎'], ['cái kẹo', '🍬'], ['bông hoa', '🌸'], ['viên bi', '🔵']];
  CT.them({
    id: 'nhieu-hon-it-hon', dao: 'qua10', ten: 'Nhiều hơn, ít hơn', bieu: '📊',
    ghiNho: `<p>Tìm số <b>nhiều hơn</b> → làm phép cộng. Tìm số <b>ít hơn</b> → làm phép trừ.</p>
      <p><b>Cẩn thận đọc đề:</b> “Lan có 15 kẹo, Lan có nhiều hơn Mai 4 kẹo. Hỏi Mai có mấy kẹo?” → Mai có <b>ít hơn</b> Lan, nên làm 15 − 4 = 11.</p>
      <p>Vẽ sơ đồ đoạn thẳng: đoạn dài là người có nhiều hơn.</p>`,
    cap: [
      () => {
        const [A, B] = c(NGUOI), [vat] = c(DO), nhieu = Math.random() < 0.5;
        const a = n(8, 15), d = n(2, 6), kq = nhieu ? a + d : a - d;
        return Q.giaiToan({
          de: `${A} có ${a} ${vat}. ${B} có ${nhieu ? 'nhiều' : 'ít'} hơn ${A} ${d} ${vat}. Hỏi ${B} có bao nhiêu ${vat}?`,
          hinh: { kieu: 'thanh', hang: [{ nhan: A, doan: [{ dai: a, chu: a }] }, { nhan: B, doan: nhieu ? [{ dai: a, chu: '' }, { dai: d, chu: d, loai: 'nhan-manh' }] : [{ dai: a - d, chu: '?' }], sau: nhieu ? '' : `<span class="thieu">ít hơn ${d}</span>` }] },
          phep: [{ hoi: `số ${vat} ${B} có`, a, dau: nhieu ? '+' : '−', b: d, kq }], donVi: vat
        });
      },
      () => {
        const [A, B] = c(NGUOI), [vat] = c(DO), nhieu = Math.random() < 0.5;
        const a = n(25, 70), d = n(11, 25), kq = nhieu ? a + d : a - d;
        return Q.giaiToan({ de: `${A} có ${a} ${vat}. ${B} có ${nhieu ? 'nhiều' : 'ít'} hơn ${A} ${d} ${vat}. Hỏi ${B} có bao nhiêu ${vat}?`, phep: [{ hoi: `số ${vat} ${B} có`, a, dau: nhieu ? '+' : '−', b: d, kq }], donVi: vat });
      },
      () => {
        const [A, B] = c(NGUOI), [vat] = c(DO), nhieu = Math.random() < 0.5;
        const a = n(20, 60), d = n(4, 15), kq = nhieu ? a - d : a + d;
        if (Math.random() < 0.6) {
          return Q.giaiToan({
            de: `${A} có ${a} ${vat}. ${A} có <b>${nhieu ? 'nhiều' : 'ít'}</b> hơn ${B} ${d} ${vat}. Hỏi ${B} có bao nhiêu ${vat}?`,
            phep: [{ hoi: `số ${vat} ${B} có`, a, dau: nhieu ? '−' : '+', b: d, kq, saiPhep: { [nhieu ? 0 : 1]: `Đọc kĩ: ${A} ${nhieu ? 'nhiều' : 'ít'} hơn ${B}, vậy ${B} ${nhieu ? 'ít' : 'nhiều'} hơn ${A}.` } }], donVi: vat,
            goiY: [`${A} ${nhieu ? 'nhiều' : 'ít'} hơn ${B}. Vậy ${B} nhiều hơn hay ít hơn ${A}?`],
            hinh: { kieu: 'thanh', hang: nhieu ? [{ nhan: A, doan: [{ dai: a - d, chu: '' }, { dai: d, chu: d, loai: 'nhan-manh' }], sau: a }, { nhan: B, doan: [{ dai: a - d, chu: '?' }] }] : [{ nhan: A, doan: [{ dai: a, chu: a }] }, { nhan: B, doan: [{ dai: a, chu: '' }, { dai: d, chu: d, loai: 'nhan-manh' }], sau: '?' }] }
          });
        }
        const d2 = n(4, Math.min(15, a - 5)), b = a - d2;
        return Q.giaiToan({
          de: `Giỏ thứ nhất có ${a} ${vat}. Giỏ thứ hai có ít hơn giỏ thứ nhất ${d2} ${vat}. Hỏi cả hai giỏ có bao nhiêu ${vat}?`,
          phep: [{ hoi: `số ${vat} giỏ thứ hai có`, a, dau: '−', b: d2, kq: b }, { hoi: `số ${vat} cả hai giỏ có`, a, dau: '+', b, kq: a + b }], donVi: vat,
          goiY: ['Muốn tìm cả hai giỏ, trước hết phải biết giỏ thứ hai có bao nhiêu.']
        });
      }
    ]
  });

  /* ================= 6. Tìm số ban đầu (Phiếu Tuần 1 – tự luận) ================= */
  CT.them({
    id: 'tinh-nguoc', dao: 'qua10', ten: 'Tìm số ban đầu', bieu: '⏪',
    ghiNho: `<p><b>Đi ngược từ cuối về đầu:</b> phần nào đã <b>thêm vào</b> thì <b>bớt đi</b>; phần nào đã <b>bớt đi</b> thì <b>thêm vào</b>.</p>
      <p>Ví dụ: Mẹ bán đi 5 con gà thì còn lại 43 con. Trước khi bán: 43 + 5 = 48 con gà.</p>
      <p>Ví dụ: Bán 15 con vịt, rồi bà cho thêm 7 con thì có 47 con. Trước khi bà cho: 47 − 7 = 40. Trước khi bán: 40 + 15 = 55 con.</p>`,
    cap: [
      () => {
        const ban = Math.random() < 0.5, a = n(3, 15), con = n(10, 80 - a);
        if (ban) return Q.giaiToan({ de: `Nhà bạn Tú có một đàn gà. Sau khi mẹ bán đi ${a} con gà thì còn lại ${con} con gà. Hỏi trước khi bán, nhà bạn Tú có bao nhiêu con gà?`, hinh: { kieu: 'coMay', dau: '?', buoc: [`− ${a}`], cuoi: con }, phep: [{ hoi: 'số con gà nhà bạn Tú có trước khi bán', a: con, dau: '+', b: a, kq: con + a, saiPhep: { 1: 'Đã bán đi thì lúc đầu phải nhiều hơn bây giờ.' } }], donVi: 'con gà', goiYPhep: ['Lúc đầu nhiều hơn hay ít hơn lúc sau?'] });
        const co = con + a;
        return Q.giaiToan({ de: `Mai được mẹ cho thêm ${a} cái kẹo thì Mai có tất cả ${co} cái kẹo. Hỏi lúc đầu Mai có bao nhiêu cái kẹo?`, hinh: { kieu: 'coMay', dau: '?', buoc: [`+ ${a}`], cuoi: co }, phep: [{ hoi: 'số cái kẹo Mai có lúc đầu', a: co, dau: '−', b: a, kq: con, saiPhep: { 0: 'Được cho thêm thì lúc đầu phải ít hơn bây giờ.' } }], donVi: 'cái kẹo' });
      },
      () => {
        const chuc = n(1, 3), them = Math.random() < 0.5, kq = n(2, 6) * 10 + n(0, 9) * (Math.random() < 0.5 ? 1 : 0);
        if (them) {
          const cuoi = kq + chuc * 10;
          return Q.so(`Nếu cho Lan thêm ${chuc} chục nhãn vở thì Lan có ${cuoi} nhãn vở. Hỏi lúc đầu Lan có bao nhiêu nhãn vở?`, kq, {
            donVi: 'nhãn vở', hinh: { kieu: 'coMay', dau: '?', buoc: [`+ ${chuc} chục`], cuoi },
            goiY: [{ hoi: `${chuc} chục là bao nhiêu?`, dap: chuc * 10 }, { hoi: `Lúc đầu: ${cuoi} − ${chuc * 10} = ?`, dap: kq }],
            loiGiai: [`${chuc} chục = ${chuc * 10}.`, `Lúc đầu Lan có: ${cuoi} − ${chuc * 10} = ${kq} (nhãn vở).`], saiThuong: { [cuoi + chuc * 10]: 'Được cho thêm thì lúc đầu phải ít hơn.', [cuoi - chuc]: `${chuc} chục là ${chuc * 10} chứ không phải ${chuc}.` }
          });
        }
        const conLai = kq, dau = conLai + chuc * 10;
        return Q.so(`Tâm có một số nhãn vở. Tâm cho Hà ${chuc} chục nhãn vở thì Tâm còn lại ${conLai} nhãn vở. Hỏi lúc đầu Tâm có bao nhiêu nhãn vở?`, dau, {
          donVi: 'nhãn vở', hinh: { kieu: 'coMay', dau: '?', buoc: [`− ${chuc} chục`], cuoi: conLai },
          goiY: [{ hoi: `${chuc} chục là bao nhiêu?`, dap: chuc * 10 }, { hoi: `Lúc đầu: ${conLai} + ${chuc * 10} = ?`, dap: dau }],
          loiGiai: [`${chuc} chục = ${chuc * 10}.`, `Lúc đầu Tâm có: ${conLai} + ${chuc * 10} = ${dau} (nhãn vở).`], saiThuong: { [conLai - chuc * 10]: 'Đã cho đi thì lúc đầu phải nhiều hơn.' }
        });
      },
      () => c([
        () => {
          const a = n(2, 6), b = n(2, 6), cuoi = n(a + b + 3, 30), dau = cuoi - a - b;
          return Q.so(`Nếu mẹ cho Dũng thêm ${a} chiếc kẹo, anh cho Dũng thêm ${b} chiếc kẹo thì Dũng có tất cả ${cuoi} chiếc kẹo. Hỏi ban đầu Dũng có bao nhiêu chiếc kẹo?`, dau, {
            donVi: 'chiếc kẹo', hinh: { kieu: 'coMay', dau: '?', buoc: [`+ ${a}`, `+ ${b}`], cuoi },
            goiY: ['Đi ngược từ cuối.', { hoi: `Trước khi anh cho: ${cuoi} − ${b} = ?`, dap: cuoi - b }, { hoi: `Trước khi mẹ cho: ${cuoi - b} − ${a} = ?`, dap: dau }],
            loiGiai: [`Trước khi anh cho, Dũng có: ${cuoi} − ${b} = ${cuoi - b} (chiếc kẹo)`, `Ban đầu Dũng có: ${cuoi - b} − ${a} = ${dau} (chiếc kẹo)`, `Hoặc: cả mẹ và anh cho ${a} + ${b} = ${a + b}; ${cuoi} − ${a + b} = ${dau}.`]
          });
        },
        () => {
          const ban = n(8, 20), them = n(3, 12), cuoi = n(ban + 10, 70), giua = cuoi - them, dau = giua + ban;
          return Q.so(`Nhà Lan có một số con vịt. Mẹ Lan bán đi ${ban} con vịt, sau đó bà lại cho nhà Lan thêm ${them} con vịt thì nhà Lan có tất cả ${cuoi} con vịt. Hỏi lúc đầu nhà Lan có bao nhiêu con vịt?`, dau, {
            donVi: 'con vịt', hinh: { kieu: 'coMay', dau: '?', buoc: [`− ${ban}`, `+ ${them}`], cuoi },
            goiY: ['Đi ngược: việc xảy ra sau cùng thì tính ngược trước.', { hoi: `Trước khi bà cho thêm ${them} con: ${cuoi} − ${them} = ?`, dap: giua }, { hoi: `Trước khi bán ${ban} con: ${giua} + ${ban} = ?`, dap: dau }],
            loiGiai: [`Trước khi bà cho: ${cuoi} − ${them} = ${giua} (con vịt)`, `Lúc đầu: ${giua} + ${ban} = ${dau} (con vịt)`],
            saiThuong: { [cuoi + them - ban]: 'Con đổi ngược phép tính chưa đúng: bà cho thêm thì phải trừ đi, đã bán thì phải cộng vào.' }
          });
        },
        () => {
          const cho = n(3, 9), nhan = n(2, 9), cuoi = n(cho + 6, 30), giua = cuoi - nhan, dau = giua + cho;
          return Q.so(`Hà cho Hùng ${cho} quả bóng bay, Lan lại cho Hà ${nhan} quả bóng bay thì Hà có ${cuoi} quả bóng bay. Hỏi lúc đầu, Hà có bao nhiêu quả bóng bay?`, dau, {
            donVi: 'quả bóng bay', hinh: { kieu: 'coMay', dau: '?', buoc: [`− ${cho}`, `+ ${nhan}`], cuoi },
            goiY: ['Hà cho đi thì số bóng của Hà ít đi; Hà được cho thì nhiều lên.', { hoi: `Trước khi Lan cho: ${cuoi} − ${nhan} = ?`, dap: giua }, { hoi: `Trước khi Hà cho Hùng: ${giua} + ${cho} = ?`, dap: dau }],
            loiGiai: [`${cuoi} − ${nhan} = ${giua}`, `${giua} + ${cho} = ${dau}`, `Lúc đầu Hà có ${dau} quả bóng bay.`]
          });
        }
      ])()
    ]
  });

  /* ================= 7. Thay đổi thành phần (Phiếu Tuần 5 bài 7, 8, 9) ================= */
  CT.them({
    id: 'thay-doi', dao: 'qua10', ten: 'Thay đổi số hạng, số trừ', bieu: '🔄',
    ghiNho: `<p><b>Phép cộng:</b> giữ nguyên một số hạng, số hạng kia <b>thêm</b> (bớt) bao nhiêu thì tổng cũng <b>thêm</b> (bớt) bấy nhiêu.</p>
      <p><b>Phép trừ:</b> số bị trừ thêm bao nhiêu thì hiệu thêm bấy nhiêu. Nhưng <b>số trừ thêm</b> bao nhiêu thì <b>hiệu bớt</b> bấy nhiêu (trừ nhiều hơn thì còn ít hơn).</p>
      <p>Ví dụ: Hai số có hiệu 56. Giữ nguyên số bị trừ, thêm vào số trừ 3 → hiệu mới 56 − 3 = 53.</p>`,
    cap: [
      () => {
        const a = n(11, 40), b = n(11, 40), k = n(2, 9), them = Math.random() < 0.5;
        const t = a + b, moi = them ? t + k : t - k;
        return Q.so(`<div class="dong-tinh">${a} + ${b} = ${t}</div>Nếu giữ nguyên ${a} và ${them ? `thêm ${k} đơn vị vào số ${b}` : `bớt ${k} đơn vị ở số ${b}`} thì tổng mới là:`, moi, {
          hinh: { kieu: 'thanh', hang: [{ nhan: 'Tổng cũ', doan: [{ dai: a, chu: a }, { dai: b, chu: b }] }, { nhan: 'Tổng mới', doan: [{ dai: a, chu: a }, { dai: them ? b + k : b - k, chu: them ? `${b} + ${k}` : `${b} − ${k}`, loai: 'nhan-manh' }] }] },
          goiY: [{ hoi: `Số hạng mới: ${b} ${them ? '+' : '−'} ${k} = ?`, dap: them ? b + k : b - k }, { hoi: `Tổng mới: ${a} + ${them ? b + k : b - k} = ?`, dap: moi }],
          loiGiai: [`${a} + ${them ? b + k : b - k} = ${moi}`, `Nhận xét: tổng cũng ${them ? 'thêm' : 'bớt'} ${k} đơn vị: ${t} ${them ? '+' : '−'} ${k} = ${moi}.`]
        });
      },
      () => {
        const cong = Math.random() < 0.5, t = n(30, 90), k = n(3, 15), them = Math.random() < 0.5;
        if (cong) {
          const moi = them ? t + k : t - k;
          return Q.so(`Hai số có tổng là <b>${t}</b>. Nếu giữ nguyên số hạng thứ nhất và ${them ? 'thêm vào' : 'giảm bớt'} số hạng thứ hai <b>${k}</b> đơn vị thì tổng mới bằng bao nhiêu?`, moi, {
            goiY: [`Số hạng thứ hai ${them ? 'thêm' : 'bớt'} ${k} thì tổng cũng ${them ? 'thêm' : 'bớt'} ${k}.`, { hoi: `${t} ${them ? '+' : '−'} ${k} = ?`, dap: moi }],
            loiGiai: [`Tổng mới: ${t} ${them ? '+' : '−'} ${k} = ${moi}`], saiThuong: { [them ? t - k : t + k]: 'Ngược rồi. Số hạng thêm thì tổng thêm, số hạng bớt thì tổng bớt.' }
          });
        }
        const moi = them ? t - k : t + k;
        return Q.so(`Hai số có hiệu bằng <b>${t}</b>. Nếu giữ nguyên số bị trừ và ${them ? 'thêm vào' : 'bớt đi ở'} số trừ <b>${k}</b> đơn vị thì hiệu mới bằng bao nhiêu?`, moi, {
          goiY: [them ? 'Trừ đi nhiều hơn thì còn lại nhiều hơn hay ít hơn?' : 'Trừ đi ít hơn thì còn lại nhiều hơn hay ít hơn?', `Ví dụ: 10 − 3 = 7; 10 − ${them ? 5 : 1} = ${them ? 5 : 9}.`],
          loiGiai: [`Số trừ ${them ? 'thêm' : 'bớt'} ${k} thì hiệu ${them ? 'bớt' : 'thêm'} ${k}.`, `Hiệu mới: ${t} ${them ? '−' : '+'} ${k} = ${moi}`],
          saiThuong: { [them ? t + k : t - k]: 'Cẩn thận! Số trừ thêm thì hiệu lại bớt đi.' }
        });
      },
      () => c([
        () => {
          const t = n(30, 80), a = n(3, 12), b = n(2, 12), kq = t + a - b;
          return Q.so(`Hai số có tổng là <b>${t}</b>. Nếu thêm vào số hạng thứ nhất <b>${a}</b> đơn vị và bớt ở số hạng thứ hai <b>${b}</b> đơn vị thì tổng mới là bao nhiêu?`, kq, {
            goiY: [{ hoi: `Thêm ${a} vào số hạng thứ nhất: tổng thành ${t} + ${a} = ?`, dap: t + a }, { hoi: `Bớt ${b} ở số hạng thứ hai: ${t + a} − ${b} = ?`, dap: kq }],
            loiGiai: [`${t} + ${a} = ${t + a}`, `${t + a} − ${b} = ${kq}`]
          });
        },
        () => {
          const h = n(20, 70), k = n(3, 15);
          return Q.so(`Hai số có hiệu là <b>${h}</b>. Nếu thêm vào số bị trừ <b>${k}</b> đơn vị và thêm vào số trừ <b>${k}</b> đơn vị thì hiệu mới là bao nhiêu?`, h, {
            goiY: [`Số bị trừ thêm ${k} → hiệu thêm ${k}. Số trừ thêm ${k} → hiệu bớt ${k}.`, 'Thêm rồi lại bớt cùng một số thì sao?', 'Thử với số nhỏ: 10 − 4 = 6; (10 + 2) − (4 + 2) = ?'],
            loiGiai: [`${h} + ${k} − ${k} = ${h}`, 'Hiệu không thay đổi.'], saiThuong: { [h + 2 * k]: 'Số trừ thêm thì hiệu bớt đi. Hai việc bù cho nhau.', [h + k]: 'Còn việc thêm vào số trừ nữa.' }
          });
        },
        () => {
          const t = n(40, 95), sh1 = n(10, t - 10);
          return Q.so(`Trong một phép cộng, tổng hơn số hạng thứ nhất <b>${t - sh1}</b> đơn vị. Nếu số hạng thứ nhất là <b>${sh1}</b> thì tổng là:`, t, {
            goiY: ['Tổng hơn số hạng thứ nhất bao nhiêu thì cộng thêm bấy nhiêu.', { hoi: `${sh1} + ${t - sh1} = ?`, dap: t }],
            loiGiai: [`Tổng = ${sh1} + ${t - sh1} = ${t}`]
          });
        }
      ])()
    ]
  });
})();

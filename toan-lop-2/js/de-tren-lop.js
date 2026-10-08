/* Các dạng bài luyện ngẫu nhiên soạn theo đúng kiểu đề trong tập phiếu trên lớp
   (phiếu tuần, nâng cao 2Q, chuyên đề): số chẵn – số lẻ, lập số từ chữ số, tìm số theo tổng / hiệu chữ số,
   chuỗi phép tính, tìm tổng ban đầu, tổng số tuổi, thứ – ngày trong tuần. */
(function () {
  'use strict';
  const { n, c, tron, lap } = T;
  const hoa = s => s.charAt(0).toUpperCase() + s.slice(1);
  const chan = x => x % 2 === 0;
  const BANG = lap(90, i => i + 10);
  const cs = x => [Math.floor(x / 10), x % 10];

  /* ================= Số chẵn, số lẻ ================= */
  const DAC_BIET_CL = [
    ['số chẵn lớn nhất có hai chữ số', 98], ['số lẻ lớn nhất có hai chữ số', 99],
    ['số chẵn bé nhất có hai chữ số', 10], ['số lẻ bé nhất có hai chữ số', 11],
    ['số lẻ bé nhất có hai chữ số khác nhau', 13], ['số lẻ lớn nhất có hai chữ số khác nhau', 97],
    ['số chẵn lớn nhất có một chữ số', 8], ['số lẻ bé nhất có một chữ số', 1], ['số lẻ lớn nhất có một chữ số', 9]
  ];
  CT.them({
    id: 'chan-le', dao: 'so100', ten: 'Số chẵn, số lẻ', bieu: '⚪',
    ghiNho: `<p><b>Các số lẻ</b> là các số có chữ số hàng đơn vị là 1, 3, 5, 7, 9.</p>
      <p><b>Các số chẵn</b> là các số có chữ số hàng đơn vị là 0, 2, 4, 6, 8.</p>
      <p>Hai số chẵn (hoặc hai số lẻ) liên tiếp hơn kém nhau 2 đơn vị. Số tròn chục là số chẵn.</p>
      <p>Muốn biết chẵn hay lẻ, <b>chỉ cần nhìn chữ số hàng đơn vị</b>.</p>`,
    cap: [
      () => {
        const le = Math.random() < 0.5, s = new Set(); while (s.size < 8) s.add(n(1, 99));
        const ds = [...s];
        if (!ds.some(x => chan(x) !== le)) ds[0] = le ? 11 : 10;
        if (ds.every(x => chan(x) !== le)) ds[1] = le ? 24 : 35;
        return Q.nhieu(`Chọn <b>tất cả</b> các số ${le ? 'lẻ' : 'chẵn'}:`, ds, ds.map((x, i) => chan(x) !== le ? i : -1).filter(i => i >= 0),
          { luoi: 4, goiY: [`Nhìn chữ số hàng đơn vị: ${le ? '1, 3, 5, 7, 9 là số lẻ' : '0, 2, 4, 6, 8 là số chẵn'}.`], loiGiai: [`Các số ${le ? 'lẻ' : 'chẵn'}: ${ds.filter(x => chan(x) !== le).join(', ')}.`] });
      },
      () => c([
        () => { const p = c(DAC_BIET_CL); return Q.so(hoa(p[0]) + ' là:', p[1], { goiY: [p[0].includes('khác nhau') ? 'Hai chữ số phải khác nhau. Thử dần từ số lớn nhất (hoặc bé nhất) có thể.' : 'Nhớ: số chẵn tận cùng 0, 2, 4, 6, 8; số lẻ tận cùng 1, 3, 5, 7, 9.'], loiGiai: [`${hoa(p[0])} là ${p[1]}.`], saiThuong: p[1] === 13 ? { 11: '11 là số lẻ nhưng hai chữ số giống nhau.' } : p[1] === 97 ? { 99: '99 có hai chữ số giống nhau.' } : {} }); },
        () => {
          const le = Math.random() < 0.5, a = n(10, 60), b = a + n(8, 14), ds = lap(b - a - 1, i => a + 1 + i).filter(x => chan(x) !== le);
          return Q.o(`Viết các số ${le ? 'lẻ' : 'chẵn'} lớn hơn ${a} và bé hơn ${b}:<div class="dong-tinh">${ds.map((_, i) => `[[${i}]]`).join(' ; ')}</div>`, ds,
            { khongThuTu: true, goiY: [`Số ${le ? 'lẻ' : 'chẵn'} đầu tiên lớn hơn ${a} là?`, `Hai số ${le ? 'lẻ' : 'chẵn'} liên tiếp hơn kém nhau 2.`], loiGiai: [ds.join(', ')], saiThuong: {} });
        }
      ])(),
      () => {
        const le = Math.random() < 0.5, lon = Math.random() < 0.5, a = n(11, 45), b = n(a + 25, 95), k = b - a;
        // a + … < b (số lớn nhất) hoặc … + a > b (số bé nhất)
        let kq = lon ? k - 1 : k + 1; if (chan(kq) === le) kq += lon ? -1 : 1;
        const de = lon ? `${a} + …… &lt; ${b}` : `…… + ${a} &gt; ${b}`;
        return Q.so(`Số ${le ? 'lẻ' : 'chẵn'} ${lon ? 'lớn' : 'bé'} nhất điền vào chỗ chấm là số nào?<div class="dong-tinh">${de}</div>`, kq, {
          goiY: [{ hoi: `${a} cộng mấy thì bằng ${b}?`, dap: k }, lon ? `Số cần điền phải bé hơn ${k}.` : `Số cần điền phải lớn hơn ${k}.`, `Trong các số đó, chọn số ${le ? 'lẻ' : 'chẵn'} ${lon ? 'lớn' : 'bé'} nhất.`],
          loiGiai: [`${a} + ${k} = ${b}.`, `Số cần điền ${lon ? 'bé' : 'lớn'} hơn ${k}; số ${le ? 'lẻ' : 'chẵn'} ${lon ? 'lớn' : 'bé'} nhất là ${kq}.`],
          saiThuong: { [k]: `${a} + ${k} = ${b}, bằng chứ không ${lon ? 'bé' : 'lớn'} hơn.` }
        });
      }
    ]
  });

  /* ================= Lập số từ các chữ số ================= */
  function lapSo(dsCs, khacNhau) {
    const kq = [];
    dsCs.forEach(a => dsCs.forEach(b => { if (a !== 0 && (!khacNhau || a !== b)) kq.push(a * 10 + b); }));
    return [...new Set(kq)].sort((x, y) => x - y);
  }
  function chonCs(k, coKhong) {
    let ds; do { ds = lap(k, () => n(1, 9)); if (coKhong) ds[n(0, k - 1)] = 0; } while (new Set(ds).size < k);
    return ds;
  }
  CT.them({
    id: 'lap-so', dao: 'so100', ten: 'Lập số từ các chữ số', bieu: '🃏',
    ghiNho: `<p>Viết lần lượt theo <b>chữ số hàng chục</b> để không sót: hàng chục là chữ số thứ nhất, rồi thứ hai…</p>
      <p><b>Chữ số 0 không đứng ở hàng chục.</b></p>
      <p>Đề nói “<b>khác nhau</b>” thì hai chữ số phải khác nhau (bỏ số như 33). Đề không nói thì được dùng lặp lại.</p>
      <p>Ví dụ từ 2, 0, 6 lập các số có hai chữ số khác nhau: 20, 26, 60, 62.</p>`,
    cap: [
      () => {
        const ds = chonCs(2, false), kq = lapSo(ds, false);
        return Q.o(`Từ hai chữ số <b>${ds.join(', ')}</b>, viết tất cả các số có hai chữ số (được dùng lặp lại):<div class="dong-tinh">${kq.map((_, i) => `[[${i}]]`).join(' ; ')}</div>`, kq,
          { khongThuTu: true, goiY: [`Hàng chục là ${ds[0]} thì viết được những số nào?`, 'Đề không nói “khác nhau” nên được viết số có hai chữ số giống nhau.'], loiGiai: [kq.join(', ')] });
      },
      () => {
        const coKhong = Math.random() < 0.6, ds = chonCs(3, coKhong), khac = true, kq = lapSo(ds, khac);
        if (Math.random() < 0.5) return Q.so(`Từ ba chữ số <b>${ds.join(', ')}</b> lập được tất cả bao nhiêu số có hai chữ số khác nhau?`, kq.length, {
          donVi: 'số', goiY: ['Liệt kê theo từng chữ số hàng chục.', coKhong ? 'Chữ số 0 không đứng ở hàng chục.' : 'Mỗi chữ số hàng chục đi với 2 chữ số còn lại.'], loiGiai: [kq.join(', '), `Có ${kq.length} số.`]
        });
        return Q.o(`Từ ba chữ số <b>${ds.join(', ')}</b>, viết tất cả các số có hai chữ số khác nhau:<div class="dong-tinh">${kq.map((_, i) => `[[${i}]]`).join(' ; ')}</div>`, kq,
          { khongThuTu: true, goiY: [coKhong ? 'Chữ số 0 không đứng ở hàng chục.' : 'Mỗi chữ số hàng chục đi với hai chữ số còn lại.'], loiGiai: [kq.join(', ')] });
      },
      () => {
        const coKhong = Math.random() < 0.5, ds = chonCs(3, coKhong), khac = Math.random() < 0.6, kq = lapSo(ds, khac);
        const lon = kq[kq.length - 1], be = kq[0];
        return c([
          () => Q.so(`Từ các chữ số <b>${ds.join(', ')}</b>, tính tổng của số lớn nhất và số bé nhất có hai chữ số${khac ? ' khác nhau' : ''} lập được.`, lon + be, {
            goiY: [{ hoi: 'Số lớn nhất lập được là?', dap: lon }, { hoi: 'Số bé nhất lập được là?', dap: be }], loiGiai: [`Số lớn nhất: ${lon}; số bé nhất: ${be}.`, `${lon} + ${be} = ${lon + be}`],
            saiThuong: khac ? {} : {}
          }),
          () => Q.so(`Từ các chữ số <b>${ds.join(', ')}</b>, tính hiệu của số lớn nhất và số bé nhất có hai chữ số${khac ? ' khác nhau' : ''} lập được.`, lon - be, {
            goiY: [{ hoi: 'Số lớn nhất lập được là?', dap: lon }, { hoi: 'Số bé nhất lập được là?', dap: be }], loiGiai: [`${lon} − ${be} = ${lon - be}`]
          }),
          () => {
            const a = kq[n(0, Math.max(0, kq.length - 4))], b = a + n(10, 30), trong = kq.filter(x => x > a && x < b);
            if (!trong.length || T.tong(trong) > 300) return Q.so(`Từ các chữ số <b>${ds.join(', ')}</b> lập được bao nhiêu số có hai chữ số${khac ? ' khác nhau' : ''}?`, kq.length, { donVi: 'số', goiY: ['Liệt kê theo từng chữ số hàng chục.'], loiGiai: [kq.join(', ')] });
            return Q.so(`Từ các chữ số <b>${ds.join(', ')}</b> viết các số có hai chữ số${khac ? ' khác nhau' : ''}. Tính tổng tất cả các số lớn hơn ${a} nhưng nhỏ hơn ${b}.`, T.tong(trong), {
              goiY: ['Viết hết các số lập được ra nháp trước.', `Chọn các số lớn hơn ${a} và nhỏ hơn ${b}.`], loiGiai: [`Các số lập được: ${kq.join(', ')}.`, `Các số cần cộng: ${trong.join(', ')}.`, `${trong.join(' + ')} = ${T.tong(trong)}`]
            });
          }
        ])();
      }
    ]
  });

  /* ================= Tìm số theo tổng / hiệu các chữ số (Chuyên đề Lập số) ================= */
  const timTheo = (loc, lon) => { const ds = BANG.filter(loc); return lon ? ds[ds.length - 1] : ds[0]; };
  CT.them({
    id: 'so-theo-chu-so', dao: 'so100', ten: 'Số lớn nhất, bé nhất theo chữ số', bieu: '🔝',
    ghiNho: `<p><b>Số lớn nhất</b> có hai chữ số khi biết <b>hiệu</b> các chữ số: chọn hàng chục là 9, hàng đơn vị là 9 − hiệu. (Hiệu 6 → 93.)</p>
      <p><b>Số bé nhất</b> khi biết <b>hiệu</b>: chọn hàng chục là 1, hàng đơn vị là 1 + hiệu. (Hiệu 6 → 17.)</p>
      <p><b>Số lớn nhất</b> khi biết <b>tổng</b>: hàng chục càng lớn càng tốt (tổng 5 → 50; tổng 16 → 97).</p>
      <p><b>Số bé nhất</b> khi biết <b>tổng</b>: hàng chục càng bé càng tốt, nhưng hàng đơn vị không quá 9 (tổng 6 → 15; tổng 16 → 79).</p>`,
    cap: [
      () => {
        const lon = Math.random() < 0.5, k = n(2, 9), kq = timTheo(x => cs(x)[0] + cs(x)[1] === k, lon);
        return Q.so(`Tìm số ${lon ? 'lớn' : 'bé'} nhất có hai chữ số mà tổng các chữ số của nó bằng ${k}.`, kq, {
          goiY: [lon ? `Muốn lớn nhất, chữ số hàng chục lớn nhất có thể là ${k}.` : 'Muốn bé nhất, chữ số hàng chục bé nhất là 1.', { hoi: 'Chữ số hàng đơn vị là?', dap: kq % 10 }],
          loiGiai: [`${Math.floor(kq / 10)} + ${kq % 10} = ${k}. Số cần tìm là ${kq}.`], saiThuong: { [kq % 10 * 10 + Math.floor(kq / 10)]: lon ? 'Đó là số bé nhất. Muốn lớn nhất, đặt chữ số lớn ở hàng chục.' : 'Đó là số lớn nhất.' }
        });
      },
      () => c([
        () => {
          const lon = Math.random() < 0.5, k = n(10, 17), kq = timTheo(x => cs(x)[0] + cs(x)[1] === k, lon);
          return Q.so(`Tìm số ${lon ? 'lớn' : 'bé'} nhất có hai chữ số mà tổng các chữ số của nó bằng ${k}.`, kq, {
            goiY: ['Chữ số hàng đơn vị nhiều nhất là 9.', lon ? 'Hàng chục lớn nhất là 9, khi đó hàng đơn vị là bao nhiêu?' : { hoi: `Hàng chục bé nhất có thể là ${k} − 9 = ?`, dap: k - 9 }],
            loiGiai: [`Số cần tìm là ${kq} (${Math.floor(kq / 10)} + ${kq % 10} = ${k}).`], saiThuong: { [kq % 10 * 10 + Math.floor(kq / 10)]: lon ? 'Đó là số bé nhất.' : 'Đó là số lớn nhất.' }
          });
        },
        () => {
          const lon = Math.random() < 0.5, h = n(2, 8), kq = timTheo(x => Math.abs(cs(x)[0] - cs(x)[1]) === h, lon);
          return Q.so(`Tìm số ${lon ? 'lớn' : 'bé'} nhất có hai chữ số mà hiệu hai chữ số của số đó bằng ${h}.`, kq, {
            goiY: [lon ? `Chọn hàng chục là 9, hàng đơn vị là 9 − ${h}.` : `Chọn hàng chục là 1, hàng đơn vị là 1 + ${h}.`], loiGiai: [lon ? `9 − ${h} = ${9 - h}. Số cần tìm là ${kq}.` : `1 + ${h} = ${1 + h}. Số cần tìm là ${kq}.`]
          });
        }
      ])(),
      () => {
        const le = Math.random() < 0.5, lon = Math.random() < 0.5, tong = Math.random() < 0.5, k = tong ? n(5, 12) : n(3, 7);
        const loc = x => (tong ? cs(x)[0] + cs(x)[1] === k : Math.abs(cs(x)[0] - cs(x)[1]) === k) && chan(x) !== le;
        const kq = timTheo(loc, lon);
        if (kq == null) return CT.sinh('so-theo-chu-so', 2);
        const ds = BANG.filter(x => tong ? cs(x)[0] + cs(x)[1] === k : Math.abs(cs(x)[0] - cs(x)[1]) === k);
        return Q.so(`Tìm số ${le ? 'lẻ' : 'chẵn'} ${lon ? 'lớn' : 'bé'} nhất có hai chữ số mà ${tong ? 'tổng' : 'hiệu'} hai chữ số của số đó bằng ${k}.`, kq, {
          goiY: [`Viết các số có ${tong ? 'tổng' : 'hiệu'} chữ số bằng ${k} theo thứ tự ${lon ? 'từ lớn' : 'từ bé'}.`, `Chọn số ${le ? 'lẻ' : 'chẵn'} đầu tiên.`],
          loiGiai: [`Các số: ${(lon ? ds.slice().reverse() : ds).join(', ')}.`, `Số ${le ? 'lẻ' : 'chẵn'} ${lon ? 'lớn' : 'bé'} nhất là ${kq}.`],
          saiThuong: { [lon ? ds[ds.length - 1] : ds[0]]: ds[lon ? ds.length - 1 : 0] === kq ? '' : `Số đó là số ${le ? 'chẵn' : 'lẻ'}.` }
        });
      }
    ]
  });

  /* ================= Chuỗi phép tính (máy tính mũi tên) ================= */
  function chuoi(soBuoc, max, nguoc) {
    for (; ;) {
      const dau = n(10, max - 10), buoc = []; let v = dau; const giua = [];
      for (let i = 0; i < soBuoc; i++) {
        const cong = Math.random() < 0.5 && v < max - 5;
        const k = cong ? n(2, Math.min(45, max - v)) : n(2, Math.min(45, v));
        v = cong ? v + k : v - k; buoc.push((cong ? '+ ' : '− ') + k); giua.push(v);
      }
      if (v < 0 || giua.some(x => x < 0 || x > max)) continue;
      const hang = [nguoc ? '[[0]]' : String(dau)];
      const dap = nguoc ? [dau] : [];
      giua.forEach((x, i) => { if (nguoc && i === soBuoc - 1) hang.push(String(x)); else { hang.push(`[[${dap.length}]]`); dap.push(x); } });
      return { dau, buoc, giua, hang, dap };
    }
  }
  CT.them({
    id: 'chuoi-phep', dao: 'conho', ten: 'Chuỗi phép tính', bieu: '➰',
    ghiNho: `<p>Làm <b>lần lượt theo chiều mũi tên</b>: kết quả của ô trước là số bắt đầu của ô sau.</p>
      <p>Nếu ô đầu tiên bị trống: <b>đi ngược</b> từ ô cuối — ngược với cộng là trừ, ngược với trừ là cộng.</p>`,
    cap: [2, 3, 3].map((sb, k) => () => {
      const nguoc = k === 2, x = chuoi(sb + (k === 2 ? 1 : 0), k === 0 ? 50 : 99, nguoc);
      let s = `<div class="co-may">`;
      x.hang.forEach((o, i) => { s += `<div class="cm-o">${o}</div>`; if (i < x.buoc.length) s += `<div class="cm-mui">${x.buoc[i]}<span>➜</span></div>`; });
      s += '</div>';
      const gy = nguoc ? ['Đi ngược từ ô cuối.', { hoi: `Ô đứng trước ô ${x.giua[x.giua.length - 1]}: làm ngược phép “${x.buoc[x.buoc.length - 1]}” được?`, dap: x.giua[x.giua.length - 2] }]
        : [{ hoi: `${x.dau} ${x.buoc[0]} = ?`, dap: x.giua[0] }, 'Lấy kết quả đó làm tiếp mũi tên sau.'];
      return Q.o('Điền số vào ô trống:' + s, x.dap, {
        goiY: gy, loiGiai: x.buoc.map((b, i) => `${i ? x.giua[i - 1] : x.dau} ${b} = ${x.giua[i]}`)
      });
    })
  });

  /* ================= Tìm tổng (hiệu) ban đầu ================= */
  CT.them({
    id: 'tong-ban-dau', dao: 'conho', ten: 'Tìm tổng, hiệu ban đầu', bieu: '🔙',
    ghiNho: `<p>Biết tổng <b>mới</b>, muốn tìm tổng <b>ban đầu</b> thì làm ngược: số hạng đã <b>tăng</b> thì <b>trừ</b> đi, số hạng đã <b>giảm</b> thì <b>cộng</b> vào.</p>
      <p>Ví dụ: tăng số hạng thứ nhất 12 thì tổng mới là 67 → tổng ban đầu 67 − 12 = 55.</p>
      <p>Trong phép trừ: <b>hiệu kém số bị trừ đúng bằng số trừ</b>. Nếu hiệu bằng số trừ thì số bị trừ gấp đôi số trừ (hiệu + số trừ).</p>`,
    cap: [
      () => {
        const t = n(20, 80), k = n(5, 20), tang = Math.random() < 0.5, moi = tang ? t + k : t - k, thu = c(['thứ nhất', 'thứ hai']);
        return Q.so(`Nếu ${tang ? 'tăng' : 'giảm'} số hạng ${thu} ${tang ? 'thêm' : 'đi'} ${k} đơn vị và giữ nguyên số hạng kia thì được tổng mới là ${moi}. Tìm tổng ban đầu.`, t, {
          goiY: [tang ? 'Số hạng tăng thì tổng tăng. Vậy tổng ban đầu bé hơn hay lớn hơn tổng mới?' : 'Số hạng giảm thì tổng giảm. Vậy tổng ban đầu lớn hơn tổng mới.', { hoi: `${moi} ${tang ? '−' : '+'} ${k} = ?`, dap: t }],
          loiGiai: [`${moi} ${tang ? '−' : '+'} ${k} = ${t}`], saiThuong: { [tang ? moi + k : moi - k]: 'Con làm cùng chiều rồi. Phải làm ngược lại.' }
        });
      },
      () => {
        const t = n(30, 80), a = n(3, 20), b = n(3, 20), ta = Math.random() < 0.5, tb = Math.random() < 0.5;
        const moi = t + (ta ? a : -a) + (tb ? b : -b);
        return Q.so(`Nếu ${ta ? 'tăng' : 'giảm'} số hạng thứ nhất ${ta ? 'thêm' : 'đi'} ${a} đơn vị và ${tb ? 'tăng' : 'giảm'} số hạng thứ hai ${tb ? 'thêm' : 'đi'} ${b} đơn vị thì được tổng mới là ${moi}. Tìm tổng ban đầu.`, t, {
          goiY: ['Làm ngược từng phần: phần đã tăng thì trừ đi, phần đã giảm thì cộng vào.'], loiGiai: [`${moi} ${ta ? '−' : '+'} ${a} ${tb ? '−' : '+'} ${b} = ${t}`]
        });
      },
      () => c([
        () => { const h = n(11, 45); return Q.so(`Tìm số bị trừ, biết số bị trừ lớn hơn số trừ ${h} và hiệu hai số bằng số trừ.`, 2 * h, { goiY: [{ hoi: 'Số bị trừ lớn hơn số trừ bao nhiêu thì hiệu bằng bấy nhiêu. Hiệu là?', dap: h }, { hoi: 'Hiệu bằng số trừ, vậy số trừ là?', dap: h }], loiGiai: [`Hiệu = số trừ = ${h}.`, `Số bị trừ = ${h} + ${h} = ${2 * h}.`], saiThuong: { [h]: 'Đó là số trừ (cũng là hiệu). Còn số bị trừ?' } }); },
        () => { const st = n(10, 40), d = n(5, 20); return Q.so(`Trong một phép trừ có số bị trừ bằng số trừ cộng với ${d}. Hiệu là bao nhiêu?`, d, { goiY: [`Thử: số trừ là ${st} thì số bị trừ là ${st + d}. Hiệu là?`], loiGiai: [`Số bị trừ hơn số trừ ${d} nên hiệu bằng ${d}.`] }); },
        () => { const h = n(20, 60), a = n(3, 15), b = n(3, 15); return Q.so(`Hai số có hiệu là ${h}. Nếu thêm vào số bị trừ ${a} đơn vị và bớt số trừ đi ${b} đơn vị thì hiệu mới bằng bao nhiêu?`, h + a + b, { goiY: [`Số bị trừ thêm ${a} → hiệu thêm ${a}.`, `Số trừ bớt ${b} → hiệu cũng thêm ${b}.`], loiGiai: [`${h} + ${a} + ${b} = ${h + a + b}`], saiThuong: { [h + a - b]: 'Số trừ bớt đi thì hiệu lại tăng lên.' } }); }
      ])()
    ]
  });

  /* ================= Tổng số tuổi ================= */
  CT.them({
    id: 'tong-tuoi', dao: 'thamtu', ten: 'Tổng số tuổi', bieu: '👨‍👩‍👧',
    ghiNho: `<p>Mỗi năm, <b>mỗi người</b> thêm 1 tuổi. Sau 3 năm, hai người thêm tất cả 3 + 3 = 6 tuổi.</p>
      <p>Tổng tuổi của <b>nhiều người</b> sau n năm = tổng hiện nay + n cộng nhiều lần (mỗi người một lần).</p>
      <p>Trước đây n năm thì <b>trừ</b> đi như vậy.</p>`,
    cap: [
      () => { const sau = Math.random() < 0.6, t = sau ? n(8, 25) : n(14, 25), k = n(1, sau ? 4 : 3); return Q.so(`Hiện nay, tuổi em và tuổi anh cộng lại là ${t} tuổi. Hỏi ${sau ? 'sau ' + k + ' năm nữa' : k + ' năm trước'}, tuổi hai anh em cộng lại là bao nhiêu?`, sau ? t + 2 * k : t - 2 * k, { donVi: 'tuổi', goiY: [`Mỗi người ${sau ? 'thêm' : 'bớt'} ${k} tuổi, hai người ${sau ? 'thêm' : 'bớt'} tất cả ${k} + ${k}.`, { hoi: `${k} + ${k} = ?`, dap: 2 * k }], loiGiai: [`${t} ${sau ? '+' : '−'} ${k} ${sau ? '+' : '−'} ${k} = ${sau ? t + 2 * k : t - 2 * k} (tuổi)`], saiThuong: { [sau ? t + k : t - k]: `Cả hai anh em đều ${sau ? 'thêm' : 'bớt'} ${k} tuổi.` } }); },
      () => { const bo = n(30, 45), me = n(28, bo), con = n(5, 10), k = n(1, 3), t = bo + me + con; return Q.o(`Hiện nay bố ${bo} tuổi, mẹ ${me} tuổi và con ${con} tuổi. Tính tổng số tuổi của cả gia đình hiện nay và sau ${k} năm nữa.<div class="dong-tinh">Hiện nay: [[0]] tuổi · Sau ${k} năm: [[1]] tuổi</div>`, [t, t + 3 * k], { goiY: [`Gia đình có 3 người. Sau ${k} năm, mỗi người thêm ${k} tuổi.`], loiGiai: [`${bo} + ${me} + ${con} = ${t}`, `${t} + ${k} + ${k} + ${k} = ${t + 3 * k}`] }); },
      () => {
        const anh = n(9, 14), em = anh - n(2, 5), k = n(2, 6);
        return c([
          () => Q.so(`Năm nay anh ${anh} tuổi, em ${em} tuổi. Hỏi khi anh ${anh + k} tuổi thì em bao nhiêu tuổi?`, em + k, { donVi: 'tuổi', goiY: [{ hoi: `Bao nhiêu năm nữa thì anh ${anh + k} tuổi?`, dap: k }], loiGiai: [`${anh + k} − ${anh} = ${k} (năm)`, `${em} + ${k} = ${em + k} (tuổi)`] }),
          () => Q.so(`Cách đây ${k} năm, chị Hà ${anh} tuổi. Hỏi ${k - 1 || 1} năm nữa chị Hà bao nhiêu tuổi?`, anh + k + (k - 1 || 1), { donVi: 'tuổi', goiY: [{ hoi: 'Năm nay chị Hà bao nhiêu tuổi?', dap: anh + k }], loiGiai: [`Năm nay: ${anh} + ${k} = ${anh + k}`, `${anh + k} + ${k - 1 || 1} = ${anh + k + (k - 1 || 1)} (tuổi)`] }),
          () => Q.so(`Năm nay em ${em} tuổi, anh ${anh} tuổi. Hỏi sau ${k + 5} năm nữa, anh hơn em bao nhiêu tuổi?`, anh - em, { donVi: 'tuổi', goiY: ['Mỗi năm cả hai cùng thêm 1 tuổi.'], loiGiai: [`Hiệu số tuổi không đổi: ${anh} − ${em} = ${anh - em}.`], saiThuong: { [anh - em + k + 5]: 'Em cũng lớn thêm nữa đấy.' } })
        ])();
      }
    ]
  });

  /* ================= Thứ – ngày trong tuần ================= */
  const THU = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ nhật'];
  const th = i => THU[i].replace('Thứ', 'thứ');
  CT.them({
    id: 'thu-ngay', dao: 'gio', ten: 'Thứ mấy, ngày mấy', bieu: '📆',
    ghiNho: `<p>Một tuần có 7 ngày: thứ Hai, thứ Ba, thứ Tư, thứ Năm, thứ Sáu, thứ Bảy, Chủ nhật.</p>
      <p>Thứ sau hơn thứ trước 1 ngày. Hôm nay thứ Hai ngày 17 thì thứ Tư là ngày 17 + 2 = 19.</p>
      <p>Sau 7 ngày lại đúng thứ đó. Sau 10 ngày = sau 7 ngày + 3 ngày.</p>
      <p>1 tuần lễ và 3 ngày = 7 + 3 = 10 ngày.</p>`,
    cap: [
      () => {
        const t1 = n(0, 4), t2 = n(t1 + 1, 6), d = n(1, 22), kq = d + t2 - t1;
        return Q.so(`Hôm nay là ${th(t1)} ngày ${d}. Hỏi ${th(t2)} tuần này là ngày bao nhiêu?`, kq, { goiY: [{ hoi: `Từ ${th(t1)} đến ${th(t2)} là thêm mấy ngày?`, dap: t2 - t1 }], loiGiai: [`${d} + ${t2 - t1} = ${kq}`] });
      },
      () => c([
        () => { const k = n(1, 2), d = n(1, 6); return Q.so(`${k} tuần lễ và ${d} ngày là bao nhiêu ngày?`, 7 * k + d, { donVi: 'ngày', goiY: [{ hoi: '1 tuần lễ có mấy ngày?', dap: 7 }], loiGiai: [`${lap(k, () => 7).join(' + ')} + ${d} = ${7 * k + d} (ngày)`], saiThuong: { [k + d]: '1 tuần có 7 ngày chứ không phải 1 ngày.' } }); },
        () => { const t = n(0, 6), k = n(2, 6), kq = (t + k) % 7; return Q.chon(`Hôm nay là ${th(t)}. Hỏi ${k} ngày sau là thứ mấy?`, [THU[kq]].concat(tron(THU.filter(x => x !== THU[kq])).slice(0, 3)), 0, { goiY: ['Đếm tiếp từng ngày trên đầu ngón tay, bắt đầu từ ngày mai.'], loiGiai: [`Đếm thêm ${k} ngày sau ${th(t)} là ${th(kq)}.`] }); }
      ])(),
      () => c([
        () => { const t = n(0, 6), k = n(8, 13), kq = (t + k) % 7; return Q.chon(`Hôm nay là ${th(t)}, hỏi sau ${k} ngày nữa là thứ mấy?`, [THU[kq]].concat(tron(THU.filter(x => x !== THU[kq])).slice(0, 3)), 0, { goiY: [`Sau 7 ngày lại là ${th(t)}. Còn thêm mấy ngày nữa?`], loiGiai: [`${k} = 7 + ${k - 7}. ${th(t)} thêm ${k - 7} ngày là ${th(kq)}.`] }); },
        () => { const t = n(0, 6), k = n(5, 9), dau = ((t - (k - 1)) % 7 + 7) % 7; return Q.chon(`Mỗi ngày cây đậu của Lan có thêm một bông hoa. Vào ${th(t)}, trên cây có ${k} bông hoa. Hỏi cây bắt đầu ra hoa vào thứ mấy?`, [THU[dau]].concat(tron(THU.filter(x => x !== THU[dau])).slice(0, 3)), 0, { goiY: ['Ngày đầu tiên cây có 1 bông.', `Đếm lùi ${k - 1} ngày từ ${th(t)}.`], loiGiai: [`Từ 1 bông đến ${k} bông là ${k - 1} ngày. Lùi ${k - 1} ngày từ ${th(t)} là ${th(dau)}.`] }); },
        () => { const t = n(0, 4), k = n(3, 5), kq = (t + k - 1) % 7; return Q.chon(`Huyền đến nhà bà ngoại vào ${th(t)}. Bạn ấy ở nhà bà ${k} ngày. Hỏi ngày cuối cùng Huyền ở nhà bà là thứ mấy?`, [THU[kq]].concat(tron(THU.filter(x => x !== THU[kq])).slice(0, 3)), 0, { goiY: [`${th(t)} đã là ngày thứ nhất ở nhà bà.`], loiGiai: [`Đếm ${k} ngày bắt đầu từ ${th(t)}: ngày cuối là ${th(kq)}.`] }); }
      ])()
    ]
  });
})();

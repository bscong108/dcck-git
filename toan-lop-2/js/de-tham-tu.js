/* Đảo Thám Tử — các dạng tư duy nâng cao xuất hiện trên phiếu bài tập: suy luận so sánh, khoảng cách (±1),
   quy luật dãy số, bài toán tuổi. */
(function () {
  'use strict';
  const { n, c, tron, lap } = T;
  const hoa = s => s.charAt(0).toUpperCase() + s.slice(1);
  const BA = [['An', 'Bình', 'Căn'], ['Lan', 'Mai', 'Hoa'], ['Nam', 'Minh', 'Hùng']];

  /* ================= Suy luận so sánh ================= */
  CT.them({
    id: 'suy-luan', dao: 'thamtu', ten: 'Suy luận so sánh', bieu: '🧠',
    ghiNho: `<p>Đọc từng câu, <b>vẽ sơ đồ</b> hoặc viết ra: ai hơn ai, hơn bao nhiêu.</p>
      <p>Bắt đầu từ người <b>đã biết số</b>, rồi suy ra người tiếp theo.</p>
      <p>“A <b>ít hơn</b> B 2 hòn bi” → B <b>nhiều hơn</b> A 2 hòn bi → B = A + 2.</p>
      <p>Nếu A + B = C + D mà A lớn hơn C thì B phải bé hơn D (để hai tổng vẫn bằng nhau).</p>`,
    cap: [
      () => {
        const [A, B, C] = c(BA), a = n(5, 15), b = a + n(1, 5), cc = b + n(1, 5), nhieu = Math.random() < 0.5;
        const ds = tron([[A, a], [B, b], [C, cc]]);
        return Q.chon(`${ds.map(([t, so]) => `${t} có ${so} viên bi`).join(', ')}. Ai có <b>${nhieu ? 'nhiều' : 'ít'}</b> viên bi nhất?`, [A, B, C], nhieu ? 2 : 0, {
          giuThuTu: true, loiGiai: [`${a} < ${b} < ${cc}`, `${nhieu ? C : A} có ${nhieu ? 'nhiều' : 'ít'} viên bi nhất.`]
        });
      },
      () => {
        const [A, B, C] = c(BA), a = n(3, 12), d1 = n(1, 5), d2 = n(1, 5), b = a + d1, cc = b + d2;
        return Q.so(`${A} có ít hơn ${B} ${d1} hòn bi, ${B} có ít hơn ${C} ${d2} hòn bi. Hỏi ${C} có mấy hòn bi, biết rằng ${A} có ${a} hòn bi.`, cc, {
          donVi: 'hòn bi', hinh: { kieu: 'thanh', hang: [{ nhan: A, doan: [{ dai: a, chu: a }] }, { nhan: B, doan: [{ dai: a, chu: '' }, { dai: d1, chu: d1, loai: 'nhan-manh' }] }, { nhan: C, doan: [{ dai: b, chu: '' }, { dai: d2, chu: d2, loai: 'nhan-manh' }], sau: '?' }] },
          goiY: [`${A} ít hơn ${B} → ${B} nhiều hơn ${A}.`, { hoi: `${B} có mấy hòn bi?`, dap: b }, { hoi: `${C} có mấy hòn bi?`, dap: cc }],
          loiGiai: [`${B}: ${a} + ${d1} = ${b} (hòn bi)`, `${C}: ${b} + ${d2} = ${cc} (hòn bi)`], saiThuong: { [a - d1 - d2]: `${A} ít hơn, vậy ${B} và ${C} phải nhiều hơn.` }
        });
      },
      () => c([
        () => {
          const [A, B] = c(BA), k = n(2, 6), tong = k + n(3, 9);
          return Q.o(`Tổng số táo của ${A} và ${B} là ${tong} quả. Biết rằng nếu ${A} cho ${B} ${k} quả táo thì ${A} không còn quả nào. Hỏi mỗi bạn có bao nhiêu quả táo?<div class="dong-tinh">${A}: [[0]] quả &nbsp; ${B}: [[1]] quả</div>`, [k, tong - k], {
            goiY: [`${A} cho đi ${k} quả thì hết. Vậy lúc đầu ${A} có mấy quả?`, { hoi: `${A} có mấy quả?`, dap: k }, { hoi: `${B}: ${tong} − ${k} = ?`, dap: tong - k }],
            loiGiai: [`${A} cho ${k} quả thì hết → ${A} có ${k} quả.`, `${B} có: ${tong} − ${k} = ${tong - k} (quả)`]
          });
        },
        () => {
          const [A, B] = c(BA), k = n(2, 6), b = n(5, 15), a = b + 2 * k;
          return Q.so(`${A} có ${a} cái kẹo. Nếu ${A} cho ${B} ${k} cái kẹo thì số kẹo của hai bạn bằng nhau. Hỏi lúc đầu ${B} có bao nhiêu cái kẹo?`, b, {
            donVi: 'cái kẹo', goiY: [{ hoi: `Sau khi cho, ${A} còn mấy cái?`, dap: a - k }, `Lúc đó ${B} cũng có ${a - k} cái — sau khi đã nhận thêm ${k} cái.`, { hoi: `Lúc đầu ${B} có: ${a - k} − ${k} = ?`, dap: b }],
            loiGiai: [`${A} còn: ${a} − ${k} = ${a - k} (cái)`, `${B} sau khi nhận có ${a - k} cái.`, `Lúc đầu ${B} có: ${a - k} − ${k} = ${b} (cái kẹo)`], saiThuong: { [a - k]: `Đó là số kẹo của ${B} sau khi đã nhận thêm ${k} cái.` }
          });
        },
        () => {
          const [A, B, C] = c(BA), D = 'Hương', nhieu = Math.random() < 0.5;
          return Q.chon(`Số tuổi của ${A} và ${B} cộng lại bằng số tuổi của ${C} và ${D} cộng lại. ${A} ${nhieu ? 'nhiều' : 'ít'} tuổi hơn ${C}. Hỏi ${B} nhiều tuổi hơn hay ít tuổi hơn ${D}?`, [`${B} nhiều tuổi hơn ${D}`, `${B} ít tuổi hơn ${D}`, `${B} bằng tuổi ${D}`], nhieu ? 1 : 0, {
            giuThuTu: true, goiY: ['Hai tổng bằng nhau giống như cân thăng bằng.', `Bên ${A} nặng hơn bên ${C} thì bên ${B} phải thế nào để hai bên vẫn bằng nhau?`, 'Thử bằng số: 5 + 3 = 4 + 4.'],
            loiGiai: [`${A} + ${B} = ${C} + ${D}.`, `${A} ${nhieu ? 'nhiều' : 'ít'} hơn ${C} nên ${B} phải ${nhieu ? 'ít' : 'nhiều'} hơn ${D}.`]
          });
        },
        () => {
          const ss = c([[9, 'số lớn nhất có một chữ số', 10, 'số nhỏ nhất có hai chữ số khác nhau', 1], [9, 'số lớn nhất có một chữ số', 11, 'số bé nhất có hai chữ số giống nhau', 2], [9, 'số lớn nhất có một chữ số', 10, 'số nhỏ nhất có hai chữ số khác nhau', 2], [8, 'số liền trước của số lớn nhất có một chữ số', 11, 'số bé nhất có hai chữ số giống nhau', 1]]);
          const tuoiAnh = ss[2] - ss[4];
          const kq = ss[0] === tuoiAnh ? 2 : ss[0] > tuoiAnh ? 0 : 1;
          return Q.chon(`Hải nói với Hà: “Chị mình bảo Tết này tuổi chị mình bằng ${ss[1]}”. Hà nói: “Còn anh mình bảo, Tết này anh còn thiếu ${ss[4]} tuổi nữa thì bằng ${ss[3]}”. Hỏi chị của Hải và anh của Hà, ai nhiều tuổi hơn?`, ['Chị của Hải nhiều tuổi hơn', 'Anh của Hà nhiều tuổi hơn', 'Hai người bằng tuổi nhau'], kq, {
            giuThuTu: true, goiY: [{ hoi: 'Chị của Hải bao nhiêu tuổi?', dap: ss[0] }, { hoi: hoa(ss[3]) + ' là?', dap: ss[2] }, { hoi: `Anh của Hà: ${ss[2]} − ${ss[4]} = ?`, dap: tuoiAnh }],
            loiGiai: [`Chị của Hải: ${ss[0]} tuổi.`, `Anh của Hà: ${ss[2]} − ${ss[4]} = ${tuoiAnh} tuổi.`, kq === 2 ? 'Hai người bằng tuổi nhau.' : kq === 0 ? 'Chị của Hải nhiều tuổi hơn.' : 'Anh của Hà nhiều tuổi hơn.']
          });
        }
      ])()
    ]
  });

  /* ================= Khoảng cách: cầu thang, trồng cây, cưa gỗ (Phiếu Tuần 5 bài 16, 19, 20) ================= */
  CT.them({
    id: 'khoang-cach', dao: 'thamtu', ten: 'Cầu thang, trồng cây, cưa gỗ', bieu: '🪜',
    ghiNho: `<p><b>Cầu thang:</b> đi từ tầng 1 lên tầng 4 chỉ phải leo <b>3</b> lần cầu thang (4 − 1 = 3).</p>
      <p><b>Trồng cây thẳng hàng:</b> 5 cây thì có <b>4</b> khoảng cách giữa hai cây liền nhau.</p>
      <p><b>Cưa gỗ:</b> cưa thành 4 đoạn chỉ cần cưa <b>3</b> lần.</p>
      <p>Mẹo: <b>vẽ hình ra</b> rồi đếm — đừng vội tính.</p>`,
    cap: [
      () => c([
        () => { const t = n(3, 6); return Q.so(`Từ tầng 1 lên tầng ${t}, An phải đi qua mấy lần cầu thang?`, t - 1, { hinh: { kieu: 'toaNha', tang: t, nguoi: 1 }, goiY: ['Mỗi lần lên cầu thang thì lên được 1 tầng. Đếm trên hình.'], loiGiai: [`${t} − 1 = ${t - 1} lần.`], saiThuong: { [t]: `Từ tầng 1 không cần leo để đến tầng 1. Chỉ leo ${t - 1} lần.` } }); },
        () => { const k = n(3, 7); return Q.so(`Trồng ${k} cây thành một hàng thẳng. Hỏi có bao nhiêu khoảng cách giữa hai cây liền nhau?`, k - 1, { hinh: { kieu: 'hang', ds: lap(k, () => '🌳') }, goiY: ['Đếm khoảng trống giữa các cây trên hình.'], loiGiai: [`${k} cây có ${k - 1} khoảng cách.`] }); }
      ])(),
      () => c([
        () => { const p = c([2, 3]), t = n(3, 5), lan = t - 1; return Q.so(`An mất ${p} phút để đi bộ từ tầng này tới tầng kế tiếp. Hỏi An đi bộ từ tầng 1 đến tầng ${t} mất bao lâu?`, p * lan, { donVi: 'phút', hinh: { kieu: 'toaNha', tang: t, nguoi: 1 }, goiY: [{ hoi: `Từ tầng 1 đến tầng ${t} phải đi qua mấy lần cầu thang?`, dap: lan }, `Mỗi lần ${p} phút: cộng ${lap(lan, () => p).join(' + ')}.`], loiGiai: [`Số lần đi cầu thang: ${t} − 1 = ${lan}.`, `${lap(lan, () => p).join(' + ')} = ${p * lan} (phút)`], saiThuong: { [p * t]: `Con tính thừa một tầng rồi. Từ tầng 1 lên tầng ${t} chỉ đi ${lan} lần.` } }); },
        () => { const doan = n(3, 6); return Q.so(`Bố cưa một thanh gỗ thành ${doan} đoạn. Hỏi bố phải cưa mấy lần?`, doan - 1, { hinh: { kieu: 'chu', chu: `<div class="go">${lap(doan, () => '<span></span>').join('<i>✂</i>')}</div>` }, goiY: ['Đếm số vết cưa (✂) trên hình.'], loiGiai: [`${doan} đoạn cần ${doan - 1} lần cưa.`], saiThuong: { [doan]: 'Lần cưa cuối cùng đã tạo ra 2 đoạn rồi.' } }); }
      ])(),
      () => c([
        () => { const nam = n(4, 10), moi = c([1, 2]); return Q.so(`Một giáo viên xếp ${nam} bạn nam đứng theo hàng ngang. Cứ ${moi === 1 ? 'một bạn nữ' : 'hai bạn nữ'} được xếp giữa hai bạn nam. Hỏi có tất cả bao nhiêu bạn nữ?`, (nam - 1) * moi, { donVi: 'bạn nữ', hinh: { kieu: 'hang', ds: lap(nam * 2 - 1, i => i % 2 ? (moi === 1 ? '👧' : '👧👧') : '👦').slice(0, 9).concat(nam > 5 ? ['…'] : []) }, goiY: [{ hoi: `${nam} bạn nam đứng thành hàng thì có mấy khoảng giữa hai bạn nam?`, dap: nam - 1 }, `Mỗi khoảng có ${moi} bạn nữ.`], loiGiai: [`Số khoảng: ${nam} − 1 = ${nam - 1}.`, `Số bạn nữ: ${lap(nam - 1, () => moi).join(' + ')} = ${(nam - 1) * moi}`], saiThuong: { [nam * moi]: 'Hai đầu hàng là bạn nam, không có bạn nữ ở ngoài cùng.' } }); },
        () => { const k = n(4, 8), kc = c([2, 3, 5]); return Q.so(`Trồng ${k} cây thẳng hàng, hai cây liền nhau cách nhau ${kc} m. Hỏi từ cây đầu đến cây cuối dài bao nhiêu mét?`, (k - 1) * kc, { donVi: 'm', hinh: { kieu: 'hang', ds: lap(k, () => '🌳') }, goiY: [{ hoi: 'Có mấy khoảng cách?', dap: k - 1 }, `Mỗi khoảng ${kc} m.`], loiGiai: [`${k} − 1 = ${k - 1} khoảng.`, `${lap(k - 1, () => kc).join(' + ')} = ${(k - 1) * kc} (m)`], saiThuong: { [k * kc]: `${k} cây chỉ có ${k - 1} khoảng thôi.` } }); },
        () => { const p = c([2, 3]), t = n(4, 6), tinh = (t - 1) * p; return Q.so(`Mỗi lần đi từ tầng này lên tầng kế tiếp, Minh mất ${p} phút. Minh đi từ tầng 1 lên tầng ${t} rồi lại đi xuống tầng 1. Hỏi Minh đi mất tất cả bao lâu (đi xuống cũng ${p} phút mỗi tầng)?`, tinh * 2, { donVi: 'phút', goiY: [{ hoi: 'Đi lên mất bao nhiêu phút?', dap: tinh }, 'Đi xuống cũng bằng đi lên.'], loiGiai: [`Đi lên: ${t - 1} lần × ${p} phút = ${tinh} phút.`, `Cả đi lẫn về: ${tinh} + ${tinh} = ${tinh * 2} (phút)`] }); }
      ])()
    ]
  });

  /* ================= Quy luật ================= */
  CT.them({
    id: 'quy-luat', dao: 'thamtu', ten: 'Tìm quy luật', bieu: '🔁',
    ghiNho: `<p>Muốn tìm số tiếp theo, xem <b>hai số liền nhau hơn kém nhau bao nhiêu</b>.</p>
      <p>Ví dụ: 3, 5, 7, 9, … mỗi số hơn số trước 2 đơn vị → số tiếp theo là 11.</p>
      <p>Hình lặp lại: tìm <b>nhóm lặp</b> (ví dụ 🔴🔵🔵) rồi đếm theo từng nhóm.</p>`,
    cap: [
      () => { const d = n(2, 5), a = n(1, 20), cong = Math.random() < 0.7; const ds = lap(6, i => cong ? a + i * d : a + 5 * d - i * d); return Q.o(`Điền số tiếp theo vào dãy:<div class="dong-tinh">${ds.slice(0, 4).join(', ')}, [[0]], [[1]]</div>`, ds.slice(4), { goiY: [{ hoi: `${ds[1]} ${cong ? '−' : '−'} ${ds[0]} = ? (hai số liền nhau hơn kém bao nhiêu)`, dap: Math.abs(ds[1] - ds[0]) }], loiGiai: [`Mỗi số ${cong ? 'hơn' : 'kém'} số trước ${d} đơn vị: ${ds.join(', ')}`] }); },
      () => c([
        () => { const nhom = c([['🔴', '🔵'], ['🔴', '🔵', '🔵'], ['⭐', '🌙', '☀️'], ['🍎', '🍎', '🍌']]), dai = nhom.length, vt = n(10, 15); const ds = lap(8, i => nhom[i % dai]); const dung = nhom[(vt - 1) % dai]; const lc = [...new Set(nhom)]; return Q.chon(`Các hình xếp theo quy luật. Hình thứ <b>${vt}</b> là hình gì?`, lc.map(x => `<span class="bieu-to">${x}</span>`), lc.indexOf(dung), { giuThuTu: true, cot: lc.length, hinh: { kieu: 'hang', ds: ds.concat(['…']) }, goiY: [`Nhóm lặp lại có ${dai} hình: ${nhom.join('')}.`, 'Đếm tiếp theo từng nhóm cho đến hình thứ ' + vt + '.'], loiGiai: [`Nhóm ${nhom.join('')} lặp lại. Hình thứ ${vt} là ${dung}.`] }); },
        () => { const a = n(1, 5); const ds = [a]; let d = 1; for (let i = 1; i < 6; i++) { ds.push(ds[i - 1] + d); d++; } return Q.o(`Điền số tiếp theo:<div class="dong-tinh">${ds.slice(0, 4).join(', ')}, [[0]], [[1]]</div>`, ds.slice(4), { goiY: ['Xem khoảng cách giữa các số: +1, +2, +3, …'], loiGiai: [`${ds.join(', ')} (cộng thêm 1, 2, 3, 4, 5)`] }); }
      ])(),
      () => c([
        () => { const d = c([2, 3, 5]), a = n(1, 9), vt = n(8, 12), kq = a + (vt - 1) * d; return Q.so(`Dãy số: ${a}, ${a + d}, ${a + 2 * d}, ${a + 3 * d}, … Số thứ ${vt} của dãy là số nào?`, kq, { goiY: [`Mỗi số hơn số trước ${d}.`, 'Viết tiếp dãy số và đếm cho đến số thứ ' + vt + '.'], loiGiai: [lap(vt, i => a + i * d).join(', '), `Số thứ ${vt} là ${kq}.`] }); },
        () => { const d = c([2, 3, 5]), a = n(1, 9), k = n(8, 15), cuoi = a + (k - 1) * d; return Q.so(`Dãy số ${a}, ${a + d}, ${a + 2 * d}, …, ${cuoi} có bao nhiêu số?`, k, { goiY: ['Viết dãy ra rồi đếm.', `Mẹo: (${cuoi} − ${a}) là bao nhiêu lần ${d}? Rồi cộng 1.`], loiGiai: [lap(k, i => a + i * d).join(', '), `Có ${k} số.`], saiThuong: { [k - 1]: 'Con quên đếm số đầu tiên.' } }); }
      ])()
    ]
  });

  /* ================= Bài toán tuổi ================= */
  CT.them({
    id: 'tuoi', dao: 'thamtu', ten: 'Bài toán tuổi', bieu: '🎂',
    ghiNho: `<p>Mỗi năm, <b>ai cũng thêm 1 tuổi</b>. Sau 3 năm, mỗi người thêm 3 tuổi.</p>
      <p>Vì vậy <b>hai người luôn hơn kém nhau một số tuổi không đổi</b>. Mẹ hơn con 25 tuổi thì 10 năm nữa mẹ vẫn hơn con 25 tuổi.</p>`,
    cap: [
      () => { const t = n(6, 9), k = n(2, 5), sau = Math.random() < 0.5; return Q.so(`Năm nay Lan ${t} tuổi. Hỏi ${k} năm ${sau ? 'nữa' : 'trước'} Lan bao nhiêu tuổi?`, sau ? t + k : t - k, { donVi: 'tuổi', goiY: [sau ? 'Năm sau thì thêm tuổi.' : 'Năm trước thì bớt tuổi.'], loiGiai: [`${t} ${sau ? '+' : '−'} ${k} = ${sau ? t + k : t - k} (tuổi)`] }); },
      () => { const con = n(6, 9), me = con + n(22, 30); return Q.so(`Năm nay con ${con} tuổi, mẹ ${me} tuổi. Hỏi mẹ hơn con bao nhiêu tuổi?`, me - con, { donVi: 'tuổi', loiGiai: [`${me} − ${con} = ${me - con} (tuổi)`] }); },
      () => c([
        () => { const con = n(6, 9), hieu = n(22, 30), k = n(3, 9); return Q.so(`Năm nay mẹ hơn con ${hieu} tuổi. Hỏi ${k} năm nữa mẹ hơn con bao nhiêu tuổi?`, hieu, { donVi: 'tuổi', goiY: ['Sau ' + k + ' năm, mẹ thêm ' + k + ' tuổi, con cũng thêm ' + k + ' tuổi.', 'Thử với số: con 7, mẹ ' + (7 + hieu) + '.'], loiGiai: ['Hai người cùng thêm số tuổi như nhau, nên hiệu số tuổi không đổi.', `Mẹ vẫn hơn con ${hieu} tuổi.`], saiThuong: { [hieu + k]: 'Con cũng lớn thêm ' + k + ' tuổi nữa đấy.' } }); },
        () => { const em = n(5, 8), hon = n(2, 5), k = n(2, 6); return Q.so(`Năm nay em ${em} tuổi, anh hơn em ${hon} tuổi. Hỏi ${k} năm nữa anh bao nhiêu tuổi?`, em + hon + k, { donVi: 'tuổi', goiY: [{ hoi: 'Năm nay anh bao nhiêu tuổi?', dap: em + hon }, `${k} năm nữa thì thêm ${k} tuổi.`], loiGiai: [`Anh năm nay: ${em} + ${hon} = ${em + hon} (tuổi)`, `${k} năm nữa: ${em + hon} + ${k} = ${em + hon + k} (tuổi)`] }); },
        () => { const con = n(5, 9), me = con + n(22, 28), k = n(2, 5); return Q.so(`Năm nay con ${con} tuổi, mẹ ${me} tuổi. Hỏi ${k} năm nữa tổng số tuổi của hai mẹ con là bao nhiêu?`, me + con + 2 * k, { donVi: 'tuổi', goiY: [{ hoi: `${k} năm nữa con bao nhiêu tuổi?`, dap: con + k }, { hoi: `${k} năm nữa mẹ bao nhiêu tuổi?`, dap: me + k }], loiGiai: [`Con: ${con} + ${k} = ${con + k}; mẹ: ${me} + ${k} = ${me + k}`, `Tổng: ${con + k} + ${me + k} = ${me + con + 2 * k} (tuổi)`], saiThuong: { [me + con + k]: 'Cả hai mẹ con đều thêm tuổi, không phải chỉ một người.' } }); }
      ])()
    ]
  });
})();

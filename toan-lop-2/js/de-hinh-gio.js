/* Đảo Hình Học (Chủ đề 5, 9) và Đảo Thời Gian (Chủ đề 6). */
(function () {
  'use strict';
  const { n, c, tron, lap } = T;
  const TEN_HINH = { tamGiac: 'hình tam giác', tuGiac: 'hình tứ giác', tron: 'hình tròn', vuong: 'hình vuông', chuNhat: 'hình chữ nhật', nguGiac: 'hình có 5 cạnh' };
  const TEN_DUONG = { doanThang: 'đoạn thẳng', duongThang: 'đường thẳng', duongCong: 'đường cong', gapKhuc: 'đường gấp khúc' };
  const hoa = s => s.charAt(0).toUpperCase() + s.slice(1);

  /* ================= Nhận dạng hình phẳng ================= */
  CT.them({
    id: 'nhan-dang-hinh', dao: 'hinh', ten: 'Nhận dạng hình', bieu: '🔺',
    ghiNho: `<p><b>Hình tam giác</b> có 3 cạnh. <b>Hình tứ giác</b> có 4 cạnh.</p>
      <p>Hình vuông và hình chữ nhật cũng có 4 cạnh, nên cũng là <b>hình tứ giác</b>.</p>
      <p><b>Đoạn thẳng</b> có hai đầu (hai điểm). <b>Đường thẳng</b> kéo dài mãi về hai phía. <b>Đường cong</b> không thẳng. <b>Đường gấp khúc</b> gồm nhiều đoạn thẳng nối tiếp nhau.</p>`,
    cap: [
      () => {
        if (Math.random() < 0.5) {
          const ds = tron(['tamGiac', 'tron', 'chuNhat', 'tuGiac']), dung = c(['tamGiac', 'tron', 'chuNhat']);
          return Q.chon(`Hình nào là <b>${TEN_HINH[dung]}</b>?`, ds.map(t => HV.hinhPhang(t, 80)), ds.indexOf(dung), { giuThuTu: true, cot: 4, loiGiai: [`${hoa(TEN_HINH[dung])} là hình ${ds.indexOf(dung) + 1}.`] });
        }
        const ds = tron(Object.keys(TEN_DUONG)), dung = c(ds);
        return Q.chon(`Hình nào là <b>${TEN_DUONG[dung]}</b>?`, ds.map(t => HV.hinhPhang(t, 80)), ds.indexOf(dung), { giuThuTu: true, cot: 4, goiY: ['Đọc Bí kíp 📖 để nhớ đặc điểm mỗi loại đường.'], loiGiai: [`${hoa(TEN_DUONG[dung])} là hình ${ds.indexOf(dung) + 1}.`] });
      },
      () => {
        const tat = tron(['tamGiac', 'tuGiac', 'tron', 'vuong', 'chuNhat', 'nguGiac', 'tamGiac', 'tuGiac']);
        return Q.nhieu('Chọn <b>tất cả</b> các hình tứ giác:', tat.map((t, i) => ({ nhan: HV.hinhPhang(t, 64), gt: i })), tat.map((t, i) => ['tuGiac', 'vuong', 'chuNhat'].includes(t) ? i : -1).filter(i => i >= 0), {
          luoi: 4, goiY: ['Đếm số cạnh của từng hình.', 'Hình vuông, hình chữ nhật có 4 cạnh nên cũng là tứ giác.'], loiGiai: ['Hình có đúng 4 cạnh là tứ giác: hình vuông, hình chữ nhật và các hình 4 cạnh khác.']
        });
      },
      () => {
        const k = n(3, 5), so = k * (k - 1) / 2;
        const ten = 'ABCDEFG'.slice(0, k).split('');
        return Q.so(`Trên một đường thẳng có ${k} điểm ${ten.join(', ')}. Có bao nhiêu đoạn thẳng nối hai trong các điểm đó?`, so, {
          hinh: { kieu: 'diem', cao: 70, diem: ten.map((t, i) => ({ x: 30 + i * 240 / (k - 1), y: 40, ten: t })), doan: [[0, k - 1]] },
          goiY: [{ hoi: `Từ điểm ${ten[0]} nối được với mấy điểm còn lại?`, dap: k - 1 }, { hoi: `Từ ${ten[1]} nối thêm được mấy đoạn mới (không tính ${ten[1]}${ten[0]} nữa)?`, dap: k - 2 }, 'Cứ thế đến điểm gần cuối rồi cộng lại.'],
          loiGiai: [lap(k - 1, i => k - 1 - i).join(' + ') + ` = ${so}`, `Có ${so} đoạn thẳng.`]
        });
      }
    ]
  });

  /* ================= Ba điểm thẳng hàng ================= */
  CT.them({
    id: 'thang-hang', dao: 'hinh', ten: 'Ba điểm thẳng hàng', bieu: '📍',
    ghiNho: `<p>Ba điểm <b>thẳng hàng</b> là ba điểm cùng nằm trên một đường thẳng.</p>
      <p>Cách kiểm tra: đặt thước kẻ qua hai điểm, xem điểm thứ ba có nằm sát mép thước không.</p>`,
    cap: [
      () => {
        const dung = Math.random() < 0.5;
        const pts = dung ? [{ x: 40, y: 120, ten: 'A' }, { x: 150, y: 80, ten: 'B' }, { x: 260, y: 40, ten: 'C' }] : [{ x: 40, y: 120, ten: 'A' }, { x: 150, y: 40, ten: 'B' }, { x: 260, y: 110, ten: 'C' }];
        return Q.chon('Ba điểm A, B, C có thẳng hàng không?', ['Có, thẳng hàng', 'Không thẳng hàng'], dung ? 0 : 1, { giuThuTu: true, hinh: { kieu: 'diem', diem: pts }, goiY: ['Tưởng tượng đặt thước qua A và C. Điểm B có nằm trên mép thước không?'], loiGiai: [dung ? 'A, B, C cùng nằm trên một đường thẳng.' : 'B nằm lệch ra ngoài đường thẳng qua A và C.'] });
      },
      () => {
        // lưới 3x3, chọn bộ ba thẳng hàng
        const luoi = lap(9, i => ({ x: 60 + (i % 3) * 90, y: 25 + Math.floor(i / 3) * 55 }));
        const bo = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        const chon = tron(lap(9, i => i)).slice(0, 5);
        let dungBo = bo.find(b => b.every(i => chon.includes(i)));
        if (!dungBo) { dungBo = c(bo); dungBo.forEach(i => { if (!chon.includes(i)) chon[chon.findIndex(x => !dungBo.includes(x))] = i; }); }
        const ten = 'ABCDE'.split('');
        const pts = chon.map((i, k) => ({ x: luoi[i].x, y: luoi[i].y, ten: ten[k] }));
        const thangHang = (a, b, cc) => (pts[b].x - pts[a].x) * (pts[cc].y - pts[a].y) === (pts[cc].x - pts[a].x) * (pts[b].y - pts[a].y);
        const tat = []; for (let a = 0; a < 5; a++) for (let b = a + 1; b < 5; b++) for (let cc = b + 1; cc < 5; cc++) tat.push([a, b, cc]);
        const dung = tat.filter(t => thangHang(...t)), sai = tron(tat.filter(t => !thangHang(...t))).slice(0, 3);
        const ds = [dung[0]].concat(sai);
        return Q.chon('Ba điểm nào <b>thẳng hàng</b>?', ds.map(t => t.map(i => ten[i]).join(', ')), 0, { hinh: { kieu: 'diem', diem: pts }, goiY: ['Thử đặt thước qua từng cặp điểm.'], loiGiai: [`${dung.map(t => t.map(i => ten[i]).join(', ')).join(' và ')} thẳng hàng.`] });
      },
      () => {
        const k = n(4, 6), ten = 'ABCDEFG'.slice(0, k).split('');
        return Q.so(`Có ${k} điểm, trong đó không có ba điểm nào thẳng hàng. Kẻ đoạn thẳng nối từng cặp hai điểm. Kẻ được tất cả bao nhiêu đoạn thẳng?`, k * (k - 1) / 2, {
          hinh: { kieu: 'diem', diem: ten.map((t, i) => ({ x: 150 + 100 * Math.cos(2 * Math.PI * i / k - Math.PI / 2), y: 82 + 62 * Math.sin(2 * Math.PI * i / k - Math.PI / 2), ten: t })) },
          goiY: [{ hoi: `Từ ${ten[0]} kẻ được mấy đoạn?`, dap: k - 1 }, { hoi: `Từ ${ten[1]} kẻ thêm được mấy đoạn mới?`, dap: k - 2 }, 'Tiếp tục rồi cộng lại.'],
          loiGiai: [lap(k - 1, i => k - 1 - i).join(' + ') + ` = ${k * (k - 1) / 2}`]
        });
      }
    ]
  });

  /* ================= Đường gấp khúc ================= */
  const ENG = 'ABCDE';
  function gapKhuc(dai) {
    const pts = dai.length + 1, ds = lap(pts, i => ({ x: 25 + i * 250 / (pts - 1), y: i % 2 ? 40 : 125, ten: ENG[i], dy: i % 2 ? -12 : 26 }));
    return { kieu: 'diem', diem: ds, doan: dai.map((d, i) => [i, i + 1, d == null ? '?' : d + ' cm']) };
  }
  CT.them({
    id: 'duong-gap-khuc', dao: 'hinh', ten: 'Đường gấp khúc', bieu: '〰️',
    ghiNho: `<p><b>Độ dài đường gấp khúc</b> bằng tổng độ dài các đoạn thẳng của nó.</p>
      <p>Ví dụ: đường gấp khúc ABCD có AB = 3 cm, BC = 4 cm, CD = 5 cm. Độ dài là 3 + 4 + 5 = 12 (cm).</p>`,
    cap: [
      () => { const d = lap(n(2, 3), () => n(2, 9)), ten = ENG.slice(0, d.length + 1); return Q.so(`Tính độ dài đường gấp khúc ${ten}.`, T.tong(d), { donVi: 'cm', hinh: gapKhuc(d), loiGiai: [`${d.join(' + ')} = ${T.tong(d)} (cm)`] }); },
      () => {
        if (Math.random() < 0.5) { const k = n(3, 4), m = n(2, 9), ten = ENG.slice(0, k + 1); return Q.so(`Đường gấp khúc ${ten} gồm ${k} đoạn thẳng, mỗi đoạn dài ${m} cm. Độ dài đường gấp khúc là:`, k * m, { donVi: 'cm', hinh: gapKhuc(lap(k, () => m)), loiGiai: [`${lap(k, () => m).join(' + ')} = ${k * m} (cm)`] }); }
        const d = lap(3, () => n(3, 15)), tong = T.tong(d), an = n(0, 2), hien = d.map((x, i) => i === an ? null : x);
        return Q.so(`Đường gấp khúc ABCD dài ${tong} cm. Tìm độ dài đoạn còn thiếu.`, d[an], { donVi: 'cm', hinh: gapKhuc(hien), goiY: [{ hoi: 'Tổng hai đoạn đã biết là?', dap: tong - d[an] }, 'Lấy độ dài cả đường trừ đi tổng hai đoạn đã biết.'], loiGiai: [`${hien.filter(x => x != null).join(' + ')} = ${tong - d[an]}`, `${tong} − ${tong - d[an]} = ${d[an]} (cm)`] });
      },
      () => {
        const d = lap(3, () => n(3, 12)), dt = n(Math.max(...d) + 1, T.tong(d) - 2);
        return Q.so(`Con kiến bò từ A đến D theo đường gấp khúc ABCD (AB = ${d[0]} cm, BC = ${d[1]} cm, CD = ${d[2]} cm). Con ốc sên bò thẳng từ A đến D dài ${dt} cm. Con kiến phải bò xa hơn con ốc sên bao nhiêu xăng-ti-mét?`, T.tong(d) - dt, {
          donVi: 'cm', hinh: gapKhuc(d), goiY: [{ hoi: 'Đường của con kiến dài bao nhiêu cm?', dap: T.tong(d) }, 'Xa hơn bao nhiêu → lấy số lớn trừ số bé.'],
          loiGiai: [`Đường kiến: ${d.join(' + ')} = ${T.tong(d)} (cm)`, `${T.tong(d)} − ${dt} = ${T.tong(d) - dt} (cm)`]
        });
      }
    ]
  });

  /* ================= Đếm hình ================= */
  CT.them({
    id: 'dem-hinh', dao: 'hinh', ten: 'Đếm hình', bieu: '🔍',
    ghiNho: `<p>Đếm hình <b>có thứ tự</b> để không sót:</p>
      <p>1. Đếm các hình <b>đơn</b> (nhỏ nhất).<br>2. Đếm hình ghép từ <b>2</b> hình đơn.<br>3. Đếm hình ghép từ <b>3</b> hình đơn… rồi cộng tất cả lại.</p>
      <p>Ví dụ hình có 3 hình đơn xếp liền nhau: 3 + 2 + 1 = 6 hình.</p>`,
    cap: [
      () => Q.so('Hình dưới đây có bao nhiêu hình tam giác?', 3, { hinh: { kieu: 'quat', k: 3 }, goiY: [{ hoi: 'Có mấy tam giác nhỏ (đơn)?', dap: 2 }, { hoi: 'Có mấy tam giác ghép từ 2 tam giác nhỏ?', dap: 1 }], loiGiai: ['Tam giác đơn: ABC, ACD → 2.', 'Tam giác ghép: ABD → 1.', '2 + 1 = 3 hình tam giác.'] }),
      () => {
        if (Math.random() < 0.5) return Q.so('Hình dưới đây có bao nhiêu hình tam giác?', 6, { hinh: { kieu: 'quat', k: 4 }, goiY: [{ hoi: 'Có mấy tam giác đơn?', dap: 3 }, { hoi: 'Ghép 2 tam giác đơn được mấy hình?', dap: 2 }, { hoi: 'Ghép 3 tam giác đơn được mấy hình?', dap: 1 }], loiGiai: ['3 + 2 + 1 = 6 hình tam giác.'] });
        const k = 3; return Q.so('Hình dưới đây có bao nhiêu hình tứ giác?', 6, { hinh: { kieu: 'oDoc', k }, goiY: [{ hoi: 'Có mấy hình đơn?', dap: 3 }, { hoi: 'Ghép 2 hình đơn liền nhau được mấy hình?', dap: 2 }, { hoi: 'Ghép cả 3 được mấy hình?', dap: 1 }], loiGiai: ['3 + 2 + 1 = 6 hình tứ giác.'] });
      },
      () => {
        const k = n(4, 5), tg = Math.random() < 0.5, soDon = tg ? k : k;
        const kq = soDon * (soDon + 1) / 2;
        const goi = lap(soDon, i => ({ hoi: i === 0 ? 'Có mấy hình đơn?' : `Ghép ${i + 1} hình đơn liền nhau được mấy hình?`, dap: soDon - i }));
        return Q.so(`Hình dưới đây có bao nhiêu hình ${tg ? 'tam giác' : 'tứ giác'}?`, kq, { hinh: tg ? { kieu: 'quat', k: k + 1 } : { kieu: 'oDoc', k }, goiY: goi.slice(0, 3).concat(['Cộng tất cả lại.']), loiGiai: [lap(soDon, i => soDon - i).join(' + ') + ` = ${kq}`], saiThuong: { [soDon]: 'Con mới đếm hình đơn thôi. Còn các hình ghép nữa.' } });
      }
    ]
  });

  /* ================= Hình khối (Chủ đề 9) ================= */
  const KHOI = { tru: 'khối trụ', cau: 'khối cầu', lapPhuong: 'khối lập phương', hopCN: 'khối hộp chữ nhật' };
  const DO_VAT = [['🥫', 'tru', 'Lon sữa'], ['🕯️', 'tru', 'Cây nến'], ['⚽', 'cau', 'Quả bóng'], ['🏀', 'cau', 'Quả bóng rổ'], ['🎲', 'lapPhuong', 'Con xúc xắc'], ['🧊', 'lapPhuong', 'Viên đá'], ['📦', 'hopCN', 'Hộp quà'], ['🧱', 'hopCN', 'Viên gạch']];
  CT.them({
    id: 'hinh-khoi', dao: 'hinh', ten: 'Khối trụ, khối cầu', bieu: '🧊',
    ghiNho: `<p><b>Khối trụ</b>: có hai mặt tròn ở hai đầu, lăn được (lon sữa, cây nến).</p>
      <p><b>Khối cầu</b>: tròn đều mọi phía, lăn về mọi hướng (quả bóng).</p>
      <p>Lớp 1 con đã học: khối lập phương (xúc xắc), khối hộp chữ nhật (hộp quà).</p>`,
    cap: [
      () => { const k = c(Object.keys(KHOI)), ds = tron(Object.keys(KHOI)); return Q.chon('Đây là khối gì?', ds.map(x => hoa(KHOI[x])), ds.indexOf(k), { hinh: { kieu: 'khoi3d', ten: k, co: 120 }, loiGiai: [`Đây là ${KHOI[k]}.`] }); },
      () => {
        const k = c(['tru', 'cau']), dung = c(DO_VAT.filter(d => d[1] === k)), sai = tron(DO_VAT.filter(d => d[1] !== k)).slice(0, 3);
        const ds = [dung].concat(sai);
        return Q.chon(`Đồ vật nào có dạng <b>${KHOI[k]}</b>?`, ds.map(d => `<span class="bieu-to">${d[0]}</span><br>${d[2]}`), 0, { cot: 4, loiGiai: [`${dung[2]} có dạng ${KHOI[k]}.`] });
      },
      () => {
        const ds = lap(7, () => c(['tru', 'cau', 'lapPhuong', 'hopCN'])); if (!ds.includes('tru')) ds[0] = 'tru'; if (!ds.includes('cau')) ds[1] = 'cau';
        const tru = ds.filter(x => x === 'tru').length, cau = ds.filter(x => x === 'cau').length;
        return Q.o('Đếm số khối:<div class="dong-tinh">Khối trụ: [[0]] &nbsp; Khối cầu: [[1]]</div>', [tru, cau], {
          hinh: { kieu: 'chu', chu: `<div class="hang-khoi">${ds.map(x => HV.khoi3d(x, 64)).join('')}</div>` },
          goiY: ['Khối trụ có mặt tròn ở trên và hai cạnh thẳng hai bên. Khối cầu tròn hoàn toàn.'], loiGiai: [`Có ${tru} khối trụ và ${cau} khối cầu.`]
        });
      }
    ]
  });

  /* ================= Xem đồng hồ ================= */
  const docGio = (g, p) => p === 0 ? `${g} giờ` : p === 30 ? `${g} giờ 30 phút` : `${g} giờ ${p} phút`;
  CT.them({
    id: 'xem-dong-ho', dao: 'gio', ten: 'Xem đồng hồ', bieu: '🕐',
    ghiNho: `<p><b>Kim ngắn</b> chỉ giờ. <b>Kim dài</b> chỉ phút.</p>
      <p>Kim dài chỉ số 12 → giờ đúng (8 giờ). Kim dài chỉ số 3 → 15 phút. Kim dài chỉ số 6 → 30 phút (còn gọi là giờ rưỡi).</p>
      <p>Mỗi số trên mặt đồng hồ, kim dài đi qua là 5 phút.</p>`,
    cap: [
      () => {
        const g = n(1, 12), p = c([0, 30]);
        if (Math.random() < 0.5) {
          const sai = new Set(); while (sai.size < 3) { const g2 = n(1, 12), p2 = c([0, 30]); if (g2 !== g || p2 !== p) sai.add(docGio(g2, p2)); }
          return Q.chon('Đồng hồ chỉ mấy giờ?', [docGio(g, p)].concat([...sai]), 0, { hinh: { kieu: 'dongHo', gio: g, phut: p }, goiY: ['Nhìn kim ngắn trước để biết giờ, rồi nhìn kim dài.'], loiGiai: [`Kim ngắn chỉ ${p ? 'quá số ' + g : 'số ' + g}, kim dài chỉ số ${p ? 6 : 12}: ${docGio(g, p)}.`] });
        }
        return Q.dongHo(`Kéo kim (hoặc bấm nút) để đồng hồ chỉ <b>${docGio(g, p)}</b>.`, g, p, { buocPhut: 30, goiY: ['Kim dài chỉ số 12 nếu là giờ đúng, chỉ số 6 nếu là 30 phút.'], loiGiai: [`Kim ngắn chỉ ${p ? 'giữa số ' + g + ' và số ' + (g % 12 + 1) : 'số ' + g}, kim dài chỉ số ${p ? 6 : 12}.`] });
      },
      () => {
        const g = n(1, 12), p = c([0, 15, 30]);
        if (Math.random() < 0.5) {
          const sai = new Set([docGio(g, p === 15 ? 30 : 15), docGio(g % 12 + 1, p), docGio(p === 15 ? 3 : g, 0)].filter(x => x !== docGio(g, p)));
          while (sai.size < 3) { const g2 = n(1, 12), p2 = c([0, 15, 30]); if (g2 !== g || p2 !== p) sai.add(docGio(g2, p2)); }
          return Q.chon('Đồng hồ chỉ mấy giờ?', [docGio(g, p)].concat([...sai].slice(0, 3)), 0, { hinh: { kieu: 'dongHo', gio: g, phut: p }, goiY: ['Kim dài chỉ số 3 là 15 phút, chỉ số 6 là 30 phút.'], loiGiai: [`Đồng hồ chỉ ${docGio(g, p)}.`] });
        }
        return Q.dongHo(`Kéo kim (hoặc bấm nút) để đồng hồ chỉ <b>${docGio(g, p)}</b>.`, g, p, { buocPhut: 5, goiY: ['15 phút: kim dài chỉ số 3.'], loiGiai: [`Kim dài chỉ số ${p / 5 || 12}.`] });
      },
      () => {
        const g = n(1, 9), them = n(2, 3), p = c([0, 30]);
        if (Math.random() < 0.5) return Q.dongHo(`Bây giờ là <b>${docGio(g, p)}</b>. Kéo kim để đồng hồ chỉ thời gian <b>${them} giờ sau</b>.`, g + them, p, { buocPhut: 5, hinh: { kieu: 'dongHo', gio: g, phut: p, co: 130 }, goiY: [{ hoi: `${g} + ${them} = ? (giờ)`, dap: g + them }, 'Kim dài vẫn chỉ đúng vị trí cũ.'], loiGiai: [`${them} giờ sau là ${docGio(g + them, p)}.`] });
        const tr = c([['kim ngắn chỉ số ' + g + ', kim dài chỉ số 12', docGio(g, 0)], ['kim ngắn chỉ giữa số ' + g + ' và số ' + (g + 1) + ', kim dài chỉ số 6', docGio(g, 30)], ['kim ngắn chỉ quá số ' + g + ' một chút, kim dài chỉ số 3', docGio(g, 15)]]);
        const sai = [docGio(g, 0), docGio(g, 30), docGio(g, 15), docGio(g + 1, 30)].filter(x => x !== tr[1]).slice(0, 3);
        return Q.chon(`Đồng hồ có ${tr[0]}. Đồng hồ chỉ:`, [tr[1]].concat(sai), 0, { goiY: ['Kim dài chỉ số mấy thì là bao nhiêu phút? Số 3 → 15 phút, số 6 → 30 phút, số 12 → 0 phút.'], loiGiai: [`Đồng hồ chỉ ${tr[1]}.`] });
      }
    ]
  });

  /* ================= Ngày – giờ ================= */
  CT.them({
    id: 'ngay-gio', dao: 'gio', ten: 'Ngày, giờ, phút', bieu: '🌗',
    ghiNho: `<p><b>1 ngày có 24 giờ</b>. <b>1 giờ = 60 phút</b>.</p>
      <p>Buổi chiều, buổi tối có thể gọi theo hai cách: 13 giờ = 1 giờ chiều; 15 giờ = 3 giờ chiều; 18 giờ = 6 giờ tối; 21 giờ = 9 giờ tối.</p>
      <p>Mẹo: giờ lớn hơn 12 thì <b>trừ đi 12</b> để ra giờ chiều/tối.</p>`,
    cap: [
      () => c([
        () => { const g = n(13, 23), kq = g - 12; return Q.so(`${g} giờ còn gọi là mấy giờ ${g < 18 ? 'chiều' : 'tối'}?`, kq, { donVi: `giờ ${g < 18 ? 'chiều' : 'tối'}`, goiY: ['Lấy số giờ trừ đi 12.'], loiGiai: [`${g} − 12 = ${kq}: ${kq} giờ ${g < 18 ? 'chiều' : 'tối'}.`] }); },
        () => Q.o('<div class="dong-tinh">1 ngày = [[0]] giờ &nbsp; 1 giờ = [[1]] phút</div>', [24, 60], { loiGiai: ['1 ngày có 24 giờ, 1 giờ có 60 phút.'] })
      ])(),
      () => c([
        () => { const g = n(1, 11), toi = g >= 6 ? 'tối' : 'chiều', ds = [`${g + 12} giờ`, `${g} giờ`, `${g + 10} giờ`, `${g + 2} giờ`]; return Q.chon(`${g} giờ ${toi} còn gọi là:`, ds, 0, { goiY: ['Giờ chiều, tối thì cộng thêm 12.'], loiGiai: [`${g} + 12 = ${g + 12}: ${g + 12} giờ.`] }); },
        () => { const bd = n(6, 14), dai = n(2, 4); return Q.so(`Buổi học bắt đầu lúc ${bd} giờ và kéo dài ${dai} giờ. Hỏi buổi học kết thúc lúc mấy giờ?`, bd + dai, { donVi: 'giờ', loiGiai: [`${bd} + ${dai} = ${bd + dai} (giờ)`] }); }
      ])(),
      () => c([
        () => { const s = n(6, 9), cc = n(1, 5), cg = cc + 12; return Q.so(`Từ ${s} giờ sáng đến ${cc} giờ chiều cùng ngày là bao nhiêu giờ?`, cg - s, { donVi: 'giờ', goiY: [{ hoi: `${cc} giờ chiều là mấy giờ?`, dap: cg }, `Lấy ${cg} − ${s}.`], loiGiai: [`${cc} giờ chiều là ${cg} giờ.`, `${cg} − ${s} = ${cg - s} (giờ)`], saiThuong: { [Math.abs(s - cc)]: `Phải đổi ${cc} giờ chiều thành ${cg} giờ trước.` } }); },
        () => { const di = n(6, 8), ve = n(16, 18); return Q.so(`Bố đi làm lúc ${di} giờ sáng và về nhà lúc ${ve} giờ. Hỏi bố đi vắng bao nhiêu giờ?`, ve - di, { donVi: 'giờ', loiGiai: [`${ve} − ${di} = ${ve - di} (giờ)`] }); }
      ])()
    ]
  });

  /* ================= Xem lịch (ngày thật theo lịch) ================= */
  function thangNgauNhien() { const nam = c([2026, 2027]), thang = n(1, 12); return { nam, thang, so: HV.soNgay(nam, thang) }; }
  CT.them({
    id: 'xem-lich', dao: 'gio', ten: 'Xem lịch', bieu: '📅',
    ghiNho: `<p>Một tuần có <b>7 ngày</b>: thứ hai, thứ ba, thứ tư, thứ năm, thứ sáu, thứ bảy, chủ nhật.</p>
      <p>Cùng một thứ ở tuần sau thì ngày <b>cộng thêm 7</b>. Ví dụ: thứ hai là ngày 5 thì thứ hai tuần sau là ngày 12.</p>
      <p>Tháng có 31 ngày: 1, 3, 5, 7, 8, 10, 12. Tháng có 30 ngày: 4, 6, 9, 11. Tháng 2 có 28 hoặc 29 ngày.</p>`,
    cap: [
      () => {
        const t = thangNgauNhien(), d = n(1, t.so), thu = HV.thu(t.nam, t.thang, d);
        if (Math.random() < 0.5) return Q.so(`Tháng ${t.thang} năm ${t.nam} có bao nhiêu ngày?`, t.so, { donVi: 'ngày', hinh: { kieu: 'lich', nam: t.nam, thang: t.thang }, goiY: ['Nhìn ngày cuối cùng trên tờ lịch.'], loiGiai: [`Ngày cuối cùng là ${t.so}, vậy tháng ${t.thang} có ${t.so} ngày.`] });
        const ds = tron(lap(7, i => i)).filter(x => x !== thu).slice(0, 3);
        return Q.chon(`Ngày ${d} tháng ${t.thang} là thứ mấy?`, [thu].concat(ds).map(HV.tenThu), 0, { hinh: { kieu: 'lich', nam: t.nam, thang: t.thang, danhDau: [d] }, goiY: ['Tìm ngày được tô màu, nhìn lên đầu cột.'], loiGiai: [`Ngày ${d} tháng ${t.thang} năm ${t.nam} là ${HV.tenThu(thu)}.`] });
      },
      () => {
        const t = thangNgauNhien();
        if (Math.random() < 0.5) {
          let d; do { d = n(1, t.so - 7); } while (HV.thu(t.nam, t.thang, d) !== 1);
          return Q.so(`Thứ hai tuần này là ngày ${d} tháng ${t.thang}. Thứ hai tuần sau là ngày bao nhiêu?`, d + 7, { goiY: ['Một tuần có 7 ngày.'], loiGiai: [`${d} + 7 = ${d + 7}`], saiThuong: { [d + 1]: 'Đó là ngày mai (thứ ba). Thứ hai tuần sau thì cách 7 ngày.' } });
        }
        const thu = n(0, 6), dem = lap(t.so, i => i + 1).filter(x => HV.thu(t.nam, t.thang, x) === thu).length;
        return Q.so(`Tháng ${t.thang} năm ${t.nam} có bao nhiêu ngày ${HV.tenThu(thu).toLowerCase()}?`, dem, { hinh: { kieu: 'lich', nam: t.nam, thang: t.thang }, goiY: ['Đếm các ngày trong cùng một cột.'], loiGiai: [`Có ${dem} ngày ${HV.tenThu(thu).toLowerCase()}.`] });
      },
      () => {
        const t = thangNgauNhien(), d = n(1, 12), k = c([7, 14, 3, 10]), d2 = d + k;
        const thu = HV.thu(t.nam, t.thang, d), thu2 = HV.thu(t.nam, t.thang, d2);
        if (Math.random() < 0.6) {
          const ds = [thu2].concat(tron(lap(7, i => i).filter(x => x !== thu2)).slice(0, 3));
          return Q.chon(`Ngày ${d} tháng ${t.thang} năm ${t.nam} là ${HV.tenThu(thu).toLowerCase()}. Hỏi ngày ${d2} tháng đó là thứ mấy?`, ds.map(HV.tenThu), 0, {
            goiY: [`Ngày ${d2} cách ngày ${d} là ${k} ngày.`, k % 7 === 0 ? `${k} ngày là đúng ${k / 7} tuần nên vẫn là thứ cũ.` : `Đếm thêm ${k % 7} ngày sau ${k >= 7 ? 'một tuần' : ''} kể từ ${HV.tenThu(thu).toLowerCase()}.`],
            loiGiai: [`${d2} − ${d} = ${k} ngày.`, `Ngày ${d2} là ${HV.tenThu(thu2).toLowerCase()}.`]
          });
        }
        return Q.so(`Hôm nay là ngày ${d} tháng ${t.thang}. Sinh nhật của Mai là ngày ${d2} tháng ${t.thang}. Hỏi còn mấy ngày nữa đến sinh nhật Mai?`, k, { donVi: 'ngày', loiGiai: [`${d2} − ${d} = ${k} (ngày)`] });
      }
    ]
  });
})();

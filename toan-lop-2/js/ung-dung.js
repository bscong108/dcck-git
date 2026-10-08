/* Ứng dụng: màn hình, màn chơi, chấm sao, gợi ý từng bước, sổ ôn lỗi, góc phụ huynh. */
(function () {
  'use strict';
  const { $, $$, el, esc, luu } = T;
  const BP = KC.banPhim;

  /* ===================================================================
     KHO TIẾN ĐỘ (lưu trong trình duyệt)
     =================================================================== */
  const MAC_HO_SO = { ten: '', avatar: '🐯', xu: 0, sticker: [], chuoi: { ngay: '', so: 0 }, caiDat: { soCau: 6, moKhoa: false, docTo: false, amThanh: true } };
  const TD = {
    hs: Object.assign({}, MAC_HO_SO, luu.doc('hoSo', {})),
    man: luu.doc('man', {}),            // 'dang:cap' | 'phieu:id' → {sao, lan, dung, tong}
    tk: luu.doc('thongKe', {}),         // dang → {dung, tong, goiY, sai}
    soLoi: luu.doc('soLoi', []),
    nhatKy: luu.doc('nhatKy', []),
    thuThach: luu.doc('thuThach', {}),
    kyLuc: luu.doc('kyLuc', {}),
    daXemBK: luu.doc('daXemBK', {}),
    ghi() {
      luu.ghi('hoSo', this.hs); luu.ghi('man', this.man); luu.ghi('thongKe', this.tk); luu.ghi('soLoi', this.soLoi.slice(0, 80));
      luu.ghi('nhatKy', this.nhatKy.slice(0, 400)); luu.ghi('thuThach', this.thuThach); luu.ghi('kyLuc', this.kyLuc); luu.ghi('daXemBK', this.daXemBK);
    },
    sao(k) { return (this.man[k] && this.man[k].sao) || 0; }
  };
  TD.hs.caiDat = Object.assign({}, MAC_HO_SO.caiDat, TD.hs.caiDat || {});
  T.am.bat = TD.hs.caiDat.amThanh !== false;

  const STICKER = '🐶🐱🐭🐹🐰🦊🐻🐼🐨🐯🦁🐮🐷🐸🐵🐔🐧🐦🐤🦆🦉🦄🐝🦋🐞🐢🐍🦖🐙🦀🐠🐬🐳🦈🐊🦓🦒🐘🦛🦏🐪🦘🐿️🦔🦜🦚🦩🐉'.match(/\p{Extended_Pictographic}️?/gu);
  const AVATAR = ['🐯', '🐼', '🐰', '🦊', '🐸', '🐵', '🦄', '🐧'];

  /* Phiếu: phiếu có sẵn + phiếu phụ huynh thêm trong ứng dụng */
  let PHIEU = { ds: [], loi: [] };
  /* Nhóm phiếu theo tên (phần trước dấu “·”). */
  const NHOM_PHIEU = [
    ['on-he', 'Ôn tập hè', '☀️', /^Ôn hè/],
    ['nc-he', 'Nâng cao hè', '🌻', /^Nâng cao hè/],
    ['tuan', 'Phiếu tuần · Kiểm tra cuối tuần', '🗓️', /^(Lớp 2 ·|Lớp 2Q|OLM|Cuối tuần|Kiểm tra cuối tuần)/],
    ['nc', 'Phiếu nâng cao lớp 2Q', '🚀', /^(Nâng cao lớp 2Q|Nâng cao Khối 2|Tăng cường|Tuần \d|Phiếu tự luận)/],
    ['cd', 'Chuyên đề', '🎯', /^Chuyên đề/],
    ['lt', 'Phiếu luyện tập', '✏️', /^(Luyện tập|Mathematics)/],
    ['td', 'Toán tư duy', '🧩', /^Tư duy/],
    ['th', 'Ôn tập tổng hợp', '🏆', /^Ôn tập tổng hợp/],
    ['them', 'Bài bố mẹ thêm', '👪', /./]
  ];
  const CO_PHAN = 10;                         // phiếu dài được chia thành từng phần ≤ 10 câu
  function chiaPhan(p) {
    const n = p.cau.length, soPhan = Math.max(1, Math.ceil(n / CO_PHAN)), co = Math.ceil(n / soPhan), ds = [];
    for (let i = 0; i < n; i += co) ds.push([i, Math.min(n, i + co)]);
    return ds;
  }
  function khoaPhan(p, k) { return chiaPhan(p).length > 1 ? `phieu:${p.id}:${k}` : 'phieu:' + p.id; }
  function saoPhieu(p) { const ph = chiaPhan(p); return { co: ph.reduce((s, _, k) => s + TD.sao(khoaPhan(p, k)), 0), max: ph.length * 3 }; }
  const tenNgan = p => p.id.startsWith('lop-') ? p.ten.replace(/^[^·]*·\s*/, '') : p.ten;
  function napPhieu() {
    const lop = VB.phanTich(window.PHIEU_TREN_LOP || '');
    const goc = VB.phanTich(window.PHIEU_CUA_CO || '');
    const them = VB.phanTich(luu.doc('phieuThem', ''));
    lop.ds.forEach(p => { p.coSan = true; p.id = 'lop-' + p.id; });
    goc.ds.forEach(p => { p.coSan = true; });
    them.ds.forEach(p => { p.id = 'them-' + p.id; p.nhom = 'them'; });
    PHIEU = { ds: lop.ds.concat(goc.ds, them.ds), loi: lop.loi.concat(goc.loi, them.loi) };
    PHIEU.ds.forEach(p => { if (!p.nhom) p.nhom = NHOM_PHIEU.find(n => n[3].test(p.ten))[0]; });
  }

  /* ===================================================================
     TIỆN ÍCH GIAO DIỆN
     =================================================================== */
  const app = () => $('#app');
  function man(html, lop) {
    T.dungDoc(); BP.chon(null); BP.hien(false);
    $$('.phao-hoa, .hop-thoai-nen').forEach(x => x.remove());
    app().className = 'man ' + (lop || '');
    app().innerHTML = html;
    window.scrollTo(0, 0);
  }
  function thongBao(chu, loai) {
    const t = $('#thong-bao'); t.textContent = chu; t.className = 'hien ' + (loai || '');
    clearTimeout(t._h); t._h = setTimeout(() => { t.className = ''; }, 2600);
  }
  const saoHtml = (s, max) => Array.from({ length: max || 3 }, (_, i) => `<i class="${i < s ? 'co' : ''}">★</i>`).join('');
  function hopThoai(html, lop) {
    const h = el(`<div class="hop-thoai-nen" role="dialog" aria-modal="true"><div class="hop-thoai ${lop || ''}"><button class="ht-dong" aria-label="Đóng">✕</button>${html}</div></div>`);
    document.body.appendChild(h);
    const dong = () => h.remove();
    h.addEventListener('click', e => { if (e.target === h || e.target.closest('.ht-dong')) dong(); });
    return { goc: h, dong };
  }
  const BON_BUOC = `<div class="bon-buoc"><b>Bốn bước suy nghĩ</b><ol>
    <li><b>Đọc</b> đề hai lần. Bấm 🔊 để nghe nếu cần.</li>
    <li><b>Hiểu</b>: bài cho biết gì? hỏi gì? Có số đặc biệt nào cần tìm trước không?</li>
    <li><b>Làm</b> từng bước nhỏ. Ra nháp nếu số lớn.</li>
    <li><b>Kiểm tra</b>: thử lại kết quả, xem có hợp lí không.</li></ol></div>`;
  const nguonNgan = p => (p.nguon || '').split(/\.\s+(?=Kiến thức|Cách giải|Bỏ |Ví dụ|New words|Dạng)/)[0];
  const kienThucPhieu = p => { const t = (p.nguon || '').slice(nguonNgan(p).length).replace(/^\.\s*/, ''); return /Kiến thức|Cách giải|Ví dụ|New words|Dạng/.test(t) ? t.replace(/Bỏ [^.]*vì cần hình gốc\.?/g, '').trim() : ''; };
  function moBiKip(idDang) {
    const d = CT.dang[idDang];
    const p = !d && P && P.spec.kieu === 'phieu' ? PHIEU.ds.find(x => x.id === P.spec.id) : null;
    const kt = p ? kienThucPhieu(p) : '';
    hopThoai(`<h2>📖 Bí kíp${d ? ': ' + d.ten : p ? ': ' + esc(tenNgan(p)) : ''}</h2>${d ? `<div class="bk-noi-dung">${d.ghiNho}</div>` : ''}${kt ? `<div class="bk-noi-dung"><p><b>Kiến thức trên phiếu của cô</b></p><p>${esc(kt)}</p></div>` : ''}${BON_BUOC}`, 'bk');
    if (d) { TD.daXemBK[idDang] = true; TD.ghi(); }
  }
  function capNhatChuoi() {
    const h = T.homNay(), c = TD.hs.chuoi;
    if (c.ngay === h) return;
    const d = new Date(Date.now() - 864e5);
    const homQua = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    c.so = c.ngay === homQua ? c.so + 1 : 1; c.ngay = h;
  }

  /* ===================================================================
     MỞ KHOÁ MÀN
     =================================================================== */
  function moKhoa(idDang, cap) {
    if (TD.hs.caiDat.moKhoa) return true;
    const d = CT.dang[idDang], dao = CT.timDao(d.dao), vt = dao.dang.indexOf(idDang);
    if (cap === 1) return vt === 0 || TD.sao(dao.dang[vt - 1] + ':1') >= 1;
    return TD.sao(idDang + ':' + (cap - 1)) >= 1;
  }
  function tienDoDao(dao) {
    const max = dao.dang.length * 9;
    const co = dao.dang.reduce((s, id) => s + [1, 2, 3].reduce((t, c) => t + TD.sao(id + ':' + c), 0), 0);
    return { co, max };
  }

  /* ===================================================================
     MÀN HÌNH: HỒ SƠ LẦN ĐẦU
     =================================================================== */
  function veHoSo(sua) {
    man(`<div class="khung hop-giua"><div class="the-lon chao">
      <div class="logo-dao" aria-hidden="true">🏝️</div>
      <h1>Đảo Toán Lớp 2</h1>
      <p>Mỗi hòn đảo là một chủ đề trong sách Toán 2. Con giải toán để nhận sao, mở màn mới và sưu tập thú cưng.</p>
      <label for="ten-be">Con tên là gì?</label>
      <input id="ten-be" maxlength="20" value="${esc(TD.hs.ten)}" placeholder="Ví dụ: Minh Anh" autocomplete="off">
      <div class="nhan-ghi">Chọn bạn đồng hành:</div>
      <div class="chon-avatar">${AVATAR.map(a => `<button class="av${a === TD.hs.avatar ? ' bat' : ''}" data-a="${a}">${a}</button>`).join('')}</div>
      <button class="nut nut-chinh nut-to" id="bat-dau">${sua ? 'Lưu' : 'Bắt đầu phiêu lưu ➜'}</button></div></div>`, 'man-ho-so');
    $$('.av').forEach(b => b.addEventListener('click', () => { $$('.av').forEach(x => x.classList.remove('bat')); b.classList.add('bat'); TD.hs.avatar = b.dataset.a; }));
    $('#bat-dau').addEventListener('click', () => {
      T.am.mo();
      TD.hs.ten = $('#ten-be').value.trim() || 'Bạn nhỏ'; TD.ghi(); veTrangChu();
    });
  }

  /* ===================================================================
     MÀN HÌNH: TRANG CHỦ
     =================================================================== */
  function veTrangChu() {
    napPhieu();
    const h = TD.hs, homNay = T.homNay(), daThuThach = TD.thuThach[homNay];
    const thang = new Date().getMonth() + 1, hkNay = thang >= 8 || thang <= 1 ? 1 : 2;
    man(`<div class="khung">
      <header class="dau-trang">
        <button class="ho-so-nho" id="nut-ho-so" aria-label="Đổi tên, đổi bạn đồng hành"><span class="av-to">${h.avatar}</span><span><b>${esc(h.ten)}</b><small>Học kì ${hkNay} · lớp 2</small></span></button>
        <div class="chi-so"><span title="Sao đã có">⭐ <b>${h.xu}</b></span><span title="Số ngày học liên tiếp">🔥 <b>${h.chuoi.so || 0}</b></span><span title="Thú cưng sưu tập">🎁 <b>${h.sticker.length}</b></span></div>
      </header>
      <section class="hero">
        <div class="hero-chu"><h1>Hôm nay mình học gì?</h1><p>Làm phiếu cô giao trên lớp, hoặc luyện thêm trên các hòn đảo.</p></div>
        <div class="hero-nut">
          <button class="the-nhanh tt" id="nut-thu-thach"><span class="tn-bieu">🎯</span><b>Thử thách hôm nay</b><small>${daThuThach != null ? 'Đã làm · ' + saoHtml(daThuThach) : '8 câu trộn: dạng bài và đề trên lớp'}</small></button>
          <button class="the-nhanh pc" id="nut-phieu"><span class="tn-bieu">📄</span><b>Phiếu trên lớp</b><small>${PHIEU.ds.length} phiếu · ${PHIEU.ds.reduce((s, p) => s + p.cau.length, 0)} câu đề thật</small></button>
          <button class="the-nhanh ol" id="nut-loi"><span class="tn-bieu">🩹</span><b>Ôn lỗi sai</b><small>${TD.soLoi.length ? TD.soLoi.length + ' câu cần ôn' : 'Chưa có câu nào'}</small></button>
        </div>
      </section>
      <h2 class="tieu-de-muc">Bản đồ các đảo</h2>
      <div class="ban-do">${CT.dao.map(d => { const t = tienDoDao(d); return `<button class="dao-the${d.hk === hkNay ? ' hk-nay' : ''}" data-id="${d.id}" style="--mau:${d.mau}">
        <span class="dao-bieu">${d.bieu}</span><span class="dao-chu"><b>${d.ten}</b><small>${d.cd}</small>
        <span class="thanh-tien"><i style="width:${t.max ? Math.round(t.co / t.max * 100) : 0}%"></i></span><small class="dao-sao">★ ${t.co}/${t.max} · ${d.dang.length} dạng bài</small></span>
        ${d.hk ? `<span class="nhan-hk">HK${d.hk}</span>` : '<span class="nhan-hk tt">Tư duy</span>'}</button>`; }).join('')}</div>
      <div class="hang-phu">
        <button class="nut-phu-to" id="nut-tia-chop">⚡ Tia chớp tính nhẩm</button>
        <button class="nut-phu-to" id="nut-bi-kip">📖 Sổ bí kíp</button>
        <button class="nut-phu-to" id="nut-album">🎁 Bộ sưu tập</button>
        <button class="nut-phu-to" id="nut-phu-huynh">👪 Góc phụ huynh</button>
      </div>
      <footer class="chan">Bám theo chương trình Toán 2 (Cánh Diều) và các phiếu nâng cao bé được giao trên lớp.</footer>
    </div>`, 'man-chu');
    $$('.dao-the').forEach(b => b.addEventListener('click', () => veDao(b.dataset.id)));
    $('#nut-ho-so').addEventListener('click', () => veHoSo(true));
    $('#nut-thu-thach').addEventListener('click', () => batDau({ kieu: 'ngay' }));
    $('#nut-phieu').addEventListener('click', veDsPhieu);
    $('#nut-loi').addEventListener('click', () => { if (TD.soLoi.length) batDau({ kieu: 'loi' }); else thongBao('Chưa có câu nào cần ôn. Giỏi quá!'); });
    $('#nut-tia-chop').addEventListener('click', veTiaChopChon);
    $('#nut-bi-kip').addEventListener('click', veSoBiKip);
    $('#nut-album').addEventListener('click', veAlbum);
    $('#nut-phu-huynh').addEventListener('click', cuaPhuHuynh);
  }

  /* ===================================================================
     MÀN HÌNH: MỘT HÒN ĐẢO
     =================================================================== */
  function veDao(id) {
    const dao = CT.timDao(id);
    man(`<div class="khung">
      <header class="thanh-tren"><button class="nut-ve" id="ve">← Về bản đồ</button><div class="tt-giua"><b>${dao.bieu} ${dao.ten}</b><small>${dao.cd}</small></div></header>
      <ol class="duong-dao" style="--mau:${dao.mau}">${dao.dang.map((idD, k) => {
        const d = CT.dang[idD];
        return `<li class="tram${k % 2 ? ' phai' : ''}"><div class="tram-dau"><span class="tram-bieu">${d.bieu}</span><div class="tram-ten"><small>Trạm ${k + 1}</small><b>${d.ten}</b></div><button class="nut-bk" data-d="${idD}" aria-label="Bí kíp ${esc(d.ten)}">📖 Bí kíp</button></div>
          <div class="tram-cap">${[1, 2, 3].map(c => { const mo = moKhoa(idD, c), s = TD.sao(idD + ':' + c); return `<button class="cap c${c}${mo ? '' : ' khoa'}" data-d="${idD}" data-c="${c}" ${mo ? '' : 'aria-disabled="true"'}><span>${mo ? '' : '🔒 '}${CT.TEN_CAP[c]}</span><span class="sao">${saoHtml(s)}</span></button>`; }).join('')}</div></li>`;
      }).join('')}</ol>
      <p class="ghi-chu giua">Qua màn (được ít nhất 1 ★) để mở màn tiếp theo. Bố mẹ có thể mở khoá tất cả trong Góc phụ huynh.</p></div>`, 'man-dao');
    $('#ve').addEventListener('click', veTrangChu);
    $$('.nut-bk').forEach(b => b.addEventListener('click', () => moBiKip(b.dataset.d)));
    $$('.cap').forEach(b => b.addEventListener('click', () => {
      if (b.classList.contains('khoa')) { thongBao('Con hãy qua màn trước để mở màn này nhé!'); return; }
      batDau({ kieu: 'dang', id: b.dataset.d, cap: Number(b.dataset.c) });
    }));
  }

  /* ===================================================================
     MÀN HÌNH: DANH SÁCH PHIẾU CỦA CÔ
     =================================================================== */
  function veDsPhieu(moNhom) {
    napPhieu();
    const nhomCo = NHOM_PHIEU.filter(n => PHIEU.ds.some(p => p.nhom === n[0]));
    const daMo = moNhom || luu.doc('nhomMo', nhomCo.length ? nhomCo[0][0] : '');
    man(`<div class="khung">
      <header class="thanh-tren"><button class="nut-ve" id="ve">← Về</button><div class="tt-giua"><b>📄 Phiếu trên lớp</b><small>${PHIEU.ds.length} phiếu · ${PHIEU.ds.reduce((s, p) => s + p.cau.length, 0)} câu · chép đúng đề cô giao</small></div></header>
      ${nhomCo.map(([id, ten, bieu]) => {
        const ds = PHIEU.ds.filter(p => p.nhom === id), t = ds.reduce((a, p) => { const x = saoPhieu(p); return { co: a.co + x.co, max: a.max + x.max }; }, { co: 0, max: 0 });
        return `<details class="nhom-phieu" data-nhom="${id}" ${id === daMo ? 'open' : ''}><summary><span class="np-bieu">${bieu}</span><span class="np-ten"><b>${ten}</b><small>${ds.length} phiếu · ${ds.reduce((s, p) => s + p.cau.length, 0)} câu</small></span><span class="np-sao">★ ${t.co}/${t.max}</span></summary>
          <div class="ds-phieu">${ds.map(p => { const ph = chiaPhan(p); return `<div class="phieu-the"><span class="ph-chu"><b>${esc(tenNgan(p))}</b><small>${esc(nguonNgan(p) || (p.coSan ? '' : 'Bố mẹ thêm'))}${kienThucPhieu(p) ? ' · 📖 có kiến thức cần nhớ' : ''}</small></span>
            <span class="ph-phan">${ph.map(([a, b], k) => `<button class="nut-phan" data-id="${p.id}" data-k="${k}" aria-label="${ph.length > 1 ? 'Phần ' + (k + 1) : 'Làm phiếu'}"><span>${ph.length > 1 ? 'Phần ' + (k + 1) : 'Làm bài'}</span><small>${b - a} câu</small><span class="sao">${saoHtml(TD.sao(khoaPhan(p, k)))}</span></button>`).join('')}</span></div>`; }).join('')}</div></details>`;
      }).join('') || '<p>Chưa có phiếu nào.</p>'}
      <p class="ghi-chu giua">Đề chép từ phiếu thật trên lớp; gợi ý và cách giải do ứng dụng soạn. Bố mẹ thêm phiếu mới ở <b>Góc phụ huynh → Thêm bài</b>.</p></div>`);
    $('#ve').addEventListener('click', veTrangChu);
    $$('.nhom-phieu').forEach(d => d.addEventListener('toggle', () => { if (d.open) luu.ghi('nhomMo', d.dataset.nhom); }));
    $$('.nut-phan').forEach(b => b.addEventListener('click', () => batDau({ kieu: 'phieu', id: b.dataset.id, phan: Number(b.dataset.k) })));
  }

  /* ===================================================================
     TẠO MỘT LƯỢT CHƠI
     =================================================================== */
  const sao = o => JSON.parse(JSON.stringify(o));
  function sinhKhongTrung(id, cap, soCau) {
    const ds = [], dau = new Set();
    for (let lan = 0; ds.length < soCau && lan < soCau * 12; lan++) {
      const q = CT.sinh(id, cap), k = q.de + JSON.stringify(q.hinh || '') + JSON.stringify(q.luaChon || '');
      if (!dau.has(k)) { dau.add(k); ds.push(q); }
    }
    return ds;
  }
  function chonThuThach() {
    const thang = new Date().getMonth() + 1, hk = thang >= 8 || thang <= 1 ? 1 : 2;
    let dsDang = CT.dao.filter(d => d.hk === 0 || d.hk <= hk).flatMap(d => d.dang);
    const daChoi = dsDang.filter(id => TD.sao(id + ':1') > 0);
    if (daChoi.length >= 4) dsDang = daChoi.concat(T.tron(dsDang).slice(0, 2));
    const ds = [];
    const tuPhieu = T.tron(PHIEU.ds.filter(p => p.coSan && saoPhieu(p).co < saoPhieu(p).max).flatMap(p => p.cau.filter(q => q.loai !== 'tuCham'))).slice(0, 3);
    T.tron(dsDang).slice(0, 8 - tuPhieu.length).forEach(id => {
      const cap = Math.min(3, 1 + [1, 2, 3].filter(c => TD.sao(id + ':' + c) >= 2).length);
      ds.push(CT.sinh(id, cap));
    });
    tuPhieu.forEach(q => ds.splice(T.n(0, ds.length), 0, sao(q)));
    return ds;
  }
  let P = null;          // lượt chơi hiện tại
  function batDau(spec) {
    T.am.mo();
    let ds = [], ten = '', phu = '';
    if (spec.kieu === 'dang') {
      const d = CT.dang[spec.id];
      ds = sinhKhongTrung(spec.id, spec.cap, TD.hs.caiDat.soCau || 6);
      ten = d.ten; phu = CT.TEN_CAP[spec.cap];
      if (!TD.daXemBK[spec.id]) setTimeout(() => moBiKip(spec.id), 250);
    } else if (spec.kieu === 'phieu') {
      const p = PHIEU.ds.find(x => x.id === spec.id); if (!p) return veDsPhieu();
      const ph = chiaPhan(p), [a, b] = ph[spec.phan || 0] || ph[0];
      if (kienThucPhieu(p) && !(spec.phan || 0) && !TD.daXemBK['phieu:' + p.id]) { TD.daXemBK['phieu:' + p.id] = true; TD.ghi(); setTimeout(() => moBiKip(null), 250); }
      ds = sao(p.cau.slice(a, b)); ten = tenNgan(p); phu = ph.length > 1 ? `Phần ${(spec.phan || 0) + 1}/${ph.length} · câu ${a + 1}–${b}` : 'Phiếu trên lớp';
    } else if (spec.kieu === 'loi') {
      ds = TD.soLoi.slice(0, 8).map(x => sao(x.q)); ten = 'Ôn lỗi sai'; phu = 'Làm lại cho thật vững';
    } else if (spec.kieu === 'ngay') {
      ds = chonThuThach(); ten = 'Thử thách hôm nay'; phu = 'Trộn nhiều dạng';
    }
    ds.forEach(q => { delete q._thuTu; });
    P = { spec, ten, phu, ds, i: 0, kq: [], batDau: Date.now() };
    veCau();
  }

  /* ===================================================================
     MÀN CHƠI MỘT CÂU
     =================================================================== */
  let S = null;          // trạng thái câu hiện tại
  const KHEN = ['Đúng rồi! Giỏi quá!', 'Chính xác!', 'Tuyệt vời!', 'Con làm rất tốt!', 'Hoan hô!', 'Đúng rồi, con suy nghĩ giỏi lắm!'];
  const VIEN = ['Chưa đúng. Con đọc lại đề thật chậm nhé.', 'Gần được rồi! Con kiểm tra lại từng bước xem.', 'Chưa đúng. Thử dùng gợi ý 💡 xem sao.', 'Chưa đúng rồi. Con bình tĩnh làm lại nhé.'];

  function veCau() {
    const q = P.ds[P.i];
    S = { q, buoc: 0, the: null, soSai: 0, saiBuoc: 0, goiY: 0, goiYMo: 0, xemDA: false, xong: false, dongGiai: [] };
    const tieuDe = q.dang && CT.dang[q.dang] ? CT.dang[q.dang].ten : P.ten;
    man(`<div class="khung khung-choi">
      <header class="thanh-tren"><button class="nut-ve" id="ve" aria-label="Thoát">✕</button>
        <div class="tt-giua"><b>${esc(P.ten)}</b><small>${esc(P.phu)}${P.spec.kieu !== 'dang' && q.dang ? ' · ' + esc(tieuDe) : ''}</small></div>
        <div class="tt-sao">⭐ <b id="sao-luot">${T.tong(P.kq.map(k => k.sao))}</b></div></header>
      <div class="tien-do" aria-label="Câu ${P.i + 1} trên ${P.ds.length}">${P.ds.map((_, k) => `<i class="${k < P.i ? (P.kq[k].sao ? 'xong' : 'truot') : k === P.i ? 'nay' : ''}"></i>`).join('')}</div>
      <section class="the-cau" id="the-cau">
        <div class="the-cau-dau"><span class="so-cau">Câu ${P.i + 1}/${P.ds.length}</span><span class="nut-nho-ds">
          <button class="nut-tron" id="nut-doc" aria-label="Đọc to đề bài">🔊</button><button class="nut-tron" id="nut-bk" aria-label="Bí kíp">📖</button></span></div>
        <div id="noi-dung-cau"></div>
      </section>
      <div class="phan-hoi" id="phan-hoi" role="status" aria-live="polite"></div>
      <div class="goi-y-ds" id="goi-y-ds"></div>
      <div class="cach-giai" id="cach-giai" hidden></div>
      <div class="thanh-nut" id="thanh-nut">
        <button class="nut nut-goiy" id="nut-goiy">💡 Gợi ý <small id="goi-y-con"></small></button>
        <button class="nut nut-phu" id="nut-xem" hidden>📘 Xem cách giải</button>
        <button class="nut nut-chinh" id="nut-kiem">Kiểm tra</button>
        <button class="nut nut-chinh" id="nut-tiep" hidden>${P.i < P.ds.length - 1 ? 'Câu tiếp ➜' : 'Xem kết quả 🏁'}</button>
      </div></div>`, 'man-choi');
    $('#ve').addEventListener('click', () => xacNhanThoat());
    $('#nut-doc').addEventListener('click', docDe);
    $('#nut-bk').addEventListener('click', () => moBiKip(q.dang));
    $('#nut-goiy').addEventListener('click', moGoiY);
    $('#nut-xem').addEventListener('click', xemCachGiai);
    $('#nut-kiem').addEventListener('click', kiemTra);
    $('#nut-tiep').addEventListener('click', cauTiep);
    veNoiDung();
    if (TD.hs.caiDat.docTo) setTimeout(docDe, 300);
  }

  function cauDangLam() { return S.q.loai === 'nhieuBuoc' ? S.q.buoc[S.buoc] : S.q; }
  function dsGoiY() { const c = cauDangLam(); return (c.goiY && c.goiY.length ? c.goiY : (S.q.goiY || [])); }

  function veNoiDung() {
    const q = S.q, goc = $('#noi-dung-cau');
    if (q.loai === 'nhieuBuoc') {
      goc.innerHTML = `<div class="de">${q.de}</div>${HV.ve(q.hinh)}
        <div class="bai-giai"${S.dongGiai.length ? '' : ' hidden'}><div class="bg-tieu-de">${q.giaiToan ? 'Bài giải' : 'Các bước đã làm'}</div>${S.dongGiai.map(d => `<div class="bg-dong">${d}</div>`).join('')}</div>
        <div class="buoc-cau nhom-o" id="cau-chinh"></div>`;
      const b = q.buoc[S.buoc], k = $('#cau-chinh');
      k.innerHTML = `<div class="de de-buoc">${KC.oTrong(b.de)}</div>${KC.oTrong(HV.ve(b.hinh))}<div class="vung-tra-loi"></div>`;
      S.the = KC.ve(b, k, { nop: nopChon, kiemTra });
    } else {
      goc.innerHTML = `<div class="nhom-o" id="cau-chinh"><div class="de">${KC.oTrong(q.de)}</div>${KC.oTrong(HV.ve(q.hinh))}<div class="vung-tra-loi"></div></div>`;
      S.the = KC.ve(q, $('#cau-chinh'), { nop: nopChon, kiemTra });
    }
    $('#nut-kiem').hidden = !S.the.canKiem;
    capNhatNutGoiY();
  }
  function capNhatNutGoiY() {
    const con = dsGoiY().length - S.goiYMo;
    $('#nut-goiy').hidden = S.xong || con <= 0;
    $('#goi-y-con').textContent = con > 0 ? `(còn ${con})` : '';
  }
  function docDe() {
    const c = cauDangLam();
    const ok = T.docTo((S.q.loai === 'nhieuBuoc' ? S.q.de + '. ' : '') + KC.oTrong(c.de) + (c.luaChon && c.loai === 'chon' ? '. ' + c.luaChon.map((x, i) => String.fromCharCode(65 + i) + '. ' + x).join('. ') : ''));
    if (!ok) thongBao('Máy này chưa có giọng đọc tiếng Việt.');
  }
  function phanHoi(chu, loai) {
    const p = $('#phan-hoi'); p.innerHTML = chu; p.className = 'phan-hoi hien ' + (loai || '');
  }
  function lac(elm) { elm.classList.remove('lac'); void elm.offsetWidth; elm.classList.add('lac'); }

  /* ---- Gợi ý từng bước: có thể là câu hỏi nhỏ để con tự trả lời ---- */
  function moGoiY() {
    const ds = dsGoiY(); if (S.goiYMo >= ds.length) return;
    const g = ds[S.goiYMo++]; S.goiY++;
    T.am.choi('goiy');
    const vung = $('#goi-y-ds');
    const muc = el(`<div class="goi-y"><span class="gy-so">💡 ${S.goiYMo}</span><div class="gy-nd"></div></div>`);
    const nd = $('.gy-nd', muc);
    if (g && typeof g === 'object') {
      muc.classList.add('nhom-o', 'hoi');
      nd.innerHTML = `<div>${g.hoi}</div><div class="gy-tl">${KC.oTrong('[[0]]')}<button class="nut-nho">Thử</button><span class="gy-kq"></span></div>`;
      let sai = 0;
      const o = $('.o-nhap', nd);
      o.dataset.dai = Math.max(4, String(g.dap).length);
      const thu = () => {
        if (o.classList.contains('khoa')) return;
        const v = o.dataset.gt === '' || o.dataset.gt == null ? null : Number(o.dataset.gt);
        if (v == null) return;
        if (v === g.dap) {
          o.classList.add('dung', 'khoa'); $('.gy-kq', nd).textContent = '✔ Đúng! Giờ con làm tiếp nhé.'; T.am.choi('dung');
          const tiep = $$('#cau-chinh .o-nhap:not(.khoa)').find(x => !x.dataset.gt) || $$('#cau-chinh .o-nhap:not(.khoa)')[0];
          BP.chon(tiep || null); if (!tiep) BP.hien(false);
        } else {
          sai++; o.classList.add('sai'); lac(o); T.am.choi('sai');
          if (sai >= 2) { o.dataset.gt = g.dap; o.textContent = g.dap; o.classList.remove('sai'); o.classList.add('lo', 'khoa'); $('.gy-kq', nd).textContent = `Kết quả là ${g.dap}. Con dùng số này để làm tiếp nhé.`; }
          else $('.gy-kq', nd).textContent = 'Thử lại nào!';
        }
      };
      BP.gan(muc, thu);
      $('.nut-nho', nd).addEventListener('click', thu);
      vung.appendChild(muc);
      setTimeout(() => BP.chon(o), 30);
    } else {
      nd.innerHTML = String(g);
      vung.appendChild(muc);
    }
    muc.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    capNhatNutGoiY();
  }

  /* ---- Kiểm tra ---- */
  function kiemTra() {
    if (S.xong || !S.the || !S.the.canKiem) return;
    if (!S.the.daDu()) { phanHoi('Con điền đủ các ô trước đã nhé.', 'nhac'); return; }
    const v = S.the.layGiaTri();
    xuLy(KC.kiem(cauDangLam(), v), v);
  }
  function nopChon(v) { if (S.xong) return; xuLy(KC.kiem(cauDangLam(), v), v); }

  function xuLy(kq, v) {
    const c = cauDangLam();
    S.the.danhDau(kq, v);
    if (kq.dung) {
      if (S.q.loai === 'nhieuBuoc' && S.buoc < S.q.buoc.length - 1) { ghiDongGiai(c); S.buoc++; S.saiBuoc = 0; T.am.choi('dung'); phanHoi('✔ ' + T.c(['Đúng rồi! Sang bước tiếp theo.', 'Chính xác! Làm tiếp nào.']), 'dung'); $('#goi-y-ds').innerHTML = ''; S.goiYMo = 0; veNoiDung(); return; }
      if (S.q.loai === 'nhieuBuoc') ghiDongGiai(c);
      hoanThanh(true); return;
    }
    if (c.loai === 'tuCham') { hoanThanh(false, true); return; }
    S.soSai++; S.saiBuoc++;
    T.am.choi('sai'); lac($('#the-cau'));
    let loi = c.saiThuong && c.saiThuong[String(v)];
    if (!loi && c.loai === 'chonNhieu') {
      if (c.kiem === 'tong') loi = `Các tờ con chọn cộng lại là <b>${T.so(kq.tong)} đồng</b>, chưa đúng ${T.so(c.dich)} đồng.`;
      else loi = `Con chọn đúng <b>${kq.trung}</b> ô.${kq.thieu ? ` Còn thiếu <b>${kq.thieu}</b> ô.` : ''}${kq.thua ? ` Có <b>${kq.thua}</b> ô chọn nhầm.` : ''}`;
    }
    if (!loi && (c.loai === 'o' || c.loai === 'keoTha' || c.loai === 'sapXep') && kq.chiTiet) { const d = kq.chiTiet.filter(Boolean).length; if (d) loi = `Đúng ${d}/${kq.chiTiet.length} ô. Các ô màu đỏ chưa đúng, con sửa lại nhé.`; }
    phanHoi('✗ ' + (loi || T.c(VIEN)), 'sai');
    if (S.saiBuoc === 2 && S.goiYMo < dsGoiY().length) { setTimeout(moGoiY, 400); }
    if (S.saiBuoc >= 2) $('#nut-xem').hidden = false;
  }
  function ghiDongGiai(c) {
    if (c.ghi) S.dongGiai.push(esc(c.ghi));
    else if (c.ghiMau) S.dongGiai.push(esc(c.ghiMau));
  }

  function xemCachGiai() {
    if (S.xong) return;
    S.xemDA = true;
    S.the.hienDapAn();
    if (S.q.loai === 'nhieuBuoc') for (let k = S.buoc; k < S.q.buoc.length; k++) ghiDongGiai(S.q.buoc[k]);
    hoanThanh(false);
  }

  function hoanThanh(dung, tuChamSai) {
    S.xong = true; S.the.khoa(); BP.chon(null); BP.hien(false);
    const q = S.q;
    let s = 0;
    if (dung && !S.xemDA) s = S.soSai === 0 && S.goiY === 0 ? 3 : S.soSai + S.goiY <= 2 ? 2 : 1;
    if (q.loai === 'tuCham') s = dung ? 2 : 0;
    P.kq.push({ sao: s, dung, de: q.de, dang: q.dang });
    $('#sao-luot').textContent = T.tong(P.kq.map(k => k.sao));
    // thống kê
    if (q.dang) { const t = TD.tk[q.dang] || (TD.tk[q.dang] = { dung: 0, tong: 0, goiY: 0, sai: 0 }); t.tong++; if (dung) t.dung++; t.goiY += S.goiY; t.sai += S.soSai; }
    // sổ ôn lỗi
    const khoa = q.de + JSON.stringify(q.hinh || '');
    const viTri = TD.soLoi.findIndex(x => x.k === khoa);
    if (!dung || S.soSai >= 2 || S.xemDA) { if (viTri < 0) TD.soLoi.unshift({ k: khoa, q: sao(q), ngay: T.homNay(), dang: q.dang || '', nguon: P.ten }); }
    else if (viTri >= 0 && S.soSai === 0) TD.soLoi.splice(viTri, 1);
    TD.ghi();

    $('#nut-kiem').hidden = true; $('#nut-goiy').hidden = true; $('#nut-xem').hidden = true; $('#nut-tiep').hidden = false;
    if (q.loai === 'nhieuBuoc') {
      const bg = $('.bai-giai'); if (bg) { bg.hidden = false; bg.innerHTML = `<div class="bg-tieu-de">${q.giaiToan ? 'Bài giải' : 'Các bước đã làm'}</div>` + S.dongGiai.map(d => `<div class="bg-dong">${d}</div>`).join(''); }
      const cc = $('#cau-chinh'); if (cc) cc.hidden = true;
    }
    if (dung) {
      T.am.choi('dung'); phanHoi(`<span class="khen">${T.c(KHEN)}</span> <span class="sao sao-to">${saoHtml(s)}</span>`, 'dung'); phaoHoa();
    } else if (tuChamSai) {
      phanHoi('Không sao! Con xem lại cách làm bên dưới rồi sửa vào vở nhé. Câu này đã vào Sổ ôn lỗi.', 'nhac');
    } else {
      phanHoi('Không sao! Con đọc kĩ cách giải bên dưới. Câu này đã được ghi vào <b>Sổ ôn lỗi</b> để con luyện lại.', 'nhac');
    }
    const lg = q.loiGiai || [];
    if (lg.length) { const cg = $('#cach-giai'); cg.hidden = false; cg.innerHTML = `<div class="cg-tieu-de">${dung ? '🧠 Cách nghĩ' : '📘 Cách giải'}</div>${lg.map(x => `<div class="cg-dong">${x}</div>`).join('')}`; }
    $('#nut-tiep').focus({ preventScroll: true });
  }
  function cauTiep() { P.i++; if (P.i < P.ds.length) veCau(); else ketThuc(); }

  function xacNhanThoat() {
    if (!P.kq.length) { veNoiTroVe(); return; }
    const h = hopThoai(`<h2>Thoát lượt chơi?</h2><p>Con đã làm ${P.kq.length}/${P.ds.length} câu. Nếu thoát bây giờ, kết quả lượt này sẽ không được tính sao cho màn.</p>
      <div class="hang-nut"><button class="nut nut-phu" id="o-lai">Chơi tiếp</button><button class="nut nut-chinh" id="thoat">Thoát</button></div>`);
    $('#o-lai', h.goc).addEventListener('click', h.dong);
    $('#thoat', h.goc).addEventListener('click', () => { h.dong(); veNoiTroVe(); });
  }
  function veNoiTroVe() {
    if (P.spec.kieu === 'dang') veDao(CT.dang[P.spec.id].dao);
    else if (P.spec.kieu === 'phieu') veDsPhieu();
    else veTrangChu();
  }
  function phaoHoa() {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const g = el('<div class="phao-hoa" aria-hidden="true"></div>');
    for (let i = 0; i < 14; i++) { const s = document.createElement('i'); s.textContent = T.c(['⭐', '✨', '🌟']); s.style.setProperty('--x', (Math.random() * 2 - 1) * 160 + 'px'); s.style.setProperty('--y', -(60 + Math.random() * 140) + 'px'); s.style.animationDelay = Math.random() * 0.15 + 's'; g.appendChild(s); }
    document.body.appendChild(g); setTimeout(() => g.remove(), 1200);
  }

  /* ===================================================================
     KẾT THÚC LƯỢT CHƠI
     =================================================================== */
  function ketThuc() {
    const tong = T.tong(P.kq.map(k => k.sao)), max = P.kq.length * 3, ti = max ? tong / max : 0;
    const saoMan = ti >= 0.8 ? 3 : ti >= 0.55 ? 2 : ti >= 0.3 ? 1 : 0;
    const dung = P.kq.filter(k => k.dung).length;
    let khoa = null;
    if (P.spec.kieu === 'dang') khoa = P.spec.id + ':' + P.spec.cap;
    if (P.spec.kieu === 'phieu') { const p = PHIEU.ds.find(x => x.id === P.spec.id); khoa = p ? khoaPhan(p, P.spec.phan || 0) : 'phieu:' + P.spec.id; }
    let stickerMoi = null, lanDau3 = false;
    if (khoa) {
      const m = TD.man[khoa] || (TD.man[khoa] = { sao: 0, lan: 0, dung: 0, tong: 0 });
      lanDau3 = saoMan === 3 && m.sao < 3;
      m.sao = Math.max(m.sao, saoMan); m.lan++; m.dung += dung; m.tong += P.kq.length;
    }
    if (P.spec.kieu === 'ngay') { TD.thuThach[T.homNay()] = Math.max(TD.thuThach[T.homNay()] || 0, saoMan); lanDau3 = saoMan === 3; }
    if (lanDau3) { const con = STICKER.filter(x => !TD.hs.sticker.includes(x)); if (con.length) { stickerMoi = T.c(con); TD.hs.sticker.push(stickerMoi); } }
    TD.hs.xu += tong;
    capNhatChuoi();
    TD.nhatKy.unshift({ ngay: T.homNay(), gio: new Date().toTimeString().slice(0, 5), ten: P.ten, phu: P.phu, dung, tong: P.kq.length, sao: saoMan, giay: Math.round((Date.now() - P.batDau) / 1000) });
    TD.ghi();
    if (saoMan >= 2) T.am.choi('thang');

    let tiep = null;
    if (P.spec.kieu === 'phieu') {
      const p = PHIEU.ds.find(x => x.id === P.spec.id);
      if (p && (P.spec.phan || 0) < chiaPhan(p).length - 1) tiep = { kieu: 'phieu', id: p.id, phan: (P.spec.phan || 0) + 1 };
    }
    if (P.spec.kieu === 'dang') {
      const d = CT.dang[P.spec.id], dao = CT.timDao(d.dao), vt = dao.dang.indexOf(P.spec.id);
      if (P.spec.cap < 3 && moKhoa(P.spec.id, P.spec.cap + 1)) tiep = { kieu: 'dang', id: P.spec.id, cap: P.spec.cap + 1 };
      else if (vt < dao.dang.length - 1 && moKhoa(dao.dang[vt + 1], 1)) tiep = { kieu: 'dang', id: dao.dang[vt + 1], cap: 1 };
    }
    const loiKhen = saoMan === 3 ? 'Xuất sắc! Con đã chinh phục màn này!' : saoMan === 2 ? 'Giỏi lắm! Thêm chút nữa là được 3 sao.' : saoMan === 1 ? 'Con đã qua màn! Chơi lại để được nhiều sao hơn nhé.' : 'Chưa qua màn. Con xem lại Bí kíp rồi thử lại nhé!';
    man(`<div class="khung hop-giua"><div class="the-lon ket-qua">
      <div class="kq-sao">${saoHtml(saoMan)}</div>
      <h1>${loiKhen}</h1>
      <p class="kq-so">Đúng <b>${dung}/${P.kq.length}</b> câu · nhận <b>${tong} ⭐</b></p>
      ${stickerMoi ? `<div class="sticker-moi"><span>${stickerMoi}</span><b>Con nhận được một bạn thú mới!</b><small>Xem trong Bộ sưu tập 🎁</small></div>` : ''}
      <ol class="kq-ds">${P.kq.map((k, i) => `<li class="${k.dung ? 'd' : 's'}"><span>Câu ${i + 1}</span><span class="sao">${saoHtml(k.sao)}</span></li>`).join('')}</ol>
      <div class="hang-nut">
        <button class="nut nut-phu" id="choi-lai">↻ Chơi lại</button>
        ${tiep ? `<button class="nut nut-chinh" id="man-tiep">${tiep.kieu === 'phieu' ? 'Phần tiếp theo ➜' : 'Màn tiếp theo ➜'}</button>` : ''}
        <button class="nut nut-phu" id="ve-dao">${P.spec.kieu === 'dang' ? 'Về đảo' : P.spec.kieu === 'phieu' ? 'Về danh sách phiếu' : 'Về trang chủ'}</button>
      </div></div></div>`, 'man-ket-qua');
    $('#choi-lai').addEventListener('click', () => batDau(P.spec));
    if (tiep) $('#man-tiep').addEventListener('click', () => batDau(tiep));
    $('#ve-dao').addEventListener('click', veNoiTroVe);
  }

  /* ===================================================================
     TIA CHỚP TÍNH NHẨM (60 giây)
     =================================================================== */
  const CHE_DO_TC = {
    tron20: { ten: 'Cộng, trừ trong phạm vi 20', sinh: () => { const a = T.n(2, 9), b = T.n(2, 9); return T.c([[`${a} + ${b}`, a + b], [`${a + b} − ${b}`, a]]); } },
    tron100: { ten: 'Cộng, trừ trong phạm vi 100', sinh: () => { const a = T.n(10, 60), b = T.n(5, 39); return T.c([[`${a} + ${b}`, a + b], [`${a + b} − ${b}`, a], [`${T.n(1, 9) * 10} + ${T.n(1, 9)}`, null]]); } },
    nhan25: { ten: 'Bảng nhân 2, bảng nhân 5', sinh: () => { const a = T.c([2, 5]), b = T.n(1, 10); return T.c([[`${a} × ${b}`, a * b], [`${a * b} : ${a}`, b]]); } }
  };
  function veTiaChopChon() {
    man(`<div class="khung"><header class="thanh-tren"><button class="nut-ve" id="ve">← Về</button><div class="tt-giua"><b>⚡ Tia chớp tính nhẩm</b><small>Làm được bao nhiêu phép tính trong 60 giây?</small></div></header>
      <div class="ds-phieu">${Object.entries(CHE_DO_TC).map(([k, v]) => `<button class="phieu-the" data-k="${k}"><span class="ph-chu"><b>${v.ten}</b><small>Kỷ lục: ${TD.kyLuc[k] || 0} câu</small></span><span class="ph-phai">▶</span></button>`).join('')}</div></div>`);
    $('#ve').addEventListener('click', veTrangChu);
    $$('.phieu-the').forEach(b => b.addEventListener('click', () => choiTiaChop(b.dataset.k)));
  }
  function choiTiaChop(k) {
    T.am.mo();
    const cd = CHE_DO_TC[k]; let dung = 0, sai = 0, conLai = 60, hen = null, cau = null;
    man(`<div class="khung khung-choi"><header class="thanh-tren"><button class="nut-ve" id="ve">✕</button><div class="tt-giua"><b>⚡ ${cd.ten}</b></div><div class="tt-sao">✔ <b id="tc-dung">0</b></div></header>
      <div class="dong-ho-cat"><i id="tc-thanh"></i></div><div class="tc-giay"><b id="tc-giay">60</b> giây</div>
      <section class="the-cau tc nhom-o" id="cau-chinh"></section><div class="phan-hoi" id="phan-hoi"></div></div>`, 'man-choi');
    const moi = () => {
      let c; do { c = cd.sinh(); } while (c[1] == null);
      cau = c;
      $('#cau-chinh').innerHTML = `<div class="tc-phep">${c[0]} = ${KC.oTrong('[[0]]')}</div>`;
      const o = BP.gan($('#cau-chinh'), nop)[0]; o.dataset.dai = 3; BP.chon(o);
    };
    const nop = () => {
      const o = $('#cau-chinh .o-nhap'); if (!o || !o.dataset.gt) return;
      if (Number(o.dataset.gt) === cau[1]) { dung++; T.am.choi('dung'); $('#tc-dung').textContent = dung; phanHoi('✔', 'dung'); }
      else { sai++; T.am.choi('sai'); phanHoi(`✗ ${cau[0]} = ${cau[1]}`, 'sai'); }
      moi();
    };
    const het = () => {
      clearInterval(hen); BP.hien(false);
      const kyLuc = dung > (TD.kyLuc[k] || 0); if (kyLuc) TD.kyLuc[k] = dung;
      TD.hs.xu += Math.floor(dung / 2); capNhatChuoi(); TD.nhatKy.unshift({ ngay: T.homNay(), gio: new Date().toTimeString().slice(0, 5), ten: 'Tia chớp', phu: cd.ten, dung, tong: dung + sai, sao: 0, giay: 60 }); TD.ghi();
      man(`<div class="khung hop-giua"><div class="the-lon ket-qua"><div class="kq-sao">⚡</div><h1>${kyLuc ? 'Kỷ lục mới!' : 'Hết giờ!'}</h1><p class="kq-so">Đúng <b>${dung}</b> câu, sai ${sai} câu · nhận <b>${Math.floor(dung / 2)} ⭐</b></p><p>Kỷ lục: ${TD.kyLuc[k]} câu</p>
        <div class="hang-nut"><button class="nut nut-chinh" id="lai">↻ Chơi lại</button><button class="nut nut-phu" id="ve2">Về</button></div></div></div>`);
      $('#lai').addEventListener('click', () => choiTiaChop(k)); $('#ve2').addEventListener('click', veTiaChopChon);
    };
    $('#ve').addEventListener('click', () => { clearInterval(hen); veTiaChopChon(); });
    moi();
    hen = setInterval(() => {
      conLai--; const g = $('#tc-giay'); if (!g) { clearInterval(hen); return; }
      g.textContent = conLai; $('#tc-thanh').style.width = (conLai / 60 * 100) + '%';
      if (conLai <= 0) het();
    }, 1000);
  }

  /* ===================================================================
     SỔ BÍ KÍP · BỘ SƯU TẬP
     =================================================================== */
  function veSoBiKip() {
    man(`<div class="khung"><header class="thanh-tren"><button class="nut-ve" id="ve">← Về</button><div class="tt-giua"><b>📖 Sổ bí kíp</b><small>Kiến thức cần ghi nhớ của từng dạng bài</small></div></header>
      ${BON_BUOC}
      ${CT.dao.map(d => `<h2 class="tieu-de-muc">${d.bieu} ${d.ten}</h2>${d.dang.map(id => `<details class="bk-muc"><summary>${CT.dang[id].bieu} ${CT.dang[id].ten}</summary><div class="bk-noi-dung">${CT.dang[id].ghiNho}</div></details>`).join('')}`).join('')}</div>`);
    $('#ve').addEventListener('click', veTrangChu);
  }
  function veAlbum() {
    man(`<div class="khung"><header class="thanh-tren"><button class="nut-ve" id="ve">← Về</button><div class="tt-giua"><b>🎁 Bộ sưu tập thú cưng</b><small>${TD.hs.sticker.length}/${STICKER.length} bạn · được 3 ★ lần đầu ở một màn để nhận bạn mới</small></div></header>
      <div class="album">${STICKER.map(s => TD.hs.sticker.includes(s) ? `<span class="st co">${s}</span>` : '<span class="st">?</span>').join('')}</div></div>`);
    $('#ve').addEventListener('click', veTrangChu);
  }

  /* ===================================================================
     GÓC PHỤ HUYNH
     =================================================================== */
  function cuaPhuHuynh() {
    const a = T.n(12, 19), b = T.n(6, 9);
    const h = hopThoai(`<h2>👪 Góc phụ huynh</h2><p>Phần này dành cho bố mẹ. Để vào, hãy tính:</p><div class="dong-tinh">${a} × ${b} = <input id="ma-ph" inputmode="numeric" size="4" autocomplete="off"></div><div class="hang-nut"><button class="nut nut-chinh" id="vao-ph">Vào</button></div>`);
    const vao = () => { if (Number($('#ma-ph', h.goc).value) === a * b) { h.dong(); vePhuHuynh('tien-do'); } else thongBao('Chưa đúng.'); };
    $('#vao-ph', h.goc).addEventListener('click', vao);
    $('#ma-ph', h.goc).addEventListener('keydown', e => { if (e.key === 'Enter') vao(); });
    setTimeout(() => $('#ma-ph', h.goc).focus(), 50);
  }

  function vePhuHuynh(tab) {
    napPhieu();
    const TAB = [['tien-do', 'Tiến độ'], ['them', 'Thêm bài'], ['da-them', 'Bài đã thêm'], ['cai-dat', 'Cài đặt']];
    man(`<div class="khung khung-ph"><header class="thanh-tren"><button class="nut-ve" id="ve">← Về</button><div class="tt-giua"><b>👪 Góc phụ huynh</b><small>${esc(TD.hs.ten)}</small></div></header>
      <nav class="tab-ph">${TAB.map(([k, t]) => `<button data-t="${k}" class="${k === tab ? 'bat' : ''}">${t}</button>`).join('')}</nav>
      <div id="ph-noi-dung"></div></div>`, 'man-ph');
    $('#ve').addEventListener('click', veTrangChu);
    $$('.tab-ph button').forEach(b => b.addEventListener('click', () => vePhuHuynh(b.dataset.t)));
    ({ 'tien-do': phTienDo, them: phThem, 'da-them': phDaThem, 'cai-dat': phCaiDat })[tab]($('#ph-noi-dung'));
  }

  function phTienDo(g) {
    const tk = TD.tk, tong = Object.values(tk).reduce((s, x) => s + x.tong, 0), dung = Object.values(tk).reduce((s, x) => s + x.dung, 0);
    const ngay = new Set(TD.nhatKy.map(x => x.ngay)).size;
    const can = Object.entries(tk).filter(([, x]) => x.tong >= 4 && x.dung / x.tong < 0.6).map(([id, x]) => ({ id, ti: x.dung / x.tong })).sort((a, b) => a.ti - b.ti);
    g.innerHTML = `<div class="o-so">
        <div><b>${ngay}</b><small>ngày đã học</small></div><div><b>${tong}</b><small>câu đã làm</small></div>
        <div><b>${tong ? Math.round(dung / tong * 100) : 0}%</b><small>làm đúng</small></div><div><b>${TD.soLoi.length}</b><small>câu trong Sổ ôn lỗi</small></div></div>
      <h3>Dạng bài cần luyện thêm</h3>
      ${can.length ? `<ul class="ds-can">${can.map(c => `<li><b>${CT.dang[c.id] ? CT.dang[c.id].ten : c.id}</b> — đúng ${Math.round(c.ti * 100)}% · ${CT.dang[c.id] ? CT.timDao(CT.dang[c.id].dao).ten : ''}</li>`).join('')}</ul>` : '<p class="ghi-chu">Chưa có dạng nào dưới 60% (tính các dạng đã làm từ 4 câu trở lên).</p>'}
      <h3>Theo từng đảo</h3>
      <div class="bang-cuon"><table class="bang-ph"><thead><tr><th>Dạng bài</th><th>Cơ bản</th><th>Vận dụng</th><th>Nâng cao</th><th>Đúng</th><th>Gợi ý / câu</th></tr></thead><tbody>
      ${CT.dao.map(d => `<tr class="hang-dao"><th colspan="6">${d.bieu} ${d.ten}</th></tr>` + d.dang.map(id => { const x = tk[id]; return `<tr><td>${CT.dang[id].ten}</td>${[1, 2, 3].map(c => `<td class="sao">${saoHtml(TD.sao(id + ':' + c))}</td>`).join('')}<td>${x ? Math.round(x.dung / x.tong * 100) + '% (' + x.tong + ')' : '—'}</td><td>${x ? (x.goiY / x.tong).toFixed(1) : '—'}</td></tr>`; }).join('')).join('')}
      </tbody></table></div>
      <h3>Phiếu trên lớp</h3>
      <div class="bang-cuon"><table class="bang-ph"><thead><tr><th>Phiếu</th><th>Sao</th><th>Đúng</th></tr></thead><tbody>
      ${NHOM_PHIEU.filter(n => PHIEU.ds.some(p => p.nhom === n[0])).map(n => `<tr class="hang-dao"><th colspan="3">${n[2]} ${n[1]}</th></tr>` + PHIEU.ds.filter(p => p.nhom === n[0]).map(p => {
        const ph = chiaPhan(p), ms = ph.map((_, k) => TD.man[khoaPhan(p, k)]).filter(Boolean), x = saoPhieu(p);
        const d = ms.reduce((a, m) => a + m.dung, 0), t = ms.reduce((a, m) => a + m.tong, 0);
        return `<tr><td>${esc(tenNgan(p))}</td><td>${ms.length ? `★ ${x.co}/${x.max}` : '—'}</td><td>${t ? Math.round(d / t * 100) + '% (' + t + ' câu)' : 'chưa làm'}</td></tr>`;
      }).join('')).join('')}
      </tbody></table></div>
      <h3>Nhật ký gần đây</h3>
      <div class="bang-cuon"><table class="bang-ph"><thead><tr><th>Ngày</th><th>Bài</th><th>Đúng</th><th>Sao</th><th>Thời gian</th></tr></thead><tbody>
      ${TD.nhatKy.slice(0, 30).map(x => `<tr><td>${x.ngay} ${x.gio || ''}</td><td>${esc(x.ten)}<br><small>${esc(x.phu || '')}</small></td><td>${x.dung}/${x.tong}</td><td class="sao">${x.ten === 'Tia chớp' ? '⚡' : saoHtml(x.sao)}</td><td>${Math.floor(x.giay / 60)} phút ${x.giay % 60} giây</td></tr>`).join('') || '<tr><td colspan="5">Chưa có.</td></tr>'}
      </tbody></table></div>
      <h3>Sổ ôn lỗi</h3>
      ${TD.soLoi.length ? `<ol class="ds-loi">${TD.soLoi.slice(0, 20).map(x => `<li><small>${x.ngay} · ${esc(x.nguon || '')}</small><div>${x.q.de.replace(/\[\[\d+\]\]|\{\{\d+\}\}/g, '□')}</div></li>`).join('')}</ol>` : '<p class="ghi-chu">Trống.</p>'}`;
  }

  function phThem(g) {
    const nhap = luu.doc('banNhap', '');
    g.innerHTML = `<div class="the-ph">
      <h3>Thêm nhanh một câu</h3>
      <div class="form-luoi">
        <label for="f-de">Đề bài</label><textarea id="f-de" rows="3" placeholder="Ví dụ: Lấy hiệu của 25 và 12 rồi cộng với 36 được kết quả là:"></textarea>
        <label for="f-loai">Kiểu trả lời</label><select id="f-loai"><option value="so">Điền số (một hoặc nhiều số)</option><option value="chon">Chọn một đáp án</option><option value="giai">Bài giải toán có lời văn</option><option value="tuCham">Bé làm ra vở, tự so đáp án</option></select>
        <label for="f-da">Đáp án</label><input id="f-da" placeholder="49   ·   nhiều số: 4; 5   ·   bài giải: 43 + 5 = 48">
        <label for="f-lc" class="chi-chon">Các lựa chọn</label><input id="f-lc" class="chi-chon" placeholder="Ba nhiều tuổi hơn Hương | Ba ít tuổi hơn Hương">
        <label for="f-lg" class="chi-giai">Câu lời giải</label><input id="f-lg" class="chi-giai" placeholder="Trước khi bán, nhà bạn Tú có số con gà là:">
        <label for="f-ds" class="chi-giai">Đáp số</label><input id="f-ds" class="chi-giai" placeholder="48 con gà">
        <label for="f-gy">Gợi ý (mỗi dòng một gợi ý)</label><textarea id="f-gy" rows="3" placeholder="Hiệu của 25 và 12 là bao nhiêu? = 13&#10;(thêm “= số” ở cuối để bé tự trả lời gợi ý)"></textarea>
        <label for="f-cg">Cách giải (mỗi dòng một bước)</label><textarea id="f-cg" rows="2" placeholder="25 − 12 = 13&#10;13 + 36 = 49"></textarea>
      </div>
      <div class="hang-nut trai"><button class="nut nut-phu" id="f-dua">↓ Đưa vào ô soạn bài</button></div></div>
      <div class="the-ph">
      <h3>Ô soạn bài</h3>
      <p class="ghi-chu">Viết theo mẫu. Dòng bắt đầu bằng <code>#</code> là tên phiếu mới. Chèn mẫu:
        ${Object.entries({ so: 'Điền số', o: 'Ô trống trong đề', nhieu: 'Nhiều số', chon: 'Chọn đáp án', giai: 'Bài giải', tinh: 'Tính', datTinh: 'Đặt tính', soSanh: 'So sánh', dungSai: 'Đúng/Sai', dienDau: 'Điền dấu', tuCham: 'Tự chấm' }).map(([k, t]) => `<button class="nut-nho mau" data-m="${k}">${t}</button>`).join(' ')}</p>
      <textarea id="soan" rows="14" spellcheck="false" placeholder="# Phiếu tuần 6&#10;&#10;Câu: ...&#10;Đáp án: ...">${esc(nhap)}</textarea>
      <div class="hang-nut trai"><button class="nut nut-phu" id="xem-truoc">Kiểm tra</button><button class="nut nut-chinh" id="luu-bai">Lưu vào ứng dụng</button></div>
      <div id="ket-qua-soan"></div></div>`;
    const loai = $('#f-loai', g);
    const doiLoai = () => { $$('.chi-chon', g).forEach(x => { x.hidden = loai.value !== 'chon'; }); $$('.chi-giai', g).forEach(x => { x.hidden = loai.value !== 'giai'; }); };
    loai.addEventListener('change', doiLoai); doiLoai();
    const soan = $('#soan', g);
    soan.addEventListener('input', () => luu.ghi('banNhap', soan.value));
    const chen = s => { soan.value = (soan.value.trim() ? soan.value.replace(/\s*$/, '\n\n') : '# Phiếu mới\n\n') + s; luu.ghi('banNhap', soan.value); soan.scrollTop = soan.scrollHeight; };
    $$('.mau', g).forEach(b => b.addEventListener('click', () => chen(VB.MAU[b.dataset.m])));
    $('#f-dua', g).addEventListener('click', () => {
      const de = $('#f-de', g).value.trim(), da = $('#f-da', g).value.trim(); if (!de) { thongBao('Chưa có đề bài.'); return; }
      const dongs = [];
      if (loai.value === 'giai') { dongs.push('Câu giải toán: ' + de.replace(/\n/g, ' ')); if ($('#f-lg', g).value.trim()) dongs.push('Lời giải: ' + $('#f-lg', g).value.trim()); dongs.push('Phép tính: ' + da); if ($('#f-ds', g).value.trim()) dongs.push('Đáp số: ' + $('#f-ds', g).value.trim()); }
      else { dongs.push('Câu: ' + de.replace(/\n/g, ' ')); if (loai.value === 'chon') dongs.push('Lựa chọn: ' + $('#f-lc', g).value.trim()); if (loai.value === 'tuCham') dongs.push('Tự chấm'); dongs.push('Đáp án: ' + da); }
      $('#f-gy', g).value.split('\n').map(x => x.trim()).filter(Boolean).forEach(x => dongs.push('Gợi ý: ' + x));
      $('#f-cg', g).value.split('\n').map(x => x.trim()).filter(Boolean).forEach(x => dongs.push('Cách giải: ' + x));
      chen(dongs.join('\n') + '\n');
      ['#f-de', '#f-da', '#f-lc', '#f-lg', '#f-ds', '#f-gy', '#f-cg'].forEach(s => { $(s, g).value = ''; });
      thongBao('Đã đưa vào ô soạn bài. Bấm “Kiểm tra” rồi “Lưu”.');
    });
    const kiem = () => {
      const kq = VB.phanTich(soan.value), o = $('#ket-qua-soan', g);
      o.innerHTML = `<div class="${kq.loi.length ? 'bao-loi' : 'bao-tot'}">${kq.ds.length} phiếu, ${kq.ds.reduce((s, p) => s + p.cau.length, 0)} câu đọc được.${kq.loi.length ? '<ul>' + kq.loi.map(x => `<li>${esc(x)}</li>`).join('') + '</ul>' : ' Không có lỗi.'}</div>
        ${kq.ds.map(p => `<details><summary>${esc(p.ten)} (${p.cau.length} câu)</summary><ol>${p.cau.map(q => `<li>${q.de.replace(/\[\[\d+\]\]/g, '□')} <small>→ ${esc(moTaDapAn(q))}</small></li>`).join('')}</ol></details>`).join('')}`;
      return kq;
    };
    $('#xem-truoc', g).addEventListener('click', kiem);
    $('#luu-bai', g).addEventListener('click', () => {
      const kq = kiem(); if (!kq.ds.length) { thongBao('Chưa có câu nào hợp lệ.'); return; }
      if (kq.loi.length) { thongBao('Còn lỗi, bố mẹ sửa rồi lưu lại nhé.'); return; }
      const cu = luu.doc('phieuThem', '');
      luu.ghi('phieuThem', (cu ? cu.replace(/\s*$/, '\n\n') : '') + soan.value.trim() + '\n');
      luu.ghi('banNhap', ''); soan.value = '';
      thongBao('Đã lưu! Bé vào “Bài của cô” để làm.'); vePhuHuynh('da-them');
    });
  }
  function moTaDapAn(q) {
    if (q.loai === 'so') return String(q.dapAn);
    if (q.loai === 'o') return q.dapAn.join('; ') + (q.khongThuTu ? ' (không cần thứ tự)' : '');
    if (q.loai === 'chon') return q.luaChon[q.dapAn].replace(/<[^>]+>/g, '');
    if (q.loai === 'nhieuBuoc') return (q.loiGiai || []).join(' · ');
    if (q.loai === 'tuCham') return 'Tự chấm: ' + q.dapAnChu;
    return '';
  }

  function phDaThem(g) {
    const chu = luu.doc('phieuThem', ''), kq = VB.phanTich(chu);
    g.innerHTML = `<div class="the-ph"><h3>Phiếu bố mẹ đã thêm</h3>
      ${kq.ds.length ? `<ul class="ds-can">${kq.ds.map(p => `<li><b>${esc(p.ten)}</b> — ${p.cau.length} câu</li>`).join('')}</ul>` : '<p class="ghi-chu">Chưa có. Vào tab “Thêm bài” để thêm.</p>'}
      <p class="ghi-chu">Bài thêm ở đây chỉ lưu trong trình duyệt này. Muốn giữ lâu dài hoặc dùng trên máy khác: sao chép nội dung dưới đây dán vào cuối file <code>noi-dung/phieu-cua-co.js</code>, hoặc dán vào ô “Nhập” trên máy kia.</p>
      <textarea id="da-them" rows="12" spellcheck="false">${esc(chu)}</textarea>
      <div class="hang-nut trai"><button class="nut nut-phu" id="sao-chep">Sao chép</button><button class="nut nut-phu" id="luu-sua">Lưu chỗ đã sửa</button><button class="nut nut-phu" id="xoa-het">Xoá tất cả</button></div>
      <h3>Nhập từ file .txt</h3><input type="file" id="nhap-file" accept=".txt,.md,text/plain"></div>`;
    const ta = $('#da-them', g);
    $('#sao-chep', g).addEventListener('click', () => { const ok = () => thongBao('Đã sao chép.'); try { navigator.clipboard.writeText(ta.value).then(ok, () => { ta.select(); thongBao('Đã chọn sẵn, bấm Ctrl+C để sao chép.'); }); } catch (e) { ta.select(); } });
    $('#luu-sua', g).addEventListener('click', () => { const k = VB.phanTich(ta.value); if (k.loi.length) { thongBao(k.loi[0]); return; } luu.ghi('phieuThem', ta.value); thongBao('Đã lưu.'); vePhuHuynh('da-them'); });
    $('#xoa-het', g).addEventListener('click', e => { const b = e.currentTarget; if (b.dataset.xn) { luu.ghi('phieuThem', ''); vePhuHuynh('da-them'); } else { b.dataset.xn = 1; b.textContent = 'Bấm lần nữa để xoá'; } });
    $('#nhap-file', g).addEventListener('change', e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { ta.value = (ta.value ? ta.value + '\n\n' : '') + r.result; thongBao('Đã nhập. Bấm “Lưu chỗ đã sửa”.'); }; r.readAsText(f); });
  }

  function phCaiDat(g) {
    const cd = TD.hs.caiDat;
    g.innerHTML = `<div class="the-ph"><h3>Cài đặt</h3><div class="form-luoi">
      <label for="c-socau">Số câu mỗi màn</label><select id="c-socau">${[5, 6, 8, 10].map(x => `<option ${x === cd.soCau ? 'selected' : ''}>${x}</option>`).join('')}</select>
      <label for="c-mokhoa">Mở khoá tất cả màn</label><input type="checkbox" id="c-mokhoa" ${cd.moKhoa ? 'checked' : ''}>
      <label for="c-docto">Tự đọc to đề bài</label><input type="checkbox" id="c-docto" ${cd.docTo ? 'checked' : ''}>
      <label for="c-am">Âm thanh</label><input type="checkbox" id="c-am" ${cd.amThanh !== false ? 'checked' : ''}>
    </div></div>
    <div class="the-ph"><h3>Sao lưu tiến độ</h3><p class="ghi-chu">Tiến độ lưu trong trình duyệt của máy này. Sao chép đoạn mã dưới đây để cất giữ, hoặc dán mã đã cất để khôi phục.</p>
      <textarea id="sao-luu" rows="5" spellcheck="false"></textarea>
      <div class="hang-nut trai"><button class="nut nut-phu" id="lay-ma">Lấy mã sao lưu</button><button class="nut nut-phu" id="khoi-phuc">Khôi phục từ mã</button><button class="nut nut-phu" id="xoa-td">Xoá toàn bộ tiến độ</button></div></div>`;
    const doi = () => { cd.soCau = Number($('#c-socau', g).value); cd.moKhoa = $('#c-mokhoa', g).checked; cd.docTo = $('#c-docto', g).checked; cd.amThanh = $('#c-am', g).checked; T.am.bat = cd.amThanh; TD.ghi(); thongBao('Đã lưu cài đặt.'); };
    $$('select, input[type=checkbox]', g).forEach(x => x.addEventListener('change', doi));
    $('#lay-ma', g).addEventListener('click', () => { $('#sao-luu', g).value = JSON.stringify(T.luu.tatCa()); $('#sao-luu', g).select(); });
    $('#khoi-phuc', g).addEventListener('click', () => {
      try { const o = JSON.parse($('#sao-luu', g).value); Object.entries(o).forEach(([k, v]) => luu.ghi(k, v)); thongBao('Đã khôi phục. Đang tải lại…'); setTimeout(() => location.reload(), 800); }
      catch (e) { thongBao('Mã không đúng định dạng.'); }
    });
    $('#xoa-td', g).addEventListener('click', e => {
      const b = e.currentTarget;
      if (!b.dataset.xn) { b.dataset.xn = 1; b.textContent = 'Bấm lần nữa để xoá hết'; return; }
      ['hoSo', 'man', 'thongKe', 'soLoi', 'nhatKy', 'thuThach', 'kyLuc', 'daXemBK'].forEach(k => luu.xoa(k));
      location.reload();
    });
  }

  /* ===================================================================
     KHỞI ĐỘNG
     =================================================================== */
  BP.tao();
  window.__toan2 = { TD, get P() { return P; }, get S() { return S; }, batDau, veTrangChu };
  if (TD.hs.ten) veTrangChu(); else veHoSo(false);
})();

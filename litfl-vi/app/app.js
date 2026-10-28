/* LITFL Tiếng Việt: giao diện đọc, tìm, ôn tập, tải ngoại tuyến. */
(function () {
  'use strict';
  var $ = function (s, g) { return (g || document).querySelector(s); };
  var esc = Kho.esc, chuan = Kho.chuan;
  var app = $('#app');
  var ML = null;            // mục lục (data/muc-luc.json)
  var theoId = {}, theoSlug = {}, cmTheoId = {};
  var nguCanh = null;       // danh sách bài đang duyệt (để có bài trước / sau)
  var hoanCai = null;       // sự kiện cài đặt ứng dụng (beforeinstallprompt)

  /* ---------- giao diện sáng/tối, cỡ chữ ---------- */
  function apCaiDat() {
    var g = Kho.cai('giao_dien');
    if (g) document.documentElement.setAttribute('data-theme', g); else document.documentElement.removeAttribute('data-theme');
    document.documentElement.style.setProperty('--co-chu', (Kho.cai('co_chu') || 17) + 'px');
  }
  apCaiDat();

  /* ---------- tải dữ liệu ---------- */
  function taiMucLuc() {
    return fetch('data/muc-luc.json', { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function (d) {
      ML = d;
      d.bai.forEach(function (b) { theoId[b.id] = b; theoSlug[b.s] = b; });
      d.chuyen_muc.forEach(function (c) { cmTheoId[c.id] = c; });
    });
  }
  function urlBai(b) { return 'data/bai/' + b.id + '.json?v=' + encodeURIComponent(b.m + '-' + b.d + '-' + ML.phien_ban.slice(0, 8)); }
  function taiBai(b) { return fetch(urlBai(b)).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }); }

  function tenCm(c) { return c.vi || c.en; }

  /* ---------- tiện ích hiển thị ---------- */
  function nhanBai(b) {
    var t = Kho.tt().tien_do[b.id] || {}, s = '';
    if (t.thuoc) s += '<span class="nhan hoc">đã thuộc</span>';
    else if (t.hoc) s += '<span class="nhan hoc">đang ôn</span>';
    else if (t.doc) s += '<span class="nhan doc">đã đọc</span>';
    if (!b.d) s += '<span class="nhan en">chưa dịch</span>';
    return s;
  }
  function dongBai(b, phu) {
    return '<li><a href="#/b/' + b.id + '"><div class="t">' + esc(b.t) + nhanBai(b) + '</div>' +
      (b.d && b.te !== b.t ? '<div class="e">' + esc(b.te) + '</div>' : '') +
      (phu ? '<div class="x">' + phu + '</div>' : '') + '</a></li>';
  }
  var dsDangXem = [];      // các danh sách trên trang hiện tại (cho nút "Xem thêm")
  function dsBai(ds, phu) {
    var so = dsDangXem.push({ ds: ds, phu: phu }) - 1;
    var html = '<ul class="ds">' + ds.slice(0, 150).map(function (b) { return dongBai(b, phu && phu(b)); }).join('') + '</ul>';
    if (ds.length > 150) html += '<p class="hang" style="margin-top:12px"><button class="nut" data-them="' + so + '" data-tu="150">Xem thêm (' + (ds.length - 150) + ' bài)</button></p>';
    return html;
  }
  app.addEventListener('click', function (e) {
    var n = e.target.closest('[data-them]');
    if (!n) return;
    var x = dsDangXem[+n.dataset.them], tu = +n.dataset.tu, den = tu + 300, ul = n.parentNode.previousElementSibling;
    ul.insertAdjacentHTML('beforeend', x.ds.slice(tu, den).map(function (b) { return dongBai(b, x.phu && x.phu(b)); }).join(''));
    if (x.ds.length > den) { n.dataset.tu = den; n.textContent = 'Xem thêm (' + (x.ds.length - den) + ' bài)'; }
    else n.parentNode.remove();
  });
  function tieuDeTrang(t) { document.title = t ? t + ' · LITFL VI' : 'LITFL Tiếng Việt'; }

  /* ---------- trang chủ ---------- */
  function trangChu() {
    tieuDeTrang('');
    var tdo = Kho.tt().tien_do, daDoc = 0, daHoc = 0;
    Object.keys(tdo).forEach(function (id) { if (!theoId[id]) return; if (tdo[id].doc) daDoc++; if (tdo[id].hoc) daHoc++; });
    var han = Kho.denHan().filter(function (id) { return theoId[id]; });
    var ganDay = Kho.tt().gan_day.map(function (id) { return theoId[id]; }).filter(Boolean).slice(0, 5);
    var h = '<div class="trong">';
    h += '<h1>LITFL Tiếng Việt</h1><p class="mo">Bản đọc cá nhân. ' + ML.so_bai + ' bài, ' + ML.so_da_dich +
      ' bài đã dịch. Cập nhật dữ liệu ' + esc(ML.ngay) + '.</p>';
    if (hoanCai) h += '<p><button class="nut chinh" id="cai-app">Cài ứng dụng lên máy</button></p>';
    h += '<div class="so-lieu" style="margin-top:14px">' +
      '<div class="the"><b>' + daDoc + '</b>bài đã đọc</div>' +
      '<div class="the"><b>' + daHoc + '</b>bài đang học/ôn</div>' +
      '<a class="the cm" href="#/on"><b>' + han.length + '</b>bài đến hạn ôn hôm nay</a>' +
      '<a class="the cm" href="#/dau"><b>' + Object.keys(Kho.tt().dau).length + '</b>bài đánh dấu</a></div>';
    if (ganDay.length) h += '<h2 class="muc">Đọc tiếp</h2>' + dsBai(ganDay);
    h += '<h2 class="muc">Chuyên mục</h2><div class="luoi">';
    ML.chuyen_muc.forEach(function (c) {
      var ds = ML.bai.filter(function (b) { return b.c.indexOf(c.id) >= 0; });
      var doc = ds.filter(function (b) { return (tdo[b.id] || {}).doc; }).length;
      h += '<a class="the cm" href="#/cm/' + c.id + '"><div class="ten">' + esc(tenCm(c)) + '</div>' +
        (c.vi && c.vi !== c.en ? '<div class="en">' + esc(c.en) + '</div>' : '') +
        '<div class="mo">' + doc + '/' + c.n + ' bài đã đọc</div><div class="thanh"><i style="width:' + (100 * doc / c.n).toFixed(1) + '%"></i></div></a>';
    });
    var khongCm = ML.bai.filter(function (b) { return !b.c.length; }).length;
    if (khongCm) h += '<a class="the cm" href="#/cm/0"><div class="ten">Chưa phân loại</div><div class="mo">' + khongCm + ' bài</div></a>';
    h += '</div><h2 class="muc">Tất cả bài</h2><p><a class="nut" href="#/cm/tat-ca">Xem danh sách A–Z (' + ML.so_bai + ' bài)</a></p></div>';
    app.innerHTML = h;
    var n = $('#cai-app');
    if (n) n.onclick = function () { hoanCai.prompt(); hoanCai.userChoice.then(function () { hoanCai = null; n.remove(); }); };
  }

  /* ---------- chuyên mục ---------- */
  function trangCm(ma) {
    var c = cmTheoId[ma], ten, tatCa;
    if (ma === 'tat-ca') { ten = 'Tất cả bài'; tatCa = ML.bai.slice(); }
    else if (ma === '0') { ten = 'Chưa phân loại'; tatCa = ML.bai.filter(function (b) { return !b.c.length; }); }
    else if (c) { ten = tenCm(c); tatCa = ML.bai.filter(function (b) { return b.c.indexOf(c.id) >= 0; }); }
    else return khongThay();
    tieuDeTrang(ten);
    var loc = Kho.cai('loc_cm') || { tt: '', xep: 'az' };
    app.innerHTML = '<div class="trong hep"><h1>' + esc(ten) + '</h1>' +
      (c && c.vi && c.vi !== c.en ? '<p class="mo">' + esc(c.en) + '</p>' : '') +
      '<div class="loc"><input id="loc-chu" type="search" placeholder="Lọc theo tên…">' +
      '<select id="loc-tt"><option value="">Tất cả</option><option value="chua">Chưa đọc</option><option value="doc">Đã đọc</option>' +
      '<option value="hoc">Đang học/ôn</option><option value="dich">Đã dịch</option><option value="en">Chưa dịch</option></select>' +
      '<select id="loc-xep"><option value="az">A–Z</option><option value="moi">Mới cập nhật</option></select></div>' +
      '<p class="mo" id="loc-dem"></p><div id="loc-ds"></div></div>';
    $('#loc-tt').value = loc.tt; $('#loc-xep').value = loc.xep;
    function ve() {
      var q = chuan($('#loc-chu').value.trim()), t = $('#loc-tt').value, x = $('#loc-xep').value;
      Kho.cai('loc_cm', { tt: t, xep: x });
      var tdo = Kho.tt().tien_do;
      var ds = tatCa.filter(function (b) {
        var p = tdo[b.id] || {};
        if (q && chuan(b.t + ' ' + b.te).indexOf(q) < 0) return false;
        if (t === 'chua') return !p.doc;
        if (t === 'doc') return !!p.doc;
        if (t === 'hoc') return !!p.hoc;
        if (t === 'dich') return !!b.d;
        if (t === 'en') return !b.d;
        return true;
      });
      if (x === 'moi') ds.sort(function (a, b) { return b.m < a.m ? -1 : b.m > a.m ? 1 : 0; });
      else ds.sort(function (a, b) { return a.t.localeCompare(b.t, 'vi'); });
      nguCanh = { ten: ten, href: location.hash, ds: ds.map(function (b) { return b.id; }) };
      $('#loc-dem').textContent = ds.length + ' bài';
      $('#loc-ds').innerHTML = ds.length ? dsBai(ds) : '<div class="trong-rong">Không có bài nào.</div>';
    }
    $('#loc-chu').oninput = ve; $('#loc-tt').onchange = ve; $('#loc-xep').onchange = ve;
    ve();
  }

  /* ---------- đọc bài ---------- */
  function trangBai(id) {
    var b = theoId[id];
    if (!b) return khongThay();
    tieuDeTrang(b.t);
    app.innerHTML = '<div class="trong hep"><div class="trong-rong">Đang mở bài…</div></div>';
    taiBai(b).then(function (d) { veBai(b, d); }).catch(function (e) {
      app.innerHTML = '<div class="trong hep"><h1>' + esc(b.t) + '</h1><div class="thong-bao">Không mở được bài (' + esc(e.message) +
        '). Nếu đang không có mạng: bài này chưa được tải để đọc ngoại tuyến (Cài đặt → Tải ngoại tuyến).</div>' +
        '<p><a class="nut" href="' + esc(theoId[id] && ('https://litfl.com/' + b.s + '/')) + '" target="_blank" rel="noopener">Mở trên LITFL</a></p></div>';
    });
  }

  function veBai(b, d) {
    var cheDo = Kho.cai('che_do') || 'vi';
    if (!d.vi) cheDo = 'en';
    var t = Kho.tt().tien_do[b.id] || {};
    var dau = !!Kho.tt().dau[b.id];
    var h = '<div class="trong hep"><div class="doc-dau"><h1>' + esc(d.tv || d.te) + '</h1>' +
      (d.tv ? '<p class="en">' + esc(d.te) + '</p>' : '') +
      '<p class="mo">' + b.c.map(function (c) { return cmTheoId[c] ? '<a href="#/cm/' + c + '">' + esc(tenCm(cmTheoId[c])) + '</a>' : ''; }).join(' · ') +
      (d.m ? ' · bản gốc sửa ' + esc(d.m) : '') + '</p></div>';
    h += '<div class="cong-cu hang">' +
      (d.vi ? '<button class="nut' + (cheDo === 'vi' ? ' bat' : '') + '" data-cd="vi">Tiếng Việt</button>' +
        (d.khop ? '<button class="nut' + (cheDo === 'song' ? ' bat' : '') + '" data-cd="song">Song ngữ</button>' : '') +
        '<button class="nut' + (cheDo === 'en' ? ' bat' : '') + '" data-cd="en">Bản gốc</button>' : '') +
      '<button class="nut" id="nut-dau" title="Đánh dấu bài">' + (dau ? '★ Đã đánh dấu' : '☆ Đánh dấu') + '</button>' +
      '<button class="nut' + (t.hoc ? ' bat' : '') + '" id="nut-hoc">' + (t.hoc ? '✓ Đang ôn' : 'Đã học xong') + '</button>' +
      '<button class="nut" data-co="-1" aria-label="Chữ nhỏ hơn">A−</button><button class="nut" data-co="1" aria-label="Chữ lớn hơn">A+</button></div>';
    if (!d.vi) h += '<div class="thong-bao">Bài này chưa được dịch; đang hiển thị bản tiếng Anh.</div>';
    if (d.dich_cu) h += '<div class="thong-bao">Bản gốc đã được LITFL sửa sau lần dịch này; nội dung dịch có thể chưa cập nhật.</div>';
    if (d.vi && cheDo === 'vi' && d.khop) h += '<p class="mo">Mẹo: chạm vào một đoạn để xem câu gốc tiếng Anh.</p>';
    var han = Kho.tt().tien_do[b.id] || {};
    if (han.han && han.han <= Kho.homNay()) h += '<div class="the" style="margin-bottom:16px"><b>Đến hạn ôn bài này.</b> Đọc lướt lại, tự nhắc các ý chính, rồi chọn:' +
      '<div class="hang" style="margin-top:8px"><button class="nut chinh" data-on="1">Nhớ được</button><button class="nut" data-on="0">Chưa nhớ, ôn lại mai</button></div></div>';
    h += '<article class="bai' + (cheDo === 'vi' && d.khop ? ' cham' : '') + '" id="bai">' + noiDung(d, cheDo) + '</article>';
    h += '<div class="ghi-chu"><h2 class="muc">Ghi chú của tôi</h2><textarea id="ghi" placeholder="Ý chính, câu hỏi, liên hệ lâm sàng…">' + esc(Kho.ghi(b.id)) + '</textarea></div>';
    h += '<p class="hang" style="margin-top:14px"><a class="nut" href="' + esc(d.url) + '" target="_blank" rel="noopener">Mở bài gốc trên LITFL ↗</a></p>';
    h += '<p class="mo">Nguồn: Life in the Fast Lane (litfl.com) — ' + esc(d.te) + '. Bản dịch máy tiếng Việt dùng cho học tập cá nhân; khi có khác biệt, theo bản gốc.</p>';
    if (d.canh_bao && d.canh_bao.length) h += '<p class="mo">Kiểm tra tự động: cấu trúc bản dịch lệch bản gốc (' + esc(d.canh_bao.join('; ')) + '). Nên đối chiếu bản gốc.</p>';
    h += dieuHuong(b) + '</div>';
    app.innerHTML = h;

    Kho.daDoc(b.id);
    var y = Kho.viTri(b.id);
    if (y > 200) setTimeout(function () { window.scrollTo(0, y); }, 30);

    app.querySelectorAll('[data-cd]').forEach(function (n) { n.onclick = function () { Kho.cai('che_do', n.dataset.cd); veBai(b, d); }; });
    app.querySelectorAll('[data-co]').forEach(function (n) {
      n.onclick = function () { Kho.cai('co_chu', Math.max(13, Math.min(26, (Kho.cai('co_chu') || 17) + +n.dataset.co))); apCaiDat(); };
    });
    app.querySelectorAll('[data-on]').forEach(function (n) { n.onclick = function () { Kho.on(b.id, n.dataset.on === '1'); veBai(b, d); demOn(); }; });
    $('#nut-dau').onclick = function () { Kho.dau(b.id, !Kho.tt().dau[b.id]); veBai(b, d); };
    $('#nut-hoc').onclick = function () {
      if ((Kho.tt().tien_do[b.id] || {}).hoc) { if (confirm('Bỏ bài này khỏi lịch ôn?')) Kho.boHoc(b.id); }
      else Kho.hoc(b.id);
      veBai(b, d); demOn();
    };
    var hen; $('#ghi').oninput = function (e) { clearTimeout(hen); hen = setTimeout(function () { Kho.ghi(b.id, e.target.value); }, 400); };

    var bai = $('#bai');
    bai.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]');
      if (a) return xuLyLienKet(e, a);
      var img = e.target.closest('img');
      if (img) { var p = $('#phong'); p.querySelector('img').src = img.currentSrc || img.src; p.hidden = false; return; }
      if (cheDo !== 'vi' || !d.khop) return;
      var k = e.target.closest('[data-k]');
      if (!k || k.parentNode !== bai) return;
      var sau = k.nextElementSibling;
      if (sau && sau.classList.contains('goc')) { sau.remove(); return; }
      var g = goc(d, k.dataset.k);
      if (g) k.insertAdjacentHTML('afterend', '<div class="goc">' + g + '</div>');
    });
    bai.querySelectorAll('img').forEach(function (i) { i.loading = 'lazy'; });
  }

  var _gocCache = { d: null, ban: null };
  function goc(d, k) {
    if (_gocCache.d !== d) { var t = document.createElement('div'); t.innerHTML = d.en; _gocCache = { d: d, ban: t }; }
    var n = _gocCache.ban.querySelector('[data-k="' + k + '"]');
    return n ? n.outerHTML.replace(/\sdata-k="\d+"/, '') : '';
  }

  function noiDung(d, cheDo) {
    if (cheDo === 'en' || !d.vi) return d.en;
    if (cheDo === 'song' && d.khop) {
      var t = document.createElement('div'); t.innerHTML = d.vi;
      Array.prototype.slice.call(t.children).forEach(function (n) {
        var g = goc(d, n.dataset.k);
        if (g) n.insertAdjacentHTML('afterend', '<div class="goc">' + g + '</div>');
      });
      return t.innerHTML;
    }
    return d.vi;
  }

  function xuLyLienKet(e, a) {
    var u;
    try { u = new URL(a.getAttribute('href'), 'https://litfl.com/'); } catch (x) { return; }
    if (/(^|\.)litfl\.com$/.test(u.hostname)) {
      var slug = u.pathname.replace(/^\/|\/$/g, '').split('/').pop();
      if (theoSlug[slug]) { e.preventDefault(); location.hash = '#/b/' + theoSlug[slug].id; return; }
    }
    if (u.hash && u.pathname === '/' && a.getAttribute('href').charAt(0) === '#') {
      e.preventDefault();
      var dich = document.getElementById(decodeURIComponent(u.hash.slice(1)));
      if (dich) dich.scrollIntoView();
      return;
    }
    a.target = '_blank'; a.rel = 'noopener';
  }

  function dieuHuong(b) {
    if (!nguCanh) return '';
    var i = nguCanh.ds.indexOf(b.id);
    if (i < 0) return '';
    var truoc = theoId[nguCanh.ds[i - 1]], sau = theoId[nguCanh.ds[i + 1]];
    return '<div class="dieu-huong">' +
      (truoc ? '<a class="nut" href="#/b/' + truoc.id + '">← ' + esc(truoc.t) + '</a>' : '<span></span>') +
      (sau ? '<a class="nut" href="#/b/' + sau.id + '">' + esc(sau.t) + ' →</a>' : '<span></span>') + '</div>' +
      '<p class="mo" style="text-align:center">Trong: <a href="' + esc(nguCanh.href) + '">' + esc(nguCanh.ten) + '</a> (' + (i + 1) + '/' + nguCanh.ds.length + ')</p>';
  }

  /* ---------- tìm kiếm ---------- */
  var tvCache = null;
  function trangTim(q) {
    q = q || '';
    tieuDeTrang('Tìm');
    $('#tim').value = q;
    app.innerHTML = '<div class="trong hep"><h1>Tìm kiếm</h1><div class="loc"><input id="tim-trang" type="search" placeholder="Tên bài, thuật ngữ, eponym… (gõ không dấu cũng được)" value="' + esc(q) + '">' +
      '<button class="nut" id="tim-tv">Tìm trong nội dung</button></div><div id="kq"></div></div>';
    var o = $('#tim-trang');
    if (!q) o.focus();
    function chay() { timTieuDe(o.value.trim()); }
    o.oninput = function () { history.replaceState(null, '', '#/tim/' + encodeURIComponent(o.value)); chay(); };
    $('#tim-tv').onclick = function () { timToanVan(o.value.trim()); };
    chay();
  }
  function timTieuDe(q) {
    var kq = $('#kq');
    if (!q) { kq.innerHTML = '<p class="mo">Gõ để tìm theo tên bài (tiếng Việt hoặc tiếng Anh), thẻ và chuyên mục.</p>'; return; }
    var tu = chuan(q).split(/\s+/).filter(Boolean);
    var ds = [];
    ML.bai.forEach(function (b) {
      var ten = chuan(b.t + ' ' + b.te);
      var phu = chuan(b.g.map(function (g) { return (ML.the[g] || []).join(' '); }).join(' ') + ' ' + b.c.map(function (c) { return cmTheoId[c] ? cmTheoId[c].en + ' ' + cmTheoId[c].vi : ''; }).join(' '));
      var diem = 0;
      for (var i = 0; i < tu.length; i++) {
        if (ten.indexOf(tu[i]) >= 0) diem += 3; else if (phu.indexOf(tu[i]) >= 0) diem += 1; else return;
      }
      if (ten.indexOf(chuan(q)) === 0) diem += 5;
      ds.push([diem, b]);
    });
    ds.sort(function (a, b) { return b[0] - a[0] || a[1].t.localeCompare(b[1].t, 'vi'); });
    ds = ds.map(function (x) { return x[1]; });
    nguCanh = { ten: 'Kết quả tìm "' + q + '"', href: location.hash, ds: ds.map(function (b) { return b.id; }) };
    kq.innerHTML = '<p class="mo">' + ds.length + ' bài khớp tên/thẻ. Bấm “Tìm trong nội dung” để tìm cả trong thân bài.</p>' + (ds.length ? dsBai(ds) : '');
  }
  function taiTv() {
    if (tvCache) return Promise.resolve(tvCache);
    var ps = [];
    for (var i = 0; i < ML.so_tv; i++) ps.push(fetch('data/tv/' + i + '.json?v=' + ML.phien_ban).then(function (r) { return r.json(); }));
    return Promise.all(ps).then(function (ds) {
      tvCache = [];
      ds.forEach(function (d) { d.forEach(function (x) { tvCache.push([x[0], x[1], x[2], chuan(x[1]), chuan(x[2])]); }); });
      return tvCache;
    });
  }
  function timToanVan(q) {
    var kq = $('#kq');
    if (!q) return;
    kq.innerHTML = '<p class="mo">Đang tìm trong nội dung…</p>';
    taiTv().then(function (tv) {
      var c = chuan(q), ds = [], trich = {};
      tv.forEach(function (x) {
        var b = theoId[x[0]]; if (!b) return;
        var i = x[3].indexOf(c), nguon = x[1];
        if (i < 0) { i = x[4].indexOf(c); nguon = x[2]; }
        if (i < 0) return;
        ds.push(b);
        var a = Math.max(0, i - 70);
        trich[b.id] = (a ? '…' : '') + esc(nguon.slice(a, i)) + '<mark>' + esc(nguon.slice(i, i + q.length)) + '</mark>' + esc(nguon.slice(i + q.length, i + q.length + 90)) + '…';
      });
      nguCanh = { ten: 'Nội dung có "' + q + '"', href: location.hash, ds: ds.map(function (b) { return b.id; }) };
      kq.innerHTML = '<p class="mo">' + ds.length + ' bài có "' + esc(q) + '" trong nội dung.</p>' + (ds.length ? dsBai(ds, function (b) { return trich[b.id]; }) : '');
    }).catch(function () { kq.innerHTML = '<div class="thong-bao">Chưa tải được dữ liệu toàn văn (cần mạng lần đầu, hoặc tải ngoại tuyến trong Cài đặt).</div>'; });
  }

  /* ---------- ôn tập, đánh dấu ---------- */
  function trangOn() {
    tieuDeTrang('Ôn tập');
    var tdo = Kho.tt().tien_do;
    var han = Kho.denHan().map(function (id) { return theoId[id]; }).filter(Boolean);
    var sap = Object.keys(tdo).filter(function (id) { return tdo[id].han && tdo[id].han > Kho.homNay() && theoId[id]; })
      .sort(function (a, b) { return tdo[a].han < tdo[b].han ? -1 : 1; }).map(function (id) { return theoId[id]; });
    var thuoc = Object.keys(tdo).filter(function (id) { return tdo[id].thuoc && theoId[id]; }).map(function (id) { return theoId[id]; });
    nguCanh = { ten: 'Ôn tập hôm nay', href: '#/on', ds: han.map(function (b) { return b.id; }) };
    app.innerHTML = '<div class="trong hep"><h1>Ôn tập</h1><p class="mo">Bấm “Đã học xong” ở cuối một bài để đưa vào lịch ôn giãn cách: sau ' +
      Kho.MOC.join(', ') + ' ngày. Mỗi lần ôn: đọc lướt, tự nhắc lại ý chính, rồi chọn “Nhớ được” hoặc “Chưa nhớ”.</p>' +
      '<h2 class="muc">Đến hạn hôm nay (' + han.length + ')</h2>' + (han.length ? dsBai(han) : '<p class="mo">Không có bài nào đến hạn.</p>') +
      '<h2 class="muc">Sắp tới (' + sap.length + ')</h2>' + (sap.length ? dsBai(sap, function (b) { return 'Hạn ôn: ' + tdo[b.id].han + ' · lần ' + ((tdo[b.id].moc || 0) + 1) + '/' + Kho.MOC.length; }) : '<p class="mo">Chưa có.</p>') +
      (thuoc.length ? '<h2 class="muc">Đã thuộc (' + thuoc.length + ')</h2>' + dsBai(thuoc) : '') + '</div>';
  }
  function trangDau() {
    tieuDeTrang('Đánh dấu');
    var dau = Kho.tt().dau, ghi = Kho.tt().ghi;
    var ds = Object.keys(dau).sort(function (a, b) { return dau[b] - dau[a]; }).map(function (id) { return theoId[id]; }).filter(Boolean);
    var coGhi = Object.keys(ghi).map(function (id) { return theoId[id]; }).filter(Boolean);
    nguCanh = { ten: 'Đánh dấu', href: '#/dau', ds: ds.map(function (b) { return b.id; }) };
    app.innerHTML = '<div class="trong hep"><h1>Đánh dấu</h1>' + (ds.length ? dsBai(ds) : '<p class="mo">Chưa đánh dấu bài nào (nút ☆ khi đọc).</p>') +
      '<h2 class="muc">Bài có ghi chú (' + coGhi.length + ')</h2>' + (coGhi.length ? dsBai(coGhi, function (b) { return esc(ghi[b.id].slice(0, 200)); }) : '<p class="mo">Chưa có.</p>') + '</div>';
  }

  /* ---------- cài đặt, tải ngoại tuyến, sao lưu ---------- */
  function trangCaiDat() {
    tieuDeTrang('Cài đặt');
    var g = Kho.cai('giao_dien') || '';
    var h = '<div class="trong hep cai-dat"><h1>Cài đặt</h1>';
    h += '<div class="the"><h3>Giao diện</h3><div class="hang">' +
      [['', 'Theo máy'], ['light', 'Sáng'], ['dark', 'Tối']].map(function (x) { return '<button class="nut' + (g === x[0] ? ' bat' : '') + '" data-gd="' + x[0] + '">' + x[1] + '</button>'; }).join('') +
      '<span class="mo">Cỡ chữ bài đọc: ' + (Kho.cai('co_chu') || 17) + 'px</span><button class="nut" data-co="-1">A−</button><button class="nut" data-co="1">A+</button></div></div>';
    h += '<div class="the"><h3>Tải để đọc khi không có mạng</h3><p class="mo">Chọn chuyên mục rồi bấm tải. Bài đã mở một lần cũng tự được lưu.' +
      ('serviceWorker' in navigator ? '' : ' <b>Trình duyệt này không hỗ trợ đọc ngoại tuyến.</b>') + '</p>' +
      '<div class="chon-cm"><label><input type="checkbox" id="cm-tat-ca"> <b>Tất cả (' + ML.so_bai + ' bài)</b></label>' +
      ML.chuyen_muc.map(function (c) { return '<label><input type="checkbox" value="' + c.id + '"> ' + esc(tenCm(c)) + ' (' + c.n + ')</label>'; }).join('') + '</div>' +
      '<label class="mo"><input type="checkbox" id="kem-anh" checked> Kèm hình ảnh (ECG, sơ đồ) — tốn dung lượng hơn</label>' +
      '<div class="hang" style="margin-top:10px"><button class="nut chinh" id="tai-nt">Tải về máy</button><button class="nut" id="xoa-nt">Xoá bộ nhớ ngoại tuyến</button></div>' +
      '<div id="tt-nt" class="mo" style="margin-top:8px"></div></div>';
    h += '<div class="the"><h3>Sao lưu tiến độ học</h3><p class="mo">Tiến độ, đánh dấu, ghi chú lưu trong trình duyệt này. Tải bản sao lưu để chuyển sang máy khác.</p>' +
      '<div class="hang"><button class="nut" id="xuat">Tải bản sao lưu</button><label class="nut">Khôi phục từ file<input type="file" id="nhap" accept=".json,application/json" hidden></label></div></div>';
    h += '<div class="the"><h3>Thông tin dữ liệu</h3><p class="mo">' + ML.so_bai + ' bài (' + ML.so_da_dich + ' đã dịch), ' + ML.chuyen_muc.length +
      ' chuyên mục, đóng gói ngày ' + esc(ML.ngay) + '.</p><p class="mo">Nội dung gốc: Life in the Fast Lane (litfl.com). Ứng dụng này chỉ dùng cá nhân, không công khai. Bản dịch do máy tạo; khi có khác biệt hãy theo bản gốc.</p>' +
      '<p class="mo" id="dung-luong"></p></div></div>';
    app.innerHTML = h;
    app.querySelectorAll('[data-gd]').forEach(function (n) { n.onclick = function () { Kho.cai('giao_dien', n.dataset.gd); apCaiDat(); trangCaiDat(); }; });
    app.querySelectorAll('[data-co]').forEach(function (n) { n.onclick = function () { Kho.cai('co_chu', Math.max(13, Math.min(26, (Kho.cai('co_chu') || 17) + +n.dataset.co))); apCaiDat(); trangCaiDat(); }; });
    $('#cm-tat-ca').onchange = function (e) { app.querySelectorAll('.chon-cm input[value]').forEach(function (i) { i.checked = e.target.checked; }); };
    $('#tai-nt').onclick = taiNgoaiTuyen;
    $('#xoa-nt').onclick = function () {
      if (!confirm('Xoá toàn bộ bài đã tải về? (Tiến độ học không bị xoá.)')) return;
      caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k.indexOf('litfl-du-lieu') === 0; }).map(function (k) { return caches.delete(k); })); })
        .then(function () { $('#tt-nt').textContent = 'Đã xoá.'; uocDungLuong(); });
    };
    $('#xuat').onclick = function () {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([Kho.xuat()], { type: 'application/json' }));
      a.download = 'litfl-vi-sao-luu-' + Kho.homNay() + '.json'; a.click();
    };
    $('#nhap').onchange = function (e) {
      var f = e.target.files[0]; if (!f) return;
      f.text().then(function (s) { try { Kho.nhap(s); apCaiDat(); alert('Đã khôi phục.'); trangCaiDat(); demOn(); } catch (x) { alert(x.message); } });
    };
    uocDungLuong();
  }
  function uocDungLuong() {
    if (navigator.storage && navigator.storage.estimate) navigator.storage.estimate().then(function (e) {
      var n = $('#dung-luong'); if (n) n.textContent = 'Dung lượng trình duyệt đang dùng: ' + (e.usage / 1048576).toFixed(1) + ' MB' + (e.quota ? ' / ' + (e.quota / 1048576).toFixed(0) + ' MB cho phép.' : '.');
    });
  }
  function taiNgoaiTuyen() {
    var chon = Array.prototype.map.call(app.querySelectorAll('.chon-cm input[value]:checked'), function (i) { return +i.value; });
    var tatCa = $('#cm-tat-ca').checked, kemAnh = $('#kem-anh').checked;
    var ds = ML.bai.filter(function (b) { return tatCa || b.c.some(function (c) { return chon.indexOf(c) >= 0; }); });
    if (!ds.length) { $('#tt-nt').textContent = 'Chưa chọn chuyên mục.'; return; }
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist();
    var nut = $('#tai-nt'); nut.disabled = true;
    var tt = $('#tt-nt'), xong = 0, loi = 0, i = 0;
    tt.innerHTML = '<progress max="' + ds.length + '" value="0"></progress><span></span>';
    var tvXong = taiTv().catch(function () {});
    function mot() {
      if (i >= ds.length) return Promise.resolve();
      var b = ds[i++];
      return taiBai(b).then(function (d) {
        if (!kemAnh) return;
        var anh = (d.vi + d.en).match(/<img[^>]+src="([^"]+)"/g) || [];
        return Promise.all(anh.map(function (m) {
          var src = m.match(/src="([^"]+)"/)[1].replace(/&amp;/g, '&');
          return fetch(src, /^https?:/.test(src) ? { mode: 'no-cors' } : {}).catch(function () {});
        }));
      }).then(function () { xong++; }, function () { loi++; }).then(function () {
        var p = tt.querySelector('progress'); if (p) p.value = xong + loi;
        var s = tt.querySelector('span'); if (s) s.textContent = ' ' + xong + '/' + ds.length + ' bài' + (loi ? ', lỗi ' + loi : '');
        return mot();
      });
    }
    Promise.all([mot(), mot(), mot(), mot(), tvXong]).then(function () {
      nut.disabled = false;
      tt.querySelector('span').textContent = ' Xong: ' + xong + '/' + ds.length + ' bài' + (loi ? ', lỗi ' + loi + ' (bấm tải lại để thử tiếp)' : '') + '.';
      uocDungLuong();
    });
  }

  /* ---------- định tuyến ---------- */
  function khongThay() { app.innerHTML = '<div class="trong hep"><h1>Không tìm thấy</h1><p><a href="#/">Về trang chủ</a></p></div>'; }
  function demOn() {
    if (!ML) return;
    var n = Kho.denHan().filter(function (id) { return theoId[id]; }).length, e = $('#dem-on');
    e.hidden = !n; e.textContent = n;
  }
  var bai_dang_doc = null;
  function dinhTuyen() {
    if (bai_dang_doc != null) Kho.viTri(bai_dang_doc, window.scrollY);
    bai_dang_doc = null;
    var p = location.hash.replace(/^#\/?/, '').split('/');
    document.querySelectorAll('#nav a').forEach(function (a) { a.classList.toggle('on', a.dataset.r === p[0] || (p[0] === 'tim' && a.dataset.r === 'tim')); });
    $('#phong').hidden = true;
    dsDangXem = [];
    window.scrollTo(0, 0);
    if (p[0] === 'b') { bai_dang_doc = +p[1]; trangBai(+p[1]); }
    else if (p[0] === 'cm') trangCm(p[1]);
    else if (p[0] === 'tim') trangTim(decodeURIComponent(p.slice(1).join('/')));
    else if (p[0] === 'on') trangOn();
    else if (p[0] === 'dau') trangDau();
    else if (p[0] === 'cd') trangCaiDat();
    else trangChu();
    demOn();
  }

  window.addEventListener('scroll', function () {
    var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    $('#tien-trinh').style.width = bai_dang_doc != null && max > 0 ? (100 * h.scrollTop / max) + '%' : '0';
  }, { passive: true });
  window.addEventListener('pagehide', function () { if (bai_dang_doc != null) Kho.viTri(bai_dang_doc, window.scrollY); });
  $('#phong').onclick = function () { this.hidden = true; };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') $('#phong').hidden = true; });
  $('#o-tim').onsubmit = function (e) { e.preventDefault(); location.hash = '#/tim/' + encodeURIComponent($('#tim').value.trim()); };
  $('#tim').addEventListener('input', function (e) {
    if (location.hash.indexOf('#/tim') === 0 && $('#tim-trang')) { $('#tim-trang').value = e.target.value; $('#tim-trang').oninput(); }
  });
  $('#tim').addEventListener('focus', function () { if (location.hash.indexOf('#/tim') !== 0) location.hash = '#/tim/' + encodeURIComponent($('#tim').value); });
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); hoanCai = e; if (!location.hash || location.hash === '#/') trangChu(); });

  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(function () {});

  taiMucLuc().then(function () {
    window.addEventListener('hashchange', dinhTuyen);
    dinhTuyen();
  }).catch(function (e) {
    app.innerHTML = '<div class="trong hep"><h1>Chưa có dữ liệu</h1><div class="thong-bao">Không đọc được <code>data/muc-luc.json</code> (' + esc(e.message) + ').</div>' +
      '<p>Chạy trên máy tính (cần Python 3 và mạng), trong thư mục <code>litfl-vi</code>:</p><ol>' +
      '<li><code>python cong-cu/tai_litfl.py</code> — tải bài LITFL (tiếng Anh)</li>' +
      '<li><code>python cong-cu/dich_litfl.py --uoc-tinh</code> rồi <code>python cong-cu/dich_litfl.py</code> — dịch sang tiếng Việt</li>' +
      '<li><code>python cong-cu/dong_goi.py</code> — đóng gói cho ứng dụng</li>' +
      '<li><code>python cong-cu/chay.py</code> — mở ứng dụng</li></ol>' +
      (location.protocol === 'file:' ? '<p class="thong-bao">Đang mở trực tiếp file. Hãy mở qua <code>python cong-cu/chay.py</code> để trình duyệt cho phép đọc dữ liệu.</p>' : '') +
      '<p>Xem hướng dẫn đầy đủ trong <code>litfl-vi/README.md</code>.</p></div>';
  });
})();

/* Các kiểu câu hỏi tương tác (chạm, kéo thả, bàn phím số trên màn hình).
   KC.ve(cau, khung, ctx) → { canKiem, layGiaTri, daDu, danhDau(kq), hienDapAn, khoa }
   KC.kiem(cau, giaTri) → { dung, chiTiet, loi } */
(function (g) {
  'use strict';
  const KC = {};
  const { $, $$, el } = T;

  /* ---------- Thay ô [[i]] và {{i}} bằng phần tử ---------- */
  KC.oTrong = html => String(html)
    .replace(/\[\[(\d+)\]\]/g, (_, i) => `<span class="o-nhap" data-i="${i}" role="textbox" aria-label="Ô trống ${Number(i) + 1}" tabindex="0"></span>`)
    .replace(/\{\{(\d+)\}\}/g, (_, i) => `<span class="o-tha" data-i="${i}" aria-label="Chỗ thả ${Number(i) + 1}"></span>`);

  /* ================= BÀN PHÍM SỐ ================= */
  const BP = KC.banPhim = {
    goc: null, dangChon: null, khiXong: null,
    tao() {
      this.goc = $('#ban-phim');
      this.goc.innerHTML = `<div class="bp-luoi">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => `<button class="bp-phim" data-k="${k}">${k}</button>`).join('')}
        <button class="bp-phim bp-xoa" data-k="xoa" aria-label="Xoá">⌫</button><button class="bp-phim" data-k="0">0</button><button class="bp-phim bp-ok" data-k="ok" aria-label="Xong">✓</button></div>`;
      this.goc.addEventListener('pointerdown', e => {
        const b = e.target.closest('.bp-phim'); if (!b) return;
        e.preventDefault(); this.bam(b.dataset.k); b.classList.add('nhan'); setTimeout(() => b.classList.remove('nhan'), 120);
      });
      document.addEventListener('keydown', e => {
        if (!this.dangChon || !document.body.contains(this.dangChon) || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
        if (/^\d$/.test(e.key)) { this.bam(e.key); e.preventDefault(); }
        else if (e.key === 'Backspace') { this.bam('xoa'); e.preventDefault(); }
        else if (e.key === 'Enter') { this.bam('ok'); e.preventDefault(); }
        else if (e.key === 'Tab') { this.chuyen(e.shiftKey ? -1 : 1); e.preventDefault(); }
      });
    },
    nhom() { return this.dangChon ? $$('.o-nhap:not(.khoa)', this.dangChon.closest('.nhom-o') || document) : []; },
    chon(o) {
      $$('.o-nhap.dang-chon').forEach(x => x.classList.remove('dang-chon'));
      this.dangChon = o || null;
      if (o) { o.classList.add('dang-chon'); this.hien(true); }
    },
    chuyen(b) { const ds = this.nhom(), i = ds.indexOf(this.dangChon); if (ds.length) this.chon(ds[(i + b + ds.length) % ds.length]); },
    bam(k) {
      const o = this.dangChon; if (!o || o.classList.contains('khoa')) return;
      T.am.choi('cham');
      if (k === 'ok') { if (o._khiOk) o._khiOk(); return; }
      let s = o.dataset.gt || '';
      if (k === 'xoa') s = s.slice(0, -1);
      else if (s.length < (Number(o.dataset.dai) || 4)) s = (s === '0' ? '' : s) + k;
      o.dataset.gt = s; o.textContent = s; o.classList.remove('sai', 'dung');
      if (o._khiDoi) o._khiDoi(s);
      // tự sang ô kế tiếp khi đã đủ số chữ số của đáp án (nếu biết)
      if (k !== 'xoa' && o.dataset.du && s.length >= Number(o.dataset.du)) {
        const ds = this.nhom(), i = ds.indexOf(o);
        if (i >= 0 && i < ds.length - 1 && !ds[i + 1].dataset.gt) this.chon(ds[i + 1]);
      }
    },
    hien(c) { if (this.goc) this.goc.hidden = !c; document.body.classList.toggle('co-ban-phim', !!c); },
    gan(khung, khiOk) {
      const ds = $$('.o-nhap', khung);
      ds.forEach(o => {
        o._khiOk = khiOk;
        o.addEventListener('pointerdown', e => { e.preventDefault(); this.chon(o); });
        o.addEventListener('focus', () => this.chon(o));
      });
      return ds;
    }
  };

  /* ================= KIỂM TRA ĐÁP ÁN ================= */
  const bang = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
  KC.kiem = function (q, v) {
    switch (q.loai) {
      case 'so': case 'chiaDeu': return { dung: v === q.dapAn };
      case 'o': {
        if (q.khongThuTu) {
          const con = q.dapAn.slice(), ct = v.map(x => { const i = con.indexOf(x); if (i >= 0) { con.splice(i, 1); return true; } return false; });
          return { dung: ct.every(Boolean), chiTiet: ct };
        }
        const ds = [q.dapAn].concat(q.dapAnKhac || []);
        const khop = ds.find(d => bang(d, v));
        if (khop) return { dung: true, chiTiet: v.map(() => true) };
        return { dung: false, chiTiet: v.map((x, i) => x === q.dapAn[i] || (q.dapAnKhac || []).some(d => d[i] === x)) };
      }
      case 'chon': return { dung: v === q.dapAn };
      case 'chonNhieu': {
        if (q.kiem === 'tong') { const t = T.tong(v.map(i => q.luaChon[i].gt)); return { dung: t === q.dich, tong: t }; }
        const dung = new Set(q.dung), chon = new Set(v);
        const trung = v.filter(i => dung.has(i)).length, thua = v.length - trung, thieu = q.dung.length - trung;
        return { dung: thua === 0 && thieu === 0, trung, thua, thieu };
      }
      case 'sapXep': { const ct = v.map((x, i) => String(x) === String(q.dapAn[i])); return { dung: ct.every(Boolean) && v.length === q.dapAn.length, chiTiet: ct }; }
      case 'keoTha': { const ct = v.map((x, i) => x === q.dapAn[i]); return { dung: ct.every(Boolean), chiTiet: ct }; }
      case 'dongHo': return { dung: (v.gio % 12) === (q.dapAn.gio % 12) && v.phut === q.dapAn.phut };
      case 'tuCham': return { dung: !!v };
      default: return { dung: false };
    }
  };

  /* ================= VẼ TỪNG KIỂU ================= */
  const VE = {};
  KC.ve = function (q, khung, ctx) {
    const f = VE[q.loai] || VE.so;
    return f(q, khung, ctx);
  };

  function oNhapChung(q, khung, ctx, dapAnDs) {
    const ds = BP.gan(khung, () => ctx.kiemTra());
    ds.forEach(o => { const i = Number(o.dataset.i); if (dapAnDs && dapAnDs[i] != null) { o.dataset.du = String(dapAnDs[i]).length; o.dataset.dai = Math.max(4, String(dapAnDs[i]).length); } });
    if (ds.length) setTimeout(() => BP.chon(ds.find(o => !o.dataset.gt) || ds[0]), 30);
    return ds;
  }
  const giaTriO = o => o.dataset.gt === '' || o.dataset.gt == null ? null : Number(o.dataset.gt);

  /* --- Điền một số / nhiều ô --- */
  VE.so = VE.o = function (q, khung, ctx) {
    const vung = khung.querySelector('.vung-tra-loi');
    const coO = !!khung.querySelector('.o-nhap');
    if (!coO) vung.innerHTML = KC.oTrong(`<div class="dong-tra-loi"><span>Trả lời:</span> [[0]] ${q.donVi ? `<span class="don-vi">${q.donVi}</span>` : ''}</div>`);
    else if (q.donVi) vung.innerHTML = `<div class="ghi-chu">Đơn vị: ${q.donVi}</div>`;
    const dap = q.loai === 'so' ? [q.dapAn] : q.dapAn;
    const ds = oNhapChung(q, khung, ctx, q.khongThuTu ? null : dap).sort((a, b) => a.dataset.i - b.dataset.i);
    return {
      canKiem: true,
      daDu: () => ds.every(o => giaTriO(o) != null),
      layGiaTri: () => q.loai === 'so' ? giaTriO(ds[0]) : ds.map(giaTriO),
      danhDau(kq) {
        if (q.loai === 'so') { ds[0].classList.add(kq.dung ? 'dung' : 'sai'); return; }
        ds.forEach((o, i) => o.classList.add(kq.dung || (kq.chiTiet && kq.chiTiet[i]) ? 'dung' : 'sai'));
      },
      hienDapAn() { ds.forEach((o, i) => { const v = q.loai === 'so' ? q.dapAn : q.dapAn[i]; o.dataset.gt = v; o.textContent = v; o.classList.remove('sai'); o.classList.add('lo'); }); },
      khoa() { ds.forEach(o => o.classList.add('khoa')); BP.chon(null); }
    };
  };

  /* --- Chọn một đáp án --- */
  VE.chon = function (q, khung, ctx) {
    const vung = khung.querySelector('.vung-tra-loi');
    const thuTu = q._thuTu || (q._thuTu = q.giuThuTu ? q.luaChon.map((_, i) => i) : T.tron(q.luaChon.map((_, i) => i)));
    const cot = q.cot || (q.luaChon.length <= 2 ? 2 : q.luaChon.some(x => String(x).length > 26) ? 1 : 2);
    vung.innerHTML = `<div class="lua-chon cot-${cot}">${thuTu.map((i, k) => `<button class="lc" data-i="${i}"><span class="lc-chu">${String.fromCharCode(65 + k)}</span><span class="lc-nd">${q.luaChon[i]}</span></button>`).join('')}</div>`;
    let daKhoa = false;
    $$('.lc', vung).forEach(b => b.addEventListener('click', () => { if (daKhoa || b.classList.contains('sai')) return; ctx.nop(Number(b.dataset.i), b); }));
    return {
      canKiem: false,
      danhDau(kq, v) { const b = vung.querySelector(`.lc[data-i="${v}"]`); if (b) b.classList.add(kq.dung ? 'dung' : 'sai'); },
      hienDapAn() { const b = vung.querySelector(`.lc[data-i="${q.dapAn}"]`); if (b) b.classList.add('lo'); },
      khoa() { daKhoa = true; $$('.lc', vung).forEach(b => b.classList.add('khoa')); }
    };
  };

  /* --- Chọn nhiều ô (bảng số, hình, tờ tiền) --- */
  VE.chonNhieu = function (q, khung, ctx) {
    const vung = khung.querySelector('.vung-tra-loi');
    const nhan = x => typeof x === 'object' && x ? x.nhan : x;
    vung.innerHTML = `<div class="chon-nhieu${q.nho ? ' nho' : ''}" style="--cot:${q.luoi || 4}">${q.luaChon.map((x, i) => `<button class="cn" data-i="${i}" aria-pressed="false">${nhan(x)}</button>`).join('')}</div><div class="ghi-chu dem-chon">Đã chọn: <b>0</b></div>`;
    const dem = $('.dem-chon b', vung);
    let daKhoa = false;
    $$('.cn', vung).forEach(b => b.addEventListener('click', () => {
      if (daKhoa) return; T.am.choi('cham');
      b.classList.toggle('bat'); b.setAttribute('aria-pressed', b.classList.contains('bat'));
      $$('.cn', vung).forEach(x => x.classList.remove('sai', 'dung'));
      dem.textContent = $$('.cn.bat', vung).length;
    }));
    return {
      canKiem: true,
      daDu: () => $$('.cn.bat', vung).length > 0,
      layGiaTri: () => $$('.cn.bat', vung).map(b => Number(b.dataset.i)),
      danhDau(kq) { if (kq.dung) $$('.cn.bat', vung).forEach(b => b.classList.add('dung')); },
      hienDapAn() {
        if (q.kiem === 'tong') return;
        $$('.cn', vung).forEach(b => { const i = Number(b.dataset.i); b.classList.toggle('bat', q.dung.includes(i)); if (q.dung.includes(i)) b.classList.add('lo'); });
      },
      khoa() { daKhoa = true; }
    };
  };

  /* --- Sắp xếp: chạm thẻ để đưa lên hàng trả lời --- */
  VE.sapXep = function (q, khung, ctx) {
    const vung = khung.querySelector('.vung-tra-loi');
    vung.innerHTML = `<div class="hang-xep dich" aria-label="Hàng trả lời">${q.dapAn.map(() => '<span class="cho-trong"></span>').join('')}</div><div class="hang-xep nguon">${q.luaChon.map((x, i) => `<button class="the-xep" data-i="${i}">${x}</button>`).join('')}</div><div class="ghi-chu">Chạm vào số theo thứ tự. Chạm lại để bỏ ra.</div>`;
    const dich = $('.dich', vung), nguon = $('.nguon', vung);
    let daKhoa = false;
    const veLai = () => { const da = $$('.the-xep', dich).length; $$('.cho-trong', dich).forEach((x, i) => { x.hidden = i < da; }); };
    $$('.the-xep', vung).forEach(b => b.addEventListener('click', () => {
      if (daKhoa) return; T.am.choi('cham');
      $$('.the-xep', vung).forEach(x => x.classList.remove('sai', 'dung'));
      if (b.parentElement === nguon) dich.insertBefore(b, dich.querySelector('.cho-trong')); else nguon.appendChild(b);
      veLai();
    }));
    return {
      canKiem: true,
      daDu: () => $$('.the-xep', dich).length === q.luaChon.length,
      layGiaTri: () => $$('.the-xep', dich).map(b => q.luaChon[Number(b.dataset.i)]),
      danhDau(kq) { $$('.the-xep', dich).forEach((b, i) => b.classList.add(kq.dung || (kq.chiTiet && kq.chiTiet[i]) ? 'dung' : 'sai')); },
      hienDapAn() { q.dapAn.forEach(v => { const b = $$('.the-xep', vung).find(x => String(q.luaChon[Number(x.dataset.i)]) === String(v) && !x._xong); b._xong = true; dich.insertBefore(b, dich.querySelector('.cho-trong')); b.classList.remove('sai'); b.classList.add('lo'); }); veLai(); },
      khoa() { daKhoa = true; }
    };
  };

  /* --- Kéo thả thẻ vào ô (có thể chạm thẻ rồi chạm ô) --- */
  VE.keoTha = function (q, khung, ctx) {
    const vung = khung.querySelector('.vung-tra-loi');
    const dungLai = !!q.dungLai;
    vung.innerHTML = `<div class="khay-the">${q.luaChon.map((x, i) => `<button class="the-tha" data-i="${i}" data-gt="${T.esc(x)}">${T.esc(x)}</button>`).join('')}</div><div class="ghi-chu">Kéo thẻ vào ô trống, hoặc chạm thẻ rồi chạm ô.</div>`;
    const oDs = $$('.o-tha', khung).sort((a, b) => a.dataset.i - b.dataset.i);
    let dangCam = null, daKhoa = false;
    const datVao = (o, the) => {
      if (daKhoa) return;
      if (o.dataset.gt && !dungLai && o._the) o._the.hidden = false;
      o.dataset.gt = the.dataset.gt; o.textContent = the.dataset.gt; o._the = the; o.classList.remove('sai', 'dung'); o.classList.add('co');
      if (!dungLai) the.hidden = true;
      T.am.choi('cham');
      $$('.the-tha.cam', vung).forEach(x => x.classList.remove('cam')); dangCam = null;
    };
    oDs.forEach(o => o.addEventListener('click', () => {
      if (daKhoa) return;
      if (dangCam) { datVao(o, dangCam); return; }
      if (o.dataset.gt) { if (!dungLai && o._the) o._the.hidden = false; o.dataset.gt = ''; o.textContent = ''; o.classList.remove('co', 'sai', 'dung'); }
    }));
    $$('.the-tha', vung).forEach(the => {
      the.addEventListener('pointerdown', e => {
        if (daKhoa) return;
        e.preventDefault();
        const x0 = e.clientX, y0 = e.clientY; let bong = null;
        const di = ev => {
          if (!bong && Math.hypot(ev.clientX - x0, ev.clientY - y0) > 6) { bong = the.cloneNode(true); bong.classList.add('bong'); document.body.appendChild(bong); }
          if (bong) { bong.style.left = ev.clientX + 'px'; bong.style.top = ev.clientY + 'px'; oDs.forEach(o => o.classList.remove('sap-tha')); const d = document.elementFromPoint(ev.clientX, ev.clientY); const o = d && d.closest('.o-tha'); if (o) o.classList.add('sap-tha'); }
        };
        const tha = ev => {
          window.removeEventListener('pointermove', di); window.removeEventListener('pointerup', tha); window.removeEventListener('pointercancel', tha);
          oDs.forEach(o => o.classList.remove('sap-tha'));
          if (bong) { bong.remove(); const d = document.elementFromPoint(ev.clientX, ev.clientY); const o = d && d.closest('.o-tha'); if (o && khung.contains(o)) datVao(o, the); }
          else { const dang = the.classList.contains('cam'); $$('.the-tha.cam', vung).forEach(x => x.classList.remove('cam')); if (!dang) { the.classList.add('cam'); dangCam = the; } else dangCam = null; }
        };
        window.addEventListener('pointermove', di); window.addEventListener('pointerup', tha); window.addEventListener('pointercancel', tha);
      });
    });
    return {
      canKiem: true,
      daDu: () => oDs.every(o => o.dataset.gt),
      layGiaTri: () => oDs.map(o => o.dataset.gt),
      danhDau(kq) { oDs.forEach((o, i) => o.classList.add(kq.dung || kq.chiTiet[i] ? 'dung' : 'sai')); },
      hienDapAn() { oDs.forEach((o, i) => { o.dataset.gt = q.dapAn[i]; o.textContent = q.dapAn[i]; o.classList.remove('sai'); o.classList.add('co', 'lo'); }); },
      khoa() { daKhoa = true; }
    };
  };

  /* --- Đồng hồ kéo kim --- */
  VE.dongHo = function (q, khung, ctx) {
    const vung = khung.querySelector('.vung-tra-loi');
    const buoc = q.buocPhut || 5;
    const st = { gio: 12, phut: 0 };
    vung.innerHTML = `<div class="dh-tuong-tac"><div class="dh-khung"></div>
      <div class="dh-nut"><div><span>Giờ</span><button data-k="g-">−</button><b class="dh-g">12</b><button data-k="g+">+</button></div>
      <div><span>Phút</span><button data-k="p-">−</button><b class="dh-p">00</b><button data-k="p+">+</button></div></div></div>`;
    const kh = $('.dh-khung', vung);
    let daKhoa = false;
    const ve = () => { kh.innerHTML = HV.dongHoSvg(st.gio, st.phut, 220); $('.dh-g', vung).textContent = st.gio; $('.dh-p', vung).textContent = String(st.phut).padStart(2, '0'); };
    ve();
    $$('.dh-nut button', vung).forEach(b => b.addEventListener('click', () => {
      if (daKhoa) return; T.am.choi('cham');
      const k = b.dataset.k;
      if (k === 'g+') st.gio = st.gio % 12 + 1; if (k === 'g-') st.gio = (st.gio + 10) % 12 + 1;
      if (k === 'p+') st.phut = (st.phut + buoc) % 60; if (k === 'p-') st.phut = (st.phut - buoc + 60) % 60;
      ve();
    }));
    let keo = null;
    kh.addEventListener('pointerdown', e => {
      if (daKhoa) return;
      const r = kh.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      keo = Math.hypot(x, y) < r.width * 0.27 ? 'gio' : 'phut'; kh.setPointerCapture(e.pointerId); e.preventDefault();
    });
    kh.addEventListener('pointermove', e => {
      if (!keo) return;
      const r = kh.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      let goc = Math.atan2(x, -y) * 180 / Math.PI; if (goc < 0) goc += 360;
      if (keo === 'phut') st.phut = (Math.round(goc / 6 / buoc) * buoc) % 60;
      else { st.gio = Math.round(goc / 30) % 12 || 12; }
      ve();
    });
    kh.addEventListener('pointerup', () => { keo = null; });
    return {
      canKiem: true, daDu: () => true,
      layGiaTri: () => ({ gio: st.gio, phut: st.phut }),
      danhDau(kq) { kh.classList.add(kq.dung ? 'dung' : 'sai'); setTimeout(() => kh.classList.remove('sai'), 700); },
      hienDapAn() { st.gio = q.dapAn.gio % 12 || 12; st.phut = q.dapAn.phut; ve(); kh.classList.add('dung'); },
      khoa() { daKhoa = true; }
    };
  };

  /* --- Chia đều vào đĩa (đồ dùng trực quan) + ô trả lời --- */
  VE.chiaDeu = function (q, khung, ctx) {
    const vung = khung.querySelector('.vung-tra-loi');
    const dem = Array(q.dia).fill(0); let con = q.tong;
    vung.innerHTML = `<div class="chia-deu"><div class="cd-dong">${''}</div><div class="cd-dia-ds">${dem.map((_, i) => `<button class="cd-dia" data-i="${i}" aria-label="Đĩa ${i + 1}"></button>`).join('')}</div>
      <div class="ghi-chu">Chạm vào đĩa để cho thêm 1 ${q.vat}. Chạm vào ${q.vat} trong đĩa để lấy lại.</div></div>` + KC.oTrong(`<div class="dong-tra-loi"><span>Mỗi đĩa có:</span> [[0]]</div>`);
    const dong = $('.cd-dong', vung);
    const ve = () => {
      dong.innerHTML = con ? `<span class="cd-vat">${q.vat.repeat(con)}</span>` : '<span class="ghi-chu">Đã chia hết!</span>';
      $$('.cd-dia', vung).forEach((d, i) => { d.innerHTML = `<span>${Array(dem[i]).fill(`<i>${q.vat}</i>`).join('')}</span><small>${dem[i]}</small>`; });
    };
    ve();
    $$('.cd-dia', vung).forEach(d => d.addEventListener('click', e => {
      const i = Number(d.dataset.i);
      if (e.target.tagName === 'I' && dem[i] > 0) { dem[i]--; con++; } else if (con > 0) { dem[i]++; con--; }
      T.am.choi('cham'); ve();
    }));
    const ds = oNhapChung(q, vung, ctx, [q.dapAn]);
    return {
      canKiem: true,
      daDu: () => giaTriO(ds[0]) != null,
      layGiaTri: () => giaTriO(ds[0]),
      danhDau(kq) { ds[0].classList.add(kq.dung ? 'dung' : 'sai'); },
      hienDapAn() { dem.fill(q.dapAn); con = 0; ve(); ds[0].dataset.gt = q.dapAn; ds[0].textContent = q.dapAn; ds[0].classList.add('lo'); },
      khoa() { ds.forEach(o => o.classList.add('khoa')); BP.chon(null); }
    };
  };

  /* --- Tự chấm: bài làm ra vở --- */
  VE.tuCham = function (q, khung, ctx) {
    const vung = khung.querySelector('.vung-tra-loi');
    vung.innerHTML = `<div class="tu-cham"><p>Con làm bài này ra vở hoặc giấy nháp. Làm xong thì bấm nút dưới đây để so với đáp án.</p>
      <button class="nut nut-phu xem-da">Con làm xong rồi · Xem đáp án</button><div class="tc-da" hidden></div></div>`;
    const da = $('.tc-da', vung);
    $('.xem-da', vung).addEventListener('click', e => {
      e.currentTarget.hidden = true; da.hidden = false;
      da.innerHTML = `<div class="tc-dap"><b>Đáp án:</b> ${T.esc(q.dapAnChu || '')}</div><p>Con so sánh với bài của mình nhé.</p><div class="tc-nut"><button class="nut nut-dung" data-v="1">✓ Con làm đúng</button><button class="nut nut-phu" data-v="0">✗ Con làm chưa đúng</button></div>`;
      $$('.tc-nut button', da).forEach(b => b.addEventListener('click', () => ctx.nop(b.dataset.v === '1', b)));
    });
    return { canKiem: false, danhDau() { }, hienDapAn() { }, khoa() { $$('button', vung).forEach(b => { b.disabled = true; }); } };
  };

  g.KC = KC;
})(typeof window !== 'undefined' ? window : globalThis);

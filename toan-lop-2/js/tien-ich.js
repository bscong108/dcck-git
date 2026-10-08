/* Tiện ích chung: số ngẫu nhiên, lưu trữ, âm thanh, đọc to, đọc số bằng chữ. */
(function (g) {
  'use strict';
  const T = {};

  /* ---------- Ngẫu nhiên ---------- */
  T.n = (a, b) => a + Math.floor(Math.random() * (b - a + 1));          // số nguyên trong [a, b]
  T.c = arr => arr[Math.floor(Math.random() * arr.length)];             // chọn 1 phần tử
  T.tron = arr => {                                                      // xáo trộn (bản sao)
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  T.khac = (a, b, f) => { let x; do { x = f(); } while (x === a || x === b); return x; };
  T.lap = (n, f) => Array.from({ length: n }, (_, i) => f(i));
  T.tong = arr => arr.reduce((s, x) => s + x, 0);

  /* ---------- Lưu trữ (an toàn khi trình duyệt chặn) ---------- */
  const TIEN_TO = 'toan2.';
  T.luu = {
    doc(k, mac) {
      try { const v = localStorage.getItem(TIEN_TO + k); return v == null ? mac : JSON.parse(v); }
      catch (e) { return mac; }
    },
    ghi(k, v) { try { localStorage.setItem(TIEN_TO + k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    xoa(k) { try { localStorage.removeItem(TIEN_TO + k); } catch (e) { /* bỏ qua */ } },
    tatCa() {
      const o = {};
      try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith(TIEN_TO)) o[k.slice(TIEN_TO.length)] = JSON.parse(localStorage.getItem(k)); } }
      catch (e) { /* bỏ qua */ }
      return o;
    }
  };

  /* ---------- DOM ---------- */
  T.$ = (s, r) => (r || document).querySelector(s);
  T.$$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  T.el = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  T.esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

  /* ---------- Âm thanh (WebAudio, không cần file) ---------- */
  let ctx = null;
  function phat(tan, batDau, dai, kieu, am) {
    const o = ctx.createOscillator(), gn = ctx.createGain();
    o.type = kieu || 'sine'; o.frequency.value = tan;
    gn.gain.setValueAtTime(0.0001, ctx.currentTime + batDau);
    gn.gain.exponentialRampToValueAtTime(am || 0.18, ctx.currentTime + batDau + 0.02);
    gn.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + batDau + dai);
    o.connect(gn); gn.connect(ctx.destination);
    o.start(ctx.currentTime + batDau); o.stop(ctx.currentTime + batDau + dai + 0.05);
  }
  T.am = {
    bat: true,
    mo() { try { if (!ctx) ctx = new (g.AudioContext || g.webkitAudioContext)(); if (ctx.state === 'suspended') ctx.resume(); } catch (e) { ctx = null; } },
    choi(ten) {
      if (!this.bat) return; this.mo(); if (!ctx) return;
      try {
        if (ten === 'dung') { phat(660, 0, .12); phat(880, .1, .18); }
        else if (ten === 'sai') { phat(220, 0, .22, 'triangle', .14); }
        else if (ten === 'cham') { phat(520, 0, .06, 'sine', .08); }
        else if (ten === 'thang') { [523, 659, 784, 1047].forEach((f, i) => phat(f, i * .12, .25)); }
        else if (ten === 'goiy') { phat(740, 0, .1, 'sine', .1); phat(620, .08, .12, 'sine', .1); }
      } catch (e) { /* bỏ qua */ }
    }
  };

  /* ---------- Đọc to bằng giọng tiếng Việt (nếu máy có) ---------- */
  T.docTo = function (html) {
    try {
      if (!('speechSynthesis' in g)) return false;
      const d = document.createElement('div'); d.innerHTML = html;
      d.querySelectorAll('.o-nhap,.o-tha').forEach(x => { x.textContent = ' ô trống '; });
      let s = d.textContent.replace(/\s+/g, ' ')
        .replace(/×/g, ' nhân ').replace(/ : /g, ' chia ').replace(/−/g, ' trừ ').replace(/\+/g, ' cộng ')
        .replace(/=/g, ' bằng ').replace(/</g, ' bé hơn ').replace(/>/g, ' lớn hơn ').replace(/\?/g, '?');
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(s);
      u.lang = 'vi-VN'; u.rate = 0.9;
      const v = speechSynthesis.getVoices().find(x => /vi/i.test(x.lang));
      if (v) u.voice = v;
      speechSynthesis.speak(u);
      return true;
    } catch (e) { return false; }
  };
  T.dungDoc = () => { try { speechSynthesis.cancel(); } catch (e) { /* bỏ qua */ } };

  /* ---------- Đọc số bằng chữ (đến 1000), theo cách viết trong SGK ---------- */
  const CS = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  function haiChuSo(n) {               // 0..99, không có hàng trăm phía trước
    if (n < 10) return CS[n];
    if (n === 10) return 'mười';
    const c = Math.floor(n / 10), d = n % 10;
    if (c === 1) return 'mười ' + (d === 5 ? 'lăm' : CS[d]);
    let s = CS[c] + ' mươi';
    if (d === 0) return s;
    if (d === 1) return s + ' mốt';
    if (d === 4) return s + ' tư';
    if (d === 5) return s + ' lăm';
    return s + ' ' + CS[d];
  }
  T.soChu = function (n) {
    if (n === 1000) return 'một nghìn';
    if (n < 100) return haiChuSo(n);
    const tr = Math.floor(n / 100), du = n % 100;
    let s = CS[tr] + ' trăm';
    if (du === 0) return s;
    if (du < 10) return s + ' linh ' + CS[du];
    return s + ' ' + haiChuSo(du);
  };

  /* ---------- Khác ---------- */
  T.homNay = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  T.so = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');  // 1 000 (khoảng hẹp)
  T.chuSo = n => String(n).split('').map(Number);

  g.T = T;
})(typeof window !== 'undefined' ? window : globalThis);

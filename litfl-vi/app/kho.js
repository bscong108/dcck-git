/* Lưu tiến độ học trong trình duyệt (localStorage) và các hàm tiện ích. */
(function () {
  'use strict';
  var KHOA = 'litfl-vi';
  var MOC = [1, 3, 7, 21, 60, 120];   // số ngày giữa các lần ôn

  function rong() {
    return { tien_do: {}, dau: {}, ghi: {}, gan_day: [], cai_dat: { co_chu: 17, che_do: 'vi', giao_dien: '' } };
  }
  var tt;
  try { tt = JSON.parse(localStorage.getItem(KHOA)) || rong(); } catch (e) { tt = rong(); }
  var mau = rong();
  Object.keys(mau).forEach(function (k) { if (tt[k] == null) tt[k] = mau[k]; });

  // tab khác sửa tiến độ → đọc lại để không ghi đè lên nhau
  window.addEventListener('storage', function (e) {
    if (e.key === KHOA && e.newValue) { try { tt = JSON.parse(e.newValue); } catch (x) { /* bỏ qua */ } }
  });

  function luu() { try { localStorage.setItem(KHOA, JSON.stringify(tt)); } catch (e) { /* bộ nhớ đầy hoặc bị chặn */ } }

  function homNay(lech) {
    var d = new Date(); d.setDate(d.getDate() + (lech || 0));
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function td(id) { return tt.tien_do[id] || (tt.tien_do[id] = {}); }

  var Kho = {
    MOC: MOC,
    tt: function () { return tt; },
    luu: luu,
    homNay: homNay,
    daDoc: function (id) {
      var t = td(id); t.doc = t.doc || Date.now(); t.xem = Date.now();
      tt.gan_day = [id].concat(tt.gan_day.filter(function (x) { return x !== id; })).slice(0, 30);
      luu();
    },
    viTri: function (id, y) { if (y == null) return (tt.tien_do[id] || {}).y || 0; td(id).y = y; luu(); },
    hoc: function (id) { var t = td(id); t.hoc = homNay(); t.moc = 0; t.han = homNay(MOC[0]); t.lan = 0; luu(); },
    boHoc: function (id) { var t = td(id); delete t.hoc; delete t.moc; delete t.han; delete t.lan; luu(); },
    on: function (id, nho) {
      var t = td(id); t.lan = (t.lan || 0) + 1;
      if (nho) {
        t.moc = (t.moc || 0) + 1;
        if (t.moc >= MOC.length) { t.thuoc = homNay(); delete t.han; }
        else t.han = homNay(MOC[t.moc]);
      } else t.han = homNay(1);
      luu();
    },
    denHan: function () {
      var h = homNay(), ra = [];
      Object.keys(tt.tien_do).forEach(function (id) { var t = tt.tien_do[id]; if (t.han && t.han <= h) ra.push(+id); });
      return ra;
    },
    dau: function (id, bat) { if (bat) tt.dau[id] = Date.now(); else delete tt.dau[id]; luu(); },
    ghi: function (id, s) { if (s == null) return tt.ghi[id] || ''; if (s.trim()) tt.ghi[id] = s; else delete tt.ghi[id]; luu(); },
    cai: function (k, v) { if (v === undefined) return tt.cai_dat[k]; tt.cai_dat[k] = v; luu(); },
    xuat: function () { return JSON.stringify({ litfl_vi: 1, ngay: homNay(), du_lieu: tt }, null, 1); },
    nhap: function (s) {
      var d = JSON.parse(s);
      if (!d || !d.litfl_vi || !d.du_lieu) throw new Error('File không phải bản sao lưu LITFL VI');
      tt = d.du_lieu; Object.keys(mau).forEach(function (k) { if (tt[k] == null) tt[k] = mau[k]; }); luu();
    }
  };

  /* bỏ dấu tiếng Việt, chữ thường: dùng cho tìm kiếm */
  Kho.chuan = function (s) {
    return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'd').toLowerCase();
  };
  Kho.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  };
  window.Kho = Kho;
})();

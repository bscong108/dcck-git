/* Lưu tiến độ (localStorage), nội dung nhập thêm và ghi âm (IndexedDB), lịch chu trình bài, ôn thẻ SM-2. */
(function (root) {
  "use strict";

  /* ---------- Ngày ---------- */
  const pad = (n) => String(n).padStart(2, "0");
  const homNay = () => { const d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); };
  const sangDate = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const congNgay = (s, n) => { const d = sangDate(s); d.setDate(d.getDate() + n); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); };
  const cachNgay = (a, b) => Math.round((sangDate(b) - sangDate(a)) / 86400000);
  const hienNgay = (s) => { if (!s) return ""; const [y, m, d] = s.split("-"); return d + "/" + m + "/" + y; };

  /* ---------- Tiến độ ---------- */
  const KHOA = "dcck-hoc-v1";
  const MAC_DINH = () => ({ phienBan: 1, bai: {}, the: {}, nhatKy: [], hanhDong: [], caiDat: { theMoiMoiNgay: 20, anChot: true, chiTheBaiDaHoc: true }, moiHomNay: { ngay: "", so: 0 } });
  let S;
  function tai() {
    try { S = Object.assign(MAC_DINH(), JSON.parse(localStorage.getItem(KHOA) || "{}")); }
    catch (e) { S = MAC_DINH(); }
    S.caiDat = Object.assign(MAC_DINH().caiDat, S.caiDat || {});
    return S;
  }
  let henLuu = null;
  function luu() {
    clearTimeout(henLuu);
    henLuu = setTimeout(() => { try { localStorage.setItem(KHOA, JSON.stringify(S)); } catch (e) { console.warn("Không lưu được tiến độ", e); } }, 150);
  }
  function luuNgay() { clearTimeout(henLuu); try { localStorage.setItem(KHOA, JSON.stringify(S)); } catch (e) { /* bỏ qua */ } }
  function bai(ma) {
    if (!S.bai[ma]) S.bai[ma] = { hoc: null, giang: null, on: [], traLoiTruoc: {}, traLoiSau: {}, danhDau: [], handout: [], kiemTra: [], feynman: [], vanDap: [] };
    return S.bai[ma];
  }
  function ghiHanhDong(lenh, ma, kho) { S.hanhDong.push({ ngay: homNay(), lenh, ma, kho: !!kho, daXuat: false }); }
  function ghiNhatKy(ma, loai, text) { S.nhatKy.push({ id: Date.now() + Math.random().toString(36).slice(2, 6), ngay: homNay(), ma, loai, text }); luu(); }

  /* ---------- Chu trình một bài (PHUONG-PHAP-HOC mục 1) ---------- */
  const MOC_ON = [3, 7, 21, 60, 120];
  /** Trạng thái chu trình: {buoc, nhan, han, tre} — han là ngày đến hạn việc kế tiếp. */
  function trangThai(ma, coNoiDung) {
    const b = S.bai[ma];
    if (!b || !b.hoc) return coNoiDung ? { buoc: "chua-hoc", nhan: "Đã viết, chưa học", han: null } : { buoc: "chua-co", nhan: "Chưa có bài", han: null };
    if (!b.giang) {
      const han = congNgay(b.hoc, 1);
      return { buoc: "giang", nhan: "Giảng lại (ngày 1)", han, tre: cachNgay(han, homNay()) };
    }
    const dat = b.on.filter((x) => x.dat).length;
    if (dat >= MOC_ON.length) return { buoc: "xong", nhan: "Hoàn tất ôn giãn cách", han: null };
    let han = congNgay(b.hoc, MOC_ON[dat]);
    const cuoi = b.on[b.on.length - 1];
    if (cuoi && !cuoi.dat && cuoi.ngay >= han) han = congNgay(cuoi.ngay, 1);
    return { buoc: "on", moc: dat, nhan: "Ôn ngày " + MOC_ON[dat], han, tre: cachNgay(han, homNay()) };
  }
  function danhDauHoc(ma, ngay) { const b = bai(ma); if (!b.hoc) { b.hoc = ngay || homNay(); ghiHanhDong("learned", ma); } luu(); }
  function danhDauGiang(ma) { const b = bai(ma); if (!b.giang) { b.giang = homNay(); ghiHanhDong("taught", ma); } luu(); }
  function ghiOn(ma, dat) { const b = bai(ma); b.on.push({ ngay: homNay(), dat }); ghiHanhDong("reviewed", ma, !dat); luu(); }

  /* ---------- Ôn thẻ: SM-2 rút gọn ---------- */
  function trangThaiThe(id) { return S.the[id] || null; }
  function duKien(id, diem) {
    const t = S.the[id];
    if (!t || t.n === 0) return diem === 1 ? 0 : diem === 4 ? 4 : 1;
    const ivl = t.ivl || 1, ef = t.ef || 2.5;
    if (diem === 1) return 1;
    if (diem === 2) return Math.max(ivl + 1, Math.round(ivl * 1.2));
    if (diem === 3) return Math.max(ivl + 1, Math.round(ivl * ef));
    return Math.max(ivl + 2, Math.round(ivl * ef * 1.3));
  }
  function chamThe(id, diem) {
    const cu = S.the[id];
    const moi = !cu;
    const t = cu ? Object.assign({}, cu) : { n: 0, ef: 2.5, ivl: 0, lapses: 0 };
    const ivl = duKien(id, diem);
    if (diem === 1) {
      if (t.n > 0) { t.lapses = (t.lapses || 0) + 1; t.ef = Math.max(1.3, t.ef - 0.2); }
      t.ivl = 0; t.due = homNay(); t.n = t.n > 0 ? t.n : 0;
    } else {
      if (diem === 2) t.ef = Math.max(1.3, t.ef - 0.15);
      if (diem === 4) t.ef = t.ef + 0.15;
      t.n = (t.n || 0) + 1; t.ivl = Math.min(36500, ivl); t.due = congNgay(homNay(), t.ivl);
    }
    t.lan = homNay();
    S.the[id] = t;
    if (moi) { if (S.moiHomNay.ngay !== homNay()) S.moiHomNay = { ngay: homNay(), so: 0 }; S.moiHomNay.so++; }
    luu();
    return t;
  }
  function soMoiConLai() { return Math.max(0, S.caiDat.theMoiMoiNgay - (S.moiHomNay.ngay === homNay() ? S.moiHomNay.so : 0)); }
  function denHan(id) { const t = S.the[id]; return !!t && t.due <= homNay(); }
  function nhanKhoang(ngay) { if (ngay <= 0) return "<10 ph"; if (ngay < 30) return ngay + " ng"; if (ngay < 365) return Math.round(ngay / 30) + " th"; return (ngay / 365).toFixed(1) + " n"; }

  /* ---------- IndexedDB: bài nhập thêm và ghi âm ---------- */
  let dbP = null;
  function db() {
    if (dbP) return dbP;
    dbP = new Promise((ok, loi) => {
      if (!root.indexedDB) return loi(new Error("Trình duyệt không hỗ trợ IndexedDB"));
      const r = indexedDB.open("dcck-hoc", 1);
      r.onupgradeneeded = () => {
        const d = r.result;
        if (!d.objectStoreNames.contains("bai")) d.createObjectStore("bai", { keyPath: "ma" });
        if (!d.objectStoreNames.contains("ghiAm")) d.createObjectStore("ghiAm", { keyPath: "id" }).createIndex("ma", "ma");
      };
      r.onsuccess = () => ok(r.result);
      r.onerror = () => loi(r.error);
    });
    return dbP;
  }
  async function tx(kho, che, fn) {
    const d = await db();
    return new Promise((ok, loi) => {
      const t = d.transaction(kho, che);
      const st = t.objectStore(kho);
      let kq;
      Promise.resolve(fn(st)).then((r) => { kq = r; });
      t.oncomplete = () => ok(kq && kq.result !== undefined ? kq.result : kq);
      t.onerror = () => loi(t.error);
    });
  }
  const idb = {
    tatCaBai: () => tx("bai", "readonly", (st) => st.getAll()).catch(() => []),
    luuBai: (o) => tx("bai", "readwrite", (st) => st.put(o)),
    xoaBai: (ma) => tx("bai", "readwrite", (st) => st.delete(ma)),
    ghiAmCuaBai: (ma) => tx("ghiAm", "readonly", (st) => st.index("ma").getAll(ma)).catch(() => []),
    luuGhiAm: (o) => tx("ghiAm", "readwrite", (st) => st.put(o)),
    xoaGhiAm: (id) => tx("ghiAm", "readwrite", (st) => st.delete(id)),
  };

  const api = {
    homNay, congNgay, cachNgay, hienNgay, tai, luu, luuNgay, bai, get S() { return S; }, set S(v) { S = v; },
    MAC_DINH, MOC_ON, trangThai, danhDauHoc, danhDauGiang, ghiOn, ghiNhatKy, ghiHanhDong,
    trangThaiThe, duKien, chamThe, soMoiConLai, denHan, nhanKhoang, idb, KHOA,
  };
  root.DCCK = root.DCCK || {};
  root.DCCK.store = api;
})(window);

/* Đồng bộ tiến độ và bài nhập thêm giữa các thiết bị, chỉ khi chạy ở bản trực tuyến trên claude.ai
   (capability db + user). Bản mở từ file trên máy: không làm gì, giữ nguyên localStorage. */
(function (root) {
  "use strict";
  const T = root.DCCK.store;
  const SO_MANH = 16;
  const K_DONG_BO = T.KHOA + "-dong-bo";
  const K_SUA = T.KHOA + "-sua";
  const TEN = ["tien-do-chung", "tien-do-bai", "tien-do-nhat-ky"].concat(Array.from({ length: SO_MANH }, (_, i) => "tien-do-the-" + i));
  const GIOI_HAN = 250000;

  let db = null, uid = null, dl, dlP = null;
  let trang = "tat", loi = "", lucOk = 0;
  let henDay = null, dangDay = false, conCho = false, lucKeo = 0;
  const daDay = {};
  const api = { trang: () => trang, loi: () => loi, lucOk: () => lucOk, onTienDo: null, onNoiDung: null, onTrangThai: null };

  const ls = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, String(v)); } catch (e) { return null; } };
  const bam = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return h + ":" + s.length; };
  const manhCua = (id) => { let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0; return Math.abs(h) % SO_MANH; };
  const bao = (t, l) => { trang = t; loi = l || ""; if (t === "ok") lucOk = Date.now(); if (api.onTrangThai) api.onTrangThai(); };
  const tl = (n) => db.doc("data/users/" + uid + "/" + n);
  const kho = () => db.doc("data/users/" + uid + "/noi-dung").collection("bai");

  function tach(S) {
    const the = Array.from({ length: SO_MANH }, () => ({}));
    for (const id in S.the) the[manhCua(id)][id] = S.the[id];
    const m = {
      "tien-do-chung": JSON.stringify({ phienBan: S.phienBan, caiDat: S.caiDat, moiHomNay: S.moiHomNay, hanhDong: S.hanhDong }),
      "tien-do-bai": JSON.stringify({ bai: S.bai }),
      "tien-do-nhat-ky": JSON.stringify({ nhatKy: S.nhatKy }),
    };
    the.forEach((t, i) => { m["tien-do-the-" + i] = JSON.stringify({ the: t }); });
    return m;
  }
  function gop(manh) {
    const S = T.MAC_DINH();
    for (const n in manh) {
      const o = JSON.parse(manh[n]);
      if (n.startsWith("tien-do-the-")) Object.assign(S.the, o.the || {});
      else Object.assign(S, o);
    }
    return S;
  }

  async function batDau() {
    if (!root.claude || typeof root.claude.use !== "function") return;
    bao("dang");
    try {
      const [d, u] = await Promise.all([root.claude.use("db"), root.claude.use("user")]);
      uid = u ? await u.id() : null;
      if (!d || !uid) { bao("tat"); return; }
      db = d;
      await keoVe();
      await keoBai();
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) dayNgay();
        else if (Date.now() - lucKeo > 20000) keoVe().then(keoBai);
      });
    } catch (e) { bao("loi", e.message || e.code || String(e)); }
  }

  async function keoVe() {
    if (!db) return;
    lucKeo = Date.now();
    try {
      const snaps = await Promise.all(TEN.map((n) => tl(n).get()));
      const xa = {};
      let moiNhat = 0;
      snaps.forEach((s, i) => {
        if (!s.exists) return;
        const d = s.data();
        xa[TEN[i]] = d;
        moiNhat = Math.max(moiNhat, +d.capNhatLuc || 0);
      });
      const dongBo = +ls(K_DONG_BO) || 0, sua = +ls(K_SUA) || 0;
      const coSuaChuaDay = sua > dongBo;
      if (moiNhat > dongBo && (!coSuaChuaDay || moiNhat > sua)) {
        const manh = {};
        for (const n in xa) { manh[n] = String(xa[n].json || "{}"); daDay[n] = bam(manh[n]); }
        T.S = Object.assign(T.MAC_DINH(), gop(manh));
        T.luuNgay();
        ls(K_DONG_BO, moiNhat); ls(K_SUA, moiNhat);
        bao("ok");
        if (api.onTienDo) api.onTienDo();
      } else {
        for (const n in xa) daDay[n] = bam(String(xa[n].json || ""));
        if (coSuaChuaDay || !moiNhat) await day();
        else bao("ok");
      }
    } catch (e) { bao("loi", e.message || e.code); }
  }

  async function day() {
    if (!db) return;
    if (dangDay) { conCho = true; return; }
    dangDay = true;
    const batDauLuc = Date.now();
    try {
      bao("dang");
      const m = tach(T.S);
      for (const n of TEN) {
        const h = bam(m[n]);
        if (daDay[n] === h) continue;
        if (soByte(m[n]) > GIOI_HAN) throw new Error("Dữ liệu phần " + n + " quá lớn để đồng bộ (" + Math.round(soByte(m[n]) / 1024) + " KB). Hãy tải bản sao lưu và xóa bớt nhật ký cũ.");
        await tl(n).set({ capNhatLuc: batDauLuc, json: m[n] });
        daDay[n] = h;
      }
      ls(K_DONG_BO, batDauLuc);
      bao("ok");
    } catch (e) {
      bao("loi", e.code === "quota_exceeded" ? "Hết dung lượng đồng bộ: " + e.message : e.message || e.code);
    } finally {
      dangDay = false;
      if (conCho) { conCho = false; day(); }
    }
  }
  function dayNgay() { clearTimeout(henDay); henDay = null; return day(); }
  T.sauLuu = () => { if (!db) return; clearTimeout(henDay); henDay = setTimeout(dayNgay, 4000); };

  /* ----- Bài nhập thêm (kéo thả ở trang Dữ liệu): mỗi phần một tài liệu "<MÃ>.md|handout|anki" ----- */
  const PHAN = ["md", "handout", "anki"];
  const soByte = (s) => new TextEncoder().encode(s).length;
  async function keoBai() {
    if (!db) return;
    try {
      const q = await kho().get();
      const xa = {};
      for (const d of q.docs) {
        const b = d.data() || {};
        if (!b.ma || !PHAN.includes(b.phan)) continue;
        const r = xa[b.ma] || (xa[b.ma] = { ma: b.ma, capNhatLuc: 0 });
        r[b.phan] = JSON.parse(String(b.json || "null"));
        r.capNhatLuc = Math.max(r.capNhatLuc, +b.capNhatLuc || 0);
      }
      const coSan = {};
      (await T.idb.tatCaBai()).forEach((r) => { coSan[r.ma] = r; });
      let doi = false;
      for (const ma in xa) {
        const cu = coSan[ma];
        if (!cu || (+cu.capNhatLuc || 0) < xa[ma].capNhatLuc) { await T.idb.luuBai(Object.assign({}, cu || {}, xa[ma])); doi = true; }
      }
      if (doi && api.onNoiDung) await api.onNoiDung();
    } catch (e) { bao("loi", "Không tải được bài nhập thêm: " + (e.message || e.code)); }
  }
  async function dayBai(r) {
    if (!db) return "tat";
    const luc = r.capNhatLuc || Date.now();
    try {
      for (const p of PHAN) {
        if (r[p] === undefined) continue;
        const json = JSON.stringify(r[p]);
        if (soByte(json) > GIOI_HAN) return "Phần " + p + " của " + r.ma + " quá lớn để đồng bộ (" + Math.round(soByte(json) / 1024) + " KB), chỉ lưu trên thiết bị này.";
        await kho().doc(r.ma + "." + p).set({ ma: r.ma, phan: p, capNhatLuc: luc, json });
      }
      return "ok";
    } catch (e) { return "Không đồng bộ được " + r.ma + ": " + (e.message || e.code); }
  }
  async function xoaBaiNhap(ma) { if (db) { for (const p of PHAN) { try { await kho().doc(ma + "." + p).delete(); } catch (e) { /* */ } } } }

  async function taiVe() {
    if (dl !== undefined) return dl;
    if (!root.claude || typeof root.claude.use !== "function" || location.protocol === "file:") { dl = null; return dl; }
    if (!dlP) dlP = root.claude.use("downloads").catch(() => null);
    dl = await dlP;
    return dl;
  }

  async function dongBoNgay() { await keoVe(); await keoBai(); await dayNgay(); }

  Object.assign(api, { batDau, keoVe, day: dayNgay, dayBai, xoaBaiNhap, taiVe, dongBoNgay, bat: () => !!db });
  root.DCCK.sync = api;
})(window);

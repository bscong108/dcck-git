/* Ứng dụng học ĐCCK: chu trình đọc chủ động → vẽ lại handout → giảng lại (Feynman) → vá lỗ hổng → ôn giãn cách. */
(function () {
  "use strict";
  const { md: MD, parse: P, store: T } = window.DCCK;
  const esc = MD.esc;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const app = $("#app");

  /* ================= Nội dung ================= */
  const ND = { mucLuc: null, phuongPhap: "", bai: {}, taoLuc: "" };
  let ML = { sach: [], bai: {}, phienBan: "" };

  async function napNoiDung() {
    const goc = window.DCCK_NOI_DUNG || { bai: {} };
    ND.taoLuc = goc.taoLuc || "";
    ND.mucLuc = goc.mucLuc || null;
    ND.phuongPhap = goc.phuongPhap || "";
    ND.bai = {};
    for (const ma in goc.bai || {}) ND.bai[ma] = Object.assign({ nguon: "goi" }, goc.bai[ma]);
    const nhap = await T.idb.tatCaBai();
    for (const r of nhap) {
      if (r.ma === "__MUC_LUC__") { ND.mucLuc = r.md; continue; }
      if (r.ma === "__PHUONG_PHAP__") { ND.phuongPhap = r.md; continue; }
      const b = ND.bai[r.ma] || (ND.bai[r.ma] = {});
      for (const k of ["md", "handout", "anki"]) if (r[k]) b[k] = r[k];
      b.nguon = "nhap";
    }
    ML = ND.mucLuc ? P.parseMucLuc(ND.mucLuc) : { sach: [], bai: {}, phienBan: "" };
    for (const ma in ND.bai) {
      const b = ND.bai[ma];
      b.p = b.md ? P.parseBai(b.md, ma) : null;
      b.the = P.lamThe(b.anki || [], ma);
      b.html = null;
    }
  }
  const coBai = (ma) => !!(ND.bai[ma] && (ND.bai[ma].md || ND.bai[ma].handout || (ND.bai[ma].anki || []).length));
  const tenBai = (ma) => (ML.bai[ma] && ML.bai[ma].ten) || (ND.bai[ma] && ND.bai[ma].p && ND.bai[ma].p.tieuDe) || ma;
  const dsCoBai = () => Object.keys(ND.bai).filter(coBai).sort(soSanhMa);
  function soSanhMa(a, b) {
    const ta = (ML.bai[a] || {}).cuon || 99, tb = (ML.bai[b] || {}).cuon || 99;
    if (ta !== tb) return ta - tb;
    return a.localeCompare(b, "en", { numeric: true });
  }
  function tatCaThe(chiBaiDaHoc) {
    const out = [];
    for (const ma of dsCoBai()) {
      const st = T.S.bai[ma];
      for (const t of ND.bai[ma].the) {
        if (chiBaiDaHoc && !(st && st.hoc) && !T.trangThaiThe(t.id)) continue;
        out.push(t);
      }
    }
    return out;
  }

  /* ================= Tiện ích giao diện ================= */
  let donDep = [];
  function sach() { donDep.forEach((f) => { try { f(); } catch (e) { /* */ } }); donDep = []; }
  function toast(msg) {
    const d = document.createElement("div");
    d.className = "toast"; d.textContent = msg;
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 2600);
  }
  function taiFile(ten, noiDung, kieu) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(noiDung instanceof Blob ? noiDung : new Blob([noiDung], { type: kieu || "text/plain;charset=utf-8" }));
    a.download = ten; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  async function saoChep(text) {
    try { await navigator.clipboard.writeText(text); toast("Đã sao chép"); }
    catch (e) { const t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); toast("Đã sao chép"); }
  }
  const pillTrangThai = (ma) => {
    const tt = T.trangThai(ma, coBai(ma));
    if (tt.buoc === "chua-co") return '<span class="pill ghost">chưa có bài</span>';
    if (tt.buoc === "chua-hoc") return '<span class="pill co">có bài · chưa học</span>';
    if (tt.buoc === "xong") return '<span class="pill xong">✓ xong chu trình</span>';
    const tre = tt.tre > 0;
    return '<span class="pill ' + (tt.tre >= 0 ? "tre" : "hoc") + '">' + esc(tt.nhan) + (tt.tre >= 0 ? (tre ? " · trễ " + tt.tre + " ng" : " · hôm nay") : " · " + T.hienNgay(tt.han).slice(0, 5)) + "</span>";
  };
  const inlineMd = (s) => MD.inline(s || "");
  function danhDauXref(el) {
    $$("a.xref", el).forEach((a) => {
      const ma = a.getAttribute("href").split("/").pop();
      if (!coBai(ma)) { a.classList.add("chua"); a.title = (ML.bai[ma] ? ML.bai[ma].ten + " — " : "") + "chưa có bài"; }
      else a.title = tenBai(ma);
    });
  }
  function capNhatDemThe() {
    const n = tatCaThe(false).filter((t) => T.denHan(t.id)).length;
    const el = $("#dem-the");
    el.hidden = !n; el.textContent = n;
  }

  /* ================= Bộ định tuyến ================= */
  function route() {
    sach();
    const h = (location.hash || "#/").slice(2).split("/").map(decodeURIComponent);
    $$("#nav a").forEach((a) => a.classList.toggle("on", a.dataset.r === (h[0] || "")));
    window.scrollTo(0, 0);
    try {
      switch (h[0]) {
        case "": return vHomNay();
        case "muc-luc": return vMucLuc();
        case "bai": return vBai(h[1], h[2] || "");
        case "on-the": return vOnThe();
        case "van-dap": return vVanDapChung();
        case "nhat-ky": return vNhatKy();
        case "phuong-phap": return vPhuongPhap();
        case "du-lieu": return vDuLieu();
        default: app.innerHTML = '<div class="empty">Không tìm thấy trang.</div>';
      }
    } catch (e) {
      console.error(e);
      app.innerHTML = '<div class="card nguy"><h2>Lỗi hiển thị</h2><pre>' + esc(String(e.stack || e)) + "</pre></div>";
    } finally { capNhatDemThe(); }
  }

  /* ================= Hôm nay ================= */
  function vHomNay() {
    const nay = T.homNay();
    const viec = [];
    for (const ma of Object.keys(T.S.bai)) {
      const tt = T.trangThai(ma, coBai(ma));
      if (tt.han && tt.han <= nay) viec.push({ ma, tt });
    }
    viec.sort((a, b) => a.tt.han.localeCompare(b.tt.han));
    const chuaHoc = dsCoBai().filter((ma) => !(T.S.bai[ma] && T.S.bai[ma].hoc));
    const the = tatCaThe(T.S.caiDat.chiTheBaiDaHoc);
    const theDen = the.filter((t) => T.denHan(t.id)).length;
    const theMoi = Math.min(T.soMoiConLai(), the.filter((t) => !T.trangThaiThe(t.id)).length);
    const tongBai = Object.keys(ML.bai).length;
    const gd1 = Object.values(ML.bai).filter((b) => b.gd === "1");
    const gd1Hoc = gd1.filter((b) => T.S.bai[b.ma] && T.S.bai[b.ma].hoc).length;
    const gd1Co = gd1.filter((b) => coBai(b.ma)).length;

    const viecHtml = viec.length ? '<ul class="list-plain">' + viec.map(({ ma, tt }) => {
      const tab = tt.buoc === "giang" ? "giang" : "chu-trinh";
      return '<li class="row between"><span><a href="#/bai/' + ma + '"><b>' + ma + "</b></a> " + esc(tenBai(ma)) + '<br><span class="small muted">' + esc(tt.nhan) + (tt.tre > 0 ? ' · <b style="color:var(--nguy)">trễ ' + tt.tre + " ngày</b>" : " · đến hạn hôm nay") + "</span></span>" +
        '<a class="btn nho chinh" href="#/bai/' + ma + "/" + tab + '">' + (tt.buoc === "giang" ? "Giảng lại" : "Ôn") + "</a></li>";
    }).join("") + "</ul>" : '<p class="muted">Không có bài đến hạn giảng lại hoặc ôn.</p>';

    const canhBao = chuaHoc.length > 8
      ? '<div class="card nguy"><b>' + chuaHoc.length + ' bài đã viết nhưng chưa học</b> — vượt ngưỡng 8 của quy tắc tiến độ. Tạm dừng viết bài mới, học bớt bài tồn.</div>' : "";

    // lịch 14 ngày
    const lich = [];
    for (let i = 0; i < 14; i++) {
      const d = T.congNgay(nay, i);
      let n = 0;
      for (const ma of Object.keys(T.S.bai)) { const tt = T.trangThai(ma, true); if (tt.han && (i === 0 ? tt.han <= d : tt.han === d)) n++; }
      const thu = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][new Date(d + "T00:00:00").getDay()];
      lich.push('<div class="' + (n ? "co " : "") + (i === 0 ? "nay" : "") + '" title="' + T.hienNgay(d) + '">' + thu + "<b>" + (n || "·") + "</b>" + d.slice(8) + "</div>");
    }

    const sachHtml = ML.sach.map((s) => {
      const ds = s.phan.flatMap((p) => p.bai);
      const co = ds.filter(coBai).length, hoc = ds.filter((m) => T.S.bai[m] && T.S.bai[m].hoc).length;
      const xong = ds.filter((m) => T.trangThai(m, true).buoc === "xong").length;
      const pc = (x) => (100 * x / ds.length).toFixed(1) + "%";
      return '<div style="margin:8px 0"><div class="row between small"><span><b>' + s.so + ". " + esc(s.ten) + '</b></span><span class="muted">' + co + " có bài · " + hoc + " đã học · " + xong + " xong / " + ds.length + '</span></div><div class="bar"><i style="width:' + pc(xong) + ';background:var(--dieu-tri)"></i><i style="width:' + pc(hoc - xong) + ';background:var(--bay)"></i><i style="width:' + pc(co - hoc) + ';background:var(--co-che);opacity:.55"></i></div></div>';
    }).join("");

    app.innerHTML =
      '<div class="row between" style="margin-bottom:12px"><div><h1>Hôm nay · ' + T.hienNgay(nay) + '</h1><div class="muted small">' + dsCoBai().length + " bài đã có nội dung / " + tongBai + " bài trong mục lục" + (ND.taoLuc ? " · gói nội dung " + esc(ND.taoLuc.replace("T", " ")) : "") + "</div></div></div>" +
      canhBao +
      '<div class="grid g3" style="margin:14px 0">' +
      '<div class="card lam"><div class="muted small">Thẻ Anki đến hạn</div><div class="stat">' + theDen + '</div><div class="small muted">+ ' + theMoi + ' thẻ mới hôm nay</div><div style="margin-top:8px"><a class="btn chinh nho" href="#/on-the">Ôn thẻ</a></div></div>' +
      '<div class="card bay"><div class="muted small">Bài đến hạn giảng lại / ôn</div><div class="stat">' + viec.length + '</div><div class="small muted">theo mốc ngày 1, 3, 7, 21, 60, 120</div></div>' +
      '<div class="card ' + (chuaHoc.length > 8 ? "nguy" : "xanh") + '"><div class="muted small">Đã viết, chưa học</div><div class="stat">' + chuaHoc.length + '<span class="small muted"> / tối đa 8</span></div><div class="small muted">Giai đoạn 1: ' + gd1Hoc + "/" + gd1.length + " đã học · " + gd1Co + " có bài</div></div>" +
      "</div>" +
      '<div class="grid g2">' +
      '<div class="card"><h2>Việc đến hạn</h2>' + viecHtml + "</div>" +
      '<div class="card"><h2>Bài mới viết, chờ học</h2>' + (chuaHoc.length ? '<ul class="list-plain">' + chuaHoc.slice(0, 12).map((ma) => '<li class="row between"><span><b>' + ma + "</b> " + esc(tenBai(ma)) + '</span><a class="btn nho" href="#/bai/' + ma + '/doc">Bắt đầu học</a></li>').join("") + "</ul>" : '<p class="muted">Không có bài tồn. Khi Cowork viết bài mới: chạy <code>cap-nhat-noi-dung.bat</code> hoặc nhập file ở <a href="#/du-lieu">Dữ liệu</a>.</p>') + "</div>" +
      "</div>" +
      '<div class="card" style="margin-top:14px"><div class="row between"><h2 style="margin:0">14 ngày tới</h2><span class="small muted">số bài đến hạn mỗi ngày</span></div><div class="cal" style="margin-top:10px">' + lich.join("") + "</div></div>" +
      '<div class="card" style="margin-top:14px"><div class="row between"><h2 style="margin:0">Tiến độ 9 cuốn</h2><span class="small"><span style="color:var(--dieu-tri)">■</span> xong chu trình <span style="color:var(--bay)">■</span> đang học <span style="color:var(--co-che);opacity:.6">■</span> có bài</span></div>' + (sachHtml || '<p class="muted">Chưa nạp mục lục.</p>') + "</div>" +
      vanDapNhanhHtml();
    ganVanDapNhanh();
  }

  /* ================= Mục lục ================= */
  const LOC_KHOA = "dcck-loc";
  function vMucLuc() {
    let loc;
    try { loc = JSON.parse(localStorage.getItem(LOC_KHOA) || "{}"); } catch (e) { loc = {}; }
    loc = Object.assign({ q: "", cuon: "", uu: "", gd: "", tt: "" }, loc);
    app.innerHTML = '<h1>Mục lục 9 cuốn</h1><p class="muted small">' + esc(ML.phienBan || "") + "</p>" +
      '<div class="filters">' +
      '<input class="q" type="search" id="f-q" placeholder="Tìm mã hoặc tên bài…" value="' + esc(loc.q) + '">' +
      '<select id="f-cuon"><option value="">Tất cả cuốn</option>' + ML.sach.map((s) => '<option value="' + s.so + '">' + s.so + ". " + esc(s.ten) + "</option>").join("") + "</select>" +
      '<select id="f-uu"><option value="">Ưu tiên A+B</option><option value="A">Ưu tiên A</option><option value="B">Ưu tiên B</option></select>' +
      '<select id="f-gd"><option value="">Mọi giai đoạn</option><option value="1">GĐ 1 nền móng</option><option value="2">GĐ 2 lõi lâm sàng</option><option value="3">GĐ 3 mở rộng</option></select>' +
      '<select id="f-tt"><option value="">Mọi trạng thái</option><option value="co">Có bài</option><option value="chua-hoc">Có bài, chưa học</option><option value="dang">Đang học</option><option value="han">Đến hạn</option><option value="xong">Xong chu trình</option><option value="chua-co">Chưa có bài</option></select>' +
      '</div><div id="ml-ds"></div>';
    ["cuon", "uu", "gd", "tt"].forEach((k) => { $("#f-" + k).value = loc[k]; });
    const ve = () => {
      ["q", "cuon", "uu", "gd", "tt"].forEach((k) => { loc[k] = $("#f-" + k).value; });
      try { localStorage.setItem(LOC_KHOA, JSON.stringify(loc)); } catch (e) { /* */ }
      const q = loc.q.trim().toLowerCase();
      const nay = T.homNay();
      const hop = (b) => {
        if (loc.cuon && String(b.cuon) !== loc.cuon) return false;
        if (loc.uu && b.uuTien !== loc.uu) return false;
        if (loc.gd && b.gd !== loc.gd) return false;
        if (q && !(b.ma.toLowerCase().includes(q) || b.ten.toLowerCase().includes(q))) return false;
        if (loc.tt) {
          const tt = T.trangThai(b.ma, coBai(b.ma));
          if (loc.tt === "co" && !coBai(b.ma)) return false;
          if (loc.tt === "chua-hoc" && tt.buoc !== "chua-hoc") return false;
          if (loc.tt === "dang" && !(tt.buoc === "giang" || tt.buoc === "on")) return false;
          if (loc.tt === "han" && !(tt.han && tt.han <= nay)) return false;
          if (loc.tt === "xong" && tt.buoc !== "xong") return false;
          if (loc.tt === "chua-co" && coBai(b.ma)) return false;
        }
        return true;
      };
      const loTrinh = !!(q || loc.uu || loc.gd || loc.tt);
      let html = "";
      for (const s of ML.sach) {
        if (loc.cuon && String(s.so) !== loc.cuon) continue;
        let tong = 0, body = "";
        for (const p of s.phan) {
          const ds = p.bai.map((m) => ML.bai[m]).filter(hop);
          if (!ds.length) continue;
          tong += ds.length;
          body += '<div class="part-title">' + esc(p.ten && p.ma ? p.ma + ". " + p.ten : p.ten) + "</div>" + ds.map((b) =>
            '<a class="lesson-row' + (coBai(b.ma) ? "" : " chua") + '" href="#/bai/' + b.ma + '"><span class="ma">' + b.ma + '</span><span class="ten">' + esc(b.ten) + '</span><span class="tags">' +
            (b.uuTien === "A" ? '<span class="pill a">A</span>' : '<span class="pill">B</span>') + '<span class="pill">' + esc(b.loai) + '</span><span class="pill">GĐ' + esc(b.gd) + "</span>" + pillTrangThai(b.ma) + "</span></a>").join("");
        }
        if (!tong) continue;
        const ds = s.phan.flatMap((p) => p.bai);
        html += '<details class="book"' + (loTrinh || loc.cuon || coBaiTrong(ds) ? " open" : "") + '><summary><b>Cuốn ' + s.so + ". " + esc(s.ten) + '</b><span class="spacer"></span><span class="small muted">' + tong + " bài · " + ds.filter(coBai).length + " có nội dung</span></summary>" +
          '<div class="book-body"><p class="small muted" style="margin:8px 0 0">' + esc(s.moTa[0] || "") + "</p>" + body + "</div></details>";
      }
      $("#ml-ds").innerHTML = html || '<div class="empty">Không có bài phù hợp bộ lọc.</div>';
    };
    const coBaiTrong = (ds) => ds.some(coBai);
    $$(".filters input, .filters select").forEach((el) => el.addEventListener("input", ve));
    if (!ML.sach.length) { $("#ml-ds").innerHTML = '<div class="empty">Chưa có mục lục. Đặt MUC-LUC-9-CUON.md vào thư mục nội dung rồi đóng gói lại, hoặc nhập ở trang <a href="#/du-lieu">Dữ liệu</a>.</div>'; return; }
    ve();
  }

  /* ================= Trang bài ================= */
  const TAB = [
    ["", "Chu trình"], ["doc", "1 · Đọc chủ động"], ["handout", "2 · Vẽ lại Handout"], ["giang", "3 · Giảng lại"],
    ["kiem-tra", "Tự kiểm tra"], ["the", "Thẻ ôn"], ["nhat-ky", "Nhật ký bài"],
  ];
  function vBai(ma, tab) {
    if (!ma) { location.hash = "#/muc-luc"; return; }
    ma = ma.toUpperCase();
    const m = ML.bai[ma] || {};
    const nd = ND.bai[ma];
    const b = T.S.bai[ma];
    const metaHtml = '<div class="row small muted" style="gap:6px;margin-top:4px">' +
      (m.tenCuon ? "<span>Cuốn " + m.cuon + " · " + esc(m.tenCuon) + "</span>" : "") +
      (m.uuTien ? '<span class="pill ' + (m.uuTien === "A" ? "a" : "") + '">Ưu tiên ' + m.uuTien + "</span>" : "") +
      (m.loai ? '<span class="pill">' + esc(m.loai) + "</span>" : "") + (m.gd ? '<span class="pill">GĐ ' + esc(m.gd) + "</span>" : "") +
      (m.cxxx && m.cxxx !== "—" ? '<span class="pill" title="Chương tương ứng Y học Cấp cứu Toàn tập">' + esc(m.cxxx) + "</span>" : "") + pillTrangThai(ma) + "</div>";
    const head = '<div class="lesson-head"><div class="small"><a href="#/muc-luc">← Mục lục</a></div><h1><span class="ma">' + ma + "</span> " + esc(tenBai(ma)) + "</h1>" + metaHtml + "</div>";

    if (!coBai(ma)) {
      const tro = dsCoBai().filter((x) => ND.bai[x].p && ND.bai[x].p.lienKet.includes(ma));
      app.innerHTML = head + '<div class="card"><h2>Chưa có bài</h2><p>Bài này chưa được viết. Khi Cowork tạo xong <code>' + ma + "_bai.md</code>, <code>" + ma + "_Handout.html</code>, <code>" + ma + '_anki.apkg</code>: chạy <code>cap-nhat-noi-dung.bat</code> (hoặc <code>python cong-cu/dong_goi.py</code>), hoặc kéo thả file vào trang <a href="#/du-lieu">Dữ liệu</a>.</p>' +
        (m.phan ? '<p class="muted small">' + esc(m.phan) + "</p>" : "") +
        (tro.length ? "<h3>Các bài đã có dẫn chiếu tới " + ma + '</h3><ul class="list-plain">' + tro.map((x) => '<li><a href="#/bai/' + x + '"><b>' + x + "</b> " + esc(tenBai(x)) + "</a></li>").join("") + "</ul>" : "") + "</div>";
      return;
    }
    const tabs = TAB.filter(([k]) => {
      if (k === "handout") return !!nd.handout;
      if (k === "the") return nd.the.length > 0;
      if (k === "doc" || k === "giang" || k === "kiem-tra") return !!nd.md;
      return true;
    });
    app.innerHTML = head + bacThangHtml(ma) +
      '<nav class="tabs">' + tabs.map(([k, t]) => '<a href="#/bai/' + ma + (k ? "/" + k : "") + '" class="' + (k === tab ? "on" : "") + '">' + t + "</a>").join("") + "</nav>" +
      '<section id="tab"></section>';
    const el = $("#tab");
    ({ "": tChuTrinh, doc: tDoc, handout: tHandout, giang: tGiang, "kiem-tra": tKiemTra, the: tThe, "nhat-ky": tNhatKyBai }[tab] || tChuTrinh)(ma, el);
    void b;
  }

  function bacThangHtml(ma) {
    const b = T.S.bai[ma] || {};
    const tt = T.trangThai(ma, true);
    const dat = (b.on || []).filter((x) => x.dat).length;
    const lo = (b.danhDau || []).length;
    const nk = T.S.nhatKy.filter((x) => x.ma === ma);
    const s = [
      ["doc", "1. Đọc chủ động", b.docXong ? "đã đọc" : Object.keys(b.traLoiTruoc || {}).length ? "đang đọc" : "ngày 0", !!b.docXong, !b.hoc && !b.docXong],
      ["handout", "2. Vẽ lại", b.hoc ? "học " + T.hienNgay(b.hoc).slice(0, 5) : "ngày 0", !!b.hoc, !b.hoc && !!b.docXong],
      ["giang", "3. Giảng lại", b.giang ? "giảng " + T.hienNgay(b.giang).slice(0, 5) : "ngày 1", !!b.giang, tt.buoc === "giang"],
      ["nhat-ky", "4. Vá lỗ hổng", b.vaXong ? "đã vá" : lo ? lo + " chỗ đánh dấu" : "ngày 1", !!b.vaXong, !!b.giang && !b.vaXong && lo > 0],
      ["", "5. Ôn giãn cách", dat + "/5 mốc", dat >= 5, tt.buoc === "on"],
      ["nhat-ky", "6. Giảng thật", nk.filter((x) => x.loai === "giang-that").length + " lần", nk.some((x) => x.loai === "giang-that"), false],
      ["nhat-ky", "7. Đối chiếu ca", nk.filter((x) => x.loai === "lam-sang").length + " ca", nk.some((x) => x.loai === "lam-sang"), false],
    ];
    return '<div class="steps">' + s.map(([k, t, phu, xong, nay]) => '<a class="step ' + (xong ? "done" : "") + (nay ? " now" : "") + '" href="#/bai/' + ma + (k ? "/" + k : "") + '"><b>' + (xong ? "✓ " : "") + t + "</b>" + esc(phu) + "</a>").join("") + "</div>";
  }

  /* ----- Tab: Chu trình ----- */
  function tChuTrinh(ma, el) {
    const nd = ND.bai[ma];
    const b = T.bai(ma);
    const tt = T.trangThai(ma, true);
    const nay = T.homNay();
    let lich = "";
    if (b.hoc) {
      const dat = b.on.filter((x) => x.dat);
      lich = '<table><thead><tr><th>Mốc</th><th>Ngày dự kiến</th><th>Kết quả</th></tr></thead><tbody>' +
        '<tr><td>Ngày 0 · học</td><td>' + T.hienNgay(b.hoc) + '</td><td>✓</td></tr>' +
        '<tr><td>Ngày 1 · giảng lại</td><td>' + T.hienNgay(T.congNgay(b.hoc, 1)) + "</td><td>" + (b.giang ? "✓ " + T.hienNgay(b.giang) : "") + "</td></tr>" +
        T.MOC_ON.map((d, i) => "<tr><td>Ngày " + d + " · ôn</td><td>" + T.hienNgay(T.congNgay(b.hoc, d)) + "</td><td>" + (dat[i] ? "✓ " + T.hienNgay(dat[i].ngay) : "") + "</td></tr>").join("") +
        "</tbody></table>" + (b.on.some((x) => !x.dat) ? '<p class="small muted">Lần ôn chưa đạt: ' + b.on.filter((x) => !x.dat).map((x) => T.hienNgay(x.ngay)).join(", ") + " — mốc giữ nguyên, hẹn ôn lại hôm sau.</p>" : "");
    }
    let hanhDong = "";
    if (tt.buoc === "chua-hoc") hanhDong = '<p>Bắt đầu bằng <b>đọc chủ động</b>: tự trả lời câu hỏi dẫn dắt trước khi đọc, đánh dấu chỗ không tự giải thích lại được. Sau đó <b>vẽ lại Handout</b> và đánh dấu đã học.</p><div class="row"><a class="btn chinh" href="#/bai/' + ma + '/doc">Đọc chủ động</a>' + (nd.handout ? '<a class="btn" href="#/bai/' + ma + '/handout">Vẽ lại Handout</a>' : "") + '<button class="btn" id="hoc-nay">Đánh dấu đã học hôm nay</button></div>';
    else if (tt.buoc === "giang") hanhDong = "<p>Ngày 1: <b>giảng lại 10 phút</b> cho một sinh viên tưởng tượng, có ghi âm; nghe lại, ghi chỗ vấp.</p>" + (tt.han > nay ? '<p class="small muted">Đến hạn ' + T.hienNgay(tt.han) + "; có thể giảng sớm hơn.</p>" : "") + '<a class="btn chinh" href="#/bai/' + ma + '/giang">Giảng lại</a>';
    else if (tt.buoc === "on") hanhDong = "<p>" + esc(tt.nhan) + " — " + (tt.han <= nay ? "<b>đến hạn" + (tt.tre > 0 ? ", trễ " + tt.tre + " ngày" : " hôm nay") + "</b>" : "đến hạn " + T.hienNgay(tt.han)) + ".</p><p>Một lần ôn gồm: vẽ lại Handout từ trí nhớ, làm câu hỏi tự kiểm tra, ôn thẻ Anki. Xong thì ghi kết quả:</p>" +
      '<div class="row">' + (nd.handout ? '<a class="btn" href="#/bai/' + ma + '/handout">Vẽ lại Handout</a>' : "") + '<a class="btn" href="#/bai/' + ma + '/kiem-tra">Tự kiểm tra</a>' + (nd.the.length ? '<a class="btn" href="#/bai/' + ma + '/the">Thẻ ôn</a>' : "") + '</div><div class="row" style="margin-top:10px"><button class="btn xanh" id="on-dat">✓ Ôn đạt</button><button class="btn cam" id="on-kho">Chưa đạt (khó)</button></div>';
    else if (tt.buoc === "xong") hanhDong = "<p>Đã đủ 5 mốc ôn. Duy trì bằng <b>giảng thật</b> hằng tháng (sinh hoạt khoa học, dạy học viên) và <b>đối chiếu lâm sàng</b> khi gặp ca: ghi ở Nhật ký bài.</p><a class=\"btn\" href=\"#/bai/" + ma + '/nhat-ky">Ghi nhật ký</a>';

    const p = nd.p;
    el.innerHTML = '<div class="grid g2">' +
      '<div class="card bay"><h2>Việc tiếp theo</h2>' + hanhDong + "</div>" +
      '<div class="card"><h2>Lịch chu trình</h2>' + (lich || '<p class="muted">Lịch tính từ ngày học (ngày 0): giảng lại ngày 1; ôn ngày 3, 7, 21, 60, 120.</p>') +
      '<details style="margin-top:10px"><summary class="small muted">Đã học trước đó? Đặt ngày học</summary><div class="row" style="margin-top:8px"><input type="date" id="ngay-hoc" style="width:auto" value="' + (b.hoc || nay) + '"><button class="btn nho" id="dat-ngay">Lưu ngày học</button>' + (b.hoc ? '<button class="btn nho" id="dat-lai">Học lại từ đầu</button>' : "") + "</div></details></div>" +
      "</div>" +
      (p && p.tomTat.length ? '<div class="card lam" style="margin-top:14px"><h2>Tóm tắt 60 giây</h2><ul>' + p.tomTat.map((x) => "<li>" + inlineMd(x) + "</li>").join("") + "</ul></div>" : "") +
      (p && p.hopDong.length ? '<div class="card" style="margin-top:14px"><h2>Hợp đồng đầu ra</h2><p class="small muted">Sau bài, phải làm được:</p><ul>' + p.hopDong.map((x) => "<li>" + inlineMd(x) + "</li>").join("") + "</ul></div>" : "") +
      (p && p.lienKet.length ? '<div class="card" style="margin-top:14px"><h2>Liên kết chéo</h2><div class="row">' + p.lienKet.map((x) => '<a class="xref" href="#/bai/' + x + '">→ ' + x + "</a>").join(" ") + "</div></div>" : "");
    danhDauXref(el);
    const lai = () => route();
    const on = (id, f) => { const e = $("#" + id, el); if (e) e.onclick = f; };
    on("hoc-nay", () => { T.danhDauHoc(ma); toast("Đã ghi: học " + ma + " hôm nay"); lai(); });
    on("on-dat", () => { T.ghiOn(ma, true); toast("Đã ghi lần ôn đạt"); lai(); });
    on("on-kho", () => { T.ghiOn(ma, false); toast("Ghi chưa đạt: ôn lại hôm sau"); lai(); });
    on("dat-ngay", () => { const v = $("#ngay-hoc", el).value; if (!v) return; const bb = T.bai(ma); if (!bb.hoc) T.ghiHanhDong("learned", ma); bb.hoc = v; T.luu(); toast("Đã đặt ngày học " + T.hienNgay(v)); lai(); });
    on("dat-lai", () => { if (!confirm("Xóa lịch chu trình của " + ma + " (giữ nhật ký, câu trả lời, thẻ)?")) return; const bb = T.bai(ma); bb.hoc = null; bb.giang = null; bb.on = []; bb.vaXong = false; T.luu(); lai(); });
  }

  /* ----- Tab: Đọc chủ động ----- */
  function htmlBai(ma) {
    const nd = ND.bai[ma];
    if (!nd.html) { const r = MD.render(nd.md); nd.html = r.html; nd.headings = r.headings; }
    return nd;
  }
  function tDoc(ma, el) {
    const nd = ND.bai[ma];
    const p = nd.p;
    const b = T.bai(ma);
    if (!b.batDauDoc && p.cauHoiDanDat.length) {
      el.innerHTML = '<div class="gate"><div class="card lam"><h2>Trước khi đọc: tự trả lời</h2><p class="small muted">Truy hồi trước khi đọc làm chỗ trống lộ ra. Viết vài dòng, đoán cũng được; sau khi đọc sẽ so lại.</p>' +
        (p.ca ? '<details style="margin-bottom:12px"><summary><b>Ca lâm sàng mở đầu</b></summary><div class="prose" style="font-size:16px;margin-top:8px">' + MD.render(p.ca, { noIndex: true }).html + "</div></details>" : "") +
        p.cauHoiDanDat.map((q, i) => '<div class="q"><label>' + (i + 1) + ". " + inlineMd(q) + '</label><textarea data-i="' + i + '" placeholder="Câu trả lời của tôi…">' + esc(b.traLoiTruoc[i] || "") + "</textarea></div>").join("") +
        '<div class="row"><button class="btn chinh" id="bat-dau">Bắt đầu đọc bài</button><span class="small muted">Câu trả lời được lưu tự động.</span></div></div></div>';
      $$("textarea", el).forEach((t) => t.addEventListener("input", () => { b.traLoiTruoc[t.dataset.i] = t.value; T.luu(); }));
      $("#bat-dau", el).onclick = () => { b.batDauDoc = T.homNay(); T.luu(); tDoc(ma, el); window.scrollTo(0, 0); };
      return;
    }
    htmlBai(ma);
    const toc = nd.headings.filter((h) => h.level === 2 || h.level === 3).map((h) => '<a href="javascript:void 0" data-id="' + h.id + '" class="l' + h.level + '">' + esc(h.text) + "</a>").join("");
    el.innerHTML = '<div class="row between no-print" style="margin-bottom:10px"><div class="row small"><label class="row" style="gap:6px;cursor:pointer"><input type="checkbox" id="an-chot"' + (T.S.caiDat.anChot ? " checked" : "") + '> Che khối CHỐT LẠI để tự nhắc lại trước</label></div>' +
      '<div class="row small muted"><span>Bấm <b>?</b> bên trái đoạn để đánh dấu chỗ <b>chưa tự giải thích lại được</b> · <span id="so-dd">' + b.danhDau.length + "</span> chỗ</span></div></div>" +
      '<div class="reader"><nav class="toc no-print">' + toc + '</nav><article class="prose" id="prose">' + nd.html +
      '<div id="sau-doc"></div></article></div>';
    const prose = $("#prose", el);
    danhDauXref(prose);
    const tap = new Set(b.danhDau.map((x) => x.b));
    $$("[data-b]", prose).forEach((blk) => {
      const i = +blk.dataset.b;
      if (tap.has(i)) blk.classList.add("flag");
      const nut = document.createElement("button");
      nut.className = "flag-btn"; nut.textContent = "?"; nut.title = "Đánh dấu: chưa tự giải thích lại được";
      nut.onclick = (e) => {
        e.stopPropagation();
        const k = b.danhDau.findIndex((x) => x.b === i);
        if (k >= 0) { b.danhDau.splice(k, 1); blk.classList.remove("flag"); }
        else {
          let h = blk.previousElementSibling;
          while (h && !/^H[23]$/.test(h.tagName)) h = h.previousElementSibling;
          b.danhDau.push({ b: i, muc: h ? h.textContent : "", text: blk.textContent.replace(/^\?/, "").trim().slice(0, 220), ngay: T.homNay() });
          blk.classList.add("flag");
        }
        T.luu();
        $("#so-dd", el).textContent = b.danhDau.length;
        veSauDoc();
      };
      blk.prepend(nut);
    });
    const apChot = () => $$("blockquote.chot", prose).forEach((q) => q.classList.toggle("an", T.S.caiDat.anChot));
    apChot();
    prose.addEventListener("click", (e) => { const q = e.target.closest("blockquote.chot.an"); if (q) q.classList.remove("an"); });
    $("#an-chot", el).onchange = (e) => { T.S.caiDat.anChot = e.target.checked; T.luu(); apChot(); };
    $$(".toc a", el).forEach((a) => a.onclick = () => { const h = document.getElementById(a.dataset.id); if (h) h.scrollIntoView({ behavior: "smooth" }); });

    function veSauDoc() {
      const s = $("#sau-doc", el);
      s.innerHTML = '<h2 id="h-sau-khi-doc">Sau khi đọc</h2>' +
        (p.cauHoiDanDat.length ? '<div class="card lam" style="font-family:var(--font);font-size:15px"><h3>So lại câu hỏi dẫn dắt</h3><p class="small muted">Trả lời lại không nhìn bài, rồi so với câu trả lời trước khi đọc.</p>' +
          p.cauHoiDanDat.map((q, i) => '<div style="margin:12px 0"><b>' + (i + 1) + ". " + inlineMd(q) + "</b>" + (b.traLoiTruoc[i] ? '<div class="small muted" style="margin:4px 0">Trước khi đọc: ' + esc(b.traLoiTruoc[i]) + "</div>" : "") + '<textarea data-sau="' + i + '" placeholder="Trả lời lại bằng lời của mình…">' + esc((b.traLoiSau || {})[i] || "") + "</textarea></div>").join("") + "</div>" : "") +
        '<div class="card bay" style="font-family:var(--font);font-size:15px;margin-top:12px"><h3>Chỗ chưa tự giải thích được (' + b.danhDau.length + ")</h3>" +
        (b.danhDau.length ? '<ul class="list-plain">' + b.danhDau.map((x) => '<li class="small"><b>' + esc(x.muc) + "</b><br>" + esc(x.text) + "…</li>").join("") + '</ul><p class="small muted">Danh sách này là đầu vào cho bước 3 (giảng lại) và bước 4 (vá lỗ hổng: quay lại đúng đoạn nguồn).</p>' : '<p class="small muted">Chưa đánh dấu chỗ nào.</p>') + "</div>" +
        '<div class="row" style="margin-top:14px;font-family:var(--font)"><button class="btn xanh" id="doc-xong">' + (b.docXong ? "✓ Đã đọc xong" : "Đã đọc xong") + "</button>" + (nd.handout ? '<a class="btn chinh" href="#/bai/' + ma + '/handout">Sang bước 2: Vẽ lại Handout →</a>' : "") + '<button class="btn" id="ve-cau-hoi">Xem lại câu trả lời trước khi đọc</button></div>';
      $$("textarea[data-sau]", s).forEach((t) => t.addEventListener("input", () => { b.traLoiSau = b.traLoiSau || {}; b.traLoiSau[t.dataset.sau] = t.value; T.luu(); }));
      $("#doc-xong", s).onclick = () => { b.docXong = T.homNay(); T.luu(); toast("Đã ghi: đọc xong"); $("#doc-xong", s).textContent = "✓ Đã đọc xong"; };
      $("#ve-cau-hoi", s).onclick = () => { b.batDauDoc = null; T.luu(); tDoc(ma, el); window.scrollTo(0, 0); };
    }
    veSauDoc();
  }

  /* ----- Tab: Vẽ lại Handout ----- */
  const HO_SCRIPT = `<style>
html.handout .k{cursor:pointer}
html .k0.sai{outline:2.5px solid #C0392B;outline-offset:1px;background:rgba(192,57,43,.12)!important}
text.k0.sai,tspan.k0.sai{fill:#C0392B!important;text-decoration:underline}
html.handout .k:hover{border-bottom-color:#1F5AA6!important;background:rgba(31,90,166,.08)}
.k0{cursor:pointer}
</style><script>(function(){
var de=document.documentElement;
function all(){return Array.prototype.slice.call(document.querySelectorAll('.k,.k0'));}
all().forEach(function(e){e.setAttribute('data-k','1');});
function bao(){var a=all();parent.postMessage({dcckHo:1,tong:a.length,mo:document.querySelectorAll('.k0').length,sai:document.querySelectorAll('.k0.sai').length,h:Math.max(de.scrollHeight,document.body.scrollHeight)},'*');}
document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-k]');if(!t)return;
 if(t.classList.contains('k')){t.classList.remove('k');t.classList.add('k0');}
 else{t.classList.toggle('sai');}
 bao();});
window.addEventListener('message',function(e){var d=e.data||{};
 if(d.lenh==='hien'){all().forEach(function(t){t.classList.remove('k');t.classList.add('k0');});}
 if(d.lenh==='che'){all().forEach(function(t){t.classList.add('k');t.classList.remove('k0','sai');});}
 if(d.lenh==='key'){de.classList.toggle('handout',!d.bat);}
 if(d.lenh==='zoom'){document.body.style.zoom=d.z;}
 bao();});
window.addEventListener('load',bao);window.addEventListener('resize',bao);setTimeout(bao,300);
})();<\/script>`;
  function tHandout(ma, el) {
    const nd = ND.bai[ma];
    const b = T.bai(ma);
    const lan = b.handout.slice(-5).reverse();
    el.innerHTML = '<div class="card" style="margin-bottom:10px"><b>Cách làm:</b> lấy giấy, vẽ lại sơ đồ và điền ô trống từ trí nhớ (hoặc nhẩm từng ô). Sau đó bấm từng ô gạch để mở đáp án; <b>bấm lần nữa vào ô đã mở</b> nếu mình điền sai (tô đỏ). Cuối cùng lưu kết quả.' +
      (lan.length ? '<div class="small muted" style="margin-top:6px">Các lần trước: ' + lan.map((x) => T.hienNgay(x.ngay) + " (sai " + x.sai + "/" + x.tong + ")").join(" · ") + "</div>" : "") + "</div>" +
      '<div class="ho-bar row between no-print"><div class="row"><button class="btn nho" id="ho-hien">Hiện tất cả</button><button class="btn nho" id="ho-che">Che lại</button><label class="row small" style="gap:4px"><input type="checkbox" id="ho-key"> Bản Key</label><label class="row small" style="gap:4px"><input type="checkbox" id="ho-vua" checked> Vừa khung</label><button class="btn nho" id="ho-in">In</button></div>' +
      '<div class="row"><span class="small" id="ho-dem">—</span><button class="btn xanh nho" id="ho-luu">Lưu kết quả lần vẽ</button></div></div>' +
      '<iframe class="handout-frame" id="ho-frame" title="Handout ' + ma + '"></iframe>';
    const fr = $("#ho-frame", el);
    let html = nd.handout;
    html = /<\/body>/i.test(html) ? html.replace(/<\/body>/i, HO_SCRIPT + "</body>") : html + HO_SCRIPT;
    fr.srcdoc = html;
    let kq = { tong: 0, mo: 0, sai: 0 };
    const gui = (d) => fr.contentWindow && fr.contentWindow.postMessage(d, "*");
    const zoom = () => {
      const vua = $("#ho-vua", el).checked;
      const z = vua ? Math.min(1, (fr.clientWidth - 4) / 1590) : 1;
      gui({ lenh: "zoom", z: window.innerWidth < 980 ? 1 : z });
    };
    const nghe = (e) => {
      if (e.source !== fr.contentWindow || !e.data || !e.data.dcckHo) return;
      kq = e.data;
      fr.style.height = Math.max(600, e.data.h + 20) + "px";
      $("#ho-dem", el).innerHTML = "Đã mở <b>" + kq.mo + "/" + kq.tong + "</b> · sai <b style=\"color:var(--nguy)\">" + kq.sai + "</b>";
    };
    window.addEventListener("message", nghe);
    window.addEventListener("resize", zoom);
    donDep.push(() => { window.removeEventListener("message", nghe); window.removeEventListener("resize", zoom); });
    fr.addEventListener("load", () => setTimeout(zoom, 50));
    $("#ho-hien", el).onclick = () => gui({ lenh: "hien" });
    $("#ho-che", el).onclick = () => gui({ lenh: "che" });
    $("#ho-key", el).onchange = (e) => gui({ lenh: "key", bat: e.target.checked });
    $("#ho-vua", el).onchange = zoom;
    $("#ho-in", el).onclick = () => { gui({ lenh: "zoom", z: 1 }); setTimeout(() => { fr.contentWindow.print(); zoom(); }, 100); };
    $("#ho-luu", el).onclick = () => {
      if (!kq.mo) { toast("Chưa mở ô nào"); return; }
      b.handout.push({ ngay: T.homNay(), tong: kq.tong, mo: kq.mo, sai: kq.sai });
      T.luu();
      const tt = T.trangThai(ma, true);
      if (!b.hoc && confirm("Đã lưu (sai " + kq.sai + "/" + kq.tong + ").\nĐánh dấu đã học " + ma + " hôm nay (ngày 0 của chu trình)?")) T.danhDauHoc(ma);
      else if (tt.buoc === "on" && tt.han <= T.homNay()) {
        const dat = confirm("Đây là lần ôn " + tt.nhan.toLowerCase() + ". Ghi ôn ĐẠT?\n(OK = đạt · Hủy = chưa đạt, hẹn ôn lại)");
        T.ghiOn(ma, dat);
      } else toast("Đã lưu kết quả: sai " + kq.sai + "/" + kq.tong);
      route();
    };
  }

  /* ----- Tab: Giảng lại (Feynman) ----- */
  const TIEU_CHI = [
    "Giải thích được mỗi dấu hiệu lâm sàng bằng một mắt xích cơ chế.",
    "Giải thích được lý do của mỗi bước xử trí, không chỉ thứ tự.",
    "Trả lời được 3–5 câu hỏi dẫn dắt ở đầu bài mà không nhìn tài liệu.",
    "Không dùng thuật ngữ nào mà mình không định nghĩa được bằng lời thường.",
  ];
  function tGiang(ma, el) {
    const nd = ND.bai[ma];
    const p = nd.p;
    const b = T.bai(ma);
    const truoc = b.feynman.slice(-4).reverse();
    el.innerHTML = '<div class="grid g2">' +
      '<div class="card lam"><h2>Giảng cho một sinh viên tưởng tượng</h2><p class="small muted">Không nhìn tài liệu. Bắt đầu từ cơ chế, đi tới xử trí, giải thích "tại sao" ở mỗi bước. Ghi âm để nghe lại chỗ vấp.</p>' +
      '<div class="row"><select id="g-phut" style="width:auto"><option value="10">10 phút</option><option value="5">5 phút</option><option value="3">3 phút</option></select><button class="btn chinh" id="g-bd">● Bắt đầu giảng</button><button class="btn" id="g-dung" disabled>■ Dừng</button></div>' +
      '<div class="row" style="margin:12px 0"><span id="g-dot"></span><span class="timer" id="g-tg">10:00</span></div><div class="small muted" id="g-mic"></div>' +
      '<details style="margin-top:8px"><summary class="small">Bí quá? Xem dàn ý (chỉ tiêu đề mục)</summary><ol class="small">' + p.mucLon.filter((t) => !/Mở đầu|Kết bài|Nhật ký|Nghiệm thu|Giảng lại/i.test(t)).map((t) => "<li>" + esc(t.replace(/^\d+\.\s*/, "")) + "</li>").join("") + "</ol></details>" +
      '<h3 style="margin-top:14px">Bản ghi âm</h3><div id="g-ds" class="small muted">Đang tải…</div></div>' +
      '<div class="card"><h2>Tự chấm sau khi giảng</h2>' + TIEU_CHI.map((t, i) => '<label class="check"><input type="checkbox" data-tc="' + i + '"><span>' + t + "</span></label>").join("") +
      '<div class="stack" style="margin-top:10px"><div><b class="small">Chỗ vấp</b><textarea id="g-vap" placeholder="Đoạn nào ngập ngừng, nói vòng, quên…"></textarea></div>' +
      '<div><b class="small">Thuật ngữ đã dùng để lấp chỗ chưa hiểu</b><textarea id="g-tn" placeholder="Ví dụ: “phản xạ áp cảm” — nói ra nhưng không giải thích được cơ chế"></textarea></div>' +
      '<div><b class="small">Câu hỏi bài chưa trả lời (→ nhật ký Feynman, để bổ sung bài)</b><textarea id="g-ch" placeholder="Mỗi dòng một câu hỏi"></textarea></div>' +
      '<div><b class="small">Bản giảng viết (tùy chọn)</b><textarea id="g-ban" style="min-height:110px" placeholder="Có thể viết lại bài giảng bằng lời thường…"></textarea></div>' +
      '<div class="row"><button class="btn xanh" id="g-luu">Lưu lần giảng</button><button class="btn" id="g-claude" title="Sao chép để dán vào Claude (skill dcck-feynman)">Sao chép để giảng cho Claude</button></div></div>' +
      (truoc.length ? '<div class="small muted" style="margin-top:10px">Lần trước: ' + truoc.map((f) => T.hienNgay(f.ngay) + " (" + f.tieuChi.filter(Boolean).length + "/4 tiêu chí)").join(" · ") + "</div>" : "") + "</div>" +
      "</div>" +
      '<div class="card xanh" style="margin-top:14px"><div class="row between"><h2 style="margin:0">Đối chiếu bản giảng mẫu</h2><button class="btn nho" id="g-mo">Mở bản mẫu</button></div><p class="small muted">Chỉ mở sau khi đã tự giảng xong.</p><div id="g-mau" hidden>' +
      (p.giangLai ? '<div class="model-text">' + MD.render(p.giangLai, { noIndex: true }).html + "</div>" : "") +
      (p.diemNhan.length ? "<h3>Điểm cần nhấn khi giảng</h3><ul>" + p.diemNhan.map((x) => "<li>" + inlineMd(x) + "</li>").join("") + "</ul>" : "") +
      (p.chot.length ? "<h3>Các khối CHỐT LẠI</h3>" + p.chot.map((c) => "<p><b>" + esc(c.tieuDe) + "</b></p><ul>" + c.y.map((y) => "<li>" + inlineMd(y) + "</li>").join("") + "</ul>").join("") : "") +
      (b.danhDau.length ? '<h3>Chỗ đã đánh dấu khi đọc</h3><ul class="small">' + b.danhDau.map((x) => "<li><b>" + esc(x.muc) + "</b>: " + esc(x.text) + "…</li>").join("") + "</ul>" : "") +
      "</div></div>" +
      '<div style="margin-top:14px">' + vanDapHtml("vd-bai") + "</div>";
    danhDauXref(el);
    $("#g-mo", el).onclick = () => { const m = $("#g-mau", el); m.hidden = !m.hidden; $("#g-mo", el).textContent = m.hidden ? "Mở bản mẫu" : "Ẩn bản mẫu"; };

    // hẹn giờ + ghi âm
    let batDau = 0, hen = null, rec = null, chunks = [], stream = null, giay = 0;
    const tg = $("#g-tg", el);
    const veTg = () => {
      const tong = +$("#g-phut", el).value * 60;
      giay = batDau ? Math.round((Date.now() - batDau) / 1000) : 0;
      const con = tong - giay;
      const a = Math.abs(con);
      tg.textContent = (con < 0 ? "+" : "") + String(Math.floor(a / 60)).padStart(2, "0") + ":" + String(a % 60).padStart(2, "0");
      tg.style.color = con < 0 ? "var(--nguy)" : "";
    };
    $("#g-phut", el).onchange = veTg;
    veTg();
    const dung = () => {
      clearInterval(hen); hen = null;
      if (rec && rec.state !== "inactive") rec.stop();
      if (stream) stream.getTracks().forEach((t) => t.stop());
      stream = null;
      $("#g-bd", el).disabled = false; $("#g-dung", el).disabled = true; $("#g-dot", el).innerHTML = "";
    };
    donDep.push(dung);
    $("#g-bd", el).onclick = async () => {
      batDau = Date.now(); chunks = [];
      hen = setInterval(veTg, 500);
      $("#g-bd", el).disabled = true; $("#g-dung", el).disabled = false;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        rec = new MediaRecorder(stream);
        rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
        rec.onstop = async () => {
          if (!chunks.length) return;
          const blob = new Blob(chunks, { type: rec.mimeType || "audio/webm" });
          await T.idb.luuGhiAm({ id: ma + "-" + Date.now(), ma, ngay: T.homNay(), giay, blob, mime: blob.type });
          toast("Đã lưu bản ghi âm"); veGhiAm();
        };
        rec.start();
        $("#g-dot", el).innerHTML = '<span class="rec-dot"></span>';
        $("#g-mic", el).textContent = "Đang ghi âm…";
      } catch (e) {
        $("#g-mic", el).textContent = "Không ghi âm được (" + (e.name || e) + "). Vẫn có thể giảng theo đồng hồ; dùng điện thoại để ghi âm.";
      }
    };
    $("#g-dung", el).onclick = dung;
    async function veGhiAm() {
      const ds = (await T.idb.ghiAmCuaBai(ma)).sort((a, b) => b.id.localeCompare(a.id));
      const box = $("#g-ds", el);
      if (!box) return;
      if (!ds.length) { box.textContent = "Chưa có bản ghi."; return; }
      box.innerHTML = ds.map((r) => {
        const url = URL.createObjectURL(r.blob);
        donDep.push(() => URL.revokeObjectURL(url));
        const duoi = (r.mime || "").includes("mp4") ? "m4a" : (r.mime || "").includes("ogg") ? "ogg" : "webm";
        return '<div style="margin:8px 0"><div class="row between"><span>' + T.hienNgay(r.ngay) + " · " + Math.floor(r.giay / 60) + " ph " + (r.giay % 60) + ' s</span><span class="row"><a class="btn nho" download="' + ma + "_giang_" + r.ngay + "." + duoi + '" href="' + url + '">Tải</a><button class="btn nho" data-xoa="' + esc(r.id) + '">Xóa</button></span></div><audio controls preload="none" src="' + url + '" style="width:100%"></audio></div>';
      }).join("");
      $$("[data-xoa]", box).forEach((x) => x.onclick = async () => { if (confirm("Xóa bản ghi này?")) { await T.idb.xoaGhiAm(x.dataset.xoa); veGhiAm(); } });
    }
    veGhiAm();

    $("#g-luu", el).onclick = () => {
      const tieuChi = $$("[data-tc]", el).map((c) => c.checked);
      const vap = $("#g-vap", el).value.trim(), tn = $("#g-tn", el).value.trim(), ch = $("#g-ch", el).value.trim(), ban = $("#g-ban", el).value.trim();
      b.feynman.push({ ngay: T.homNay(), giay, tieuChi, vap, thuatNgu: tn, ban });
      if (vap) T.ghiNhatKy(ma, "lo-hong", "Chỗ vấp khi giảng: " + vap);
      if (tn) T.ghiNhatKy(ma, "lo-hong", "Thuật ngữ lấp chỗ chưa hiểu: " + tn);
      ch.split("\n").map((x) => x.trim()).filter(Boolean).forEach((x) => T.ghiNhatKy(ma, "cau-hoi", x));
      if (!b.hoc && confirm("Bài chưa được đánh dấu đã học. Đánh dấu học hôm nay?")) T.danhDauHoc(ma);
      if (b.hoc) T.danhDauGiang(ma);
      T.luu();
      toast("Đã lưu lần giảng" + (tieuChi.every(Boolean) ? " — đạt đủ 4 tiêu chí" : ""));
      route();
    };
    $("#g-claude", el).onclick = () => {
      const ban = $("#g-ban", el).value.trim();
      saoChep("Tôi giảng lại bài " + ma + " (" + tenBai(ma) + "). Hãy nghe và chỉ ra lỗ hổng theo phương pháp Feynman.\n\n" + (ban || "[dán bản giảng hoặc bản chép lời ghi âm vào đây]"));
    };
    ganVanDap("vd-bai", () => poolVanDap([ma]));
  }

  /* ----- Vấn đáp (dùng chung) ----- */
  function poolVanDap(dsMa) {
    const pool = [];
    for (const ma of dsMa) {
      const nd = ND.bai[ma];
      if (!nd) continue;
      if (nd.p) {
        nd.p.cauHoiDanDat.forEach((q) => pool.push({ ma, loai: "Câu hỏi dẫn dắt", hoi: q, dap: null }));
        nd.p.tuKiemTra.filter((q) => !q.luaChon && q.dapAn).forEach((q) => pool.push({ ma, loai: "Tự kiểm tra", hoi: q.hoi, dap: q.dapAn }));
      }
      nd.the.filter((t) => t.loai === "hoi-dap").forEach((t) => pool.push({ ma, loai: P.NHOM_THE[t.nhom] || "Thẻ", hoi: t.truoc, dap: t.sau + (t.nguon ? " " + t.nguon : ""), html: true }));
    }
    return pool;
  }
  function vanDapHtml(id) {
    return '<div class="card bay" id="' + id + '"><div class="row between"><h2 style="margin:0">Vấn đáp nhanh</h2><span class="small muted">Nói to câu trả lời trong 60 giây, rồi mới mở đáp án</span></div><div class="vd-body" style="margin-top:10px"><button class="btn chinh vd-rut">Rút câu hỏi</button></div></div>';
  }
  function ganVanDap(id, layPool) {
    const box = document.getElementById(id);
    if (!box) return;
    const body = $(".vd-body", box);
    let hen = null;
    donDep.push(() => clearInterval(hen));
    const rut = () => {
      const pool = layPool();
      if (!pool.length) { body.innerHTML = '<p class="muted">Chưa có câu hỏi (cần bài đã học có câu hỏi dẫn dắt, câu tự kiểm tra hoặc thẻ hỏi–đáp).</p>'; return; }
      const q = pool[Math.floor(Math.random() * pool.length)];
      let con = 60;
      clearInterval(hen);
      body.innerHTML = '<div class="small muted">' + q.ma + " · " + esc(q.loai) + '</div><div style="font-size:18px;font-weight:600;margin:6px 0 10px">' + (q.html ? q.hoi : inlineMd(q.hoi)) + '</div><div class="row"><span class="timer" style="font-size:26px" data-t>60</span><button class="btn vd-mo">Mở đáp án</button><button class="btn nho vd-rut">Câu khác</button></div><div class="vd-dap" hidden style="margin-top:10px"></div>';
      const t = $("[data-t]", body);
      hen = setInterval(() => { con--; t.textContent = con; if (con <= 0) { clearInterval(hen); t.style.color = "var(--nguy)"; } }, 1000);
      $(".vd-rut", body).onclick = rut;
      $(".vd-mo", body).onclick = () => {
        clearInterval(hen);
        const d = $(".vd-dap", body);
        d.hidden = false;
        d.innerHTML = '<div class="card" style="background:var(--nen-2)">' + (q.dap ? (q.html ? q.dap : inlineMd(q.dap)) : 'Câu hỏi dẫn dắt: đối chiếu trong bài <a href="#/bai/' + q.ma + '/doc">' + q.ma + "</a>.") + '</div><div class="row" style="margin-top:8px"><button class="btn xanh nho" data-kq="1">Giải thích trôi chảy</button><button class="btn cam nho" data-kq="0">Vấp — ghi lỗ hổng</button></div>';
        danhDauXref(d);
        $$("[data-kq]", d).forEach((x) => x.onclick = () => {
          const tot = x.dataset.kq === "1";
          T.bai(q.ma).vanDap.push({ ngay: T.homNay(), hoi: q.hoi.replace(/<[^>]+>/g, "").slice(0, 200), tot });
          if (!tot) T.ghiNhatKy(q.ma, "lo-hong", "Vấp khi vấn đáp: " + q.hoi.replace(/<[^>]+>/g, ""));
          T.luu();
          rut();
        });
      };
    };
    $(".vd-rut", body).onclick = rut;
  }
  function vanDapNhanhHtml() {
    const da = dsCoBai().filter((m) => T.S.bai[m] && T.S.bai[m].hoc);
    return da.length ? '<div style="margin-top:14px">' + vanDapHtml("vd-nhanh") + "</div>" : "";
  }
  function ganVanDapNhanh() { ganVanDap("vd-nhanh", () => poolVanDap(dsCoBai().filter((m) => T.S.bai[m] && T.S.bai[m].hoc))); }
  function vVanDapChung() {
    const da = dsCoBai().filter((m) => T.S.bai[m] && T.S.bai[m].hoc);
    const ds = da.length ? da : dsCoBai();
    app.innerHTML = '<h1>Vấn đáp xen kẽ</h1><p class="muted">Câu hỏi rút ngẫu nhiên, trộn giữa các bài ' + (da.length ? "đã học" : "đã có (chưa học bài nào)") + '. Học xen kẽ buộc phải nhận ra câu hỏi thuộc vấn đề nào trước khi trả lời.</p>' +
      '<div class="card" style="margin-bottom:14px"><b class="small">Chọn bài</b><div class="row" id="vd-chon" style="margin-top:6px">' + ds.map((m) => '<label class="row small" style="gap:4px;border:1px solid var(--vien);border-radius:8px;padding:3px 8px"><input type="checkbox" value="' + m + '" checked>' + m + "</label>").join("") + "</div></div>" + vanDapHtml("vd-chung");
    ganVanDap("vd-chung", () => poolVanDap($$("#vd-chon input:checked").map((x) => x.value)));
  }

  /* ----- Tab: Tự kiểm tra ----- */
  function tKiemTra(ma, el) {
    const p = ND.bai[ma].p;
    const b = T.bai(ma);
    const ds = p.tuKiemTra;
    if (!ds.length) { el.innerHTML = '<div class="empty">Bài chưa có mục câu hỏi tự kiểm tra.</div>'; return; }
    const kq = {};
    const lan = b.kiemTra.slice(-5).reverse();
    el.innerHTML = '<div class="row between" style="margin-bottom:10px"><div><b>' + ds.length + ' câu</b> <span class="muted small">· trắc nghiệm chấm tự động; câu mở: tự trả lời rồi tự chấm</span>' +
      (lan.length ? '<div class="small muted">Các lần trước: ' + lan.map((x) => T.hienNgay(x.ngay) + " " + x.dung + "/" + x.tong).join(" · ") + "</div>" : "") + '</div><div class="row"><span id="kt-diem" class="small"></span><button class="btn xanh nho" id="kt-luu">Lưu kết quả</button><button class="btn nho" id="kt-lai">Làm lại</button></div></div>' +
      '<div class="stack">' + ds.map((q, i) => '<div class="card q-card" data-i="' + i + '"><div class="small muted">Câu ' + q.so + (q.nhan ? " · " + esc(q.nhan) : "") + '</div><div style="font-weight:600;margin:4px 0 8px">' + inlineMd(q.hoi) + "</div>" +
        (q.luaChon ? q.luaChon.map((o) => '<button class="opt" data-c="' + o.chu + '"><b>' + o.chu + ".</b> " + inlineMd(o.text) + "</button>").join("") :
          '<textarea placeholder="Trả lời bằng lời của mình…"></textarea><div class="row" style="margin-top:8px"><button class="btn nho xem">Xem đáp án</button></div>') +
        '<div class="giai" hidden></div></div>').join("") + "</div>";
    danhDauXref(el);
    const tinh = () => {
      const vals = Object.values(kq);
      $("#kt-diem", el).innerHTML = "Đúng <b>" + vals.filter(Boolean).length + "/" + vals.length + "</b> câu đã làm";
    };
    $$(".q-card", el).forEach((c) => {
      const q = ds[+c.dataset.i];
      const giai = $(".giai", c);
      const hienGiai = () => { giai.hidden = false; giai.innerHTML = "<b>Đáp án:</b> " + inlineMd(q.dapAn); danhDauXref(giai); };
      if (q.luaChon) {
        $$(".opt", c).forEach((o) => o.onclick = () => {
          if (c.dataset.xong) return;
          c.dataset.xong = 1;
          const dung = o.dataset.c === q.dung;
          o.classList.add(dung ? "dung" : "sai");
          const od = $('.opt[data-c="' + q.dung + '"]', c); if (od) od.classList.add("dung");
          c.classList.add(dung ? "da-dung" : "da-sai");
          kq[q.so] = dung; hienGiai(); tinh();
        });
      } else {
        $(".xem", c).onclick = () => {
          hienGiai();
          const r = document.createElement("div");
          r.className = "row"; r.style.marginTop = "8px";
          r.innerHTML = '<button class="btn xanh nho" data-d="1">Tôi trả lời đúng</button><button class="btn cam nho" data-d="0">Chưa đúng</button>';
          giai.after(r);
          $$("[data-d]", r).forEach((x) => x.onclick = () => { const d = x.dataset.d === "1"; kq[q.so] = d; c.classList.remove("da-dung", "da-sai"); c.classList.add(d ? "da-dung" : "da-sai"); r.remove(); tinh(); });
          $(".xem", c).remove();
        };
      }
    });
    $("#kt-luu", el).onclick = () => {
      const vals = Object.values(kq);
      if (!vals.length) { toast("Chưa làm câu nào"); return; }
      b.kiemTra.push({ ngay: T.homNay(), dung: vals.filter(Boolean).length, tong: vals.length });
      ds.filter((q) => kq[q.so] === false).forEach((q) => T.ghiNhatKy(ma, "lo-hong", "Sai câu tự kiểm tra " + q.so + ": " + q.hoi));
      T.luu(); toast("Đã lưu: " + vals.filter(Boolean).length + "/" + vals.length + (vals.some((v) => !v) ? " — câu sai đã ghi vào nhật ký" : ""));
    };
    $("#kt-lai", el).onclick = () => tKiemTra(ma, el);
  }

  /* ----- Ôn thẻ (phiên dùng chung) ----- */
  function phienThe(el, the, opts) {
    opts = opts || {};
    const luyen = !!opts.luyen;
    let hang = the.slice();
    let i = 0, lat = false, daLam = 0;
    const ve = () => {
      if (i >= hang.length) {
        el.innerHTML = '<div class="flash"><div class="card xanh" style="text-align:center;padding:30px"><h2>Xong phiên ôn</h2><p class="muted">' + daLam + " lượt chấm.</p>" + (opts.sauXong || "") + "</div></div>";
        capNhatDemThe();
        return;
      }
      const t = hang[i];
      const st = T.trangThaiThe(t.id);
      const truoc = t.loai === "cloze" ? P.hienCloze(t.text, t.c, false) : t.truoc;
      const sau = t.loai === "cloze" ? P.hienCloze(t.text, t.c, true) + (t.them ? '<div style="margin-top:10px;font-size:16px">' + t.them + "</div>" : "") : t.sau;
      el.innerHTML = '<div class="flash"><div class="row between small muted" style="margin-bottom:8px"><span>' + t.ma + " · " + esc(P.NHOM_THE[t.nhom] || (t.loai === "cloze" ? "Điền khuyết" : "Hỏi–đáp")) + (st ? "" : ' · <b style="color:var(--co-che)">mới</b>') + "</span><span>còn " + (hang.length - i) + (luyen ? " · chế độ luyện (không tính lịch)" : "") + "</span></div>" +
        '<div class="flash-card"><div class="front">' + truoc + "</div>" +
        (lat ? "<hr><div>" + sau + '</div><div class="nguon">' + esc(t.nguon || "") + "</div>" : (t.loai === "hoi-dap" ? '<textarea id="ft-tl" style="margin-top:16px;font-size:15px" placeholder="(tùy chọn) Gõ câu trả lời trước khi lật thẻ"></textarea>' : "")) + "</div>" +
        (lat ? (luyen ? '<div class="rate" style="grid-template-columns:1fr 1fr"><button class="btn do" data-r="1">Quên <small>1</small></button><button class="btn xanh" data-r="3">Nhớ <small>3</small></button></div>' :
          '<div class="rate">' + [[1, "Lại", "do"], [2, "Khó", "cam"], [3, "Được", "xanh"], [4, "Dễ", "chinh"]].map(([d, n, c]) => '<button class="btn ' + c + '" data-r="' + d + '">' + n + "<small>" + T.nhanKhoang(T.duKien(t.id, d)) + " · " + d + "</small></button>").join("") + "</div>") :
          '<div class="row" style="justify-content:center;margin-top:12px"><button class="btn chinh" id="ft-lat">Hiện đáp án <kbd>Space</kbd></button></div>') + "</div>";
      if (!lat) { $("#ft-lat", el).onclick = () => { lat = true; ve(); }; }
      else $$("[data-r]", el).forEach((x) => x.onclick = () => cham(+x.dataset.r));
    };
    const cham = (d) => {
      const t = hang[i];
      daLam++;
      if (!luyen) T.chamThe(t.id, d);
      if (d === 1) hang.push(t);
      i++; lat = false; ve();
    };
    const phim = (e) => {
      if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") { if (e.key === "Enter" && e.ctrlKey && !lat) { lat = true; ve(); } return; }
      if (i >= hang.length) return;
      if (!lat && (e.key === " " || e.key === "Enter")) { e.preventDefault(); lat = true; ve(); }
      else if (lat && /^[1-4]$/.test(e.key)) { const d = +e.key; if (luyen && d !== 1 && d !== 3) return; cham(d); }
    };
    document.addEventListener("keydown", phim);
    donDep.push(() => document.removeEventListener("keydown", phim));
    ve();
  }
  function chonPhien(ds) {
    const den = ds.filter((t) => T.denHan(t.id));
    const moi = ds.filter((t) => !T.trangThaiThe(t.id)).slice(0, T.soMoiConLai());
    // trộn xen kẽ giữa các bài
    const tron = (a) => { for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [a[k], a[j]] = [a[j], a[k]]; } return a; };
    return tron(den).concat(moi);
  }
  function tThe(ma, el) {
    const ds = ND.bai[ma].the;
    const nhom = {};
    ds.forEach((t) => { nhom[t.nhom || "khac"] = (nhom[t.nhom || "khac"] || 0) + 1; });
    const den = ds.filter((t) => T.denHan(t.id)).length, moi = ds.filter((t) => !T.trangThaiThe(t.id)).length;
    const thuoc = ds.filter((t) => { const s = T.trangThaiThe(t.id); return s && s.ivl >= 21; }).length;
    el.innerHTML = '<div class="card" style="margin-bottom:14px"><div class="row between"><div><b>' + ds.length + " thẻ</b> · " + den + " đến hạn · " + moi + " mới · " + thuoc + ' đã thuộc (≥21 ngày)<div class="small muted">' + Object.entries(nhom).map(([k, v]) => esc(P.NHOM_THE[k] || k) + " " + v).join(" · ") + '</div></div><div class="row"><select id="tt-nhom" style="width:auto"><option value="">Mọi nhóm</option>' + Object.keys(nhom).map((k) => '<option value="' + k + '">' + esc(P.NHOM_THE[k] || k) + "</option>").join("") + '</select><button class="btn chinh" id="tt-on">Ôn đến hạn + mới</button><button class="btn" id="tt-luyen">Luyện tất cả</button></div></div>' +
      '<p class="small muted" style="margin:8px 0 0">Thẻ mới mỗi ngày: ' + T.S.caiDat.theMoiMoiNgay + " (còn " + T.soMoiConLai() + " hôm nay). Chế độ luyện không làm thay đổi lịch ôn. Phím tắt: <kbd>Space</kbd> lật, <kbd>1</kbd>–<kbd>4</kbd> chấm.</p></div><div id=\"tt-phien\"></div>";
    const loc = () => { const n = $("#tt-nhom", el).value; return n ? ds.filter((t) => t.nhom === n) : ds; };
    $("#tt-on", el).onclick = () => { const p = chonPhien(loc()); if (!p.length) { toast("Không có thẻ đến hạn"); return; } phienThe($("#tt-phien", el), p); };
    $("#tt-luyen", el).onclick = () => phienThe($("#tt-phien", el), loc().slice().sort(() => Math.random() - 0.5), { luyen: true });
  }
  function vOnThe() {
    const ds = tatCaThe(T.S.caiDat.chiTheBaiDaHoc);
    const p = chonPhien(ds);
    const tong = tatCaThe(false).length;
    app.innerHTML = '<h1>Ôn thẻ hằng ngày</h1><p class="muted small">' + ds.filter((t) => T.denHan(t.id)).length + " thẻ đến hạn · " + Math.min(T.soMoiConLai(), ds.filter((t) => !T.trangThaiThe(t.id)).length) + " thẻ mới · tổng " + tong + " thẻ" +
      (T.S.caiDat.chiTheBaiDaHoc ? " · thẻ mới chỉ lấy từ bài đã học (đổi ở Dữ liệu → Cài đặt)" : "") + '. Thẻ được trộn xen kẽ giữa các bài.</p><div id="phien"></div>';
    if (!p.length) {
      $("#phien").innerHTML = '<div class="empty">Hôm nay không còn thẻ cần ôn.' + (tong && !ds.length ? " Chưa có bài nào được đánh dấu đã học, nên chưa có thẻ mới." : "") + "</div>";
      return;
    }
    phienThe($("#phien"), p, { sauXong: '<a class="btn" href="#/">Về Hôm nay</a>' });
  }

  /* ----- Tab: Nhật ký bài + trang Nhật ký ----- */
  const LOAI_NK = { "lo-hong": "Lỗ hổng / chỗ vấp", "cau-hoi": "Câu hỏi bài chưa trả lời", "lam-sang": "Đối chiếu lâm sàng", "giang-that": "Giảng thật", "khac": "Ghi chú" };
  function formNhatKy(ma) {
    return '<div class="card"><h2>Thêm ghi chép</h2><div class="stack">' + (ma ? "" : '<select id="nk-ma">' + dsCoBai().map((m) => '<option value="' + m + '">' + m + " " + esc(tenBai(m)) + "</option>").join("") + "</select>") +
      '<select id="nk-loai">' + Object.entries(LOAI_NK).map(([k, v]) => '<option value="' + k + '">' + v + "</option>").join("") + '</select><textarea id="nk-text" placeholder="Nội dung… (đối chiếu lâm sàng: ca thực tế khác bài ở điểm nào, ngoại lệ gì)"></textarea><button class="btn chinh" id="nk-them">Thêm</button></div></div>';
  }
  function dsNhatKyHtml(ds) {
    if (!ds.length) return '<p class="muted">Chưa có ghi chép.</p>';
    return '<ul class="list-plain">' + ds.slice().reverse().map((x) => '<li><div class="row between"><span class="small muted">' + T.hienNgay(x.ngay) + " · " + (x.ma ? '<a href="#/bai/' + x.ma + '">' + x.ma + "</a> · " : "") + esc(LOAI_NK[x.loai] || x.loai) + '</span><button class="btn nho" data-xoa-nk="' + esc(x.id) + '">Xóa</button></div><div>' + esc(x.text).replace(/\n/g, "<br>") + "</div></li>").join("") + "</ul>";
  }
  function ganNhatKy(el, ma, lai) {
    $("#nk-them", el).onclick = () => {
      const t = $("#nk-text", el).value.trim();
      if (!t) return;
      T.ghiNhatKy(ma || $("#nk-ma", el).value, $("#nk-loai", el).value, t);
      toast("Đã thêm"); lai();
    };
    $$("[data-xoa-nk]", el).forEach((x) => x.onclick = () => { if (!confirm("Xóa ghi chép này?")) return; T.S.nhatKy = T.S.nhatKy.filter((n) => n.id !== x.dataset.xoaNk); T.luu(); lai(); });
  }
  function tNhatKyBai(ma, el) {
    const b = T.bai(ma);
    const ds = T.S.nhatKy.filter((x) => x.ma === ma);
    const suKien = [];
    if (b.batDauDoc) suKien.push([b.batDauDoc, "Bắt đầu đọc chủ động"]);
    if (b.docXong) suKien.push([b.docXong, "Đọc xong"]);
    if (b.hoc) suKien.push([b.hoc, "Học (ngày 0)"]);
    if (b.giang) suKien.push([b.giang, "Giảng lại lần đầu"]);
    b.on.forEach((x) => suKien.push([x.ngay, "Ôn: " + (x.dat ? "đạt" : "chưa đạt")]));
    b.handout.forEach((x) => suKien.push([x.ngay, "Vẽ lại Handout: sai " + x.sai + "/" + x.tong]));
    b.kiemTra.forEach((x) => suKien.push([x.ngay, "Tự kiểm tra: " + x.dung + "/" + x.tong]));
    b.feynman.forEach((x) => suKien.push([x.ngay, "Giảng lại " + Math.round((x.giay || 0) / 60) + " ph: " + x.tieuChi.filter(Boolean).length + "/4 tiêu chí"]));
    const tot = b.vanDap.filter((x) => x.tot).length;
    suKien.sort((a, c) => c[0].localeCompare(a[0]));
    el.innerHTML = '<div class="grid g2"><div class="stack">' +
      '<div class="card bay"><h2>Bước 4 · Vá lỗ hổng</h2><p class="small muted">Quay lại đúng đoạn nguồn của từng chỗ. Câu hỏi bài chưa trả lời: ghi loại “Câu hỏi bài chưa trả lời” để xuất sang NHAT-KY-FEYNMAN.md và bổ sung bài.</p>' +
      (b.danhDau.length ? "<h3>Chỗ đánh dấu khi đọc</h3><ul class=\"small\">" + b.danhDau.map((x) => "<li><b>" + esc(x.muc) + "</b>: " + esc(x.text) + "…</li>").join("") + "</ul>" : '<p class="small muted">Không có chỗ đánh dấu khi đọc.</p>') +
      '<div class="row"><button class="btn ' + (b.vaXong ? "" : "xanh") + '" id="va-xong">' + (b.vaXong ? "✓ Đã vá xong " + T.hienNgay(b.vaXong) : "Đánh dấu đã vá xong") + '</button><a class="btn" href="#/bai/' + ma + '/doc">Mở bài</a></div></div>' +
      formNhatKy(ma) + "</div>" +
      '<div class="stack"><div class="card"><h2>Ghi chép của bài</h2>' + dsNhatKyHtml(ds) + "</div>" +
      '<div class="card"><h2>Lịch sử học</h2>' + (b.vanDap.length ? '<p class="small">Vấn đáp: ' + tot + "/" + b.vanDap.length + " lần trôi chảy</p>" : "") + (suKien.length ? '<ul class="list-plain small">' + suKien.map(([d, t]) => "<li>" + T.hienNgay(d) + " · " + esc(t) + "</li>").join("") + "</ul>" : '<p class="muted">Chưa có.</p>') + "</div></div></div>";
    $("#va-xong", el).onclick = () => { b.vaXong = b.vaXong ? null : T.homNay(); T.luu(); route(); };
    ganNhatKy(el, ma, route);
  }
  function xuatNhatKyMd() {
    const nhom = {};
    T.S.nhatKy.forEach((x) => (nhom[x.ma] = nhom[x.ma] || []).push(x));
    let s = "# Nhật ký Feynman\n\nXuất từ ứng dụng học ĐCCK ngày " + T.hienNgay(T.homNay()) + ".\n";
    for (const ma of Object.keys(nhom).sort(soSanhMa)) {
      s += "\n## " + ma + " " + tenBai(ma) + "\n\n";
      for (const loai of Object.keys(LOAI_NK)) {
        const ds = nhom[ma].filter((x) => x.loai === loai);
        if (!ds.length) continue;
        s += "### " + LOAI_NK[loai] + "\n\n" + ds.map((x) => "- " + T.hienNgay(x.ngay) + ": " + x.text.replace(/\n/g, " ")).join("\n") + "\n\n";
      }
    }
    return s;
  }
  function vNhatKy() {
    const cho = T.S.hanhDong.filter((x) => !x.daXuat);
    const lenh = cho.map((x) => "python tracker.py " + x.lenh + " " + x.ma + (x.kho ? " --kho" : "") + "   # " + T.hienNgay(x.ngay)).join("\n");
    app.innerHTML = '<h1>Nhật ký</h1><div class="grid g2"><div class="stack">' + formNhatKy(null) +
      '<div class="card"><h2>Xuất</h2><p class="small muted">Nhật ký Feynman theo bài, nhóm theo loại — dán vào <code>HOC-TAP/NHAT-KY-FEYNMAN.md</code>.</p><div class="row"><button class="btn chinh" id="x-md">Tải NHAT-KY-FEYNMAN.md</button><button class="btn" id="x-copy">Sao chép</button></div></div>' +
      '<div class="card"><h2>Đồng bộ tracker.py</h2><p class="small muted">Các bước đã ghi trong ứng dụng, chưa đồng bộ sang <code>tracker.py</code> trên máy (cú pháp lệnh theo PHUONG-PHAP-HOC).</p>' +
      (cho.length ? '<pre style="white-space:pre-wrap;font-size:12.5px;background:var(--nen-2);padding:10px;border-radius:8px">' + esc(lenh) + '</pre><div class="row"><button class="btn" id="x-lenh">Sao chép lệnh</button><button class="btn xanh" id="x-dong-bo">Đánh dấu đã đồng bộ</button></div>' : '<p class="muted small">Không có thay đổi chờ đồng bộ.</p>') + "</div></div>" +
      '<div class="card"><h2>Tất cả ghi chép (' + T.S.nhatKy.length + ")</h2>" + dsNhatKyHtml(T.S.nhatKy) + "</div></div>";
    ganNhatKy(app, null, route);
    $("#x-md").onclick = () => taiFile("NHAT-KY-FEYNMAN.md", xuatNhatKyMd(), "text/markdown;charset=utf-8");
    $("#x-copy").onclick = () => saoChep(xuatNhatKyMd());
    if (cho.length) {
      $("#x-lenh").onclick = () => saoChep(cho.map((x) => "python tracker.py " + x.lenh + " " + x.ma + (x.kho ? " --kho" : "")).join("\n"));
      $("#x-dong-bo").onclick = () => { cho.forEach((x) => { x.daXuat = true; }); T.luu(); route(); };
    }
  }

  /* ================= Phương pháp ================= */
  function vPhuongPhap() {
    const ung = [
      ["1. Đọc chủ động", "Tab <b>1 · Đọc chủ động</b>: trả lời câu hỏi dẫn dắt trước khi đọc; nút <b>?</b> đánh dấu đoạn chưa tự giải thích được; che CHỐT LẠI để tự nhắc lại; so lại câu trả lời sau khi đọc."],
      ["2. Vẽ lại", "Tab <b>2 · Vẽ lại Handout</b>: bấm ô trống để mở, bấm lần nữa để đánh dấu sai; lưu kết quả → đánh dấu <i>learned</i>."],
      ["3. Giảng lại", "Tab <b>3 · Giảng lại</b>: đồng hồ 10 phút, ghi âm, tự chấm 4 tiêu chí, ghi chỗ vấp và thuật ngữ lấp chỗ trống; mở bản giảng mẫu sau; sao chép để giảng cho Claude (skill dcck-feynman)."],
      ["4. Vá lỗ hổng", "Tab <b>Nhật ký bài</b>: danh sách chỗ đánh dấu, câu hỏi chưa trả lời → xuất NHAT-KY-FEYNMAN.md."],
      ["5. Ôn giãn cách", "Trang <b>Hôm nay</b> báo bài đến hạn ngày 3, 7, 21, 60, 120; ôn bằng Handout + Tự kiểm tra + thẻ; ghi Ôn đạt / Chưa đạt. <b>Ôn thẻ</b> hằng ngày (SM-2)."],
      ["6. Giảng thật", "Ghi ở Nhật ký bài, loại “Giảng thật”."],
      ["7. Đối chiếu lâm sàng", "Ghi ở Nhật ký bài, loại “Đối chiếu lâm sàng”."],
    ];
    app.innerHTML = '<div class="grid" style="grid-template-columns:minmax(0,1fr)"><div class="card"><h2>Ứng dụng làm gì ở từng bước</h2><table><tbody>' + ung.map(([a, c]) => "<tr><td style=\"white-space:nowrap\"><b>" + a + "</b></td><td>" + c + "</td></tr>").join("") + "</tbody></table>" +
      '<p class="small muted" style="margin-top:10px">Giả định của ứng dụng: các mốc ôn tính từ ngày học (ngày 0). Lần ôn “chưa đạt” giữ nguyên mốc và hẹn ôn lại hôm sau.</p></div>' +
      '<article class="prose card" style="max-width:none">' + (ND.phuongPhap ? MD.render(ND.phuongPhap, { noIndex: true }).html : '<p class="muted">Chưa nạp PHUONG-PHAP-HOC.md.</p>') + "</article></div>";
  }

  /* ================= Dữ liệu ================= */
  async function nhapFiles(files) {
    const kq = [];
    const gom = {};
    for (const f of files) {
      const ten = f.name;
      try {
        if (/^MUC-LUC-9-CUON\.md$/i.test(ten)) { await T.idb.luuBai({ ma: "__MUC_LUC__", md: await f.text() }); kq.push("Mục lục"); continue; }
        if (/^PHUONG-PHAP-HOC\.md$/i.test(ten)) { await T.idb.luuBai({ ma: "__PHUONG_PHAP__", md: await f.text() }); kq.push("Phương pháp"); continue; }
        const m = ten.match(/^([A-Z]{2,4}-\d{2,3})_(bai\.md|handout\.html|anki\.apkg)$/i);
        if (!m) { kq.push("Bỏ qua " + ten + " (tên không đúng mẫu MÃ_bai.md / MÃ_Handout.html / MÃ_anki.apkg)"); continue; }
        const ma = m[1].toUpperCase(), loai = m[2].toLowerCase();
        const r = gom[ma] || (gom[ma] = (await T.idb.tatCaBai()).find((x) => x.ma === ma) || { ma });
        if (loai === "bai.md") r.md = await f.text();
        else if (loai === "handout.html") r.handout = await f.text();
        else r.anki = await P.docApkg(await f.arrayBuffer());
        kq.push(ma + ": " + (loai === "anki.apkg" ? r.anki.length + " note Anki" : loai));
      } catch (e) { kq.push("Lỗi " + ten + ": " + e.message); }
    }
    for (const ma in gom) await T.idb.luuBai(gom[ma]);
    await napNoiDung();
    return kq;
  }
  async function vDuLieu() {
    const nhap = await T.idb.tatCaBai();
    const cd = T.S.caiDat;
    app.innerHTML = '<h1>Dữ liệu</h1><div class="grid g2"><div class="stack">' +
      '<div class="card lam"><h2>Nhập bài mới</h2><p class="small">Kéo thả file Cowork vừa tạo: <code>MÃ_bai.md</code>, <code>MÃ_Handout.html</code>, <code>MÃ_anki.apkg</code> (cả mục lục, phương pháp). File được lưu trong trình duyệt này.</p>' +
      '<div class="drop" id="drop">Thả file vào đây hoặc <label class="btn nho" style="display:inline-flex">chọn file<input type="file" id="file" multiple accept=".md,.html,.apkg" hidden></label></div><div id="kq-nhap" class="small" style="margin-top:8px"></div>' +
      '<p class="small muted">Cách khác (khuyên dùng khi có nhiều bài): sửa thư mục nguồn trong <code>cong-cu/cau-hinh.json</code> rồi chạy <code>cap-nhat-noi-dung.bat</code> — đóng gói toàn bộ bài vào <code>data/noi-dung.js</code>.</p></div>' +
      '<div class="card"><h2>Nội dung đang dùng</h2><p class="small">Gói đóng sẵn: ' + Object.keys((window.DCCK_NOI_DUNG || {}).bai || {}).length + " bài" + (ND.taoLuc ? " (" + esc(ND.taoLuc.replace("T", " ")) + ")" : "") + " · nhập trong trình duyệt: " + nhap.filter((x) => !x.ma.startsWith("__")).length + " bài</p>" +
      (nhap.length ? '<ul class="list-plain small">' + nhap.map((x) => '<li class="row between"><span><b>' + esc(x.ma.replace(/^__|__$/g, "")) + "</b> " + ["md", "handout", "anki"].filter((k) => x[k]).join(", ") + '</span><button class="btn nho" data-xoa-bai="' + esc(x.ma) + '">Xóa</button></li>').join("") + "</ul>" : "") + "</div></div>" +
      '<div class="stack"><div class="card"><h2>Cài đặt</h2><div class="stack"><label class="row between">Thẻ mới mỗi ngày <input type="number" id="cd-moi" min="0" max="200" value="' + cd.theMoiMoiNgay + '" style="width:90px"></label>' +
      '<label class="check"><input type="checkbox" id="cd-dahoc"' + (cd.chiTheBaiDaHoc ? " checked" : "") + "><span>Thẻ mới chỉ lấy từ bài đã đánh dấu học (học bài trước, ôn thẻ sau)</span></label>" +
      '<label class="check"><input type="checkbox" id="cd-chot"' + (cd.anChot ? " checked" : "") + "><span>Che khối CHỐT LẠI khi đọc</span></label></div></div>" +
      '<div class="card"><h2>Sao lưu tiến độ</h2><p class="small muted">Tiến độ lưu trong trình duyệt này. Sao lưu định kỳ, hoặc để chuyển sang máy khác.</p><div class="row"><button class="btn chinh" id="sl-xuat">Tải bản sao lưu</button><label class="btn">Khôi phục…<input type="file" id="sl-nhap" accept=".json" hidden></label></div></div>' +
      '<div class="card nguy"><h2>Xóa tiến độ</h2><p class="small muted">Xóa toàn bộ lịch học, thẻ, nhật ký (không xóa nội dung bài).</p><button class="btn do" id="xoa-het">Xóa tiến độ</button></div></div></div>';
    const xuLy = async (files) => {
      $("#kq-nhap").innerHTML = "Đang nhập…";
      const kq = await nhapFiles(Array.from(files));
      toast("Đã nhập " + kq.length + " mục");
      await vDuLieu();
      $("#kq-nhap").innerHTML = kq.map((x) => "• " + esc(x)).join("<br>");
    };
    const dr = $("#drop");
    dr.ondragover = (e) => { e.preventDefault(); dr.classList.add("over"); };
    dr.ondragleave = () => dr.classList.remove("over");
    dr.ondrop = (e) => { e.preventDefault(); dr.classList.remove("over"); xuLy(e.dataTransfer.files); };
    $("#file").onchange = (e) => xuLy(e.target.files);
    $$("[data-xoa-bai]").forEach((x) => x.onclick = async () => { if (!confirm("Xóa bản nhập " + x.dataset.xoaBai + " khỏi trình duyệt?")) return; await T.idb.xoaBai(x.dataset.xoaBai); await napNoiDung(); vDuLieu(); });
    $("#cd-moi").onchange = (e) => { cd.theMoiMoiNgay = Math.max(0, +e.target.value || 0); T.luu(); };
    $("#cd-dahoc").onchange = (e) => { cd.chiTheBaiDaHoc = e.target.checked; T.luu(); };
    $("#cd-chot").onchange = (e) => { cd.anChot = e.target.checked; T.luu(); };
    $("#sl-xuat").onclick = () => taiFile("dcck-tien-do-" + T.homNay() + ".json", JSON.stringify(T.S, null, 1), "application/json");
    $("#sl-nhap").onchange = async (e) => {
      const f = e.target.files[0];
      if (!f) return;
      try {
        const d = JSON.parse(await f.text());
        if (!d.bai || !d.the) throw new Error("không đúng định dạng");
        if (!confirm("Thay toàn bộ tiến độ hiện tại bằng bản sao lưu này?")) return;
        T.S = Object.assign(T.MAC_DINH(), d); T.luuNgay(); toast("Đã khôi phục"); route();
      } catch (er) { alert("Không đọc được file: " + er.message); }
    };
    $("#xoa-het").onclick = () => { if (confirm("Xóa toàn bộ tiến độ học?") && confirm("Chắc chắn? Không hoàn tác được.")) { T.S = T.MAC_DINH(); T.luuNgay(); toast("Đã xóa tiến độ"); route(); } };
  }

  /* ================= Khởi động ================= */
  function theme() {
    const k = "dcck-theme";
    let v = null;
    try { v = localStorage.getItem(k); } catch (e) { /* */ }
    if (v) document.documentElement.dataset.theme = v;
    $("#theme").onclick = () => {
      const toi = document.documentElement.dataset.theme ? document.documentElement.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
      const moi = toi ? "light" : "dark";
      document.documentElement.dataset.theme = moi;
      try { localStorage.setItem(k, moi); } catch (e) { /* */ }
    };
  }
  async function khoiDong() {
    T.tai();
    theme();
    await napNoiDung();
    window.addEventListener("hashchange", route);
    window.addEventListener("beforeunload", T.luuNgay);
    document.addEventListener("visibilitychange", () => { if (document.hidden) T.luuNgay(); });
    route();
  }
  khoiDong();
})();

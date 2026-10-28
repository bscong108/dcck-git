/* Ứng dụng tự học POCUS cấp cứu: điều hướng, bài học, thư viện mô phỏng, công cụ tính, ca lâm sàng, sổ thực hành. */
(function () {
  "use strict";
  const D = window.POCUS, SIM = window.POCUS_SIM, FIG = window.POCUS_FIG;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const app = $("#app");
  const BAI = D.bai, theoId = {};
  BAI.forEach((b) => (theoId[b.id] = b));

  /* ================= Lưu tiến độ (chỉ trong trình duyệt này) ================= */
  const KHOA = "pocus-cap-cuu-v1";
  let S = { bai: {}, ca: {}, so: [] };
  try { const r = JSON.parse(localStorage.getItem(KHOA) || "null"); if (r) S = Object.assign(S, r); } catch (e) { /* bộ nhớ bị chặn */ }
  function luu() { try { localStorage.setItem(KHOA, JSON.stringify(S)); } catch (e) { /* bỏ qua */ } }
  const tt = (id) => S.bai[id] || (S.bai[id] = { ck: {}, tk: {} });
  function trangThai(id) {
    const s = S.bai[id];
    if (!s) return "chua";
    if (s.xong) return "xong";
    return s.xem ? "dang" : "chua";
  }

  function toast(msg) { const d = document.createElement("div"); d.className = "toast"; d.textContent = msg; document.body.appendChild(d); setTimeout(() => d.remove(), 2400); }
  function saoChep(text, oNhap) {
    const xong = () => toast("Đã sao chép");
    const loi = () => { if (oNhap) { oNhap.focus(); oNhap.select(); } toast("Không sao chép tự động được: văn bản đã được chọn, hãy bấm sao chép thủ công"); };
    try { navigator.clipboard.writeText(text).then(xong, loi); } catch (e) { loi(); }
  }

  /* ================= Mô phỏng: gắn khi gần khung nhìn ================= */
  function htmlSim(spec, chu) {
    if (!spec) return "";
    return `<figure class="sim" style="margin:0"><div class="sim-cho" data-sim="${esc(spec.c)}" data-p='${esc(JSON.stringify(spec.p || {}))}' data-dk="${spec.dk ? 1 : 0}"></div>${chu ? `<figcaption class="sim-chu">${chu}</figcaption>` : ""}</figure>`;
  }
  let ioSim = null;
  function ganSim(goc) {
    const ds = $$(".sim-cho", goc);
    const lam = (el) => {
      if (el.dataset.da) return; el.dataset.da = "1";
      const p = JSON.parse(el.dataset.p || "{}");
      el.classList.remove("sim-cho");
      const h = SIM.gan(el, { canh: el.dataset.sim, p });
      if (!h) return;
      const dk = document.createElement("div"); dk.className = "sim-dk";
      const bDung = document.createElement("button"); bDung.type = "button";
      const capNhat = () => { bDung.textContent = h.dangDung() ? "▶ Chạy" : "❚❚ Dừng"; bDung.setAttribute("aria-pressed", h.dangDung() ? "true" : "false"); };
      bDung.onclick = () => { h.dungLai(!h.dangDung()); capNhat(); }; capNhat();
      const bNhan = document.createElement("button"); bNhan.type = "button"; bNhan.textContent = "Chú thích"; bNhan.setAttribute("aria-pressed", "true");
      bNhan.title = "Tắt chú thích để tự gọi tên cấu trúc";
      bNhan.onclick = () => { const b = !h.coNhan(); h.batNhan(b); bNhan.setAttribute("aria-pressed", b ? "true" : "false"); };
      dk.append(bDung, bNhan);
      if (el.dataset.dk === "1") {
        const sc = SIM.CANH[el.dataset.sim];
        const tao = (nhan, min, max, buoc, gt, fn) => {
          const l = document.createElement("label"); l.textContent = nhan;
          const r = document.createElement("input"); r.type = "range"; r.min = min; r.max = max; r.step = buoc; r.value = gt;
          r.id = "dk-" + el.dataset.sim + "-" + nhan.replace(/\W/g, "") + "-" + Math.random().toString(36).slice(2, 6);
          r.oninput = () => fn(+r.value); l.appendChild(r); dk.appendChild(l);
        };
        tao("Gain", 0.3, 2, 0.05, 1, (v) => h.dat("gain", v));
        tao("Độ sâu", Math.max(4, sc.sau - 6), sc.sau + 6, 1, sc.sau, (v) => h.dat("sau", v));
      }
      el.appendChild(dk);
      el.querySelector("canvas").addEventListener("click", () => { h.dungLai(!h.dangDung()); capNhat(); });
    };
    if (!("IntersectionObserver" in window)) { ds.forEach(lam); return; }
    if (!ioSim) ioSim = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { lam(e.target); ioSim.unobserve(e.target); } }), { rootMargin: "300px" });
    ds.forEach((el) => ioSim.observe(el));
  }

  /* ================= Khung trang ================= */
  function datNav(r) {
    $$("#nav a").forEach((a) => a.classList.toggle("on", a.dataset.r === r || (r.startsWith("b-") && a.dataset.r === "lo-trinh")));
  }
  function veTrang(html, r) {
    app.innerHTML = html; datNav(r);
    ganSim(app);
    window.scrollTo(0, 0);
  }

  /* ================= Trang chủ: lộ trình ================= */
  function tienDo() {
    const xong = BAI.filter((b) => trangThai(b.id) === "xong").length;
    return { xong, tong: BAI.length, so: S.so.length };
  }
  function theBai(b) {
    const t = trangThai(b.id), s = S.bai[b.id];
    const nhanTT = t === "xong" ? '<span class="nhan-tt xong">Đã xong</span>' : t === "dang" ? '<span class="nhan-tt dang">Đang học</span>' : '<span class="nhan-tt">Chưa học</span>';
    const ck = s ? Object.values(s.ck || {}).filter(Boolean).length : 0, tongCk = (b.kiemTra || []).length;
    const so = S.so.filter((x) => x.ud === b.id).length;
    return `<a class="the the-bai" href="#b-${b.id}"><span class="ten">${esc(b.ten)}</span><span class="mo">${esc(b.ngan)}</span>
      <span class="thanh" aria-hidden="true"><i style="width:${tongCk ? Math.round((ck / tongCk) * 100) : 0}%"></i></span>
      <span class="chan">${nhanTT}<span>${b.phut} phút</span><span>· kỹ năng ${ck}/${tongCk}</span>${so ? `<span>· ${so} ca</span>` : ""}${s && s.diem ? `<span>· kiểm tra ${s.diem}</span>` : ""}</span></a>`;
  }
  function trangChu() {
    const t = tienDo();
    const tiep = BAI.find((b) => trangThai(b.id) !== "xong") || BAI[0];
    let h = `<section class="dau">
      <div><div class="mo-dau">Siêu âm tại giường · Cấp cứu</div>
      <h1>Tự học POCUS cho bác sĩ cấp cứu</h1>
      <p>${BAI.length} bài từ nền tảng đến quy trình tích hợp. Mỗi bài có lý thuyết, hướng dẫn cầm tay chỉ việc từng bước với hình vị trí đầu dò, hình siêu âm động mô phỏng để tự đọc, cách đánh giá kết quả, ý nghĩa lâm sàng và câu hỏi tự kiểm tra.</p>
      <div class="so-lieu"><div><b>${t.xong}/${t.tong}</b><span>bài đã xong</span></div><div><b>${t.so}</b><span>ca thực hành đã ghi sổ</span></div><div><b>${D.CA.length}</b><span>ca lâm sàng tích hợp</span></div></div>
      <div class="hang" style="margin-top:14px"><a class="nut chinh" href="#b-${tiep.id}">${t.xong ? "Học tiếp" : "Bắt đầu"}: ${esc(tiep.ten)}</a><a class="nut" href="#ca-lam-sang">Làm ca lâm sàng</a></div></div>
      <div class="man-nho">${htmlSim({ c: "duoiUc", p: { dich: 1 } }, "")}</div>
    </section>
    <section class="the"><h2>Cách tự học một bài</h2>
      <ol class="cach-hoc" style="margin-top:10px">
        <li><b>Lý thuyết</b>: đọc câu hỏi lâm sàng và mục tiêu trước, rồi đọc nội dung.</li>
        <li><b>Xem mô phỏng</b>: tắt "Chú thích", tự gọi tên từng cấu trúc rồi bật lại để kiểm tra.</li>
        <li><b>Cầm tay chỉ việc</b>: làm theo từng bước trên người mẫu (đồng nghiệp), đối chiếu tiêu chuẩn "Đạt khi".</li>
        <li><b>Ghi sổ ca thật</b>: mỗi lần siêu âm bệnh nhân, ghi vào Sổ thực hành và đối chiếu kết quả cuối cùng.</li>
        <li><b>Tự kiểm tra</b> và làm ca lâm sàng; ôn lại bài có câu sai.</li>
      </ol>
      <p class="nho" style="margin-top:10px">ACEP khuyến nghị khoảng 25–50 lần khám có thẩm định chất lượng cho mỗi ứng dụng cốt lõi để đạt năng lực ban đầu. Sổ thực hành đếm số ca của anh/chị theo từng ứng dụng.</p>
    </section>`;
    for (const g of [1, 2, 3, 4]) {
      const ds = BAI.filter((b) => b.gd === g);
      h += `<section class="gd"><div class="gd-dau"><span class="gd-so">Giai đoạn ${g}</span><h2>${esc(D.GD[g].ten)}</h2><span class="muted nho">${esc(D.GD[g].mo)}</span></div><div class="luoi">${ds.map(theBai).join("")}</div></section>`;
    }
    veTrang(h, "lo-trinh");
  }

  /* ================= Bài học ================= */
  const TAB = [["ly-thuyet", "Lý thuyết"], ["thuc-hanh", "Cầm tay chỉ việc"], ["ket-qua", "Đọc kết quả"], ["lam-sang", "Ý nghĩa lâm sàng"], ["kiem-tra", "Tự kiểm tra"]];
  let tabNho = {};
  try { tabNho = JSON.parse(sessionStorage.getItem("pocus-tab") || "{}"); } catch (e) { /* */ }

  function trangBai(id) {
    const b = theoId[id];
    if (!b) return trangChu();
    const s = tt(id); if (!s.xem) { s.xem = 1; luu(); }
    const i = BAI.indexOf(b), truoc = BAI[i - 1], sau = BAI[i + 1];
    const h = `<div class="duong-dan"><a href="#lo-trinh">Lộ trình</a> · Giai đoạn ${b.gd}: ${esc(D.GD[b.gd].ten)}</div>
      <div class="hang"><h1 class="gian">${esc(b.ten)}</h1></div>
      <p class="muted" style="margin:6px 0 0">${esc(b.ngan)} · ${b.phut} phút</p>
      <div class="cau-hoi">${(b.cauHoi || []).map((q) => `<span>${esc(q)}</span>`).join("")}</div>
      <div class="tab" role="tablist">${TAB.map((t) => `<button role="tab" type="button" id="tab-${t[0]}" data-t="${t[0]}" aria-selected="false">${t[1]}</button>`).join("")}</div>
      <div id="noi-dung-tab"></div>
      <div class="chan-trang">
        ${truoc ? `<a class="nut" href="#b-${truoc.id}">← ${esc(truoc.ten)}</a>` : "<span></span>"}
        <button class="nut ${s.xong ? "" : "chinh"}" type="button" id="xong">${s.xong ? "Đã học xong ✓ (bấm để bỏ)" : "Đánh dấu đã học xong"}</button>
        ${sau ? `<a class="nut" href="#b-${sau.id}">${esc(sau.ten)} →</a>` : "<span></span>"}
      </div>`;
    veTrang(h, "b-" + id);
    $("#xong").onclick = () => { s.xong = !s.xong; luu(); trangBai(id); };
    const chon = (t) => {
      tabNho[id] = t; try { sessionStorage.setItem("pocus-tab", JSON.stringify(tabNho)); } catch (e) { /* */ }
      $$(".tab button").forEach((x) => x.setAttribute("aria-selected", x.dataset.t === t ? "true" : "false"));
      const nd = $("#noi-dung-tab");
      nd.innerHTML = ({ "ly-thuyet": tabLyThuyet, "thuc-hanh": tabThucHanh, "ket-qua": tabKetQua, "lam-sang": tabLamSang, "kiem-tra": tabKiemTra })[t](b);
      ganSim(nd);
      if (t === "ly-thuyet") { $$(".loai-dd-cho", nd).forEach((e) => (e.innerHTML = FIG.loaiDauDo())); $$(".dong-tac-cho", nd).forEach((e) => (e.innerHTML = Object.keys(FIG.DONG_TAC).map(FIG.dongTac).join(""))); }
      if (t === "thuc-hanh") ganKiem(b, nd);
      if (t === "kiem-tra") ganCauHoi(nd, b.tuKiem, (d, tong) => { s.diem = d + "/" + tong; luu(); });
      if (t === "ket-qua") ganClipToi(b, nd);
    };
    $$(".tab button").forEach((x) => (x.onclick = () => { chon(x.dataset.t); const tb = $(".tab"); if (tb.getBoundingClientRect().top < 0 || window.scrollY > tb.offsetTop) window.scrollTo(0, tb.offsetTop - 60); }));
    chon(tabNho[id] || "ly-thuyet");
  }

  function dsThamKhao(keys) {
    return `<h3>Tài liệu tham khảo</h3><ol class="nho">${(keys || []).map((k) => `<li>${esc(D.TK[k] || k)}</li>`).join("")}</ol>`;
  }
  function tabLyThuyet(b) {
    return `<div class="luoi-2"><div class="van"><h2>Mục tiêu</h2><ul>${b.mucTieu.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>${b.lyThuyet}${dsThamKhao(b.tk)}</div></div>`;
  }
  function tabThucHanh(b) {
    const cb = b.chuanBi || {};
    let h = `<section class="the"><h2>Chuẩn bị</h2><div class="chuan-bi" style="margin-top:8px">
      <div><b>Đầu dò</b>${esc(cb.dauDo || "")}</div><div><b>Chế độ máy</b>${esc(cb.cheDo || "")}</div><div><b>Tư thế</b>${esc(cb.tuThe || "")}</div>${cb.khac ? `<div><b>Lưu ý</b>${esc(cb.khac)}</div>` : ""}</div>
      ${cb.tth ? `<div class="tu-the-ds">${cb.tth.map(FIG.tuThe).join("")}</div>` : ""}
      <p class="nho" style="margin:10px 0 0">Hình vị trí: bệnh nhân nằm ngửa nhìn từ phía chân, bên phải bệnh nhân (P) ở bên trái hình. Chấm cam là dấu đầu dò; trên màn hình mô phỏng, chấm cam cho biết bên tương ứng.</p></section>`;
    b.buoc.forEach((x, i) => {
      const dd = (x.hinh && x.hinh.dd) || [], nhieu = dd.length > 1;
      const tth = x.tth ? `<div class="tu-the-ds">${x.tth.map(FIG.tuThe).join("")}</div>` : "";
      const chu = `${x.dat ? `<div class="dat"><b>Đạt khi:</b> ${esc(x.dat)}</div>` : ""}${x.meo ? `<div class="meo" style="margin-top:8px"><b>Mẹo:</b> ${esc(x.meo)}</div>` : ""}`;
      if (nhieu) {
        h += `<section class="the buoc rong" style="margin-top:14px"><div><div class="buoc-so">Bước ${i + 1}/${b.buoc.length} · ${dd.length} vị trí đầu dò</div><h2>${esc(x.ten)}</h2>
          <div class="buoc-trai">${FIG.viTri(x.hinh)}<ol>${x.lam.map((l) => `<li>${l}</li>`).join("")}</ol></div>${tth}${chu}
          <div class="vt-luoi">${dd.map((d, j) => `<div class="vt"><div class="vt-dau">${FIG.viTri(Object.assign({}, x.hinh, { chon: j }))}<div><b>Vị trí ${esc(d.n != null ? d.n : j + 1)}</b><span>${esc(d.ten || "")}</span></div></div>${htmlSim(d.sim || x.sim, "")}</div>`).join("")}</div></div></section>`;
        return;
      }
      h += `<section class="the buoc" style="margin-top:14px"><div><div class="buoc-so">Bước ${i + 1}/${b.buoc.length}</div><h2>${esc(x.ten)}</h2>
        <div class="buoc-trai">${x.hinh ? FIG.viTri(x.hinh) : "<span></span>"}<ol>${x.lam.map((l) => `<li>${l}</li>`).join("")}</ol></div>
        ${tth}${chu}</div>
        <div>${htmlSim(x.sim, x.sim && x.sim.dk ? "Kéo thanh Gain và Độ sâu để thấy hình thay đổi." : "Hình mong đợi khi đặt đầu dò đúng. Bấm vào hình để dừng/chạy.")}</div></section>`;
    });
    h += `<section class="the" style="margin-top:14px"><h2>Bảng kiểm kỹ năng</h2><p class="nho" style="margin:4px 0 10px">Tự đánh dấu khi làm được trên người mẫu hoặc bệnh nhân. Lưu trong trình duyệt này.</p><ul class="ds-kiem" id="ds-kiem">${b.kiemTra.map((k, i) => `<li><label><input type="checkbox" id="ck-${b.id}-${i}" data-i="${i}"><span>${esc(k)}</span></label></li>`).join("")}</ul></section>`;
    return h;
  }
  function ganKiem(b, nd) {
    const s = tt(b.id);
    $$("#ds-kiem input", nd).forEach((c) => { c.checked = !!s.ck[c.dataset.i]; c.onchange = () => { s.ck[c.dataset.i] = c.checked; luu(); }; });
  }
  function htmlCap(c) {
    return `<section class="cap-the"><h3>${esc(c.benh)}</h3><div class="cap">${htmlSim(c.bt[0], `<span class="nhan-bt">Bình thường</span><br>${esc(c.bt[1])}`)}${htmlSim(c.bl[0], `<span class="nhan-bl">Bệnh lý</span><br>${esc(c.bl[1])}`)}</div></section>`;
  }
  function tabKetQua(b) {
    const than = b.cap
      ? `<p class="muted" style="margin-top:0">Mỗi mặt bệnh có một cặp hình cùng mặt cắt: bình thường bên trái, bệnh lý bên phải. Tắt "Chú thích" để tự đọc trước.</p>${b.cap.map(htmlCap).join("")}`
      : `<p class="muted" style="margin-top:0">So sánh các hình. Tắt "Chú thích" để tự đọc trước.</p><div class="luoi">${b.ketQua.map((k) => htmlSim(k.sim, `<b>${esc(k.ten)}</b>${esc(k.mo || "")}`)).join("")}</div>`;
    return `${than}
      ${b.bang ? `<section style="margin-top:18px"><h2>Diễn giải và quyết định</h2>${b.bang}</section>` : ""}
      <section class="the clip-toi" style="margin-top:18px"><h2>Clip của tôi</h2><p class="nho" style="margin:4px 0 10px">Thêm video hoặc ảnh siêu âm anh/chị tự ghi (đã ẩn thông tin người bệnh) để ôn cùng bài này. Chỉ lưu trong trình duyệt của thiết bị này.</p>
      <div class="hang"><label class="nut" for="clip-file">Thêm clip/ảnh</label><input id="clip-file" type="file" accept="video/*,image/*" multiple class="an-in"></div><div class="luoi" id="clip-ds" style="margin-top:12px"></div></section>`;
  }
  function tabLamSang(b) {
    return `<div class="luoi-2"><div class="van"><h2>Ý nghĩa lâm sàng</h2>${b.lamSang}</div>
      <div><h2>Bẫy thường gặp</h2><ul class="bay">${b.bay.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div></div>`;
  }
  function tabKiemTra(b) {
    return `<div class="van"><p class="muted" style="margin-top:0">${b.tuKiem.length} câu. Chọn đáp án để xem giải thích.</p>${htmlCauHoi(b.tuKiem)}<p id="ket-diem" class="diem"></p></div>`;
  }
  function htmlCauHoi(ds) {
    return ds.map((q, i) => `<div class="cau the" data-i="${i}" style="margin-bottom:10px"><div class="hoi">${i + 1}. ${esc(q.q)}</div><div class="lc">${q.a.map((a, j) => `<button type="button" data-j="${j}">${String.fromCharCode(65 + j)}. ${esc(a)}</button>`).join("")}</div><div class="giai" hidden></div></div>`).join("");
  }
  function ganCauHoi(goc, ds, khiXong) {
    let dung = 0, lam = 0;
    $$(".cau", goc).forEach((c) => {
      const q = ds[+c.dataset.i];
      $$(".lc button", c).forEach((bt) => (bt.onclick = () => {
        const j = +bt.dataset.j; lam++; if (j === q.d) dung++;
        $$(".lc button", c).forEach((x) => { x.disabled = true; if (+x.dataset.j === q.d) x.classList.add("dung"); });
        if (j !== q.d) bt.classList.add("sai");
        const g = $(".giai", c); g.hidden = false; g.innerHTML = `<b>${j === q.d ? "Đúng." : "Chưa đúng."}</b> ${esc(q.giai)}`;
        const kq = $("#ket-diem", goc);
        if (lam === ds.length) { if (kq) kq.textContent = "Kết quả: " + dung + "/" + ds.length + " câu đúng."; if (khiXong) khiXong(dung, ds.length); }
      }));
    });
  }

  /* ----- Clip của tôi: IndexedDB ----- */
  function moCSDL() {
    return new Promise((ok, loi) => {
      try {
        const r = indexedDB.open("pocus-clip", 1);
        r.onupgradeneeded = () => r.result.createObjectStore("clip", { keyPath: "id" });
        r.onsuccess = () => ok(r.result); r.onerror = () => loi(r.error);
      } catch (e) { loi(e); }
    });
  }
  async function clipTheoBai(bai) {
    const db = await moCSDL();
    return new Promise((ok) => { const out = []; const c = db.transaction("clip").objectStore("clip").openCursor(); c.onsuccess = () => { const k = c.result; if (k) { if (k.value.bai === bai) out.push(k.value); k.continue(); } else ok(out); }; c.onerror = () => ok(out); });
  }
  async function ganClipToi(b, nd) {
    const ds = $("#clip-ds", nd), inp = $("#clip-file", nd);
    const ve = async () => {
      let cl = [];
      try { cl = await clipTheoBai(b.id); } catch (e) { ds.innerHTML = '<p class="nho">Trình duyệt này không cho lưu clip.</p>'; return; }
      if (!cl.length) { ds.innerHTML = '<p class="nho">Chưa có clip nào.</p>'; return; }
      ds.innerHTML = "";
      cl.forEach((x) => {
        const f = document.createElement("figure"); f.className = "the"; f.style.margin = "0";
        const url = URL.createObjectURL(x.blob);
        f.innerHTML = (x.type.startsWith("video") ? `<video src="${url}" controls loop muted playsinline></video>` : `<img src="${url}" alt="${esc(x.ten)}">`) + `<figcaption class="hang nho" style="margin-top:6px"><span class="gian">${esc(x.ten)}</span><button class="nut nho-nut" type="button">Xóa</button></figcaption>`;
        $("button", f).onclick = async () => { const db = await moCSDL(); db.transaction("clip", "readwrite").objectStore("clip").delete(x.id).onsuccess = ve; };
        ds.appendChild(f);
      });
    };
    inp.onchange = async () => {
      try {
        const db = await moCSDL();
        for (const f of inp.files) await new Promise((ok) => { const tx = db.transaction("clip", "readwrite"); tx.objectStore("clip").put({ id: Date.now() + "-" + Math.random().toString(36).slice(2), bai: b.id, ten: f.name, type: f.type, blob: f }); tx.oncomplete = ok; tx.onerror = ok; });
        toast("Đã thêm clip"); ve();
      } catch (e) { toast("Không lưu được clip trên trình duyệt này"); }
      inp.value = "";
    };
    ve();
  }

  /* ================= Thư viện mô phỏng ================= */
  function trangThuVien() {
    let h = `<h1>Thư viện hình động</h1><p class="muted">Toàn bộ hình mô phỏng theo bài. Dùng để ôn nhanh: tắt chú thích, tự đọc, rồi bật lại. Đây là hình vẽ mô phỏng có chủ đích để học nhận diện, không thay thế clip bệnh nhân thật.</p>
      <div class="hang tim"><input class="o-nhap" id="tim" type="search" placeholder="Tìm: dịch, phổi, thất phải, sỏi…" aria-label="Tìm hình" style="max-width:420px"></div>
      <div id="tv"></div>
      <section class="the" style="margin-top:22px"><h2>Xem clip bệnh nhân thật (cần mạng)</h2><p class="nho" style="margin:4px 0 8px">Các thư viện mở, miễn phí, do bác sĩ siêu âm cấp cứu xây dựng:</p>
      <ul><li><a href="https://www.thepocusatlas.com" target="_blank" rel="noopener">The POCUS Atlas</a>: thư viện clip theo ứng dụng.</li>
      <li><a href="https://www.acep.org/sonoguide/" target="_blank" rel="noopener">ACEP Sonoguide</a>: hướng dẫn theo ứng dụng của Hội Y học Cấp cứu Hoa Kỳ.</li>
      <li><a href="https://www.pocus101.com" target="_blank" rel="noopener">POCUS 101</a>: bài hướng dẫn từng bước có clip.</li>
      <li><a href="https://www.coreultrasound.com" target="_blank" rel="noopener">Core Ultrasound</a>: bài giảng và podcast.</li></ul></section>`;
    veTrang(h, "thu-vien");
    const ve = (q) => {
      q = (q || "").toLowerCase().trim();
      let out = "";
      for (const b of BAI) {
        if (b.cap) {
          const ds = b.cap.filter((c) => !q || (b.ten + " " + c.benh + " " + c.bt[1] + " " + c.bl[1]).toLowerCase().includes(q));
          if (ds.length) out += `<section style="margin-top:18px"><div class="gd-dau"><h2>${esc(b.ten)}</h2><a class="nho" href="#b-${b.id}">Mở bài</a></div>${ds.map(htmlCap).join("")}</section>`;
          continue;
        }
        const ds = b.ketQua.filter((k) => !q || (b.ten + " " + k.ten + " " + (k.mo || "")).toLowerCase().includes(q));
        if (!ds.length) continue;
        out += `<section style="margin-top:18px"><div class="gd-dau"><h2>${esc(b.ten)}</h2><a class="nho" href="#b-${b.id}">Mở bài</a></div><div class="luoi">${ds.map((k) => htmlSim(k.sim, `<b>${esc(k.ten)}</b>${esc(k.mo || "")}`)).join("")}</div></section>`;
      }
      $("#tv").innerHTML = out || '<p class="muted">Không có hình phù hợp.</p>';
      ganSim($("#tv"));
    };
    $("#tim").oninput = (e) => ve(e.target.value);
    ve("");
  }

  /* ================= Công cụ tính ================= */
  const so = (x, n) => (isFinite(x) ? x.toLocaleString("vi-VN", { maximumFractionDigits: n == null ? 1 : n }) : "—");
  const CONG_CU = [
    { id: "bq", ten: "Thể tích bàng quang", vao: [["ngang", "Ngang (cm)", 9.6], ["ts", "Trước – sau (cm)", 6.2], ["doc", "Dọc (cm)", 8]],
      tinh: (v) => { const V = 0.52 * v.ngang * v.ts * v.doc; return [so(V, 0) + " mL", "V ≈ ngang × trước – sau × dọc × 0,52. Ước lượng; hệ số thay đổi theo hình dạng bàng quang."]; } },
    { id: "mp", ten: "Thể tích dịch màng phổi (Balik)", vao: [["sep", "Khoảng cách màng phổi thành – tạng ở đáy (mm)", 30]],
      tinh: (v) => [so(20 * v.sep, 0) + " mL", "V (mL) ≈ 20 × Sep (mm); nằm ngửa, cuối thì thở ra (Balik 2006)."] },
    { id: "sv", ten: "Thể tích nhát bóp và cung lượng tim", vao: [["d", "Đường kính đường ra thất trái (cm)", 2.0], ["vti", "VTI (cm)", 20], ["f", "Tần số tim (lần/phút)", 80]],
      tinh: (v) => { const A = Math.PI * Math.pow(v.d / 2, 2), SV = A * v.vti, CO = (SV * v.f) / 1000; return [so(SV, 0) + " mL · " + so(CO, 1) + " L/phút", "Diện tích = π × (d/2)² = " + so(A, 2) + " cm². Sai số đo đường kính bị bình phương: đo cẩn thận ở PSLA giữa tâm thu."]; } },
    { id: "plr", ten: "Thay đổi VTI khi nâng chân thụ động", vao: [["t", "VTI trước (cm)", 15], ["s", "VTI trong PLR (cm)", 17.5]],
      tinh: (v) => { const p = ((v.s - v.t) / v.t) * 100; return [(p >= 0 ? "+" : "") + so(p, 0) + "%", p >= 10 ? "≥ 10–15%: gợi ý đáp ứng dịch. Cân nhắc lợi – hại trước khi truyền (đường B, TMC dưới, thất phải)." : "< 10%: ít khả năng đáp ứng dịch."]; } },
    { id: "rap", ten: "Áp lực nhĩ phải từ TMC dưới", vao: [["max", "Dmax (cm)", 1.9], ["min", "Dmin khi hít vào/hít mạnh (cm)", 0.8]],
      tinh: (v) => { const x = ((v.max - v.min) / v.max) * 100; let r = "≈ 8 mmHg (5–10)"; if (v.max <= 2.1 && x > 50) r = "≈ 3 mmHg (0–5)"; else if (v.max > 2.1 && x < 50) r = "≈ 15 mmHg (10–20)"; return [r, "Chỉ số xẹp " + so(x, 0) + "%. Theo ASE (Rudski 2010). Không dùng đơn độc để quyết định truyền dịch."]; } },
    { id: "rv", ten: "Tỉ lệ thất phải / thất trái (A4C)", vao: [["rv", "Đường kính đáy thất phải (mm)", 44], ["lv", "Đường kính đáy thất trái (mm)", 40]],
      tinh: (v) => { const r = v.rv / v.lv; return [so(r, 2), (r > 1 ? "> 1: thất phải giãn rõ. " : r > 0.6 ? "Lớn hơn bình thường (≈ 0,6). " : "Trong giới hạn. ") + (v.rv > 41 ? "Đáy thất phải > 41 mm: giãn (ASE 2015)." : "")]; } },
  ];
  function trangCongCu() {
    const h = `<h1>Công cụ tính tại giường</h1><p class="muted">Các công thức dùng trong bài học. Kết quả là ước lượng để hỗ trợ quyết định, luôn đặt cạnh bệnh cảnh.</p>
      <div class="luoi" style="margin-top:14px">${CONG_CU.map((c) => `<section class="the" data-c="${c.id}"><h2>${esc(c.ten)}</h2><div class="form" style="margin-top:10px">${c.vao.map((v) => `<label for="cc-${c.id}-${v[0]}">${esc(v[1])}<input id="cc-${c.id}-${v[0]}" type="number" step="any" inputmode="decimal" value="${v[2]}" data-k="${v[0]}"></label>`).join("")}</div><div class="kq" style="margin-top:12px"></div><div class="kq-mo"></div></section>`).join("")}</div>`;
    veTrang(h, "cong-cu");
    CONG_CU.forEach((c) => {
      const sec = $(`[data-c="${c.id}"]`), tinh = () => { const v = {}; $$("input", sec).forEach((i) => (v[i.dataset.k] = parseFloat(String(i.value).replace(",", ".")))); const r = c.tinh(v); $(".kq", sec).textContent = r[0]; $(".kq-mo", sec).textContent = r[1]; };
      $$("input", sec).forEach((i) => (i.oninput = tinh)); tinh();
    });
  }

  /* ================= Ca lâm sàng ================= */
  function trangCa(id) {
    const ca = D.CA.find((c) => c.id === id);
    if (!ca) {
      const h = `<h1>Ca lâm sàng tích hợp</h1><p class="muted">Tình huống giả định để luyện ra quyết định: mỗi bước cho một hình siêu âm, anh/chị đọc và chọn hướng xử trí.</p>
        <div class="luoi" style="margin-top:14px">${D.CA.map((c) => `<a class="the the-bai" href="#ca-${c.id.replace(/^ca-/, "")}"><span class="ten">${esc(c.ten)}</span><span class="mo">${esc(c.mo.slice(0, 110))}…</span><span class="chan">${c.buoc.length} bước${S.ca[c.id] ? " · lần trước " + S.ca[c.id] : ""}</span></a>`).join("")}</div>`;
      return veTrang(h, "ca-lam-sang");
    }
    let h = `<div class="duong-dan"><a href="#ca-lam-sang">Ca lâm sàng</a></div><h1>${esc(ca.ten)}</h1><p class="the" style="margin-top:12px">${esc(ca.mo)}</p>`;
    ca.buoc.forEach((x, i) => {
      h += `<section class="the buoc ca-buoc" data-i="${i}" style="margin-top:14px" ${i ? "hidden" : ""}><div><div class="buoc-so">Bước ${i + 1}/${ca.buoc.length}</div><p style="margin:4px 0 10px">${esc(x.mo)}</p>
        <div class="cau" data-i="${i}"><div class="hoi">${esc(x.q)}</div><div class="lc">${x.a.map((a, j) => `<button type="button" data-j="${j}">${String.fromCharCode(65 + j)}. ${esc(a)}</button>`).join("")}</div><div class="giai" hidden></div></div></div>
        <div>${htmlSim(x.sim, "")}</div></section>`;
    });
    h += `<section class="the" id="ca-ket" hidden style="margin-top:14px"><h2>Kết thúc ca</h2><p id="ca-diem" class="diem"></p><p>${esc(ca.ket)}</p><div class="hang">${(ca.bai || []).map((b) => theoId[b] ? `<a class="nut" href="#b-${b}">Ôn: ${esc(theoId[b].ten)}</a>` : "").join("")}<a class="nut chinh" href="#ca-lam-sang">Ca khác</a></div></section>`;
    veTrang(h, "ca-lam-sang");
    let dung = 0;
    $$(".ca-buoc").forEach((sec) => {
      const i = +sec.dataset.i, x = ca.buoc[i];
      $$(".lc button", sec).forEach((bt) => (bt.onclick = () => {
        const j = +bt.dataset.j; if (j === x.d) dung++;
        $$(".lc button", sec).forEach((y) => { y.disabled = true; if (+y.dataset.j === x.d) y.classList.add("dung"); });
        if (j !== x.d) bt.classList.add("sai");
        const g = $(".giai", sec); g.hidden = false; g.innerHTML = `<b>${j === x.d ? "Đúng." : "Chưa đúng."}</b> ${esc(x.giai)}`;
        const tiep = $(`.ca-buoc[data-i="${i + 1}"]`);
        if (tiep) { tiep.hidden = false; ganSim(tiep); setTimeout(() => tiep.scrollIntoView({ behavior: "smooth", block: "start" }), 250); }
        else { const k = $("#ca-ket"); k.hidden = false; $("#ca-diem").textContent = "Đúng " + dung + "/" + ca.buoc.length + " bước."; S.ca[ca.id] = dung + "/" + ca.buoc.length; luu(); }
      }));
    });
  }

  /* ================= Sổ thực hành ================= */
  const MUC_TIEU = 25;
  function trangSo() {
    const dem = {}; S.so.forEach((x) => (dem[x.ud] = (dem[x.ud] || 0) + 1));
    const hom = new Date(); const ngay = hom.getFullYear() + "-" + String(hom.getMonth() + 1).padStart(2, "0") + "-" + String(hom.getDate()).padStart(2, "0");
    const h = `<h1>Sổ thực hành</h1><p class="muted">Ghi mỗi lần siêu âm thật để theo dõi số ca theo ứng dụng và tự đối chiếu với kết quả cuối cùng. Không ghi họ tên hoặc mã người bệnh. Dữ liệu chỉ lưu trong trình duyệt của thiết bị này; sao lưu định kỳ.</p>
      <section class="the" style="margin-top:14px"><h2>Ghi ca mới</h2>
        <form class="form" id="f-so" style="margin-top:10px">
          <label for="so-ngay">Ngày<input id="so-ngay" type="date" value="${ngay}" required></label>
          <label for="so-ud">Ứng dụng<select id="so-ud">${BAI.filter((b) => b.gd > 1).map((b) => `<option value="${b.id}">${esc(b.ten)}</option>`).join("")}</select></label>
          <label for="so-kq">Kết quả<select id="so-kq"><option>Bình thường</option><option>Bất thường</option><option>Không xác định (hình không đủ)</option></select></label>
          <label for="so-cl">Chất lượng hình tự chấm<select id="so-cl"><option value="5">5 – đủ chẩn đoán, chuẩn</option><option value="4">4 – đủ chẩn đoán</option><option value="3" selected>3 – tạm được</option><option value="2">2 – kém</option><option value="1">1 – không dùng được</option></select></label>
          <label for="so-dc">Đối chiếu<select id="so-dc"><option>Chưa đối chiếu</option><option>Phù hợp CT/siêu âm chuyên khoa</option><option>Phù hợp phẫu thuật/diễn tiến</option><option>Không phù hợp</option><option>Có người hướng dẫn xác nhận</option></select></label>
          <label class="rong" for="so-mo">Chỉ định và phát hiện<textarea id="so-mo" class="o-nhap" placeholder="Ví dụ: tụt HA sau tai nạn; dịch khoang Morison; CT xác nhận vỡ lách" style="font-family:inherit;font-size:14px;min-height:64px"></textarea></label>
          <div class="rong"><button class="nut chinh" type="submit">Lưu ca</button></div>
        </form></section>
      <section class="the" style="margin-top:14px"><h2>Số ca theo ứng dụng</h2><p class="nho" style="margin:4px 0 8px">Mốc ${MUC_TIEU} ca là mức tối thiểu ACEP gợi ý cho mỗi ứng dụng cốt lõi (khoảng 25–50).</p>
        <div class="bang-wrap"><table class="bang-so"><tr><th>Ứng dụng</th><th>Số ca</th><th style="width:40%">Tiến độ</th></tr>${BAI.filter((b) => b.gd > 1).map((b) => `<tr><td>${esc(b.ten)}</td><td>${dem[b.id] || 0}</td><td><span class="thanh" style="display:block"><i style="width:${Math.min(100, ((dem[b.id] || 0) / MUC_TIEU) * 100)}%"></i></span></td></tr>`).join("")}</table></div></section>
      <section class="the" style="margin-top:14px"><div class="hang"><h2 class="gian">Các ca đã ghi (${S.so.length})</h2></div><div id="so-ds" style="margin-top:8px"></div></section>
      <section class="the" style="margin-top:14px"><h2>Sao lưu và chuyển máy</h2><p class="nho" style="margin:4px 0 8px">Sao chép bản sao lưu (toàn bộ tiến độ và sổ), dán vào ghi chú/email của anh/chị. Trên máy khác, dán vào ô dưới rồi bấm Khôi phục.</p>
        <div class="hang"><button class="nut" type="button" id="sl-csv">Sao chép sổ dạng CSV</button><button class="nut" type="button" id="sl-json">Sao chép bản sao lưu</button><button class="nut" type="button" id="sl-kp">Khôi phục từ ô dưới</button></div>
        <textarea id="sl-o" class="o-nhap" style="margin-top:10px" placeholder="Dán bản sao lưu vào đây để khôi phục"></textarea></section>`;
    veTrang(h, "so-tay");
    const veDs = () => {
      const ds = S.so.slice().reverse();
      $("#so-ds").innerHTML = ds.length ? `<div class="bang-wrap"><table><tr><th>Ngày</th><th>Ứng dụng</th><th>Kết quả</th><th>CL</th><th>Đối chiếu</th><th>Ghi chú</th><th></th></tr>${ds.map((x) => `<tr><td>${esc(x.ngay)}</td><td>${esc((theoId[x.ud] || {}).ten || x.ud)}</td><td>${esc(x.kq)}</td><td>${esc(x.cl)}</td><td>${esc(x.dc)}</td><td>${esc(x.mo)}</td><td><button class="nut nho-nut" type="button" data-id="${esc(x.id)}">Xóa</button></td></tr>`).join("")}</table></div>` : '<p class="nho">Chưa có ca nào. Ghi ca đầu tiên ở biểu mẫu trên.</p>';
      $$("#so-ds button").forEach((b) => (b.onclick = () => { S.so = S.so.filter((x) => x.id !== b.dataset.id); luu(); trangSo(); }));
    };
    veDs();
    $("#f-so").onsubmit = (e) => {
      e.preventDefault();
      S.so.push({ id: Date.now().toString(36), ngay: $("#so-ngay").value, ud: $("#so-ud").value, kq: $("#so-kq").value, cl: $("#so-cl").value, dc: $("#so-dc").value, mo: $("#so-mo").value.trim() });
      luu(); toast("Đã lưu ca"); trangSo();
    };
    const o = $("#sl-o");
    $("#sl-csv").onclick = () => {
      const q = (s) => '"' + String(s || "").replace(/"/g, '""') + '"';
      const csv = ["Ngày,Ứng dụng,Kết quả,Chất lượng,Đối chiếu,Ghi chú"].concat(S.so.map((x) => [x.ngay, (theoId[x.ud] || {}).ten || x.ud, x.kq, x.cl, x.dc, x.mo].map(q).join(","))).join("\n");
      o.value = csv; saoChep(csv, o);
    };
    $("#sl-json").onclick = () => { const t = JSON.stringify(S); o.value = t; saoChep(t, o); };
    $("#sl-kp").onclick = () => {
      try { const r = JSON.parse(o.value); if (!r || typeof r !== "object" || !r.bai) throw 0; S = Object.assign({ bai: {}, ca: {}, so: [] }, r); luu(); toast("Đã khôi phục"); trangSo(); }
      catch (e) { toast("Nội dung dán vào không phải bản sao lưu hợp lệ"); }
    };
  }

  /* ================= Tham khảo ================= */
  function trangThamKhao() {
    const dung = new Set(); BAI.forEach((b) => (b.tk || []).forEach((k) => dung.add(k)));
    const h = `<h1>Tài liệu tham khảo và phạm vi</h1>
      <section class="the van" style="margin-top:14px;max-width:none"><h2>Phạm vi sử dụng</h2>
      <p>Nội dung được biên soạn để tự học, dựa trên các sách giáo khoa siêu âm cấp cứu và khuyến cáo quốc tế liệt kê dưới đây. Ngưỡng và quy trình có thể khác nhau giữa các tài liệu; khi có khác biệt, ứng dụng ghi rõ. Quyết định lâm sàng tuân theo phác đồ của cơ sở và đánh giá toàn diện người bệnh.</p>
      <p>Tất cả hình động trong ứng dụng là <b>hình vẽ mô phỏng</b> (không phải ảnh người bệnh) để học nhận diện cấu trúc và dấu hiệu. Hãy bổ sung bằng clip thật trong mục "Clip của tôi" của từng bài và các thư viện mở ở mục Thư viện hình động.</p></section>
      <section class="the" style="margin-top:14px"><h2>Danh mục</h2><ol class="nho" style="margin-top:8px">${Object.keys(D.TK).filter((k) => dung.has(k)).map((k) => `<li style="margin:4px 0">${esc(D.TK[k])}</li>`).join("")}</ol></section>`;
    veTrang(h, "tham-khao");
  }

  /* ================= Điều hướng ================= */
  function dinhTuyen() {
    const h = (location.hash || "").replace(/^#/, "");
    if (h.startsWith("b-")) return trangBai(h.slice(2));
    if (h === "thu-vien") return trangThuVien();
    if (h === "cong-cu") return trangCongCu();
    if (h === "ca-lam-sang") return trangCa(null);
    if (h.startsWith("ca-")) return trangCa(h);
    if (h === "so-tay") return trangSo();
    if (h === "tham-khao") return trangThamKhao();
    return trangChu();
  }
  window.addEventListener("hashchange", dinhTuyen);

  /* Giao diện sáng/tối */
  const nutGd = $("#doi-giao-dien");
  try { const g = localStorage.getItem("pocus-giao-dien"); if (g) document.documentElement.dataset.theme = g; } catch (e) { /* */ }
  nutGd.onclick = () => {
    const toi = document.documentElement.dataset.theme ? document.documentElement.dataset.theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    const moi = toi ? "light" : "dark"; document.documentElement.dataset.theme = moi;
    try { localStorage.setItem("pocus-giao-dien", moi); } catch (e) { /* */ }
  };
  dinhTuyen();
})();

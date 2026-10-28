/* Giao diện ứng dụng ECG Cấp cứu: điều hướng, bài học, atlas, ca lâm sàng, luyện nhanh, thẻ ôn, công cụ. */
(function () {
  "use strict";
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const app = $("#app");
  const LESSONS = window.LESSONS.slice().sort((a, b) => (a.id < b.id ? -1 : 1));
  const LBY = {}; LESSONS.forEach((l) => (LBY[l.id] = l));
  const PARTS = { 1: "Nền tảng", 2: "Lớn nhĩ và phì đại thất", 3: "Rối loạn dẫn truyền", 4: "Thiếu máu và nhồi máu cơ tim", 5: "Rối loạn nhịp", 6: "ECG trong bệnh toàn thân và di truyền", 7: "Máy tạo nhịp và tích hợp lâm sàng" };
  const P = window.PATTERN, PL = window.PATTERNS, CASES = window.CASES, TOOLS = window.TOOLS;
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const litfl = (q) => "https://litfl.com/?s=" + encodeURIComponent(q);

  /* ---------- Lưu trữ ---------- */
  const KEY = "ecg-cap-cuu-v1";
  let S = { learned: {}, cases: {}, drill: {}, cards: {}, log: {} };
  try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch (e) { /* trình duyệt chặn lưu trữ */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* bỏ qua */ } };
  const today = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  const logAct = (k) => { const t = today(); S.log[t] = S.log[t] || {}; S.log[t][k] = (S.log[t][k] || 0) + 1; };

  /* ---------- Giao diện sáng/tối ---------- */
  try { const th = localStorage.getItem("ecg-theme"); if (th) document.documentElement.dataset.theme = th; } catch (e) { /* */ }
  $("#theme").onclick = () => {
    const cur = document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const n = cur === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = n;
    try { localStorage.setItem("ecg-theme", n); } catch (e) { /* */ }
  };

  /* ---------- Markdown tối giản ---------- */
  function inline(t) {
    let s = esc(t);
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*\s][^*]*?)\*(?!\*)/g, "$1<em>$2</em>").replace(/`([^`]+)`/g, "<code>$1</code>");
    return s;
  }
  function md(src) {
    const lines = src.replace(/^\n+|\s+$/g, "").split("\n");
    let h = "", i = 0;
    while (i < lines.length) {
      const l = lines[i];
      if (!l.trim()) { i++; continue; }
      let m;
      if ((m = l.match(/^\[\[ecg:([\w-]+)\]\]$/))) { h += viewerHTML({ pattern: m[1], compact: true }); i++; continue; }
      if ((m = l.match(/^(#{2,4})\s+(.*)$/))) { const n = m[1].length; h += `<h${n}>${inline(m[2])}</h${n}>`; i++; continue; }
      if (/^\|/.test(l)) {
        const rows = [];
        while (i < lines.length && /^\|/.test(lines[i])) { rows.push(lines[i]); i++; }
        const cells = (r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
        const head = cells(rows[0]);
        const body = rows.slice(2).map(cells);
        h += `<div class="tbl"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
        continue;
      }
      if (/^>\s?/.test(l)) {
        const buf = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, "")); i++; }
        let cls = "note", txt = buf.join(" ");
        if (/^!\s/.test(txt)) { cls = "callout nguy"; txt = txt.slice(2); }
        else if (/^\*\s/.test(txt)) { cls = "callout meo"; txt = txt.slice(2); }
        else cls = "callout";
        const lab = cls.includes("nguy") ? "Cảnh báo" : cls.includes("meo") ? "Mẹo" : "Ghi chú";
        h += `<div class="${cls}"><span class="cl-lab">${lab}</span>${inline(txt)}</div>`;
        continue;
      }
      if (/^(\s*)(-|\d+\.)\s+/.test(l)) {
        const ordered = /^\s*\d+\./.test(l);
        const items = [];
        while (i < lines.length && /^(\s*)(-|\d+\.)\s+/.test(lines[i])) { items.push(lines[i].replace(/^(\s*)(-|\d+\.)\s+/, "")); i++; }
        h += `<${ordered ? "ol" : "ul"}>${items.map((x) => `<li>${inline(x)}</li>`).join("")}</${ordered ? "ol" : "ul"}>`;
        continue;
      }
      const buf = [];
      while (i < lines.length && lines[i].trim() && !/^(#{2,4}\s|\||>|\[\[ecg:|(\s*)(-|\d+\.)\s+)/.test(lines[i])) { buf.push(lines[i]); i++; }
      h += `<p>${inline(buf.join(" "))}</p>`;
    }
    return h;
  }

  /* ---------- Trình xem ECG ---------- */
  let vid = 0;
  const cache = {};
  function viewerHTML(o) {
    const id = "v" + ++vid;
    cache[id] = Object.assign({ seed: 3, layout: "12", zoom: 1 }, o);
    const p = o.pattern ? P[o.pattern] : null;
    const title = o.hideName ? "" : p ? `<a class="v-name" href="#/atlas/${p.id}">${esc(p.name)}</a>` : "";
    return `<figure class="viewer${o.compact ? " compact" : ""}" data-v="${id}">
      <div class="v-bar">${title}<span class="spacer"></span>
        <div class="seg" role="group" aria-label="Bố cục"><button data-lay="12" class="on" title="12 chuyển đạo + dải nhịp DII">12 CĐ</button><button data-lay="II" title="Dải nhịp DII 10 giây">DII</button><button data-lay="V1" title="DII và V1 10 giây">DII+V1</button></div>
        <button class="tb" data-act="cal" title="Thước đo: bấm 2 điểm trên giấy để đo thời gian (ms) và biên độ (mm)" aria-pressed="false"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 2v12M13 2v12M3 8h10" stroke="currentColor" stroke-width="1.6" fill="none"/></svg><span>Thước đo</span></button>
        <button class="tb" data-act="zo" title="Thu nhỏ" aria-label="Thu nhỏ">−</button><button class="tb" data-act="zi" title="Phóng to" aria-label="Phóng to">+</button>
        <button class="tb" data-act="full" title="Toàn màn hình" aria-label="Toàn màn hình"><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" stroke="currentColor" stroke-width="1.6" fill="none"/></svg></button>
      </div>
      <div class="v-scroll"><div class="v-paper"></div></div>
      <div class="v-read" aria-live="polite"></div>
    </figure>`;
  }
  function mountViewers(root) {
    $$(".viewer", root).forEach((fig) => {
      if (fig.dataset.mounted) return;
      fig.dataset.mounted = "1";
      const st = cache[fig.dataset.v];
      const paper = $(".v-paper", fig), read = $(".v-read", fig);
      let cal = null, data = null;
      const draw = () => {
        if (!data) {
          const cfg = st.cfg || (P[st.pattern] ? P[st.pattern].cfg(st.seed) : null);
          if (!cfg) { paper.innerHTML = '<p class="muted">Không tìm thấy mẫu ECG.</p>'; return; }
          data = ECG.generate(cfg);
        }
        const opt = st.layout === "12" ? { layout: "12", rhythmLead: st.rhythmLead || "II" } : { layout: "strip", leads: st.layout === "V1" ? ["II", "V1"] : ["II"] };
        paper.innerHTML = ECG.render(data, Object.assign(opt, { label: st.pattern && !st.hideName ? P[st.pattern].name : "Điện tâm đồ" }));
        const svg = $("svg", paper);
        svg.style.width = st.zoom * 100 + "%";
        if (fig.classList.contains("cal")) svg.classList.add("caliper-on");
        cal = ECG.attachCaliper(svg, (m) => {
          read.innerHTML = m ? `<b>${Math.round(m.ms)} ms</b> (${(m.ms / 40).toFixed(1).replace(".", ",")} ô nhỏ) · ${m.rate > 0 ? "nếu là RR: <b>" + Math.round(m.rate) + "/ph</b> · " : ""}biên độ <b>${m.mm >= 0 ? "+" : ""}${m.mm.toFixed(1).replace(".", ",")} mm</b>` : "Bấm điểm thứ hai…";
        });
      };
      draw();
      fig.addEventListener("click", (e) => {
        const b = e.target.closest("button"); if (!b || !fig.contains(b)) return;
        if (b.dataset.lay) { st.layout = b.dataset.lay; $$(".seg button", fig).forEach((x) => x.classList.toggle("on", x === b)); draw(); return; }
        const a = b.dataset.act;
        if (a === "cal") {
          const on = !fig.classList.contains("cal");
          fig.classList.toggle("cal", on); b.setAttribute("aria-pressed", on);
          const svg = $("svg", paper); svg.classList.toggle("caliper-on", on);
          if (!on && cal) { cal.clear(); read.textContent = ""; } else read.textContent = "Bấm 2 điểm trên giấy ECG để đo.";
        } else if (a === "zi" || a === "zo") {
          st.zoom = Math.max(1, Math.min(4, st.zoom * (a === "zi" ? 1.4 : 1 / 1.4)));
          $("svg", paper).style.width = st.zoom * 100 + "%";
        } else if (a === "full") {
          fig.classList.toggle("full"); document.body.classList.toggle("noscroll", fig.classList.contains("full"));
        }
      });
      fig.addEventListener("keydown", (e) => { if (e.key === "Escape" && fig.classList.contains("full")) { fig.classList.remove("full"); document.body.classList.remove("noscroll"); } });
    });
  }

  /* ---------- Trang ---------- */
  const routes = {};
  function go() {
    const h = location.hash.replace(/^#\/?/, "");
    const [r, a, b] = h.split("/");
    $$("#nav a").forEach((x) => x.classList.toggle("on", x.dataset.r === (r || "")));
    document.body.classList.remove("noscroll");
    (routes[r || ""] || routes[""])(a, b);
    mountViewers(app);
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", go);

  /* Tổng quan */
  routes[""] = () => {
    const nL = Object.keys(S.learned).length, nC = Object.keys(S.cases).length;
    let dr = 0, dt = 0; for (const k in S.drill) { dr += S.drill[k][0]; dt += S.drill[k][1]; }
    const due = dueCards("all").length;
    const dayIdx = Math.floor(Date.now() / 86400000);
    const pod = PL[dayIdx % PL.length];
    const nextL = LESSONS.find((l) => !S.learned[l.id] && l.prio === "A") || LESSONS.find((l) => !S.learned[l.id]);
    const nextC = CASES.find((c) => !S.cases[c.id]);
    app.innerHTML = `
      <section class="hero">
        <div><h1>Đọc ECG trong cấp cứu</h1><p class="lead">${LESSONS.length} bài học theo Cuốn 2 · ${PL.length} mẫu ECG 12 chuyển đạo · ${CASES.length} ca lâm sàng · ${TOOLS.length} công cụ tính. Học → nhận diện → xử trí.</p>
        <div class="row"><a class="btn chinh" href="#/bai/${nextL ? nextL.id : "ECG-06"}">${nextL ? "Học tiếp: " + nextL.id : "Ôn lại bài"}</a><a class="btn" href="#/luyen">Luyện nhanh 10 ECG</a>${nextC ? `<a class="btn" href="#/ca/${nextC.id}">Ca tiếp theo</a>` : ""}</div></div>
        <div class="stats">
          <div><b>${nL}/${LESSONS.length}</b><span>bài đã học</span></div>
          <div><b>${nC}/${CASES.length}</b><span>ca đã làm</span></div>
          <div><b>${dt ? Math.round((dr / dt) * 100) + "%" : "—"}</b><span>đúng khi luyện (${dt} ECG)</span></div>
          <div><a href="#/the"><b>${due}</b></a><span>thẻ đến hạn</span></div>
        </div>
      </section>
      <section class="card quet">
        <h2>Quét nhanh 30 giây — mọi ECG ở phòng cấp cứu</h2>
        <ol class="quet-l">
          <li><b>Cần sốc điện / tạo nhịp ngay?</b><span>VF, VT, nhịp nhanh hoặc chậm kèm dấu hiệu nguy hiểm</span></li>
          <li><b>Có OMI / STEMI hay tương đương?</b><span>ST chênh lên + soi gương, de Winter, thành sau, LBBB + Sgarbossa, aVR + ST chênh xuống lan toả, T tối cấp</span></li>
          <li><b>Tăng kali / ngộ độc đe doạ tính mạng?</b><span>T nhọn, QRS rộng, mất P; QRS rộng + R tận cùng aVR</span></li>
        </ol>
        <a href="#/bai/ECG-06">Phương pháp đọc 9 bước →</a>
      </section>
      <section>
        <div class="row between"><h2>ECG hôm nay</h2><a href="#/atlas/${pod.id}">Mở trong Atlas →</a></div>
        <details class="card"><summary>Tự đọc trước, rồi bấm để xem đáp án</summary><p><b>${esc(pod.name)}</b></p><ul>${pod.findings.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></details>
        ${viewerHTML({ pattern: pod.id, hideName: true, seed: dayIdx % 97 })}
      </section>
      <section class="grid g3 feat">
        <a class="card f" href="#/bai"><h3>Bài học</h3><p>47 bài từ kênh ion đến tình huống lâm sàng, mỗi bài có ECG minh hoạ, tiêu chuẩn, bẫy, thẻ ôn.</p></a>
        <a class="card f" href="#/atlas"><h3>Atlas ECG</h3><p>Tất cả mẫu ECG theo nhóm, thước đo trên giấy, phóng to, dải nhịp dài.</p></a>
        <a class="card f" href="#/ca"><h3>Ca lâm sàng</h3><p>Bệnh cảnh cấp cứu, trả lời từng bước: nhận diện → chẩn đoán → xử trí.</p></a>
        <a class="card f" href="#/luyen"><h3>Luyện nhanh</h3><p>Nhận diện ECG có tính giờ, theo dõi mẫu hay sai.</p></a>
        <a class="card f" href="#/the"><h3>Thẻ ôn</h3><p>Ôn giãn cách các tiêu chuẩn, ngưỡng, liều thuốc cần thuộc.</p></a>
        <a class="card f" href="#/cong-cu"><h3>Công cụ</h3><p>QTc, trục, Sgarbossa, tắc LAD vs tái cực sớm, LVH, thuật toán VT.</p></a>
      </section>
      <p class="muted small nguon">Nội dung biên soạn theo các tiêu chuẩn kinh điển (Goldberger, Hampton, Chou…) và thư viện ECG của <a href="https://litfl.com/ecg-library/" target="_blank" rel="noopener">LITFL</a>; mỗi bài có liên kết tra cứu LITFL. ECG trong ứng dụng là <b>ECG mô phỏng</b> để luyện nhận diện, không phải ECG bệnh nhân thật. Liều thuốc và phác đồ cần đối chiếu hướng dẫn hiện hành tại cơ sở.</p>`;
  };

  /* Danh sách bài */
  routes.bai = (id) => {
    if (id) return lessonView(id);
    const q = (sessionStorage.getItem("ecg-q") || "");
    const onlyA = sessionStorage.getItem("ecg-a") === "1";
    let h = `<div class="row between"><h1>Bài học</h1><span class="muted">${Object.keys(S.learned).length}/${LESSONS.length} đã học</span></div>
      <div class="row filt"><input type="search" id="q" placeholder="Tìm bài: WPW, tăng kali, Sgarbossa…" value="${esc(q)}"><label class="chip"><input type="checkbox" id="onlyA" ${onlyA ? "checked" : ""}> Chỉ ưu tiên A (cấp cứu)</label></div><div id="ls"></div>`;
    app.innerHTML = h;
    const draw = () => {
      const qq = $("#q").value.trim().toLowerCase(), oa = $("#onlyA").checked;
      try { sessionStorage.setItem("ecg-q", qq); sessionStorage.setItem("ecg-a", oa ? "1" : ""); } catch (e) { /* */ }
      let out = "";
      for (const p of Object.keys(PARTS)) {
        const ls = LESSONS.filter((l) => String(l.part) === p && (!oa || l.prio === "A") && (!qq || (l.id + " " + l.title + " " + l.tom + " " + l.md).toLowerCase().includes(qq)));
        if (!ls.length) continue;
        out += `<h2 class="part">Phần ${["", "I", "II", "III", "IV", "V", "VI", "VII"][p]}. ${PARTS[p]}</h2><div class="lessons">` + ls.map((l) => `
          <a class="lrow${S.learned[l.id] ? " done" : ""}" href="#/bai/${l.id}"><span class="lid">${l.id}</span><span class="lt"><b>${esc(l.title)}</b><span class="muted small">${esc(l.tom)}</span></span><span class="prio p${l.prio}" title="Ưu tiên ${l.prio}">${l.prio}</span><span class="ck" aria-label="${S.learned[l.id] ? "Đã học" : "Chưa học"}">${S.learned[l.id] ? "✓" : ""}</span></a>`).join("") + "</div>";
      }
      $("#ls").innerHTML = out || '<p class="muted">Không có bài phù hợp.</p>';
    };
    $("#q").oninput = draw; $("#onlyA").onchange = draw; draw();
  };

  function lessonView(id) {
    const l = LBY[id];
    if (!l) { app.innerHTML = '<p>Không tìm thấy bài.</p>'; return; }
    const i = LESSONS.indexOf(l), prev = LESSONS[i - 1], next = LESSONS[i + 1];
    const cases = CASES.filter((c) => c.lesson === id);
    const pats = PL.filter((p) => p.lesson === id);
    app.innerHTML = `<div class="crumb"><a href="#/bai">Bài học</a> › Phần ${["", "I", "II", "III", "IV", "V", "VI", "VII"][l.part]}. ${PARTS[l.part]}</div>
      <article class="lesson">
        <header><div class="row"><span class="lid big">${l.id}</span><span class="prio p${l.prio}">Ưu tiên ${l.prio}</span></div><h1>${esc(l.title)}</h1><p class="lead">${esc(l.tom)}</p></header>
        <div class="prose">${md(l.md)}</div>
        ${l.cards.length ? `<section class="card"><h2>Tự kiểm tra nhanh</h2>${l.cards.map((c) => `<details class="qa"><summary>${esc(c[0])}</summary><p>${esc(c[1])}</p></details>`).join("")}</section>` : ""}
        ${cases.length || pats.length ? `<section class="card"><h2>Thực hành liên quan</h2><div class="row">${cases.map((c) => `<a class="btn" href="#/ca/${c.id}">Ca: ${esc(c.title)}</a>`).join("")}${pats.map((p) => `<a class="btn ghost" href="#/atlas/${p.id}">Atlas: ${esc(p.name)}</a>`).join("")}</div></section>` : ""}
        <section class="card"><h2>Đọc thêm trên LITFL</h2><div class="row">${l.litfl.map((t) => `<a class="btn ghost" target="_blank" rel="noopener" href="${litfl(t)}">${esc(t)} ↗</a>`).join("")}</div><p class="muted small">Liên kết mở trang tìm kiếm LITFL theo từ khoá (ECG Library, Life in the Fast Lane).</p></section>
        <div class="row between foot">
          ${prev ? `<a class="btn ghost" href="#/bai/${prev.id}">← ${prev.id}</a>` : "<span></span>"}
          <button class="btn ${S.learned[id] ? "" : "chinh"}" id="learn">${S.learned[id] ? "✓ Đã học (bấm để bỏ)" : "Đánh dấu đã học"}</button>
          ${next ? `<a class="btn ghost" href="#/bai/${next.id}">${next.id} →</a>` : "<span></span>"}
        </div>
      </article>`;
    $("#learn").onclick = () => {
      if (S.learned[id]) delete S.learned[id]; else { S.learned[id] = today(); logAct("learn"); }
      save(); lessonView(id); mountViewers(app);
    };
  }

  /* Atlas */
  routes.atlas = (id) => {
    if (id && P[id]) {
      const p = P[id];
      const seed = 3;
      const cs = CASES.filter((c) => c.ecg === id);
      app.innerHTML = `<div class="crumb"><a href="#/atlas">Atlas</a> › ${esc(p.group)}</div>
        <div class="row between"><h1>${esc(p.name)}</h1><a class="btn ghost" href="#/bai/${p.lesson}">Bài ${p.lesson} →</a></div>
        <div id="vw">${viewerHTML({ pattern: id, hideName: true, seed })}</div>
        <div class="grid g2">
          <section class="card"><h2>Dấu hiệu chính</h2><label class="chip"><input type="checkbox" id="hide"> Che đáp án để tự đọc</label><ul id="fd">${p.findings.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></section>
          <section class="card"><h2>Gợi ý luyện</h2><ol><li>Đọc theo 9 bước trước khi xem dấu hiệu.</li><li>Bật <b>Thước đo</b>: đo PR, QRS, QT; tính tần số từ RR.</li><li>Chuyển sang <b>DII</b> hoặc <b>DII+V1</b> để xem nhịp trên dải 10 giây.</li><li>Bấm <b>Ghi lại</b> để có bản ghi khác (nhiễu, nhịp thay đổi nhẹ).</li></ol>
            <div class="row"><button class="btn" id="regen">Ghi lại ECG</button>${cs.map((c) => `<a class="btn ghost" href="#/ca/${c.id}">Ca lâm sàng</a>`).join("")}</div></section>
        </div>`;
      let sd = seed;
      $("#regen").onclick = () => { sd += 17; $("#vw").innerHTML = viewerHTML({ pattern: id, hideName: true, seed: sd }); mountViewers(app); };
      $("#hide").onchange = (e) => $("#fd").classList.toggle("blur", e.target.checked);
      return;
    }
    const groups = [];
    PL.forEach((p) => { if (!groups.includes(p.group)) groups.push(p.group); });
    const g0 = sessionStorage.getItem("ecg-g") || "";
    app.innerHTML = `<div class="row between"><h1>Atlas ECG</h1><span class="muted">${PL.length} mẫu</span></div>
      <div class="row filt"><input type="search" id="q" placeholder="Tìm: rung nhĩ, Brugada, tăng kali…"><div class="seg wrap" id="gs"><button data-g="" class="${g0 ? "" : "on"}">Tất cả</button>${groups.map((g) => `<button data-g="${esc(g)}" class="${g === g0 ? "on" : ""}">${esc(g)}</button>`).join("")}</div></div>
      <div class="atlas" id="at"></div>`;
    let g = g0;
    const draw = () => {
      const q = $("#q").value.trim().toLowerCase();
      const ls = PL.filter((p) => (!g || p.group === g) && (!q || (p.name + " " + p.findings.join(" ")).toLowerCase().includes(q)));
      $("#at").innerHTML = ls.map((p) => `<a class="acard" href="#/atlas/${p.id}"><div class="thumb" data-p="${p.id}"></div><b>${esc(p.name)}</b><span class="muted small">${esc(p.group)} · ${p.lesson}</span></a>`).join("") || '<p class="muted">Không có mẫu phù hợp.</p>';
      thumbs();
    };
    $("#q").oninput = draw;
    $("#gs").onclick = (e) => { const b = e.target.closest("button"); if (!b) return; g = b.dataset.g; try { sessionStorage.setItem("ecg-g", g); } catch (x) { /* */ } $$("#gs button").forEach((x) => x.classList.toggle("on", x === b)); draw(); };
    draw();
  };
  const thumbCache = {};
  function thumbs() {
    const els = $$(".thumb[data-p]");
    const io = "IntersectionObserver" in window ? new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { fill(en.target); io.unobserve(en.target); } }), { rootMargin: "200px" }) : null;
    function fill(el) {
      const id = el.dataset.p;
      if (!thumbCache[id]) {
        const cfg = P[id].cfg(3); cfg.dur = 4;
        const d = ECG.generate(cfg);
        thumbCache[id] = ECG.render(d, { layout: "strip", leads: [thumbLead(id)], rowH: 26 });
      }
      el.innerHTML = thumbCache[id];
    }
    els.forEach((el) => (io ? io.observe(el) : fill(el)));
  }
  function thumbLead(id) {
    const m = { stemi_ant: "V3", dewinter: "V3", wellens_a: "V2", wellens_b: "V3", hyperacute: "V3", lv_aneur: "V2", stemi_inf: "III", stemi_lat: "aVL", stemi_post: "V2", nste: "V5", avr_std: "aVR", old_inf: "III", rbbb: "V1", lbbb: "V1", lbbb_ami: "V5", lvh: "V5", rvh: "V1", brugada: "V1", arvc: "V1", lafb: "aVL", lpfb: "III", pericarditis: "II", pe: "V2", hcm: "aVL", tca: "aVR", wpw: "V3", lae: "II", rae: "II", hypothermia: "V4", hyperk: "V3", hyperk_sev: "V3", hypok: "V2", cerebral_t: "V4", ber: "V4" };
    return m[id] || "II";
  }

  /* Ca lâm sàng */
  routes.ca = (id) => {
    if (id) return caseView(id);
    const tags = []; CASES.forEach((c) => c.tags.forEach((t) => { if (!tags.includes(t)) tags.push(t); }));
    app.innerHTML = `<div class="row between"><h1>Ca lâm sàng</h1><span class="muted">${Object.keys(S.cases).length}/${CASES.length} đã làm</span></div>
      <div class="seg wrap" id="tg"><button data-t="" class="on">Tất cả</button>${tags.map((t) => `<button data-t="${esc(t)}">${esc(t)}</button>`).join("")}</div>
      <div class="cases" id="cl"></div>`;
    const draw = (t) => {
      $("#cl").innerHTML = CASES.filter((c) => !t || c.tags.includes(t)).map((c, i) => {
        const r = S.cases[c.id];
        return `<a class="case-card${r ? " done" : ""}" href="#/ca/${c.id}"><span class="cn">${String(CASES.indexOf(c) + 1).padStart(2, "0")}</span><span><b>${esc(c.title)}</b><span class="muted small">${esc(c.vignette.slice(0, 110))}…</span><span class="tags">${c.tags.map((x) => `<i>${esc(x)}</i>`).join("")}<i class="lv">${"●".repeat(c.level)}${"○".repeat(3 - c.level)}</i></span></span><span class="sc">${r ? r.score + "/" + r.total : ""}</span></a>`;
      }).join("");
    };
    $("#tg").onclick = (e) => { const b = e.target.closest("button"); if (!b) return; $$("#tg button").forEach((x) => x.classList.toggle("on", x === b)); draw(b.dataset.t); };
    draw("");
  };
  function caseView(id) {
    const c = CASES.find((x) => x.id === id);
    if (!c) { app.innerHTML = "<p>Không tìm thấy ca.</p>"; return; }
    const i = CASES.indexOf(c), next = CASES[i + 1];
    app.innerHTML = `<div class="crumb"><a href="#/ca">Ca lâm sàng</a> › Ca ${i + 1}</div>
      <h1>${esc(c.title)}</h1>
      <div class="card vignette"><b>Bệnh cảnh.</b> ${esc(c.vignette)}</div>
      ${viewerHTML({ pattern: c.ecg, hideName: true, seed: c.seed })}
      <details class="card tip"><summary>Gợi ý: đọc theo 9 bước trước khi trả lời</summary><ol><li>Kỹ thuật · tần số · nhịp (P? đều? QRS hẹp/rộng?)</li><li>Trục · P/PR · QRS (rộng? Q? delta?)</li><li>ST · T/U · QT</li></ol></details>
      <div id="qs"></div>`;
    let k = 0, score = 0;
    const qs = $("#qs");
    const step = () => {
      const q = c.qs[k];
      const div = document.createElement("section");
      div.className = "card q";
      div.innerHTML = `<div class="qh">Câu ${k + 1}/${c.qs.length}</div><h3>${esc(q.q)}</h3><div class="opts">${q.o.map((o, j) => `<button class="opt" data-j="${j}"><span class="ol">${"ABCD"[j]}</span>${esc(o)}</button>`).join("")}</div><div class="why" hidden></div>`;
      qs.appendChild(div);
      div.querySelector(".opts").onclick = (e) => {
        const b = e.target.closest(".opt"); if (!b || div.dataset.done) return;
        div.dataset.done = "1";
        const j = +b.dataset.j, ok = j === q.a;
        if (ok) score++;
        $$(".opt", div).forEach((x) => { x.disabled = true; if (+x.dataset.j === q.a) x.classList.add("right"); });
        if (!ok) b.classList.add("wrong");
        const w = $(".why", div); w.hidden = false; w.innerHTML = `<b>${ok ? "Đúng." : "Chưa đúng."}</b> ${esc(q.why)}`;
        k++;
        if (k < c.qs.length) { const nb = document.createElement("button"); nb.className = "btn chinh"; nb.textContent = "Câu tiếp →"; nb.onclick = () => { nb.remove(); step(); }; w.appendChild(document.createElement("div")).appendChild(nb); }
        else finish();
      };
      div.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };
    const finish = () => {
      S.cases[c.id] = { score, total: c.qs.length, date: today() }; logAct("case"); save();
      const p = P[c.ecg];
      const end = document.createElement("section");
      end.className = "card xanh end";
      end.innerHTML = `<h2>Kết luận · ${score}/${c.qs.length} đúng</h2><p><b>${esc(p.name)}.</b> ${esc(c.take)}</p><h4>Dấu hiệu trên ECG này</h4><ul>${p.findings.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        <div class="row"><a class="btn" href="#/bai/${c.lesson}">Ôn bài ${c.lesson}</a><a class="btn ghost" href="#/atlas/${c.ecg}">Mở trong Atlas</a>${next ? `<a class="btn chinh" href="#/ca/${next.id}">Ca tiếp →</a>` : `<a class="btn chinh" href="#/ca">Về danh sách</a>`}</div>`;
      qs.appendChild(end);
      end.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };
    step();
  }

  /* Luyện nhanh */
  routes.luyen = () => {
    const groups = []; PL.forEach((p) => { if (!groups.includes(p.group)) groups.push(p.group); });
    const weak = Object.entries(S.drill).filter(([k, v]) => P[k] && v[1] >= 2 && v[0] / v[1] < 0.67).sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1]).slice(0, 8);
    app.innerHTML = `<h1>Luyện nhanh</h1><p class="lead">Nhận diện ECG trong thời gian giới hạn — như khi được đưa ECG giữa ca trực.</p>
      <div class="grid g2">
        <section class="card"><h2>Thiết lập</h2>
          <label class="fld"><span>Nhóm</span><select id="g"><option value="">Tất cả nhóm</option><option value="__cc">Ưu tiên cấp cứu (nhịp, OMI, điện giải, ngộ độc)</option>${groups.map((g) => `<option>${esc(g)}</option>`).join("")}${weak.length ? '<option value="__weak">Các mẫu tôi hay sai</option>' : ""}</select></label>
          <label class="fld"><span>Số ECG</span><select id="n"><option>10</option><option>5</option><option>20</option></select></label>
          <label class="fld"><span>Thời gian mỗi ECG</span><select id="t"><option value="60">60 giây</option><option value="30">30 giây</option><option value="0">Không giới hạn</option></select></label>
          <button class="btn chinh" id="start">Bắt đầu</button></section>
        <section class="card"><h2>Mẫu hay sai</h2>${weak.length ? `<ul>${weak.map(([k, v]) => `<li><a href="#/atlas/${k}">${esc(P[k].name)}</a> — ${v[0]}/${v[1]}</li>`).join("")}</ul>` : '<p class="muted">Chưa có dữ liệu. Luyện vài lượt để ứng dụng tìm ra điểm yếu.</p>'}</section>
      </div>`;
    $("#start").onclick = () => {
      const g = $("#g").value, n = +$("#n").value, t = +$("#t").value;
      const CC = ["Nhịp nhanh", "Nhịp chậm & block", "Ngừng tuần hoàn", "Thiếu máu & nhồi máu", "Điện giải & ngộ độc"];
      let pool = PL.filter((p) => !g || (g === "__cc" ? CC.includes(p.group) : g === "__weak" ? weak.some((w) => w[0] === p.id) : p.group === g));
      if (pool.length < 2) pool = PL.slice();
      const qs = [];
      for (let i = 0; i < n; i++) qs.push(pool[Math.floor(Math.random() * pool.length)]);
      drill(qs, t);
    };
  };
  function drill(qs, limit) {
    let i = 0, right = 0, timer = null;
    const res = [];
    const show = () => {
      clearInterval(timer);
      if (i >= qs.length) return summary();
      const p = qs[i];
      const same = PL.filter((x) => x.id !== p.id && x.group === p.group);
      const other = PL.filter((x) => x.id !== p.id && x.group !== p.group);
      const shuffle = (a) => a.map((x) => [Math.random(), x]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
      const opts = shuffle([p].concat(shuffle(same).slice(0, 2), shuffle(other)).slice(0, 4));
      while (opts.length < 4) { const x = other[Math.floor(Math.random() * other.length)]; if (!opts.includes(x)) opts.push(x); }
      const fin = shuffle(opts);
      app.innerHTML = `<div class="row between"><h1>ECG ${i + 1}/${qs.length}</h1><span class="timer" id="tm"></span></div>
        ${viewerHTML({ pattern: p.id, hideName: true, seed: Math.floor(Math.random() * 9999) })}
        <section class="card q"><h3>Chẩn đoán phù hợp nhất?</h3><div class="opts">${fin.map((o, j) => `<button class="opt" data-id="${o.id}"><span class="ol">${"ABCD"[j]}</span>${esc(o.name)}</button>`).join("")}</div><div class="why" hidden></div></section>`;
      mountViewers(app);
      let left = limit;
      const tm = $("#tm");
      const tick = () => { if (!limit) { tm.textContent = ""; return; } tm.textContent = left + " s"; tm.classList.toggle("low", left <= 10); if (left-- <= 0) answer(null); };
      if (limit) { tick(); timer = setInterval(tick, 1000); }
      const answer = (pick) => {
        clearInterval(timer);
        const box = $(".q"); if (box.dataset.done) return; box.dataset.done = "1";
        const ok = pick === p.id; if (ok) right++;
        S.drill[p.id] = S.drill[p.id] || [0, 0]; S.drill[p.id][1]++; if (ok) S.drill[p.id][0]++; logAct("drill"); save();
        res.push([p, ok, pick]);
        $$(".opt", box).forEach((x) => { x.disabled = true; if (x.dataset.id === p.id) x.classList.add("right"); else if (x.dataset.id === pick) x.classList.add("wrong"); });
        const w = $(".why", box); w.hidden = false;
        w.innerHTML = `<b>${ok ? "Đúng" : pick ? "Chưa đúng" : "Hết giờ"} — ${esc(p.name)}.</b><ul>${p.findings.map((x) => `<li>${esc(x)}</li>`).join("")}</ul><div class="row"><button class="btn chinh" id="nx">${i + 1 < qs.length ? "ECG tiếp →" : "Xem kết quả"}</button><a class="btn ghost" href="#/bai/${p.lesson}" target="_blank">Bài ${p.lesson}</a></div>`;
        $("#nx").onclick = () => { i++; show(); };
        $("#nx").focus();
      };
      $(".opts").onclick = (e) => { const b = e.target.closest(".opt"); if (b) answer(b.dataset.id); };
    };
    const summary = () => {
      app.innerHTML = `<h1>Kết quả: ${right}/${qs.length}</h1><div class="bar"><span style="width:${Math.round((right / qs.length) * 100)}%"></span></div>
        <section class="card"><ul class="res">${res.map(([p, ok]) => `<li class="${ok ? "ok" : "no"}">${ok ? "✓" : "✗"} <a href="#/atlas/${p.id}">${esc(p.name)}</a></li>`).join("")}</ul></section>
        <div class="row"><a class="btn chinh" href="#/luyen">Luyện lượt mới</a><a class="btn" href="#/">Về tổng quan</a></div>`;
    };
    show();
  }

  /* Thẻ ôn (ôn giãn cách kiểu SM-2 rút gọn) */
  function allCards(scope) {
    const out = [];
    LESSONS.forEach((l) => { if (scope === "learned" && !S.learned[l.id]) return; l.cards.forEach((c, i) => out.push({ key: l.id + "#" + i, l, q: c[0], a: c[1] })); });
    return out;
  }
  function dueCards(scope) {
    const t = today();
    return allCards(scope).filter((c) => S.cards[c.key] && S.cards[c.key].due <= t);
  }
  routes.the = () => {
    const hasL = Object.keys(S.learned).length > 0;
    let scope = sessionStorage.getItem("ecg-sc") || (hasL ? "learned" : "all");
    const build = () => {
      const due = dueCards(scope);
      const fresh = allCards(scope).filter((c) => !S.cards[c.key]);
      const newToday = (S.log[today()] || {}).newcard || 0;
      const nNew = Math.max(0, 15 - newToday);
      return due.concat(fresh.slice(0, nNew));
    };
    let q = build();
    const head = () => `<div class="row between"><h1>Thẻ ôn</h1><select id="sc" aria-label="Phạm vi"><option value="learned" ${scope === "learned" ? "selected" : ""}>Bài đã học</option><option value="all" ${scope === "all" ? "selected" : ""}>Tất cả bài</option></select></div>`;
    const draw = () => {
      if (!q.length) {
        app.innerHTML = head() + `<section class="card"><h2>Không còn thẻ cần ôn hôm nay</h2><p class="muted">${scope === "learned" && !hasL ? "Chưa có bài nào được đánh dấu đã học — chọn “Tất cả bài” hoặc học một bài trước." : "Quay lại vào ngày mai. Thẻ mới tối đa 15/ngày."}</p><div class="row"><a class="btn" href="#/luyen">Luyện nhanh ECG</a><a class="btn ghost" href="#/bai">Bài học</a></div></section>`;
      } else {
        const c = q[0];
        app.innerHTML = head() + `<p class="muted">${q.length} thẻ trong lượt này · Phím: Space lật thẻ, 1–4 chấm</p>
          <section class="flash" id="fc" tabindex="0"><div class="fsrc"><a href="#/bai/${c.l.id}">${c.l.id}</a> · ${esc(c.l.title)}</div><div class="fq">${esc(c.q)}</div><div class="fa" hidden>${esc(c.a)}</div>
            <div class="row center"><button class="btn chinh" id="flip">Xem đáp án</button></div>
            <div class="row center grade" hidden><button class="btn nguy-b" data-g="0">1 · Quên</button><button class="btn" data-g="1">2 · Khó</button><button class="btn" data-g="2">3 · Nhớ</button><button class="btn" data-g="3">4 · Dễ</button></div></section>`;
        const flip = () => { $(".fa").hidden = false; $("#flip").parentNode.hidden = true; $(".grade").hidden = false; };
        $("#flip").onclick = flip;
        $(".grade").onclick = (e) => { const b = e.target.closest("button"); if (b) grade(+b.dataset.g); };
        $("#fc").focus();
      }
      $("#sc").onchange = (e) => { scope = e.target.value; try { sessionStorage.setItem("ecg-sc", scope); } catch (x) { /* */ } q = build(); draw(); };
    };
    const grade = (g) => {
      const c = q.shift();
      const old = S.cards[c.key];
      if (!old) logAct("newcard");
      const s = old || { ef: 2.5, int: 0, reps: 0 };
      if (g === 0) { s.reps = 0; s.int = 0; q.push(c); }
      else {
        s.reps++;
        s.int = s.reps === 1 ? (g === 3 ? 3 : 1) : s.reps === 2 ? (g === 1 ? 3 : 6) : Math.round(s.int * s.ef * (g === 1 ? 0.6 : g === 3 ? 1.3 : 1));
        s.ef = Math.max(1.3, s.ef + (g === 3 ? 0.15 : g === 1 ? -0.15 : 0));
      }
      s.due = addDays(s.int);
      S.cards[c.key] = s; logAct("card"); save();
      draw();
    };
    document.onkeydown = (e) => {
      if (!location.hash.startsWith("#/the") || /INPUT|SELECT|TEXTAREA/.test((e.target || {}).tagName)) return;
      if (e.code === "Space" && $("#flip") && $(".fa").hidden) { e.preventDefault(); $("#flip").click(); }
      else if (/^[1-4]$/.test(e.key) && $(".grade") && !$(".grade").hidden) grade(+e.key - 1);
    };
    draw();
  };

  /* Công cụ */
  routes["cong-cu"] = (id) => {
    const t = TOOLS.find((x) => x.id === id) || TOOLS[0];
    app.innerHTML = `<h1>Công cụ</h1><div class="tools"><nav class="tnav">${TOOLS.map((x) => `<a href="#/cong-cu/${x.id}" class="${x === t ? "on" : ""}"><b>${esc(x.name)}</b><span class="muted small">${esc(x.desc)}</span></a>`).join("")}</nav>
      <section class="card tool" id="tool"><h2>${esc(t.name)}</h2><p class="muted">${esc(t.desc)}</p>${t.html}</section></div>`;
    t.bind($("#tool"));
  };

  /* Hướng dẫn */
  routes["huong-dan"] = () => {
    app.innerHTML = `<article class="lesson"><h1>Hướng dẫn sử dụng</h1><div class="prose">${md(`
## Lộ trình gợi ý (6–8 tuần)
1. **Tuần 1–2**: Phần I (nền tảng) — đặc biệt ECG-05, ECG-06. Mỗi bài xong bấm **Đánh dấu đã học**.
2. **Tuần 3–5**: các bài **ưu tiên A** của Phần III–VI (block, STEMI/OMI, nhịp nhanh, điện giải, ngộ độc).
3. **Tuần 6–8**: Phần VII + toàn bộ **Ca lâm sàng**; **Luyện nhanh** mỗi ngày 10 ECG.
4. Hằng ngày: **Thẻ ôn** các thẻ đến hạn (5–10 phút).

## Trình xem ECG
- **12 CĐ**: bố cục chuẩn 3×4 + dải nhịp DII. **DII** / **DII+V1**: dải 10 giây để phân tích nhịp.
- **Thước đo**: bật lên rồi bấm 2 điểm trên giấy → hiện thời gian (ms), số ô nhỏ, tần số (nếu là khoảng RR) và chênh lệch biên độ (mm).
- **+ / −**: phóng to, kéo ngang để xem. **Toàn màn hình**: xem trên điện thoại (nên xoay ngang).
- Giấy chuẩn 25 mm/s, 10 mm/mV — 1 ô nhỏ = 40 ms = 0,1 mV.

## Dữ liệu
- Tiến độ lưu trong trình duyệt của máy này. Nút **Sao lưu** ở cuối trang tải về tệp JSON; **Khôi phục** để chuyển sang máy khác.

## Về nội dung
- Bài học theo mục lục Cuốn 2 *Điện tâm đồ từ nguyên lý đến lâm sàng* của dự án ĐCCK; tiêu chuẩn chẩn đoán theo các nguồn kinh điển và thư viện ECG LITFL (mỗi bài có liên kết tra cứu).
- ECG trong ứng dụng được **mô phỏng bằng máy tính** từ tiêu chuẩn hình thái — đủ để luyện nhận diện, nhưng ECG thật có nhiều biến thể hơn. Hãy luyện thêm trên ECG thật.
- Liều thuốc/phác đồ chỉ mang tính tóm tắt; luôn đối chiếu hướng dẫn hiện hành.
`)}</div>
    <section class="card"><h2>Sao lưu tiến độ</h2><div class="row"><button class="btn" id="bk">Tải bản sao lưu</button><label class="btn ghost">Khôi phục từ tệp<input type="file" id="rs" accept="application/json" hidden></label><button class="btn nguy-b" id="rst">Xoá toàn bộ tiến độ</button></div></section></article>`;
    $("#bk").onclick = () => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 1)], { type: "application/json" })); a.download = "ecg-cap-cuu-tien-do-" + today() + ".json"; a.click(); };
    $("#rs").onchange = (e) => { const f = e.target.files[0]; if (!f) return; f.text().then((t) => { try { const o = JSON.parse(t); if (!o || typeof o !== "object" || !o.learned) throw 0; S = Object.assign({ learned: {}, cases: {}, drill: {}, cards: {}, log: {} }, o); save(); alert("Đã khôi phục tiến độ."); go(); } catch (x) { alert("Tệp không hợp lệ."); } }); };
    $("#rst").onclick = () => { if (confirm("Xoá toàn bộ tiến độ học trên máy này?")) { S = { learned: {}, cases: {}, drill: {}, cards: {}, log: {} }; save(); go(); } };
  };

  go();
})();

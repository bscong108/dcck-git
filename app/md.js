/* Bộ hiển thị Markdown tối giản, đủ cho văn bản bài ĐCCK: tiêu đề, đoạn, danh sách lồng,
   bảng, khối mã, trích dẫn, in đậm/nghiêng, ký hiệu nguồn [..] và liên kết chéo [→ YC-03]. */
(function (root) {
  "use strict";

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  const MA_BAI = /\[→\s*([A-Z]{2,4}-\d{2,3})\]/g;

  function inline(text) {
    const giu = [];
    const dat = (html) => "\u0000" + (giu.push(html) - 1) + "\u0000";
    let s = esc(text);
    s = s.replace(/`([^`]+)`/g, (_, c) => dat("<code>" + c + "</code>"));
    s = s.replace(MA_BAI, (_, ma) => dat('<a class="xref" href="#/bai/' + ma + '">→ ' + ma + "</a>"));
    s = s.replace(/\[([^\[\]]+)\]\((https?:[^)\s]+)\)/g, (_, t, u) => dat('<a href="' + u + '" target="_blank" rel="noopener">' + t + "</a>"));
    s = s.replace(/https?:\/\/[^\s<)]+/g, (u) => dat('<a href="' + u + '" target="_blank" rel="noopener">' + u + "</a>"));
    s = s.replace(/\[([^\[\]\u0000]{2,160})\]/g, (_, n) => {
      const suy = /^suy luận/i.test(n.trim());
      return dat('<span class="src' + (suy ? " suy" : "") + '">[' + n + "]</span>");
    });
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, "$1<em>$2</em>");
    s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => giu[+i]);
    s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => giu[+i]);
    return s;
  }

  const RE_LIST = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
  const RE_HEAD = /^(#{1,6})\s+(.*?)\s*#*\s*$/;

  function laBatDauKhoi(line, next) {
    return RE_HEAD.test(line) || /^```/.test(line) || /^>/.test(line) || RE_LIST.test(line) ||
      (/^\s*\|/.test(line) && next !== undefined && /^\s*\|?\s*:?-{2,}/.test(next)) || /^-{3,}\s*$/.test(line);
  }

  function slug(s) {
    return "h-" + s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
  }

  function tachO(line) {
    let s = line.trim();
    if (s.startsWith("|")) s = s.slice(1);
    if (s.endsWith("|")) s = s.slice(0, -1);
    return s.split("|").map((c) => c.trim());
  }

  function renderList(lines) {
    // lines: dòng của một khối danh sách; dựng cây theo thụt lề
    const items = [];
    for (const l of lines) {
      const m = l.match(RE_LIST);
      if (m) items.push({ indent: m[1].replace(/\t/g, "    ").length, ord: /\d/.test(m[2]), start: parseInt(m[2], 10), text: [m[3]] });
      else if (items.length) items[items.length - 1].text.push(l.trim());
    }
    let i = 0;
    function build(level) {
      const first = items[i];
      const tag = first.ord ? "ol" : "ul";
      let html = "<" + tag + (first.ord && first.start > 1 ? ' start="' + first.start + '"' : "") + ">";
      while (i < items.length && items[i].indent >= level) {
        const it = items[i];
        if (it.indent > level) { html += build(it.indent); continue; }
        i++;
        let inner = it.text.filter(Boolean).map(inline).join("<br>");
        if (i < items.length && items[i].indent > level) inner += build(items[i].indent);
        html += "<li>" + inner + "</li>";
      }
      return html + "</" + tag + ">";
    }
    let out = "";
    while (i < items.length) out += build(items[i].indent);
    return out;
  }

  /** Trả về {html, headings:[{level,text,id}]}; mỗi khối cấp cao có data-b để đánh dấu. */
  function render(md, opts) {
    opts = opts || {};
    const lines = md.replace(/\r\n?/g, "\n").split("\n");
    const out = [];
    const headings = [];
    let b = opts.startIndex || 0;
    let i = 0;
    const tag = (html) => out.push(html.replace(/^<(\w+)/, (m, t) => "<" + t + ' data-b="' + b++ + '"'));
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) { i++; continue; }
      let m;
      if (/^```/.test(line)) {
        const buf = [];
        i++;
        while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
        i++;
        tag("<pre><code>" + esc(buf.join("\n")) + "</code></pre>");
        continue;
      }
      if ((m = line.match(RE_HEAD))) {
        const lv = m[1].length, text = m[2];
        const id = slug(text);
        headings.push({ level: lv, text, id });
        out.push("<h" + lv + ' id="' + id + '">' + inline(text) + "</h" + lv + ">");
        i++;
        continue;
      }
      if (/^-{3,}\s*$/.test(line)) { out.push("<hr>"); i++; continue; }
      if (/^>/.test(line)) {
        const buf = [];
        while (i < lines.length && /^>/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ""));
        const dau = buf[0] || "";
        let cls = "";
        if (/^CHỐT LẠI/i.test(dau)) cls = "chot";
        else if (/^Đào sâu/i.test(dau)) cls = "dao-sau";
        else if (/^(Cảnh báo|Lưu ý|Nguy hiểm)/i.test(dau)) cls = "canh-bao";
        let tieuDe = "", than = buf;
        if (cls === "chot") { tieuDe = dau; than = buf.slice(1); }
        const inner = render(than.join("\n"), { noIndex: true }).html;
        tag('<blockquote class="' + cls + '">' + (tieuDe ? '<div class="bq-title">' + inline(tieuDe) + "</div>" : "") + '<div class="bq-body">' + inner + "</div></blockquote>");
        continue;
      }
      if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1])) {
        const head = tachO(line);
        i += 2;
        const rows = [];
        while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(tachO(lines[i++]));
        let h = '<div class="table-wrap"><table><thead><tr>' + head.map((c) => "<th>" + inline(c) + "</th>").join("") + "</tr></thead><tbody>";
        for (const r of rows) h += "<tr>" + r.map((c) => "<td>" + inline(c) + "</td>").join("") + "</tr>";
        tag(h + "</tbody></table></div>");
        continue;
      }
      if (RE_LIST.test(line)) {
        const buf = [];
        while (i < lines.length) {
          const l = lines[i];
          if (RE_LIST.test(l) || (l.trim() && /^\s+/.test(l) && buf.length)) { buf.push(l); i++; continue; }
          // dòng trống giữa hai mục cùng kiểu danh sách: vẫn là một danh sách
          if (!l.trim() && buf.length && i + 1 < lines.length && RE_LIST.test(lines[i + 1]) &&
              /\d/.test(lines[i + 1].match(RE_LIST)[2]) === /\d/.test(buf[0].match(RE_LIST)[2])) { i++; continue; }
          break;
        }
        tag(renderList(buf));
        continue;
      }
      const buf = [line];
      i++;
      while (i < lines.length && lines[i].trim() && !laBatDauKhoi(lines[i], lines[i + 1])) buf.push(lines[i++]);
      tag("<p>" + buf.map(inline).join("<br>") + "</p>");
    }
    let html = out.join("\n");
    if (opts.noIndex) html = html.replace(/ data-b="\d+"/g, "");
    return { html, headings, nextIndex: b };
  }

  const api = { render, inline, esc, slug };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.DCCK = root.DCCK || {};
  root.DCCK.md = api;
})(typeof window !== "undefined" ? window : globalThis);

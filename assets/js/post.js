/* Write-up page: loads writeups/<slug>.md, renders it safely, and fills the header. */
(function () {
  "use strict";

  var S = window.SITE || {};
  var MR = window.MR;
  var el = MR.el, t = MR.t;

  function $(id) { return document.getElementById(id); }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); return node; }

  var slug = null;
  try { slug = new URLSearchParams(window.location.search).get("slug"); } catch (e) {}

  /* Only slugs that exist in content.js are ever fetched. */
  var entry = null;
  if (slug && /^[a-z0-9-]{1,80}$/.test(slug)) {
    entry = (S.writeups || []).filter(function (w) { return w.slug === slug; })[0] || null;
  }

  var markdown = null;
  var failed = false;
  var hooked = false;

  function words(text) {
    return (text.replace(/```[\s\S]*?```/g, " ").match(/[\p{L}\p{N}]+/gu) || []).length;
  }

  function renderMarkdown(md) {
    var parse = window.marked && (window.marked.parse || (window.marked.marked && window.marked.marked.parse));
    var html = parse ? parse(md, { gfm: true }) : "";
    if (!window.DOMPurify) return "";
    if (!hooked) {
      hooked = true;
      window.DOMPurify.addHook("afterSanitizeAttributes", function (node) {
        if (node.tagName === "A" && /^https?:\/\//i.test(node.getAttribute("href") || "")) {
          node.setAttribute("target", "_blank");
          node.setAttribute("rel", "noopener noreferrer");
        }
        if (node.tagName === "PRE" || node.tagName === "CODE") node.setAttribute("dir", "ltr");
      });
    }
    return window.DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  }

  function renderHeader() {
    var head = clear($("article-head"));
    head.appendChild(el("a", { class: "back", href: "index.html#writeups", text: t("back") }));

    if (!entry) {
      document.title = t("nf_title");
      head.appendChild(el("h1", { class: "article-title", text: t("nf_title") }));
      head.appendChild(el("p", { class: "article-lede", text: t("nf_text") }));
      return;
    }

    document.title = entry.title + " — " + MR.pick(S.name);
    var desc = document.querySelector('meta[name="description"]');
    if (desc && entry.summary) desc.setAttribute("content", entry.summary);

    var block = el("div", { lang: entry.lang, dir: entry.lang === "ar" ? "rtl" : "ltr" });
    block.appendChild(el("h1", { class: "article-title", text: entry.title }));
    if (entry.summary) block.appendChild(el("p", { class: "article-lede", text: entry.summary }));
    head.appendChild(block);

    var meta = el("p", { class: "article-meta" });
    meta.appendChild(el("time", { datetime: entry.date, text: MR.formatDate(entry.date) }));
    if (markdown) {
      var minutes = Math.max(1, Math.round(words(markdown) / 200));
      var key = minutes === 1 ? "read_1" : minutes === 2 ? "read_2" : minutes <= 10 ? "read_few" : "read_many";
      meta.appendChild(el("span", { text: t(key).replace("{n}", MR.num(minutes)) }));
    }
    (entry.tags || []).forEach(function (tag) {
      meta.appendChild(el("span", { class: "tag", lang: entry.lang, text: tag }));
    });
    head.appendChild(meta);

    var other = entry.translation && (S.writeups || []).filter(function (w) { return w.slug === entry.translation; })[0];
    if (other) {
      head.appendChild(el("a", {
        class: "translation", lang: MR.lang(),
        href: "post.html?slug=" + encodeURIComponent(other.slug),
        text: t(other.lang === "ar" ? "read_ar" : "read_en")
      }));
    }
  }

  function renderBody() {
    var body = $("article-body");
    if (!entry) { body.hidden = true; return; }
    body.setAttribute("lang", entry.lang);
    body.setAttribute("dir", entry.lang === "ar" ? "rtl" : "ltr");
    if (failed) {
      clear(body).appendChild(el("p", { class: "notice", text: t("load_error") }));
      return;
    }
    if (markdown == null) {
      clear(body).appendChild(el("p", { class: "notice", text: t("loading") }));
      return;
    }
    body.innerHTML = renderMarkdown(markdown);
  }

  function render() { renderHeader(); renderBody(); }

  /* The page is shown once the article is in place, so the footer never jumps down. */
  function start() {
    render();
    MR.onLangChange(render);
    if (!entry) { MR.ready(); return; }
    fetch("writeups/" + entry.slug + ".md", { cache: "no-cache" })
      .then(function (res) {
        if (!res.ok) throw new Error(res.status);
        return res.text();
      })
      .then(function (text) { markdown = text; render(); MR.ready(); })
      .catch(function () { failed = true; render(); MR.ready(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();

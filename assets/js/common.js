/* Shared by every page: interface text, language and theme switches, small DOM helpers. */
(function () {
  "use strict";

  var root = document.documentElement;

  var UI = {
    en: {
      skip: "Skip to content",
      nav_focus: "Focus", nav_method: "Method", nav_writeups: "Write-ups", nav_contact: "Contact",
      lang_switch: "عربي", lang_switch_label: "اعرض الموقع بالعربية",
      theme_to_dark: "Switch to dark theme", theme_to_light: "Switch to light theme",

      h_focus: "What I test", h_method: "How I work", h_writeups: "Write-ups",
      h_recognition: "Recognition", h_contact: "Contact",

      writeups_note: "I publish findings only after a program approves disclosure. Until then, this is where my methodology notes live.",
      writeups_empty: "The first write-ups are on the way.",
      read_1: "{n} min read", read_2: "{n} min read", read_few: "{n} min read", read_many: "{n} min read",
      lang_en: "English", lang_ar: "Arabic",

      contact_email: "I report through bug bounty platforms and coordinated disclosure. For program invitations or questions about a finding, write to me.",
      contact_noemail: "I report through bug bounty platforms and coordinated disclosure. You can reach me through these profiles.",
      pgp: "PGP key",

      footer_rule: "Testing is done only within each program’s scope and rules, on accounts I own.",
      footer_built: "Plain HTML, CSS and JavaScript. No trackers.",

      m_label: "Example permission matrix: roles against actions",
      m_caption: "Every app has a table like this. My work is finding the cell that says the wrong thing.",
      m_replay: "Replay the scan", m_hint: "Select any cell to see its request.",
      m_as: "As", m_request: "Request", m_expected: "Expected", m_response: "Response",
      m_ok: "Matches the rule.", m_flaw: "Broken access control: a viewer can delete projects.",
      m_testing: "Testing", m_of: "of", m_finding: "Finding",
      m_checking: "Comparing each response with the rule…",
      allowed: "Allowed", denied: "Denied",
      role_admin: "Admin", role_editor: "Editor", role_viewer: "Viewer",
      act_view: "View", act_edit: "Edit", act_delete: "Delete", act_invite: "Invite",

      back: "All write-ups", read_ar: "Read in Arabic", read_en: "Read in English",
      nf_title: "Write-up not found", nf_text: "This write-up doesn’t exist or has moved.",
      load_error: "The write-up couldn’t be loaded. Refresh the page to try again.",
      loading: "Loading…",

      e404_title: "This page doesn’t exist, or your role can’t see it.",
      e404_home: "Go to the homepage"
    },
    ar: {
      skip: "انتقل إلى المحتوى",
      nav_focus: "المجالات", nav_method: "المنهجية", nav_writeups: "المقالات", nav_contact: "تواصل",
      lang_switch: "English", lang_switch_label: "View the site in English",
      theme_to_dark: "التبديل إلى الوضع الداكن", theme_to_light: "التبديل إلى الوضع الفاتح",

      h_focus: "ما أختبره", h_method: "كيف أعمل", h_writeups: "المقالات",
      h_recognition: "التقدير", h_contact: "تواصل",

      writeups_note: "لا أنشر أي ثغرة إلا بعد موافقة البرنامج على الإفصاح. حتى ذلك الحين، هنا أكتب عن منهجيتي.",
      writeups_empty: "أولى المقالات في الطريق.",
      read_1: "قراءة في دقيقة", read_2: "قراءة في دقيقتين", read_few: "قراءة في {n} دقائق", read_many: "قراءة في {n} دقيقة",
      lang_en: "إنجليزي", lang_ar: "عربي",

      contact_email: "أبلغ عن الثغرات عبر منصات مكافآت الثغرات والإفصاح المنسّق. لدعوات البرامج أو الأسئلة عن ثغرة، راسلني.",
      contact_noemail: "أبلغ عن الثغرات عبر منصات مكافآت الثغرات والإفصاح المنسّق. يمكنك التواصل معي عبر هذه الحسابات.",
      pgp: "مفتاح PGP",

      footer_rule: "أختبر فقط داخل نطاق كل برنامج وقواعده، وعلى حسابات أملكها.",
      footer_built: "HTML وCSS وJavaScript فقط. بدون أي تتبع.",

      m_label: "مثال لمصفوفة صلاحيات: الأدوار أمام الإجراءات",
      m_caption: "لكل تطبيق جدول كهذا. عملي أن أجد الخانة التي تقول الشيء الخطأ.",
      m_replay: "إعادة الفحص", m_hint: "اختر أي خانة لترى الطلب الخاص بها.",
      m_as: "بصلاحية", m_request: "الطلب", m_expected: "المتوقع", m_response: "الاستجابة",
      m_ok: "مطابق للقاعدة.", m_flaw: "خلل في التحكم بالوصول: المشاهد يستطيع حذف المشاريع.",
      m_testing: "جارٍ اختبار", m_of: "من", m_finding: "ثغرة",
      m_checking: "أقارن كل استجابة بالقاعدة…",
      allowed: "مسموح", denied: "ممنوع",
      role_admin: "مدير", role_editor: "محرر", role_viewer: "مشاهد",
      act_view: "عرض", act_edit: "تعديل", act_delete: "حذف", act_invite: "دعوة",

      back: "كل المقالات", read_ar: "اقرأ بالعربية", read_en: "اقرأ بالإنجليزية",
      nf_title: "المقال غير موجود", nf_text: "هذا المقال غير موجود أو تم نقله.",
      load_error: "تعذّر تحميل المقال. حدّث الصفحة للمحاولة مرة أخرى.",
      loading: "جارٍ التحميل…",

      e404_title: "هذه الصفحة غير موجودة، أو أن دورك لا يسمح لك برؤيتها.",
      e404_home: "اذهب إلى الصفحة الرئيسية"
    }
  };

  var listeners = [];

  function lang() { return root.lang === "ar" ? "ar" : "en"; }

  function t(key) {
    var l = lang();
    return (UI[l] && UI[l][key]) || UI.en[key] || key;
  }

  /* Picks the right language from a {en, ar} object; plain strings pass through. */
  function pick(value) {
    if (value == null) return "";
    if (typeof value === "string") return value;
    return value[lang()] || value.en || "";
  }

  function store(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* storage blocked: ignore */ }
  }

  /* Small safe element builder: text always goes through textContent. */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v == null || v === false) return;
        if (k === "text") node.textContent = v;
        else if (k === "class") node.className = v;
        else node.setAttribute(k, v === true ? "" : v);
      });
    }
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function isExternal(url) {
    return /^https?:\/\//i.test(url) && url.indexOf(window.location.origin) !== 0;
  }

  /* Only http(s), mailto and relative links are allowed into the page. */
  function safeUrl(url) {
    if (typeof url !== "string") return "#";
    var u = url.trim();
    if (/^(https?:|mailto:)/i.test(u)) return u;
    if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return "#";
    return u;
  }

  function link(url, text, cls) {
    var href = safeUrl(url);
    var a = el("a", { href: href, class: cls || null, text: text });
    if (isExternal(href)) {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    }
    return a;
  }

  /* Numbers in the reader's digits: 12 in English, ١٢ in Arabic (HTTP codes stay as they are). */
  function num(n) {
    try { return new Intl.NumberFormat(lang() === "ar" ? "ar-EG" : "en-GB").format(n); }
    catch (e) { return String(n); }
  }

  function formatDate(iso) {
    var d = new Date(iso + "T00:00:00");
    if (isNaN(d)) return iso;
    try {
      return new Intl.DateTimeFormat(lang() === "ar" ? "ar-EG" : "en-GB",
        { year: "numeric", month: "long", day: "numeric" }).format(d);
    } catch (e) { return iso; }
  }

  function applyI18n(scope) {
    (scope || document).querySelectorAll("[data-i18n]").forEach(function (node) {
      node.textContent = t(node.getAttribute("data-i18n"));
    });
    (scope || document).querySelectorAll("[data-i18n-label]").forEach(function (node) {
      node.setAttribute("aria-label", t(node.getAttribute("data-i18n-label")));
    });
  }

  /* ---------- language ---------- */
  function setLang(l) {
    if (l !== "en" && l !== "ar") return;
    root.lang = l;
    root.dir = l === "ar" ? "rtl" : "ltr";
    store("lang", l);
    try {
      var url = new URL(window.location.href);
      if (url.searchParams.has("lang")) {
        url.searchParams.set("lang", l);
        window.history.replaceState(null, "", url);
      }
    } catch (e) {}
    applyI18n();
    updateControls();
    listeners.forEach(function (fn) { fn(l); });
  }

  function onLangChange(fn) { listeners.push(fn); }

  /* ---------- theme ---------- */
  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function theme() {
    var forced = root.getAttribute("data-theme");
    if (forced === "light" || forced === "dark") return forced;
    return media && media.matches ? "dark" : "light";
  }

  var ICON_MOON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M20.4 14.6A8.5 8.5 0 0 1 9.4 3.6a8.5 8.5 0 1 0 11 11z"/></svg>';
  var ICON_SUN = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="currentColor"/><g stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></g></svg>';

  function updateControls() {
    var lb = document.getElementById("lang-toggle");
    if (lb) {
      // the visible word ("عربي" / "English") is the button's name; the longer hint is its description
      lb.textContent = t("lang_switch");
      lb.setAttribute("lang", lang() === "ar" ? "en" : "ar");
      lb.setAttribute("title", t("lang_switch_label"));
    }
    var tb = document.getElementById("theme-toggle");
    if (tb) {
      var dark = theme() === "dark";
      tb.innerHTML = dark ? ICON_SUN : ICON_MOON;
      tb.setAttribute("aria-label", t(dark ? "theme_to_light" : "theme_to_dark"));
      tb.setAttribute("title", t(dark ? "theme_to_light" : "theme_to_dark"));
    }
  }

  function initControls() {
    var lb = document.getElementById("lang-toggle");
    if (lb) lb.addEventListener("click", function () { setLang(lang() === "ar" ? "en" : "ar"); });
    var tb = document.getElementById("theme-toggle");
    if (tb) tb.addEventListener("click", function () {
      var next = theme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      store("theme", next);
      updateControls();
    });
    if (media && media.addEventListener) media.addEventListener("change", updateControls);
    document.querySelectorAll("[data-year]").forEach(function (n) {
      n.textContent = String(new Date().getFullYear());
    });
    applyI18n();
    updateControls();
  }

  /* Every [data-site-name] element (header brand, footer) follows the language. */
  function renderBrand() {
    if (!window.SITE) return;
    document.querySelectorAll("[data-site-name]").forEach(function (n) {
      n.textContent = pick(window.SITE.name);
    });
  }

  /* ---------- showing the page ----------
     boot.js keeps the page hidden until its content is rendered, so nothing jumps while it loads.
     ready() waits a moment for the fonts (never more than 900 ms), then fades the page in.
     Functions passed to ready() run once the page is visible. */
  var shown = false, waiting = false, queue = [];

  function ready(fn) {
    if (fn) { if (shown) fn(); else queue.push(fn); }
    if (shown || waiting) return;
    waiting = true;

    function show() {
      if (shown) return;
      shown = true;
      root.classList.add("ready");
      queue.splice(0).forEach(function (f) { f(); });
    }

    var fonts = document.fonts;
    if (!fonts || !fonts.load || !window.Promise) { show(); return; }
    setTimeout(show, 900);
    void document.body.offsetHeight; // lay the page out now, so the fonts it uses start loading
    try {
      Promise.all([fonts.load('400 1em "Readex Pro"', "aع"), fonts.ready]).then(show, show);
    } catch (e) { show(); }
  }

  window.MR = {
    lang: lang, t: t, pick: pick, el: el, link: link, safeUrl: safeUrl, num: num,
    formatDate: formatDate, onLangChange: onLangChange, applyI18n: applyI18n, ready: ready,
    reducedMotion: function () {
      return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }
  };

  function start() {
    initControls();
    renderBrand();
    onLangChange(renderBrand);
    if (root.hasAttribute("data-autoready")) ready();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();

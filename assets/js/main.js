/* Home page: renders the content from content.js and runs the permission matrix. */
(function () {
  "use strict";

  var S = window.SITE || {};
  var MR = window.MR;
  var el = MR.el, t = MR.t, pick = MR.pick;

  function clear(node) { while (node && node.firstChild) node.removeChild(node.firstChild); return node; }
  function $(id) { return document.getElementById(id); }

  /* ---------------- icons: magenta always marks the flaw ---------------- */
  var ICONS = {
    access:
      '<svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6">' +
      '<rect x="4" y="4" width="9" height="9" rx="2"/><rect x="15.5" y="4" width="9" height="9" rx="2"/><rect x="27" y="4" width="9" height="9" rx="2"/>' +
      '<rect x="4" y="15.5" width="9" height="9" rx="2"/><rect x="15.5" y="15.5" width="9" height="9" rx="2"/><rect x="27" y="15.5" width="9" height="9" rx="2"/>' +
      '<rect x="4" y="27" width="9" height="9" rx="2"/><rect x="27" y="27" width="9" height="9" rx="2"/></g>' +
      '<rect class="flaw-mark" x="15.5" y="27" width="9" height="9" rx="2"/></svg>',
    logic:
      '<svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6">' +
      '<path d="M10 31h20"/><rect class="dot" x="3.5" y="27" width="8" height="8" rx="2"/><rect class="dot" x="16" y="27" width="8" height="8" rx="2"/><rect class="dot" x="28.5" y="27" width="8" height="8" rx="2"/></g>' +
      '<path class="flaw-line" d="M7.5 22 C 9 5, 31 5, 32.5 20" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="3 3"/>' +
      '<path class="flaw-line" d="M29 17.6 32.6 21.6 35.8 17.2" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    race:
      '<svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">' +
      '<path d="M4 14h20"/><path d="M4 26h20"/><path d="M28 6v28"/></g>' +
      '<circle class="flaw-mark" cx="28" cy="14" r="3"/><circle class="flaw-mark" cx="28" cy="26" r="3"/></svg>',
    auth:
      '<svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">' +
      '<path d="M4 20h18"/><path d="M22 11v18"/></g>' +
      '<path class="flaw-line" d="M24 20h12" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="1 4.5"/>' +
      '<circle cx="4" cy="20" r="2.4" fill="currentColor"/></svg>'
  };

  /* ---------------- hero ---------------- */
  /* If a value is missing (or content.js failed to load), the text already in index.html stays. */
  function setText(id, value) { var v = pick(value); if (v) $(id).textContent = v; }

  function renderHero() {
    setText("hero-name", S.name);
    setText("hero-role", S.role);
    setText("hero-intro", S.intro);
    if (S.name && S.role) document.title = pick(S.name) + " — " + pick(S.role);

    var photo = $("hero-photo");
    clear(photo);
    if (S.photo) {
      photo.appendChild(el("img", { src: MR.safeUrl(S.photo), alt: pick(S.name), width: "88", height: "88", class: "avatar" }));
      photo.hidden = false;
    } else {
      photo.hidden = true;
    }

    var meta = clear($("hero-meta"));
    if (S.status) meta.appendChild(el("span", { class: "status", text: pick(S.status) }));
    if (S.location) meta.appendChild(el("span", { class: "location", text: pick(S.location) }));

    var actions = clear($("hero-links"));
    (S.links || []).forEach(function (l, i) {
      actions.appendChild(MR.link(l.url, pick(l.label), i === 0 ? "btn btn-primary" : "btn"));
    });
  }

  /* A section with nothing in it is hidden, together with its link in the menu. */
  function showSection(id, visible) {
    $(id).hidden = !visible;
    document.querySelectorAll('.nav a[href="#' + id + '"]').forEach(function (a) { a.parentNode.hidden = !visible; });
  }

  /* ---------------- focus ---------------- */
  function renderFocus() {
    var list = clear($("focus-list"));
    showSection("focus", (S.focus || []).length > 0);
    (S.focus || []).forEach(function (f) {
      var icon = el("span", { class: "focus-icon" });
      if (ICONS[f.icon]) icon.innerHTML = ICONS[f.icon];
      list.appendChild(el("li", { class: "focus-item" }, [
        icon,
        el("h3", { text: pick(f.title) }),
        el("p", { text: pick(f.text) })
      ]));
    });
  }

  /* ---------------- method ---------------- */
  function renderMethod() {
    var list = clear($("method-list"));
    showSection("method", (S.method || []).length > 0);
    (S.method || []).forEach(function (m) {
      list.appendChild(el("li", { class: "step" }, [
        el("h3", { text: pick(m.title) }),
        el("p", { text: pick(m.text) })
      ]));
    });
  }

  /* ---------------- write-ups ---------------- */
  /* If a write-up has a translation, show only the version in the current language. */
  function visibleWriteups() {
    var all = S.writeups || [];
    var bySlug = {};
    all.forEach(function (w) { bySlug[w.slug] = w; });
    var current = MR.lang();
    return all.filter(function (w) {
      var other = w.translation && bySlug[w.translation];
      if (!other) return true;
      if (w.lang === current) return true;
      return other.lang !== current && w.lang === "en";
    }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
  }

  function renderWriteups() {
    var list = clear($("writeup-list"));
    var items = visibleWriteups();
    $("writeups-empty").hidden = items.length > 0;
    items.forEach(function (w) {
      var a = el("a", { class: "post", href: "post.html?slug=" + encodeURIComponent(w.slug) });
      a.appendChild(el("time", { class: "post-date", datetime: w.date, text: MR.formatDate(w.date) }));
      var body = el("div", { class: "post-body", lang: w.lang, dir: w.lang === "ar" ? "rtl" : "ltr" });
      body.appendChild(el("span", { class: "post-title", text: w.title }));
      if (w.summary) body.appendChild(el("span", { class: "post-summary", text: w.summary }));
      var tags = el("span", { class: "post-tags" });
      (w.tags || []).forEach(function (tag) { tags.appendChild(el("span", { class: "tag", text: tag })); });
      if (w.lang !== MR.lang()) {
        tags.appendChild(el("span", { class: "tag tag-lang", lang: MR.lang(), text: t(w.lang === "ar" ? "lang_ar" : "lang_en") }));
      }
      body.appendChild(tags);
      a.appendChild(body);
      list.appendChild(el("li", null, [a]));
    });
  }

  /* ---------------- recognition (hidden until there is something real) ---------------- */
  function renderRecognition() {
    var items = S.recognition || [];
    var section = $("recognition");
    section.hidden = items.length === 0;
    var list = clear($("recognition-list"));
    items.forEach(function (r) {
      var title = r.url ? MR.link(r.url, pick(r.title)) : el("span", { text: pick(r.title) });
      list.appendChild(el("li", { class: "award" }, [el("span", { class: "award-year", text: r.year || "" }), title]));
    });
    var navItem = $("nav-recognition");
    if (navItem) navItem.hidden = items.length === 0;
  }

  /* ---------------- contact ---------------- */
  function renderContact() {
    var hasEmail = typeof S.email === "string" && /.+@.+\..+/.test(S.email);
    $("contact-text").textContent = t(hasEmail ? "contact_email" : "contact_noemail");
    var mail = clear($("contact-email"));
    mail.hidden = !hasEmail;
    if (hasEmail) mail.appendChild(el("a", { href: "mailto:" + S.email.trim(), class: "email", text: S.email.trim() }));

    var links = clear($("contact-links"));
    (S.links || []).forEach(function (l) { links.appendChild(MR.link(l.url, pick(l.label), "btn")); });
    if (S.pgp) {
      var key = el("a", { href: MR.safeUrl(S.pgp), class: "btn", text: t("pgp"), download: "" });
      links.appendChild(key);
    }
  }

  /* =================================================================
     The permission matrix
     ================================================================= */
  var ROLES = ["admin", "editor", "viewer"];
  var ACTIONS = [
    { key: "view",   method: "GET",    path: "/api/projects/42" },
    { key: "edit",   method: "PATCH",  path: "/api/projects/42" },
    { key: "delete", method: "DELETE", path: "/api/projects/42" },
    { key: "invite", method: "POST",   path: "/api/projects/42/members" }
  ];
  var RULES = { admin: [1, 1, 1, 1], editor: [1, 1, 1, 0], viewer: [1, 0, 0, 0] };
  var FLAW = { role: "viewer", action: "delete" };

  var cells = [];
  var timers = [];
  var selected = null;
  var finished = false;
  var live = null;   // the part of the inspector that shows the current request

  function isFlaw(r, a) { return r === FLAW.role && a === FLAW.action; }
  function expected(r, i) { return RULES[r][i] === 1; }
  function actual(r, i) { return isFlaw(r, ACTIONS[i].key) ? true : expected(r, i); }
  function status(ok) { return ok ? "200 OK" : "403 Forbidden"; }
  function request(a) { return a.method + " " + a.path; }
  function flawCell() { return cells.filter(function (c) { return isFlaw(c.role, c.action.key); })[0]; }
  function cellName(c) { return t("role_" + c.role) + ", " + t("act_" + c.action.key); }

  function buildMatrix() {
    var table = $("matrix");
    clear(table);
    table.setAttribute("aria-label", t("m_label"));
    cells = [];

    var head = el("tr", null, [el("td")]);
    ACTIONS.forEach(function (a) { head.appendChild(el("th", { scope: "col", text: t("act_" + a.key) })); });
    table.appendChild(el("thead", null, [head]));

    var body = el("tbody");
    ROLES.forEach(function (r) {
      var row = el("tr", null, [el("th", { scope: "row", text: t("role_" + r) })]);
      ACTIONS.forEach(function (a, i) {
        var label = el("span", { class: "cell-label" });
        var btn = el("button", { type: "button", class: "cell", "data-state": "pending" }, [label]);
        var info = { role: r, index: i, action: a, node: btn, label: label };
        btn.setAttribute("aria-label", cellName(info));
        btn.addEventListener("click", function () { select(info); });
        btn.addEventListener("focus", function () { if (finished) select(info); });
        btn.addEventListener("pointerenter", function (e) {
          if (finished && e.pointerType === "mouse") select(info);
        });
        cells.push(info);
        row.appendChild(el("td", null, [btn]));
      });
      body.appendChild(row);
    });
    table.appendChild(body);
  }

  function resolve(info, final) {
    var allowed = actual(info.role, info.index);
    var flaw = final && isFlaw(info.role, info.action.key);
    info.node.setAttribute("data-state", flaw ? "flaw" : (allowed ? "allow" : "deny"));
    info.label.textContent = t(allowed ? "allowed" : "denied");
    info.node.setAttribute("aria-label",
      cellName(info) + ": " + t(allowed ? "allowed" : "denied") + (flaw ? ". " + t("m_finding") : ""));
  }

  /* ---------- the inspector ----------
     An invisible copy of its largest possible content sits behind the live content,
     so the box keeps one size at every width and in both languages: nothing on the page jumps. */
  /* The request line, e.g. "POST /api/projects/42/members". On narrow screens it may only
     wrap after a slash, never in the middle of a word. */
  function requestLine(action) {
    var code = el("code", { dir: "ltr" }, [action.method + " "]);
    action.path.split("/").forEach(function (part, i) {
      if (i > 0) { code.appendChild(document.createTextNode("/")); code.appendChild(el("wbr")); }
      if (part) code.appendChild(document.createTextNode(part));
    });
    return code;
  }

  function paint(target, d) {
    clear(target);
    var head = el("p", { class: "insp-head" }, [el("span", { text: d.head })]);
    if (d.pill) head.appendChild(el("span", { class: "finding", text: t("m_finding") }));
    target.appendChild(head);

    function row(k, v, bad) {
      return el("div", { class: "insp-row" }, [
        el("dt", { text: t(k) }),
        el("dd", null, [el("code", { dir: "ltr", class: bad ? "bad" : null, text: v })])
      ]);
    }
    target.appendChild(el("dl", null, [
      el("div", { class: "insp-req" }, [
        el("dt", { class: "sr-only", text: t("m_request") }),
        el("dd", null, [requestLine(d.action)])
      ]),
      row("m_expected", d.expected),
      row("m_response", d.response, d.bad)
    ]));
    if (d.verdict) {
      target.appendChild(el("p", {
        class: "insp-verdict" + (d.bad ? " is-bad" : d.muted ? " is-muted" : ""), text: d.verdict
      }));
    }
    if (d.hint) target.appendChild(el("p", { class: "insp-hint", text: t("m_hint") }));
  }

  function longest(list, measure) {
    measure = measure || function (x) { return x.length; };
    return list.reduce(function (a, b) { return a == null || measure(b) > measure(a) ? b : a; }, null);
  }

  function buildInspector() {
    var insp = clear($("inspector"));
    insp.classList.remove("is-flaw");
    live = el("div", { class: "insp-live" });
    var ghost = el("div", { class: "insp-ghost", "aria-hidden": "true" });
    insp.appendChild(live);
    insp.appendChild(ghost);

    var heads = ROLES.map(function (r) { return t("m_as") + " " + t("role_" + r); });
    heads.push(t("m_testing") + " " + MR.num(cells.length) + " " + t("m_of") + " " + MR.num(cells.length));
    paint(ghost, {
      head: longest(heads), pill: true,
      action: longest(ACTIONS, function (a) { return request(a).length; }),
      expected: status(false), response: status(false), bad: true,
      verdict: longest([t("m_flaw"), t("m_ok"), t("m_checking")]), hint: true
    });
  }

  function select(info) {
    if (selected) selected.node.classList.remove("is-selected");
    selected = info;
    info.node.classList.add("is-selected");

    var flaw = isFlaw(info.role, info.action.key);
    $("inspector").classList.toggle("is-flaw", flaw);
    paint(live, {
      head: t("m_as") + " " + t("role_" + info.role), pill: flaw,
      action: info.action,
      expected: status(expected(info.role, info.index)),
      response: status(actual(info.role, info.index)), bad: flaw,
      verdict: t(flaw ? "m_flaw" : "m_ok"), hint: true
    });
  }

  function stopTimers() { timers.forEach(clearTimeout); timers = []; }

  /* Every cell back to "not tested yet". */
  function resetCells() {
    stopTimers();
    finished = false;
    if (selected) selected.node.classList.remove("is-selected");
    selected = null;
    $("replay").disabled = true;
    cells.forEach(function (c) {
      c.node.setAttribute("data-state", "pending");
      c.node.classList.remove("is-stamp", "is-scanning");
      c.node.setAttribute("aria-label", cellName(c));
      c.label.textContent = "";
    });
    $("inspector").classList.remove("is-flaw");
    clear(live);
    $("matrix-status").textContent = "";
  }

  function finalState() {
    stopTimers();
    cells.forEach(function (c) { c.node.classList.remove("is-scanning"); resolve(c, true); });
    finished = true;
    select(flawCell());
    $("replay").disabled = false;
  }

  function scan() {
    resetCells();
    var i = 0;
    function next() {
      if (i > 0) cells[i - 1].node.classList.remove("is-scanning");
      if (i >= cells.length) {
        timers.push(setTimeout(reveal, 420));
        return;
      }
      var c = cells[i];
      c.node.classList.add("is-scanning");
      paint(live, {
        head: t("m_testing") + " " + MR.num(i + 1) + " " + t("m_of") + " " + MR.num(cells.length),
        action: c.action,
        expected: status(expected(c.role, c.index)),
        response: status(actual(c.role, c.index)),
        verdict: t("m_checking"), muted: true
      });
      timers.push(setTimeout(function () { resolve(c, false); i += 1; next(); }, 135));
    }
    timers.push(setTimeout(next, 350));
  }

  function reveal() {
    var f = flawCell();
    resolve(f, true);
    f.node.classList.add("is-stamp");
    finished = true;
    select(f);
    $("replay").disabled = false;
    $("matrix-status").textContent = t("m_finding") + ": " + t("m_flaw");
  }

  /* mode: "pending" (waiting for the scan) or "final" (everything resolved). */
  function initMatrix(mode) {
    buildMatrix();
    buildInspector();
    $("matrix-caption").textContent = t("m_caption");
    $("replay-label").textContent = t("m_replay");
    if (mode === "pending") resetCells();
    else finalState();
  }

  /* ---------------- boot ---------------- */
  function renderAll(mode) {
    renderHero();
    renderFocus();
    renderMethod();
    renderWriteups();
    renderRecognition();
    renderContact();
    initMatrix(mode);
  }

  function start() {
    if (!window.SITE) {
      // shows in the browser console (F12) — the usual cause is a missing comma or quote
      console.error("assets/js/content.js did not load. Check your last edit for a missing comma (,) or quote (\").");
    }
    var animate = !MR.reducedMotion();
    $("replay").addEventListener("click", function () {
      if (MR.reducedMotion()) finalState(); else scan();
    });
    renderAll(animate ? "pending" : "final");
    MR.onLangChange(function () { renderAll("final"); });
    MR.ready(function () { if (animate && !finished) scan(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();

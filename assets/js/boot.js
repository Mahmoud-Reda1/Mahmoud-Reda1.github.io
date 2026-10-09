/* Runs before the page paints: picks the language and theme so nothing flickers,
   and marks the page as scripted so it stays hidden until its content is ready. */
(function () {
  var root = document.documentElement;
  root.classList.add("js");

  function stored(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }

  var lang = null;
  try { lang = new URLSearchParams(window.location.search).get("lang"); } catch (e) {}
  if (lang !== "en" && lang !== "ar") lang = stored("lang");
  if (lang !== "en" && lang !== "ar") {
    lang = (navigator.language || "").toLowerCase().indexOf("ar") === 0 ? "ar" : "en";
  }
  root.lang = lang;
  root.dir = lang === "ar" ? "rtl" : "ltr";

  var theme = stored("theme");
  if (theme === "light" || theme === "dark") root.setAttribute("data-theme", theme);
})();

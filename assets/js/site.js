/* bakeer.de — small progressive enhancements. No dependencies. */
(function () {
  "use strict";

  /* ---- Theme ---------------------------------------------------------- */
  var root = document.documentElement;

  function setTheme(mode) {
    if (mode === "system") { root.removeAttribute("data-theme"); }
    else { root.setAttribute("data-theme", mode); }
    try { localStorage.setItem("tb-theme", mode); } catch (e) {}
  }

  function currentMode() {
    var stored;
    try { stored = localStorage.getItem("tb-theme"); } catch (e) {}
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  var themeBtn = document.querySelector("[data-theme-toggle]");
  if (themeBtn) {
    var sync = function () {
      var m = currentMode();
      themeBtn.setAttribute("aria-label", m === "dark" ? "Switch to light theme" : "Switch to dark theme");
      themeBtn.setAttribute("title", m === "dark" ? "Light theme" : "Dark theme");
    };
    sync();
    themeBtn.addEventListener("click", function () {
      setTheme(currentMode() === "dark" ? "light" : "dark");
      sync();
    });
  }

  /* ---- Mobile navigation ---------------------------------------------- */
  var navBtn = document.querySelector("[data-nav-toggle]");
  var nav = document.getElementById("site-nav");

  if (navBtn && nav) {
    var mq = window.matchMedia("(max-width: 62em)");

    var apply = function () {
      if (mq.matches) {
        nav.hidden = navBtn.getAttribute("aria-expanded") !== "true";
      } else {
        nav.hidden = false;
        navBtn.setAttribute("aria-expanded", "false");
      }
    };

    navBtn.setAttribute("aria-expanded", "false");
    apply();

    navBtn.addEventListener("click", function () {
      var open = navBtn.getAttribute("aria-expanded") === "true";
      navBtn.setAttribute("aria-expanded", String(!open));
      apply();
    });

    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && mq.matches) {
        navBtn.setAttribute("aria-expanded", "false");
        apply();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navBtn.getAttribute("aria-expanded") === "true") {
        navBtn.setAttribute("aria-expanded", "false");
        apply();
        navBtn.focus();
      }
    });

    if (mq.addEventListener) mq.addEventListener("change", apply);
    else if (mq.addListener) mq.addListener(apply);
  }

  /* ---- Publication filters -------------------------------------------- */
  var filters = document.querySelectorAll("[data-filter]");
  var items = document.querySelectorAll("[data-list] [data-kind]");
  var counter = document.querySelector("[data-count]");

  if (filters.length && items.length) {
    var show = function (key) {
      var n = 0;
      Array.prototype.forEach.call(items, function (el) {
        var match = key === "all" || el.getAttribute("data-kind") === key;
        el.hidden = !match;
        if (match) n++;
      });
      Array.prototype.forEach.call(filters, function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === key));
      });
      if (counter) counter.textContent = n + (n === 1 ? " entry" : " entries");
      if (history.replaceState) {
        history.replaceState(null, "", key === "all" ? location.pathname : location.pathname + "#" + key);
      }
    };

    Array.prototype.forEach.call(filters, function (b) {
      b.addEventListener("click", function () { show(b.getAttribute("data-filter")); });
    });

    var hash = (location.hash || "").replace("#", "");
    var known = Array.prototype.map.call(filters, function (b) { return b.getAttribute("data-filter"); });
    show(known.indexOf(hash) > -1 ? hash : "all");
  }

  /* ---- Footer year ----------------------------------------------------- */
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();

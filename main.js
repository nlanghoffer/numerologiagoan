/* ============================================================
   Numerología Goan — main.js
   IIFE pattern — no ES modules — no imports/exports
   ============================================================ */
(function () {
  "use strict";

  /* ── Helpers ─────────────────────────────────────────────── */
  function safe(fn, name) {
    try { fn(); }
    catch (e) { console.warn("[" + name + "]", e); }
  }

  /* ── Nav ─────────────────────────────────────────────────── */
  function initNav() {
    var nav     = document.getElementById("nav");
    var toggle  = nav.querySelector(".nav-toggle");
    var mobile  = document.getElementById("nav-mobile");
    if (!nav) return;

    // Solidify nav on scroll
    function updateNav() {
      nav.classList.toggle("is-scrolled", window.scrollY > 20);
    }
    updateNav();
    window.addEventListener("scroll", updateNav, { passive: true });

    // Mobile menu
    if (toggle && mobile) {
      toggle.addEventListener("click", function () {
        var isOpen = mobile.classList.toggle("is-open");
        toggle.classList.toggle("is-open", isOpen);
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        mobile.setAttribute("aria-hidden", isOpen ? "false" : "true");
      });

      // Close on link click
      mobile.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          mobile.classList.remove("is-open");
          toggle.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          mobile.setAttribute("aria-hidden", "true");
        });
      });
    }
  }

  /* ── Smooth Scroll ───────────────────────────────────────── */
  function initSmoothScroll() {
    var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 72;
    var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - navH,
        behavior: reduced ? "auto" : "smooth"
      });
    });
  }

  /* ── Reveal on Scroll ────────────────────────────────────── */
  function initReveals() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el    = entry.target;
        var delay = parseInt(el.dataset.delay || "0", 10);
        if (delay > 0) {
          setTimeout(function () { el.classList.add("is-visible"); }, delay);
        } else {
          el.classList.add("is-visible");
        }
        io.unobserve(el);
      });
    }, { threshold: 0.04, rootMargin: "0px 0px -4% 0px" });

    items.forEach(function (el) { io.observe(el); });

    // Safety net: 6s reveal anything still hidden in view
    setTimeout(function () {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("is-visible");
        }
      });
    }, 6000);
  }

  /* ── Count-Up Numbers ────────────────────────────────────── */
  function initCountUp() {
    var counters = document.querySelectorAll("[data-count-to]");
    if (!counters.length) return;

    function animateCounter(el, target, duration) {
      var start     = 0;
      var startTime = null;
      var reduced   = matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) { el.textContent = target; return; }

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var ease     = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el     = entry.target;
        var target = parseInt(el.getAttribute("data-count-to"), 10);
        animateCounter(el, target, 1800);
        io.unobserve(el);
      });
    }, { threshold: 0.3 });

    counters.forEach(function (el) { io.observe(el); });
  }

  /* ── GSAP ScrollTrigger reveals ─────────────────────────── */
  function initGSAP() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    // Servicios, beneficios y testimonios ya tienen clase `reveal` y son
    // manejados por el IntersectionObserver de initReveals(). No duplicar con GSAP.
  }

  /* ── Formulario de contacto (Web3Forms) ─────────────────── */
  function initContactForm() {
    var form      = document.getElementById("contact-form");
    var submitBtn = document.getElementById("form-submit");
    var successEl = document.getElementById("form-success");
    var errorEl   = document.getElementById("form-error");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.classList.add("is-loading");
      successEl.hidden = true;
      errorEl.hidden   = true;

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body:   new FormData(form)
      })
      .then(function (res) {
        return res.json().then(function (json) {
          return { ok: res.ok, data: json };
        });
      })
      .then(function (result) {
        if (result.ok && result.data.success) {
          form.reset();
          form.hidden      = true;
          successEl.hidden = false;
        } else {
          errorEl.hidden = false;
        }
      })
      .catch(function () {
        errorEl.hidden = false;
      })
      .then(function () {
        submitBtn.disabled = false;
        submitBtn.classList.remove("is-loading");
      });
    });
  }

  /* ── Testimonios Slider ─────────────────────────────────── */
  function initSlider() {
    var track          = document.getElementById("testimonios-track");
    var btnPrev        = document.getElementById("slider-prev");
    var btnNext        = document.getElementById("slider-next");
    var dotsContainer  = document.getElementById("slider-dots");
    if (!track || !btnPrev || !btnNext || !dotsContainer) return;

    var cards       = track.querySelectorAll(".slide");
    var total       = cards.length;
    var current     = 0;
    var autoTimer   = null;
    var AUTO_MS     = 5000;
    var touchStartX = 0;

    function getVisible() {
      if (window.innerWidth <= 600)  return 1;
      if (window.innerWidth <= 900)  return 2;
      return 3;
    }

    function maxIndex() {
      return total - getVisible();
    }

    // Build dots to match the number of navigable positions
    function buildDots() {
      var count = maxIndex() + 1;
      dotsContainer.innerHTML = "";
      for (var i = 0; i < count; i++) {
        var btn = document.createElement("button");
        btn.className    = "slider-dot" + (i === current ? " is-active" : "");
        btn.setAttribute("role", "tab");
        btn.setAttribute("aria-selected", i === current ? "true" : "false");
        btn.setAttribute("aria-label", "Ir al testimonio " + (i + 1));
        btn.dataset.index = i;
        (function(idx) {
          btn.addEventListener("click", function () { goTo(idx); startAuto(); });
        }(i));
        dotsContainer.appendChild(btn);
      }
    }

    function updateDots() {
      var dotBtns = dotsContainer.querySelectorAll(".slider-dot");
      dotBtns.forEach(function (dot, i) {
        var active = i === current;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-selected", active ? "true" : "false");
      });
    }

    function goTo(index) {
      var max = maxIndex();
      current = Math.max(0, Math.min(index, max));
      var pct = current * (100 / getVisible());
      track.style.transform = "translateX(-" + pct + "%)";
      updateDots();
      btnPrev.disabled = current === 0;
      btnNext.disabled = current >= max;
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(function () {
        goTo(current >= maxIndex() ? 0 : current + 1);
      }, AUTO_MS);
    }
    function stopAuto() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }

    btnNext.addEventListener("click", function () { next(); startAuto(); });
    btnPrev.addEventListener("click", function () { prev(); startAuto(); });

    // Touch swipe
    track.addEventListener("touchstart", function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener("touchend", function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? next() : prev();
        startAuto();
      }
    }, { passive: true });

    // Pause autoplay on hover/focus
    var wrap = document.querySelector(".testimonios-slider-wrap");
    if (wrap) {
      wrap.addEventListener("mouseenter", stopAuto);
      wrap.addEventListener("mouseleave", startAuto);
      wrap.addEventListener("focusin",    stopAuto);
      wrap.addEventListener("focusout",   startAuto);
    }

    // Re-build dots + recalculate on resize
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        buildDots();
        goTo(Math.min(current, maxIndex()));
      }, 150);
    });

    // Init
    buildDots();
    goTo(0);
    startAuto();
  }

  /* ── Boot ────────────────────────────────────────────────── */
  function boot() {
    safe(initNav,          "initNav");
    safe(initSmoothScroll, "initSmoothScroll");
    safe(initReveals,      "initReveals");
    safe(initCountUp,      "initCountUp");
    safe(initGSAP,         "initGSAP");
    safe(initContactForm,  "initContactForm");
    safe(initSlider,       "initSlider");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

})();

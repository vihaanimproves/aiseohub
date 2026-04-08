/**
 * hero.js — Self-contained JS for the AIseohub Hero Component
 * Handles: urgency bar, header scroll, mobile nav, scroll reveal,
 *          text cycle, spots count, smooth scroll, AI demo animation
 *
 * Usage: <script src="hero.js"></script>
 * No dependencies. Drop in alongside hero.html + hero.css.
 */

'use strict';

/* ── Utilities ──────────────────────────────────────────── */
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

document.addEventListener('DOMContentLoaded', () => {
  initUrgencyBar();
  initHeader();
  initNavToggle();
  initScrollReveal();
  initTextCycle();
  initSpotsSync();
  initSmoothScroll();
  initAiDemo();
});

/* ── URGENCY BAR ────────────────────────────────────────── */
function initUrgencyBar() {
  const bar    = $('#urgencyBar');
  const close  = $('#closeUrgency');
  const header = $('#siteHeader');
  if (!bar || !close) return;

  // Persist dismissal across page refreshes
  if (sessionStorage.getItem('urgencyDismissed')) {
    bar.remove();
    if (header) header.classList.add('urgency-hidden');
    return;
  }

  close.addEventListener('click', () => {
    bar.classList.add('is-hidden');
    if (header) header.classList.add('urgency-hidden');
    sessionStorage.setItem('urgencyDismissed', '1');
    setTimeout(() => bar.remove(), 450);
  });
}

/* ── HEADER — scroll state ──────────────────────────────── */
function initHeader() {
  const header = $('#siteHeader');
  if (!header) return;
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── MOBILE NAV TOGGLE ──────────────────────────────────── */
function initNavToggle() {
  const toggle = $('#navToggle');
  const nav    = $('#mainNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.classList.toggle('is-active', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  $$('.nav__link', nav).forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ── SCROLL REVEAL ──────────────────────────────────────── */
function initScrollReveal() {
  const els = $$('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
}

/* ── TEXT CYCLE ─────────────────────────────────────────── */
function initTextCycle() {
  const el = $('.text-cycle');
  if (!el) return;

  const words = [
    'accountant', 'contractor', 'dentist', 'lawyer',
    'agency', 'restaurant', 'clinic', 'architect', 'consultant'
  ];
  let index = 0;
  let t     = null;

  function cycle() {
    el.style.opacity    = '0';
    el.style.transition = 'opacity 0.25s ease';

    t = setTimeout(() => {
      index          = (index + 1) % words.length;
      el.textContent = words[index];
      el.style.opacity   = '1';
      t = setTimeout(cycle, 2400);
    }, 280);
  }

  el.style.display   = 'inline-block';
  el.style.opacity   = '1';
  t = setTimeout(cycle, 2400);
  window.addEventListener('pagehide', () => clearTimeout(t));
}

/* ── SPOTS COUNT SYNC ───────────────────────────────────── */
function initSpotsSync() {
  // ← Update this number manually as registrations come in
  const SPOTS_REMAINING = 5;
  $$('[id^="spotsLeft"]').forEach(el => { el.textContent = SPOTS_REMAINING; });
}

/* ── SMOOTH SCROLL ──────────────────────────────────────── */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const hash   = link.getAttribute('href');
      if (hash === '#') return;
      const target = $(hash);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', hash);
    });
  });
}

/* ── AI DEMO ANIMATION ──────────────────────────────────── */
function initAiDemo() {
  const typedEl  = $('#aiDemoTyped');
  const caret    = $('#aiDemoCaret');
  const thinking = $('#aiDemoThinking');
  const response = $('#aiDemoResponse');
  const introEl  = $('#aiDemoIntro');
  const results  = $$('.ai-demo__result');
  const section  = $('.ai-demo--hero');
  if (!typedEl || !section) return;

  // Cycling query / intro pairs — extend this array to add more
  const QUERIES = [
    { q: 'Please suggest me the best skincare for my acne',  i: "Here are the top skincare products for acne I'd recommend:" },
    { q: 'Best dermatologist-approved face wash in Mumbai?', i: 'Based on dermatologist recommendations, here are top picks:' },
    { q: 'What moisturiser works for sensitive oily skin?',  i: 'Here are the moisturisers best suited for sensitive oily skin:' },
    { q: 'Recommend a good sunscreen for Indian skin tone',  i: 'These sunscreens work best for Indian skin tones:' },
    { q: 'Top-rated serum for dark spots and pigmentation',  i: 'Here are the most effective serums for dark spots:' },
    { q: 'Best budget skincare routine for beginners?',      i: "Here's a beginner-friendly skincare routine with top picks:" },
  ];

  // Speed multiplier — reduce below 1 to make animation faster
  const S        = 0.85;
  let queryIndex = 0;
  let timers     = [];

  function defer(fn, ms) {
    const id = setTimeout(fn, Math.round(ms * S));
    timers.push(id);
    return id;
  }

  // Human-like typing — variable speed per character type
  function typeText(text, onDone) {
    let i = 0;
    function nextMs(ch, prev) {
      if (ch === ' ')           return 62 + Math.random() * 38;
      if ('?!.,'.includes(ch)) return 88 + Math.random() * 55;
      if (prev === ' ')         return 50 + Math.random() * 28;
      return 26 + Math.random() * 18;
    }
    (function tick() {
      if (i < text.length) {
        typedEl.textContent += text[i];
        setTimeout(tick, Math.round(nextMs(text[i], i > 0 ? text[i - 1] : '') * S));
        i++;
      } else {
        onDone();
      }
    })();
  }

  // Backspace erase
  function eraseText(onDone) {
    (function tick() {
      const t = typedEl.textContent;
      if (t.length > 0) {
        typedEl.textContent = t.slice(0, -1);
        setTimeout(tick, Math.round((18 + Math.random() * 12) * S));
      } else {
        onDone();
      }
    })();
  }

  // Phase 1 — runs once on page load: type, think, reveal cards
  function runIntro() {
    const first = QUERIES[queryIndex];
    queryIndex  = (queryIndex + 1) % QUERIES.length;

    defer(() => {
      typeText(first.q, () => {
        caret.classList.add('is-hidden');
        defer(() => {
          thinking.classList.add('is-visible');
          defer(() => {
            thinking.classList.remove('is-visible');
            defer(() => {
              response.classList.add('is-visible');
              results.forEach((card, i) => {
                defer(() => card.classList.add('is-shown'), i * 145);
              });
              defer(() => {
                caret.classList.remove('is-hidden');
                cycleQuery();
              }, results.length * 145 + 510);
            }, 85);
          }, 1360);
        }, 272);
      });
    }, 425);
  }

  // Phase 2 — cycles queries; cards stay, intro line cross-fades
  function cycleQuery() {
    const entry = QUERIES[queryIndex];
    queryIndex  = (queryIndex + 1) % QUERIES.length;

    eraseText(() => {
      defer(() => {
        typeText(entry.q, () => {
          caret.classList.add('is-hidden');
          defer(() => {
            thinking.classList.add('is-visible');
            defer(() => {
              thinking.classList.remove('is-visible');
              defer(() => {
                introEl.classList.add('is-fading');
                defer(() => {
                  introEl.textContent = entry.i;
                  introEl.classList.remove('is-fading');
                  caret.classList.remove('is-hidden');
                  defer(cycleQuery, 3400);
                }, 210);
              }, 75);
            }, 1360);
          }, 272);
        });
      }, 290);
    });
  }

  // Kick off when the section enters the viewport
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && timers.length === 0) runIntro();
    });
  }, { threshold: 0.1 });

  io.observe(section);
}

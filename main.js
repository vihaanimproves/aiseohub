/**
 * GEOHUB — MAIN.JS
 * Vanilla JS · No dependencies
 */

'use strict';

const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

document.addEventListener('DOMContentLoaded', () => {
  initUrgencyBar();
  initHeader();
  initScrollReveal();
  initFAQ();
  initCounters();
  initTextCycle();
  initYear();
  initSpotsSync();
  initNavToggle();
  initSmoothScroll();
  initAiDemo();
});

/* ── URGENCY BAR ─────────────────────────────── */
function initUrgencyBar() {
  const bar    = $('#urgencyBar');
  const close  = $('#closeUrgency');
  const header = $('#siteHeader');
  if (!bar || !close) return;

  if (sessionStorage.getItem('urgencyDismissed')) {
    bar.remove();
    header.classList.add('urgency-hidden');
    return;
  }

  close.addEventListener('click', () => {
    bar.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
    bar.classList.add('is-hidden');
    header.classList.add('urgency-hidden');
    sessionStorage.setItem('urgencyDismissed', '1');
    setTimeout(() => bar.remove(), 450);
  });
}

/* ── HEADER — scroll state ───────────────────── */
function initHeader() {
  const header = $('#siteHeader');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── MOBILE NAV TOGGLE ───────────────────────── */
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

/* ── SCROLL REVEAL ───────────────────────────── */
function initScrollReveal() {
  const elements = $$('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ── FAQ ACCORDION ───────────────────────────── */
function initFAQ() {
  const questions = $$('.faq__question');
  if (!questions.length) return;

  questions.forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const answerId   = btn.getAttribute('aria-controls');
      const answer     = $(`#${answerId}`);
      if (!answer) return;

      // Close all others
      questions.forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          const otherAnswer = $(`#${other.getAttribute('aria-controls')}`);
          if (otherAnswer) otherAnswer.style.maxHeight = '0';
        }
      });

      // Toggle this one
      if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0';
      } else {
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ── ANIMATED COUNTERS ───────────────────────── */
function initCounters() {
  const counters = $$('.stat-card__number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target   = parseFloat(el.dataset.target);
  const suffix   = el.dataset.suffix  || '';
  const decimals = parseInt(el.dataset.decimal || '0', 10);
  const duration = 2000;
  const start    = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 4);
    const current  = eased * target;

    el.textContent = current.toFixed(decimals) + suffix;

    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toFixed(decimals) + suffix;
  }

  requestAnimationFrame(update);
}

/* ── TEXT CYCLE — hero ───────────────────────── */
function initTextCycle() {
  const el = $('.text-cycle');
  if (!el) return;

  const words = [
    'accountant', 'contractor', 'dentist', 'lawyer',
    'agency', 'restaurant', 'clinic', 'architect', 'consultant'
  ];
  let index   = 0;
  let timeout = null;

  function cycle() {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(6px)';
    el.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

    timeout = setTimeout(() => {
      index = (index + 1) % words.length;
      el.textContent = words[index];
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
      timeout = setTimeout(cycle, 2400);
    }, 280);
  }

  el.style.display    = 'inline-block';
  el.style.opacity    = '1';
  el.style.transform  = 'translateY(0)';
  timeout = setTimeout(cycle, 2400);

  window.addEventListener('pagehide', () => clearTimeout(timeout));
}

/* ── SPOTS SYNC ──────────────────────────────── */
function initSpotsSync() {
  const SPOTS_REMAINING = 5; // ← update this manually
  $$('[id^="spotsLeft"]').forEach(el => {
    el.textContent = SPOTS_REMAINING;
  });
}

/* ── FOOTER YEAR ─────────────────────────────── */
function initYear() {
  const el = $('#year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ── SMOOTH SCROLL ───────────────────────────── */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const hash = link.getAttribute('href');
      if (hash === '#') return;
      const target = $(hash);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', hash);
    });
  });
}

/* ═══════════════════════════════════════════
   PREBOOK FORM
═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('prebookForm')) return;
  initPrebookForm();
});

function initPrebookForm() {
  const form     = $('#prebookForm');
  const success  = $('#prebookSuccess');
  const submitBtn = $('#submitBtn');

  // ── Validation rules ──────────────────────
  const rules = {
    fullName:  { required: true },
    phone:     { required: true, pattern: /^[\+]?[\d\s\-\(\)]{7,20}$/, msg: 'Please enter a valid phone number.' },
    company:   { required: true },
    email:     { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: 'Please enter a valid email address.' },
    city:      { required: true },
    category:  { required: true, msg: 'Please select your business category.' },
    teamSize:  { required: true, msg: 'Please select your team size.' },
    website:   { required: false, pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,})([\/\w \.-]*)*\/?$/, msg: 'Please enter a valid URL.' },
  };

  // ── Real-time blur validation ─────────────
  Object.keys(rules).forEach(id => {
    const el = $(`#${id}`);
    if (!el) return;
    el.addEventListener('blur',  () => validateField(id));
    el.addEventListener('input', () => clearError(id));
    el.addEventListener('change', () => validateField(id));
  });

  // Checkbox
  const consent = $('#consent');
  if (consent) {
    consent.addEventListener('change', () => clearError('consent'));
  }

  // ── Submit ────────────────────────────────
  form.addEventListener('submit', async e => {
    e.preventDefault();

    let valid = true;

    // Validate all rule fields
    Object.keys(rules).forEach(id => {
      if (!validateField(id)) valid = false;
    });

    // Validate consent
    if (!$('#consent').checked) {
      showError('consent', 'Please accept the privacy policy to continue.');
      valid = false;
    }

    if (!valid) {
      const firstErr = form.querySelector('.is-error');
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // ── Loading state ──────────────────────
    submitBtn.disabled = true;
    submitBtn.classList.add('is-loading');
    submitBtn.textContent = 'Submitting…';

    // ── Submit to Web3Forms ────────────────
    try {
      const formData = new FormData(form);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (result.success) {
        // ── Success ──────────────────────
        form.style.transition = 'opacity 0.35s ease';
        form.style.opacity    = '0';
        setTimeout(() => {
          form.hidden    = true;
          success.hidden = false;
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 360);
      } else {
        // ── API returned failure ──────────
        submitBtn.disabled = false;
        submitBtn.classList.remove('is-loading');
        submitBtn.innerHTML = 'Submit My Application <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        alert('Something went wrong. Please try again or email us directly.');
      }
    } catch (err) {
      // ── Network error ─────────────────
      submitBtn.disabled = false;
      submitBtn.classList.remove('is-loading');
      submitBtn.innerHTML = 'Submit My Application <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      console.error('Web3Forms error:', err);
      alert('Network error. Please check your connection and try again.');
    }
  });

  // ── Helpers ───────────────────────────────
  function validateField(id) {
    const rule = rules[id];
    if (!rule) return true;

    const el  = $(`#${id}`);
    if (!el) return true;

    const val = el.value.trim();

    if (rule.required && !val) {
      showError(id, 'This field is required.');
      return false;
    }

    if (val && rule.pattern && !rule.pattern.test(val)) {
      showError(id, rule.msg || 'Please check this field.');
      return false;
    }

    clearError(id);
    return true;
  }

  function showError(id, msg) {
    const el  = $(`#${id}`);
    const err = $(`#${id}Error`);
    if (el)  el.classList.add('is-error');
    if (el && el.closest('.pb-form__checkbox')) el.closest('.pb-form__checkbox').classList.add('is-error');
    if (err) err.textContent = msg;
  }

  function clearError(id) {
    const el  = $(`#${id}`);
    const err = $(`#${id}Error`);
    if (el)  el.classList.remove('is-error');
    if (el && el.closest('.pb-form__checkbox')) el.closest('.pb-form__checkbox').classList.remove('is-error');
    if (err) err.textContent = '';
  }
}

/* ═══════════════════════════════════════════
   FAQ PAGE — tabs + search
═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('faqTabs')) return;
  initFAQPage();
});

function initFAQPage() {
  const tabs      = $$('.faq-tab');
  const groups    = $$('.faq-group');
  const searchEl  = $('#faqSearch');
  const clearBtn  = $('#faqSearchClear');
  const noResults = $('#faqNoResults');
  const termEl    = $('#faqSearchTerm');

  // ── Category tabs ─────────────────────────
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.dataset.category;

      // Update active tab
      tabs.forEach(t => {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });

      // Show/hide groups
      groups.forEach(g => {
        const show = cat === 'all' || g.dataset.category === cat;
        g.hidden = !show;
      });

      // If there's an active search, re-run it within the new category
      if (searchEl.value.trim()) runSearch(searchEl.value.trim());
    });
  });

  // ── Search ────────────────────────────────
  searchEl.addEventListener('input', () => {
    const term = searchEl.value.trim();
    clearBtn.hidden = !term;
    if (term) {
      runSearch(term);
    } else {
      clearSearch();
    }
  });

  clearBtn.addEventListener('click', () => {
    searchEl.value = '';
    clearBtn.hidden = true;
    clearSearch();
    searchEl.focus();
  });

  function runSearch(term) {
    const q    = term.toLowerCase();
    let   hits = 0;

    // Show all groups when searching
    groups.forEach(g => { g.hidden = false; });

    // Reset active tab to 'All' visually
    tabs.forEach(t => {
      t.classList.toggle('is-active', t.dataset.category === 'all');
      t.setAttribute('aria-selected', String(t.dataset.category === 'all'));
    });

    $$('.faq__item').forEach(item => {
      const text = (item.dataset.question || '') + ' ' +
                   (item.querySelector('.faq__question')?.textContent || '') + ' ' +
                   (item.querySelector('.faq__answer')?.textContent || '');
      const match = text.toLowerCase().includes(q);
      item.hidden = !match;
      if (match) hits++;
    });

    // Hide groups that are now all hidden
    groups.forEach(g => {
      const visible = $$('.faq__item:not([hidden])', g).length > 0;
      g.hidden = !visible;
    });

    // No results state
    noResults.hidden = hits > 0;
    if (termEl) termEl.textContent = term;
  }

  function clearSearch() {
    $$('.faq__item').forEach(item => { item.hidden = false; });

    // Restore active tab filter
    const activeTab = tabs.find(t => t.classList.contains('is-active'));
    const cat = activeTab ? activeTab.dataset.category : 'all';
    groups.forEach(g => {
      g.hidden = cat !== 'all' && g.dataset.category !== cat;
    });

    noResults.hidden = true;
  }
}

/* ── AI DEMO ANIMATION ────────────────────────── */
function initAiDemo() {
  const typedEl  = $('#aiDemoTyped');
  const caret    = $('#aiDemoCaret');
  const thinking = $('#aiDemoThinking');
  const response = $('#aiDemoResponse');
  const introEl  = $('#aiDemoIntro');
  const results  = $$('.ai-demo__result');
  const section  = $('.ai-demo--hero');
  if (!typedEl || !section) return;

  // Query / intro pairs that cycle
  const QUERIES = [
    { q: 'Please suggest me the best skincare for my acne',   i: "Here are the top skincare products for acne I'd recommend:" },
    { q: 'Best dermatologist-approved face wash in Mumbai?',  i: 'Based on dermatologist recommendations, here are top picks:' },
    { q: 'What moisturiser works for sensitive oily skin?',   i: 'Here are the moisturisers best suited for sensitive oily skin:' },
    { q: 'Recommend a good sunscreen for Indian skin tone',   i: 'These sunscreens work best for Indian skin tones:' },
    { q: 'Top-rated serum for dark spots and pigmentation',   i: 'Here are the most effective serums for dark spots:' },
    { q: 'Best budget skincare routine for beginners?',       i: "Here's a beginner-friendly skincare routine with top picks:" },
  ];

  // 15% speedup: all base ms values are multiplied by 0.85 before setTimeout
  const S        = 0.85;
  let queryIndex = 0;
  let timers     = [];
  let started    = false;

  function defer(fn, ms) {
    const id = setTimeout(fn, Math.round(ms * S));
    timers.push(id);
  }

  // Human-like typing: slower at word boundaries, faster inside words
  function typeText(text, onDone) {
    let i = 0;
    function nextMs(ch, prev) {
      if (ch === ' ')          return 62 + Math.random() * 38;
      if ('?!.,'.includes(ch)) return 88 + Math.random() * 55;
      if (prev === ' ')        return 50 + Math.random() * 28;
      return 26 + Math.random() * 18;
    }
    function tick() {
      if (i < text.length) {
        typedEl.textContent += text[i];
        const ms = nextMs(text[i], i > 0 ? text[i - 1] : '');
        i++;
        setTimeout(tick, Math.round(ms * S));
      } else {
        onDone();
      }
    }
    setTimeout(tick, 0);
  }

  // Backspace erase
  function eraseText(onDone) {
    function tick() {
      const t = typedEl.textContent;
      if (t.length > 0) {
        typedEl.textContent = t.slice(0, -1);
        setTimeout(tick, Math.round((18 + Math.random() * 12) * S));
      } else {
        onDone();
      }
    }
    setTimeout(tick, 0);
  }

  // ── Phase 1: run once on page load ───────────
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
              // stagger cards in
              results.forEach((card, i) => {
                defer(() => card.classList.add('is-shown'), i * 145);
              });
              // once all cards shown, switch to cycling mode
              defer(() => {
                started = true;
                caret.classList.remove('is-hidden');
                cycleQuery();
              }, results.length * 145 + 510);
            }, 85);   // tiny gap before response appears
          }, 1360);   // thinking dot duration
        }, 272);      // pause after typing → before thinking
      });
    }, 425);          // initial pause
  }

  // ── Phase 2: cycle questions, results stay visible ──
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
              // cross-fade the intro line
              defer(() => {
                introEl.classList.add('is-fading');
                defer(() => {
                  introEl.textContent = entry.i;
                  introEl.classList.remove('is-fading');
                  caret.classList.remove('is-hidden');
                  // hold, then next cycle
                  defer(cycleQuery, 3400);
                }, 210);
              }, 75);
            }, 1360);   // thinking duration
          }, 272);      // pause after typing
        });
      }, 290);          // gap between erase finish and next type
    });
  }

  // Kick off when section enters viewport
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && timers.length === 0) runIntro();
    });
  }, { threshold: 0.1 });

  io.observe(section);
}

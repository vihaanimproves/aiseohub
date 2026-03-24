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
  form.addEventListener('submit', e => {
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
      // Scroll to first error
      const firstErr = form.querySelector('.is-error');
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // ── Save to localStorage ──────────────
    const data = {
      fullName:  $('#fullName').value.trim(),
      phone:     $('#phone').value.trim(),
      company:   $('#company').value.trim(),
      email:     $('#email').value.trim(),
      website:   $('#website').value.trim(),
      city:      $('#city').value.trim(),
      category:  $('#category').value,
      teamSize:  $('#teamSize').value,
      budget:    $('#budget').value,
      source:    $('#source').value,
      challenge: $('#challenge').value.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('aiseohub_leads') || '[]');
      existing.push(data);
      localStorage.setItem('aiseohub_leads', JSON.stringify(existing));
      console.log('Lead saved. Total:', existing.length, data);
    } catch (err) {
      console.warn('localStorage unavailable:', err);
    }

    // ── Show success ──────────────────────
    submitBtn.classList.add('is-loading');

    setTimeout(() => {
      form.style.transition = 'opacity 0.35s ease';
      form.style.opacity = '0';
      setTimeout(() => {
        form.hidden = true;
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 360);
    }, 600);
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

/* ═══════════════════════════════════════════════════════════════
   AutoBot — Professional Car Robot Website JS
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── Navbar scroll effect ── */
const navbar = document.getElementById('navbar');
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 20);
  backTop.classList.toggle('visible', y > 400);
}, { passive: true });

/* ── Hamburger menu ── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const open = navLinks.classList.contains('open');
  navToggle.setAttribute('aria-expanded', open);
  // Animate burger → X
  const spans = navToggle.querySelectorAll('span');
  if (open) {
    spans[0].style.cssText = 'transform: translateY(7px) rotate(45deg)';
    spans[1].style.cssText = 'opacity: 0; transform: scaleX(0)';
    spans[2].style.cssText = 'transform: translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => (s.style.cssText = ''));
  }
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(s => (s.style.cssText = ''));
  });
});

/* ── Smooth active nav link ── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveNav() {
  const scrollMid = window.scrollY + window.innerHeight / 2;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollMid >= top && scrollMid < bottom) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const target = document.querySelector(`.nav-links a[href="#${section.id}"]`);
      if (target) target.classList.add('active');
    }
  });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });

/* ── Scroll-reveal animations ── */
const animateEls = document.querySelectorAll('[data-animate]');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay for grid siblings
        const siblings = [...entry.target.parentElement.children]
          .filter(el => el.hasAttribute('data-animate'));
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 80}ms`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
animateEls.forEach(el => revealObserver.observe(el));

/* ── Feature tabs ── */
const featTabs   = document.querySelectorAll('.feat-tab');
const featPanels = document.querySelectorAll('.feat-panel');

featTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const panelId = tab.dataset.tab;

    featTabs.forEach(t => t.classList.remove('active'));
    featPanels.forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    const target = document.querySelector(`.feat-panel[data-panel="${panelId}"]`);
    if (target) target.classList.add('active');
  });
});

/* ── Copy code button ── */
window.copyCode = function(btn) {
  const pre = btn.closest('.feat-code-wrapper').querySelector('.code-block');
  const text = pre.textContent;
  navigator.clipboard.writeText(text).then(() => {
    const svg = btn.innerHTML;
    btn.innerHTML = '✅ Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.innerHTML = svg;
      btn.classList.remove('copied');
    }, 2000);
  }).catch(() => {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'absolute';
    ta.style.opacity  = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    btn.textContent = '✅ Copied!';
    setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
  });
};

/* ── Back to top ── */
backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Contact form ── */
window.handleForm = function(e) {
  e.preventDefault();
  const form    = e.target;
  const btn     = form.querySelector('.form-submit');
  const success = document.getElementById('formSuccess');

  btn.disabled = true;
  btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="30" stroke-dashoffset="0"><animateTransform attributeType="XML" attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur=".8s" repeatCount="indefinite"/></circle></svg> Sending…';

  // Simulate async send
  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = '<svg viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884zM18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" fill="currentColor"/></svg> Send Message';
    success.style.display = 'block';
    form.reset();
    setTimeout(() => { success.style.display = 'none'; }, 4000);
  }, 1200);
};

/* ── Typed hero text animation ── */
const gradientText = document.querySelector('.hero-title .gradient-text');
if (gradientText) {
  const words = ['Car Robot', 'AutoBot', 'Smart Vehicle', 'Innovation'];
  let wordIdx = 0;
  let charIdx = 0;
  let deleting = false;

  const typeInterval = setInterval(() => {
    const current = words[wordIdx];
    if (!deleting) {
      gradientText.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        clearInterval(typeInterval);
        // Stay on the final word permanently (no loop for professionalism)
      }
    }
  }, 80);
}

/* ── Stats counter animation ── */
const statNums = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el  = entry.target;
      const raw = el.textContent.trim();
      const num = parseFloat(raw);
      const suffix = raw.replace(/[\d.]/g, '').trim(); // '+', etc.
      if (!isNaN(num)) {
        let start = 0;
        const step = num / 40;
        const timer = setInterval(() => {
          start = Math.min(start + step, num);
          el.textContent = (Number.isInteger(num) ? Math.round(start) : start.toFixed(0)) + suffix;
          if (start >= num) clearInterval(timer);
        }, 30);
      }
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => counterObserver.observe(el));

/* ── Gallery lightbox (simple) ── */
const galleryItems = document.querySelectorAll('.gallery-item');
// Future: add real lightbox when photos are added
galleryItems.forEach(item => {
  item.setAttribute('tabindex', '0');
  item.setAttribute('role', 'button');
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') item.click();
  });
});

/* ── Parallax subtle hero ── */
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroBg.style.transform = `translateY(${y * 0.3}px)`;
    }
  }, { passive: true });
}

/* ── Floating labels subtle random drift ── */
const floatLabels = document.querySelectorAll('.float-label');
floatLabels.forEach((label, i) => {
  const delay = i * 600;
  label.style.animationDelay = `${delay}ms`;
});

/* ── On load ── */
window.addEventListener('DOMContentLoaded', () => {
  // Mark navbar as scrolled if page loads mid-scroll
  if (window.scrollY > 20) navbar.classList.add('scrolled');
  updateActiveNav();
});

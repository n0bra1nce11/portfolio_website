/* =========================================================
   PORTFOLIO SCRIPT
   Every behaviour is its own named function, all wired up
   from a single DOMContentLoaded entry point at the bottom.
   ========================================================= */

/* ---------- Theme toggle ---------- */
function initThemeToggle() {
  const root = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');
  const stored = window.__portfolioTheme;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (prefersDark ? 'light' : 'dark');

  applyTheme(initial);

  toggleBtn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });

  function applyTheme(mode) {
    root.setAttribute('data-theme', mode);
    window.__portfolioTheme = mode;
    toggleBtn.setAttribute('aria-pressed', String(mode === 'dark'));
  }
}

/* ---------- Preloader ---------- */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const fill = document.getElementById('preloaderFill');
  const pct = document.getElementById('preloaderPct');
  document.body.classList.add('no-scroll');

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 6;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('is-hidden');
        document.body.classList.remove('no-scroll');
      }, 250);
    }
    fill.style.width = progress + '%';
    pct.textContent = Math.floor(progress) + '%';
  }, 140);
}

/* ---------- Mobile nav ---------- */
function initMobileNav() {
  const burger = document.getElementById('navBurger');
  const nav = document.getElementById('navMenu');

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    burger.classList.toggle('is-open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    document.body.classList.toggle('no-scroll', isOpen);
  });

  nav.querySelectorAll('.navbar__link').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    });
  });
}

/* ---------- Navbar scroll state ---------- */
function initNavbarScrollState() {
  const navbar = document.getElementById('navbar');
  const onScroll = () => navbar.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Scroll spy ---------- */
function initScrollSpy() {
  const links = Array.from(document.querySelectorAll('[data-nav]'));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = '#' + entry.target.id;
        links.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === id);
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- Smooth scrolling with navbar offset ---------- */
function initSmoothScroll() {
  const navbarHeight = document.getElementById('navbar').offsetHeight;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ---------- Reveal-on-scroll ---------- */
function initRevealAnimations() {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'), index % 6 * 60);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((item) => observer.observe(item));
}

/* ---------- Stat counters ---------- */
function initStatCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((counter) => observer.observe(counter));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1200;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(frame);
  }
}

/* ---------- Ops Console ---------- */
function initOpsConsole() {
  const log = document.getElementById('consoleLog');
  const input = document.getElementById('consoleInput');
  const consoleWrap = document.getElementById('opsConsole');
  if (!log || !input) return;

  const history = [];
  let historyIndex = -1;

  const commands = {
    help() {
      return [
        'Available commands:',
        '  help      show this list',
        '  whoami    print operator identity',
        '  skills    list core skill areas',
        '  projects  list featured projects',
        '  contact   show contact info',
        '  theme     toggle light/dark theme',
        '  clear     clear the console log',
      ];
    },
    whoami() {
      return [
        'aayush shrestha',
        'role: penetration tester / it auditor',
        'org: himalayan integrated cloud technologies',
        'based: kathmandu, nepal',
      ];
    },
    skills() {
      return [
        'offensive  : VAPT, web exploitation, reverse engineering',
        'defensive  : SIEM, ISO 27001 auditing, incident response',
        'tooling    : nmap, burp suite, metasploit, wazuh, docker',
        'languages  : python, bash, c/c++',
      ];
    },
    projects() {
      return [
        '1. Command & Control Framework',
        '2. Cryptography-Based E-Voting System',
        '3. Intrusion Detection System',
        '4. Web Enumeration Tool',
        '5. Three-Tier Network Architecture',
      ];
    },
    contact() {
      return [
        'email    : aayushng@gmail.com',
        'phone    : +977-9848445119',
        'linkedin : linkedin.com/in/aayush-shrestha-3379aa165',
      ];
    },
    theme() {
      document.getElementById('themeToggle').click();
      return ['theme toggled.'];
    },
    clear() {
      log.innerHTML = '';
      return [];
    },
  };

  function appendLine(text, cls) {
    const p = document.createElement('p');
    p.className = 'terminal__line' + (cls ? ' ' + cls : '');
    p.textContent = text;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
  }

  function runCommand(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    appendLine('guest@aayushng:~$ ' + trimmed);
    history.push(trimmed);
    historyIndex = history.length;

    const cmd = trimmed.toLowerCase();
    if (commands[cmd]) {
      commands[cmd]().forEach((line) => appendLine(line, 'ok'));
    } else {
      appendLine('command not found: ' + trimmed, 'err');
    }
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      runCommand(input.value);
      input.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = history[historyIndex] || '';
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex] || '';
      } else {
        historyIndex = history.length;
        input.value = '';
      }
    }
  });

  consoleWrap.addEventListener('click', () => input.focus());
}

/* ---------- Project filtering ---------- */
function initProjectFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.getAttribute('data-filter');

      cards.forEach((card) => {
        const matches = filter === 'all' || card.getAttribute('data-category') === filter;
        card.classList.toggle('is-hidden', !matches);
      });
    });
  });
}

/* ---------- Toast ---------- */
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  toastMessage.textContent = message;
  toast.classList.add('is-visible');

  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove('is-visible'), 5000);
}

function initToastClose() {
  const toast = document.getElementById('toast');
  const closeBtn = document.getElementById('toastClose');
  closeBtn.addEventListener('click', () => toast.classList.remove('is-visible'));
}

/* ---------- Back to top ---------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  const onScroll = () => btn.classList.toggle('is-visible', window.scrollY > 400);
  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  onScroll();
}

/* ---------- Footer year ---------- */
function initFooterYear() {
  document.getElementById('footerYear').textContent = new Date().getFullYear();
}

/* ---------- Dossier live clock ---------- */
function initDossierClock() {
  const clock = document.getElementById('dossierClock');
  if (!clock) return;

  function tick() {
    clock.textContent = new Date().toLocaleTimeString('en-GB', { hour12: false });
  }
  tick();
  setInterval(tick, 1000);
}

/* ---------- Entry point ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initThemeToggle();
  initMobileNav();
  initNavbarScrollState();
  initScrollSpy();
  initSmoothScroll();
  initRevealAnimations();
  initDossierClock();
  initStatCounters();
  initOpsConsole();
  initProjectFilter();
  initToastClose();
  initBackToTop();
  initFooterYear();
});

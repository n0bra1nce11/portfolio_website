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
  const initial = stored || (prefersDark ? 'dark' : 'light');

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

/* ---------- Hero typewriter ---------- */
function initHeroTypewriter() {
  const el = document.getElementById('heroTypewriter');
  if (!el) return;

  const commands = [
    'nmap -sV -p- target.lab',
    'whoami --role pentester',
    'auditctl --scope iso27001 --controls 93',
    'python3 enum_web.py --target scope.txt',
  ];

  let cmdIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = commands[cmdIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1400);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        cmdIndex = (cmdIndex + 1) % commands.length;
      }
    }
    setTimeout(tick, deleting ? 28 : 55);
  }

  tick();
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

/* ---------- Skill bar fill on view ---------- */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const bar = entry.target;
        const level = bar.getAttribute('data-level');
        const fill = bar.querySelector('.skill-bar__fill');
        requestAnimationFrame(() => { fill.style.width = level + '%'; });
        observer.unobserve(bar);
      });
    },
    { threshold: 0.4 }
  );
  bars.forEach((bar) => observer.observe(bar));
}

/* ---------- Threat matrix (Security Pulse Board) ---------- */
function initThreatMatrix() {
  const matrixEl = document.getElementById('threatMatrix');
  if (!matrixEl) return;

  const vectors = [
    'Phishing Vector', 'SQL Injection', 'XSS Payload', 'Privilege Escalation',
    'Misconfigured Firewall', 'Weak Credentials', 'Unpatched CVE', 'Insider Threat',
    'Ransomware Signature', 'DNS Spoofing', 'Session Hijack', 'API Abuse',
    'Supply Chain Risk', 'Broken Access Control', 'Malicious Macro', 'Lateral Movement',
  ];

  const rows = 5;
  const cols = 8;
  const cellCount = rows * cols;

  const tooltip = document.createElement('div');
  tooltip.className = 'matrix-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  document.body.appendChild(tooltip);

  for (let i = 0; i < cellCount; i++) {
    const severity = Math.random();
    const confidence = Math.round(40 + Math.random() * 59);
    const impact = severity > 0.66 ? 'High' : severity > 0.33 ? 'Medium' : 'Low';
    const vector = vectors[Math.floor(Math.random() * vectors.length)];

    const cell = document.createElement('div');
    cell.className = 'matrix-cell';
    cell.style.opacity = String(0.18 + severity * 0.8);
    cell.tabIndex = 0;
    cell.setAttribute('aria-label', vector + ', confidence ' + confidence + '%, impact ' + impact);

    cell.addEventListener('mouseenter', (e) => showTooltip(e, vector, confidence, impact));
    cell.addEventListener('mousemove', (e) => positionTooltip(e));
    cell.addEventListener('mouseleave', hideTooltip);
    cell.addEventListener('focus', (e) => showTooltip(e, vector, confidence, impact));
    cell.addEventListener('blur', hideTooltip);

    matrixEl.appendChild(cell);
  }

  function showTooltip(e, vector, confidence, impact) {
    tooltip.innerHTML = '<strong>' + vector + '</strong>Confidence: ' + confidence + '%<br>Impact: ' + impact;
    tooltip.classList.add('is-visible');
    positionTooltip(e);
  }

  function positionTooltip(e) {
    const rect = e.target.getBoundingClientRect();
    let x = rect.left + rect.width / 2;
    let y = rect.top - 12;
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
    tooltip.style.transform = 'translate(-50%, -100%)';
  }

  function hideTooltip() {
    tooltip.classList.remove('is-visible');
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

/* ---------- Contact form validation + toast ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameField = document.getElementById('contactName');
  const emailField = document.getElementById('contactEmail');
  const messageField = document.getElementById('contactMessage');
  const errorName = document.getElementById('errorName');
  const errorEmail = document.getElementById('errorEmail');
  const errorMessage = document.getElementById('errorMessage');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    valid = validateField(nameField, errorName, nameField.value.trim().length >= 2, 'Please enter your name.') && valid;
    valid = validateField(emailField, errorEmail, isValidEmail(emailField.value.trim()), 'Please enter a valid email address.') && valid;
    valid = validateField(messageField, errorMessage, messageField.value.trim().length >= 10, 'Message should be at least 10 characters.') && valid;

    if (valid) {
      showToast('Message sent — thanks for reaching out. I\'ll reply soon.');
      form.reset();
    }
  });

  function validateField(field, errorEl, isValid, message) {
    const wrapper = field.closest('.form-field');
    wrapper.classList.toggle('has-error', !isValid);
    errorEl.textContent = isValid ? '' : message;
    return isValid;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
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

/* ---------- Entry point ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initThemeToggle();
  initMobileNav();
  initNavbarScrollState();
  initScrollSpy();
  initSmoothScroll();
  initRevealAnimations();
  initHeroTypewriter();
  initStatCounters();
  initSkillBars();
  initThreatMatrix();
  initOpsConsole();
  initProjectFilter();
  initContactForm();
  initToastClose();
  initBackToTop();
  initFooterYear();
});

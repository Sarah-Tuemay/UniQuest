/* ============================================
   UniQuest - Shared JavaScript Utilities
   ============================================ */

// ---- Auth helpers (localStorage-based) ----
const UQAuth = {
  KEY: 'uq_user',

  /** Save user object after sign-in */
  save(user) {
    localStorage.setItem(this.KEY, JSON.stringify(user));
  },

  /** Get current user or null */
  get() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || null;
    } catch {
      return null;
    }
  },

  /** Clear session (sign-out) */
  clear() {
    localStorage.removeItem(this.KEY);
  },

  /** Is someone signed in? */
  isLoggedIn() {
    return this.get() !== null;
  },
};

// Expose globally
window.UQAuth = UQAuth;

// ---- Dynamic navbar based on auth state ----
(function initAuthNav() {
  const user = UQAuth.get();

  // Determine path prefix for links (root vs pages/)
  const inPages = window.location.pathname.includes('/pages/');
  const prefix  = inPages ? '' : 'frontend/pages/';
  const homeHref = inPages ? '../../index.html' : 'index.html';

  // Build nav HTML
  const navLinks  = document.querySelector('.nav-links');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!navLinks || !mobileNav) return;

  const path = window.location.pathname;

  function isActive(page) {
    return path.endsWith(page) ? 'class="active"' : '';
  }

  if (user) {
    // Logged-in nav — no Sign Out button here, just Home / Jobs / Profile link
    const loggedInLinks = `
      <a href="${homeHref}" ${isActive('index.html')}>Home</a>
      <a href="${prefix}jobs.html" ${isActive('jobs.html')}>Jobs</a>
      <a href="${prefix}account.html" class="btn-nav" ${isActive('account.html')}>
        <i class="fa-solid fa-circle-user"></i> Profile
      </a>
    `;
    navLinks.innerHTML  = loggedInLinks;
    mobileNav.innerHTML = loggedInLinks;

    // Handle sign-out buttons that exist on individual pages (account page)
    document.querySelectorAll('.sign-out-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        UQAuth.clear();
        window.location.href = homeHref;
      });
    });

  } else {
    // Logged-out nav
    navLinks.innerHTML = `
      <a href="${homeHref}" ${isActive('index.html')}>Home</a>
      <a href="${prefix}jobs.html" ${isActive('jobs.html')}>Jobs</a>
      <a href="${prefix}profile.html" ${isActive('profile.html')}>Profile</a>
      <a href="${prefix}login.html" class="btn-nav" ${isActive('login.html')}>Sign In</a>
    `;
    mobileNav.innerHTML = `
      <a href="${homeHref}">Home</a>
      <a href="${prefix}jobs.html">Jobs</a>
      <a href="${prefix}profile.html">Profile</a>
      <a href="${prefix}login.html">Sign In</a>
    `;
  }
})();

// ---- Hamburger / Mobile Nav ----
(function initNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    const bars = hamburger.querySelectorAll('span');
    if (isOpen) {
      bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      bars[1].style.opacity   = '0';
      bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    }
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    }
  });

  hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hamburger.click(); }
  });
})();

// ---- Logo click → home ----
(function initLogo() {
  document.querySelectorAll('.logo').forEach(logo => {
    logo.addEventListener('click', () => {
      const isInPages = window.location.pathname.includes('/pages/');
      window.location.href = isInPages ? '../../index.html' : 'index.html';
    });
  });
})();

// ---- Toast notification ----
function showToast(message, type = 'default', duration = 3500) {
  let toast = document.getElementById('uq-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'uq-toast';
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? 'fa-circle-check'
             : type === 'error'   ? 'fa-circle-xmark'
             : 'fa-circle-info';
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> ${message}`;
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

// ---- Scroll-reveal ----
(function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ---- Expose utilities globally ----
window.UniQuest = { showToast };

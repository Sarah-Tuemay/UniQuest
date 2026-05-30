/* ============================================
   UniQuest - Homepage JavaScript
   ============================================ */

// ---- Step cards navigation ----
const stepProfile = document.getElementById('stepProfile');
const stepJobs    = document.getElementById('stepJobs');
const stepApply   = document.getElementById('stepApply');

if (stepProfile) {
  stepProfile.addEventListener('click', () => { window.location.href = 'frontend/pages/profile.html'; });
  stepProfile.addEventListener('keydown', e => { if (e.key === 'Enter') stepProfile.click(); });
}
if (stepJobs) {
  stepJobs.addEventListener('click', () => { window.location.href = 'frontend/pages/jobs.html'; });
  stepJobs.addEventListener('keydown', e => { if (e.key === 'Enter') stepJobs.click(); });
}
if (stepApply) {
  stepApply.addEventListener('click', () => { window.location.href = 'frontend/pages/jobs.html'; });
  stepApply.addEventListener('keydown', e => { if (e.key === 'Enter') stepApply.click(); });
}

// ---- Animate stats counter ----
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target + (el.dataset.suffix || '');
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + (el.dataset.suffix || '');
    }
  }, 16);
}

// Trigger counters when hero stats come into view
const statsEl = document.querySelector('.hero-stats');
if (statsEl && 'IntersectionObserver' in window) {
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.stat strong').forEach(el => {
        const raw = el.textContent.replace(/\D/g, '');
        const suffix = el.textContent.replace(/\d/g, '');
        el.dataset.suffix = suffix;
        animateCounter(el, parseInt(raw), 1200);
      });
      obs.disconnect();
    }
  }, { threshold: 0.5 });
  obs.observe(statsEl);
}

// ---- Scroll-reveal for sections ----
document.querySelectorAll('.feature-card, .step-card, .job-card').forEach((el, i) => {
  el.style.animationDelay = `${i * 0.08}s`;
  el.classList.add('animate-fadeInUp');
});

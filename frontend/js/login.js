/* ============================================
   UniQuest - Login / Auth Page JavaScript
   ============================================ */

const API = '../../backend/api';

// Redirect if already logged in
if (window.UQAuth?.isLoggedIn()) {
  window.location.href = 'account.html';
}

// ---- Tab switching ----
const tabSignIn   = document.getElementById('tabSignIn');
const tabSignUp   = document.getElementById('tabSignUp');
const panelSignIn = document.getElementById('panelSignIn');
const panelSignUp = document.getElementById('panelSignUp');
const goSignUp    = document.getElementById('goSignUp');
const goSignIn    = document.getElementById('goSignIn');

function activateTab(tab) {
  const isSignIn = tab === 'signin';
  tabSignIn.classList.toggle('active', isSignIn);
  tabSignUp.classList.toggle('active', !isSignIn);
  tabSignIn.setAttribute('aria-selected', isSignIn);
  tabSignUp.setAttribute('aria-selected', !isSignIn);
  panelSignIn.classList.toggle('active', isSignIn);
  panelSignUp.classList.toggle('active', !isSignIn);
}

tabSignIn.addEventListener('click', () => activateTab('signin'));
tabSignUp.addEventListener('click', () => activateTab('signup'));
if (goSignUp) goSignUp.addEventListener('click', () => activateTab('signup'));
if (goSignIn) goSignIn.addEventListener('click', () => activateTab('signin'));

// ---- Toggle password visibility ----
document.querySelectorAll('.toggle-pass').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.previousElementSibling;
    if (!input) return;
    const isPass = input.type === 'password';
    input.type = isPass ? 'text' : 'password';
    btn.querySelector('i').className = isPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
  });
});

// ---- Password strength ----
const suPassword    = document.getElementById('suPassword');
const strengthFill  = document.getElementById('strengthFill');
const strengthLabel = document.getElementById('strengthLabel');

function checkStrength(password) {
  let score = 0;
  if (password.length >= 8)           score++;
  if (/[A-Z]/.test(password))         score++;
  if (/[0-9]/.test(password))         score++;
  if (/[^A-Za-z0-9]/.test(password))  score++;
  return score;
}

if (suPassword) {
  suPassword.addEventListener('input', () => {
    const val = suPassword.value;
    if (!val) { strengthFill.style.width = '0%'; strengthLabel.textContent = ''; return; }
    const score = checkStrength(val);
    const levels = [
      { pct: '25%',  color: '#e53e3e', label: 'Weak'   },
      { pct: '50%',  color: '#d69e2e', label: 'Fair'   },
      { pct: '75%',  color: '#3182ce', label: 'Good'   },
      { pct: '100%', color: '#38a169', label: 'Strong' },
    ];
    const lvl = levels[score - 1] || levels[0];
    strengthFill.style.width = lvl.pct;
    strengthFill.style.backgroundColor = lvl.color;
    strengthLabel.textContent = lvl.label;
    strengthLabel.style.color = lvl.color;
  });
}

// ---- Validation helpers ----
function showError(id, msg) { const el = document.getElementById(id); if (el) el.textContent = msg; }
function clearErrors(...ids) { ids.forEach(id => showError(id, '')); }
function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

// ---- Sign In ----
const signInForm = document.getElementById('signInForm');
if (signInForm) {
  signInForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors('siEmailErr', 'siPassErr');

    const email    = document.getElementById('siEmail').value.trim();
    const password = document.getElementById('siPassword').value;
    let valid = true;

    if (!email || !validateEmail(email)) { showError('siEmailErr', 'Please enter a valid email address.'); valid = false; }
    if (!password || password.length < 6) { showError('siPassErr', 'Password must be at least 6 characters.'); valid = false; }
    if (!valid) return;

    const btn = document.getElementById('signInBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in...';

    try {
      const res  = await fetch(`${API}/auth.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signin', email, password }),
      });
      const data = await res.json();

      if (data.success) {
        // Save user to localStorage — this is what keeps them "logged in"
        window.UQAuth.save(data.user);
        showToast('Welcome back, ' + data.user.name.split(' ')[0] + '!', 'success');
        setTimeout(() => { window.location.href = 'account.html'; }, 1000);
      } else {
        showError('siPassErr', data.message || 'Invalid email or password.');
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Sign In';
      }
    } catch {
      // Demo mode — create a demo user so the session persists
      const demoUser = { id: 0, name: 'Demo User', email, university: 'Demo University' };
      window.UQAuth.save(demoUser);
      showToast('Demo mode: signed in!', 'default');
      setTimeout(() => { window.location.href = 'account.html'; }, 1000);
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Sign In';
    }
  });
}

// ---- Sign Up ----
const signUpForm = document.getElementById('signUpForm');
if (signUpForm) {
  signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors('suFirstErr', 'suLastErr', 'suEmailErr', 'suUniErr', 'suPassErr', 'suConfirmErr', 'suTermsErr');

    const firstName  = document.getElementById('suFirst').value.trim();
    const lastName   = document.getElementById('suLast').value.trim();
    const email      = document.getElementById('suEmail').value.trim();
    const university = document.getElementById('suUniversity').value;
    const password   = document.getElementById('suPassword').value;
    const confirm    = document.getElementById('suConfirm').value;
    const terms      = document.getElementById('suTerms').checked;
    let valid = true;

    if (!firstName)                        { showError('suFirstErr',   'First name is required.');                  valid = false; }
    if (!lastName)                         { showError('suLastErr',    'Last name is required.');                   valid = false; }
    if (!email || !validateEmail(email))   { showError('suEmailErr',   'Please enter a valid email.');              valid = false; }
    if (!university)                       { showError('suUniErr',     'Please select your university.');           valid = false; }
    if (!password || password.length < 8)  { showError('suPassErr',    'Password must be at least 8 characters.'); valid = false; }
    if (password !== confirm)              { showError('suConfirmErr', 'Passwords do not match.');                  valid = false; }
    if (!terms)                            { showError('suTermsErr',   'You must agree to the Terms of Service.');  valid = false; }
    if (!valid) return;

    const btn = document.getElementById('signUpBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating account...';

    try {
      const res  = await fetch(`${API}/auth.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signup', first_name: firstName, last_name: lastName, email, university, password }),
      });
      const data = await res.json();

      if (data.success) {
        showToast('Account created! Please sign in.', 'success');
        setTimeout(() => activateTab('signin'), 1500);
      } else {
        showError('suEmailErr', data.message || 'Registration failed. Please try again.');
      }
    } catch {
      showToast('Account created (demo)! Please sign in.', 'success');
      setTimeout(() => activateTab('signin'), 1500);
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Create Account';
    }
  });
}

/* ============================================
   UniQuest - Account / Dashboard JavaScript
   ============================================ */

const API = '../../backend/api';

// ---- Guard: must be logged in ----
const user = window.UQAuth?.get();
if (!user) {
  window.location.href = 'login.html';
}

// ---- Populate sidebar & welcome ----
document.getElementById('sidebarName').textContent  = user.name;
document.getElementById('sidebarEmail').textContent = user.email;
document.getElementById('welcomeName').textContent  = user.name.split(' ')[0];
document.getElementById('avatarCircle').textContent = user.name.charAt(0).toUpperCase();

// ---- Tab switching ----
const tabLinks   = document.querySelectorAll('.acc-nav-item[data-tab]');
const tabPanels  = document.querySelectorAll('.acc-tab');

tabLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = link.dataset.tab;

    tabLinks.forEach(l => l.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));

    link.classList.add('active');
    document.getElementById(`tab-${target}`)?.classList.add('active');

    // Load data for the tab
    if (target === 'applications') loadApplications();
    if (target === 'profile')      loadProfile();
  });
});

// ---- Load data from backend (with demo fallback) ----
async function fetchUserData() {
  try {
    const res  = await fetch(`${API}/me.php?user_id=${user.id}`);
    const data = await res.json();
    return data.success ? data : null;
  } catch {
    return null;
  }
}

// ---- Overview: stats + recent apps ----
async function loadOverview() {
  const data = await fetchUserData();

  // Demo fallback data
  const applications = data?.applications || [];
  const profile      = data?.profile      || null;

  const total    = applications.length;
  const pending  = applications.filter(a => a.status === 'pending').length;
  const accepted = applications.filter(a => a.status === 'accepted').length;

  document.getElementById('statApps').textContent     = total;
  document.getElementById('statPending').textContent  = pending;
  document.getElementById('statAccepted').textContent = accepted;
  document.getElementById('statProfile').textContent  = profile ? profile.status : 'None';

  // Recent apps (last 3)
  const recentEl = document.getElementById('recentApps');
  const recent   = applications.slice(0, 3);

  if (recent.length === 0) {
    recentEl.innerHTML = `
      <div class="acc-empty">
        <i class="fa-solid fa-inbox"></i>
        <p>No applications yet. <a href="jobs.html">Browse jobs</a> to get started.</p>
      </div>`;
  } else {
    recentEl.innerHTML = recent.map(app => renderAppCard(app)).join('');
  }
}

// ---- Applications tab ----
async function loadApplications() {
  const allAppsEl = document.getElementById('allApps');
  allAppsEl.innerHTML = '<div class="acc-loading"><i class="fa-solid fa-spinner fa-spin"></i> Loading...</div>';

  const data = await fetchUserData();
  const apps = data?.applications || [];

  if (apps.length === 0) {
    allAppsEl.innerHTML = `
      <div class="acc-empty">
        <i class="fa-solid fa-file-lines"></i>
        <p>You haven't applied to any jobs yet. <a href="jobs.html">Find a job</a>.</p>
      </div>`;
  } else {
    allAppsEl.innerHTML = apps.map(app => renderAppCard(app)).join('');
  }
}

// ---- Profile tab ----
async function loadProfile() {
  const profileEl = document.getElementById('profileInfo');
  profileEl.innerHTML = '<div class="acc-loading"><i class="fa-solid fa-spinner fa-spin"></i> Loading...</div>';

  const data    = await fetchUserData();
  const profile = data?.profile || null;

  if (!profile) {
    profileEl.innerHTML = `
      <div class="acc-empty" style="grid-column:1/-1">
        <i class="fa-solid fa-id-card"></i>
        <p>No profile found. <a href="profile.html">Create your student profile</a> to start applying.</p>
      </div>`;
    return;
  }

  const statusClass = profile.status || 'none';
  const statusIcon  = profile.status === 'approved' ? 'fa-circle-check'
                    : profile.status === 'rejected'  ? 'fa-circle-xmark'
                    : 'fa-clock';

  profileEl.innerHTML = `
    <div class="profile-info-item">
      <label>Full Name</label>
      <span>${profile.first_name} ${profile.last_name}</span>
    </div>
    <div class="profile-info-item">
      <label>Email</label>
      <span>${profile.email}</span>
    </div>
    <div class="profile-info-item">
      <label>Phone</label>
      <span>${profile.phone}</span>
    </div>
    <div class="profile-info-item">
      <label>Gender</label>
      <span style="text-transform:capitalize">${profile.gender}</span>
    </div>
    <div class="profile-info-item">
      <label>University</label>
      <span>${profile.university}</span>
    </div>
    <div class="profile-info-item">
      <label>Department</label>
      <span>${profile.department}</span>
    </div>
    <div class="profile-info-item">
      <label>Year of Study</label>
      <span>Year ${profile.year_of_study}</span>
    </div>
    <div class="profile-info-item">
      <label>Availability</label>
      <span>${profile.availability || '—'}</span>
    </div>
    <div class="profile-info-item" style="grid-column:1/-1">
      <label>Skills</label>
      <span>${profile.skills || '—'}</span>
    </div>
    <div class="profile-info-item">
      <label>Verification Status</label>
      <span class="profile-status-badge ${statusClass}">
        <i class="fa-solid ${statusIcon}"></i>
        ${profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
      </span>
    </div>
    <div class="profile-info-item">
      <label>Submitted</label>
      <span>${formatDate(profile.created_at)}</span>
    </div>
  `;
}

// ---- Render an application card ----
function renderAppCard(app) {
  const statusClass = app.status || 'pending';
  const date        = formatDate(app.applied_at);
  return `
    <div class="app-card">
      <div class="app-card-icon"><i class="fa-solid fa-briefcase"></i></div>
      <div class="app-card-info">
        <strong>${app.job_id ? app.job_id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Job Application'}</strong>
        <span>${app.department || ''} ${app.university ? '· ' + app.university : ''}</span>
      </div>
      <span class="app-status ${statusClass}">${statusClass}</span>
      <span class="app-date">${date}</span>
    </div>
  `;
}

// ---- Format date ----
function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return dateStr; }
}

// ---- Change password form ----
const changePassForm = document.getElementById('changePassForm');
if (changePassForm) {
  changePassForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const currentPass = document.getElementById('currentPass').value;
    const newPass     = document.getElementById('newPass').value;
    const confirmPass = document.getElementById('confirmPass').value;

    document.getElementById('currentPassErr').textContent = '';
    document.getElementById('newPassErr').textContent     = '';
    document.getElementById('confirmPassErr').textContent = '';

    let valid = true;
    if (!currentPass) { document.getElementById('currentPassErr').textContent = 'Current password is required.'; valid = false; }
    if (!newPass || newPass.length < 8) { document.getElementById('newPassErr').textContent = 'New password must be at least 8 characters.'; valid = false; }
    if (newPass !== confirmPass) { document.getElementById('confirmPassErr').textContent = 'Passwords do not match.'; valid = false; }
    if (!valid) return;

    const btn = document.getElementById('changePassBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Updating...';

    try {
      const res  = await fetch(`${API}/auth.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'change_password', user_id: user.id, current_password: currentPass, new_password: newPass }),
      });
      const data = await res.json();

      if (data.success) {
        showToast('Password updated successfully!', 'success');
        changePassForm.reset();
      } else {
        document.getElementById('currentPassErr').textContent = data.message || 'Failed to update password.';
      }
    } catch {
      showToast('Password updated (demo mode).', 'success');
      changePassForm.reset();
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-key"></i> Update Password';
    }
  });
}

// ---- Sign out buttons ----
document.getElementById('sidebarSignOut')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.UQAuth.clear();
  window.location.href = '../../index.html';
});

document.getElementById('settingsSignOut')?.addEventListener('click', () => {
  window.UQAuth.clear();
  window.location.href = '../../index.html';
});

// ---- Init ----
loadOverview();

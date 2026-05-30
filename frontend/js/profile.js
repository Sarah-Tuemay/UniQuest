/* ============================================
   UniQuest - Profile Page JavaScript
   ============================================ */

const API = '../../backend/api';

let currentStep = 1;

// ---- Step navigation ----
function goToStep(n) {
  document.getElementById(`step${currentStep}`)?.classList.remove('active');
  document.querySelector(`.step-item[data-step="${currentStep}"]`)?.classList.remove('active');
  document.querySelector(`.step-item[data-step="${currentStep}"]`)?.classList.add('done');

  currentStep = n;

  document.getElementById(`step${currentStep}`)?.classList.add('active');
  document.querySelector(`.step-item[data-step="${currentStep}"]`)?.classList.add('active');
  document.querySelector(`.step-item[data-step="${currentStep}"]`)?.classList.remove('done');

  document.querySelector('.profile-form-wrap')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---- Validation helpers ----
function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}
function clearErrors(...ids) { ids.forEach(id => showError(id, '')); }
function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function validatePhone(phone) { return /^09[0-9]{8}$/.test(phone); }

// ---- Step 1 ----
document.getElementById('next1')?.addEventListener('click', () => {
  clearErrors('firstNameErr', 'lastNameErr', 'emailErr', 'phoneErr', 'genderErr');
  const firstName = document.getElementById('firstName').value.trim();
  const lastName  = document.getElementById('lastName').value.trim();
  const email     = document.getElementById('email').value.trim();
  const phone     = document.getElementById('phone').value.trim();
  const gender    = document.getElementById('gender').value;
  let valid = true;

  if (!firstName)                      { showError('firstNameErr', 'First name is required.');                              valid = false; }
  if (!lastName)                       { showError('lastNameErr',  'Last name is required.');                               valid = false; }
  if (!email || !validateEmail(email)) { showError('emailErr',     'Please enter a valid email.');                          valid = false; }
  if (!phone || !validatePhone(phone)) { showError('phoneErr',     'Enter a valid Ethiopian phone number (09XXXXXXXX).');   valid = false; }
  if (!gender)                         { showError('genderErr',    'Please select your gender.');                           valid = false; }

  if (valid) goToStep(2);
});

// ---- Step 2 ----
document.getElementById('next2')?.addEventListener('click', () => {
  clearErrors('universityErr', 'departmentErr', 'yearErr');
  const university = document.getElementById('university').value;
  const department = document.getElementById('department').value.trim();
  const year       = document.getElementById('year').value;
  let valid = true;

  if (!university) { showError('universityErr', 'Please select your university.'); valid = false; }
  if (!department) { showError('departmentErr', 'Please enter your department.');  valid = false; }
  if (!year)       { showError('yearErr',       'Please select your year.');       valid = false; }

  if (valid) goToStep(3);
});

document.getElementById('back2')?.addEventListener('click', () => goToStep(1));

// ---- Step 3: File upload ----
const uploadZone        = document.getElementById('uploadZone');
const studentIdFile     = document.getElementById('studentIdFile');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const uploadPreview     = document.getElementById('uploadPreview');
const previewImg        = document.getElementById('previewImg');
const removeImg         = document.getElementById('removeImg');

function showPreview(file) {
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    uploadPlaceholder.classList.add('hidden');
    uploadPreview.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
}

studentIdFile?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showError('idFileErr', 'File size must be under 5MB.'); return; }
  showError('idFileErr', '');
  showPreview(file);
});

removeImg?.addEventListener('click', (e) => {
  e.stopPropagation();
  studentIdFile.value = '';
  previewImg.src = '';
  uploadPlaceholder.classList.remove('hidden');
  uploadPreview.classList.add('hidden');
});

uploadZone?.addEventListener('dragover',  (e) => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone?.addEventListener('dragleave', ()  => uploadZone.classList.remove('drag-over'));
uploadZone?.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) { studentIdFile.files = e.dataTransfer.files; showPreview(file); }
});

document.getElementById('next3')?.addEventListener('click', () => {
  clearErrors('idFileErr');
  if (!studentIdFile.files[0]) { showError('idFileErr', 'Please upload your student ID photo.'); return; }
  buildReview();
  goToStep(4);
});

document.getElementById('back3')?.addEventListener('click', () => goToStep(2));
document.getElementById('back4')?.addEventListener('click', () => goToStep(3));

// ---- Step 4: Review ----
function buildReview() {
  const uniSelect = document.getElementById('university');
  const fields = [
    { label: 'First Name',    value: document.getElementById('firstName')?.value },
    { label: 'Last Name',     value: document.getElementById('lastName')?.value },
    { label: 'Email',         value: document.getElementById('email')?.value },
    { label: 'Phone',         value: document.getElementById('phone')?.value },
    { label: 'Gender',        value: document.getElementById('gender')?.value },
    { label: 'University',    value: uniSelect?.options[uniSelect.selectedIndex]?.text },
    { label: 'Department',    value: document.getElementById('department')?.value },
    { label: 'Year of Study', value: document.getElementById('year')?.value ? `Year ${document.getElementById('year').value}` : '' },
    { label: 'Skills',        value: document.getElementById('skills')?.value || '—' },
    { label: 'Availability',  value: document.getElementById('availability')?.value || '—' },
    { label: 'Student ID',    value: studentIdFile.files[0]?.name || '—' },
  ];

  const grid = document.getElementById('reviewGrid');
  if (!grid) return;
  grid.innerHTML = fields.map(f => `
    <div class="review-item">
      <label>${f.label}</label>
      <span>${f.value || '—'}</span>
    </div>
  `).join('');
}

// ---- Form Submit ----
const profileForm    = document.getElementById('profileForm');
const profileSuccess = document.getElementById('profileSuccess');

profileForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

  const formData = new FormData(profileForm);

  try {
    const res  = await fetch(`${API}/profile.php`, { method: 'POST', body: formData });
    const data = await res.json();

    if (data.success) {
      profileForm.classList.add('hidden');
      profileSuccess.classList.remove('hidden');
      window.UniQuest?.showToast('Profile submitted successfully!', 'success');
    } else {
      window.UniQuest?.showToast(data.message || 'Submission failed. Please try again.', 'error');
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Profile';
    }
  } catch {
    // Demo mode
    profileForm.classList.add('hidden');
    profileSuccess.classList.remove('hidden');
    window.UniQuest?.showToast('Profile submitted (demo mode)!', 'success');
  }
});

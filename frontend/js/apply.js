/* ============================================
   UniQuest - Apply Page JavaScript
   ============================================ */

const API = '../../backend/api';

// ---- Read job from URL params ----
const params = new URLSearchParams(window.location.search);
const jobId  = params.get('job') || 'network-admin';

const JOB_DATA = {
  'network-admin': {
    title: 'Network Administrator',
    dept: 'Campus Network Center',
    schedule: 'Mon–Fri, 9 AM – 5 PM',
    duration: '6 months',
    pay: '70 birr/hr',
    desc: 'We are seeking a skilled Network Administrator to manage and maintain campus network infrastructure, ensuring optimal performance and security.',
    responsibilities: ['Monitor network performance and troubleshoot issues', 'Configure and maintain network devices (routers, switches, firewalls)', 'Implement security measures to protect the network', 'Collaborate with IT teams on network-related projects', 'Document network configurations and changes'],
    requirements: ['Currently enrolled in Computer Science or related program', 'Strong understanding of networking concepts', 'Experience with network devices', 'Knowledge of network security practices'],
    skills: ['Networking', 'Cisco', 'Security', 'Linux'],
  },
  'web-dev': {
    title: 'Web Developer Intern',
    dept: 'Campus IT Department',
    schedule: 'Flexible hours',
    duration: '3 months',
    pay: '60 birr/hr',
    desc: 'Build and maintain internal web applications for campus departments. Work with modern frameworks and collaborate with the IT team.',
    responsibilities: ['Develop and maintain web applications', 'Write clean, maintainable code', 'Collaborate with designers and backend developers', 'Test and debug applications'],
    requirements: ['Enrolled in Computer Science or related field', 'Proficiency in HTML, CSS, JavaScript', 'Experience with React or similar frameworks', 'Basic knowledge of PHP or Node.js'],
    skills: ['HTML/CSS', 'JavaScript', 'React', 'PHP'],
  },
  'data-analyst': {
    title: 'Data Analyst',
    dept: 'Campus Research Center',
    schedule: 'Flexible hours',
    duration: '6 months',
    pay: '65 birr/hr',
    desc: 'Analyze research data, create visualizations, and generate reports to support academic and administrative decision-making.',
    responsibilities: ['Collect and clean datasets', 'Perform statistical analysis', 'Create data visualizations and dashboards', 'Present findings to stakeholders'],
    requirements: ['Enrolled in Statistics, CS, or related field', 'Proficiency in Python or R', 'Experience with Excel and SQL', 'Strong analytical skills'],
    skills: ['Python', 'Excel', 'SQL', 'Tableau'],
  },
  'it-support': {
    title: 'IT Support Specialist',
    dept: 'Campus Library',
    schedule: 'Flexible hours',
    duration: '4 months',
    pay: '50 birr/hr',
    desc: 'Provide technical support to students and staff, troubleshoot hardware/software issues, and maintain computer lab equipment.',
    responsibilities: ['Respond to IT support tickets', 'Troubleshoot hardware and software issues', 'Maintain computer lab equipment', 'Assist with software installations'],
    requirements: ['Basic knowledge of Windows and Linux', 'Good communication skills', 'Patience and problem-solving ability'],
    skills: ['Windows', 'Hardware', 'Troubleshooting'],
  },
  'software-intern': {
    title: 'Software Development Intern',
    dept: 'Campus Tech Hub',
    schedule: 'Flexible hours',
    duration: '2 months',
    pay: '55 birr/hr',
    desc: 'Develop mobile and desktop applications for campus use. Work in an agile team environment with mentorship from senior developers.',
    responsibilities: ['Develop features for campus applications', 'Write unit tests', 'Participate in code reviews', 'Work in agile sprints'],
    requirements: ['Enrolled in Computer Science or related field', 'Knowledge of Java or Python', 'Familiarity with Git', 'Team player'],
    skills: ['Java', 'Python', 'Git', 'Agile'],
  },
  'dba': {
    title: 'Database Administrator',
    dept: 'Campus Data Center',
    schedule: 'Mon–Fri, 9 AM – 5 PM',
    duration: '6 months',
    pay: '68 birr/hr',
    desc: 'Manage and optimize campus databases, ensure data integrity, perform backups, and support database-driven applications.',
    responsibilities: ['Manage MySQL/PostgreSQL databases', 'Perform regular backups', 'Optimize query performance', 'Ensure data security and integrity'],
    requirements: ['Enrolled in CS or related field', 'Experience with SQL', 'Knowledge of database design', 'Attention to detail'],
    skills: ['MySQL', 'PostgreSQL', 'Backup', 'SQL'],
  },
};

// ---- Populate job details ----
const job = JOB_DATA[jobId] || JOB_DATA['network-admin'];

document.getElementById('jobTitle').textContent    = job.title;
document.getElementById('jobDept').textContent     = job.dept;
document.getElementById('jobSchedule').textContent = job.schedule;
document.getElementById('jobDuration').textContent = job.duration;
document.getElementById('jobPay').textContent      = job.pay;
document.getElementById('jobDesc').textContent     = job.desc;
document.getElementById('jobIdInput').value        = jobId;
document.title = `Apply – ${job.title} | UniQuest`;

const respList = document.getElementById('jobResponsibilities');
if (respList) respList.innerHTML = job.responsibilities.map(r => `<li>${r}</li>`).join('');

const reqList = document.getElementById('jobRequirements');
if (reqList) reqList.innerHTML = job.requirements.map(r => `<li>${r}</li>`).join('');

const skillsEl = document.getElementById('jobSkills');
if (skillsEl) skillsEl.innerHTML = job.skills.map(s => `<span>${s}</span>`).join('');

// ---- Cover letter character count ----
const coverTextarea = document.getElementById('appCover');
const coverCount    = document.getElementById('coverCount');

coverTextarea?.addEventListener('input', () => {
  const len = coverTextarea.value.length;
  coverCount.textContent = `${len} / 500 characters`;
  coverCount.style.color = len > 500 ? 'var(--danger)' : 'var(--text-light)';
});

// ---- File upload label ----
const appResume    = document.getElementById('appResume');
const fileLabel    = document.getElementById('fileLabel');
const fileUploadUI = document.getElementById('fileUploadUI');

appResume?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    showError('appResumeErr', 'File must be under 5MB.');
    appResume.value = '';
    fileLabel.textContent = 'Choose file or drag here';
    return;
  }
  showError('appResumeErr', '');
  fileLabel.textContent = file.name;
  fileUploadUI.style.borderColor = 'var(--success)';
  fileUploadUI.style.background  = '#f0fff4';
});

// ---- Validation helpers ----
function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}
function clearErrors(...ids) { ids.forEach(id => showError(id, '')); }
function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function validatePhone(phone) { return /^09[0-9]{8}$/.test(phone); }

// ---- Form Submit ----
const applyForm    = document.getElementById('applyForm');
const applySuccess = document.getElementById('applySuccess');

applyForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors('appFirstErr', 'appLastErr', 'appEmailErr', 'appPhoneErr', 'appUniErr', 'appDeptErr', 'appYearErr', 'appCoverErr', 'appResumeErr');

  const firstName  = document.getElementById('appFirst').value.trim();
  const lastName   = document.getElementById('appLast').value.trim();
  const email      = document.getElementById('appEmail').value.trim();
  const phone      = document.getElementById('appPhone').value.trim();
  const university = document.getElementById('appUniversity').value;
  const dept       = document.getElementById('appDept').value.trim();
  const year       = document.getElementById('appYear').value;
  const cover      = document.getElementById('appCover').value.trim();
  const resume     = document.getElementById('appResume').files[0];
  let valid = true;

  if (!firstName)                      { showError('appFirstErr',  'First name is required.');                            valid = false; }
  if (!lastName)                       { showError('appLastErr',   'Last name is required.');                             valid = false; }
  if (!email || !validateEmail(email)) { showError('appEmailErr',  'Please enter a valid email.');                        valid = false; }
  if (!phone || !validatePhone(phone)) { showError('appPhoneErr',  'Enter a valid Ethiopian phone number (09XXXXXXXX).'); valid = false; }
  if (!university)                     { showError('appUniErr',    'Please select your university.');                     valid = false; }
  if (!dept)                           { showError('appDeptErr',   'Please enter your department.');                      valid = false; }
  if (!year)                           { showError('appYearErr',   'Please select your year.');                           valid = false; }
  if (!cover || cover.length < 50)     { showError('appCoverErr',  'Please write at least 50 characters.');               valid = false; }
  if (!resume)                         { showError('appResumeErr', 'Please upload your resume.');                         valid = false; }
  if (!valid) return;

  const btn = document.getElementById('applyBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

  const formData = new FormData(applyForm);

  try {
    const res  = await fetch(`${API}/apply.php`, { method: 'POST', body: formData });
    const data = await res.json();

    if (data.success) {
      applyForm.closest('.apply-form-wrap').querySelector('.apply-form-header').classList.add('hidden');
      applyForm.classList.add('hidden');
      applySuccess.classList.remove('hidden');
      window.UniQuest?.showToast('Application submitted successfully!', 'success');
    } else {
      window.UniQuest?.showToast(data.message || 'Submission failed. Please try again.', 'error');
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Application';
    }
  } catch {
    // Demo mode
    applyForm.closest('.apply-form-wrap').querySelector('.apply-form-header').classList.add('hidden');
    applyForm.classList.add('hidden');
    applySuccess.classList.remove('hidden');
    window.UniQuest?.showToast('Application submitted (demo mode)!', 'success');
  }
});

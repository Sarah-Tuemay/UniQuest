/* ============================================
   UniQuest - React Jobs Search & Filter App
   ============================================ */

const { useState, useEffect, useMemo } = React;

const ALL_JOBS = [
  { id: 1,  slug: 'it-support',      title: 'Tech Support Specialist',    dept: 'IT Department',          category: 'IT & Tech',        hours: 'Flexible hours',  pay: 50,  duration: '4 months',  icon: 'it',    detailLink: 'tech.html' },
  { id: 2,  slug: 'web-dev',         title: 'Web Developer Intern',       dept: 'Campus IT Department',   category: 'IT & Tech',        hours: 'Part-time',       pay: 60,  duration: '3 months',  icon: 'it',    detailLink: 'tech.html' },
  { id: 3,  slug: 'network-admin',   title: 'Network Administrator',      dept: 'Campus Network Center',  category: 'IT & Tech',        hours: 'Mon–Fri 9–5',     pay: 70,  duration: '6 months',  icon: 'it',    detailLink: 'tech.html' },
  { id: 4,  slug: 'data-analyst',    title: 'Data Analyst',               dept: 'Research Center',        category: 'IT & Tech',        hours: 'Flexible',        pay: 65,  duration: '6 months',  icon: 'it',    detailLink: 'tech.html' },
  { id: 5,  slug: 'library-asst',    title: 'Library Assistant',          dept: 'University Library',     category: 'Library',          hours: 'Evening shifts',  pay: 30,  duration: 'Ongoing',   icon: 'lib',   detailLink: 'apply.html' },
  { id: 6,  slug: 'library-cat',     title: 'Library Cataloguer',         dept: 'University Library',     category: 'Library',          hours: 'Morning shifts',  pay: 28,  duration: '3 months',  icon: 'lib',   detailLink: 'apply.html' },
  { id: 7,  slug: 'event-staff',     title: 'Event Staff',                dept: 'Student Center',         category: 'Events',           hours: 'Weekends',        pay: 40,  duration: 'Per event', icon: 'event', detailLink: 'apply.html' },
  { id: 8,  slug: 'event-coord',     title: 'Event Coordinator Assistant',dept: 'Student Affairs',        category: 'Events',           hours: 'Flexible',        pay: 45,  duration: '2 months',  icon: 'event', detailLink: 'apply.html' },
  { id: 9,  slug: 'office-asst',     title: 'Office Assistant',           dept: 'Registrar Office',       category: 'Administration',   hours: 'Part-time',       pay: 35,  duration: '6 months',  icon: 'admin', detailLink: 'apply.html' },
  { id: 10, slug: 'dept-secretary',  title: 'Department Secretary',       dept: 'Engineering Faculty',    category: 'Administration',   hours: 'Mon–Fri',         pay: 38,  duration: '4 months',  icon: 'admin', detailLink: 'apply.html' },
  { id: 11, slug: 'cafeteria',       title: 'Cafeteria Service Worker',   dept: 'Campus Cafeteria',       category: 'Food & Beverage',  hours: 'Flexible shifts', pay: 30,  duration: 'Ongoing',   icon: 'food',  detailLink: 'apply.html' },
  { id: 12, slug: 'barista',         title: 'Barista / Cashier',          dept: 'Campus Coffee Shop',     category: 'Food & Beverage',  hours: 'Morning shifts',  pay: 32,  duration: '3 months',  icon: 'food',  detailLink: 'apply.html' },
  { id: 13, slug: 'social-media',    title: 'Social Media Manager',       dept: 'Campus Marketing',       category: 'Marketing',        hours: 'Flexible hours',  pay: 25,  duration: '3 months',  icon: 'mkt',   detailLink: 'apply.html' },
  { id: 14, slug: 'brand-ambassador',title: 'Campus Brand Ambassador',    dept: 'Student Affairs',        category: 'Marketing',        hours: 'Part-time',       pay: 28,  duration: '2 months',  icon: 'mkt',   detailLink: 'apply.html' },
  { id: 15, slug: 'cleaning',        title: 'Cleaning Operative',         dept: 'Facilities Management',  category: 'Cleaning',         hours: 'Early morning',   pay: 25,  duration: 'Ongoing',   icon: 'clean', detailLink: 'apply.html' },
  { id: 16, slug: 'customer-svc',    title: 'Customer Service Rep',       dept: 'Student Services',       category: 'Customer Service', hours: 'Flexible',        pay: 33,  duration: '4 months',  icon: 'cs',    detailLink: 'apply.html' },
];

const CATEGORIES   = ['All', ...new Set(ALL_JOBS.map(j => j.category))];
const SORT_OPTIONS = [
  { value: 'default',  label: 'Sort: Default'    },
  { value: 'pay-high', label: 'Pay: High → Low'  },
  { value: 'pay-low',  label: 'Pay: Low → High'  },
  { value: 'title',    label: 'Title: A → Z'     },
];

const ICON_MAP = {
  it:    'fa-laptop-code',
  lib:   'fa-book-open',
  event: 'fa-calendar-star',
  admin: 'fa-building-columns',
  food:  'fa-utensils',
  mkt:   'fa-bullhorn',
  clean: 'fa-broom',
  cs:    'fa-headset',
};

// ---- JobCard ----
function JobCard({ job }) {
  const applyUrl  = `apply.html?job=${job.slug}`;
  const detailUrl = job.detailLink;

  return (
    <div className="job-listing-card">
      <div className="jlc-header">
        <div className={`jlc-icon ${job.icon}`}>
          <i className={`fa-solid ${ICON_MAP[job.icon] || 'fa-briefcase'}`}></i>
        </div>
        <div style={{ flex: 1 }}>
          <div className="jlc-title">{job.title}</div>
          <div className="jlc-dept">{job.dept}</div>
        </div>
        <span className="badge badge-blue">{job.category}</span>
      </div>

      <div className="jlc-meta">
        <span className="jlc-meta-item"><i className="fa-solid fa-clock"></i> {job.hours}</span>
        <span className="jlc-meta-item"><i className="fa-solid fa-calendar"></i> {job.duration}</span>
      </div>

      <div className="jlc-pay">
        <i className="fa-solid fa-coins"></i> {job.pay} birr/hr
      </div>

      <div className="jlc-actions">
        <a href={detailUrl} className="btn btn-outline btn-sm">Details</a>
        <a href={applyUrl}  className="btn btn-primary btn-sm">Apply Now</a>
      </div>
    </div>
  );
}

// ---- Main App ----
function JobsApp() {
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('All');
  const [sort,     setSort]     = useState('default');
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    let jobs = [...ALL_JOBS];
    if (category !== 'All') jobs = jobs.filter(j => j.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      jobs = jobs.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.dept.toLowerCase().includes(q)  ||
        j.category.toLowerCase().includes(q)
      );
    }
    if (sort === 'pay-high') jobs.sort((a, b) => b.pay - a.pay);
    if (sort === 'pay-low')  jobs.sort((a, b) => a.pay - b.pay);
    if (sort === 'title')    jobs.sort((a, b) => a.title.localeCompare(b.title));
    return jobs;
  }, [search, category, sort]);

  return (
    <div className="jobs-app-inner">
      <div className="jobs-toolbar">
        <div className="search-wrap">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search jobs, departments..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search jobs"
          />
        </div>

        <select className="filter-select" value={category} onChange={e => setCategory(e.target.value)} aria-label="Filter by category">
          {CATEGORIES.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
        </select>

        <select className="filter-select" value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort jobs">
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <span className="jobs-count">
          {loading ? '...' : `${filtered.length} job${filtered.length !== 1 ? 's' : ''} found`}
        </span>
      </div>

      {loading ? (
        <div className="jobs-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="job-listing-card">
              <div className="skeleton" style={{ height: 46, width: 46, borderRadius: 8 }}></div>
              <div className="skeleton" style={{ height: 18, width: '70%', marginTop: 12 }}></div>
              <div className="skeleton" style={{ height: 14, width: '50%', marginTop: 8 }}></div>
              <div className="skeleton" style={{ height: 36, marginTop: 16, borderRadius: 20 }}></div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="jobs-empty">
          <i className="fa-solid fa-magnifying-glass"></i>
          <h3>No jobs found</h3>
          <p>Try adjusting your search or filter.</p>
          <button className="btn btn-outline mt-2" onClick={() => { setSearch(''); setCategory('All'); setSort('default'); }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="jobs-grid">
          {filtered.map(job => <JobCard key={job.id} job={job} />)}
        </div>
      )}
    </div>
  );
}

// ---- Mount ----
const container = document.getElementById('jobs-app');
if (container) {
  ReactDOM.createRoot(container).render(<JobsApp />);
}

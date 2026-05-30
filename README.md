# UniQuest 🎓💼

**UniQuest** is a full-stack campus job marketplace connecting Ethiopian university students with flexible, meaningful on-campus work opportunities.

---

## Tech Stack

| Layer     | Technology |
|-----------|-----------|
| Frontend  | HTML5, CSS3 (custom design system), Vanilla JS, **React 18** (jobs search) |
| Backend   | **PHP 8+** REST API |
| Database  | **MySQL / MariaDB** |
| Icons     | Font Awesome 6 |
| Fonts     | Google Fonts – Inter |

---

## Project Structure

```
UniQuest/
├── index.html                  ← Entry point (root, for easy deployment)
├── frontend/                   ← All UI files
│   ├── pages/
│   │   ├── jobs.html           ← Job listings (React-powered search)
│   │   ├── tech.html           ← IT & Tech category
│   │   ├── apply.html          ← Job application form
│   │   ├── profile.html        ← Student profile wizard (4 steps)
│   │   └── login.html          ← Sign In / Sign Up
│   ├── css/
│   │   ├── shared.css          ← Design system (variables, components)
│   │   ├── index.css
│   │   ├── jobs.css
│   │   ├── tech.css
│   │   ├── apply.css
│   │   ├── profile.css
│   │   └── login.css
│   ├── js/
│   │   ├── shared.js           ← Nav, toast, scroll-reveal utilities
│   │   ├── index.js            ← Homepage interactions
│   │   ├── jobs-app.jsx        ← React jobs search & filter component
│   │   ├── login.js            ← Auth form logic
│   │   ├── profile.js          ← Multi-step profile form
│   │   └── apply.js            ← Application form logic
│   └── images/                 ← Static images & favicon
│
└── backend/                    ← Server-side code & data
    ├── api/
    │   ├── config.php          ← DB connection, shared helpers
    │   ├── auth.php            ← POST /api/auth.php  (signin / signup)
    │   ├── profile.php         ← POST /api/profile.php (profile + ID upload)
    │   └── apply.php           ← POST /api/apply.php  (application + resume)
    ├── database/
    │   └── schema.sql          ← Full MySQL schema + seed data
    └── uploads/                ← Uploaded files (auto-created)
        ├── student_ids/        ← Student ID images
        ├── resumes/            ← Resume files
        └── .htaccess           ← Blocks PHP execution in uploads
```

---

## Database Setup

### 1. Create the database

```bash
mysql -u root -p < backend/database/schema.sql
```

Or open `backend/database/schema.sql` in **phpMyAdmin → SQL tab** and run it.

### 2. Tables created

| Table | Purpose |
|-------|---------|
| `users` | Registered accounts (sign-up / sign-in) |
| `student_profiles` | Profile submissions awaiting admin approval |
| `job_listings` | Campus job postings (seeded with 18 jobs) |
| `job_applications` | Student applications with resume uploads |

### 3. Configure credentials

Edit `backend/api/config.php`:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'uniquest');
define('DB_USER', 'root');
define('DB_PASS', 'your_password');  // change this
```

---

## Local Development Setup

### Requirements
- PHP 8.0+
- MySQL 8.0+ or MariaDB 10.5+
- [XAMPP](https://www.apachefriends.org/) or [WAMP](https://www.wampserver.com/)

### Steps

1. Copy the project into your web server root:
   - XAMPP → `C:/xampp/htdocs/UniQuest/`
   - WAMP  → `C:/wamp64/www/UniQuest/`

2. Run the database schema:
   ```bash
   mysql -u root -p < backend/database/schema.sql
   ```

3. Update DB credentials in `backend/api/config.php`

4. Open in browser:
   ```
   http://localhost/UniQuest/
   ```

> **No database?** The site works in **demo mode** — forms show success messages without persisting data.

---

## API Endpoints

All endpoints accept `POST` requests. Frontend calls them via relative path `../../backend/api/`.

| Endpoint | Content-Type | Description |
|----------|-------------|-------------|
| `backend/api/auth.php` | `application/json` | `{ action: "signin" \| "signup", ...fields }` |
| `backend/api/profile.php` | `multipart/form-data` | Student profile + student ID image |
| `backend/api/apply.php` | `multipart/form-data` | Job application + resume file |

---

## Features

- React-powered live job search with category filter and sort
- 4-step profile creation wizard with drag & drop ID upload
- Password strength meter on sign-up
- Full client-side validation with inline error messages
- Toast notifications for all actions
- Responsive design — mobile, tablet, desktop
- PHP backend with bcrypt password hashing, PDO prepared statements, MIME-type file validation

---

## Universities Supported
Addis Ababa University · AASTU · Adama Science & Technology · Hawassa University · Jimma University

---

&copy; 2025 UniQuest — UniQuest@gmail.com · Telegram: @UniQuestET

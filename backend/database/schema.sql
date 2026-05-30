-- ============================================================
--  UniQuest – Full MySQL Database Schema
--  Run once to set up the database:
--    mysql -u root -p < backend/database/schema.sql
--  Or paste into phpMyAdmin → SQL tab
-- ============================================================

CREATE DATABASE IF NOT EXISTS uniquest
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE uniquest;

-- ============================================================
--  TABLE: users
--  Stores registered accounts (sign-up / sign-in)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  first_name    VARCHAR(100)     NOT NULL,
  last_name     VARCHAR(100)     NOT NULL,
  email         VARCHAR(255)     NOT NULL,
  university    VARCHAR(100)     NOT NULL DEFAULT '',
  password_hash VARCHAR(255)     NOT NULL,
  is_verified   TINYINT(1)       NOT NULL DEFAULT 0,
  created_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP
                                          ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ============================================================
--  TABLE: student_profiles
--  Stores student profile submissions (pending admin approval)
-- ============================================================
CREATE TABLE IF NOT EXISTS student_profiles (
  id               INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  first_name       VARCHAR(100)     NOT NULL,
  last_name        VARCHAR(100)     NOT NULL,
  email            VARCHAR(255)     NOT NULL,
  phone            VARCHAR(20)      NOT NULL,
  gender           ENUM('male','female','prefer_not') NOT NULL,
  university       VARCHAR(100)     NOT NULL,
  department       VARCHAR(150)     NOT NULL,
  year_of_study    TINYINT UNSIGNED NOT NULL,
  skills           TEXT,
  availability     VARCHAR(50),
  student_id_path  VARCHAR(500),
  status           ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  reviewed_at      DATETIME,
  created_at       DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_profiles_email (email),
  KEY idx_profiles_status (status)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ============================================================
--  TABLE: job_listings
--  Campus job postings managed by admins
-- ============================================================
CREATE TABLE IF NOT EXISTS job_listings (
  id           INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  title        VARCHAR(200)     NOT NULL,
  department   VARCHAR(150)     NOT NULL,
  category     VARCHAR(100)     NOT NULL,
  description  TEXT,
  requirements TEXT,
  schedule     VARCHAR(100),
  duration     VARCHAR(100),
  pay_rate     DECIMAL(8,2)     UNSIGNED,
  icon_key     VARCHAR(20)      NOT NULL DEFAULT 'it',
  is_active    TINYINT(1)       NOT NULL DEFAULT 1,
  created_at   DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP
                                         ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_listings_category  (category),
  KEY idx_listings_is_active (is_active)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ============================================================
--  TABLE: job_applications
--  Student applications for job listings
-- ============================================================
CREATE TABLE IF NOT EXISTS job_applications (
  id             INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  job_id         VARCHAR(100)     NOT NULL,
  first_name     VARCHAR(100)     NOT NULL,
  last_name      VARCHAR(100)     NOT NULL,
  email          VARCHAR(255)     NOT NULL,
  phone          VARCHAR(20)      NOT NULL,
  university     VARCHAR(100)     NOT NULL,
  department     VARCHAR(150)     NOT NULL,
  year_of_study  TINYINT UNSIGNED NOT NULL,
  cover_letter   TEXT             NOT NULL,
  availability   VARCHAR(50),
  resume_path    VARCHAR(500),
  status         ENUM('pending','reviewed','accepted','rejected') NOT NULL DEFAULT 'pending',
  applied_at     DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at    DATETIME,
  PRIMARY KEY (id),
  UNIQUE KEY uq_application (email, job_id),
  KEY idx_applications_job_id (job_id),
  KEY idx_applications_email  (email),
  KEY idx_applications_status (status)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ============================================================
--  SEED DATA: job_listings
-- ============================================================
INSERT INTO job_listings (title, department, category, description, schedule, duration, pay_rate, icon_key) VALUES
('Network Administrator',
 'Campus Network Center',
 'IT & Tech',
 'Manage and maintain campus network infrastructure, ensuring optimal performance and security across all departments.',
 'Mon–Fri, 9 AM – 5 PM', '6 months', 70.00, 'it'),

('Web Developer Intern',
 'Campus IT Department',
 'IT & Tech',
 'Build and maintain internal web applications for campus departments using modern frameworks.',
 'Flexible hours', '3 months', 60.00, 'it'),

('Data Analyst',
 'Campus Research Center',
 'IT & Tech',
 'Analyze research data, create visualizations, and generate reports to support decision-making.',
 'Flexible hours', '6 months', 65.00, 'it'),

('IT Support Specialist',
 'Campus Library',
 'IT & Tech',
 'Provide technical support to students and staff, troubleshoot hardware/software issues.',
 'Flexible hours', '4 months', 50.00, 'it'),

('Software Development Intern',
 'Campus Tech Hub',
 'IT & Tech',
 'Develop mobile and desktop applications for campus use in an agile team environment.',
 'Flexible hours', '2 months', 55.00, 'it'),

('Database Administrator',
 'Campus Data Center',
 'IT & Tech',
 'Manage and optimize campus databases, ensure data integrity, perform backups.',
 'Mon–Fri, 9 AM – 5 PM', '6 months', 68.00, 'it'),

('Library Assistant',
 'University Library',
 'Library',
 'Assist patrons with finding resources, manage book returns, and maintain library order.',
 'Evening shifts', 'Ongoing', 30.00, 'lib'),

('Library Cataloguer',
 'University Library',
 'Library',
 'Catalogue new acquisitions, update the library management system, and assist with inventory.',
 'Morning shifts', '3 months', 28.00, 'lib'),

('Event Staff',
 'Student Center',
 'Events',
 'Support campus events and activities — setup, coordination, and guest assistance.',
 'Weekends', 'Per event', 40.00, 'event'),

('Event Coordinator Assistant',
 'Student Affairs',
 'Events',
 'Assist the events team with planning, logistics, and on-the-day coordination.',
 'Flexible hours', '2 months', 45.00, 'event'),

('Office Assistant',
 'Registrar Office',
 'Administration',
 'Provide administrative support — filing, data entry, and front-desk assistance.',
 'Part-time', '6 months', 35.00, 'admin'),

('Department Secretary',
 'Engineering Faculty',
 'Administration',
 'Handle correspondence, schedule meetings, and support the department head.',
 'Mon–Fri', '4 months', 38.00, 'admin'),

('Cafeteria Service Worker',
 'Campus Cafeteria',
 'Food & Beverage',
 'Serve food, maintain cleanliness, and assist with cafeteria operations.',
 'Flexible shifts', 'Ongoing', 30.00, 'food'),

('Barista / Cashier',
 'Campus Coffee Shop',
 'Food & Beverage',
 'Prepare beverages, handle transactions, and maintain a welcoming environment.',
 'Morning shifts', '3 months', 32.00, 'food'),

('Social Media Manager',
 'Campus Marketing',
 'Marketing',
 'Create and schedule content across campus social media channels.',
 'Flexible hours', '3 months', 25.00, 'mkt'),

('Campus Brand Ambassador',
 'Student Affairs',
 'Marketing',
 'Represent UniQuest at campus events and promote the platform to fellow students.',
 'Part-time', '2 months', 28.00, 'mkt'),

('Cleaning Operative',
 'Facilities Management',
 'Cleaning',
 'Maintain campus cleanliness and hygiene across buildings and common areas.',
 'Early morning', 'Ongoing', 25.00, 'clean'),

('Customer Service Representative',
 'Student Services',
 'Customer Service',
 'Assist students with inquiries, resolve issues, and provide a positive experience.',
 'Flexible hours', '4 months', 33.00, 'cs');

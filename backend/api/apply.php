<?php
/**
 * UniQuest - Job Application API
 * 
 * Handles: POST /api/apply.php (multipart/form-data)
 * Saves job application + resume file upload.
 */

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Method not allowed.', [], 405);
}

// ---- Collect & validate fields ----
$jobId       = sanitize($_POST['job_id']      ?? '');
$firstName   = sanitize($_POST['first_name']  ?? '');
$lastName    = sanitize($_POST['last_name']   ?? '');
$email       = sanitize($_POST['email']       ?? '');
$phone       = sanitize($_POST['phone']       ?? '');
$university  = sanitize($_POST['university']  ?? '');
$department  = sanitize($_POST['department']  ?? '');
$year        = sanitize($_POST['year']        ?? '');
$coverLetter = sanitize($_POST['cover_letter'] ?? '');
$availability = sanitize($_POST['availability'] ?? '');

$errors = [];
if (!$firstName)                       $errors[] = 'First name is required.';
if (!$lastName)                        $errors[] = 'Last name is required.';
if (!$email || !isValidEmail($email))  $errors[] = 'Valid email is required.';
if (!$phone || !isValidPhone($phone))  $errors[] = 'Valid phone number is required.';
if (!$university)                      $errors[] = 'University is required.';
if (!$department)                      $errors[] = 'Department is required.';
if (!$year)                            $errors[] = 'Year of study is required.';
if (strlen($coverLetter) < 50)         $errors[] = 'Cover letter must be at least 50 characters.';

if ($errors) {
    jsonResponse(false, implode(' ', $errors), [], 422);
}

// ---- Handle resume file upload ----
$resumePath = null;

if (!isset($_FILES['resume']) || $_FILES['resume']['error'] !== UPLOAD_ERR_OK) {
    jsonResponse(false, 'Resume file is required.', [], 422);
}

$file = $_FILES['resume'];

if ($file['size'] > MAX_FILE_SIZE) {
    jsonResponse(false, 'Resume must be under 5MB.', [], 422);
}

$finfo    = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($file['tmp_name']);

if (!in_array($mimeType, ALLOWED_RESUME_TYPES, true)) {
    jsonResponse(false, 'Resume must be a PDF, Word document, or image file.', [], 422);
}

// Create upload directory
if (!is_dir(UPLOAD_DIR . 'resumes/')) {
    mkdir(UPLOAD_DIR . 'resumes/', 0755, true);
}

$ext      = pathinfo($file['name'], PATHINFO_EXTENSION);
$safeExt  = preg_replace('/[^a-z0-9]/', '', strtolower($ext)) ?: 'pdf';
$filename = 'resume_' . bin2hex(random_bytes(16)) . '.' . $safeExt;
$destPath = UPLOAD_DIR . 'resumes/' . $filename;

if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    jsonResponse(false, 'Failed to save resume. Please try again.', [], 500);
}

$resumePath = 'uploads/resumes/' . $filename;

// ---- Save to database ----
$db = getDB();
if (!$db) {
    // Demo mode
    jsonResponse(true, 'Application submitted successfully. We will contact you within 3–5 business days.', [
        'demo' => true,
    ]);
}

// Prevent duplicate applications for the same job
$stmt = $db->prepare(
    'SELECT id FROM job_applications WHERE email = ? AND job_id = ? LIMIT 1'
);
$stmt->execute([$email, $jobId]);
if ($stmt->fetch()) {
    jsonResponse(false, 'You have already applied for this position.', [], 409);
}

$stmt = $db->prepare(
    'INSERT INTO job_applications
     (job_id, first_name, last_name, email, phone, university, department, year_of_study, cover_letter, availability, resume_path, status, applied_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "pending", NOW())'
);

$stmt->execute([
    $jobId, $firstName, $lastName, $email, $phone,
    $university, $department, $year, $coverLetter,
    $availability, $resumePath,
]);

$applicationId = $db->lastInsertId();

jsonResponse(true, 'Application submitted successfully. We will contact you within 3–5 business days.', [
    'application_id' => (int) $applicationId,
], 201);

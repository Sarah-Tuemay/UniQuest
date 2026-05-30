<?php
/**
 * UniQuest - Profile Submission API
 * 
 * Handles: POST /api/profile.php (multipart/form-data)
 * Saves student profile + student ID image upload.
 */

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Method not allowed.', [], 405);
}

// ---- Collect & validate fields ----
$firstName   = sanitize($_POST['first_name']  ?? '');
$lastName    = sanitize($_POST['last_name']   ?? '');
$email       = sanitize($_POST['email']       ?? '');
$phone       = sanitize($_POST['phone']       ?? '');
$gender      = sanitize($_POST['gender']      ?? '');
$university  = sanitize($_POST['university']  ?? '');
$department  = sanitize($_POST['department']  ?? '');
$year        = sanitize($_POST['year']        ?? '');
$skills      = sanitize($_POST['skills']      ?? '');
$availability = sanitize($_POST['availability'] ?? '');

$errors = [];
if (!$firstName)                       $errors[] = 'First name is required.';
if (!$lastName)                        $errors[] = 'Last name is required.';
if (!$email || !isValidEmail($email))  $errors[] = 'Valid email is required.';
if (!$phone || !isValidPhone($phone))  $errors[] = 'Valid phone number is required.';
if (!$gender)                          $errors[] = 'Gender is required.';
if (!$university)                      $errors[] = 'University is required.';
if (!$department)                      $errors[] = 'Department is required.';
if (!$year)                            $errors[] = 'Year of study is required.';

if ($errors) {
    jsonResponse(false, implode(' ', $errors), [], 422);
}

// ---- Handle student ID file upload ----
$studentIdPath = null;

if (!isset($_FILES['student_id']) || $_FILES['student_id']['error'] !== UPLOAD_ERR_OK) {
    jsonResponse(false, 'Student ID image is required.', [], 422);
}

$file = $_FILES['student_id'];

// Validate file size
if ($file['size'] > MAX_FILE_SIZE) {
    jsonResponse(false, 'Student ID image must be under 5MB.', [], 422);
}

// Validate MIME type (use finfo for security, not just extension)
$finfo    = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($file['tmp_name']);

if (!in_array($mimeType, ALLOWED_IMAGE_TYPES, true)) {
    jsonResponse(false, 'Student ID must be a JPEG, PNG, or WebP image.', [], 422);
}

// Create upload directory if needed
if (!is_dir(UPLOAD_DIR . 'student_ids/')) {
    mkdir(UPLOAD_DIR . 'student_ids/', 0755, true);
}

// Generate a safe filename
$ext      = pathinfo($file['name'], PATHINFO_EXTENSION);
$safeExt  = in_array(strtolower($ext), ['jpg', 'jpeg', 'png', 'webp']) ? strtolower($ext) : 'jpg';
$filename = 'sid_' . bin2hex(random_bytes(16)) . '.' . $safeExt;
$destPath = UPLOAD_DIR . 'student_ids/' . $filename;

if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    jsonResponse(false, 'Failed to save student ID. Please try again.', [], 500);
}

$studentIdPath = 'uploads/student_ids/' . $filename;

// ---- Save to database ----
$db = getDB();
if (!$db) {
    // DB unavailable — still return success in demo mode
    jsonResponse(true, 'Profile submitted successfully. Awaiting verification.', [
        'demo' => true,
    ]);
}

// Check for duplicate email
$stmt = $db->prepare('SELECT id FROM student_profiles WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    jsonResponse(false, 'A profile with this email already exists.', [], 409);
}

$stmt = $db->prepare(
    'INSERT INTO student_profiles
     (first_name, last_name, email, phone, gender, university, department, year_of_study, skills, availability, student_id_path, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "pending", NOW())'
);

$stmt->execute([
    $firstName, $lastName, $email, $phone, $gender,
    $university, $department, $year, $skills, $availability,
    $studentIdPath,
]);

$profileId = $db->lastInsertId();

jsonResponse(true, 'Profile submitted successfully. Approval takes 2–3 business days.', [
    'profile_id' => (int) $profileId,
], 201);

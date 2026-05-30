<?php
/**
 * UniQuest - Current User Data API
 *
 * GET /api/me.php?user_id=123
 * Returns the user's applications and profile status.
 */

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(false, 'Method not allowed.', [], 405);
}

$userId = (int) ($_GET['user_id'] ?? 0);

if ($userId <= 0) {
    jsonResponse(false, 'Invalid user ID.', [], 400);
}

$db = getDB();
if (!$db) {
    // Demo mode — return empty data
    jsonResponse(true, 'OK', [
        'applications' => [],
        'profile'      => null,
    ]);
}

// ---- Fetch applications ----
$stmt = $db->prepare(
    'SELECT job_id, department, university, cover_letter, availability, status, applied_at
     FROM job_applications
     WHERE email = (SELECT email FROM users WHERE id = ? LIMIT 1)
     ORDER BY applied_at DESC'
);
$stmt->execute([$userId]);
$applications = $stmt->fetchAll();

// ---- Fetch student profile ----
$stmt = $db->prepare(
    'SELECT first_name, last_name, email, phone, gender, university, department,
            year_of_study, skills, availability, status, created_at
     FROM student_profiles
     WHERE email = (SELECT email FROM users WHERE id = ? LIMIT 1)
     LIMIT 1'
);
$stmt->execute([$userId]);
$profile = $stmt->fetch() ?: null;

jsonResponse(true, 'OK', [
    'applications' => $applications,
    'profile'      => $profile,
]);

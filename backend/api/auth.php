<?php
/**
 * UniQuest - Authentication API
 *
 * POST /api/auth.php
 * Actions: signin, signup, change_password
 */

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Method not allowed.', [], 405);
}

$body = json_decode(file_get_contents('php://input'), true);
if (!$body || !isset($body['action'])) {
    jsonResponse(false, 'Invalid request body.', [], 400);
}

$action = sanitize($body['action']);

// ============================================================
// SIGN IN
// ============================================================
if ($action === 'signin') {
    $email    = sanitize($body['email']    ?? '');
    $password = $body['password'] ?? '';

    if (!$email || !isValidEmail($email)) {
        jsonResponse(false, 'Please enter a valid email address.', [], 422);
    }
    if (!$password) {
        jsonResponse(false, 'Password is required.', [], 422);
    }

    $db = getDB();
    if (!$db) {
        jsonResponse(false, 'Database unavailable. Please try again later.', [], 503);
    }

    $stmt = $db->prepare(
        'SELECT id, first_name, last_name, email, university, password_hash, is_verified
         FROM users WHERE email = ? LIMIT 1'
    );
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        jsonResponse(false, 'Invalid email or password.', [], 401);
    }

    // Return full user object — frontend stores this in localStorage
    jsonResponse(true, 'Sign in successful.', [
        'user' => [
            'id'          => (int) $user['id'],
            'name'        => $user['first_name'] . ' ' . $user['last_name'],
            'email'       => $user['email'],
            'university'  => $user['university'],
            'is_verified' => (bool) $user['is_verified'],
        ],
    ]);
}

// ============================================================
// SIGN UP
// ============================================================
if ($action === 'signup') {
    $firstName  = sanitize($body['first_name']  ?? '');
    $lastName   = sanitize($body['last_name']   ?? '');
    $email      = sanitize($body['email']       ?? '');
    $university = sanitize($body['university']  ?? '');
    $password   = $body['password'] ?? '';

    $errors = [];
    if (!$firstName)                      $errors[] = 'First name is required.';
    if (!$lastName)                       $errors[] = 'Last name is required.';
    if (!$email || !isValidEmail($email)) $errors[] = 'Please enter a valid email address.';
    if (!$university)                     $errors[] = 'Please select your university.';
    if (strlen($password) < 8)            $errors[] = 'Password must be at least 8 characters.';

    if ($errors) {
        jsonResponse(false, implode(' ', $errors), [], 422);
    }

    $db = getDB();
    if (!$db) {
        jsonResponse(false, 'Database unavailable. Please try again later.', [], 503);
    }

    $stmt = $db->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        jsonResponse(false, 'An account with this email already exists.', [], 409);
    }

    $passwordHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

    $stmt = $db->prepare(
        'INSERT INTO users (first_name, last_name, email, university, password_hash, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())'
    );
    $stmt->execute([$firstName, $lastName, $email, $university, $passwordHash]);

    jsonResponse(true, 'Account created successfully. Please sign in.', [], 201);
}

// ============================================================
// CHANGE PASSWORD
// ============================================================
if ($action === 'change_password') {
    $userId          = (int) ($body['user_id']          ?? 0);
    $currentPassword = $body['current_password'] ?? '';
    $newPassword     = $body['new_password']     ?? '';

    if ($userId <= 0)              jsonResponse(false, 'Invalid user.',                          [], 400);
    if (!$currentPassword)         jsonResponse(false, 'Current password is required.',          [], 422);
    if (strlen($newPassword) < 8)  jsonResponse(false, 'New password must be at least 8 chars.', [], 422);

    $db = getDB();
    if (!$db) {
        jsonResponse(false, 'Database unavailable.', [], 503);
    }

    $stmt = $db->prepare('SELECT password_hash FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($currentPassword, $user['password_hash'])) {
        jsonResponse(false, 'Current password is incorrect.', [], 401);
    }

    $newHash = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 12]);
    $stmt    = $db->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
    $stmt->execute([$newHash, $userId]);

    jsonResponse(true, 'Password updated successfully.');
}

jsonResponse(false, 'Unknown action.', [], 400);

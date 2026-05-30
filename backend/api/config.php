<?php
/**
 * UniQuest - Database Configuration
 * 
 * Update these values to match your MySQL/MariaDB setup.
 * For local development: XAMPP, WAMP, or LAMP stack.
 */

define('DB_HOST',     'localhost');
define('DB_PORT',     '3306');
define('DB_NAME',     'uniquest');
define('DB_USER',     'root');       // Change in production
define('DB_PASS',     '');           // Change in production
define('DB_CHARSET',  'utf8mb4');

define('UPLOAD_DIR',  __DIR__ . '/../uploads/');
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB

define('ALLOWED_IMAGE_TYPES', ['image/jpeg', 'image/png', 'image/webp']);
define('ALLOWED_RESUME_TYPES', [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
]);

/**
 * Get a PDO database connection.
 * Returns null if connection fails (graceful degradation).
 */
function getDB(): ?PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    try {
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=%s',
            DB_HOST, DB_PORT, DB_NAME, DB_CHARSET
        );
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        // Log error without exposing details
        error_log('UniQuest DB connection failed: ' . $e->getMessage());
        return null;
    }
}

/**
 * Send a JSON response and exit.
 */
function jsonResponse(bool $success, string $message = '', array $data = [], int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(array_merge(['success' => $success, 'message' => $message], $data));
    exit;
}

/**
 * Sanitize a string input.
 */
function sanitize(string $input): string {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

/**
 * Validate an email address.
 */
function isValidEmail(string $email): bool {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Validate an Ethiopian phone number (09XXXXXXXX).
 */
function isValidPhone(string $phone): bool {
    return preg_match('/^09[0-9]{8}$/', $phone) === 1;
}

// CORS headers (adjust origin in production)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

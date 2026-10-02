<?php
/**
 * Admin Endpoint: Login & Session Creation
 */

require_once __DIR__ . '/../../backend/helpers/cors.php';
require_once __DIR__ . '/../../backend/config/db.php';
require_once __DIR__ . '/../../backend/helpers/response.php';
require_once __DIR__ . '/../../backend/helpers/logger.php';

$data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$username = trim($data['username'] ?? '');
$password = trim($data['password'] ?? '');

if (empty($username) || empty($password)) {
    send_error("Username and password are required.", 400);
}

try {
    $db = Database::getInstance()->getConnection();

    // Query admin account
    $stmt = $db->prepare("SELECT * FROM admins WHERE username = ? OR email = ? LIMIT 1");
    $stmt->execute([$username, $username]);
    $admin = $stmt->fetch();

    if (!$admin || !password_verify($password, $admin['password_hash'])) {
        // Log failed login attempt
        log_activity(null, 'LOGIN_FAILED', "Failed login attempt for username: $username");
        send_error("Invalid credentials supplied.", 401);
    }

    // Generate secure session token (SHA256 of random bytes)
    $sessionToken = bin2hex(random_bytes(32));
    
    // Set 24 hour session lifetime
    $config = require __DIR__ . '/../../backend/config/env.php';
    $lifetime = $config['session_lifetime'] ?? 86400;
    $expiresAt = (new DateTime())->modify("+{$lifetime} seconds")->format('Y-m-d H:i:s');
    
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

    // Insert active session
    $sessStmt = $db->prepare("
        INSERT INTO admin_sessions (id, admin_id, ip_address, user_agent, expires_at)
        VALUES (?, ?, ?, ?, ?)
    ");
    $sessStmt->execute([$sessionToken, $admin['id'], $ip, $userAgent, $expiresAt]);

    // Log success activity
    log_activity($admin['id'], 'LOGIN_SUCCESS', "Admin logged in successfully.");

    send_json([
        "success" => true,
        "token" => $sessionToken,
        "user" => [
            "username" => $admin['username'],
            "email" => $admin['email'],
            "role" => $admin['role']
        ]
      ]);

} catch (Exception $e) {
    send_internal_error($e->getMessage());
}

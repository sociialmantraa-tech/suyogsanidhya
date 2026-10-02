<?php
/**
 * Admin authentication middleware
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

function require_admin_auth() {
    $headers = getallheaders();
    $authToken = null;

    // Check Authorization Header
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $authToken = $matches[1];
        }
    } 
    // Fallback: Check Query Parameter for media downloads/uploads if needed
    elseif (isset($_GET['token'])) {
        $authToken = $_GET['token'];
    }

    if (!$authToken) {
        send_unauthorized("Authentication token required.");
    }

    $db = Database::getInstance()->getConnection();

    // Query active session from database
    $stmt = $db->prepare("
        SELECT s.id as session_id, s.expires_at, a.id as admin_id, a.username, a.email, a.role 
        FROM admin_sessions s
        JOIN admins a ON s.admin_id = a.id
        WHERE s.id = ? AND s.expires_at > NOW()
        LIMIT 1
    ");
    $stmt->execute([$authToken]);
    $session = $stmt->fetch();

    if (!$session) {
        send_unauthorized("Session expired or invalid token.");
    }

    // Optional: Refresh session expiry if close to expiring
    $expiry = new DateTime($session['expires_at']);
    $now = new DateTime();
    $diff = $expiry->getTimestamp() - $now->getTimestamp();

    if ($diff < 7200) { // If less than 2 hours left, extend by 12 hours
        $newExpiry = (new DateTime())->modify('+12 hours')->format('Y-m-d H:i:s');
        $updateStmt = $db->prepare("UPDATE admin_sessions SET expires_at = ? WHERE id = ?");
        $updateStmt->execute([$newExpiry, $authToken]);
    }

    // Return the authenticated admin details
    return [
        'id' => $session['admin_id'],
        'username' => $session['username'],
        'email' => $session['email'],
        'role' => $session['role'],
        'session_id' => $session['session_id']
    ];
}

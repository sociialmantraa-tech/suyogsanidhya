<?php
/**
 * Admin Endpoint: Logout & Session Invalidation
 */

require_once __DIR__ . '/../../backend/helpers/cors.php';
require_once __DIR__ . '/../../backend/middleware/auth.php';
require_once __DIR__ . '/../../backend/helpers/logger.php';
require_once __DIR__ . '/../../backend/helpers/response.php';

// 1. Authenticate request
$admin = require_admin_auth();

try {
    $db = Database::getInstance()->getConnection();

    // 2. Remove session row
    $stmt = $db->prepare("DELETE FROM admin_sessions WHERE id = ?");
    $stmt->execute([$admin['session_id']]);

    // 3. Log activity
    log_activity($admin['id'], 'LOGOUT', "Admin logged out successfully.");

    send_json(["success" => true, "message" => "Session terminated successfully."]);
} catch (Exception $e) {
    send_internal_error($e->getMessage());
}

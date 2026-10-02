<?php
/**
 * Admin Endpoint: Fetch Activity Audit Logs
 */

require_once __DIR__ . '/../../backend/helpers/cors.php';
require_once __DIR__ . '/../../backend/middleware/auth.php';
require_once __DIR__ . '/../../backend/helpers/response.php';

$admin = require_admin_auth();

try {
    $db = Database::getInstance()->getConnection();

    // Query recent logs with admin usernames
    $stmt = $db->prepare("
        SELECT l.id, l.action, l.description, l.ip_address, l.created_at, a.username 
        FROM activity_logs l
        LEFT JOIN admins a ON l.admin_id = a.id
        ORDER BY l.id DESC 
        LIMIT 100
    ");
    $stmt->execute();
    $logs = $stmt->fetchAll();

    send_json(["logs" => $logs]);
} catch (Exception $e) {
    send_internal_error($e->getMessage());
}

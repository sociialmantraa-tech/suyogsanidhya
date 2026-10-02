<?php
/**
 * Activity logger helper
 */

require_once __DIR__ . '/../config/db.php';

function log_activity($adminId, $action, $description) {
    try {
        $db = Database::getInstance()->getConnection();
        $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        
        $stmt = $db->prepare("
            INSERT INTO activity_logs (admin_id, action, description, ip_address)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$adminId, $action, $description, $ip]);
    } catch (Exception $e) {
        // Fallback to error_log if database logging fails
        error_log("Failed to log activity: " . $e->getMessage() . " | Action: $action | Admin: $adminId");
    }
}

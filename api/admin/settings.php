<?php
/**
 * Admin Endpoint: Manage Global Site Settings
 */

require_once __DIR__ . '/../../backend/helpers/cors.php';
require_once __DIR__ . '/../../backend/middleware/auth.php';
require_once __DIR__ . '/../../backend/helpers/response.php';
require_once __DIR__ . '/../../backend/helpers/logger.php';

$admin = require_admin_auth();

$method = $_SERVER['REQUEST_METHOD'];
$db = Database::getInstance()->getConnection();

try {
    if ($method === 'GET') {
        // Fetch settings
        $stmt = $db->prepare("SELECT setting_key, setting_value, setting_group FROM site_settings");
        $stmt->execute();
        $settings = $stmt->fetchAll();
        
        send_json(["settings" => $settings]);
    }

    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        
        $updates = $data['settings'] ?? []; // Expected format: [ { key: 'site_name', value: '...' }, ... ]

        if (empty($updates) || !is_array($updates)) {
            send_error("Settings payload must be a non-empty array of key-value sets.", 400);
        }

        $db->beginTransaction();

        $stmt = $db->prepare("
            INSERT INTO site_settings (setting_key, setting_value) 
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
        ");

        foreach ($updates as $row) {
            if (isset($row['key']) && isset($row['value'])) {
                $stmt->execute([trim($row['key']), trim($row['value'])]);
            }
        }

        $db->commit();

        log_activity($admin['id'], 'SETTINGS_UPDATE', "Updated site settings.");
        send_json(["success" => true, "message" => "Settings updated successfully."]);
    }

} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    send_internal_error($e->getMessage());
}

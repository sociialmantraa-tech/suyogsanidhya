<?php
/**
 * Admin Endpoint: Manage Concerns (CRUD)
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
        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        
        if ($id > 0) {
            $stmt = $db->prepare("SELECT * FROM concerns WHERE id = ? LIMIT 1");
            $stmt->execute([$id]);
            $concern = $stmt->fetch();
            
            if (!$concern) send_not_found("Concern not found.");
            
            // Get mapped service ids
            $mapStmt = $db->prepare("SELECT service_id FROM concern_service_map WHERE concern_id = ?");
            $mapStmt->execute([$id]);
            $concern['service_ids'] = $mapStmt->fetchAll(PDO::FETCH_COLUMN);
            
            send_json(["concern" => $concern]);
        } else {
            $stmt = $db->prepare("SELECT * FROM concerns ORDER BY display_order ASC, id ASC");
            $stmt->execute();
            $concerns = $stmt->fetchAll();
            send_json(["concerns" => $concerns]);
        }
    }

    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        
        $id = isset($data['id']) ? (int)$data['id'] : 0;
        $title = trim($data['title'] ?? '');
        $slug = trim($data['slug'] ?? '');
        $description = trim($data['description'] ?? '');
        $status = trim($data['status'] ?? 'draft');
        $displayOrder = isset($data['display_order']) ? (int)$data['display_order'] : 0;
        $serviceIds = $data['service_ids'] ?? [];

        if (empty($title) || empty($slug) || empty($description)) {
            send_error("Required fields (Title, Slug, Description) are missing.", 400);
        }

        if ($id > 0) {
            // Update
            $stmt = $db->prepare("
                UPDATE concerns 
                SET title = ?, slug = ?, description = ?, status = ?, display_order = ?
                WHERE id = ?
            ");
            $stmt->execute([$title, $slug, $description, $status, $displayOrder, $id]);

            // Sync services mapping
            $db->prepare("DELETE FROM concern_service_map WHERE concern_id = ?")->execute([$id]);
            foreach ($serviceIds as $srvId) {
                $db->prepare("INSERT IGNORE INTO concern_service_map (concern_id, service_id) VALUES (?, ?)")->execute([$id, (int)$srvId]);
            }

            log_activity($admin['id'], 'CONCERN_UPDATE', "Updated concern: {$title} (ID: {$id})");
            send_json(["success" => true, "message" => "Concern updated successfully."]);
        } else {
            // Create
            $stmt = $db->prepare("
                INSERT INTO concerns (title, slug, description, status, display_order)
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([$title, $slug, $description, $status, $displayOrder]);
            $newId = $db->lastInsertId();

            // Sync services mapping
            foreach ($serviceIds as $srvId) {
                $db->prepare("INSERT IGNORE INTO concern_service_map (concern_id, service_id) VALUES (?, ?)")->execute([$newId, (int)$srvId]);
            }

            log_activity($admin['id'], 'CONCERN_CREATE', "Created concern: {$title} (ID: {$newId})");
            send_json(["success" => true, "message" => "Concern created successfully.", "id" => (int)$newId]);
        }
    }

    elseif ($method === 'DELETE' || ($method === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete')) {
        $id = isset($_GET['id']) ? (int)$_GET['id'] : (isset($_POST['id']) ? (int)$_POST['id'] : 0);
        
        if (empty($id)) {
            send_error("ID is required for deletion.", 400);
        }

        $titleStmt = $db->prepare("SELECT title FROM concerns WHERE id = ? LIMIT 1");
        $titleStmt->execute([$id]);
        $title = $titleStmt->fetch()['title'] ?? "Unknown Concern";

        $delStmt = $db->prepare("DELETE FROM concerns WHERE id = ?");
        $delStmt->execute([$id]);

        log_activity($admin['id'], 'CONCERN_DELETE', "Deleted concern: {$title} (ID: {$id})");
        send_json(["success" => true, "message" => "Concern deleted successfully."]);
    }

} catch (Exception $e) {
    send_internal_error($e->getMessage());
}

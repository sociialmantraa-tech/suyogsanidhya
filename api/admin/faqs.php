<?php
/**
 * Admin Endpoint: Manage FAQs (CRUD)
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
            $stmt = $db->prepare("SELECT * FROM faqs WHERE id = ? LIMIT 1");
            $stmt->execute([$id]);
            $faq = $stmt->fetch();
            
            if (!$faq) send_not_found("FAQ not found.");
            
            send_json(["faq" => $faq]);
        } else {
            $stmt = $db->prepare("SELECT * FROM faqs ORDER BY display_order ASC, id ASC");
            $stmt->execute();
            $faqs = $stmt->fetchAll();
            send_json(["faqs" => $faqs]);
        }
    }

    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        
        $id = isset($data['id']) ? (int)$data['id'] : 0;
        $question = trim($data['question'] ?? '');
        $answer = trim($data['answer'] ?? '');
        $displayOrder = isset($data['display_order']) ? (int)$data['display_order'] : 0;
        $status = trim($data['status'] ?? 'draft');

        if (empty($question) || empty($answer)) {
            send_error("Required fields (Question, Answer) are missing.", 400);
        }

        if ($id > 0) {
            $stmt = $db->prepare("
                UPDATE faqs 
                SET question = ?, answer = ?, display_order = ?, status = ?
                WHERE id = ?
            ");
            $stmt->execute([$question, $answer, $displayOrder, $status, $id]);

            log_activity($admin['id'], 'FAQ_UPDATE', "Updated FAQ ID: {$id}");
            send_json(["success" => true, "message" => "FAQ updated successfully."]);
        } else {
            $stmt = $db->prepare("
                INSERT INTO faqs (question, answer, display_order, status)
                VALUES (?, ?, ?, ?)
            ");
            $stmt->execute([$question, $answer, $displayOrder, $status]);
            $newId = $db->lastInsertId();

            log_activity($admin['id'], 'FAQ_CREATE', "Created FAQ ID: {$newId}");
            send_json(["success" => true, "message" => "FAQ created successfully.", "id" => (int)$newId]);
        }
    }

    elseif ($method === 'DELETE' || ($method === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete')) {
        $id = isset($_GET['id']) ? (int)$_GET['id'] : (isset($_POST['id']) ? (int)$_POST['id'] : 0);
        
        if (empty($id)) {
            send_error("ID is required for deletion.", 400);
        }

        $delStmt = $db->prepare("DELETE FROM faqs WHERE id = ?");
        $delStmt->execute([$id]);

        log_activity($admin['id'], 'FAQ_DELETE', "Deleted FAQ ID: {$id}");
        send_json(["success" => true, "message" => "FAQ deleted successfully."]);
    }

} catch (Exception $e) {
    send_internal_error($e->getMessage());
}

<?php
/**
 * Admin Endpoint: Manage Testimonials (CRUD)
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
            $stmt = $db->prepare("SELECT * FROM testimonials WHERE id = ? LIMIT 1");
            $stmt->execute([$id]);
            $testimonial = $stmt->fetch();
            
            if (!$testimonial) send_not_found("Testimonial not found.");
            
            send_json(["testimonial" => $testimonial]);
        } else {
            $stmt = $db->prepare("SELECT * FROM testimonials ORDER BY display_order ASC, id DESC");
            $stmt->execute();
            $testimonials = $stmt->fetchAll();
            send_json(["testimonials" => $testimonials]);
        }
    }

    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        
        $id = isset($data['id']) ? (int)$data['id'] : 0;
        $clientName = trim($data['client_name'] ?? '');
        $clientInitials = trim($data['client_initials'] ?? '');
        $rating = isset($data['rating']) ? (int)$data['rating'] : 5;
        $serviceCategory = trim($data['service_category'] ?? '');
        $testimonialText = trim($data['testimonial_text'] ?? '');
        $videoUrl = trim($data['video_url'] ?? '');
        $displayOrder = isset($data['display_order']) ? (int)$data['display_order'] : 0;
        $isFeatured = isset($data['is_featured']) ? (int)$data['is_featured'] : 0;
        $status = trim($data['status'] ?? 'draft');

        if (empty($clientName) || empty($clientInitials) || empty($testimonialText)) {
            send_error("Required fields (Client Name, Initials, Testimonial Text) are missing.", 400);
        }

        if ($id > 0) {
            $stmt = $db->prepare("
                UPDATE testimonials 
                SET client_name = ?, client_initials = ?, rating = ?, service_category = ?, 
                    testimonial_text = ?, video_url = ?, display_order = ?, is_featured = ?, status = ?
                WHERE id = ?
            ");
            $stmt->execute([$clientName, $clientInitials, $rating, $serviceCategory, $testimonialText, $videoUrl, $displayOrder, $isFeatured, $status, $id]);

            log_activity($admin['id'], 'TESTIMONIAL_UPDATE', "Updated testimonial from: {$clientName} (ID: {$id})");
            send_json(["success" => true, "message" => "Testimonial updated successfully."]);
        } else {
            $stmt = $db->prepare("
                INSERT INTO testimonials (
                    client_name, client_initials, rating, service_category, 
                    testimonial_text, video_url, display_order, is_featured, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([$clientName, $clientInitials, $rating, $serviceCategory, $testimonialText, $videoUrl, $displayOrder, $isFeatured, $status]);
            $newId = $db->lastInsertId();

            log_activity($admin['id'], 'TESTIMONIAL_CREATE', "Created testimonial from: {$clientName} (ID: {$newId})");
            send_json(["success" => true, "message" => "Testimonial created successfully.", "id" => (int)$newId]);
        }
    }

    elseif ($method === 'DELETE' || ($method === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete')) {
        $id = isset($_GET['id']) ? (int)$_GET['id'] : (isset($_POST['id']) ? (int)$_POST['id'] : 0);
        
        if (empty($id)) {
            send_error("ID is required for deletion.", 400);
        }

        $nameStmt = $db->prepare("SELECT client_name FROM testimonials WHERE id = ? LIMIT 1");
        $nameStmt->execute([$id]);
        $clientName = $nameStmt->fetch()['client_name'] ?? "Unknown Testimonial";

        $delStmt = $db->prepare("DELETE FROM testimonials WHERE id = ?");
        $delStmt->execute([$id]);

        log_activity($admin['id'], 'TESTIMONIAL_DELETE', "Deleted testimonial from: {$clientName} (ID: {$id})");
        send_json(["success" => true, "message" => "Testimonial deleted successfully."]);
    }

} catch (Exception $e) {
    send_internal_error($e->getMessage());
}

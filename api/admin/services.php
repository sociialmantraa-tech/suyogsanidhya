<?php
/**
 * Admin Endpoint: Manage Services (CRUD)
 */

require_once __DIR__ . '/../../backend/helpers/cors.php';
require_once __DIR__ . '/../../backend/middleware/auth.php';
require_once __DIR__ . '/../../backend/helpers/response.php';
require_once __DIR__ . '/../../backend/helpers/uploader.php';
require_once __DIR__ . '/../../backend/helpers/logger.php';

$admin = require_admin_auth();

$method = $_SERVER['REQUEST_METHOD'];
$db = Database::getInstance()->getConnection();

try {
    if ($method === 'GET') {
        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        
        if ($id > 0) {
            $stmt = $db->prepare("SELECT * FROM services WHERE id = ? LIMIT 1");
            $stmt->execute([$id]);
            $service = $stmt->fetch();
            
            if (!$service) send_not_found("Service not found.");
            
            send_json(["service" => $service]);
        } else {
            $stmt = $db->prepare("
                SELECT s.id, s.title, s.slug, s.duration, s.price, s.sale_price, s.status, s.display_order, c.name as category_name
                FROM services s
                LEFT JOIN service_categories c ON s.category_id = c.id
                ORDER BY s.display_order ASC, s.id ASC
            ");
            $stmt->execute();
            $services = $stmt->fetchAll();
            send_json(["services" => $services]);
        }
    }

    elseif ($method === 'POST') {
        $id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
        $categoryId = isset($_POST['category_id']) ? (int)$_POST['category_id'] : null;
        $title = trim($_POST['title'] ?? '');
        $slug = trim($_POST['slug'] ?? '');
        $shortDescription = trim($_POST['short_description'] ?? '');
        $fullDescription = trim($_POST['full_description'] ?? '');
        $icon = trim($_POST['icon'] ?? 'compass');
        $duration = isset($_POST['duration']) ? (int)$_POST['duration'] : 60;
        $price = isset($_POST['price']) ? (float)$_POST['price'] : 0.00;
        $salePrice = (!empty($_POST['sale_price'])) ? (float)$_POST['sale_price'] : null;
        $displayOrder = isset($_POST['display_order']) ? (int)$_POST['display_order'] : 0;
        $status = trim($_POST['status'] ?? 'draft');
        
        $seoTitle = trim($_POST['seo_title'] ?? '');
        $seoDescription = trim($_POST['seo_description'] ?? '');

        if (empty($title) || empty($slug) || empty($shortDescription) || empty($fullDescription) || empty($price)) {
            send_error("Required fields (Title, Slug, Short Description, Full Description, Price) are missing.", 400);
        }

        $uploadedImagePath = null;
        if (isset($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
            $uploadedImagePath = secure_upload_file($_FILES['image'], 'services');
        }

        if ($id > 0) {
            // Update
            $sql = "
                UPDATE services 
                SET category_id = ?, title = ?, slug = ?, short_description = ?, 
                    full_description = ?, icon = ?, duration = ?, price = ?, 
                    sale_price = ?, display_order = ?, status = ?, seo_title = ?, seo_description = ?
            ";
            $params = [$categoryId, $title, $slug, $shortDescription, $fullDescription, $icon, $duration, $price, $salePrice, $displayOrder, $status, $seoTitle, $seoDescription];
            
            if ($uploadedImagePath) {
                $sql .= ", image = ?, social_share_image = ?";
                $params[] = $uploadedImagePath;
                $params[] = $uploadedImagePath;
            }
            
            $sql .= " WHERE id = ?";
            $params[] = $id;

            $stmt = $db->prepare($sql);
            $stmt->execute($params);

            log_activity($admin['id'], 'SERVICE_UPDATE', "Updated service: {$title} (ID: {$id})");
            send_json(["success" => true, "message" => "Service updated successfully."]);
        } else {
            // Create
            $stmt = $db->prepare("
                INSERT INTO services (
                    category_id, title, slug, short_description, full_description, 
                    icon, duration, price, sale_price, display_order, status, 
                    seo_title, seo_description, image, social_share_image
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $categoryId, $title, $slug, $shortDescription, $fullDescription,
                $icon, $duration, $price, $salePrice, $displayOrder, $status,
                $seoTitle, $seoDescription, $uploadedImagePath, $uploadedImagePath
            ]);
            $newId = $db->lastInsertId();

            log_activity($admin['id'], 'SERVICE_CREATE', "Created service: {$title} (ID: {$newId})");
            send_json(["success" => true, "message" => "Service created successfully.", "id" => (int)$newId]);
        }
    }

    elseif ($method === 'DELETE' || ($method === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete')) {
        $id = isset($_GET['id']) ? (int)$_GET['id'] : (isset($_POST['id']) ? (int)$_POST['id'] : 0);
        
        if (empty($id)) {
            send_error("ID is required for deletion.", 400);
        }

        $titleStmt = $db->prepare("SELECT title FROM services WHERE id = ? LIMIT 1");
        $titleStmt->execute([$id]);
        $title = $titleStmt->fetch()['title'] ?? "Unknown Service";

        // Mapped concern checks could be handled or map table automatically cleans due to ON DELETE CASCADE
        $delStmt = $db->prepare("DELETE FROM services WHERE id = ?");
        $delStmt->execute([$id]);

        log_activity($admin['id'], 'SERVICE_DELETE', "Deleted service: {$title} (ID: {$id})");
        send_json(["success" => true, "message" => "Service deleted successfully."]);
    }

} catch (Exception $e) {
    send_internal_error($e->getMessage());
}

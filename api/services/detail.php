<?php
/**
 * Public Endpoint: Service Detail
 */

require_once __DIR__ . '/../../backend/helpers/cors.php';
require_once __DIR__ . '/../../backend/config/db.php';
require_once __DIR__ . '/../../backend/helpers/response.php';

$slug = $_GET['slug'] ?? '';

if (empty($slug)) {
    send_error("Service slug is required.", 400);
}

try {
    $db = Database::getInstance()->getConnection();
    
    // Fetch Service details
    $stmt = $db->prepare("
        SELECT s.*, c.name as category_name, c.slug as category_slug 
        FROM services s
        LEFT JOIN service_categories c ON s.category_id = c.id
        WHERE s.slug = ? AND s.status = 'published'
        LIMIT 1
    ");
    $stmt->execute([$slug]);
    $service = $stmt->fetch();

    if (!$service) {
        send_not_found("Service not found.");
    }

    // Formatting fields
    $service['id'] = (int)$service['id'];
    $service['category_id'] = $service['category_id'] ? (int)$service['category_id'] : null;
    $service['duration'] = (int)$service['duration'];
    $service['price'] = (float)$service['price'];
    $service['sale_price'] = $service['sale_price'] ? (float)$service['sale_price'] : null;
    $service['display_order'] = (int)$service['display_order'];

    // Fetch mapped concerns
    $concernStmt = $db->prepare("
        SELECT c.id, c.title, c.slug, c.description 
        FROM concerns c
        JOIN concern_service_map m ON c.id = m.concern_id
        WHERE m.service_id = ? AND c.status = 'published'
        ORDER BY c.display_order ASC
    ");
    $concernStmt->execute([$service['id']]);
    $concerns = $concernStmt->fetchAll();

    $service['concerns'] = array_map(function($concern) {
        $concern['id'] = (int)$concern['id'];
        return $concern;
    }, $concerns);

    send_json(["service" => $service]);
} catch (Exception $e) {
    send_internal_error($e->getMessage());
}

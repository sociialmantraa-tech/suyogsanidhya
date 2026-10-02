<?php
/**
 * Public Endpoint: List Services
 */

require_once __DIR__ . '/../../backend/helpers/cors.php';
require_once __DIR__ . '/../../backend/config/db.php';
require_once __DIR__ . '/../../backend/helpers/response.php';

try {
    $db = Database::getInstance()->getConnection();
    
    $stmt = $db->prepare("
        SELECT s.*, c.name as category_name, c.slug as category_slug 
        FROM services s
        LEFT JOIN service_categories c ON s.category_id = c.id
        WHERE s.status = 'published'
        ORDER BY s.display_order ASC, s.id ASC
    ");
    $stmt->execute();
    $services = $stmt->fetchAll();

    // Map each service to ensure proper types
    $services = array_map(function($service) {
        $service['id'] = (int)$service['id'];
        $service['category_id'] = $service['category_id'] ? (int)$service['category_id'] : null;
        $service['duration'] = (int)$service['duration'];
        $service['price'] = (float)$service['price'];
        $service['sale_price'] = $service['sale_price'] ? (float)$service['sale_price'] : null;
        $service['display_order'] = (int)$service['display_order'];
        return $service;
    }, $services);

    send_json(["services" => $services]);
} catch (Exception $e) {
    send_internal_error($e->getMessage());
}

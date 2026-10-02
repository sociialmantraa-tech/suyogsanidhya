<?php
/**
 * Public Endpoint: List Testimonials
 */

require_once __DIR__ . '/../../backend/helpers/cors.php';
require_once __DIR__ . '/../../backend/config/db.php';
require_once __DIR__ . '/../../backend/helpers/response.php';

try {
    $db = Database::getInstance()->getConnection();
    
    $stmt = $db->prepare("
        SELECT * FROM testimonials
        WHERE status = 'published'
        ORDER BY display_order ASC, id DESC
    ");
    $stmt->execute();
    $testimonials = $stmt->fetchAll();

    $testimonials = array_map(function($t) {
        $t['id'] = (int)$t['id'];
        $t['rating'] = (int)$t['rating'];
        $t['is_featured'] = (int)$t['is_featured'];
        return $t;
    }, $testimonials);

    send_json(["testimonials" => $testimonials]);
} catch (Exception $e) {
    send_internal_error($e->getMessage());
}

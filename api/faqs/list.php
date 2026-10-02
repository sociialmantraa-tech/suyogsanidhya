<?php
/**
 * Public Endpoint: List FAQs
 */

require_once __DIR__ . '/../../backend/helpers/cors.php';
require_once __DIR__ . '/../../backend/config/db.php';
require_once __DIR__ . '/../../backend/helpers/response.php';

try {
    $db = Database::getInstance()->getConnection();
    
    $stmt = $db->prepare("
        SELECT * FROM faqs
        WHERE status = 'published'
        ORDER BY display_order ASC, id ASC
    ");
    $stmt->execute();
    $faqs = $stmt->fetchAll();

    $faqs = array_map(function($f) {
        $f['id'] = (int)$f['id'];
        $f['display_order'] = (int)$f['display_order'];
        return $f;
    }, $faqs);

    send_json(["faqs" => $faqs]);
} catch (Exception $e) {
    send_internal_error($e->getMessage());
}

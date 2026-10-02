<?php
/**
 * Public Endpoint: List Videos
 */

require_once __DIR__ . '/../../backend/helpers/cors.php';
require_once __DIR__ . '/../../backend/config/db.php';
require_once __DIR__ . '/../../backend/helpers/response.php';

try {
    $db = Database::getInstance()->getConnection();
    
    $stmt = $db->prepare("
        SELECT * FROM videos
        WHERE status = 'published'
        ORDER BY display_order ASC, id DESC
    ");
    $stmt->execute();
    $videos = $stmt->fetchAll();

    $videos = array_map(function($v) {
        $v['id'] = (int)$v['id'];
        $v['display_order'] = (int)$v['display_order'];
        return $v;
    }, $videos);

    send_json(["videos" => $videos]);
} catch (Exception $e) {
    send_internal_error($e->getMessage());
}

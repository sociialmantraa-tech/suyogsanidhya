<?php
/**
 * Public Endpoint: Page & Section Content Details
 */

require_once __DIR__ . '/../../backend/helpers/cors.php';
require_once __DIR__ . '/../../backend/config/db.php';
require_once __DIR__ . '/../../backend/helpers/response.php';

$slug = $_GET['slug'] ?? '';

if (empty($slug)) {
    send_error("Page slug is required.", 400);
}

try {
    $db = Database::getInstance()->getConnection();
    
    // Fetch Page
    $stmt = $db->prepare("SELECT id, name, slug, title, meta_description FROM pages WHERE slug = ? LIMIT 1");
    $stmt->execute([$slug]);
    $page = $stmt->fetch();

    if (!$page) {
        send_not_found("Page not found.");
    }

    $page['id'] = (int)$page['id'];

    // Fetch Sections
    $secStmt = $db->prepare("SELECT section_key, section_name, content FROM page_sections WHERE page_id = ?");
    $secStmt->execute([$page['id']]);
    $sectionsRaw = $secStmt->fetchAll();

    $sections = [];
    foreach ($sectionsRaw as $section) {
        $sections[$section['section_key']] = [
            'name' => $section['section_name'],
            'content' => json_decode($section['content'], true)
        ];
    }

    // Fetch global site settings if this is a general initialization request
    $settings = [];
    if ($slug === 'home' || isset($_GET['include_settings'])) {
        $setStmt = $db->prepare("SELECT setting_key, setting_value, setting_group FROM site_settings");
        $setStmt->execute();
        $settingsRaw = $setStmt->fetchAll();
        foreach ($settingsRaw as $setting) {
            $settings[$setting['setting_key']] = $setting['setting_value'];
        }
    }

    send_json([
        "page" => $page,
        "sections" => $sections,
        "settings" => $settings
    ]);
} catch (Exception $e) {
    send_internal_error($e->getMessage());
}

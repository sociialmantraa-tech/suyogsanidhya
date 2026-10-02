<?php
/**
 * Public Endpoint: Blog Detail
 */

require_once __DIR__ . '/../../backend/helpers/cors.php';
require_once __DIR__ . '/../../backend/config/db.php';
require_once __DIR__ . '/../../backend/helpers/response.php';

$slug = $_GET['slug'] ?? '';

if (empty($slug)) {
    send_error("Blog slug is required.", 400);
}

try {
    $db = Database::getInstance()->getConnection();
    
    // Fetch Blog details
    $stmt = $db->prepare("
        SELECT b.*, c.name as category_name, c.slug as category_slug 
        FROM blogs b
        LEFT JOIN blog_categories c ON b.category_id = c.id
        WHERE b.slug = ? AND b.status = 'published' AND b.publish_date <= NOW()
        LIMIT 1
    ");
    $stmt->execute([$slug]);
    $blog = $stmt->fetch();

    if (!$blog) {
        send_not_found("Blog article not found.");
    }

    // Formatting fields
    $blog['id'] = (int)$blog['id'];
    $blog['category_id'] = (int)$blog['category_id'];
    $blog['is_featured'] = (int)$blog['is_featured'];

    // Fetch tags
    $tagsStmt = $db->prepare("
        SELECT t.id, t.name, t.slug 
        FROM blog_tags t
        JOIN blog_tag_map m ON t.id = m.tag_id
        WHERE m.blog_id = ?
    ");
    $tagsStmt->execute([$blog['id']]);
    $tags = $tagsStmt->fetchAll();
    $blog['tags'] = $tags;

    // Fetch related articles (same category, excluding current one)
    $relatedStmt = $db->prepare("
        SELECT b.id, b.title, b.slug, b.excerpt, b.featured_image, b.author, b.publish_date,
               c.name as category_name, c.slug as category_slug
        FROM blogs b
        LEFT JOIN blog_categories c ON b.category_id = c.id
        WHERE b.category_id = ? AND b.id != ? AND b.status = 'published' AND b.publish_date <= NOW()
        ORDER BY b.publish_date DESC, b.id DESC
        LIMIT 3
    ");
    $relatedStmt->execute([$blog['category_id'], $blog['id']]);
    $related = $relatedStmt->fetchAll();

    $blog['related'] = array_map(function($item) {
        $item['id'] = (int)$item['id'];
        return $item;
    }, $related);

    send_json(["blog" => $blog]);
} catch (Exception $e) {
    send_internal_error($e->getMessage());
}

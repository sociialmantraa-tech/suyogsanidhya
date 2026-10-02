<?php
/**
 * Public Endpoint: List Blogs
 */

require_once __DIR__ . '/../../backend/helpers/cors.php';
require_once __DIR__ . '/../../backend/config/db.php';
require_once __DIR__ . '/../../backend/helpers/response.php';

$categorySlug = $_GET['category'] ?? '';
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 6;
if ($page < 1) $page = 1;
if ($limit < 1) $limit = 6;
$offset = ($page - 1) * $limit;

try {
    $db = Database::getInstance()->getConnection();
    
    $whereClauses = ["b.status = 'published'", "b.publish_date <= NOW()"];
    $params = [];

    if (!empty($categorySlug)) {
        $whereClauses[] = "c.slug = ?";
        $params[] = $categorySlug;
    }

    $whereSql = implode(" AND ", $whereClauses);

    // Count Total Blogs
    $countSql = "
        SELECT COUNT(*) as total 
        FROM blogs b
        LEFT JOIN blog_categories c ON b.category_id = c.id
        WHERE {$whereSql}
    ";
    $countStmt = $db->prepare($countSql);
    $countStmt->execute($params);
    $totalCount = (int)$countStmt->fetch()['total'];
    $totalPages = ceil($totalCount / $limit);

    // Fetch Blogs
    $fetchSql = "
        SELECT b.id, b.title, b.slug, b.excerpt, b.featured_image, b.author, b.publish_date, b.is_featured,
               c.name as category_name, c.slug as category_slug
        FROM blogs b
        LEFT JOIN blog_categories c ON b.category_id = c.id
        WHERE {$whereSql}
        ORDER BY b.is_featured DESC, b.publish_date DESC, b.id DESC
        LIMIT {$limit} OFFSET {$offset}
    ";
    $fetchStmt = $db->prepare($fetchSql);
    $fetchStmt->execute($params);
    $blogs = $fetchStmt->fetchAll();

    // Map fields
    $blogs = array_map(function($blog) {
        $blog['id'] = (int)$blog['id'];
        $blog['is_featured'] = (int)$blog['is_featured'];
        return $blog;
    }, $blogs);

    // Fetch all categories for navigation/filters in frontend
    $catStmt = $db->prepare("SELECT id, name, slug FROM blog_categories ORDER BY name ASC");
    $catStmt->execute();
    $categories = $catStmt->fetchAll();

    send_json([
        "blogs" => $blogs,
        "categories" => $categories,
        "pagination" => [
            "total_items" => $totalCount,
            "total_pages" => $totalPages,
            "current_page" => $page,
            "limit" => $limit
        ]
    ]);
} catch (Exception $e) {
    send_internal_error($e->getMessage());
}

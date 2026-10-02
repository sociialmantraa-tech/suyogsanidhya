<?php
/**
 * Admin Endpoint: Manage Blogs (CRUD)
 */

require_once __DIR__ . '/../../backend/helpers/cors.php';
require_once __DIR__ . '/../../backend/middleware/auth.php';
require_once __DIR__ . '/../../backend/helpers/response.php';
require_once __DIR__ . '/../../backend/helpers/uploader.php';
require_once __DIR__ . '/../../backend/helpers/logger.php';

// Authenticate Admin
$admin = require_admin_auth();

$method = $_SERVER['REQUEST_METHOD'];
$db = Database::getInstance()->getConnection();

try {
    // 1. GET: Fetch list or specific post
    if ($method === 'GET') {
        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        
        if ($id > 0) {
            $stmt = $db->prepare("SELECT * FROM blogs WHERE id = ? LIMIT 1");
            $stmt->execute([$id]);
            $blog = $stmt->fetch();
            
            if (!$blog) send_not_found("Article not found.");
            
            // Get tags
            $tagStmt = $db->prepare("SELECT t.id, t.name FROM blog_tags t JOIN blog_tag_map m ON t.id = m.tag_id WHERE m.blog_id = ?");
            $tagStmt->execute([$id]);
            $blog['tags'] = $tagStmt->fetchAll();
            
            send_json(["blog" => $blog]);
        } else {
            // Fetch list
            $stmt = $db->prepare("
                SELECT b.id, b.title, b.slug, b.status, b.publish_date, b.author, c.name as category_name 
                FROM blogs b
                LEFT JOIN blog_categories c ON b.category_id = c.id
                ORDER BY b.publish_date DESC, b.id DESC
            ");
            $stmt->execute();
            $blogs = $stmt->fetchAll();
            send_json(["blogs" => $blogs]);
        }
    }

    // 2. POST (Handles Create and Update to simplify multipart/form-data upload)
    elseif ($method === 'POST') {
        // Check if updating
        $id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
        $title = trim($_POST['title'] ?? '');
        $slug = trim($_POST['slug'] ?? '');
        $excerpt = trim($_POST['excerpt'] ?? '');
        $content = trim($_POST['content'] ?? '');
        $categoryId = isset($_POST['category_id']) ? (int)$_POST['category_id'] : 0;
        $author = trim($_POST['author'] ?? 'Abhay Harpale');
        $status = trim($_POST['status'] ?? 'draft');
        $isFeatured = isset($_POST['is_featured']) ? (int)$_POST['is_featured'] : 0;
        $publishDate = trim($_POST['publish_date'] ?? date('Y-m-d H:i:s'));
        
        // SEO Fields
        $seoTitle = trim($_POST['seo_title'] ?? '');
        $seoDescription = trim($_POST['seo_description'] ?? '');
        
        if (empty($title) || empty($slug) || empty($content) || empty($categoryId)) {
            send_error("Required fields (Title, Slug, Content, Category) are missing.", 400);
        }

        // Handle Image upload if present
        $uploadedImagePath = null;
        if (isset($_FILES['featured_image']) && $_FILES['featured_image']['error'] !== UPLOAD_ERR_NO_FILE) {
            $uploadedImagePath = secure_upload_file($_FILES['featured_image'], 'blogs');
        }

        if ($id > 0) {
            // UPDATE
            $sql = "
                UPDATE blogs 
                SET title = ?, slug = ?, excerpt = ?, content = ?, category_id = ?, 
                    author = ?, status = ?, is_featured = ?, publish_date = ?, 
                    seo_title = ?, seo_description = ?
            ";
            $params = [$title, $slug, $excerpt, $content, $categoryId, $author, $status, $isFeatured, $publishDate, $seoTitle, $seoDescription];
            
            if ($uploadedImagePath) {
                $sql .= ", featured_image = ?, og_image = ?";
                $params[] = $uploadedImagePath;
                $params[] = $uploadedImagePath;
            }
            
            $sql .= " WHERE id = ?";
            $params[] = $id;

            $stmt = $db->prepare($sql);
            $stmt->execute($params);

            // Handle Tags
            if (isset($_POST['tags'])) {
                $tagsArr = json_decode($_POST['tags'], true) ?? [];
                
                // Clear old maps
                $db->prepare("DELETE FROM blog_tag_map WHERE blog_id = ?")->execute([$id]);
                
                // Insert new maps
                foreach ($tagsArr as $tagId) {
                    $db->prepare("INSERT IGNORE INTO blog_tag_map (blog_id, tag_id) VALUES (?, ?)")->execute([$id, (int)$tagId]);
                }
            }

            log_activity($admin['id'], 'BLOG_UPDATE', "Updated article: {$title} (ID: {$id})");
            send_json(["success" => true, "message" => "Article updated successfully."]);

        } else {
            // CREATE
            $stmt = $db->prepare("
                INSERT INTO blogs (
                    title, slug, excerpt, content, category_id, author, status, 
                    is_featured, publish_date, seo_title, seo_description, featured_image, og_image
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $title, $slug, $excerpt, $content, $categoryId, $author, $status, 
                $isFeatured, $publishDate, $seoTitle, $seoDescription, $uploadedImagePath, $uploadedImagePath
            ]);
            $newId = $db->lastInsertId();

            // Handle Tags
            if (isset($_POST['tags'])) {
                $tagsArr = json_decode($_POST['tags'], true) ?? [];
                foreach ($tagsArr as $tagId) {
                    $db->prepare("INSERT IGNORE INTO blog_tag_map (blog_id, tag_id) VALUES (?, ?)")->execute([$newId, (int)$tagId]);
                }
            }

            log_activity($admin['id'], 'BLOG_CREATE', "Created new article: {$title} (ID: {$newId})");
            send_json(["success" => true, "message" => "Article created successfully.", "id" => (int)$newId]);
        }
    }

    // 3. DELETE (Or POST with action=delete)
    elseif ($method === 'DELETE' || ($method === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete')) {
        $id = isset($_GET['id']) ? (int)$_GET['id'] : (isset($_POST['id']) ? (int)$_POST['id'] : 0);
        
        if (empty($id)) {
            send_error("ID is required for deletion.", 400);
        }

        // Fetch title for logging
        $titleStmt = $db->prepare("SELECT title FROM blogs WHERE id = ? LIMIT 1");
        $titleStmt->execute([$id]);
        $title = $titleStmt->fetch()['title'] ?? "Unknown Article";

        // Delete maps and the blog record
        $db->prepare("DELETE FROM blog_tag_map WHERE blog_id = ?")->execute([$id]);
        $delStmt = $db->prepare("DELETE FROM blogs WHERE id = ?");
        $delStmt->execute([$id]);

        log_activity($admin['id'], 'BLOG_DELETE', "Deleted article: {$title} (ID: {$id})");
        send_json(["success" => true, "message" => "Article deleted successfully."]);
    }

} catch (Exception $e) {
    send_internal_error($e->getMessage());
}

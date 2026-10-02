<?php
/**
 * Server-Assisted SEO Pre-renderer and Route Wrapper for cPanel Shared Hosting
 */

require_once __DIR__ . '/backend/config/db.php';

// Parse Request URI
$requestUri = $_SERVER['REQUEST_URI'];
// Remove query strings
$path = parse_url($requestUri, PHP_URL_PATH);
$path = trim($path, '/');

// Initialize default SEO meta tags
$title = "Abhay Harpale | Relationship & Intimacy Advisor";
$description = "Confidential relationship and intimacy guidance for individuals and couples seeking better communication, greater understanding and more meaningful connections.";
$ogImage = "/logo.png";
$ogUrl = "http" . (isset($_SERVER['HTTPS']) ? "s" : "") . "://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
$schemaMarkup = "";
$noscriptContent = "";

try {
    $db = Database::getInstance()->getConnection();

    // Check Route Matches
    // 1. Dynamic Service Details: /services/:slug
    if (preg_match('/^services\/([a-zA-Z0-9-]+)$/', $path, $matches)) {
        $slug = $matches[1];
        $stmt = $db->prepare("SELECT title, short_description, seo_title, seo_description, image FROM services WHERE slug = ? AND status = 'published' LIMIT 1");
        $stmt->execute([$slug]);
        $service = $stmt->fetch();

        if ($service) {
            $title = $service['seo_title'] ?: ($service['title'] . " | Abhay Harpale");
            $description = $service['seo_description'] ?: $service['short_description'];
            if ($service['image']) {
                $ogImage = $service['image'];
            }
            
            // Generate Service Schema Markup
            $schemaMarkup = '
            <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "' . htmlspecialchars($service['title']) . '",
              "description": "' . htmlspecialchars($description) . '",
              "provider": {
                "@type": "Person",
                "name": "Abhay Harpale"
              }
            }
            </script>';

            $noscriptContent = "
            <noscript>
                <h1>" . htmlspecialchars($service['title']) . "</h1>
                <p>" . htmlspecialchars($description) . "</p>
            </noscript>";
        }
    } 
    // 2. Dynamic Blog Details: /blog/:slug
    elseif (preg_match('/^blog\/([a-zA-Z0-9-]+)$/', $path, $matches)) {
        $slug = $matches[1];
        $stmt = $db->prepare("SELECT title, excerpt, content, author, publish_date, seo_title, seo_description, featured_image FROM blogs WHERE slug = ? AND status = 'published' LIMIT 1");
        $stmt->execute([$slug]);
        $blog = $stmt->fetch();

        if ($blog) {
            $title = $blog['seo_title'] ?: ($blog['title'] . " | Abhay Harpale Publication");
            $description = $blog['seo_description'] ?: $blog['excerpt'];
            if ($blog['featured_image']) {
                $ogImage = $blog['featured_image'];
            }

            // Generate Article Schema Markup
            $schemaMarkup = '
            <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "' . htmlspecialchars($blog['title']) . '",
              "description": "' . htmlspecialchars($description) . '",
              "author": {
                "@type": "Person",
                "name": "' . htmlspecialchars($blog['author']) . '"
              },
              "datePublished": "' . date('c', strtotime($blog['publish_date'])) . '"
            }
            </script>';

            $noscriptContent = "
            <noscript>
                <h1>" . htmlspecialchars($blog['title']) . "</h1>
                <p>Published by " . htmlspecialchars($blog['author']) . " on " . $blog['publish_date'] . "</p>
                <div>" . $blog['content'] . "</div>
            </noscript>";
        }
    } 
    // 3. Static Pages content
    else {
        // Map slug strings
        $pageSlug = empty($path) ? 'home' : $path;
        $stmt = $db->prepare("SELECT title, meta_description FROM pages WHERE slug = ? LIMIT 1");
        $stmt->execute([$pageSlug]);
        $page = $stmt->fetch();

        if ($page) {
            $title = $page['title'];
            $description = $page['meta_description'];
        }
    }
} catch (Exception $e) {
    // Fail silently in production, keeping default tags
    error_log("SEO Pre-renderer failed: " . $e->getMessage());
}

// Load built HTML index shell (Vite output is located in frontend/dist/index.html or root index.html post build)
$htmlPath = __DIR__ . '/dist/index.html';
if (!file_exists($htmlPath)) {
    // Fallback for development/setup before npm run build
    $htmlPath = __DIR__ . '/frontend/index.html';
}

$html = file_get_contents($htmlPath);

// Inject dynamic headers
$seoTags = "
    <title>" . htmlspecialchars($title) . "</title>
    <meta name=\"description\" content=\"" . htmlspecialchars($description) . "\" />
    <meta property=\"og:title\" content=\"" . htmlspecialchars($title) . "\" />
    <meta property=\"og:description\" content=\"" . htmlspecialchars($description) . "\" />
    <meta property=\"og:image\" content=\"" . htmlspecialchars($ogImage) . "\" />
    <meta property=\"og:url\" content=\"" . htmlspecialchars($ogUrl) . "\" />
    <meta property=\"og:type\" content=\"website\" />
    <meta name=\"twitter:card\" content=\"summary_large_image\" />
    <meta name=\"twitter:title\" content=\"" . htmlspecialchars($title) . "\" />
    <meta name=\"twitter:description\" content=\"" . htmlspecialchars($description) . "\" />
    <meta name=\"twitter:image\" content=\"" . htmlspecialchars($ogImage) . "\" />
    <link rel=\"canonical\" href=\"" . htmlspecialchars($ogUrl) . "\" />
    {$schemaMarkup}
";

// Replace default Vite title and inject tags
$html = preg_replace('/<title>.*?<\/title>/i', $seoTags, $html);

// Inject noscript content at start of body
if (!empty($noscriptContent)) {
    $html = str_replace('<body>', "<body>\n{$noscriptContent}", $html);
}

echo $html;

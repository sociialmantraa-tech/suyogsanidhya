<?php
/**
 * CORS handling helper
 */

function handle_cors() {
    $config = require __DIR__ . '/../config/env.php';
    $allowedOrigins = $config['cors_allowed_origins'] ?? [];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, $allowedOrigins)) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        // Fallback to primary site URL or restrict if production
        if ($config['env'] === 'development') {
            header("Access-Control-Allow-Origin: *");
        }
    }

    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

    // Handle preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

handle_cors();

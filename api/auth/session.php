<?php
/**
 * Admin Endpoint: Validate Active Session
 */

require_once __DIR__ . '/../../backend/helpers/cors.php';
require_once __DIR__ . '/../../backend/middleware/auth.php';
require_once __DIR__ . '/../../backend/helpers/response.php';

// Authenticate request, throws 401 automatically if invalid
$admin = require_admin_auth();

// If valid, return current user parameters
send_json([
    "success" => true,
    "user" => [
        "username" => $admin['username'],
        "email" => $admin['email'],
        "role" => $admin['role']
    ]
]);

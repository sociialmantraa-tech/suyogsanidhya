<?php
/**
 * REST API response helper functions
 */

function send_json($data, $statusCode = 200) {
    // Clear default header if already set
    header_remove('Content-Type');
    header('Content-Type: application/json; charset=utf-8');
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function send_error($message, $statusCode = 400, $details = null) {
    $response = ["error" => $message];
    if ($details !== null) {
        $response["details"] = $details;
    }
    send_json($response, $statusCode);
}

function send_unauthorized($message = "Unauthorized access.") {
    send_error($message, 401);
}

function send_forbidden($message = "Action forbidden.") {
    send_error($message, 403);
}

function send_not_found($message = "Resource not found.") {
    send_error($message, 404);
}

function send_internal_error($message = "An unexpected server error occurred.") {
    send_error($message, 500);
}

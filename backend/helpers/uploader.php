<?php
/**
 * Secure file uploader helper
 */

function secure_upload_file($fileArray, $targetSubfolder) {
    if (!isset($fileArray['error']) || is_array($fileArray['error'])) {
        throw new Exception("Invalid file upload parameters.");
    }

    // Check errors
    switch ($fileArray['error']) {
        case UPLOAD_ERR_OK:
            break;
        case UPLOAD_ERR_NO_FILE:
            return null; // No file uploaded, skip
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            throw new Exception("Exceeded file size limits.");
        default:
            throw new Exception("Unknown upload error.");
    }

    // Enforce size limits (5MB max)
    if ($fileArray['size'] > 5242880) {
        throw new Exception("File size exceeds 5MB limit.");
    }

    // Verify MIME type and Extension
    $allowedMimes = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
        'image/gif' => 'gif'
    ];

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($fileArray['tmp_name']);

    if (!array_key_exists($mimeType, $allowedMimes)) {
        throw new Exception("Invalid file type. Allowed formats: WEBP, JPG, PNG, GIF.");
    }

    $extension = pathinfo($fileArray['name'], PATHINFO_EXTENSION);
    $extension = strtolower($extension);

    $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    if (!in_array($extension, $allowedExtensions)) {
        throw new Exception("Invalid file extension.");
    }

    // Define storage path
    $baseUploadDir = __DIR__ . '/../../uploads';
    $targetDir = $baseUploadDir . '/' . trim($targetSubfolder, '/');

    // Create folder if not exists
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0755, true);
    }

    // Generate unique file name
    $newFilename = sha1_file($fileArray['tmp_name']) . '_' . uniqid() . '.' . $extension;
    $targetFilepath = $targetDir . '/' . $newFilename;

    // Secure file copy
    if (!move_uploaded_file($fileArray['tmp_name'], $targetFilepath)) {
        throw new Exception("Failed to move uploaded file to target folder.");
    }

    // Return relative URL path for web access
    return '/uploads/' . trim($targetSubfolder, '/') . '/' . $newFilename;
}

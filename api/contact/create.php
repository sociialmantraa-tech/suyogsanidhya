<?php
/**
 * Public Endpoint: Submit Contact Enquiry
 */

require_once __DIR__ . '/../../backend/helpers/cors.php';
require_once __DIR__ . '/../../backend/config/db.php';
require_once __DIR__ . '/../../backend/helpers/response.php';
require_once __DIR__ . '/../../backend/services/mailer.php';

// Accept JSON payload or standard POST variables
$data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$phone = trim($data['phone'] ?? '');
$subject = trim($data['subject'] ?? '');
$message = trim($data['message'] ?? '');

// Server-side validation
if (empty($name) || empty($email) || empty($phone) || empty($subject) || empty($message)) {
    send_error("All fields are required.", 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    send_error("A valid email address is required.", 400);
}

// Basic phone character validation
if (!preg_match('/^[+\d\s\(\)-]{7,20}$/', $phone)) {
    send_error("A valid phone number is required.", 400);
}

try {
    $db = Database::getInstance()->getConnection();
    
    // Save to Database
    $stmt = $db->prepare("
        INSERT INTO contact_enquiries (name, email, phone, subject, message, status)
        VALUES (?, ?, ?, ?, ?, 'unread')
    ");
    $stmt->execute([$name, $email, $phone, $subject, $message]);

    // Send emails
    $enquiry = [
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'subject' => $subject,
        'message' => $message
    ];

    // Get Admin notification recipient email from settings
    $settingsStmt = $db->prepare("SELECT setting_value FROM site_settings WHERE setting_key = 'contact_email' LIMIT 1");
    $settingsStmt->execute();
    $adminEmailRow = $settingsStmt->fetch();
    $adminEmail = $adminEmailRow['setting_value'] ?? 'admin@domain.com';

    // 1. Send notification to admin
    $adminMailBody = Mailer::getContactEmailTemplate($enquiry);
    Mailer::send($adminEmail, "New Enquiry: " . $subject, $adminMailBody);

    // 2. Send acknowledgment to client
    $clientMailBody = "
    <html>
    <body style=\"font-family: Arial, sans-serif; color: #1F2929; line-height: 1.6;\">
        <h2 style=\"color: #008B8B;\">Thank You for Contacting Us</h2>
        <p>Dear {$name},</p>
        <p>We have successfully received your enquiry regarding \"<strong>{$subject}</strong>\". Our team will review your message and get back to you shortly.</p>
        <p>Best regards,<br><strong>Abhay Harpale Support Team</strong></p>
    </body>
    </html>";
    Mailer::send($email, "Enquiry Acknowledged - Abhay Harpale", $clientMailBody);

    send_json(["success" => true, "message" => "Your message has been sent successfully. We will contact you soon."]);
} catch (Exception $e) {
    send_internal_error("Failed to process your submission. Please try again later.");
}

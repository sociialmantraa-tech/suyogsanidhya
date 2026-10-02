<?php
/**
 * Public Endpoint: Create Pending Booking
 */

require_once __DIR__ . '/../../backend/helpers/cors.php';
require_once __DIR__ . '/../../backend/config/db.php';
require_once __DIR__ . '/../../backend/helpers/response.php';

$data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$serviceId = isset($data['service_id']) ? (int)$data['service_id'] : 0;
$bookingDate = trim($data['booking_date'] ?? '');
$bookingTime = trim($data['booking_time'] ?? '');
$name = trim($data['customer_name'] ?? '');
$email = trim($data['customer_email'] ?? '');
$phone = trim($data['customer_phone'] ?? '');
$countryCode = trim($data['country_code'] ?? '+91');
$concernMessage = trim($data['concern_message'] ?? '');
$notes = trim($data['notes'] ?? '');

// Input validation
if (empty($serviceId) || empty($bookingDate) || empty($bookingTime) || empty($name) || empty($email) || empty($phone)) {
    send_error("Required fields are missing.", 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    send_error("Valid email is required.", 400);
}

if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $bookingDate)) {
    send_error("Invalid date format.", 400);
}

try {
    $db = Database::getInstance()->getConnection();
    
    // Start Transaction
    $db->beginTransaction();

    // 1. Double check slot availability inside transaction (FOR UPDATE to lock rows if needed)
    $checkStmt = $db->prepare("
        SELECT COUNT(*) as taken 
        FROM bookings 
        WHERE booking_date = ? AND booking_time = ? AND booking_status IN ('confirmed', 'pending_payment')
    ");
    $checkStmt->execute([$bookingDate, $bookingTime]);
    $isTaken = (int)$checkStmt->fetch()['taken'];

    if ($isTaken > 0) {
        $db->rollBack();
        send_error("This slot has already been reserved. Please select a different timing.", 409);
    }

    // 2. Fetch service fee
    $srvStmt = $db->prepare("SELECT title, price, sale_price, duration FROM services WHERE id = ? AND status = 'published' LIMIT 1");
    $srvStmt->execute([$serviceId]);
    $service = $srvStmt->fetch();

    if (!$service) {
        $db->rollBack();
        send_error("Invalid service offering selected.", 404);
    }

    $price = $service['sale_price'] ? (float)$service['sale_price'] : (float)$service['price'];
    
    // Fetch tax rate from site settings (default to 18%)
    $taxStmt = $db->prepare("SELECT setting_value FROM site_settings WHERE setting_key = 'tax_rate_percent' LIMIT 1");
    $taxStmt->execute();
    $taxRateRow = $taxStmt->fetch();
    $taxRate = $taxRateRow ? (float)$taxRateRow['setting_value'] : 18.00;

    // Calculate amounts
    // Price represents final total inclusive of tax
    $basePrice = $price / (1 + ($taxRate / 100));
    $taxAmount = $price - $basePrice;

    // 3. Generate booking reference
    $datePart = date('ymd', strtotime($bookingDate));
    $randomStr = strtoupper(substr(md5(uniqid(rand(), true)), 0, 4));
    $bookingRef = "ER-{$datePart}-{$randomStr}";

    // 4. Create pending booking record
    $insertStmt = $db->prepare("
        INSERT INTO bookings (
            booking_reference, service_id, booking_date, booking_time, duration,
            amount, tax, total_amount, customer_name, customer_email, customer_phone,
            country_code, concern_message, notes, booking_status, payment_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending_payment', 'created')
    ");
    
    $insertStmt->execute([
        $bookingRef, $serviceId, $bookingDate, $bookingTime, (int)$service['duration'],
        round($basePrice, 2), round($taxAmount, 2), round($price, 2),
        $name, $email, $phone, $countryCode, $concernMessage, $notes
    ]);

    $bookingId = $db->lastInsertId();

    // Commit Transaction
    $db->commit();

    send_json([
        "success" => true,
        "booking_id" => (int)$bookingId,
        "booking_reference" => $bookingRef
    ]);

} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    send_internal_error($e->getMessage());
}

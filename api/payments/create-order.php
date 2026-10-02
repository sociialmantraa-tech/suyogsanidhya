<?php
/**
 * Public Endpoint: Create Razorpay Payment Order
 */

require_once __DIR__ . '/../../backend/helpers/cors.php';
require_once __DIR__ . '/../../backend/config/db.php';
require_once __DIR__ . '/../../backend/helpers/response.php';

$data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$bookingId = isset($data['booking_id']) ? (int)$data['booking_id'] : 0;

if (empty($bookingId)) {
    send_error("Booking ID is required.", 400);
}

try {
    $db = Database::getInstance()->getConnection();

    // 1. Fetch pending booking details
    $stmt = $db->prepare("
        SELECT b.*, s.title as service_title 
        FROM bookings b
        JOIN services s ON b.service_id = s.id
        WHERE b.id = ? AND b.booking_status = 'pending_payment'
        LIMIT 1
    ");
    $stmt->execute([$bookingId]);
    $booking = $stmt->fetch();

    if (!$booking) {
        send_error("Pending booking request not found.", 404);
    }

    // 2. Load Razorpay Credentials from Site Settings / Environment
    $envConfig = require __DIR__ . '/../../backend/config/env.php';
    
    // Get Razorpay Key Secret from env.php (securely managed server side)
    $keySecret = $envConfig['razorpay']['key_secret'];
    
    // Get Razorpay Key ID from site settings
    $settingsStmt = $db->prepare("SELECT setting_value FROM site_settings WHERE setting_key = 'razorpay_key_id' LIMIT 1");
    $settingsStmt->execute();
    $keyIdRow = $settingsStmt->fetch();
    $keyId = $keyIdRow ? $keyIdRow['setting_value'] : $envConfig['razorpay']['key_id'];

    // 3. Initiate Razorpay Order via Direct API Request using curl (zero-dependency approach)
    // Razorpay amount is in subunits (paise for INR). E.g. INR 2500.00 -> 250000 paise
    $amountSubunits = (int)round($booking['total_amount'] * 100);
    $currency = "INR";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api.razorpay.com/v1/orders");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERPWD, "{$keyId}:{$keySecret}");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        "amount" => $amountSubunits,
        "currency" => $currency,
        "receipt" => $booking['booking_reference']
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
    
    $responseRaw = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        $errorDetails = json_decode($responseRaw, true);
        $errorMsg = $errorDetails['error']['description'] ?? "Razorpay Order Creation Failed.";
        send_error("Gateway connection error: " . $errorMsg, 502);
    }

    $order = json_decode($responseRaw, true);
    $razorpayOrderId = $order['id'];

    // 4. Save/update payments record in database
    $payStmt = $db->prepare("
        INSERT INTO payments (booking_id, razorpay_order_id, amount, currency, status)
        VALUES (?, ?, ?, ?, 'created')
        ON DUPLICATE KEY UPDATE razorpay_order_id = VALUES(razorpay_order_id), amount = VALUES(amount), status = 'created'
    ");
    $payStmt->execute([$bookingId, $razorpayOrderId, $booking['total_amount'], $currency]);

    // Send safe data back to React
    send_json([
        "success" => true,
        "key_id" => $keyId,
        "razorpay_order_id" => $razorpayOrderId,
        "amount_subunit" => $amountSubunits,
        "currency" => $currency,
        "booking" => [
            "booking_reference" => $booking['booking_reference'],
            "service_title" => $booking['service_title'],
            "booking_date" => $booking['booking_date'],
            "booking_time" => $booking['booking_time'],
            "duration" => (int)$booking['duration'],
            "total_amount" => $booking['total_amount'],
            "customer_name" => $booking['customer_name'],
            "customer_email" => $booking['customer_email'],
            "customer_phone" => $booking['customer_phone'],
            "country_code" => $booking['country_code']
        ]
    ]);

} catch (Exception $e) {
    send_internal_error($e->getMessage());
}

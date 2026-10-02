<?php
/**
 * Public Endpoint: Verify Razorpay Payment Signature
 */

require_once __DIR__ . '/../../backend/helpers/cors.php';
require_once __DIR__ . '/../../backend/config/db.php';
require_once __DIR__ . '/../../backend/helpers/response.php';
require_once __DIR__ . '/../../backend/services/mailer.php';

$data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$bookingId = isset($data['booking_id']) ? (int)$data['booking_id'] : 0;
$razorpayPaymentId = trim($data['razorpay_payment_id'] ?? '');
$razorpayOrderId = trim($data['razorpay_order_id'] ?? '');
$razorpaySignature = trim($data['razorpay_signature'] ?? '');

if (empty($bookingId) || empty($razorpayPaymentId) || empty($razorpayOrderId) || empty($razorpaySignature)) {
    send_error("All signature fields are required.", 400);
}

try {
    $db = Database::getInstance()->getConnection();

    // 1. Fetch backend payment details to cross-reference
    $stmt = $db->prepare("
        SELECT p.id as payment_id, p.status as payment_status, b.*, s.title as service_title 
        FROM payments p
        JOIN bookings b ON p.booking_id = b.id
        JOIN services s ON b.service_id = s.id
        WHERE b.id = ? AND p.razorpay_order_id = ?
        LIMIT 1
    ");
    $stmt->execute([$bookingId, $razorpayOrderId]);
    $booking = $stmt->fetch();

    if (!$booking) {
        send_error("Booking/Payment session does not match order parameters.", 404);
    }

    // Prevent duplicate confirmation execution
    if ($booking['booking_status'] === 'confirmed') {
        send_json(["success" => true, "message" => "Payment already verified and booking confirmed."]);
    }

    // 2. Perform HMAC signature recalculation
    $envConfig = require __DIR__ . '/../../backend/config/env.php';
    $keySecret = $envConfig['razorpay']['key_secret'];

    $expectedSignature = hash_hmac('sha256', $razorpayOrderId . '|' . $razorpayPaymentId, $keySecret);

    if ($expectedSignature !== $razorpaySignature) {
        // Mark payment as failed on mismatch
        $failStmt = $db->prepare("UPDATE payments SET status = 'failed', error_code = 'SIG_MISMATCH', error_description = 'Signature verification failed.' WHERE id = ?");
        $failStmt->execute([$booking['payment_id']]);
        
        $bookFailStmt = $db->prepare("UPDATE bookings SET booking_status = 'cancelled', payment_status = 'failed' WHERE id = ?");
        $bookFailStmt->execute([$bookingId]);

        send_error("Payment signature verification failed.", 400);
    }

    // Start database updates
    $db->beginTransaction();

    // 3. Update payment status to captured
    $payUpdate = $db->prepare("
        UPDATE payments 
        SET status = 'captured', razorpay_payment_id = ?, razorpay_signature = ? 
        WHERE id = ?
    ");
    $payUpdate->execute([$razorpayPaymentId, $razorpaySignature, $booking['payment_id']]);

    // 4. Update booking status to confirmed
    $bookUpdate = $db->prepare("
        UPDATE bookings 
        SET booking_status = 'confirmed', payment_status = 'captured' 
        WHERE id = ?
    ");
    $bookUpdate->execute([$bookingId]);

    // 5. Block the selected slot in booking_slots table
    $slotUpdate = $db->prepare("
        INSERT INTO booking_slots (slot_date, slot_time, is_booked, booking_id)
        VALUES (?, ?, 1, ?)
        ON DUPLICATE KEY UPDATE is_booked = 1, booking_id = VALUES(booking_id)
    ");
    $slotUpdate->execute([$booking['booking_date'], $booking['booking_time'], $bookingId]);

    $db->commit();

    // 6. Dispatch transactional email confirmations via PHPMailer
    $bookingData = [
        'booking_reference' => $booking['booking_reference'],
        'service_title' => $booking['service_title'],
        'booking_date' => $booking['booking_date'],
        'booking_time' => $booking['booking_time'],
        'duration' => $booking['duration'],
        'total_amount' => $booking['total_amount'],
        'customer_name' => $booking['customer_name'],
        'customer_email' => $booking['customer_email'],
        'customer_phone' => $booking['customer_phone'],
        'country_code' => $booking['country_code'],
        'concern_message' => $booking['concern_message']
    ];

    // Client email
    $clientMail = Mailer::getBookingEmailTemplate($bookingData, false);
    Mailer::send($booking['customer_email'], "Booking Confirmation - Abhay Harpale", $clientMail);

    // Admin email
    $settingsStmt = $db->prepare("SELECT setting_value FROM site_settings WHERE setting_key = 'contact_email' LIMIT 1");
    $settingsStmt->execute();
    $adminEmailRow = $settingsStmt->fetch();
    $adminEmail = $adminEmailRow['setting_value'] ?? 'admin@domain.com';

    $adminMail = Mailer::getBookingEmailTemplate($bookingData, true);
    Mailer::send($adminEmail, "ALERT: New Booking - " . $booking['booking_reference'], $adminMail);

    send_json([
        "success" => true,
        "message" => "Payment verified and slot confirmed successfully."
    ]);

} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    send_internal_error($e->getMessage());
}

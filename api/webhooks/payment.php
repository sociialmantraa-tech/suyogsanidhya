<?php
/**
 * Public Endpoint: Razorpay Webhook Receiver
 */

require_once __DIR__ . '/../../backend/config/db.php';
require_once __DIR__ . '/../../backend/helpers/response.php';
require_once __DIR__ . '/../../backend/services/mailer.php';

// Webhooks only support POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit("Method Not Allowed");
}

$rawPayload = file_get_contents('php://input');
$headers = getallheaders();
$razorpaySignature = $headers['X-Razorpay-Signature'] ?? $headers['x-razorpay-signature'] ?? '';

if (empty($razorpaySignature)) {
    http_response_code(400);
    exit("Signature Required");
}

try {
    $db = Database::getInstance()->getConnection();
    
    // 1. Verify Webhook Signature
    $envConfig = require __DIR__ . '/../../backend/config/env.php';
    $webhookSecret = $envConfig['razorpay']['webhook_secret'];

    $expectedSignature = hash_hmac('sha256', $rawPayload, $webhookSecret);

    if ($expectedSignature !== $razorpaySignature) {
        http_response_code(400);
        exit("Invalid Signature");
    }

    $event = json_decode($rawPayload, true);
    $eventId = $event['id'] ?? '';
    $eventType = $event['event'] ?? '';

    if (empty($eventId)) {
        http_response_code(400);
        exit("Invalid Event Data");
    }

    // 2. Check Idempotency: Has this event already been processed?
    $checkStmt = $db->prepare("SELECT COUNT(*) as processed FROM payment_webhook_events WHERE event_id = ?");
    $checkStmt->execute([$eventId]);
    $isProcessed = (int)$checkStmt->fetch()['processed'];

    if ($isProcessed > 0) {
        // Event already handled, return 200 OK to Razorpay
        send_json(["status" => "ignored", "message" => "Event already processed."]);
    }

    // Record the webhook event
    $logEvent = $db->prepare("INSERT INTO payment_webhook_events (event_id, event_type, payload, processed) VALUES (?, ?, ?, 1)");
    $logEvent->execute([$eventId, $eventType, $rawPayload]);

    // 3. Process Captured Payment Event
    if ($eventType === 'payment.captured') {
        $paymentData = $event['payload']['payment']['entity'];
        $razorpayOrderId = $paymentData['order_id'];
        $razorpayPaymentId = $paymentData['id'];

        // Retrieve corresponding payment and booking record
        $stmt = $db->prepare("
            SELECT p.id as payment_id, p.status as payment_status, b.*, s.title as service_title 
            FROM payments p
            JOIN bookings b ON p.booking_id = b.id
            JOIN services s ON b.service_id = s.id
            WHERE p.razorpay_order_id = ?
            LIMIT 1
        ");
        $stmt->execute([$razorpayOrderId]);
        $booking = $stmt->fetch();

        if ($booking && $booking['booking_status'] !== 'confirmed') {
            // Confirm the booking safely inside transaction
            $db->beginTransaction();

            // Update payment
            $payUpdate = $db->prepare("UPDATE payments SET status = 'captured', razorpay_payment_id = ? WHERE id = ?");
            $payUpdate->execute([$razorpayPaymentId, $booking['payment_id']]);

            // Update booking
            $bookUpdate = $db->prepare("UPDATE bookings SET booking_status = 'confirmed', payment_status = 'captured' WHERE id = ?");
            $bookUpdate->execute([$booking['id']]);

            // Block slot
            $slotUpdate = $db->prepare("
                INSERT INTO booking_slots (slot_date, slot_time, is_booked, booking_id)
                VALUES (?, ?, 1, ?)
                ON DUPLICATE KEY UPDATE is_booked = 1, booking_id = VALUES(booking_id)
            ");
            $slotUpdate->execute([$booking['booking_date'], $booking['booking_time'], $booking['id']]);

            $db->commit();

            // Dispatch emails
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

            $clientMail = Mailer::getBookingEmailTemplate($bookingData, false);
            Mailer::send($booking['customer_email'], "Booking Confirmation - Abhay Harpale", $clientMail);

            $settingsStmt = $db->prepare("SELECT setting_value FROM site_settings WHERE setting_key = 'contact_email' LIMIT 1");
            $settingsStmt->execute();
            $adminEmailRow = $settingsStmt->fetch();
            $adminEmail = $adminEmailRow['setting_value'] ?? 'admin@domain.com';

            $adminMail = Mailer::getBookingEmailTemplate($bookingData, true);
            Mailer::send($adminEmail, "ALERT: New Booking (via Webhook) - " . $booking['booking_reference'], $adminMail);
        }
    } 
    // 4. Process Failed Payment Event
    elseif ($eventType === 'payment.failed') {
        $paymentData = $event['payload']['payment']['entity'];
        $razorpayOrderId = $paymentData['order_id'];
        
        $stmt = $db->prepare("
            SELECT p.id as payment_id, b.id as booking_id 
            FROM payments p
            JOIN bookings b ON p.booking_id = b.id
            WHERE p.razorpay_order_id = ?
            LIMIT 1
        ");
        $stmt->execute([$razorpayOrderId]);
        $booking = $stmt->fetch();

        if ($booking) {
            $payUpdate = $db->prepare("UPDATE payments SET status = 'failed', error_code = ?, error_description = ? WHERE id = ?");
            $payUpdate->execute([
                $paymentData['error_code'] ?? 'UNKNOWN', 
                $paymentData['error_description'] ?? 'Payment failed at gateway.',
                $booking['payment_id']
            ]);

            $bookUpdate = $db->prepare("UPDATE bookings SET booking_status = 'cancelled', payment_status = 'failed' WHERE id = ?");
            $bookUpdate->execute([$booking['booking_id']]);
        }
    }

    send_json(["status" => "success", "message" => "Webhook event handled successfully."]);

} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    error_log("Webhook execution failed: " . $e->getMessage());
    http_response_code(500);
    exit("Internal Server Error");
}

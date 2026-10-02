<?php
/**
 * Public Endpoint: Fetch Available Booking Slots
 */

require_once __DIR__ . '/../../backend/helpers/cors.php';
require_once __DIR__ . '/../../backend/config/db.php';
require_once __DIR__ . '/../../backend/helpers/response.php';

$date = $_GET['date'] ?? '';
$serviceId = isset($_GET['service_id']) ? (int)$_GET['service_id'] : 0;

if (empty($date)) {
    send_error("Date parameter is required.", 400);
}

// Validate date format YYYY-MM-DD
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    send_error("Invalid date format. Use YYYY-MM-DD.", 400);
}

try {
    $db = Database::getInstance()->getConnection();

    // 1. Define default operational slots
    $defaultSlots = ['10:00:00', '11:30:00', '14:00:00', '15:30:00', '17:00:00'];

    // 2. Query already reserved/blocked slots for this date
    // We block slots that are either confirmed or pending payment (in cart/checkout progress)
    $stmt = $db->prepare("
        SELECT booking_time 
        FROM bookings 
        WHERE booking_date = ? 
          AND booking_status IN ('confirmed', 'pending_payment')
    ");
    $stmt->execute([$date]);
    $blockedSlots = $stmt->fetchAll(PDO::FETCH_COLUMN);

    // 3. Filter out blocked slots
    $availableSlots = array_values(array_diff($defaultSlots, $blockedSlots));

    send_json(["slots" => $availableSlots]);
} catch (Exception $e) {
    send_internal_error($e->getMessage());
}

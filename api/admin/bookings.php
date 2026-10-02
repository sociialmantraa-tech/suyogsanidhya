<?php
/**
 * Admin Endpoint: Manage Bookings & Schedules
 */

require_once __DIR__ . '/../../backend/helpers/cors.php';
require_once __DIR__ . '/../../backend/middleware/auth.php';
require_once __DIR__ . '/../../backend/helpers/response.php';
require_once __DIR__ . '/../../backend/helpers/logger.php';

$admin = require_admin_auth();

$method = $_SERVER['REQUEST_METHOD'];
$db = Database::getInstance()->getConnection();

try {
    if ($method === 'GET') {
        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        
        if ($id > 0) {
            // Fetch detailed booking with payment link
            $stmt = $db->prepare("
                SELECT b.*, s.title as service_title, p.razorpay_order_id, p.razorpay_payment_id, p.status as razorpay_status
                FROM bookings b
                JOIN services s ON b.service_id = s.id
                LEFT JOIN payments p ON b.id = p.booking_id
                WHERE b.id = ?
                LIMIT 1
            ");
            $stmt->execute([$id]);
            $booking = $stmt->fetch();
            
            if (!$booking) send_not_found("Booking not found.");
            
            send_json(["booking" => $booking]);
        } else {
            // Fetch list with pagination and search
            $status = trim($_GET['status'] ?? '');
            $search = trim($_GET['search'] ?? '');
            
            $sql = "
                SELECT b.id, b.booking_reference, b.booking_date, b.booking_time, b.customer_name, 
                       b.customer_email, b.booking_status, b.payment_status, b.total_amount, s.title as service_title
                FROM bookings b
                JOIN services s ON b.service_id = s.id
                WHERE 1=1
            ";
            $params = [];
            
            if (!empty($status)) {
                $sql .= " AND b.booking_status = ?";
                $params[] = $status;
            }
            
            if (!empty($search)) {
                $sql .= " AND (b.customer_name LIKE ? OR b.customer_email LIKE ? OR b.booking_reference LIKE ?)";
                $params[] = "%$search%";
                $params[] = "%$search%";
                $params[] = "%$search%";
            }
            
            $sql .= " ORDER BY b.booking_date DESC, b.booking_time DESC, b.id DESC";
            
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $bookings = $stmt->fetchAll();
            
            send_json(["bookings" => $bookings]);
        }
    }

    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        
        $id = isset($data['id']) ? (int)$data['id'] : 0;
        $bookingStatus = trim($data['booking_status'] ?? '');
        $paymentStatus = trim($data['payment_status'] ?? '');
        $notes = trim($data['notes'] ?? '');
        $rescheduleDate = trim($data['reschedule_date'] ?? '');
        $rescheduleTime = trim($data['reschedule_time'] ?? '');

        if (empty($id)) {
            send_error("Booking ID is required.", 400);
        }

        // Fetch original to trace changes
        $origStmt = $db->prepare("SELECT * FROM bookings WHERE id = ? LIMIT 1");
        $origStmt->execute([$id]);
        $original = $origStmt->fetch();

        if (!$original) {
            send_error("Booking record not found.", 404);
        }

        $db->beginTransaction();

        $updateFields = [];
        $params = [];

        if (!empty($bookingStatus)) {
            $updateFields[] = "booking_status = ?";
            $params[] = $bookingStatus;
            
            // If cancelled, free up slot
            if ($bookingStatus === 'cancelled') {
                $db->prepare("DELETE FROM booking_slots WHERE booking_id = ?")->execute([$id]);
            }
        }

        if (!empty($paymentStatus)) {
            $updateFields[] = "payment_status = ?";
            $params[] = $paymentStatus;
        }

        if ($notes !== null) {
            $updateFields[] = "notes = ?";
            $params[] = $notes;
        }

        // Handle Rescheduling
        if (!empty($rescheduleDate) && !empty($rescheduleTime)) {
            // Free old slot
            $db->prepare("DELETE FROM booking_slots WHERE booking_id = ?")->execute([$id]);

            // Verify new slot is free
            $chk = $db->prepare("SELECT COUNT(*) as taken FROM bookings WHERE booking_date = ? AND booking_time = ? AND booking_status IN ('confirmed', 'pending_payment') AND id != ?");
            $chk->execute([$rescheduleDate, $rescheduleTime, $id]);
            if ((int)$chk->fetch()['taken'] > 0) {
                $db->rollBack();
                send_error("The selected rescheduling slot is already occupied.", 409);
            }

            $updateFields[] = "booking_date = ?";
            $updateFields[] = "booking_time = ?";
            $params[] = $rescheduleDate;
            $params[] = $rescheduleTime;

            // Block new slot
            $insSlot = $db->prepare("INSERT INTO booking_slots (slot_date, slot_time, is_booked, booking_id) VALUES (?, ?, 1, ?) ON DUPLICATE KEY UPDATE is_booked = 1, booking_id = VALUES(booking_id)");
            $insSlot->execute([$rescheduleDate, $rescheduleTime, $id]);
            
            $updateFields[] = "booking_status = 'rescheduled'";
        }

        if (empty($updateFields)) {
            $db->rollBack();
            send_error("No fields submitted for update.", 400);
        }

        $sql = "UPDATE bookings SET " . implode(", ", $updateFields) . " WHERE id = ?";
        $params[] = $id;

        $stmt = $db->prepare($sql);
        $stmt->execute($params);

        $db->commit();

        log_activity($admin['id'], 'BOOKING_UPDATE', "Updated booking reference {$original['booking_reference']} (ID: {$id})");
        send_json(["success" => true, "message" => "Booking updated successfully."]);
    }

} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    send_internal_error($e->getMessage());
}

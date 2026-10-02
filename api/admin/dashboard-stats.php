<?php
/**
 * Admin Endpoint: Fetch Dashboard Metrics
 */

require_once __DIR__ . '/../../backend/helpers/cors.php';
require_once __DIR__ . '/../../backend/middleware/auth.php';
require_once __DIR__ . '/../../backend/helpers/response.php';

// Authenticate
$admin = require_admin_auth();

try {
    $db = Database::getInstance()->getConnection();

    // 1. Total Bookings
    $totStmt = $db->prepare("SELECT COUNT(*) as total FROM bookings");
    $totStmt->execute();
    $totalBookings = (int)$totStmt->fetch()['total'];

    // 2. Today's Bookings
    $todStmt = $db->prepare("SELECT COUNT(*) as total FROM bookings WHERE booking_date = CURDATE()");
    $todStmt->execute();
    $todayBookings = (int)$todStmt->fetch()['total'];

    // 3. Bookings by Status
    $statusStmt = $db->prepare("
        SELECT booking_status, COUNT(*) as count 
        FROM bookings 
        GROUP BY booking_status
    ");
    $statusStmt->execute();
    $bookingsByStatus = $statusStmt->fetchAll();
    
    $pendingBookings = 0;
    $confirmedBookings = 0;
    foreach ($bookingsByStatus as $row) {
        if ($row['booking_status'] === 'pending_payment') {
            $pendingBookings = (int)$row['count'];
        } elseif ($row['booking_status'] === 'confirmed') {
            $confirmedBookings = (int)$row['count'];
        }
    }

    // 4. Monthly Revenue (Current Month, Confirmed Bookings)
    $revStmt = $db->prepare("
        SELECT SUM(total_amount) as total 
        FROM bookings 
        WHERE booking_status = 'confirmed' 
          AND MONTH(created_at) = MONTH(CURRENT_DATE()) 
          AND YEAR(created_at) = YEAR(CURRENT_DATE())
    ");
    $revStmt->execute();
    $monthlyRevenue = (float)($revStmt->fetch()['total'] ?? 0.00);

    // 5. Payment success rate
    $successStmt = $db->prepare("
        SELECT 
          COUNT(CASE WHEN status = 'captured' THEN 1 END) as captured,
          COUNT(*) as total
        FROM payments
    ");
    $successStmt->execute();
    $payStats = $successStmt->fetch();
    $successRate = $payStats['total'] > 0 ? round(($payStats['captured'] / $payStats['total']) * 100, 1) : 100.0;

    // 6. Recent Enquiries (Last 5)
    $enqStmt = $db->prepare("
        SELECT id, name, email, subject, created_at, status 
        FROM contact_enquiries 
        ORDER BY id DESC 
        LIMIT 5
    ");
    $enqStmt->execute();
    $recentEnquiries = $enqStmt->fetchAll();

    // 7. Recent Payments (Last 5)
    $payListStmt = $db->prepare("
        SELECT p.id, p.razorpay_payment_id, p.amount, p.status, p.created_at, b.customer_name 
        FROM payments p
        JOIN bookings b ON p.booking_id = b.id
        ORDER BY p.id DESC 
        LIMIT 5
    ");
    $payListStmt->execute();
    $recentPayments = $payListStmt->fetchAll();

    // 8. Recent Activities (Last 5)
    $actStmt = $db->prepare("
        SELECT l.id, l.action, l.description, l.ip_address, l.created_at, a.username 
        FROM activity_logs l
        LEFT JOIN admins a ON l.admin_id = a.id
        ORDER BY l.id DESC 
        LIMIT 5
    ");
    $actStmt->execute();
    $recentActivities = $actStmt->fetchAll();

    send_json([
        "metrics" => [
            "total_bookings" => $totalBookings,
            "today_bookings" => $todayBookings,
            "pending_bookings" => $pendingBookings,
            "confirmed_bookings" => $confirmedBookings,
            "monthly_revenue" => $monthlyRevenue,
            "payment_success_rate" => $successRate
        ],
        "recent_enquiries" => $recentEnquiries,
        "recent_payments" => $recentPayments,
        "recent_activities" => $recentActivities
    ]);

} catch (Exception $e) {
    send_internal_error($e->getMessage());
}

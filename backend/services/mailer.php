<?php
/**
 * Mailer service using PHPMailer (Composer autoloaded)
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Check for Composer Autoloader
$autoloader = __DIR__ . '/../vendor/autoload.php';
if (file_exists($autoloader)) {
    require_once $autoloader;
}

class Mailer {
    public static function send($to, $subject, $body, $altBody = '') {
        $config = require __DIR__ . '/../config/env.php';
        $smtp = $config['smtp'];

        // If Composer autoloader hasn't loaded PHPMailer (e.g. before setup), log it and use mail() fallback if allowed.
        if (!class_exists('PHPMailer\PHPMailer\PHPMailer')) {
            error_log("PHPMailer class not found. Make sure to run 'composer install' in the backend directory. Falling back to native PHP mail().");
            $headers = "MIME-Version: 1.0\r\n";
            $headers .= "Content-type: text/html; charset=utf-8\r\n";
            $headers .= "From: {$smtp['from_name']} <{$smtp['from_email']}>\r\n";
            return mail($to, $subject, $body, $headers);
        }

        $mail = new PHPMailer(true);

        try {
            // Server settings
            $mail->isSMTP();
            $mail->Host       = $smtp['host'];
            $mail->SMTPAuth   = !empty($smtp['username']) && !empty($smtp['password']);
            $mail->Username   = $smtp['username'];
            $mail->Password   = $smtp['password'];
            $mail->Port       = $smtp['port'];
            
            if ($smtp['encryption'] === 'tls') {
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            } elseif ($smtp['encryption'] === 'ssl') {
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            }

            // Recipients
            $mail->setFrom($smtp['from_email'], $smtp['from_name']);
            $mail->addAddress($to);

            // Content
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $body;
            $mail->AltBody = $altBody ?: strip_tags($body);

            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log("Mailer Error: {$mail->ErrorInfo}");
            return false;
        }
    }

    public static function getBookingEmailTemplate($booking, $is_admin = false) {
        $site_name = "Abhay Harpale";
        $title = $is_admin ? "New Booking Confirmed" : "Your Session is Confirmed";
        $recipient_name = $is_admin ? "Administrator" : $booking['customer_name'];

        return "
        <html>
        <head>
            <style>
                body { font-family: 'Manrope', 'Inter', sans-serif; color: #1F2929; background-color: #FFFFF0; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid #F2EDDC; border-radius: 8px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
                h1 { color: #008B8B; font-size: 24px; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #F2EDDC; padding-bottom: 10px; }
                p { line-height: 1.6; margin-bottom: 15px; }
                .details-box { background-color: #FFFFF0; border-left: 4px solid #008B8B; padding: 15px; margin: 20px 0; border-radius: 4px; }
                .details-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
                .details-row strong { color: #5F6B69; }
                .footer { margin-top: 30px; border-top: 1px solid #F2EDDC; padding-top: 20px; font-size: 12px; color: #5F6B69; text-align: center; }
            </style>
        </head>
        <body>
            <div class='container'>
                <h1>{$title}</h1>
                <p>Hello {$recipient_name},</p>
                <p>" . ($is_admin ? "A new appointment has been scheduled and paid for." : "Thank you for scheduling your session. Your payment has been successfully processed and your slot is officially booked.") . "</p>
                
                <div class='details-box'>
                    <div class='details-row'><strong>Reference:</strong> <span>{$booking['booking_reference']}</span></div>
                    <div class='details-row'><strong>Service:</strong> <span>{$booking['service_title']}</span></div>
                    <div class='details-row'><strong>Date:</strong> <span>{$booking['booking_date']}</span></div>
                    <div class='details-row'><strong>Time:</strong> <span>{$booking['booking_time']} (IST)</span></div>
                    <div class='details-row'><strong>Duration:</strong> <span>{$booking['duration']} minutes</span></div>
                    <div class='details-row'><strong>Amount Paid:</strong> <span>INR {$booking['total_amount']}</span></div>
                </div>

                " . ($is_admin ? "
                <p><strong>Customer Details:</strong><br>
                Name: {$booking['customer_name']}<br>
                Email: {$booking['customer_email']}<br>
                Phone: {$booking['country_code']} {$booking['customer_phone']}<br>
                Message: " . htmlspecialchars($booking['concern_message'] ?? 'None') . "</p>
                " : "
                <p><strong>Important Preparation Guidelines:</strong></p>
                <ul>
                    <li>Please connect from a quiet, private space with a stable internet connection.</li>
                    <li>If this is your first session, we recommend logging in 5 minutes early to test your audio/video configuration.</li>
                    <li>Rescheduling can be requested up to 24 hours prior to the session through email or support channels.</li>
                </ul>
                ") . "

                <p>Best regards,<br><strong>{$site_name} Team</strong></p>
                
                <div class='footer'>
                    This is an automated transactional message. Please do not reply directly to this email.<br>
                    &copy; " . date('Y') . " {$site_name}. All rights reserved.
                </div>
            </div>
        </body>
        </html>
        ";
    }

    public static function getContactEmailTemplate($enquiry) {
        return "
        <html>
        <head>
            <style>
                body { font-family: 'Manrope', 'Inter', sans-serif; color: #1F2929; background-color: #FFFFF0; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid #F2EDDC; border-radius: 8px; padding: 30px; }
                h1 { color: #008B8B; font-size: 20px; margin-bottom: 20px; border-bottom: 2px solid #F2EDDC; padding-bottom: 10px; }
                p { line-height: 1.6; margin-bottom: 15px; }
                .details-box { background-color: #FFFFF0; border-left: 4px solid #008B8B; padding: 15px; margin: 20px 0; border-radius: 4px; }
                .footer { margin-top: 30px; border-top: 1px solid #F2EDDC; padding-top: 20px; font-size: 12px; color: #5F6B69; text-align: center; }
            </style>
        </head>
        <body>
            <div class='container'>
                <h1>New Enquiry Received</h1>
                <p>Hello Admin,</p>
                <p>You have received a new contact submission from the website.</p>
                
                <div class='details-box'>
                    <strong>From:</strong> " . htmlspecialchars($enquiry['name']) . " (" . htmlspecialchars($enquiry['email']) . ")<br>
                    <strong>Phone:</strong> " . htmlspecialchars($enquiry['phone']) . "<br>
                    <strong>Subject:</strong> " . htmlspecialchars($enquiry['subject']) . "<br><br>
                    <strong>Message:</strong><br>
                    " . nl2br(htmlspecialchars($enquiry['message'])) . "
                </div>

                <p>Best regards,<br><strong>Website System</strong></p>
                
                <div class='footer'>
                    &copy; " . date('Y') . " Website System.
                </div>
            </div>
        </body>
        </html>
        ";
    }
}

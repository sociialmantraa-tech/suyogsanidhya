<?php
/**
 * Application Configuration Environment Variables Template
 * Rename this file to env.php and populate with actual credentials.
 */

return [
    'env' => 'development', // 'development' or 'production'
    'site_url' => 'http://localhost:5173',
    'admin_url' => 'http://localhost:5174',
    'api_url' => 'http://localhost/api',

    // Database Configuration
    'db' => [
        'host' => '127.0.0.1',
        'dbname' => 'astrologer_db',
        'username' => 'root',
        'password' => '',
        'charset' => 'utf8mb4'
    ],

    // Razorpay Configuration
    'razorpay' => [
        'key_id' => 'rzp_test_MckL5gR2T7o8U1',
        'key_secret' => 'YOUR_RAZORPAY_KEY_SECRET',
        'webhook_secret' => 'YOUR_RAZORPAY_WEBHOOK_SECRET'
    ],

    // SMTP Mailer Configuration
    'smtp' => [
        'host' => 'smtp.mailtrap.io',
        'port' => 2525,
        'username' => '',
        'password' => '',
        'encryption' => 'tls', // 'tls', 'ssl', or null
        'from_email' => 'noreply@domain.com',
        'from_name' => 'Abhay Harpale'
    ],

    // Admin Security Configuration
    'jwt_secret' => 'YOUR_RANDOM_SECURE_JWT_SECRET_KEY_HERE',
    'session_lifetime' => 86400, // 24 hours in seconds
    'cors_allowed_origins' => [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost'
    ]
];

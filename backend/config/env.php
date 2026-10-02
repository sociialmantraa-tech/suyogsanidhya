<?php
/**
 * Application Configuration Environment Variables
 */

return [
    'env' => 'development', // 'development' or 'production'
    'site_url' => 'http://localhost:5173',
    'admin_url' => 'http://localhost:5174',
    'api_url' => 'http://localhost/api',

    // Database Configuration
    'db' => [
        'host' => '127.0.0.1',
        'port' => 3307,
        'dbname' => 'astrologer_db',
        'username' => 'root',
        'password' => 'root',
        'charset' => 'utf8mb4'
    ],

    // Razorpay Configuration
    'razorpay' => [
        'key_id' => 'rzp_test_MckL5gR2T7o8U1',
        'key_secret' => 'rzp_test_secret_placeholder',
        'webhook_secret' => 'webhook_secret_placeholder'
    ],

    // SMTP Mailer Configuration
    'smtp' => [
        'host' => 'smtp.mailtrap.io',
        'port' => 2525,
        'username' => '',
        'password' => '',
        'encryption' => 'tls',
        'from_email' => 'noreply@domain.com',
        'from_name' => 'Abhay Harpale'
    ],

    // Admin Security Configuration
    'jwt_secret' => '4df6a9c372b0c16ae39a0efb925f387cd1a97df146033878bd6c810d2ff863b1',
    'session_lifetime' => 86400,
    'cors_allowed_origins' => [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost'
    ]
];

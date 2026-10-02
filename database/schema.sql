-- Custom Consultation & Brand Website Schema
-- Host: cPanel Shared Hosting (MySQL)
-- Database Collation: utf8mb4_unicode_ci

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `activity_logs`;
DROP TABLE IF EXISTS `site_settings`;
DROP TABLE IF EXISTS `media`;
DROP TABLE IF EXISTS `newsletter_subscribers`;
DROP TABLE IF EXISTS `contact_enquiries`;
DROP TABLE IF EXISTS `faqs`;
DROP TABLE IF EXISTS `videos`;
DROP TABLE IF EXISTS `testimonials`;
DROP TABLE IF EXISTS `blog_tag_map`;
DROP TABLE IF EXISTS `blog_tags`;
DROP TABLE IF EXISTS `blogs`;
DROP TABLE IF EXISTS `blog_categories`;
DROP TABLE IF EXISTS `refunds`;
DROP TABLE IF EXISTS `payment_webhook_events`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `booking_slots`;
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `concern_service_map`;
DROP TABLE IF EXISTS `concerns`;
DROP TABLE IF EXISTS `services`;
DROP TABLE IF EXISTS `service_categories`;
DROP TABLE IF EXISTS `page_sections`;
DROP TABLE IF EXISTS `pages`;
DROP TABLE IF EXISTS `admin_sessions`;
DROP TABLE IF EXISTS `admins`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Admins and Sessions
CREATE TABLE `admins` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `role` VARCHAR(20) DEFAULT 'admin',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `admin_sessions` (
    `id` VARCHAR(128) PRIMARY KEY,
    `admin_id` INT NOT NULL,
    `ip_address` VARCHAR(45) NOT NULL,
    `user_agent` VARCHAR(255) NOT NULL,
    `expires_at` DATETIME NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Dynamic CMS Pages & Sections
CREATE TABLE `pages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `slug` VARCHAR(50) NOT NULL UNIQUE,
    `title` VARCHAR(255) NOT NULL,
    `meta_description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `page_sections` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `page_id` INT NOT NULL,
    `section_key` VARCHAR(50) NOT NULL,
    `section_name` VARCHAR(100) NOT NULL,
    `content` JSON NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `page_section_idx` (`page_id`, `section_key`),
    FOREIGN KEY (`page_id`) REFERENCES `pages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Services & Categories
CREATE TABLE `service_categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `services` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `category_id` INT NULL,
    `title` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(150) NOT NULL UNIQUE,
    `short_description` VARCHAR(255) NOT NULL,
    `full_description` TEXT NOT NULL,
    `image` VARCHAR(255) NULL,
    `icon` VARCHAR(50) NULL,
    `duration` INT NOT NULL COMMENT 'duration in minutes',
    `price` DECIMAL(10,2) NOT NULL,
    `sale_price` DECIMAL(10,2) NULL,
    `display_order` INT DEFAULT 0,
    `status` ENUM('draft', 'published') DEFAULT 'draft',
    `seo_title` VARCHAR(150) NULL,
    `seo_description` TEXT NULL,
    `canonical_url` VARCHAR(255) NULL,
    `social_share_image` VARCHAR(255) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `service_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Concerns & Mapping
CREATE TABLE `concerns` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(150) NOT NULL UNIQUE,
    `description` TEXT NOT NULL,
    `status` ENUM('draft', 'published') DEFAULT 'draft',
    `display_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `concern_service_map` (
    `concern_id` INT NOT NULL,
    `service_id` INT NOT NULL,
    PRIMARY KEY (`concern_id`, `service_id`),
    FOREIGN KEY (`concern_id`) REFERENCES `concerns` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Bookings & Available Slots
CREATE TABLE `bookings` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `booking_reference` VARCHAR(20) NOT NULL UNIQUE,
    `service_id` INT NOT NULL,
    `booking_date` DATE NOT NULL,
    `booking_time` TIME NOT NULL,
    `duration` INT NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `tax` DECIMAL(10,2) DEFAULT 0.00,
    `total_amount` DECIMAL(10,2) NOT NULL,
    `customer_name` VARCHAR(100) NOT NULL,
    `customer_email` VARCHAR(100) NOT NULL,
    `customer_phone` VARCHAR(20) NOT NULL,
    `country_code` VARCHAR(5) NOT NULL,
    `concern_message` TEXT,
    `notes` TEXT,
    `booking_status` ENUM('pending_payment', 'confirmed', 'completed', 'cancelled', 'rescheduled', 'refunded', 'no_show') DEFAULT 'pending_payment',
    `payment_status` ENUM('created', 'pending', 'authorized', 'captured', 'failed', 'refunded', 'partially_refunded') DEFAULT 'created',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE RESTRICT,
    INDEX `booking_date_time_idx` (`booking_date`, `booking_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `booking_slots` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `slot_date` DATE NOT NULL,
    `slot_time` TIME NOT NULL,
    `is_booked` TINYINT DEFAULT 0,
    `booking_id` INT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_slot_idx` (`slot_date`, `slot_time`),
    FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Payments, Webhooks & Refunds
CREATE TABLE `payments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `booking_id` INT NOT NULL,
    `razorpay_order_id` VARCHAR(100) NOT NULL UNIQUE,
    `razorpay_payment_id` VARCHAR(100) NULL,
    `razorpay_signature` VARCHAR(255) NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `currency` VARCHAR(10) DEFAULT 'INR',
    `status` VARCHAR(50) NOT NULL DEFAULT 'created',
    `error_code` VARCHAR(50) NULL,
    `error_description` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `payment_webhook_events` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `event_id` VARCHAR(100) NOT NULL UNIQUE,
    `event_type` VARCHAR(100) NOT NULL,
    `payload` JSON NOT NULL,
    `processed` TINYINT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `refunds` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `payment_id` INT NOT NULL,
    `razorpay_refund_id` VARCHAR(100) NOT NULL UNIQUE,
    `amount` DECIMAL(10,2) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Blog System
CREATE TABLE `blog_categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `blogs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(200) NOT NULL UNIQUE,
    `excerpt` VARCHAR(255) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `featured_image` VARCHAR(255) NULL,
    `category_id` INT NOT NULL,
    `author` VARCHAR(100) DEFAULT 'Dr. BrandName',
    `publish_date` DATETIME NOT NULL,
    `status` ENUM('draft', 'published', 'scheduled') DEFAULT 'draft',
    `is_featured` TINYINT DEFAULT 0,
    `seo_title` VARCHAR(150) NULL,
    `seo_description` TEXT NULL,
    `canonical_url` VARCHAR(255) NULL,
    `og_image` VARCHAR(255) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `blog_categories` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `blog_tags` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `slug` VARCHAR(50) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `blog_tag_map` (
    `blog_id` INT NOT NULL,
    `tag_id` INT NOT NULL,
    PRIMARY KEY (`blog_id`, `tag_id`),
    FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tag_id`) REFERENCES `blog_tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Testimonials, Videos & FAQs
CREATE TABLE `testimonials` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `client_name` VARCHAR(100) NOT NULL,
    `client_avatar` VARCHAR(255) NULL,
    `client_initials` VARCHAR(5) NOT NULL,
    `rating` TINYINT DEFAULT 5,
    `service_category` VARCHAR(100) NULL,
    `testimonial_text` TEXT NOT NULL,
    `video_url` VARCHAR(255) NULL,
    `display_order` INT DEFAULT 0,
    `is_featured` TINYINT DEFAULT 0,
    `status` ENUM('draft', 'published') DEFAULT 'draft',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `videos` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(200) NOT NULL UNIQUE,
    `category` VARCHAR(100) NULL,
    `description` TEXT,
    `thumbnail_url` VARCHAR(255) NULL,
    `video_url` VARCHAR(255) NOT NULL,
    `duration` VARCHAR(50) NULL,
    `display_order` INT DEFAULT 0,
    `status` ENUM('draft', 'published') DEFAULT 'draft',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `faqs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `question` TEXT NOT NULL,
    `answer` TEXT NOT NULL,
    `display_order` INT DEFAULT 0,
    `status` ENUM('draft', 'published') DEFAULT 'draft',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Infrastructure Tables (Media, Settings, Enquiries, Subs, Logs)
CREATE TABLE `media` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `filename` VARCHAR(255) NOT NULL,
    `filepath` VARCHAR(255) NOT NULL,
    `filetype` VARCHAR(50) NOT NULL,
    `filesize` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `contact_enquiries` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `subject` VARCHAR(150) NOT NULL,
    `message` TEXT NOT NULL,
    `status` ENUM('unread', 'read', 'replied') DEFAULT 'unread',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `newsletter_subscribers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `status` ENUM('active', 'unsubscribed') DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `site_settings` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `setting_key` VARCHAR(100) NOT NULL UNIQUE,
    `setting_value` TEXT NULL,
    `setting_group` VARCHAR(50) DEFAULT 'general',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `activity_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `admin_id` INT NULL,
    `action` VARCHAR(100) NOT NULL,
    `description` TEXT NOT NULL,
    `ip_address` VARCHAR(45) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

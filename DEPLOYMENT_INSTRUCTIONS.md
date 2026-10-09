# 🚀 cPanel / GoDaddy Deployment Guide for suyogweb.zip

The file `suyogweb.zip` (and `public_html.zip`) in the project root is fully configured for cPanel / Apache shared hosting deployment.

---

### 📦 Step 1: Upload & Extract Zip to `public_html`
1. Log into your **cPanel** account.
2. Open **File Manager** and navigate to your domain's root folder (usually `public_html`).
3. Click **Upload** and upload `suyogweb.zip`.
4. Select `suyogweb.zip` in File Manager and click **Extract**.

---

### 🗄️ Step 2: Import MySQL Database
1. In cPanel, go to **MySQL® Databases**.
2. Create a database named `astrologer_db` (or your preferred database name).
3. Create a MySQL user, set a strong password, and assign **All Privileges** to the database.
4. Open **phpMyAdmin** from cPanel, select your database, click **Import**, and upload `database/seed.sql` (or `database/schema.sql`).

---

### ⚙️ Step 3: Configure Database Credentials
1. In File Manager, open `backend/config/env.example.php`.
2. Rename `env.example.php` to **`env.php`** (or create `env.php` inside `backend/config/`).
3. Update your database host, database name, username, and password:

```php
<?php
return [
    'env' => 'production',
    'site_url' => 'https://suyogsaanidhya.com',
    'api_url' => 'https://suyogsaanidhya.com/api',

    'db' => [
        'host' => 'localhost',
        'dbname' => 'cpaneluser_astrologer_db',
        'username' => 'cpaneluser_dbuser',
        'password' => 'YOUR_DATABASE_PASSWORD',
        'charset' => 'utf8mb4'
    ],
    ...
];
```

---

### ✨ Features Included in Package:
- **Clean Routing**: Pre-configured `.htaccess` supports clean URLs (`/about`, `/services`, `/book`, `/contact`, `/stories`).
- **High-Res Favicons**: Matches brand emblem (`favicon.svg`, `favicon.ico`, `apple-touch-icon.png`).
- **Dual Services**: *Couple Compatibility Check* & *Pre-Marriage Counselling* with "To Be Confirmed" pricing & Dec 1st calendar opening.
- **Form Input Validation**: Instant `onBlur` field validation for Indian (+91 10-digit) & international phone numbers.

# Professional Consultation & Brand Website Deployment Guide

A fully custom-coded, production-ready website featuring a React + Vite frontend, a custom Admin CMS panel, a secure PHP 8.2 REST API, and Razorpay payment integration, optimized for shared cPanel hosting.

---

## ⚡ Quick Start & Admin Credentials

| Item | Details |
| :--- | :--- |
| **Frontend URL** | [http://localhost:5173/](http://localhost:5173/) |
| **Admin Portal URL** | [http://localhost:5174/login](http://localhost:5174/login) |
| **Admin Username** | `admin` *(or `admin@abhayharpale.com`)* |
| **Admin Password** | `AdminPassword123!` |
| **Run Frontend** | `npm run dev` |
| **Run Admin Panel** | `npm run dev:admin` |
| **Build All** | `npm run build` |

---

## 1. Project Directory Structure
```
project/
|-- dist/                  # Compiled public frontend (uploaded to public_html)
|-- admin_dist/            # Compiled admin panel (uploaded to public_html/admin)
|-- backend/               # Core PHP scripts, config, services, and autoloader
|   |-- config/env.php     # Private system credentials (CORS, DB, SMTP, Razorpay)
|   |-- config/db.php      # PDO database connection helper
|   |-- middleware/auth.php# Admin session verification middleware
|   |-- services/mailer.php# PHPMailer SMTP client wrappers
|   |-- helpers/uploader.php# Secure file uploads helper
|-- api/                   # REST API routes (services, blogs, bookings, payments, contact, webhooks)
|-- database/              # MySQL schema.sql and seed.sql files
|-- uploads/               # Asset folders for services, blogs, media, testimonials
|-- index.php              # Server-assisted SEO pre-rendering router
|-- .htaccess              # Apache URL rewrite and asset caching rules
```

---

## 2. Database Installation
1. **Create MySQL Database**: Log into cPanel, navigate to **MySQL Database Wizard**, and create a database (e.g. `user_astrologer_db`).
2. **Create Database User**: Create a user and grant **All Privileges** to the new database. Note the database name, username, and password.
3. **Import Schema**: Navigate to **phpMyAdmin** in cPanel, select the new database, click **Import**, select `database/schema.sql`, and execute.
4. **Import Seed Data**: Click **Import** again, select `database/seed.sql`, and execute to load starter datasets and default admin user credentials.

---

## 3. Server Configuration & Private Credentials
Navigate to `backend/config/env.php` and configure:
- **Environment**: Toggle `'env' => 'production'` when deploying to hide error stack traces.
- **Database Config**: Enter database host, name, username, and password under the `db` array.
- **Razorpay Config**: Enter your public Key ID and private Key Secret under `razorpay`.
- **SMTP Mailer**: Enter host, port, username, password, and sender credentials under `smtp`.
- **CORS Setup**: List your public domain URL inside the `cors_allowed_origins` list to lock down API access.

---

## 4. Razorpay Gateway Setup
- **Key ID Configuration**: Enter your public `rzp_test_...` or `rzp_live_...` Key ID in the `site_settings` table (via phpMyAdmin or Settings panel in admin) to load it in the React payment widget.
- **Key Secret Configuration**: Save your private Razorpay Key Secret inside `backend/config/env.php`. Never expose this file to frontend repositories.
- **Webhook Registration**:
  1. Log into your Razorpay Dashboard, navigate to **Settings** &rarr; **Webhooks** &rarr; **Add New Webhook**.
  2. Set the Webhook URL to: `https://yourdomain.com/api/webhooks/payment.php`
  3. Under **Active Events**, select `payment.captured` and `payment.failed`.
  4. Define a secure webhook secret key and save it inside both the Razorpay panel and `backend/config/env.php` under `[razorpay][webhook_secret]`.

---

## 5. Frontend & Admin Compilation
Build the production-ready code locally before uploading to the server.

### Compile Public Frontend:
```bash
cd frontend
npm install
npm run build
```
This outputs compiled static files directly to the root `dist/` directory.

### Compile Admin Panel:
```bash
cd admin
npm install
npm run build
```
This outputs compiled admin panel files directly to the root `admin_dist/` directory.

---

## 6. Hosting Deployment (cPanel Upload)
1. **Upload Assets**: Zip and upload the following folders and files from your project root directly into the hosting `public_html` folder using cPanel **File Manager**:
   - `dist/` (compiled public frontend assets)
   - `backend/` (private PHP configs and helper modules)
   - `api/` (public API endpoints)
   - `uploads/` (image upload asset folder)
   - `.htaccess` (url rewrites)
   - `index.php` (SEO router)
2. **Deploy Admin Panel**: Create a subfolder named `admin` inside `public_html`. Upload all the contents of `admin_dist/` directly inside this `admin` subfolder.
3. **Set File Permissions**: Ensure directory permissions are set to `755` and file permissions are set to `644`. Ensure `backend/config/env.php` is protected.

---

## 7. Testing & Switching to Live Mode
- **Test Mode verification**: Complete a test booking via the website scheduler. When the Razorpay window appears, use test cards (e.g., enter successful OTP mock inputs) to verify redirection to `/payment/success` and check if confirmation emails are sent.
- **Go Live Safe Switch**:
  1. Generate **Live API Keys** inside the Razorpay dashboard settings.
  2. Replace Key ID and Secret inside the `site_settings` table and `backend/config/env.php` respectively.
  3. Register your live webhook URL in Razorpay and update the webhook secret.
  4. Complete a small real transaction (e.g., INR 10) to verify signature validation in live execution.

---

## 8. Domain Setup via GoDaddy DNS
If your hosting is separate from GoDaddy, link the domain name:
1. Log into GoDaddy, select **My Products** &rarr; **DNS** next to the domain name.
2. In the Records table, edit the **A Record**:
   - Host: `@`
   - Points to: Enter the shared hosting **Server IP Address** (located in the cPanel right sidebar).
3. Save changes. Note that DNS propagation might require up to 4 to 24 hours to update globally.

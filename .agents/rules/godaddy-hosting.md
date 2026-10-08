# GoDaddy Shared Hosting Build & Deployment Standard

This repository uses Next.js static export (`output: 'export'`) configured specifically for **GoDaddy Linux Shared Hosting (cPanel / Apache)**.

---

### ⚠️ GoDaddy Shared Hosting Gotchas & Mandatory Build Rules

1. **ModSecurity Underscore Blocking**:
   - GoDaddy's Apache ModSecurity firewall blocks any incoming URL containing `_next` (e.g. `/_next/static/css/...`) with a `403 Forbidden` error.
   - **Mandatory Rule**: `scripts/package-cpanel.js` MUST rename `_next` to `staticassets` and replace ALL occurrences of `_next` across `.html`, `.js`, `.css`, and `.json` files.

2. **cPanel Zip Extraction Permission Lockout (0700 -> 0755/0644)**:
   - When GoDaddy's cPanel File Manager unzips archives, it sets folder permissions to `0700` (Owner only), which prevents Apache (`dhapache`/`nobody`) from serving subfolder CSS, JS, and image assets.
   - **Mandatory Rule**: `scripts/package-cpanel.js` MUST include `fix-permissions.php` at the root of `suyogweb.zip` to automatically reset permissions to `0755` (Folders) and `0644` (Files) when executed.

3. **Packaging Command**:
   To generate a pristine GoDaddy-compatible deployment package, run:
   ```bash
   npm run package:hosting
   ```
   This generates `suyogweb.zip` in the project root ready for upload to `public_html`.

4. **Post-Upload Step**:
   After unzipping `suyogweb.zip` in cPanel `public_html`, open:
   `https://suyogsaanidhya.com/fix-permissions.php` once in the browser to fix Linux permissions.

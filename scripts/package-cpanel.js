const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== Packaging Suyog Saanidhya for cPanel Upload ===');

const projectRoot = path.resolve(__dirname, '..');
const outDir = path.join(projectRoot, 'frontend', 'out');
const htaccessSrc = path.join(projectRoot, '.htaccess');
const htaccessDest = path.join(outDir, '.htaccess');

if (!fs.existsSync(outDir)) {
  console.error('Error: frontend/out directory does not exist. Run "npm run build:frontend" first.');
  process.exit(1);
}

// 1. Ensure BOTH _next AND next_assets exist so all asset URLs succeed
const nextDir = path.join(outDir, '_next');
const nextAssetsDir = path.join(outDir, 'next_assets');

if (fs.existsSync(nextDir)) {
  if (fs.existsSync(nextAssetsDir)) {
    fs.rmSync(nextAssetsDir, { recursive: true, force: true });
  }
  // Create a full recursive copy of _next to next_assets for fallback compatibility
  fs.cpSync(nextDir, nextAssetsDir, { recursive: true });
  console.log('✔ Synced fallback next_assets/ directory alongside _next/.');
}

// 2. Ensure .htaccess is placed inside frontend/out with 100% permission rules
const perfectHtaccessContent = `# =====================================================================
# cPanel Production Apache Configuration - Suyog Saanidhya
# Domain: suyogsaanidhya.com
# =====================================================================

# 1. Directory Indexing & Options
DirectoryIndex index.html Index.html index.php
Options +FollowSymLinks -Indexes

# 2. Grant explicit file read access to bypass cPanel 403 Forbidden errors
<FilesMatch "\\.(css|js|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2|ttf|eot|json|html|txt|xml)$">
  <IfModule mod_authz_core.c>
    Require all granted
  </IfModule>
  <IfModule !mod_authz_core.c>
    Order allow,deny
    Allow from all
  </IfModule>
</FilesMatch>

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Force HTTPS Security Redirect
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # Direct pass-through for existing files or directories
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Allow direct pass-through for Next.js assets
  RewriteRule ^_next/(.*)$ _next/$1 [L]
  RewriteRule ^next_assets/(.*)$ next_assets/$1 [L]
  RewriteRule ^assets/(.*)$ assets/$1 [L]

  # Clean HTML extension rewrite (e.g. /about -> /about.html)
  RewriteCond %{DOCUMENT_ROOT}/$1.html -f
  RewriteRule ^(.*)$ /$1.html [L]

  # SPA / Next.js Static Export Fallback
  RewriteRule ^ index.html [L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# GZIP Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css
  AddOutputFilterByType DEFLATE application/javascript application/x-javascript
  AddOutputFilterByType DEFLATE application/json application/xml application/xhtml+xml
  AddOutputFilterByType DEFLATE image/svg+xml font/opentype font/otf font/ttf
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresDefault "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>
`;

fs.writeFileSync(htaccessDest, perfectHtaccessContent, 'utf8');
fs.writeFileSync(htaccessSrc, perfectHtaccessContent, 'utf8');
console.log('✔ Generated perfect .htaccess file inside frontend/out/');

// 3. Ensure both index.html and Index.html exist
const indexHtml = path.join(outDir, 'index.html');
const IndexHtml = path.join(outDir, 'Index.html');
if (fs.existsSync(indexHtml)) {
  fs.copyFileSync(indexHtml, IndexHtml);
  console.log('✔ Created Index.html alias alongside index.html');
}

// 4. Create zip archives using PowerShell Compress-Archive
const zipName = 'suyogweb.zip';
const zipPath = path.join(projectRoot, zipName);
const publicHtmlZip = path.join(projectRoot, 'public_html.zip');
const distZipPath = path.join(projectRoot, 'dist', 'suyogweb.zip');

if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
if (fs.existsSync(publicHtmlZip)) fs.unlinkSync(publicHtmlZip);
if (fs.existsSync(distZipPath)) fs.unlinkSync(distZipPath);

console.log('Creating suyogweb.zip deployment archive...');
const psCommand = `PowerShell -Command "Compress-Archive -Path '${outDir}\\*' -DestinationPath '${zipPath}' -Force"`;

try {
  execSync(psCommand, { stdio: 'inherit' });
  fs.copyFileSync(zipPath, publicHtmlZip);
  if (fs.existsSync(path.join(projectRoot, 'dist'))) {
    fs.copyFileSync(zipPath, distZipPath);
  }
  console.log('✔ Created suyogweb.zip and public_html.zip successfully!');
  console.log(`Zip Location: ${zipPath}`);
} catch (err) {
  console.error('Failed to create zip file:', err.message);
}

console.log('=== Ready for cPanel Upload! ===');

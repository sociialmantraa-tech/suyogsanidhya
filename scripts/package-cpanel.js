const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== Packaging Suyog Saanidhya for GoDaddy Shared Hosting ===');

const projectRoot = path.resolve(__dirname, '..');
const outDir = path.join(projectRoot, 'frontend', 'out');
const htaccessSrc = path.join(projectRoot, '.htaccess');
const htaccessDest = path.join(outDir, '.htaccess');

if (!fs.existsSync(outDir)) {
  console.error('Error: frontend/out directory does not exist.');
  process.exit(1);
}

// 1. GoDaddy ModSecurity Firewall blocks paths starting with _ (like _next).
// We permanently rename _next -> staticassets across the build.
const oldNextDir = path.join(outDir, '_next');
const newNextDir = path.join(outDir, 'staticassets');

if (fs.existsSync(oldNextDir)) {
  if (fs.existsSync(newNextDir)) {
    fs.rmSync(newNextDir, { recursive: true, force: true });
  }
  fs.renameSync(oldNextDir, newNextDir);
  console.log('✔ Renamed _next directory to staticassets for GoDaddy ModSecurity firewall compatibility.');
}

// Also create fallback aliases 'assets' and 'next_assets' just in case
const assetsAliasDir = path.join(outDir, 'assets');
const nextAssetsAliasDir = path.join(outDir, 'next_assets');
fs.cpSync(newNextDir, assetsAliasDir, { recursive: true });
fs.cpSync(newNextDir, nextAssetsAliasDir, { recursive: true });
console.log('✔ Created fallback asset directories (assets/ and next_assets/).');

// 2. Recursively replace ALL occurrences of _next with staticassets in all text files
function replaceInDir(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      replaceInDir(fullPath);
    } else if (item.isFile() && /\.(html|js|css|json|txt|svg|map)$/i.test(item.name)) {
      try {
        let content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('_next')) {
          // Replace all variations of _next
          content = content
            .replace(/\/_next\//g, '/staticassets/')
            .replace(/\.\/_next\//g, './staticassets/')
            .replace(/"_next\//g, '"staticassets/')
            .replace(/'_next\//g, "'staticassets/")
            .replace(/\/_next"/g, '/staticassets"')
            .replace(/\/_next'/g, "/staticassets'")
            .replace(/_next\//g, 'staticassets/');
          fs.writeFileSync(fullPath, content, 'utf8');
        }
      } catch (err) {
        // Skip binary or unreadable files
      }
    }
  }
}

replaceInDir(outDir);
console.log('✔ Replaced all _next references with staticassets across HTML, JS, CSS, and JSON files.');

// 3. Perfect GoDaddy Shared Hosting .htaccess Configuration
const godaddyHtaccess = `# =====================================================================
# GoDaddy Shared Hosting Apache Configuration - Suyog Saanidhya
# Domain: suyogsaanidhya.com
# =====================================================================

# Enable Directory Indexing
DirectoryIndex index.html Index.html index.php
Options +FollowSymLinks -Indexes

# Bypass GoDaddy file access restrictions
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

  # Pass-through existing physical files or directories
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Route asset paths directly
  RewriteRule ^staticassets/(.*)$ staticassets/$1 [L]
  RewriteRule ^assets/(.*)$ assets/$1 [L]
  RewriteRule ^next_assets/(.*)$ next_assets/$1 [L]

  # Clean HTML route rewrites (e.g. /about -> /about.html)
  RewriteCond %{DOCUMENT_ROOT}/$1.html -f
  RewriteRule ^(.*)$ /$1.html [L]

  # SPA Static Fallback
  RewriteRule ^ index.html [L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Deflate GZIP Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css
  AddOutputFilterByType DEFLATE application/javascript application/x-javascript
  AddOutputFilterByType DEFLATE application/json application/xml application/xhtml+xml
  AddOutputFilterByType DEFLATE image/svg+xml font/opentype font/otf font/ttf
</IfModule>

# Browser Cache Control
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

fs.writeFileSync(htaccessDest, godaddyHtaccess, 'utf8');
fs.writeFileSync(htaccessSrc, godaddyHtaccess, 'utf8');
console.log('✔ Created GoDaddy-optimized .htaccess file.');

// 4. Case sensitivity fallback
const indexHtml = path.join(outDir, 'index.html');
const IndexHtml = path.join(outDir, 'Index.html');
if (fs.existsSync(indexHtml)) {
  fs.copyFileSync(indexHtml, IndexHtml);
}

// 5. Create deployment zip files
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
  console.log('✔ Created GoDaddy suyogweb.zip successfully!');
  console.log(`Zip Location: ${zipPath}`);
} catch (err) {
  console.error('Failed to create zip file:', err.message);
}

console.log('=== Ready for GoDaddy Upload! ===');

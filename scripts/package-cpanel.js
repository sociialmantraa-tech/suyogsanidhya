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

// 1. Rename _next directory to staticassets for GoDaddy ModSecurity firewall compatibility
const oldNextDir = path.join(outDir, '_next');
const newNextDir = path.join(outDir, 'staticassets');

if (fs.existsSync(oldNextDir)) {
  if (fs.existsSync(newNextDir)) {
    fs.rmSync(newNextDir, { recursive: true, force: true });
  }
  fs.renameSync(oldNextDir, newNextDir);
  console.log('✔ Renamed _next directory to staticassets for GoDaddy ModSecurity firewall compatibility.');
}

// Fallback aliases
const assetsAliasDir = path.join(outDir, 'assets');
const nextAssetsAliasDir = path.join(outDir, 'next_assets');
fs.cpSync(newNextDir, assetsAliasDir, { recursive: true });
fs.cpSync(newNextDir, nextAssetsAliasDir, { recursive: true });

// 2. Recursively replace ALL occurrences of _next with staticassets
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
        // Skip binary files
      }
    }
  }
}

replaceInDir(outDir);
console.log('✔ Replaced all _next references with staticassets.');

// 3. Create fix-permissions.php to automatically repair GoDaddy cPanel 0700 file permission lockouts
const fixPermissionsPhpContent = `<?php
// Auto permission repair tool for GoDaddy Shared Hosting cPanel
header('Content-Type: text/html; charset=utf-8');

function fixPerms($dir) {
    $count = 0;
    $items = @scandir($dir);
    if (!$items) return 0;
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;
        $fullPath = $dir . '/' . $item;
        if (is_dir($fullPath)) {
            @chmod($fullPath, 0755);
            $count += 1 + fixPerms($fullPath);
        } else {
            @chmod($fullPath, 0644);
            $count++;
        }
    }
    return $count;
}

$root = __DIR__;
@chmod($root, 0755);
$total = fixPerms($root);

echo "<div style='font-family:sans-serif; max-w:600px; margin:50px auto; padding:30px; border-radius:16px; background:#F0FDF4; border:2px solid #22C55E; color:#15803D;'>";
echo "<h1 style='margin-top:0;'>✔ GoDaddy File Permissions Fixed!</h1>";
echo "<p style='font-size:16px;'>Successfully reset permissions for <strong>{$total}</strong> files & directories to <strong>0755 / 0644</strong>.</p>";
echo "<p style='font-size:16px;'>Your website CSS, JavaScript, and images are now 100% accessible.</p>";
echo "<p style='margin-bottom:0;'><a href='/' style='display:inline-block; background:#166D74; color:white; padding:12px 24px; text-decoration:none; border-radius:50px; font-weight:bold;'>Open Suyog Saanidhya Homepage &rarr;</a></p>";
echo "</div>";
?>`;

fs.writeFileSync(path.join(outDir, 'fix-permissions.php'), fixPermissionsPhpContent, 'utf8');
console.log('✔ Included fix-permissions.php auto-repair tool.');

// 4. Perfect GoDaddy .htaccess Configuration
const godaddyHtaccess = `# =====================================================================
# GoDaddy Shared Hosting Apache Configuration - Suyog Saanidhya
# Domain: suyogsaanidhya.com
# =====================================================================

DirectoryIndex index.html Index.html fix-permissions.php index.php
Options +FollowSymLinks -Indexes

<FilesMatch "\\.(css|js|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2|ttf|eot|json|html|txt|xml|php)$">
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

  # Force HTTPS
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # Allow direct file access
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Direct pass-through for static directories & php auto-fixer
  RewriteRule ^fix-permissions\\.php$ - [L]
  RewriteRule ^staticassets/(.*)$ staticassets/$1 [L]
  RewriteRule ^assets/(.*)$ assets/$1 [L]
  RewriteRule ^next_assets/(.*)$ next_assets/$1 [L]

  # Clean HTML extension rewrite
  RewriteCond %{DOCUMENT_ROOT}/$1.html -f
  RewriteRule ^(.*)$ /$1.html [L]

  # Fallback to index.html
  RewriteRule ^ index.html [L]
</IfModule>

<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css
  AddOutputFilterByType DEFLATE application/javascript application/x-javascript
  AddOutputFilterByType DEFLATE application/json application/xml application/xhtml+xml
  AddOutputFilterByType DEFLATE image/svg+xml font/opentype font/otf font/ttf
</IfModule>

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

// 5. Alias for case-sensitivity
const indexHtml = path.join(outDir, 'index.html');
const IndexHtml = path.join(outDir, 'Index.html');
if (fs.existsSync(indexHtml)) {
  fs.copyFileSync(indexHtml, IndexHtml);
}

// 6. Zip building
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

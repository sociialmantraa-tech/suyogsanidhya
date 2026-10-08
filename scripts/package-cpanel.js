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

// 1. Copy .htaccess into frontend/out
if (fs.existsSync(htaccessSrc)) {
  fs.copyFileSync(htaccessSrc, htaccessDest);
  console.log('✔ Copied production .htaccess into frontend/out/');
}

// 2. Ensure both index.html and Index.html exist
const indexHtml = path.join(outDir, 'index.html');
const IndexHtml = path.join(outDir, 'Index.html');
if (fs.existsSync(indexHtml)) {
  fs.copyFileSync(indexHtml, IndexHtml);
  console.log('✔ Created Index.html alias alongside index.html');
}

// 3. Create zip archives using PowerShell Compress-Archive
const zipName = 'suyogweb.zip';
const zipPath = path.join(projectRoot, zipName);
const publicHtmlZip = path.join(projectRoot, 'public_html.zip');

if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
if (fs.existsSync(publicHtmlZip)) fs.unlinkSync(publicHtmlZip);

console.log('Creating suyogweb.zip deployment archive...');
const psCommand = `PowerShell -Command "Compress-Archive -Path '${outDir}\\*' -DestinationPath '${zipPath}' -Force"`;

try {
  execSync(psCommand, { stdio: 'inherit' });
  fs.copyFileSync(zipPath, publicHtmlZip);
  console.log('✔ Created suyogweb.zip and public_html.zip successfully!');
  console.log(`Zip Location: ${zipPath}`);
} catch (err) {
  console.error('Failed to create zip file:', err.message);
}

console.log('=== Ready for cPanel Upload! ===');

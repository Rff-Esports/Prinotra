// PRINTORA 1-Click Automated Netlify Deployer
// Uses Windows built-in tar.exe to produce standard POSIX zip structure for Linux servers
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const SITE_ID = '1e7ae1ee-956c-4b70-8782-e80976f65b21';
const AUTH_TOKEN = 'nfp_NzZ73sUXoGVAnidHGS5TeWw4ctP3M7B74812';
const ZIP_PATH = path.join(rootDir, 'dist.zip');

console.log('📦 Packaging project files with standard POSIX paths...');

try {
  // tar.exe -a creates standard zip with Linux-compatible forward slashes
  execSync('tar.exe -a -c -f dist.zip index.html netlify.toml robots.txt sitemap.xml _redirects src assets', {
    cwd: rootDir,
    stdio: 'inherit'
  });
} catch (e) {
  console.error('Failed to create zip:', e.message);
  process.exit(1);
}

const zipStats = fs.statSync(ZIP_PATH);
console.log(`🚀 Uploading ${(zipStats.size / 1024).toFixed(1)} KB to Netlify (Site: keen-kulfi-d21b76 / printoracustom.in)...`);

const req = https.request({
  hostname: 'api.netlify.com',
  path: `/api/v1/sites/${SITE_ID}/deploys`,
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/zip',
    'Content-Length': zipStats.size,
    'User-Agent': 'PrintoraAutoDeployer/1.0'
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try { fs.unlinkSync(ZIP_PATH); } catch(err) {}

    if (res.statusCode >= 200 && res.statusCode < 300) {
      try {
        const data = JSON.parse(body);
        console.log('\n======================================================');
        console.log(' 🎉 DEPLOYMENT SUCCESSFUL!');
        console.log(` 🌐 Live Site URL: https://printoracustom.in`);
        console.log(` 🔗 Netlify Deploy ID: ${data.id}`);
        console.log(` ⏱️  State: ${data.state || 'ready'}`);
        console.log('======================================================\n');
      } catch (e) {
        console.log('Deploy uploaded successfully! Status:', res.statusCode);
      }
    } else {
      console.error('❌ Deploy failed with status:', res.statusCode, body);
    }
  });
});

req.on('error', (err) => {
  console.error('Network error during deployment:', err.message);
});

const fileStream = fs.createReadStream(ZIP_PATH);
fileStream.pipe(req);

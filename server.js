// PRINTORA Zero-Dependency Local Development Server
// Serves static files and SPA route fallbacks to index.html
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = parsedUrl.pathname;

  // Normalize path
  if (pathname === '/') {
    pathname = '/index.html';
  }

  // API endpoint for syncing custom products and triggering live deploy
  if (pathname === '/api/save-products' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const assetsDir = path.join(__dirname, 'assets');
        if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
        fs.writeFileSync(path.join(assetsDir, 'custom_products.json'), JSON.stringify(data.overrides || {}, null, 2));
        console.log('✅ [SERVER] Saved custom product overrides to assets/custom_products.json');

        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ success: true, message: 'Products persisted' }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // API endpoint for Razorpay Live Order Creation
  if (pathname === '/api/razorpay/create-order' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { amount, receipt, notes } = JSON.parse(body || '{}');
        const keyId = 'rzp_live_TwnbxHtTo3019C';
        const keySecret = 'k5U6kxipoECI6VLiOgnX00YJ';

        const amountPaise = Math.round(Number(amount) * 100);
        if (!amountPaise || amountPaise <= 0) {
          res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          return res.end(JSON.stringify({ error: 'Invalid amount' }));
        }

        const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const rzpReq = https.request({
          hostname: 'api.razorpay.com',
          path: '/v1/orders',
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
          }
        }, (rzpRes) => {
          let rzpData = '';
          rzpRes.on('data', c => rzpData += c);
          rzpRes.on('end', () => {
            res.writeHead(rzpRes.statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(rzpData);
          });
        });

        rzpReq.on('error', (err) => {
          res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify({ error: err.message }));
        });

        rzpReq.write(JSON.stringify({
          amount: amountPaise,
          currency: 'INR',
          receipt: receipt || `rcpt_${Date.now()}`,
          notes: notes || {}
        }));
        rzpReq.end();
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  let filePath = path.join(__dirname, pathname);

  // Security check: ensure path is within root
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // If requested file doesn't exist and doesn't have an extension, fallback to index.html (SPA routing)
      if (!path.extname(pathname) || pathname.startsWith('/admin') || pathname.startsWith('/product/') || pathname.startsWith('/category/')) {
        filePath = path.join(__dirname, 'index.html');
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error: ' + readErr.message);
        return;
      }
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(` ✨ PRINTORA Master E-Commerce Server is Running!`);
  console.log(` 🌐 Local URL: http://localhost:${PORT}`);
  console.log(` 👑 Admin URL: http://localhost:${PORT}#admin`);
  console.log(` 🏷️  Brand: PRINTORA - MAKE IT YOURS.`);
  console.log(`==================================================\n`);
});

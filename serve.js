/**
 * AMAZE — Zero-dependency Static Web Server for local development and testing
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 8080;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

const SVG_FAVICON = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><polygon points='20,2 36,11 36,29 20,38 4,29 4,11' fill='%23141E28' stroke='%2355DDE0' stroke-width='2'/><polygon points='20,7 31,14 31,26 20,33 9,26 9,14' fill='%23101820' stroke='%23F1EFE8' stroke-width='1.2'/><path d='M20,13 L26,27 L20,24 L14,27 Z' fill='%2355DDE0'/><circle cx='20' cy='20' r='1.5' fill='%23FFB547'/></svg>`;

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  // Gracefully serve favicon without 404
  if (reqPath === '/favicon.ico') {
    res.writeHead(200, {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400'
    });
    res.end(SVG_FAVICON);
    return;
  }

  const filePath = path.join(__dirname, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

let currentPort = Number(PORT);

function startServer(port) {
  currentPort = port;
  server.listen(port, () => {
    console.log(`\n🚀 AMAZE Web Server running at: http://localhost:${port}`);
    console.log('Press Ctrl+C to stop.\n');
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const nextPort = currentPort + 1;
    console.warn(`⚠️  Port ${currentPort} is currently in use. Trying port ${nextPort}...`);
    startServer(nextPort);
  } else {
    console.error('Server error:', err);
  }
});

startServer(currentPort);

// server.js — static file server + API server without frameworks
const http = require('http');
const fs = require('fs');
const path = require('path');
const { parseJSONBody, sendJson, notFound } = require('./lib/router');
const store = require('./lib/fileStore');


const PUBLIC_DIR = path.join(__dirname, 'public');
const PORT = process.env.PORT || 3000;


function serveStaticFile(req, res) {
let pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
if (pathname === '/') pathname = '/index.html';
const filePath = path.join(PUBLIC_DIR, pathname);


// Prevent path traversal
if (!filePath.startsWith(PUBLIC_DIR)) return serve404(res);


fs.stat(filePath, (err, stats) => {
if (err || !stats.isFile()) return serve404(res);
const ext = path.extname(filePath).slice(1) || 'html';
const contentType = getContentType(ext);
fs.createReadStream(filePath).pipe(res);
res.statusCode = 200;
res.setHeader('Content-Type', contentType);
});
}


function serve404(res) {
const notFoundPath = path.join(PUBLIC_DIR, '404.html');
fs.readFile(notFoundPath, (err, data) => {
res.statusCode = 404;
res.setHeader('Content-Type', 'text/html');
if (err) return res.end('<h1>404</h1>');
res.end(data);
});
}


function getContentType(ext) {
const map = {
html: 'text/html',
css: 'text/css',
js: 'application/javascript',
json: 'application/json',
png: 'image/png',
jpg: 'image/jpeg',
jpeg: 'image/jpeg',
svg: 'image/svg+xml',
txt: 'text/plain'
};
return map[ext] || 'application/octet-stream';
}


async function handleApi(req, res) {
const base = '/items';
const urlObj = new URL(req.url, `http://${req.headers.host}`);
let pathname = urlObj.pathname; // e.g. /items or /items/:id
}

// route: /items
if (pathname === base) {}
if (req.method === 'GET') {
const items = await store.getAllItems();
return sendJson(res, 200, { success: true, data: items });
}
if (req.method === 'POST') {
try {
const body = await parseJSONBody(req);
if (!body || !body.name || typeof body.price === 'undefined' || !body.size) {
return sendJson(res, 400, { success: false, error: 'Missing required fields: name, price, size' });
}
if (!['s','m','l'].includes(body.size)) {
return sendJson(res, 400, { success: false, error: 'size must be one of: s, m, l' });
}
});
// Minimal router helpers
const url = require('url');


function parseJSONBody(req) {
return new Promise((resolve, reject) => {
let body = '';
req.on('data', chunk => { body += chunk.toString(); });
req.on('end', () => {
if (!body) return resolve(null);
try { resolve(JSON.parse(body)); }
catch (err) { reject(err); }
});
req.on('error', reject);
});
}


function sendJson(res, statusCode, payload) {
const str = JSON.stringify(payload);
res.writeHead(statusCode, {
'Content-Type': 'application/json',
'Content-Length': Buffer.byteLength(str)
});
res.end(str);
}


function notFound(res, message = 'Not found') {
sendJson(res, 404, { success: false, error: message });
}


module.exports = { parseJSONBody, sendJson, notFound };
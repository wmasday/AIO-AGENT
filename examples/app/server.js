import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { products, paginate } from './lib/products.js';
import { parseSignup } from './lib/signup.js';

const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT) || 3000;
const page = new URL('./public/index.html', import.meta.url);

function sendJson(res, status, data) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(data));
}

async function readJson(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${HOST}`);

  if (req.method === 'GET' && url.pathname === '/') {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(await readFile(page));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/products') {
    const pageNumber = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 2;
    sendJson(res, 200, paginate(products, pageNumber, limit));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/stats') {
    // Simulates a slow upstream call for the browser-debug demo.
    setTimeout(() => sendJson(res, 200, { signups: 128 }), 1500);
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/signup') {
    const body = await readJson(req);
    const result = parseSignup(body ?? {});
    sendJson(res, result.ok ? 201 : 400, result);
    return;
  }

  sendJson(res, 404, { error: 'not found' });
});

server.listen(PORT, HOST, () => {
  console.log(`Example app on http://${HOST}:${PORT}`);
});

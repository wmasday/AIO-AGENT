// INTENTIONALLY VULNERABLE. For the AIO-AGENT security demos only. Never expose this server.
import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';

const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT) || 4000;

const db = new DatabaseSync(':memory:');
db.exec(`
  CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT, role TEXT);
  INSERT INTO users (name, email, role) VALUES
    ('alice', 'alice@example.test', 'admin'),
    ('bob', 'bob@example.test', 'member'),
    ('carol', 'carol@example.test', 'member');
`);

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://${HOST}`);

  if (url.pathname === '/users') {
    const name = url.searchParams.get('name') ?? '';
    // Vulnerability 1: SQL injection. User input is concatenated into the query.
    const rows = db.prepare(`SELECT id, name, email FROM users WHERE name = '${name}'`).all();
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(rows));
    return;
  }

  if (url.pathname === '/search') {
    const q = url.searchParams.get('q') ?? '';
    // Vulnerability 2: reflected XSS. User input is written into HTML without escaping.
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(`<!doctype html><title>Search</title><p>Results for ${q}</p>`);
    return;
  }

  res.writeHead(404, { 'content-type': 'text/plain' });
  res.end('not found');
});

server.listen(PORT, HOST, () => {
  console.log(`Vulnerable sample on http://${HOST}:${PORT} (local only)`);
});

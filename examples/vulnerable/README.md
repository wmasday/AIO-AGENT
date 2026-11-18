# Vulnerable sample

**Warning: this app is intentionally insecure.** It exists only for the `aio-security-review` and `aio-pentest` demos. It binds to `127.0.0.1` and must never be exposed to a network, deployed, or reused as a starting point.

It has no dependencies. It uses Node's built-in `node:sqlite`, so it needs Node.js 22.13 or newer.

```sh
cd examples/vulnerable
npm start        # http://127.0.0.1:4000
```

## Seeded flaws

| Route | Flaw | Where |
| --- | --- | --- |
| `GET /users?name=alice` | SQL injection: the `name` parameter is concatenated into the query | `server.js`, `/users` handler |
| `GET /search?q=desk` | Reflected cross-site scripting: the `q` parameter is written into HTML unescaped | `server.js`, `/search` handler |

Both flaws are marked with a comment in the code. To check them by hand:

```sh
curl "http://127.0.0.1:4000/users?name=x'%20OR%20'1'='1"        # returns every user
curl "http://127.0.0.1:4000/search?q=%3Cscript%3Ealert(1)%3C/script%3E"   # script tag comes back unescaped
```

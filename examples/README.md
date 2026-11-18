# Examples

Two small Node.js apps used to demonstrate AIO-AGENT's skills. Both contain flaws on purpose. The recordings of each skill working on them are in [docs/demos.md](../docs/demos.md).

| Sample | What it is | Skills it exercises |
| --- | --- | --- |
| [app/](app/) | A sign-up page and a small JSON API for a fictional office-supply shop | `aio-brainstorm`, `aio-plan`, `aio-execute`, `aio-tdd`, `aio-debug`, `aio-verify`, `aio-review`, `aio-lean`, `aio-frontend-design`, `aio-modern-web`, `aio-ui-components`, `aio-browser-debug`, `aio-library-docs` |
| [vulnerable/](vulnerable/) | An intentionally insecure server with one SQL injection and one reflected XSS route. Local only; see its [README](vulnerable/README.md) | `aio-security-review`, `aio-pentest` |

## The app

Requires Node.js 20 or newer.

```sh
cd examples/app
npm install
npm start        # http://127.0.0.1:3000
npm test         # 4 tests: 2 pass, 2 fail until the pagination bug is fixed
```

Seeded flaws, and the skill meant to find each:

| Flaw | Where | Skill |
| --- | --- | --- |
| `paginate` starts at `page * limit`, so page 1 skips the first items. Two tests in `test/products.test.js` fail. | `lib/products.js` | `aio-debug`, `aio-tdd` |
| Inputs have placeholders but no labels, the lead text and the stats line fail contrast, the submit control is a `div`, and focus outlines are removed | `public/index.html` | `aio-frontend-design`, `aio-modern-web` |
| The page script writes to `#signupCount`, but the element's id is `signup-count`, so the console shows a `TypeError` | `public/index.html` | `aio-browser-debug` |
| `GET /api/stats` takes 1.5 seconds | `server.js` | `aio-browser-debug` |
| Email validation uses `z.string().email()`, which Zod 4 deprecates in favour of `z.email()` | `lib/signup.js` | `aio-library-docs` |

## The vulnerable sample

It binds to `127.0.0.1` and must never be exposed. Use it only for the security review and the gated pentest demo.

```sh
cd examples/vulnerable
npm start        # http://127.0.0.1:4000
```

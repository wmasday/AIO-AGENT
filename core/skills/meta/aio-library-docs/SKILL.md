---
name: aio-library-docs
description: Fetch current, version-specific documentation for a library, framework, SDK or API through the Context7 MCP server instead of relying on memory. Use when writing code against a library, answering setup or configuration questions, or when the user names a version.
---

# Library documentation through Context7

Training data lags behind releases. Look the API up.

## Steps

1. **Resolve the library.** Call `resolve-library-id` with `libraryName` (the package name the user means) and `query` (what you need from its docs).
2. **Pick the match.** Prefer the exact or official package. If the user named a version ("Next.js 16"), pick the version-specific ID when one is listed.
3. **Query.** Call `query-docs` with the `libraryId` and one concept per call. For a question that spans routing, auth and caching, make three calls.
4. **Use it.** Write the code from the returned docs, cite the version, and point out where the docs differ from what you would have assumed.

## When Context7 is unavailable

If the `context7` tools are missing or return an auth or rate-limit error, say so, then read the library's official docs or the source in the installed package (`node_modules`, `site-packages`). An optional API key raises the rate limit: `CONTEXT7_API_KEY`, from <https://context7.com/dashboard>.

Don't send secrets, private code or customer data in a query.

Adapted from upstash/context7 `context7-mcp` (MIT). Rewritten for AIO-AGENT.

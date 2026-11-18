---
name: aio-modern-web
description: Look up current web platform guidance before writing HTML, CSS or browser JavaScript, so the code uses native APIs (dialog, popover, container queries, view transitions, form validation) instead of legacy patterns. Use when implementing or changing web UI, layout, animation or client-side logic. Not for backend, build tooling or tests.
---

# Modern web guidance

Model training data is full of old patterns. Check current guidance from the Chrome, Edge, Firefox and MDN teams before writing web code. Requires Node.js; the CLI runs through `npx`.

## 1. Search

Use a 2 to 5 word query for one capability, framework-neutral:

```sh
npx -y modern-web-guidance@1.0.1 search "light dismiss dialog"
```

Good queries name the UI primitive: "responsive data table", "anchor positioned tooltip". Split compound needs into separate searches. If the results are empty or unrelated, rephrase once with the concrete element name, then move on.

## 2. Retrieve

```sh
npx -y modern-web-guidance@1.0.1 retrieve "<id>"
```

Read the whole guide, including its fallback advice.

## 3. Apply and check

Implement the pattern the guide recommends, with the fallback it recommends for older browsers. Don't add features the user didn't ask for. Before finishing, compare the code against the guide.

## 4. Say what you used

End the reply with one line per guide that shaped the code: the guide id and the non-obvious choice it led to.

## Modernizing a codebase

Only when asked for a broad modernization or legacy audit:

```sh
npx -y modern-web-guidance@1.0.1 legacy-scan <path> --json
```

Check each finding before acting on it; the scan covers only part of the guidance.

Adapted from GoogleChrome/modern-web-guidance `modern-web-guidance` (Apache-2.0). Shortened and pinned to version 1.0.1 for AIO-AGENT.

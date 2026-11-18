---
name: aio-browser-debug
description: Debug, inspect or profile a live web page through the Chrome DevTools MCP server, covering console errors, network requests, layout and CSS, accessibility, Largest Contentful Paint and memory leaks. Use when the user asks to debug a page, find why something renders or loads wrong, or measure page performance.
---

# Browser debugging with Chrome DevTools MCP

Requires the `chrome-devtools` MCP server (Node.js 20.19 or newer). The browser starts on the first tool call with its own profile.

## Start

1. `navigate_page` to the URL, or `new_page`. Use `list_pages` to find a `pageId`.
2. `wait_for` text you expect, when you know it.
3. `take_snapshot` to get the page structure. Interact with elements by the `uid` from the latest snapshot; take a new snapshot if an element is not found.

Prefer `take_snapshot` (text) for automation and `take_screenshot` when someone needs to see the result. Save large outputs to a file with `filePath`.

## By symptom

| Symptom | Tools |
| --- | --- |
| Script error, blank page | `list_console_messages`, then `get_console_message` for the stack |
| Request fails or is slow | `list_network_requests`, then `get_network_request` for headers and body |
| Wrong styling | `get_css_styles` for the matched rules and cascade; `evaluate_script` for runtime values |
| Accessibility | `take_snapshot` to read the accessibility tree; check names, roles, focus order; `evaluate_script` to compute contrast |
| Slow load (LCP) | `performance_start_trace` with reload, then `performance_analyze_insight` on the LCP insights; check the LCP element's request timing and render delay |
| Memory grows | Requires the server to start with `--memoryDebugging`: `take_heapsnapshot` before and after repeating the action, then `compare_heapsnapshots` |

## Reproduce, fix, re-check

State the symptom, reproduce it in the browser, find the cause (see `aio-debug`), fix the code, then reload and run the same check to confirm.

## Notes

- AIO-AGENT starts the server with `--no-usage-statistics`.
- Don't enter real credentials into pages unless the user asks you to; the browser profile persists between sessions.

Adapted from ChromeDevTools/chrome-devtools-mcp skills `chrome-devtools`, `a11y-debugging`, `debug-optimize-lcp` and `memory-leak-debugging` (Apache-2.0). Merged and rewritten for AIO-AGENT.

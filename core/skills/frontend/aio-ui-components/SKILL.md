---
name: aio-ui-components
description: Find, install or generate ready-made React and Tailwind UI components (pricing tables, navbars, heroes, forms, logos) through the 21st.dev Magic MCP server. Use when the user asks to add a common UI section or wants component options. Requires the magic MCP server and API_KEY_21ST.
---

# UI components through Magic MCP

## Check availability

The `magic` MCP server must be connected. AIO-AGENT adds it only when `API_KEY_21ST` was set at install time. If its tools are missing, tell the user: get a free key at <https://21st.dev/mcp>, export `API_KEY_21ST`, and rerun the AIO-AGENT installer. Then build the component by hand following `aio-frontend-design`.

## Use an existing component (default)

1. `search` with a short query: "pricing table", "animated hero".
2. Show the user the best one to three matches when the choice isn't obvious.
3. `get_component` for the chosen one.
4. Install it the way the result says (registry command or the returned files), then adapt it to the project: its tokens, its `cn` helper, its folder layout.

The free tier allows catalog search and a limited number of installs per day.

## Generate a new component

Only when nothing in the catalog fits, or the user asks for custom UI:

1. Check the server's usage tool (`get_usage`) for whether AI generation is enabled on the account. Unknown means no.
2. If enabled, call `generate` with the purpose, layout, content, style and stack. It uses the user's credits.
3. If a call returns `ai_subscription_required`, stop calling generation tools and build the component yourself.

## Logos

`search_logo` returns one brand's logo as JSX or TSX per call.

## After installing

Run `aio-frontend-design`'s checks on the result. Catalog components still need real content, states and accessibility checks in the project's context.

Adapted from 21st-dev/magic-mcp `21st-ui` (ISC). Rewritten for AIO-AGENT.

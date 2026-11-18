# Sources

The upstream repositories AIO-AGENT draws on, read at the pinned commit below on 2026-11-18. "Use" says how AIO-AGENT consumes each one:

- **adapted**: ideas and structure rewritten into an AIO-AGENT skill, with attribution in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
- **referenced**: AIO-AGENT tells the agent to call the upstream tool at a pinned version. Nothing is copied.
- **not used**: read, and left out for the reason given.

## Summary

| # | Repository | Commit | License | Format | Use |
| --- | --- | --- | --- | --- | --- |
| 1 | [miqdadbadjuber/anti-slop](https://github.com/miqdadbadjuber/anti-slop) | `57b92d4` | MIT | Skills (6), Claude plugin, CLI | adapted |
| 2 | [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | `96608e0` | MIT | Skills (6), hooks, per-agent plugins | adapted |
| 3 | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | `7436a6e` | MIT | Skill + Python search tool + CSV data, npm CLI | adapted, tool referenced |
| 4 | [KeygraphHQ/shannon](https://github.com/KeygraphHQ/shannon) | `c20e119` | AGPL-3.0 | CLI (Docker), Claude plugin | referenced |
| 5 | [googlechrome/modern-web-guidance](https://github.com/googlechrome/modern-web-guidance) | `64a6d70` | Apache-2.0 | Skill + guide corpus, npm CLI | referenced |
| 6 | [obra/superpowers](https://github.com/obra/superpowers) | `22f0b46` | MIT | Skills (15), hooks | adapted |
| 7 | [obra/superpowers: test-driven-development](https://github.com/obra/superpowers/tree/main/skills/test-driven-development) | `22f0b46` | MIT | Skill (part of #6) | adapted, deduplicated with #6 |
| 8 | [juliusbrussee/caveman](https://github.com/juliusbrussee/caveman) | `a192894` | Apache-2.0 (pre-3.0 parts also MIT) | Skills, CLI, MCP, runtime | adapted (`terse` mode) |
| 9 | [anthropics/claude-plugins-official: claude-code-setup](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-code-setup) | `e6143c9` | Apache-2.0 | Claude Code plugin, 1 skill | adapted |
| 10 | [anthropics/claude-plugins-official: claude-security](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-security) | `e6143c9` | Proprietary (Anthropic, all rights reserved) | Claude Code plugin | referenced on Claude Code only |
| 11 | [mattpocock/skills: grill-with-docs](https://github.com/mattpocock/skills/tree/main/skills/engineering/grill-with-docs) | `5863806` | MIT | Skill that calls `grilling` and `domain-modeling` | adapted |
| 12 | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | `d41d986` | Apache-2.0 | Skill + native engine, npm CLI, hooks | adapted, detector referenced |
| 13 | [upstash/context7](https://github.com/upstash/context7) | `c36522f` | MIT | Remote MCP server, npm MCP package, skills | referenced (MCP) |
| 14 | [usestrix/strix](https://github.com/usestrix/strix) | `1152d53` | Apache-2.0 | Python CLI (Docker), skills (9) | referenced |
| 15 | [21st-dev/magic-mcp](https://github.com/21st-dev/magic-mcp) | `6b5299e` | ISC | Remote MCP server, npm stdio proxy, 1 skill | referenced (MCP) |
| 16 | [NVIDIA/SkillSpector](https://github.com/NVIDIA/SkillSpector) | `a09091e` | Apache-2.0 | Python CLI (skill security scanner), MCP mode | referenced |
| 17 | [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) | `4b9acc9` | Apache-2.0 | npm stdio MCP server, skills (8) | referenced (MCP), skills adapted |

Full SHAs are in [Pinned commits](#pinned-commits).

## Findings per source

### 1. anti-slop

Rules that stop generic, AI-looking output. The core skill (`antislop`, 700 lines) is about **UI design**: color, layout, decoration, a 40-rule "hard gate" and a delivery checklist. Separate skills cover copywriting (`antislop-copywriting`), code comments (`antislop-code`), accessibility (`antislop-human`) and responsive layout (`antislop-layoutmobile`). No runtime dependencies for the skills; the CLI needs Node.

Kept: the code-comment rules and copywriting rules (into `aio-plain-output`), and the UI warning signs (into `aio-frontend-design`).

### 2. ponytail

Determined from the skills, hooks and commands, not only the README. Ponytail is a **"lazy senior developer" coding discipline**: make the smallest complete change, reuse what exists, add no speculative code, and leave a test for non-trivial logic. It ships the same rules for about 20 agents (`skills/`, `.openclaw/`, `pi-extension/`, `hooks/*.json` for Claude, Codex, Cursor, Copilot and Qoder) plus `review`, `audit` and `debt` sub-skills. Hooks are Node scripts.

Kept: the decision ladder and "never cut" list (into `aio-lean`), and the review checklist (into `aio-review`). Hooks are not used; AIO-AGENT installs no hooks.

### 3. ui-ux-pro-max-skill

A UI/UX skill backed by a local search tool (`scripts/search.py`, Python 3, no dependencies) over 3 MB of CSV data: styles, palettes, font pairings, 120 UX rules. Also ships `banner-design`, `brand`, `design-system`, `slides` and `ui-styling` skills, and the `uipro` npm installer.

Kept: the priority table of UX checks (accessibility, touch, performance, layout, typography, motion, forms) in `aio-frontend-design`. The data set is not copied; `aio-frontend-design` points to the upstream installer for users who want the search tool.

### 4. shannon

An autonomous pentester for web apps and APIs. It reads source, then executes real exploits from a Docker worker. Run with `npx @keygraph/shannon@<version>`; needs Docker and an LLM provider key. Its own skill already requires the user to confirm ownership and that the target is not production.

AGPL-3.0, so nothing is copied. `aio-pentest` tells the agent how to launch the pinned upstream CLI after an explicit command and an authorization confirmation.

### 5. modern-web-guidance

Curated guides on current web-platform APIs, stewarded by the Chrome, Edge, Firefox and MDN teams. The skill (90 lines) drives a CLI: `npx modern-web-guidance@<version> search|retrieve|legacy-scan`. The guide corpus is 2.3 MB.

Referenced, not copied: copying the corpus would go stale and adds nothing over calling the pinned CLI. `aio-modern-web` wraps the CLI calls.

### 6 and 7. superpowers (including test-driven-development)

Process skills: `brainstorming`, `writing-plans`, `executing-plans`, `subagent-driven-development`, `test-driven-development`, `systematic-debugging`, `verification-before-completion`, `requesting-code-review`, `receiving-code-review`, `finishing-a-development-branch`, `using-git-worktrees`, `writing-skills`. A session-start hook forces skill use. #7 is one of these skills, so it is merged once.

Kept: brainstorm, plan, execute, TDD, debugging, verification and review, each condensed into one AIO-AGENT skill. The session-start hook is not used; the router replaces it.

### 8. caveman

A terse output mode ("answer first, fluff gone, every technical fact kept") plus a large runtime (Go engine, proxy, MCP server). "Caveman" is a trademark of Julius Brussee; the Apache-2.0 license grants no trademark rights.

Kept: the output rules, as the `terse` mode in `aio-terse`. The name and the runtime are not used.

### 9. claude-code-setup

One read-only skill, `claude-automation-recommender`: scan a codebase and recommend MCP servers, skills, hooks and subagents for Claude Code.

Kept: the scan-then-recommend workflow, generalised to every supported agent, in `aio-setup`.

### 10. claude-security

A multi-agent security scan for Claude Code. Its license grants use "solely with Claude Code or other Anthropic products" and forbids distributing or modifying it for third parties.

Nothing is copied or adapted. `aio-security-review` is written independently. On Claude Code only, the docs point users to the official install (`/plugin install claude-security@claude-plugins-official`).

### 11. grill-with-docs

The skill is 7 lines: it invokes two other skills, `grilling` (interview the user round by round over a tree of decisions, recommending an answer for each) and `domain-modeling` (keep a `GLOSSARY.md` and ADRs current while the design is discussed). It does not read library documentation.

Kept: both behaviours, in `aio-grill`.

### 12. impeccable

A frontend design skill with 24 sub-commands (`shape`, `critique`, `audit`, `polish`, `harden` and others), surface "modes" (persuade, operate, read, experience), and a native detector binary (`npx impeccable detect`). The skill's setup step runs that binary.

Kept: the surface modes and the "verify by looking at the rendered result" rule, in `aio-frontend-design`. The detector is referenced as an optional check.

### 13. context7

Up-to-date library documentation over MCP. Remote endpoint `https://mcp.context7.com/mcp`; optional API key sent as `Authorization: Bearer`. Also an npm stdio server (`@upstash/context7-mcp`, reads `CONTEXT7_API_KEY`).

Referenced in `core/mcp/servers.yaml`. `aio-library-docs` states when to call it.

### 14. strix

An autonomous pentesting CLI (`strix --target ...`, Python package `strix-agent`), sandboxed in Docker, with your own LLM key (`STRIX_LLM`, `LLM_API_KEY`). Its own skills trigger on broad phrases such as "security-scan", so they are not installed.

Referenced from `aio-pentest`, behind the same explicit-command and authorization gate as Shannon.

### 15. magic-mcp

The 21st.dev UI component MCP. Since v0.2.0 the canonical server is remote, `https://21st.dev/api/mcp`, authenticated with header `x-api-key` from `API_KEY_21ST`. Keys are free; some generation tools return `ai_subscription_required` on accounts without a subscription.

Referenced in `core/mcp/servers.yaml`, enabled only when `API_KEY_21ST` is set.

### 16. SkillSpector

Determined from the README and `src/`. A **security scanner for agent skills**: static analysis (71 patterns, 17 categories such as prompt injection, data exfiltration, excessive agency, MCP tool poisoning) plus optional LLM review. CLI `skillspector scan <path> [--no-llm] [--format json|sarif]`; Python 3.12+, installed with `uv tool install`. Not on PyPI.

Referenced in `aio-skill-check`, and used to scan AIO-AGENT's own skills.

### 17. chrome-devtools-mcp

Chrome DevTools as an MCP server (`npx chrome-devtools-mcp@<version>`, Node 20.19+). Usage statistics go to Google by default; `--no-usage-statistics` turns them off. Ships skills for general debugging, accessibility, LCP, memory leaks, cookies.

Referenced in `core/mcp/servers.yaml` with usage statistics off. The debugging skills are condensed into `aio-browser-debug`.

## Pinned commits

| # | Commit |
| --- | --- |
| 1 | `57b92d497a67c226b060b71c6f263c8631f37da4` |
| 2 | `96608e078b2d5ea607c5c3b8b5a54d1c1fba6846` |
| 3 | `7436a6e0b6dc3add7c12d5b6ef1ccd3d410dd7fd` |
| 4 | `c20e119ac2220d17013b73526ea460e32efc30da` |
| 5 | `64a6d708f5a43f2cd3fde5d4d7db3905ba1bdf65` |
| 6, 7 | `22f0b463e7a5e579904dd6211a520321035526f7` |
| 8 | `a192894723a8f47e7f504c7b5041967ff1f18e55` |
| 9, 10 | `e6143c9807a001832badb63e89d58ffe25d542ec` |
| 11 | `5863806dd4e15c63174bee4e7515a4256792ecfa` |
| 12 | `d41d9860b0094dcb68030657da63461212835aaa` |
| 13 | `c36522f3d4446288a272aedd727d665f7b8175f2` |
| 14 | `1152d53579d5b3af37ada8c798f197ab093b99c6` |
| 15 | `6b5299e8a83ceffa73d4fc4e148905bb3eeeeb55` |
| 16 | `a09091e0ebf6c96ff327457529d7b0d372125884` |
| 17 | `4b9acc9961a081f462d6a30040b8af729b1d7dc3` |

## Pinned tool versions

Versions current on npm and PyPI on 2026-11-18, used wherever AIO-AGENT runs an upstream tool.

| Tool | Version |
| --- | --- |
| `chrome-devtools-mcp` | 1.13.0 |
| `modern-web-guidance` | 1.0.1 |
| `impeccable` | 4.9.2 |
| `@keygraph/shannon` | 3.5.1 |
| `strix-agent` | 1.7.0 |
| SkillSpector | commit `a09091e` |

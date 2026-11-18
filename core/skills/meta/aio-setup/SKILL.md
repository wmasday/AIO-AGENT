---
name: aio-setup
description: Analyze a codebase and recommend agent setup for it, such as MCP servers, skills, hooks, subagents and project instruction files, for the coding agents the user works with. Read-only; it recommends and does not change files. Use when the user asks how to set up an agent for a project or wants automation recommendations.
---

# Recommend agent setup

This skill only recommends. Make changes only after the user picks what to apply.

## 1. Profile the codebase

- Languages and frameworks: manifest files (`package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `pom.xml`).
- Commands: test, lint, format, build, from the manifest scripts, `Makefile` or CI config.
- Services the code talks to: databases, queues, cloud SDKs, issue trackers.
- Existing agent setup: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.cursor/rules`, `.claude/`, `.agents/skills`, `.mcp.json`.

## 2. Recommend at most two items per category

| Category | Recommend when |
| --- | --- |
| Project instructions | No `AGENTS.md` or equivalent exists, or it lacks the test and lint commands |
| MCP servers | The code depends on a service an MCP server can query (a database, an issue tracker, a browser for frontend work) |
| Skills | A repeated multi-step task appears in the history or the docs (release, migration, deploy) |
| Hooks | A check should run on every edit or commit: format on save, block edits to generated files, run the linter |
| Subagents | A review the team repeats: security, performance, accessibility |

For each item give: what it is, why this codebase needs it (point to the file that shows it), and where it goes for each agent the user uses. Use the paths in AIO-AGENT's `docs/platforms.md`; don't guess paths.

## 3. Avoid

- Recommending what is already installed. AIO-AGENT already provides Context7, Chrome DevTools and, with a key, Magic MCP.
- Hooks that slow every edit for a rare benefit.
- More than about ten recommendations in total.

Adapted from anthropics/claude-plugins-official `claude-code-setup` (Apache-2.0). Generalized to all supported agents and rewritten for AIO-AGENT.

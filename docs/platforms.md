# Platforms

Where each agent reads user-level (global) rules, skills and MCP servers, and how AIO-AGENT installs into it. Paths come from each vendor's documentation, read on 2026-11-18; the source is linked in every section. `~` is the user's home directory (`%USERPROFILE%` on Windows).

## Support matrix

| Agent | Global rules | Skills | MCP config | AIO-AGENT adapter |
| --- | --- | --- | --- | --- |
| Claude Code | `~/.claude/rules/aio-agent.md` | `~/.claude/skills/` | `claude mcp add --scope user` | `claude` |
| OpenAI Codex | `~/.codex/AGENTS.md` (managed block) | `~/.agents/skills/` | `~/.codex/config.toml` | `codex` |
| Cursor | none as a file (see notes) | `~/.cursor/skills/` | `~/.cursor/mcp.json` | `cursor` |
| Google Antigravity | `~/.gemini/config/rules/aio-agent.md` | `~/.gemini/config/skills/` | `~/.gemini/config/mcp_config.json` | `antigravity` |
| Kimi Code CLI | none documented | `~/.kimi/skills/` | `~/.kimi/mcp.json` | `kimi` |
| Pi | `~/.pi/agent/AGENTS.md` (managed block) | `~/.agents/skills/` | `~/.pi/agent/mcp.json` | `pi` |
| Oh My Pi | `~/.omp/agent/AGENTS.md` (managed block) | `~/.agents/skills/` | `~/.omp/agent/mcp.json` | `omp` |
| OpenCode | `~/.config/opencode/AGENTS.md` (managed block) | `~/.agents/skills/` | not configured | `agents-md` |
| AutoClaw | no documented global config | | | none |

"Managed block" means AIO-AGENT appends its rules between `<!-- aio-agent:begin -->` and `<!-- aio-agent:end -->` markers and leaves the rest of the file alone. Uninstall removes exactly that block.

## Claude Code

Source: [Skills](https://code.claude.com/docs/en/skills), [Memory](https://code.claude.com/docs/en/memory), [MCP](https://code.claude.com/docs/en/mcp).

- **Rules:** `~/.claude/CLAUDE.md` and every file in `~/.claude/rules/` load at session start in every project. AIO-AGENT writes its own file, `~/.claude/rules/aio-agent.md`, and never edits `CLAUDE.md`.
- **Skills:** native. Personal skills live in `~/.claude/skills/<name>/SKILL.md`. Only `name` and `description` load at startup (the combined description is truncated at 1,536 characters); the body loads when the skill is invoked. `disable-model-invocation: true` limits a skill to explicit `/name` calls.
- **MCP:** user-scope servers are stored in `~/.claude.json`, written by `claude mcp add --scope user`. Remote servers take `--transport http` and `--header`. `${VAR}` references in `url` and `headers` expand at runtime, so keys stay in the environment.

## OpenAI Codex

Source: [AGENTS.md guide](https://developers.openai.com/codex/guides/agents-md), [Skills](https://developers.openai.com/codex/skills), [MCP](https://developers.openai.com/codex/mcp).

- **Rules:** `~/.codex/AGENTS.md` (or `$CODEX_HOME/AGENTS.md`). An `AGENTS.override.md` in the same folder replaces it. The combined instruction size is capped by `project_doc_max_bytes` (32 KiB by default).
- **Skills:** native, progressive disclosure. The documented user location is `~/.agents/skills/`; `/etc/codex/skills` is the admin location.
- **MCP:** `[mcp_servers.<name>]` tables in `~/.codex/config.toml`. Remote servers take `url`, plus `bearer_token_env_var` or `env_http_headers` to read a key from the environment.

## Cursor

Source: [Rules](https://cursor.com/docs/rules), [Skills](https://cursor.com/docs/skills), [MCP](https://cursor.com/docs/mcp).

- **Rules:** user rules are edited in the app under **Customize → Rules**. There is no documented file, so the installer cannot write them. The router reaches Cursor through skill descriptions instead; to add the router as a user rule, paste `core/rules/router.md` into that screen.
- **Skills:** native. Cursor reads `~/.cursor/skills/`, `~/.agents/skills/`, and, for compatibility, `~/.claude/skills/` and `~/.codex/skills/`. With Claude Code or Codex also installed, Cursor sees the same skill in more than one folder. TODO(verify): whether Cursor shows duplicates or deduplicates by name.
- **MCP:** `~/.cursor/mcp.json`, `mcpServers` map. Remote servers take `url` and `headers`; values support `${env:NAME}` interpolation.

## Google Antigravity

Source: [Rules](https://antigravity.google/docs/rules), [Agent skills](https://antigravity.google/docs/skills), [MCP](https://antigravity.google/docs/mcp).

- **Rules:** global rules load from `~/.gemini/GEMINI.md`, `~/.gemini/AGENTS.md`, `~/.gemini/config/{AGENTS,GEMINI}.md` and `~/.gemini/config/rules/*.md`. Files in `rules/` need YAML frontmatter with `trigger: always_on | model_decision | glob | manual`; a file without valid frontmatter is silently ignored. AIO-AGENT writes `~/.gemini/config/rules/aio-agent.md` with `trigger: always_on`.
- **Skills:** native, Agent Skills standard. Global skills live in `~/.gemini/config/skills/` (legacy `~/.gemini/antigravity/skills/` still read). The CLI also reads `~/.gemini/skills/` and `~/.gemini/antigravity-cli/skills/`.
- **MCP:** `~/.gemini/config/mcp_config.json`, `mcpServers` map. Remote servers use `serverUrl` (Streamable HTTP only) and `headers`. No environment-variable interpolation is documented, so AIO-AGENT adds no keyed servers here: Context7 is added without a key, Magic is skipped.

## Kimi Code CLI

Source: [Agent Skills](https://moonshotai.github.io/kimi-cli/en/customization/skills.md), [MCP](https://moonshotai.github.io/kimi-cli/en/customization/mcp.md), [Data locations](https://moonshotai.github.io/kimi-cli/en/configuration/data-locations.md).

- **Rules:** no user-level instructions file is documented. `AGENTS.md` is read from the project only. Kimi gets the router's triggers through skill descriptions.
- **Skills:** native. User skills come from two groups: a brand group (`~/.kimi/skills/`, `~/.claude/skills/`, `~/.codex/skills/`, all merged, Kimi first) and a generic group (`~/.config/agents/skills/`, else `~/.agents/skills/`). A same-name skill in the brand group wins, so duplicates with Claude Code resolve by name. AIO-AGENT installs into `~/.kimi/skills/`.
- **MCP:** `~/.kimi/mcp.json`, `mcpServers` map with `url` and `headers`. No environment-variable interpolation is documented; same handling as Antigravity.

## Pi and Oh My Pi

Source: Pi [Configuration](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/configuration.md), [Skills](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/skills.md), [MCP](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/mcp.md). Oh My Pi [Context files](https://github.com/can1357/oh-my-pi/blob/main/docs/context-files.md), [Skills](https://github.com/can1357/oh-my-pi/blob/main/docs/skills.md), [MCP config](https://github.com/can1357/oh-my-pi/blob/main/docs/mcp-config.md).

- **Pi:** user configuration lives in `~/.pi/agent` (`PI_CODING_AGENT_DIR` moves it). Context files load from that directory, so `~/.pi/agent/AGENTS.md` is global. Skills load from `~/.agents/skills/`. MCP servers load from `~/.pi/agent/mcp.json`; `headers` values expand `${VAR}`.
- **Oh My Pi** (`omp`), a Pi fork: user context in `~/.omp/agent/AGENTS.md`, skills from `~/.agents/skills/` (on by default), MCP in `~/.omp/agent/mcp.json`. It also reads other agents' files, including `~/.claude/CLAUDE.md` and `~/.codex/AGENTS.md`, and drops a same-name skill whose body is identical. TODO(verify): whether `headers` in `mcp.json` expand `${VAR}`; until then AIO-AGENT adds no keyed servers for Oh My Pi.

The `pi` adapter configures Pi and the `omp` adapter configures Oh My Pi. Oh My Pi also reads `~/.codex/AGENTS.md`, so with Codex installed too it sees the router twice.

## OpenCode

Source: [Rules](https://opencode.ai/docs/rules), [Skills](https://opencode.ai/docs/skills).

- **Rules:** `~/.config/opencode/AGENTS.md` is global.
- **Skills:** reads `~/.config/opencode/skills/`, `~/.agents/skills/` and `~/.claude/skills/`.
- **MCP:** configured in `opencode.json`. AIO-AGENT does not edit it in this version.

The `agents-md` adapter covers OpenCode and any other agent that reads `~/.agents/skills/`.

## Not supported

- **AutoClaw** (Zhipu desktop app): no public documentation of a global rules, skills or MCP location. Files inside the app bundle refer to `~/.openclaw-autoclaw/skills/`, which does not exist on the test machine. Per the project rule against guessing paths, there is no adapter.
- **Gemini CLI:** documents `~/.gemini/GEMINI.md`, `~/.gemini/skills/` and `~/.gemini/settings.json`. Antigravity also reads `~/.gemini/GEMINI.md`, so writing the router there would load it twice for Antigravity users. Not supported in this version.
- **Windsurf, Cline, GitHub Copilot:** not researched against first-party documentation in this version. Any of them that reads `~/.agents/skills/` gets the skills from the `agents-md` adapter. TODO(verify).

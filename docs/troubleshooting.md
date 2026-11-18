# Troubleshooting

Problems found while building and testing AIO-AGENT, with their fixes.

## "MCP server ... already exists; left alone"

You already have a server with that name, for example your own `context7` entry. AIO-AGENT does not overwrite it. Your entry stays in use; `doctor` reports it as configured.

## "exists and is not managed by AIO-AGENT; left alone"

A skill folder with the same name exists without the `.aio-agent` marker, so it is treated as yours. Rename or remove your folder, then rerun the installer.

## `doctor` shows magic as skipped

`API_KEY_21ST` was not set when the installer ran, or the agent cannot read keys from the environment (Antigravity, Kimi, Oh My Pi). See [configuration.md](configuration.md#api-keys).

## An MCP server is "configured, not reachable"

- No network, or a proxy blocks `mcp.context7.com` or `21st.dev`.
- For `chrome-devtools`: Node.js is older than 20.19, or `npx` cannot download the package. Run `npx -y chrome-devtools-mcp@1.13.0 --help` to see the error.

## Antigravity's `mcp_config.json` is empty

Antigravity can create `~/.gemini/config/mcp_config.json` as an empty file. The installer treats an empty file as an empty configuration and backs it up first; uninstall restores the empty file.

## The agent doesn't follow the router in Cursor or Kimi

Neither has a user-level rules file the installer can write. The skills still load by their descriptions. In Cursor, paste [core/rules/router.md](../core/rules/router.md) into **Customize → Rules** to add the triggers as a user rule.

## Cursor lists a skill twice

Cursor also reads `~/.claude/skills/` and `~/.agents/skills/`, where the Claude Code and Codex adapters install the same skills. TODO(verify): whether Cursor deduplicates by name.

## Codex ignores the rules

Codex reads `~/.codex/AGENTS.override.md` instead of `AGENTS.md` when the override exists. Move your override's content into `AGENTS.md`, or remove the override.

## `node --test tests/` fails with "Cannot find module"

Node 22 treats a directory argument as a module path. Name the file: `node --test tests/roundtrip.test.mjs`.

## `npx ./aio-agent-0.1.0.tgz` fails with "Permission denied"

npx treats a bare path as a command. Name the package explicitly: `npx --yes --package ./aio-agent-0.1.0.tgz aio-agent --help`.

## `doctor` under npx reported chrome-devtools as not reachable

Fixed in 0.1.0. npx exports `npm_config_*` variables, and the nested `npx` that starts the server read `npm_config_package` and ran the wrong command. `doctor` now starts the server without those variables.

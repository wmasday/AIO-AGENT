# Configuration

## API keys

Keys are read from environment variables. AIO-AGENT never writes a key's value to disk: where an agent can expand variables in its MCP config, the installer writes a reference such as `${CONTEXT7_API_KEY}`; where it can't, the keyed server is added without a key or skipped.

| Variable | Used by | Required | Get one |
| --- | --- | --- | --- |
| `CONTEXT7_API_KEY` | Context7 MCP | No; raises rate limits | <https://context7.com/dashboard> |
| `API_KEY_21ST` | Magic MCP (`aio-ui-components`) | Yes; Magic is skipped without it | <https://21st.dev/mcp> |

Set the variable in your shell profile, then rerun the installer so it adds the reference:

```sh
export API_KEY_21ST=...   # in ~/.zshrc or ~/.bashrc
AIO-AGENT/scripts/install.sh
```

The agent must also see the variable when it starts. Desktop apps launched from the dock or Start menu may not read your shell profile.

| Agent | How the key reaches the server |
| --- | --- |
| Claude Code | `${VAR}` in the header, expanded at runtime |
| Codex | `bearer_token_env_var` or `env_http_headers` in `config.toml` |
| Cursor | `${env:VAR}` in the header |
| Pi | `${VAR}` in the header |
| Antigravity, Kimi, Oh My Pi | Not supported: Context7 is added without a key, Magic is skipped |

## Agent home overrides

The installer honours the same variables as the agents:

| Variable | Agent | Default |
| --- | --- | --- |
| `CLAUDE_CONFIG_DIR` | Claude Code | `~/.claude` |
| `CODEX_HOME` | Codex | `~/.codex` |
| `KIMI_SHARE_DIR` | Kimi Code CLI | `~/.kimi` |
| `PI_CODING_AGENT_DIR` | Pi | `~/.pi/agent` |

## MCP servers

The servers are defined in [core/mcp/servers.yaml](../core/mcp/servers.yaml):

| Server | Transport | Notes |
| --- | --- | --- |
| `context7` | HTTP, `https://mcp.context7.com/mcp` | Works without a key |
| `magic` | HTTP, `https://21st.dev/api/mcp` | Needs `API_KEY_21ST`; some generation tools need a paid 21st.dev plan |
| `chrome-devtools` | stdio, `npx -y chrome-devtools-mcp@1.13.0 --no-usage-statistics` | Usage statistics to Google are turned off |

To drop a server, delete its block from `servers.yaml` in your checkout and rerun the installer; it removes the servers it added that are no longer listed. A server with the same name that you added yourself is never changed or removed.

## Turning off a skill

AIO-AGENT has no per-skill switch. Use the agent's own setting, which survives reinstalls:

- **Claude Code:** in `~/.claude/settings.json`, `"skillOverrides": { "aio-terse": "off" }`. Other values: `"name-only"`, `"user-invocable-only"`. See the [Claude Code skills docs](https://code.claude.com/docs/en/skills).
- **Codex:** in `~/.codex/config.toml`, add `[[skills.config]]` with `name = "aio-terse"` and `enabled = false`. See the [Codex skills docs](https://developers.openai.com/codex/skills).

## Modes

`/terse`, `/prototype` and `/normal` are typed in the chat; there is nothing to configure. Their behaviour is defined in [core/rules/precedence.md](../core/rules/precedence.md).

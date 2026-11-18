# Installation

## Prerequisites

| Requirement | Why |
| --- | --- |
| Git | To clone and update the repository |
| Node.js 18 or newer | Runs the installer engine (`scripts/aio.mjs`) |
| Node.js 20.19 or newer | Needed by the Chrome DevTools MCP server, which runs through `npx` |
| At least one supported agent | See [platforms.md](platforms.md) |

Check with `node --version`.

## macOS and Linux

```sh
git clone https://github.com/wmasday/AIO-AGENT.git
AIO-AGENT/scripts/install.sh
```

The installer prints one block per agent it configured:

```text
Claude Code
  skills  20 updated in ~/.claude/skills
  rules   written in ~/.claude/rules/aio-agent.md
  mcp     updated
          skipped magic (API_KEY_21ST not set)
```

Keep the cloned folder: `update.sh` and `uninstall.sh` live in it. Uninstall works from any copy, because it reads what was installed from `~/.aio-agent/state.json`.

## Windows

In PowerShell:

```powershell
git clone https://github.com/wmasday/AIO-AGENT.git
.\AIO-AGENT\scripts\install.ps1
```

If the execution policy blocks unsigned scripts, run it as `powershell -ExecutionPolicy Bypass -File .\AIO-AGENT\scripts\install.ps1` for that one call.

TODO(verify): the PowerShell scripts are covered by the CI workflow on `windows-latest`, which has not completed a run yet. They have not been run on a Windows machine.

## WSL

Inside WSL, follow the Linux steps. The installer configures the agents installed inside WSL, under the WSL home directory. Agents installed on the Windows side need the Windows steps as well.

## Choosing agents

By default the installer configures every agent it detects: its command is on `PATH`, or its configuration folder exists. To list what was detected:

```sh
node AIO-AGENT/scripts/aio.mjs list
```

To install for specific agents only, even ones not detected:

```sh
AIO-AGENT/scripts/install.sh --only claude,codex
```

Adapter ids: `claude`, `codex`, `cursor`, `antigravity`, `kimi`, `pi`, `omp`, `agents-md`.

## Offline install

The skills and rules install without network access. MCP servers need the network when the agent starts them: Context7 and Magic are remote services, and the Chrome DevTools server downloads through `npx` on first use. `doctor` reports them as not reachable while offline.

## Verify

```sh
AIO-AGENT/scripts/doctor.sh
```

```text
Cursor
  rules    n/a  no user-level rules file for this agent
  skills   ✅   20/20 in ~/.cursor/skills
  mcp      ✅   context7: configured, reachable
  mcp      ✅   chrome-devtools: configured, reachable
  mcp      –    skipped magic (API_KEY_21ST not set)
```

`doctor` checks that each file is in the location the agent's documentation names, and that each MCP server answers an MCP `initialize` request. It exits with status 1 if any check fails. It does not start the agents themselves; to confirm an agent sees the skills, open it in an empty folder and ask "Which skills do you have?".

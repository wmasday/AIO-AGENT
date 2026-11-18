# Architecture

AIO-AGENT keeps one platform-neutral source in `core/` and installs it into each agent's native locations through small adapters.

```text
core/skills/<group>/<skill>/SKILL.md   skills, Agent Skills format
core/rules/router.md                   always-on rules: defaults and triggers
core/rules/precedence.md               modes and conflict resolution
core/mcp/servers.yaml                  MCP server definitions
        │
        ▼
adapters/<platform>/adapter.conf       where this platform reads each piece
        │
        ▼
scripts/install.sh | install.ps1       detect agents, copy, merge, back up
```

## Design rules

1. **One copy of each idea.** Overlapping sources are merged into one skill. [SOURCES.md](../SOURCES.md) records where each part came from.
2. **Progressive disclosure.** Only the router (`core/rules/router.md`, under 150 lines) is always loaded. Every agent in the support matrix loads skill bodies on demand, so a skill costs one description line until it is used.
3. **Adapters are data.** A platform adapter is a `KEY=value` file naming paths and formats. The two installers share the same adapter files, so adding a platform does not mean writing a shell script and a PowerShell script.
4. **Never take over a user file.** AIO-AGENT writes its own files where a platform allows it (`~/.claude/rules/aio-agent.md`, `~/.gemini/config/rules/aio-agent.md`). Where it must share a file, it writes a marked block. Before the first change to any existing file, the installer saves `<file>.bak-<timestamp>`.
5. **Secrets stay in the environment.** MCP entries refer to `CONTEXT7_API_KEY` and `API_KEY_21ST` by name on platforms that expand variables. On platforms that don't, keyed servers are skipped rather than written with the key in clear text.
6. **Dangerous tools are opt-in.** The pentest skill sets `disable-model-invocation: true`, so agents that support the flag never load it on their own, and its first step is an authorization check.

## Research findings

The full per-source notes are in [SOURCES.md](../SOURCES.md) and the per-platform paths in [platforms.md](platforms.md). This section records the decisions they led to.

### Overlaps and how they merge

| Topic | Sources | Result |
| --- | --- | --- |
| Test-driven development | superpowers `test-driven-development` (#6 and #7 are the same skill) | `aio-tdd` |
| Design before building | superpowers `brainstorming`, mattpocock `grilling` + `domain-modeling` | `aio-brainstorm` (explore and agree a design), `aio-grill` (stress-test a design the user already has) |
| Code review | superpowers `requesting-code-review` and `receiving-code-review`, ponytail `ponytail-review` | `aio-review` |
| Frontend quality | anti-slop UI skills, impeccable, ui-ux-pro-max | `aio-frontend-design`: one checklist, with impeccable's detector and ui-ux-pro-max's search tool as optional upstream tools |
| Web platform APIs | modern-web-guidance; overlaps with frontend quality on performance and accessibility | `aio-modern-web` for API choice; `aio-frontend-design` links to it |
| Browser debugging | chrome-devtools-mcp skills (`chrome-devtools`, `a11y-debugging`, `debug-optimize-lcp`, `memory-leak-debugging`) | `aio-browser-debug` |
| Security review | claude-security (proprietary), Strix's white-box skill | `aio-security-review`, written independently; active testing stays in `aio-pentest` |
| Active pentesting | Shannon, Strix | `aio-pentest`: one gate, two tools |
| Output style | caveman (terse), anti-slop copywriting and code comments | `aio-terse` (a mode) and `aio-plain-output` (always applicable writing rules) |
| Code economy | ponytail, caveman `lean-build` and `surgical-patch` | `aio-lean` |

### Conflicts and resolutions

| Conflict | Resolution |
| --- | --- |
| Terse output (caveman) vs. thorough explanation | Normal output is the default. `/terse` switches to terse until `/normal`. Safety warnings, commands and code are never shortened. |
| Strict TDD ("delete code written before the test") vs. prototyping | TDD is the default for features and bug fixes. `/prototype` suspends TDD and the brainstorm step for throwaway work and says so in each reply; it never suspends the security rules. |
| Brainstorm-first vs. "the smallest change" (ponytail) | Brainstorming decides *what* to build; `aio-lean` decides *how much code* to write. Small, well-specified changes skip brainstorming. |
| Several skills claim "use before any task" (superpowers `using-superpowers`, anti-slop "load always") | Neither is copied. The router alone decides what loads. |
| Upstream pentest skills trigger on "security scan" | Not installed. `aio-pentest` runs only on an explicit command. |
| Anti-slop's design rules vs. impeccable's surface modes | Impeccable's modes decide the ambition level; anti-slop's warning signs apply in every mode. The brief overrides both. |

[core/rules/precedence.md](../core/rules/precedence.md) is the binding version of these rules.

### License matrix

AIO-AGENT is MIT. Every source was checked for compatibility.

| License | Sources | Consequence |
| --- | --- | --- |
| MIT | anti-slop, ponytail, ui-ux-pro-max, superpowers, mattpocock/skills, context7 | Adapted text keeps the copyright notice in THIRD_PARTY_NOTICES.md |
| ISC | magic-mcp | Referenced only |
| Apache-2.0 | modern-web-guidance, caveman, claude-code-setup, impeccable, strix, SkillSpector, chrome-devtools-mcp | Adapted text is marked as changed, with the license text and NOTICE content in THIRD_PARTY_NOTICES.md. Caveman's name is a trademark and is not used. |
| AGPL-3.0 | shannon | Referenced only: the user installs it, nothing is copied |
| Proprietary | claude-security | Not copied, adapted or redistributed; pointed to on Claude Code only |

### Skill catalog

| Group | Skill | One job |
| --- | --- | --- |
| workflow | `aio-brainstorm` | Turn a feature idea into an agreed design before code |
| workflow | `aio-grill` | Stress-test an existing plan, keeping a glossary and ADRs |
| workflow | `aio-plan` | Write a step-by-step implementation plan from an agreed design |
| workflow | `aio-execute` | Carry out a written plan task by task |
| workflow | `aio-debug` | Find a bug's root cause before changing code |
| quality | `aio-tdd` | Red, green, refactor for features and bug fixes |
| quality | `aio-verify` | Run the checks before claiming work is done |
| quality | `aio-review` | Review a change, or respond to review feedback |
| quality | `aio-lean` | Make the smallest complete change |
| quality | `aio-plain-output` | Write prose and code comments without filler |
| frontend | `aio-frontend-design` | Design or critique a UI against one quality checklist |
| frontend | `aio-modern-web` | Choose current web platform APIs over legacy patterns |
| frontend | `aio-ui-components` | Find or generate UI components through Magic MCP |
| frontend | `aio-browser-debug` | Debug a live page through Chrome DevTools MCP |
| security | `aio-security-review` | Review code for vulnerabilities, without running exploits |
| security | `aio-pentest` | Run Shannon or Strix against an authorized target (explicit command only) |
| meta | `aio-library-docs` | Fetch current library docs through Context7 |
| meta | `aio-setup` | Recommend agent setup for a codebase |
| meta | `aio-skill-check` | Scan a third-party skill with SkillSpector before installing it |
| meta | `aio-terse` | Terse output mode |

All names carry the `aio-` prefix so they never collide with a user's own skills or another plugin's.

### What could not be verified

- Whether Cursor deduplicates a skill that appears in several of the folders it reads.
- Whether Oh My Pi expands `${VAR}` in MCP `headers`.
- AutoClaw's configuration format. It has no public documentation.
- Behaviour on platforms not installed on the test machine (see the test matrix in the README).

## How the installer works

`scripts/install.sh` and `scripts/install.ps1` check for Node.js and call `scripts/aio.mjs install`. Merging JSON and TOML safely needs a real parser, and the MCP servers already need Node.js, so the engine is one dependency-free Node script instead of parallel shell and PowerShell implementations.

For each detected agent the engine:

1. copies each skill folder into the agent's skills folder and adds a `.aio-agent` marker file;
2. writes the router, with `{{SKILLS_DIR}}` replaced by that folder, as a file or a marked block;
3. merges the MCP servers from `core/mcp/servers.yaml` into the agent's config, or adds them through `claude mcp add-json` for Claude Code;
4. records every file it changed, its backup and the SHA-256 of what it wrote in `~/.aio-agent/state.json`.

A file is only written when its content would change, which makes a second run a no-op. Uninstall uses the recorded hash to tell whether the user edited a file after the install, and restores the backup only if they did not.

## Adding a skill

1. Create `core/skills/<group>/aio-<name>/SKILL.md` with `name` and `description` frontmatter. The description says what the skill does and when to use it.
2. Add a trigger row and a catalog row to `core/rules/router.md`.
3. Add the skill to [skills.md](skills.md), and its sources to [SOURCES.md](../SOURCES.md) and [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md).
4. Run `scripts/check-skills.sh`.

## Adding a platform

1. Confirm the platform's user-level paths in its official documentation and add a section to [platforms.md](platforms.md).
2. Create `adapters/<id>/adapter.conf`. The keys are:

   | Key | Meaning |
   | --- | --- |
   | `NAME` | Display name |
   | `DETECT_COMMANDS`, `DETECT_DIRS` | The agent counts as installed if a command is on `PATH` or a folder exists |
   | `BASE`, `BASE_ENV` | The agent's home folder, and the variable that overrides it |
   | `SKILLS_DIR` | Where skill folders go; `{BASE}` expands to the home folder |
   | `RULES_MODE` | `file` (own file), `block` (marked block in a shared file) or `none` |
   | `RULES_PATH`, `RULES_FRONTMATTER` | Rules location, and frontmatter to put before the router (`\n` for new lines) |
   | `MCP_MODE` | `json`, `codex-toml`, `claude-cli` or `none` |
   | `MCP_PATH`, `MCP_URL_KEY`, `MCP_TYPE_FIELD` | JSON config file, the key for a remote server's URL, and whether entries need a `type` |
   | `MCP_ENV_STYLE` | How the agent expands variables: `dollar` (`${VAR}`), `cursor` (`${env:VAR}`), `codex`, or `none` |

3. Add the id to the round-trip test and the CI `ADAPTERS` list, then run `node --test tests/roundtrip.test.mjs`.

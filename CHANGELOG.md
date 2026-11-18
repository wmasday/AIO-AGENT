# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.1] - 2026-11-19

Pre-release. There is no CI; the checks in CONTRIBUTING.md were run locally for this release.

### Added

- Sample projects in `examples/`: a small app with a seeded bug, UI flaws and a deprecated library call, and an intentionally vulnerable app that binds to 127.0.0.1 only.
- `docs/demos.md`: 16 recorded agent runs against the samples, with the exact prompts and results. 13 skills loaded during the runs; the page lists the 4 that did not load separately. The clips are attached to this release.
- Scripts in `examples/recording/` that run and record the demos.

### Changed

- Oh My Pi now gets the keyed MCP servers (Context7 with a key, Magic): its `mcp.json` expands `${VAR}` in headers.
- Documented skill support for GitHub Copilot (through `~/.agents/skills`), Cline and Windsurf.

### Removed

- The GitHub Actions workflow. Run the checks in CONTRIBUTING.md locally instead.

### Known limitations

- No CI. Linux and Windows have not been tested.
- Codex, Cursor, Kimi, Pi, Oh My Pi and OpenCode are tested at the config-file level only.
- Cursor's handling of the same skill in two folders is undocumented; with Claude Code or Codex installed it finds each skill twice.
- Oh My Pi's `${VAR}` expansion in MCP headers is documented upstream but untested with the agent.
- The demo media (56 MB) was committed once before being moved to release assets, so it remains in the git history.

## [0.1.0] - 2026-11-18

First release. Pre-release quality: see Known limitations.

### Added

- 20 skills in five groups (workflow, quality, frontend, security, meta), adapted from 17 upstream sources listed in `SOURCES.md`.
- An always-on router (`core/rules/router.md`, 79 lines) with triggers, safety rules and the `/terse`, `/prototype` and `/normal` modes.
- MCP definitions for Context7, Magic (when `API_KEY_21ST` is set) and Chrome DevTools, with keys referenced from the environment.
- Adapters for Claude Code, OpenAI Codex, Cursor, Google Antigravity, Kimi Code CLI, Pi, Oh My Pi, and OpenCode through `~/.agents/skills`.
- Install, uninstall, update and doctor scripts for macOS and Linux (bash) and Windows (PowerShell), wrapping one Node.js engine.
- Backups before every change to an existing file, and byte-for-byte restore on uninstall.
- Opt-in `aio-pentest` skill for Shannon and Strix, gated by an explicit command and an authorization check.
- Brand assets: logo, banner and social preview.
- `aio-agent` command-line interface (`install`, `uninstall`, `update`, `doctor`, `list`) and npm packaging, so `npx aio-agent@latest install` works without a clone.

### Known limitations

- Codex, Cursor, Kimi, Pi, Oh My Pi and OpenCode are tested at the config-file level only; the agents were not available on the test machine.
- The Windows scripts and the Linux install have not run; they are covered by CI, which has not completed a run.
- Cursor has no user-level rules file; the router must be pasted into its settings by hand.

[Unreleased]: https://github.com/wmasday/AIO-AGENT/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/wmasday/AIO-AGENT/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/wmasday/AIO-AGENT/releases/tag/v0.1.0

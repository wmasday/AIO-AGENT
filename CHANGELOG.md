# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

First release candidate, planned as 0.1.0.

### Added

- 20 skills in five groups (workflow, quality, frontend, security, meta), adapted from 17 upstream sources listed in `SOURCES.md`.
- An always-on router (`core/rules/router.md`, 79 lines) with triggers, safety rules and the `/terse`, `/prototype` and `/normal` modes.
- MCP definitions for Context7, Magic (when `API_KEY_21ST` is set) and Chrome DevTools, with keys referenced from the environment.
- Adapters for Claude Code, OpenAI Codex, Cursor, Google Antigravity, Kimi Code CLI, Pi, Oh My Pi, and OpenCode through `~/.agents/skills`.
- Install, uninstall, update and doctor scripts for macOS and Linux (bash) and Windows (PowerShell), wrapping one Node.js engine.
- Backups before every change to an existing file, and byte-for-byte restore on uninstall.
- Opt-in `aio-pentest` skill for Shannon and Strix, gated by an explicit command and an authorization check.
- Brand assets: logo, banner and social preview.

### Known limitations

- Codex, Cursor, Kimi, Pi, Oh My Pi and OpenCode are tested at the config-file level only; the agents were not available on the test machine.
- The Windows scripts and the Linux install have not run; they are covered by CI, which has not completed a run.
- Cursor has no user-level rules file; the router must be pasted into its settings by hand.

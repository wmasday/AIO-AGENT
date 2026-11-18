# Contributing to AIO-AGENT

## Proposing a change

1. Open an issue first for anything larger than a typo, so the approach can be agreed before you write it.
2. Fork the repository and create a branch from `main`.
3. Keep each pull request to one concern. Update the docs in the same pull request when behaviour changes.
4. Run the checks before opening the pull request:

   ```sh
   npx markdownlint-cli2 "**/*.md"
   shellcheck -x scripts/*.sh scripts/lib/*.sh
   scripts/check-skills.sh
   node --test tests/roundtrip.test.mjs
   ```

   If you change a PowerShell script, also run it on Windows and say so in the pull request.
5. Never test the installer against your real home directory. Point it at a scratch folder: `HOME=$(mktemp -d) scripts/install.sh --only codex`.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```text
<type>: <summary in the imperative, lower case, no full stop>
```

Types in use: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`.

Skills and docs follow [aio-plain-output](core/skills/quality/aio-plain-output/SKILL.md): no hype words, no filler, no claims without a test or a source.

## Attribution

Commits are authored by the person who submits them. Do not add AI co-author trailers, "generated with" lines, or agent session links to commits, pull requests, tags, or files. If you use an AI coding agent, turn its attribution off before committing.

## Code of conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md).

---
name: aio-skill-check
description: Scan a third-party agent skill, plugin or MCP server for security risks (prompt injection, data exfiltration, excessive permissions, malicious code) with NVIDIA SkillSpector before installing it. Use when the user wants to install or evaluate a skill from a URL, repository, archive or folder.
---

# Check a skill before installing it

Skills run with the agent's permissions. Scan before installing.

## 1. Get SkillSpector

It needs Python 3.12 or 3.13 and `uv`. Check with `skillspector --version`. If missing, the user installs it, pinned to the commit AIO-AGENT was tested with:

```sh
uv tool install --python 3.13 git+https://github.com/NVIDIA/SkillSpector.git@a09091e0ebf6c96ff327457529d7b0d372125884
```

## 2. Scan

Static analysis, no LLM and no key needed:

```sh
skillspector scan <path-or-git-url> --no-llm --format json --output skillspector-report.json
```

For several skills in one folder, add `--recursive`. The optional LLM stage needs a provider key that the user configures; see the SkillSpector README.

## 3. Read the result

The report has a 0 to 100 risk score and findings by category. Summarize:

- the score and the recommendation SkillSpector gives;
- each high or critical finding, with the file and what it does;
- whether the skill asks for network, shell or file access its description doesn't explain.

Then read the flagged files yourself. A static scanner reports patterns, not intent.

## 4. Decide

Recommend install, install with changes, or don't install, and say why. Don't install anything until the user decides.

References NVIDIA/SkillSpector (Apache-2.0); not bundled. Written for AIO-AGENT.

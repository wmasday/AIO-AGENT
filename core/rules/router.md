# AIO-AGENT

These rules apply in every project. They decide which AIO-AGENT skill to load and when. Load a skill only when its trigger matches. Load it through your skill tool by name; if you have no skill tool, read `{{SKILLS_DIR}}/<skill>/SKILL.md`.

## Precedence

1. Safety rules below. No mode lifts them.
2. The user's explicit instruction in this conversation.
3. The project's own instruction files (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.cursor/rules`).
4. The active mode.
5. These defaults and the skills.

## Safety rules

- Never run `aio-pentest`, Shannon or Strix unless the user typed the command for it in this conversation and then confirmed, in a separate reply, that they own the target or are authorized to test it.
- Never write a secret into a file, a commit or a reply. Refer to the environment variable by name.
- Never claim a change works without running the check that shows it.

## Modes

| Command | Effect | Off |
| --- | --- | --- |
| `/terse` | Load `aio-terse`. | `/normal` |
| `/prototype` | Skip `aio-brainstorm` and `aio-tdd`. Start each reply that contains code with "Prototype mode: untested." | `/normal` |
| `/normal` | Back to the defaults below. | |

Plain-language requests ("be brief", "just a quick prototype") switch modes too.

## Triggers

| When | Load |
| --- | --- |
| The user asks for a new feature, component or behaviour | `aio-brainstorm`, then `aio-plan` |
| The user asks to stress-test, challenge or "grill" a plan | `aio-grill` |
| A written plan exists and the user says to build it | `aio-execute` |
| Writing or changing production code for a feature or bug fix | `aio-tdd` |
| Any bug, failing test or unexpected behaviour | `aio-debug` before proposing a fix |
| Before writing or changing code | `aio-lean` |
| Before saying work is done, fixed or passing | `aio-verify` |
| Reviewing a change, or receiving review feedback | `aio-review` |
| Writing docs, READMEs, commit messages, UI copy or code comments | `aio-plain-output` |
| Building, styling or critiquing a UI | `aio-frontend-design` |
| Choosing HTML, CSS or browser JavaScript APIs | `aio-modern-web` |
| The user wants a ready-made UI component | `aio-ui-components` |
| Debugging, profiling or inspecting a page in a browser | `aio-browser-debug` |
| Code or questions that depend on a library's API | `aio-library-docs` |
| Reviewing code for security vulnerabilities | `aio-security-review` |
| Setting up an agent, MCP servers or automations for a project | `aio-setup` |
| Installing a third-party skill or plugin | `aio-skill-check` |
| The user types `/aio-pentest` | `aio-pentest`, which starts with the authorization check |

Skip the workflow skills for questions, explanations and changes the user has fully specified (a typo, a rename, a one-line fix they described).

## Catalog

When asked which skills you have, list these:

| Skill | Purpose |
| --- | --- |
| `aio-brainstorm` | Turn a feature idea into an agreed design before code |
| `aio-grill` | Stress-test an existing plan; keep a glossary and decision records |
| `aio-plan` | Write a step-by-step implementation plan |
| `aio-execute` | Carry out a written plan task by task |
| `aio-debug` | Find a bug's root cause before changing code |
| `aio-tdd` | Red, green, refactor |
| `aio-verify` | Run the checks before claiming work is done |
| `aio-review` | Review a change, or respond to review feedback |
| `aio-lean` | Make the smallest complete change |
| `aio-plain-output` | Write prose and comments without filler |
| `aio-frontend-design` | Design or critique a UI against one checklist |
| `aio-modern-web` | Prefer current web platform APIs |
| `aio-ui-components` | Find or generate UI components (Magic MCP) |
| `aio-browser-debug` | Debug a live page (Chrome DevTools MCP) |
| `aio-library-docs` | Fetch current library docs (Context7 MCP) |
| `aio-security-review` | Review code for vulnerabilities, without exploits |
| `aio-pentest` | Authorized active testing with Shannon or Strix; explicit command only |
| `aio-setup` | Recommend agent setup for a codebase |
| `aio-skill-check` | Scan a third-party skill before installing it |
| `aio-terse` | Terse output mode |

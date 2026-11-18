# Skills

AIO-AGENT installs 20 skills. Each has one job. The router ([core/rules/router.md](../core/rules/router.md)) loads a skill when its trigger matches; you can also call any skill by name, for example `/aio-tdd` in Claude Code or Cursor.

Source numbers refer to [SOURCES.md](../SOURCES.md).

## Workflow

| Skill | Trigger | What it does | Sources |
| --- | --- | --- | --- |
| `aio-brainstorm` | A request for a new feature or behaviour | Reads the code, asks focused questions, proposes options, and writes down the agreed design before any code | #6 |
| `aio-grill` | "Grill this plan", "stress-test this" | Interviews you round by round over the open decisions, with a recommended answer for each, and keeps `GLOSSARY.md` and ADRs current | #11 |
| `aio-plan` | An agreed design that needs building | Writes a plan of small tasks, each with files, a test and a verification command | #6 |
| `aio-execute` | "Build the plan" | Works through the plan one task at a time and stops on a blocker | #6 |
| `aio-debug` | A bug, failing test or unexpected behaviour | Reproduces the problem and finds the root cause before any fix | #6 |

## Quality

| Skill | Trigger | What it does | Sources |
| --- | --- | --- | --- |
| `aio-tdd` | Writing code for a feature or bug fix | Writes a failing test, watches it fail, writes the minimum code, refactors | #6, #7 |
| `aio-verify` | Before claiming work is done | Runs the command that proves the claim and reports its actual output | #6 |
| `aio-review` | Reviewing a change, or receiving review | Checks correctness, safety, tests and size; on receiving feedback, verifies each point before acting | #2, #6 |
| `aio-lean` | Before writing code | Picks the smallest complete change: reuse, standard library, then new code | #2, #8 |
| `aio-plain-output` | Writing docs, copy, commit messages, comments | Removes filler words, hype, restated code and decorative comments | #1 |

## Frontend

| Skill | Trigger | What it does | Sources |
| --- | --- | --- | --- |
| `aio-frontend-design` | Building, styling or critiquing a UI | Sets the design direction from the kind of surface and checks the result against one list: accessibility, layout, type, color, motion, states | #1, #3, #12 |
| `aio-modern-web` | Choosing web platform APIs | Looks up current guidance with the `modern-web-guidance` CLI before writing HTML, CSS or browser JavaScript | #5 |
| `aio-ui-components` | "Add a pricing table", "find a navbar component" | Searches or generates components through the Magic MCP server | #15 |
| `aio-browser-debug` | Debugging or profiling a page | Uses the Chrome DevTools MCP server for console, network, performance, accessibility and memory checks | #17 |

## Security

| Skill | Trigger | What it does | Sources |
| --- | --- | --- | --- |
| `aio-security-review` | Reviewing code for vulnerabilities | Reads the code for injection, auth, secrets, unsafe deserialization and similar flaws; reports only findings it can trace to code | Written for AIO-AGENT |
| `aio-pentest` | Only the explicit `/aio-pentest` command | Confirms authorization, then runs Shannon or Strix against the target | #4, #14 |

## Meta

| Skill | Trigger | What it does | Sources |
| --- | --- | --- | --- |
| `aio-library-docs` | Code that depends on a library's API | Fetches current documentation through the Context7 MCP server | #13 |
| `aio-setup` | Setting up an agent for a project | Scans the codebase and recommends skills, MCP servers and hooks for the agents you use | #9 |
| `aio-skill-check` | Installing a third-party skill | Scans it with SkillSpector before it is installed | #16 |
| `aio-terse` | `/terse`, "be brief" | Short answers that keep every technical fact | #8 |

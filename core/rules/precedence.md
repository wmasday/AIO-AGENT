# Precedence and modes

This file is the source for the "Modes" and "Precedence" sections of [router.md](router.md). It defines what applies when two pieces of guidance disagree, and how the user changes the defaults.

## Order of authority

When instructions conflict, the higher item wins:

1. Safety rules in this file. No mode lifts them.
2. The user's explicit instruction in the current conversation.
3. The project's own instruction files (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.cursor/rules`).
4. The active mode.
5. AIO-AGENT skills and the router defaults.

## Safety rules

These hold in every mode:

- Never run `aio-pentest`, Shannon or Strix unless the user typed the command for it in this conversation and confirmed, in a separate reply, that they own the target or are authorized to test it.
- Never write a secret (API key, token, password) into a file, a commit or a reply. Refer to the environment variable by name.
- Never claim a change works without running the check that shows it.

## Defaults

| Area | Default |
| --- | --- |
| Output | Normal: complete sentences, the answer first, no filler. |
| New feature | `aio-brainstorm`, then `aio-plan`, then `aio-tdd` while building. |
| Bug fix | `aio-debug` to find the root cause, then a failing test, then the fix. |
| Code size | `aio-lean`: the smallest change that fully solves the task. |
| Finishing | `aio-verify` before saying the work is done. |

## Modes

The user switches modes by typing the command, or by asking in plain words ("be terse", "this is just a prototype"). A mode lasts until the user switches it off or the conversation ends.

| Command | Effect | Off |
| --- | --- | --- |
| `/terse` | Load `aio-terse`: short answers, no preamble, every technical fact kept. | `/normal` |
| `/prototype` | Skip `aio-brainstorm` and `aio-tdd` for throwaway or exploratory code. Start each reply that contains code with "Prototype mode: untested." | `/normal` |
| `/normal` | Back to the defaults. | |

## Resolved conflicts

- **Terse vs. thorough.** Terse mode shortens prose only. It never shortens code, commands, error messages, warnings, or the steps of a destructive action.
- **TDD vs. prototyping.** TDD is the default. `/prototype` suspends it and marks the output as untested; it does not suspend verification of what was actually claimed.
- **Brainstorm vs. smallest change.** `aio-brainstorm` decides what to build. `aio-lean` decides how much code to write for it. A small, fully specified change (a typo, a renamed variable, a one-line fix the user described) skips brainstorming.
- **Design ambition vs. restraint.** The user's brief decides. Without one, `aio-frontend-design` sets the ambition from the kind of surface (marketing page vs. app screen).
- **Skills that ask to load on every task.** Only the router decides what loads. No skill is loaded "always".

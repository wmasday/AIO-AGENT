---
name: aio-lean
description: Make the smallest complete change that fully solves the task, reusing what exists before writing new code. Use before writing or changing code, and when the user asks for the simplest solution or complains about over-engineering.
---

# Lean changes

The best code is code you didn't have to write. Be economical with the solution, never with the completeness of the change.

## Before writing

Read the task and the code it touches. List every place the change must reach: callers, tests, fixtures, config, exports. That list is the scope. Features nobody asked for are not.

## The ladder

Take the first option that fully works:

1. **Does it need to exist?** Skip options and flexibility nobody asked for. Name what you skipped in one line.
2. **Already in this codebase?** Use the existing helper, component or pattern the way the surrounding code does.
3. **In the standard library or the platform?** Use it.
4. **In an installed dependency?** Use it. Don't add a dependency for a few lines.
5. **One clear line?** Write one line.
6. **Otherwise** write the minimum code that works.

## Rules

- No abstraction, wrapper, config option or "for later" code nobody asked for.
- Keep the structure the codebase already has.
- Fix a bug at its root, once, in the shared code. Find every caller first.
- Code you move keeps its validation and error handling.
- Between two options of equal size, take the one that handles edge cases correctly.
- Non-trivial new logic (a parser, money, security, a new branch) leaves one test behind.
- A known shortcut gets a comment: `shortcut: <the limit>, <when to revisit>`.

## Never cut

Validation at trust boundaries, error handling that prevents data loss, security, accessibility, and anything the user asked for.

## Finish

End with one or two lines: what you skipped or did not check, and any risk the user should know.

Adapted from DietrichGebert/ponytail `ponytail` (MIT) and juliusbrussee/caveman `lean-build` (Apache-2.0). Merged and rewritten for AIO-AGENT.

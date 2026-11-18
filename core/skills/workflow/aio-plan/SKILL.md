---
name: aio-plan
description: Write a step-by-step implementation plan from an agreed design, with small tasks that each name their files, test and verification command. Use after a design is approved and before writing code for any multi-step change.
---

# Write a plan

A plan lets someone with no context build the feature one small, verifiable task at a time.

## Before writing

- Confirm the design is approved. If not, load `aio-brainstorm`.
- Read the code the plan touches. Use real file paths, function names and commands from this repository.
- If the work spans independent subsystems, write one plan per subsystem.

## Plan header

```markdown
# <Feature> implementation plan

Goal: <one sentence>
Design: <link to the approved design>
Constraints: <test command, style rules, things not to touch>
```

## Tasks

Each task is one commit-sized change, typically 2 to 15 minutes of work:

```markdown
### Task N: <what changes>

Files: <paths created or modified>
Test: <the failing test to write first, with its path>
Steps:
1. Write the test. Run `<command>`; expect it to fail with <reason>.
2. Implement <specific change>.
3. Run `<command>`; expect it to pass.
4. Commit: `<type>: <message>`.
```

Order tasks so each one leaves the code working. Put the riskiest unknown first.

## Self-review

Before handing over, check that:

- every requirement in the design maps to a task;
- no task says "add error handling" or "write tests" without saying which and where;
- every command can be run as written.

Save the plan next to the design, then ask whether to start. Starting means loading `aio-execute`.

Adapted from obra/superpowers `writing-plans` (MIT). Rewritten and shortened for AIO-AGENT.

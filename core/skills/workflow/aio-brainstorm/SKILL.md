---
name: aio-brainstorm
description: Turn a feature idea into an agreed design before writing code. Use when the user asks for a new feature, component or behaviour and something that changes what gets built is still open. Skip for fully specified small changes.
---

# Brainstorm

Agree on what to build before building it. The output is a short written design the user has approved.

## 1. Decide whether to brainstorm

- Everything that matters is in the request ("make the button cornflower blue"): do it and say what you did. Stop here.
- Something that would change what gets built is missing: continue.

## 2. Look before you ask

Read what the user pointed at and the code it touches until you can explain how the relevant part works today and what the change would affect. Never ask a question the code, the docs or the conversation already answers.

## 3. First message

Keep it under about 200 words:

1. Restate the request in your own words: what, for whom, and why, as far as you know.
2. Add what you found that bears on it: a constraint, a conflict, a cheaper path.
3. Ask the one question whose answer would change the design most. If the choices can be named, list them with their trade-off and say which you would pick.

If nothing important is open, skip the question: give the approach, one line on why the alternatives don't fit, and the design in a few lines, then ask for approval.

## 4. Converge

- One question per message. Prefer questions with concrete options.
- When the user's answer settles a branch, don't reopen it.
- Lay out two or three approaches only when they differ in something the user cares about (cost, risk, scope).

## 5. Write the design

Size it to the work:

- **Small** (one component, under a day): a paragraph plus a list of files that change.
- **Larger**: goal, non-goals, approach, data and interfaces, error cases, testing approach, open risks.

Save it where the project keeps design docs (`docs/`, `docs/design/`), or in the conversation if the project has none. Ask for approval. Once approved, load `aio-plan`.

## Red flags

- Writing code before the user approved the design.
- Asking several questions in one message.
- A design that adds options or extension points nobody asked for. See `aio-lean`.

Adapted from obra/superpowers `brainstorming` (MIT). Rewritten and shortened for AIO-AGENT.

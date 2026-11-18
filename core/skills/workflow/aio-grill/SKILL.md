---
name: aio-grill
description: Stress-test a plan, design or decision by interviewing the user round by round, and record settled terms and decisions in GLOSSARY.md and ADRs. Use when the user asks to grill, challenge or poke holes in a plan they already have.
---

# Grill a plan

Interview the user until every decision the plan depends on is settled. You find facts; the user makes decisions.

## The decision tree

Map the plan as a tree: each decision branches into the decisions that depend on it. The **frontier** is every open decision whose prerequisites are settled.

## Rounds

Each round, ask the whole frontier at once, numbered, each with your recommended answer:

```text
Q1. <title>: <question, with the options if they can be named>
Recommended: <your answer, and why in one line>
```

Word each question so that "yes" accepts your recommendation. A question that depends on another open question in the same round waits for the next round. After the user answers, recompute the frontier and ask the next round.

## Facts are your job

If a question needs a fact from the codebase, the docs or the environment, look it up instead of asking. Ask only for decisions.

## Keep the domain model current

- When the user uses a term that conflicts with `GLOSSARY.md`, say so at once: "The glossary defines X as ..., you seem to mean ... . Which is it?"
- When a vague term comes up, propose one precise term.
- When a term is settled, add it to `GLOSSARY.md` right away: the term, a one-sentence definition, and terms to avoid. No implementation details.
- Offer an ADR in `docs/adr/NNNN-<slug>.md` only when a decision is hard to reverse, surprising without context, and the result of a real trade-off. An ADR has: context, decision, consequences.
- Create these files only when there is something to write in them.

## Done

The session ends when the frontier is empty. Summarize the settled decisions and wait for the user to confirm before acting on them.

Adapted from mattpocock/skills `grill-with-docs`, `grilling` and `domain-modeling` (MIT). Merged and rewritten for AIO-AGENT.

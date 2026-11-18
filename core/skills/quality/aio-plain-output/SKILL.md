---
name: aio-plain-output
description: Write documentation, READMEs, commit messages, UI copy and code comments in plain, specific language without filler, hype or decorative formatting. Use whenever writing or editing prose or comments.
---

# Plain output

Write like a careful engineer explaining something to a colleague: specific, short, true.

## Words to cut

- Hype: *seamless, robust, powerful, cutting-edge, blazingly fast, supercharge, unleash, elevate, unlock, empower, delve, game-changer, next-level*.
- Inflation: *crucial, pivotal, vital, a testament to*. Say what the thing does instead.
- Filler: *in order to* (to), *it is worth noting that* (cut), *basically, simply, just, actually, really*.
- Hedging stacks: *could potentially possibly*. Pick one level of certainty and back it.

## Patterns to cut

- Openers that announce: "In this guide, we will...", "Let's dive in". Start with the content.
- Closers that recap or cheer: "In summary...", "Happy coding!". Stop when done.
- Lists of three by reflex. Use the number of items there are.
- "Not just X, but Y" and other set phrases.
- Claims without evidence: "trusted by thousands", "10x faster". Give the number and its source, or drop it.
- Invented specifics. If you don't know a figure, a path or a flag, find out or say it is unknown.

## Formatting

- No emoji in headings. Bold only for the one thing a reader must not miss.
- Sentence case headings.
- Use a table when comparing items along the same attributes; otherwise use prose or a list.

## Code comments

Write a comment only when it explains *why*: a constraint, a workaround, a non-obvious decision. Delete comments that:

- restate the code (`// increment counter`);
- narrate the change (`// added this to fix the bug`);
- are decorative separators or section banners;
- echo the function signature;
- say `TODO` without saying what and why.

Never change code while cleaning comments.

## Commit messages

`type: summary` in the imperative, under 72 characters. The body, if any, says why the change was made.

Adapted from miqdadbadjuber/anti-slop `antislop-copywriting` and `antislop-code` (MIT). Merged and rewritten for AIO-AGENT.

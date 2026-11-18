---
name: aio-review
description: Review a code change for correctness, safety, tests and unnecessary code, or evaluate review feedback before acting on it. Use when asked to review a diff, commit or pull request, before merging, and when receiving review comments.
---

# Review

## Reviewing a change

Read the diff and the code it connects to: callers, tests, config. A diff alone hides most bugs.

Check in this order and stop to report anything serious:

1. **Correctness.** Does it do what the task asked? Trace edge cases: empty input, null, concurrent calls, errors from dependencies.
2. **Safety.** Input validated at trust boundaries? Secrets kept out of code and logs? Data loss possible? For a full security pass, load `aio-security-review`.
3. **Load.** What happens at 10x the data or traffic? Unbounded loops, queries in loops, missing pagination or timeouts.
4. **Tests.** Is each new branch of risky logic covered? Would the tests fail if the code were wrong?
5. **Size.** Can anything be deleted, reused from the codebase or replaced by the standard library? See `aio-lean`.

Report each finding as: file and line, what is wrong, a concrete input that triggers it, and the fix. Rank by severity. Say plainly when you found nothing serious. Don't pad the review with style nits the project's linters already catch.

## Receiving review feedback

1. Read every comment before changing anything.
2. For each one, check it against the code. Reviewers can be wrong, or lack context.
3. If a comment is unclear, ask before implementing it.
4. If you disagree, say why, with evidence from the code or a test.
5. Fix the confirmed points one at a time and run the tests after each.

Don't agree performatively ("Great catch!") and don't implement a suggestion you haven't verified.

Adapted from obra/superpowers `requesting-code-review` and `receiving-code-review` (MIT) and DietrichGebert/ponytail `ponytail-review` (MIT). Merged and rewritten for AIO-AGENT.

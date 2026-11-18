---
name: aio-verify
description: Run the command that proves a claim before saying work is done, fixed, passing or ready. Use before every completion claim, commit, pull request or hand-off.
---

# Verify before claiming

A claim without fresh output is a guess.

## The gate

Before saying anything is done, fixed or passing:

1. **Identify** the command that proves the claim.
2. **Run** it in full, now. Not an earlier run, not a subset.
3. **Read** the whole output: exit code, failure count, warnings.
4. **Report** what the output shows. If it contradicts the claim, report the actual state.

## What proves what

| Claim | Proof | Not proof |
| --- | --- | --- |
| Tests pass | Test command output with 0 failures | An earlier run; "should pass" |
| Lint is clean | Linter output with 0 errors | The build passing |
| Build works | Build command exits 0 | Lint passing |
| Bug is fixed | The original reproduction now behaves correctly | The code changed |
| Regression test works | It failed before the fix and passes after | It passes once |
| A sub-agent finished | The diff shows the change | The sub-agent says so |
| Requirements met | Each requirement checked against the result | Tests passing |

## Report format

State the command and the result in one line each: "`npm test`: 142 passed, 0 failed." If something could not be checked, name it and say why.

## Red flags

- Words like "should", "probably", "seems to" next to a status.
- Saying "done" before running anything.
- Trusting a tool's or agent's success message without checking its output.

Adapted from obra/superpowers `verification-before-completion` (MIT). Rewritten for AIO-AGENT.

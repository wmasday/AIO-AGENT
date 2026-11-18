---
name: aio-debug
description: Find the root cause of a bug, failing test or unexpected behaviour before proposing any fix. Use for any defect, test failure, crash, flaky behaviour or performance regression.
---

# Debug

No fix without a root cause. A fix for a symptom you don't understand is a guess.

## 1. Reproduce

- Get the exact error message, stack trace and the steps or input that trigger it.
- Reproduce it yourself. If you can't, gather more data (logs, versions, environment) before going further.
- Check what changed recently: `git log`, `git diff`, dependency updates, config.

## 2. Trace

- Read the error and the stack trace fully. Note the file and line.
- Follow the bad value backwards through the call chain to where it was first wrong.
- In a multi-component system (client, API, database, queue), log or inspect at each boundary to find which component first produces the wrong output.

## 3. Compare

- Find similar code in the same codebase that works. List every difference.
- Read the reference implementation or documentation completely, not a skim.

## 4. Hypothesize and test

- State one hypothesis: "X is the cause because Y."
- Test it with the smallest possible change or probe. One variable at a time.
- Wrong? Form a new hypothesis. Don't stack fixes.

## 5. Fix

1. Write a test that fails because of the bug (see `aio-tdd`).
2. Fix the root cause, in one place.
3. Run the test and the surrounding suite.

If three fixes in a row have failed, stop. The problem is likely the design, not the code. Tell the user what you tried and what you learned.

## Red flags

- "Quick fix for now, investigate later."
- Changing several things at once to see what happens.
- Proposing a fix before you can explain the failure.

Adapted from obra/superpowers `systematic-debugging` (MIT). Rewritten and shortened for AIO-AGENT.

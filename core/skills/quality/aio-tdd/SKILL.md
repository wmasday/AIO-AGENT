---
name: aio-tdd
description: Test-driven development (red, green, refactor). Use when writing or changing production code for a feature or bug fix, before writing the implementation. Suspended only in /prototype mode.
---

# Test-driven development

Write the test first. Watch it fail. Write the least code that makes it pass. Then clean up.

## Red

- Write one test for one behaviour. Name it after the behaviour: `rejects an expired token`, not `test1`.
- Test real code. Use a mock only for something you cannot run in a test (network, clock, payment provider).
- Run it. It must fail, and fail for the reason you expect: the behaviour is missing, not a typo or an import error. A test that passes at once proves nothing; fix the test.

## Green

- Write the simplest code that makes the test pass. No extra options, no code for the next test.
- Run the test and the tests around it. All must pass, with no new warnings.

## Refactor

- Remove duplication, improve names, extract helpers, only while every test stays green.
- Don't add behaviour while refactoring.

Repeat for the next behaviour.

## Code written before its test

If you wrote implementation code before a failing test, set it aside and start from the test. Code written first tends to shape the test into a description of the code instead of the requirement.

## Bug fixes

1. Write a test that reproduces the bug. Watch it fail.
2. Fix the bug. Watch the test pass.
3. Keep the test as a regression test.

## When a test is hard to write

That is design feedback: the code has too many dependencies or does too much. Simplify the interface rather than mocking around it.

## Checklist

- [ ] Every new function or branch has a test that failed before the code existed.
- [ ] Each test failed for the expected reason.
- [ ] Tests cover the edge cases: empty input, boundaries, errors.
- [ ] The full suite passes, and you ran it, not assumed it.

Adapted from obra/superpowers `test-driven-development` (MIT). Rewritten and shortened for AIO-AGENT.

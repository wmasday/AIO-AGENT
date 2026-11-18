---
name: aio-execute
description: Carry out a written implementation plan one task at a time, verifying each task before the next and stopping on blockers. Use when a plan exists and the user says to build it.
---

# Execute a plan

## Setup

1. Read the whole plan. Raise anything unclear or contradictory before starting.
2. Check the working tree is clean and you are on a branch that is not the default branch, unless the user said otherwise.
3. Run the test suite once to know the baseline. Note failures that existed before you started.

## Task loop

For each task, in order:

1. Do exactly the steps it lists, following `aio-tdd`.
2. Run the task's verification command and read the output.
3. Commit with the message the plan gives.
4. Mark the task done in the plan file.

## Stop and ask when

- a step fails and the cause is not in your change;
- the plan is wrong (a file does not exist, an API behaves differently than the plan assumes);
- finishing the task would need a change outside its listed files.

Report what you found and propose a plan change. Do not improvise around a blocker.

## Finish

After the last task, run the full test suite and any linters the project uses, then load `aio-verify` and report: tasks done, commits, test results, and anything you deferred.

Adapted from obra/superpowers `executing-plans` (MIT). Rewritten and shortened for AIO-AGENT.

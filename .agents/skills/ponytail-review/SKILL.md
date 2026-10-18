---
name: ponytail-review
description: >
  Quality review of a change: is the logic right, is it safe, does it hold
  under real load, is risky code tested, is it fast enough, and is every line
  needed. Reads the connected code, not only the diff. Each finding is
  explained in plain English. Use for "review this", "code review", "review
  the last commit", "review my PR", "is this over-engineered", /ponytail-review.
license: MIT
---

# Ponytail Review

Review a change like the senior developer who will be paged when it breaks.
Order of importance: correct, safe, holds under load, tested, fast, lean.
Lean still matters: every extra line must be read, tested and fixed later.
This is a report the user asked for, so give it in full.

## 1. Understand first

- Review what the user names: uncommitted or staged changes, a branch, a PR
  link, or files. If nothing is named: the uncommitted changes, or the last commit
  if there are none.
- Read the diff, then the code it touches: callers of every changed function,
  the functions it calls, the tests, the README.
- Trace the real flow: where data comes in, what is stored, what goes out.
- A change can break code it does not touch. When a signature, return value
  or behavior changes, check every caller.
- Find the expected load in the repo (README, deploy config) and judge scale against that.

## 2. Look for

1. **Bug:** wrong result, crash, missed edge cases (empty, zero, last item, rounding, time zones), a caller broken by the change.
2. **Risk:** security holes (injection, weak randomness, secrets, missing validation on user input), data loss (swallowed errors, out-of-order writes, missing transactions).
3. **Scale:** fine for one user, wrong for many: check-then-write races, duplicate work across processes, unbounded lists, N+1 queries, O(n^2) on large inputs.
4. **Missing test:** risky new logic (branches, parsers, money/payments, auth/security, data writes, bug fixes) with no test verifying failure cases.
5. **Speed:** critical path bottlenecks or expensive recomputation in hot paths.
6. **Lean:** code that should not exist or should be smaller:
   - `delete:` dead code, unused flags, speculative features.
   - `reuse:` duplicate helpers or components that already exist in the repo.
   - `stdlib / native:` platform features or standard library utilities that make dependencies or boilerplate redundant.
   - `yagni:` abstractions without multiple callers.
   - `shrink:` unnecessarily verbose code that can be written in fewer, clearer lines.

## 3. Report format

Format each finding:
`<tag> <what to cut or fix>. <replacement or resolution>. [path/lines]`

Conclude with net impact:
`net: -X lines, -Y deps possible` or `Lean already. Ship.`

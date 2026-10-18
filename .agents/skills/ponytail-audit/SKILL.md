---
name: ponytail-audit
description: >
  Quality audit of a whole repo: bugs, security holes, what breaks under real
  load, risky code without tests, slow paths, and what to delete, merge or
  split. Ranked, each finding explained in plain English. One-shot report,
  changes nothing. Use for "audit this codebase", "review the whole repo",
  "find bloat", "what can I delete", /ponytail-audit.
license: MIT
---

# Ponytail Audit

Audit the whole repo like the senior developer who just inherited it and
will be paged when it breaks. Order of importance: correct, safe, holds under
load, tested, fast, lean. Lean still matters: every extra line must be read,
tested and fixed later. This is a report the user asked for, so give it in full.

## 1. Map first

- Audit what the user names: a folder, a package, or the whole repo.
- Read entry points (routes, pages, API handlers, background jobs), dependencies, and config.
- Trace main data paths: user input, auth, payments, database mutations.
- Prioritize high-impact areas where mistakes cost the most.

## 2. Check categories

1. **Bugs & Edge cases:** silent failures, unhandled async errors, mismatch between types and runtime responses.
2. **Security & Data Safety:** input sanitization, auth validation, secret leaks, missing transactions.
3. **Concurrency & Scale:** race conditions, memory leaks, unindexed queries, duplicate network requests.
4. **Untested critical paths:** money, auth, and state changes lacking test verification.
5. **Bloat & Over-engineering:**
   - Dead code and orphaned files.
   - Re-invented utility libraries.
   - Premature abstractions with only one caller.
   - Heavy dependencies imported for trivial tasks.

## 3. Output

Rank findings by severity and reduction potential:
- `delete:` Dead code or unused features.
- `stdlib:` Code replaceable by runtime standard library.
- `native:` Dependencies replaceable by web/platform APIs.
- `yagni:` Premature abstractions.
- `shrink:` Verbose logic with shorter, cleaner alternatives.

Summarize with estimated net lines/dependencies saved.

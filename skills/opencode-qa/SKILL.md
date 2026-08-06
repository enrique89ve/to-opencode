---
name: opencode-qa
description: Review an existing OpenCode run's ledger, errors, claims, diff, tests, and verdict.
---

# OpenCode QA

Treat OpenCode as a colleague, not an authority.

## Steps

1. **Exit and errors.** Record the exit status. Keep stderr available; enable `--print-logs` when diagnosis needs internal logs.
2. **Ledger.** For JSONL output, aggregate every `step_finish` event, not only the final one:

   ```sh
   QA_SKILL_DIR="/path/to/installed/opencode-qa"
   node "$QA_SKILL_DIR/scripts/summarize-jsonl.mjs" < "$RUN_LOG"
   ```

   Sum per-step cost and token fields. Without JSONL, use the resolved OpenCode binary's `stats --models` command and label the result as session-level rather than run-exact.
3. **Claims.** Verify important claims against current documentation, source, or direct evidence. Label anything unchecked.
4. **Changes.** Inspect `git status --short` and `git diff` in the OpenCode execution location. For isolated mode, also verify the active worktree did not change.
5. **Verification.** Run the repository's relevant tests, linter, typecheck, and build against the isolated diff before promotion.
6. **Scope.** Reject changes outside the user's authorized files or behavior. Never promote ignored files, credentials, or generated secrets.
7. **Privacy.** If a free model handled confidential or proprietary input without explicit approval, fail the gate and tell the user.
8. **Cross-audit.** Do not delegate automatically. Use another agent only after an explicit user request, with permission and read-only access.
9. **Verdict.** Return `pass`, `fail`, or `needs-user`, backed by concrete evidence and limitations.

## Completion criterion

The verdict includes exit evidence, an aggregated ledger or explicit absence, checked claims, reviewed changes, verification results, and unresolved limitations.

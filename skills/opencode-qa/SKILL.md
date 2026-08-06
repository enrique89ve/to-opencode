---
name: opencode-qa
description: Quality-check an opencode run before it enters the conversation — exit status, token and cost ledger, claims check, work verification. The gate of the to-opencode family. Use after any opencode run, or when the user doubts opencode's output. User-invoked.
disable-model-invocation: true
---

# OpenCode QA

The gate. opencode is a colleague, not an authority — treat its output the same way. Check it before you trust it.

## Steps

1. **Ledger.** When the run used `--format json`, read the `step_finish` event: tokens and cost, in the open. No ledger? `opencode stats --models` shows usage and cost per model. Report both in one line.
2. **Exit and stderr.** Exit 0 is not proof of a good run. Re-run with stderr visible (`--print-logs`, no `2>/dev/null`) when anything looks off.
3. **Claims check.** Verify what opencode claims — against your own knowledge, the docs, or the code itself. Knowledge cutoffs are real: recent APIs and versions get hallucinated. Push back with evidence; say where you disagree.
4. **Work check.** If opencode touched files, verify the work: run the repo's tests and linter, inspect the diff. Only then does the output enter the conversation.
5. **Verdict.** Pass, fail, or needs-user — each backed by at least one piece of evidence.

## Completion criterion

A verdict with evidence, and every opencode claim that matters has been checked or flagged as unchecked.

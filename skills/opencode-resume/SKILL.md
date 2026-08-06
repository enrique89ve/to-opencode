---
name: opencode-resume
description: Continue an opencode session — the last one (-c) or a specific one (-s, --fork). Use when the user wants to keep working with an earlier opencode run, or says "continue the opencode session". Part of the to-opencode family. User-invoked.
disable-model-invocation: true
---

# OpenCode Resume

Continue an opencode session. The context carries over — model, variant, history.

## Prerequisite

Check `opencode --version`. Missing? Ask permission, then install:

curl -fsSL https://opencode.ai/install | bash

Re-check before continuing.

## Steps

1. **Last session or a specific one?**
   - Last: `opencode run -c "<prompt>"`.
   - Specific: `opencode session list` to find the id, then `opencode run -s <id> "<prompt>"`.
2. **Fork when the original must not change:** add `--fork`. The original stays untouched; you continue a copy.
3. **Override when needed.** Resume inherits the session's model and variant; pass `-m` or `--variant` to override. Use the same stdin/stderr hygiene as `opencode-invoke`: `</dev/null 2>/dev/null`.
4. **Summarize the answer** in a few lines.

## Completion criterion

The session continued and the answer is summarized — or the session couldn't be found, and you said so.

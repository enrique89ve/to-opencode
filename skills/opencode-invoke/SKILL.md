---
name: opencode-invoke
description: Run opencode headless with a prompt — the workhorse fragment of the to-opencode family. Use when the user wants opencode to do analysis, refactoring, or edits, or asks to run a prompt through opencode. User-invoked.
disable-model-invocation: true
---

# OpenCode Invoke

Run opencode headless. You coordinate; it executes.

## Prerequisite

Check `opencode --version`. Missing? Ask permission, then install:

curl -fsSL https://opencode.ai/install | bash

Re-check before continuing. No opencode, no run.

## Steps

1. **Ask model and variant in one question** — unless the user already specified both. Defaults: model `opencode-go/deepseek-v4-flash` (the favorite), variant `high`. Escalate to `opencode-go/deepseek-v4-pro` for hard problems; downgrade to `opencode/deepseek-v4-flash-free` for throwaway checks. Skip the question entirely when the user has no opinion — run the default.
2. **Flag the dangerous flag.** `--auto` auto-approves permissions. Never use it without explicit permission.
3. **Assemble the command:**

   opencode run -m <model> [--variant <effort>] [--dir <dir>] [-f <file>] "<prompt>" </dev/null 2>/dev/null

   - `</dev/null` closes stdin. opencode reads stdin when it's a TTY; in a harness where stdin is open but not a terminal, an unclosed stdin can hang it.
   - `2>/dev/null` keeps logs out of the conversation. Drop it (or add `--print-logs`) when debugging.
4. **Run it. Expect streaming output, not a wall at the end.** Set a generous timeout: 600s for `high`, up to 1800s for `max` on big tasks.
5. **Summarize the outcome** in a few lines. Then tell the user: "You can continue this opencode session later — say 'continue the opencode session'."

## Completion criterion

Exit 0 and the result is summarized. Non-zero? Report the failure and ask direction — never silently retry.

## Reference

| Need | Flag |
| --- | --- |
| Model | `-m provider/model` |
| Reasoning effort | `--variant high` |
| Run in another directory | `--dir <dir>` |
| Attach files | `-f <file>` |
| Machine-readable ledger | `--format json` (NDJSON; `step_finish` carries tokens and cost) |
| Show thinking | `--thinking` |
| Auto-approve (dangerous) | `--auto` |

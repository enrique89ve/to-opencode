---
name: to-opencode
description: Use when the user wants to delegate work to opencode via CLI — run a prompt headless (opencode run), check which opencode models are available (opencode models), continue an opencode session, or quality-check opencode's output. Also when another skill must hand a task to opencode. Trigger words: opencode, opencode go, deepseek v4 flash, to-opencode.
---

# To OpenCode

opencode is a workhorse: headless, scriptable, and good at one job — taking a prompt and doing it. You coordinate; it executes.

Pick the fragment that fits, then invoke it by name.

- **`opencode-invoke`** — the workhorse. Run a prompt headless with `opencode run`. Every fresh task starts here: analysis, refactoring, edits.
- **`opencode-models`** — the catalog. Lists everything opencode can run, grouped by provider, with exact ids. Consult before choosing a model, or any time the user asks what opencode has.
- **`opencode-resume`** — the continuation. Picks up the last session (`-c`) or a specific one (`-s`); fork when the original must not change.
- **`opencode-qa`** — the gate. Verifies opencode's output critically before it enters the conversation: exit status, token and cost ledger, claims check. You audit by default; cross-audit via the other agent's CLI when the user asks.
- **`opencode-visual`** — the interpreter. opencode's workhorses can't see; when the task involves screenshots or UI, this fragment turns the capture into text the model can act on.

## The default

`opencode-go/deepseek-v4-flash` — the favorite. Fast, cheap, good enough for most work.

- Escalate to `opencode-go/deepseek-v4-pro` for genuinely harder problems.
- Downgrade to `opencode/deepseek-v4-flash-free` for throwaway checks.

## Prerequisite

opencode must be installed. Check with `opencode --version`. Missing? Ask permission, then install:

curl -fsSL https://opencode.ai/install | bash

Then re-check. No opencode, no delegation — stop and tell the user.

## Completion criterion

The right fragment is running, or you told the user why none fits.

---
name: to-opencode
description: "Route an OpenCode request to exactly one fragment: fresh run, model catalog, session resume, QA, or visual translation."
---

# To OpenCode

Route the request to one fragment:

- **`opencode-invoke`** — execute a fresh task with `opencode run` and the `build` agent.
- **`opencode-models`** — inspect the live catalog, metadata, variants, vision, and auth readiness.
- **`opencode-resume`** — continue the last or an exact session; fork session history when needed.
- **`opencode-qa`** — verify the ledger, claims, file diff, tests, and limitations.
- **`opencode-visual`** — translate a capture to text only when the chosen model lacks vision.

## Routing invariant

The selected fragment owns its prerequisite and safety checks. Do not load `opencode-invoke` and `opencode-resume` for one request; `opencode-qa` is the single terminal post-run gate. Preserve safe prompt transport, `build` for edits, and detached-worktree limits from the selected fragment.

## Completion criterion

The correct fragment completed, or the user received the exact blocking prerequisite and no unsafe fallback ran.

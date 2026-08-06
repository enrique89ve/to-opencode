---
name: opencode-models
description: Inspect OpenCode's live model catalog for exact IDs, variants, auth, cost, and vision capability.
---

# OpenCode Models

Treat the installed CLI's catalog as the source of truth; model lists change frequently.

## Prerequisite

Resolve `OPENCODE_BIN` from an explicit executable, `command -v opencode`, or the official user install directories; verify it with `"$OPENCODE_BIN" --version` and quote it thereafter.

If no candidate is accessible inside the current environment, stop and ask the user to expose the absolute path. Do not search the whole filesystem, execute an unverified match, or install without approval.

## Steps

1. Keep the inherited user home, environment, stored authentication, and configuration. Do not replace `HOME`/`XDG_*`, copy credentials, or request login preemptively.
2. Run `"$OPENCODE_BIN" models`; add `--refresh` when the cache may be stale.
3. Filter by provider with `"$OPENCODE_BIN" models <provider>`.
4. For metadata, run `"$OPENCODE_BIN" models --verbose <provider>` and locate the selected model's JSON block. The positional argument is a provider ID, not `provider/model`.
5. Verify the exact model ID, `status`, `cost`, context/output limits, `variants`, and `capabilities.input.image`.
6. If model discovery returns an authentication failure, inspect `"$OPENCODE_BIN" auth list`. Never expose credential values.
7. Present only models relevant to the task, grouped by provider. Copy IDs verbatim.

Model policy:

- `opencode-go/deepseek-v4-flash` — OpenCode Go; favorite and default.
- `opencode-go/deepseek-v4-pro` — OpenCode Go; explicit harder-work choice.
- `opencode/deepseek-v4-flash-free` — explicit no-cost choice, never an automatic fallback.

If authentication fails and OpenCode Go has no usable local credentials, stop and tell the user to run `opencode auth login -p opencode-go`. If credentials exist but the favorite is absent, refresh once and report it; never silently switch models.

Free OpenCode models may retain submitted data for improvement. Flag that limitation and require approval before using confidential or proprietary inputs. Check the current OpenCode Go privacy table rather than hardcoding retention claims.

## Completion criterion

Every reported model is an exact live-catalog ID with auth, variant, vision, cost, and privacy unknowns labeled rather than guessed.

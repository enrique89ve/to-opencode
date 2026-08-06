---
name: opencode-visual
description: Translate a capture for an OpenCode model confirmed to lack image input.
---

# OpenCode Visual

Translate only when the selected model cannot consume the capture directly.

## Prerequisite

Use the resolved `OPENCODE_BIN` (explicit path, `PATH`, or official user install directory) and verify it with `"$OPENCODE_BIN" --version` before querying metadata.

## Steps

1. Run `"$OPENCODE_BIN" models --verbose <provider>` and locate the selected model's `capabilities.input.image` value. Do not pass a full `provider/model` ID as the positional filter.
2. If image input is supported, attach the capture directly and stop using this fragment.
3. Confirm the capture can be read and contains no material the chosen provider is unauthorized to receive. Free models may retain submitted data.
4. Read the capture with the host agent's vision capability. Use another CLI only with permission and argument-safe input.
5. Describe only task-relevant facts: layout, elements, exact visible text, coordinates or hierarchy, colors, states, and defects. Separate observation from inference.
6. Return the source identity and description to the caller through safe prompt transport. The caller decides whether to invoke OpenCode; do not call `opencode-invoke` from this fragment.

## Completion criterion

OpenCode receives an accurate, privacy-approved text description when the selected model lacks vision, or the unsupported/missing capture is reported.

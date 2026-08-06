---
name: opencode-models
description: List the models opencode can run and name the exact ids. Use when the user asks what models opencode has available, wants to see opencode models, or needs to pick a model for opencode. Part of the to-opencode family. User-invoked.
disable-model-invocation: true
---

# OpenCode Models

The catalog. One command shows everything opencode can run.

## Prerequisite

Check `opencode --version`. Missing? Ask permission, then install:

curl -fsSL https://opencode.ai/install | bash

Re-check before continuing.

## Steps

1. **List the catalog:** `opencode models` — every model as `provider/model`. Scope it: `opencode models <provider>` filters one provider. If the list looks stale, `opencode models --refresh` re-pulls it from models.dev.
2. **Present it grouped by provider**, in a few lines. Flag the favorites:
   - `opencode-go/deepseek-v4-flash` — the favorite; default for everything.
   - `opencode-go/deepseek-v4-pro` — escalate for hard problems.
   - `opencode/deepseek-v4-flash-free` — free; throwaway checks.
3. **Name the exact id** the user should use — `provider/model`, verbatim, copy-paste ready. That id feeds straight into `opencode run -m`.

## Completion criterion

Every provider the user asked about is listed, and the chosen model is an exact `provider/model` id.

## Auth note

A model that errors with auth problems means credentials are missing: `opencode auth list` to check, `opencode auth login -p <provider>` to fix.

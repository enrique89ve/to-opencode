---
name: opencode-visual
description: Translate visual captures into text for opencode models that can't see. Use when the task involves screenshots, UI, or images and the opencode model lacks vision. Part of the to-opencode family. User-invoked.
disable-model-invocation: true
---

# OpenCode Visual

DeepSeek can't see. You translate.

opencode's workhorses — `opencode-go/deepseek-v4-flash`, `opencode-go/deepseek-v4-pro` — run with `image: false`. A screenshot fed to them is nothing. Your job: read the capture, turn it into precise text, hand that text to opencode.

## When to use

The task involves a visual capture — screenshot, UI, design — and the opencode model lacks vision. Check it when unsure:

opencode models --verbose <provider/model>

`capabilities.input.image` says true or false.

## Steps

1. **Check the model's vision.** `opencode models --verbose <provider/model>` — find `capabilities.input.image`. Vision present? The model takes the capture directly; this skill is not needed.
2. **Confirm the capture exists** — a path on disk or a URL you can read.
3. **Read it with a vision agent.** You — the agent running this — can see. Read the capture directly. Can't (no vision this session, or the user wants the other agent)? Delegate via its CLI, with permission, only if installed:
   - From Codex: `claude -p "Describe this image precisely: <path>"`
   - From Claude: `codex exec --skip-git-repo-check "Describe this image precisely: <path>" </dev/null 2>/dev/null`
4. **Translate into a description opencode can act on**: layout, elements, text, coordinates, colors, visual defects — everything that matters for the task. No interpretation, no opinion; the description is the contract.
5. **Feed the text into the opencode run** (`opencode-invoke`), not the image. State the source capture and the translated description in the prompt.

## Completion criterion

The capture is a text description the opencode model can act on without seeing the original — or you told the user the capture can't be read.

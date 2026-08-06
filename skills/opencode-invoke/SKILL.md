---
name: opencode-invoke
description: Execute a fresh OpenCode CLI build task for analysis, refactoring, commands, or file edits.
---

# OpenCode Invoke

Execute with OpenCode; keep coordination and verification in the host agent.

## Prerequisite

Resolve the executable in this order: an absolute executable `OPENCODE_BIN`, `command -v opencode`, then `$OPENCODE_INSTALL_DIR/opencode`, `$XDG_BIN_DIR/opencode`, `$HOME/bin/opencode`, and `$HOME/.opencode/bin/opencode`. Accept only an executable file, canonicalize its absolute path when supported, and verify it with `"$OPENCODE_BIN" --version`. Use that quoted path for every invocation.

Never search the whole filesystem or execute an unverified match. If no candidate is accessible inside the current environment, stop, link the official installation documentation, and ask the user to expose the absolute path or approve installation. A binary that exists only on an unmounted host cannot run inside a container.

## Steps

1. **Reuse the local runtime.** Inherit the host process's environment, user home, OpenCode authentication, configuration, and plugins. Do not replace `HOME` or `XDG_*`, export or copy credentials, or request login before trying the existing local session.
2. **Choose a real model.** Set `MODEL` and `PROVIDER` from the selected `provider/model` ID. If the user specified an exact ID, validate it; if it is absent, report it and stop. If no model was specified, use `opencode-go/deepseek-v4-flash`.
3. **Verify without prompting.** Run `"$OPENCODE_BIN" models "$PROVIDER"` for the selected provider. On an authentication failure, inspect `"$OPENCODE_BIN" auth list` and tell the user to run `opencode auth login -p "$PROVIDER"`; for OpenCode Go this is `opencode auth login -p opencode-go`. If credentials exist but the model is absent, refresh once and report it. Never switch models silently.
4. **Protect sensitive data.** Use `opencode-go/deepseek-v4-pro` or `opencode/deepseek-v4-flash-free` only when explicitly selected. Free models may retain submitted data; obtain approval before sending confidential or proprietary material. Re-check current OpenCode Go privacy terms when confidentiality matters.
5. **Validate the variant.** Run `"$OPENCODE_BIN" models --verbose "$PROVIDER"` and inspect the selected model's `variants` object. Use `high` when present; otherwise omit `--variant`.
6. **Select the execution location.**
   - Edit or command task: default to a detached worktree created from the intended revision, and record its path:

     ```sh
     RUN_PARENT="$(mktemp -d)"
     RUN_DIR="$RUN_PARENT/worktree"
     git worktree add --detach "$RUN_DIR" HEAD
     ```

   - Active worktree: use only when the user explicitly requests direct execution.
   - If uncommitted work is required, copy only the task-relevant changes into the detached worktree. Never copy ignored secrets.
7. **Load project context.** Point `--dir` at the chosen worktree. OpenCode loads its `AGENTS.md` or `CLAUDE.md` plus `instructions` from `opencode.json`. Put additional ticket, architecture, or standards paths in the prompt explicitly.
8. **Use `build`.** The isolated mode still executes with `--agent build`; do not substitute `plan`.
9. **Transport the prompt safely.** Use the host tool's argument interface, or write the exact prompt with a file-writing tool to a mode-`0600` temporary file. Never interpolate prompt text into shell syntax.
10. **Run:**

   ```sh
   "$OPENCODE_BIN" run --agent build -m "$MODEL" --variant high \
     --dir "$RUN_DIR" --format json < "$PROMPT_FILE"
   ```

   Omit `--variant high` when unsupported. Use `--pure` only when the user explicitly requests a plugin-free OpenCode run; it is not the default because it changes the user's local runtime. Do not discard stderr. Do not use `--auto` without explicit approval; it is not a sandbox.
11. **Hand off once.** Return the ledger, exit status, and execution location to the host. For edits or an explicit quality request, the host runs `opencode-qa` once, inspects the isolated diff, and promotes only authorized changes. Do not re-enter `opencode-invoke` from QA.
12. **Report** the model, variant, session ID, execution location, exit status, ledger, verification, and any unpromoted diff.

## Isolation limit

A detached worktree protects the active checkout from file edits. It does not isolate the host filesystem, network, processes, or credentials. Use an actual host sandbox or container when those resources must be isolated.

## Completion criterion

OpenCode exited successfully and the result was handed off with evidence; for edits or an explicit quality request, QA also passed. Otherwise report the exact failure without silently retrying.

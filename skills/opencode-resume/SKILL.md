---
name: opencode-resume
description: Continue or fork an existing OpenCode session by ID or last session.
---

# OpenCode Resume

Resume session context without weakening the original execution posture.

## Prerequisite

Resolve `OPENCODE_BIN` from an explicit executable, `command -v opencode`, or the official user install directories; verify it with `"$OPENCODE_BIN" --version` and quote it thereafter.

If no candidate is accessible inside the current environment, stop and ask the user to expose the absolute path. Do not search the whole filesystem, execute an unverified match, or install without approval.

## Steps

1. Keep the original process environment, user home, authentication, configuration, and plugins. Do not replace `HOME`/`XDG_*` or copy credentials.
2. Prefer an exact session ID from the prior run. Use `"$OPENCODE_BIN" session list` only when it is unknown.
3. Recover the original `RUN_DIR`. An isolated edit session must resume in the same detached worktree; if it no longer exists, stop rather than silently using the active tree.
4. Choose session behavior:
   - Continue exact: `"$OPENCODE_BIN" run -s "$SESSION_ID"`.
   - Continue last: `"$OPENCODE_BIN" run -c`.
   - Fork history: add `--fork` to either form.
5. Remember that `--fork` copies conversation history only. It does not isolate filesystem changes.
6. Keep `--agent build`. The session inherits its model and variant; override them only when the user asks and the live catalog supports the override.
7. Pass the new prompt through the execution tool's argument interface or a mode-`0600` file on stdin. Continue is the default:

   ```sh
   "$OPENCODE_BIN" run --agent build -s "$SESSION_ID" \
     --dir "$RUN_DIR" --format json < "$PROMPT_FILE"
   ```

   Add `--fork` only when a new history is requested. Use `--pure` only when the user explicitly requests a plugin-free run. Do not discard stderr or interpolate prompt text into the shell.
8. Hand the new session ID and evidence to the host. For edits or an explicit quality request, the host runs `opencode-qa` once; do not re-enter resume from QA.

## Completion criterion

The intended session continued in its original execution location and returned evidence; for edits or an explicit quality request, QA also passed. Otherwise report the missing session/worktree without falling back to a less safe location.

# to-opencode

Beta. These skills are public on purpose — try them and tell me what breaks.

Hand work to **OpenCode** from Claude Code or Codex: run prompts headless, inspect the live model catalog, resume sessions, and quality-gate the output.

## Prerequisites

- An installed `opencode` CLI, either on `PATH` or exposed through an absolute `OPENCODE_BIN`.
- An existing local OpenCode login for paid providers.

If the CLI is missing, ask before installing it and use the [official installer](https://opencode.ai/docs/). Do not silently execute a remote install script.

## OpenCode Go

Puedes activar OpenCode Go mediante este [enlace de referido](https://opencode.ai/go?ref=7TR684F5BM). La oferta oficial indica $5 durante el primer mes y después $10/mes; revisa las [condiciones actuales](https://opencode.ai/docs/go/) antes de suscribirte.

## Executable discovery

Resolve the executable in this order: an absolute executable `OPENCODE_BIN`, `command -v opencode`, then the official installer locations `$OPENCODE_INSTALL_DIR/opencode`, `$XDG_BIN_DIR/opencode`, `$HOME/bin/opencode`, and `$HOME/.opencode/bin/opencode`. Verify the resolved file with `"$OPENCODE_BIN" --version`.

Do not search the whole filesystem or execute an unverified file merely named `opencode`. If no candidate is accessible inside the current environment, report that boundary and ask the user to expose the absolute path; a host-only binary cannot be executed from an isolated container where it is not mounted.

## Local runtime

Reuse the `opencode` binary, user home, environment, credentials, configuration, and plugins already available to the host process. A detached worktree changes the project directory only; it must not replace `HOME`, `XDG_*`, or copy credentials into the worktree.

Do not ask the user to log in preemptively. First run `"$OPENCODE_BIN" models opencode-go` in the inherited environment. If the requested model appears, continue immediately. Only after an authentication failure should the skill inspect `"$OPENCODE_BIN" auth list` and tell the user to run `opencode auth login -p opencode-go`. If the provider is authenticated but the model is missing, refresh the catalog once and report model unavailability instead of starting a login loop.

## Model selection

The local catalog is the source of truth:

```sh
"$OPENCODE_BIN" models --refresh
"$OPENCODE_BIN" models <provider>
```

Use an exact `provider/model` ID that appears in that catalog:

- `opencode-go/deepseek-v4-flash` — OpenCode Go; favorite and default.
- `opencode-go/deepseek-v4-pro` — OpenCode Go; harder work.
- `opencode/deepseek-v4-flash-free` — no-cost option only when explicitly selected.

If an actual authentication failure shows that OpenCode Go has no usable local credentials, stop, tell the user to run `opencode auth login -p opencode-go`, and retry after login. Never fall back to a free model silently.

Free OpenCode models may retain submitted data for model improvement. Do not send confidential or proprietary material to a free model without explicit user approval.

OpenCode Go's model list and privacy terms can change. Check the live catalog and the current [OpenCode Go documentation](https://opencode.ai/docs/go/) instead of relying on a cached list.

## Execution safety

OpenCode must use the `build` agent when delegated work needs to execute commands or edit files.

- **Isolated worktree (default for edits):** run `build` in a detached Git worktree, verify its diff, then promote only authorized changes.
- **Direct worktree:** run in the active tree only when the user explicitly requests it.
- `--fork` isolates session history, not files.
- `--auto` auto-approves permissions; it is not a sandbox and requires explicit approval.

A detached worktree protects the active checkout from accidental edits, but it is **not an OS sandbox**: OpenCode can still reach network, credentials, and other host resources allowed by its process environment.

## Project context

`--dir` selects OpenCode's project. In isolated mode it must point to the detached worktree, where project rules load normally:

```text
AGENTS.md (project root or nearest parent) > CLAUDE.md (project)
~/.config/opencode/AGENTS.md > ~/.claude/CLAUDE.md
```

The `instructions` setting in `opencode.json` can load additional standards. Put ticket or architecture paths that are not covered by those rules in the prompt explicitly. If uncommitted context is needed, copy only the task-relevant files into the isolated worktree and never copy ignored secrets.

## Skills

| Skill | When |
| --- | --- |
| `to-opencode` | Router — selects the right fragment |
| `opencode-invoke` | Fresh headless `build` run |
| `opencode-models` | Live catalog and exact model IDs |
| `opencode-resume` | Continue or fork a session |
| `opencode-qa` | Ledger, claims, diff, and verification gate |
| `opencode-visual` | Translate captures for models without vision |

## Install

Each skill is a self-contained folder. Symlink the set into the agent's skills directory:

```sh
ln -s <repo>/skills/* ~/.claude/skills/
ln -s <repo>/skills/* ~/.codex/skills/
```

The fragments do not import each other. The router only points.

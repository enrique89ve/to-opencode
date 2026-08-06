# to-opencode

Beta. These skills are public on purpose — try them and tell me what breaks.

Hand work to **opencode** from Claude Code or Codex: run prompts headless, browse the model catalog, resume sessions, and quality-gate the output.

## Prerequisites

- `opencode` CLI on PATH — check with `opencode --version`. Not installed?

  ```
  curl -fsSL https://opencode.ai/install | bash
  ```

- Credentials for the provider you want — `opencode auth list` to check, `opencode auth login -p <provider>` to add.

## The default

`opencode-go/deepseek-v4-flash` — the favorite. Fast, cheap, good enough for most work. Escalate to `opencode-go/deepseek-v4-pro`; downgrade to `opencode/deepseek-v4-flash-free` for throwaway checks.

## Skills

| Skill | When | Invocation |
| --- | --- | --- |
| `to-opencode` | Router — coordination map, picks the fragment | Model-invoked, or type the name |
| `opencode-invoke` | Fresh headless run | `opencode-invoke` |
| `opencode-models` | Catalog of available models | `opencode-models` |
| `opencode-resume` | Continue last or a specific session | `opencode-resume` |
| `opencode-qa` | Quality gate on any opencode output | `opencode-qa` |

## Install

Each skill is a folder with a `SKILL.md`. Symlink the whole set into your agent's skills directory:

### Claude Code

```
ln -s <repo>/skills/* ~/.claude/skills/
```

### Codex

```
ln -s <repo>/skills/* ~/.codex/skills/
```

The fragments are independent — no skill imports another. The router only points.

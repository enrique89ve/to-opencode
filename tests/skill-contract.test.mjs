import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const skillsDir = join(root, "skills");
const skillNames = readdirSync(skillsDir).sort();
const skillFiles = new Map(
  skillNames.map((name) => [
    name,
    readFileSync(join(skillsDir, name, "SKILL.md"), "utf8"),
  ]),
);

test("skill metadata names match their directories", () => {
  for (const [name, body] of skillFiles) {
    const frontmatter = parseFrontmatter(body);
    assert.equal(frontmatter.name, name);
    assert.ok(frontmatter.description);
    assert.deepEqual(Object.keys(frontmatter).sort(), ["description", "name"]);
    assert.match(body, /## Completion criterion/u);
  }
});

test("router references only installed sibling skills", () => {
  const router = skillFiles.get("to-opencode");
  const references = [...router.matchAll(/`(opencode-[a-z-]+)`/gu)].map(
    ([, name]) => name,
  );
  assert.deepEqual([...new Set(references)].sort(), skillNames.slice(0, -1));
});

test("router and child descriptions do not compete for the same trigger", () => {
  const routerDescription = parseFrontmatter(skillFiles.get("to-opencode")).description;
  assert.match(routerDescription, /exactly one fragment/u);
  for (const name of skillNames.filter((name) => name !== "to-opencode")) {
    assert.doesNotMatch(
      parseFrontmatter(skillFiles.get(name)).description,
      /Use when the user wants|Also use when/u,
    );
  }
});

test("security and compatibility regressions stay absent", () => {
  const repositoryText = [
    readFileSync(join(root, "README.md"), "utf8"),
    ...skillFiles.values(),
  ].join("\n");

  assert.match(repositoryText, /opencode-go\/deepseek-v4-flash/u);
  assert.doesNotMatch(repositoryText, /2>\/dev\/null/u);
  assert.doesNotMatch(repositoryText, /curl[^\n|]*\|\s*bash/u);
  assert.doesNotMatch(repositoryText, /models --verbose <provider\/model>/u);
  assert.match(repositoryText, /not an OS sandbox/iu);
  assert.match(repositoryText, /--agent build/u);
  assert.match(repositoryText, /Free models may retain|Free OpenCode models may retain/iu);
  assert.match(repositoryText, /favorite and default/iu);
  assert.match(repositoryText, /Never fall back|never an automatic fallback/iu);
  assert.match(repositoryText, /opencode auth login -p opencode-go/u);
  assert.match(repositoryText, /inherited environment/iu);
  assert.match(repositoryText, /Do not replace `HOME` or `XDG_\*`/iu);
  assert.match(repositoryText, /\$HOME\/\.opencode\/bin\/opencode/u);
  assert.match(repositoryText, /Never search the whole filesystem/iu);
  assert.match(repositoryText, /single terminal post-run gate/iu);
  assert.doesNotMatch(skillFiles.get("to-opencode"), /OPENCODE_BIN|auth login|deepseek-v4/u);
});

test("invocation uses safe stdin transport and JSONL output", () => {
  const invoke = skillFiles.get("opencode-invoke");
  assert.match(invoke, /< "\$PROMPT_FILE"/u);
  assert.match(invoke, /--format json/u);
  assert.match(invoke, /mode-`0600`/u);
  assert.doesNotMatch(invoke, /"<prompt>"/u);
  assert.doesNotMatch(invoke, /opencode run --pure/u);
  assert.doesNotMatch(invoke, /models opencode-go/u);
  assert.match(invoke, /models "\$PROVIDER"/u);
  assert.match(invoke, /Use `--pure` only when the user explicitly requests/u);
  assert.match(invoke, /"\$OPENCODE_BIN" run --agent build/u);
  assert.match(skillFiles.get("opencode-visual"), /"\$OPENCODE_BIN" models --verbose/u);
  assert.match(
    skillFiles.get("opencode-visual"),
    /caller decides.*do not call `opencode-invoke`/su,
  );
  assert.match(skillFiles.get("opencode-qa"), /Do not delegate automatically/u);
  assert.doesNotMatch(skillFiles.get("opencode-qa"), /opencode-invoke|opencode-resume/u);
  const resume = skillFiles.get("opencode-resume");
  const primaryResumeCommand = resume.match(
    /Continue is the default:\n\n\s*```sh\n([\s\S]*?)\s*```/u,
  )?.[1];
  assert.ok(primaryResumeCommand);
  assert.match(primaryResumeCommand, /run --agent build -s "\$SESSION_ID"/u);
  assert.doesNotMatch(primaryResumeCommand, /--fork/u);
  assert.match(resume, /Add `--fork` only/u);
});

test("ledger helper aggregates every step_finish event", () => {
  const result = spawnSync(
    process.execPath,
    [join(skillsDir, "opencode-qa", "scripts", "summarize-jsonl.mjs")],
    {
      input: readFileSync(join(root, "tests", "fixtures", "opencode-run.jsonl")),
      encoding: "utf8",
    },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    sessionIDs: ["ses_test", "ses_test_fork"],
    steps: 2,
    errors: 1,
    cost: 0.03,
    tokens: {
      total: 19,
      input: 11,
      output: 4,
      reasoning: 1,
      cacheRead: 3,
      cacheWrite: 0,
    },
  });
});

function parseFrontmatter(body) {
  const match = body.match(/^---\n([\s\S]*?)\n---/u);
  assert.ok(match, "missing YAML frontmatter");

  return Object.fromEntries(
    match[1].split("\n").map((line) => {
      const separator = line.indexOf(":");
      assert.notEqual(separator, -1, `invalid frontmatter line: ${line}`);
      return [line.slice(0, separator), line.slice(separator + 1).trim()];
    }),
  );
}

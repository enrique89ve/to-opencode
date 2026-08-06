#!/usr/bin/env node

import { readFileSync } from "node:fs";

const input = readFileSync(0, "utf8");
const summary = {
  sessionIDs: new Set(),
  steps: 0,
  errors: 0,
  cost: 0,
  tokens: {
    total: 0,
    input: 0,
    output: 0,
    reasoning: 0,
    cacheRead: 0,
    cacheWrite: 0,
  },
};

for (const [index, rawLine] of input.split(/\r?\n/u).entries()) {
  const line = rawLine.trim();
  if (!line) continue;

  let event;
  try {
    event = JSON.parse(line);
  } catch {
    process.stderr.write(`Invalid JSONL at line ${index + 1}\n`);
    process.exit(1);
  }

  if (typeof event.sessionID === "string") {
    summary.sessionIDs.add(event.sessionID);
  }
  if (event.type === "error") {
    summary.errors += 1;
  }
  if (event.type !== "step_finish") continue;

  const part = event.part ?? {};
  const tokens = part.tokens ?? {};
  const cache = tokens.cache ?? {};

  summary.steps += 1;
  summary.cost += numeric(part.cost);
  summary.tokens.total += numeric(tokens.total);
  summary.tokens.input += numeric(tokens.input);
  summary.tokens.output += numeric(tokens.output);
  summary.tokens.reasoning += numeric(tokens.reasoning);
  summary.tokens.cacheRead += numeric(cache.read);
  summary.tokens.cacheWrite += numeric(cache.write);
}

process.stdout.write(
  `${JSON.stringify(
    {
      ...summary,
      sessionIDs: [...summary.sessionIDs],
    },
    null,
    2,
  )}\n`,
);

function numeric(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

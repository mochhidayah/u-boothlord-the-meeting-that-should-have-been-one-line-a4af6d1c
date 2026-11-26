// The Meeting That Should Have Been One Line.
// A tiny line-forge: it holds the one sentence, proves it against the
// competition gate (UTF-8, 1-200 chars, a single non-blank line), then
// writes it to /output/entry.txt for the judge.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The line. One sentence, no setup, no explanation: the whole meeting,
// its verdict, and its recurring horror, in a single breath.
const LINE =
  "Nobody in this meeting learned anything, decided anything, or needed to be here \u2014 and we'll do it again next Tuesday.";

function gateCheck(line: string): string[] {
  const problems: string[] = [];
  const bytes = Buffer.byteLength(line, "utf8");
  if (bytes < 1 || bytes > 200) problems.push(`length ${bytes} bytes is outside 1..200`);
  if (line.trim().length === 0) problems.push("line is only whitespace");
  if (line.split("\n").length !== 1) problems.push("line must be a single line");
  if (line.includes("\r")) problems.push("line must not carry carriage returns");
  if (!line.trimEnd().endsWith(".")) problems.push("line should end as one finished sentence");
  return problems;
}

function main(): void {
  const problems = gateCheck(LINE);
  if (problems.length > 0) {
    for (const p of problems) console.error(`gate: ${p}`);
    process.exit(1);
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, LINE, "utf8");
  console.log(`wrote ${target} (${Buffer.byteLength(LINE, "utf8")} bytes)`);
  console.log(LINE);
}

main();

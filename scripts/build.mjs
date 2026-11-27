#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { loadProject } from "./lib/io.mjs";
import { validateOrExit } from "./lib/schema.mjs";
import { renderReadme } from "./lib/render.mjs";

const root = resolve(import.meta.dirname, "..");
const readmePath = join(root, "README.md");
const checkOnly = process.argv.includes("--check");

const project = await loadProject(root);
validateOrExit(project, "README");

const next = renderReadme(project);
let current = "";
try {
  current = await readFile(readmePath, "utf8");
} catch {
  // 首次生成时不存在
}

if (current === next) {
  console.log("✓ README.md 已是最新。");
  process.exit(0);
}
if (checkOnly) {
  console.error("✗ README.md 与 data/ 不一致，请运行 `npm run build` 后提交。");
  process.exit(1);
}

await writeFile(readmePath, next);
console.log(`✓ 已生成 README.md（${project.sections.size} 个章节）。`);

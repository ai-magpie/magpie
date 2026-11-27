#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { loadProject } from './lib/io.mjs';
import { formatReport, validateData } from './lib/schema.mjs';
import { renderReadme } from './lib/render.mjs';

const root = resolve(import.meta.dirname, '..');
const readmePath = join(root, 'README.md');
const checkOnly = process.argv.includes('--check');

const project = await loadProject(root);
const report = validateData(project);

if (report.errors.length > 0) {
  console.error(formatReport(report));
  console.error(`\n✗ 数据校验失败：${report.errors.length} 个错误，未生成 README。`);
  process.exit(1);
}
if (report.warnings.length > 0) console.warn(formatReport(report));

const next = renderReadme(project);
let current = '';
try {
  current = await readFile(readmePath, 'utf8');
} catch {
  // 首次生成时不存在
}

if (current === next) {
  console.log('✓ README.md 已是最新。');
  process.exit(0);
}
if (checkOnly) {
  console.error('✗ README.md 与 data/ 不一致，请运行 `pnpm build` 后提交。');
  process.exit(1);
}

await writeFile(readmePath, next);
console.log(`✓ 已生成 README.md（${project.sections.size} 个章节）。`);

#!/usr/bin/env node
import { resolve } from 'node:path';
import { loadProject } from './lib/io.mjs';
import { formatReport, validateData } from './lib/schema.mjs';

const root = resolve(import.meta.dirname, '..');
const project = await loadProject(root);
const report = validateData(project);

if (report.errors.length > 0 || report.warnings.length > 0) {
  console.log(formatReport(report));
}

if (report.errors.length > 0) {
  console.error(`\n✗ 数据校验失败：${report.errors.length} 个错误，${report.warnings.length} 个警告。`);
  process.exit(1);
}

const items = [...project.sections.values()].reduce(
  (total, section) => total + (Array.isArray(section?.items) ? section.items.length : 0),
  0,
);
console.log(`✓ 数据校验通过：${project.sections.size} 个章节，${items} 个条目，${report.warnings.length} 个警告。`);

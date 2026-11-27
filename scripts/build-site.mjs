#!/usr/bin/env node
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { loadProject } from "./lib/io.mjs";
import { validateOrExit } from "./lib/schema.mjs";
import { renderSite } from "./lib/site.mjs";

const root = resolve(import.meta.dirname, "..");
const outDir = join(root, "dist");

const project = await loadProject(root);
validateOrExit(project, "站点");

const template = await readFile(join(root, "web/template.html"), "utf8");
const html = renderSite(project, template);

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });
await writeFile(join(outDir, "index.html"), html);
await cp(join(root, "web/assets"), join(outDir, "assets"), { recursive: true });
await cp(join(root, "web/404.html"), join(outDir, "404.html"));

console.log(`✓ 已生成 dist/（${project.sections.size} 个章节）。`);

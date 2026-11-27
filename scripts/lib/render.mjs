import { orderedSections } from "./order.mjs";

const GENERATED_NOTE =
  "<!-- 本文件由 scripts/build.mjs 从 data/ 自动生成，请勿直接编辑；修改 data/ 后运行 `npm run build`。 -->";

const EMPTY_SECTION = "_暂无收录，欢迎提交 PR。_";

/**
 * @param {string} text
 * @returns {string}
 */
function escapeText(text) {
  return text.replace(/[\\[\]]/g, "\\$&");
}

/**
 * @param {string} url
 * @returns {string}
 */
function escapeUrl(url) {
  return url.replace(/\(/g, "%28").replace(/\)/g, "%29");
}

/**
 * @param {{ title: string, description: string, intro?: string, items?: Array<{ name: string, url: string, description: string }> }} section
 * @returns {string}
 */
function renderSection(section) {
  const lines = [`## ${section.title}`, "", section.description];
  if (section.intro) lines.push("", section.intro);
  lines.push("");

  if (!Array.isArray(section.items) || section.items.length === 0) {
    lines.push(EMPTY_SECTION);
  } else {
    for (const item of section.items) {
      lines.push(`- [${escapeText(item.name)}](${escapeUrl(item.url)}) — ${item.description}`);
    }
  }
  return lines.join("\n");
}

/**
 * 渲染完整 README。纯函数，同样输入必得逐字节相同输出。
 * @param {{ meta: import('./io.mjs').Meta, index: { sections: string[] }, sections: Map<string, import('./io.mjs').Section> }} project
 * @returns {string}
 */
export function renderReadme({ meta, index, sections }) {
  const entries = orderedSections({ index, sections });

  /** @type {string[]} */
  const blocks = [GENERATED_NOTE, `# ${meta.title}`, `> ${meta.tagline}`];
  if (meta.site) blocks.push(`**[在线浏览](${escapeUrl(meta.site)})**`);
  if (meta.description) blocks.push(meta.description);

  const toc = ["## 目录", ""];
  if (entries.length === 0) {
    toc.push("_暂无章节。_");
  } else {
    for (const entry of entries) toc.push(`- [${entry.title}](#${entry.anchor})`);
  }
  blocks.push(toc.join("\n"));

  for (const entry of entries) blocks.push(renderSection(entry));

  blocks.push(
    [
      "## 贡献",
      "",
      meta.contributing,
      "",
      "编辑 `data/sections/` 下的 JSON 文件后运行 `npm run build` 重新生成 README，不要直接修改本文件。",
      "",
      "提交前可运行 `npm run check:links` 抽查外链，失效链接请替换或移除。"
    ].join("\n")
  );
  blocks.push(
    ["## 许可", "", `[${meta.license}](LICENSE) © ${String(meta.repo).split("/")[0]}`].join("\n")
  );

  return `${blocks.join("\n\n")}\n`;
}

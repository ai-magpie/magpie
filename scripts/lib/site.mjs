import { orderedSections } from "./order.mjs";

/**
 * HTML 转义：文本节点与属性值共用。
 * @param {unknown} value
 * @returns {string}
 */
export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * 站点地址：优先 meta.site，否则按 GitHub Pages 项目站点推导。
 * @param {{ site?: string, repo: string }} meta
 * @returns {string}
 */
export function siteUrl(meta) {
  if (typeof meta.site === "string" && meta.site.trim() !== "") return meta.site;
  const [owner, name] = String(meta.repo).split("/");
  return `https://${owner}.github.io/${name}/`;
}

/**
 * 取链接的主机名，去掉 www 前缀。
 * @param {string} url
 * @returns {string}
 */
export function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/** 两级公共后缀：这些域名要保留三段。 */
const MULTI_SUFFIX = new Set([
  "co.uk",
  "org.uk",
  "ac.uk",
  "com.cn",
  "net.cn",
  "org.cn",
  "com.br",
  "co.jp",
  "co.kr",
  "com.au"
]);

/**
 * 可注册域名（去掉子域），用于列表里的站点列。
 * @param {string} url
 * @returns {string}
 */
export function siteOf(url) {
  const host = hostOf(url);
  if (!host || !host.includes(".")) return host;
  const parts = host.split(".");
  if (MULTI_SUFFIX.has(parts.slice(-2).join("."))) return parts.slice(-3).join(".");
  return parts.slice(-2).join(".");
}

/**
 * 稳定的 32 位字符串哈希（FNV-1a），用于确定性地派生颜色。
 * @param {string} value
 * @returns {number}
 */
function hashOf(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * 单字块按名称取色：同名同色、不同条目之间保持一点节奏。
 * 色相数量与 style.css 里的 .mg-h* 一一对应。
 */
const HUE_STEPS = 8;

/**
 * 名称到色相档位（0..7）的确定性映射。
 * 用类名而不是内联样式，是为了在 style-src 'self' 的 CSP 下仍然生效。
 * @param {string} name
 * @returns {number}
 */
export function hueOf(name) {
  return hashOf(name) % HUE_STEPS;
}

/**
 * 单字块的首字：优先拉丁字母，纯中文名才退回首个汉字。
 * @param {string} name
 * @returns {string}
 */
export function initialOf(name) {
  const latin = String(name).match(/[A-Za-z]/);
  if (latin) return latin[0].toUpperCase();
  return [...String(name).trim()][0] ?? "·";
}

/** @param {number} value */
const pad2 = (value) => String(value).padStart(2, "0");

const ARROW =
  '<svg class="ra" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4.5 11.5 11.5 4.5M6.2 4.5h5.3v5.3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/**
 * 左侧章节导航的一项。
 * @param {{ anchor: string, title: string, items: unknown[] }} section
 * @param {number} index
 * @returns {string}
 */
function renderNavItem(section, index) {
  const order = index + 1;
  const count = Array.isArray(section.items) ? section.items.length : 0;
  return [
    `<a href="#${escapeHtml(section.anchor)}" data-sec="${escapeHtml(section.anchor)}" data-total="${count}"`,
    ` aria-label="${escapeHtml(section.title)}，${count} 个条目">`,
    `<span class="n" aria-hidden="true">${pad2(order)}</span>`,
    `<span class="t">${escapeHtml(section.title)}</span>`,
    `<span class="c" aria-hidden="true" data-count>${count}</span>`,
    "</a>"
  ].join("");
}

/**
 * 列表里的一行。
 * @param {{ name: string, url: string, description: string }} item
 * @param {string} sectionTitle
 * @returns {string}
 */
function renderRow(item, sectionTitle) {
  const host = hostOf(item.url);
  const site = siteOf(item.url);
  const search = `${item.name} ${item.description} ${host} ${sectionTitle}`.toLowerCase();
  const hint = host && host !== site ? `，${escapeHtml(host)}` : "";

  return [
    "<li>",
    `<a class="row" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer"`,
    ` data-search="${escapeHtml(search)}">`,
    `<span class="mg mg-h${hueOf(item.name)}" aria-hidden="true">${escapeHtml(initialOf(item.name))}</span>`,
    `<span class="rn">${escapeHtml(item.name)}</span>`,
    `<span class="rd">${escapeHtml(item.description)}</span>`,
    `<span class="ru">${escapeHtml(site)}</span>`,
    ARROW,
    `<span class="sr-only">（在新标签页打开${hint}）</span>`,
    "</a>",
    "</li>"
  ].join("");
}

/**
 * 一个章节卡片。
 * @param {{ anchor: string, title: string, description: string, intro?: string, items: Array<{ name: string, url: string, description: string }> }} section
 * @param {number} index
 * @returns {string}
 */
function renderSection(section, index) {
  const order = index + 1;
  const items = Array.isArray(section.items) ? section.items : [];
  const lines = [
    `  <section class="sec" id="${escapeHtml(section.anchor)}" data-sec="${escapeHtml(section.anchor)}">`,
    '    <header class="sec-h">',
    '      <div class="sec-top">',
    `        <span class="sec-n" aria-hidden="true">${pad2(order)}</span>`,
    `        <h2>${escapeHtml(section.title)}</h2>`,
    `        <span class="sec-c" aria-label="${items.length} 个条目"><b data-total="${items.length}">${items.length}</b></span>`,
    "      </div>",
    `      <p class="sec-d">${escapeHtml(section.description)}</p>`,
    "    </header>"
  ];

  if (section.intro) {
    lines.push(`    <p class="sec-intro">${escapeHtml(section.intro)}</p>`);
  }

  if (items.length === 0) {
    lines.push('    <p class="sec-empty">暂无收录，欢迎提交 PR。</p>');
  } else {
    lines.push('    <ul class="rows">');
    for (const item of items) lines.push(`      ${renderRow(item, section.title)}`);
    lines.push("    </ul>");
  }

  lines.push("  </section>");
  return lines.join("\n");
}

/**
 * 渲染整页 HTML。纯函数：同样的输入与模板得到逐字节相同的输出。
 * @param {{ meta: any, index: { sections: string[] }, sections: Map<string, any> }} project
 * @param {string} template 含 {{PLACEHOLDER}} 的页面骨架
 * @returns {string}
 */
export function renderSite({ meta, index, sections }, template) {
  const entries = orderedSections({ index, sections });

  const total = entries.reduce(
    (sum, section) => sum + (Array.isArray(section.items) ? section.items.length : 0),
    0
  );

  const values = {
    TITLE: escapeHtml(meta.title),
    TAGLINE: escapeHtml(meta.tagline),
    PAGE_TITLE: escapeHtml(`${meta.title} · AI 工具与资源清单`),
    DESCRIPTION: escapeHtml(meta.description),
    CONTRIBUTING: escapeHtml(meta.contributing ?? ""),
    CANONICAL: escapeHtml(siteUrl(meta)),
    REPO_URL: escapeHtml(`https://github.com/${meta.repo}`),
    REPO: escapeHtml(meta.repo),
    LICENSE: escapeHtml(meta.license),
    COUNT: String(total),
    SECTION_COUNT: String(entries.length),
    NAV: entries.map(renderNavItem).join("\n"),
    BODY: entries.map(renderSection).join("\n")
  };

  return template.replace(/\{\{([A-Z_]+)\}\}/g, (placeholder, key) =>
    Object.hasOwn(values, key) ? values[key] : placeholder
  );
}

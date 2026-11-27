import { createSlugger } from './slug.mjs';

/**
 * HTML 转义：文本节点与属性值共用。
 * @param {unknown} value
 * @returns {string}
 */
export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * 站点地址：优先 meta.site，否则按 GitHub Pages 项目站点推导。
 * @param {{ site?: string, repo: string }} meta
 * @returns {string}
 */
export function siteUrl(meta) {
  if (typeof meta.site === 'string' && meta.site.trim() !== '') return meta.site;
  const [owner, name] = String(meta.repo).split('/');
  return `https://${owner}.github.io/${name}/`;
}

/**
 * @param {{ anchor: string, title: string, description: string, intro?: string, items: Array<{ name: string, url: string, description: string }> }} section
 * @returns {string}
 */
function renderSection(section) {
  const items = Array.isArray(section.items) ? section.items : [];
  const lines = [
    `  <section class="section" id="${section.anchor}">`,
    '    <div class="section-head">',
    `      <h2>${escapeHtml(section.title)}</h2>`,
    `      <span class="section-count">${items.length}</span>`,
    '    </div>',
    `    <p class="section-desc">${escapeHtml(section.description)}</p>`,
  ];

  if (section.intro) {
    lines.push(`    <p class="section-intro">${escapeHtml(section.intro)}</p>`);
  }

  if (items.length === 0) {
    lines.push('    <p class="empty">暂无收录，欢迎提交 PR。</p>');
  } else {
    lines.push('    <ul class="entries">');
    for (const item of items) {
      const search = `${item.name} ${item.description}`;
      lines.push(
        `      <li data-search="${escapeHtml(search)}"><a class="entry-name" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.name)}</a><span class="entry-desc">${escapeHtml(item.description)}</span></li>`,
      );
    }
    lines.push('    </ul>');
  }

  lines.push('  </section>');
  return lines.join('\n');
}

/**
 * 渲染整页 HTML。纯函数：同样的输入与模板得到逐字节相同的输出。
 * @param {{ meta: any, index: { sections: string[] }, sections: Map<string, any> }} project
 * @param {string} template 含 {{PLACEHOLDER}} 的页面骨架
 * @returns {string}
 */
export function renderSite({ meta, index, sections }, template) {
  const slug = createSlugger();
  const order = Array.isArray(index?.sections) ? index.sections : [];
  const entries = order
    .filter((id) => sections.has(id))
    .map((id) => {
      const section = sections.get(id);
      return { ...section, anchor: slug(section.title) };
    });

  const total = entries.reduce(
    (sum, section) => sum + (Array.isArray(section.items) ? section.items.length : 0),
    0,
  );

  const values = {
    TITLE: escapeHtml(meta.title),
    TAGLINE: escapeHtml(meta.tagline),
    PAGE_TITLE: escapeHtml(`${meta.title} · ${meta.tagline}`),
    DESCRIPTION: escapeHtml(meta.description),
    CANONICAL: escapeHtml(siteUrl(meta)),
    REPO_URL: escapeHtml(`https://github.com/${meta.repo}`),
    REPO: escapeHtml(meta.repo),
    LICENSE: escapeHtml(meta.license),
    COUNT: String(total),
    NAV: entries.map((section) => `<a href="#${section.anchor}">${escapeHtml(section.title)}</a>`).join(''),
    BODY: entries.map(renderSection).join('\n'),
  };

  return template.replace(/\{\{([A-Z_]+)\}\}/g, (placeholder, key) =>
    Object.hasOwn(values, key) ? values[key] : placeholder,
  );
}

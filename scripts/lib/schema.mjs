/**
 * 数据校验。纯函数，不碰文件系统，便于单测。
 */

const ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
const META_FIELDS = ['title', 'tagline', 'description', 'repo', 'license', 'contributing'];
const MAX_ITEM_NAME = 60;
const MAX_ITEM_DESCRIPTION = 160;

const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);
const isText = (value) => typeof value === 'string' && value.trim() !== '';

/**
 * 归一化 URL，用于判重：忽略协议大小写、末尾斜杠与 fragment。
 * 只接受可解析的 https 链接。
 * @param {string} raw
 * @returns {string|null}
 */
export function normalizeUrl(raw) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' || url.username || url.password) return null;

  const path = url.pathname.replace(/\/+$/, '') || '/';
  return `${url.protocol}//${url.host.toLowerCase()}${path}${url.search}`;
}

/**
 * @typedef {object} Report
 * @property {string[]} errors
 * @property {string[]} warnings
 */

/**
 * @param {{ meta: any, index: any, files: Map<string, string>, sections: Map<string, any> }} project
 * @returns {Report}
 */
export function validateData({ meta, index, files, sections }) {
  /** @type {string[]} */
  const errors = [];
  /** @type {string[]} */
  const warnings = [];

  if (!isObject(meta)) {
    errors.push('data/meta.json 必须是一个 JSON 对象');
  } else {
    for (const field of META_FIELDS) {
      if (!isText(meta[field])) errors.push(`data/meta.json 缺少非空字段 "${field}"`);
    }
    if (meta.site !== undefined && (!isText(meta.site) || !normalizeUrl(meta.site))) {
      errors.push('data/meta.json 的 "site" 必须是可解析的 https 链接');
    }
  }

  if (!isObject(index) || !Array.isArray(index.sections)) {
    errors.push('data/sections.json 必须包含 "sections" 数组');
    return { errors, warnings };
  }

  const order = index.sections;
  if (order.length === 0) errors.push('data/sections.json 的 "sections" 不能为空');

  /** @type {Set<string>} */
  const ids = new Set();
  order.forEach((id, position) => {
    if (!isText(id) || !ID_PATTERN.test(id)) {
      errors.push(`data/sections.json 第 ${position + 1} 项不是合法 id（小写字母、数字、连字符）：${JSON.stringify(id)}`);
      return;
    }
    if (ids.has(id)) errors.push(`data/sections.json 重复引用 id "${id}"`);
    ids.add(id);
  });

  for (const id of files.keys()) {
    if (!ids.has(id)) errors.push(`data/sections/${id}.json 未被 data/sections.json 引用`);
  }

  /** @type {Map<string, string>} */
  const titles = new Map();
  /** @type {Map<string, string>} */
  const urls = new Map();

  for (const id of ids) {
    const section = sections.get(id);
    const at = `data/sections/${id}.json`;

    if (!section) {
      errors.push(`缺少文件 ${at}`);
      continue;
    }
    if (!isObject(section)) {
      errors.push(`${at} 必须是一个 JSON 对象`);
      continue;
    }
    if (section.id !== id) {
      errors.push(`${at} 的 "id" 必须为 "${id}"，实际为 ${JSON.stringify(section.id)}`);
    }

    if (!isText(section.title)) {
      errors.push(`${at} 缺少非空字段 "title"`);
    } else {
      const title = section.title.trim();
      if (titles.has(title)) {
        errors.push(`章节标题重复："${title}"（${titles.get(title)} 与 ${at}）`);
      } else {
        titles.set(title, at);
      }
      if (/[^\p{L}\p{N}\p{M}\s_-]/u.test(title)) {
        warnings.push(`${at} 的标题含 emoji 或符号，GitHub 锚点可能与目录不一致：${title}`);
      }
    }

    if (!isText(section.description)) errors.push(`${at} 缺少非空字段 "description"`);
    if (section.intro !== undefined && !isText(section.intro)) {
      warnings.push(`${at} 的 "intro" 应为非空字符串，已忽略`);
    }

    if (!Array.isArray(section.items)) {
      errors.push(`${at} 的 "items" 必须是数组`);
      continue;
    }
    if (section.items.length === 0) warnings.push(`${at} 没有条目`);

    section.items.forEach((item, position) => {
      const where = `${at} items[${position}]`;
      if (!isObject(item)) {
        errors.push(`${where} 必须是对象`);
        return;
      }
      for (const field of ['name', 'url', 'description']) {
        if (!isText(item[field])) errors.push(`${where} 缺少非空字段 "${field}"`);
      }
      if (isText(item.name) && item.name.length > MAX_ITEM_NAME) {
        warnings.push(`${where} 名称超过 ${MAX_ITEM_NAME} 字符`);
      }
      if (isText(item.description) && item.description.length > MAX_ITEM_DESCRIPTION) {
        warnings.push(`${where} 描述超过 ${MAX_ITEM_DESCRIPTION} 字符`);
      }
      if (!isText(item.url)) return;

      const normalized = normalizeUrl(item.url);
      if (!normalized) {
        errors.push(`${where} 的 URL 必须是可解析的 https 链接：${item.url}`);
        return;
      }
      if (urls.has(normalized)) {
        errors.push(`${where} 的 URL 与 ${urls.get(normalized)} 重复：${item.url}`);
      } else {
        urls.set(normalized, where);
      }
    });
  }

  return { errors, warnings };
}

/**
 * @param {Report} report
 * @returns {string}
 */
export function formatReport({ errors, warnings }) {
  return [
    ...errors.map((error) => `✗ ${error}`),
    ...warnings.map((warning) => `! ${warning}`),
  ].join('\n');
}

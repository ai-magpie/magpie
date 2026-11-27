/**
 * 外链检查的纯函数部分：从项目数据收集 URL、对 HTTP 状态分类。
 */

/**
 * 按 sections.json 顺序收集去重后的 URL。
 * @param {{ index: { sections: string[] }, sections: Map<string, any> }} project
 * @returns {string[]}
 */
export function collectUrls({ index, sections }) {
  const order = Array.isArray(index?.sections) ? index.sections : [];
  const seen = new Set();
  const urls = [];

  for (const id of order) {
    const section = sections.get(id);
    if (!section || !Array.isArray(section.items)) continue;

    for (const item of section.items) {
      const url = item?.url;
      if (typeof url !== 'string' || seen.has(url)) continue;
      seen.add(url);
      urls.push(url);
    }
  }

  return urls;
}

/**
 * 判断 URL 是否命中已知受限域名（含子域名）。
 * @param {string} url
 * @param {Iterable<string>} hosts 小写域名
 * @returns {boolean}
 */
export function isKnownRestricted(url, hosts) {
  let hostname;
  try {
    hostname = new URL(url).hostname.toLowerCase();
  } catch {
    return false;
  }

  for (const host of hosts) {
    if (hostname === host || hostname.endsWith(`.${host}`)) return true;
  }
  return false;
}

/**
 * 状态码分类：
 * - ok：2xx/3xx，可访问
 * - blocked：反爬或限流，站点存在但拒绝脚本
 * - broken：404/410，链接失效
 * - error：网络错误、超时或 5xx 等
 * @param {number} status
 * @returns {'ok' | 'blocked' | 'broken' | 'error'}
 */
export function classifyStatus(status) {
  if (status >= 200 && status < 400) return 'ok';
  if (status === 401 || status === 403 || status === 405 || status === 429) return 'blocked';
  if (status === 404 || status === 410) return 'broken';
  return 'error';
}

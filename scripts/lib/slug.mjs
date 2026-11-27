/**
 * GitHub 兼容的标题锚点。
 *
 * 规则与 GitHub 的渲染一致：转小写、移除标点与 emoji、空格转连字符。
 * 章节标题不应包含 emoji，否则 GitHub 可能保留前导连字符，导致目录失配；
 * 校验脚本会对这类标题给出警告。
 */

/**
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  return String(text)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}\s_-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * 生成带去重后缀的 slugger：重复标题依次得到 `-1`、`-2`。
 * @returns {(text: string) => string}
 */
export function createSlugger() {
  /** @type {Map<string, number>} */
  const seen = new Map();
  return (text) => {
    const base = slugify(text);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  };
}

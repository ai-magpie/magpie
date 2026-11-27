/**
 * 章节 ordering 的共享逻辑：README 与站点共用同一份顺序与锚点，
 * 保证两边目录/导航永远一致。
 */

import { createSlugger } from "./slug.mjs";

/**
 * 按 index.sections 顺序展开章节并附上 GitHub 兼容锚点。
 * 顺序与去重（createSlugger 保证重复标题得到 -1/-2 后缀）对两个渲染端一致。
 * @param {{ index: { sections: string[] }, sections: Map<string, any> }} project
 * @returns {Array<import('./io.mjs').Section & { anchor: string }>}
 */
export function orderedSections({ index, sections }) {
  const slug = createSlugger();
  const order = Array.isArray(index?.sections) ? index.sections : [];
  return order
    .filter((id) => sections.has(id))
    .map((id) => {
      const section = sections.get(id);
      return { ...section, anchor: slug(section.title) };
    });
}

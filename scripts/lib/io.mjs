import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

/**
 * @typedef {object} Section
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} [intro]
 * @property {Array<{ name: string, url: string, description: string }>} items
 */

/**
 * @typedef {object} Meta
 * @property {string} title
 * @property {string} tagline
 * @property {string} description
 * @property {string} repo
 * @property {string} license
 * @property {string} contributing
 */

/**
 * @typedef {object} Project
 * @property {Meta} meta
 * @property {{ sections: string[] }} index
 * @property {Map<string, string>} files  章节 id -> 文件路径
 * @property {Map<string, Section>} sections  章节 id -> 已解析内容
 */

/**
 * 读取并解析 JSON，出错时给出带路径的提示。
 * @param {string} file
 */
export async function readJson(file) {
  const text = await readFile(file, "utf8");
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`${file}: JSON 解析失败（${error.message}）`);
  }
}

/**
 * 加载 data/ 下的全部数据。只负责读取，不做校验。
 * @param {string} root 仓库根目录
 * @returns {Promise<Project>}
 */
export async function loadProject(root) {
  const dataDir = join(root, "data");
  const meta = await readJson(join(dataDir, "meta.json"));
  const index = await readJson(join(dataDir, "sections.json"));

  const sectionDir = join(dataDir, "sections");
  const names = (await readdir(sectionDir)).filter((name) => name.endsWith(".json"));
  const files = new Map(
    names.map((name) => [name.slice(0, -".json".length), join(sectionDir, name)])
  );

  const order = Array.isArray(index?.sections) ? index.sections : [];
  const sections = new Map();
  for (const id of order) {
    if (typeof id !== "string") continue;
    const file = files.get(id);
    if (file) sections.set(id, await readJson(file));
  }

  return { meta, index, files, sections };
}

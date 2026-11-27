import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { loadProject } from "../lib/io.mjs";
import { normalizeUrl, validateData } from "../lib/schema.mjs";

const root = resolve(import.meta.dirname, "../..");

function fixture(overrides = {}) {
  return {
    meta: {
      title: "Magpie",
      tagline: "一句话。",
      description: "开篇说明。",
      repo: "ai-magpie/magpie",
      license: "MIT",
      contributing: "欢迎提交 PR。"
    },
    index: { sections: ["tools"] },
    files: new Map([["tools", "data/sections/tools.json"]]),
    sections: new Map([
      [
        "tools",
        {
          id: "tools",
          title: "工具",
          description: "本节说明。",
          items: [{ name: "A", url: "https://example.com", description: "示例。" }]
        }
      ]
    ]),
    ...overrides
  };
}

test("合法数据没有错误", () => {
  const report = validateData(fixture());
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.warnings, []);
});

test("重复 URL 报错，忽略末尾斜杠差异", () => {
  const project = fixture();
  project.sections.get("tools").items.push({
    name: "B",
    url: "https://example.com/",
    description: "示例。"
  });

  assert.match(validateData(project).errors.join("\n"), /重复/);
});

test("非 https 链接报错", () => {
  const project = fixture();
  project.sections.get("tools").items[0].url = "http://example.com";

  assert.match(validateData(project).errors.join("\n"), /https/);
});

test("章节 id 与文件名不一致报错", () => {
  const project = fixture();
  project.sections.get("tools").id = "other";

  assert.match(validateData(project).errors.join("\n"), /"id" 必须为 "tools"/);
});

test("未被引用的章节文件报错", () => {
  const project = fixture();
  project.files.set("orphan", "data/sections/orphan.json");

  assert.match(validateData(project).errors.join("\n"), /未被 data\/sections\.json 引用/);
});

test("引用了不存在的章节文件报错", () => {
  const project = fixture();
  project.index.sections.push("ghost");

  assert.match(validateData(project).errors.join("\n"), /缺少文件/);
});

test("描述过长给出警告而非错误", () => {
  const project = fixture();
  project.sections.get("tools").items[0].description = "长".repeat(161);

  const report = validateData(project);
  assert.deepEqual(report.errors, []);
  assert.match(report.warnings.join("\n"), /描述超过 160 字符/);
});

test("空 items 给出警告", () => {
  const project = fixture();
  project.sections.get("tools").items = [];

  const report = validateData(project);
  assert.match(report.warnings.join("\n"), /没有条目/);
});

test("meta.site 非法时报错", () => {
  const project = fixture();
  project.meta.site = "http://example.com";

  assert.match(validateData(project).errors.join("\n"), /"site"/);
});

test("normalizeUrl 忽略末尾斜杠", () => {
  assert.equal(normalizeUrl("https://Example.com/a/"), normalizeUrl("https://example.com/a"));
});

test("仓库真实数据通过校验", async () => {
  const report = validateData(await loadProject(root));

  assert.deepEqual(report.errors, []);
});

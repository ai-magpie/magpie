import test from "node:test";
import assert from "node:assert/strict";
import { renderReadme } from "../lib/render.mjs";

const section = {
  id: "tools",
  title: "工具",
  description: "本节说明。",
  items: [{ name: "A [beta]", url: "https://example.com/a(b)", description: "示例条目。" }]
};

const project = {
  meta: {
    title: "Magpie",
    tagline: "一句话。",
    description: "开篇说明。",
    repo: "ai-magpie/magpie",
    license: "MIT",
    contributing: "欢迎提交 PR。"
  },
  index: { sections: ["tools"] },
  sections: new Map([["tools", section]])
};

test("渲染生成标记、目录、章节与条目", () => {
  const md = renderReadme(project);

  assert.ok(md.startsWith("<!-- 本文件由 scripts/build.mjs"));
  assert.match(md, /^# Magpie$/m);
  assert.match(md, /- \[工具\]\(#工具\)/);
  assert.ok(md.includes("- [A \\[beta\\]](https://example.com/a%28b%29) — 示例条目。"));
  assert.match(md, /## 贡献/);
  assert.match(md, /## 许可/);
});

test("输出确定且以单个换行结尾", () => {
  const md = renderReadme(project);

  assert.equal(md, renderReadme(project));
  assert.ok(md.endsWith("\n"));
  assert.ok(!md.endsWith("\n\n"));
});

test("不写生成时间戳", () => {
  assert.doesNotMatch(renderReadme(project), /\d{4}-\d{2}-\d{2}/);
});

test("空章节给出提示而非静默消失", () => {
  const empty = {
    ...project,
    sections: new Map([["tools", { ...section, items: [] }]])
  };

  const md = renderReadme(empty);
  assert.match(md, /## 工具/);
  assert.match(md, /暂无收录/);
});

test("meta.site 存在时顶部渲染在线浏览链接", () => {
  const md = renderReadme({
    ...project,
    meta: { ...project.meta, site: "https://example.com/magpie/" }
  });

  assert.ok(md.includes("**[在线浏览](https://example.com/magpie/)**"));
});

test("intro 渲染在描述之后、条目之前", () => {
  const withIntro = {
    ...project,
    sections: new Map([["tools", { ...section, intro: "补充说明。" }]])
  };

  const md = renderReadme(withIntro);
  assert.ok(md.indexOf("本节说明。") < md.indexOf("补充说明。"));
  assert.ok(md.indexOf("补充说明。") < md.indexOf("- [A"));
});

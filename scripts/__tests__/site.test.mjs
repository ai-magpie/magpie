import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { escapeHtml, hostOf, hueOf, initialOf, renderSite, siteOf, siteUrl } from "../lib/site.mjs";

const template = await readFile(resolve(import.meta.dirname, "../../web/template.html"), "utf8");

const project = {
  meta: {
    title: "Magpie",
    tagline: "一句话。",
    description: "开篇说明。",
    repo: "ai-magpie/magpie",
    site: "https://example.github.io/magpie/",
    license: "MIT",
    contributing: "欢迎提交 PR。"
  },
  index: { sections: ["tools"] },
  sections: new Map([
    [
      "tools",
      {
        id: "tools",
        title: "工具",
        description: "说明。",
        intro: "补充。",
        items: [
          {
            name: "A & B",
            url: "https://example.com/?a=1&b=2",
            description: "描述 <script>alert(1)</script>。"
          }
        ]
      }
    ]
  ])
};

test("渲染完整页面并替换全部占位符", () => {
  const html = renderSite(project, template);

  assert.ok(html.startsWith("<!doctype html>"));
  assert.ok(html.includes("<title>Magpie · AI 工具与资源清单</title>"));
  assert.ok(html.includes('name="description" content="开篇说明。"'));
  assert.ok(html.includes('rel="canonical" href="https://example.github.io/magpie/"'));
  assert.ok(html.includes('id="工具"'));
  assert.ok(html.includes('href="#工具"'));
  assert.ok(html.includes('data-sec="工具"'));
  assert.ok(html.includes('aria-label="工具，1 个条目"'));
  assert.ok(html.includes('target="_blank" rel="noopener noreferrer"'));
  assert.ok(html.includes("欢迎提交 PR。"));
  assert.doesNotMatch(html, /\{\{[A-Z_]+\}\}/);
});

test("章节序号从 01 开始，导航与卡片一致", () => {
  const html = renderSite(project, template);

  assert.ok(html.includes('<span class="n" aria-hidden="true">01</span>'));
  assert.ok(html.includes('<span class="sec-n" aria-hidden="true">01</span>'));
  assert.ok(html.includes('<b data-total="1">1</b>'));
});

test("文本与属性均做 HTML 转义", () => {
  const html = renderSite(project, template);

  assert.ok(html.includes("A &amp; B"));
  assert.ok(html.includes("描述 &lt;script&gt;alert(1)&lt;/script&gt;。"));
  assert.ok(!html.includes("<script>alert(1)</script>"));
  assert.ok(html.includes('href="https://example.com/?a=1&amp;b=2"'));
  assert.ok(html.includes('data-search="a &amp; b 描述 &lt;script&gt;'));
});

test("整行即链接，并对读屏器说明新窗口", () => {
  const html = renderSite(project, template);

  assert.match(html, /<a class="row" href="[^"]+" target="_blank" rel="noopener noreferrer"/);
  assert.ok(html.includes("（在新标签页打开）"));
  assert.ok(html.includes('class="rn"'));
  assert.ok(html.includes('class="ru"'));
});

test("不产生内联样式，符合 style-src 'self' 的 CSP", () => {
  const html = renderSite(project, template);

  assert.doesNotMatch(html, /\sstyle="/);
  assert.doesNotMatch(html, /<style[\s>]/);
  // 单字块的色相走类名，不走行内变量
  assert.match(html, /class="mg mg-h[0-7]"/);
});

test("资源使用相对路径，不依赖第三方", () => {
  const html = renderSite(project, template);

  assert.ok(html.includes('href="./assets/style.css"'));
  assert.ok(html.includes('src="./assets/app.js"'));
  assert.ok(html.includes('src="./assets/theme.js"'));
  assert.ok(html.includes('href="./assets/favicon.svg"'));
  assert.doesNotMatch(html, /<script[^>]+src="https?:/);
});

test("同样的输入生成同样的输出", () => {
  assert.equal(renderSite(project, template), renderSite(project, template));
});

test("空章节渲染提示且导航保留", () => {
  const empty = {
    ...project,
    sections: new Map([["tools", { ...project.sections.get("tools"), items: [] }]])
  };

  const html = renderSite(empty, template);
  assert.ok(html.includes("暂无收录"));
  assert.ok(html.includes('<b data-total="0">0</b>'));
  assert.ok(html.includes('href="#工具"'));
});

test("无 site 时按仓库推导 Pages 地址", () => {
  assert.equal(siteUrl({ repo: "ai-magpie/magpie" }), "https://ai-magpie.github.io/magpie/");
  assert.equal(siteUrl({ repo: "a/b", site: "https://x.dev/" }), "https://x.dev/");
});

test("escapeHtml 覆盖五个特殊字符", () => {
  assert.equal(escapeHtml("&<>\"'"), "&amp;&lt;&gt;&quot;&#39;");
});

test("单字块首字优先拉丁字母", () => {
  assert.equal(initialOf("OpenAI GPT"), "O");
  assert.equal(initialOf("阿里 Qwen"), "Q");
  assert.equal(initialOf("快手 Kling"), "K");
  assert.equal(initialOf("本地推理"), "本");
});

test("色相档位稳定且落在 0..7", () => {
  for (const name of ["OpenAI GPT", "阿里 Qwen", "DeepSeek", "a", "很长很长的中文名字"]) {
    const step = hueOf(name);
    assert.ok(Number.isInteger(step));
    assert.ok(step >= 0 && step <= 7);
    assert.equal(hueOf(name), step);
  }
});

test("站点列去掉 www 与子域，保留两级后缀", () => {
  assert.equal(hostOf("https://www.Docs.Example.com/x"), "docs.example.com");
  assert.equal(siteOf("https://docs.example.com/x"), "example.com");
  assert.equal(siteOf("https://platform.openai.com/docs/models"), "openai.com");
  assert.equal(siteOf("https://registry.modelcontextprotocol.io/"), "modelcontextprotocol.io");
  assert.equal(siteOf("https://www.bbc.co.uk/news"), "bbc.co.uk");
  assert.equal(siteOf("不是链接"), "");
});

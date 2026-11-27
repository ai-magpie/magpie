import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { escapeHtml, renderSite, siteUrl } from '../lib/site.mjs';

const template = await readFile(resolve(import.meta.dirname, '../../web/template.html'), 'utf8');

const project = {
  meta: {
    title: 'Magpie',
    tagline: '一句话。',
    description: '开篇说明。',
    repo: 'ai-magpie/magpie',
    site: 'https://example.github.io/magpie/',
    license: 'MIT',
    contributing: '欢迎提交 PR。',
  },
  index: { sections: ['tools'] },
  sections: new Map([
    [
      'tools',
      {
        id: 'tools',
        title: '工具',
        description: '说明。',
        intro: '补充。',
        items: [
          {
            name: 'A & B',
            url: 'https://example.com/?a=1&b=2',
            description: '描述 <script>alert(1)</script>。',
          },
        ],
      },
    ],
  ]),
};

test('渲染完整页面并替换全部占位符', () => {
  const html = renderSite(project, template);

  assert.ok(html.startsWith('<!doctype html>'));
  assert.ok(html.includes('<title>Magpie · 一句话。</title>'));
  assert.ok(html.includes('name="description" content="开篇说明。"'));
  assert.ok(html.includes('rel="canonical" href="https://example.github.io/magpie/"'));
  assert.ok(html.includes('id="工具"'));
  assert.ok(html.includes('href="#工具"'));
  assert.ok(html.includes('target="_blank" rel="noopener noreferrer"'));
  assert.doesNotMatch(html, /\{\{[A-Z_]+\}\}/);
});

test('文本与属性均做 HTML 转义', () => {
  const html = renderSite(project, template);

  assert.ok(html.includes('A &amp; B'));
  assert.ok(html.includes('描述 &lt;script&gt;alert(1)&lt;/script&gt;。'));
  assert.ok(!html.includes('<script>alert(1)</script>'));
  assert.ok(html.includes('href="https://example.com/?a=1&amp;b=2"'));
  assert.ok(html.includes('data-search="A &amp; B 描述 &lt;script&gt;'));
});

test('资源使用相对路径，不依赖第三方', () => {
  const html = renderSite(project, template);

  assert.ok(html.includes('href="./assets/style.css"'));
  assert.ok(html.includes('src="./assets/app.js"'));
  assert.ok(html.includes('href="./assets/favicon.svg"'));
  assert.doesNotMatch(html, /<script[^>]+src="https?:/);
});

test('同样的输入生成同样的输出', () => {
  assert.equal(renderSite(project, template), renderSite(project, template));
});

test('空章节渲染提示且导航保留', () => {
  const empty = {
    ...project,
    sections: new Map([['tools', { ...project.sections.get('tools'), items: [] }]]),
  };

  const html = renderSite(empty, template);
  assert.ok(html.includes('暂无收录'));
  assert.ok(html.includes('共 0 个条目'));
  assert.ok(html.includes('href="#工具"'));
});

test('无 site 时按仓库推导 Pages 地址', () => {
  assert.equal(siteUrl({ repo: 'ai-magpie/magpie' }), 'https://ai-magpie.github.io/magpie/');
  assert.equal(siteUrl({ repo: 'a/b', site: 'https://x.dev/' }), 'https://x.dev/');
});

test('escapeHtml 覆盖五个特殊字符', () => {
  assert.equal(escapeHtml('&<>"\''), '&amp;&lt;&gt;&quot;&#39;');
});

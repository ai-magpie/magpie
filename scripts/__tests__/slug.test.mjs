import test from 'node:test';
import assert from 'node:assert/strict';
import { createSlugger, slugify } from '../lib/slug.mjs';

test('中文标题保留可读性', () => {
  assert.equal(slugify('AI 编程助手'), 'ai-编程助手');
});

test('大小写与连续空格归一', () => {
  assert.equal(slugify('Local   Inference'), 'local-inference');
});

test('移除标点与 emoji', () => {
  assert.equal(slugify('工具 & 资源 🤖'), '工具-资源');
});

test('重复标题依次追加序号', () => {
  const slug = createSlugger();
  assert.equal(slug('工具'), '工具');
  assert.equal(slug('工具'), '工具-1');
  assert.equal(slug('工具'), '工具-2');
});

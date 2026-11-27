import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyStatus, collectUrls } from '../lib/links.mjs';

test('按顺序收集并去重 URL', () => {
  const project = {
    index: { sections: ['a', 'b'] },
    sections: new Map([
      ['a', { items: [{ url: 'https://example.com/a' }, { url: 'https://example.com/a' }] }],
      ['b', { items: [{ url: 'https://example.com/b' }, { url: 42 }] }],
    ]),
  };

  assert.deepEqual(collectUrls(project), ['https://example.com/a', 'https://example.com/b']);
});

test('缺失章节不会中断收集', () => {
  const project = {
    index: { sections: ['missing', 'a'] },
    sections: new Map([['a', { items: [{ url: 'https://example.com/a' }] }]]),
  };

  assert.deepEqual(collectUrls(project), ['https://example.com/a']);
});

test('状态码分类', () => {
  assert.equal(classifyStatus(200), 'ok');
  assert.equal(classifyStatus(204), 'ok');
  assert.equal(classifyStatus(301), 'ok');
  assert.equal(classifyStatus(403), 'blocked');
  assert.equal(classifyStatus(429), 'blocked');
  assert.equal(classifyStatus(404), 'broken');
  assert.equal(classifyStatus(410), 'broken');
  assert.equal(classifyStatus(500), 'error');
  assert.equal(classifyStatus(0), 'error');
});

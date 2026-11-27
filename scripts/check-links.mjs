#!/usr/bin/env node
import { setDefaultResultOrder } from 'node:dns';
import { resolve } from 'node:path';
import { loadProject } from './lib/io.mjs';
import { classifyStatus, collectUrls } from './lib/links.mjs';
import { formatReport, validateData } from './lib/schema.mjs';

// 不少网络环境 IPv6 不通，Node 默认按解析顺序连接会卡在 IPv6 上。
setDefaultResultOrder('ipv4first');

const root = resolve(import.meta.dirname, '..');
const strict = process.argv.includes('--strict');
const CONCURRENCY = 8;
const TIMEOUT_MS = 15_000;
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 MagpieLinkCheck/1.0';

const project = await loadProject(root);
const report = validateData(project);

if (report.errors.length > 0) {
  console.error(formatReport(report));
  console.error(`\n✗ 数据校验失败：${report.errors.length} 个错误，未检查外链。`);
  process.exit(1);
}

const urls = collectUrls(project);
console.log(`检查 ${urls.length} 个外链（并发 ${CONCURRENCY}，超时 ${TIMEOUT_MS / 1000}s）……`);

/**
 * @param {string} url
 * @returns {Promise<number>}
 */
async function request(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: {
      'user-agent': USER_AGENT,
      accept: 'text/html,application/xhtml+xml,*/*;q=0.8',
    },
  });
  const status = response.status;
  await response.body?.cancel();
  return status;
}

/**
 * @param {string} url
 * @returns {Promise<{ url: string, status: number, kind: 'ok' | 'blocked' | 'broken' | 'error', error?: string }>}
 */
async function check(url) {
  let lastError;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const status = await request(url);
      const kind = classifyStatus(status);
      if (kind === 'error' && attempt === 0) {
        lastError = `HTTP ${status}`;
        continue;
      }
      return { url, status, kind };
    } catch (error) {
      lastError = error?.name === 'TimeoutError' ? 'timeout' : (error?.cause?.code ?? error?.message ?? 'network error');
      if (attempt === 0) await new Promise((done) => setTimeout(done, 500));
    }
  }
  return { url, status: 0, kind: 'error', error: lastError };
}

const results = new Array(urls.length);
let cursor = 0;

async function worker() {
  while (true) {
    const index = cursor;
    cursor += 1;
    if (index >= urls.length) return;
    results[index] = await check(urls[index]);
  }
}

await Promise.all(Array.from({ length: Math.min(CONCURRENCY, urls.length) }, worker));

const labels = { blocked: '受限', broken: '失效', error: '不可达' };
for (const result of results) {
  if (result.kind === 'ok') continue;
  const detail = result.error ? ` (${result.error})` : '';
  console.log(`${labels[result.kind]}  ${String(result.status || '-').padEnd(3)}  ${result.url}${detail}`);
}

const counts = results.reduce((acc, result) => {
  acc[result.kind] = (acc[result.kind] ?? 0) + 1;
  return acc;
}, {});

console.log(
  `\n${counts.ok ?? 0} 可访问 · ${counts.blocked ?? 0} 受限 · ${counts.broken ?? 0} 失效 · ${counts.error ?? 0} 不可达`,
);

const failed = (counts.broken ?? 0) + (strict ? (counts.blocked ?? 0) + (counts.error ?? 0) : 0);
if (failed > 0) {
  console.error(strict ? '✗ 存在非可访问链接（--strict）。' : '✗ 存在失效链接，请替换或移除。');
  process.exit(1);
}
console.log('✓ 外链检查通过。');

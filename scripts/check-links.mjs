#!/usr/bin/env node
import { setDefaultResultOrder } from 'node:dns';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { loadProject } from './lib/io.mjs';
import { classifyStatus, collectUrls, isKnownRestricted } from './lib/links.mjs';
import { formatReport, validateData } from './lib/schema.mjs';

// 不少网络环境 IPv6 不通，Node 默认按解析顺序连接会卡在 IPv6 上。
setDefaultResultOrder('ipv4first');

const root = resolve(import.meta.dirname, '..');
const strict = process.argv.includes('--strict');
const showAll = process.argv.includes('--all');
const CONCURRENCY = 8;
const TIMEOUT_MS = 15_000;
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 MagpieLinkCheck/1.0';

/**
 * 合并仓库级与本机级已知受限域名。
 * @returns {Promise<Map<string, string>>}
 */
async function loadKnownHosts() {
  const hosts = new Map();
  const files = [
    join(root, 'data/link-check.json'),
    join(root, '.link-check.local.json'),
  ];

  for (const file of files) {
    let text;
    try {
      text = await readFile(file, 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') continue;
      throw error;
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      throw new Error(`${file}: JSON 解析失败（${error.message}）`);
    }

    for (const entry of data?.knownRestricted ?? []) {
      if (typeof entry?.host !== 'string' || entry.host.trim() === '') continue;
      hosts.set(entry.host.trim().toLowerCase(), entry.reason ?? '');
    }
  }

  return hosts;
}

const project = await loadProject(root);
const report = validateData(project);

if (report.errors.length > 0) {
  console.error(formatReport(report));
  console.error(`\n✗ 数据校验失败：${report.errors.length} 个错误，未检查外链。`);
  process.exit(1);
}

const knownHosts = await loadKnownHosts();
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

for (const result of results) {
  // 已知受限只对「受限/不可达」生效；若已知域名变成 404，仍然按失效处理。
  result.known = result.kind !== 'broken' && isKnownRestricted(result.url, knownHosts.keys());
}

const labels = { blocked: '受限', broken: '失效', error: '不可达' };
for (const result of results) {
  if (result.kind === 'ok') continue;
  if (result.known && !showAll) continue;
  const detail = result.error ? ` (${result.error})` : '';
  const label = result.known ? '已知受限' : labels[result.kind];
  console.log(`${label}  ${String(result.status || '-').padEnd(3)}  ${result.url}${detail}`);
}

const counts = results.reduce(
  (acc, result) => {
    if (result.known) acc.known += 1;
    else acc[result.kind] += 1;
    return acc;
  },
  { ok: 0, known: 0, blocked: 0, broken: 0, error: 0 },
);

console.log(
  `\n${counts.ok} 可访问 · ${counts.known} 已知受限 · ${counts.blocked} 受限 · ${counts.broken} 失效 · ${counts.error} 不可达`,
);

if (counts.blocked + counts.error > 0 && !strict) {
  console.log('提示：常驻不可达的域名可加入 data/link-check.json 或 .link-check.local.json。');
}

const failed = counts.broken + (strict ? counts.blocked + counts.error : 0);
if (failed > 0) {
  console.error(strict ? '✗ 存在非可访问链接（--strict）。' : '✗ 存在失效链接，请替换或移除。');
  process.exit(1);
}
console.log('✓ 外链检查通过。');

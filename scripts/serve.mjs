#!/usr/bin/env node
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..", "dist");
const port = Number(process.env.PORT ?? 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".ico": "image/x-icon"
};

/**
 * 解析请求路径到 dist 内的文件，拒绝越界路径。
 * @param {string} urlPath
 * @returns {Promise<string|null>}
 */
async function resolveFile(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }

  let filePath = resolve(root, `.${decoded}`);
  if (filePath !== root && !filePath.startsWith(`${root}${sep}`)) return null;

  let info;
  try {
    info = await stat(filePath);
  } catch {
    return null;
  }

  if (info.isDirectory()) {
    filePath = join(filePath, "index.html");
    try {
      info = await stat(filePath);
    } catch {
      return null;
    }
  }
  return info.isFile() ? filePath : null;
}

createServer(async (request, response) => {
  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
  const filePath = await resolveFile(pathname);

  if (!filePath) {
    response.writeHead(404, { "content-type": TYPES[".html"] });
    createReadStream(join(root, "404.html")).pipe(response);
    return;
  }

  response.writeHead(200, {
    "content-type": TYPES[extname(filePath)] ?? "application/octet-stream"
  });
  createReadStream(filePath).pipe(response);
}).listen(port, () => {
  console.log(`预览：http://localhost:${port}/`);
});

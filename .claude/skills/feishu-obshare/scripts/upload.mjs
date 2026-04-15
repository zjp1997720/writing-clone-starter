import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function usage() {
  return [
    "Usage:",
    '  node ".claude/skills/feishu-obshare/scripts/upload.mjs" --file <path> [--config <path>] [--public] [--allow-copy] [--allow-create-copy]',
    "",
    "Credential resolution order:",
    "  1) --config <path>",
    "  2) .claude/skills/feishu-obshare/config.local.json (if present)",
    "  3) env vars: FEISHU_APP_ID, FEISHU_APP_SECRET, FEISHU_FOLDER_TOKEN",
    "",
    "Output:",
    '  Prints JSON to stdout: {"docToken":"...","url":"..."}',
  ].join("\n");
}

function isLikelyImagePath(p) {
  if (typeof p !== "string") return false;
  const lower = p.toLowerCase();
  return (
    lower.endsWith(".png") ||
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".gif") ||
    lower.endsWith(".webp") ||
    lower.endsWith(".bmp") ||
    lower.endsWith(".svg")
  );
}

function convertObsidianImageSyntax(markdownContent) {
  // Obsidian embed: ![[path/to/image.png]] or ![[path/to/image.png|alt]]
  const obsidianImageRegex = /!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
  let converted = markdownContent;

  obsidianImageRegex.lastIndex = 0;
  let match;
  while ((match = obsidianImageRegex.exec(markdownContent)) !== null) {
    const filePath = match[1];
    const altText = match[2] || filePath;
    const obsidianSyntax = match[0];

    if (!filePath || !isLikelyImagePath(filePath)) {
      continue;
    }

    const standardSyntax = `![${altText}](${filePath})`;
    converted = converted.replace(obsidianSyntax, standardSyntax);
  }

  return converted;
}

function extractImageInfoFromMarkdown(markdownContent) {
  const imageInfos = [];
  const convertedContent = convertObsidianImageSyntax(markdownContent);

  // Standard markdown images: ![alt](path) or ![alt](path "title")
  const markdownImageRegex = /!\[([^\]]*)\]\(([^\)\s]+)(?:\s+"([^"]*)")?\)/g;
  markdownImageRegex.lastIndex = 0;

  let match;
  let position = 0;
  while ((match = markdownImageRegex.exec(convertedContent)) !== null) {
    const imgPath = match[2];
    if (!imgPath) continue;
    if (imgPath.startsWith("http://") || imgPath.startsWith("https://"))
      continue;
    if (!isLikelyImagePath(imgPath)) continue;

    const fileName = imgPath.split("/").pop() || imgPath;
    imageInfos.push({ path: imgPath, fileName, position: position++ });
  }

  return imageInfos;
}

function parseArgs(argv) {
  const out = {
    file: null,
    config: null,
    public: false,
    allowCopy: false,
    allowCreateCopy: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") {
      out.help = true;
    } else if (a === "--file") {
      out.file = argv[i + 1] || null;
      i++;
    } else if (a === "--config") {
      out.config = argv[i + 1] || null;
      i++;
    } else if (a === "--public") {
      out.public = true;
    } else if (a === "--allow-copy") {
      out.allowCopy = true;
    } else if (a === "--allow-create-copy") {
      out.allowCreateCopy = true;
    } else {
      throw new Error(`Unknown arg: ${a}`);
    }
  }

  return out;
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function findVaultRoot(startDir) {
  let dir = startDir;
  for (;;) {
    const candidate = path.join(dir, ".obsidian");
    if (await fileExists(candidate)) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function guessImageMimeType(fileNameOrPath) {
  const lower = String(fileNameOrPath).toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  if (lower.endsWith(".bmp")) return "image/bmp";
  return "application/octet-stream";
}

async function resolveLocalImagePath(imagePath, { vaultRoot, noteDir }) {
  if (!imagePath || typeof imagePath !== "string") return null;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
    return null;

  // Strip leading ./
  const cleaned = imagePath.replace(/^\.\//, "");

  const candidates = [];
  const isAbs = path.isAbsolute(cleaned) || /^[A-Za-z]:\\/.test(cleaned);
  if (isAbs) {
    candidates.push(cleaned);
  } else {
    if (vaultRoot) candidates.push(path.resolve(vaultRoot, cleaned));
    if (noteDir) candidates.push(path.resolve(noteDir, cleaned));

    // Common Obsidian default: attachments/<filename>
    const baseName = path.basename(cleaned);
    if (vaultRoot && baseName === cleaned) {
      candidates.push(path.resolve(vaultRoot, "attachments", baseName));
    }
  }

  for (const c of candidates) {
    if (await fileExists(c)) {
      return c;
    }
  }
  return null;
}

async function loadJsonConfig(configPath) {
  const raw = await fs.readFile(configPath, "utf8");
  const cfg = JSON.parse(raw);
  return {
    appId: typeof cfg.appId === "string" ? cfg.appId : undefined,
    appSecret: typeof cfg.appSecret === "string" ? cfg.appSecret : undefined,
    folderToken:
      typeof cfg.folderToken === "string" ? cfg.folderToken : undefined,
    userId: typeof cfg.userId === "string" ? cfg.userId : undefined,
  };
}

async function resolveCredentials(explicitConfigPath) {
  const defaultConfigPath = path.resolve(__dirname, "..", "config.local.json");
  const configPath =
    explicitConfigPath ||
    ((await fileExists(defaultConfigPath)) ? defaultConfigPath : null);

  if (configPath) {
    const cfg = await loadJsonConfig(configPath);
    return {
      ...cfg,
      _source: `config:${configPath}`,
    };
  }

  return {
    appId: process.env.FEISHU_APP_ID,
    appSecret: process.env.FEISHU_APP_SECRET,
    folderToken: process.env.FEISHU_FOLDER_TOKEN,
    userId: process.env.FEISHU_USER_ID,
    _source: "env",
  };
}

function requireNonEmpty(value, name) {
  if (!value || typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing required credential: ${name}`);
  }
  return value;
}

async function feishuJsonFetch(url, init) {
  const res = await fetch(url, init);
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(
      `Non-JSON response (${res.status}) from ${url}: ${text.slice(0, 2000)}`,
    );
  }
  if (!res.ok) {
    const msg = typeof json?.msg === "string" ? json.msg : `HTTP ${res.status}`;
    throw new Error(`HTTP error from ${url}: ${msg}`);
  }
  return json;
}

async function getTenantAccessToken({ appId, appSecret }) {
  const url =
    "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal";
  const json = await feishuJsonFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
  });

  if (json.code !== 0 || !json.tenant_access_token) {
    throw new Error(
      `Failed to get tenant access token: ${json.msg || "unknown error"}`,
    );
  }

  return {
    token: json.tenant_access_token,
    expireSeconds: json.expire,
  };
}

async function uploadMarkdownFile({
  token,
  markdownBytes,
  fileName,
  folderToken,
}) {
  const url = "https://open.feishu.cn/open-apis/drive/v1/files/upload_all";
  const data = markdownBytes;

  const form = new FormData();
  form.append("file_name", fileName);
  form.append("parent_type", "explorer");
  if (folderToken) {
    form.append("parent_node", folderToken);
  }
  form.append("size", String(data.byteLength));

  form.append(
    "file",
    new Blob([data], { type: "text/markdown; charset=utf-8" }),
    fileName,
  );

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(
      `Upload failed (HTTP ${res.status}): ${JSON.stringify(json)}`,
    );
  }
  if (json.code !== 0 || !json.data?.file_token) {
    throw new Error(`Upload failed: ${json.msg || "unknown error"}`);
  }

  return json.data.file_token;
}

async function getDocumentBlocksPaged({ token, documentId }) {
  const all = [];
  let pageToken = null;

  for (;;) {
    const url = new URL(
      `https://open.feishu.cn/open-apis/docx/v1/documents/${documentId}/blocks`,
    );
    if (pageToken) {
      url.searchParams.set("page_token", pageToken);
    }

    const json = await feishuJsonFetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=utf-8",
      },
    });

    if (json.code !== 0) {
      throw new Error(`Get doc blocks failed: ${json.msg || "unknown error"}`);
    }

    const items = Array.isArray(json.data?.items) ? json.data.items : [];
    all.push(...items);

    const hasMore = Boolean(json.data?.has_more);
    const next =
      typeof json.data?.page_token === "string" ? json.data.page_token : null;
    if (!hasMore) break;
    if (!next) break;
    pageToken = next;
  }

  return all;
}

async function uploadImageMaterial({
  token,
  documentId,
  blockId,
  fileName,
  fileBytes,
}) {
  const url = "https://open.feishu.cn/open-apis/drive/v1/medias/upload_all";

  const form = new FormData();
  form.append("file_name", fileName);
  form.append("parent_type", "docx_image");
  form.append("parent_node", blockId);
  form.append("size", String(fileBytes.byteLength));
  form.append("extra", JSON.stringify({ drive_route_token: documentId }));
  form.append(
    "file",
    new Blob([fileBytes], { type: guessImageMimeType(fileName) }),
    fileName,
  );

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(
      `Image upload failed (HTTP ${res.status}): ${JSON.stringify(json)}`,
    );
  }
  if (json.code !== 0 || !json.data?.file_token) {
    throw new Error(`Image upload failed: ${json.msg || "unknown error"}`);
  }

  return json.data.file_token;
}

async function replaceDocImageBlock({
  token,
  documentId,
  blockId,
  imageToken,
  width = 800,
  height = 600,
}) {
  const url = `https://open.feishu.cn/open-apis/docx/v1/documents/${documentId}/blocks/${blockId}?document_revision_id=-1`;
  const body = {
    replace_image: {
      token: imageToken,
      width,
      height,
      align: 2,
    },
  };

  const json = await feishuJsonFetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body),
  });

  if (json.code !== 0) {
    throw new Error(`Replace image failed: ${json.msg || "unknown error"}`);
  }
}

async function processLocalImagesInDocument({
  token,
  documentId,
  markdownContent,
  noteFilePath,
}) {
  const images = extractImageInfoFromMarkdown(markdownContent);
  if (images.length === 0) {
    return { found: 0, succeeded: 0, failed: 0 };
  }

  const noteDir = path.dirname(noteFilePath);
  const vaultRoot = (await findVaultRoot(noteDir)) || process.cwd();
  process.stderr.write(`[feishu-obshare] image refs: ${images.length}\n`);
  process.stderr.write(`[feishu-obshare] vault root: ${vaultRoot}\n`);

  const blocks = await getDocumentBlocksPaged({ token, documentId });
  const imageBlocks = blocks.filter((b) => b && b.block_type === 27);
  if (imageBlocks.length === 0) {
    throw new Error(
      "No image blocks found in imported doc; check image syntax conversion",
    );
  }

  let succeeded = 0;
  let failed = 0;
  const count = Math.min(images.length, imageBlocks.length);

  for (let i = 0; i < count; i++) {
    const imageInfo = images[i];
    const imageBlock = imageBlocks[i];
    if (!imageInfo || !imageBlock) continue;

    try {
      const absPath = await resolveLocalImagePath(imageInfo.path, {
        vaultRoot,
        noteDir,
      });
      if (!absPath) {
        throw new Error(`Image file not found: ${imageInfo.path}`);
      }

      const bytes = await fs.readFile(absPath);
      const fileName = imageInfo.fileName || path.basename(absPath);

      process.stderr.write(
        `[feishu-obshare] image ${i + 1}/${count}: ${fileName}\n`,
      );

      const imageToken = await uploadImageMaterial({
        token,
        documentId,
        blockId: imageBlock.block_id,
        fileName,
        fileBytes: bytes,
      });

      await replaceDocImageBlock({
        token,
        documentId,
        blockId: imageBlock.block_id,
        imageToken,
      });

      succeeded++;
    } catch (err) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      process.stderr.write(`[feishu-obshare] image error: ${msg}\n`);
    }
  }

  process.stderr.write(
    `[feishu-obshare] images processed: ${succeeded}/${count} (failed: ${failed})\n`,
  );

  return { found: images.length, succeeded, failed };
}

async function createImportTask({ token, fileName, fileToken, folderToken }) {
  const url = "https://open.feishu.cn/open-apis/drive/v1/import_tasks";
  const lastDotIndex = fileName.lastIndexOf(".");
  const pureFileName =
    lastDotIndex > 0 ? fileName.slice(0, lastDotIndex) : fileName;

  const body = {
    file_extension: "md",
    file_name: pureFileName,
    type: "docx",
    file_token: fileToken,
    ...(folderToken
      ? {
          point: {
            mount_type: 1,
            mount_key: folderToken,
          },
        }
      : {}),
  };

  const json = await feishuJsonFetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body),
  });

  if (json.code !== 0 || !json.data?.ticket) {
    throw new Error(
      `Failed to create import task: ${json.msg || "unknown error"}`,
    );
  }
  return json.data.ticket;
}

async function queryImportTask({ token, ticket }) {
  const url = `https://open.feishu.cn/open-apis/drive/v1/import_tasks/${ticket}`;
  const json = await feishuJsonFetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  if (json.code !== 0) {
    throw new Error(`Import task query failed: ${json.msg || "unknown error"}`);
  }

  const result = json.data?.result || json.data;
  return result;
}

function formatDocumentUrl(url, docToken) {
  if (typeof url !== "string" || url.trim() === "") {
    return `https://open.feishu.cn/document/${docToken}`;
  }
  if (
    url.startsWith("https://") &&
    (url.includes("feishu.cn") || url.includes("larkoffice.com"))
  ) {
    return url;
  }
  if (!url.startsWith("http")) {
    return `https://open.feishu.cn/document/${docToken}`;
  }
  return url;
}

async function waitForImportTask({ token, ticket, maxRetries = 7 }) {
  let retry = 0;
  while (retry <= maxRetries) {
    const r = await queryImportTask({ token, ticket });
    const status = r?.job_status;

    if (status === 0) {
      if (!r.token) {
        throw new Error("Import task finished but did not return doc token");
      }
      return {
        docToken: r.token,
        url: formatDocumentUrl(r.url, r.token),
      };
    }

    if (status === 1 || status === 2) {
      retry++;
      if (retry > maxRetries) {
        throw new Error("Import task timed out; check Feishu folder manually");
      }
      const waitMs = retry >= 3 ? 6000 : 3000;
      await new Promise((resolve) => setTimeout(resolve, waitMs));
      continue;
    }

    const msg = r?.job_error_msg
      ? String(r.job_error_msg)
      : `unknown job_status=${String(status)}`;
    throw new Error(`Import task failed: ${msg}`);
  }

  throw new Error("Import task failed: exceeded retries");
}

async function setPublicPermissions({
  token,
  docToken,
  allowCopy,
  allowCreateCopy,
}) {
  const url = `https://open.feishu.cn/open-apis/drive/v2/permissions/${docToken}/public?type=docx`;
  const body = {
    external_access_entity: "open",
    link_share_entity: "anyone_readable",
    ...(allowCopy ? { copy_entity: "anyone_can_view" } : {}),
    ...(allowCreateCopy ? { security_entity: "anyone_can_view" } : {}),
  };

  const json = await feishuJsonFetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body),
  });

  if (json.code !== 0) {
    throw new Error(`Permission update failed: ${json.msg || "unknown error"}`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(usage() + "\n");
    return;
  }

  if (!args.file) {
    throw new Error("Missing --file");
  }

  const filePath = path.resolve(process.cwd(), args.file);
  if (!(await fileExists(filePath))) {
    throw new Error(`File not found: ${filePath}`);
  }

  const creds = await resolveCredentials(args.config);
  const appId = requireNonEmpty(creds.appId, "appId");
  const appSecret = requireNonEmpty(creds.appSecret, "appSecret");
  const folderToken = requireNonEmpty(creds.folderToken, "folderToken");

  const fileName = path.basename(filePath);
  process.stderr.write(`[feishu-obshare] creds source: ${creds._source}\n`);
  process.stderr.write(`[feishu-obshare] uploading: ${fileName}\n`);

  const originalMarkdown = await fs.readFile(filePath, "utf8");
  const convertedMarkdown = convertObsidianImageSyntax(originalMarkdown);
  const markdownBytes = new TextEncoder().encode(convertedMarkdown);

  const { token } = await getTenantAccessToken({ appId, appSecret });
  const fileToken = await uploadMarkdownFile({
    token,
    markdownBytes,
    fileName,
    folderToken,
  });
  const ticket = await createImportTask({
    token,
    fileName,
    fileToken,
    folderToken,
  });
  const { docToken, url } = await waitForImportTask({ token, ticket });

  // Image post-processing (ObShare-style)
  await processLocalImagesInDocument({
    token,
    documentId: docToken,
    markdownContent: originalMarkdown,
    noteFilePath: filePath,
  });

  if (args.public) {
    await setPublicPermissions({
      token,
      docToken,
      allowCopy: args.allowCopy,
      allowCreateCopy: args.allowCreateCopy,
    });
  }

  process.stdout.write(JSON.stringify({ docToken, url }) + "\n");
}

main().catch((err) => {
  const msg = err instanceof Error ? err.message : String(err);
  process.stderr.write(`[feishu-obshare] error: ${msg}\n`);
  process.stderr.write(usage() + "\n");
  process.exit(1);
});

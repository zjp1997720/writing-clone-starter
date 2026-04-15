import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

interface WechatConfig {
  appId: string;
  appSecret: string;
}

interface AccessTokenResponse {
  access_token?: string;
  errcode?: number;
  errmsg?: string;
}

interface UploadResponse {
  media_id: string;
  url: string;
  errcode?: number;
  errmsg?: string;
}

interface PublishResponse {
  media_id?: string;
  errcode?: number;
  errmsg?: string;
}

interface CurlResult {
  stdout: string;
  stderr: string;
  status: number;
}

type ArticleType = "news" | "newspic";

interface ArticleOptions {
  title: string;
  author?: string;
  digest?: string;
  content: string;
  thumbMediaId: string;
  articleType: ArticleType;
  imageMediaIds?: string[];
}

const TOKEN_URL = "https://api.weixin.qq.com/cgi-bin/token";
const UPLOAD_URL = "https://api.weixin.qq.com/cgi-bin/material/add_material";
const DRAFT_URL = "https://api.weixin.qq.com/cgi-bin/draft/add";

function runCurl(args: string[], input?: string): CurlResult {
  const result = spawnSync("curl", args, {
    input,
    encoding: "utf-8",
    maxBuffer: 20 * 1024 * 1024,
  });

  return {
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    status: result.status ?? 0,
  };
}

function curlJson<T>(args: string[], input?: string): T {
  const result = runCurl(args, input);
  if (result.status !== 0) {
    const detail = result.stderr.trim() || result.stdout.trim();
    throw new Error(`curl failed (${result.status}): ${detail}`);
  }
  try {
    return JSON.parse(result.stdout) as T;
  } catch (error) {
    throw new Error(
      `Failed to parse JSON response: ${error instanceof Error ? error.message : String(error)}\n${result.stdout}`,
    );
  }
}

function downloadRemoteImage(imageUrl: string): string {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "wechat-api-img-"));
  const urlPath = imageUrl.split("?")[0] || "";
  const rawName = path.basename(urlPath) || "image.jpg";
  const filename = /\.[a-zA-Z0-9]+$/.test(rawName) ? rawName : `${rawName}.jpg`;
  const outputPath = path.join(tempDir, filename);

  const result = runCurl(["-L", "-sS", "--fail", "-o", outputPath, imageUrl]);
  if (
    result.status !== 0 ||
    !fs.existsSync(outputPath) ||
    fs.statSync(outputPath).size === 0
  ) {
    const detail = result.stderr.trim() || result.stdout.trim() || imageUrl;
    throw new Error(`Failed to download image: ${detail}`);
  }

  return outputPath;
}

function loadEnvFile(envPath: string): Record<string, string> {
  const env: Record<string, string> = {};
  if (!fs.existsSync(envPath)) return env;

  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      let value = trimmed.slice(eqIdx + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    }
  }
  return env;
}

function loadConfig(): WechatConfig {
  const cwdEnvPath = path.join(process.cwd(), ".baoyu-skills", ".env");
  const homeEnvPath = path.join(os.homedir(), ".baoyu-skills", ".env");

  const cwdEnv = loadEnvFile(cwdEnvPath);
  const homeEnv = loadEnvFile(homeEnvPath);

  const appId =
    process.env.WECHAT_APP_ID || cwdEnv.WECHAT_APP_ID || homeEnv.WECHAT_APP_ID;
  const appSecret =
    process.env.WECHAT_APP_SECRET ||
    cwdEnv.WECHAT_APP_SECRET ||
    homeEnv.WECHAT_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error(
      "Missing WECHAT_APP_ID or WECHAT_APP_SECRET.\n" +
        "Set via environment variables or in .baoyu-skills/.env file.",
    );
  }

  return { appId, appSecret };
}

async function fetchAccessToken(
  appId: string,
  appSecret: string,
): Promise<string> {
  const url = `${TOKEN_URL}?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
  const data = curlJson<AccessTokenResponse>(["-sS", "--fail", url]);
  if (data.errcode) {
    throw new Error(`Access token error ${data.errcode}: ${data.errmsg}`);
  }
  if (!data.access_token) {
    throw new Error("No access_token in response");
  }
  return data.access_token;
}

async function uploadImage(
  imagePath: string,
  accessToken: string,
  baseDir?: string,
): Promise<UploadResponse> {
  let uploadPath: string;
  let tempPath: string | undefined;
  let contentType: string;

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    tempPath = downloadRemoteImage(imagePath);
    uploadPath = tempPath;
    const ext = path.extname(uploadPath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
    };
    contentType = mimeTypes[ext] || "image/jpeg";
  } else {
    const resolvedPath = path.isAbsolute(imagePath)
      ? imagePath
      : path.resolve(baseDir || process.cwd(), imagePath);

    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Image not found: ${resolvedPath}`);
    }
    const stats = fs.statSync(resolvedPath);
    if (stats.size === 0) {
      throw new Error(`Local image is empty: ${resolvedPath}`);
    }
    uploadPath = resolvedPath;
    const ext = path.extname(resolvedPath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
    };
    contentType = mimeTypes[ext] || "image/jpeg";
  }

  const url = `${UPLOAD_URL}?access_token=${accessToken}&type=image`;
  const data = curlJson<UploadResponse>([
    "-sS",
    "--fail",
    "-F",
    `media=@${uploadPath};type=${contentType}`,
    url,
  ]);
  if (data.errcode && data.errcode !== 0) {
    throw new Error(`Upload failed ${data.errcode}: ${data.errmsg}`);
  }

  if (data.url?.startsWith("http://")) {
    data.url = data.url.replace(/^http:\/\//i, "https://");
  }

  if (tempPath) {
    fs.rmSync(path.dirname(tempPath), { recursive: true, force: true });
  }

  return data;
}

async function uploadImagesInHtml(
  html: string,
  accessToken: string,
  baseDir: string,
): Promise<{ html: string; firstMediaId: string; allMediaIds: string[] }> {
  const imgRegex = /<img[^>]*\ssrc=["']([^"']+)["'][^>]*>/gi;
  const matches = [...html.matchAll(imgRegex)];

  if (matches.length === 0) {
    return { html, firstMediaId: "", allMediaIds: [] };
  }

  let firstMediaId = "";
  let updatedHtml = html;
  const allMediaIds: string[] = [];

  for (const match of matches) {
    const [fullTag, src] = match;
    if (!src) continue;

    if (src.startsWith("https://mmbiz.qpic.cn")) {
      if (!firstMediaId) {
        firstMediaId = src;
      }
      continue;
    }

    const localPathMatch = fullTag.match(/data-local-path=["']([^"']+)["']/);
    const imagePath = localPathMatch ? localPathMatch[1]! : src;

    console.error(`[wechat-api] Uploading image: ${imagePath}`);
    try {
      const resp = await uploadImage(imagePath, accessToken, baseDir);
      const newTag = fullTag
        .replace(/\ssrc=["'][^"']+["']/, ` src="${resp.url}"`)
        .replace(/\sdata-local-path=["'][^"']+["']/, "");
      updatedHtml = updatedHtml.replace(fullTag, newTag);
      allMediaIds.push(resp.media_id);
      if (!firstMediaId) {
        firstMediaId = resp.media_id;
      }
    } catch (err) {
      console.error(`[wechat-api] Failed to upload ${imagePath}:`, err);
    }
  }

  return { html: updatedHtml, firstMediaId, allMediaIds };
}

async function publishToDraft(
  options: ArticleOptions,
  accessToken: string,
): Promise<PublishResponse> {
  const url = `${DRAFT_URL}?access_token=${accessToken}`;

  let article: Record<string, unknown>;

  if (options.articleType === "newspic") {
    if (!options.imageMediaIds || options.imageMediaIds.length === 0) {
      throw new Error("newspic requires at least one image");
    }
    article = {
      article_type: "newspic",
      title: options.title,
      content: options.content,
      need_open_comment: 1,
      only_fans_can_comment: 0,
      image_info: {
        image_list: options.imageMediaIds.map((id) => ({ image_media_id: id })),
      },
    };
    if (options.author) article.author = options.author;
  } else {
    article = {
      article_type: "news",
      title: options.title,
      content: options.content,
      thumb_media_id: options.thumbMediaId,
      need_open_comment: 1,
      only_fans_can_comment: 0,
    };
    if (options.author) article.author = options.author;
    if (options.digest) article.digest = options.digest;
  }

  const data = curlJson<PublishResponse>([
    "-sS",
    "--fail",
    "-H",
    "Content-Type: application/json",
    "-X",
    "POST",
    "-d",
    JSON.stringify({ articles: [article] }),
    url,
  ]);
  if (data.errcode && data.errcode !== 0) {
    throw new Error(`Publish failed ${data.errcode}: ${data.errmsg}`);
  }

  return data;
}

function parseFrontmatter(content: string): {
  frontmatter: Record<string, string>;
  body: string;
} {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const frontmatter: Record<string, string> = {};
  const lines = match[1]!.split("\n");
  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      frontmatter[key] = value;
    }
  }

  return { frontmatter, body: match[2]! };
}

function renderMarkdownToHtml(
  markdownPath: string,
  theme: string = "dapeng-editorial",
): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const renderScript = path.join(__dirname, "md", "render.ts");
  const baseDir = path.dirname(markdownPath);

  console.error(`[wechat-api] Rendering markdown with theme: ${theme}`);
  const result = spawnSync(
    "npx",
    ["-y", "bun", renderScript, markdownPath, "--theme", theme],
    {
      stdio: ["inherit", "pipe", "pipe"],
      cwd: baseDir,
    },
  );

  if (result.status !== 0) {
    const stderr = result.stderr?.toString() || "";
    throw new Error(`Render failed: ${stderr}`);
  }

  const htmlPath = markdownPath.replace(/\.md$/i, ".html");
  if (!fs.existsSync(htmlPath)) {
    throw new Error(`HTML file not generated: ${htmlPath}`);
  }

  return htmlPath;
}

function extractHtmlContent(htmlPath: string): string {
  const html = fs.readFileSync(htmlPath, "utf-8");
  const match = html.match(/<div id="output">([\s\S]*?)<\/div>\s*<\/body>/);
  if (match) {
    return match[1]!.trim();
  }
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return bodyMatch ? bodyMatch[1]!.trim() : html;
}

function printUsage(): never {
  console.log(`Publish article to WeChat Official Account draft using API

Usage:
  npx -y bun wechat-api.ts <file> [options]

Arguments:
  file                Markdown (.md) or HTML (.html) file

Options:
  --type <type>       Article type: news (文章, default) or newspic (图文)
  --title <title>     Override title
  --author <name>     Author name (max 16 chars)
  --summary <text>    Article summary/digest (max 128 chars)
  --theme <name>      Theme name for markdown (dapeng-editorial, default, grace, simple, apple, byte, notion, claude). Default: dapeng-editorial
  --cover <path>      Cover image path (local or URL)
  --dry-run           Parse and render only, don't publish
  --help              Show this help

Frontmatter Fields (markdown):
  title               Article title
  author              Author name
  digest/summary      Article summary
  coverImage/featureImage/cover/image   Cover image path

Comments:
  Comments are enabled by default, open to all users.

Environment Variables:
  WECHAT_APP_ID       WeChat App ID
  WECHAT_APP_SECRET   WeChat App Secret

Config File Locations (in priority order):
  1. Environment variables
  2. <cwd>/.baoyu-skills/.env
  3. ~/.baoyu-skills/.env

Example:
  npx -y bun wechat-api.ts article.md
  npx -y bun wechat-api.ts article.md --theme notion --cover cover.png
  npx -y bun wechat-api.ts article.md --author "Author Name" --summary "Brief intro"
  npx -y bun wechat-api.ts article.html --title "My Article"
  npx -y bun wechat-api.ts images/ --type newspic --title "Photo Album"
  npx -y bun wechat-api.ts article.md --dry-run
`);
  process.exit(0);
}

interface CliArgs {
  filePath: string;
  isHtml: boolean;
  articleType: ArticleType;
  title?: string;
  author?: string;
  summary?: string;
  theme: string;
  cover?: string;
  dryRun: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    printUsage();
  }

  const args: CliArgs = {
    filePath: "",
    isHtml: false,
    articleType: "news",
    theme: "dapeng-editorial",
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg === "--type" && argv[i + 1]) {
      const t = argv[++i]!.toLowerCase();
      if (t === "news" || t === "newspic") {
        args.articleType = t;
      }
    } else if (arg === "--title" && argv[i + 1]) {
      args.title = argv[++i];
    } else if (arg === "--author" && argv[i + 1]) {
      args.author = argv[++i];
    } else if (arg === "--summary" && argv[i + 1]) {
      args.summary = argv[++i];
    } else if (arg === "--theme" && argv[i + 1]) {
      args.theme = argv[++i]!;
    } else if (arg === "--cover" && argv[i + 1]) {
      args.cover = argv[++i];
    } else if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (
      arg.startsWith("--") &&
      argv[i + 1] &&
      !argv[i + 1]!.startsWith("-")
    ) {
      i++;
    } else if (!arg.startsWith("-")) {
      args.filePath = arg;
    }
  }

  if (!args.filePath) {
    console.error("Error: File path required");
    process.exit(1);
  }

  args.isHtml = args.filePath.toLowerCase().endsWith(".html");

  return args;
}

function extractHtmlTitle(html: string): string {
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (titleMatch) return titleMatch[1]!;
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match) return h1Match[1]!.replace(/<[^>]+>/g, "").trim();
  return "";
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  const filePath = path.resolve(args.filePath);
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  const baseDir = path.dirname(filePath);
  let title = args.title || "";
  let author = args.author || "";
  let digest = args.summary || "";
  let htmlPath: string;
  let htmlContent: string;
  let frontmatter: Record<string, string> = {};

  if (args.isHtml) {
    htmlPath = filePath;
    htmlContent = extractHtmlContent(htmlPath);
    const mdPath = filePath.replace(/\.html$/i, ".md");
    if (fs.existsSync(mdPath)) {
      const mdContent = fs.readFileSync(mdPath, "utf-8");
      const parsed = parseFrontmatter(mdContent);
      frontmatter = parsed.frontmatter;
      if (!title && frontmatter.title) title = frontmatter.title;
      if (!author) author = frontmatter.author || "";
      if (!digest)
        digest =
          frontmatter.summary ||
          frontmatter.digest ||
          frontmatter.description ||
          "";
    }
    if (!title) {
      title = extractHtmlTitle(fs.readFileSync(htmlPath, "utf-8"));
    }
    console.error(`[wechat-api] Using HTML file: ${htmlPath}`);
  } else {
    const content = fs.readFileSync(filePath, "utf-8");
    const parsed = parseFrontmatter(content);
    frontmatter = parsed.frontmatter;
    const body = parsed.body;

    title = title || frontmatter.title || "";
    if (!title) {
      const h1Match = body.match(/^#\s+(.+)$/m);
      if (h1Match) title = h1Match[1]!;
    }
    if (!author) author = frontmatter.author || "";
    if (!digest)
      digest =
        frontmatter.summary ||
        frontmatter.digest ||
        frontmatter.description ||
        "";

    console.error(`[wechat-api] Theme: ${args.theme}`);
    htmlPath = renderMarkdownToHtml(filePath, args.theme);
    console.error(`[wechat-api] HTML generated: ${htmlPath}`);
    htmlContent = extractHtmlContent(htmlPath);
  }

  if (!title) {
    console.error(
      "Error: No title found. Provide via --title, frontmatter, or <title> tag.",
    );
    process.exit(1);
  }

  if (digest && digest.length > 120) {
    const truncated = digest.slice(0, 117);
    const lastPunct = Math.max(
      truncated.lastIndexOf("。"),
      truncated.lastIndexOf("，"),
      truncated.lastIndexOf("；"),
      truncated.lastIndexOf("、"),
    );
    digest =
      lastPunct > 80 ? truncated.slice(0, lastPunct + 1) : truncated + "...";
    console.error(`[wechat-api] Digest truncated to ${digest.length} chars`);
  }

  console.error(`[wechat-api] Title: ${title}`);
  if (author) console.error(`[wechat-api] Author: ${author}`);
  if (digest) console.error(`[wechat-api] Digest: ${digest.slice(0, 50)}...`);
  console.error(`[wechat-api] Type: ${args.articleType}`);

  if (args.dryRun) {
    console.log(
      JSON.stringify(
        {
          articleType: args.articleType,
          title,
          author: author || undefined,
          digest: digest || undefined,
          htmlPath,
          contentLength: htmlContent.length,
        },
        null,
        2,
      ),
    );
    return;
  }

  const config = loadConfig();
  console.error("[wechat-api] Fetching access token...");
  const accessToken = await fetchAccessToken(config.appId, config.appSecret);

  console.error("[wechat-api] Uploading images...");
  const {
    html: processedHtml,
    firstMediaId,
    allMediaIds,
  } = await uploadImagesInHtml(htmlContent, accessToken, baseDir);
  htmlContent = processedHtml;

  let thumbMediaId = "";
  const rawCoverPath =
    args.cover ||
    frontmatter.coverImage ||
    frontmatter.featureImage ||
    frontmatter.cover ||
    frontmatter.image;
  const coverPath =
    rawCoverPath && !path.isAbsolute(rawCoverPath) && args.cover
      ? path.resolve(process.cwd(), rawCoverPath)
      : rawCoverPath;

  if (coverPath) {
    console.error(`[wechat-api] Uploading cover: ${coverPath}`);
    const coverResp = await uploadImage(coverPath, accessToken, baseDir);
    thumbMediaId = coverResp.media_id;
  } else if (firstMediaId) {
    if (firstMediaId.startsWith("https://")) {
      console.error(
        `[wechat-api] Uploading first image as cover: ${firstMediaId}`,
      );
      const coverResp = await uploadImage(firstMediaId, accessToken, baseDir);
      thumbMediaId = coverResp.media_id;
    } else {
      thumbMediaId = firstMediaId;
    }
  }

  if (args.articleType === "news" && !thumbMediaId) {
    console.error(
      "Error: No cover image. Provide via --cover, frontmatter.coverImage, or include an image in content.",
    );
    process.exit(1);
  }

  if (args.articleType === "newspic" && allMediaIds.length === 0) {
    console.error("Error: newspic requires at least one image in content.");
    process.exit(1);
  }

  console.error("[wechat-api] Publishing to draft...");
  const result = await publishToDraft(
    {
      title,
      author: author || undefined,
      digest: digest || undefined,
      content: htmlContent,
      thumbMediaId,
      articleType: args.articleType,
      imageMediaIds: args.articleType === "newspic" ? allMediaIds : undefined,
    },
    accessToken,
  );

  console.log(
    JSON.stringify(
      {
        success: true,
        media_id: result.media_id,
        title,
        articleType: args.articleType,
      },
      null,
      2,
    ),
  );

  console.error(
    `[wechat-api] Published successfully! media_id: ${result.media_id}`,
  );
}

await main().catch((err) => {
  console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});

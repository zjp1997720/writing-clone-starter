#!/usr/bin/env node

import fs from "fs";
import os from "os";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const vaultRoot = path.resolve(__dirname, "../../../..");
const envLocalPath = path.join(vaultRoot, ".env.local");

if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const [key, ...valueParts] = trimmed.split("=");
    if (!key || valueParts.length === 0) return;
    if (!process.env[key]) {
      process.env[key] = valueParts.join("=").trim();
    }
  });
}

const args = process.argv.slice(2);
const get = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};

let prompt = get("--prompt");
const promptFile = get("--prompt-file");
const output = get("--output") || "./generated-image.jpg";
const size = get("--size") || "2048x1152";

if (promptFile && fs.existsSync(promptFile)) {
  prompt = fs.readFileSync(promptFile, "utf8").trim();
}

if (!prompt) {
  console.error("Error: --prompt or --prompt-file is required");
  process.exit(1);
}

const apiKey =
  process.env.AIGCDESK_GEMINI_API_KEY || process.env.AIGCDESK_API_KEY;
if (!apiKey) {
  console.error(
    "Error: AIGCDESK_API_KEY not found in environment or .env.local",
  );
  process.exit(1);
}

const sizeMatch = /^(\d+)x(\d+)$/.exec(size);
if (!sizeMatch) {
  console.error(`Error: invalid --size value '${size}', expected WxH`);
  process.exit(1);
}

const width = Number(sizeMatch[1]);
const height = Number(sizeMatch[2]);
const requestedOutput = path.resolve(output);
fs.mkdirSync(path.dirname(requestedOutput), { recursive: true });

const formatHint = buildFormatHint(width, height);
const requestPrompt = `${prompt.trim()}\n\n${formatHint}`;

const requestBody = JSON.stringify({
  model: "gemini-3.1-flash-image-preview",
  messages: [
    {
      role: "user",
      content: requestPrompt,
    },
  ],
});

console.log(
  `Calling AIGCDesk Gemini image preview (size target: ${width}x${height})...`,
);

const req = https.request(
  {
    hostname: "api.aigcdesk.com",
    path: "/v1/chat/completions",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "Content-Length": Buffer.byteLength(requestBody),
    },
  },
  (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      if (res.statusCode && res.statusCode >= 400) {
        console.error(`API request failed with status ${res.statusCode}`);
        console.error(compactErrorBody(data));
        process.exit(1);
      }

      try {
        const response = JSON.parse(data);
        const content = response?.choices?.[0]?.message?.content;
        if (typeof content !== "string") {
          throw new Error(
            "Response did not contain choices[0].message.content as a string",
          );
        }

        const parsed = extractDataUri(content);
        const sourceExt = mimeToExtension(parsed.mime);
        const tempJpeg = path.join(
          os.tmpdir(),
          `gemini-image-preview-${Date.now()}-${Math.random().toString(16).slice(2)}${sourceExt}`,
        );
        fs.writeFileSync(tempJpeg, Buffer.from(parsed.base64, "base64"));

        try {
          materializeOutput(tempJpeg, requestedOutput, width, height);
        } finally {
          safeUnlink(tempJpeg);
        }

        console.log(`Image saved to: ${requestedOutput}`);
        console.log(
          `Model: ${response.model || "gemini-3.1-flash-image-preview"}`,
        );
        if (response.usage) {
          console.log(`Usage: ${JSON.stringify(response.usage)}`);
        }
      } catch (err) {
        console.error(
          `Failed to parse or save Gemini image response: ${err.message}`,
        );
        console.error(compactErrorBody(data));
        process.exit(1);
      }
    });
  },
);

req.on("error", (err) => {
  console.error(`Request failed: ${err.message}`);
  process.exit(1);
});

req.write(requestBody);
req.end();

function extractDataUri(content) {
  const match = content.match(
    /data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)/,
  );
  if (!match) {
    throw new Error(
      "No Markdown-wrapped base64 image data URI found in response content",
    );
  }

  return {
    mime: match[1],
    base64: match[2],
  };
}

function mimeToExtension(mime) {
  switch (mime) {
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/jpeg":
    case "image/jpg":
    default:
      return ".jpg";
  }
}

function materializeOutput(sourceJpegPath, outputPath, widthPx, heightPx) {
  const ext = path.extname(outputPath).toLowerCase();
  const wantsPng = ext === ".png";
  const tempResized = path.join(
    os.tmpdir(),
    `gemini-image-preview-resized-${Date.now()}-${Math.random().toString(16).slice(2)}.jpg`,
  );

  try {
    runSips(
      [
        "-z",
        String(heightPx),
        String(widthPx),
        sourceJpegPath,
        "--out",
        tempResized,
      ],
      "resize image",
    );

    if (wantsPng) {
      runSips(
        ["-s", "format", "png", tempResized, "--out", outputPath],
        "convert image to PNG",
      );
      return;
    }

    if (ext === ".jpg" || ext === ".jpeg" || ext === "") {
      fs.copyFileSync(tempResized, outputPath);
      return;
    }

    throw new Error(
      `Unsupported output extension '${ext}'. Use .jpg, .jpeg, or .png`,
    );
  } finally {
    safeUnlink(tempResized);
  }
}

function runSips(argsList, label) {
  const result = spawnSync("sips", argsList, { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(
      `${label} failed: ${(result.stderr || result.stdout || "unknown error").trim()}`,
    );
  }
}

function buildFormatHint(widthPx, heightPx) {
  const ratio = simplifyRatio(widthPx, heightPx);
  return `Return a single image. Target composition ratio ${ratio} and target output size ${widthPx}x${heightPx}. If exact size control is limited, still compose for this aspect ratio.`;
}

function simplifyRatio(widthPx, heightPx) {
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(widthPx, heightPx);
  return `${widthPx / divisor}:${heightPx / divisor}`;
}

function compactErrorBody(text) {
  const maxLength = 1200;
  if (!text) return "No response body";
  return text.length > maxLength
    ? `${text.slice(0, maxLength)}... [truncated]`
    : text;
}

function safeUnlink(filePath) {
  try {
    fs.unlinkSync(filePath);
  } catch {
    // ignore cleanup failures
  }
}

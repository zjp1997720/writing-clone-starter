#!/usr/bin/env node
/**
 * tuzi-image-generate.mjs
 * CLI wrapper for Tuzi API image generation (qwen-image-2.0 etc.)
 *
 * Usage:
 *   node tuzi-image-generate.mjs \
 *     --model qwen-image-2.0 \
 *     --prompt "..." \
 *     --out-dir "05_附件/图片/qwen-image" \
 *     [--size 2048x1152] \
 *     [--n 1] \
 *     [--filename custom-name.png]
 *
 * Env:
 *   TUZI_API_KEY  (required)
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { URL } from 'url';
import { fileURLToPath } from 'url';

// ── Load .env.local from vault root ─────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Navigate up to vault root (assuming script is in .claude/skills/qwen-image/scripts/tuzi/)
const vaultRoot = path.resolve(__dirname, '../../../../..');
const envLocalPath = path.join(vaultRoot, '.env.local');

if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  });
}

// ── Parse args ──────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const get = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};

const model    = get('--model')    || 'qwen-image-2.0';
const prompt   = get('--prompt');
const outDir   = get('--out-dir')  || '05_附件/图片/qwen-image';
const size     = get('--size')     || '2048x1152';
const n        = parseInt(get('--n') || '1', 10);
const filename = get('--filename');

if (!prompt) {
  console.error('Error: --prompt is required');
  process.exit(1);
}

const apiKey = process.env.TUZI_API_KEY;
if (!apiKey) {
  console.error('Error: TUZI_API_KEY env var is not set');
  process.exit(1);
}

// ── Ensure output dir exists ─────────────────────────────────────────────────
fs.mkdirSync(outDir, { recursive: true });

// ── Call API ─────────────────────────────────────────────────────────────────
const body = JSON.stringify({ model, prompt, size, n });

async function callApi() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.tu-zi.com',
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    const file = fs.createWriteStream(dest);
    protocol.get(url, (res) => {
      // Handle redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

function extractUrls(response) {
  // Shape A: { data: { images: [{ url }] } }
  if (response.data && response.data.images) {
    return response.data.images.map(i => i.url).filter(Boolean);
  }
  // Shape B: { data: [{ url }] }
  if (Array.isArray(response.data)) {
    const urls = response.data.map(i => i.url).filter(Boolean);
    if (urls.length > 0) return urls;
  }
  return [];
}

function extractB64(response) {
  if (Array.isArray(response.data)) {
    return response.data.map(i => i.b64_json).filter(Boolean);
  }
  return [];
}

(async () => {
  try {
    console.error(`Calling Tuzi API (model: ${model}, size: ${size})...`);
    const response = await callApi();

    const urls = extractUrls(response);
    const b64s = extractB64(response);
    if (urls.length === 0 && b64s.length === 0) {
      console.error('No image URLs or b64_json in response:', JSON.stringify(response, null, 2).slice(0, 500));
      process.exit(1);
    }

    const useB64 = urls.length === 0;
    const items = useB64 ? b64s : urls;
    const savedFiles = [];
    const timestamp = Date.now();

    for (let i = 0; i < items.length; i++) {
      let outFilename;
      if (filename) {
        outFilename = items.length > 1 ? `${path.basename(filename, path.extname(filename))}-${i + 1}${path.extname(filename)}` : filename;
      } else {
        outFilename = `qwen-image-${timestamp}${items.length > 1 ? `-${i + 1}` : ''}.png`;
      }
      const outPath = path.join(outDir, outFilename);

      console.error(`Saving image ${i + 1}/${items.length}...`);
      if (useB64) {
        fs.writeFileSync(outPath, Buffer.from(b64s[i], 'base64'));
      } else {
        await downloadFile(urls[i], outPath);
      }
      savedFiles.push(outPath);
      console.log(outPath);
    }

    // Write JSON log
    const logPath = path.join(outDir, `qwen-image-${timestamp}.log.json`);
    fs.writeFileSync(logPath, JSON.stringify({ model, prompt, size, n, response, savedFiles, timestamp }, null, 2));
    console.error(`Log saved: ${logPath}`);

  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();

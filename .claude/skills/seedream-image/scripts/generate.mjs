#!/usr/bin/env node
/**
 * generate.mjs
 * CLI wrapper for Doubao Seedream API image generation
 *
 * Usage:
 *   node generate.mjs \
 *     --prompt "图片描述" \
 *     --output "./output.png" \
 *     [--size 2048x1152] \
 *     [--prompt-file ./prompt.md]
 *
 * Env:
 *   SEEDREAM_API_KEY (required, auto-loaded from .env.local)
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// ── Load .env.local from vault root ─────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Navigate up to vault root (script is in .claude/skills/seedream-image/scripts/)
const vaultRoot = path.resolve(__dirname, '../../../..');
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

let prompt = get('--prompt');
const promptFile = get('--prompt-file');
const output = get('--output') || './generated-image.png';
const size = get('--size') || '2304x1728';  // Default: 4:3 ratio, high quality

// Load prompt from file if specified
if (promptFile && fs.existsSync(promptFile)) {
  prompt = fs.readFileSync(promptFile, 'utf8').trim();
}

if (!prompt) {
  console.error('Error: --prompt or --prompt-file is required');
  process.exit(1);
}

const apiKey = process.env.SEEDREAM_API_KEY;
if (!apiKey) {
  console.error('Error: SEEDREAM_API_KEY not found in environment or .env.local');
  process.exit(1);
}

// ── Map size to API format ──────────────────────────────────────────────────
// Note: API requires minimum 3,686,400 pixels (3.69MP)
const sizeMap = {
  // 16:9 ratio (horizontal)
  '2048x1152': '2048x1152',  // 2.36MP (standard)
  '1920x1080': '1920x1080',  // 2.07MP (FHD)
  '2560x1440': '2560x1440',  // 3.69MP (2K, meets minimum)
  '3840x2160': '3840x2160',  // 8.29MP (4K)

  // 4:3 ratio (horizontal)
  '2304x1728': '2304x1728',  // 3.98MP (max for 4:3)

  // 3:4 ratio (vertical)
  '1242x1660': '1242x1660',  // 2.06MP (Xiaohongshu, below minimum)
  '1920x2560': '1920x2560',  // 4.92MP (meets minimum)
  '2304x3072': '2304x3072',  // 7.08MP (high quality)

  // 1:1 ratio (square)
  '1024x1024': '1024x1024',  // 1.05MP (below minimum)
  '1920x1920': '1920x1920',  // 3.69MP (meets minimum)
  '2048x2048': '2048x2048',  // 4.19MP (high quality)

  // 9:16 ratio (vertical)
  '1080x1920': '1080x1920',  // 2.07MP (below minimum)
  '1440x2560': '1440x2560',  // 3.69MP (meets minimum)
  '2160x3840': '2160x3840'   // 8.29MP (4K vertical)
};

const apiSize = sizeMap[size] || '2304x1728';

// ── Call Seedream API ───────────────────────────────────────────────────────
console.log(`Calling Seedream API (model: doubao-seedream-5-0-260128, size: ${apiSize})...`);

const requestBody = JSON.stringify({
  model: 'doubao-seedream-5-0-260128',
  prompt: prompt,
  sequential_image_generation: 'disabled',
  response_format: 'url',
  size: apiSize,
  stream: false,
  watermark: true
});

const options = {
  hostname: 'ark.cn-beijing.volces.com',
  path: '/api/v3/images/generations',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'Content-Length': Buffer.byteLength(requestBody)
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);

      if (response.data && response.data[0] && response.data[0].url) {
        const imageUrl = response.data[0].url;
        console.log(`Image generated: ${imageUrl}`);

        // Download image
        downloadImage(imageUrl, output);
      } else {
        console.error('No image URL in response:', JSON.stringify(response, null, 2));
        process.exit(1);
      }
    } catch (err) {
      console.error('Failed to parse response:', err.message);
      console.error('Response:', data);
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.error('Request failed:', err.message);
  process.exit(1);
});

req.write(requestBody);
req.end();

// ── Download image ──────────────────────────────────────────────────────────
function downloadImage(url, outputPath) {
  const file = fs.createWriteStream(outputPath);

  https.get(url, (response) => {
    response.pipe(file);

    file.on('finish', () => {
      file.close();
      console.log(`Image saved to: ${outputPath}`);
    });
  }).on('error', (err) => {
    fs.unlink(outputPath, () => {});
    console.error('Failed to download image:', err.message);
    process.exit(1);
  });
}

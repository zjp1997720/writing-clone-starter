---
name: qwen-image
description: |
  Generate images via Qwen-Image (qwen-image-2.0) using Tuzi API /v1/images/generations. Use for 文生图/生图, article illustrations, posters, infographics, covers. Defaults to 2K 16:9 (2048x1152) output. Keywords: qwen-image, qwen image, qwen-image-2.0, 兔子API, Tuzi API, 文生图, 生图, 配图, 信息图, 海报.
---

# Qwen Image (Tuzi API)

This skill provides a stable CLI interface that other skills (e.g. article illustrators) can invoke to generate images.

## Quick Start

1. Provide API key via env var (never hardcode in repo):

```bash
export TUZI_API_KEY='YOUR_KEY'
```

Alternatively (local-only): put `TUZI_API_KEY=...` in repo root `.env.local` (gitignored).

2. Generate a 2K 16:9 image (default):

```bash
node scripts/tuzi/tuzi-image-generate.mjs \
  --model qwen-image-2.0 \
  --prompt "一张文章配图：..." \
  --out-dir "05_附件/图片/qwen-image"
```

Defaults:

- `--size` defaults to `2048x1152` (16:9, 2K)
- `--n` defaults to `1`

The CLI prints saved image file paths (one per line) plus a JSON log file path.

## Prompt Template (Article Illustration)

Use a short, unambiguous prompt with explicit layout/typography constraints:

```text
16:9, 2048x1152. Article illustration.
Subject: <what the picture should show>.
Style: clean, modern, high contrast, no watermark, no QR code.
Text in image: none (unless explicitly required).
```

If you need Chinese text rendered in the image, explicitly say:

- "中文文字必须清晰可读，字体自然不乱码，英文单词拼写必须准确"

## Output & Storage

Recommended output directory:

- `05_附件/图片/qwen-image/`

Each run also writes a JSON log (request + response + file list) into the same directory.

## Reference

- Tuzi API overview and endpoint notes: `references/tuzi-api.md`

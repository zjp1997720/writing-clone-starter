---
name: seedream-image
description: Generate images using Doubao Seedream API (doubao-seedream-5-0-260128). Use for article illustrations, infographics, and visual content generation. Triggers on "generate image", "create image", "生成图片", "配图", "seedream", "豆包生图". Default backend for baoyu-article-illustrator.
---

# Seedream Image Generator

Generate high-quality images using Doubao's Seedream API (doubao-seedream-5-0-260128 model). Optimized for Chinese prompts and article illustrations.

## Quick Start

```bash
# Basic usage (defaults to 2K 16:9)
/seedream-image "星际穿越，黑洞，电影大片"

# With custom size and output
/seedream-image "商业插图，简约风格" --size 1024x1024 --output ./illustration.png

# From prompt file
/seedream-image --prompt-file ./prompts/cover.md --output ./cover.png
```

## Options

| Option          | Default                 | Description             |
| --------------- | ----------------------- | ----------------------- |
| `--prompt`      | (required)              | Image prompt text       |
| `--output`      | `./generated-image.png` | Output file path        |
| `--size`        | `2560x1440`             | Image dimensions (WxH)  |
| `--prompt-file` | -                       | Read prompt from file   |

## Size Presets

⚠️ **API minimum**: 3,686,400 pixels (3.69MP). Any size below this will return `InvalidParameter` error.

| Ratio    | Size          | Pixels | Use Case                                           |
| -------- | ------------- | ------ | -------------------------------------------------- |
| **16:9** | **2560x1440** | 3.69MP | **Default: articles, presentations (API minimum)** |
| 16:9     | 3840x2160     | 8.29MP | 4K (highest quality)                               |
| 16:9     | 2048x1152     | 2.36MP | ❌ Below API minimum — will fail                   |
| 16:9     | 1920x1080     | 2.07MP | ❌ Below API minimum — will fail                   |
| 4:3      | 2304x1728     | 3.98MP | Horizontal, high quality                           |
| **3:4**  | **2304x3072** | 7.08MP | **Vertical, high quality (recommended)**           |
| 3:4      | 1920x2560     | 4.92MP | Vertical, medium quality                           |
| 3:4      | 1242x1660     | 2.06MP | ❌ Xiaohongshu — below API minimum, will fail      |
| 1:1      | 2048x2048     | 4.19MP | Square, high quality                               |
| 1:1      | 1920x1920     | 3.69MP | Square, meets API minimum                          |
| 1:1      | 1024x1024     | 1.05MP | ❌ Below API minimum — will fail                   |
| 9:16     | 2160x3840     | 8.29MP | 4K vertical (highest quality)                      |
| 9:16     | 1440x2560     | 3.69MP | Vertical, meets API minimum                        |
| 9:16     | 1080x1920     | 2.07MP | ❌ Stories/vertical — below API minimum, will fail |

## Baoyu Integration

This skill is the **default backend** for `baoyu-article-illustrator`.

| Caller Skill              | Typical Size           | Notes                              |
| ------------------------- | ---------------------- | ---------------------------------- |
| baoyu-article-illustrator | 2560x1440              | Article illustrations (API-safe)   |
| baoyu-xhs-images          | 1920x1920              | XHS square (minimum API-safe)      |
| baoyu-infographic         | 2560x1440 or 2304x3072 | Based on --aspect                  |
| baoyu-slide-deck          | 2560x1440              | Presentation slides (API-safe)     |

## Implementation

**Execute via:**

```bash
node .claude/skills/seedream-image/scripts/generate.mjs \
  --prompt "<prompt>" \
  --output "<path>" \
  --size "<WxH>"
```

The script automatically loads `SEEDREAM_API_KEY` from `.env.local` in vault root.

## Configuration

**Environment variable** (in `.env.local`):

```bash
SEEDREAM_API_KEY=your-api-key-here
```

The script will automatically load this from vault root.

## Error Handling

| Error           | Action                                   |
| --------------- | ---------------------------------------- |
| Missing API key | Prompt user to add to .env.local         |
| Invalid size    | Report error, suggest valid sizes        |
| API failure     | Report error message, suggest retry      |
| Network timeout | Report timeout, suggest checking network |

## API Reference

See `references/api-doc.md` for detailed API documentation.

---

**Last Updated**: 2026-03-07
**Model**: doubao-seedream-5-0-260128
**Default Size**: 2304x1728 (4:3, high quality)

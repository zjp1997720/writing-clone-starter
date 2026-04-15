---
name: gemini-image-preview
description: Generate images with AIGCDesk's gemini-3.1-flash-image-preview model. Use when the user explicitly wants Gemini image generation, AIGCDesk image generation, to test gemini-3.1-flash-image-preview, or when article-illustrator needs a fallback backend because seedream-image failed. Supports local file output from prompt text or prompt files.
---

# Gemini Image Preview

Generate images through AIGCDesk's OpenAI-compatible API using `gemini-3.1-flash-image-preview`.

This skill is designed to match the basic CLI contract of `seedream-image` so it can serve as a direct backend for `article-illustrator`.

## Quick Start

```bash
# Basic usage
/gemini-image-preview --prompt "蓝色咖啡杯放在白色桌面上，极简风格"

# Custom output path and size hint
/gemini-image-preview --prompt "商业手绘信息图，白板风格" --output ./illustration.png --size 2048x1152

# From prompt file
/gemini-image-preview --prompt-file ./prompts/cover.md --output ./cover.png
```

## Options

| Option          | Default                 | Description                                                   |
| --------------- | ----------------------- | ------------------------------------------------------------- |
| `--prompt`      | (required)              | Image prompt text                                             |
| `--output`      | `./generated-image.jpg` | Output file path                                              |
| `--size`        | `2048x1152`             | Requested output size; applied as a local post-process resize |
| `--prompt-file` | -                       | Read prompt from file                                         |

## Backend Contract

This backend intentionally follows the same surface shape as `seedream-image`:

```bash
node .claude/skills/gemini-image-preview/scripts/generate.mjs \
  --prompt "<prompt>" \
  --output "<path>" \
  --size "<WxH>"
```

Behavior contract:

1. exit code `0` on success
2. exit code `1` on failure
3. writes a real local image file to `--output`
4. prints model name, save path, and token usage

## Configuration

The script auto-loads `.env.local` from vault root.

Supported environment variables:

```bash
AIGCDESK_API_KEY=your-api-key-here
# optional alias
AIGCDESK_GEMINI_API_KEY=your-api-key-here
```

## Article Illustrator Integration

This skill is intended to work in two modes:

1. **Direct use**: user explicitly requests Gemini / AIGCDesk image generation
2. **Fallback backend**: `article-illustrator` first tries `seedream-image`, then falls back to this skill after a failed retry

Because AIGCDesk returns a Markdown-wrapped base64 image rather than a direct URL, this skill handles:

1. parsing `choices[0].message.content`
2. extracting the `data:image/...;base64,...` payload
3. decoding and saving locally
4. converting/resizing to the requested output format when needed

The upstream MIME type is parsed from the data URI, but the final saved format is controlled by the `--output` extension:

- `.png` → convert to PNG
- `.jpg` / `.jpeg` → save as JPEG

## Error Handling

| Error                    | Action                                                               |
| ------------------------ | -------------------------------------------------------------------- |
| Missing API key          | Tell user to add `AIGCDESK_API_KEY` to `.env.local`                  |
| Empty / invalid response | Report that response format changed or did not include image data    |
| Network / API failure    | Surface the API error and exit non-zero                              |
| Decode / convert failure | Report the exact failing step so callers can decide whether to retry |

## API Notes

This skill uses:

- `POST https://api.aigcdesk.com/v1/chat/completions`
- model: `gemini-3.1-flash-image-preview`

The current upstream behavior returns image data embedded inside Markdown content rather than a direct image URL.

See `references/api-doc.md` for the tested response pattern.

---

**Last Updated**: 2026-04-05
**Model**: gemini-3.1-flash-image-preview
**Default Size**: 2048x1152

---
name: article-illustrator
description: Smart article illustration skill. Analyzes article content and generates illustrations at positions requiring visual aids with multiple style options. Use when user asks to "add illustrations to article", "generate images for article", or "illustrate article".
---

# Smart Article Illustration Skill

Analyze article structure and content, identify positions requiring visual aids, and generate illustrations with flexible style options.

## Quick Mode (Default)

**Quick mode is enabled by default**, providing fully automated illustration generation:

- ✅ **No user confirmation required** - runs from start to finish
- ✅ **Default style is `business-whiteboard`** in a high-information-density infographic mode for knowledge-heavy article visuals
- ✅ **Default backend chain starts with `seedream-image`** (Doubao Seedream 5.0), then falls back to `gemini-image-preview` if Seedream fails after one retry
- ✅ **Auto-detect language** - uses article language for prompts
- ✅ **Auto-determine illustration count** - target about 1 body image per 400 characters, then align with article structure
- ✅ **Default to local relative paths** - write local paths first; only use image hosting when explicitly enabled
- ✅ **Auto-generate WeChat cover** - produces one extra cover image and writes back `coverImage`

```bash
# Quick mode (default)
/article-illustrator path/to/article.md

# Quick mode with specific style override
/article-illustrator path/to/article.md --style warm

# Normal mode (with confirmation)
/article-illustrator path/to/article.md --normal

# Skip image hosting upload entirely
/article-illustrator path/to/article.md --no-upload
```

## Usage

```bash
# Quick mode (default) - fully automated
/article-illustrator path/to/article.md

# Quick mode with specific style override
/article-illustrator path/to/article.md --style warm
/article-illustrator path/to/article.md --style minimal

# Normal mode - with user confirmation
/article-illustrator path/to/article.md --normal

# Specify backend
/article-illustrator path/to/article.md --backend z-image-turbo

# Skip image hosting upload entirely (force local paths)
/article-illustrator path/to/article.md --no-upload

# Combine options
/article-illustrator path/to/article.md --normal --style elegant --backend gemini-image-preview
```

## Options

| Option             | Default               | Description                                                                            |
| ------------------ | --------------------- | -------------------------------------------------------------------------------------- |
| `--style <name>`   | `business-whiteboard` | Specify illustration style (see Style Gallery below)                                   |
| `--quick`          | ✅ Enabled            | Quick mode: fully automated, no user confirmation                                      |
| `--normal`         | -                     | Normal mode: with user confirmation at key steps                                       |
| `--backend <name>` | `seedream-image`      | Explicit backend override; omit it to use the default Seedream → Gemini fallback chain |
| `--no-upload`      | -                     | Force local paths and skip upload detection entirely                                   |

## Output Contract

By default this skill now produces two visual outputs for a WeChat-ready article:

1. **Body illustrations** inserted into the article body
2. **One WeChat cover image** written back to article frontmatter as `coverImage`

Image references default to **local relative paths**.

- local relative paths are the default writeback mode
- uploaded URLs are optional and should only be used when image hosting is explicitly enabled by the workflow, extension config, or user request
- `--no-upload` remains a strict local-only override

Recommended frontmatter after this skill completes:

```yaml
---
title: 文章标题
summary: 公众号摘要
coverImage: ../illustrations/topic-slug/wechat-cover-topic.png
author: 作者名
---
```

## Image Generation Backends

| Backend                                | Quality   | Speed  | Resolution                              | Best For                                                |
| -------------------------------------- | --------- | ------ | --------------------------------------- | ------------------------------------------------------- |
| **`seedream-image`** (Default primary) | Excellent | Fast   | 2048×1152                               | **Chinese prompts, article illustrations**              |
| `gemini-image-preview`                 | Very good | Medium | local-file output with requested resize | Fallback backend, Gemini / AIGCDesk-specific generation |
| `z-image-turbo`                        | Good      | Fast   | 2048×1152                               | General illustrations                                   |

**Default backend selection rationale**: `seedream-image` (doubao-seedream-5-0-260128) remains the primary backend because it is optimized for Chinese prompts and article illustrations. When the user does not explicitly lock a backend and Seedream fails after one retry, fall back to `gemini-image-preview` to keep the article workflow moving.

## Style Gallery

| Style                           | Description                                   | Best For                               |
| ------------------------------- | --------------------------------------------- | -------------------------------------- |
| `business-whiteboard` (Default) | 极简商务白板手绘风，逻辑严密素雅              | 商业分析、知识结构、战略规划           |
| `notion`                        | Minimalist hand-drawn line art, intellectual  | Knowledge sharing, SaaS, productivity  |
| `elegant`                       | Refined, sophisticated, professional          | Business, thought leadership           |
| `warm`                          | Friendly, approachable, human-centered        | Personal growth, lifestyle, education  |
| `minimal`                       | Ultra-clean, zen-like, focused                | Philosophy, minimalism, core concepts  |
| `playful`                       | Fun, creative, whimsical                      | Tutorials, beginner guides, fun topics |
| `nature`                        | Organic, calm, earthy                         | Sustainability, wellness, outdoor      |
| `sketch`                        | Raw, authentic, notebook-style                | Ideas, brainstorming, drafts           |
| `watercolor`                    | Soft artistic with natural warmth             | Lifestyle, travel, creative            |
| `vintage`                       | Nostalgic aged-paper aesthetic                | Historical, biography, heritage        |
| `scientific`                    | Academic precise diagrams                     | Biology, chemistry, technical          |
| `chalkboard`                    | Classroom chalk drawing style                 | Education, tutorials, workshops        |
| `editorial`                     | Magazine-style infographic                    | Tech explainers, journalism            |
| `flat`                          | Modern flat vector illustration               | Startups, digital, contemporary        |
| `flat-doodle`                   | Bold outlines, pastel colors, cute            | Productivity, SaaS, workflows          |
| `retro`                         | 80s/90s vibrant nostalgic                     | Pop culture, gaming, entertainment     |
| `blueprint`                     | Technical schematics, engineering precision   | Architecture, system design            |
| `vector-illustration`           | Flat vector with black outlines, retro colors | Educational, creative, brand content   |
| `sketch-notes`                  | Soft hand-drawn, warm educational feel        | Knowledge sharing, tutorials           |
| `pixel-art`                     | Retro 8-bit gaming aesthetic                  | Gaming, tech, developer content        |
| `intuition-machine`             | Technical briefing with bilingual labels      | Academic, technical, bilingual         |
| `fantasy-animation`             | Ghibli/Disney whimsical style                 | Storytelling, children's, creative     |

Full style specifications in `references/styles/<style>.md`

## Default Style and Recommended Overrides

When no `--style` is specified, use `business-whiteboard` as the default style.
The default contract for **body illustrations** is now a **dual contract**: high-information-density infographic **and** strong commercial hand-drawn feel.
This means body images should preferentially become structure diagrams, comparison diagrams, decision diagrams, process diagrams, module maps, or compact conceptual infographics.
It also means the result must look hand-drawn at first glance, not merely contain subtle hand-drawn traces on top of a clean infographic layout.
The **WeChat cover remains an explicit exception**: cover-first, lower density, more whitespace, headline-overlay compatible.
If you want a different visual direction, pass `--style <name>` explicitly.

### Default Body-Image Pass/Fail Gate

For default body illustrations, the following are **all mandatory at the same time**:

1. high information density
2. clear judgment / structure / process communication
3. strong first-glance hand-drawn energy
4. handwritten-looking Chinese labels when text is present

Treat the output as **failed default style execution** if any of the following happens:

- the result looks like a sterile corporate chart
- the result looks like a polished slide-template infographic
- the result feels vector-first and hand-drawn-second
- Chinese labels look typeset, printed, or poster-like rather than handwritten
- hand-drawn traces only become visible on close inspection instead of first glance

If the output passes information density but fails hand-drawn energy, it is still a failure.
If the output passes hand-drawn energy but loses judgment clarity, it is still a failure.

Recommended override choices by content type:

| Content Signals                                                                       | Selected Style                              |
| ------------------------------------------------------------------------------------- | ------------------------------------------- |
| Personal story, emotion, growth, life, feeling, relationship                          | `warm`                                      |
| Simple, zen, focus, essential, core, minimalist                                       | `minimal`                                   |
| Fun, easy, beginner, tutorial, guide, how-to, learn                                   | `playful`                                   |
| Nature, eco, wellness, health, organic, green, outdoor                                | `nature`                                    |
| Idea, thought, concept, draft, brainstorm, sketch                                     | `sketch`                                    |
| Business, analysis, framework, strategy, logic, structure, model, process, commercial | `business-whiteboard`                       |
| Business, professional, strategy, analysis, corporate                                 | `elegant`                                   |
| Knowledge, concept, productivity, SaaS, notion, tool                                  | `notion`                                    |
| Lifestyle, travel, food, art, creative, artistic                                      | `watercolor`                                |
| History, heritage, vintage, biography, classic, expedition                            | `vintage`                                   |
| Biology, chemistry, medical, scientific, research, academic                           | `scientific`                                |
| Education, classroom, teaching, school, lecture, workshop                             | `chalkboard`                                |
| Explainer, journalism, magazine, in-depth, investigation                              | `editorial`                                 |
| Modern, startup, app, product, digital marketing, saas                                | `flat`                                      |
| Productivity, workflow, cute, tools, app tutorial                                     | `flat-doodle`                               |
| 80s, 90s, retro, pop culture, music, nostalgia                                        | `retro`                                     |
| Architecture, system, infrastructure, engineering, technical                          | `blueprint`                                 |
| Brand, explainer, children, cute, toy, geometric                                      | `vector-illustration`                       |
| Notes, doodle, friendly, warm tutorial, onboarding                                    | `sketch-notes`                              |
| Gaming, 8-bit, pixel, developer, retro tech                                           | `pixel-art`                                 |
| Bilingual, briefing, academic, research, documentation                                | `intuition-machine`                         |
| Fantasy, story, magical, Ghibli, Disney, children                                     | `fantasy-animation`                         |
| Default / no `--style` specified                                                      | `business-whiteboard` body-infographic mode |

## File Management

### Output Directory

Each session creates an independent directory named by content slug:

```
illustrations/{topic-slug}/
├── source-{slug}.{ext}    # Source files (text, images, etc.)
├── outline.md             # Final illustration plan
├── prompts/
│   ├── illustration-concept-a.md
│   ├── illustration-concept-b.md
│   └── ...
├── illustration-concept-a.png
├── illustration-concept-b.png
└── ...
```

**Slug Generation**:

1. Extract main topic from content (2-4 words, kebab-case)
2. Example: "The Future of AI" → `future-of-ai`

### Conflict Resolution

If `illustrations/{topic-slug}/` already exists:

- Append timestamp: `{topic-slug}-YYYYMMDD-HHMMSS`
- Example: `ai-future` exists → `ai-future-20260118-143052`

## Workflow

### Quick Mode Flow (Default)

**Objective**: Generate article illustrations end-to-end without user interaction.

```
Input → Analyze → Use default `business-whiteboard` style (or explicit `--style`) → Auto-select backend →
Estimate body-image density from article length and structure → Generate prompts → Generate body images + cover image →
Write local relative paths into article body + frontmatter → Complete
```

**Quick Mode Rules**:

1. **Style**: Use `business-whiteboard` by default (unless `--style` specified)
2. **Backend**: Use `seedream-image` first unless `--backend` is explicitly specified; after one failed retry, fall back to `gemini-image-preview`
3. **Language**: Use article language for prompts
4. **Illustration count**: target roughly `1 body image / 400 characters`, using `max(major_sections, ceil(body_chars / 400))`, default minimum `3`, recommended default maximum `12`
5. **Image paths**: default to local relative paths; only enable image hosting when explicitly requested or configured
6. **No confirmations**: Only ask if critical error or missing required input
7. **Default body-style gate**: the result must satisfy both high density and strong hand-drawn feel; if it looks too clean/template-like, upgrade prompts with a stronger hand-drawn override and retry once

### Normal Mode Flow

**Objective**: Allow user to review and adjust at key decision points.

```
Input → Analyze → Present style options → User selects →
Generate prompts → Present backend options → User selects →
Generate body images + cover image → Write local relative paths by default (or explicit upload mode) → Update article → Complete
```

**Normal Mode Rules**:

1. Present 3 style variants for user selection
2. Ask language preference if source ≠ user language
3. Ask backend preference if multiple available
4. Allow user to edit `outline.md` before generation

### Step 1: Analyze Content & Select Style

1. Read article content
2. **Quick mode**: Use `business-whiteboard` body-infographic mode unless user explicitly passes `--style`
3. **Normal mode**: Generate 3 style variants for user selection
4. Detect language:
   - Source language from article
   - User language from conversation
5. Extract key information:
   - Main topic and themes
   - Core messages per section
   - Abstract concepts needing visualization

### Step 2: Identify Illustration Positions

**Three Purposes of Illustrations**:

1. **Information Supplement**: Help understand abstract concepts
2. **Concept Visualization**: Transform abstract ideas into concrete visuals
3. **Imagination Guidance**: Create atmosphere, enhance reading experience

**Content Suitable for Illustrations**:

- Abstract concepts needing visualization
- Processes/steps needing diagrams
- Comparisons needing visual representation
- Core arguments needing reinforcement
- Scenarios needing imagination guidance
- Judgment pivots needing one-glance comprehension
- Decision logic, frameworks, module relations, or before/after contrasts

**Default Body-Image Contract**:

- Prefer high-information-density infographic visuals over decorative illustrations
- Prefer structure diagrams, comparison diagrams, decision diagrams, process diagrams, and module maps
- Make each image answer one clear article judgment
- Optimize for skim-reading and screenshot value
- Make hand-drawn energy obvious at first glance, not only through subtle texture or minor wobble
- Keep Chinese labels handwritten-looking rather than neatly typeset
- Do **not** default to atmosphere art, empty metaphor art, or low-density whitespace-heavy visuals for body images
- Do **not** accept outputs that feel like clean corporate templates, polished slide diagrams, or vector-first infographics with only light hand-drawn seasoning

**Illustration Count**:

- **Quick mode**: estimate with `max(major_sections, ceil(body_chars / 400))`, default minimum `3`, recommended default maximum `12`
- **Normal mode**: consider the same density target, then adjust for article rhythm, importance of arguments, and visual overload risk

**Placement Density Rule**:

- For methodology-heavy or knowledge-dense long-form articles, do **not** rely on heading count alone
- The default target is roughly **one body illustration per 400 characters**
- If the article has few headings but many dense judgments, still place enough images to maintain reading rhythm and screenshot value
- Prefer more small judgment-specific visuals over too few overloaded visuals

### Step 3: Generate Illustration Plan

Create `outline.md` with illustration specifications:

```markdown
# Illustration Plan

**Article**: [article path]
**Style**: [selected style]
**Backend**: [selected backend]
**Illustration Count**: N images
**Language**: [prompt language]

---

## Illustration 1

**Insert Position**: [section name] / [paragraph description]
**Purpose**: [why illustration needed here]
**Visual Content**: [what the image should show]
**Filename**: illustration-[slug].png

---

## Illustration 2

...

---

## WeChat Cover

**Purpose**: 公众号封面图，不承担正文信息密度
**Aspect Ratio**: 近似公众号横向封面比例（优先 2.35:1 到 2.5:1）
**Style**: `business-whiteboard` cover variant
**Visual Content**: 单一主视觉 + 更强留白 + 预留标题区
**Filename**: wechat-cover-[slug].png
```

### Step 4: Review & Confirm (Normal Mode Only)

**Only in normal mode**, present confirmation options:

1. Present 3 style variants
2. Ask language preference if source ≠ user language
3. Allow `outline.md` editing
4. Proceed only after explicit confirmation

**Quick mode**: Skip this step entirely.

### Step 5: Create Prompt Files

Save prompts to `prompts/` directory with style-specific details.

**Prompt Format**:

```markdown
Illustration theme: [concept in 2-3 words]
Style: [style name]
Backend: [backend name]

Visual composition:

- Main visual: [description matching style]
- Layout: [element positioning]
- Decorative elements: [style-appropriate decorations]

Color scheme:

- Primary: [style primary color]
- Background: [style background color]
- Accent: [style accent color]

Text content (if any):

- [Any labels or captions in content language]

Style notes: [specific style characteristics, with density and hierarchy expectations]

Constraints: no watermark, no logo, no QR code

For default body illustrations, also include equivalent guidance for:

- high-information-density infographic
- strong first-glance commercial hand-drawn feel
- handwritten-looking Chinese labels
- visible sketch lines, stroke wobble, and lightly imperfect geometry
- logic clear
- skimmable and screenshot-friendly
- clear hierarchy
- avoid hollow atmosphere art
- avoid sterile corporate chart look
- avoid polished slide-template composition
- avoid vector-first icon-system feel
```

For the WeChat cover, generate one extra prompt file using the constraints in `references/wechat-cover-mode.md`.
Do not reuse a body-illustration prompt directly as the cover prompt.

### Step 6: Generate Images

**Backend Selection Logic**:

```
1. If --backend specified → use it
2. Else if quick mode → use `seedream-image` as primary, retry once on failure, then fall back to `gemini-image-preview`
3. Else if normal mode → ask user to choose
```

**Generation Flow**:

1. Call selected backend skill with prompt file and output path
2. Generate body illustrations and one dedicated cover image
3. After each image, output progress: "Generated X/N"
4. For default body illustrations, perform a first-glance style check: does it look hand-drawn first, not clean-template first?
5. If the image is information-dense but too clean/template-like, upgrade the prompt with a stronger hand-drawn override and retry once
6. On technical failure, auto-retry once with the same backend
7. If the retry still fails and the backend was auto-selected rather than explicitly locked by the user, switch that image generation task to `gemini-image-preview`
8. If fallback also fails, log reason and continue to next

**Stronger Hand-Drawn Override**:

When the first attempt looks too clean, strengthen the prompt using language equivalent to:

- hand-drawn quality must be obvious at first glance
- stronger visible stroke wobble and uneven hand-drawn geometry
- paper texture or whiteboard surface feeling
- handwritten Chinese that feels naturally uneven, not typeset
- anti-vector, anti-clean-slide, anti-corporate-template
- preserve judgment clarity while increasing visible human-drawn energy

**Cover Generation Rules**:

1. Cover uses the same backend as body illustrations unless explicitly overridden.
2. Cover keeps the default `business-whiteboard` spirit, but composition is cover-first:
   - more negative space
   - one dominant visual focus
   - no dense process diagram
   - reserve an area suitable for headline overlay
3. Preferred size: wide landscape close to WeChat article cover usage.

**Important Boundary**:

- Body images default to high-density infographic logic.
- Cover images do **not** inherit body-image density by default.
- Cover remains lower-density, whitespace-friendly, and headline-overlay compatible.

**Backend Invocation Examples**:

# seedream-image (default)

node ~/.claude/skills/seedream-image/scripts/generate.mjs \
 --prompt "$(cat prompt.md)" \
 --output "illustrations/{slug}/image.png" \
 --size 2560x1440

```bash
# gemini-image-preview (direct or fallback)
node .claude/skills/gemini-image-preview/scripts/generate.mjs \
  --prompt "$(cat prompt.md)" \
  --output "illustrations/{slug}/image.png" \
  --size 2560x1440

# qwen-image (alternative)
node ~/.claude/skills/qwen-image/scripts/tuzi/tuzi-image-generate.mjs \
  --model qwen-image-2.0 \
  --prompt "$(cat prompt.md)" \
  --out-dir "illustrations/{slug}" \
  --size 2560x1440

# z-image-turbo
python3 ~/.agents/skills/z-image-turbo/scripts/generate.py \
  "$(cat prompt.md)" \
  --output "illustrations/{slug}/image.png" \
  --size 2560x1440
```

### Step 6.5: Upload Images to Image Hosting

**Default behavior**: Use local relative paths and skip image hosting.

Decision priority:

1. By default, use local relative paths directly
2. If `--no-upload` is set -> remain in strict local-path mode
3. Only if image hosting is explicitly enabled by workflow, extension config, or user request -> detect local PicGo/PicList at `http://127.0.0.1:36677`
4. If upload is enabled and available -> upload images and use URLs
5. If upload is enabled but unavailable or a single upload fails -> fall back to local paths for those images

**Upload Flow**:

1. Only when upload mode is explicitly enabled, detect whether local PicGo/PicList is reachable
2. For each generated image:
   - if upload mode is active, call `picgo-upload`
   - if upload succeeds, capture returned online URL
   - if upload fails, keep that image's local path
3. Store the final image reference for use in Step 7
4. Mark which final reference belongs to the WeChat cover

**Availability Check**:

```bash
curl -s --connect-timeout 2 http://127.0.0.1:36677/upload \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"list":[]}'
```

If the endpoint responds successfully, treat image hosting as available.
If connection is refused, times out, or returns an invalid response, fall back to local paths.

**Upload Invocation**:

```bash
# Upload single image
url=$(node ~/.claude/skills/picgo-upload/scripts/upload.mjs "/absolute/path/to/image.png")

# On success, url contains: https://your-bucket.cos.region.myqcloud.com/path/image.png
```

**Force Local Paths**: Use `--no-upload` to make local-path mode explicit, even if some external workflow tries to enable uploads.

### Step 7: Update Article

Insert generated images at corresponding positions using **local relative paths by default**:

```markdown
![illustration description](../illustrations/topic-slug/illustration-[slug].png)
```

**Reference Source** (in order of priority):

1. Local relative path (default behavior, and also the fallback when upload is disabled or unavailable):
   ```markdown
   ![illustration description](../illustrations/topic-slug/illustration-[slug].png)
   ```
2. Uploaded URL from Step 6.5 (only when image hosting is explicitly enabled and succeeds)

**Insertion Rules**:

- Insert image after corresponding paragraph
- Leave one blank line before and after image
- Alt text uses concise description in article's language

**Frontmatter Update Rules**:

1. After body image insertion, update article frontmatter with `coverImage`.
2. Write order for cover:
   - local relative cover path (default)
   - uploaded cover URL (only when upload is explicitly enabled and succeeds)
3. If `coverImage` already exists:
   - quick mode: overwrite and state it clearly in final output
   - normal mode: ask whether to overwrite before writing
4. New writes should prefer `coverImage`; do not introduce new field aliases.
5. Partial failure is allowed: one body image may use a local path while others use uploaded URLs.

### Step 8: Output Summary

```
Article Illustration Complete!

Article: [article path]
Mode: quick/normal
Style: [style name]
Backend: [backend name]
Fallback Backend: [fallback backend name or none]
Generated: X/N images successful
Uploaded: X/N to image hosting
Fell back to local paths: Y/N
WeChat cover: [cover filename] → [cover URL or local path]

Illustration Positions:
- illustration-xxx.png → After section "Section Name"
- illustration-yyy.png → After section "Another Section"

Output directory: illustrations/{topic-slug}/

[If any failures]
Failed:
- illustration-zzz.png: [failure reason]

[If any backend fallback happened]
Backend fallback:
- illustration-aaa.png: seedream-image → gemini-image-preview
```

## Extension Support

Custom configurations via EXTEND.md.

**Check paths** (priority order):

1. `.baoyu-skills/article-illustrator/EXTEND.md` (project)
2. `~/.baoyu-skills/article-illustrator/EXTEND.md` (user)

**EXTEND.md Example**:

```yaml
# Default behavior overrides
quick_mode: true
default_backend: seedream-image
default_style: business-whiteboard

# Illustration count density
chars_per_image: 400
min_images: 3
max_images: 12

# Language settings
prompt_language: auto # auto|zh|en

# Image hosting
upload_mode: never # default local relative paths; set auto/always only when URLs are explicitly needed
auto_upload: false # backward-compatible alias; local-first default

# Backend preferences
# Used only when you intentionally customize backend routing via extension logic.
# It does not override the documented quick-mode default unless your extension code does so.
backend_priority:
  - seedream-image
  - gemini-image-preview
  - qwen-image
  - z-image-turbo

# WeChat cover
generate_wechat_cover: true
wechat_cover_ratio: 2.35
```

## Notes

- Quick mode is **default** for maximum efficiency
- Use `--normal` for collaborative workflow with user confirmation
- Use `--no-upload` to force local paths and skip upload detection
- Default body-image density target is roughly **1 image per 400 characters**
- Illustrations serve the content: supplement information, visualize concepts
- Maintain selected style consistency across all illustrations in one article
- Image generation typically takes 10-30 seconds per image
- If the backend is not explicitly specified, quick mode uses `seedream-image` first and falls back to `gemini-image-preview` after one failed retry
- Local relative paths are the default writeback mode
- If PicGo/PicList is available at `http://127.0.0.1:36677`, only use it when upload mode has been explicitly enabled
- If image hosting is unavailable, the skill falls back to local paths
- This fallback is compatible with `post2wechat`, which already supports local image paths
- Sensitive figures should use cartoon alternatives
- Prompts written in article language (or user-specified language in normal mode)
- WeChat cover is part of the default output; use a dedicated cover prompt, not the first body image

---

**Last Updated**: 2026-04-05
**Default Backend**: seedream-image (fallback: gemini-image-preview when backend is not explicitly locked)
**Default Mode**: quick
**Default Upload Mode**: local relative paths first (`upload_mode: never` unless explicitly overridden)

---

## CRITICAL EXECUTION RULES (2026-03-06 Optimizations)

### Rule 1: Timestamp Filenames (MANDATORY)

**ALL generated image filenames MUST include timestamp to prevent cache conflicts:**

```bash
timestamp=$(date +%Y%m%d%H%M%S)
filename="illustration-{slug}-${timestamp}.png"
```

### Rule 2: Parallel Image Generation (MANDATORY)

**Generate ALL images in PARALLEL, not sequentially:**

```bash
# Launch all generations concurrently
# Use the resolved backend script for each prompt file.
# Auto-selected quick mode backend chain: seedream-image -> retry once -> gemini-image-preview fallback.
# For body images, use the default 2560x1440 target unless a different backend-specific target was deliberately chosen.
for prompt_file in prompts/*.md; do
  (node "$RESOLVED_BACKEND_SCRIPT" --prompt-file "$prompt_file" --output "..." --size 2560x1440) &
done
wait  # Wait for all to complete
```

**Why**: Reduces generation time from N×30s to ~30s for N images.

### Rule 3: URL Verification (MANDATORY)

**After uploading each image, verify the URL (only when upload mode is active):**

```bash
url=$(node picgo-upload/upload.mjs "image.png")

# Check for template variables
if echo "$url" | grep -E '\{|%7B'; then
  echo "⚠️  WARNING: PicGo config issue - URL contains template variables: $url"
fi

# Verify accessibility
if curl -sI "$url" | grep -q "200 OK"; then
  echo "✓ URL verified: $url"
else
  echo "❌ URL not accessible: $url"
fi
```

### Rule 4: Generation Report (REQUIRED)

**Create detailed report after generation:**

```markdown
# Generation Report

**Generated**: $(date '+%Y-%m-%d %H:%M:%S')
**Article**: {article_path}
**Style**: {style}
**Backend**: {backend}
**Body Target Size**: 2560x1440 (16:9 default)
**Cover Target**: dedicated wide cover ratio from `wechat_cover_ratio` / cover workflow, not the body-image default

## Results

| #   | Filename                            | Actual Size | Status  | URL         |
| --- | ----------------------------------- | ----------- | ------- | ----------- |
| 1   | illustration-xxx-20260306104914.png | 2560x1440 ✓ | Success | https://... |

## Issues

{list any warnings or errors}
```

### Rule 5: Duplicate Detection (RECOMMENDED)

**Before inserting image link, check if it already exists:**

```bash
if grep -q "illustration-{slug}" article.md; then
  echo "⚠️  Similar image link already exists, check for duplicates"
fi
```

### Rule 6: Dimension Verification (RECOMMENDED)

**After generation, verify image dimensions:**

```bash
actual=$(sips -g pixelWidth -g pixelHeight image.png | grep -E "Width|Height" | awk '{print $2}' | paste -sd 'x' -)
expected="2560x1440"
if [ "$actual" != "$expected" ]; then
  echo "⚠️  Size mismatch: expected $expected, got $actual"
fi
```

For the WeChat cover, do not reuse the body-image check above. Verify against the dedicated wide cover target chosen by the workflow instead.

## Execution Checklist

Before starting:

- [ ] Verify seedream-image skill is available
- [ ] Verify gemini-image-preview skill is available for fallback or explicit use
- [ ] Check article file exists and is readable
- [ ] If this platform benefits from image URLs, auto-detect PicGo/PicList availability

During generation:

- [ ] Add timestamp to ALL filenames
- [ ] Launch ALL image generations in parallel
- [ ] Monitor progress and log any errors
- [ ] For default body images, check whether first-glance style is hand-drawn rather than clean-template
- [ ] If too clean, apply stronger hand-drawn override and retry once

After generation:

- [ ] Verify uploaded URLs are accessible when upload mode is active
- [ ] Check for template variables in URLs when upload mode is active
- [ ] Verify image dimensions match target
- [ ] Create generation report
- [ ] Check for duplicate links before inserting
- [ ] Confirm fallback-to-local happened cleanly for any failed uploads
- [ ] Confirm Chinese labels look handwritten rather than typeset when text is present
- [ ] Confirm the image does not read like a sterile corporate chart or polished slide template

## Performance Targets

- **Generation time**: ~30-40s for 5 images (parallel)
- **Upload time**: ~5-10s for 5 images
- **Total time**: <60s for complete workflow
- **Success rate**: 100% (with retry on failure)

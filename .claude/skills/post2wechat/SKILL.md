---
name: post2wechat
description: Publish content to WeChat Official Account (微信公众号) via API or Chrome CDP. Supports article posting (文章) with HTML, Markdown, or plain text input, and image-text posting (贴图, formerly 图文) with multiple images. Use when user mentions "发布公众号", "post2wechat", "post to wechat", "微信公众号", or "贴图/图文/文章".
---

# Post to WeChat Official Account

## Language

**Match user's language**: Respond in the same language the user uses. If user writes in Chinese, respond in Chinese. If user writes in English, respond in English.

## Script Directory

**Agent Execution**: Determine this SKILL.md directory as `SKILL_DIR`, then use `${SKILL_DIR}/scripts/<name>.ts`.

| Script                         | Purpose                             |
| ------------------------------ | ----------------------------------- |
| `scripts/md-to-wechat.ts`      | Convert Markdown to HTML (built-in) |
| `scripts/wechat-browser.ts`    | Image-text posts (图文)             |
| `scripts/wechat-article.ts`    | Article posting via browser (文章)  |
| `scripts/wechat-api.ts`        | Article posting via API (文章)      |
| `scripts/check-permissions.ts` | Verify environment & permissions    |

## Preferences (EXTEND.md)

Use Bash to check EXTEND.md existence (priority order):

```bash
# Check project-level first
test -f .baoyu-skills/post2wechat/EXTEND.md && echo "project"

# Legacy fallback for existing setups
test -f .baoyu-skills/baoyu-post-to-wechat/EXTEND.md && echo "project-legacy"

# Then user-level (cross-platform: $HOME works on macOS/Linux/WSL)
test -f "$HOME/.baoyu-skills/post2wechat/EXTEND.md" && echo "user"

# Legacy fallback for existing setups
test -f "$HOME/.baoyu-skills/baoyu-post-to-wechat/EXTEND.md" && echo "user-legacy"
```

┌────────────────────────────────────────────────────────┬───────────────────┐
│ Path │ Location │
├────────────────────────────────────────────────────────┼───────────────────┤
│ .baoyu-skills/post2wechat/EXTEND.md │ Project directory │
├────────────────────────────────────────────────────────┼───────────────────┤
│ .baoyu-skills/baoyu-post-to-wechat/EXTEND.md │ Project legacy fallback │
├────────────────────────────────────────────────────────┼───────────────────┤
│ $HOME/.baoyu-skills/post2wechat/EXTEND.md │ User home │
├────────────────────────────────────────────────────────┼───────────────────┤
│ $HOME/.baoyu-skills/baoyu-post-to-wechat/EXTEND.md │ User legacy fallback │
└────────────────────────────────────────────────────────┴───────────────────┘

┌───────────┬───────────────────────────────────────────────────────────────────────────┐
│ Result │ Action │
├───────────┼───────────────────────────────────────────────────────────────────────────┤
│ Found / Legacy found │ Read, parse, apply settings │
├───────────┼───────────────────────────────────────────────────────────────────────────┤
│ Not found │ Run first-time setup ([references/config/first-time-setup.md](references/config/first-time-setup.md)) → Save → Continue │
└───────────┴───────────────────────────────────────────────────────────────────────────┘

**EXTEND.md Supports**: Default theme | Default publishing method (api/browser) | Default author | Default open-comment switch | Default fans-only-comment switch | Chrome profile path

First-time setup: [references/config/first-time-setup.md](references/config/first-time-setup.md)

**Minimum supported keys** (case-insensitive, accept `1/0` or `true/false`):

| Key                     | Default | Mapping                                                   |
| ----------------------- | ------- | --------------------------------------------------------- |
| `default_author`        | empty   | Fallback for `author` when CLI/frontmatter not provided   |
| `need_open_comment`     | `1`     | `articles[].need_open_comment` in `draft/add` request     |
| `only_fans_can_comment` | `0`     | `articles[].only_fans_can_comment` in `draft/add` request |

**Recommended EXTEND.md example**:

```md
default_theme: dapeng-editorial
default_publish_method: api
default_author: 宝玉
need_open_comment: 1
only_fans_can_comment: 0
chrome_profile_path: /path/to/chrome/profile
```

**Value priority**:

1. CLI arguments
2. Frontmatter
3. EXTEND.md
4. Skill defaults

## Pre-flight Check (Optional)

Before first use, suggest running the environment check. User can skip if they prefer.

```bash
npx -y bun ${SKILL_DIR}/scripts/check-permissions.ts
```

Checks: Chrome, profile isolation, Bun, Accessibility, clipboard, paste keystroke, API credentials, Chrome conflicts.

**If any check fails**, provide fix guidance per item:

| Check                   | Fix                                                                             |
| ----------------------- | ------------------------------------------------------------------------------- |
| Chrome                  | Install Chrome or set `WECHAT_BROWSER_CHROME_PATH` env var                      |
| Profile dir             | Ensure `~/.local/share/wechat-browser-profile` is writable                      |
| Bun runtime             | `curl -fsSL https://bun.sh/install \| bash`                                     |
| Accessibility (macOS)   | System Settings → Privacy & Security → Accessibility → enable terminal app      |
| Clipboard copy          | Ensure Swift/AppKit available (macOS Xcode CLI tools: `xcode-select --install`) |
| Paste keystroke (macOS) | Same as Accessibility fix above                                                 |
| Paste keystroke (Linux) | Install `xdotool` (X11) or `ydotool` (Wayland)                                  |
| API credentials         | Follow guided setup in Step 5, or manually set in `.baoyu-skills/.env`          |

## Image-Text Posting (图文)

For short posts with multiple images (up to 9):

```bash
npx -y bun ${SKILL_DIR}/scripts/wechat-browser.ts --markdown article.md --images ./images/
npx -y bun ${SKILL_DIR}/scripts/wechat-browser.ts --title "标题" --content "内容" --image img.png --submit
```

See [references/image-text-posting.md](references/image-text-posting.md) for details.

## Article Posting Workflow (文章)

Copy this checklist and check off items as you complete them:

```
Publishing Progress:
- [ ] Step 0: Load preferences (EXTEND.md)
- [ ] Step 1: Determine input type
- [ ] Step 2: Convert Markdown to HTML (if needed)
- [ ] Step 3: Validate metadata (title, summary, cover)
- [ ] Step 4: Select method and configure credentials
- [ ] Step 5: Publish to WeChat
- [ ] Step 6: Report completion
```

### Step 0: Load Preferences

Check and load EXTEND.md settings (see Preferences section above).

**CRITICAL**: If not found, complete first-time setup BEFORE any other steps or questions.

Resolve and store these defaults for later steps:

- `default_author`
- `need_open_comment` (default `1`)
- `only_fans_can_comment` (default `0`)

### Step 1: Determine Input Type

| Input Type    | Detection                              | Action                        |
| ------------- | -------------------------------------- | ----------------------------- |
| HTML file     | Path ends with `.html`, file exists    | Skip to Step 4                |
| Markdown file | Path ends with `.md`, file exists      | Continue to Step 2            |
| Plain text    | Not a file path, or file doesn't exist | Save to markdown, then Step 2 |

**Plain Text Handling**:

1. Generate slug from content (first 2-4 meaningful words, kebab-case)
2. Create directory and save file:

```bash
mkdir -p "$(pwd)/post2wechat/$(date +%Y-%m-%d)"
# Save content to: post2wechat/yyyy-MM-dd/[slug].md
```

3. Continue processing as markdown file

**Slug Examples**:

- "Understanding AI Models" → `understanding-ai-models`
- "人工智能的未来" → `ai-future` (translate to English for slug)

### Step 2: Convert Markdown to HTML

**Skip if**: Input is `.html` file

**Use built-in converter**:

```bash
npx -y bun ${SKILL_DIR}/scripts/md-to-wechat.ts <markdown_file> [--theme <theme>]
```

**Available themes** (ask user preference unless specified in EXTEND.md):

| Theme              | Description                                                        |
| ------------------ | ------------------------------------------------------------------ |
| `dapeng-editorial` | 书卷型编辑主题 - 衬线正文、暖白纸感、深墨青标题,适合公众号观点长文 |
| `default`          | 经典主题 - 传统排版,标题居中带底边,二级标题白字彩底                |
| `grace`            | 优雅主题 - 文字阴影,圆角卡片,精致引用块                            |
| `simple`           | 简洁主题 - 现代极简风,不对称圆角,清爽留白                          |
| `apple`            | 极简科技感 - 大留白、克制灰阶、精致圆角,适合高信息密度长文         |
| `byte`             | 利落产品风 - 清晰分区、冷静强调色、模块化层次,适合方法论和干货内容 |
| `notion`           | 文档气质 - 温和纸感、低干扰层级、阅读友好,兼容丰富 Markdown 最稳   |
| `claude`           | 温润高级感 - 柔和暖色、安静对比、长文阅读舒适,适合观点型内容       |

**Script output**: JSON with `htmlPath`, `title`, `author`, `summary`, `contentImages`

### Step 3: Validate Metadata

Check extracted metadata from Step 2 (or HTML meta tags if direct HTML input).

| Field   | If Missing                                                                             |
| ------- | -------------------------------------------------------------------------------------- |
| Title   | Prompt: "Enter title, or press Enter to auto-generate from content"                    |
| Summary | Prefer frontmatter `summary`; only if missing, prompt or weakly auto-generate          |
| Author  | Use fallback chain: CLI `--author` → frontmatter `author` → EXTEND.md `default_author` |

**Metadata Priority**:

- **Title**: First H1/H2 heading, or first sentence
- **Summary**: CLI `--summary` → frontmatter `summary` → frontmatter `digest` → frontmatter `description` → weak fallback to first paragraph (truncated to 120 characters)

Recommendation: let the upstream writing workflow write `summary` into frontmatter; publishing should consume it rather than invent it.

**Cover Image Check** (required for `article_type=news`):

1. Use CLI `--cover` if provided.
2. Else use frontmatter `coverImage`.
3. Else use compatible legacy fields (`featureImage`, `cover`, `image`).
4. Else check article directory default path: `imgs/cover.png`.
5. Else fallback to first inline content image.
6. If still missing, stop and request a cover image before publishing.

Recommendation: let the upstream illustration workflow write `coverImage`; body-image fallback is last resort only.

### Step 4: Select Publishing Method and Configure

**Ask publishing method** (unless specified in EXTEND.md or CLI):

| Method              | Speed | Requirements          |
| ------------------- | ----- | --------------------- |
| `api` (Recommended) | Fast  | API credentials       |
| `browser`           | Slow  | Chrome, login session |

**If API Selected - Check Credentials**:

```bash
# Check project-level
test -f .baoyu-skills/.env && grep -q "WECHAT_APP_ID" .baoyu-skills/.env && echo "project"

# Check user-level
test -f "$HOME/.baoyu-skills/.env" && grep -q "WECHAT_APP_ID" "$HOME/.baoyu-skills/.env" && echo "user"
```

**If Credentials Missing - Guide Setup**:

```
WeChat API credentials not found.

To obtain credentials:
1. Visit https://mp.weixin.qq.com
2. Go to: 开发 → 基本配置
3. Copy AppID and AppSecret

Where to save?
A) Project-level: .baoyu-skills/.env (this project only)
B) User-level: ~/.baoyu-skills/.env (all projects)
```

After location choice, prompt for values and write to `.env`:

```
WECHAT_APP_ID=<user_input>
WECHAT_APP_SECRET=<user_input>
```

**API method**:

```bash
npx -y bun ${SKILL_DIR}/scripts/wechat-api.ts <html_file> [--title <title>] [--summary <summary>] [--author <author>] [--cover <cover_path>]
```

**`draft/add` payload rules**:

- Use endpoint: `POST https://api.weixin.qq.com/cgi-bin/draft/add?access_token=ACCESS_TOKEN`
- `article_type`: `news` (default) or `newspic`
- For `news`, include `thumb_media_id` (cover is required)
- Always resolve and send:
  - `need_open_comment` (default `1`)
  - `only_fans_can_comment` (default `0`)
- `author` resolution: CLI `--author` → frontmatter `author` → EXTEND.md `default_author`
- `summary` resolution: CLI `--summary` → frontmatter `summary` → `digest` → `description`
- `cover` resolution: CLI `--cover` → frontmatter `coverImage` → `featureImage/cover/image` → `imgs/cover.png` → first inline image

If script parameters do not expose the two comment fields, still ensure final API request body includes resolved values.

**Browser method**:

```bash
npx -y bun ${SKILL_DIR}/scripts/wechat-article.ts --html <html_file>
```

### Step 6: Completion Report

**For API method**, include draft management link:

```
WeChat Publishing Complete!

Input: [type] - [path]
Method: API
Theme: [theme name]

Article:
• Title: [title]
• Summary: [summary]
• Images: [N] inline images
• Comments: [open/closed], [fans-only/all users]

Result:
✓ Draft saved to WeChat Official Account
• media_id: [media_id]

Next Steps:
→ Manage drafts: https://mp.weixin.qq.com (登录后进入「内容管理」→「草稿箱」)

Files created:
[• post2wechat/yyyy-MM-dd/slug.md (if plain text)]
[• slug.html (converted)]
```

**For Browser method**:

```
WeChat Publishing Complete!

Input: [type] - [path]
Method: Browser
Theme: [theme name]

Article:
• Title: [title]
• Summary: [summary]
• Images: [N] inline images

Result:
✓ Draft saved to WeChat Official Account

Files created:
[• post2wechat/yyyy-MM-dd/slug.md (if plain text)]
[• slug.html (converted)]
```

## Detailed References

| Topic                                   | Reference                                                            |
| --------------------------------------- | -------------------------------------------------------------------- |
| Image-text parameters, auto-compression | [references/image-text-posting.md](references/image-text-posting.md) |
| Article themes, image handling          | [references/article-posting.md](references/article-posting.md)       |

## Feature Comparison

| Feature                                                        | Image-Text    | Article (API) | Article (Browser) |
| -------------------------------------------------------------- | ------------- | ------------- | ----------------- |
| Plain text input                                               | ✗             | ✓             | ✓                 |
| HTML input                                                     | ✗             | ✓             | ✓                 |
| Markdown input                                                 | Title/content | ✓ (built-in)  | ✓ (built-in)      |
| Multiple images                                                | ✓ (up to 9)   | ✓ (inline)    | ✓ (inline)        |
| Themes                                                         | ✗             | ✓             | ✓                 |
| Consume upstream `summary` / `coverImage`                      | ✗             | ✓             | ✓                 |
| Default cover fallback (`imgs/cover.png`)                      | ✗             | ✓             | ✗                 |
| Comment control (`need_open_comment`, `only_fans_can_comment`) | ✗             | ✓             | ✗                 |
| Requires Chrome                                                | ✓             | ✗             | ✓                 |
| Requires API credentials                                       | ✗             | ✓             | ✗                 |
| Speed                                                          | Medium        | Fast          | Slow              |

## Prerequisites

**For API method**:

- WeChat Official Account API credentials
- Guided setup in Step 5, or manually set in `.baoyu-skills/.env`

**For Browser method**:

- Google Chrome
- First run: log in to WeChat Official Account (session preserved)

**For Markdown conversion**:

- Built-in `md-to-wechat.ts` script (no external dependencies)

**Config File Locations** (priority order):

1. Environment variables
2. `<cwd>/.baoyu-skills/.env`
3. `~/.baoyu-skills/.env`

## Troubleshooting

| Issue                   | Solution                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------- |
| Missing API credentials | Follow guided setup in Step 4                                                      |
| Access token error      | Check if API credentials are valid and not expired                                 |
| Not logged in (browser) | First run opens browser - scan QR to log in                                        |
| Chrome not found        | Set `WECHAT_BROWSER_CHROME_PATH` env var                                           |
| Title/summary missing   | Prefer upstream frontmatter; otherwise use fallback generation or provide manually |
| No cover image          | Prefer frontmatter `coverImage`; otherwise add `imgs/cover.png` or pass `--cover`  |
| Wrong comment defaults  | Check `EXTEND.md` keys `need_open_comment` and `only_fans_can_comment`             |
| Paste fails             | Check system clipboard permissions                                                 |

## Extension Support

Custom configurations via EXTEND.md. See **Preferences** section for paths and supported options.

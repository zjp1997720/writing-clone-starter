# Article Posting (文章发表)

Post markdown articles to WeChat Official Account with full formatting support.

## Usage

```bash
# Post markdown article
npx -y bun ./scripts/wechat-article.ts --markdown article.md

# With theme
npx -y bun ./scripts/wechat-article.ts --markdown article.md --theme notion

# With explicit options
npx -y bun ./scripts/wechat-article.ts --markdown article.md --author "作者名" --summary "摘要"
```

## Parameters

| Parameter           | Description                                                                     |
| ------------------- | ------------------------------------------------------------------------------- |
| `--markdown <path>` | Markdown file to convert and post                                               |
| `--theme <name>`    | Theme: dapeng-editorial, default, grace, simple, apple, byte, notion, or claude |
| `--title <text>`    | Override title (auto-extracted from markdown)                                   |
| `--author <name>`   | Author name (default: 宝玉)                                                     |
| `--summary <text>`  | Article summary                                                                 |
| `--html <path>`     | Pre-rendered HTML file (alternative to markdown)                                |
| `--profile <dir>`   | Chrome profile directory                                                        |

## Markdown Format

```markdown
---
title: Article Title
author: Author Name
---

# Title (becomes article title)

Regular paragraph with **bold** and _italic_.

## Section Header

![Image description](./image.png)

- List item 1
- List item 2

- [ ] Task item
- [x] Completed task

> Blockquote text

[Link text](https://example.com)

Footnote reference[^1]

[^1]: Footnote content
```

## Live Preview Notes

- [ ] Task list items now render as styled checkboxes in article HTML, not plain text bullets.
- [x] Completed tasks keep the same structure and receive a checked visual state.
- Markdown footnotes like `[^1]` render as themeable footnote references and definition blocks.
- Auto-cited links can also fall back to the same themeable footnote style path.

## Built-in Themes

- `dapeng-editorial`: serif editorial theme with warm paper tone, restrained hierarchy, and deep ink-blue headings
- `default`: classic editorial layout with stronger heading chrome
- `grace`: elegant card-like presentation with softer visual decoration
- `simple`: clean modern layout with lighter ornament and whitespace
- `apple`: grayscale premium theme with large spacing and refined hierarchy
- `byte`: sharp product-style theme with modular sections and cool accents
- `notion`: calm document-style theme optimized for dense Markdown content
- `claude`: warm minimalist theme for reflective long-form reading

## Image Handling

1. **Parse**: Images in markdown are replaced with `WECHATIMGPH_N`
2. **Render**: HTML is generated with placeholders in text
3. **Paste**: HTML content is pasted into WeChat editor
4. **Replace**: For each placeholder:
   - Find and select the placeholder text
   - Scroll into view
   - Press Backspace to delete the placeholder
   - Paste the image from clipboard

## Scripts

| Script              | Purpose                            |
| ------------------- | ---------------------------------- |
| `wechat-article.ts` | Main article publishing script     |
| `md-to-wechat.ts`   | Markdown to HTML with placeholders |
| `md/render.ts`      | Markdown rendering with themes     |

## Example Session

```
User: /post2wechat --markdown ./article.md

Claude:
1. Parses markdown, finds 5 images
2. Generates HTML with placeholders
3. Opens Chrome, navigates to WeChat editor
4. Pastes HTML content
5. For each image:
   - Selects WECHATIMGPH_1
   - Scrolls into view
   - Presses Backspace to delete
   - Pastes image
6. Reports: "Article composed with 5 images."
```

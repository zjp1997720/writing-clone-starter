---
name: feishu-obshare
description: Upload a local Markdown file to Feishu/Lark Docs (ObShare-style) via Feishu Open Platform APIs. Triggers on Feishu/Lark docs upload, "obshare", "飞书文档", "云文档", "share note to feishu".
---

# feishu-obshare

This skill provides a repeatable, low-friction workflow to upload a local Markdown file to Feishu (Lark) Docs.

## Quick Usage

1. Ensure credentials exist (local config file preferred; env vars supported).
2. Run the uploader script:

```bash
node ".claude/skills/feishu-obshare/scripts/upload.mjs" --file "/absolute/or/relative/path/to/note.md"
```

Optional permission flags:

```bash
node ".claude/skills/feishu-obshare/scripts/upload.mjs" \
  --file "/path/to/note.md" \
  --public --allow-copy --allow-create-copy
```

## Credentials

Local config (recommended):

- Copy `config.local.json.example` to `config.local.json`
- Fill in values
- Keep `config.local.json` uncommitted

Env var fallback:

- `FEISHU_APP_ID`
- `FEISHU_APP_SECRET`
- `FEISHU_FOLDER_TOKEN`
- `FEISHU_USER_ID` (optional; currently unused unless you extend ownership transfer)

## Output Contract

- Script prints a single JSON object to stdout: `{ "docToken": "...", "url": "..." }`
- Progress/debug logs go to stderr

## Notes / Limits

- Supports local images referenced as Obsidian embeds like `![[attachments/foo.png]]` (common image extensions only).
- Still does not post-process callouts or other Obsidian-only embeds.

---
name: youtube-transcript
description: Extract a YouTube transcript from a URL and save vault-ready Markdown. If the transcript is English, also generate a high-quality Chinese version.
allowed-tools: Bash,Read,Write
---

# YouTube Transcript -> Vault Markdown (EN + ZH)

This skill turns a YouTube link into clean Markdown notes saved into your vault.

## Output Contract

- Output directory (fixed): `00_收件箱/Clippings/Youtube/`
- Naming (fixed): `<Title> - <YYYY-MM-DD>.md`
- Markdown only: do not keep `.vtt`, `.srt`, `.txt` artifacts
- If the extracted transcript is English: also create `<Title> - <YYYY-MM-DD>.zh.md`

## Step 1: Extract transcript and write Markdown

Run inside the vault root (the script locates it via git; if this is a zip download without git, it will fall back to the nearest parent that contains `.claude/`).

Dependency handling:

- The script will auto-check `yt-dlp`.
- If missing, it will attempt to install `yt-dlp` via `python -m pip install --upgrade yt-dlp`.

```bash
python3 .claude/skills/youtube-transcript/scripts/extract_markdown.py --url "YOUTUBE_URL"
```

If YouTube blocks with "not a bot" / login challenges, rerun with browser cookies:

```bash
python3 .claude/skills/youtube-transcript/scripts/extract_markdown.py \
  --url "YOUTUBE_URL" \
  --cookies-from-browser=chrome
```

The script prints a small summary:

- `md_path=...` (absolute path to the created Markdown)
- `transcript_language=...` (e.g. `en-orig`, `zh-Hans`, ...)
- `is_english=true|false`

## Step 2: If English, also generate a refined Chinese version

If `is_english=true`:

1. Read the English Markdown at `md_path`.
2. Create `zh_path` by replacing the ending `.md` with `.zh.md` (same directory, same base name).
3. Write `zh_path` as a standalone Markdown file with:
   - YAML frontmatter preserved (`source`, `title`, `url`, `video_id`, `extracted`)
   - `lang: "zh"` and `source_lang: "en"`
   - The body should be a _full_ Chinese version (not a short summary).

Recommended Chinese Markdown structure:

```markdown
# <Title>

## 导读

## 要点梳理

## 精译正文

## 术语表

## 译者注
```

## Chinese Quality Bar (信雅达 + deeper-than-video comprehension)

Rules (must follow):

- Faithfulness: do NOT add facts not present in the transcript. If something is unclear, mark it as `【不确定】` instead of guessing.
- Completeness: translate ALL content from the transcript (no omissions).
- Readability: remove spoken filler, fix punctuation, split long sentences, and re-paragraph for logic.
- Clarity: resolve pronouns (it/this/that/they) into explicit nouns in Chinese.
- Terminology: keep a consistent glossary for key terms; preserve code/flags/paths/URLs in backticks.

Allowed "extra" value (must be clearly labeled):

- `【译者注】` is allowed ONLY to disambiguate references or explain a term that is already implied by the transcript.
- Keep `【译者注】` separate from the translated body so readers never confuse it with the speaker's words.

## Reporting back to the user

After completion, report:

- English Markdown path: `md_path`
- Chinese Markdown path (if generated): `zh_path`
- Transcript language detected

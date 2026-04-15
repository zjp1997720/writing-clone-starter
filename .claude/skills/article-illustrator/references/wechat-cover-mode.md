# WeChat Cover Mode

## Goal

Generate one dedicated cover image for WeChat Official Account articles.

This image is not a body illustration.
It should optimize for first-screen attractiveness, headline overlay compatibility, and visual clarity at small sizes.
It is the explicit exception to the body-image default: cover remains lower-density and whitespace-friendly.

## Default Style

- Base style: `business-whiteboard`
- Variant: `cover composition`
- Tone: commercial, hand-drawn, clear, trustworthy

## Composition Rules

1. Use a wide landscape composition close to WeChat article cover usage.
2. Keep one dominant visual focus; avoid multi-step flowcharts and dense annotations.
3. Reserve clear negative space for headline overlay.
4. Prioritize silhouette clarity and strong hierarchy over detail density.
5. Avoid placing important elements too close to edges.

## Content Rules

1. Cover should express the article's core promise, not summarize every section.
2. Prefer one metaphor, one scene, or one conceptual diagram.
3. If the article is methodology-heavy, convert it into a single high-level visual rather than a full process map.
4. Do not include watermarks, logos, QR codes, or dense paragraphs of text.
5. Do not let the body-image default high-density infographic contract bleed into the cover.

## Prompt Guidance

Include these constraints in the cover prompt:

- commercial whiteboard hand-drawn style
- horizontal WeChat article cover composition
- strong focal point
- generous whitespace for title overlay
- clean background
- no dense labels
- no watermark, no logo, no QR code

## Boundary Reminder

- Body illustrations may now default to high-information-density infographic logic.
- Cover images must not follow that default blindly.
- For cover, whitespace and focal clarity still win over density.

## Output Contract

- Output filename should clearly indicate cover usage, e.g. `wechat-cover-{slug}.png`
- After generation, the resulting local path or uploaded URL should be written back to article frontmatter as `coverImage`
- If image hosting is unavailable, keeping a local path in `coverImage` is valid because the downstream WeChat publishing workflow already supports local files

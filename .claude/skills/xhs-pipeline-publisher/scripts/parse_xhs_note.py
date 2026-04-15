#!/usr/bin/env python3
import argparse
import json
import re
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple


Frontmatter = Dict[str, Any]


def parse_scalar(value: str) -> Any:
    value = value.strip()
    if value.startswith(("'", '"')) and value.endswith(("'", '"')) and len(value) >= 2:
        return value[1:-1]
    if value == "[]":
        return []
    return value


def parse_frontmatter(text: str) -> Tuple[Frontmatter, str]:
    if not text.startswith("---\n"):
        return {}, text
    parts = text.split("\n---\n", 1)
    if len(parts) != 2:
        return {}, text
    raw = parts[0][4:]
    body = parts[1]
    data: Frontmatter = {}
    current_key: Optional[str] = None
    in_block = False
    block_key: Optional[str] = None
    block_lines: List[str] = []
    for line in raw.splitlines():
        if in_block:
            if line.startswith("  ") or not line.strip():
                block_lines.append(line[2:] if line.startswith("  ") else "")
                continue
            if block_key is not None:
                data[block_key] = "\n".join(block_lines).rstrip()
            in_block = False
            block_key = None
            block_lines = []
        if not line.strip():
            continue
        if re.match(r"^[A-Za-z0-9_]+:\s*\|\s*$", line):
            block_key = line.split(":", 1)[0].strip()
            in_block = True
            block_lines = []
            current_key = None
            continue
        if re.match(r"^[A-Za-z0-9_]+:\s*$", line):
            current_key = line.split(":", 1)[0]
            data[current_key] = []
            continue
        if line.startswith("  - ") or line.startswith("- "):
            if current_key is None:
                continue
            item = line.split("- ", 1)[1].strip()
            data.setdefault(current_key, []).append(parse_scalar(item))
            continue
        if ":" in line and not line.startswith(" "):
            key, value = line.split(":", 1)
            data[key.strip()] = parse_scalar(value)
            current_key = None
    if in_block and block_key is not None:
        data[block_key] = "\n".join(block_lines).rstrip()
    return data, body


def normalize(note_path: Path) -> Dict[str, Any]:
    text = note_path.read_text(encoding="utf-8")
    frontmatter, _body = parse_frontmatter(text)
    title = frontmatter.get("xhs_title") or frontmatter.get("title") or ""
    intro = (frontmatter.get("xhs_intro") or "").strip()
    body = (frontmatter.get("xhs_body") or "").strip()
    if intro and body:
        content = body if body.startswith(intro) else f"{intro}\n\n{body}".strip()
    else:
        content = body or intro
    tags = frontmatter.get("xhs_tags") or []
    images = frontmatter.get("xhs_images") or []
    publish_mode = frontmatter.get("xhs_publish_mode") or "draft"

    if isinstance(tags, str):
        tags = [tag.strip() for tag in re.split(r"[,，\s]+", tags) if tag.strip()]
    if isinstance(images, str):
        images = [images]

    resolved_images: List[str] = []
    for img in images:
        raw = str(img).strip()
        if not raw:
            continue
        candidate = Path(raw).expanduser()
        if not candidate.is_absolute():
            candidate = (note_path.parent / candidate).resolve()
        resolved_images.append(str(candidate))
    images = resolved_images

    if not title.strip():
        raise ValueError("Missing required field: xhs_title")
    if not content.strip():
        raise ValueError("Missing required field: xhs_body or xhs_intro")
    if publish_mode not in {"draft", "publish"}:
        raise ValueError("Invalid xhs_publish_mode: must be 'draft' or 'publish'")
    if not images:
        raise ValueError("Missing required field: xhs_images")
    missing_images = [img for img in images if not Path(img).exists()]
    if missing_images:
        raise FileNotFoundError("Image paths not found: " + ", ".join(missing_images))

    tags_line = " ".join(
        f"#{tag}" if not str(tag).startswith("#") else str(tag) for tag in tags
    )
    content_for_publish = content.strip()
    if tags_line:
        content_for_publish = f"{content_for_publish}\n\n{tags_line}".strip()

    return {
        "title": title,
        "content": content,
        "content_for_publish": content_for_publish,
        "tags": tags,
        "images": images,
        "publish_mode": publish_mode,
        "source_file": str(note_path),
    }


def main():
    parser = argparse.ArgumentParser(description="Parse .xhs.md structured note")
    _ = parser.add_argument("file")
    args = parser.parse_args()
    path = Path(args.file).expanduser().resolve()
    result = normalize(path)
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

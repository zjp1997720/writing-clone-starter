#!/usr/bin/env python3

from __future__ import annotations

import argparse
import datetime as _dt
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


DEFAULT_REL_OUT_DIR = Path("00_收件箱") / "Clippings" / "Youtube"
PREF_LANG = ["en", "zh-Hans", "zh-Hant", "zh"]


def _pip_is_available() -> bool:
    p = _run([sys.executable, "-m", "pip", "--version"])
    return p.returncode == 0


def _ensure_pip() -> bool:
    if _pip_is_available():
        return True
    p = _run([sys.executable, "-m", "ensurepip", "--upgrade"])
    return p.returncode == 0 and _pip_is_available()


def _pip_install(pkgs: list[str]) -> tuple[bool, str]:
    if not _ensure_pip():
        return False, "pip is not available; install pip/ensurepip first"
    cmd = [sys.executable, "-m", "pip", "install", "--upgrade"] + pkgs
    p = _run(cmd)
    return p.returncode == 0, (p.stdout or "")


_YT_DLP_CMD: list[str] | None = None


def _get_ytdlp_cmd() -> list[str]:
    global _YT_DLP_CMD
    if _YT_DLP_CMD is not None:
        return list(_YT_DLP_CMD)

    if shutil.which("yt-dlp") is not None:
        _YT_DLP_CMD = ["yt-dlp"]
        return list(_YT_DLP_CMD)

    try:
        import yt_dlp  # type: ignore

        _YT_DLP_CMD = [sys.executable, "-m", "yt_dlp"]
        return list(_YT_DLP_CMD)
    except Exception:
        pass

    ok, out = _pip_install(["yt-dlp"])
    if not ok:
        raise RuntimeError(
            "yt-dlp not found. Auto-install failed. "
            "Try: python -m pip install --upgrade yt-dlp\n" + out
        )

    _YT_DLP_CMD = [sys.executable, "-m", "yt_dlp"]
    return list(_YT_DLP_CMD)


def _run(cmd: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run(
        cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True
    )


def _git_toplevel(cwd: Path) -> Path | None:
    p = _run(["git", "rev-parse", "--show-toplevel"])
    if p.returncode != 0:
        return None
    s = (p.stdout or "").strip()
    return Path(s) if s else None


def _sanitize_filename_component(title: str, max_len: int = 160) -> str:
    t = title.replace("/", "-").replace("\\", "-")
    t = re.sub(r"[:*?\"<>|]", "", t)
    t = re.sub(r"\s+", " ", t).strip()
    t = t.strip(". ")
    if not t:
        return "youtube-transcript"
    return t[:max_len].rstrip()


def _looks_like_bot_check(output: str) -> bool:
    t = output.lower()
    return "not a bot" in t or "--cookies-from-browser" in t


def _yt_dlp_print(
    url: str, field: str, cookies_from_browser: str | None
) -> tuple[int, str]:
    cmd = _get_ytdlp_cmd() + ["--quiet", "--no-warnings"]
    if cookies_from_browser:
        cmd.append(f"--cookies-from-browser={cookies_from_browser}")
    cmd += ["--print", field, url]
    p = _run(cmd)
    return p.returncode, (p.stdout or "").strip()


def _ensure_dir(p: Path) -> None:
    p.mkdir(parents=True, exist_ok=True)


def _uniq(xs: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for x in xs:
        if x in seen:
            continue
        seen.add(x)
        out.append(x)
    return out


def _parse_list_subs(output: str) -> tuple[list[str], list[str]]:
    manual: list[str] = []
    auto: list[str] = []
    section: str | None = None

    for raw in output.splitlines():
        line = raw.strip()
        if not line:
            continue
        if "Available subtitles for" in line:
            section = "manual"
            continue
        if "Available automatic captions for" in line:
            section = "auto"
            continue
        if section is None:
            continue

        m = re.match(r"^([A-Za-z0-9-]+)\s+", line)
        if not m:
            continue
        code = m.group(1)
        if code.lower() == "language":
            continue
        if section == "manual":
            manual.append(code)
        else:
            auto.append(code)

    return _uniq(manual), _uniq(auto)


def _pick_lang(langs: list[str]) -> str:
    for cand in PREF_LANG:
        if cand in langs:
            return cand
    for lang in langs:
        if lang.startswith("en-"):
            return lang
    for lang in langs:
        if lang.startswith("zh-"):
            return lang
    return langs[0]


def _pick_auto_lang(langs: list[str]) -> str:
    for lang in langs:
        if lang.endswith("-orig"):
            return lang
    if "en" in langs:
        return "en"
    return _pick_lang(langs)


def _infer_lang_from_filename(path: Path) -> str | None:
    parts = path.name.split(".")
    if len(parts) >= 3:
        return parts[-2]
    return None


def _yt_dlp_list_subs(
    url: str, cookies_from_browser: str | None
) -> subprocess.CompletedProcess:
    cmd = _get_ytdlp_cmd()
    if cookies_from_browser:
        cmd.append(f"--cookies-from-browser={cookies_from_browser}")
    cmd += ["--list-subs", url]
    return _run(cmd)


def _yt_dlp_download_vtt(
    *,
    url: str,
    tmpdir: Path,
    cookies_from_browser: str | None,
    mode: str,
    lang: str,
) -> tuple[Path | None, str | None, str]:
    for p in tmpdir.glob("*.vtt"):
        try:
            p.unlink()
        except FileNotFoundError:
            pass

    out_tpl = str(tmpdir / "%(id)s")
    cmd = _get_ytdlp_cmd()
    if cookies_from_browser:
        cmd.append(f"--cookies-from-browser={cookies_from_browser}")
    cmd += [
        "--skip-download",
        "--sub-langs",
        lang,
        "--sub-format",
        "vtt",
        "--output",
        out_tpl,
    ]
    cmd.append("--write-sub" if mode == "manual" else "--write-auto-sub")
    cmd.append(url)

    p = _run(cmd)
    vtts = sorted(tmpdir.glob("*.vtt"))
    if not vtts:
        return None, None, p.stdout or ""
    vtt = vtts[0]
    return vtt, _infer_lang_from_filename(vtt), p.stdout or ""


def _download_subs(
    url: str,
    tmpdir: Path,
    cookies_from_browser: str | None,
) -> tuple[Path | None, str | None, str]:
    list_p = _yt_dlp_list_subs(url, cookies_from_browser)
    manual_langs, auto_langs = _parse_list_subs(list_p.stdout or "")

    attempts: list[tuple[str, str]] = []
    if manual_langs:
        attempts.append(("manual", _pick_lang(manual_langs)))
    if auto_langs:
        attempts.append(("auto", _pick_auto_lang(auto_langs)))
    if not attempts:
        attempts = [("auto", "en"), ("auto", "zh-Hans"), ("auto", "zh")]

    combined = list_p.stdout or ""
    for mode, lang in attempts:
        vtt, actual_lang, out = _yt_dlp_download_vtt(
            url=url,
            tmpdir=tmpdir,
            cookies_from_browser=cookies_from_browser,
            mode=mode,
            lang=lang,
        )
        combined += "\n" + (out or "")
        if vtt is not None:
            return vtt, actual_lang or lang, combined

    return None, None, combined


def _vtt_to_paragraphs(vtt_text: str) -> list[str]:
    lines: list[str] = []
    for raw in vtt_text.splitlines():
        s = raw.strip()
        if not s:
            continue
        if s.startswith("WEBVTT") or s.startswith("Kind:") or s.startswith("Language:"):
            continue
        if "-->" in s:
            continue
        s = re.sub(r"<[^>]*>", "", s)
        s = s.replace("&amp;", "&").replace("&gt;", ">")
        s = s.replace("&lt;", "<")
        s = s.replace("♪", "")
        s = re.sub(r"\s+", " ", s).strip()
        if not s:
            continue
        lines.append(s)

    seen: set[str] = set()
    deduped: list[str] = []
    for s in lines:
        if s in seen:
            continue
        seen.add(s)
        deduped.append(s)

    paras: list[str] = []
    buf: list[str] = []

    def flush() -> None:
        nonlocal buf
        if not buf:
            return
        p = re.sub(r"\s+", " ", " ".join(buf)).strip()
        if p:
            paras.append(p)
        buf = []

    end_re = re.compile(r"[.!?。？！]$")
    for s in deduped:
        buf.append(s)
        if end_re.search(s) or sum(len(x) for x in buf) >= 320:
            flush()
    flush()
    return paras


def _yaml_quote(s: str) -> str:
    s = s.replace("\\", "\\\\")
    s = s.replace('"', '\\"')
    s = re.sub(r"\s+", " ", s).strip()
    return f'"{s}"'


def _lang_group(transcript_lang: str | None) -> str:
    if not transcript_lang:
        return ""
    if transcript_lang.startswith("en"):
        return "en"
    if transcript_lang.startswith("zh"):
        return "zh"
    return transcript_lang


def _write_markdown(
    *,
    out_path: Path,
    title: str,
    url: str,
    video_id: str,
    extracted_date: str,
    transcript_lang: str | None,
    paragraphs: list[str],
) -> None:
    frontmatter = [
        "---",
        "source: YouTube",
        f"title: {_yaml_quote(title)}",
        f"url: {_yaml_quote(url)}",
        f"video_id: {_yaml_quote(video_id)}",
        f"extracted: {_yaml_quote(extracted_date)}",
        f"lang: {_yaml_quote(_lang_group(transcript_lang))}",
        f"transcript_language: {_yaml_quote(transcript_lang or '')}",
        "---",
        "",
    ]

    body = [f"# {title}", "", "## Transcript", ""]
    for p in paragraphs:
        body.append(p)
        body.append("")

    out_path.write_text("\n".join(frontmatter + body), encoding="utf-8")


def _next_available_md_path(out_dir: Path, base: str) -> Path:
    p = out_dir / f"{base}.md"
    if not p.exists():
        return p
    for i in range(2, 1000):
        cand = out_dir / f"{base} ({i}).md"
        if not cand.exists():
            return cand
    raise RuntimeError("Too many conflicting filenames")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", required=True)
    ap.add_argument("--out-dir", default=None)
    ap.add_argument("--cookies-from-browser", default=None)
    args = ap.parse_args()

    try:
        _get_ytdlp_cmd()
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 1

    cwd = Path.cwd()
    vault_root = _git_toplevel(cwd)
    if vault_root is None:
        for p in [cwd] + list(cwd.parents):
            if (p / ".claude").is_dir():
                vault_root = p
                break
    if args.out_dir:
        out_dir = Path(args.out_dir)
        if not out_dir.is_absolute() and vault_root is not None:
            out_dir = vault_root / out_dir
    else:
        if vault_root is None:
            print(
                "ERROR: Not inside a git repo; pass --out-dir (absolute) or run inside vault root",
                file=sys.stderr,
            )
            return 2
        out_dir = vault_root / DEFAULT_REL_OUT_DIR
    _ensure_dir(out_dir)

    extracted_date = _dt.date.today().isoformat()

    cookies = args.cookies_from_browser
    rc, video_id = _yt_dlp_print(args.url, "%(id)s", cookies)
    if (
        (rc != 0 or not video_id)
        and cookies is None
        and _looks_like_bot_check(video_id)
    ):
        rc2, video_id2 = _yt_dlp_print(args.url, "%(id)s", "chrome")
        if rc2 == 0 and video_id2:
            cookies = "chrome"
            video_id = video_id2
    if not video_id:
        print("ERROR: Could not extract video id via yt-dlp", file=sys.stderr)
        return 3

    rc, title = _yt_dlp_print(args.url, "%(title)s", cookies)
    if (rc != 0 or not title) and cookies is None and _looks_like_bot_check(title):
        rc2, title2 = _yt_dlp_print(args.url, "%(title)s", "chrome")
        if rc2 == 0 and title2:
            cookies = "chrome"
            title = title2
    title = title.strip() if title else video_id

    safe_title = _sanitize_filename_component(title)
    base = f"{safe_title} - {extracted_date}"
    md_path = _next_available_md_path(out_dir, base)

    with tempfile.TemporaryDirectory(prefix="youtube-transcript-") as td:
        tmpdir = Path(td)
        vtt_path, vtt_lang, ytdlp_out = _download_subs(args.url, tmpdir, cookies)
        if vtt_path is None or not vtt_path.exists():
            if cookies is None and _looks_like_bot_check(ytdlp_out):
                vtt_path, vtt_lang, _ = _download_subs(args.url, tmpdir, "chrome")
                cookies = "chrome"
        if vtt_path is None or not vtt_path.exists():
            print(
                "ERROR: No subtitles available via yt-dlp (manual or auto)",
                file=sys.stderr,
            )
            return 4

        vtt_text = vtt_path.read_text(encoding="utf-8", errors="ignore")
        paragraphs = _vtt_to_paragraphs(vtt_text)
        if not paragraphs:
            print("ERROR: Subtitle file was empty after cleaning", file=sys.stderr)
            return 5

        _write_markdown(
            out_path=md_path,
            title=title,
            url=args.url,
            video_id=video_id,
            extracted_date=extracted_date,
            transcript_lang=vtt_lang,
            paragraphs=paragraphs,
        )

    is_english = (vtt_lang or "").startswith("en")
    print(
        "\n".join(
            [
                f"md_path={md_path}",
                f"title={title}",
                f"video_id={video_id}",
                f"transcript_language={vtt_lang or ''}",
                f"lang={_lang_group(vtt_lang)}",
                f"is_english={'true' if is_english else 'false'}",
            ]
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

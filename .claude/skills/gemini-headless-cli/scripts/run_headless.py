#!/usr/bin/env python3
"""Run Gemini CLI in headless mode with a stable, machine-friendly contract.

This wrapper exists because A2A callers typically need:
- Explicit headless invocation (-p)
- Structured output (--output-format json|stream-json)
- Safety defaults (--approval-mode plan)
- A single output artifact to parse later

It does not manage authentication. Ensure GEMINI_API_KEY (or your chosen auth) is already set.
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path


def _write_system_prompt(out_dir: Path) -> Path:
    skill_dir = Path(__file__).resolve().parents[1]
    src = skill_dir / "assets" / "system_a2a.md"
    dst = out_dir / "system_a2a.md"
    dst.write_text(src.read_text(encoding="utf-8"), encoding="utf-8")
    return dst


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--prompt", required=True, help="Headless prompt to run")
    parser.add_argument(
        "--output-format",
        default="json",
        choices=["text", "json", "stream-json"],
        help="Gemini CLI output format",
    )
    parser.add_argument("--model", default=None, help="Optional model override")
    parser.add_argument(
        "--approval-mode",
        default="plan",
        choices=["default", "auto_edit", "yolo", "plan"],
        help="Gemini CLI approval mode",
    )
    parser.add_argument(
        "--sandbox",
        action="store_true",
        help="Enable sandbox (recommended if allowing side effects)",
    )
    parser.add_argument(
        "--policy",
        action="append",
        default=[],
        help="Additional policy file or dir (can repeat)",
    )
    parser.add_argument(
        "--include-directories",
        action="append",
        default=[],
        help="Additional workspace directories (can repeat)",
    )
    parser.add_argument(
        "--use-system-prompt-override",
        action="store_true",
        help="Set GEMINI_SYSTEM_MD to a strict A2A system prompt file",
    )
    parser.add_argument(
        "--out-dir",
        default=None,
        help="Directory for artifacts (default: a new temp dir)",
    )

    parser.add_argument(
        "--timeout-seconds",
        type=float,
        default=600,
        help="Kill the gemini subprocess after this many seconds (default: 600).",
    )

    args = parser.parse_args()

    out_dir = (
        Path(args.out_dir).expanduser().resolve()
        if args.out_dir
        else Path(tempfile.mkdtemp(prefix="gemini-headless-"))
    )
    out_dir.mkdir(parents=True, exist_ok=True)
    raw_path = out_dir / "gemini_stdout.bin"
    meta_path = out_dir / "meta.json"

    env = os.environ.copy()
    if args.use_system_prompt_override:
        system_path = _write_system_prompt(out_dir)
        env["GEMINI_SYSTEM_MD"] = str(system_path)

    cmd: list[str] = [
        "gemini",
        "-p",
        args.prompt,
        "--output-format",
        args.output_format,
        "--approval-mode",
        args.approval_mode,
    ]

    if args.model:
        cmd += ["--model", args.model]
    if args.sandbox:
        cmd.append("--sandbox")
    for p in args.policy:
        cmd += ["--policy", p]
    for d in args.include_directories:
        cmd += ["--include-directories", d]

    stdin_bytes = sys.stdin.buffer.read()
    try:
        proc = subprocess.run(
            cmd,
            input=stdin_bytes if stdin_bytes else None,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env=env,
            timeout=args.timeout_seconds,
        )
        stdout_bytes = proc.stdout
        stderr_bytes = proc.stderr
        exit_code = proc.returncode
        timed_out = False
    except subprocess.TimeoutExpired as e:
        stdout_bytes = e.stdout or b""
        stderr_bytes = e.stderr or b""
        exit_code = 124
        timed_out = True

    raw_path.write_bytes(stdout_bytes)

    meta = {
        "cmd": cmd,
        "exit_code": exit_code,
        "timed_out": timed_out,
        "timeout_seconds": args.timeout_seconds,
        "stderr": stderr_bytes.decode("utf-8", errors="replace"),
        "raw_stdout_path": str(raw_path),
    }
    meta_path.write_text(json.dumps(meta, ensure_ascii=True, indent=2), encoding="utf-8")

    ok = (exit_code == 0) and (not timed_out)
    sys.stdout.write(f"ok={'true' if ok else 'false'}\n")
    sys.stdout.write(f"exit_code={exit_code}\n")
    sys.stdout.write(f"response_path={raw_path}\n")
    sys.stdout.write(f"meta_path={meta_path}\n")

    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())

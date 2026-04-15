---
name: gemini-headless-cli
description: |
  Use Gemini CLI in non-interactive (headless) mode as a subprocess (A2A sub-agent) and consume structured output (JSON or JSONL). Use this when you need a huge-context helper for log/diff analysis, batch processing, or long-running investigations. Triggers: Gemini CLI, gemini, headless mode, non-interactive, --prompt, --output-format json, stream-json, JSONL, --resume, --approval-mode, policy engine, GEMINI_SYSTEM_MD, "无头模式".
allowed-tools: Bash,Read,Write
---

# Gemini CLI Headless (A2A Sub-agent)

This skill documents a reliable way to invoke `gemini` without any interactive UI and get machine-parseable output.

Why this exists: in A2A usage, interactive prompts and ANSI UI output will deadlock or break parsers. Always force headless mode and structured output.

## What this skill is (and is not)

- This is a Claude Code skill that teaches how to call the local `gemini` CLI as a sub-process.
- It is NOT a Gemini CLI "agent skill" (the `gemini skills ...` feature). You can still use Gemini's own skills separately.

## Preconditions

Verify the CLI is installed and supports the needed flags:

```bash
gemini --version
gemini --help
```

Authentication is out-of-band:

- Ensure `GEMINI_API_KEY` (or your enterprise auth env vars) are already present in the environment that runs `gemini`.
- Do NOT write secrets into the repo.

## Headless invocation (stable patterns)

Gemini CLI v0.32.1 supports explicit headless mode via `-p/--prompt`.

### Pattern A (recommended): JSON output (single object)

Use for most A2A calls.

```bash
gemini -p "YOUR_PROMPT" --output-format json --approval-mode plan
```

Contract (official headless docs): stdout is exactly one JSON object with keys:

- `response` (string)
- `stats` (object)
- `error` (object or null)

Caller rules:

- Treat `error != null` as failure.
- If you asked Gemini to output JSON, it will be inside `response` (a string). Parse that string yourself.

### Pattern B: Stream JSON (JSONL event stream)

Use for long-running tasks, progress reporting, or tool tracing.

```bash
gemini -p "YOUR_PROMPT" --output-format stream-json --approval-mode plan
```

Parsing rules:

- This is JSONL (newline-delimited JSON).
- Implement a line buffer: do not `json.loads()` until you have a full line ending in `\n`.
- Stop when you see an event with `type == "result"`.
- Persist `session_id` from the `init` event to enable `--resume`.

### Pattern C: Send large input via stdin

Pipe big content (logs/diffs/documents) into stdin and keep the prompt short and explicit:

```bash
cat /path/to/big.txt | gemini -p "Analyze stdin. Output JSON only with keys: findings[], risk_level, next_steps[]" --output-format json --approval-mode plan
```

### Pattern D: Include additional directories

```bash
gemini -p "Review this project" --include-directories "/abs/path/one" --include-directories "/abs/path/two" --output-format json --approval-mode plan
```

## Resume and turn limits

If a run exits with code `53` (turn limit exceeded), resume:

```bash
gemini --list-sessions
gemini --resume latest -p "Continue. Output final JSON only." --output-format json --approval-mode plan
```

`--resume` accepts `latest` or an index (see `--list-sessions`).

## Safety: approval mode, policy engine, sandbox

Important flags (verified in `gemini --help`):

- `--approval-mode plan` (recommended default): read-only planning.
- `--approval-mode auto_edit`: auto-approve edit tools; still safer than YOLO.
- `--approval-mode yolo` or `-y/--yolo`: auto-approve everything (high risk).
- `--policy <file-or-dir>`: load additional policy engine rules.
- `--sandbox` (or `-s`): run in sandbox (recommended whenever allowing side effects).

Default stance for A2A wrappers:

- Use `--approval-mode plan` unless side effects are explicitly needed.
- If side effects are needed, prefer `--approval-mode auto_edit` with targeted `--policy` allowlists.

## System prompt override (make output strict)

Official feature: set `GEMINI_SYSTEM_MD` to fully replace the built-in system prompt with your own Markdown.

Recommended for A2A:

- Use a strict system prompt that forces "JSON only" and disallows extra text.
- This skill includes a minimal template at `assets/system_a2a.md`.

If `GEMINI_SYSTEM_MD` points to a missing file, Gemini CLI errors. Always write the file before running.

## Exit codes (headless)

Per official headless docs:

- `0`: success
- `1`: general error or API failure
- `42`: input error (invalid prompt or args)
- `53`: turn limit exceeded (resume)

## Deterministic wrapper script (recommended)

This repo includes a wrapper to standardize:

- always use `-p`
- enforce an execution timeout (`--timeout-seconds`) to avoid hanging auth flows
- standardize flags
- capture stdout/stderr into artifacts

Example:

```bash
python3 .claude/skills/gemini-headless-cli/scripts/run_headless.py \
  --prompt "Review this diff. Output JSON only: {issues:[], recommendations:[]}" \
  --output-format json \
  --approval-mode plan \
  --use-system-prompt-override \
  --timeout-seconds 600
```

Outputs (printed to stdout):

- `ok=true|false`
- `exit_code=<int>` (Gemini CLI exit code; wrapper uses `124` when it times out)
- `response_path=<file>` (raw stdout)
- `meta_path=<file>` (JSON with stderr and cmd)

## References

- Research note: `00_收件箱/Gemini CLI 无头模式调研报告.md`
- Official headless docs: https://geminicli.com/docs/cli/headless/
- System prompt override: https://geminicli.com/docs/cli/system-prompt/
- Configuration reference: https://geminicli.com/docs/reference/configuration/

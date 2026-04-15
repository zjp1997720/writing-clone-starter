# Gemini CLI headless quick cheatsheet

Verified against Gemini CLI v0.32.1 (local `gemini --version`).

## JSON output

```bash
gemini -p "..." --output-format json --approval-mode plan
```

## Stream JSON (JSONL)

```bash
gemini -p "..." --output-format stream-json --approval-mode plan
```

## Resume

```bash
gemini --list-sessions
gemini --resume latest -p "Continue" --output-format json --approval-mode plan
```

## Safety knobs

- `--approval-mode plan` (read-only)
- `--approval-mode auto_edit` (auto-approve edits)
- `--approval-mode yolo` or `-y/--yolo` (auto-approve all; high risk)
- `--policy <file-or-dir>` (policy engine)
- `--sandbox` (isolation)

## Exit codes

- 0 success
- 1 general error
- 42 input error
- 53 turn limit exceeded (use `--resume`)

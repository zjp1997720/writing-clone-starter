# writing-clone-starter

A normalized public snapshot of the `writing-clone-starter` skill.

## Structure

This repository intentionally keeps only two parts:

1. `.claude/skills/writing-clone-starter/` — the skill itself
2. `02_素材库/writing-clone-starter-material-library/` — the unified material library used by the skill

## Why this layout

The original private vault had starter materials scattered across inbox, project research, shared material libraries, and auxiliary agent files. This snapshot normalizes that dependency graph so the skill only depends on one material-library root.

## Main entry

- Skill entry: `.claude/skills/writing-clone-starter/SKILL.md`
- Skill docs: `.claude/skills/writing-clone-starter/README.md`
- Material library: `02_素材库/writing-clone-starter-material-library/README.md`

## Notes

- Built-in profiles remain at mixed maturity levels as documented in the skill files themselves
- Maintenance modules such as profile-distillation and profile-probe are included
- All external starter materials referenced by the skill have been normalized into the unified material library

## License

MIT

# writing-clone-starter material library

这是 `writing-clone-starter` 的统一素材库根目录。

目标很简单：
- skill 本体继续放在 `.claude/skills/writing-clone-starter/`
- skill 之外的一切外部素材、证据、clippings、验证材料，都统一归到这里

## 结构

- `authors/<author-id>/canonical/`：运行时最常引用的标准素材
- `authors/<author-id>/evidence/`：上游证据、调研稿、consult 派生材料、原始 clippings
- `authors/<author-id>/validation/`：held-out、negative、probe-evidence
- `authors/<author-id>/provenance/`：旧路径到新路径的迁移账本

## 约束

`writing-clone-starter` 以后只应引用：
1. skill 自己内部的 references
2. `02_素材库/writing-clone-starter-material-library/`

不再直接跨到：
- `00_收件箱/`
- `01_项目/`
- `.claude/agents/`
- 其他分散的全局素材路径

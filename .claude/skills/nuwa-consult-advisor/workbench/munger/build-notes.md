# Build Notes — consult-munger

- 生成目标：`.claude/agents/consult-munger.md`
- 注册目标：`.claude/skills/consult/references/advisor-manifest.json`
- source type：`nuwa`
- 当前状态：准备生成 agent 与 manifest entry，生成后先跑 validator，再把 `validation_status` 从 `pending` 改成 `passed`

## 设计取舍

- `display_name` 用「查理·芒格」，对外更完整
- `artifact_name` 用「芒格」，减少 discuss 文件名冗长
- 顾问定位偏「决策质量 + 认知纠偏」，避免与现有媒体/流量/产品顾问强重叠
- 风格上保留芒格式毒舌、简短、反直觉，但避免做成夸张模仿秀

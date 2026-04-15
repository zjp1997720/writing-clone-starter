# Build Notes — 乔布斯顾问蒸馏

> 日期：2026-04-08
> 生成器：nuwa-consult-advisor

## 蒸馏过程

### Phase 0: 入口
- 用户明确指定：乔布斯
- 默认参数：全画像 + consult 顾问 + 新建

### Phase 1: 多源调研
- 3 个后台 agent 并行调研
- 覆盖 47 个来源 URL
- 产出 3 份研究文件（1123 行总计）

### Phase 1.5: Source Packet
- 7 个心智模型（按排他性排序）
- 10 条决策启发式
- 完整表达 DNA
- 价值观/反模式/内在张力
- discuss 分歧预判

### Phase 2: 顾问化提炼
- 6 个核心框架（做减法、不问用户要什么、自我颠覆、端到端控制、初学者心态、一句话产品定义）
- 表达风格：极简、绝对化、直接挑战、标志性收束
- 边界约束：明确反模式管理、中国市场谦逊

### Phase 3: 资产构建
- Agent 文件：`.claude/agents/consult-jobs.md`
- Manifest entry：已写入 `advisor-manifest.json`（validation_status: pending）

## Phase 4 自检

| 检查项 | 状态 |
|--------|------|
| Frontmatter 完整（name, description, tools, model, maxTurns） | 通过 |
| 包含所有必需 section（角色定位/思维内核/表达风格/擅长领域/边界约束/差异化/落盘边界/团队协作/输出规范） | 通过 |
| Manifest entry 与 agent 文件一致 | 通过 |
| artifact_name 可稳定用于 discuss 文件命名 | 通过 |
| discuss section 包含回应规则和分歧预判 | 通过 |
| validation_status 为 pending（未跳过验证） | 通过 |

## 待完成

- [ ] 通过 validator 后将 validation_status 改为 passed
- [ ] 可选：补充谈判风格、Jony Ive 协作模式等细节

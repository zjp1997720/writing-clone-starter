# Build Notes — Naval Ravikant 顾问蒸馏

> 日期：2026-04-08
> 生成器：nuwa-consult-advisor

## 蒸馏过程

### Phase 0: 入口
- 用户明确指定：Naval Ravikant
- 基于 roster 分析：课程目标用户需要"一人公司 + 杠杆思维"视角
- 默认参数：全画像 + consult 顾问 + 新建

### Phase 1: 多源调研
- 2 个后台 agent 并行调研（第一个失败后补跑）
- 覆盖 14 个来源 URL
- 产出 2 份研究文件

### Phase 1.5: Source Packet
- 6 个心智模型（杠杆理论、特定知识、复利思维、长期游戏、财富vs金钱vs地位、Productize Yourself）
- 10 条决策启发式
- 完整表达 DNA（格言体、跨域映射、断言先行）
- 价值观/反模式/内在张力
- discuss 分歧预判（vs 刘润、芒格、乔布斯、润宇）

### Phase 2: 顾问化提炼
- 6 个核心框架
- 表达风格：格言体、断言先行、跨域映射、冷静坦诚
- 边界约束：文化差异、不假装快乐很简单

### Phase 3: 资产构建
- Agent 文件：`.claude/agents/consult-naval.md`
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

## 与课程目标的匹配度

Naval 的"无需许可的杠杆"理论直接对应课程核心命题：
- AI 分身系统 = 代码杠杆 + 媒体杠杆
- 课程目标用户（小老板/培训师/自由职业者）= 典型的"一人公司"
- "Productize Yourself" = 课程学员在做的事

## 待完成

- [ ] 通过 validator 后将 validation_status 改为 passed

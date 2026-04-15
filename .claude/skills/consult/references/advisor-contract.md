# Consult-Compatible Advisor Contract

本文件定义任何顾问进入 `consult` 平台前必须满足的最小契约。

目标不是只服务 Nuwa，而是让任何符合协议的 agent 都能被 `consult` 调用、验证、参与圆桌。

---

## 设计原则

1. **平台优先**：`consult` 消费通用顾问契约，不消费 Nuwa 私有格式。
2. **单一真相源**：
   - agent 文件负责人格、工具、行为边界
   - manifest 负责 roster、路由元数据、discuss 元数据、校验状态
3. **显式优于隐式**：中文名、artifact 名称、是否允许 discuss，必须是显式字段。
4. **先验证再注册**：生成成功不等于可入 roster。

---

## 顾问资产的三层结构

### 1. Agent 文件（必需）

路径：`.claude/agents/<agent-name>.md`

职责：

- 定义人格与表达方式
- 定义工具、模型、maxTurns
- 定义快速咨询与 discuss 模式下的行为边界

最低 frontmatter：

```yaml
---
name: consult-<slug>
description: <一句话角色说明>
tools: Read, Write, WebSearch, Bash
model: sonnet
maxTurns: 10
---
```

最低正文 section：

- 角色定位
- 思维内核
- 表达风格
- 擅长领域
- 边界约束
- 与其他顾问的差异化
- 落盘边界
- 团队协作（discuss 模式）
- 输出规范

### 2. Manifest 注册（必需）

路径：`.claude/skills/consult/references/advisor-manifest.json`

职责：

- 标记谁是 consult roster 成员
- 提供路由与 discuss 所需的结构化元数据
- 作为 hook/validator 的统一解析入口

### 3. 生成/审计元数据（可选但推荐）

职责：

- 记录顾问来源（legacy / nuwa）
- 记录生成时间、生成器、校验状态
- 为后续刷新和回溯提供依据

---

## Manifest 字段契约

每个 advisor entry 必须包含：

```json
{
  "id": "liurun",
  "agent_name": "consult-liurun",
  "display_name": "刘润",
  "artifact_name": "刘润",
  "aliases": ["刘润", "liurun", "lr"],
  "agent_file": ".claude/agents/consult-liurun.md",
  "core_domains": ["商业模式", "定价", "交易结构"],
  "routing_tags": ["business-model", "pricing", "transaction"],
  "routing_keywords": ["商业模式", "定价", "利润", "ROI"],
  "discuss_eligible": true,
  "validation_status": "passed",
  "source": {
    "type": "legacy",
    "generator": null
  }
}
```

字段说明：

| 字段                | 必需 | 说明                                                                                       |
| ------------------- | ---- | ------------------------------------------------------------------------------------------ |
| `id`                | 是   | roster 内稳定主键，不带 `consult-` 前缀                                                    |
| `agent_name`        | 是   | 对应 `.claude/agents/*.md` frontmatter 中的 `name`                                         |
| `display_name`      | 是   | 给用户展示的中文名                                                                         |
| `artifact_name`     | 是   | discuss 文件命名使用的名字，默认与 `display_name` 一致，但单独保留避免未来变更冲击文件契约 |
| `aliases`           | 是   | 支持中文名/拼音/缩写匹配                                                                   |
| `agent_file`        | 是   | agent 文件路径                                                                             |
| `core_domains`      | 是   | 给主持人做能力概览                                                                         |
| `routing_tags`      | 是   | 结构化路由标签，用于组合与筛选                                                             |
| `routing_keywords`  | 是   | 原始关键词入口，用于从问题到标签/顾问的映射                                                |
| `discuss_eligible`  | 是   | 是否允许进入圆桌                                                                           |
| `validation_status` | 是   | `pending` / `passed` / `failed`                                                            |
| `source.type`       | 是   | `legacy` / `nuwa` / `manual`                                                               |
| `source.generator`  | 否   | 生成来源，Nuwa 产物可写生成器标识                                                          |

---

## 字段归属边界

### 只属于 agent 文件

- 人格正文
- 表达风格细节
- discuss 里的回应方式
- 工具、模型、maxTurns

### 只属于 manifest

- roster membership
- alias 匹配
- routing tags / keywords
- artifact_name
- discuss_eligible
- validation_status
- source metadata

### 不允许双写的字段

- 中文展示名的 roster 版本以 manifest 为准
- discuss artifact 文件名以 manifest 的 `artifact_name` 为准

---

## Admission Gate

一个新顾问进入 consult roster 前，至少要通过：

1. **Agent 文件校验**
   - frontmatter 完整
   - 必需 section 存在
2. **Manifest 校验**
   - `agent_name` 与 `agent_file` 一致
   - `artifact_name` 非空
   - `aliases` 不冲突
3. **Discuss 兼容校验**
   - `discuss_eligible=true` 时，agent 文件必须包含 discuss section
   - artifact 名称可以稳定生成 `01-立场/` 与 `02-讨论/` 路径

只有通过以上校验，`validation_status` 才能为 `passed`。

---

## 对 Nuwa 的要求

Nuwa 不需要理解 consult 的所有流程，但它生成的顾问产物必须满足本契约：

- 生成 `consult-<slug>` 形式的 agent 文件
- 生成或补全一条 manifest entry
- 明确 `source.type = "nuwa"`
- 在产物可注册前通过 validator

这样 Nuwa 是 **上游生产者**，`consult` 是 **下游编排平台**。

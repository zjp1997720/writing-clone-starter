---
name: nuwa-consult-advisor
description: |
  女娲顾问蒸馏器：把人物/主题的思维框架蒸馏成 consult 可调用的 Claude Code subagent，
  输出 `.claude/agents/consult-*.md` 与对应 manifest 注册信息，而不是传统 perspective skill。
  适用于「蒸馏某个名人成顾问」「给 consult 增加一个新人物」「把人物思维方式做成可圆桌讨论的 subagent」。
---

# 女娲顾问蒸馏器

你不是在造一个普通 skill，而是在生产 **consult 平台的顾问资产**。

最终目标：

- 生成一个 consult-compatible advisor agent 文件
- 生成对应的 manifest entry
- 让该顾问通过验证后能进入 consult 的单聊 / 并行 / discuss 模式

---

## 核心产物

本 skill 的标准输出不是 `.claude/skills/*-perspective/SKILL.md`，而是：

1. `.claude/agents/consult-<slug>.md`
2. consult manifest entry（写入 `.claude/skills/consult/references/advisor-manifest.json`）
3. 本次蒸馏的 research / source / audit 文件（保存在当前 skill 工作目录下）

绝不允许只输出一段人物 prompt 或一份普通 markdown 分析就结束。

---

## 先读哪些契约

开始前必须读取：

- `.claude/skills/consult/references/advisor-contract.md`
- `.claude/skills/consult/references/advisor-manifest.json`
- `.claude/skills/nuwa-consult-advisor/references/agent-template.md`
- `.claude/skills/nuwa-consult-advisor/references/manifest-entry-template.json`
- `.claude/skills/nuwa-consult-advisor/references/source-packet-template.md`

这些文件决定了顾问资产的目标格式。若不先读，后续输出大概率会不兼容。

---

## 执行流程

### Phase 0: 入口识别

用户输入可能是：

- 明确人物：例如「蒸馏芒格」「做一个乔布斯顾问」
- 模糊需求：例如「我想要一个更会做战略判断的人物顾问」

处理规则：

- 明确人物 → 直接进入 Phase 0A
- 模糊需求 → 先推荐 2-3 个候选人物，再让用户选 1 个进入 Phase 0A

### Phase 0A: 蒸馏边界确认

最少确认四件事：

- 人物是谁
- 想聚焦的维度（全画像 / 决策 / 产品 / 内容 / 商业 等）
- 用途是否是 **consult 顾问**
- 是新建还是刷新已有顾问

用户没补充时默认：**全画像 + consult 顾问 + 新建**。

### Phase 0.5: 建立工作目录

在当前 skill 目录下创建工作区：

`.claude/skills/nuwa-consult-advisor/workbench/<slug>/`

建议结构：

```text
workbench/<slug>/
├── research/
│   ├── 01-writings.md
│   ├── 02-conversations.md
│   ├── 03-expression-dna.md
│   ├── 04-external-views.md
│   ├── 05-decisions.md
│   └── 06-timeline.md
├── sources/
├── source-packet.md
└── build-notes.md
```

所有中间产物必须保存在当前 vault 内，不能散落到 vault 外。

### Phase 1: 多源调研

延续 Nuwa 原方法，但目标改成“顾问资产”而不是“perspective skill”。

优先信息源：

- 本人著作 / 长文 / 长访谈
- 公开决策记录
- 播客 / 长视频 / AMA
- 高质量二手分析

黑名单：

- 知乎
- 微信公众号
- 百度百科 / 百度知道

### Phase 1.5: Source Packet 组装

将调研汇总到 `source-packet.md`，结构必须至少包含：

- 人物简介
- 关键时期与转折
- 3-7 个候选心智模型
- 5-10 条候选启发式
- 表达 DNA
- 价值观 / 反模式 / 内在张力
- 最近动态
- 明确信息不足点

### Phase 2: 顾问化提炼

你提炼的不是“像他说话”，而是“让他能作为顾问稳定回答问题”。

必须完成：

- 3-7 个高排他性的心智模型
- 5-10 条可执行启发式
- 可运行的表达风格，必须包含：
  - 至少 3 条语气特征（每条带示例句）
  - 至少 5 条口头禅（每条标注使用场景）
  - 至少 3 种结尾收束句式（每种带结构说明和示例）
  - 标准回答结构模板（开场→推进→收束的具体模式）
  - 至少 3 种比喻偏好（每种标注适用问题类型）
- 清晰的边界约束
- discuss 模式下可对质、可回应、可让步的协作规则

### Phase 3: 构建顾问资产

读取 `agent-template.md` 和 `manifest-entry-template.json`。

必须生成：

- `.claude/agents/consult-<slug>.md`
- manifest entry（先以 `validation_status: pending` 生成，只有通过 validator 才能改为 `passed`）

### Phase 4: 顾问资产自检

检查以下问题：

1. agent frontmatter 是否完整？
2. 是否包含 consult agent 必需 section？
3. manifest entry 是否与 agent 文件一致？
4. `artifact_name` 是否可稳定用于 discuss 文件命名？
5. 这份产物是否真的能被 `consult` 调用，而不是只像一个写得漂亮的人物介绍？

### Phase 5: 交付

交付时必须显式说明：

- 生成了哪个 agent 文件
- 对应 manifest entry 是什么
- 还有哪些验证未完成

如果还没完成 validator，不能宣称顾问已正式入 roster。

---

## 混合输入源规则

本 skill 必须支持三类输入同时存在：

1. **公开资料**：网页、视频、播客、书籍、访谈
2. **本地资料**：Obsidian 笔记、Markdown、用户已有素材
3. **手动校正材料**：用户指定的禁止风格、希望突出的角度、要避开的误读

优先级：

- 事实层：公开资料 / 本地原始材料优先
- 风格修正层：用户手动校正优先

不允许忽略用户的手动校正材料。

---

## 绝不做的事

- 不要只产出普通人物 skill
- 不要把 consult 路由规则硬编码进 agent 正文
- 不要跳过 manifest entry
- 不要未经校验就把 `validation_status` 写成 `passed`
- 不要省略 discuss section
- 不要把中间 research 文件写到 vault 外

---

## 成功标准

一次成功的运行，至少满足：

- 产出落在 `.claude/agents/consult-<slug>.md`
- 产出兼容 `.claude/skills/consult/references/advisor-contract.md`
- 生成了可注册的 manifest entry
- 中间 research/source packet 可追溯
- 顾问能被后续 validator 与 consult 平台消费

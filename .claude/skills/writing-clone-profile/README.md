# Writing Clone Profile - Claude Code 版

写作分身引擎（Profile 版），默认运行在 Claude Code 当前仓库里。

## 快速开始

### 1. 确认环境

确保以下能力可用：

- Claude Code 可直接读写当前仓库
- Nowledge Mem / `nmem`（用于记忆搜索，推荐）
- Obsidian CLI（可选，用于上下文采集增强）

### 2. 初始化风格 Profile

首次使用需要初始化你的写作风格。准备 3-5 篇你的代表作（范文），然后对我说：

```
帮我初始化写作风格 Profile
```

我会引导你提供范文，并生成：

- `style-profile.md`：你的风格规则
- `form-normalized-anchors/`：如果这是公众号长文 / 深度长文 profile，额外维护的 form-layer 阅读层
- `voice-cues.md`：从 raw anchors 蒸馏出来的轻量 voice 运行时校准层
- `voice-anchors.md`：后台真值 / 审计 / 回归层

### 3. 开始写作

初始化完成后，直接说：

```
用我的风格写一篇关于 [主题] 的文章
```

我会：

1. 自动采集上下文（vault + 记忆 + 素材库）
2. 评估上下文充足度
3. 默认单线程选择最优结构并写作；只有在你明确要求多版本时才并行生成三种结构草稿
4. 评分择优或受控融合（仅多线程模式）
5. 输出最终稿 + 备选标题

如果当前 profile / 平台命中“公众号型 profile”（例如 `dapeng-wechat`），终稿除了 `title / summary / author` frontmatter，还会在文末追加一个固定收尾脚注块：

```md
---

「注」本文由大鹏的分身系统创作

#标签1 #标签2 #标签3
```

标签默认 3-6 个，优先覆盖主题对象、平台/工具名、问题类型、方法关键词，目标是兼顾阅读收尾与搜索流量。

如果当前 profile 不是公众号型 profile，这组发布元数据和脚注块不必默认强制，由当前 profile policy 决定是否启用。

## 核心特性

- **Profile 驱动**：不是固定 prompt，而是从你的范文中提炼风格规则
- **上下文优先**：先采集充足上下文，再动笔
- **默认单线程**：先选最优结构再写，必要时才切三结构并行
- **断言台账**：任何可被反驳的事实断言都必须有来源
- **去 AI 味**：避免空话、长句、模板化表达

## 场景分工

- 如果你现在只有一个念头，或者还需要我主动搜素材、建 Brief、补案例，请继续用 `writing-clone-profile`。
- 如果你已经和我讨论了很多轮，或者已经给了充足参考资料，当前上下文已经够厚，目标只是直接落稿，请改用 `writing-clone-lite`。

一句话：

- `writing-clone-profile`：从 0 到 1
- `writing-clone-lite`：上下文已成型，直接写

更短的判断法：

- 还需要我主动补 brief、补案例、补上下文，用 `writing-clone-profile`
- brief 已经成型、目标只是尽快落稿，用 `writing-clone-lite`

## 适配说明

本版本在 Claude Code 里这样工作：

1. **文件读取**：直接使用仓库路径，优先配合 `Read` / `Grep` / `Glob`
2. **记忆搜索**：优先使用 `nmem` CLI
3. **联网搜索**：只在补事实时按需使用当前会话可用的网页工具
4. **路径处理**：直接使用 vault 内相对路径或绝对路径

## 文件结构

```
.claude/skills/writing-clone-profile/
├── SKILL.md              # 主 Skill 文件
├── README.md             # 本文件
└── references/           # 引用文件（位于 vault）
    ├── profile-registry.md
    └── profiles/
        └── {profile_id}/
            ├── style-profile.md
            ├── form-normalized-anchors/
            ├── voice-cues.md
            ├── voice-anchors.md
            ├── examples.md
            └── quotes.md
```

注意：`references/` 目录就在仓库内的 `.claude/skills/writing-clone-profile/references/`。当前版本已经是多 profile 结构：先读 `profile-registry.md`，再进入对应的 `{profile_id}` 目录读取风格资产。

如果当前 profile 是公众号长文 / 深度长文，建议把运行时读取顺序理解成：

1. `style-profile.md`
2. `form-normalized-anchors/`
3. `voice-cues.md`（如果存在）

`voice-anchors.md` 继续保留，但默认只做后台真值、审计和 cues 提炼，不再作为当前写稿 runtime 的全文输入。

新的运行时优先级是：**先过 form，再校准 voice。**

## 触发场景

以下场景会自动激活本 Skill：

- 用户要求写公众号文章、自媒体内容
- 用户提到"用我的风格"、"像我一样写"
- 用户要求去除 AI 味、优化文风
- 用户想初始化/更新自己的风格 Profile

## 依赖

- Claude Code 当前仓库读写能力
- `nmem`：记忆搜索
- Obsidian vault：`~/Library/Mobile Documents/com~apple~CloudDocs/deepsight_vault`

## 更新日志

- 2026-03-21：切到 Claude Code 语境，统一使用仓库路径、`nmem` 和当前会话工具

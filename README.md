# claude-code-toolkit

大鹏（[@zjp1997720](https://github.com/zjp1997720)）在 Claude Code 生态下真实使用的工具链开源合集。

包含 **32 个 Skills** + **14 个 Subagents**，覆盖内容创作、顾问咨询、图像生成、工具集成等完整场景。

这不是教程，是一套可以直接装进你的 Claude Code 工作区运行的资产。

---

## 它是什么

这个仓库是我个人 Obsidian Vault 中 `.claude/` 目录的公开快照。

我每天用 Claude Code 做内容创作、产品研究、商业咨询、自动化运营，这里的每一个工具都是在真实任务中跑出来、迭代出来的。

核心理念：

> **Skill 是资产，Prompt 是消耗品。**
> **上下文厚度 > 提示词技巧。**

---

## 目录结构

```text
.
├── .claude/
│   ├── skills/          # 32 个 Skills
│   └── agents/          # 14 个 Subagents
├── 02_素材库/           # 写作素材库（writing-clone-starter 依赖）
├── AGENT_INSTALL_PROMPT.md
├── LICENSE
└── README.md
```

---

## Skills 清单

### 内容创作

| Skill | 说明 |
|-------|------|
| `writing-clone-starter` | 新手写作双模式：强文章模式 + 高拟态模式（内置 6 个作者） |
| `writing-clone-profile` | 写作分身引擎（Profile 版）：先初始化个人风格 Profile，再创作 |
| `writing-clone-lite` | 轻量写作分身：适合对话已有足够上下文的场景 |
| `writing-gate-checker` | 写作硬门审计：输出 final 文章前的独立质量门控 |
| `writing-team` | 写作团队编排：多角色协作完成一篇高质量文章 |
| `mimeng-writing` | 咪蒙爆款写作方法论：情绪驱动 + 标题工程 + 叙事结构 |
| `dapeng-writing-voice-pack` | 大鹏写作声音包：轻量预载，保证「大鹏味」 |
| `content-goldmine-gemini` | 内容挖金矿：把文章/Clippings 拆成可复用的中文素材碎片 |
| `content-packaging-loop` | 内容包装闭环优化器 |

### 顾问咨询

| Skill | 说明 |
|-------|------|
| `consult` | 咨询天团主入口：多顾问数字分身会诊系统 |
| `consult-team-rules` | 圆桌讨论协作规则（discuss 模式专用） |
| `nuwa-consult-advisor` | 女娲顾问蒸馏器：把人物思维框架蒸馏成 consult advisor |
| `deep-collide` | 认知对撞机：强制逼你思考，专属大鹏的深度思考工具 |

### 小红书 / 微信生态

| Skill | 说明 |
|-------|------|
| `wechat-to-xhs-pipeline` | 公众号终稿 → 小红书草稿一键流水线 |
| `wechat-to-xhs-adapter` | 公众号 Markdown → 小红书结构化笔记转换 |
| `xhs-pipeline-publisher` | 小红书草稿发布工具 |
| `wechat-to-teleprompter` | 公众号文章 → 提词器格式转换 |
| `post2wechat` | 发布内容到微信公众号（支持文章/图文） |

### 图像生成

| Skill | 说明 |
|-------|------|
| `seedream-image` | 豆包 Seedream 图像生成 |
| `gemini-image-preview` | Gemini 图像生成（AIGCDesk 后端） |
| `qwen-image` | 通义千问图像生成 |
| `article-illustrator` | 文章智能配图：分析内容后在合适位置生成插图 |
| `video-script-illustrator` | 视频脚本 / 小红书卡片插图生成 |

### 工具集成

| Skill | 说明 |
|-------|------|
| `youtube-transcript` | 提取 YouTube 字幕并生成中文版本 |
| `web-clipper` | 网页文章抓取，保存为本地 Markdown |
| `notebooklm` | Google NotebookLM 完整 API 操控 |
| `feishu-obshare` | 上传 Markdown 到飞书云文档 |
| `picgo-upload` | 本地图片上传到图床 |
| `markdown-styler` | Markdown 排版与平台适配（公众号/知乎/掘金） |
| `gemini-headless-cli` | Gemini CLI 非交互模式调用 |

### Skill 开发与优化

| Skill | 说明 |
|-------|------|
| `skill-creator` | 从零创建或改造 Skill |
| `skill-optimizer` | 诊断并优化已有 Skill |

---

## Subagents 清单

### 顾问团（consult 系统专用）

| Agent | 人物 |
|-------|------|
| `consult-munger` | 查理·芒格 |
| `consult-jobs` | 史蒂夫·乔布斯 |
| `consult-naval` | Naval Ravikant |
| `consult-liurun` | 刘润 |
| `consult-liangning` | 梁宁 |
| `consult-luozhenyu` | 罗振宇 |
| `consult-xuehui` | 薛辉 |
| `consult-runyu` | 润宇 |

### 写作团队（writing-team 系统专用）

| Agent | 职责 |
|-------|------|
| `writing-writer` | 主笔（大鹏风格执笔） |
| `writing-researcher` | 素材猎手（Context Packet 采集） |
| `writing-fact-checker` | 事实核查员 |
| `writing-voice-auditor` | 风格审计员（检查 AI 味） |
| `writing-title-crafter` | 标题工匠（25 个候选 + Top 5） |
| `writing-gate-checker` | 写作硬门审计员 |

---

## 快速安装

### 方式一：手动复制

```bash
git clone https://github.com/zjp1997720/claude-code-toolkit.git
```

把 `.claude/skills/` 和 `.claude/agents/` 里你需要的目录复制到你自己的 Claude Code 工作区对应位置即可。

如果你要用 `writing-clone-starter`，还需要一起带上：

```text
02_素材库/writing-clone-starter-material-library/
```

### 方式二：丢给 Agent 安装

把仓库链接和 `AGENT_INSTALL_PROMPT.md` 一起丢给你的 Agent，让它按说明自动安装。

---

## 使用前提

- 需要 [Claude Code](https://claude.ai/code) 或兼容的 Agent 运行时
- 部分 skill 有额外依赖，见各 skill 目录下的 `README.md` 或 `SKILL.md`
- `content-goldmine-gemini` 依赖本地 Gemini CLI

---

## 关于这些工具的设计哲学

- **环境 > 提示词**：好的工具不靠每次写完美的 prompt，靠预置好的上下文和规则
- **Skill 是资产**：每个 skill 都可以复用、迭代、组合
- **小步快跑**：每个工具都从真实任务需求出发，不为完整而完整

---

## 持续更新

这个仓库会随着我个人工具链的演进持续同步更新。

如果你想关注进展，可以 Watch 这个仓库，或者关注我的公众号 **「智见AI」**。

---

## License

MIT

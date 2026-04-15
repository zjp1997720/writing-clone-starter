# claude-code-toolkit

大鹏（[@zjp1997720](https://github.com/zjp1997720)）在 Claude Code 生态下真实使用的两套工具链：**写作分身** + **顾问天团**。

这不是教程，是可以直接装进你的 Claude Code 工作区运行的资产。

---

## 它解决什么问题

**写作分身**：你没有完整的个人风格资产，但现在就想写出一篇结构清晰、可以直接发布的文章。

**顾问天团**：你面对一个商业/产品/人生决策，想同时听到芒格、乔布斯、刘润、Naval……这些人会怎么分析。

两套工具可以独立使用，也可以组合——先找顾问团把问题想清楚，再用写作分身把洞察写成文章。

---

## 目录结构

```text
.
├── .claude/
│   ├── skills/
│   │   ├── writing-clone-starter/    # 写作分身主入口
│   │   ├── content-goldmine-gemini/  # 素材挖掘工具
│   │   ├── web-clipper/              # 网页抓取工具
│   │   ├── consult/                  # 顾问天团主入口
│   │   ├── consult-team-rules/       # 圆桌模式协作规则
│   │   └── nuwa-consult-advisor/     # 新顾问蒸馏工具
│   └── agents/
│       ├── consult-munger.md         # 查理·芒格
│       ├── consult-jobs.md           # 史蒂夫·乔布斯
│       ├── consult-naval.md          # Naval Ravikant
│       ├── consult-liurun.md         # 刘润
│       ├── consult-liangning.md      # 梁宁
│       ├── consult-luozhenyu.md      # 罗振宇
│       ├── consult-xuehui.md         # 薛辉
│       └── consult-runyu.md          # 润宇
├── 02_素材库/                        # writing-clone-starter 运行时素材库
├── LICENSE
└── README.md
```

---

## 写作分身

### 包含什么

| 工具 | 说明 |
|------|------|
| `writing-clone-starter` | 主入口：强文章模式 + 高拟态模式（内置 6 个作者） |
| `content-goldmine-gemini` | 把文章/Clippings 拆成可复用素材碎片 |
| `web-clipper` | 把网页文章抓取为本地 Markdown |

### 两种写作模式

**强文章模式**（默认）：不指定作者，按 4 种内容原型自动路由：观点拆解型 / 方法教程型 / 案例复盘型 / 认知升级型。目标是写出能站住脚、结构清晰、可直接发布的文章。

**高拟态模式**：指定内置作者，按其方向写。内置 6 位作者：Dan Koe、粥左罗、Justin Welsh、刘润、梁宁、薛辉。如果题目超出作者带宽，自动降级回强文章模式，不硬凹。

### 快速试用

```text
帮我写一篇关于 AI 内容获客的文章
```

```text
像 Dan Koe 那样写一篇关于一人公司内容策略的文章
```

### 维护者工具链

如果你想扩充作者 profile，完整维护链是：

```text
web-clipper → content-goldmine-gemini → writing-clone-starter（profile 蒸馏模式）
```

> `content-goldmine-gemini` 依赖本地 Gemini CLI，首次使用需要安装并登录。

---

## 顾问天团

### 包含什么

| 工具 | 说明 |
|------|------|
| `consult` | 主入口：支持单聊、并行汇总、圆桌辩论三种模式 |
| `consult-team-rules` | 圆桌模式的协作规则（discuss 模式专用） |
| `nuwa-consult-advisor` | 用于蒸馏新顾问的工具：输入公开资料，输出可接入 consult 的 subagent |

### 8 位内置顾问

| 顾问 | 核心视角 |
|------|----------|
| 查理·芒格 | 多元思维模型、逆向思考、激励分析 |
| 史蒂夫·乔布斯 | 产品哲学、聚焦、颠覆性决策 |
| Naval Ravikant | 杠杆思维、长期游戏、个人战略 |
| 刘润 | 商业模式、定价策略、交易结构 |
| 梁宁 | 产品思维、用户需求洞察、AI 产品策略 |
| 罗振宇 | 宏观趋势判断、AI 时代定位 |
| 薛辉 | 短视频运营、流量获取、账号变现 |
| 润宇 | 自媒体战略、IP 商业化、私域运营 |

### 三种使用模式

**单聊**：和某一位顾问深入对话。
```text
/consult @芒格 我现在的定价策略是否合理？
```

**并行汇总**：同一个问题，多位顾问同时给出独立观点，汇总对比。
```text
/consult @芒格 @刘润 @Naval 帮我分析这个商业模式的核心风险
```

**圆桌讨论**：顾问之间互相辩论，观点碰撞。
```text
/consult --discuss @芒格 @乔布斯 @梁宁 关于 AI 产品是否应该先做 B 端
```

### 新增顾问

用 `nuwa-consult-advisor` 蒸馏任何人：

```text
帮我把段永平蒸馏成一个新的 consult advisor
```

输入公开资料（文章、演讲、书籍），输出即可直接接入 consult 系统的 subagent 文件。

---

## 安装

### 方式一：手动复制

```bash
git clone https://github.com/zjp1997720/claude-code-toolkit.git
```

把你需要的目录复制到你的 Claude Code 工作区：

- 写作分身：`.claude/skills/writing-clone-starter/` + `02_素材库/writing-clone-starter-material-library/`
- 顾问天团：`.claude/skills/consult/` + `.claude/skills/consult-team-rules/` + `.claude/agents/consult-*.md`
- 蒸馏新顾问：`.claude/skills/nuwa-consult-advisor/`

### 方式二：丢给 Agent

把仓库链接丢给你的 Claude Code Agent，让它按 README 自动安装到你的工作区。

---

## 使用前提

- 需要 [Claude Code](https://claude.ai/code) 或兼容的 Agent 运行时
- `content-goldmine-gemini` 需要本地安装 Gemini CLI 并完成登录

---

## 设计理念

> **Skill 是资产，Prompt 是消耗品。**
> **上下文厚度 > 提示词技巧。**

这里的每个工具都是从真实任务中跑出来的，不是为了演示而造的。你用的越多，上下文积累越厚，工具越顺手。

---

## 持续更新

这个仓库随我个人工具链演进持续同步。

关注进展：Watch 这个仓库，或关注公众号 **「智见AI」**。

---

## License

MIT

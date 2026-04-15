---
name: writing-clone-profile
description: |
  写作分身引擎（Profile 版）- 先初始化生成你的风格 Profile，再按你的风格创作公众号/自媒体内容。

  **触发场景**：
  - 用户要求写公众号文章、自媒体内容
  - 用户提到"用我的风格"、"像我一样写"
  - 用户要求去除AI味、优化文风
  - 用户想初始化/更新自己的风格 Profile

  **核心能力**：
  - 支持多个命名 Profile：可持续新增，不覆盖已有风格资产
  - 首次使用先初始化：从范文提炼风格 Profile + 范文锚点
  - 先主动搜集上下文（仓库 + 记忆 + 素材库），再写作
  - 先判断上下文是否充足，不足时才用苏格拉底式追问补齐
  - 默认单线程写作（主代理一条线程完成全流程，风格更稳定）
  - 可选多线程模式：并行生成三种爆款结构草稿，再评分择优或受控融合
  - 避免"AI味"，保持真实感和对话感
  - 自动迭代：用新范文/反馈更新 Profile
---

# 写作分身引擎（Profile 版）

## 快速使用规则

1. 先做上下文采集和充足度评估，再动笔。
2. 追问必须克制：一次只问一个问题，总预算最多 2 个问题。
3. **默认单线程**：主代理评估候选结构 → 选最优 → 独立完成写作全流程。
4. **可选多线程**：用户说"多版本/对比/并行写"时，切三子稿并行模式。
5. 多线程模式下：三子稿共享同一份 Brief 和 Claim Ledger；融合只做模块替换，不做全篇缝合。

### 场景边界说明

- 我更适合「起心动念阶段」：想法刚出现、上下文还薄、需要主动采集和补料。
- 如果当前对话已经形成高质量 brief，或者用户已经给了大量参考资料，目标只是高效落稿，优先改用 `writing-clone-lite`。
- 一句话：**我负责把想法长成文章，Writing Clone Lite 负责把已经长出来的文章顺手写出来。**

---

## 风格来源（Profile 驱动）

本 Skill **不内置任何固定作者风格**。你的风格来自「已选中的 Profile 目录」。

### Profile 存储结构

- 注册表：`references/profile-registry.md`
- Profile 根目录：`references/profiles/`
- 当前会话选中的目录：`{selected_profile_dir}/`

### 每个 Profile 的推荐资产结构

1. `{selected_profile_dir}/style-profile.md`：该 Profile 的风格规则（必需）
2. `{selected_profile_dir}/form-normalized-anchors/README.md`：该 Profile 的 form-layer 说明与规整版锚点入口（公众号长文 / 深度长文 profile 的运行时主 form 资产）
3. `{selected_profile_dir}/voice-cues.md`：从 raw anchors 蒸馏出来的轻量 voice cues（长文 runtime 建议纳入）
4. `{selected_profile_dir}/voice-anchors.md`：后台真值 / 审计 / 回归 / cues 提炼来源（保留，但默认不直接进入写稿 runtime）
5. `{selected_profile_dir}/examples.md`：该 Profile 的案例与类比（可选）
6. `{selected_profile_dir}/quotes.md`：该 Profile 的金句与高频表达（可选）

一句话：`style-profile.md + form-normalized-anchors/ + voice-cues.md` 负责前台写稿；`voice-anchors.md` 负责后台真值与审计。

### 迁移兼容说明

- 根目录旧文件 `references/style-profile.md`、`references/voice-anchors.md`、`references/examples.md`、`references/quotes.md` 现在只保留迁移说明，不再参与 profile 选择，也不再作为新的写入目标。
- 真正的选择入口永远是 `references/profile-registry.md`；不要绕开注册表直接把某个旧路径当默认 profile。

后续写作必须先确定 `selected_profile_dir`，再读取对应资产；如果你在当前对话里提出明确风格约束（例如“更犀利/更克制/更幽默”），则以当前对话为最高优先级。

---

## 初始化（首次必做一次；之后可持续新增）

**何时触发**：

- 如果 `references/profile-registry.md` 不存在，或注册表里没有任何可用 profile，先进入首次初始化，再开始写作。
- 如果用户说“初始化一个新的 profile / 新建 profile / 重建某个 profile / 更新某个 profile”，也进入初始化或更新流程。

### 初始化前先确定 Profile 身份

初始化开始前，先确定这 4 个字段：

- `profile_id`：英文 slug，用于目录名，例如 `dapeng-wechat`
- `display_name`：给用户展示的名字，例如「大鹏-公众号长文」
- `target_platform`：这个 Profile 主要服务的平台或场景
- `best_for`：一句话说明适合拿来写什么

如果用户只说“帮我初始化一个新的 profile”但没给名字，默认先补这一个问题，再继续收范文。

**初始化输入（用户需要提供）**：

- 3-5 篇范文（同一作者、同一平台为佳），每篇尽量提供完整正文
  - 每篇附：标题、发布时间（可选）、发布平台/链接（可选）、哪些段落最像你（可选）
  - 隐私要求：如果范文含个人敏感信息，先由用户脱敏后再提供

推荐：如果范文已在 vault 里有 Markdown 文件，优先用“路径清单 + `![[...]]` 嵌入预览”方式维护锚点，减少粘贴带来的噪音与重复。

**初始化输出（写入该 Profile 目录）**：

- 写入 `references/profiles/{profile_id}/voice-anchors.md`：收录用户提供的范文原文（或锚点文件路径清单），作为后台真值层保留
- 生成 `references/profiles/{profile_id}/style-profile.md`：从范文中提炼可执行的风格规则（语气、句式、节奏、结构、常用表达、禁区等）
- 对公众号长文 / 深度长文 profile，生成：
  - `references/profiles/{profile_id}/form-normalized-anchors/`
  - `references/profiles/{profile_id}/voice-cues.md`
- 按需生成 `references/profiles/{profile_id}/examples.md` 与 `references/profiles/{profile_id}/quotes.md`
- 追加或更新 `references/profile-registry.md`

**初始化完成的 Gate**：

- `references/profile-registry.md` 中已存在该 profile 的记录
- `references/profiles/{profile_id}/voice-anchors.md` 已写入且包含 3+ 篇范文（全文或锚点引用均可，但必须能定位到完整正文）
- `references/profiles/{profile_id}/style-profile.md` 已写入且包含“可执行规则”（不只是抽象形容词）
- 如果 `target_platform` 命中公众号长文 / 深度长文：
  - `references/profiles/{profile_id}/form-normalized-anchors/README.md` 已存在
  - `references/profiles/{profile_id}/voice-cues.md` 已存在

### 更新与新建的区分规则

- 用户说“更新某个 profile” → 只更新该 profile，不覆盖其他 profile
- 用户说“新建一个 profile” → 必须创建新目录，不允许静默覆盖旧目录
- 用户没说清楚是更新还是新建 → 默认优先按“新建 profile”处理，并说明理由

---

## 反模式（必须避免）

| 反模式         | 说明                                                   |
| -------------- | ------------------------------------------------------ |
| **AI味**       | 缺乏人的痕迹、没有情绪和立场、过于工整                 |
| **正确的废话** | 看起来正确但空洞无物，「好像什么都说了，又什么都没说」 |
| **高高在上**   | 不做「专家建议」，而是「跟大家聊聊」                   |
| **追热点**     | 写读者两年后再看也有收获的文章                         |
| **囤积不用**   | 收集素材却不产出内容                                   |
| **造轮子沉迷** | 沉浸在打造工具的乐趣里，忘了工具的目的                 |
| **结构性重复** | 同一个主张在不同模块被重复解释，只是换了一种说法       |
| **信息密度低** | 文本变长了，但新增信息没有同步增加                     |

**具体避免的表达（默认清单，以 Profile 为准）**：

如果 `{selected_profile_dir}/style-profile.md` 明确允许这些表达，则以 Profile 为最高优先级。

- 尽量少用过度模板化/空洞的行业黑话（除非你的风格就是这样，或你在讽刺/调侃）
- 避免过度正式的抬头称呼（除非你的范文里就是这么写的）
- 不写流水账式总结
- 不过度使用 emoji
- 默认不用弯引号 `“ ”` 作为正文常规引号；中文引用默认统一用 `「」`
- 除非是代码、配置、外文原句、产品字段名，否则不要混用半角引号、弯引号和直角引号

**新增完整性反模式**：

- 不编造用户案例、数据、项目结果
- 不把无来源断言写成确定事实
- 不从私密上下文直接搬运到公开内容

---

## V2 写作工作流（强制）

### Phase -1：创建项目结构

**Action**：

1. 根据主题确定项目名，格式：`YYMMDD_主题关键词`
   - 示例：`260203_Dan_Koe写作流程复现`、`260115_AI编程暴论`
   - 日期用当前日期（YY=年后两位，MM=月，DD=日）
2. 设定项目路径：`01_项目/内容创作/{YYMMDD_项目名}/`
3. 用 Bash 创建文件夹结构：

```bash
mkdir -p "01_项目/内容创作/{YYMMDD_项目名}/01-Context" \
         "01_项目/内容创作/{YYMMDD_项目名}/02-Drafts" \
         "01_项目/内容创作/{YYMMDD_项目名}/03-Reviews"
```

**输出路径规范**：

- Context Packet → `01_项目/内容创作/{YYMMDD_项目名}/01-Context/context-packet.md`
- 草稿 v1 → `01_项目/内容创作/{YYMMDD_项目名}/02-Drafts/草稿_v1.md`
- 草稿 v2 → `01_项目/内容创作/{YYMMDD_项目名}/02-Drafts/草稿_v2.md`
- Final Candidate → `01_项目/内容创作/{YYMMDD_项目名}/草稿_final.candidate.md`
- 最终稿 → `01_项目/内容创作/{YYMMDD_项目名}/草稿_final.md`
- 备选标题 → `01_项目/内容创作/{YYMMDD_项目名}/03-Reviews/备选标题.md`
- Claim Ledger → `01_项目/内容创作/{YYMMDD_项目名}/03-Reviews/Claim-Ledger.md`
- Structure Eval → `01_项目/内容创作/{YYMMDD_项目名}/03-Reviews/Structure-Eval.md`
- Module Budget → `01_项目/内容创作/{YYMMDD_项目名}/03-Reviews/Module-Budget.md`
- Lint Report → `01_项目/内容创作/{YYMMDD_项目名}/03-Reviews/Lint-Report.md`
- Gate Check Report → `01_项目/内容创作/{YYMMDD_项目名}/03-Reviews/Gate-Check-Report.md`

**Gate**：文件夹结构已创建。

---

### Phase 0：构建 Brief

先整理一页 Brief（统一给所有子代理）：

- `topic`: 本文主题
- `target_reader`: 目标读者
- `goal`: 读后希望发生的行动或认知变化
- `stance`: 核心立场（1 句话）
- `constraints`: 约束（字数、是否可写数据、语气）
- `must_include`: 必须出现的案例/观点
- `must_avoid`: 明确禁止点
- `density_preference`: 信息密度偏好（默认：`用尽量短的文本输出尽量多的价值`）
- `redundancy_budget`: 重复预算（默认：`同一主张只能完整展开一次`）
- `goldmine_usage_mode`: 素材库使用强度（默认：`auto`；按文章类型自动落到 `skip / low / medium / high`）

### Phase 0.3：Profile Gate（先选，再写）

在读取风格资产前，必须先 resolve 当前使用哪一个 profile。

**执行顺序**：

1. 读取 `references/profile-registry.md`
2. 列出所有 `status: active` 的 profile
3. 按下面规则确定 `selected_profile_dir`

**决策规则**：

- 如果用户这轮输入已显式指定 profile 名 / profile_id / display_name / registry 中已登记 alias → 直接采用，并回显确认
- 如果当前只有 1 个 active profile → 直接采用，不追问，只回显“本次使用 X profile”
- 如果当前有 2 个及以上 active profile，且用户未指定 → 必须先展示候选列表、推荐项和一句确认问题，等用户确认后再继续
- 如果 registry 存在，但所有 profile 都不可用 → 回到初始化流程

**多 profile 时的输出口径**：

- 列出候选 profile（序号 + display_name + 一句话定位）
- 给出推荐项及推荐理由
- 最后只问一句：“你确认这次用哪一个？回复数字或 profile 名就行。”

**Gate**：`selected_profile_dir` 已确定。

### Phase 0.5：主动上下文采集

先采集，再写作。**强制执行顺序**：

1. `{selected_profile_dir}/style-profile.md`（风格 Profile，必须）
2. `{selected_profile_dir}/form-normalized-anchors/README.md`（公众号长文 / 深度长文默认读取）
3. 当前 profile 下 1-3 篇最相关 normalized anchors（命中长文场景时必须逐篇读取全文，不许只看 `README.md`）
4. `{selected_profile_dir}/voice-cues.md`（如果存在，读取；用于轻量 voice 校准）
5. `{selected_profile_dir}/examples.md`（可选：案例锚点）
6. `{selected_profile_dir}/quotes.md`（可选：金句锚点）
7. 用户当前对话和附件素材（必须）
8. **nmem 记忆搜索**（必须，见下）
9. Goldmine Pack（从 `02_素材库/` 抽取少量高相关碎片，按需，见下）
10. 用户仓库内与主题相关内容（必须；优先用 Obsidian 官方 CLI `search:context`，失败回退 Grep）
11. **WebSearch 联网调研**（按需，见下）

说明：`voice-anchors.md` 保留在当前 profile 目录中，但默认不直接参与本轮写稿 runtime。只有在 profile 更新 / 风格偏移审计 / 重新提炼 `voice-cues.md` 时，才按需回到 raw。

### Phase 0.6：Goldmine Budget Card（强制）

在真正检索素材库前，先写一张 `Goldmine Budget Card`，只为当前文章服务：

- `article_mode`: `personal / judgment / method / framework`
- `slot_gap_map`: `hook / structure / gold_sentence / ending` 各自是否缺口明确
- `goldmine_usage_mode`: `skip / low / medium / high`
- `query_terms`: 至少 3 组（topic / slot / stance）
- `hard_budget`: 总条数、单槽位上限、单条摘录上限
- `drop_rules`: 哪些命中会因为压过当前 Profile、冲淡真实经历或重复已有判断而直接丢弃

自动决策规则：

- `personal` / `judgment`：默认 `skip` 或 `low`
- `method`：默认 `medium`
- `framework`：默认 `medium`，只有明确缺结构骨架时才升到 `high`
- 只要文章强依赖真实经历、个人情绪、阶段性判断，就不能默认 `medium/high`

`Goldmine Budget Card` 没写清之前，不要开始搜 Goldmine。

#### nmem 记忆搜索（强制）

**目标**：从长期记忆中找到相关的洞察、决策、经历，补充上下文。

**执行方式**：

```bash
# 基础搜索（必须执行）
nmem --json m search "<主题关键词>" -n 5

# 如果主题涉及时间意图（"最近/上周/去年/当时"），加时间筛选
nmem --json m search "<关键词>" -n 5 --event-from 2025-01 --event-to 2026-03

# 如果需要按标签筛选（可选）
nmem --json m search "<关键词>" -n 5 -l insight
nmem --json m search "<关键词>" -n 5 -l decision

# 如果需要深度搜索（跨领域联想、找矛盾、追溯原因）
nmem --json m search "<关键词>" -n 5 --mode deep
```

**产出格式**：

- `source_type`: memory
- `source_path_or_id`: memory-id-xxx
- `public_ok`: ✅ / ❌（根据记忆内容判断）
- `relevance`: 0-5
- `notes`: 这条记忆如何用在文章中

**跳过条件**：

- 搜索结果为空或相关度 < 3 的条目不足 2 条

#### Obsidian CLI 检索提示

（只用于"采集上下文"，不要整段搬运）：

```bash
obsidian search:context vault=deepsight_vault query="关键词" path="01_项目" limit=3 format=json

# 当 query 含 ':' 或形如 '#tag:' 时，必须整体加引号做字面量检索
obsidian search:context vault=deepsight_vault query="\"#due:\"" path="04_系统" limit=3 format=json
```

#### Goldmine Pack（Soft-gated，按需启用）

`/content-goldmine` 会把拆解后的可复用碎片存进 `02_素材库/灵感素材/`。

**目标**：只在它能明显提升开头/结构/金句时才纳入；否则跳过，不要为了用而用。

**核心定位**：它是“增强器”，不是“主笔”。

优先级必须始终保持：

1. 用户当前对话与本轮 Brief
2. 当前 Profile 的 `style-profile.md` + `form-normalized-anchors/` + `voice-cues.md`（如果存在）
3. 当前 Profile 的 `examples.md` / `quotes.md`
4. memory / repo 内相关上下文
5. Goldmine Pack

只要 Goldmine 与当前 Profile 风格、真实经历、文章立场冲突，优先保留 Profile 和当前对话，直接丢弃 Goldmine 命中项。

**启用条件**（满足任一条即可启用）：

1. Brief 中缺少明确的 hook/开头方向
2. Brief 中缺少结构骨架
3. Brief 中需要金句式表达，但当前素材缺少记忆点

**跳过条件**（满足任一条必须跳过）：

1. 相关度 >= 4 的条目不足 2 条
2. 无法明确说明这条要用在文章哪个模块（hook/structure/gold_sentence）

**使用程度建议**：

- **低使用**：0-2 条。适用于有强个人经历/强观点的文章，只拿来补 hook 或结尾。
- **中使用**：2-4 条。适用于方法论拆解型文章，用来补结构骨架、金句密度。
- **高使用**：4-6 条。只适用于纯框架型文章；即便如此，也必须“提炼模式”，不能直接拼贴原句。

默认不预设全局固定档位，而是按 `Goldmine Budget Card` 的 `article_mode` 自动决定；只有 `method / framework` 才优先落到“中使用”。每个模块最多借 1 条素材：

- hook 最多 1 条
- 结构最多 1 条
- 金句最多 2 条
- 结尾最多 1 条

如果 `Goldmine Budget Card` 判定为 `personal` 或 `judgment`，把默认值改成：

- `skip`：完全不用 Goldmine
- `low`：只允许补 1 个 hook 或 1 个 ending，不允许借外部结构做主骨架

**硬原则**：

- 不允许把素材库当成现成段落库直接拼接
- 不允许为了“显得有料”而堆 5 个以上碎片到同一篇文章里
- 不允许让外部作者的表达盖过当前 Profile 的活人感
- 优先抽取“模式/结构/节奏”，其次才是金句本身

**检索范围**：

- 首选根目录：`02_素材库/`
- 结果过滤时再收缩到：
  - `02_素材库/灵感素材/标题/`
  - `02_素材库/灵感素材/开头/`
  - `02_素材库/灵感素材/金句/`
  - `02_素材库/灵感素材/结构/`

**硬预算（必须遵守）**：

- 总条数 <= 6
- 每类最多 2 条（标题/开头/金句/结构）
- 单条摘录最多 200 字（只摘「公式 / 模式 / 为什么好」，不要整段搬运）

**动态检索规则（强制）**：

1. 先判断当前文章缺哪个槽位：`hook / structure / gold_sentence / ending`
2. 再基于 `topic + 槽位 + stance` 生成查询词
3. 优先在 `02_素材库/` 根目录动态检索，不要先假设固定子目录或固定作者入口
4. 命中过多时，再按类型目录过滤；命中不足时，再补作者名 / source_label / 最近修改
5. 只保留能明确说明 usage_slot、且不压过当前 Profile 风格的结果

详细策略见：`references/goldmine-retrieval-strategy.md`

**落到 Context Packet 的格式建议**：

- `source_type`: library
- `source_path_or_id`: 具体文件路径
- `content`: 摘录（<=200字）
- `relevance`: 4-5
- `notes`: 必须标注 usage_slot（hook/structure/gold_sentence）

#### 联网调研（按需触发）

**目标**：获取最新的行业文章、数据、案例，补充实时性上下文。

**触发条件**（满足任一即可）：

1. Brief 中包含"最新/2026/今年/趋势/数据"等关键词
2. 主题涉及行业动态、产品发布、政策变化
3. 用户明确要求"查一下最新的..."

**跳过条件**（满足任一必须跳过）：

1. 纯方法论/个人经验类文章
2. 用户明确说"不需要联网"
3. 主题是历史回顾或个人复盘

**执行方式**：

```bash
# 用当前会话可用的网页工具搜索 2-3 个关键词
# 每个关键词最多取 3 条结果
```

**产出格式**：

- `source_type`: web
- `source_path_or_id`: https://...
- `public_ok`: ✅
- `relevance`: 3-5
- `notes`: 这条信息如何用在文章中（数据/案例/对比/引用）

---

采集结果必须整理成 `Context Packet`，每条信息记录：

- `source_type`（reference/user/repo/memory/library/web）
- `source_path_or_id`
- `public_ok`（是否可公开）
- `relevance`（0-5）
- `notes`（为何使用）

对 `writing-clone-profile` 来说，`Context Packet` 不是建议项，而是默认硬前置。

进入 Gate A 前，至少要满足：

- `01-Context/context-packet.md` 已写入
- 内容不是空壳，且足以支撑 `references/context-sufficiency.md` 的评分

对高事实密度、强风格复现、强案例依赖任务，这条硬前置不放松。

### Gate A：上下文充足度判断

按 `references/context-sufficiency.md` 评分。

- `score >= 70`：直接进入写作。
- `50 <= score < 70`：只问 1 个高杠杆问题。
- `score < 50`：最多问 2 个问题，问完即继续，不无限追问。

### Phase 1：苏格拉底式补料（按需触发）

只问能改变文章质量的问题。单轮只问一个。

问题必须包含：

- 你缺什么（明确槽位）
- 为什么缺它会影响文章
- 推荐默认值（用户不回复也可继续）

### Phase 2：模式路由

**默认单线程**，除非用户明确要求多版本/对比/并行写。

路由判断时机：Brief 确认后、动笔前。

| 信号                                       | 模式   |
| ------------------------------------------ | ------ |
| 默认（无特殊要求）                         | 单线程 |
| 用户说"多版本""对比""并行写""给我几个版本" | 多线程 |
| 用户说"快速出一版""直接写"                 | 单线程 |

---

### 【单线程模式】Phase 3S：主代理独立写作

#### Step 1：写前骨架

产出三个中间件：

1. `Claim Ledger`（断言台账，见 `references/claim-ledger-spec.md`），**必须写入** `03-Reviews/Claim-Ledger.md`
2. `候选结构评估`：参考 `references/three-structures.md`，列出 3 种候选结构的骨架（每种只写 3-5 行要点），评估各自与当前主题/素材的适配度、信息密度、重复风险，选定最优结构并说明理由，**必须写入** `03-Reviews/Structure-Eval.md`
3. `Module Budget`：把全文先压成 4 个以内主模块，并为每个模块写清，**必须写入** `03-Reviews/Module-Budget.md`
   - 这个模块只负责什么
   - 它提供的新增信息是什么
   - 如果删掉它，文章会损失什么
4. `Goldmine Retrieval Plan`：只针对 `slot_gap_map` 里真的缺口的槽位写明：
   - 要不要用 Goldmine
   - 用哪个强度档位
   - 每个槽位最多补几条
   - 哪些命中必须丢弃

规则：

- 任何可被反驳的事实断言，都必须在 Claim Ledger 里有来源；无来源则降级为主观判断。
- 如果某个模块无法说明自己的新增信息，这个模块默认不该写。
- 默认优先选择更紧的结构，而不是更完整但更臃肿的结构。
- 如果是单一强观点、纠偏导向、且后半段大概率只会重复证明的题目，优先选 4 拍压缩结构，不为“完整”保留 6 段。

#### Step 2：完整写作

主代理用选定结构直接写完整草稿。写作过程中默认对齐：

- `{selected_profile_dir}/style-profile.md`
- `{selected_profile_dir}/form-normalized-anchors/README.md`
- 当前主题最相关的 normalized anchors
- `{selected_profile_dir}/voice-cues.md`（如果存在）

运行时默认规则：

- `style-profile.md` 负责规则、禁区、立场边界
- `form-normalized-anchors/` 负责正文主判断由完整自然段承载、段落组织、信息密度和短句预算
- `voice-cues.md` 只负责轻量校准语气、判断力度、收束方式和活人感
- `voice-anchors.md` 保留在后台，不默认作为本轮写稿全文输入

写作硬约束：

- 同一个主张只能完整展开一次；后文如果再次出现，只能推进，不允许换一种说法重讲一遍。
- 每个主模块都必须提供新增信息：新机制 / 新案例 / 新路径 / 新判断，至少占一项。
- 如果某一段删掉后，文章主线几乎不受影响，这一段默认应删除或并入前文。
- 优先写「更短但更值钱」的版本，不追求表面完整度。

草稿必须附带：

- `title_candidates`（3 个）
- `gold_sentences`（3 句）
- `cta`（1 段）
- `unsupported_claims`（无来源断言列表）
- `ai_smell_hits`（AI 味命中项）
- `chosen_structure`（选定的结构类型及理由）
- `redundancy_risks`（最可能重复的 1-3 个观点）

这些附带元数据如果不直接跟在草稿末尾，至少要同步写入 `03-Reviews/Lint-Report.md`。

#### Step 3：自检

对草稿执行四重 Lint。

**硬规则：自检必须使用工具验证，不许只凭印象回忆。**

执行时，必须使用 `Grep / rg / 等效搜索工具` 进行至少以下查询，并把结果写入 `03-Reviews/Lint-Report.md`：

- 对照句模式查询：`不是 X，是 Y / 不是……而是…… / 不只是……而是……`
- AI 味禁用词查询：如 `首先 / 其次 / 总之 / 综上所述 / 作为一个 AI / 您`
- 标点与引号查询：弯引号、异常混用的中文/英文引号
- `unsupported_claims` 结果与对应处置

改完后，必须重跑对应查询；没有查询证据，不算完成 lint。

对草稿执行四重 Lint：

1. `Voice Lint`：口语感、判断力度、对话感、反模式词命中；不再把“短句率”当作 voice 指标
2. `Form Lint`：按 normalized form 检查：
   - 主判断是否由完整自然段承载
   - 是否出现连续 2 个以上单句短段
   - 是否出现连续 3 个以上超短正文段
   - 短句是否越权承担解释功能
   - 整体读感是否更像公众号长文，而不是讲义、切句稿、朋友圈拆句长文
3. `Integrity Lint`：`unsupported_claims == 0`
4. `Redundancy Lint`：按 `references/redundancy-lint.md` 检查是否出现下面 3 类问题
   - 同一主张在不同模块被重复解释
   - 两个模块提供的是同一层信息，只是换了一种说法
   - 某一段删掉后，文章价值几乎不受影响

完成后，**必须**把 lint 结果写入 `03-Reviews/Lint-Report.md`。

`Lint-Report.md` 至少要包含：

- 每条工具查询的结果摘录或明确写明“0 命中”
- `unsupported_claims` 列表或 `unsupported_claims == 0`
- 对未通过项的修正动作说明

未通过时，只重写失败模块（开头/案例/收尾 / 重复模块），不全篇重写。

完成后直接进入 Phase 4：终稿收束。

---

### 【多线程模式】Phase 3M：三子代理并行写作

#### Step 1：写前骨架

产出三个中间件：

1. `Outline Beats`（6 段节奏骨架）
2. `Claim Ledger`（断言台账，见 `references/claim-ledger-spec.md`）
3. `Module Budget`（共享上限：4 个以内主模块；每个模块写明职责、新增信息、删除损失）

规则：

- 任何可被反驳的事实断言，都必须在 Claim Ledger 里有来源；无来源则降级为主观判断。
- 三子稿共享同一份 `Module Budget`，不允许每个子稿偷偷扩成 5-6 个大模块。
- 如果当前主题命中“强观点 / 纠偏 / 单一主张”，B 结构默认先用压缩版参与竞争。

#### Step 2：三子代理并行写作

按 `references/three-structures.md` 并行生成三篇：

- A：场景代入型
- B：观点打击型
- C：痛点引入型

三子代理共享同一份 Brief / Context Packet / Claim Ledger，并共同对齐：

- `{selected_profile_dir}/style-profile.md`
- `{selected_profile_dir}/form-normalized-anchors/README.md`
- 当前主题最相关的 normalized anchors
- `{selected_profile_dir}/voice-cues.md`（如果存在）

不允许各自改题，也不默认把 `voice-anchors.md` 全文带进子稿 runtime。

每篇草稿必须附带：

- `title_candidates`（3 个）
- `gold_sentences`（3 句）
- `cta`（1 段）
- `unsupported_claims`（无来源断言列表）
- `ai_smell_hits`（AI 味命中项）

#### Step 3：三重 Lint

每篇草稿都要通过：

1. `Voice Lint`：口语感、判断力度、对话感、反模式词命中
2. `Form Lint`：正文承载方式、短句预算、碎段上限、长文读感
3. `Integrity Lint`：`unsupported_claims == 0`
4. `Redundancy Lint`：同一主张不可跨模块重复展开；删掉低增量段落后主线仍成立的，直接删或并段

未通过时，只重写失败模块（开头/案例/收尾/重复模块），不全篇重写。

#### Step 4：评分、选稿、受控融合

按 `references/scoring-rubric.md` 打分并排序。

- 先选 1 篇为底稿
- 融合时最多替换 1-2 个模块（例如：只换开头和收尾）
- 不做句子级拼接，避免缝合感

完成后进入 Phase 4：终稿收束。

---

### Phase 4：终稿收束

终稿前做四遍检查：

1. 去 AI 味（删空话、打断长句、增强对话感）
2. 断言复核（再次对齐 Claim Ledger）
3. 标点复核（默认把正文里的常规中文引号统一成 `「」`，清除误混入的 `“ ”`）
4. 压缩复核（在不损失观点、案例、风格的前提下，优先删除重复解释、镜像模块和低新增信息段落）

压缩复核时，至少自问这 3 个问题：

- 这一段有没有提供前文没有的新信息？
- 这一段是在推进，还是在重复证明已经成立的主张？
- 这一段如果删除，读者的核心收获会明显下降吗？如果不会，就删或并段。

#### 发布元数据收束（按平台 gate 触发）

先过一层平台 gate：

- 如果当前 profile / 当前任务明确命中“公众号型 profile”（例如 `target_platform` 明确是微信公众号），按下面协议强制补齐 frontmatter、固定脚注块与标签
- 如果不是公众号型 profile，则这部分降为“按需启用”或“由当前 profile policy 决定”，不要默认把所有自媒体内容都套进公众号发布协议

在输出最终稿 `草稿_final.md` 前，先生成一份：

- `草稿_final.candidate.md`

然后主动调用独立 gate-checker：

- Claude Code：`writing-gate-checker` agent
- OpenCode：复用同名 `writing-gate-checker` skill，并读取同一份 `references/gate-check-contract.md`

checker 必须读取：

- `03-Reviews/Claim-Ledger.md`
- `03-Reviews/Structure-Eval.md`
- `03-Reviews/Module-Budget.md`
- `03-Reviews/Lint-Report.md`
- `草稿_final.candidate.md`

并把结果写入：

- `03-Reviews/Gate-Check-Report.md`

规则：

- `FAIL` -> 回到 draft / review 阶段修稿，不允许直接产出正式 final
- `PASS` -> 才允许把 `草稿_final.candidate.md` 升格为 `草稿_final.md`

在输出最终稿 `草稿_final.md` 前，如果平台 gate 命中公众号场景，必须先补齐公众号发布所需 frontmatter，并在正文末尾补固定收尾脚注块。

最小协议：

```yaml
---
title: 文章标题
summary: 公众号摘要
author: 作者名
---
```

执行规则：

1. `title`：使用本轮最终采用的标题。
2. `summary`：必须由当前写作流程显式产出，不允许默认拿正文第一句机械截断。
3. `author`：如果当前 profile 或用户上下文中有明确作者名，则一并写入；没有可留空，但字段协议要清楚。
4. `concepts`：根据文章主题和正文关键词，从以下 8 个概念中选出 1-3 个最相关的，写入 frontmatter：
   - 可选值：`Skill`、`Agent`、`提示词`、`上下文工程`、`数字分身`、`AI写作`、`一人公司`、`OpenClaw`
   - 只选文章真正涉及的概念，不强行凑满；无法确定时留空（不写 concepts 字段）
   - 格式：`concepts: [Skill, Agent]`（inline YAML 数组）
5. 若终稿已有 frontmatter：更新或补齐 `title / summary / author / concepts`，不重复创建第二段 frontmatter。

固定收尾脚注块（公众号 gate 命中时强制）：

```md
---

「注」本文由大鹏的分身系统创作

#标签1 #标签2 #标签3
```

标签规则：

- 默认输出 3-6 个标签
- 标签必须与文章主题强相关，优先覆盖用户真实会搜的关键词
- 优先从这些维度选：核心主题、平台/工具名、问题类型、方法关键词
- 可以混合中文标签与必要英文专有名词，但避免无意义地堆英文
- 避免过泛标签，如 `#思考`、`#成长`、`#干货`
- 如果用户明确给了指定标签，优先保留，再按相关性补足

`summary` 的写法要求：

- 面向公众号摘要场景，默认 60-100 字
- 优先概括主题、核心收益、读者价值
- 避开引号句、纯设问句、纯情绪句作为默认摘要
- 不写成标题复述，不写成空泛口号

公众号场景下的输出顺序：

1. 最终正文（带 `title / summary / author` frontmatter，并在文末带固定脚注与 SEO 标签）
2. 备选标题（3 个）
3. 公众号摘要（单独回显 1 条，便于复核）
4. 采用的结构说明（单线程：选定结构及理由；多线程：A/B/C 或融合）
5. 可选优化建议（1-3 条）

#### baseline 快照（用于后续人工改稿复盘）

如果这篇文章会进入“人工修改后再反哺系统”的链路，在交付 `草稿_final.md` 时，额外执行一次 baseline 冻结：

- 将当前 `草稿_final.md` **复制**到：`03-Reviews/草稿_final.ai-baseline.md`
- 这是 baseline 快照，不是第二次生成
- **不允许**为了生成 baseline 让 Agent 再写一遍文章
- baseline 一旦生成，默认视为只读证据文件，不在后续人工编辑中覆盖

后续人工修改始终发生在：

- `草稿_final.md`

而不是发生在 baseline 快照上。

---

## 决策与回退机制

**通用回退：**

1. 用户补料不足且未回复追问：采用推荐默认值继续，不阻塞流程。
2. 上下文存在隐私风险：剔除该条上下文并记录”未使用原因”。

**单线程回退：**

3. 草稿未过完整性门槛：切换”无硬断言版”，只写方法论 + 主观体感，不写具体数据。
4. 草稿 AI 味偏重：只重写开头和收尾，不推翻中段方法部分。

**多线程回退：**

5. 三稿都未过完整性门槛：同上，切换”无硬断言版”。
6. 三稿都 AI 味偏重：只重写开头和收尾，不推翻中段方法部分。

---

## 资源导航（Progressive Disclosure）

- 当前 Profile 注册表：`references/profile-registry.md`
- 当前选中 Profile：`{selected_profile_dir}/`
- 风格 Profile：`{selected_profile_dir}/style-profile.md`
- Voice Cues（运行时可选）：`{selected_profile_dir}/voice-cues.md`
- Form-layer 锚点（运行时主 form 入口）：`{selected_profile_dir}/form-normalized-anchors/README.md`
- Raw Voice Anchors（后台真值 / 审计）：`{selected_profile_dir}/voice-anchors.md`
- 案例锚点（可选）：`{selected_profile_dir}/examples.md`
- 金句锚点（可选）：`{selected_profile_dir}/quotes.md`
- Goldmine 动态检索：`references/goldmine-retrieval-strategy.md`
- 充足度评估：`references/context-sufficiency.md`
- 断言台账规范：`references/claim-ledger-spec.md`
- 三结构与子代理模板：`references/three-structures.md`
- 结构选择指南：`references/structure-selection-guide.md`
- Redundancy Lint：`references/redundancy-lint.md`
- 风格检查清单模板：`references/style-checklist-template.md`
- 评分规则：`references/scoring-rubric.md`

---

## 执行模板（可直接套用）

### 模板 1：Gate A 未通过时的提问

"我现在缺少 [槽位名]，会影响 [具体影响]。
为了不耽误进度，我建议默认按 [推荐默认值] 继续。
你要改成别的方向吗？"

### 模板 2：单线程模式——结构选择输出

"我评估了三种候选结构：

- A（场景代入型）：[适配度 + 理由]
- B（观点打击型）：[适配度 + 理由]
- C（痛点引入型）：[适配度 + 理由]

选定 [X]，因为 [核心理由]。开始写作。"

### 模板 3：多线程模式——三稿完成后的主代理输出

"我先给三稿打分：A=xx，B=xx，C=xx。
当前底稿是 [X]，因为 [原因]。
我计划从 [Y] 替换 [模块]，预计提升 [维度]。
融合后将再次过 Voice + Form + Integrity + Redundancy 四检，然后做 Compression Pass。"

---

## 自我迭代

当识别到以下场景时，主动提议更新本 Skill：

| 场景               | 触发条件                                                                       | 更新内容                                                                                           |
| ------------------ | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| 新范文             | 用户提供 1 篇新的代表作                                                        | 追加到当前 profile 的 `voice-anchors.md`，并同步更新 `voice-cues.md` 与相关 normalized anchors     |
| 风格修正           | 用户说「这个表达不是我的风格」                                                 | 更新当前 profile 的 `style-profile.md`（以反馈为准）                                               |
| 新金句             | 用户提供高复用表达/签名语                                                      | 评估是否加入当前 profile 的 `quotes.md`（可选）                                                    |
| 新案例             | 用户分享可复用故事/经历                                                        | 评估是否加入当前 profile 的 `examples.md`（可选）                                                  |
| 新文章复盘         | 用户提供新发布文章链接/全文                                                    | 提炼新增规律，更新当前 profile 的 `style-profile.md`                                               |
| 人工改稿 diff 复盘 | 同时存在 `03-Reviews/草稿_final.ai-baseline.md` 与人工修改后的 `草稿_final.md` | 先运行 `/writing-diff-review`，生成候选规则卡片与 review 文件，再由用户确认是否回流到 profile 资产 |

更新流程：

1. 识别场景并提出更新建议
2. 如果是人工改稿 diff 复盘，先读取 `03-Reviews/人工改稿-diff复盘.md` 的候选规则与推荐回流位置
3. 用户确认后再修改对应文件，不允许跳过确认直接写回 profile 真相源
4. 说明新增规则对后续写作的影响

人工改稿 diff 复盘的 profile 回流目标默认只在这些位置里选择：

- `style-profile.md`
- `voice-cues.md`
- `quotes.md`
- `examples.md`

判断原则：

- 更偏“像谁写”的人格化表达偏好 → 优先回 profile
- 一次性内容补丁 → 只记本次复盘，不升格为长期规则

---

## 金句生成（Profile 版）

优先使用：

1. `{selected_profile_dir}/quotes.md` 中已有金句（如果你维护了）
2. `{selected_profile_dir}/voice-cues.md` 中已蒸馏出的高频句法、口头禅与收束方式
3. 如果确实缺少运行时可用的 voice cues，再回到 `voice-anchors.md` 做后台抽取，不默认直接把 raw 全文带进本轮写稿

规则：金句必须和 `{selected_profile_dir}/style-profile.md` 一致；不照搬他人的固定金句。

---

## 参考资源

- **Profile 注册表**：见 [references/profile-registry.md](references/profile-registry.md)
- **Profile 目录说明**：见 [references/profiles/README.md](references/profiles/README.md)
- **风格 Profile**：见 `{selected_profile_dir}/style-profile.md`
- **Voice Cues（运行时）**：见 `{selected_profile_dir}/voice-cues.md`
- **Raw 范文锚点（后台）**：见 `{selected_profile_dir}/voice-anchors.md`
- **金句库（可选）**：见 `{selected_profile_dir}/quotes.md`
- **案例库（可选）**：见 `{selected_profile_dir}/examples.md`
- **充足度评估**：见 [references/context-sufficiency.md](references/context-sufficiency.md)
- **断言台账规范**：见 [references/claim-ledger-spec.md](references/claim-ledger-spec.md)
- **三结构模板**：见 [references/three-structures.md](references/three-structures.md)
- **评分规则**：见 [references/scoring-rubric.md](references/scoring-rubric.md)

---

## Claude Code 执行备注

当前这份 skill 默认运行在 Claude Code 环境里。

1. **文件读取与搜索**：优先使用 Claude Code 原生的 `Read`、`Grep`、`Glob`
2. **记忆搜索**：优先使用 `nmem` CLI，而不是抽象的外部运行时工具
3. **联网补料**：只在事实补料确有必要时使用当前会话可用的网页工具，不把联网当默认动作
4. **路径处理**：直接使用 vault 内相对路径或绝对路径，不依赖额外 adapter
5. **references 文件**：直接按仓库内路径读取，例如 `references/profile-registry.md`

---

_Profile 驱动版本（多 Profile）| Claude Code 适配 | 最后更新：2026-03-21_

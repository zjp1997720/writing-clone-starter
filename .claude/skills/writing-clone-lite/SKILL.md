---
name: writing-clone-lite
description: |
  轻量写作分身（Lite 版）- 当当前对话已经形成足够可写的 brief，主题/立场/读者/结构已经大致明确，写作瓶颈已经不是“继续做重型补料”，而是“基于现有判断直接落稿”时，务必优先使用这个 skill。它的职责是承接当前对话与现成资料，在必要时只做一次最小补充，然后直接写出 prose-first、规整推进、弱列表感的成型文章，而不是再走完整 writing-clone-profile 的重型上下文采集流程。

  **强触发场景**：
  - 用户明确说「轻量写」「直接写」「上下文已经够了」「不要走完整 clone profile」
  - 当前对话里已经有明确的主题、立场、读者、结构讨论
  - 用户已经提供大量参考资料，目标是顺着现有判断快速落稿
  - 用户说「按我们刚才聊的写成文章」「基于这轮讨论直接出稿」

  **不要用在这些场景**：
  - 用户只有模糊念头，还需要主动补 brief、补案例、补上下文
  - 主题、立场、读者、结构还没收束
  - 明显需要重型采集、记忆扩展、素材库补料时
  这些情况请改用 writing-clone-profile。
---

# Writing Clone Lite

## 这是什么

这是 `writing-clone-profile` 的轻量分支。

它处理的是另一类高频场景：

- 你和用户已经讨论了很多轮
- 当前对话本身就是一份高质量 brief
- 参考资料已经够了
- 现在真正缺的不是继续搜，而是顺着已有判断直接落稿

一句话：

**重型 skill 负责把想法长成文章，Lite skill 负责把已经长出来的文章顺手写出来。**

---

## 一眼总览

这个 skill 的主线只有 6 个动作：

1. 从当前对话提炼轻 Brief
2. 过一次 Light Gate
3. 如果只差一点，做一次最小补充
4. 直接写稿
5. 过形式门，防止正文写碎
6. 收束为可被公众号流程直接消费的终稿

如果当前任务还没到「直接写」阶段，就不要硬写，回退到 `writing-clone-profile`。

---

## 适用边界与分工

### 该用 `writing-clone-lite` 的时候

- 当前对话已经形成高质量 brief
- 参考资料已经足够
- 读者、立场、结构都基本清楚
- 当前瓶颈是落稿，而不是继续补料

### 该用 `writing-clone-profile` 的时候

- 用户只有一个模糊想法
- 主题、立场、读者、结构还没收束
- 仍然需要主动搜素材、补案例、建 brief
- 轻量补一次之后，Gate 仍然过不去

这里的“不该用 Lite”，指的是**写作前提还没成形**，不是指“不能有一次很克制的补充动作”。

如果你已经明显处在「直接写」阶段，还硬走重型采集，通常只会更慢、更贵，还会把文章气口冲散。

如果命中 `writing-clone-profile` 的场景，直接回退，不要硬撑成 Lite。

---

## 主代理执行规则

Lite 写作默认由**主代理自己执行**。

不要把正文写作派给子 agent。原因很简单：

- 主代理拿到的当前对话上下文最多
- 这类任务的价值就在于承接刚刚形成的语气、判断和气口
- 子代理很容易把轻量写作重新做重，或者把文章写成汇报稿

如果确实要委派，也只委派外围动作，不委派正文本身。

---

## 文件职责与优先级

这组文件按下面的分工工作：

- `SKILL.md`：定义触发边界、核心决策、主流程、输出合同
- `references/light-gate.md`：展开 Gate 判定与一次性最小补充的详细规则
- `references/process-notes.md`：展开已经验证过的执行偏好与返工顺序
- 当前 profile 下的 `form-normalized-anchors/`：提供形式层 reference，不负责补主题素材

如果表达层面出现不一致：

**以 `SKILL.md` 为准。**

这不是因为 references 不重要。

而是因为 Lite 的主入口必须始终只有一条主线。

---

## 运行时加载顺序

默认不要一上来把所有 references 都读一遍。

按这个顺序加载：

### 必读

1. 当前对话
2. 用户明确给出的参考文件
3. `references/light-gate.md`

### 进入写作后通常要读

4. 当前 profile 的 `style-profile.md`
5. 当前 profile 的 `form-normalized-anchors/README.md`
6. 当前 profile 下最相关的 normalized anchor
7. `references/process-notes.md`
8. 当前 profile 的 `voice-cues.md`（如果存在）

### 只有确实需要时再读

9. 当前 profile 的 `examples.md` / `quotes.md`
10. 0-1 次 `nmem` 搜索

原则不是“读得越多越稳”。

原则是：**只读取会直接提升这篇文章质量的那部分上下文。**

---

## Claude Code 执行约定

这份 skill 默认运行在 Claude Code 里。

- 读取用户明确给出的文件时，优先直接用 Claude Code 的 `Read`
- 文件名或路径不确定时，用 `Glob`
- 定位具体内容时，用 `Grep`
- 需要补 0-1 次长期记忆时，直接用 `nmem` CLI，不假设别的平台专属记忆工具
- 所有路径都直接使用 vault 内相对路径或绝对路径，不依赖额外 adapter

---

## 形式层硬约束（前置提醒）

Lite 的目标不是“看起来有节奏”。

Lite 的目标是：

**规整、高密度、正文成片推进。**

这组约束是在**已经确认可以进入 Lite 写作**之后生效。

它们不是为了把 Gate 收得更严，而是为了避免正文在执行阶段重新写碎。

正式写作前就要先记住这几条：

- 正文主体必须主要靠自然段推进，而不是靠 bullet 推进
- 短句只用于提气、转折、收口，不作为整篇排版策略
- 一个主要小节下，至少要有一个完整自然段承载主判断
- 如果连续出现 2 个以上单句短段，默认已经开始写碎
- 如果连续出现 3 个以上超短正文段，默认判定形式失败

也就是说：

**不要先按碎段写，再指望最后补救。**

---

## Light Gate

正式写之前，先做一次轻路由判断。

检查四项：

- `topic`：主题是否明确
- `stance`：核心立场是否明确
- `reader`：目标读者是否明确
- `shape`：结构是否大致明确

详细规则见：`references/light-gate.md`

默认执行：

- 命中 3-4 项：直接写
- 命中 2 项：只允许做一次最小补充采集，再判一次
- 命中 0-1 项：停止，回退到 `writing-clone-profile`

回退口径直接用：

`这轮上下文还不够厚，继续轻量写很容易写空。我建议切回 writing-clone-profile，让我先把 brief 和素材补齐。`

---

## 风格来源

Lite 不维护第二套风格系统。

默认直接复用 `writing-clone-profile` 的 profile 资产：

1. `../writing-clone-profile/references/profile-registry.md`
2. `{selected_profile_dir}/style-profile.md`
3. `{selected_profile_dir}/form-normalized-anchors/README.md`（当前 profile 的主 form 说明）
4. `{selected_profile_dir}/form-normalized-anchors/anchor-01-*.md`（主 form reference，默认先读）
5. `{selected_profile_dir}/form-normalized-anchors/anchor-02-*.md`（按主题补读的辅助 reference）
6. `{selected_profile_dir}/form-normalized-anchors/anchor-03-*.md`（按主题补读的辅助 reference）
7. `{selected_profile_dir}/voice-cues.md`（如果存在，作为轻量 voice 校准层）
8. `{selected_profile_dir}/examples.md`（可选）
9. `{selected_profile_dir}/quotes.md`（可选）

这三层各自负责：

- `style-profile.md`：定义风格规则与禁区
- `form-normalized-anchors/`：校准当前认可的 form-layer，帮助正文更规整、更高密度
- `voice-cues.md`：轻量校准“像不像大鹏本人在说话”的语气、判断力度和收束方式
- `voice-anchors.md`：后台真值层，默认不直接参与 Lite runtime

运行时优先级是：**先过 form，再校准 voice。**

### Profile 选择规则

1. 先读取 `../writing-clone-profile/references/profile-registry.md`
2. 如果用户明确指定 profile，直接用
3. 如果只有 1 个 active profile，直接用
4. 如果有多个 active profile 且用户没指定，做一次极简确认

如果 `profile-registry.md` 不存在、不可读，或当前拿不到可用 profile：

- 不要卡住
- 优先继续使用当前对话里用户明确给出的风格参考
- 如果这轮没有明确风格参考，就用 Lite 自己的 `references/process-notes.md` 和形式层硬约束保底，不再依赖任何 Lite 私有 style 层
- 同时保持 Lite 的核心约束不变：不因为拿不到 profile 就滑回重型采集

极简确认口径：

`我这里有多个 profile。这次更推荐用 X，因为它更适合当前主题。你如果不改，我就按这个继续写。`

---

## Progressive Disclosure 说明

Lite 不是没有参考资产。

Lite 是**只在需要时才读取参考资产**。

分工如下：

- `references/light-gate.md`：判断能不能直接写
- `references/process-notes.md`：校准 Lite 当前已经验证过的执行偏好
- profile 资产：校准作者风格与表达习惯，其中
  - `form-normalized-anchors/` 是运行时主 form 层
  - `voice-cues.md` 是运行时轻量 voice 层
  - `voice-anchors.md` 保 raw truth，但默认留在后台

不要把 normalized anchors 当素材库，也不要把 process notes 当第二套 profile。

---

## 写作流程

### Step 0：提炼轻 Brief

先从当前对话直接压出这 6 项：

- `topic`
- `target_reader`
- `goal`
- `stance`
- `must_include`
- `must_avoid`

不要先建大而全的 context packet。
够写就行。

### Step 1：过 Gate

先判断这轮是不是已经足够直接写。
如果不足，就回退，不硬写。

### Step 2：做一次最小补充

只补当前真正缺的那一块。

允许动作、禁止项与记忆搜索场景的详细白名单，统一见：`references/light-gate.md`

原则：

- 能不补就不补
- 能用当前对话解决，就不出去搜
- 能用已有参考文件解决，就不查记忆
- 一旦补完，再判一次，不要补着补着滑回重型流程

### Step 3：直接写作

默认目标不是「最完整」。

默认目标是：

**规整、高密度、完整自然段优先，成片推进，像文章，不像研究报告。**

在真正开始写正文前，先记住这条优先级：

**先让正文站稳，再做局部提气。**

也就是说：

- 先保证主要判断由完整自然段承载
- 再决定哪里需要短句提气
- 如果“气口”和“规整”发生冲突，先保规整

短句是点火器，不是发动机。

它负责提气、转折、收口。

它不负责承担正文主推进。

具体约束：

- 正文优先写成 prose-first、高信息密度、散文化、成片推进的版本
- 结构藏在文气里，不写成讲义、提纲或研究汇报
- 可以有少量标题锚点，但默认禁止数字序号标题
- **默认优先规整，而不是优先节奏感**
- 如果参考资料大量来自英文语境，落成中文文章时默认优先用**自然中文意译**，不要先把英文术语端出来
- 对工程词、方法名、机制名，先判断：直接讲中文，读者能不能顺着读懂；如果能，就只写中文，不保留英文原词
- 只有当保留英文能明显提升准确性、可检索性或行业识别度时，才允许在首次出现时补英文原词
- 真要保留英文，优先用**中文主表达 + 英文补充**，而不是英文在前、中文在后硬翻译
- 已经足够大众化、不会增加阅读门槛的常见词，不要为了形式统一强行解释或保留英文
- 短句只用于提气、转折、收口；局部有力，不等于整篇碎切
- hook、转折、收束可以单独成段；中段机制展开优先用完整自然段承载
- **连续 2 个以上单句短段，默认视为写碎了，必须主动并段**
- 如果出现连续 3 个以上超短正文段（如 25 字以内），默认视为写碎了，需要主动并段
- **每个主要小节至少有 1 个完整自然段承担主判断，不能全靠短段、bullet 或零碎判断堆起来**
- 每段机制解释、判断展开、方法拆解，默认先写成完整承载段；只有在已经承载住之后，才允许补 1 句提气短句
- 无序列表只用于步骤、对比、清单；除非任务本身就是 SOP / 参数说明 / 清单，否则不要让正文主体由列表承载
- **如果删掉 bullet 后改写成自然段会更顺，就优先删 bullet**
- 同一个主张不要换三种说法重复讲
- 正文主体要像成熟公众号长文，不像拆句卡片风、朋友圈长文或视频提词稿

### Step 3.5：Form Gate（形式门）

终稿前必须过一次形式门。

逐项检查：

1. 正文主体是否仍然主要靠自然段推进，而不是靠 bullet 推进
2. 是否出现连续 2 个以上单句短段
3. 是否出现连续 3 个以上超短正文段
4. 每个主要小节下是否至少有一个完整承载段
5. 整体读感是否像公众号长文，而不是讲义、汇报或拆句卡片文
6. 如果拿掉局部提气短句后，正文主线反而更顺，说明短句已经越权
7. 是否有本来可以直接说中文、却仍然先端出英文术语的写法，导致读感割裂
8. 是否有必须保留的英文术语没有做最小中文解释，导致第一次阅读会卡住
9. 整体 form 是否明显偏离当前 normalized anchors，更像旧公众号碎段排版

其中第 2 项和第 3 项不是一条规则写两遍。

- 第 2 项盯的是：**单句短段是否连续出现过多**
- 第 3 项盯的是：**超短正文段是否连续出现过多**

如果任一项失败：

- 不允许直接交稿
- 先做并段重写
- 先补承载段，再修节奏
- 只改失败模块，不用整篇推翻
- 重写后，只重过失败项对应的检查；通过后再交付

### Step 3.8：Final Preflight Lint（工具化终检）

Lite 的 final preflight 也必须是**工具化 lint**，不是凭印象扫一遍。

在进入 `草稿_final.candidate.md` 之前，至少要用 `Grep / rg / 等效搜索工具` 做这些查询，并把结果写入 `03-Reviews/Lint-Report.md`：

- 对照句查询：`不是 X，是 Y / 不是……而是…… / 不只是……而是……`
- 碎段查询：连续短段、超短正文段相关证据
- `unsupported_claims` 结果

Lite 不要求完整 Claim Ledger。

但 `Lint-Report.md` 至少要给出：

- Form Gate 结果
- 对照句查询结果
- `unsupported_claims` 列表（若为空也要写成 0）

改完后，必须重跑相关查询；没有工具证据，不算完成 final preflight。

### Step 4：终稿收束

在正式产出 `草稿_final.md` 之前，先生成一份：

- `草稿_final.candidate.md`

然后主动调用独立 `writing-gate-checker`。

Lite 在这一步复用：

- `.claude/skills/writing-clone-profile/references/gate-check-contract.md`
- `.claude/skills/writing-gate-checker/SKILL.md`

裁决规则：

- `PASS`：才允许把 `草稿_final.candidate.md` 升格为 `草稿_final.md`
- `FAIL`：必须回到 draft / review 阶段修稿，不允许直接落正式 final

Lite 在 final 前至少要保证 checker 能读取到这些最小证据：

- `草稿_final.candidate.md`
- `03-Reviews/Lint-Report.md`

其中 `Lint-Report.md` 至少要显式写出：

- Form Gate 结果
- `unsupported_claims` 列表（若为空也要写成 0）

如果这篇文章命中人工改稿链路，仍然保留：

- `03-Reviews/草稿_final.ai-baseline.md`

这一步的目标不是把 Lite 做重。

它只解决一件事：

**正式终稿不再由 writer 自己批准。**

Lite 不要求完整 `Context Packet`。

Lite 只要求：

- 足够直接写的轻 Brief
- 最多一次最小补充
- candidate 前的工具化 final preflight

终稿前强制检查：

1. 中文常规引号统一为 `「」`
2. frontmatter 补齐 `title / summary / author`
3. `summary` 默认 60-100 字，能直接被公众号流程消费
4. frontmatter 补充 `concepts` 字段：从 `[Skill, Agent, 提示词, 上下文工程, 数字分身, AI写作, 一人公司, OpenClaw]` 中选 1-3 个最相关概念，格式 `concepts: [概念A, 概念B]`；无法确定时留空
5. 文稿默认保持 prose-first、弱列表感，不写成提纲腔
6. 输出路径优先兼容 `草稿_v1.md` / `草稿_final.md`
7. 写入终稿文件的内容必须是 **publish-clean**：只允许 frontmatter + 正文主内容 + 固定收尾脚注块，不允许解释性附录

`publish-clean` 定义：

- 可以直接被 `post2wechat` 或后续公众号链路消费
- 文档正文里不包含给作者看的编辑说明
- 不把标题候选、结构说明、优化建议写进终稿文档尾部
- 文末默认追加一个固定收尾脚注块，用于创作说明与搜索标签

固定收尾脚注块格式：

```md
---

「注」本文由大鹏的分身系统创作

#标签1 #标签2 #标签3
```

标签规则：

- 默认输出 3-6 个标签
- 标签必须与文章主题强相关，优先使用用户真实会搜的核心词
- 可混合中文标签与必要英文专有名词，但不要为了“显得专业”堆英文
- 避免空泛大词，如 `#思考`、`#成长`、`#干货`
- 优先覆盖：主题对象、平台/工具名、问题类型、方法关键词
- 如果用户已明确给出指定标签，优先保留并按相关性补足

`author` 规则：

- 能从当前 profile 或用户上下文中明确拿到作者名，就直接写入
- 如果当前任务已有明确署名约定，沿用该约定
- 如果拿不到，不猜，保留空字段或按当前项目协议处理

---

## 输出协议

终稿至少满足：

```yaml
---
title: 文章标题
summary: 公众号摘要
author: 作者名
---
```

并在正文结束后追加固定收尾脚注块：

```md
---

「注」本文由大鹏的分身系统创作

#标签1 #标签2 #标签3
```

### A. 文件输出（落盘）

- 默认落盘的是 **可直接发布的终稿**
- 终稿文件只包含：frontmatter + 正文主内容 + 固定收尾脚注块
- 不允许把以下内容写进 `草稿_v1.md` / `草稿_final.md`：
  - 备选标题
  - 当前采用的结构说明
  - 克制优化建议
  - 任何给作者看的解释性附录

### B. Agent 回复（不落盘）

如有价值，可以在回复里额外给用户：

- 备选标题 3 个
- 当前采用的结构说明 1 句
- 如有必要，补 1-3 条非常克制的优化建议

如果用户没有要求这些补充反馈，默认只交付干净终稿，不额外生成“编辑附录”。

### C. 需要落盘补充反馈时的处理

只有当用户明确要求把这些补充信息也保存到文件里时，才允许单独落盘到 review 文件，例如：

- `03-Reviews/备选标题.md`
- `03-Reviews/结构说明与优化建议.md`

绝不再把这些内容写到终稿正文文件尾部。

默认目标仍然是：在不滑回重型补料的前提下，交付一版可直接进入公众号流程的成熟草稿。

### 输出路径规则

- 如果当前任务已经给了项目目录，就写到该目录里
- 如果当前任务没有目录，但明确是内容创作任务，可创建：`01_项目/内容创作/{YYMMDD_主题关键词}/`
- 默认草稿文件名优先：`草稿_v1.md` / `草稿_final.candidate.md` / `草稿_final.md`
- `草稿_final.candidate.md` 是送审稿，不是正式终稿
- 只有 `writing-gate-checker` 明确 `PASS` 后，才允许写 `草稿_final.md`
- `草稿_v1.md` / `草稿_final.md` 默认视为可直接进入 `post2wechat` 的上游终稿，不得混入解释性附录

### D. baseline 快照（用于后续人工改稿复盘）

如果这篇文章会进入“人工修改后再反哺 Lite”的链路，在交付 `草稿_final.md` 时，额外冻结一份 baseline 快照：

- 将当前 `草稿_final.md` **复制**到：`03-Reviews/草稿_final.ai-baseline.md`
- 这是 baseline 快照，不是第二次生成
- **不允许**为了生成 baseline 让 Agent 再写一遍文章
- baseline 一旦生成，默认视为只读证据文件，不在后续人工编辑中覆盖

后续人工修改始终发生在：

- `草稿_final.md`

而不是 baseline 快照上。

---

## 反模式

| 反模式                                  | 为什么不行                       |
| --------------------------------------- | -------------------------------- |
| 明明上下文不够，还硬用 Lite 写          | 最后大概率写空，或者写成假成熟稿 |
| 轻量写作重新做成重型采集                | 会更慢、更贵，还会把气口冲散     |
| 把 raw voice anchors 当前台主参考       | 会把旧排版习惯重新带回 runtime   |
| 只学 reference 的短句气口，不学中段承载 | 正文很容易重新写碎               |
| 用 bullet 承载正文主体                  | 最后会滑向讲义感、提纲感、汇报感 |
| 形式门没过就直接交稿                    | 轻量不等于粗糙，Lite 也必须规整  |

---

## 默认文风偏好

当前默认执行这些已经验证过的偏好，详细备忘见：`references/process-notes.md`

- 不写成长讲义
- 不堆无序列表
- prose-first，散文化推进
- 正文主体要成片推进，不要写成一地判断碎片
- 信息密度高，但不要像上课
- 中文意译优先，英文术语克制使用
- 短句只局部提气，不作为整篇排版策略
- 有标题锚点，但不要提纲味太重
- 正文常规中文引号统一用 `「」`

一句话：

**默认对齐 normalized-first 的大鹏长文 form：先把正文站稳，再让句子发光。**

---

## Lite 自检

写完后，至少自检这 5 件事：

1. 有没有滑回讲义体
2. 有没有列表太多
3. 有没有把同一主张换三种说法重复讲
4. 有没有把本来够写的任务又写成研究报告
5. 有没有连续碎段过多，导致正文读起来不成片
6. 有没有本来可以直接意译成中文、却还是先写了很多英文术语

如果命中，就只改失败模块，不要因为轻量写作而整篇推翻重来。

---

## 自我迭代

命中下面这些反馈时，应该主动更新 Lite 的执行偏好，而不是去复制一套新的风格系统：

- 用户说「这版太像讲义」
- 用户说「列表太多」
- 用户说「句子太碎」
- 用户说「结构太提纲化」
- 用户说「这轮上下文已经够了，不要再搜」
- 用户说「信息密度不够」
- 用户说「形式太稀碎，不够工整」
- 同时存在 `03-Reviews/草稿_final.ai-baseline.md` 与人工修改后的 `草稿_final.md`

要更新的是：

- `references/process-notes.md`
- Lite 的执行方式

不是重建第二套 profile。

如果只是这轮文章没写好，不要先冲动重写 Lite 本身。

先判断问题是：

- 这轮 Gate 判断错了
- 执行时没遵守已有规则
- 还是 process notes 真的需要补新偏好

如果命中的是“人工改稿 diff 复盘”场景，先执行：

- `/writing-diff-review 03-Reviews/草稿_final.ai-baseline.md 草稿_final.md --mode lite`

然后再判断候选规则是否值得回流到：

- `references/process-notes.md`

默认判断原则：

- 更偏“怎么别写坏”的 form / process 问题 → 优先回 Lite
- 一次性内容补丁 → 只记本次复盘，不升格为 Lite 长期规则
- 不允许因为单篇文章的偶发修改，冲动重写 Lite 本身

---

_最后更新：2026-03-20_

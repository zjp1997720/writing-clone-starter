# `writing-clone-profile` 使用说明（中文版）

这是一个“Profile 驱动”的写作分身 Skill：你可以初始化多个风格 Profile，之后每次写作先确定这次使用哪一个 Profile，再按那套风格输出。

## 0. 你会得到什么

初始化完成后，会在本 Skill 目录生成两级资产：

- `.claude/skills/writing-clone-profile/references/profile-registry.md`（全部 profile 的注册表）
- `.claude/skills/writing-clone-profile/references/profiles/<profile_id>/...`（某个 profile 的独立风格资产）

对公众号长文 / 深度长文 profile，目录通常包含：

- `style-profile.md`（风格规则）
- `form-normalized-anchors/`（公众号长文 / 深度长文场景下建议纳入的 form-layer 阅读层）
- `voice-cues.md`（运行时轻量 voice 校准层）
- `voice-anchors.md`（后台真值 / 审计层）
- `examples.md`（可选）
- `quotes.md`（可选）

一句话理解：

- `form-normalized-anchors/` 负责校准「同样的内容，怎么组织得更稳、更紧、更高密度」
- `voice-cues.md` 负责校准「像不像你本人」
- `voice-anchors.md` 保留为后台真值层，不默认前台参与写稿

## 1. 第一次使用：初始化第一个 Profile

```text
@writing-clone-profile

请初始化我的第一个写作 Profile。
```

你需要提供：

1. Profile 名称
   - `profile_id`：英文 slug，例如 `dapeng-wechat`
   - `display_name`：展示名，例如「大鹏-公众号长文」
2. 3-5 篇范文（越完整越好，同一作者/同一账号为佳）
3. 这个 Profile 主要用于什么平台/什么场景

推荐的范文格式：

```text
[范文 1]
标题：...
平台/链接（可选）：...
发布时间（可选）：...
为什么代表我（可选）：...

正文：
<粘贴全文>
```

初始化完成的标志：

- `references/profile-registry.md` 已出现该 profile
- `references/profiles/<profile_id>/voice-anchors.md` 已包含 3+ 篇范文
- `references/profiles/<profile_id>/style-profile.md` 已生成，并写出“可执行规则”
- 如果这是公众号长文 / 深度长文 profile：
  - `references/profiles/<profile_id>/form-normalized-anchors/README.md` 已存在
  - `references/profiles/<profile_id>/voice-cues.md` 已存在

## 2. 新增一个 Profile（不覆盖旧的）

```text
@writing-clone-profile

请初始化一个新的写作 profile，名字叫 xiaohongshu-casual。
```

适合的场景：

- 你想做“公众号长文版”和“小红书口语版”两套风格
- 你想区分“商业分析版”和“个人表达版”
- 你想保留旧 profile，同时试一个新的风格方向

规则：

- 新建 profile = 新目录
- 不会覆盖已有 profile
- 如果你没给名字，Skill 会先追问这一个字段，再继续

## 3. 正常使用：按某个 Profile 写一篇文章

如果当前 profile / 平台命中“公众号型 profile”（例如 `dapeng-wechat`），终稿 `草稿_final.md` 会默认自带一组面向公众号发布的最小元数据：

```yaml
---
title: 文章标题
summary: 公众号摘要
author: 作者名
---
```

其中 `summary` 会由写作流程显式生成，用于后续公众号发布，不再建议交给发布 Skill 临时猜测。

终稿正文末尾还会默认追加一个固定收尾脚注块：

```md
---

「注」本文由大鹏的分身系统创作

#标签1 #标签2 #标签3
```

标签默认 3-6 个，按文章主题自动选择，优先使用真实可搜索的关键词，而不是空泛大词。

如果当前 profile 不是公众号型 profile，这组 frontmatter / 固定脚注块不必默认强制，由当前 profile policy 决定。

补充约定：中文正文里的默认引号统一使用 `「」`，不是 `“”`；只有引用原文或你单独提出要求时，才保留 `“”`。

对公众号长文 / 深度长文 profile，建议把运行时风格读取顺序理解成：

1. 先读 `style-profile.md`，明确规则、禁区和 form 偏好
2. 再读 `form-normalized-anchors/`，校准当前认可的长文 form-layer
3. 再读 `voice-cues.md`，轻量校准当前认可的语气、判断力度和收束方式

`voice-anchors.md` 会继续保留，但默认只在 profile 更新、回归审计、重新提炼 `voice-cues.md` 时回到后台读取。

默认还有 3 个写作约束会自动生效：

- `density_preference`: 用尽量短的文本输出尽量多的价值
- `redundancy_budget`: 同一主张只能完整展开一次
- `goldmine_usage_mode`: 按文章类型自动选择 `skip / low / medium / high`

如果这是一篇强观点、纠偏型文章，系统会优先考虑更紧的 4 拍结构，而不是默认把 6 段完整展开。

### 方式 A：你自己指定

```text
@writing-clone-profile

用 dapeng-wechat 这个 profile 写一篇关于 AI 分身的文章。
```

### 方式 B：你不指定，让系统先给你选

如果当前只有 1 个 active profile，系统会直接采用，并回显：

```text
本次使用：大鹏-公众号长文（dapeng-wechat）
```

如果当前有多个 active profile，系统会先列出候选项并让你确认：

```text
我这里有 3 个可用 profile：
1. 大鹏-公众号长文：适合深度观点、方法论拆解
2. 大鹏-口语短文：适合更轻、更短、更像朋友圈/短图文
3. 商业顾问版：适合商业诊断、案例拆解

这次你的主题更适合 1。
你确认用哪一个？回复数字或 profile 名就行。
```

## 4. 更新某个已有 Profile

```text
@writing-clone-profile

请更新 dapeng-wechat 这个 profile，我补一篇新范文。
```

更新规则：

- 默认只更新你指定的那个 profile
- 常见更新内容：`style-profile.md`、`voice-anchors.md`、`voice-cues.md`、`examples.md`、`quotes.md`
- 如果你没说清楚更新哪个 profile，而系统里有多个 profile，Skill 会先让你确认对象

## 4.5 Goldmine 使用强度（素材库不是主笔）

系统会先判断这篇文章缺的是 `hook / structure / gold_sentence / ending` 里的哪个槽位，再决定是否动态检索 `02_素材库/`。

- `skip / low`：强个人经历文、强判断文、复盘文
- `medium`：方法论拆解文、工具教程文、框架型长文
- `high`：只留给纯框架型文章，而且也只能借结构、模式、节奏

硬约束：

- 不会把素材库直接拼成现成段落
- 只要素材会压过你的活人感、真实经历或立场，就直接丢弃
- 中文正文默认还是统一用 `「」`

## 5. 列出我有哪些 Profile

```text
@writing-clone-profile

列一下我现在有哪些写作 profile。
```

系统会优先读取 `references/profile-registry.md`，展示：

- profile 名
- 适用平台
- 一句话定位
- 推荐用法

## 6. 兼容说明

旧版单 profile 文件：

- `.claude/skills/writing-clone-profile/references/style-profile.md`
- `.claude/skills/writing-clone-profile/references/voice-anchors.md`
- `.claude/skills/writing-clone-profile/references/examples.md`
- `.claude/skills/writing-clone-profile/references/quotes.md`

现在只作为迁移遗留说明，不再作为新的写入目标。新的风格资产统一写到：

- `.claude/skills/writing-clone-profile/references/profiles/<profile_id>/`

## 7. 与公众号发布链路的配合

如果你后续会接 `article-illustrator` 和 `post2wechat`：

- `writing-clone-profile` 负责把 `summary` 写进终稿 frontmatter
- `article-illustrator` 负责补 `coverImage`
- `post2wechat` 只消费这些字段并发布

推荐的终稿形态：

```markdown
---
title: 我是怎么做到每天一篇公众号+一条视频的？
summary: 这篇文章拆开我的高频输出工作流：从语音输入、三路采集、三稿竞争，到标题工程和自动配图，讲清这套系统为什么能稳定带来内容产出和持续获客。
author: 大鹏
coverImage: https://example.com/wechat-cover.png
---

# 我是怎么做到每天一篇公众号+一条视频的？
```

## 8. 隐私与安全

- 范文里如果有个人隐私/公司机密，请先脱敏再粘贴
- 生成的 Profile 文件包含你的高频表达与风格规则，把它当作私有资产对待

---
name: dapeng-writing-voice-pack
description: Lightweight preloadable writing voice pack for Dapeng's style. Contains essential tone, rhythm, anti-patterns, and title cues. Use this when writing content that should sound like Dapeng talking to readers, not AI generating tutorials.
---

# 大鹏写作声音包（轻量预加载版）

**定位**：给 `writing-writer`、`writing-voice-auditor`、`writing-title-crafter` 预加载的最小风格规则集。

**权威来源**：完整风格定义在 `.claude/skills/writing-team/references/`，包括 `style-profile.md`、`quotes.md`、`examples.md`、`voice-anchors.md`。本 skill 只提取核心可执行规则，不复制全文。

---

## 一句话风格定义

技术博主里的"说人话"派：用真实痛点或反常识判断开场，用短句把复杂东西拆开，最后收束成一句能带走的判断或一个能立刻执行的动作。

---

## 语气与人设

- 对读者称呼：直接叫"你"，必要时用"大家"；不使用正式抬头
- 情绪基调：真实、带点焦虑/兴奋/顿悟；允许自嘲与反问
- 立场强度：敢下结论，但必须讲清"为什么"
- 高频表达可自然穿插：说实话、你想想、一句话、先说结论、说白了、关键是、本质是、本质很简单——、不是 X，是 Y

---

## 句式与节奏

- 短句率偏高：一个观点尽量一句话说完
- 结论句单独成段；"一句话。"、"本质很简单——"可以单独成段
- 常用模板："先说结论：……"、"说白了，……"、"你想想：……"、"如果你只记住一句话：……"

---

## 落点与推进

- 开头钩子只用三类：场景切入、观点直击、痛点引入
- 正文先给框架，再拆步骤；至少放 1 个真实案例或类比，没有就不要硬写
- 每 3-5 段必须推进一次：框架、步骤、案例、结论至少出现一个
- 收尾要能让读者带走一个判断，或今天就能执行的一个动作

---

## 禁区与反模式（强制）

- 禁用论文腔："首先/其次/总之/综上所述"
- 少用没解释的行业黑话，禁用高高在上的教育口吻
- 不写空泛正确废话，不伪造数据、项目结果、用户反馈
- 不要过长铺垫、模板味过重、整篇平均用力
- 没有 stance 时，不要硬写成信息搬运稿

---

## 标题工程（title-crafter 专用）

- 标题必须带钩子：痛点、反常识、具体数字、真实场景，至少占一个
- 避免纯概念堆砌，优先"动词 + 名词 + 结果"
- 高表现模板："手把手教你 [动作] ｜ [方法/工具]"、"[观点/结论] ｜ [解释/证据]"、"我用 [工具] 做了 [结果] ｜ [洞察]"、"别再 [错误做法] 了，[正确做法]"
- 反例："关于 AI 写作的思考"、"震撼！颠覆认知的 AI 写作新范式"、"AI 写作工具介绍"

---

## 角色使用边界

- `writing-writer`：按这里的 tone、节奏、落点写正文；需要更深浸泡时再读 `voice-anchors/` 全文
- `writing-voice-auditor`：只检查像不像大鹏，重点看语气、句式、假大空和 AI 味
- `writing-title-crafter`：只拿这里的标题钩子和模板，不把正文长段落塞进标题

---

## 何时升级到 canonical references

只有下面这些情况，才去读完整 canonical sources：

- 需要完整风格定义：`style-profile.md`
- 需要可引用金句：`quotes.md`
- 需要真实案例或类比：`examples.md`
- 需要深度风格浸泡：`voice-anchors.md` + `voice-anchors/` 全文

---

## 本 skill 的边界

- 只提供最小可执行规则，不替代完整参考文档
- 不包含锚点文章全文，避免上下文膨胀
- 不包含案例库全表或金句库全表，按需读取

---

**最后更新**：2026-03-10

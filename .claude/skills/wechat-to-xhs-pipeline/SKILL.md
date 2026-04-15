---
name: wechat-to-xhs-pipeline
description: Lightweight orchestrator for the Xiaohongshu pipeline. Use when the user wants one command to go from 公众号终稿 to 小红书草稿 by chaining `wechat-to-xhs-adapter`, `video-script-illustrator --mode xhs-cards`, and `xhs-pipeline-publisher`.
---

# WeChat to Xiaohongshu Pipeline

一个非常轻量的总控 Skill。

它**不重写**文本改写、配图、发布逻辑，只做路由和跳步判断。

## 什么时候用

命中任一场景就用：

- 用户说“把这篇公众号文章转成小红书并存草稿”
- 用户说“走完整条小红书链路”
- 用户说“公众号转小红书一键跑完”
- 用户给你一篇 `草稿_final.md`，想直接到小红书草稿

## 设计边界

### 这层只做 3 件事

1. 判断输入是什么
2. 判断哪些步骤该跳过
3. 把任务路由给已有 Skill

### 这层绝对不做的事

1. 不复制 `wechat-to-xhs-adapter` 的改写规则
2. 不复制 `video-script-illustrator` 的配图逻辑
3. 不复制 `xhs-pipeline-publisher` 的发布逻辑
4. 不自己重新发明一套字段协议

## 输入支持

支持两类输入：

### A. 公众号终稿 Markdown

例如：`草稿_final.md`

这时默认完整流程：

`adapter -> xhs-cards -> publisher`

### B. 已存在的 `.xhs.md`

例如：`草稿_final.xhs.md`

这时流程变成条件路由：

- 如果 `xhs_images` 已存在且路径有效 -> 跳过配图，直接发布
- 如果 `xhs_images` 为空或缺失 -> 先配图，再发布

## 最小决策树

### Step 1: 判断输入类型

1. 如果输入文件以 `.xhs.md` 结尾 -> 进入 Step 3
2. 否则默认视为公众号终稿 -> 进入 Step 2

### Step 2: 先调用 `wechat-to-xhs-adapter`

输入公众号终稿，产出同目录 `.xhs.md` 文件。

产出后，继续检查该 `.xhs.md` 的 `xhs_images`。

### Step 3: 判断是否已有图片

复用 `xhs-pipeline-publisher` 的解析与校验能力来判断 `.xhs.md` 是否已经具备可发布图片。

判断规则：

- `xhs_images` 非空且路径都有效 -> 直接进入发布
- `xhs_images` 为空/缺失/路径失效 -> 调用 `video-script-illustrator` 的 `xhs-cards` 模式生成图片，并回填后再发布

前置条件：

- 如果要走“缺图补图”分支，`.xhs.md` 必须已经包含 `xhs_card_outline`
- 如果既没图也没 `xhs_card_outline`，直接停止，并回退到 `wechat-to-xhs-adapter`

### Step 4: 调用 `xhs-pipeline-publisher`

默认保存为草稿。

只有用户明确说“直接发布”，才允许继续走立即发布分支。

## 推荐执行顺序

### 情况 1：从公众号终稿开始

1. 运行 `wechat-to-xhs-adapter`
2. 得到 `.xhs.md`
3. 检查 `xhs_images`
4. 如果缺图 -> 运行 `video-script-illustrator`（`xhs-cards`）
5. 运行 `xhs-pipeline-publisher`

### 情况 2：从 `.xhs.md` 开始

1. 解析 `.xhs.md`
2. 如果已有图片 -> 直接发布
3. 如果没有图片 -> 先配图再发布

## 超轻量输出口径

执行过程中只需要简洁回报：

```text
小红书总控链路启动：<source>
- 输入类型：公众号终稿 / xhs 结构化稿
- 文本适配：已执行 / 已跳过
- 图片生成：已执行 / 已跳过
- 发布：已存草稿
```

## 失败处理

### 1. adapter 失败

- 直接停止
- 报错并指出原文问题

### 2. xhs-cards 失败

- 直接停止
- 不允许带空图片去发布

### 3. publisher 失败

- 保留 `.xhs.md` 和已生成图片
- 提示用户只剩发布节点未过

## 成功标准

完成后必须满足：

1. 用户可以只给一篇公众号终稿路径
2. 系统自动决定该不该跳过 adapter 或配图
3. 最终产物进入小红书草稿箱

## 示例

### 示例 1：完整链路

```text
把这篇公众号文章转成小红书并存草稿
01_项目/内容创作/260310_飞书妙搭一键部署商单/草稿_final.md
```

### 示例 2：已有 `.xhs.md`，直接发布

```text
把这个小红书结构化稿存成草稿
01_项目/内容创作/260310_飞书妙搭一键部署商单/草稿_final.xhs.md
```

### 示例 3：已有 `.xhs.md` 但没图

```text
继续跑完这篇小红书链路
01_项目/内容创作/某文章/草稿_final.xhs.md
```

## 依赖

- `.claude/skills/wechat-to-xhs-adapter/SKILL.md`
- `.claude/skills/video-script-illustrator/SKILL.md`
- `.claude/skills/xhs-pipeline-publisher/SKILL.md`

一句话：

这个 Skill 只是一个总控路由器，不是新的业务节点。

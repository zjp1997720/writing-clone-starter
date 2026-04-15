---
name: wechat-to-xhs-adapter
description: Convert a WeChat-ready article Markdown into a Xiaohongshu-ready structured note. Use when the user wants to turn a公众号终稿 into 小红书图文, preserve活人感, and output a `.xhs.md` file that downstream image/publish skills can consume.
---

# WeChat to Xiaohongshu Adapter

把公众号终稿改写成可被后续小红书配图和发布节点稳定消费的结构化稿。

## 什么时候用

命中任一场景就用：

- 用户说“把这篇公众号文章改成小红书图文”
- 用户说“公众号转小红书”
- 用户想复用 `writing-clone-profile` 的终稿去走小红书链路
- 用户已经有 `草稿_final.md`，要继续生成小红书图片或发小红书

## 目标

输入：一篇公众号终稿 Markdown

输出：同目录下一个新的 `.xhs.md` 文件，例如：

`草稿_final.xhs.md`

这个文件必须同时满足三件事：

1. 读起来像小红书，不像公众号裁剪版
2. 能给 `video-script-illustrator --mode xhs-cards` 消费
3. 能给 `xhs-pipeline-publisher` 消费

## 绝对边界

1. **不要修改原公众号文件**
2. **不要把任务做成摘要器**
3. **不要直接复制公众号大段正文**
4. **不要输出空泛模板话**
5. **不要牺牲活人感去换取机械结构感**

## 小红书改写硬规则

### 1. 句式与段落

- 以短段落为主，每段 1-3 句优先
- 重要判断、反差句、金句单独成段
- 允许少量长句，但不能连续堆成长墙
- 正文要能“扫读”，不能只适合连续精读

### 2. 正文结构

默认结构：

`钩子 -> 核心判断 -> 展开说明 -> 方法/清单/步骤 -> 轻 CTA`

如果原文更适合“故事驱动”或“误区拆解”，可以变体，但必须保留：

- 开头钩子
- 核心判断
- 可收藏信息点
- 结尾轻互动

### 3. 语气

- 保留第一人称
- 保留真实感和轻口语
- 可以承认不完美
- 压掉公众号腔、演讲腔、讲义腔

### 4. 收藏导向

必须主动把原文重组为更容易收藏的单位：

- 步骤
- 清单
- 对比
- 误区
- 一句话判断

### 5. 搜索与点击双目标

- `xhs_title` 要兼顾点击和关键词
- `xhs_search_title` 要更直白、偏搜索
- `xhs_body` 第一屏必须出现主题词或同义词

## 输出协议

输出文件必须包含 frontmatter：

```yaml
---
title: 原公众号标题
summary: 原公众号摘要

xhs_title: 小红书标题
xhs_search_title: 搜索向标题
xhs_intro: 小红书开头钩子
xhs_body: 小红书正文
xhs_tags:
  - 标签1
  - 标签2
  - 标签3

xhs_cover_title: 封面主标题
xhs_cover_subtitle: 封面副标题

xhs_card_outline:
  - index: 1
    type: cover
    title: 卡片标题
    goal: 这一页要完成什么
    key_points:
      - 点1
      - 点2

xhs_images: []
xhs_publish_mode: draft
source_article: 原文件路径
---
```

## 执行步骤

### Step 1: 读取原文

读取用户给的公众号终稿，优先提取：

- 标题
- summary
- 正文主线
- 核心判断
- 原文里已经存在的图文卡片文案（如果有）

### Step 2: 判断适合的小红书结构

在以下三种结构里选最适合的一种：

1. **问题解决型**：痛点 -> 原因 -> 解法 -> 结论
2. **判断拆解型**：核心判断 -> 证据 -> 方法 -> CTA
3. **故事经验型**：经历 -> 转折 -> 发现 -> 提醒

知识型、商业型、观点型内容默认优先：`判断拆解型`

### Step 3: 改写小红书正文

要求：

- `xhs_title`：默认 15-20 字优先
- `xhs_intro`：前 1-3 行完成钩子
- `xhs_body`：700-1000 字以内优先
- 每 2-4 段至少出现一个可收藏信息点
- 结尾 CTA 要轻，不要像导购收口

### Step 4: 生成卡片大纲

把正文改写结果进一步抽成 `xhs_card_outline`。

默认 5-7 张卡，结构建议：

1. Cover
2. Pain / Problem
3. Thesis / Main Judgment
4. Method / Breakdown A
5. Method / Breakdown B
6. Result / Reframe
7. CTA / Ending

如果原文短，可压到 4-5 张；如果信息密度高，可扩到 8 张，但不要超过 8 张。

### Step 5: 写回新文件

- 输出到原文同目录
- 文件名：`原文件名.xhs.md`
- 原文正文保留在 frontmatter 下方，建议按以下结构写正文：

```md
# 小红书标题

## 正文

...

## 卡片文案参考

### P1 封面

...
```

## 成功标准

完成后必须能做到：

1. `video-script-illustrator` 能直接消费 `xhs_card_outline`
2. `xhs-pipeline-publisher` 能直接消费 `xhs_title/xhs_body/xhs_tags/xhs_images`
3. 原文不被覆盖

## 推荐输出口径

完成后回报：

```text
已生成小红书结构化稿：<path>
- 标题：...
- 卡片数：...
- 标签：...
```

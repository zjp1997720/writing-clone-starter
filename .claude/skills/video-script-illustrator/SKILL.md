---
name: video-script-illustrator
description: Generate business whiteboard-style illustration diagrams for video scripts, or Xiaohongshu-ready card illustrations for structured XHS notes. Use when the user wants 视频号脚本配图, screen-recording demo diagrams, or wants to turn `xhs_card_outline` into publishable Xiaohongshu cards.
---

# Video Script Illustrator

一个双模式配图引擎：

1. `video-script`：服务视频号脚本/录屏讲解
2. `xhs-cards`：服务小红书结构化图文

## 模式选择

### Mode A: `video-script`（默认）

适用场景：

- 视频号脚本配图
- 录屏演示图
- 讲解型概念图
- 分镜辅助图

核心特征：

- 单位是“概念/镜头”
- 重点是辅助口播、录制和剪辑
- 默认风格：`business-whiteboard`
- 默认输出：高信息密度信息图、结构图、对比图、决策图、流程图
- 默认信息密度：中到高
- 默认目标：生成一套适合视频口播切换的录制素材包，而不是文章插图

### Mode B: `xhs-cards`

适用场景：

- 把 `.xhs.md` 里的 `xhs_card_outline` 生成成套小红书图卡
- 用户说“小红书图文配图”
- 用户已经走完 `wechat-to-xhs-adapter`

核心特征：

- 单位是“卡片/滑页”
- 每张图必须能单独读懂
- 重点是封面吸引力、收藏价值、滑动节奏
- 默认风格：`notion` 或 `business-whiteboard` 的小红书卡片化版本

## 什么时候用

### 触发 `video-script`

- “帮我把这个视频号脚本生成配图”
- “视频脚本配图”
- “录屏演示图”
- “视频 presentation diagrams”

### 触发 `xhs-cards`

- “帮我把这个 `.xhs.md` 生成小红书图卡”
- “小红书图文配图”
- “根据卡片大纲生成小红书图片”
- “给小红书结构化稿配图”

## 输入契约

### `video-script`

输入：视频脚本 Markdown

### `xhs-cards`

输入：`.xhs.md` 文件，frontmatter 至少包含：

- `xhs_title`
- `xhs_cover_title`
- `xhs_cover_subtitle`（可选）
- `xhs_card_outline`

如果缺少 `xhs_card_outline`，不要硬猜，先报错并指出缺的字段。

## 核心差异

### `video-script` 和 `xhs-cards` 的区别

1. **信息单位不同**
   - `video-script`：概念点/镜头
   - `xhs-cards`：卡片页
2. **图片职责不同**
   - `video-script`：服务讲解
   - `xhs-cards`：服务阅读与收藏
3. **信息密度不同**
   - `video-script`：中到高（录制优先时默认高密度）
   - `xhs-cards`：中到高
4. **成功标准不同**
   - `video-script`：观众边听边看能懂
   - `xhs-cards`：单张截图仍有价值

## 工作流

### Mode A: `video-script`

#### Step 1: Read and Analyze Script

读脚本并识别：

- 核心论点
- 抽象概念
- 流程/对比
- 金句/结论

#### Step 2: Extract Key Concepts

每个概念定义：

- `concept_name`
- `visual_content`
- `layout`
- `text_labels`

#### Step 3: Build Segment-to-Image Mapping

在开始生成图片前，先把概念反向映射回脚本段落。

每张图都要明确：

- 对应哪一段口播原句/原段
- 更适合哪种画面类型：生成图 / 屏幕录制 / 回正脸
- 建议出场位置（开头 / 中段 / 收束 / CTA 前）
- 是否需要额外口播补充说明

默认要产出两份文本资产：

1. `{script_basename}-配图清单.md`
2. `{script_basename}-配图标注版.md`

如果用户明确要求直接写回原稿，才允许改原脚本；否则默认保留原稿不动，额外输出标注版。

#### Step 3.5: Design Visual Cadence

在生成图片前，先设计画面节奏。

默认规则：

- 按“关键判断点 / 对比点 / 金句 / 决策树 / 比喻句”切图，不按章节平均切图
- 优先提高画面变化频率，而不是追求少而大的章节插图
- 每张图尽量只承接一个明确判断，不要一张图塞完整章节
- 如果某段更适合真实演示，可用“屏幕录制”占位；如果某段需要建立信任或 CTA，可用“回正脸口播”占位
- 屏幕录制和回正脸口播要克制使用，默认主力仍然是生成图
- 最终产物应该更接近“录制用切图包”，不是“文章插图包”

#### `video-script` 默认策略（录制优先）

- 如果用户没有明确要求“少量精品图”，默认按录制优先处理
- 默认目标是：让视频在关键判断推进时持续出现新画面
- 默认允许图片数量偏多，只要每张图承接的判断足够清楚
- 如果同目录里已有旧文章插图，不应默认复用；应优先重新为口播节奏设计

#### Step 4: Prompt Template

```text
商务白板手绘风格信息图，信息密度高，逻辑清晰，适合视频口播切图。

画面内容（竖版布局，从上到下）：
- 顶部：[标题文字]
- 上部区域：[主要视觉元素1]
- 中部区域：[主要视觉元素2]
- 下部区域：[主要视觉元素3]
- 底部：[金句或总结文字]

视觉风格：
- 商务白板手绘风格 + 信息图卡片化
- 保留可见 sketch lines、轻微抖动、marker 笔触感、手绘箭头和非机器完美的框线
- 整体必须像人手在白板或纸面上画出来、再整理过的商业图解，而不是软件直接排版出来的企业模板图或 PPT 图表
- 中文标题层级强，关键词醒目，但所有中文文字都必须保留明显手写感
- 中文文字要像白板笔或马克笔直接写在图上，而不是后期软件覆盖上去
- 禁止使用规整印刷体、海报字体、PPT 字体、企业模板字、过于整洁的排版字体
- 允许轻微歪斜、笔画粗细变化、轻微不均匀，只要整体可读性仍然足够强
- 白色或浅灰背景，深色线条和文字
- 强调结构变化：三分流、双栏对比、时间轴、漏斗、坐标系、决策树、模块汇聚
- 信息密度高，但层级必须清楚，可扫读、可截图、可在手机视频里快速识别
- 画面必须一眼看懂当前这段在讲什么
- 纵向布局，适合竖屏演示和口播切图

布局：竖版3:4，从上到下的纵向流程

约束：无水印，无logo，无二维码；禁止空洞氛围图、纯装饰图、低信息密度大留白图；禁止看起来像标准企业信息图模板、标准 icon system 或整洁印刷海报排版；要适合视频口播切图，而不是公众号文章插图
```

### Mode B: `xhs-cards`

#### Step 1: Read Structured Note

读取 `.xhs.md`，提取：

- `xhs_title`
- `xhs_cover_title`
- `xhs_cover_subtitle`
- `xhs_card_outline`

#### Step 2: Card Planning Rules

对于每张卡片，定义：

- `card_index`
- `card_type`
- `card_title`
- `goal`
- `key_points`
- `visual_priority`

`xhs_card_outline.type` 支持这些语义：

- `cover`
- `pain`
- `thesis`
- `process`
- `method`
- `comparison`
- `reframe`
- `ending`

渲染时统一映射为 3 类布局：

- `cover` -> 高吸引封面布局
- `pain/thesis/process/method/comparison/reframe` -> 内容卡布局
- `ending` -> 结束页布局

#### Step 3: XHS Prompt Template

```text
小红书知识图卡风格，竖版 3:4，适合移动端滑动阅读。

这是一张第 [N] 页图卡，类型是 [cover/content/ending]。

标题：[卡片标题]
这一页的目标：[goal]
关键信息点：
- [point 1]
- [point 2]
- [point 3]

视觉要求：
- 信息清晰，可扫读，可截图
- 布局完整，不要像视频分镜草图
- 中文文字明确，标题层级强
- 封面页要更吸引，内容页要更耐读
- 风格统一，整组图片连贯
- 适合知识型、商业型、小红书图文卡片

默认风格：理性、干净、有结构感
约束：无水印，无logo，无二维码
```

#### Step 4: File Naming

`xhs-cards` 模式命名必须稳定：

- `01-cover-{slug}.png`
- `02-content-{slug}.png`
- `03-content-{slug}.png`
- `NN-ending-{slug}.png`

并按顺序回填到原 `.xhs.md` 的 `xhs_images`。

如果用户已经提供了一组现成小红书图片，则允许保留原文件名；只有当前 Skill 新生成的图片，才强制使用这套稳定命名。

## 图片生成

**IMPORTANT**: Do NOT use the Skill tool to call `qwen-image`. Directly execute the generation script.

```bash
node .claude/skills/qwen-image/scripts/tuzi/tuzi-image-generate.mjs \
  --model qwen-image-2.0 \
  --prompt "<prompt_text>" \
  --size 1152x1536 \
  --filename "<output_filename>.png" \
  --out-dir "<script_directory>"
```

Fallback: 如果 qwen-image 失败，可换 `gemini-image-preview` 后端：

```bash
node .claude/skills/gemini-image-preview/scripts/generate.mjs \
  --prompt "<prompt_text>" \
  --output "<output_path>" \
  --size 2304x3072
```

## 输出位置

### `video-script`

- 保存到脚本同目录
- 文件名：`{script_basename}-01.png`、`{script_basename}-02.png` …
- 同时生成：`{script_basename}-配图清单.md`
- 同时生成：`{script_basename}-配图标注版.md`
- 默认不覆盖原脚本

默认交付应是一套完整录制素材包：

- 顺序编号 PNG
- 配图清单
- 配图标注版

#### `video-script` 文本资产规则

`{script_basename}-配图清单.md` 至少包含：

- 图片文件名
- 对应口播原句/原段
- 建议出场位置
- 是否需要口播补充说明

`{script_basename}-配图标注版.md` 规则：

- 保留原脚本核心文案
- 仅在段落前插入统一格式的画面标记
- 标记格式固定为：

```md
【画面：切 `xxx-01.png`】
```

或：

```md
【画面：屏幕录制，展示 ideas spark 选题结果】
```

或：

```md
【画面：回正脸口播】
```

如果某一段不适合配生成图，而更适合录屏，则输出录屏提示；不要为了凑图硬塞图片。

### `xhs-cards`

- 优先保存到文章同目录的 `xhs-images/final/`
- 如果没有该目录，则保存到：`xhs-images/generated/`
- 同时更新 `.xhs.md` 里的 `xhs_images`

## 错误处理

1. 生成失败重试一次
2. 单张失败不影响其他卡片继续生成
3. `xhs-cards` 模式如果 `xhs_images` 回填失败，必须在回报中明确指出

## 完成回报

### `video-script`

```text
Generated {N} illustrations for {script_name}:
1. {concept_1_name} -> {image_path_1}
...
其中生成图：{generated_count}
屏幕录制段落：{screen_recording_segments}
回正脸段落：{talking_head_segments}
已生成配图清单：{mapping_note_path}
已生成配图标注版口播稿：{annotated_script_path}
```

### `xhs-cards`

```text
Generated {N} Xiaohongshu cards for {note_name}:
1. P1 封面 -> {image_path_1}
2. P2 内容 -> {image_path_2}
...
已回填 xhs_images 到：{note_path}
```

## 技术参数

- Size: `1152x1536`（3:4 竖版，qwen-image）；fallback `2304x3072`（gemini-image-preview）
- Format: `PNG`
- Backend: `qwen-image` (qwen-image-2.0 via Tuzi API)
- Default style:
  - `video-script` -> `business-whiteboard`
  - `xhs-cards` -> `notion` / `business-whiteboard-card`

---

**Last Updated**: 2026-04-06
**Dependencies**: `qwen-image`, `gemini-image-preview`（fallback）, `wechat-to-xhs-adapter`
**Default Mode**: `video-script`

---
name: xhs-pipeline-publisher
description: Publish a `.xhs.md` structured note through the existing xiaohongshu-publisher workflow. Use when the user wants to save a Xiaohongshu draft from the local pipeline output.
---

# XHS Pipeline Publisher

消费 `wechat-to-xhs-adapter` 和 `video-script-illustrator --mode xhs-cards` 的产物，把小红书结构化稿送入已安装的小红书发布器。

## 什么时候用

- 用户说“把这个 `.xhs.md` 发到小红书”
- 用户说“存成小红书草稿”
- 用户已经有 `xhs_images`，要走发布环节

## 输入要求

输入文件必须是 `.xhs.md`，且 frontmatter 至少包含：

- `xhs_title`
- `xhs_body`（或至少能和 `xhs_intro` 组合成正文）
- `xhs_tags`
- `xhs_images`

解析器会做严格校验：

- 缺标题 -> 直接报错
- 缺正文 -> 直接报错
- 缺图片 -> 直接报错
- 图片路径不存在 -> 直接报错
- 相对路径 -> 自动按 `.xhs.md` 所在目录解析

## 解析脚本

先运行：

```bash
python .claude/skills/xhs-pipeline-publisher/scripts/parse_xhs_note.py /path/to/file.xhs.md
```

输出 JSON：

```json
{
  "title": "...",
  "content": "...",
  "content_for_publish": "...",
  "tags": ["..."],
  "images": ["/abs/path/1.png"],
  "publish_mode": "draft"
}
```

## 发布规则

1. 默认只存草稿
2. 除非用户明确说“直接发布”，否则不点击发布按钮
3. 走现有 `xiaohongshu-publisher` 的 CDP 流程
4. 如果 `xhs_images` 为空，直接报错，不要继续发

## 工作流

### Step 1: 解析 `.xhs.md`

```bash
python .claude/skills/xhs-pipeline-publisher/scripts/parse_xhs_note.py /path/to/file.xhs.md
```

解析规则：

- 如果 `xhs_intro` 没有包含在 `xhs_body` 开头，自动拼到正文前面
- 标签会自动拼成发布正文末尾的 hashtag 行

### Step 2: 确认浏览器和登录态

复用已安装的 `xiaohongshu-publisher`：

```bash
npx agent-browser --cdp 9222 snapshot -i
npx agent-browser --cdp 9222 open "https://creator.xiaohongshu.com/publish/publish?target=image"
```

### Step 3: 上传图片并填写内容

- 上传 `images`
- 填 `title`
- 填 `content_for_publish`
- 默认点击“暂存离开”

### Step 4: 验证草稿结果

- 看到草稿箱条目
- 或看到保存时间/草稿记录

## 完成回报

```text
已按 `.xhs.md` 协议发送到小红书草稿：<path>
- 标题：...
- 图片数：...
- 模式：draft
```

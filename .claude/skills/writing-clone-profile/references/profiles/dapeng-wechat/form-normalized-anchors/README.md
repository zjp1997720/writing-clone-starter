# Form-normalized Anchors（dapeng-wechat）

这组文件不是新的 voice truth。

它们是基于 `voice-anchors.md` 指向的旧代表作，做出来的 **form-normalized reading layer**。

## 这组文件的职责

- 保留旧代表作的判断、案例、顺序和语义
- 让这些文章在 AI 读取时更符合当前的 form 偏好：
  - 正文主判断优先由完整段落承载
  - 短句只用于提气、转折、落点
  - 更高信息密度
  - 更少平台噪音与排版碎段

一句话：

**运行时默认由 normalized anchors 负责“这篇长文应该怎么站稳、怎么推进、怎么提气”；raw anchors 保留在后台做真值、审计和回归。**

## 允许做的 normalization

- 合并过碎的单句段
- 调整段落边界
- 清理纯平台噪音：封面、公众号元信息、图片占位、星标提醒、评论区引导等
- 统一 Markdown 标题与分节表达
- 删除没有信息增量、只有模板腔的对照句（如滥用的 `不是……而是……`）

## 不允许做的 normalization

- 改词义
- 改句子顺序
- 增删观点
- 更换案例
- 重写开头收尾
- 添加新内容

## 使用建议

1. 运行时先读 `style-profile.md`，明确规则、禁区和 form 目标
2. 再读 normalized anchors，直接把它作为长文 form 的主参考
3. 如果 profile 下存在 `voice-cues.md`，再用它轻量校准语气、判断力度和收束方式
4. raw anchors 默认不直接参与本轮写稿，只在下面场景回到后台读取：
   - profile 更新 / 重建
   - 风格偏移审计
   - 重新提炼 `voice-cues.md`

## 当前首批文件

- `anchor-01-上下文工程-规整版.md`
- `anchor-02-Claude-Code数字分身-规整版.md`
- `anchor-03-一人公司-规整版.md`

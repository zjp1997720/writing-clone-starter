# Writing Clone Lite

这是一个给「上下文已经够了」场景准备的轻量写作 skill。

这份 README 只负责给人快速看懂：

- 它适合什么场景
- 它不适合什么场景
- 它默认交付什么

具体执行规则、Gate 细节、形式门与详细输出契约，以 `SKILL.md` 和 `references/` 为准。

## 什么时候用

- 你已经和我讨论了很多轮
- 当前对话本身就是一份高质量 brief
- 你已经给了足够多的参考资料
- 你不想再走一整套重型上下文采集

## 什么时候不要用

- 你只有一个模糊念头
- 你还没想清楚立场和结构
- 你需要我主动帮你搜素材、补案例、建 Brief

这种情况，请用 `writing-clone-profile`。

## 它和 writing-clone-profile 的关系

- `writing-clone-profile`：从 0 到 1，把想法长成文章
- `writing-clone-lite`：上下文已成型，直接顺着写成文

它们是分工，不是替代。

## 默认输出

- 优先 prose-first、散文化、弱列表感、短而高密度
- 默认用现有 profile 的风格资产，其中 runtime 以 normalized form 为主，raw 留在后台
- 终稿对齐公众号流水线：`title / summary / author`
- 默认落盘的是 **publish-clean** 终稿：包含 frontmatter + 正文主内容 + 固定收尾脚注块，可直接进入 `post2wechat`
- 正式 `草稿_final.md` 前，会先生成 `草稿_final.candidate.md`，并经过一次独立硬门检查
- 备选标题、结构说明、优化建议默认走 Agent 回复，不写进终稿文档
- 文末默认追加固定脚注 `「注」本文由大鹏的分身系统创作`，并补 3-6 个与主题强相关的标签

## Claude Code 约定

- 直接在 Claude Code 当前对话里提炼 brief，不额外假设别的运行时
- 读取参考文件优先用 `Read`，定位内容优先用 `Grep` / `Glob`
- 真缺关键经历或判断时，最多补 0-1 次 `nmem` 记忆搜索
- 不依赖额外 adapter 或别的平台专属工具

## 最核心的一句话

**当写作的瓶颈已经不是「补上下文」，而是「别再搜了，赶紧落稿」，就该用我。**

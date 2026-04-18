# Profiles Directory

这里存放 `writing-clone-profile` 的多 profile 风格资产。

## 目录规则

- 一个 profile 一个子目录：`references/profiles/<profile_id>/`
- `profile_id` 用英文 slug，稳定用于目录名
- 给用户展示时，优先使用 `display_name`

## 每个 profile 的推荐结构

```text
references/profiles/<profile_id>/
├── style-profile.md
├── form-normalized-anchors/   # 公众号长文 / 深度长文 profile 建议纳入
├── voice-cues.md              # 运行时轻量 voice 校准层
├── voice-anchors.md           # 后台真值 / 审计层
├── examples.md      # 可选
└── quotes.md        # 可选
```

说明：`form-normalized-anchors/` 不是所有 profile 的硬性必需，但对“公众号长文 / 深度长文”这类强调正文组织、信息密度与长文 form 的 profile，建议作为正式资产层维护。

## 文件职责

- `style-profile.md`：可执行的风格规则
- `form-normalized-anchors/`：form-layer 阅读层；在不改内容合同的前提下，校准段落组织、密度和短句使用方式
- `voice-cues.md`：运行时轻量 voice 校准层；不带 raw 全文，只带高信号 voice cues
- `voice-anchors.md`：3-5 篇代表作或锚点路径，保留 raw voice truth，主要用于后台审计、回归和 cues 提炼
- `examples.md`：可复用案例、类比、开头与收尾素材
- `quotes.md`：高频金句、口头禅、签名语

一句话分工：**runtime 默认用 style + normalized + voice-cues 写；raw anchors 留在后台保真。**

## 使用约束

- 新增 profile 时，必须新建独立目录，不得覆盖其他 profile
- 更新 profile 时，只修改当前选中的 profile 目录
- 旧根目录文件只作为迁移遗留说明，不再作为新的写入目标

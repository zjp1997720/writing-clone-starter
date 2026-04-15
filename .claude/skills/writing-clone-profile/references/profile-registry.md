# Profile Registry

说明：这里维护 `writing-clone-profile` 的全部可用 profile。主代理先读取这里，再决定本次使用哪个 profile。

## Active Profiles

### 1. dapeng-wechat

- `profile_id`: `dapeng-wechat`
- `display_name`: `大鹏-公众号长文`
- `aliases`: `大鹏长文`, `公众号长文`, `dapeng longform`
- `author`: `大鹏飞呀飞`
- `target_platform`: `微信公众号 / 深度长文`
- `style_summary`: `说人话的技术博主风格：真实痛点开场，用完整自然段把复杂问题讲清，必要时用短句提气，最后收束到一个判断或动作。`
- `best_for`: `深度观点、方法论拆解、个人认知升级、AI 与一人公司主题`
- `asset_dir`: `references/profiles/dapeng-wechat`
- `runtime_mode`: `normalized-first`
- `longform_runtime_ready`: `true`
- `status`: `active`
- `source`: `由旧版单 profile 资产迁移而来`

## Selection Rules

- 如果用户显式指定 `profile_id`、`display_name` 或 registry 中登记过的 `aliases`，优先使用该 profile。
- 如果只有 1 个 `active` profile，直接使用它，并回显确认。
- 如果有 2 个及以上 `active` profile 且用户未指定，先展示候选列表并让用户确认，再继续写作。
- 如果某个 profile 缺少 `style-profile.md`，不得作为可用 profile 提供给用户。
- 如果某个 profile 的 `target_platform` 命中公众号长文 / 深度长文，但缺少 `form-normalized-anchors/README.md` 或 `voice-cues.md`，不得作为 longform runtime-ready profile 提供给用户。
- `voice-anchors.md` 应继续保留为后台真值资产，但它不再是 longform runtime-ready 的默认前台输入条件。

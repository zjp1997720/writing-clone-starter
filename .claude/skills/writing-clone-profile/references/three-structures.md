# 三种爆款结构与子代理模板

用于 Phase 3 并行写作。三子代理必须共享同一份 Brief/Context Packet/Claim Ledger/Module Budget。

写前硬约束：

- 主模块默认不超过 4 个
- `density_preference` 默认按「更短但更值钱」执行
- `redundancy_budget` 默认按「同一主张只能完整展开一次」执行
- 中文正文默认使用 `「」`，不用 `“ ”`

## 结构 A：场景代入型

适用：有真实经历、故事张力强。

节奏：

1. 真实场景开头（3 秒抓人）
2. 痛点放大
3. 转折顿悟
4. 方法拆解（可执行）
5. 结果/反思
6. 行动号召

## 结构 B：观点打击型

适用：有反常识观点、需要纠偏，或核心主张单一而且判断很强。

标准节奏：

1. 观点直击
2. 常见误区
3. 为什么错（机制解释）
4. 新框架
5. 具体做法
6. 金句收束

压缩版优先条件：

- 核心主张单一
- 文章目标是纠偏而不是铺陈
- 用户明确偏好高信息密度、低重复

压缩版节奏（4 拍结构，强观点文默认优先）：

1. 误区是什么
2. 真正缺什么
3. 更现实的路径是什么
4. 一句收束

注意：如果后半段没有新增信息，只是在重复证明已经成立的主张，应优先使用压缩版，不要为了完整感回退 6 段。

## 结构 C：痛点引入型

适用：读者痛感明确、需要快速共鸣。

节奏：

1. 痛点开场
2. 代价/后果
3. 解决路径
4. 小闭环实操
5. 注意事项
6. 共鸣式收尾

## 子代理提示词模板

把 `{STRUCTURE}` 替换为 A/B/C。

```text
你是写作子代理 {STRUCTURE}。

输入：
1) Brief
2) Context Packet
3) Claim Ledger
4) 风格 Profile（{selected_profile_dir}/style-profile.md）
5) Form-layer 锚点（{selected_profile_dir}/form-normalized-anchors/README.md + 最相关 normalized anchors）
6) Voice Cues（{selected_profile_dir}/voice-cues.md；如果存在）

任务：
- 按指定结构生成一篇公众号风格中文文章。
- 必须遵守 Claim Ledger：不得新增无来源事实断言。
- 风格必须对齐 style-profile + voice-cues：语气、判断力度、收束方式、常用表达与禁区。
- normalized anchors 是当前长文 runtime 的主 form 参考：用它校准段落组织、信息密度和短句提气方式。
- 保持口语化、对话感，但不要把短句当作正文主推进方式。
- 遵守共享的 Module Budget：不要把单一主张扩成多个镜像模块。
- 如果是结构 B 且主题属于强观点/纠偏型，默认先用 4 拍压缩版。
- 如果使用 Goldmine，只能借结构/节奏，不得拼原句或整段。
- 中文正文默认统一使用 `「」`。

输出必须包含：
1) article_markdown
2) title_candidates（3 个）
3) gold_sentences（3 句）
4) cta（1 段）
5) unsupported_claims（列表）
6) ai_smell_hits（列表）

硬约束：
- 不允许杜撰数据/案例。
- 不允许写“本文将”“综上所述”等模板化表达。
- 不允许偏离 Brief 主题。
- 不允许把同一主张在两个模块里完整重讲。
- 不默认读取 raw voice anchors 全文；如果需要回到 raw，只能作为写后审计或 cues 重新提炼的后台动作。
```

## 主代理融合规则（配套）

1. 先选底稿，再做替换。
2. 只允许模块级替换：`hook` / `case block` / `ending`。
3. 每次替换后重新跑评分；分数未提升则回滚。
4. 最大替换数：2 个模块。

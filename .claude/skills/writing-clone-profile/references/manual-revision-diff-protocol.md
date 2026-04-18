# Manual Revision Diff Protocol

目标：把 AI baseline 与人工改稿之间的差异，转化为可审查的风格/节奏/活人感候选规则，而不是让每次人工修改都白白流失。

## 1) 使用时机

当同时存在：

- `03-Reviews/草稿_final.ai-baseline.md`
- 人工修改后的 `草稿_final.md`

并且用户表示希望复盘、回流、更新 Profile、沉淀风格规则时启用。

一句话触发示例：

- 「我改完了，按写作分身回流协议做 diff 复盘」
- 「对这版做人工改稿 diff，给我回流建议」
- 「复盘我这次改稿，看看哪些该写回 profile」

如果用户明确要做 diff 复盘，但缺少 `03-Reviews/草稿_final.ai-baseline.md`，先检查本项目是否存在首版完整候选稿；能安全定位时，先补做一次 baseline 冻结，再继续。若无法确认哪一版才是基线，才报告阻塞点。

## 2) 不自动写回

本 protocol 只生成候选规则和推荐回流位置。任何写入长期 Profile 资产的动作，都必须由用户确认。

长期资产包括：

- `style-profile.md`
- `voice-cues.md`
- `examples.md`
- `quotes.md`
- `anti-ai-mechanics.md`
- `rewrite-delta-examples.md`
- `anti-patterns.md`

## 3) 输入物

- `03-Reviews/草稿_final.ai-baseline.md`
- `草稿_final.md`
- 本轮 Brief
- `03-Reviews/Lint-Report.md`
- `03-Reviews/Human-Feel-Review.md`（如果存在）
- 当前 Profile 的 `style-profile.md` 与 `voice-cues.md`

## 4) 输出位置

`03-Reviews/人工改稿-diff复盘.md`

## 5) 差异分类

| 类型 | 说明 | 常见回流位置 |
| --- | --- | --- |
| `voice_delta` | 语气、口癖、判断力度变化 | `voice-cues.md` / `style-profile.md` |
| `structure_delta` | 模块顺序、开头收尾、结构变化 | `article-archetypes.md` / `style-profile.md` |
| `pacing_delta` | 节奏、短句、转场、扣主线变化 | `anti-ai-mechanics.md` |
| `human_feel_delta` | 体感、真实经历、姿态变化 | `anti-ai-mechanics.md` / `rewrite-delta-examples.md` |
| `evidence_delta` | 事实降级、补来源、删无源断言 | `style-profile.md` / 不回流 |
| `packaging_delta` | 标题、摘要、开头包装变化 | `examples.md` / `content-packaging-loop` |
| `one_off_fix` | 本文特有修补 | 不回流 |

## 6) 分析步骤

1. 逐段对比 AI baseline 与人工 final。
2. 先记录人工稿删掉了什么，再记录加了什么。
3. 找出 3-7 个最高价值差异，不追求覆盖所有细枝末节。
4. 每个差异都判断：这是长期风格规律，还是本篇一次性修补。
5. 生成候选规则卡片。
6. 给出推荐回流位置和风险等级。

## 7) 候选规则卡片

```yaml
rule_candidate:
evidence:
delta_type:
why_it_matters:
apply_when:
do_not_apply_when:
target_file: style-profile.md | voice-cues.md | examples.md | quotes.md | anti-ai-mechanics.md | rewrite-delta-examples.md | anti-patterns.md | no-writeback
risk: low | medium | high
recommendation: write_back | keep_for_review | no_writeback
```

## 8) 回流判断

优先回流：

- 多次出现的风格偏差。
- 明显提升活人感、节奏或读者牵引的改法。
- 能被抽象成场景化规则，而不是只适合本篇。

不回流：

- 本文事实修补。
- 一次性标题策略。
- 只因为当时情绪状态产生的表达。
- 会把 Profile 推向另一个作者风格的改法。

## 9) 输出模板

```md
# 人工改稿 diff 复盘

## 总结
- baseline:
- final:
- 候选规则数量:
- 推荐写回:

## 高价值差异
| 位置 | AI baseline | 人工 final | delta_type | 为什么重要 |
| --- | --- | --- | --- | --- |

## 候选规则卡片
...

## 推荐回流
| 规则 | 目标文件 | 风险 | 建议 |
| --- | --- | --- | --- |
```

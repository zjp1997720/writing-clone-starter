# Reader Capture Audit

目标：在 `Article Gravity Gate` 之后，再用更偏内容编辑的镜头检查一遍：第一屏到底有没有抓力，读者为什么继续读，作者凭什么值得信。

它不是第二个重型 Gate。

它只解决一个问题：

**这篇文章虽然可以写，但第一屏是不是已经足够值得读。**

## 1) 使用时机

在 `Article Gravity Gate` 之后、`Gate A` 之前执行。

输出到：

`01-Context/reader-capture-audit.md`

## 2) 输入物

- Brief
- `01-Context/human-only-brief-slots.md`
- `01-Context/article-gravity-card.md`
- 当前 Profile 的 `style-profile.md`
- 当前 Profile 的 `opening-question-transition-moves.md`（如果存在）
- 当前 Profile 的 `article-archetypes.md`（如果存在）
- 当前 Profile 的 `anti-patterns.md`（如果存在）
- 当前主题已采集的关键素材

## 3) 核心字段

```yaml
topic:
first_screen_promise:
hook_type:
credibility_source:
material_signals:
perceived_value:
cognitive_gap:
entry_sync:
cta_focus:
decision:
repair_action:
```

## 4) 字段说明

- `topic`：第一屏到底在讲什么，不看标题也要成立。
- `first_screen_promise`：读者继续读下去，预计能拿走什么。
- `hook_type`：当前入口更像结果、冲突、问题、反差、工具、场景中的哪一类。
- `credibility_source`：作者为什么有资格说这件事，例如亲历、结果、长期实践、具体代价、清晰观察。
- `material_signals`：当前内容里已经能用的素材信号。至少标出命中的类型：`data / story / quote / authority / pain / concrete_result`。
- `perceived_value`：读者付出几分钟注意力后，换回来的实际收获。
- `cognitive_gap`：这篇文章相对常见写法，到底新在哪。
- `entry_sync`：标题、摘要、第一屏承诺是不是同一个价值单元。
- `cta_focus`：结尾只想要一个动作；如果现在想要多个动作，要提前收束。
- `decision`：`continue / stress_test_opening / ask_one_question / narrow_angle`
- `repair_action`：如果不直接继续，下一步要改什么。

## 5) 决策规则

- `continue`
  - 第一屏话题清楚
  - `first_screen_promise` 具体
  - `credibility_source` 可信
  - `entry_sync` 成立

- `stress_test_opening`
  - 文章有内容，但第一屏还不够抓
  - 常见信号：
    - Hook 出现太晚
    - 可信度建立太慢
    - 第一屏更像作者自述，不像读者承诺
    - `entry_sync` 略松，但中段主判断是成立的

- `ask_one_question`
  - 目前最缺的是一个高杠杆信息：
    - 为什么你有资格说
    - 这篇文章真正新在哪
    - 这篇文章最关键的素材是什么
  - 只允许问 1 个问题

- `narrow_angle`
  - 角度太散
  - 第一屏承诺太大
  - `perceived_value` 说不清
  - `material_signals` 太薄，撑不起当前入口

## 6) Opening Stress Test（条件触发）

当 `decision = stress_test_opening` 时，进入一次轻量开头压力测试。

目标不是产出很多方案。

目标是：**在不把写作流程做重的前提下，快速确认更强的第一屏入口。**

执行规则：

- 只生成 3 个开头候选
- 每个候选必须显式标注：
  - `hook_type`
  - `credibility_source`
  - `first_screen_promise`
- 优先尝试这三种方向里的最相关类型：
  - 痛点/冲突前置
  - 结果/收获前置
  - 问题/悬念前置
- 选 1 个进入正文；其余只保留在 `Structure-Eval` 里，不继续扩散

## 7) 禁区

- 不把开头写成标题的重复解释。
- 不为了抓人而承诺正文无法兑现的价值。
- 不把 `credibility_source` 写成模糊身份姿态，例如“我研究了很久”。
- 不用 10+ 备选开头把主流程拖回方案工坊。
- 不因为第一屏弱，就本能地去补更多中段资料。

## 8) 输出格式

```yaml
topic:
first_screen_promise:
hook_type:
credibility_source:
material_signals:
perceived_value:
cognitive_gap:
entry_sync:
cta_focus:
decision:
repair_action:
```

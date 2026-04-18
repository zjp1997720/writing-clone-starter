# Reader Momentum Map

目标：在写作前规划读者为什么会一段一段读下去。

结构解决「文章怎么展开」，Momentum 解决「读者为什么不划走」。它不替代 `Structure-Eval.md` 和 `Module-Budget.md`，而是补上心流牵引层。

## 1) 使用时机

在 Phase 3S / Phase 3M 的写前骨架阶段生成。

输出到：

`03-Reviews/Momentum-Map.md`

## 2) 输入物

- Brief
- Article Gravity Card
- Context Packet
- Structure Eval
- Module Budget
- 当前 Profile 的 `anti-ai-mechanics.md`（如果存在）

## 3) 核心字段

```yaml
article_archetype:
archetype_rhythm:
archetype_risk:
hook_type: scene | conflict | pain | useful_tool | weird_fact | direct_judgment
first_screen_question:
main_thread:
detour_budget:
pullback_lines:
escalation_order:
callback_seed:
callback_fire:
flow_break_risks:
question_moves:
```

## 4) 字段说明

- `article_archetype`：当前 Profile 的文章级原型；如果 Profile 没有原型库，可留空。
- `archetype_rhythm`：这个原型哪里快、哪里慢、哪里转。
- `archetype_risk`：这个原型最容易写坏的地方。
- `hook_type`：第一屏用什么抓住读者。
- `first_screen_question`：读者读完前 300 字，心里欠下的那个问题。
- `main_thread`：全文反复回到的主线，一句话说清。
- `detour_budget`：允许偏出去的案例、知识、类比、故事；每个 detour 都必须服务主线。
- `pullback_lines`：每次 detour 后把读者拉回主线的句子。
- `escalation_order`：多个案例/工具/观点的排列顺序，优先按冲击力递进，而不是平铺。
- `callback_seed`：开头或中段埋下的意象、句子、问题。
- `callback_fire`：结尾或关键转折如何呼应。
- `flow_break_risks`：可能让读者断流的位置。
- `question_moves`：刹车、转向、加速用的疑问句候选。

## 5) Main-thread Pulse

每个知识、案例、类比 detour 结束后，都要问：

1. 这一段偏出去是为了什么？
2. 它有没有把读者带回主线？
3. 扣回主线的句子是在推进，还是只是在重复标题？

如果连续 3-4 段都没有回答「这和本文核心判断有什么关系」，标记为 `flow_break_risk`。

可用形式：

- 回到一开始那个问题。
- 所以这件事真正麻烦的地方在这里。
- 这也是我为什么说，真正关键的不是 X，而是 Y。
- 说回我们自己的写作分身，这个问题会变得更明显。

## 6) Escalation Order

当文章包含 3 个以上并列案例、功能、观点、工具时，不要平铺。

默认顺序：

1. 最容易理解的放前面，让读者进入。
2. 信息增量更高的放中间，开始抬升。
3. 最有冲击力、最反常识、最能代表主张的放后面。

注意：这不是要求最后一个一定更长，而是要求情绪和认知强度不能越写越弱。

## 7) Callback

如果开头出现了具体场景、人物、物件、问题或句子，结尾优先 callback。

常见形式：

- 回到开头原句，但给出新理解。
- 回到开头场景，但作者判断发生了变化。
- 回到开头问题，但答案已经被全文铺出来。

没有 callback 也可以，但必须在 Momentum Map 里说明原因。

## 8) Lint 输出建议

在 `Human-Feel-Review.md` 或 `Lint-Report.md` 中补一张表：

| detour 段落 | detour 类型 | 是否扣回主线 | 扣主线句 | 动作 |
| --- | --- | --- | --- | --- |

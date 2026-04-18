# Article Gravity Gate

目标：在上下文充足度之外，先判断这篇文章是否有「值得读下去」的吸引力。

这不是标题党检查，也不是流量玄学。它只回答一个问题：如果读者现在点开这篇文章，第一屏有没有理由继续读，读完有没有一个明确收获。

## 1) 使用时机

在 Phase 0 Brief 完成后执行，早于正式写作。

输出到：

`01-Context/article-gravity-card.md`

## 2) 输入物

- Brief
- 用户当前素材
- 已选 Profile 的 `style-profile.md` 与 `voice-cues.md`
- 必要时参考 `examples.md` 中的开头/标题正反例

## 3) 评分槽位

总分 100。

| 槽位 | 分值 | 通过标准 | 常见失败 |
| --- | ---: | --- | --- |
| `reader_promise` | 20 | 读者能一眼知道可带走什么 | 作者自嗨、概念先行 |
| `curiosity_hook` | 20 | 第一屏有悬念、冲突、反常识或具体结果 | 开头平、像说明书 |
| `knowledge_gain` | 20 | 有新方法、新案例、新框架或新判断 | 正确但无增量 |
| `resonance_point` | 15 | 能戳中读者真实处境或情绪 | 只讲作者观点 |
| `personal_stake` | 15 | 作者为什么关心这事是清楚的 | 像资料拼盘 |
| `specificity` | 10 | 有具体工具、场景、案例、动作或对象 | 大词过多 |

## 4) 输出格式

```yaml
reader_promise:
curiosity_hook:
knowledge_gain:
resonance_point:
personal_stake:
specificity:
gravity_score:
weakest_slot:
decision: write | narrow | ask_one_question | park
repair_action:
```

## 5) 决策规则

- `gravity_score >= 70`：继续写作。
- `50 <= gravity_score < 70`：只修最弱槽位；如果修复需要用户补料，只问 1 个高杠杆问题。
- `gravity_score < 50`：不要硬写完整稿，先收窄选题或改入口。

## 6) 修复优先级

1. 第一屏没有抓力：先改 hook，不急着补资料。
2. 没有读者承诺：把主题改成一个具体可带走的价值单元。
3. 没有作者在场：回到人类不可替代槽位，找 `personal_stake / first_hand_scene / emotion_nodes`。
4. 只有外部资料：降低 Goldmine 和 web 权重，优先找作者自己的判断和经历。

## 7) 禁区

- 不为了过 Gate 编造真实经历。
- 不把「反常识」写成强行抬杠。
- 不把 reader promise 写成营销口号。
- 不用外部金句替代作者自己的判断。

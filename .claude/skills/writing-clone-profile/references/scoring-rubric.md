# 写作评分规范（Scoring Rubric）

用于 Phase 4：三稿评分、选稿、融合决策。

## 1) 评分维度（总分 100）

| 维度                  | 权重 | 5 分标准                                             | 1 分标准                              |
| --------------------- | ---: | ---------------------------------------------------- | ------------------------------------- |
| Voice Fidelity        |   20 | 明显像作者本人：对齐 style-profile + voice-cues      | 书面化、工整、AI 腔重                 |
| Form Fidelity         |   20 | 对齐 normalized form：主判断成段承载，短句只局部提气 | 正文碎切、短句越权、整体像切句稿/讲义 |
| Substance             |   20 | 有具体方法和步骤，可直接执行                         | 正确但空泛                            |
| Density & Compression |   15 | 主张不重复、模块紧凑、每段有新增信息                 | 同一主张多次重讲、段落低增量          |
| Hook & Pacing         |    5 | 开头抓人，节奏有张力                                 | 开头平、节奏拖                        |
| Insight               |    5 | 有新判断、反常识或强比喻                             | 陈词滥调                              |
| Integrity             |   10 | 无无源断言、无杜撰                                   | 存在硬编事实                          |
| Shareability          |    5 | 至少 1 句可传播金句                                  | 无记忆点                              |

总分计算：

`final_score = Σ(weight * dim_score / 5)`

## 2) 硬门槛

- `final_score >= 80`
- `Voice Fidelity >= 16`
- `Form Fidelity >= 16`
- `Substance >= 16`
- `Density & Compression >= 12`
- `Integrity >= 8`

任一不满足：不得进入融合。

## 2.1) 额外 Pass 门槛

下面两个门槛不参与 100 分重算，但任一未通过，都不得进入融合或 final。

### Momentum Pass

目标：确认文章有读者心流牵引，而不是只把信息铺完。

必须同时满足：

1. 开头能在第一屏提出具体悬念、冲突、反常识、结果或读者承诺。
2. 全文有清楚的 `main_thread`，读者不会在中段忘记这篇到底在说什么。
3. 每个知识 / 案例 / 类比 detour 后都有回到主线的动作。
4. 没有连续 3 段以上平稳说明、无问题、无转向、无主线回扣。
5. 多案例 / 多工具 / 多观点不是平铺，至少有基本递进。

失败时：

- 优先回到 `03-Reviews/Momentum-Map.md` 修主线和 detour。
- 只重写开头、中段断点或收尾 callback，不默认推翻全文。

### Human Feel Pass

目标：确认文章有真实的人在场，而不是正确内容的整齐堆叠。

必须同时满足：

1. 情绪表达优先来自动作、停顿、场景或体感，而不是抽象情绪标签。
2. 文章能看到作者自己的经历、判断、犹豫、取舍或阶段性位置。
3. 强观点文章先理解读者或反方为什么会那么想，再给出自己的判断。
4. 可控不完美自然存在；没有为了像人而硬塞自嘲、口头禅或犹豫。
5. 不用活人感掩盖事实不清、案例编造或承诺不准。

失败时：

- 优先回到 `03-Reviews/Human-Feel-Review.md` 定位失败模块。
- 如果全篇像资料汇报或品牌营销，回到 Article Gravity Card 和 Momentum Map 重建入口。

## 3) Form Fidelity 的判分要点

重点看 5 件事：

1. 正文主判断是否主要由完整自然段承载
2. 是否出现连续 2 个以上单句短段
3. 是否出现连续 3 个以上超短正文段
4. 短句是否开始承担机制解释或主推进功能
5. 整体读感是否更像成熟公众号长文，而不是讲义、切句稿、朋友圈拆句长文

## 4) Density & Compression 的判分要点

重点看 4 件事：

1. 同一主张有没有在不同模块被完整重讲
2. 模块是不是镜像关系，只是换了说法
3. 删掉某段后，主线和价值是否几乎不变
4. 强观点文章有没有优先采用更紧的结构，而不是为了完整感拉长

## 5) 平分时的 tie-breaker

按顺序比较：

1. Form Fidelity
2. Voice Fidelity
3. Density & Compression
4. Substance
5. Integrity
6. ai_smell_hits 数量（越少越优）

## 6) AI 味命中项（示例）

命中即扣分：

- "在当今时代"
- "本文将"
- "让我们深入"
- "综上所述"
- 过度中性平衡句式（无立场）
- 中文正文混入 `“ ”`

## 7) 融合通过标准

融合后文章必须满足：

1. 总分 >= 底稿分数 + 3，或
2. `Form Fidelity` 提升且 `Voice Fidelity` 不下降，或
3. `Density & Compression` 提升且 `Form Fidelity` 与 `Voice Fidelity` 都不下降，或
4. `Integrity` 提升且 `Voice Fidelity`、`Form Fidelity` 与 `Density & Compression` 都不下降

否则回退到底稿。

## 8) 输出建议格式

```text
Draft A: 86 (V18 F18 S18 D15 H4 I4 T9 Sh2)
Draft B: 81 (V17 F15 S17 D14 H4 I4 T9 Sh1)
Draft C: 79 (V17 F13 S16 D14 H4 I4 T8 Sh3)

Base: A
Fusion plan: replace ending from C
Expected improvement: Shareability + Insight
```

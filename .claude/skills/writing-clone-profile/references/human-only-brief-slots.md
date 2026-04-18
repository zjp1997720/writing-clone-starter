# Human-only Brief Slots

目标：把 AI 不能替作者编造的素材提前标出来，避免文章靠资料、外部案例和通用方法论硬撑。

这些槽位不是为了阻塞写作，而是为了区分：

- 哪些东西必须来自作者本人
- 哪些东西可以由 AI 补证据、补类比、补结构
- 哪些东西缺失时只能降级处理，不能伪造

## 1) 使用时机

Phase 0 Brief 后立即执行，并把结果写入：

`01-Context/human-only-brief-slots.md`

## 2) 槽位

```yaml
personal_stake:
first_hand_scene:
emotion_nodes:
human_only_material:
god_move_candidate:
cannot_invent:
presence_risk:
repair_action:
```

## 3) 字段说明

- `personal_stake`：作者为什么真的关心这件事。
- `first_hand_scene`：亲自做过、见过、聊过、踩过的场景。
- `emotion_nodes`：兴奋、焦虑、愤怒、释然、吐槽等具体时刻。
- `human_only_material`：必须由人提供的经历、判断、用户反馈、现场细节。
- `god_move_candidate`：非线性类比、意象、创意嫁接候选；AI 可以给候选，但不能冒充作者灵感。
- `cannot_invent`：明确禁止编造的体验、数据、反馈、结果、承诺。
- `presence_risk`：`low / medium / high`，判断文章是否有低在场感风险。
- `repair_action`：继续、补一个问题、降级为方法论/主观判断、或暂缓。

## 4) 缺失处理

如果缺 `first_hand_scene`：

- 可以继续写方法论、观点、工具说明。
- 必须标记低在场感风险。
- 不允许编造「我上周遇到一个朋友」这类假场景。

如果缺 `emotion_nodes`：

- 不允许写夸张体感。
- 可以保持克制，写成阶段性判断或理性观察。

如果缺 `god_move_candidate`：

- AI 可以生成类比候选。
- 输出时必须标注为候选，不把它写成作者灵光一现。

如果缺 `human_only_material` 且文章目标强依赖真实经历：

- 优先问 1 个高杠杆问题。
- 用户不回复时，降级为主观判断 + 方法论，不写成亲历故事。

## 5) 禁区

- 不编造用户案例。
- 不编造项目结果。
- 不把公开资料包装成作者亲身经历。
- 不用「活人感」掩盖无来源断言。
- 不把 AI 生成的类比写成作者真实的顿悟瞬间。

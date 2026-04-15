# Writing Clone Lite - Light Gate

## 目的

判断当前任务能不能直接轻量写。

这份文件只负责两件事：

1. 定义 Light Gate 的详细判定规则
2. 定义“一次性最小补充”的白名单与回退口径

它是 `SKILL.md` 中 Gate 章节的详细展开，不单独改写 Lite 的主合同。

## 四项检查

- `topic`：主题是否明确
- `stance`：核心立场是否明确
- `reader`：目标读者是否明确
- `shape`：结构是否大致明确

## 判定规则

- 命中 4 项：直接写
- 命中 3 项：直接写
- 命中 2 项：只允许做一次最小补充采集，再写
- 命中 1 项及以下：停止，回退到 `writing-clone-profile`

## 二次 Gate

如果命中 2 项并触发了一次最小补充采集：

- 补完之后必须重新判定一次
- 重新判定达到 3 项及以上，才能继续轻量写
- 重新判定仍不足 3 项，直接回退到 `writing-clone-profile`

不要因为已经补了一次，就默认继续写。

## 最小补充采集白名单

只允许：

1. 读取用户明确给出的参考文件
2. 读取当前 profile 的 `style-profile.md`
3. 读取当前 profile 的 `form-normalized-anchors/README.md`
4. 读取当前 profile 下最相关的 normalized anchor
5. 按需读取当前 profile 的 `voice-cues.md`
6. 按需读取当前 profile 的 `examples.md` / `quotes.md`
7. 按需做 0-1 次 `nmem` 记忆搜索（例如：`nmem --json m search "<关键词>" -n 5`）

默认禁止：

- 全库搜素材
- Goldmine Budget Card
- 默认全量项目扫描
- 默认联网搜索

## 回退口径

当命中项不足时，用这句：

`这轮上下文还不够厚，继续轻量写很容易写空。我建议切回 writing-clone-profile，让我先把 brief 和素材补齐。`

# Claim Ledger 断言台账规范

用于控制“事实断言”质量，避免杜撰与无源硬写。

## 1) 核心规则

1. 所有可被反驳的事实断言，必须入台账。
2. 每条断言必须有来源，或降级为主观判断。
3. 主代理融合时不得新增未登记断言。

## 2) 台账格式

写作前或写作中维护如下表格：

| claim_id | claim_text | claim_type | source_type | source_ref | confidence | public_ok | action |
| -------- | ---------- | ---------- | ----------- | ---------- | ---------: | --------- | ------ |

字段说明：

- `claim_id`: 断言编号（C1, C2...）
- `claim_text`: 断言原文
- `claim_type`: `fact` / `anecdote` / `judgment`
- `source_type`: `reference` / `user` / `repo` / `memory` / `none`
- `source_ref`: 文件路径、记忆 id 或用户输入位置
- `confidence`: 0-1
- `public_ok`: `yes/no`
- `action`: `keep` / `downgrade` / `drop`

## 3) 断言动作规则

- `fact + source missing` -> `downgrade`
- `fact + public_ok=no` -> `drop`
- `anecdote + source missing` -> 改写为“假设场景”或 `drop`
- `judgment` 可保留，但禁止伪装成数据结论

## 4) 降级模板

将硬断言改成主观表达：

- "数据显示..." -> "我的体感是..."
- "多数人都会..." -> "我观察到不少人会..."
- "这能提升 80%..." -> "这通常会明显提升..."

## 5) Gate B 通过条件

- `unsupported_claims == 0`
- `public_ok=no` 的断言不得出现在正文
- 每个关键结论至少能回溯到一个来源

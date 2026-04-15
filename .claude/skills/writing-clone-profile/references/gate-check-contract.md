# Writing Gate Check Contract

这份 contract 定义 `writing-gate-checker` 的**共享真相源**。

它同时服务两个 writer：

- `writing-clone-profile`
- `writing-clone-lite`

它服务两个运行时：

- Claude Code（通过 `.claude/agents/writing-gate-checker.md`）
- OpenCode（复用 `.claude/skills/writing-gate-checker/SKILL.md`）

目标不是让 checker 变成第二写作者，而是让它成为**独立硬门审计员**。

---

## 1. 角色定位

`writing-gate-checker` 只做一件事：

> 在正式产出 `草稿_final.md` 之前，基于项目 artifacts 和 final candidate，审计可证据化的硬门，并输出 `PASS / FAIL`。

它：

- 不写正文
- 不打磨风格
- 不重想结构
- 不对“像不像大鹏”“够不够有活人感”做强裁决

---

## 2. 何时调用

只在下面场景主动调用：

1. 任务属于 `01_项目/内容创作/` 下的正式写作链路
2. writer 已完成 draft，准备产出正式 final
3. 项目目录中存在或理论上应存在 gate artifacts

一句话：

> 当任务进入“准备输出 final”阶段时，主动调用 gate-checker；没有 PASS，不允许进入 `草稿_final.md`。

---

## 3. 允许读取的输入

checker 默认只读取下面这些输入：

- `00-Brief.md`
- `01-Context/context-packet.md`
- `02-Drafts/草稿_v*.md`
- `草稿_final.candidate.md`
- `03-Reviews/Claim-Ledger.md`
- `03-Reviews/Structure-Eval.md`
- `03-Reviews/Module-Budget.md`
- `03-Reviews/Lint-Report.md`
- 当前 profile 相关 rule / lint spec：
  - `style-profile.md`
  - `voice-cues.md`（只做弱参考）
  - `references/claim-ledger-spec.md`
  - `references/redundancy-lint.md`

### 明确禁止输入

不要把下面这些当作证据：

- writer 的自由文字自评
- “我已经检查过了”的口头解释
- 过长的会话上下文
- 未落盘的中间思考

核心原则：

> checker 看证据，不听辩词。

---

## 4. Gate 分层

## 4.1 硬门（PASS / FAIL）

### A. Artifact Completeness

先按 writer 模式区分：

#### Profile 模式（重型写作）

必须存在：

- `00-Brief.md`
- `01-Context/context-packet.md`
- `03-Reviews/Claim-Ledger.md`
- `03-Reviews/Structure-Eval.md`
- `03-Reviews/Module-Budget.md`
- `03-Reviews/Lint-Report.md`
- `草稿_final.candidate.md`

其中：`01-Context/context-packet.md` 对 Profile 模式是硬门，不是建议项。

#### Lite 模式（轻量直写）

最小必须存在：

- `草稿_final.candidate.md`
- `03-Reviews/Lint-Report.md`

如果当前 Lite 任务已经显式落了 Brief / Context / 其他 review artifacts，可以一起读取，但不要反向要求 Lite 必须补成 Profile 的重型前置。

命中人工改稿链路时，还必须存在：

- `03-Reviews/草稿_final.ai-baseline.md`

### B. Form Hard Limits

checker 只查硬阈值，不查“感觉”。

默认阈值：

1. **连续 2 个以上单句短段** → 警告
2. **连续 3 个以上超短正文段** → FAIL
3. **全文主模块 > 4** → FAIL

### B.1 对照句（`不是X，而是Y / 不是……而是……`）特殊规则

对照句不再按纯总数硬判。

先分两类：

1. **装饰性对照句**
   - 删掉后信息基本不受损
   - 主要作用只是营造腔调、制造表面反转、重复已有判断
   - 这类句子超出预算时，直接进入 FAIL 风险

2. **功能性对照句**
   - 删掉后会损失关键纠偏、概念边界或判断翻转
   - 这类句子允许低频存在，但不能连续堆叠、不能替代正文主推进

执行原则：

- 主规则：**装饰性对照句严格控制**
- 软护栏：篇幅更长时，功能性对照句允许略宽，但默认只做 warning / review 提示，不把总数当唯一 fail 条件
- 真正触发 FAIL 的，不是“有几个对照句”，而是“是否模板化堆叠、是否越权承担正文推进”

### C. Claim Consistency

先按 writer 模式区分：

#### Profile 模式（重型写作）

必须满足：

1. 正文关键结论能回溯到 `Claim Ledger`
2. `unsupported_claims == 0`
3. `public_ok=no` 的断言不得出现在正文

#### Lite 模式（轻量直写）

最小必须满足：

1. `Lint-Report.md` 中显式给出 `unsupported_claims` 列表或 `unsupported_claims == 0`
2. checker 在 candidate 中没有发现明显应降级却未降级的硬断言
3. 如果 Lite 当前任务额外落了 Claim Ledger 或来源台账，可以一起核验；但不要反向要求 Lite 默认补齐 Profile 级 Claim Ledger

这里的重点不是让 Lite 证明“上下文够厚”，而是证明“没有超出当前证据边界乱抬结论”。

### D. Release Completeness

公众号型 profile / 平台命中时，必须满足：

1. frontmatter 包含 `title / summary / author`
2. 固定脚注块存在
3. 标签存在且数量 3-6 个

---

## 4.2 软门（只 advisory，不进 PASS / FAIL）

下面这些只能做风险提示：

- 像不像大鹏
- 活人感够不够
- 洞察够不够锋利
- 这篇够不够值得发
- 是否“充分利用了上下文”

理由：这些本质上属于主观质量判断。checker 可以给第二份意见，但不能把它们伪装成客观硬门。

---

## 5. 输出格式

checker 必须把结果写入：

- `03-Reviews/Gate-Check-Report.md`

格式固定：

```md
# Gate Check Report

状态：PASS | FAIL
检查时间：YYYY-MM-DD HH:MM

## Hard Gates Summary

| Gate | Result | Evidence |
| ---- | ------ | -------- |

## Failure Items

- [最多 5 条失败项，每条带文件与行号证据]

## Advisory Notes

- [可选，最多 3 条软门提示]
```

返回给上层 orchestration 的结论必须只有两类：

- `PASS`
- `FAIL`

---

## 6. 裁决规则

### PASS

只有当全部硬门通过时，才允许：

- 把 `草稿_final.candidate.md` 升格为 `草稿_final.md`

### FAIL

只要任意一个硬门失败：

- writer 必须回到 `draft / review` 阶段修稿
- 不允许直接写正式 `草稿_final.md`

checker 的职责是**审计 writer 已落盘的 lint 证据并做兜底判断**。

默认不要求 checker 重新接管 writer 的全部机械检查；只有在 `Lint-Report.md` 缺证据、证据与 candidate 不一致、或硬门明显冲突时，才做针对性复查。

重点：

> checker 必须有真实拦截权；如果它只能提建议，它就不是 gate。

---

## 7. 双端兼容原则

Claude Code 和 OpenCode 都必须遵守同一份 contract：

- 不各自维护一套硬门定义
- 不各自解释 PASS / FAIL
- 不在某一端额外扩写主观审美门槛

允许不同的，只是：

- 调用入口
- agent / skill 注册方式
- 运行时工具权限描述

不允许不同的，是：

- gate 本体
- 输出格式
- 裁决规则

---

## 8. 非目标

这份 contract 明确不做：

1. 不让 checker 代替人工终审
2. 不让 checker 给正文润色
3. 不让 checker 变成第二个 writer
4. 不做自动化爆款判断

一句话：

> 它是硬门审计员，不是内容总监。

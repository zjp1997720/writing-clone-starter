# Skill Design Patterns for Optimization Work

这份文件不是大全，只保留对“优化已有 Skill”最有用的模式判断。

---

## 1. Inversion

适用于：

- 需要先理解用户真正需求
- 不能靠猜测直接改写

在这个 Skill 里，Inversion 的作用是：

- 先还原原 Skill 的真实目的
- 先区分“核心合同”与“当前写法”

如果不做这一步，优化很容易跑偏。

---

## 2. Reviewer

适用于：

- 需要按清单审查现状
- 需要把“看什么”和“怎么判断”分开

在这个 Skill 里，Reviewer 主要用来做诊断，而不是直接做改写。

---

## 3. Pipeline

适用于：

- 顺序很重要
- 中途需要确认点

在这个 Skill 里，Pipeline 的顺序应该固定为：

1. freeze baseline
2. review
3. propose
4. approval gate
5. apply
6. preservation check

不要跳步骤。

---

## 4. Generator

适用于：

- 需要稳定地输出模板化结果

在这个 Skill 里，Generator 只在两个地方出现：

- 生成 baseline contract
- 生成 optimization proposal

以及在用户批准后，生成改写后的 Skill 草稿。

---

## 5. Explain Why, Not Just What

如果你发现自己在写：

- ALWAYS
- NEVER
- MUST

先问一句：

这个约束能不能改写成“为什么这样更好”？

优化 Skill 时，解释 why 往往比堆规则更稳。

---

## 6. Preserve the Baseline

优化不是重做。

如果某轮优化：

- 只是看起来更规范
- 但没有明显提升 trigger / clarity / maintainability
- 或者需要靠改合同才能显得更好

那就应该保留 baseline，而不是硬改。

# Dan Koe｜Asset Audit

## 当前判断

Dan Koe profile 已经不再是试点空壳。

它已经具备：

- 世界观骨架
- 主动作链骨架
- 带宽边界
- 原始语料索引

但在这轮深化之前，它还没天然形成“难以被 baseline 轻易逼近的作者壁垒”。

问题不在于完全没资产，而在于当时：

- 像什么，已经有了
- 不像什么，还不够清楚
- 哪些信号难伪造，还不够明确
- 后续怎么盲测，还没有显式切开

## 一、现有资产盘点

### A. Raw corpus

当前已有：

- 一级核心源 5 篇：`intellectual-signature / longformwriting / contentmap / fixlife1day / onepersonbizlaunch`
- 二级补充源 6 篇：`ai_systemization / futureproofskills / 5d-strategic-thinking / dopamine-detox-30d / human30 / purposeprofit`
- 额外可调用长文源：`different2026 / articulateintelligently / thought-partner-prompt / life-reset-prompt`

当前够用来做：

- Dan Koe 核心议题带宽判断
- 开头动作、重定义动作、框架压缩动作的初步归纳

深化前还不够的地方：

- 没有显式分出“构建集”和“held-out 集”
- 没有明确哪些源只是补充，哪些源应被视为一级校准源

本轮深化后，这两层已经被显式补上，见：

- `raw-corpus/README.md`
- `held-out-set.md`

### B. 碎片资产

当前已有：

- `02_素材库/writing-clone-starter-material-library/authors/dankoe/canonical/snippets/titles/` 中大量 `dan_koe` 标题文件
- `02_素材库/writing-clone-starter-material-library/authors/dankoe/canonical/snippets/openings/` 中大量 `dan_koe` 开头文件
- `02_素材库/writing-clone-starter-material-library/authors/dankoe/canonical/snippets/quotes/` 中大量 `dan_koe` 金句文件
- `02_素材库/writing-clone-starter-material-library/authors/dankoe/canonical/snippets/structures/` 中大量 `dan_koe` 结构文件

当前够用来做：

- 快速归纳 Dan Koe 常见起手方式
- 抽取极简框架、命名方式和高势能判断

深化前还不够的地方：

- 还没有把碎片明确整理成“难伪造信号”和“假信号”两层
- 还没形成“普通强稿 vs Dan Koe”对照样本

本轮深化后，这两层已经被显式补上，见：

- `hard-signals.md`
- `false-positive-signals.md`
- `contrastive-pairs.md`

### C. 规则资产

当前已有：

- `worldview.md`
- `recurring-moves.md`
- `taboo-moves.md`
- `snippet-bank.md`
- `topic-bandwidth.md`

当前够用来做：

- 第一轮高拟态调用
- 初步防止滑向 generic strong article
- 初步防止超带宽硬拟态

深化前还不够的地方：

- 规则仍偏“方向提示器”，不是高壁垒作者资产包
- 规则还缺少对照层和验收层

本轮深化后，规则层已经从“方向提示器”推进到“动作链 + 反样本 + held-out + 验收清单”的正式 draft 层。

### D. 缺口资产

这次深化前最缺的是：

1. `hard-signals.md`
2. `contrastive-pairs.md`
3. `false-positive-signals.md`
4. `held-out-set.md`
5. `acceptance-checklist.md`

这些资产缺失时，系统很容易：

- 把公共词表误当像度
- 把普通强稿误当高拟态
- 把“看起来像 Dan Koe”误当“学会了 Dan Koe”

本轮深化后，这批缺口资产已全部补齐。

## 二、一级核心源排序

### 第一梯队：最值得当一级核心源的文件

1. `02_素材库/writing-clone-starter-material-library/authors/dankoe/canonical/longform/20260313_dan_koe_longformwriting.md`
   - 价值：趋势宣告式开头、旧默认失效、写作即思考

2. `02_素材库/writing-clone-starter-material-library/authors/dankoe/canonical/longform/20260313_dan_koe_contentmap.md`
   - 价值：地图/拼图隐喻作为结构支架、作者即向导、路径感结尾

3. `02_素材库/writing-clone-starter-material-library/authors/dankoe/canonical/longform/20260313_dan_koe_onepersonbizlaunch.md`
   - 价值：读者困惑式进入、复杂问题极简压缩、流量入口 + 价值出口

4. `02_素材库/writing-clone-starter-material-library/authors/dankoe/canonical/longform/20260313_dan_koe_fixlife1day.md`
   - 价值：不舒服预判、身份诊断、反向愿景、生活方式先于结果

5. `02_素材库/writing-clone-starter-material-library/authors/dankoe/canonical/longform/20260313_dan_koe_intellectual-signature.md`
   - 价值：命名权、思想签名、作者差异化 worldview

### 第二梯队：更适合作为 held-out 或补强验证的文件

- `20260313_dan_koe_futureproofskills.md`
- `20260313_dan_koe_different2026.md`
- `20260313_dan_koe_articulateintelligently.md`
- `20260313_dan_koe_thought-partner-prompt.md`
- `20260313_dan_koe_life-reset-prompt.md`

这批文件的价值不是继续堆规则，而是用来检验：

- 现有规则能不能迁移
- baseline 会不会只靠公共信号逼近
- profile 是否真的学会 Dan Koe 的动作链

## 三、这次深化后，现有资产分别够什么

### 已经够的

- 做 Dan Koe 高拟态的一代正式作者 profile 雏形
- 在正文层强调动作链而不是词表
- 在验收时区分真 Dan Koe 与 Dan Koe cosplay

### 还不够的

- 完整 benchmark 系统
- 多作者横向比较
- 自动化 blind judge 流程

这些不在本次提案范围内。

---
title: "Superpowers（obra）：给编码 Agent 的「规范工作流」从构思到落地"
description: "基于 GitHub obra/superpowers 的 Agentic Skills 框架与软件开发方法论：从需求澄清、实现计划到子 Agent 执行与 TDD，让 AI 编码有条不紊。"
date: "2025-02-01"
author: "Kerwin"
tag: "Tools"
---

[Superpowers](https://github.com/obra/superpowers) 是 Jesse（obra）开源的一套 **面向编码 Agent 的软件研发工作流**：不是单次对话写代码，而是「先澄清需求 → 出设计 → 写实现计划 → 按计划执行（可子 Agent 分工）→ TDD + Code Review」。技能自动触发，无需每次手动选；支持 Claude Code、Codex、OpenCode 等。本文介绍它是什么、怎么装、怎么用。

---

## 一、它解决什么问题

**痛点**：让 AI 直接写代码，容易一上来就写、需求没对齐、没有计划、缺少测试和复查，结果要反复改。

**Superpowers 的做法**：

1. **先问清楚**：发现你在「做东西」时，不立刻写代码，而是通过对话把需求、边界、取舍问清楚（brainstorming）。
2. **拆成可读的设计**：把讨论结果整理成「设计文档」，分块给你看，方便你确认或修改。
3. **写实现计划**：设计通过后，生成一份**实现计划**：任务列表、每个任务涉及的文件、具体步骤、验收方式，像给 junior 工程师的 checklist。
4. **按计划执行**：你可以说「go」，Agent 按计划一步步做；支持**子 Agent**（每个任务起一个子 Agent 做，再审查），或分批执行、中间有人工检查点。
5. **TDD + Code Review**：实现过程中强调「先写失败测试 → 最小实现 → 通过 → 重构」；任务间可插入 Code Review，按严重程度拦问题。

整体强调 **YAGNI、DRY、真正的红绿重构 TDD**，避免过度设计和偏离需求。

---

## 二、核心工作流（技能链）

| 阶段 | 技能 | 作用 |
|------|------|------|
| 设计前 | **brainstorming** | 通过提问澄清目标、约束、替代方案，输出设计文档 |
| 设计后 | **using-git-worktrees** | 在独立分支/工作区开发，不污染主分支 |
| 实现前 | **writing-plans** | 根据设计写出可执行的实现计划（任务、文件、步骤、验证） |
| 执行 | **executing-plans** 或 **subagent-driven-development** | 按计划执行：前者分批+人工检查点，后者每任务子 Agent + 两轮审查（符合 spec → 代码质量） |
| 实现中 | **test-driven-development** | 强制先写失败测试再写实现，红→绿→重构 |
| 任务间 | **requesting-code-review** | 对照计划做 Code Review，按严重程度报告，严重问题可阻塞 |
| 收尾 | **finishing-a-development-branch** | 测试、合并/PR/保留/丢弃分支的决策与清理 |

技能会在对应场景下**自动触发**，你不需要每次输入 `/superpowers:xxx`（除非你想显式调用）。

---

## 三、安装方式

### Claude Code（插件市场）

```text
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

安装后可用 `/help` 确认是否出现 Superpowers 相关命令（如 `/superpowers:brainstorm`、`/superpowers:write-plan`、`/superpowers:execute-plan`）。

### Codex

对 Codex 说：

```text
Fetch and follow instructions from https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.codex/INSTALL.md
```

### OpenCode

对 OpenCode 说：

```text
Fetch and follow instructions from https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.opencode/INSTALL.md
```

各平台详细说明见仓库内 `docs/README.codex.md`、`docs/README.opencode.md`。

---

## 四、典型用法（Claude Code 下）

1. **需求澄清**：直接说「我想做一个 xxx」，Agent 会走 brainstorming，问你边界、用户、技术约束，最后给出设计摘要。
2. **写计划**：设计 OK 后，说「写实现计划」或触发 writing-plans，会得到带任务列表、文件路径、验证步骤的计划。
3. **执行**：说「go」或「按计划执行」，Agent 会按任务执行；若启用 subagent-driven-development，会为每个任务起子 Agent，先审「是否符合 spec」再审「代码质量」。
4. **中间复查**：任务间可要求 Code Review（requesting-code-review），根据反馈再改。
5. **收尾**：做完后走 finishing-a-development-branch，决定合并、提 PR 还是丢弃分支。

全程在对话里完成，无需切工具；计划与设计可持久化，方便后续迭代或换人接手。

---

## 五、与「直接让 AI 写代码」的对比

| 直接写 | Superpowers |
|--------|-------------|
| 容易一上来就写、需求模糊 | 先 brainstorming，再设计再计划 |
| 缺少可执行计划 | writing-plans 产出任务+文件+步骤+验证 |
| 一次大块输出、难复查 | 分任务执行，可子 Agent + Code Review |
| 测试常事后补 | TDD 技能强制先红后绿再重构 |
| 分支随意 | using-git-worktrees + finishing-a-development-branch 规范分支 |

适合：希望 AI 编码「有流程、可复盘、可协作」的团队或个人；不适合：只想快速要一段片段代码、不需要流程的场景。

---

## 六、参考

- **仓库**：[github.com/obra/superpowers](https://github.com/obra/superpowers)
- **更新**：`/plugin update superpowers`（Claude Code）
- **Issues / 讨论**：<https://github.com/obra/superpowers/issues>

如果你已经在用 Claude Code 或 OpenCode，装好 Superpowers 后，直接说「我想做 xxx」就会自动进入「问需求 → 出设计 → 写计划 → 执行」的流程，相当于给 Agent 套了一套可复用的研发规范。

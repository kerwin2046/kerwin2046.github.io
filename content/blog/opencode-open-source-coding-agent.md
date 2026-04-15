---
title: "OpenCode：开源编码 Agent，可换模型、可接 LSP、可远程驱动"
description: "基于 GitHub anomalyco/opencode 的开源 AI 编码 Agent：安装方式、内置 build/plan 双 Agent、与 Claude Code 的差异及适用场景。"
date: "2025-02-01"
author: "Kerwin"
tag: "Tools"
---

[OpenCode](https://github.com/anomalyco/opencode) 是 Anomaly 开源的 **AI 编码 Agent**：在终端里和 AI 协作写代码、跑命令、改项目，支持多模型（不绑死某一家）、内置 LSP、客户端/服务端分离可远程驱动。本文介绍它是什么、怎么装、和 Claude Code 的区别、以及何时考虑用它。

---

## 一、它是什么

- **形态**：主要在**终端 TUI** 里使用（也有 Desktop 客户端），你输入自然语言或指令，Agent 理解项目上下文后执行编辑、运行命令、读错误信息并迭代。
- **核心特点**：
  - **开源**：代码在 GitHub，可自托管、可改。
  - **模型无关**：推荐用 OpenCode Zen，但也支持 Claude、OpenAI、Google 或本地模型，方便按成本/合规切换。
  - **LSP 开箱**：和语言服务器集成，Agent 能利用符号、补全、诊断等信息。
  - **架构**：客户端/服务端分离，TUI 只是前端之一，理论上可接其他客户端（如移动端、Web）远程驱动同一台机器上的 Agent。

适合：习惯在终端里开发、希望 Agent 不依赖单一厂商、或需要自定义/自部署的人。

---

## 二、安装方式

### 一键安装（推荐）

```bash
curl -fsSL https://opencode.ai/install | bash
```

### 包管理器

```bash
# macOS / Linux (Homebrew，推荐用 tap 以获取最新版)
brew install anomalyco/tap/opencode

# npm
npm i -g opencode-ai@latest

# Windows
scoop install opencode
choco install opencode
```

安装目录优先级：`OPENCODE_INSTALL_DIR` > `XDG_BIN_DIR` > `$HOME/bin` > `$HOME/.opencode/bin`。安装后终端里执行 `opencode` 即可启动。

### Desktop 客户端（Beta）

从 [opencode.ai/download](https://opencode.ai/download) 或 GitHub Releases 下载对应平台的桌面版（macOS/Windows/Linux），适合不习惯纯 TUI 的用户。

---

## 三、两个内置 Agent

OpenCode 内置两种 Agent，用 **Tab** 切换：

| Agent | 能力 | 适用场景 |
|-------|------|----------|
| **build** | 默认；可读可写、可执行命令、改文件 | 日常开发、实现需求、修 bug |
| **plan** | 只读为主；改文件或跑命令前会询问 | 熟悉代码库、做方案分析、评估改动范围 |

另外有 **general** 子 Agent，用于复杂检索、多步推理等，在对话里可通过 `@general` 调用。

---

## 四、和 Claude Code 的差异（简要）

| 维度 | Claude Code | OpenCode |
|------|-------------|----------|
| 开源 | 否 | 是，可自部署、改代码 |
| 模型 | 绑 Claude | 可换 Claude / OpenAI / Google / 本地 |
| 界面 | 终端 TUI | 终端 TUI + Desktop Beta |
| LSP | 支持 | 开箱支持 |
| 架构 | 单进程为主 | 客户端/服务端，可远程驱动 |
| 技能/插件 | Claude 插件与技能生态 | 自有生态，可接 MCP 等 |

若你**不想被单一模型或厂商锁死**、需要**在自己的环境里跑 Agent**，或想**二次开发/集成到现有工具链**，OpenCode 更合适；若你主要用 Claude 且不想折腾环境，Claude Code 更省事。

---

## 五、典型使用方式

1. **安装并启动**：`opencode` 进入 TUI。
2. **选 Agent**：Tab 切到 build（改代码）或 plan（只读/分析）。
3. **描述任务**：用自然语言说「实现 xxx 功能」「修这个报错」「帮我看这段逻辑」等，Agent 会结合当前项目（及 LSP）给出编辑或命令建议。
4. **审查与确认**：Agent 可能给出 diff、命令，你确认后再应用；plan 模式下敏感操作会先询问。
5. **子任务**：复杂任务可交给 `@general` 或多轮对话拆解。

和 Superpowers、Awesome Claude Skills 里那些「工作流技能」不冲突：你可以在 OpenCode 里用 Claude 模型，并在对话里引用「先写计划再执行」等规范；也可以把 OpenCode 当作「执行端」，计划在别处（如 Claude.ai）写好再在本地执行。

---

## 六、参考

- **仓库**：[github.com/anomalyco/opencode](https://github.com/anomalyco/opencode)
- **官网与安装**：[opencode.ai](https://opencode.ai)
- **文档**：仓库与官网的 docs
- **社区**：Discord 等（见仓库 README）

若你已经在用 Claude Code 或 Cursor，可以把 OpenCode 当作「多一个可换模型、可自托管」的编码 Agent 选项；配合本博客里的 [Superpowers](/blog/superpowers-obra-agentic-workflow)、[Awesome Claude Skills](/blog/awesome-claude-skills-curated-list) 文章，可以搭出一套「设计 → 计划 → 执行」都在 AI 辅助下的工作流。

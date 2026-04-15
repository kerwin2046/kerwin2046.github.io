---
title: "Awesome Claude Skills：一份实用的 Claude 技能清单与使用方式"
description: "基于 GitHub ComposioHQ/awesome-claude-skills 的 Claude Skills 精选列表：文档处理、开发工具、写作协作、创意媒体等分类与入门步骤。"
date: "2025-01-31"
author: "Kerwin"
tag: "Resources"
---

[Awesome Claude Skills](https://github.com/ComposioHQ/awesome-claude-skills) 是 Composio 维护的一份 **Claude Skills 精选列表**：按场景分类（文档、开发、写作、创意、协作等），每个技能有简短说明和链接，方便在 Claude.ai、Claude Code、Claude API 里选用或组合。本文介绍这份列表的结构、怎么用、以及几类常见技能。

---

## 一、Claude Skills 是什么

**Claude Skills** 是可配置的「工作流」或「能力包」：教会 Claude 在特定任务下按固定步骤、规则或工具来执行，并在 Claude.ai、Claude Code、Claude API 之间通用。一旦配置好，Claude 会在相关对话中自动激活对应技能，无需每次重新说明。

Awesome Claude Skills 不做技能本身，而是** curation**：把社区里好用的技能按类别整理，附上仓库/插件链接，方便你「按需挑选、安装、组合」。

---

## 二、列表里有哪些类别（概览）

根据仓库 README，大致包括：

| 类别 | 举例 |
|------|------|
| **Document Processing** | docx / pdf / pptx / xlsx 的读写与处理；Markdown 转 EPUB |
| **Development & Code** | artifacts-builder（Claude 里做多组件 HTML 作品）、Changelog Generator、TDD、git worktrees、MCP Builder、Webapp Testing、Connect（连 Gmail/Slack/GitHub 等） |
| **Data & Analysis** | CSV 汇总、deep-research、postgres 只读查询、root-cause-tracing |
| **Business & Marketing** | Brand Guidelines、Competitive Ads Extractor、Domain Name Brainstormer、Lead Research Assistant |
| **Communication & Writing** | brainstorming、Content Research Writer、Meeting Insights Analyzer、Twitter Algorithm Optimizer |
| **Creative & Media** | Canvas Design、imagen（Gemini 生图）、Image Enhancer、Slack GIF Creator、Theme Factory、Video Downloader |
| **Productivity & Organization** | File Organizer、Invoice Organizer、Raffle Winner Picker、Tailored Resume Generator |
| **Collaboration & PM** | git-pushing、review-implementing、outline（Outline 维基）、test-fixing |
| **Security & Systems** | computer-forensics、file-deletion、metadata-extraction、threat-hunting-with-sigma-rules |

每类下列出多个技能，点进链接可看到安装方式（Claude.ai 技能市场、Claude Code 插件目录、或 API 的 skill id）。

---

## 三、怎么用这份列表

### 在 Claude.ai

1. 打开聊天界面里的「技能」入口（如 🧩）。
2. 从技能市场搜索，或按 Awesome 列表里的名字/链接找到对应技能并添加。
3. 对话时 Claude 会根据任务自动选用已启用的技能。

### 在 Claude Code

1. 把技能放到 `~/.config/claude-code/skills/`（或你当前用的技能目录）。
2. 可从 Awesome 里点进具体技能仓库，按该仓库的「Claude Code」说明复制/克隆到上述目录。
3. 重启或重载 Claude Code，技能会按规则自动触发。

### 通过 Claude API

部分技能支持通过 API 的 `skills` 参数传入 skill id，在请求里挂载对应能力；具体见 [Claude Skills API 文档](https://docs.anthropic.com/) 与各技能说明。

---

## 四、几类值得先看的技能

- **开发流程**：若你希望「先设计再计划再执行」，可配合 [Superpowers](https://github.com/obra/superpowers)（见本博客另一篇 [Superpowers 介绍](/blog/superpowers-obra-agentic-workflow)）；若要做 UI/设计系统，可看 [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)。
- **文档与写作**：docx/pdf/pptx/xlsx 类适合需要处理 Office 或幻灯片的场景；Content Research Writer、Meeting Insights Analyzer 适合长文与会议纪要。
- **创意与媒体**：Canvas Design、Theme Factory、Image Enhancer、Slack GIF Creator 等适合做视觉与动效。
- **连接外部应用**：Connect（Composio 的 connect-apps）可把 Claude 接到 Gmail、Slack、GitHub、Notion 等，实现「在对话里发邮件、建 Issue、发消息」等操作。

---

## 五、贡献与维护

Awesome Claude Skills 接受社区 PR：新技能可按仓库的 CONTRIBUTING 说明提交，需符合结构模板、有清晰描述与使用方式。列表会持续更新，适合当作「选技能」的入口定期翻一翻。

---

## 六、参考

- **仓库**：[github.com/ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills)
- **Claude 官方**：Skills 概述、使用指南、创建自定义技能等见 Anthropic 文档与 [Agent Skills 相关博文](https://www.anthropic.com/news)。

把 Awesome Claude Skills 当目录用，按场景挑几项装上，再配合 Superpowers、UI UX Pro Max 等「工作流型」技能，可以让 Claude 在编码、写作、协作上的行为更稳定、可复用。

---
title: "用 UI UX Pro Max Skill 做专业 UI/UX：从安装到落地的完整构建过程"
description: "基于 GitHub 上 nextlevelbuilder/ui-ux-pro-max-skill 的 AI 设计技能，从安装、设计系统生成到多平台落地的全流程实践。"
date: "2025-01-28"
author: "Kerwin"
tag: "Tools"
---

[UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) 是一个面向 AI 助手的 **设计智能技能**：根据你的产品类型和需求，自动推荐风格、配色、字体、落地页结构，并生成可落地的设计系统。本文从安装到实际构建，按步骤说明如何在 Cursor / Claude 等环境中用好它。

---

## 一、它是什么、能解决什么

**定位**：给 AI（Claude、Cursor、Windsurf、Copilot 等）用的「设计智库」，不是独立设计工具。

**能力概览：**

- **设计系统生成（v2.0 核心）**：输入产品/行业关键词（如「beauty spa」「fintech banking」），通过多域检索 + 推理引擎，输出完整设计系统（Pattern、Style、Colors、Typography、Effects、Anti-patterns、预交付清单）。
- **100+ 行业推理规则**：SaaS、金融、医疗、电商、创意、Web3 等，每个类别有推荐结构、风格优先级、色彩情绪、字体、动效、以及不建议做的反模式（例如银行类避免 AI 紫/粉渐变）。
- **67 种 UI 风格**：Glassmorphism、Neumorphism、Brutalism、Bento Grid、Dark Mode、AI-Native UI、Soft UI Evolution、Neubrutalism 等。
- **96 套配色、57 组字体搭配、25 种图表类型**：按行业和场景推荐。

**适用场景**：落地页、SaaS 仪表盘、移动端 UI、作品集、金融/医疗等垂直产品；支持 HTML+Tailwind、React、Next.js、shadcn/ui、Vue、Nuxt、Svelte、Astro、SwiftUI、Flutter 等。

---

## 二、安装方式（推荐 CLI）

### 1. 安装 CLI

```bash
npm install -g uipro-cli
```

### 2. 在项目里为当前 AI 助手安装技能

进入你的项目根目录后执行（按你用的助手选一个）：

```bash
cd /path/to/your/project

uipro init --ai cursor      # Cursor
uipro init --ai claude     # Claude Code
uipro init --ai windsurf   # Windsurf
uipro init --ai copilot    # GitHub Copilot
uipro init --ai all        # 为上述全部安装
```

安装完成后，会在项目下生成对应平台的技能目录（如 Cursor 的 `.cursor/skills/` 或 Claude 的 `.claude/skills/`），AI 在做 UI/UX 相关任务时会自动加载这些规则。

### 3. 可选：从 Claude 插件市场安装

在 Claude Code 中也可以直接通过插件市场安装：

```text
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

---

## 三、前置条件：Python 3.x

设计系统生成和部分检索脚本依赖 Python 3.x。若未安装：

- **macOS**：`brew install python3`
- **Ubuntu/Debian**：`sudo apt update && sudo apt install python3`
- **Windows**：`winget install Python.Python.3.12`

安装后可用 `python3 --version` 确认。

---

## 四、日常使用方式

### 1. 技能模式（自动触发）

在 **Cursor、Claude Code、Windsurf** 等支持技能自动触发的环境中，直接自然语言描述 UI 需求即可，例如：

- 「帮我做一个 SaaS 产品的落地页」
- 「做一个医疗健康类的数据看板」
- 「做一个深色主题的金融类 App 界面」

AI 会按技能里的规则做多域检索和推理，先给出设计系统建议（风格、配色、字体、结构、反模式），再生成或调整代码。

### 2. 工作流模式（斜杠命令）

在 **Kiro、GitHub Copilot、Roo Code** 等使用斜杠命令的环境中可以显式调用，例如：

```text
/ui-ux-pro-max 为我的美容 Spa 做一个落地页
```

### 3. 直接生成设计系统（进阶）

在已通过 CLI 安装技能的项目里，设计系统相关脚本通常在 `.cursor/skills/ui-ux-pro-max/` 或 `.claude/skills/ui-ux-pro-max/` 下。可直接用 Python 生成设计系统（ASCII 或 Markdown）：

```bash
# 为「Serenity Spa」生成设计系统（ASCII 输出）
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "beauty spa wellness" --design-system -p "Serenity Spa"

# Markdown 输出，便于放进文档或给 AI 当上下文
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "fintech banking" --design-system -f markdown

# 按领域检索：风格 / 字体 / 图表等
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "glassmorphism" --domain style
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "elegant serif" --domain typography
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "dashboard" --domain chart
```

生成结果会包含：推荐 Pattern（如 Hero-Centric + Social Proof）、Style（如 Soft UI Evolution）、主色/辅色/CTA/背景/文字、字体组合、关键效果、需避免的反模式、以及预交付清单（无 emoji 图标、可点击元素 cursor-pointer、hover 过渡、对比度、焦点状态、响应式断点等）。

---

## 五、持久化设计系统（Master + 页面覆盖）

适合中大型项目：先有一份全局设计系统，再为关键页面做覆盖。

```bash
# 生成并写入 design-system/MASTER.md
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "SaaS dashboard" --design-system --persist -p "MyApp"

# 为「dashboard」页单独生成覆盖规则，写入 design-system/pages/dashboard.md
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "SaaS dashboard" --design-system --persist -p "MyApp" --page "dashboard"
```

目录结构示例：

```text
design-system/
├── MASTER.md           # 全局：色彩、字体、间距、组件约定
└── pages/
    └── dashboard.md    # 仅 dashboard 页与 Master 的差异
```

协作时可约定：做某一页时先读 `MASTER.md`，再检查是否存在 `pages/[页面名].md`，若有则优先采用页面级规则，否则只用 Master。这样 AI 生成或人工修改都有统一依据。

---

## 六、构建流程小结（从想法到上线）

1. **安装**：`npm i -g uipro-cli` → 进入项目 → `uipro init --ai cursor`（或你用的助手）。
2. **提需求**：用自然语言描述产品类型、行业、风格偏好（如「医疗」「深色」「仪表盘」）。
3. **设计系统**：AI 按技能自动做多域检索与推理，给出 Pattern + Style + Colors + Typography + Effects + Anti-patterns；需要时可手动跑 `search.py --design-system --persist` 固化到 `design-system/`。
4. **生成/修改代码**：在 Cursor/Claude 中基于上述设计系统生成或迭代组件、页面；可指定技术栈（Next.js、shadcn/ui、Tailwind 等）。
5. **预交付检查**：对照技能输出的清单（对比度、焦点、减少动效、响应式、无 emoji 图标等）做一轮自查。

---

## 七、参考与延伸

- **仓库**：[nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- **文档与能力概览**：README 中的 67 种风格表、行业规则表、Design System Generator 流程图和示例输出，建议通读一遍以便在提示词里更精准地描述需求。
- **版本**：`uipro versions` 查看可用版本，`uipro update` 更新到最新；安装后尽量用 CLI 做初始化，以保证目录和模板与当前版本一致。

如果你已经在用 Cursor 或 Claude 做前端，把 UI UX Pro Max 接进项目后，可以让「从需求到设计系统再到代码」这一段更系统、少踩坑；配合本博客里另一篇 [Remotion 使用指南](/blog/remotion-dev-guide)，还可以在设计规范稳定的前提下，用程序化视频做动效与宣传片段。

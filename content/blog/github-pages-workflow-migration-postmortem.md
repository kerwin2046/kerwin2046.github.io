---
title: "GitHub Pages 部署故障复盘：从 gh-pages 分支切到官方 Actions 工作流"
description: "一次 GitHub Pages 部署失败的定位与修复：为什么旧的 gh-pages 推送方案容易出问题，如何迁移到 upload-pages-artifact + deploy-pages 官方流程。"
date: "2026-04-16"
author: "Kerwin"
tag: "Tools"
---

最近这次站点部署失败，问题不在业务代码，而在 **GitHub Pages 的发布链路**。原流程是：CI 构建静态文件后，用第三方 Action 推送到 `gh-pages` 分支，再由 Pages 从该分支发布。这个方案早期很常见，但现在在权限策略、仓库默认设置、分支配置稍有变化时，就容易出现“看起来构建成功、实际没发布”或“工作流触发了但没有部署结果”的问题。

这次修复的核心思路很简单：**不再维护分支发布细节，改用 GitHub 官方 Pages 工作流**。也就是构建完成后上传产物，再由官方部署 Action 接管发布。这样做的好处是：依赖更少、权限边界更清晰、与 GitHub 当前推荐路径一致，后续维护成本更低。

---

## 一、故障现象

- 站点部署链路不稳定，容易出现“工作流跑了但页面没更新”。
- 原 workflow 强依赖 `gh-pages` 分支推送权限与分支发布设置。
- 当仓库权限策略或 Pages Source 配置变化时，部署容易失效。

从结果看，这是一个典型的“流程配置债务”问题：旧方案不是不能用，但在当前平台演进下，鲁棒性变差。

---

## 二、根因分析

根因不在 Next.js 构建本身，而在发布方式：

1. **发布模式偏旧**：依赖 `gh-pages` 分支推送，配置项多，耦合仓库设置。
2. **权限模型脆弱**：旧流程需要 `contents: write`，且受 Actions 权限开关影响明显。
3. **平台推荐路径变化**：GitHub Pages 现在更推荐 `upload-pages-artifact` + `deploy-pages`，即“上传构建产物 + 官方托管部署”。

换句话说，问题不是单点语法错误，而是工作流架构与平台最佳实践不一致。

---

## 三、修复方案（已落地）

这次改动集中在 `.github/workflows/pages.yml`：

- 触发分支改为 `main, master`，避免默认分支差异导致不触发。
- 权限改为官方 Pages 所需最小集合：
  - `contents: read`
  - `pages: write`
  - `id-token: write`
- 构建 Job 中保留 Next.js 导出逻辑（`EXPORT=1`、`BASE_PATH`）。
- 使用 `actions/upload-pages-artifact@v3` 上传 `out` 目录。
- 新增 `deploy` Job，使用 `actions/deploy-pages@v4` 完成发布。
- 去掉第三方 `gh-pages` 分支推送步骤，减少分支与权限耦合。

这类迁移的关键是：**把“发布实现细节”交给官方 Action，而不是自己维护分支发布状态机**。

---

## 四、需要同步的仓库设置

代码改完后，还需要在仓库里确认一项：

- `Settings -> Pages -> Source` 选择 **GitHub Actions**

如果这里仍是 `Deploy from a branch`，新工作流即使成功也可能无法按预期生效。

---

## 五、经验沉淀（可复用清单）

以后排查 Pages 部署问题，我会先看这 5 项：

1. 触发分支是否覆盖当前默认分支。
2. workflow 权限是否包含 `pages: write` 与 `id-token: write`。
3. Pages Source 是否为 `GitHub Actions`。
4. 构建产物目录是否正确（本项目为 `out`）。
5. 是否还在依赖历史 `gh-pages` 推送方案。

这次修复的价值不只是“把一次故障修好”，而是把部署链路升级到更稳定、可维护的默认路径。对个人站点来说，这比一次性修补更值得。

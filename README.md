# outline-blog

Personal portfolio and blog built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS**. Supports i18n (English / 中文), Markdown-driven blog, and one-command deploy to your own server.

---

## Features

- **Portfolio** — Hero, About, Services, Portfolio, Experience (career evolution), Testimonials, Articles
- **Blog** — Markdown posts in `content/blog/` with frontmatter (title, description, date, author, tag); GFM tables & code blocks; cover image fallback per slug (Picsum) or custom `image`
- **i18n** — `next-intl` for English (default) and 中文; locale in path `/[locale]/...`; language switcher in nav
- **Deploy** — GitHub Actions CI/CD: push to `main` → build → rsync to your server → PM2 restart ([docs/DEPLOY.md](docs/DEPLOY.md))

---

## Tech Stack

- **Framework** — Next.js 15 (App Router)
- **UI** — React 19, Tailwind CSS 4, Radix UI, Lucide icons
- **i18n** — next-intl
- **Blog** — gray-matter, react-markdown, remark-gfm
- **Package manager** — pnpm

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm i -g pnpm`)

### Install & Run

```bash
# Install dependencies
pnpm install

# Development (http://localhost:3000)
pnpm dev

# Production build
pnpm build
pnpm start

# Lint
pnpm lint
```

Default locale is English; append `/zh` for 中文 (e.g. `http://localhost:3000/zh`).

### 开发 / 生产环境

- **开发**：`pnpm dev` 会加载 `.env.development`（以及 `.env.local` 若存在）。
- **生产**：`pnpm build` / `pnpm start` 会加载 `.env.production`。
- 代码中可用 `process.env.NEXT_PUBLIC_APP_ENV` 区分 `development` / `production`。
- 本地密钥等放在 `.env.local`（已 gitignore）；参考 `.env.example` 添加变量。

---

## Project Structure

```
├── app/[locale]/          # Locale-aware routes (home, blog list, blog post)
├── components/            # layout (nav, footer, theme), sections, ui
├── content/blog/         # Markdown posts (.md)
├── config/               # site config (name, links, etc.)
├── i18n/                 # next-intl routing & request config
├── lib/                  # blog loader, utils
├── messages/             # en.json, zh.json
├── public/               # static assets, images
├── docs/                 # DEPLOY.md, BLOG-COVERS.md, etc.
├── .github/workflows/    # deploy.yml (CI/CD)
└── next.config.mjs       # next-intl, standalone output for deploy
```

---

## Blog

- **Add a post** — Create `content/blog/your-slug.md` with frontmatter:

```yaml
---
title: "Your Title"
description: "Short description"
date: "2024-01-15"
author: "Kerwin"
tag: "Frontend"
---
```

- **Cover image** — Omit `image` to use a unique Picsum image per slug, or set `image: "/images/your-cover.png"` for a custom cover.
- **AI-generated covers** — See [docs/BLOG-COVERS.md](docs/BLOG-COVERS.md) and `scripts/generate-blog-covers.mjs` (OpenAI DALL·E).

---

## Deploy to Your Server

1. In the repo **Settings → Secrets and variables → Actions**, add:
   - `DEPLOY_HOST` — Server IP or hostname
   - `DEPLOY_USER` — SSH user
   - `DEPLOY_SSH_KEY` — SSH private key (full content)
   - `DEPLOY_PATH` — Absolute path on server (e.g. `/var/www/paperfolio`)

2. On the server: install Node 18+, PM2, create `DEPLOY_PATH`, and allow SSH key login.

3. Push to `main`; the workflow builds, syncs the standalone output, and runs `pm2 restart paperfolio`.

Full steps: [docs/DEPLOY.md](docs/DEPLOY.md).

---

## Config

- **Site** — `config/site.ts` (name, description, author, links)
- **Copy** — `messages/en.json`, `messages/zh.json`

---

## License

MIT

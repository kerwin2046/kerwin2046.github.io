#!/usr/bin/env node
/**
 * Generate blog cover images using OpenAI DALL·E 3.
 * Requires: OPENAI_API_KEY
 * Usage: node scripts/generate-blog-covers.mjs [--dry-run] [--slug=xxx]
 *
 * Output: public/images/article-{slug}.png
 * Then add to frontmatter: image: "/images/article-{slug}.png"
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, "..")
const BLOG_DIR = path.join(ROOT, "content/blog")
const OUT_DIR = path.join(ROOT, "public/images")

const apiKey = process.env.OPENAI_API_KEY
const dryRun = process.argv.includes("--dry-run")
const slugFilter = process.argv.find((a) => a.startsWith("--slug="))?.slice("--slug=".length)

if (!apiKey && !dryRun) {
  console.error("Set OPENAI_API_KEY or use --dry-run to only print prompts.")
  process.exit(1)
}

function getSlugFromFilename(filename) {
  return filename.replace(/\.mdx?$/, "")
}

function parseFrontmatter(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8")
  const match = raw.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return null
  const front = match[1]
  const data = {}
  for (const line of front.split("\n")) {
    const m = line.match(/^(\w+):\s*(.*)$/)
    if (m) data[m[1]] = m[2].replace(/^["']|["']$/g, "").trim()
  }
  return data
}

function getPosts() {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => {
      const slug = getSlugFromFilename(f)
      const data = parseFrontmatter(path.join(BLOG_DIR, f))
      return { slug, title: data?.title ?? slug, description: data?.description ?? "" }
    })
    .filter((p) => !slugFilter || p.slug === slugFilter)
}

async function generateImage(prompt) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1792x1024",
      quality: "standard",
      response_format: "url",
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenAI API error: ${res.status} ${err}`)
  }
  const json = await res.json()
  return json.data?.[0]?.url
}

async function downloadToFile(url, filePath) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download failed: ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, buf)
}

function buildPrompt(title, description) {
  const theme = [title, description].filter(Boolean).join(". ").slice(0, 200)
  return `Minimalist, modern blog cover image. No text, no words. Theme or mood: ${theme}. Style: clean, professional, abstract or subtle illustration, suitable for a tech blog. 16:9 aspect.`
}

async function main() {
  const posts = getPosts()
  console.log(`Found ${posts.length} post(s). Dry run: ${dryRun}\n`)

  for (const post of posts) {
    const prompt = buildPrompt(post.title, post.description)
    console.log(`[${post.slug}] ${post.title}`)
    console.log(`  Prompt: ${prompt.slice(0, 80)}...`)

    if (dryRun) {
      console.log(`  -> Would save: public/images/article-${post.slug}.png\n`)
      continue
    }

    try {
      const url = await generateImage(prompt)
      const outPath = path.join(OUT_DIR, `article-${post.slug}.png`)
      await downloadToFile(url, outPath)
      console.log(`  -> Saved: public/images/article-${post.slug}.png`)
      console.log(`  Add to frontmatter: image: "/images/article-${post.slug}.png"\n`)
    } catch (e) {
      console.error(`  Error: ${e.message}\n`)
    }
  }
}

main()

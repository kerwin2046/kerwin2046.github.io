import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import type { Post, PostMeta } from "@/types"

const BLOG_DIR = path.join(process.cwd(), "content/blog")

function getSlugFromFilename(filename: string): string {
  return filename.replace(/\.mdx?$/, "")
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs.readdirSync(BLOG_DIR).filter((f) => /\.mdx?$/.test(f)).map(getSlugFromFilename)
}

export function getPostBySlug(slug: string): Post | null {
  for (const ext of [".md", ".mdx"]) {
    const filePath = path.join(BLOG_DIR, `${slug}${ext}`)
    if (!fs.existsSync(filePath)) continue
    const raw = fs.readFileSync(filePath, "utf-8")
    const { data, content } = matter(raw)
    return {
      slug,
      title: data.title ?? slug,
      description: data.description ?? "",
      date: data.date ?? "",
      author: data.author ?? "Kerwin",
      image: data.image,
      tag: data.tag,
      content,
    }
  }
  return null
}

export function getPosts(limit?: number): PostMeta[] {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is Post => p !== null)
    .map(({ content: _, ...meta }) => meta)
    .sort((a, b) => (b.date > a.date ? 1 : -1))
  return limit ? posts.slice(0, limit) : posts
}

export function getCategories(): string[] {
  const posts = getPosts()
  const categories = new Set<string>()
  posts.forEach((post) => {
    if (post.tag) {
      categories.add(post.tag)
    }
  })
  return Array.from(categories).sort()
}

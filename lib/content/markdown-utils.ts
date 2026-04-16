export interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[`~!@#$%^&*()+={}\[\]|\\:;"'<>,.?/]/g, "")
    .replace(/\s+/g, "-")
}

export function extractTocFromMarkdown(markdown: string): TocItem[] {
  const lines = markdown.split("\n")
  const toc: TocItem[] = []
  let inCodeFence = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith("```")) {
      inCodeFence = !inCodeFence
      continue
    }
    if (inCodeFence) continue

    const match = /^(#{2,3})\s+(.+)$/.exec(trimmed)
    if (!match) continue

    const level = match[1].length as 2 | 3
    const text = match[2].replace(/\[(.*?)\]\(.*?\)/g, "$1").trim()
    const id = slugifyHeading(text)
    if (!id) continue
    toc.push({ id, text, level })
  }

  return toc
}

export function estimateReadingMinutes(markdown: string): number {
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[#>*_-]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

  return Math.max(1, Math.ceil(words / 220))
}

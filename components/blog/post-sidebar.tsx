import { Link } from "@/i18n/navigation"
import type { PostMeta } from "@/types"

interface PostSidebarProps {
  posts: PostMeta[]
  activeSlug: string
  locale: string
}

function getYear(date: string): string {
  const match = /^(\d{4})/.exec(date.trim())
  return match?.[1] ?? "Other"
}

export function PostSidebar({ posts, activeSlug, locale }: PostSidebarProps) {
  const recentPosts = posts.slice(0, 12)
  const groups = new Map<string, PostMeta[]>()

  for (const post of posts) {
    const year = getYear(post.date)
    const existing = groups.get(year)
    if (existing) {
      existing.push(post)
    } else {
      groups.set(year, [post])
    }
  }

  const years = Array.from(groups.keys()).sort((a, b) => (a < b ? 1 : -1))
  const labels =
    locale === "zh"
      ? { recent: "最近文章", byYear: "按年份浏览" }
      : { recent: "Recent posts", byYear: "Browse by year" }

  return (
    <aside className="hidden 2xl:block 2xl:w-72 shrink-0">
      <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-xl border border-black/10 bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-[#0B0B0B]">{labels.recent}</p>
        <ul className="space-y-1.5 pb-4">
          {recentPosts.map((post) => {
            const isActive = post.slug === activeSlug
            return (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className={[
                    "block rounded-md px-2 py-1.5 text-sm leading-6 transition-colors",
                    isActive ? "bg-[#EEF2FF] text-[#4338CA] font-medium" : "text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#111827]",
                  ].join(" ")}
                >
                  {post.title}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mt-1 border-t border-black/10 pt-4">
          <p className="mb-3 text-sm font-semibold text-[#0B0B0B]">{labels.byYear}</p>
          <div className="space-y-3">
            {years.map((year) => {
              const yearPosts = groups.get(year) ?? []
              return (
                <section key={year}>
                  <p className="mb-1 text-sm font-semibold text-[#1F2937]">{year}</p>
                  <ul className="space-y-1">
                    {yearPosts.map((post) => {
                      const isActive = post.slug === activeSlug
                      return (
                        <li key={post.slug}>
                          <Link
                            href={`/blog/${post.slug}`}
                            className={[
                              "line-clamp-2 block rounded-md px-2 py-1 text-xs leading-5 transition-colors",
                              isActive ? "bg-[#EEF2FF] text-[#4338CA] font-medium" : "text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]",
                            ].join(" ")}
                          >
                            {post.title}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </section>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}

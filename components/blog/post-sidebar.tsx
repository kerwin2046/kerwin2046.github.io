"use client"

import { useLocale } from "next-intl"
import { Link } from "@/i18n/navigation"
import type { PostMeta } from "@/types"
import { HandStar } from "@/components/ui/scrapbook-decorations"

interface PostSidebarProps {
  posts: PostMeta[]
  activeSlug: string
  locale: string
}

export function PostSidebar({ posts, activeSlug, locale }: PostSidebarProps) {
  // Slice to get top 6 recent posts
  const recentPosts = posts.slice(0, 6)

  // Safely format dates
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    const parts = dateStr.split("-")
    if (parts.length < 3) return dateStr
    const [_, month, day] = parts
    const monthsEN: Record<string, string> = {
      "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun",
      "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
    }
    const monthsZH: Record<string, string> = {
      "01": "1月", "02": "2月", "03": "3月", "04": "4月", "05": "5月", "06": "6月",
      "07": "7月", "08": "8月", "09": "9月", "10": "10月", "11": "11月", "12": "12月"
    }

    if (locale === "zh") {
      return `${monthsZH[month] || month}${day}日`
    }
    return `${monthsEN[month] || month} ${day}`
  }

  return (
    <aside className="hidden xl:block xl:w-60 2xl:w-72 shrink-0 sticky top-28 max-h-[calc(100vh-8rem)] select-none">
      <div className="relative pl-6">
        {/* Header "Recent posts" with orange highlight line underneath */}
        <div className="relative mb-8 inline-block">
          <p className="text-[17px] font-black tracking-tight text-gray-900 font-sans">
            {locale === "zh" ? "近期发布" : "Recent posts"}
          </p>
          {/* Highlighter accent - matching orange doodle underline */}
          <div className="h-[3px] w-[110%] bg-[#FDB927]/95 absolute bottom-[-2px] left-[-5%] -z-10 rounded-full" />
        </div>

        {/* Sidebar posts list */}
        <div className="relative">
          {/* Dotted link chain vertical line */}
          <div className="absolute left-[-16px] top-2.5 bottom-12 w-[2px] border-l-2 border-dotted border-black/25" />

          <ul className="space-y-6">
            {recentPosts.map((post) => {
              const isActive = post.slug === activeSlug
              return (
                <li key={post.slug} className="relative">
                  {/* Active Bullet Anchor: Perfectly optically aligned at center of dotted line */}
                  {isActive && (
                    <div className="absolute left-[-23px] top-2 w-3.5 h-3.5 bg-[#1F1F1F] rounded-full border-[2.5px] border-[#F4F1EA] shadow-[0_0_0_2.5px_rgba(0,0,0,1)] z-10 animate-pulse" />
                  )}

                  <Link
                    href={`/blog/${post.slug}`}
                    className={`block group transition-colors text-left`}
                  >
                    <h4
                      className={`text-sm leading-snug font-bold ${
                        isActive
                          ? "text-black underline decoration-2 decoration-black/30 underline-offset-2"
                          : "text-gray-700 hover:text-black hover:underline hover:decoration-black/15 hover:underline-offset-2"
                      }`}
                    >
                      {post.title}
                    </h4>
                    <span className="block text-[11px] font-sans font-bold text-[#C84B31] mt-1.5">
                      {post.date}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* View all posts hand-drawn CTA */}
        <div className="mt-8 pt-4 border-t-2 border-dashed border-black/10 text-left">
          <Link
            href="/blog"
            className="font-gloria text-base font-bold text-blue-600 hover:text-blue-800 transition-colors inline-flex flex-col relative py-0.5"
          >
            <span className="flex items-center gap-1.5">
              <span>{locale === "zh" ? "➔ 阅读所有文章" : "➔ View all posts"}</span>
            </span>
            {/* Hand scribble underline */}
            <svg
              viewBox="0 0 100 12"
              preserveAspectRatio="none"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              className="w-full h-2 text-blue-500/40 -mt-0.5"
            >
              <path d="M4 8c12-2 28-3.5 45-4c15-0.5 25 1 32 3.5" />
            </svg>
          </Link>
        </div>
      </div>
    </aside>
  )
}

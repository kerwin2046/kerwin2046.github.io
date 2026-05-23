"use client"

import { useState } from "react"
import Image from "next/image"
import { Link, usePathname } from "@/i18n/navigation"
import { useTranslations, useLocale } from "next-intl"
import { CategoryFilter } from "./category-filter"
import type { PostMeta } from "@/types"
import { DuctTape, ScotchTape } from "@/components/ui/scrapbook-decorations"

interface BlogListProps {
  posts: PostMeta[]
  categories: string[]
}

export function BlogList({ posts: initialPosts, categories }: BlogListProps) {
  const [filteredPosts, setFilteredPosts] = useState<PostMeta[]>(initialPosts)
  const t = useTranslations("blog")
  const locale = useLocale()

  // Safely format dates to prevent timezone/SSR mismatch
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

  // Get alternating rotation styles for cards
  const getCardRotationClass = (idx: number) => {
    const rotations = ["rotate-[0.5deg]", "-rotate-[0.8deg]", "rotate-[-0.3deg]", "rotate-[1deg]"]
    return rotations[idx % rotations.length]
  }

  // Get alternating rotation styles for photos
  const getPhotoRotationClass = (idx: number) => {
    const rotations = ["-rotate-1.5", "rotate-2", "-rotate-[1deg]", "rotate-[1.5deg]"]
    return rotations[idx % rotations.length]
  }

  return (
    <>
      <CategoryFilter
        categories={categories}
        posts={initialPosts}
        onFilterChange={setFilteredPosts}
        translationKey="blog"
      />

      {filteredPosts.length === 0 ? (
        <p className="text-gray-500 font-mono text-center py-12 select-none">{t("noPosts")}</p>
      ) : (
        <ul className="space-y-12">
          {filteredPosts.map((post, idx) => {
            const coverSrc =
              post.image ||
              `https://picsum.photos/seed/${encodeURIComponent(post.slug)}/800/450`

            // Alternate image left/right in scrapbook grid for dynamic, non-uniform layout
            const isImageRight = idx % 2 === 1

            return (
              <li key={post.slug} className={`list-none ${getCardRotationClass(idx)}`}>
                <div className="relative group bg-[#FAFAF8] border-2 border-black rounded-2xl p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all duration-300">
                  {/* Decorative tape pinning the card to the zine page */}
                  <div className="absolute top-[-15px] left-[15%] pointer-events-none select-none">
                    <DuctTape className="bg-amber-600/90 text-[9px] px-3.5 shadow-[1px_2px_4px_rgba(0,0,0,0.1)]">
                      {locale === "zh" ? "博客笔记" : "FIELD NOTE"}
                    </DuctTape>
                  </div>

                  <div className={`flex flex-col ${isImageRight ? "lg:flex-row-reverse" : "lg:flex-row"} gap-6 md:gap-8 items-stretch`}>
                    {/* Polaroid-style photo container */}
                    <div className={`shrink-0 self-center lg:self-stretch ${getPhotoRotationClass(idx)} relative select-none`}>
                      {/* Shadows and white photopaper border */}
                      <div className="relative bg-white border border-black/10 p-3 pb-8 rounded-xl shadow-[2px_3px_8px_rgba(0,0,0,0.06)] max-w-full sm:w-80 aspect-[4/3] lg:h-full lg:aspect-auto flex flex-col">
                        {/* Scotch tape on top corners of the photo */}
                        <ScotchTape className="top-[-8px] left-6 -rotate-12" />
                        <ScotchTape className="top-[-6px] right-6 rotate-12" />

                        <div className="relative flex-1 bg-[#EDEDED] border-[2px] border-black rounded-lg overflow-hidden min-h-[160px] sm:min-h-[180px]">
                          <Image
                            src={coverSrc}
                            alt={post.title}
                            fill
                            className="object-cover filter contrast-[1.01] sepia-[0.03] group-hover:scale-[1.03] transition-transform duration-300"
                            sizes="(max-width: 640px) 100vw, 320px"
                            priority={idx < 2}
                          />

                          {/* Categorized hand-drawn ribbon badge */}
                          {post.tag && (
                            <div className="absolute top-2.5 right-2.5">
                              <DuctTape className="bg-[#1A1A1A] text-[9px] tracking-wider px-2 py-1 rotate-[3deg] shadow-[1px_2px_4px_rgba(0,0,0,0.12)]">
                                {post.tag}
                              </DuctTape>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Blog Card Content area */}
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div className="space-y-3">
                        <Link href={`/blog/${post.slug}`} className="block group/title select-none">
                          <h2 className="text-xl md:text-2xl font-black text-gray-900 group-hover/title:text-blue-600 transition-colors leading-tight tracking-tight">
                            {post.title}
                          </h2>
                          {/* Hover hand-drawn under-stroke effect */}
                          <div className="h-[2px] w-0 bg-blue-600/30 group-hover/title:w-full transition-all duration-300 mt-1" />
                        </Link>

                        <p className="text-gray-700 text-sm md:text-base leading-relaxed line-clamp-3">
                          {post.description}
                        </p>
                      </div>

                      {/* Card Metadata Footer */}
                      <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-200 flex flex-wrap items-center justify-between gap-4 font-mono select-none">
                        <div className="font-typewriter text-xs text-gray-400 font-bold">
                          {post.author} · <span className="text-gray-500">{formatDate(post.date)}</span>
                        </div>

                        <Link
                          href={`/blog/${post.slug}`}
                          className="font-gloria text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1.5 py-0.5"
                        >
                          <span>{locale === "zh" ? "阅读全文" : "Read more"}</span>
                          <span className="text-xs transition-transform group-hover:translate-x-1">➔</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}

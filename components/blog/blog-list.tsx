"use client"

import { useState } from "react"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { CategoryFilter } from "./category-filter"
import type { PostMeta } from "@/types"

interface BlogListProps {
  posts: PostMeta[]
  categories: string[]
}

export function BlogList({ posts: initialPosts, categories }: BlogListProps) {
  const [filteredPosts, setFilteredPosts] = useState<PostMeta[]>(initialPosts)
  const t = useTranslations("blog")

  return (
    <>
      <CategoryFilter
        categories={categories}
        posts={initialPosts}
        onFilterChange={setFilteredPosts}
        translationKey="blog"
      />

      {filteredPosts.length === 0 ? (
        <p className="text-gray-500">{t("noPosts")}</p>
      ) : (
        <ul className="space-y-8">
          {filteredPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block bg-white border-[3px] border-black rounded-3xl overflow-hidden hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row">
                  {(() => {
                    const coverSrc =
                      post.image ||
                      `https://picsum.photos/seed/${encodeURIComponent(post.slug)}/800/450`
                    return (
                      <div className="sm:w-64 md:w-80 shrink-0 relative h-48 sm:h-52 bg-[#EDEDED] m-3 md:m-4 rounded-2xl overflow-hidden">
                        <Image
                          src={coverSrc}
                          alt=""
                          fill
                          className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, 320px"
                        />
                        {post.tag && (
                          <span className="absolute top-3 right-3 bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
                            {post.tag}
                          </span>
                        )}
                      </div>
                    )
                  })()}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 group-hover:underline">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base line-clamp-2">
                      {post.description}
                    </p>
                    <div className="mt-3 text-sm text-gray-500">
                      {post.author} · {post.date}
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

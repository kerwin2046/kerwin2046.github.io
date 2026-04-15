"use client"

import { useState } from "react"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { CategoryFilter } from "./category-filter"
import type { PostMeta } from "@/types"

interface ArticlesListProps {
  posts: PostMeta[]
  categories: string[]
}

export function ArticlesList({ posts: initialPosts, categories }: ArticlesListProps) {
  const [filteredPosts, setFilteredPosts] = useState<PostMeta[]>(initialPosts)
  const [featured, ...rest] = filteredPosts
  const t = useTranslations("articles")

  return (
    <>
      <CategoryFilter
        categories={categories}
        posts={initialPosts}
        onFilterChange={setFilteredPosts}
        translationKey="articles"
      />

      {filteredPosts.length === 0 ? (
        <div className="border-[3px] border-black rounded-3xl p-12 text-center mb-16">
          <p className="text-gray-600 mb-4">{t("noPosts")}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-6 mb-16">
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group bg-white border-[3px] border-black rounded-3xl overflow-hidden hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 block"
            >
              <div className="bg-[#EDEDED] relative min-h-[220px] md:min-h-[320px] m-3 md:m-4 rounded-2xl overflow-hidden">
                {featured.tag && (
                  <span className="absolute top-3 right-3 md:top-4 md:right-4 inline-block bg-black text-white text-xs md:text-sm font-semibold px-3 py-1.5 md:px-4 md:py-2 rounded-lg z-10">
                    {featured.tag}
                  </span>
                )}
                <Image
                  src={
                    featured.image ||
                    `https://picsum.photos/seed/${encodeURIComponent(featured.slug)}/800/450`
                  }
                  alt=""
                  fill
                  className="object-cover rounded-2xl transition-transform duration-500 ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
              <div className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">{featured.title}</h3>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-[#FDB927] border-2 border-black rounded-full overflow-hidden shrink-0 flex items-center justify-center text-lg font-bold text-[#0B0B0B]">
                    {featured.author.slice(0, 1)}
                  </div>
                  <div>
                    <div className="font-bold text-base md:text-lg text-[#0B0B0B]">
                      {featured.author}
                    </div>
                    <div className="text-sm md:text-base text-gray-600">{featured.date}</div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          <div className="space-y-6 md:space-y-8">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white border-[3px] border-black rounded-3xl overflow-hidden hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 block"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="bg-[#EDEDED] min-w-full sm:min-w-[200px] md:min-w-[280px] min-h-[180px] sm:min-h-[200px] relative m-0 sm:m-3 md:m-4 rounded-none sm:rounded-2xl overflow-hidden shrink-0">
                    {post.tag && (
                      <span className="absolute top-3 right-3 md:top-4 md:right-4 inline-block bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-lg z-10">
                        {post.tag}
                      </span>
                    )}
                    <Image
                      src={
                        post.image ||
                        `https://picsum.photos/seed/${encodeURIComponent(post.slug)}/800/450`
                      }
                      alt=""
                      fill
                      className="object-cover sm:object-contain p-0 sm:p-3 md:p-4 rounded-none sm:rounded-2xl transition-transform duration-500 ease-out group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, 280px"
                    />
                  </div>
                  <div className="p-6 md:p-10 flex flex-col justify-center">
                    <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4">{post.title}</h3>
                    <p className="text-gray-600 text-sm md:text-lg leading-relaxed line-clamp-2">
                      {post.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

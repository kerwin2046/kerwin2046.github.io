"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import type { PostMeta } from "@/types"

interface CategoryFilterProps {
  categories: string[]
  posts: PostMeta[]
  onFilterChange: (filteredPosts: PostMeta[]) => void
  translationKey?: string
}

export function CategoryFilter({
  categories,
  posts,
  onFilterChange,
  translationKey = "blog",
}: CategoryFilterProps) {
  const t = useTranslations(translationKey)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const handleCategoryClick = (category: string | null) => {
    setSelectedCategory(category)
    if (category === null) {
      onFilterChange(posts)
    } else {
      const filtered = posts.filter((post) => post.tag === category)
      onFilterChange(filtered)
    }
  }

  if (categories.length === 0) {
    return null
  }

  // Alternating playful organic rotations for a realistic scrapbooked look
  const getRotationClass = (index: number) => {
    const rotations = [
      "-rotate-1",
      "rotate-1",
      "-rotate-1.5",
      "rotate-1.5",
      "-rotate-[0.5deg]",
      "rotate-[0.5deg]",
    ]
    return rotations[index % rotations.length]
  }

  return (
    <div className="mb-10 select-none">
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
        {/* 'All' filter label */}
        <button
          onClick={() => handleCategoryClick(null)}
          className={`px-5 py-1.5 font-gloria text-sm font-bold border-2 border-black rounded transition-all active:scale-95 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${getRotationClass(99)} ${
            selectedCategory === null
              ? "bg-[#1A1A1A] text-white"
              : "bg-white text-gray-800 hover:text-black hover:bg-gray-50"
          }`}
        >
          {t("allCategories") || "All"}
          {selectedCategory === null && (
            <div className="absolute -bottom-1 left-1/4 right-1/4 h-[3px] bg-yellow-300 rounded-full blur-[0.5px]" />
          )}
        </button>

        {/* Dynamic Category Labels */}
        {categories.map((category, idx) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-1.5 font-gloria text-sm font-bold border-2 border-black rounded transition-all active:scale-95 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${getRotationClass(idx)} ${
              selectedCategory === category
                ? "bg-[#1A1A1A] text-white"
                : "bg-white text-gray-800 hover:text-black hover:bg-gray-50"
            }`}
          >
            {category}
            {selectedCategory === category && (
              <div className="absolute -bottom-1 left-1/4 right-1/4 h-[3px] bg-yellow-300 rounded-full blur-[0.5px]" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

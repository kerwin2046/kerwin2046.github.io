"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => handleCategoryClick(null)}
          variant={selectedCategory === null ? "default" : "outline"}
          className={`border-[3px] border-black rounded-xl px-4 py-2 font-semibold text-sm transition-all ${
            selectedCategory === null
              ? "bg-black text-white hover:bg-black/90"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          {t("allCategories")}
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => handleCategoryClick(category)}
            variant={selectedCategory === category ? "default" : "outline"}
            className={`border-[3px] border-black rounded-xl px-4 py-2 font-semibold text-sm transition-all ${
              selectedCategory === category
                ? "bg-black text-white hover:bg-black/90"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  )
}

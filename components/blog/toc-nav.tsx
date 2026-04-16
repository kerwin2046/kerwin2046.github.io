"use client"

import { useEffect, useState } from "react"
import type { TocItem } from "@/lib/content/markdown-utils"

interface TocNavProps {
  items: TocItem[]
}

export function TocNav({ items }: TocNavProps) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    if (!items.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 1] },
    )

    items.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [items])

  if (!items.length) return null

  return (
    <aside className="hidden xl:block xl:w-64 shrink-0">
      <div className="sticky top-28 rounded-xl border border-black/10 bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-[#0B0B0B]">目录</p>
        <nav className="space-y-1">
          {items.map((item) => {
            const isActive = activeId === item.id
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={[
                  "block rounded-md px-2 py-1.5 text-sm transition-colors",
                  item.level === 3 ? "ml-3" : "",
                  isActive ? "bg-[#EEF2FF] text-[#4338CA] font-medium" : "text-[#4B5563] hover:text-[#111827] hover:bg-[#F9FAFB]",
                ].join(" ")}
              >
                {item.text}
              </a>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

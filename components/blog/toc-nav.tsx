"use client"

import { useEffect, useState } from "react"
import type { TocItem } from "@/lib/content/markdown-utils"
import { DuctTape } from "@/components/ui/scrapbook-decorations"

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
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 1] },
    )

    items.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [items])

  if (!items.length) return null

  return (
    <aside className="hidden xl:block xl:w-64 shrink-0 sticky top-28 max-h-[calc(100vh-8rem)] select-none">
      {/* 3D Paper Layer stacked card shadow effect */}
      <div className="relative group">
        <div className="absolute inset-0 bg-black/5 rounded-2xl translate-x-2.5 translate-y-3 rotate-[0.5deg] -z-10 pointer-events-none" />

        {/* Lined notebook paper card */}
        <div className="relative bg-[#FCFBF7] border-2 border-black rounded-2xl px-6 py-6 shadow-[3px_3px_8px_rgba(0,0,0,0.04)] rotate-1 overflow-hidden bg-[repeating-linear-gradient(transparent,transparent_23px,#E5E7EB_24px)] bg-size-[100%_24px] pt-12 before:content-[''] before:absolute before:left-5 before:top-0 before:bottom-0 before:w-px before:bg-red-300/40">
          
          {/* Scotch/Duct tape at the top center */}
          <div className="absolute top-[-12px] left-[35%] z-10 pointer-events-none">
            <DuctTape className="-rotate-2 bg-amber-600/85 px-4 h-6 text-[0px] w-20 shadow-[1px_2px_4px_rgba(0,0,0,0.1)]" />
          </div>

          {/* Heading printed on paper */}
          <h3 className="font-sans font-black text-lg text-gray-900 mb-5 pl-4 flex items-center gap-2 select-none">
            目录
          </h3>

          <nav className="space-y-1.5 pl-4 max-h-[400px] overflow-y-auto pr-1">
            {items.map((item) => {
              const isActive = activeId === item.id
              const isSubHeading = item.level === 3

              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block transition-all hover:translate-x-[2px] leading-[24px] ${
                    isSubHeading ? "pl-4 text-xs font-mono" : "text-sm font-bold font-sans"
                  } ${
                    isActive
                      ? "text-blue-600 font-extrabold"
                      : "text-gray-600 hover:text-black"
                  }`}
                  style={{ minHeight: "24px" }}
                >
                  <span className="relative inline-block py-0.5">
                    {item.text}
                    {isActive && (
                      <span className="absolute bottom-[-1.5px] inset-x-0 h-[2px] bg-blue-600/40 rounded-full" />
                    )}
                  </span>
                </a>
              )
            })}
          </nav>

          {/* Decorative tailing '...' at bottom */}
          <div className="font-gloria text-gray-400 pl-8 pt-4 pb-2 text-xl select-none leading-none">
            ...
          </div>
        </div>
      </div>
    </aside>
  )
}

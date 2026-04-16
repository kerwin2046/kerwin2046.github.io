"use client"

import { useEffect, useState } from "react"

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight <= 0) {
        setProgress(0)
        return
      }
      const value = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100))
      setProgress(value)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 z-50 h-1 w-full bg-transparent">
      <div
        className="h-full bg-[#6366F1] transition-[width] duration-100 ease-out"
        style={{ width: `${progress}%` }}
        aria-hidden
      />
    </div>
  )
}

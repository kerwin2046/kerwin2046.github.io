"use client"

import { Link } from "@/i18n/navigation"

export function ProfileNavigation() {
  return (
    <header className="container mx-auto px-4 md:px-8 pt-6 pb-2">
      <nav className="flex items-center max-w-7xl mx-auto font-sans">
        <Link
          href="/"
          className="text-3xl font-extrabold text-black -rotate-6 hover:scale-105 transition-transform inline-block select-none font-sans tracking-tighter"
        >
          K<span className="text-red-500 font-mono font-bold">.</span>
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto h-[1.5px] bg-black/10 mt-5 opacity-40 rounded-full" />
    </header>
  )
}

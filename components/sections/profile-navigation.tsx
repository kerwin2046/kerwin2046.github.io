"use client"

import { Mail } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link, usePathname } from "@/i18n/navigation"
import { siteConfig } from "@/config/site"
import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { HandUnderline } from "@/components/ui/scrapbook-decorations"

export function ProfileNavigation() {
  const t = useTranslations("nav")
  const pathname = usePathname()

  return (
    <header className="container mx-auto px-4 md:px-8 pt-6 pb-2">
      <nav className="flex items-center justify-between max-w-7xl mx-auto font-sans">
        {/* Left: Hand-drawn "K." Logo */}
        <Link
          href="/"
          className="text-3xl font-extrabold text-black -rotate-6 hover:scale-105 transition-transform inline-block select-none font-sans tracking-tighter"
        >
          K<span className="text-red-500 font-mono font-bold">.</span>
        </Link>

        {/* Center: Airy handwritten links */}
        <div className="hidden md:flex items-center gap-8 text-[15px] font-bold text-gray-700">
          <Link href="/" className="hover:text-black transition-colors relative py-1">
            {t("home")}
            {pathname === "/" && (
              <div className="absolute -bottom-1.5 inset-x-0 h-2 text-[#FF6B6B]">
                <HandUnderline className="h-full" />
              </div>
            )}
          </Link>
          <Link href="/blog" className="hover:text-black transition-colors relative py-1">
            {t("blog")}
            {pathname.startsWith("/blog") && (
              <div className="absolute -bottom-1.5 inset-x-0 h-2 text-[#FF6B6B]">
                <HandUnderline className="h-full" />
              </div>
            )}
          </Link>
        </div>

        {/* Right: Language Switcher + Brush Contact Button */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          <a
            href={`mailto:${siteConfig.author.email}`}
            className="relative group inline-flex items-center justify-center px-4 py-2 text-[13px] md:text-[14px] font-bold text-white transition-transform hover:scale-[1.03] active:scale-[0.97]"
          >
            {/* Stylized rough black ink background */}
            <div
              className="absolute inset-0 bg-[#1A1A1A] select-none shadow-[2px_3px_5px_rgba(0,0,0,0.1)]"
              style={{
                clipPath:
                  "polygon(2% 10%, 97% 3%, 100% 45%, 98% 90%, 85% 94%, 50% 88%, 12% 95%, 0% 50%)",
              }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <span>{t("profile") === "Profile" ? "Get in touch" : "联络我"}</span>
              <Mail className="w-4 h-4" />
            </span>
          </a>
        </div>
      </nav>

      {/* Sketched subtle horizontal divider */}
      <div className="max-w-7xl mx-auto h-[1.5px] bg-black/10 mt-5 opacity-40 rounded-full" />
    </header>
  )
}

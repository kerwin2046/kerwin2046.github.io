"use client"

import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { siteConfig } from "@/config/site"
import { LanguageSwitcher } from "./language-switcher"

export function Navigation() {
  const t = useTranslations("nav")

  return (
    <div className="container mx-auto px-4 pt-8 pb-4">
      <nav className="flex items-center justify-between bg-white border-4 border-black rounded-xl px-5 py-3 max-w-2xl mx-auto shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center shrink-0">
          <div className="w-6 h-6 bg-white rounded-full" />
        </div>

        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          <Link href="/" className="text-[18px] font-bold leading-[20px] hover:opacity-70 transition-opacity">
            {t("home")}
          </Link>
          <Link href="/#about" className="text-[18px] font-bold leading-[20px] hover:opacity-70 transition-opacity">
            {t("about")}
          </Link>
          <Link href="/#portfolio" className="text-[18px] font-bold leading-[20px] hover:opacity-70 transition-opacity">
            {t("portfolio")}
          </Link>
          <Link href="/blog" className="text-[18px] font-bold leading-[20px] hover:opacity-70 transition-opacity">
            {t("blog")}
          </Link>
          <Link href="/demo" className="text-[18px] font-bold leading-[20px] hover:opacity-70 transition-opacity">
            {t("demo")}
          </Link>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <LanguageSwitcher />
          <Button asChild className="bg-black text-white hover:bg-black/90 rounded-sm px-5 h-12 min-w-[48px] shrink-0">
            <a href={`mailto:${siteConfig.author.email}`}>
              <Mail className="w-10 h-10" strokeWidth={2.5} />
            </a>
          </Button>
        </div>
      </nav>
    </div>
  )
}

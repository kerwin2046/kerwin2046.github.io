"use client"

import { useLocale } from "next-intl"
import { useRouter, usePathname } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const nextLocale = locale === "zh" ? "en" : "zh"

  const switchLocale = () => {
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={switchLocale}
      className="border-2 border-black rounded-lg font-semibold shrink-0"
    >
      {nextLocale === "zh" ? "中文" : "EN"}
    </Button>
  )
}

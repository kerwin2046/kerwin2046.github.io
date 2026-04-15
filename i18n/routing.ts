import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["en", "zh"],
  defaultLocale: "en",
  localePrefix: "always",
  // 关闭根据 Accept-Language/Cookie 自动选语言，访问 / 时固定用 defaultLocale (en)
  localeDetection: false,
})

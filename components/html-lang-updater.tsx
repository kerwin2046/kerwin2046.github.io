"use client"

import { useEffect } from "react"

/** 静态导出时根 layout 无法按请求设置 `lang`，在客户端按当前 locale 同步到 `<html>`。 */
export function HtmlLangUpdater({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])
  return null
}

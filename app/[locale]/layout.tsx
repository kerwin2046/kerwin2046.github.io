import type React from "react"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { HtmlLangUpdater } from "@/components/html-lang-updater"
import { routing } from "@/i18n/routing"

export function generateStaticParams() {
  return routing.locales.map((locale: string) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  setRequestLocale(locale)
  const messages = await getMessages()
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HtmlLangUpdater locale={locale} />
      {children}
    </NextIntlClientProvider>
  )
}

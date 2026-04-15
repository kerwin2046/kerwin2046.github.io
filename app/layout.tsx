import type React from "react"
import type { Metadata } from "next"

import "./globals.css"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased overflow-x-hidden">{children}</body>
    </html>
  )
}

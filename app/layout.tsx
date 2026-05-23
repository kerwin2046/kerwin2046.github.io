import type React from "react"
import type { Metadata } from "next"
import { Gloria_Hallelujah, Special_Elite, Caveat } from "next/font/google"

import "./globals.css"
import { siteConfig } from "@/config/site"

const gloriaHallelujah = Gloria_Hallelujah({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gloria",
  display: "swap",
})

const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-typewriter",
  display: "swap",
})

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
})

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
      <body
        className={`${gloriaHallelujah.variable} ${specialElite.variable} ${caveat.variable} font-sans antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  )
}

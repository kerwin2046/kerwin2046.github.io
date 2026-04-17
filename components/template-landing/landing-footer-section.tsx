"use client"

import type { ReactNode } from "react"
import { useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"
import { siteConfig } from "@/config/site"

type NavItem = { label: string; href: string }

function NavHref({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  if (href.startsWith("#")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

export function LandingFooterSection() {
  const t = useTranslations("landing.footer")
  const onPageLinks = t.raw("onPageLinks") as NavItem[]
  const siteLinks = t.raw("siteLinks") as NavItem[]

  return (
    <footer className="bg-background">
      <div className="border-t border-border px-6 py-16 md:px-12 md:py-20 lg:px-20">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link href="/" className="text-lg font-medium text-foreground">
              {siteConfig.author.name}
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">{t("brandTagline")}</p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">{t("onThisPage")}</h4>
            <ul className="space-y-3">
              {onPageLinks.map((link) => (
                <li key={link.href + link.label}>
                  <NavHref
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </NavHref>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">{t("site")}</h4>
            <ul className="space-y-3">
              {siteLinks.map((link) => (
                <li key={link.href + link.label}>
                  <NavHref
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </NavHref>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">{t("connect")}</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={siteConfig.author.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("connectGithub")}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.author.email}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("connectEmail")}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border px-6 py-6 md:px-12 lg:px-20">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-muted-foreground">{t("copyright")}</p>
        </div>
      </div>
    </footer>
  )
}

"use client"

import { useTranslations } from "next-intl"

import { FadeImage } from "@/components/fade-image"
import { landingMedia } from "@/config/landing-media"

type FeaturedItem = { category: string; title: string }

export function FeaturedProductsSection() {
  const t = useTranslations("landing.featured")
  const items = t.raw("items") as FeaturedItem[]

  return (
    <section id="capabilities" className="bg-background">
      <div className="px-6 py-20 text-center md:px-12 md:py-28 lg:px-20 lg:py-32 lg:pb-20">
        <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
          {t("titleLine1")}
          <br />
          {t("titleLine2")}
        </h2>
        <p className="mx-auto mt-6 max-w-md text-sm text-muted-foreground">{t("eyebrow")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 px-6 pb-20 md:grid-cols-3 md:px-12 lg:px-20">
        {items.map((feature, index) => (
          <div key={`${feature.title}-${index}`} className="group">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <FadeImage
                src={landingMedia.featured[index] ?? "/placeholder.svg"}
                alt={feature.title}
                fill
                className="object-cover group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>

            <div className="py-6">
              <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">{feature.category}</p>
              <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center px-6 pb-28 md:px-12 lg:px-20" />
    </section>
  )
}

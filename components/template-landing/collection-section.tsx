"use client"

import { useTranslations } from "next-intl"

import { FadeImage } from "@/components/fade-image"
import { landingMedia } from "@/config/landing-media"

type ToolboxItem = { id: number; title: string; description: string; note: string }

export function CollectionSection() {
  const t = useTranslations("landing.toolbox")
  const items = t.raw("items") as ToolboxItem[]

  return (
    <section id="toolbox" className="bg-background">
      <div className="px-6 py-20 md:px-12 md:py-10 lg:px-20">
        <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">{t("title")}</h2>
      </div>

      <div className="pb-24">
        <div className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 md:hidden">
          {items.map((item, index) => (
            <div key={item.id} className="group w-[75vw] flex-shrink-0 snap-center">
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-secondary">
                <FadeImage
                  src={landingMedia.collection[index] ?? "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105"
                  sizes="75vw"
                />
              </div>

              <div className="py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium leading-snug text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <span className="text-lg font-medium text-foreground">{item.note}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden gap-8 md:grid md:grid-cols-3 md:px-12 lg:px-20">
          {items.map((item, index) => (
            <div key={item.id} className="group">
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-secondary">
                <FadeImage
                  src={landingMedia.collection[index] ?? "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105"
                  sizes="(max-width: 1024px) 33vw, 25vw"
                />
              </div>

              <div className="py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium leading-snug text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <span className="text-2xl font-medium text-foreground">{item.note}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

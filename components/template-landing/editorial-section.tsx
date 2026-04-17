"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

import { landingMedia } from "@/config/landing-media"

type Spec = { label: string; value: string }

export function EditorialSection() {
  const t = useTranslations("landing.editorial")
  const specs = t.raw("specs") as Spec[]

  return (
    <section className="bg-background">
      <div className="flex items-center justify-center gap-6 pb-20" />

      <div className="grid grid-cols-2 border-t border-border md:grid-cols-4">
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="border-b border-r border-border p-8 text-center last:border-r-0 md:border-b-0"
          >
            <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">{spec.label}</p>
            <p className="text-4xl font-medium text-foreground">{spec.value}</p>
          </div>
        ))}
      </div>

      <div className="relative aspect-[16/9] w-full md:aspect-[21/9]">
        <Image
          src={landingMedia.editorialBanner}
          alt={t("bannerAlt")}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
    </section>
  )
}

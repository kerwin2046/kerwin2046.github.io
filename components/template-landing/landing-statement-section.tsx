"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

import { landingMedia } from "@/config/landing-media"

export function LandingStatementSection() {
  const t = useTranslations("landing.statement")

  return (
    <section id="about" className="bg-background">
      <div className="px-6 py-24 md:px-12 md:py-32 lg:px-20 lg:py-40">
        <p className="mx-auto max-w-5xl text-2xl leading-relaxed text-foreground md:text-3xl lg:text-[2.5rem] lg:leading-snug">
          {t("quote")}
        </p>
      </div>

      <div className="relative aspect-[16/9] w-full">
        <Image
          src={landingMedia.statement}
          alt={t("imageAlt")}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>
    </section>
  )
}

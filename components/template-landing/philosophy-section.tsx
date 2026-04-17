"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"

import { landingMedia } from "@/config/landing-media"

export function PhilosophySection() {
  const t = useTranslations("landing.philosophy")
  const sectionRef = useRef<HTMLDivElement>(null)
  const [alpineTranslateX, setAlpineTranslateX] = useState(-100)
  const [forestTranslateX, setForestTranslateX] = useState(100)
  const [titleOpacity, setTitleOpacity] = useState(1)
  const rafRef = useRef<number | null>(null)

  const updateTransforms = useCallback(() => {
    if (!sectionRef.current) return

    const rect = sectionRef.current.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const sectionHeight = sectionRef.current.offsetHeight

    const scrollableRange = sectionHeight - windowHeight
    const scrolled = -rect.top
    const progress = Math.max(0, Math.min(1, scrolled / scrollableRange))

    setAlpineTranslateX((1 - progress) * -100)
    setForestTranslateX((1 - progress) * 100)
    setTitleOpacity(1 - progress)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      rafRef.current = requestAnimationFrame(updateTransforms)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    updateTransforms()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [updateTransforms])

  return (
    <section id="focus" className="bg-background">
      <div ref={sectionRef} className="relative" style={{ height: "200vh" }}>
        <div className="sticky top-0 flex h-screen items-center justify-center">
          <div className="relative w-full">
            <div
              className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
              style={{ opacity: titleOpacity }}
            >
              <h2 className="px-6 text-center text-[12vw] font-medium leading-[0.95] tracking-tighter text-foreground md:text-[10vw] lg:text-[8vw]">
                {t("heroTitle")}
              </h2>
            </div>

            <div className="relative z-10 grid grid-cols-1 gap-4 px-6 md:grid-cols-2 md:px-12 lg:px-20">
              <div
                className="relative aspect-[4/3] overflow-hidden rounded-2xl"
                style={{
                  transform: `translate3d(${alpineTranslateX}%, 0, 0)`,
                  WebkitTransform: `translate3d(${alpineTranslateX}%, 0, 0)`,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <Image
                  src={landingMedia.philosophy.left}
                  alt={t("leftImageAlt")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute bottom-6 left-6">
                  <span className="rounded-full bg-[rgba(255,255,255,0.2)] px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                    {t("leftBadge")}
                  </span>
                </div>
              </div>

              <div
                className="relative aspect-[4/3] overflow-hidden rounded-2xl"
                style={{
                  transform: `translate3d(${forestTranslateX}%, 0, 0)`,
                  WebkitTransform: `translate3d(${forestTranslateX}%, 0, 0)`,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <Image
                  src={landingMedia.philosophy.right}
                  alt={t("rightImageAlt")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute bottom-6 left-6">
                  <span className="rounded-full bg-[rgba(255,255,255,0.2)] px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                    {t("rightBadge")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-36 lg:pb-14">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("kicker")}</p>
          <p className="mt-8 text-center text-3xl leading-relaxed text-muted-foreground">{t("body")}</p>
        </div>
      </div>
    </section>
  )
}

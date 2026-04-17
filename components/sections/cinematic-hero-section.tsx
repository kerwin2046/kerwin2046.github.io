"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"
import { siteConfig } from "@/config/site"
import { landingMedia } from "@/config/landing-media"

export function CinematicHeroSection() {
  const t = useTranslations("cinematicHero")
  const sectionRef = useRef<HTMLElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const headline = t("headline")
  const letters = Array.from(headline)

  const [a, b, c, d] = landingMedia.cinematic.sides
  const sideImages = [
    { src: a, alt: t("sideAlt0"), position: "left" as const, span: 1 },
    { src: b, alt: t("sideAlt1"), position: "left" as const, span: 1 },
    { src: c, alt: t("sideAlt2"), position: "right" as const, span: 1 },
    { src: d, alt: t("sideAlt3"), position: "right" as const, span: 1 },
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const scrollableHeight = window.innerHeight * 2
      const scrolled = -rect.top
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight))

      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const textOpacity = Math.max(0, 1 - scrollProgress / 0.2)
  const imageProgress = Math.max(0, Math.min(1, (scrollProgress - 0.2) / 0.8))
  const centerWidth = 100 - imageProgress * 58
  const centerHeight = 100 - imageProgress * 30
  const sideWidth = imageProgress * 22
  const sideOpacity = imageProgress
  const sideTranslateLeft = -100 + imageProgress * 100
  const sideTranslateRight = 100 - imageProgress * 100
  const borderRadius = imageProgress * 24
  const gap = imageProgress * 16
  const sideTranslateY = -(imageProgress * 15)

  return (
    <section ref={sectionRef} className="relative bg-background">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative h-full w-full">
          <div className="flex h-full w-full items-center justify-center">
            <div
              className="relative flex h-full w-full items-stretch justify-center"
              style={{
                gap: `${gap}px`,
                padding: `${imageProgress * 16}px`,
                paddingBottom: `${60 + imageProgress * 40}px`,
              }}
            >
            <div
              className="flex flex-col will-change-transform"
              style={{
                width: `${sideWidth}%`,
                gap: `${gap}px`,
                transform: `translateX(${sideTranslateLeft}%) translateY(${sideTranslateY}%)`,
                opacity: sideOpacity,
              }}
            >
              {sideImages
                .filter((img) => img.position === "left")
                .map((img, idx) => (
                  <div
                    key={idx}
                    className="relative min-h-0 flex-1 overflow-hidden will-change-transform"
                    style={{
                      flex: img.span,
                      borderRadius: `${borderRadius}px`,
                    }}
                  >
                    <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="22vw" />
                  </div>
                ))}
            </div>

            <div
              className="relative overflow-hidden will-change-transform"
              style={{
                width: `${centerWidth}%`,
                height: `${centerHeight}%`,
                flex: "0 0 auto",
                borderRadius: `${borderRadius}px`,
              }}
            >
              <Image
                src={landingMedia.cinematic.center}
                alt={t("centerImageAlt")}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />

              <div
                className="absolute inset-0 flex items-end overflow-hidden"
                style={{ opacity: textOpacity }}
              >
                <h1 className="w-full text-[22vw] font-medium leading-[0.8] tracking-tighter text-white">
                  {letters.map((letter, index) => (
                    <span
                      key={`${letter}-${index}`}
                      className="inline-block animate-[slideUp_0.8s_ease-out_forwards] opacity-0"
                      style={{
                        animationDelay: `${index * 0.08}s`,
                        transition: "all 1.5s",
                        transitionTimingFunction: "cubic-bezier(0.86, 0, 0.07, 1)",
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                </h1>
              </div>
            </div>

            <div
              className="flex flex-col will-change-transform"
              style={{
                width: `${sideWidth}%`,
                gap: `${gap}px`,
                transform: `translateX(${sideTranslateRight}%) translateY(${sideTranslateY}%)`,
                opacity: sideOpacity,
              }}
            >
              {sideImages
                .filter((img) => img.position === "right")
                .map((img, idx) => (
                  <div
                    key={idx}
                    className="relative min-h-0 flex-1 overflow-hidden will-change-transform"
                    style={{
                      flex: img.span,
                      borderRadius: `${borderRadius}px`,
                    }}
                  >
                    <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="22vw" />
                  </div>
                ))}
            </div>
          </div>
          </div>

          <nav
            className="pointer-events-none absolute inset-0 z-30 select-none"
            style={{ opacity: textOpacity }}
            aria-label={t("navAriaLabel")}
          >
            <p
              className="hero-enter-link pointer-events-none absolute top-[5%] left-[12%] max-w-[10rem] text-left text-[10px] font-mono leading-tight font-medium tracking-[0.2em] text-white uppercase md:top-[7%] md:left-[18%] md:max-w-none md:text-xs -rotate-[2deg]"
            >
              <span className="animate-hero-float inline-block">{t("enterHint")}</span>
            </p>

            <Link
              href="/profile"
              className="hero-enter-link pointer-events-auto absolute top-[14%] left-[3%] -rotate-[8deg] border-2 border-white bg-black/30 px-3 py-2 text-lg font-bold tracking-tight text-white backdrop-blur-[3px] transition-all duration-200 hover:scale-105 hover:rotate-0 hover:border-white md:top-[16%] md:left-[5%] md:text-xl"
            >
              <span className="animate-hero-float-slow inline-block">{t("linkProfile")}</span>
              <span className="ml-1 text-white/60">→</span>
            </Link>

            <Link
              href="/blog"
              className="hero-enter-link pointer-events-auto absolute top-[20%] right-[4%] rotate-[5deg] text-base text-white underline decoration-white/90 decoration-wavy underline-offset-[6px] transition-all duration-200 hover:decoration-white md:top-[22%] md:right-[7%] md:text-lg"
            >
              <span className="animate-hero-float-fast inline-block">{t("linkBlog")}</span>
            </Link>

            <Link
              href="/demo"
              className="hero-enter-link pointer-events-auto absolute top-[42%] left-[6%] -rotate-[4deg] border border-dashed border-white/80 px-2 py-1.5 font-mono text-xs tracking-[0.25em] text-white uppercase transition-all duration-200 hover:border-solid hover:rotate-0 md:top-[40%] md:left-[10%] md:text-sm"
            >
              <span className="animate-hero-float inline-block">{t("linkDemo")}</span>
            </Link>

            <a
              href={`mailto:${siteConfig.author.email}`}
              className="hero-enter-link pointer-events-auto absolute top-[33%] right-[12%] rotate-[10deg] text-sm font-medium text-white transition-all duration-200 hover:rotate-0 md:top-[36%] md:right-[16%] md:text-base"
            >
              <span className="animate-hero-float-slow inline-block border-b-2 border-white/40 pb-px">
                {t("linkEmail")}
              </span>
            </a>

            <a
              href={siteConfig.author.github}
              target="_blank"
              rel="noreferrer"
              className="hero-enter-link pointer-events-auto absolute bottom-[20%] right-[4%] -rotate-[11deg] text-2xl font-light text-white transition-all duration-200 hover:rotate-0 md:bottom-[22%] md:right-[6%] md:text-3xl"
            >
              <span className="animate-hero-float-fast inline-block leading-none">
                {t("linkGithub")}
                <span className="ml-0.5 align-top text-lg text-white/50" aria-hidden>
                  {"\u2197"}
                </span>
              </span>
            </a>

            <span
              className="hero-enter-link pointer-events-none absolute bottom-[34%] left-[20%] -rotate-[14deg] text-[11px] text-white/50 md:bottom-[32%] md:left-[28%] md:text-xs"
              aria-hidden
            >
              <span className="animate-hero-float inline-block">····</span>
            </span>

            <span
              className="hero-enter-link pointer-events-none absolute top-[52%] right-[22%] rotate-[18deg] font-mono text-[10px] text-white/40 md:text-[11px]"
              aria-hidden
            >
              / / /
            </span>
          </nav>
        </div>
      </div>

      <div className="h-[200vh]" />

      <div className="px-6 pt-32 pb-28 md:pt-48 md:px-12 md:pb-36 lg:px-20 lg:pt-56 lg:pb-44">
        <p className="mx-auto max-w-2xl text-center text-2xl leading-relaxed text-muted-foreground md:text-3xl lg:text-[2.5rem] lg:leading-snug">
          {t("taglineLine1")}
          <br />
          {t("taglineLine2")}
        </p>
      </div>
    </section>
  )
}

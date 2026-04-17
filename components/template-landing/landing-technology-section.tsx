"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"

import { landingMedia } from "@/config/landing-media"

function ScrollRevealText({ text }: { text: string }) {
  const containerRef = useRef<HTMLParagraphElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      const startOffset = windowHeight * 0.9
      const endOffset = windowHeight * 0.1

      const totalDistance = startOffset - endOffset
      const currentPosition = startOffset - rect.top

      const newProgress = Math.max(0, Math.min(1, currentPosition / totalDistance))
      setProgress(newProgress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const words = text.split(" ")

  return (
    <p ref={containerRef} className="text-3xl font-semibold leading-snug md:text-4xl lg:text-5xl">
      {words.map((word, index) => {
        const wordProgress = index / words.length
        const isRevealed = progress > wordProgress

        return (
          <span
            key={index}
            className="transition-colors duration-150"
            style={{
              color: isRevealed ? "var(--foreground)" : "#e4e4e7",
            }}
          >
            {word}
            {index < words.length - 1 ? " " : ""}
          </span>
        )
      })}
    </p>
  )
}

export function LandingTechnologySection() {
  const t = useTranslations("landing.technology")
  const sectionRef = useRef<HTMLElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  const [s0, s1, s2, s3] = landingMedia.technologyBento.sides
  const sideImages = [
    { src: s0, alt: t("sideAlt0"), position: "left" as const, span: 1 },
    { src: s1, alt: t("sideAlt1"), position: "left" as const, span: 1 },
    { src: s2, alt: t("sideAlt2"), position: "right" as const, span: 1 },
    { src: s3, alt: t("sideAlt3"), position: "right" as const, span: 1 },
  ]

  const heroWords = [t("word0"), t("word1"), t("word2")]

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

  const imageProgress = Math.max(0, Math.min(1, (scrollProgress - 0.2) / 0.8))
  const centerWidth = 100 - imageProgress * 58
  const sideWidth = imageProgress * 22
  const sideOpacity = imageProgress
  const sideTranslateLeft = -100 + imageProgress * 100
  const sideTranslateRight = 100 - imageProgress * 100
  const borderRadius = imageProgress * 24
  const gap = imageProgress * 16

  return (
    <section ref={sectionRef} id="engineering" className="relative bg-foreground">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="flex h-full w-full items-center justify-center">
          <div
            className="relative flex h-full w-full items-stretch justify-center"
            style={{ gap: `${gap}px`, padding: `${imageProgress * 16}px` }}
          >
            <div
              className="flex min-h-0 flex-col will-change-transform"
              style={{
                width: `${sideWidth}%`,
                gap: `${gap}px`,
                transform: `translateX(${sideTranslateLeft}%)`,
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
                    <Image
                      src={img.src || "/placeholder.svg"}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="22vw"
                    />
                  </div>
                ))}
            </div>

            <div
              className="relative overflow-hidden will-change-transform"
              style={{
                width: `${centerWidth}%`,
                height: "100%",
                flex: "0 0 auto",
                borderRadius: `${borderRadius}px`,
              }}
            >
              <Image
                src={landingMedia.technologyBento.center}
                alt={t("centerImageAlt")}
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-foreground/40" />

              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <h2 className="max-w-3xl text-5xl font-medium leading-tight tracking-tight text-white md:text-5xl lg:text-7xl">
                  {heroWords.map((word, index) => {
                    const wordFadeStart = index * 0.07
                    const wordFadeEnd = wordFadeStart + 0.07
                    const wordProgress = Math.max(
                      0,
                      Math.min(1, (scrollProgress - wordFadeStart) / (wordFadeEnd - wordFadeStart))
                    )
                    const wordOpacity = 1 - wordProgress
                    const wordBlur = wordProgress * 10

                    return (
                      <span
                        key={index}
                        className="inline-block"
                        style={{
                          opacity: wordOpacity,
                          filter: `blur(${wordBlur}px)`,
                          transition: "opacity 0.1s linear, filter 0.1s linear",
                          marginRight: index < 2 ? "0.3em" : "0",
                        }}
                      >
                        {word}
                        {index === 1 && <br />}
                      </span>
                    )
                  })}
                </h2>
              </div>
            </div>

            <div
              className="flex min-h-0 flex-col will-change-transform"
              style={{
                width: `${sideWidth}%`,
                gap: `${gap}px`,
                transform: `translateX(${sideTranslateRight}%)`,
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
                    <Image
                      src={img.src || "/placeholder.svg"}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="22vw"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-[200vh]" />

      <div className="relative overflow-hidden bg-background px-6 py-24 md:px-12 md:py-32 lg:px-20 lg:py-40">
        <div className="relative z-10 mx-auto max-w-4xl">
          <ScrollRevealText text={t("revealText")} />
        </div>
      </div>
    </section>
  )
}

"use client"

import React, { useState } from "react"
import Image from "next/image"
import { useTranslations, useLocale } from "next-intl"
import { Github, Twitter, Linkedin, Mail, ExternalLink, FileText } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { siteConfig } from "@/config/site"
import { PostMeta } from "@/types"
import {
  DuctTape,
  ScotchTape,
  HandStar,
  HandArrowDown,
  HandArrowDownLeft,
  HandArrowLoopRight,
  HandUnderline,
  HandHighlight,
  HandCheckbox,
} from "@/components/ui/scrapbook-decorations"
import { RoughAnnotate } from "@/components/ui/rough-annotate"

interface ScrapbookProfileDashboardProps {
  posts: PostMeta[]
}

export function ScrapbookProfileDashboard({ posts }: ScrapbookProfileDashboardProps) {
  const t = useTranslations()
  const locale = useLocale()

  // Safely format dates to prevent timezone/SSR mismatch
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    const parts = dateStr.split("-")
    if (parts.length < 3) return dateStr
    const [_, month, day] = parts
    const monthsEN: Record<string, string> = {
      "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun",
      "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
    }
    const monthsZH: Record<string, string> = {
      "01": "1月", "02": "2月", "03": "3月", "04": "4月", "05": "5月", "06": "6月",
      "07": "7月", "08": "8月", "09": "9月", "10": "10月", "11": "11月", "12": "12月"
    }

    if (locale === "zh") {
      return `${monthsZH[month] || month}${day}日`
    }
    return `${monthsEN[month] || month} ${day}`
  }

  // Interactive Checklist State
  const [checklist, setChecklist] = useState([
    { id: "into1", checked: true },
    { id: "into2", checked: true },
    { id: "into3", checked: true },
    { id: "into4", checked: true },
  ])

  const toggleCheck = (id: string) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    )
  }

  // Custom Behance Icon path
  const BehanceIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <path d="M8 12h8v2H8zm8-6h4v1.5h-4zm-11 0h6.5c2 0 3.5 1 3.5 3s-1.5 2.5-3 2.5c1.8 0 3.2 1 3.2 3.5s-1.8 3.5-4.2 3.5H5zm3 3.5h3c.8 0 1.2-.4 1.2-1s-.4-1-1.2-1H8zm0 5h3.5c.8 0 1.2-.5 1.2-1.2s-.4-1.2-1.2-1.2H8z" />
    </svg>
  )

  const socialLinks = [
    { href: siteConfig.author.github || "https://github.com/kerwin2046", icon: Github, label: "GitHub" },
    { href: "https://x.com", icon: Twitter, label: "Twitter" },
    { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
    { href: "https://behance.net", icon: BehanceIcon, label: "Behance" },
  ]

  // Render highlighted hero description based on language
  const renderHighlightedDescription = () => {
    if (locale === "zh") {
      return (
        <p className="text-gray-800 text-[15px] md:text-[16px] leading-[30px] md:leading-[36px] max-w-2xl font-gloria">
          一名从 19 年‘切图’
          <RoughAnnotate type="circle" color="#C84B31" strokeWidth={2.2} padding={6} className="mx-1">
            <span className="text-[#C84B31] font-bold">进化</span>
          </RoughAnnotate>
          到 26 年‘调教 AI’的全栈，深陷{" "}
          <RoughAnnotate type="underline" color="#2563EB" strokeWidth={2.5} padding={2} className="mx-1">
            <span className="text-blue-600 font-semibold">
              TypeScript 的‘类型地牢’
            </span>
          </RoughAnnotate>{" "}
          无法自拔，坚持用 React 和 Node.js 构建那种即便 AI 看了都要直呼
          <RoughAnnotate type="highlight" color="#FEF08A" animationDuration={1000} className="mx-1">
            <span className="font-bold text-[#111] px-1">‘优雅’</span>
          </RoughAnnotate>
          的可维护系统，并习惯在博客里把每一次深夜踩坑的血泪史写成段子。
        </p>
      )
    }

    return (
      <p className="text-gray-800 text-[15px] md:text-[17px] leading-[30px] md:leading-[38px] max-w-2xl font-gloria">
        A full-stack engineer who’s
        <RoughAnnotate type="circle" color="#C84B31" strokeWidth={2.2} padding={6} className="mx-1">
          <span className="text-[#C84B31] font-bold">evolved</span>
        </RoughAnnotate>
        from 2019’s ‘cut-and-paste’ to 2026’s ‘AI training master,’ hopelessly stuck in{" "}
        <RoughAnnotate type="underline" color="#2563EB" strokeWidth={2.5} padding={2} className="mx-1">
          <span className="text-blue-600 font-semibold">
            TypeScript’s ‘type hell,’
          </span>
        </RoughAnnotate>{" "}
        building systems that even AI would call{" "}
        <RoughAnnotate type="highlight" color="#FEF08A" animationDuration={1000} className="mx-1">
          <span className="font-bold text-[#111] px-1">‘elegant,’</span>
        </RoughAnnotate>{" "}
        and writing about every late-night debugging session as a joke on the blog.
      </p>
    )
  }

  return (
    <section className="container mx-auto px-4 md:px-8 py-10 md:py-16 relative">
      {/* Absolute floating decorations */}
      {/* Top Right: Annotation "Let's build something great!" - Now in Gloria Hallelujah */}
      <div className="hidden lg:block absolute top-[2%] right-[10%] rotate-6 text-[#1A1A1A] select-none pointer-events-none">
        <p className="font-gloria text-lg font-bold leading-tight max-w-[150px] text-center">
          {t("scrapbook.letBuild")}
        </p>
        <HandArrowDownLeft className="w-14 h-12 mt-2 -scale-x-100 mx-auto text-black/70 rotate-20" />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-start">
        {/* ================= LEFT COLUMN ================= */}
        <div className="space-y-8 md:space-y-10">
          {/* Pick A Door Overlap Badge */}
          <div className="flex items-center gap-4">
            <DuctTape className="-rotate-2 shadow-[2px_3px_5px_rgba(0,0,0,0.1)]">
              {t("cinematicHero.enterHint") || "PICK A DOOR ➔"}
            </DuctTape>
            <HandStar className="w-6 h-6 text-gray-400 rotate-12" />
          </div>

          {/* Heading Name & Role */}
          <div className="space-y-2 select-none">
            <h1 className="text-5xl md:text-7xl lg:text-[76px] font-black leading-[1.05] tracking-tight text-gray-900">
              I'm <span className="text-[#C84B31]">{t("hero.titleName")}</span>, <br />
              <span className="inline-block relative">
                {locale === "zh" ? "TS 全栈工程师" : "TS Full-Stack"}
              </span>{" "}
              <br className="hidden md:block" />
              <span>{locale === "zh" ? "来自中国" : "Engineer from"}</span>{" "}
              <span className="text-blue-600 underline decoration-4 decoration-blue-500/30 underline-offset-4">
                {locale === "zh" ? "" : t("hero.titleLocale")}
              </span>
            </h1>
          </div>

          {/* Localized bio paragraph */}
          <div className="relative">
            {renderHighlightedDescription()}
            {/* Ink drop/splat detail on bottom margin */}
            <span className="absolute -bottom-6 -left-3 font-gloria text-red-500/40 text-4xl select-none">
              ✎
            </span>
          </div>

          {/* Call to Actions (CTAs) */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-6 pt-2">
            {/* Get in touch (Brush black button) */}
            <a
              href={`mailto:${siteConfig.author.email}`}
              className="relative group w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white transition-transform hover:scale-[1.03] active:scale-[0.97]"
            >
              {/* Painted ink-splat style black block */}
              <div
                className="absolute inset-0 bg-[#1A1A1A] select-none"
                style={{
                  clipPath:
                    "polygon(1% 15%, 98% 4%, 100% 50%, 96% 94%, 75% 91%, 50% 96%, 20% 91%, 0% 50%)",
                }}
              />
              <span className="relative z-10 flex items-center gap-2">
                <Mail className="w-5 h-5 shrink-0" />
                <span>{t("hero.getInTouch")}</span>
                <span className="font-mono text-white/50 ml-1">➔</span>
              </span>
            </a>

            {/* View blog (Sketchy box button) */}
            <Link
              href="/blog"
              className="relative w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-gray-800 bg-white border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-px active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <FileText className="w-5 h-5 mr-2 shrink-0" />
              <span>{t("hero.viewBlog")}</span>
              <span className="font-mono text-gray-400 ml-1">➔</span>
            </Link>
          </div>

          {/* Socials & Currently Into checklist side-by-side */}
          <div className="grid sm:grid-cols-[auto_1fr] gap-8 md:gap-12 pt-4">
            {/* Social media connections */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <p className="font-mono text-xs font-black tracking-wider text-gray-500 uppercase">
                  {t("scrapbook.findMeOn")}
                </p>
                <div className="w-10 h-[1.5px] bg-gray-300 rounded" />
              </div>
              <div className="flex items-center gap-3">
                {socialLinks.map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="border-[2.5px] border-black rounded-lg bg-[#1F1F1F] p-2.5 hover:rotate-3 hover:scale-110 active:scale-95 transition-all text-white w-11 h-11 flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Interactive Checklist "Currently Into" */}
            <div className="space-y-3 bg-[#EAE7DF]/30 p-4 md:p-5 border-2 border-dashed border-gray-400/50 rounded-2xl relative">
              <div className="absolute top-2 right-2">
                <HandStar className="w-5 h-5 text-[#C84B31]/30 rotate-45" />
              </div>
              <p className="font-mono text-xs font-black tracking-wider text-gray-500 uppercase mb-2">
                {t("scrapbook.currentlyInto")}
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {checklist.map(({ id, checked }) => (
                  <HandCheckbox
                    key={id}
                    id={id}
                    checked={checked}
                    onChange={() => toggleCheck(id)}
                    label={t(`scrapbook.${id}`)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN (SCRAPBOOK CARD PILES) ================= */}
        <div className="grid gap-10 md:gap-12 relative lg:pl-4">
          {/* 1. Polaroid Photo Card (Avatar) */}
          <div className="justify-self-center lg:justify-self-end relative group select-none">
            {/* Back dark-card shadow layer for realistic 3D paper overlap */}
            <div className="absolute inset-0 bg-[#1A1A1A]/90 rounded-2xl translate-x-3.5 translate-y-4 shadow-[4px_6px_12px_rgba(0,0,0,0.15)] rotate-[1.5deg] -z-10 select-none pointer-events-none" />

            {/* Photo Matte Frame */}
            <div className="relative bg-white border-2 border-black/10 p-4 pb-8 rounded-2xl max-w-[340px] rotate-[2.5deg] shadow-[2px_3px_8px_rgba(0,0,0,0.06)] hover:rotate-0 transition-transform duration-300">
              {/* Glossy scotch tapes at top-left and top-right */}
              <ScotchTape className="top-[-10px] left-8 -rotate-12" />
              <ScotchTape className="top-[-8px] right-8 rotate-15" />

              {/* Picture Container */}
              <div className="relative aspect-square w-[300px] max-w-full bg-[#FDB927] border-[3.5px] border-black rounded-lg overflow-hidden shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)]">
                <img
                  src="/images/design-mode/63407fbdc2d4ac5270385fd4_home-he.png"
                  alt={t("hero.avatarAlt")}
                  className="w-full h-full object-cover filter contrast-[1.02] sepia-[0.05]"
                />
              </div>

              {/* Caption - Now in Gloria Hallelujah */}
              <div className="pt-5 text-center">
                <p className="font-gloria text-2xl font-bold text-[#1F1F1F] tracking-wide">
                  v1.2.6
                </p>
                <p className="font-mono text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                  {t("footer.copyright") || "Kerwin · TS full-stack engineer"}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Recently on the Blog Card */}
          <div className="relative bg-[#FAFAF8] border-2 border-black rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-1">
            {/* Taped label on top */}
            <div className="absolute top-[-16px] left-6">
              <DuctTape className="rotate-1 bg-blue-600 px-4 py-1.5 shadow-[1px_2px_4px_rgba(0,0,0,0.15)] text-[10px]">
                {t("scrapbook.recentlyOnBlog")}
              </DuctTape>
            </div>

            <div className="space-y-5 pt-2">
              <div className="divide-y-2 divide-dashed divide-gray-300/60">
                {posts.length === 0 ? (
                  <p className="text-gray-500 font-mono py-2">{t("articles.noPosts")}</p>
                ) : (
                  posts.map((post) => (
                    <div key={post.slug} className="py-3.5 first:pt-0 last:pb-0 group">
                      <Link href={`/blog/${post.slug}`} className="flex justify-between items-baseline gap-4 group">
                        <h3 className="font-mono font-bold text-[15px] md:text-[16px] text-gray-800 group-hover:text-blue-600 group-hover:underline transition-colors leading-snug">
                          {post.title}
                        </h3>
                        <span className="font-typewriter text-xs text-gray-400 shrink-0 font-medium select-none">
                          {formatDate(post.date)}
                        </span>
                      </Link>
                    </div>
                  ))
                )}
              </div>

              {/* Handwriting Link to Blog list */}
              <div className="pt-2 text-right">
                <Link
                  href="/blog"
                  className="font-gloria text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors inline-block relative py-1"
                >
                  {t("scrapbook.viewAllPosts")}
                </Link>
              </div>
            </div>
          </div>

          {/* 3. Lined Paper "Now" Card */}
          <div className="relative bg-[#FCFBF7] border-2 border-black rounded-2xl px-6 py-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-1 overflow-hidden bg-[repeating-linear-gradient(transparent,transparent_23px,#E5E7EB_24px)] bg-size-[100%_24px] pt-12 md:pt-14 before:content-[''] before:absolute before:left-8 before:top-0 before:bottom-0 before:w-px before:bg-red-300/60">
            {/* Scotch tape on top edge */}
            <div className="absolute top-[-14px] left-[35%]">
              <DuctTape className="-rotate-2 bg-amber-600 px-5 text-[10px]">
                {t("scrapbook.now")}
              </DuctTape>
            </div>

            {/* List of custom handwriting bullet points - keep caveat font for pencil fine style */}
            <ul className="font-caveat text-2xl font-bold text-blue-800/90 leading-[24px] pl-6 space-y-[24px] select-none">
              <li>{t("scrapbook.nowBullet1")}</li>
              <li>{t("scrapbook.nowBullet2")}</li>
              <li>{t("scrapbook.nowBullet3")}</li>
              <li>{t("scrapbook.nowBullet4")}</li>
            </ul>

            {/* Hand Star doodle on corner */}
            <div className="absolute bottom-4 right-4 text-black/25 pointer-events-none select-none">
              <HandStar className="w-8 h-8 -rotate-12" />
            </div>
          </div>

          {/* Annotation arrow in the very bottom right - Now in Gloria Hallelujah */}
          <div className="absolute bottom-[-55px] right-[4%] hidden sm:block -rotate-10 text-[#1A1A1A]/80 select-none pointer-events-none">
            <HandArrowLoopRight className="w-12 h-12 text-black/60 rotate-45 scale-y-[-1] ml-auto" />
            <p className="font-gloria text-lg font-bold leading-none text-center mr-6 mt-1 text-gray-700">
              {t("scrapbook.keepShipping")}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

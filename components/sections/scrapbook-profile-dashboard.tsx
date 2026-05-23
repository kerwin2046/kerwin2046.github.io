"use client"

import React, { useState } from "react"
import Image from "next/image"
import { useTranslations, useLocale } from "next-intl"
import { Github, Twitter, Linkedin, Mail, FileText, Lightbulb } from "lucide-react"
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
  PaperClip,
  CoffeeStain,
  SystemArchitectureSketch,
} from "@/components/ui/scrapbook-decorations"
import { RoughAnnotate } from "@/components/ui/rough-annotate"

interface ScrapbookProfileDashboardProps {
  posts: PostMeta[]
}

export function ScrapbookProfileDashboard({ posts }: ScrapbookProfileDashboardProps) {
  const t = useTranslations("scrapbook")
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

  // Interactive Checklist State: "Currently Into"
  const [checklist, setChecklist] = useState([
    { id: "into1", checked: true, labelKey: "into1" },
    { id: "into2", checked: true, labelKey: "into2" },
    { id: "into3", checked: true, labelKey: "into3" },
    { id: "into4", checked: true, labelKey: "into4" },
  ])

  // Interactive Checklist State: "On My Mind"
  const [onMyMind, setOnMyMind] = useState([
    { id: "mind1", checked: true, labelKey: "onMyMind1" },
    { id: "mind2", checked: true, labelKey: "onMyMind2" },
    { id: "mind3", checked: true, labelKey: "onMyMind3" },
    { id: "mind4", checked: false, labelKey: "onMyMind4" },
  ])

  const toggleCheck = (id: string) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    )
  }

  const toggleMindCheck = (id: string) => {
    setOnMyMind(prev =>
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
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* ================= SECTION 1: TOP PROFILE HERO ================= */}
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Name, Bio, CTA Buttons, Socials */}
          <div className="space-y-8 md:space-y-10">
            {/* Pick A Door Overlap Badge */}
            <div className="flex items-center gap-4 select-none">
              <DuctTape className="-rotate-2 shadow-[2px_3px_5px_rgba(0,0,0,0.1)]">
                PICK A DOOR ➔
              </DuctTape>
              <HandStar className="w-6 h-6 text-gray-400 rotate-12" />
            </div>

            {/* Heading Name & Role */}
            <div className="space-y-2 select-none relative">
              <h1 className="text-5xl md:text-7xl lg:text-[76px] font-black leading-[1.05] tracking-tight text-gray-900">
                I'm{" "}
                <span className="text-[#C84B31] relative inline-block">
                  Kerwin,
                  <HandStar className="absolute -top-1 -right-8 w-6 h-6 text-gray-400 rotate-12" />
                </span>
                <br />
                <span className="inline-block relative">
                  {locale === "zh" ? "TS 全栈工程师" : "TS Full-Stack"}
                </span>{" "}
                <br />
                <span>{locale === "zh" ? "来自中国" : "Engineer from"}</span>{" "}
                <span className="text-blue-600 relative inline-block">
                  China.
                  <svg
                    viewBox="0 0 100 12"
                    preserveAspectRatio="none"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    className="absolute -bottom-2.5 left-0 w-full h-3 text-blue-500/80"
                  >
                    <path d="M3 8c15-2.5 35-4 55-4.5c18-0.5 31 1 39 3" />
                  </svg>
                </span>
              </h1>
            </div>

            {/* Localized bio paragraph */}
            <div className="relative">
              <CoffeeStain className="absolute -top-12 -left-20 w-36 h-32 -z-10 opacity-70" />
              {renderHighlightedDescription()}
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
                  <span>Get in touch ➔</span>
                </span>
              </a>

              {/* View blog (Sketchy box button) */}
              <Link
                href="/blog"
                className="relative w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-gray-800 bg-white border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-px active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <FileText className="w-5 h-5 mr-2 shrink-0" />
                <span>View blog ➔</span>
              </Link>
            </div>

            {/* Social media connections */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 select-none">
                <p className="font-sans text-xs font-black tracking-wider text-gray-500 uppercase">
                  {t("findMeOn")}
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
                    className="border-[2.5px] border-black rounded-full bg-[#1F1F1F] p-2.5 hover:rotate-6 hover:scale-110 active:scale-95 transition-all text-white w-11 h-11 flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Polaroid Photo & Notes to self */}
          <div className="flex flex-col sm:flex-row gap-8 lg:gap-12 justify-center lg:justify-end items-center">
            
            {/* 1. Polaroid Photo Card (Avatar) */}
            <div className="relative group select-none shrink-0">
              {/* Back dark-card shadow layer for realistic 3D paper overlap */}
              <div className="absolute inset-0 bg-[#1A1A1A]/90 rounded-2xl translate-x-3.5 translate-y-4 shadow-[4px_6px_12px_rgba(0,0,0,0.15)] rotate-[1.5deg] -z-10 select-none pointer-events-none" />

              {/* Photo Matte Frame */}
              <div className="relative bg-white border-2 border-black/10 p-4 pb-8 rounded-2xl w-[280px] sm:w-[300px] rotate-[2.5deg] shadow-[2px_3px_8px_rgba(0,0,0,0.06)] hover:rotate-0 transition-transform duration-300">
                {/* Glossy scotch tapes */}
                <ScotchTape className="top-[-10px] left-8 -rotate-12" />
                <ScotchTape className="top-[-8px] right-8 rotate-15" />

                {/* Picture Container */}
                <div className="relative aspect-square w-full bg-[#1A1A1A] border-[3.5px] border-black rounded-lg overflow-hidden shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)]">
                  <Image
                    src="/images/person.png"
                    alt="Kerwin's portrait"
                    fill
                    className="object-cover filter contrast-[1.02] sepia-[0.05]"
                  />
                </div>

                {/* Caption */}
                <div className="pt-5 text-center">
                  <p className="font-gloria text-2xl font-bold text-[#1F1F1F] tracking-wide">
                    v1.2.6
                  </p>
                  <p className="font-sans text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                    TS FULL-STACK ENGINEER
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Notes to self card */}
            <div className="relative select-none w-[260px] sm:w-[280px] shrink-0">
              {/* Card paper shadow */}
              <div className="absolute inset-0 bg-black/5 rounded-2xl translate-x-2.5 translate-y-3 -rotate-1 -z-10 pointer-events-none" />

              {/* Lined paper card */}
              <div className="relative bg-[#FCFBF7] border-2 border-black rounded-2xl px-6 py-6 shadow-[3px_3px_8px_rgba(0,0,0,0.04)] -rotate-1 overflow-hidden bg-[repeating-linear-gradient(transparent,transparent_23px,#E5E7EB_24px)] bg-size-[100%_24px] pt-12 before:content-[''] before:absolute before:left-5 before:top-0 before:bottom-0 before:w-px before:bg-red-300/40">
                {/* PaperClip at the top */}
                <div className="absolute top-[-18px] left-[15%] z-20">
                  <PaperClip className="-rotate-12 w-5 h-10 text-gray-700 hover:rotate-0 transition-all duration-300" />
                </div>
                {/* Scotch tape on top */}
                <div className="absolute top-[-10px] left-[35%] z-10">
                  <ScotchTape className="-rotate-3" />
                </div>

                {/* Title */}
                <h3 className="font-gloria text-xl font-bold text-gray-900 mb-5 pl-4 relative inline-block">
                  {t("notesToSelf") || "Notes to self."}
                  <div className="h-[2px] w-full bg-blue-500/40 absolute bottom-[-2px] left-0" />
                </h3>

                {/* Bullet list */}
                <ul className="font-sans text-sm font-semibold text-gray-700 leading-[24px] pl-4 space-y-[24px] pt-0.5 list-none">
                  <li className="flex items-center gap-1.5"><span className="text-gray-400 text-xs">•</span> {t("nowBullet1")}</li>
                  <li className="flex items-center gap-1.5"><span className="text-gray-400 text-xs">•</span> {t("nowBullet2")}</li>
                  <li className="flex items-center gap-1.5"><span className="text-gray-400 text-xs">•</span> {t("nowBullet3")}</li>
                  <li className="flex items-center gap-1.5"><span className="text-gray-400 text-xs">•</span> {t("nowBullet4")}</li>
                </ul>

                {/* HandStar doodle at bottom right */}
                <div className="absolute bottom-3 right-3 text-black/20">
                  <HandStar className="w-7 h-7 rotate-45" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ================= SECTION 2: MIDDLE QUOTE & CHECKLIST ================= */}
        <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-8 mt-12 items-center bg-[#EAE7DF]/10 p-6 md:p-8 rounded-3xl border border-black/5 relative overflow-hidden">
          
          {/* Top Left: Small Floating Doodle "Ship something perfect ->" */}
          <div className="absolute top-2 left-[25%] -rotate-6 select-none hidden lg:block text-black/60">
            <p className="font-gloria text-xs font-bold text-center leading-none">
              Ship something<br />perfect
            </p>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              className="w-5 h-5 mx-auto mt-1 text-black/50 rotate-120"
            >
              <path d="M12 5c2 4 4 9 1 14" />
              <path d="M17 14l-4 5l1 -5" />
            </svg>
          </div>

          {/* LEFT COLUMN: Large Quote */}
          <div className="relative">
            <span className="absolute top-[-20px] left-0 text-blue-500/30 text-8xl font-serif select-none">“</span>
            <div className="pl-8 pt-4 space-y-4">
              <h2 className="font-sans text-2xl md:text-3.5xl font-black text-gray-800 leading-relaxed">
                {t("codingQuote1") || "写代码是手段，"}
                <br />
                <span className="relative inline-block mt-1">
                  {t("codingQuote2") || "思考与解决问题才是目的。"}
                  {/* Blue sketchy highlight stroke */}
                  <svg
                    viewBox="0 0 100 12"
                    preserveAspectRatio="none"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="absolute -bottom-2 left-0 w-full h-3 text-blue-500/60"
                  >
                    <path d="M3 8c15-2 35-3 55-3.5c18-0.5 31 0.8 39 2.5" />
                  </svg>
                </span>
              </h2>
            </div>

            {/* Recent deep dive block */}
            <div className="mt-8 flex flex-wrap items-center gap-3 pl-8">
              <span className="font-gloria text-sm font-bold text-gray-500 flex items-center gap-1.5 select-none">
                {t("recentDeepDive") || "Recent deep dive ➔"}
              </span>
              {/* Black tape strip with bold text */}
              <div
                className="relative inline-flex flex-col items-center justify-center px-6 py-2.5 text-white bg-[#111111] font-sans font-bold select-none text-xs tracking-wider rounded shadow-md -rotate-1"
                style={{
                  clipPath:
                    "polygon(0.5% 8%, 98% 3%, 99.5% 42%, 97.5% 88%, 85% 91%, 50% 86%, 15% 92%, 1% 48%)",
                }}
              >
                <p className="text-[13px] font-black tracking-wide">
                  {t("deepDiveTitle") || "边界，才是系统的起点。"}
                </p>
                {locale === "zh" && (
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5 opacity-85">
                    Boundary is the beginning of a system.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: "CURRENTLY INTO" */}
          <div className="space-y-4 bg-white border-2 border-black rounded-2xl p-5 md:p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] relative select-none">
            {/* Corner sticker star */}
            <div className="absolute top-2 right-2 text-[#C84B31]/35">
              <HandStar className="w-5 h-5 rotate-45" />
            </div>
            
            <p className="font-sans text-xs font-black tracking-wider text-gray-400 uppercase">
              {t("currentlyInto")}
            </p>
            
            <div className="space-y-2">
              {checklist.map(({ id, checked, labelKey }) => (
                <HandCheckbox
                  key={id}
                  id={id}
                  checked={checked}
                  onChange={() => toggleCheck(id)}
                  label={t(labelKey)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ================= SECTION 3: RECENTLY ON BLOG & TECH BOUNDARY ================= */}
        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-12 mt-12 items-start">
          
          {/* LEFT: "RECENTLY ON THE BLOG" Lined Card */}
          <div className="relative bg-[#FAFAF8] border-2 border-black rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-[-0.5deg]">
            {/* Taped label on top */}
            <div className="absolute top-[-16px] left-6">
              <DuctTape className="rotate-1 bg-blue-600 px-4 py-1.5 shadow-[1px_2px_4px_rgba(0,0,0,0.15)] text-[10px]">
                {t("recentlyOnBlog") || "RECENTLY ON THE BLOG"}
              </DuctTape>
            </div>

            <div className="space-y-5 pt-2">
              <div className="divide-y-2 divide-dashed divide-gray-300/60 font-sans">
                {posts.length === 0 ? (
                  <p className="text-gray-500 font-sans py-4">No posts found. Please publish some posts first!</p>
                ) : (
                  posts.slice(0, 4).map((post) => (
                    <div key={post.slug} className="py-4 first:pt-0 last:pb-0 group">
                      <Link href={`/blog/${post.slug}`} className="flex justify-between items-baseline gap-4 group">
                        <h3 className="font-sans font-bold text-[15px] md:text-[16px] text-gray-800 group-hover:text-blue-600 group-hover:underline transition-colors leading-snug">
                          {post.title}
                        </h3>
                        <span className="font-sans text-[11px] font-bold text-[#C84B31] shrink-0 select-none">
                          {formatDate(post.date)}
                        </span>
                      </Link>
                    </div>
                  ))
                )}
              </div>

              {/* Handwriting Link to Blog list */}
              <div className="pt-2 text-right select-none">
                <Link
                  href="/blog"
                  className="font-gloria text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors inline-block relative py-1"
                >
                  {t("viewAllPosts")}
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT: Quote + Mountain illustration card */}
          <div className="relative bg-[#FCFBF7] border-2 border-black rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-1 flex flex-col justify-between min-h-[420px]">
            {/* Scotch tape top center */}
            <div className="absolute top-[-10px] left-[15%]">
              <ScotchTape className="rotate-12" />
            </div>

            {/* Quote content */}
            <div className="relative mb-4">
              <span className="absolute top-[-15px] left-0 text-gray-300 text-6xl font-serif select-none">“</span>
              <p className="font-sans text-lg md:text-xl font-bold text-gray-800 leading-relaxed pl-6 relative z-10">
                {t("techBoundaryQuote") || "技术的边界，从来不是由工具决定的，而是由思维的深度 and 广度决定。"}
              </p>
              <span className="absolute bottom-[-20px] right-2 text-gray-300 text-6xl font-serif select-none">”</span>
            </div>

            {/* Hand-drawn System Blueprint Sketch - adding immense technical depth and filling content */}
            <div className="relative my-4 p-2 bg-white/40 border border-dashed border-gray-400/40 rounded-xl select-none -rotate-1 hover:rotate-0 transition-transform duration-300">
              <SystemArchitectureSketch />
              <div className="absolute top-1.5 right-2.5 font-gloria text-[8px] text-gray-400 uppercase tracking-widest rotate-6">
                Blueprint v2.4
              </div>
            </div>

            {/* Hand-drawn Mountain SVG Outline */}
            <div className="relative pt-6 border-t border-black/5">
              <svg
                viewBox="0 0 200 80"
                className="w-full h-auto text-black/40 fill-none stroke-current"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M 20 70 L 80 20 L 130 70" />
                <path d="M 80 20 L 95 35 L 90 40 L 105 55 L 100 60 L 110 70" />
                <path d="M 90 70 L 140 30 L 190 70" />
                <path d="M 140 30 L 150 42 L 145 47 L 160 62 L 170 70" />
                <path d="M 50 45 L 60 70 M 60 37 L 72 70 M 70 28 L 82 70" />
                <path d="M 115 50 L 125 70 M 125 42 L 135 70 M 135 34 L 145 70" />
                <path d="M 10 70 L 190 70" />
              </svg>

              {/* Floating label "Focus on what matters" */}
              <div className="absolute bottom-3 right-[5%] flex items-center gap-1.5 -rotate-6 select-none text-black/60">
                <svg
                  viewBox="0 0 40 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="w-8 h-8 rotate-120 text-black/50"
                >
                  <path d="M 10 5 C 14 12, 18 20, 15 28" />
                  <path d="M 10 24 L 15 29 L 20 24" />
                </svg>
                <p className="font-gloria text-xs font-bold leading-none bg-yellow-200/40 px-1 py-0.5 rounded">
                  {t("focusOnWhatMatters") || "Focus on what matters."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SECTION 4: THREE BOTTOM COLUMNS ================= */}
        <div className="grid md:grid-cols-3 gap-8 mt-12 items-start">
          
          {/* Column 1: CURRENTLY THINKING */}
          <div className="relative bg-[#FAFAF8] border-2 border-black rounded-2xl p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] -rotate-1 min-h-[340px] flex flex-col justify-between">
            {/* Badge on top */}
            <div className="absolute top-[-16px] left-6">
              <DuctTape className="-rotate-1 bg-[#1A1A1A] text-[9px] px-3">
                {t("currentlyThinking")}
              </DuctTape>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-500 animate-pulse" />
                <h3 className="font-sans font-black text-lg text-gray-900">
                  {t("whatsNext")}
                </h3>
              </div>
              <p className="font-sans text-[13px] md:text-sm font-semibold text-gray-600 leading-relaxed">
                {t("whatsNextText")}
              </p>
            </div>

            {/* Hand-drawn arrow pointing right */}
            <div className="pt-4 text-right pr-2">
              <svg
                viewBox="0 0 48 24"
                className="w-12 h-6 text-black/30 inline-block rotate-[-5deg]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M 4 12 L 40 12" />
                <path d="M 32 6 L 40 12 L 32 18" />
              </svg>
            </div>
          </div>

          {/* Column 2: NOW READING */}
          <div className="relative bg-[#FCFBF7] border-2 border-black rounded-2xl p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] rotate-[0.5deg] min-h-[340px] flex flex-col justify-between">
            {/* Badge on top */}
            <div className="absolute top-[-16px] left-[35%]">
              <DuctTape className="rotate-2 bg-blue-600 text-[9px] px-4">
                {t("nowReading")}
              </DuctTape>
            </div>

            <div className="flex flex-col items-center pt-4 space-y-3">
              {/* O'Reilly Book Cover Mimic */}
              <div className="relative w-28 h-40 bg-white border-2 border-black rounded-lg shadow-[3px_4px_8px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col justify-between p-2 select-none -rotate-2 hover:rotate-0 transition-transform">
                {/* Metallic PaperClip on top edge of book to look clipped onto the lined card */}
                <div className="absolute top-[-4px] left-3 z-20">
                  <PaperClip className="rotate-12 w-4 h-8 text-gray-800" />
                </div>
                {/* Scotch tape on top edge of book */}
                <ScotchTape className="top-[-8px] inset-x-0 mx-auto w-12 h-5 opacity-80" />
                
                <div className="absolute inset-0 bg-[#F4F3EF] flex flex-col justify-between p-2">
                  <div className="border-b border-black/15 pb-1">
                    <p className="text-[7px] font-sans font-black text-red-600 tracking-wider uppercase scale-90 origin-left">O'REILLY</p>
                  </div>
                  <div className="flex-1 flex flex-col justify-center my-1.5">
                    <p className="text-[9px] font-sans font-extrabold leading-tight text-gray-800 line-clamp-3">
                      Designing Data-Intensive Applications
                    </p>
                    {/* Sketchy bird SVG */}
                    <svg viewBox="0 0 40 40" className="w-10 h-10 mx-auto my-1.5 text-gray-700/60 fill-none stroke-current" strokeWidth="1.5">
                      <path d="M10 25 C12 20 18 15 24 18 C30 21 32 28 26 32 C20 36 12 32 10 25 Z" />
                      <path d="M18 16 C22 12 28 10 32 14" />
                      <path d="M26 18 C28 20 29 22 28 24" />
                    </svg>
                  </div>
                  <div className="border-t border-black/15 pt-1">
                    <p className="text-[6px] font-sans font-black text-gray-500 scale-90 origin-left">Martin Kleppmann</p>
                  </div>
                </div>
              </div>

              {/* Author & Title labels */}
              <div className="text-center">
                <p className="font-sans text-xs font-black text-gray-900 leading-tight">
                  Designing Data-Intensive Applications
                </p>
                <p className="font-sans text-[10px] text-gray-400 font-bold mt-1">
                  Martin Kleppmann
                </p>
              </div>
            </div>

            {/* Reading Progress bar */}
            <div className="space-y-1.5 pt-2 select-none">
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
                <span className="uppercase tracking-widest">Progress</span>
                <span>62%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 border border-black rounded-full overflow-hidden p-0.5">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: "62%" }} />
              </div>
            </div>
          </div>

          {/* Column 3: ON MY MIND */}
          <div className="relative bg-[#FAFAF8] border-2 border-black rounded-2xl p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] rotate-1 min-h-[340px] flex flex-col justify-between">
            {/* Badge on top */}
            <div className="absolute top-[-16px] left-6">
              <DuctTape className="-rotate-1 bg-[#1A1A1A] text-[9px] px-3.5">
                {t("onMyMind")}
              </DuctTape>
            </div>

            {/* Mind list */}
            <div className="space-y-3 pt-4 select-none">
              {onMyMind.map(({ id, checked, labelKey }) => (
                <HandCheckbox
                  key={id}
                  id={id}
                  checked={checked}
                  onChange={() => toggleMindCheck(id)}
                  label={t(labelKey)}
                />
              ))}
            </div>

            {/* Smile face & Progress Over Perfection tape */}
            <div className="relative pt-6 flex justify-between items-end">
              {/* Arrow and smiley */}
              <div className="flex items-center gap-1 -rotate-6 select-none text-black/50 pl-2">
                <svg
                  viewBox="0 0 40 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="w-7 h-7 rotate-15 text-black/30"
                >
                  <path d="M 5 25 C 10 18, 18 14, 25 18" />
                  <path d="M 20 12 L 27 17 L 22 24" />
                </svg>
                {/* Hand-drawn Smiley */}
                <svg viewBox="0 0 40 40" className="w-9 h-9 text-blue-500 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M 12 21 C 12 29, 28 29, 28 21" /> {/* Smile */}
                  <circle cx="16" cy="15" r="2" fill="currentColor" />
                  <circle cx="24" cy="15" r="2" fill="currentColor" />
                  <path d="M 5 20 C 5 11, 35 11, 35 20 C 35 29, 5 29, 5 20" strokeDasharray="1 1" className="opacity-15" />
                  <path d="M 4 20 C 4 9, 36 9, 36 20 C 36 31, 4 31, 4 20" />
                </svg>
              </div>

              {/* DuctTape Sticker: Progress > Perfection */}
              <DuctTape className="bg-amber-600/90 text-[9px] px-3 py-1 -rotate-3 shadow-sm tracking-wide">
                {t("progressOverPerfection") || "Progress > Perfection."}
              </DuctTape>
            </div>
          </div>
        </div>

        {/* ================= SECTION 5: FOOTER (LATEST TWEET, WEEKLY LOG, LAST UPDATED) ================= */}
        <div className="border-t-2 border-dashed border-black/15 pt-12 mt-16 grid md:grid-cols-[1.2fr_1fr_1fr] gap-8 items-start select-none">
          
          {/* Footer Col 1: LATEST TWEET */}
          <div className="space-y-3 bg-[#EAE7DF]/10 border border-black/5 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-gray-800 fill-current"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="font-sans text-[10px] font-black tracking-widest text-gray-400 uppercase">
                {t("latestTweet")}
              </span>
            </div>
            <p className="font-sans text-[12px] md:text-[13px] font-bold text-gray-600 leading-relaxed italic">
              "{t("tweetQuote")}"
            </p>
          </div>

          {/* Footer Col 2: WEEKLY LOG */}
          <div className="space-y-3.5 pl-2">
            <span className="font-sans text-[10px] font-black tracking-widest text-gray-400 uppercase">
              {t("weeklyLog")}
            </span>
            <div className="space-y-2 font-sans text-xs text-gray-500 font-bold">
              <div className="flex items-baseline justify-between border-b border-dashed border-gray-300/40 pb-1">
                <span className="text-[#C84B31]">May 18 - 24</span>
                <span className="text-gray-700">{t("log1")}</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-dashed border-gray-300/40 pb-1">
                <span className="text-gray-400">May 11 - 17</span>
                <span className="text-gray-700">{t("log2")}</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-dashed border-gray-300/40 pb-1">
                <span className="text-gray-400">May 04 - 10</span>
                <span className="text-gray-700">{t("log3")}</span>
              </div>
            </div>
          </div>

          {/* Footer Col 3: LAST UPDATED & COPYRIGHT */}
          <div className="space-y-4 relative pr-16 min-h-[100px] flex flex-col justify-between md:text-right md:items-end">
            <div className="space-y-1">
              <span className="font-sans text-[10px] font-black tracking-widest text-gray-400 uppercase">
                {t("lastUpdated")}
              </span>
              <p className="font-sans text-sm font-black text-gray-800">
                May 20, 2026
              </p>
            </div>

            <p className="font-sans text-[11px] font-bold text-gray-400 leading-tight">
              © 2026 Kerwin.
              <br className="hidden md:block" />
              All rights reserved.
            </p>

            {/* Giant Circular O. Stamp Stamp on Bottom Right corner */}
            <div className="absolute right-2 bottom-[-10px] select-none text-black/5 pointer-events-none">
              <svg viewBox="0 0 100 100" className="w-24 h-24 stroke-current fill-none" strokeWidth="8">
                <circle cx="50" cy="50" r="40" strokeDasharray="3 3" className="opacity-20" />
                <circle cx="50" cy="50" r="40" strokeWidth="10" />
                <path d="M 50 15 C 50 15, 20 50, 50 85 C 50 85, 80 50, 50 15 Z" strokeWidth="2" className="opacity-20" />
                {/* Inner text O. */}
                <text x="50" y="63" fontSize="40" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" fill="currentColor">O.</text>
              </svg>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

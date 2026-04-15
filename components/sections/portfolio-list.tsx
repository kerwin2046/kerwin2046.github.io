"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

const DEFAULT_SHOW_COUNT = 2

type ProjectConfig = {
  titleKey: "project1Title" | "project2Title" | "project3Title" | "project4Title" | "project5Title" | "project6Title"
  descKey: "project1Desc" | "project2Desc" | "project3Desc" | "project4Desc" | "project5Desc" | "project6Desc"
  tagKey: "project1Tag" | "project2Tag" | "project3Tag" | "project4Tag" | "project5Tag" | "project6Tag"
  logo: string
  bgColor: string
  illustration: string
  url?: string
}

export function PortfolioList({ projects }: { projects: ProjectConfig[] }) {
  const t = useTranslations("portfolio")
  const [showAll, setShowAll] = useState(false)
  const list = showAll ? projects : projects.slice(0, DEFAULT_SHOW_COUNT)
  const hasMore = projects.length > DEFAULT_SHOW_COUNT

  return (
    <>
      <div className="space-y-8 mb-12">
        {list.map((project, index) => (
          <div
            key={index}
            className="group grid md:grid-cols-2 bg-white border-[3px] border-black rounded-[32px] overflow-hidden hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <div className="p-6 md:p-12 flex flex-col justify-center bg-white">
              <div className="flex items-center gap-3 mb-6">
                <Image
                  src={project.logo || "/placeholder.svg"}
                  alt={t(project.titleKey)}
                  width={120}
                  height={32}
                  className="h-6 md:h-8 w-auto"
                />
              </div>
              <span className="inline-block bg-black text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 w-fit">
                {t(project.tagKey)}
              </span>
              <h3 className="text-xl md:text-[28px] font-bold mb-4 leading-tight md:leading-[40px] text-[#0B0B0B]">
                {t(project.titleKey)}
              </h3>
              <p className="text-base md:text-[18px] text-[#393939] mb-8 leading-relaxed md:leading-[30px] font-medium">
                {t(project.descKey)}
              </p>
              <a
                href={project.url ?? "#"}
                target={project.url ? "_blank" : undefined}
                rel={project.url ? "noopener noreferrer" : undefined}
                className="flex items-center gap-2 font-semibold text-[#0B0B0B] hover:gap-3 transition-all text-sm md:text-base"
              >
                {t("viewCase")}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div
              className={`${project.bgColor} relative overflow-hidden min-h-[250px] md:min-h-[500px]`}
            >
              <Image
                src={project.illustration || "/placeholder.svg"}
                alt={t(project.titleKey)}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="bg-black text-white px-6 md:px-8 py-4 md:py-5 rounded-[12px] font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto text-sm md:text-base"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {showAll ? t("showLess") : t("browseAll")}
          </button>
        </div>
      )}
    </>
  )
}

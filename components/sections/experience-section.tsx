import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"

const EXPERIENCE_KEYS = [
  {
    periodKey: "exp1Period",
    titleKey: "exp1Title",
    descKey: "exp1Desc",
    icon: "/images/agency.png",
    roleTagsKey: "exp1RoleTags" as const,
    mottoKey: "exp1Motto" as const,
  },
  {
    periodKey: "exp2Period",
    titleKey: "exp2Title",
    descKey: "exp2Desc",
    icon: "/images/company.png",
    roleTagsKey: "exp2RoleTags" as const,
    mottoKey: "exp2Motto" as const,
  },
  {
    periodKey: "exp3Period",
    titleKey: "exp3Title",
    descKey: "exp3Desc",
    icon: "/images/busines.png",
    roleTagsKey: "exp3RoleTags" as const,
    mottoKey: "exp3Motto" as const,
  },
  {
    periodKey: "exp4Period",
    titleKey: "exp4Title",
    descKey: "exp4Desc",
    icon: "/images/startup.png",
    roleTagsKey: "exp4RoleTags" as const,
    mottoKey: "exp4Motto" as const,
  },
] as const

export async function ExperienceSection() {
  const t = await getTranslations("experience")

  return (
    <section className="bg-black py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div className="text-white pt-0 md:pt-12 md:sticky md:top-12 self-start">
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 md:mb-8 leading-[1.3]">
              {t("heading")} <span className="bg-[#6366F1] text-white px-3 py-1 inline-block">{t("headingHighlight")}</span>
            </h2>
            <p className="text-gray-400 mb-8 md:mb-10 leading-relaxed text-base md:text-lg">
              {t("subtitle")}
            </p>
            <Button asChild className="bg-white text-black hover:bg-gray-50 rounded-lg py-5 px-8 md:py-[22px] md:px-[62px] text-base md:text-lg font-semibold h-auto w-full sm:w-auto sm:min-w-[240px]">
              <Link href="/blog">
                <FileText className="w-5 h-5" />
                {t("toBlog")}
              </Link>
            </Button>
          </div>

          <div className="space-y-6">
            {EXPERIENCE_KEYS.map((exp, index) => (
              <div key={index} className="bg-white border-4 border-black rounded-3xl min-h-[220px] md:min-h-[240px]">
                <div className="flex items-center justify-between mb-4 md:mb-6 pt-6 md:pt-8 px-6 md:px-8">
                  <div className="text-base md:text-[22px] leading-tight md:leading-[34px] font-bold text-[#0B0B0B]">{t(exp.periodKey)}</div>
                  <div className="rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Image src={exp.icon || "/placeholder.svg"} alt={t(exp.titleKey)} width={48} height={48} className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full" />
                  </div>
                </div>
                <div className="border-t-[3px] border-black mb-4 md:mb-6" />
                <div className="px-6 md:px-8 pb-6 md:pb-8">
                  <h3 className="text-xl md:text-[28px] leading-tight md:leading-[40px] font-bold text-[#0B0B0B] mb-2 md:mb-3">{t(exp.titleKey)}</h3>
                  {"roleTagsKey" in exp && exp.roleTagsKey && (
                    <p className="text-sm md:text-base text-[#6366F1] font-medium mb-3 md:mb-4 tracking-wide">
                      {t(exp.roleTagsKey)}
                    </p>
                  )}
                  <p className="text-[#393939] text-base md:text-[20px] leading-relaxed md:leading-[32px]">{t(exp.descKey)}</p>
                  {"mottoKey" in exp && exp.mottoKey && (
                    <blockquote className="mt-4 md:mt-5 pl-4 md:pl-5 border-l-4 border-[#6366F1] text-[#393939] text-sm md:text-base italic bg-[#F5F5F5] py-2 pr-2 rounded-r-lg">
                      {t(exp.mottoKey)}
                    </blockquote>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

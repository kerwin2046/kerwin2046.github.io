import { getTranslations } from "next-intl/server"
import { PortfolioList } from "./portfolio-list"

const PROJECTS = [
  {
    titleKey: "project6Title" as const,
    descKey: "project6Desc" as const,
    tagKey: "project6Tag" as const,
    logo: "/images/agency.png",
    bgColor: "bg-[#0F766E]",
    illustration: "/images/ci.png",
    url: "https://strat-agents.vercel.app/",
  },
  {
    titleKey: "project5Title" as const,
    descKey: "project5Desc" as const,
    tagKey: "project5Tag" as const,
    logo: "/images/startup.png",
    bgColor: "bg-[#0F766E]",
    illustration: "/images/hero-screenshot.png",
    url: "https://github.com/adnaan-worker/adnify",
  },
  {
    titleKey: "project4Title" as const,
    descKey: "project4Desc" as const,
    tagKey: "project4Tag" as const,
    logo: "/images/agency.png",
    bgColor: "bg-[#7C3AED]",
    illustration: "/images/undraw_settings_alfp.svg",
  },
  {
    titleKey: "project3Title" as const,
    descKey: "project3Desc" as const,
    tagKey: "project3Tag" as const,
    logo: "/images/company.png",
    bgColor: "bg-[#00A1E0]",
    illustration: "/images/studio-workspace.svg",
  },
  {
    titleKey: "project2Title" as const,
    descKey: "project2Desc" as const,
    tagKey: "project2Tag" as const,
    logo: "/images/venture-logo.svg",
    bgColor: "bg-[#2F81F7]",
    illustration: "/images/venture-workspace.svg",
  },
  {
    titleKey: "project1Title" as const,
    descKey: "project1Desc" as const,
    tagKey: "project1Tag" as const,
    logo: "/images/studio-logo.svg",
    bgColor: "bg-[#6366F1]",
    illustration: "/images/studio-workspace.svg",
  },
]

export async function PortfolioSection() {
  const t = await getTranslations("portfolio")

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        <div id="portfolio" className="text-center mb-12 scroll-mt-24">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {t("heading")} <br />
            <span className="bg-[#FFC224] text-black px-3 py-1 inline-block">{t("headingHighlight")}</span>
          </h2>
        </div>

        <PortfolioList projects={PROJECTS} />
      </div>
    </section>
  )
}

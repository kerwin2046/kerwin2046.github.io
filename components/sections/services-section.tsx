import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { siteConfig } from "@/config/site"
import { getTranslations } from "next-intl/server"

const SERVICE_KEYS = [
  { key: "frontend", image: "/images/web-design.svg" },
  { key: "backend", image: "/images/ui-ux-design.svg" },
  { key: "fullstack", image: "/images/product-design.svg" },
  { key: "devops", image: "/images/user-research.svg" },
  { key: "writing", image: "/images/motion-graphics.svg" },
] as const

export async function ServicesSection() {
  const t = await getTranslations("services")

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-[52px] md:leading-[60px] font-bold mb-4">
              {t("heading")} <span className="bg-[#FF4A60] text-white px-3 py-1 inline-block">{t("headingHighlight")}</span>
            </h2>
            <p className="text-[#393939] text-base md:text-lg font-medium leading-relaxed md:leading-[30px] max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_KEYS.map(({ key, image }) => (
              <div
                key={key}
                className="bg-white border-[3px] border-black rounded-[32px] overflow-hidden hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 min-h-[480px] flex flex-col group"
              >
                <div className="mb-6 -mx-[3px] -mt-[3px] overflow-hidden rounded-t-[29px]">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={t(`${key}`)}
                    width={382}
                    height={328}
                    className="w-full h-auto rounded-t-[29px] group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                </div>
                <div className="px-8 pb-8 flex-1 flex flex-col">
                  <h3 className="text-[28px] leading-[40px] font-bold mb-3 text-[#0B0B0B]">{t(key)}</h3>
                  <p className="text-[18px] leading-[30px] font-medium text-[#393939]">{t(`${key}Desc`)}</p>
                </div>
              </div>
            ))}

            <div className="bg-[#FFC224] border-[3px] border-black rounded-[32px] p-8 md:p-12 flex flex-col items-center justify-center text-center hover:translate-y-[-4px] transition-transform min-h-[480px] relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="mb-8">
                <Image src="/images/get-in-touch.svg" alt={t("getInTouch")} width={92} height={92} className="w-[92px] h-[92px]" />
              </div>
              <h3 className="text-[28px] leading-[40px] font-bold mb-4 text-[#0B0B0B]">{t("contactTitle")}</h3>
              <p className="text-[18px] leading-[30px] font-medium text-[#393939] mb-8">
                {t("contactDesc")}
              </p>
              <Button asChild className="bg-black text-white hover:bg-black/90 rounded-[16px] px-12 py-6 font-medium text-[18px] w-full max-w-[340px] h-[64px]">
                <a href={`mailto:${siteConfig.author.email}`}>
                  <Mail className="w-5 h-5 mr-2" />
                  {t("getInTouch")}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const MARQUEE_ITEMS = [
  { logo: "/logos/application.svg", alt: "application" },
  { logo: "/logos/business.svg", alt: "business" },
  { logo: "/logos/company.svg", alt: "company" },
  { logo: "/logos/startup.svg", alt: "startup" },
  { logo: "/logos/venture.svg", alt: "venture" },
  { logo: "/logos/agency.svg", alt: "agency" },
]

export function LogoMarquee() {
  return (
    <div className="overflow-hidden">
      <div className="relative overflow-hidden bg-black py-16 -rotate-[5deg] mt-32 mb-16 min-w-[120vw] -mx-[10vw] left-0">
        <div className="flex items-center gap-16 animate-marquee whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, index) => (
            <img key={index} src={item.logo || "/placeholder.svg"} alt={item.alt} className="h-12 w-auto" />
          ))}
        </div>
      </div>
    </div>
  )
}

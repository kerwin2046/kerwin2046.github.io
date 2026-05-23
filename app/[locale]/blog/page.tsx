import { Caveat, Special_Elite, Gloria_Hallelujah } from "next/font/google"
import { ProfileNavigation } from "@/components/sections/profile-navigation"
import { getPosts, getCategories } from "@/lib/content/blog"
import { Button } from "@/components/ui/button"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { BlogList } from "@/components/blog/blog-list"
import { HandArrowDown, HandStar } from "@/components/ui/scrapbook-decorations"

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
})

const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-typewriter",
  display: "swap",
})

const gloriaHallelujah = Gloria_Hallelujah({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gloria",
  display: "swap",
})

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "blog" })
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
  }
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "blog" })
  const posts = getPosts()
  const categories = getCategories()

  return (
    <main
      className={`min-h-screen bg-[#F4F1EA] text-gray-900 relative overflow-hidden pb-24 md:pb-32 ${caveat.variable} ${specialElite.variable} ${gloriaHallelujah.variable}`}
    >
      {/* 3D Paper Texture Overlay (SVG Noise) */}
      <div className="fixed inset-0 pointer-events-none z-40 opacity-[0.06] mix-blend-multiply select-none">
        <svg className="w-full h-full">
          <filter id="scrapbookNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#scrapbookNoise)" />
        </svg>
      </div>

      <ProfileNavigation />

      <section className="container mx-auto px-4 py-12 md:py-16 relative">
        {/* Floating Doodles */}
        {/* Top Right: Annotation "Let's build something great!" */}
        <div className="hidden lg:block absolute top-[4%] right-[5%] rotate-[8deg] text-black/80 select-none pointer-events-none">
          <p className="font-gloria text-base font-bold leading-none max-w-[130px] text-center">
            {locale === "zh" ? "来，一起造点\n好玩的东西！" : "Let's build\nsomething\ngreat!"}
          </p>
          <svg
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-12 h-10 mt-2 mx-auto text-black/60 rotate-[45deg]"
          >
            <path d="M12 40c6-10 16-16 26-14" />
            <path d="M30 20c4 3 6.5 6.5 8 10c-3.5 1-7.5 1-11 .5" />
          </svg>
        </div>

        {/* Left Side: Annotation "Focus on what matters" */}
        <div className="hidden xl:block absolute top-[25%] left-[2%] rotate-[-4deg] text-black/75 select-none pointer-events-none">
          <div className="bg-white/40 border-2 border-dashed border-black/20 p-4 rounded-xl shadow-[2px_2px_8px_rgba(0,0,0,0.03)] max-w-[160px]">
            <p className="font-gloria text-base font-bold text-center leading-tight">
              {locale === "zh" ? "聚焦于\n真正重要的事" : "Focus on\nwhat matters."}
            </p>
            {/* Hand scribble underline */}
            <svg
              viewBox="0 0 100 12"
              preserveAspectRatio="none"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              className="w-full h-3 mt-1.5 text-blue-500/60"
            >
              <path d="M4 8c12-2 28-3.5 45-4c15-0.5 25 1 32 3.5" />
            </svg>
          </div>
        </div>

        {/* Left Bottom: Annotation "Ship > Perfect" */}
        <div className="hidden xl:block absolute bottom-[15%] left-[3%] rotate-[5deg] text-black/70 select-none pointer-events-none">
          <div className="flex flex-col items-center">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-12 h-12 text-black/50 rotate-[30deg]"
            >
              <path d="M10 10c5 10 10 18 18 24" />
              <path d="M18 32c4 1 7.5 1.5 11.5.5c-1-3.5-1.5-7.5-1.5-11.5" />
            </svg>
            <p className="font-gloria text-lg font-bold leading-none mt-2 bg-yellow-200/50 px-2 py-1 rotate-[-2deg]">
              Ship &gt; Perfect
            </p>
          </div>
        </div>

        {/* Right Middle: HandStar Doodle */}
        <div className="hidden lg:block absolute top-[40%] right-[4%] text-black/20 select-none pointer-events-none">
          <HandStar className="w-10 h-10 rotate-12" />
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Header area with custom typewriter and hand-drawn accents */}
          <div className="text-center mb-14 relative select-none">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 inline-block font-sans">
              {t("title")}
            </h1>
            {/* Artistic Highlighter brush underline on the title */}
            <div className="h-4 w-[280px] md:w-[420px] bg-yellow-300/60 absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 -z-10 rounded-full blur-[1px]" />

            <p className="text-gray-600 text-base md:text-xl font-mono mt-6 font-bold max-w-xl mx-auto font-typewriter">
              {t("subtitle")}
            </p>
          </div>

          {posts.length === 0 ? (
            <p className="text-gray-500 font-mono text-center py-12">{t("noPosts")}</p>
          ) : (
            <BlogList posts={posts} categories={categories} />
          )}

          <div className="mt-16 text-center select-none">
            {/* Back Home Sketchy Button */}
            <Link
              href="/"
              className="relative inline-flex items-center justify-center px-10 py-4 text-base font-bold text-gray-800 bg-white border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-px active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-mono"
            >
              <span>{locale === "zh" ? "返回首页" : "Back to Home"}</span>
              <span className="font-mono text-gray-400 ml-1.5">➔</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

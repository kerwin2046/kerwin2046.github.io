import { Caveat, Special_Elite, Gloria_Hallelujah } from "next/font/google"
import { ProfileNavigation } from "@/components/sections/profile-navigation"
import { ScrapbookProfileDashboard } from "@/components/sections/scrapbook-profile-dashboard"
import { getPosts } from "@/lib/content/blog"

/* 原有电影感首页组件备份，已根据需要先注释掉
import { CinematicHeroSection } from "@/components/sections"
*/

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
  return {
    title: locale === "zh" ? "关于我 · Kerwin" : "Profile · Kerwin",
    description: locale === "zh" ? "TS 全栈工程师 Kerwin 的手账风格个人简介。" : "TS Full-Stack Engineer Kerwin's scrapbook-style personal profile.",
  }
}

export default async function Home() {
  const latestPosts = getPosts(3)

  return (
    <main
      className={`min-h-screen bg-[#F4F1EA] text-gray-900 relative overflow-hidden pb-20 md:pb-28 ${caveat.variable} ${specialElite.variable} ${gloriaHallelujah.variable}`}
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

      <ScrapbookProfileDashboard posts={latestPosts} />

      {/* 原有电影感首页结构已在此处注释
      <CinematicHeroSection />
      */}
    </main>
  )
}

import { CinematicHeroSection } from "@/components/sections"

/* 首页其余区块暂注释，需要时逐段取消注释即可。
import { Navigation } from "@/components/layout"
import {
  PhilosophySection,
  FeaturedProductsSection,
  LandingTechnologySection,
  LandingGallerySection,
  CollectionSection,
  EditorialSection,
  LandingStatementSection,
  LandingFooterSection,
} from "@/components/template-landing"
*/

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <CinematicHeroSection />

      {/*
      <Navigation />
      <PhilosophySection />
      <FeaturedProductsSection />
      <LandingTechnologySection />
      <LandingGallerySection />
      <CollectionSection />
      <EditorialSection />
      <LandingStatementSection />
      <LandingFooterSection />
      */}
    </main>
  )
}

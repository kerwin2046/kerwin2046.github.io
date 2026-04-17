import { Navigation } from "@/components/layout"
import { CinematicHeroSection } from "@/components/sections"
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

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <CinematicHeroSection />
      <Navigation />
      <PhilosophySection />
      <FeaturedProductsSection />
      <LandingTechnologySection />
      <LandingGallerySection />
      <CollectionSection />
      <EditorialSection />
      <LandingStatementSection />
      <LandingFooterSection />
    </main>
  )
}

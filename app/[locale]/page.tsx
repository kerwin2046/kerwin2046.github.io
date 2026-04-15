import { Navigation, Footer } from "@/components/layout"
import {
  HeroSection,
  LogoMarquee,
  ServicesSection,
  AboutSection,
  PortfolioSection,
  ExperienceSection,
  TestimonialsSection,
  ArticlesSection,
} from "@/components/sections"
import { getPosts } from "@/lib/content/blog"

export default async function Home() {
  const latestPosts = getPosts(3)
  return (
    <main className="min-h-screen bg-[#FFFFFF]">
      <Navigation />
      <HeroSection />
      <LogoMarquee />
      <ServicesSection />
      <AboutSection />
      <PortfolioSection />
      <ExperienceSection />
      <TestimonialsSection />
      <ArticlesSection posts={latestPosts} />
      <Footer />
    </main>
  )
}

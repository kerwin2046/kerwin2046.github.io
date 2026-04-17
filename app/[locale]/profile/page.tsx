import { Navigation, Footer } from "@/components/layout"
import {
  ProfileHeroSection,
  LogoMarquee,
  ServicesSection,
  AboutSection,
  PortfolioSection,
  ExperienceSection,
  TestimonialsSection,
  ArticlesSection,
} from "@/components/sections"
import { getPosts } from "@/lib/content/blog"

export default async function ProfilePage() {
  const latestPosts = getPosts(3)
  return (
    <main className="min-h-screen bg-[#FFFFFF]">
      <Navigation />
      <ProfileHeroSection />
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

import { Navigation, Footer } from "@/components/layout"
import { getPosts, getCategories } from "@/lib/content/blog"
import { Button } from "@/components/ui/button"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { BlogList } from "@/components/blog/blog-list"

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
    <main className="min-h-screen bg-[#FFFFFF]">
      <Navigation />
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {t("title")}
          </h1>
          <p className="text-[#393939] text-base md:text-lg mb-12">
            {t("subtitle")}
          </p>

          {posts.length === 0 ? (
            <p className="text-gray-500">{t("noPosts")}</p>
          ) : (
            <BlogList posts={posts} categories={categories} />
          )}

          <div className="mt-12">
            <Button asChild variant="outline" className="border-[3px] border-black rounded-xl">
              <Link href="/">{t("backHome")}</Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NewsletterSignup } from "./newsletter-signup"
import type { PostMeta } from "@/types"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { ArticlesList } from "@/components/blog/articles-list"
import { getCategories } from "@/lib/content/blog"

interface ArticlesSectionProps {
  posts: PostMeta[]
}

export async function ArticlesSection({ posts }: ArticlesSectionProps) {
  const t = await getTranslations("articles")
  const categories = getCategories()

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">{t("title")}</h2>
          <Button asChild variant="outline" className="border-[3px] border-black rounded-xl px-4 md:px-6 py-4 md:py-6 hover:bg-gray-50 bg-white font-semibold text-sm md:text-base w-full sm:w-auto">
            <Link href="/blog">
              <Pencil className="w-4 h-4 mr-2" />
              {t("viewAll")}
            </Link>
          </Button>
        </div>

        {posts.length === 0 ? (
          <div className="border-[3px] border-black rounded-3xl p-12 text-center mb-16">
            <p className="text-gray-600 mb-4">{t("noPosts")}</p>
            <Button asChild variant="outline" className="border-[3px] border-black rounded-xl">
              <Link href="/blog">{t("toBlog")}</Link>
            </Button>
          </div>
        ) : (
          <ArticlesList posts={posts} categories={categories} />
        )}

        <NewsletterSignup />
      </div>
    </section>
  )
}

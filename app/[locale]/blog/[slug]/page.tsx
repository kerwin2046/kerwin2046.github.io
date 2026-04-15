import { notFound } from "next/navigation"
import { Navigation, Footer } from "@/components/layout"
import { getPostBySlug, getPostSlugs } from "@/lib/content/blog"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import type { Components } from "react-markdown"

const markdownComponents: Components = {
  h1: ({ children }) => <h1 className="text-2xl md:text-3xl font-bold mt-8 mb-4 text-[#0B0B0B]">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl md:text-2xl font-bold mt-8 mb-3 text-[#0B0B0B] scroll-mt-24">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg md:text-xl font-bold mt-6 mb-2 text-[#0B0B0B]">{children}</h3>,
  p: ({ children }) => <p className="text-[#393939] text-base md:text-lg leading-relaxed mb-4">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-6 my-4 space-y-2 text-[#393939]">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 my-4 space-y-2 text-[#393939]">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }) => (
    <a href={href} className="text-[#2F81F7] hover:underline" target={href?.startsWith("http") ? "_blank" : undefined} rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}>
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-bold text-[#0B0B0B]">{children}</strong>,
  code: ({ className, children }) => (
    <code className={className ? "text-sm" : "bg-[#F0F0F0] px-1.5 py-0.5 rounded text-sm"}>
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="bg-[#F5F5F5] border border-black/10 rounded-xl p-4 overflow-x-auto my-4 text-sm">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-8 border-t border-black/10" />,
  blockquote: ({ children }) => <blockquote className="border-l-4 border-[#6366F1] pl-4 py-2 my-4 bg-[#F8F8F8] rounded-r text-[#393939]">{children}</blockquote>,
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-black/10">
      <table className="w-full border-collapse text-left text-sm md:text-base">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-[#F0F0F0] font-semibold text-[#0B0B0B]">{children}</thead>,
  tbody: ({ children }) => <tbody className="text-[#393939]">{children}</tbody>,
  tr: ({ children }) => <tr className="border-b border-black/10 last:border-b-0">{children}</tr>,
  th: ({ children }) => <th className="px-4 py-3 text-left align-top">{children}</th>,
  td: ({ children }) => <td className="px-4 py-3 align-top">{children}</td>,
}

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const slugs = getPostSlugs()
  const { routing } = await import("@/i18n/routing")
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: "Not Found" }
  return {
    title: `${post.title} · Kerwin`,
    description: post.description,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const t = await getTranslations("blog")

  return (
    <main className="min-h-screen bg-[#FFFFFF]">
      <Navigation />
      <article className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <Button asChild variant="outline" className="mb-8 border-[3px] border-black rounded-xl">
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("backList")}
            </Link>
          </Button>

          {(() => {
            const coverSrc = post.image || `https://picsum.photos/seed/${encodeURIComponent(post.slug)}/800/450`
            return (
              <div className="relative w-full aspect-video bg-[#EDEDED] rounded-2xl overflow-hidden mb-8 border-[3px] border-black">
                <Image src={coverSrc} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 672px" />
                {post.tag && (
                  <span className="absolute top-4 right-4 bg-black text-white text-sm font-semibold px-4 py-2 rounded-lg">
                    {post.tag}
                  </span>
                )}
              </div>
            )
          })()}

          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {post.title}
            </h1>
            <p className="text-gray-600 text-base md:text-lg mb-2">
              {post.description}
            </p>
            <p className="text-gray-500 text-sm">
              {post.author} · {post.date}
            </p>
          </header>

          <div className="blog-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {post.content}
            </ReactMarkdown>
          </div>

          <div className="mt-12 pt-8 border-t border-black">
            <Button asChild variant="outline" className="border-[3px] border-black rounded-xl">
              <Link href="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("backList")}
              </Link>
            </Button>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  )
}

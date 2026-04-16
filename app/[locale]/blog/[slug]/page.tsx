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
import { MarkdownCodeBlock } from "@/components/blog/markdown-code-block"
import { Children, isValidElement, type ReactNode } from "react"
import { extractTocFromMarkdown, estimateReadingMinutes, slugifyHeading } from "@/lib/content/markdown-utils"
import { TocNav } from "@/components/blog/toc-nav"
import { ReadingProgress } from "@/components/blog/reading-progress"

function toPlainText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (!node) return ""
  if (Array.isArray(node)) return node.map(toPlainText).join("")
  if (isValidElement(node)) return toPlainText(node.props.children)
  return ""
}

function headingId(children: ReactNode): string {
  return slugifyHeading(toPlainText(children))
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mt-12 mb-5 text-[#0B0B0B]">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2
      id={headingId(children)}
      className="group text-2xl md:text-3xl font-bold tracking-tight leading-tight mt-10 mb-4 text-[#0B0B0B] scroll-mt-24"
    >
      {children}
      <a href={`#${headingId(children)}`} aria-label="Anchor" className="ml-2 text-[#9CA3AF] opacity-0 transition group-hover:opacity-100">
        #
      </a>
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      id={headingId(children)}
      className="group text-xl md:text-2xl font-semibold tracking-tight leading-tight mt-8 mb-3 text-[#0B0B0B] scroll-mt-24"
    >
      {children}
      <a href={`#${headingId(children)}`} aria-label="Anchor" className="ml-2 text-[#9CA3AF] opacity-0 transition group-hover:opacity-100">
        #
      </a>
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-[#393939] text-[17px] md:text-[18px] leading-8 mb-5 tracking-[0.01em]">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc marker:text-[#6366F1] pl-7 my-5 space-y-2.5 text-[#393939] text-[17px] md:text-[18px] leading-8">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal marker:text-[#6366F1] pl-7 my-5 space-y-2.5 text-[#393939] text-[17px] md:text-[18px] leading-8">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-8">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-[#2F81F7] underline underline-offset-4 decoration-[#2F81F7]/40 hover:decoration-[#2F81F7]"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-bold text-[#0B0B0B]">{children}</strong>,
  code: ({ className, children }) => {
    if (className) {
      return <code className={className}>{children}</code>
    }
    return (
      <code className="bg-[#F1F3F5] px-1.5 py-0.5 rounded-md text-[0.9em] font-medium text-[#1F2937]">
        {children}
      </code>
    )
  },
  pre: ({ children }) => {
    const firstChild = Children.toArray(children)[0]
    if (isValidElement(firstChild)) {
      const codeClassName = typeof firstChild.props.className === "string" ? firstChild.props.className : ""
      const codeText = typeof firstChild.props.children === "string"
        ? firstChild.props.children
        : Children.toArray(firstChild.props.children).join("")
      const languageMatch = /language-([\w-]+)/.exec(codeClassName)
      return <MarkdownCodeBlock code={codeText} language={languageMatch?.[1]} />
    }
    return <pre className="bg-[#F8FAFC] border border-black/10 rounded-xl p-5 overflow-x-auto my-6 text-[14px] leading-7">{children}</pre>
  },
  hr: () => <hr className="my-10 border-t border-black/10" />,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-[#6366F1] pl-5 py-3 my-6 bg-[#F8FAFF] rounded-r-md text-[#374151] text-[17px] md:text-[18px] leading-8">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="my-7 overflow-x-auto rounded-xl border border-black/10 bg-white">
      <table className="w-full border-collapse text-left text-[15px] md:text-base leading-7">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-[#F8FAFC] font-semibold text-[#0B0B0B]">{children}</thead>,
  tbody: ({ children }) => <tbody className="text-[#393939] bg-white">{children}</tbody>,
  tr: ({ children }) => <tr className="border-b border-black/10 last:border-b-0 hover:bg-[#FAFAFA]">{children}</tr>,
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
  const toc = extractTocFromMarkdown(post.content)
  const readingMinutes = estimateReadingMinutes(post.content)

  return (
    <main className="min-h-screen bg-[#FFFFFF]">
      <ReadingProgress />
      <Navigation />
      <article className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto flex w-full max-w-6xl items-start gap-10">
          <div className="max-w-3xl w-full xl:flex-1">
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
              {post.author} · {post.date} · {readingMinutes} min read
            </p>
          </header>

          <div className="blog-body max-w-none">
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
          <TocNav items={toc} />
        </div>
      </article>
      <Footer />
    </main>
  )
}

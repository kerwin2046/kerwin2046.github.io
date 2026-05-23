import { notFound } from "next/navigation"
import { ProfileNavigation } from "@/components/sections/profile-navigation"
import { getPostBySlug, getPostSlugs, getPosts } from "@/lib/content/blog"
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
import { PostSidebar } from "@/components/blog/post-sidebar"
import { ShareButtons } from "@/components/blog/share-buttons"
import { Caveat, Special_Elite, Gloria_Hallelujah } from "next/font/google"
import { DuctTape, ScotchTape } from "@/components/ui/scrapbook-decorations"

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
    <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight mt-12 mb-5 text-[#0B0B0B]">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2
      id={headingId(children)}
      className="group text-2xl md:text-3xl font-black tracking-tight leading-tight mt-12 mb-5 text-gray-900 scroll-mt-24 relative inline-block select-none"
    >
      <span className="relative z-10">{children}</span>
      {/* Highlighter marker stroke underneath heading */}
      <div className="h-3 w-[104%] bg-yellow-200/60 absolute bottom-[2px] left-[-2%] -z-10 rounded-sm" />
      <a href={`#${headingId(children)}`} aria-label="Anchor" className="ml-2 text-[#9CA3AF] opacity-0 transition group-hover:opacity-100 font-mono text-sm align-middle">
        #
      </a>
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      id={headingId(children)}
      className="group text-xl md:text-2xl font-bold tracking-tight leading-tight mt-8 mb-4 text-[#0B0B0B] scroll-mt-24 relative inline-block"
    >
      <span className="relative z-10">{children}</span>
      {/* Slightly narrower marker stroke */}
      <div className="h-2.5 w-[102%] bg-blue-100/60 absolute bottom-px left-[-1%] -z-10 rounded-sm" />
      <a href={`#${headingId(children)}`} aria-label="Anchor" className="ml-2 text-[#9CA3AF] opacity-0 transition group-hover:opacity-100 font-mono text-sm align-middle">
        #
      </a>
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-[#2F2F2F] text-[16px] md:text-[18px] leading-[1.8] mb-6 font-sans font-medium">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc marker:text-blue-500 pl-7 my-5 space-y-2.5 text-[#2F2F2F] text-[16px] md:text-[18px] leading-[1.8] font-sans font-medium">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal marker:text-blue-500 pl-7 my-5 space-y-2.5 text-[#2F2F2F] text-[16px] md:text-[18px] leading-[1.8] font-sans font-medium">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-blue-600 underline underline-offset-4 decoration-blue-500/40 hover:decoration-blue-500 font-bold"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-extrabold text-[#0B0B0B] bg-yellow-200/40 px-1 py-0.5 rounded">{children}</strong>,
  code: ({ className, children }) => {
    if (className) {
      return <code className={`${className} font-mono`}>{children}</code>
    }
    return (
      <code className="bg-[#EAE7DF] px-1.5 py-0.5 rounded-md text-[0.85em] font-bold text-[#1F2937] font-mono">
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
      return (
        <div className="relative border-2 border-black rounded-xl overflow-hidden my-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <MarkdownCodeBlock code={codeText} language={languageMatch?.[1]} />
        </div>
      )
    }
    return <pre className="bg-[#F8FAFC] border-2 border-black rounded-xl p-5 overflow-x-auto my-6 text-[14px] leading-7 font-mono shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">{children}</pre>
  },
  hr: () => <hr className="my-10 border-t-2 border-dashed border-black/15" />,
  blockquote: ({ children }) => (
    <div className="relative pl-6 py-4 my-8 bg-transparent max-w-md ml-auto border-l-4 border-amber-500/60 select-none">
      <span className="absolute left-1 top-[-10px] text-amber-500/70 text-5xl font-serif leading-none">“</span>
      <blockquote className="font-gloria text-[16px] md:text-[18px] text-gray-800 leading-relaxed italic pr-2">
        {children}
      </blockquote>
      <div className="h-[2px] w-24 bg-black/25 mt-3" />
    </div>
  ),
  table: ({ children }) => (
    <div className="my-7 overflow-x-auto rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <table className="w-full border-collapse text-left text-[15px] md:text-base leading-relaxed">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-[#FAFAF8] font-bold text-[#0B0B0B] border-b-2 border-black">{children}</thead>,
  tbody: ({ children }) => <tbody className="text-[#393939] bg-white divide-y border-black">{children}</tbody>,
  tr: ({ children }) => <tr className="hover:bg-gray-50">{children}</tr>,
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
  const { slug, locale } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const t = await getTranslations("blog")
  const posts = getPosts()
  const toc = extractTocFromMarkdown(post.content)
  const readingMinutes = estimateReadingMinutes(post.content)

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

      <ReadingProgress />

      <ProfileNavigation />

      <article className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto flex w-full max-w-[1600px] items-start gap-8 lg:gap-12">
          <PostSidebar posts={posts} activeSlug={slug} locale={locale} />

          <div className="w-full max-w-3xl xl:flex-1">
            {/* Back Button with Hand-drawn Squiggle Underline */}
            <div className="mb-8">
              <Link
                href="/blog"
                className="group inline-flex flex-col items-start relative select-none"
              >
                <span className="font-gloria text-base font-bold text-gray-800 flex items-center gap-2 hover:text-black transition-colors">
                  <span>←</span> {locale === "zh" ? "返回文章列表" : "Back to blog"}
                </span>
                {/* Handwritten scribble underline */}
                <svg
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="w-24 h-2 text-gray-800/60 -mt-0.5"
                >
                  <path d="M4 8c12-2 28-3.5 45-4c15-0.5 25 1 32 3.5" />
                </svg>
              </Link>
            </div>

            {/* Pill Style Category Tag */}
            {post.tag && (
              <div className="mb-4 select-none">
                <span className="inline-flex items-center gap-1.5 bg-[#1F1F1F] text-white text-xs font-black px-4 py-1.5 rounded-full shadow-[1px_2px_4px_rgba(0,0,0,0.1)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <span>{post.tag}</span>
                </span>
              </div>
            )}

            <header className="mb-6 select-none">
              <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-[1.2] text-gray-900">
                {post.title}
              </h1>
              
              {/* Lead Post Description paragraph */}
              <p className="text-gray-600 text-base md:text-lg font-sans mb-6 leading-relaxed">
                {post.description}
              </p>
            </header>

            {/* Avatar & Reading Time Metadata with Hand-drawn Share buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 mb-10 border-b-2 border-dashed border-black/15 select-none">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-black overflow-hidden relative shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  <img
                    src="/images/design-mode/63407fbdc2d4ac5270385fd4_home-he.png"
                    alt={post.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="font-sans text-xs md:text-sm font-bold text-gray-500">
                  <span className="text-gray-800 font-extrabold">{post.author}</span> · {post.date} · {readingMinutes} min read
                </div>
              </div>

              {/* Share block */}
              <ShareButtons postTitle={post.title} locale={locale} />
            </div>

            {/* Main Polaroid Card with "Boundaries shape systems" overlay */}
            {(() => {
              const coverSrc = post.image || `https://picsum.photos/seed/${encodeURIComponent(post.slug)}/800/450`
              return (
                <div className="relative w-full aspect-video bg-white p-3 pb-8 rounded-2xl mb-12 border-2 border-black/10 shadow-[4px_6px_16px_rgba(0,0,0,0.1)] rotate-1 max-w-full group select-none">
                  <ScotchTape className="top-[-10px] left-12 -rotate-12" />
                  <ScotchTape className="top-[-8px] right-12 rotate-15" />
                  
                  <div className="relative w-full h-full bg-[#EDEDED] border-2 border-black rounded-lg overflow-hidden">
                    <Image src={coverSrc} alt={post.title} fill className="object-cover filter contrast-[1.01] sepia-[0.03]" sizes="(max-width: 768px) 100vw, 672px" priority />
                    
                    {/* Dynamic handwriting floating overlay on picture */}
                    <div className="absolute left-6 top-6 bg-transparent select-none pointer-events-none">
                      <p className="font-gloria text-xl md:text-3xl text-white/90 drop-shadow-[0_2px_5px_rgba(0,0,0,0.7)] rotate-[-4deg] leading-tight">
                        Boundaries <br />
                        shape systems.
                      </p>
                    </div>

                    {/* DuctTape tag on corner */}
                    {post.tag && (
                      <span className="absolute bottom-4 right-4">
                        <DuctTape className="bg-black text-xs font-semibold px-4 py-2 shadow-[2px_3px_5px_rgba(0,0,0,0.15)] rotate-3">
                          {post.tag}
                        </DuctTape>
                      </span>
                    )}
                  </div>
                </div>
              )
            })()}

            {/* Main body: Clean system-ui font for maximum readability, with hand-annotated headings and blocks */}
            <div className="blog-body max-w-none text-[#1F1F1F] selection:bg-yellow-200">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Bottom Back buttons */}
            <div className="mt-16 pt-8 border-t-2 border-dashed border-black/20 flex justify-between select-none">
              <Button asChild variant="outline" className="border-[3px] border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-px font-sans">
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
    </main>
  )
}

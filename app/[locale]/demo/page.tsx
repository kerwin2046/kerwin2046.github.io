import { Navigation } from "@/components/layout"
import { DemoClient } from "@/components/demo/demo-client"
import { getPosts } from "@/lib/content/blog"

export default async function DemoPage() {
  const posts = getPosts()
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <DemoClient posts={posts} />
    </main>
  )
}

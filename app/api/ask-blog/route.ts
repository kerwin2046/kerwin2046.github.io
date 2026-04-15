import { NextRequest } from "next/server"
import { getPostBySlug } from "@/lib/content/blog"
import { getLLMConfig } from "@/lib/llm"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_CONTEXT_CHARS = 12_000

export async function POST(req: NextRequest) {
  const llm = getLLMConfig()
  if (!llm) {
    return new Response(
      JSON.stringify({ error: "DEEPSEEK_API_KEY or OPENAI_API_KEY not configured" }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    )
  }

  let body: { slug?: string; question?: string }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const { slug, question } = body
  if (!slug || typeof question !== "string" || !question.trim()) {
    return new Response(JSON.stringify({ error: "slug and question required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const post = getPostBySlug(slug)
  if (!post) {
    return new Response(JSON.stringify({ error: "Post not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  }

  const context = post.content.slice(0, MAX_CONTEXT_CHARS)
  const systemContent = `You are a helpful assistant. Answer the user's question based ONLY on the following article. If the answer is not in the article, say so briefly.

Article title: ${post.title}

Article content:
---
${context}
---`

  const res = await fetch(`${llm.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${llm.apiKey}`,
    },
    body: JSON.stringify({
      model: llm.model,
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: question.trim() },
      ],
      stream: true,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    return new Response(JSON.stringify({ error: err || res.statusText }), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    })
  }

  return new Response(res.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}

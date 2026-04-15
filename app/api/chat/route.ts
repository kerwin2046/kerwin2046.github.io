import { NextRequest } from "next/server"
import { getLLMConfig } from "@/lib/llm"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const llm = getLLMConfig()
  if (!llm) {
    return new Response(
      JSON.stringify({ error: "DEEPSEEK_API_KEY or OPENAI_API_KEY not configured" }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    )
  }

  let body: { messages?: Array<{ role: string; content: string }> }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const messages = body.messages ?? []
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages array required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const res = await fetch(`${llm.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${llm.apiKey}`,
    },
    body: JSON.stringify({
      model: llm.model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
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

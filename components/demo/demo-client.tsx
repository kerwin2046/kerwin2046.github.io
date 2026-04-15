"use client"

import { useState, useRef, useCallback } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import type { PostMeta } from "@/types"

type Message = { role: "user" | "assistant"; content: string }

function parseSSEChunk(buffer: string): string[] {
  const lines = buffer.split("\n")
  const out: string[] = []
  for (const line of lines) {
    if (line.startsWith("data: ")) {
      const data = line.slice(6)
      if (data === "[DONE]") continue
      try {
        const j = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> }
        const content = j.choices?.[0]?.delta?.content
        if (content) out.push(content)
      } catch {
        // skip malformed
      }
    }
  }
  return out
}

export function DemoClient({ posts }: { posts: PostMeta[] }) {
  const t = useTranslations("demo")
  const [mode, setMode] = useState<"chat" | "rag">("chat")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [ragSlug, setRagSlug] = useState("")
  const [ragAnswer, setRagAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const streamChat = useCallback(async () => {
    if (!input.trim() || loading) return
    const userContent = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userContent }])
    setLoading(true)
    setError(null)
    abortRef.current = new AbortController()

    const newMessages: Message[] = [...messages, { role: "user", content: userContent }]
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: abortRef.current.signal,
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error((err as { error?: string }).error || res.statusText)
      }
      const reader = res.body?.getReader()
      if (!reader) throw new Error("No response body")
      const decoder = new TextDecoder()
      let assistantContent = ""
      setMessages((prev) => [...prev, { role: "assistant", content: "" }])
      let buffer = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const parts = parseSSEChunk(buffer)
        const lastNewline = buffer.lastIndexOf("\n")
        if (lastNewline !== -1) buffer = buffer.slice(lastNewline + 1)
        if (parts.length) {
          assistantContent += parts.join("")
          const final = assistantContent
          setMessages((prev) => {
            const next = [...prev]
            const last = next[next.length - 1]
            if (last?.role === "assistant") next[next.length - 1] = { ...last, content: final }
            return next
          })
        }
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") return
      setError((e as Error).message)
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setLoading(false)
      abortRef.current = null
    }
  }, [input, loading, messages])

  const streamRag = useCallback(async () => {
    if (!ragSlug || !input.trim() || loading) return
    const question = input.trim()
    setInput("")
    setRagAnswer("")
    setLoading(true)
    setError(null)
    abortRef.current = new AbortController()
    try {
      const res = await fetch("/api/ask-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: ragSlug, question }),
        signal: abortRef.current.signal,
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error((err as { error?: string }).error || res.statusText)
      }
      const reader = res.body?.getReader()
      if (!reader) throw new Error("No response body")
      const decoder = new TextDecoder()
      let answer = ""
      let buffer = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const parts = parseSSEChunk(buffer)
        const lastNewline = buffer.lastIndexOf("\n")
        if (lastNewline !== -1) buffer = buffer.slice(lastNewline + 1)
        if (parts.length) {
          answer += parts.join("")
          setRagAnswer(answer)
        }
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") return
      setError((e as Error).message)
    } finally {
      setLoading(false)
      abortRef.current = null
    }
  }, [ragSlug, input, loading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === "chat") streamChat()
    else streamRag()
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
      <p className="text-muted-foreground mb-8">{t("subtitle")}</p>

      <div className="flex gap-2 mb-6">
        <Button
          variant={mode === "chat" ? "default" : "outline"}
          onClick={() => setMode("chat")}
        >
          {t("chatTab")}
        </Button>
        <Button
          variant={mode === "rag" ? "default" : "outline"}
          onClick={() => setMode("rag")}
        >
          {t("ragTab")}
        </Button>
      </div>

      {mode === "rag" && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">{t("ragSelect")}</label>
          {/* <select
            className="w-full border border-input rounded-md px-3 py-2 bg-background text-sm"
            value={ragSlug}
            onChange={(e) => setRagSlug(e.target.value)}
          >
            <option value="">{t("ragSelectPlaceholder")}</option>
            {posts.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title}
              </option>
            ))}
          </select> */}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {mode === "chat" && (
        <div className="mb-6 space-y-4 max-h-[360px] overflow-y-auto">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg ${m.role === "user" ? "bg-primary text-primary-foreground ml-8" : "bg-muted mr-8"}`}
            >
              <div className="text-sm whitespace-pre-wrap">{m.content || "…"}</div>
            </div>
          ))}
        </div>
      )}

      {mode === "rag" && (ragAnswer || loading) && (
        <div className="mb-6 p-4 rounded-lg bg-muted border">
          <div className="text-sm font-medium mb-2">{t("ragAnswer")}</div>
          <div className="text-sm whitespace-pre-wrap">{ragAnswer || "…"}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        {/* <input
          type="text"
          className="flex-1 border border-input rounded-md px-3 py-2 bg-background text-sm"
          placeholder={mode === "chat" ? t("chatPlaceholder") : t("ragPlaceholder")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading || (mode === "rag" && !ragSlug)}
        />
        <Button type="submit" disabled={loading || !input.trim() || (mode === "rag" && !ragSlug)}>
          {loading ? t("sending") : t("send")}
        </Button> */}
      </form>
      <p className="mt-4 text-xs text-muted-foreground">{t("disclaimer")}</p>
    </div>
  )
}

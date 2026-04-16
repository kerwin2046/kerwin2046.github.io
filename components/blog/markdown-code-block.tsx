"use client"

import { useMemo, useState } from "react"

interface MarkdownCodeBlockProps {
  code: string
  language?: string
}

export function MarkdownCodeBlock({ code, language }: MarkdownCodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const normalizedCode = useMemo(() => code.replace(/\n$/, ""), [code])
  const languageLabel = language?.toLowerCase() || "text"

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(normalizedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="my-7 overflow-hidden rounded-xl border border-[#1F2937]/30 bg-[#0B1220] shadow-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-white/70">
          {languageLabel}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/85 transition hover:bg-white/10"
          aria-label="Copy code"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-6 text-[#E5E7EB]">
        <code>{normalizedCode}</code>
      </pre>
    </div>
  )
}

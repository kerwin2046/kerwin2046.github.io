"use client"

import React from "react"

interface ShareButtonsProps {
  postTitle: string
  locale: string
}

export function ShareButtons({ postTitle, locale }: ShareButtonsProps) {
  const handleXShare = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}`)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert(locale === "zh" ? "链接已复制！" : "Link copied!")
  }

  const handleCopyTitleLink = () => {
    navigator.clipboard.writeText(`${postTitle}\n${window.location.href}`)
    alert(locale === "zh" ? "标题及链接复制成功！" : "Title & Link copied!")
  }

  return (
    <div className="flex items-center gap-3.5 font-gloria text-sm font-bold text-gray-500">
      <div className="relative flex items-center">
        <span className="italic mr-1 text-gray-600">{locale === "zh" ? "分享" : "Share"}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-6 text-black/40 rotate-12 -scale-y-100"
        >
          <path d="M4 14c4 4 10 4 14 0" />
          <path d="M14 10c2 2 4 4 4 4c0-3.5-0.5-7-1.5-10" />
        </svg>
      </div>
      <div className="flex items-center gap-2">
        {/* Twitter/X */}
        <button
          onClick={handleXShare}
          className="w-9 h-9 flex items-center justify-center border-2 border-black bg-white rounded-lg hover:rotate-3 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:scale-95 transition-all text-black cursor-pointer"
          aria-label="Share on X"
        >
          <span className="font-sans font-black text-sm">X</span>
        </button>
        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="w-9 h-9 flex items-center justify-center border-2 border-black bg-white rounded-lg hover:-rotate-3 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:scale-95 transition-all text-black cursor-pointer"
          aria-label="Copy URL"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </button>
        {/* Copy Full title + URL */}
        <button
          onClick={handleCopyTitleLink}
          className="w-9 h-9 flex items-center justify-center border-2 border-black bg-white rounded-lg hover:rotate-6 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:scale-95 transition-all text-black cursor-pointer"
          aria-label="Copy title and link"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
      </div>
    </div>
  )
}

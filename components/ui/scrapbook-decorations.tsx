"use client"

import React from "react"

// DuctTape: Jagged ripped black/dark gray tape strip
export function DuctTape({
  className = "",
  children,
  style = {},
}: {
  className?: string
  children?: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center px-5 py-1.5 text-white bg-[#1F1F1F] font-mono font-bold select-none text-xs uppercase tracking-widest ${className}`}
      style={{
        clipPath:
          "polygon(1% 15%, 3% 0%, 15% 4%, 25% 1%, 38% 3%, 50% 0%, 65% 2%, 78% 1%, 90% 4%, 98% 0%, 99% 18%, 97% 42%, 99% 75%, 98% 99%, 88% 96%, 74% 98%, 62% 95%, 48% 99%, 33% 96%, 20% 98%, 10% 95%, 2% 99%, 1% 80%, 3% 45%)",
        boxShadow: "inset 0 0 12px rgba(0,0,0,0.6), 2px 3px 6px rgba(0,0,0,0.15)",
        ...style,
      }}
    >
      {/* Fabric mesh texture overlay */}
      <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:3px_3px]" />
      <span className="relative z-10 rotate-[-0.5deg]">{children}</span>
    </div>
  )
}

// ScotchTape: Semi-transparent adhesive tape with torn edges and shine
export function ScotchTape({
  className = "",
  style = {},
}: {
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={`absolute w-20 h-7 bg-white/25 backdrop-blur-[0.5px] border-y border-white/20 shadow-[inset_0_0_8px_rgba(255,255,255,0.4),1px_1px_3px_rgba(0,0,0,0.05)] select-none pointer-events-none ${className}`}
      style={{
        clipPath:
          "polygon(2% 20%, 5% 0%, 18% 5%, 32% 1%, 48% 3%, 65% 1%, 82% 4%, 95% 0%, 98% 25%, 95% 55%, 98% 85%, 96% 100%, 82% 96%, 66% 98%, 52% 95%, 38% 99%, 22% 96%, 8% 98%, 3% 95%, 5% 75%, 2% 40%)",
        ...style,
      }}
    >
      {/* Subtle reflective line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-white/40" />
    </div>
  )
}

// Handwritten asterisks/stars
export function HandStar({ className = "w-6 h-6 text-black" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12.1 3.5c-0.1 5.2 0.2 10.3 0.1 16.2" />
      <path d="M3.5 12.3c5.8-0.2 11.5 0.1 17.3-0.3" />
      <path d="M5.5 5.8c4.1 4.3 8.3 8.1 12.8 12.4" />
      <path d="M18.1 5.5c-4.2 4.1-8.1 8.5-12.3 12.8" />
    </svg>
  )
}

// Handwritten arrow pointing down & slightly curved right
export function HandArrowDown({ className = "w-10 h-10 text-black" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Wobbly curve body */}
      <path d="M15 5c4 8 8 18 3 28c-0.5 1-1 2-1.5 3" />
      {/* Arrowhead */}
      <path d="M9 29.5c2.5 1.5 5.2 3.5 7.5 6.5c1.8-3.5 3.2-6 5.5-8.5" />
    </svg>
  )
}

// Handwritten arrow pointing left/down-left (e.g. from Get in touch to label)
export function HandArrowDownLeft({ className = "w-12 h-12 text-black" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Curve body */}
      <path d="M40 8c-8 6-18 16-24 24" />
      {/* Head */}
      <path d="M24 33.5c-4.5-0.5-8 1.5-10.5 2.5c1-3.5 2-7.5 1.5-11.5" />
    </svg>
  )
}

// Handwritten curvy loop pointing right (e.g., from avatar to details)
export function HandArrowLoopRight({ className = "w-12 h-12 text-black" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Loops around */}
      <path d="M10 32c5-10 18-18 24-4c3 7-4 12-10 8c-6-4-1-14 8-16c5-1 9 1 12 3" />
      {/* Arrow head */}
      <path d="M40.5 17.5c2 2 3.5 4 4.5 6.5c-3 0.5-6.2 0.2-9 0" />
    </svg>
  )
}

// Highlighting scribble behind text (e.g. Highlighter or under-stroke)
export function HandUnderline({ className = "text-yellow-300" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 12"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      className={`w-full h-3 select-none pointer-events-none opacity-80 ${className}`}
    >
      <path d="M3 8c15-2.5 35-4 55-4.5c18-0.5 31 1 39 3" />
    </svg>
  )
}

// Highlighter back-marker stroke
export function HandHighlight({
  className = "text-yellow-200/50",
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <span className="relative inline-block z-10">
      <span className="relative z-10">{children}</span>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className={`absolute -inset-x-2 inset-y-1 h-[115%] w-[110%] -z-10 fill-currentColor ${className}`}
      >
        <path d="M0,35 C30,30 70,38 100,32 L100,75 C70,70 30,85 0,78 Z" />
      </svg>
    </span>
  )
}

// Hand-drawn Checkbox
export function HandCheckbox({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  id: string
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-3 cursor-pointer group select-none py-1"
    >
      <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        {/* Wobbly box outline */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute inset-0 w-full h-full text-[#1A1A1A] group-hover:scale-105 transition-transform"
        >
          <path d="M3.5 4.8c5.2-0.4 10.8-0.3 16.2-0.1c0.3 4.5 0.1 9.2 0.3 14.1c-4.8 0.4-10.2 0.2-15.3 0.3c-0.4-4.5-0.2-9.1-1.2-14.3z" />
        </svg>

        {/* Wobbly checkmark inside */}
        {checked && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute inset-0 w-[85%] h-[80%] text-blue-600 animate-[draw_0.25s_ease-out_forwards]"
          >
            <path d="M4.5 12.8l4.8 4.2c2.5-3.5 6-7.5 9.5-11.5" />
          </svg>
        )}
      </div>
      <span className="font-gloria text-sm md:text-base font-bold text-gray-800 group-hover:text-black transition-colors">
        {label}
      </span>
    </label>
  )
}

// Hand-drawn brush or ink splat for button backgrounds
export function InkSplatBackground({ className = "text-black" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 60"
      preserveAspectRatio="none"
      className={`absolute inset-0 w-full h-full -z-10 fill-currentColor ${className}`}
    >
      <path d="M12,28 C34,22 64,26 94,20 C124,14 154,22 188,16 C198,34 192,48 178,44 C148,40 118,48 88,42 C58,36 34,44 12,38 C2,34 4,24 12,28 Z" />
      {/* Some extra rough edge splatters */}
      <circle cx="8" cy="22" r="2" />
      <circle cx="192" cy="38" r="1.5" />
      <circle cx="104" cy="50" r="1.2" />
      <circle cx="48" cy="12" r="1" />
    </svg>
  )
}

// PaperClip: Hand-drawn metallic paper clip
export function PaperClip({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-6 h-12 text-gray-600/80 drop-shadow-[1px_2px_2px_rgba(0,0,0,0.15)] ${className}`}
    >
      <path d="M7 12 v20 c0 3 2 5 5 5 s5-2 5-5 V8 c0-4-3-7-7-7 S3 4 3 8 v24 c0 6 5 9 10 9 s10-3 10-9 V14" />
    </svg>
  )
}

// CoffeeStain: Subtle coffee ring stain
export function CoffeeStain({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      className={`w-32 h-32 text-amber-900/10 pointer-events-none select-none ${className}`}
    >
      {/* Main ring (split and imperfect) */}
      <path d="M 50 10 A 40 40 0 1 0 85 30" strokeDasharray="5 2 10 5" />
      <path d="M 88 35 A 40 40 0 0 0 52 9" strokeDasharray="3 3 8 2" />
      <path d="M 45 92 C 65 92, 88 78, 88 50 C 88 45, 87 40, 85 35" opacity="0.6" />
      {/* Splashes */}
      <circle cx="32" cy="18" r="1" fill="currentColor" />
      <circle cx="78" cy="80" r="1.5" fill="currentColor" />
      <circle cx="15" cy="52" r="0.8" fill="currentColor" />
      <path d="M 22 25 C 20 28, 18 35, 19 40" strokeWidth="0.8" />
    </svg>
  )
}

// SystemArchitectureSketch: Hand-drawn sketchy architectural blueprint
export function SystemArchitectureSketch({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 160"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-full h-auto text-gray-700/60 ${className}`}
    >
      {/* Client Box */}
      <rect x="15" y="55" width="65" height="40" rx="6" />
      <path d="M15 80 h65" strokeDasharray="2 2" />
      <text x="47" y="73" fontSize="10" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" fill="currentColor">CLIENT</text>
      <text x="47" y="90" fontSize="7" fontFamily="sans-serif" textAnchor="middle" fill="currentColor">Next.js Edge</text>

      {/* Connection arrow 1 */}
      <path d="M 80 75 C 95 72, 100 73, 115 75" />
      <path d="M 110 70 L 116 75 L 110 80" />
      <text x="97" y="66" fontSize="7" fontFamily="monospace" textAnchor="middle" fill="currentColor">JSON</text>

      {/* Gateway / API Box */}
      <rect x="120" y="35" width="80" height="80" rx="8" />
      <text x="160" y="53" fontSize="11" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" fill="currentColor">API SERVICE</text>
      <text x="160" y="68" fontSize="8" fontFamily="sans-serif" textAnchor="middle" fill="currentColor">Node.js / TS</text>
      {/* Inner stack layer */}
      <path d="M125 78 h70" strokeDasharray="3 3" />
      <text x="160" y="92" fontSize="7" fontFamily="monospace" textAnchor="middle" fill="currentColor">tRPC & Zod</text>
      <text x="160" y="104" fontSize="7" fontFamily="monospace" textAnchor="middle" fill="currentColor">RAG Pipeline</text>

      {/* Connection Arrow 2 (to DB) */}
      <path d="M 200 65 C 215 62, 220 63, 235 65" />
      <path d="M 230 60 L 236 65 L 230 70" />

      {/* Connection Arrow 3 (to Redis) */}
      <path d="M 200 90 C 215 93, 220 92, 235 90" />
      <path d="M 230 85 L 236 90 L 230 95" />

      {/* Database Cylinder */}
      <path d="M 240 55 C 240 45, 290 45, 290 55 L 290 85 C 290 95, 240 95, 240 85 Z" />
      <path d="M 240 55 C 240 65, 290 65, 290 55" />
      <path d="M 240 70 C 240 80, 290 80, 290 70" />
      <text x="265" y="60" fontSize="9" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" fill="currentColor">POSTGRES</text>
      <text x="265" y="87" fontSize="7" fontFamily="monospace" textAnchor="middle" fill="currentColor">Prisma ORM</text>

      {/* Redis Box */}
      <rect x="240" y="105" width="50" height="30" rx="4" />
      <text x="265" y="120" fontSize="9" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" fill="currentColor">REDIS</text>
      <text x="265" y="131" fontSize="7" fontFamily="sans-serif" textAnchor="middle" fill="currentColor">Cache / Queue</text>

      {/* Some architectural doodles / decorations */}
      <circle cx="160" cy="142" r="3" fill="currentColor" opacity="0.3" />
      <circle cx="175" cy="145" r="1.5" fill="currentColor" opacity="0.3" />
      <path d="M 40 120 L 55 140 L 70 120" strokeWidth="1" strokeDasharray="1 1" opacity="0.5" />
      <text x="55" y="115" fontSize="7" fontFamily="sans-serif" textAnchor="middle" fill="currentColor" opacity="0.4">Flow state</text>
    </svg>
  )
}


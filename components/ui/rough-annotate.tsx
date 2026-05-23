"use client"

import React, { useEffect, useRef } from "react"
import { annotate } from "rough-notation"

interface RoughAnnotateProps {
  type: "underline" | "box" | "circle" | "highlight" | "strike-through" | "crossed-off" | "bracket"
  color?: string
  strokeWidth?: number
  padding?: number | [number, number] | [number, number, number, number]
  animationDuration?: number
  animationDelay?: number
  iterations?: number
  multiline?: boolean
  show?: boolean
  children: React.ReactNode
  className?: string
}

export function RoughAnnotate({
  type,
  color,
  strokeWidth,
  padding = 5,
  animationDuration = 800,
  animationDelay = 0,
  iterations = 2,
  multiline = true,
  show = true,
  children,
  className = "",
}: RoughAnnotateProps) {
  const elementRef = useRef<HTMLSpanElement>(null)
  const annotationRef = useRef<any>(null)

  useEffect(() => {
    if (!elementRef.current) return

    // Initialize annotation on the client side only
    const annotation = annotate(elementRef.current, {
      type,
      color,
      strokeWidth,
      padding,
      animationDuration,
      animationDelay,
      iterations,
      multiline,
    })

    annotationRef.current = annotation

    if (show) {
      annotation.show()
    }

    return () => {
      if (annotationRef.current) {
        annotationRef.current.remove()
      }
    }
  }, [type, color, strokeWidth, padding, animationDuration, animationDelay, iterations, multiline])

  useEffect(() => {
    if (!annotationRef.current) return
    if (show) {
      annotationRef.current.show()
    } else {
      annotationRef.current.hide()
    }
  }, [show])

  return (
    <span ref={elementRef} className={`inline-block ${className}`}>
      {children}
    </span>
  )
}

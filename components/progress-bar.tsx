'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function ProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const visitedPaths = useRef(new Set<string>())

  useEffect(() => {
    // Create a unique key for this path
    const currentPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')

    // If already visited, don't show progress bar
    if (visitedPaths.current.has(currentPath)) {
      return
    }

    // Mark this path as visited
    visitedPaths.current.add(currentPath)

    // Reset state
    setProgress(0)
    setIsVisible(false)

    // Only show progress bar if navigation takes longer than 200ms
    const delayTimer = setTimeout(() => {
      setIsVisible(true)
      setProgress(30)
    }, 200)

    // Simulate progress
    const timer1 = setTimeout(() => setProgress(60), 400)
    const timer2 = setTimeout(() => setProgress(80), 600)
    const timer3 = setTimeout(() => {
      setProgress(100)
      setTimeout(() => setIsVisible(false), 200)
    }, 900)

    return () => {
      clearTimeout(delayTimer)
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [pathname, searchParams])

  if (!isVisible) return null

  return (
    <div
      className="fixed left-0 top-0 z-[9999] h-[2px] bg-primary transition-all duration-300 ease-out"
      style={{ width: `${progress}%` }}
    />
  )
}

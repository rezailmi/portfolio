'use client'

import * as React from 'react'
import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area'

import { cn } from '@/lib/utils'

// Static values for scroll calculations
const HEADER_HEIGHT = {
  mobile: 56, // h-14
  desktop: 64, // sm:h-16
} as const

const SCROLL_PADDING = 24

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => {
  const viewportRef = React.useRef<HTMLDivElement>(null)

  const handleClick = React.useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    const anchor = target.closest('a')

    if (!anchor) return

    const href = anchor.getAttribute('href')
    if (!href?.startsWith('#')) return

    const elementId = href.slice(1)
    if (!elementId) return

    const targetElement = document.getElementById(elementId)
    const viewport = viewportRef.current

    if (!targetElement || !viewport) return

    e.preventDefault()

    // Calculate the scroll position
    const viewportRect = viewport.getBoundingClientRect()
    const targetRect = targetElement.getBoundingClientRect()

    // Get header height based on viewport width
    const headerHeight = window.innerWidth >= 640 ? HEADER_HEIGHT.desktop : HEADER_HEIGHT.mobile

    // Adjust scroll position to account for header height and padding
    const scrollTop = targetRect.top - viewportRect.top - headerHeight - SCROLL_PADDING

    // Smooth scroll to the target
    viewport.scrollTo({
      top: viewport.scrollTop + scrollTop,
      behavior: 'smooth',
    })
  }, [])

  React.useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [handleClick])

  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport ref={viewportRef} className="h-full w-full rounded-[inherit]">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
})
ScrollArea.displayName = "ScrollArea"

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Scrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.Scrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex touch-none select-none transition-colors',
      orientation === 'vertical' &&
        'my-2 h-[calc(100%-1rem)] w-2.5 border-l border-l-transparent p-[1px]',
      orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent p-[1px]',
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.Scrollbar>
))
ScrollBar.displayName = "ScrollBar"

export { ScrollArea, ScrollBar }

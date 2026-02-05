'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { useDirectEdit } from 'made-refine'
import { getDimensionDisplay } from 'made-refine/utils'

interface EditableAreaProps {
  children: React.ReactNode
  className?: string
}

interface HoverHighlightProps {
  element: HTMLElement
  isSelected?: boolean
}

interface FlexChildrenHighlightProps {
  container: HTMLElement
}

function FlexChildrenHighlight({ container }: FlexChildrenHighlightProps) {
  const [childRects, setChildRects] = React.useState<Map<Element, DOMRect>>(new Map())

  React.useEffect(() => {
    const updateRects = () => {
      const children = Array.from(container.children)
      const rects = new Map<Element, DOMRect>()
      for (const child of children) {
        rects.set(child, child.getBoundingClientRect())
      }
      setChildRects(rects)
    }

    updateRects()
    window.addEventListener('scroll', updateRects, true)
    window.addEventListener('resize', updateRects)
    const observer = new ResizeObserver(updateRects)
    observer.observe(container)

    return () => {
      window.removeEventListener('scroll', updateRects, true)
      window.removeEventListener('resize', updateRects)
      observer.disconnect()
    }
  }, [container])

  return createPortal(
    <>
      {Array.from(childRects.entries()).map(([, rect], index) => (
        <div
          key={index}
          className="pointer-events-none fixed z-[99997] border border-dashed border-blue-400"
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          }}
        />
      ))}
    </>,
    document.body
  )
}

function HoverHighlight({ element, isSelected }: HoverHighlightProps) {
  const [rect, setRect] = React.useState<DOMRect | null>(null)
  const [dimensions, setDimensions] = React.useState<{ width: string; height: string } | null>(null)

  React.useEffect(() => {
    function updateRect() {
      const newRect = element.getBoundingClientRect()
      setRect(newRect)

      if (isSelected) {
        setDimensions(getDimensionDisplay(element))
      }
    }

    updateRect()

    window.addEventListener('scroll', updateRect, true)
    window.addEventListener('resize', updateRect)
    const resizeObserver = new ResizeObserver(updateRect)
    resizeObserver.observe(element)

    return () => {
      window.removeEventListener('scroll', updateRect, true)
      window.removeEventListener('resize', updateRect)
      resizeObserver.disconnect()
    }
  }, [element, isSelected])

  if (!rect) return null

  return createPortal(
    <div
      className={cn(
        'pointer-events-none fixed z-[99998] border transition-all duration-75',
        isSelected ? 'border-blue-500 bg-blue-500/10' : 'border-blue-400/60 bg-blue-400/5'
      )}
      style={{
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      }}
    >
      {/* Tag label for hover state */}
      {!isSelected && (
        <div className="absolute -top-6 left-0 whitespace-nowrap rounded bg-blue-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
          {element.tagName.toLowerCase()}
          {element.classList.length > 0 && (
            <span className="ml-1 opacity-75">
              .{Array.from(element.classList).slice(0, 2).join('.')}
            </span>
          )}
        </div>
      )}

      {/* Dimension label for selected state - centered below element */}
      {isSelected && dimensions && (
        <div
          className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-neutral-900 px-2 py-1 text-[11px] font-medium text-white shadow-lg dark:bg-neutral-100 dark:text-neutral-900"
          style={{ top: rect.height + 8 }}
        >
          {dimensions.width} × {dimensions.height}
        </div>
      )}
    </div>,
    document.body
  )
}

function EditableAreaClient({ children, className }: EditableAreaProps) {
  const areaRef = React.useRef<HTMLDivElement>(null)
  const [hoveredElement, setHoveredElement] = React.useState<HTMLElement | null>(null)
  const [isSelectedInArea, setIsSelectedInArea] = React.useState(false)
  const { selectElement, isOpen, selectedElement, editModeActive } = useDirectEdit()

  // Track if selected element is within this area
  React.useEffect(() => {
    if (!isOpen || !selectedElement || !areaRef.current) {
      setIsSelectedInArea(false)
      return
    }
    setIsSelectedInArea(areaRef.current.contains(selectedElement))
  }, [isOpen, selectedElement])

  // Track hovered element within the area when edit mode is active
  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent) => {
      if (!editModeActive) {
        setHoveredElement(null)
        return
      }

      const target = e.target as HTMLElement

      // Skip the editable area wrapper itself
      if (target === areaRef.current) {
        setHoveredElement(null)
        return
      }

      if (target !== hoveredElement) {
        setHoveredElement(target)
      }
    },
    [editModeActive, hoveredElement]
  )

  const handleMouseLeave = React.useCallback(() => {
    setHoveredElement(null)
  }, [])

  const handleClickCapture = (e: React.MouseEvent) => {
    if (!editModeActive) return

    // Prevent all default behavior and stop propagation during capture phase
    // This prevents links, buttons, and other interactive elements from activating
    e.preventDefault()
    e.stopPropagation()

    const target = e.target as HTMLElement

    // Skip if clicking on the wrapper itself
    if (target === areaRef.current) return

    selectElement(target)
  }

  // Show hover highlight when edit mode is active and hovering an element
  const showHoverHighlight = editModeActive && hoveredElement && hoveredElement !== selectedElement

  // Show selection highlight when panel is open
  const showSelectionHighlight = isSelectedInArea && selectedElement

  // Detect if hovered element is a flex container
  const isHoveredFlexContainer = React.useMemo(() => {
    if (!hoveredElement) return false
    const computed = window.getComputedStyle(hoveredElement)
    return computed.display === 'flex' || computed.display === 'inline-flex'
  }, [hoveredElement])

  return (
    <div
      ref={areaRef}
      className={cn(className, editModeActive && 'cursor-crosshair')}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClickCapture={handleClickCapture}
    >
      {children}

      {/* Hover highlight overlay */}
      {showHoverHighlight && <HoverHighlight element={hoveredElement} />}

      {/* Flex children dotted outlines */}
      {showHoverHighlight && isHoveredFlexContainer && hoveredElement.children.length > 0 && (
        <FlexChildrenHighlight container={hoveredElement} />
      )}

      {/* Selection highlight overlay */}
      {showSelectionHighlight && <HoverHighlight element={selectedElement} isSelected />}
    </div>
  )
}

// Wrapper that only renders the interactive version in development
export function EditableArea({ children, className }: EditableAreaProps) {
  if (process.env.NODE_ENV !== 'development') {
    return <div className={className}>{children}</div>
  }

  return <EditableAreaClient className={className}>{children}</EditableAreaClient>
}

import * as React from 'react'
import type { MeasurementLine } from './types'
import { calculateParentMeasurements, calculateElementMeasurements } from './utils'

interface UseMeasurementResult {
  isActive: boolean
  hoveredElement: HTMLElement | null
  parentMeasurements: MeasurementLine[]
  elementMeasurements: MeasurementLine[]
}

export function useMeasurement(selectedElement: HTMLElement | null): UseMeasurementResult {
  const [altHeld, setAltHeld] = React.useState(false)
  const [mousePosition, setMousePosition] = React.useState<{ x: number; y: number } | null>(null)
  const [hoveredElement, setHoveredElement] = React.useState<HTMLElement | null>(null)
  const rafRef = React.useRef<number | null>(null)

  // Get element below cursor by temporarily hiding overlay elements
  const getElementBelow = React.useCallback((x: number, y: number): HTMLElement | null => {
    // Get all direct-edit overlay elements to temporarily hide
    const overlays = document.querySelectorAll('[data-direct-edit]')

    // Hide overlays by disabling pointer events
    overlays.forEach((el) => {
      ;(el as HTMLElement).style.pointerEvents = 'none'
    })

    // Get element at point
    const element = document.elementFromPoint(x, y) as HTMLElement | null

    // Restore pointer events on overlays
    overlays.forEach((el) => {
      ;(el as HTMLElement).style.pointerEvents = ''
    })

    // Filter out any remaining direct-edit elements
    if (element?.closest('[data-direct-edit]')) {
      return null
    }

    return element
  }, [])

  // Track Alt key state
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        e.preventDefault()
        setAltHeld(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setAltHeld(false)
        setHoveredElement(null)
      }
    }

    const handleBlur = () => {
      setAltHeld(false)
      setHoveredElement(null)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setAltHeld(false)
        setHoveredElement(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleBlur)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Track mouse position when Alt is held
  React.useEffect(() => {
    if (!altHeld) return

    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }

      rafRef.current = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY })
        rafRef.current = null
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [altHeld])

  // Detect hovered element when Alt is held
  React.useEffect(() => {
    if (!altHeld || !mousePosition || !selectedElement) {
      setHoveredElement(null)
      return
    }

    const element = getElementBelow(mousePosition.x, mousePosition.y)

    if (
      element &&
      element !== selectedElement &&
      element !== document.body &&
      element !== document.documentElement
    ) {
      setHoveredElement(element)
    } else {
      setHoveredElement(null)
    }
  }, [altHeld, mousePosition, selectedElement, getElementBelow])

  // Calculate measurements
  const parentMeasurements = React.useMemo(() => {
    if (!altHeld || !selectedElement) return []
    return calculateParentMeasurements(selectedElement)
  }, [altHeld, selectedElement])

  const elementMeasurements = React.useMemo(() => {
    if (!altHeld || !selectedElement || !hoveredElement) return []
    return calculateElementMeasurements(selectedElement, hoveredElement)
  }, [altHeld, selectedElement, hoveredElement])

  return {
    isActive: altHeld && selectedElement !== null,
    hoveredElement,
    parentMeasurements,
    elementMeasurements,
  }
}

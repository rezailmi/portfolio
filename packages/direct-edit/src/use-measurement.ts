import * as React from 'react'
import type { MeasurementLine } from './types'
import { calculateParentMeasurements, calculateElementMeasurements } from './utils'

interface MeasurementState {
  hoveredElement: HTMLElement | null
  parentMeasurements: MeasurementLine[]
  elementMeasurements: MeasurementLine[]
}

interface UseMeasurementResult {
  isActive: boolean
  hoveredElement: HTMLElement | null
  parentMeasurements: MeasurementLine[]
  elementMeasurements: MeasurementLine[]
}

export function useMeasurement(selectedElement: HTMLElement | null): UseMeasurementResult {
  const [altHeld, setAltHeld] = React.useState(false)
  const [measurements, setMeasurements] = React.useState<MeasurementState>({
    hoveredElement: null,
    parentMeasurements: [],
    elementMeasurements: [],
  })

  const rafRef = React.useRef<number | null>(null)
  const mousePositionRef = React.useRef<{ x: number; y: number } | null>(null)

  // Get element below cursor by temporarily hiding overlay elements
  const getElementBelow = React.useCallback((x: number, y: number): HTMLElement | null => {
    const overlays = document.querySelectorAll('[data-direct-edit]')

    overlays.forEach((el) => {
      ;(el as HTMLElement).style.pointerEvents = 'none'
    })

    const element = document.elementFromPoint(x, y) as HTMLElement | null

    overlays.forEach((el) => {
      ;(el as HTMLElement).style.pointerEvents = ''
    })

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
        setMeasurements({
          hoveredElement: null,
          parentMeasurements: [],
          elementMeasurements: [],
        })
      }
    }

    const handleBlur = () => {
      setAltHeld(false)
      setMeasurements({
        hoveredElement: null,
        parentMeasurements: [],
        elementMeasurements: [],
      })
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setAltHeld(false)
        setMeasurements({
          hoveredElement: null,
          parentMeasurements: [],
          elementMeasurements: [],
        })
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

  // Combined mouse tracking and measurement calculation in single RAF loop
  React.useEffect(() => {
    if (!altHeld || !selectedElement) {
      setMeasurements({
        hoveredElement: null,
        parentMeasurements: [],
        elementMeasurements: [],
      })
      return
    }

    const updateMeasurements = () => {
      const pos = mousePositionRef.current
      if (!pos) {
        // No mouse position yet, just show parent measurements
        setMeasurements({
          hoveredElement: null,
          parentMeasurements: calculateParentMeasurements(selectedElement),
          elementMeasurements: [],
        })
        return
      }

      const element = getElementBelow(pos.x, pos.y)

      const isValidHover =
        element &&
        element !== selectedElement &&
        element !== document.body &&
        element !== document.documentElement

      const hoveredElement = isValidHover ? element : null

      setMeasurements({
        hoveredElement,
        parentMeasurements: calculateParentMeasurements(selectedElement),
        elementMeasurements: hoveredElement
          ? calculateElementMeasurements(selectedElement, hoveredElement)
          : [],
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY }

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }

      rafRef.current = requestAnimationFrame(() => {
        updateMeasurements()
        rafRef.current = null
      })
    }

    // Initial calculation
    updateMeasurements()

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [altHeld, selectedElement, getElementBelow])

  return {
    isActive: altHeld && selectedElement !== null,
    hoveredElement: measurements.hoveredElement,
    parentMeasurements: measurements.parentMeasurements,
    elementMeasurements: measurements.elementMeasurements,
  }
}

import * as React from 'react'
import type { MeasurementLine } from './types'
import { calculateParentMeasurements, calculateElementMeasurements } from './utils'

interface MeasurementState {
  hoveredElement: HTMLElement | null
  measurements: MeasurementLine[]
}

interface UseMeasurementResult {
  isActive: boolean
  hoveredElement: HTMLElement | null
  measurements: MeasurementLine[]
}

export function useMeasurement(selectedElement: HTMLElement | null): UseMeasurementResult {
  const [altHeld, setAltHeld] = React.useState(false)
  const [state, setState] = React.useState<MeasurementState>({
    hoveredElement: null,
    measurements: [],
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
        setState({
          hoveredElement: null,
          measurements: [],
        })
      }
    }

    const handleBlur = () => {
      setAltHeld(false)
      setState({
        hoveredElement: null,
        measurements: [],
      })
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setAltHeld(false)
        setState({
          hoveredElement: null,
          measurements: [],
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

  // Combined mouse tracking and measurement calculation
  React.useEffect(() => {
    if (!altHeld || !selectedElement) {
      setState({
        hoveredElement: null,
        measurements: [],
      })
      return
    }

    const updateMeasurements = () => {
      const pos = mousePositionRef.current
      const measurements: MeasurementLine[] = []

      if (!pos) {
        // No mouse position yet, show parent measurements for selected element
        setState({
          hoveredElement: null,
          measurements: calculateParentMeasurements(selectedElement),
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

      if (hoveredElement) {
        // Hovering over another element:
        // 1. Show distance between selected and hovered element
        // 2. Show hovered element's distance to its parent container
        measurements.push(...calculateElementMeasurements(selectedElement, hoveredElement))
        measurements.push(...calculateParentMeasurements(hoveredElement))
      } else {
        // Not hovering over a specific element:
        // Show selected element's distance to its parent container
        measurements.push(...calculateParentMeasurements(selectedElement))
      }

      setState({
        hoveredElement,
        measurements,
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
    hoveredElement: state.hoveredElement,
    measurements: state.measurements,
  }
}

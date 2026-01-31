import * as React from 'react'
import type { MeasurementLine } from './types'

// Figma-style colors
const MEASUREMENT_COLOR = '#F24822'
const LABEL_BG_COLOR = '#F24822'
const LABEL_TEXT_COLOR = '#FFFFFF'
const SELECTED_HIGHLIGHT_COLOR = '#0D99FF'
const HOVERED_HIGHLIGHT_COLOR = '#F24822'
const END_CAP_SIZE = 4

interface MeasurementOverlayProps {
  selectedElement: HTMLElement
  hoveredElement: HTMLElement | null
  measurements: MeasurementLine[]
}

function MeasurementLineComponent({ line }: { line: MeasurementLine }) {
  const { x1, y1, x2, y2, distance, direction, labelPosition } = line

  if (distance <= 0) return null

  const labelText = `${distance}`
  const labelPadding = 4
  const labelHeight = 16
  const labelWidth = Math.max(labelText.length * 7 + labelPadding * 2, 24)

  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={MEASUREMENT_COLOR}
        strokeWidth={0.5}
      />

      {direction === 'horizontal' ? (
        <>
          <line
            x1={x1}
            y1={y1 - END_CAP_SIZE}
            x2={x1}
            y2={y1 + END_CAP_SIZE}
            stroke={MEASUREMENT_COLOR}
            strokeWidth={0.5}
          />
          <line
            x1={x2}
            y1={y2 - END_CAP_SIZE}
            x2={x2}
            y2={y2 + END_CAP_SIZE}
            stroke={MEASUREMENT_COLOR}
            strokeWidth={0.5}
          />
        </>
      ) : (
        <>
          <line
            x1={x1 - END_CAP_SIZE}
            y1={y1}
            x2={x1 + END_CAP_SIZE}
            y2={y1}
            stroke={MEASUREMENT_COLOR}
            strokeWidth={0.5}
          />
          <line
            x1={x2 - END_CAP_SIZE}
            y1={y2}
            x2={x2 + END_CAP_SIZE}
            y2={y2}
            stroke={MEASUREMENT_COLOR}
            strokeWidth={0.5}
          />
        </>
      )}

      <g transform={`translate(${labelPosition.x}, ${labelPosition.y})`}>
        <rect
          x={-labelWidth / 2}
          y={-labelHeight / 2}
          width={labelWidth}
          height={labelHeight}
          rx={2}
          fill={LABEL_BG_COLOR}
        />
        <text
          x={0}
          y={1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={LABEL_TEXT_COLOR}
          fontSize={11}
          fontWeight={500}
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {labelText}
        </text>
      </g>
    </g>
  )
}

function ElementHighlight({
  element,
  color,
  strokeWidth = 1,
  isDashed = false,
}: {
  element: HTMLElement
  color: string
  strokeWidth?: number
  isDashed?: boolean
}) {
  const rect = element.getBoundingClientRect()

  return (
    <rect
      x={rect.left}
      y={rect.top}
      width={rect.width}
      height={rect.height}
      fill="transparent"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray={isDashed ? '4 2' : undefined}
    />
  )
}

export function MeasurementOverlay({
  selectedElement,
  hoveredElement,
  measurements,
}: MeasurementOverlayProps) {
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0)

  React.useEffect(() => {
    const handleUpdate = () => {
      requestAnimationFrame(forceUpdate)
    }

    window.addEventListener('scroll', handleUpdate, true)
    window.addEventListener('resize', handleUpdate)

    return () => {
      window.removeEventListener('scroll', handleUpdate, true)
      window.removeEventListener('resize', handleUpdate)
    }
  }, [selectedElement])

  return (
    <svg
      data-direct-edit="measurement"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 99998,
      }}
    >
      {/* Selected element highlight (blue) */}
      <ElementHighlight
        element={selectedElement}
        color={SELECTED_HIGHLIGHT_COLOR}
        strokeWidth={1}
      />

      {/* Hovered element highlight (red dashed) */}
      {hoveredElement && (
        <ElementHighlight
          element={hoveredElement}
          color={HOVERED_HIGHLIGHT_COLOR}
          strokeWidth={1}
          isDashed
        />
      )}

      {/* All measurements (red) */}
      {measurements.map((line, i) => (
        <MeasurementLineComponent key={i} line={line} />
      ))}
    </svg>
  )
}

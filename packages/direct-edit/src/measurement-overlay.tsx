import * as React from 'react'
import type { MeasurementLine } from './types'

const MEASUREMENT_COLOR = '#F87171'
const LABEL_BG_COLOR = '#EA580C'
const LABEL_TEXT_COLOR = '#FFFFFF'
const HOVERED_HIGHLIGHT_COLOR = '#F87171'
const END_CAP_SIZE = 4

interface MeasurementOverlayProps {
  selectedElement: HTMLElement
  hoveredElement: HTMLElement | null
  parentMeasurements: MeasurementLine[]
  elementMeasurements: MeasurementLine[]
}

function MeasurementLineComponent({ line }: { line: MeasurementLine }) {
  const { x1, y1, x2, y2, distance, direction, labelPosition } = line

  // Skip rendering if distance is 0 or negative
  if (distance <= 0) return null

  // Calculate label dimensions
  const labelText = `${distance}`
  const labelPadding = 4
  const labelHeight = 16
  const labelWidth = Math.max(labelText.length * 7 + labelPadding * 2, 24)

  return (
    <g>
      {/* Main line */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={MEASUREMENT_COLOR}
        strokeWidth={1}
        strokeDasharray="4 2"
      />

      {/* End caps */}
      {direction === 'horizontal' ? (
        <>
          <line
            x1={x1}
            y1={y1 - END_CAP_SIZE}
            x2={x1}
            y2={y1 + END_CAP_SIZE}
            stroke={MEASUREMENT_COLOR}
            strokeWidth={1}
          />
          <line
            x1={x2}
            y1={y2 - END_CAP_SIZE}
            x2={x2}
            y2={y2 + END_CAP_SIZE}
            stroke={MEASUREMENT_COLOR}
            strokeWidth={1}
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
            strokeWidth={1}
          />
          <line
            x1={x2 - END_CAP_SIZE}
            y1={y2}
            x2={x2 + END_CAP_SIZE}
            y2={y2}
            stroke={MEASUREMENT_COLOR}
            strokeWidth={1}
          />
        </>
      )}

      {/* Distance label */}
      <g transform={`translate(${labelPosition.x}, ${labelPosition.y})`}>
        <rect
          x={-labelWidth / 2}
          y={-labelHeight / 2}
          width={labelWidth}
          height={labelHeight}
          rx={3}
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
  isDashed = false,
}: {
  element: HTMLElement
  color: string
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
      strokeWidth={1}
      strokeDasharray={isDashed ? '4 2' : undefined}
    />
  )
}

export function MeasurementOverlay({
  selectedElement: _selectedElement,
  hoveredElement,
  parentMeasurements,
  elementMeasurements,
}: MeasurementOverlayProps) {
  // Force re-render on scroll/resize to update positions
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
  }, [_selectedElement])

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
      {/* Hovered element highlight */}
      {hoveredElement && (
        <ElementHighlight
          element={hoveredElement}
          color={HOVERED_HIGHLIGHT_COLOR}
          isDashed
        />
      )}

      {/* Parent measurements */}
      {parentMeasurements.map((line, i) => (
        <MeasurementLineComponent key={`parent-${i}`} line={line} />
      ))}

      {/* Element-to-element measurements */}
      {elementMeasurements.map((line, i) => (
        <MeasurementLineComponent key={`element-${i}`} line={line} />
      ))}
    </svg>
  )
}

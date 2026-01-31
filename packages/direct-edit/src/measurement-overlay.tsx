import * as React from 'react'
import type { MeasurementLine } from './types'

// Parent measurement colors (blue theme)
const PARENT_LINE_COLOR = '#3B82F6'
const PARENT_LABEL_BG = '#2563EB'

// Element-to-element measurement colors (orange/red theme)
const ELEMENT_LINE_COLOR = '#F97316'
const ELEMENT_LABEL_BG = '#EA580C'

const LABEL_TEXT_COLOR = '#FFFFFF'
const SELECTED_HIGHLIGHT_COLOR = '#3B82F6'
const HOVERED_HIGHLIGHT_COLOR = '#F97316'
const END_CAP_SIZE = 4

interface MeasurementOverlayProps {
  selectedElement: HTMLElement
  hoveredElement: HTMLElement | null
  parentMeasurements: MeasurementLine[]
  elementMeasurements: MeasurementLine[]
}

function MeasurementLineComponent({
  line,
  lineColor,
  labelBgColor,
}: {
  line: MeasurementLine
  lineColor: string
  labelBgColor: string
}) {
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
        stroke={lineColor}
        strokeWidth={1}
        strokeDasharray="4 2"
      />

      {direction === 'horizontal' ? (
        <>
          <line
            x1={x1}
            y1={y1 - END_CAP_SIZE}
            x2={x1}
            y2={y1 + END_CAP_SIZE}
            stroke={lineColor}
            strokeWidth={1}
          />
          <line
            x1={x2}
            y1={y2 - END_CAP_SIZE}
            x2={x2}
            y2={y2 + END_CAP_SIZE}
            stroke={lineColor}
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
            stroke={lineColor}
            strokeWidth={1}
          />
          <line
            x1={x2 - END_CAP_SIZE}
            y1={y2}
            x2={x2 + END_CAP_SIZE}
            y2={y2}
            stroke={lineColor}
            strokeWidth={1}
          />
        </>
      )}

      <g transform={`translate(${labelPosition.x}, ${labelPosition.y})`}>
        <rect
          x={-labelWidth / 2}
          y={-labelHeight / 2}
          width={labelWidth}
          height={labelHeight}
          rx={3}
          fill={labelBgColor}
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
  strokeWidth = 2,
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
  parentMeasurements,
  elementMeasurements,
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
      {/* Selected element highlight */}
      <ElementHighlight
        element={selectedElement}
        color={SELECTED_HIGHLIGHT_COLOR}
        strokeWidth={2}
      />

      {/* Hovered element highlight */}
      {hoveredElement && (
        <ElementHighlight
          element={hoveredElement}
          color={HOVERED_HIGHLIGHT_COLOR}
          strokeWidth={2}
          isDashed
        />
      )}

      {/* Parent measurements (blue) - only show when no hovered element */}
      {!hoveredElement &&
        parentMeasurements.map((line, i) => (
          <MeasurementLineComponent
            key={`parent-${i}`}
            line={line}
            lineColor={PARENT_LINE_COLOR}
            labelBgColor={PARENT_LABEL_BG}
          />
        ))}

      {/* Element-to-element measurements (orange) */}
      {elementMeasurements.map((line, i) => (
        <MeasurementLineComponent
          key={`element-${i}`}
          line={line}
          lineColor={ELEMENT_LINE_COLOR}
          labelBgColor={ELEMENT_LABEL_BG}
        />
      ))}
    </svg>
  )
}

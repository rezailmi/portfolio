import * as React from 'react'
import type { DragState, DropIndicator } from './types'

const BLUE = '#0D99FF'

interface MoveOverlayProps {
  dragState: DragState
  dropIndicator: DropIndicator | null
}

export function MoveOverlay({ dragState, dropIndicator }: MoveOverlayProps) {
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0)

  React.useEffect(() => {
    function handleUpdate() {
      requestAnimationFrame(forceUpdate)
    }

    window.addEventListener('scroll', handleUpdate, true)
    window.addEventListener('resize', handleUpdate)

    return () => {
      window.removeEventListener('scroll', handleUpdate, true)
      window.removeEventListener('resize', handleUpdate)
    }
  }, [])

  if (!dragState.isDragging || !dragState.draggedElement) {
    return null
  }

  const rect = dragState.draggedElement.getBoundingClientRect()
  const ghostX = dragState.ghostPosition.x
  const ghostY = dragState.ghostPosition.y

  return (
    <svg
      data-direct-edit="move-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 99997,
      }}
    >
      <rect
        x={ghostX}
        y={ghostY}
        width={rect.width}
        height={rect.height}
        fill="transparent"
        stroke={BLUE}
        strokeWidth={2}
        strokeDasharray="6 4"
        rx={4}
      />

      {dropIndicator && (
        <rect
          x={dropIndicator.x}
          y={dropIndicator.y}
          width={dropIndicator.width}
          height={dropIndicator.height}
          fill={BLUE}
          rx={1}
        />
      )}
    </svg>
  )
}

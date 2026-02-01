import * as React from 'react'

const BLUE = '#0D99FF'

interface SelectionOverlayProps {
  selectedElement: HTMLElement
  isFlexItem: boolean
  isDragging: boolean
  onMoveStart: (e: React.PointerEvent) => void
}

export function SelectionOverlay({
  selectedElement,
  isFlexItem,
  isDragging,
  onMoveStart,
}: SelectionOverlayProps) {
  const [rect, setRect] = React.useState(() => selectedElement.getBoundingClientRect())

  React.useEffect(() => {
    function updateRect() {
      setRect(selectedElement.getBoundingClientRect())
    }

    updateRect()

    window.addEventListener('scroll', updateRect, true)
    window.addEventListener('resize', updateRect)

    const observer = new MutationObserver(updateRect)
    observer.observe(selectedElement, {
      attributes: true,
      childList: true,
      subtree: true,
    })

    return () => {
      window.removeEventListener('scroll', updateRect, true)
      window.removeEventListener('resize', updateRect)
      observer.disconnect()
    }
  }, [selectedElement])

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.shiftKey && isFlexItem) {
      e.preventDefault()
      e.stopPropagation()
      onMoveStart(e)
    }
  }

  if (isDragging) {
    return null
  }

  return (
    <>
      <svg
        data-direct-edit="selection-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 99996,
        }}
      >
        <rect
          x={rect.left}
          y={rect.top}
          width={rect.width}
          height={rect.height}
          fill="transparent"
          stroke={BLUE}
          strokeWidth={2}
        />
      </svg>

      <div
        data-direct-edit="selection-handle"
        style={{
          position: 'fixed',
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          zIndex: 99996,
          cursor: isFlexItem ? 'grab' : 'default',
        }}
        onPointerDown={handlePointerDown}
      />

      {isFlexItem && (
        <div
          data-direct-edit="move-hint"
          style={{
            position: 'fixed',
            left: rect.left,
            top: rect.bottom + 4,
            zIndex: 99996,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '2px 6px',
              backgroundColor: BLUE,
              color: '#fff',
              fontSize: 11,
              fontWeight: 500,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              borderRadius: 4,
              whiteSpace: 'nowrap',
            }}
          >
            <kbd
              style={{
                display: 'inline-block',
                padding: '0 3px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 2,
                fontSize: 10,
              }}
            >
              Shift
            </kbd>
            + drag to move
          </div>
        </div>
      )}
    </>
  )
}

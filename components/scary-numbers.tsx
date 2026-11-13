'use client'

import { useState, useEffect, useRef, useCallback, type MouseEvent, type TouchEvent } from 'react'
import * as stylex from '@stylexjs/stylex'
import { mq } from '@/lib/constants.stylex'

const hoverStyles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes jiggleHorizontal {
  0%, 100% { transform: translateX(0) scale(2); }
  50% { transform: translateX(2px) scale(2); }
}
@keyframes jiggleVertical {
  0%, 100% { transform: translateY(0) scale(2); }
  50% { transform: translateY(2px) scale(2); }
}
@keyframes jiggleHorizontalNeighbor {
  0%, 100% { transform: translateX(0) scale(1.3); }
  50% { transform: translateX(2px) scale(1.3); }
}
@keyframes jiggleVerticalNeighbor {
  0%, 100% { transform: translateY(0) scale(1.3); }
  50% { transform: translateY(2px) scale(1.3); }
}

.cell {
  transform: translate(var(--tx, 0), var(--ty, 0)) rotate(var(--rotation, 0)) scale(var(--scale, 1));
}

.cell.dragging {
  transition: none;
  touch-action: none;
}

.cell.center-dragged,
.cell.neighbor-dragged {
  will-change: transform;
}

.cell.center-dragged {
  z-index: 1000;
  --scale: 2;
}

.cell.neighbor-dragged {
  z-index: 999;
  --scale: 1.3;
}

.jiggle-horizontal {
  animation: jiggleHorizontal 0.8s ease-in-out infinite;
}
.jiggle-vertical {
  animation: jiggleVertical 0.8s ease-in-out infinite;
}
.jiggle-horizontal-neighbor {
  animation: jiggleHorizontalNeighbor 0.8s ease-in-out infinite;
}
.jiggle-vertical-neighbor {
  animation: jiggleVerticalNeighbor 0.8s ease-in-out infinite;
}
.cell-fade-in {
  animation: fadeIn 0.7s ease-out forwards;
}
.cursor-grab { cursor: grab; }
.cursor-grabbing { cursor: grabbing; }
.z-front { z-index: 1000; }
@media (prefers-reduced-motion: reduce) {
  .jiggle-horizontal,
  .jiggle-vertical,
  .jiggle-horizontal-neighbor,
  .jiggle-vertical-neighbor {
    animation: none;
  }
}
`

const styles = stylex.create({
  root: {
    backgroundColor: '#040C15',
    borderRadius: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    marginInline: 'auto',
    overflow: 'hidden',
    width: '100%',
  },
  game: {
    flex: '1',
    position: 'relative',
  },
  scroll: {
    cursor: 'default',
    inset: 0,
    overflow: 'hidden',
    position: 'absolute',
    touchAction: 'pan-y',
    userSelect: 'none',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    position: 'relative',
  },
  gridWrap: {
    flex: '1',
    paddingBottom: '90px',
    position: 'relative',
  },
  grid: {
    display: 'grid',
    gap: 0,
    height: '100%',
    inset: 0,
    position: 'absolute',
    transition: {
      default: 'transform 300ms ease-out',
      [mq.reduce]: 'none',
    },
    width: '100%',
  },
  dropzone: {
    alignItems: 'stretch',
    backgroundColor: '#040C15',
    borderTopColor: '#80ECFD',
    borderTopStyle: 'double',
    borderTopWidth: '4px',
    bottom: 0,
    display: 'flex',
    height: 'fit-content',
    justifyContent: 'center',
    left: 0,
    overflow: 'hidden',
    padding: { default: '0.25rem', [mq.sm]: '0.5rem' },
    position: 'absolute',
    right: 0,
    width: '100%',
  },
  lane: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    padding: { default: '0.25rem', [mq.sm]: '0.5rem' },
    width: '25%',
  },
  laneInner: {
    width: '100%',
  },
  laneLabel: {
    backgroundColor: '#040C15',
    borderColor: '#80ECFD',
    borderStyle: 'solid',
    borderWidth: '1px',
    color: '#80ECFD',
    fontSize: 'clamp(12px, 1.2vw, 14px)',
    letterSpacing: '0.05em',
    marginBottom: '0.375rem',
    paddingBlock: '0.125rem',
    textAlign: 'center',
    width: '100%',
  },
  barFrame: {
    backgroundColor: '#040C15',
    borderColor: '#80ECFD',
    borderStyle: 'solid',
    borderWidth: '1px',
    position: 'relative',
    width: '100%',
  },
  barTrack: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: { default: '20px', [mq.sm]: '24px' },
    position: 'relative',
    width: '100%',
  },
  barFill: {
    backgroundColor: '#80ECFD',
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    transformOrigin: 'left',
    transition: {
      default: 'transform 300ms ease-out',
      [mq.reduce]: 'none',
    },
    width: '100%',
  },
  barValue: {
    color: '#000',
    fontSize: 'clamp(12px, 1.2vw, 14px)',
    left: '0.5rem',
    lineHeight: 1,
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 10,
  },
  cell: {
    alignItems: 'center',
    aspectRatio: '1 / 1',
    backgroundColor: 'transparent',
    borderRadius: '0.375rem',
    color: '#80ECFD',
    cursor: 'pointer',
    display: 'flex',
    fontSize: 'clamp(12px, 1.2vw, 14px)',
    fontWeight: 600,
    height: '100%',
    justifyContent: 'center',
    touchAction: 'none',
    transition: 'transform 200ms ease-out',
    width: '100%',
  },
  cellEmpty: {
    alignItems: 'center',
    aspectRatio: '1 / 1',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
})

// Constants
const GRID_SIZE = { rows: 15, cols: 20 } as const
const ANIMATION_DELAY_RANGE = { min: 0.3, max: 0.9 } as const
const PROGRESS_INCREASE = { min: 32, max: 48 } as const
const TRANSFORM_CONFIG = {
  rotation: 90,
  scaleBase: 1,
  scaleRange: 1,
  offsetRange: 48,
} as const

// Utility functions
const getRandomTransform = () => ({
  rotation: Math.random() * TRANSFORM_CONFIG.rotation,
  scale: TRANSFORM_CONFIG.scaleBase + Math.random() * TRANSFORM_CONFIG.scaleRange,
  randomX: (Math.random() - 0.5) * TRANSFORM_CONFIG.offsetRange,
  randomY: (Math.random() - 0.5) * TRANSFORM_CONFIG.offsetRange,
})

const getRandomIncrease = () => {
  const min = PROGRESS_INCREASE.min
  const max = PROGRESS_INCREASE.max
  return min + Math.floor(Math.random() * (max - min + 1))
}

const NEIGHBOR_OFFSETS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
] as const

const getNeighbors = (rowIndex: number, colIndex: number) =>
  NEIGHBOR_OFFSETS.map(([r, c]) => [rowIndex + r, colIndex + c] as const).filter(
    ([r, c]) => r >= 0 && r < GRID_SIZE.rows && c >= 0 && c < GRID_SIZE.cols
  )

const getDragGroup = (row: number, col: number) => [[row, col] as const, ...getNeighbors(row, col)]

const createGrid = (): GridCell[][] =>
  Array.from({ length: GRID_SIZE.rows }, () =>
    Array.from({ length: GRID_SIZE.cols }, () => ({
      value: Math.floor(Math.random() * 9) + 1,
      delay:
        ANIMATION_DELAY_RANGE.min +
        Math.random() * (ANIMATION_DELAY_RANGE.max - ANIMATION_DELAY_RANGE.min),
    }))
  )

function applyTransform(
  element: HTMLElement,
  { rotation, scale }: RandomTransform,
  x: number,
  y: number,
  isCenter: boolean
) {
  element.style.setProperty('--tx', `${x}px`)
  element.style.setProperty('--ty', `${y}px`)
  element.style.setProperty('--rotation', `${rotation}deg`)
  element.style.setProperty('--scale', `${isCenter ? scale + 1 : scale}`)
  element.classList.add('dragging', isCenter ? 'center-dragged' : 'neighbor-dragged')
}

function resetTransform(element: HTMLElement) {
  element.style.removeProperty('--tx')
  element.style.removeProperty('--ty')
  element.style.removeProperty('--rotation')
  element.style.removeProperty('--scale')
  element.classList.remove(
    'dragging',
    'center-dragged',
    'neighbor-dragged',
    'cursor-grabbing',
    'z-front'
  )
}

export default function ScaryNumbers({
  onProgressChange,
}: {
  onProgressChange?: (totalProgress: number) => void
}) {
  const [grid, setGrid] = useState<GridCell[][]>([])
  const [draggedCell, setDraggedCell] = useState<DragState | null>(null)
  const [progress, setProgress] = useState([0, 0, 0, 0])
  const [initialAnimationDone, setInitialAnimationDone] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const dropzoneRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  // Cells keep their DOM node when emptied (same key and tag), so lookups stay valid
  const elementCacheRef = useRef(new Map<string, HTMLElement>())
  const transformsRef = useRef(new Map<HTMLElement, RandomTransform>())

  useEffect(() => {
    const totalProgressValue = Math.round(
      (progress.reduce((sum, value) => sum + value, 0) / (progress.length * 100)) * 100
    )
    onProgressChange?.(totalProgressValue)
  }, [progress, onProgressChange])

  useEffect(() => {
    const elementCache = elementCacheRef.current
    const transforms = transformsRef.current
    setGrid(createGrid())
    // Wait a frame so the fade-in animations play
    const frame = requestAnimationFrame(() => setIsVisible(true))
    return () => {
      cancelAnimationFrame(frame)
      elementCache.clear()
      transforms.clear()
    }
  }, [])

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    if (!isVisible || initialAnimationDone || grid.length === 0) return
    const maxDelay = Math.max(...grid.flat().map((cell) => cell.delay))
    const timer = setTimeout(() => setInitialAnimationDone(true), (maxDelay + 0.5) * 1000)
    return () => clearTimeout(timer)
  }, [grid, isVisible, initialAnimationDone])

  const getCellElement = useCallback((row: number, col: number): HTMLElement | null => {
    const cache = elementCacheRef.current
    const key = `${row}-${col}`
    let element = cache.get(key)
    if (!element) {
      element =
        containerRef.current?.querySelector<HTMLElement>(`[data-row="${row}"][data-col="${col}"]`) ??
        undefined
      if (element) cache.set(key, element)
    }
    return element ?? null
  }, [])

  const setHoverEffect = useCallback(
    (row: number, col: number, isHovered: boolean) => {
      if (draggedCell || grid[row][col].value === 0) return

      const center = getCellElement(row, col)
      if (isHovered) {
        center?.classList.add(
          Math.random() < 0.5 ? 'jiggle-horizontal' : 'jiggle-vertical',
          'cursor-grab'
        )
      } else {
        center?.classList.remove('jiggle-horizontal', 'jiggle-vertical', 'cursor-grab')
      }

      for (const [r, c] of getNeighbors(row, col)) {
        if (grid[r][c].value === 0) continue
        const neighbor = getCellElement(r, c)
        if (isHovered) {
          neighbor?.classList.add(
            'cursor-grab',
            Math.random() < 0.5 ? 'jiggle-horizontal-neighbor' : 'jiggle-vertical-neighbor'
          )
        } else {
          neighbor?.classList.remove(
            'cursor-grab',
            'jiggle-horizontal-neighbor',
            'jiggle-vertical-neighbor'
          )
        }
      }
    },
    [draggedCell, grid, getCellElement]
  )

  const startDrag = useCallback(
    (element: HTMLElement, row: number, col: number, clientX: number, clientY: number) => {
      setDraggedCell({ row, col, initialX: clientX, initialY: clientY })

      const transforms = transformsRef.current
      const centerTransform = getRandomTransform()
      transforms.set(element, centerTransform)
      applyTransform(element, centerTransform, 0, 0, true)
      element.classList.add('cursor-grabbing', 'z-front')
      element.classList.remove('jiggle-horizontal', 'jiggle-vertical')

      for (const [r, c] of getNeighbors(row, col)) {
        const neighbor = getCellElement(r, c)
        if (!neighbor) continue
        const neighborTransform = getRandomTransform()
        transforms.set(neighbor, neighborTransform)
        neighbor.classList.remove('jiggle-horizontal-neighbor', 'jiggle-vertical-neighbor')
        neighbor.classList.add('cursor-grabbing')
        applyTransform(neighbor, neighborTransform, 0, 0, false)
      }
    },
    [getCellElement]
  )

  const releaseDrag = useCallback(
    (drag: DragState) => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      for (const [r, c] of getDragGroup(drag.row, drag.col)) {
        const element = getCellElement(r, c)
        if (!element) continue
        resetTransform(element)
        transformsRef.current.delete(element)
      }
      setDraggedCell(null)
    },
    [getCellElement]
  )

  const endDrag = useCallback(() => {
    if (draggedCell) releaseDrag(draggedCell)
  }, [draggedCell, releaseDrag])

  const moveDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (!draggedCell) return
      const { row, col, initialX, initialY } = draggedCell

      const bounds = dropzoneRef.current?.getBoundingClientRect()
      if (
        bounds &&
        clientY >= bounds.top &&
        clientY <= bounds.bottom &&
        clientX >= bounds.left &&
        clientX <= bounds.right
      ) {
        // Auto release into the lane under the pointer
        const laneIndex = Math.min(
          3,
          Math.max(0, Math.floor((clientX - bounds.left) / (bounds.width / 4)))
        )
        const increase = getRandomIncrease()
        setProgress((prev) =>
          prev.map((value, index) => (index === laneIndex ? Math.min(value + increase, 100) : value))
        )
        setGrid((prevGrid) => {
          const nextGrid = prevGrid.map((cells) => [...cells])
          for (const [r, c] of getDragGroup(row, col)) {
            nextGrid[r][c] = { value: 0, delay: 0 }
          }
          return nextGrid
        })
        releaseDrag(draggedCell)
        return
      }

      const deltaX = clientX - initialX
      const deltaY = clientY - initialY
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        const transforms = transformsRef.current
        for (const [r, c] of getDragGroup(row, col)) {
          const element = getCellElement(r, c)
          const transform = element && transforms.get(element)
          if (!element || !transform) continue
          // Neighbors trail the center cell, spread 6px per grid step
          const isCenter = r === row && c === col
          applyTransform(
            element,
            transform,
            deltaX + (c - col) * 6 + transform.randomX,
            deltaY + (r - row) * 6 + transform.randomY,
            isCenter
          )
        }
      })
    },
    [draggedCell, getCellElement, releaseDrag]
  )

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) =>
    moveDrag(event.clientX, event.clientY)

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0]
    if (touch) moveDrag(touch.clientX, touch.clientY)
  }

  if (grid.length === 0 || !isVisible) {
    return <div {...stylex.props(styles.root)} />
  }

  const isFadingIn = !initialAnimationDone
  const cellProps = stylex.props(styles.cell)

  return (
    <div {...stylex.props(styles.root)}>
      <style href="scary-numbers" precedence="default">
        {hoverStyles}
      </style>
      <div {...stylex.props(styles.game)}>
        <div
          {...stylex.props(styles.scroll)}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onTouchEnd={endDrag}
          onTouchCancel={endDrag}
        >
          {/* Move handlers live here only; cell-level copies would double-count touch drops */}
          <div
            {...stylex.props(styles.column)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
          >
            <div {...stylex.props(styles.gridWrap)}>
              <div
                ref={containerRef}
                {...stylex.props(styles.grid)}
                style={{
                  gridTemplateColumns: `repeat(${GRID_SIZE.cols}, 1fr)`,
                  gridTemplateRows: `repeat(${GRID_SIZE.rows}, 1fr)`,
                  WebkitMaskImage:
                    'radial-gradient(circle at center, black 65%, rgba(0, 0, 0, 0.2) 85%)',
                  maskImage: 'radial-gradient(circle at center, black 65%, rgba(0, 0, 0, 0.2) 85%)',
                }}
              >
                {grid.map((cells, rowIndex) =>
                  cells.map((cell, colIndex) =>
                    cell.value === 0 ? (
                      <div key={`${rowIndex}-${colIndex}`} {...stylex.props(styles.cellEmpty)} />
                    ) : (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        data-row={rowIndex}
                        data-col={colIndex}
                        className={[
                          cellProps.className,
                          'cell',
                          isFadingIn && 'cell-fade-in',
                          draggedCell && 'dragging',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        style={{
                          ...cellProps.style,
                          ...(isFadingIn
                            ? { animationDelay: `${cell.delay}s`, opacity: 0 }
                            : { opacity: 1 }),
                        }}
                        onMouseEnter={() => setHoverEffect(rowIndex, colIndex, true)}
                        onMouseLeave={() => setHoverEffect(rowIndex, colIndex, false)}
                        onMouseDown={(event) => {
                          event.preventDefault()
                          startDrag(
                            event.currentTarget,
                            rowIndex,
                            colIndex,
                            event.clientX,
                            event.clientY
                          )
                        }}
                        onTouchStart={(event) => {
                          event.preventDefault()
                          const touch = event.touches[0]
                          startDrag(
                            event.currentTarget,
                            rowIndex,
                            colIndex,
                            touch.clientX,
                            touch.clientY
                          )
                        }}
                      >
                        {cell.value}
                      </div>
                    )
                  )
                )}
              </div>
            </div>
            <div ref={dropzoneRef} {...stylex.props(styles.dropzone)}>
              {progress.map((value, index) => (
                <div key={index} {...stylex.props(styles.lane)}>
                  <div {...stylex.props(styles.laneInner)}>
                    <div {...stylex.props(styles.laneLabel)}>0{index + 1}</div>
                    <div {...stylex.props(styles.barFrame)}>
                      <div {...stylex.props(styles.barTrack)}>
                        <div
                          {...stylex.props(styles.barFill)}
                          style={{ transform: `scaleX(${value / 100})` }}
                        />

                        <div {...stylex.props(styles.barValue)}>{value}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface GridCell {
  value: number
  delay: number
}

interface DragState {
  row: number
  col: number
  initialX: number
  initialY: number
}

type RandomTransform = ReturnType<typeof getRandomTransform>

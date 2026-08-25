'use client'

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type MouseEvent,
  type TouchEvent,
} from 'react'
import * as stylex from '@stylexjs/stylex'

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

const SM = '@media (min-width: 40rem)'

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
    flex: 1,
    position: 'relative',
  },
  scroll: {
    cursor: 'default',
    inset: 0,
    overflow: 'hidden',
    position: 'absolute',
    touchAction: 'none',
    userSelect: 'none',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    position: 'relative',
  },
  gridWrap: {
    flex: 1,
    paddingBottom: '90px',
    position: 'relative',
  },
  grid: {
    display: 'grid',
    gap: 0,
    height: '100%',
    inset: 0,
    position: 'absolute',
    transition: 'transform 300ms ease-out',
    width: '100%',
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
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
    padding: '0.25rem',
    position: 'absolute',
    right: 0,
    width: '100%',
    [SM]: {
      padding: '0.5rem',
    },
  },
  lane: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    padding: '0.25rem',
    width: '25%',
    [SM]: {
      padding: '0.5rem',
    },
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
    height: '20px',
    position: 'relative',
    width: '100%',
    [SM]: {
      height: '24px',
    },
  },
  barFill: {
    backgroundColor: '#80ECFD',
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    transformOrigin: 'left',
    transition: 'transform 300ms ease-out',
    width: '100%',
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
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
    transition: 'transform 200ms ease-out',
    width: '100%',
    willChange: 'transform',
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

const getNeighborOffsets = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
] as const

const getNeighbors = (rowIndex: number, colIndex: number, gridLength: number, gridWidth: number) =>
  getNeighborOffsets
    .map(([r, c]) => [rowIndex + r, colIndex + c])
    .filter(([r, c]) => r >= 0 && r < gridLength && c >= 0 && c < gridWidth)

export default function ScaryNumbers({
  onProgressChange,
}: {
  onProgressChange?: (totalProgress: number) => void
}) {
  const [grid, setGrid] = useState<Array<Array<{ value: number; delay: number }>>>([])
  const [draggedCell, setDraggedCell] = useState<{
    row: number
    col: number
    initialX: number
    initialY: number
  } | null>(null)
  const [progress, setProgress] = useState([0, 0, 0, 0])
  const [initialAnimationDone, setInitialAnimationDone] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Calculate and notify total progress whenever progress changes
  useEffect(() => {
    const totalProgressValue = Math.round(
      (progress.reduce((sum, value) => sum + value, 0) / (progress.length * 100)) * 100
    )
    onProgressChange?.(totalProgressValue)
  }, [progress, onProgressChange])

  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const dropzoneRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const elementCacheRef = useRef(new Map())

  // Initialize grid and cleanup
  useEffect(() => {
    const initialGrid = Array(GRID_SIZE.rows)
      .fill(null)
      .map(() =>
        Array(GRID_SIZE.cols)
          .fill(null)
          .map(() => ({
            value: Math.floor(Math.random() * 9) + 1,
            delay:
              ANIMATION_DELAY_RANGE.min +
              Math.random() * (ANIMATION_DELAY_RANGE.max - ANIMATION_DELAY_RANGE.min),
          }))
      )
    setGrid(initialGrid)
    // Add a small delay before showing the grid to ensure animations play
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
  }, [])

  // Clear cache when component unmounts
  useEffect(() => {
    const elementCache = elementCacheRef
    return () => {
      elementCache.current.clear()
    }
  }, [elementCacheRef])

  // Setup animations
  useEffect(() => {
    if (!isVisible || grid.length === 0) return

    const style = document.createElement('style')
    style.textContent = hoverStyles
    document.head.appendChild(style)

    const maxDelay = Math.max(...grid.flat().map((cell) => cell.delay))
    const timer = setTimeout(() => setInitialAnimationDone(true), (maxDelay + 0.5) * 1000)

    return () => {
      document.head.removeChild(style)
      clearTimeout(timer)
    }
  }, [grid, isVisible])

  const getCachedElement = useCallback(
    (row: number, col: number): HTMLElement | null => {
      const elementCache = elementCacheRef
      const key = `${row}-${col}`
      if (!elementCache.current.has(key)) {
        const element = document.querySelector(
          `[data-row="${row}"][data-col="${col}"]`
        ) as HTMLElement
        if (element) elementCache.current.set(key, element)
      }
      return elementCache.current.get(key) || null
    },
    [elementCacheRef]
  )

  const updateElementTransforms = useCallback(
    (
      element: HTMLElement | null,
      transforms: { rotation: number; scale: number; x?: number; y?: number },
      isCenter = false
    ) => {
      if (!element) return
      const { rotation, scale, x = 0, y = 0 } = transforms
      element.style.setProperty('--tx', `${x}px`)
      element.style.setProperty('--ty', `${y}px`)
      element.style.setProperty('--rotation', `${rotation}deg`)
      element.style.setProperty('--scale', isCenter ? `${scale + 1}` : `${scale}`)
      element.classList.add('dragging', isCenter ? 'center-dragged' : 'neighbor-dragged')
    },
    []
  )

  const resetElementStyles = useCallback((element: HTMLElement | null) => {
    if (!element) return
    element.style.removeProperty('--tx')
    element.style.removeProperty('--ty')
    element.style.removeProperty('--rotation')
    element.style.removeProperty('--scale')
    element.classList.remove('dragging', 'center-dragged', 'neighbor-dragged', 'cursor-grabbing')
    element.removeAttribute('data-random-transform')
  }, [])

  const handleMouseEnter = useCallback(
    (rowIndex: number, colIndex: number) => {
      if (!draggedCell && grid[rowIndex][colIndex].value !== 0) {
        const centerElement = getCachedElement(rowIndex, colIndex)
        const jiggleClass = Math.random() < 0.5 ? 'jiggle-horizontal' : 'jiggle-vertical'
        centerElement?.classList.add(jiggleClass, 'cursor-grab')

        getNeighbors(rowIndex, colIndex, grid.length, grid[0].length).forEach(([r, c]) => {
          if (grid[r][c].value !== 0) {
            const neighborElement = getCachedElement(r, c)
            neighborElement?.classList.add('cursor-grab')
            neighborElement?.classList.add(
              Math.random() < 0.5 ? 'jiggle-horizontal-neighbor' : 'jiggle-vertical-neighbor'
            )
          }
        })
      }
    },
    [draggedCell, grid, getCachedElement]
  )

  const handleMouseLeave = useCallback(
    (rowIndex: number, colIndex: number) => {
      if (!draggedCell && grid[rowIndex][colIndex].value !== 0) {
        const centerElement = getCachedElement(rowIndex, colIndex)
        centerElement?.classList.remove('jiggle-horizontal', 'jiggle-vertical', 'cursor-grab')

        getNeighbors(rowIndex, colIndex, grid.length, grid[0].length).forEach(([r, c]) => {
          if (grid[r][c].value !== 0) {
            const neighborElement = getCachedElement(r, c)
            neighborElement?.classList.remove(
              'cursor-grab',
              'jiggle-horizontal-neighbor',
              'jiggle-vertical-neighbor'
            )
          }
        })
      }
    },
    [draggedCell, grid, getCachedElement]
  )

  const handleMouseDown = useCallback(
    (event: MouseEvent<HTMLDivElement>, rowIndex: number, colIndex: number) => {
      event.preventDefault()
      const element = event.currentTarget
      setDraggedCell({
        row: rowIndex,
        col: colIndex,
        initialX: event.clientX,
        initialY: event.clientY,
      })

      const centerTransform = getRandomTransform()
      element.setAttribute('data-random-transform', JSON.stringify(centerTransform))
      updateElementTransforms(element, centerTransform, true)
      element.classList.add('cursor-grabbing', 'z-front')
      element.classList.remove('jiggle-horizontal', 'jiggle-vertical')

      getNeighbors(rowIndex, colIndex, grid.length, grid[0].length).forEach(([r, c]) => {
        const neighborElement = getCachedElement(r, c)
        if (neighborElement) {
          const neighborTransform = getRandomTransform()
          neighborElement.setAttribute('data-random-transform', JSON.stringify(neighborTransform))
          neighborElement.classList.remove('jiggle-horizontal-neighbor', 'jiggle-vertical-neighbor')
          neighborElement.classList.add('cursor-grabbing')
          updateElementTransforms(neighborElement, neighborTransform)
        }
      })
    },
    [grid, updateElementTransforms, getCachedElement]
  )

  const updateDraggedElements = useCallback(
    (deltaX: number, deltaY: number) => {
      if (!draggedCell) return

      const centerElement = getCachedElement(draggedCell.row, draggedCell.col)
      if (centerElement) {
        const currentTransform = centerElement.getAttribute('data-random-transform')
        if (currentTransform) {
          const { rotation, scale, randomX, randomY } = JSON.parse(currentTransform)
          updateElementTransforms(
            centerElement,
            { rotation, scale, x: deltaX + randomX, y: deltaY + randomY },
            true
          )
        }
      }

      getNeighbors(draggedCell.row, draggedCell.col, grid.length, grid[0].length).forEach(
        ([r, c]) => {
          const neighborElement = getCachedElement(r, c)
          if (neighborElement) {
            const currentTransform = neighborElement.getAttribute('data-random-transform')
            if (currentTransform) {
              const { rotation, scale, randomX, randomY } = JSON.parse(currentTransform)
              const baseOffsetX = (c - draggedCell.col) * 6
              const baseOffsetY = (r - draggedCell.row) * 6
              updateElementTransforms(neighborElement, {
                rotation,
                scale,
                x: deltaX + baseOffsetX + randomX,
                y: deltaY + baseOffsetY + randomY,
              })
            }
          }
        }
      )
    },
    [draggedCell, grid, getCachedElement, updateElementTransforms]
  )

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const container = containerRef.current
      const scroll = scrollRef.current
      const dropzone = dropzoneRef.current

      if (container && scroll && draggedCell) {
        const deltaX = event.clientX - draggedCell.initialX
        const deltaY = event.clientY - draggedCell.initialY

        // Check if dragged over dropzone
        if (dropzone) {
          const dropzoneBounds = dropzone.getBoundingClientRect()
          if (
            event.clientY >= dropzoneBounds.top &&
            event.clientY <= dropzoneBounds.bottom &&
            event.clientX >= dropzoneBounds.left &&
            event.clientX <= dropzoneBounds.right
          ) {
            // Auto release
            const dropzoneWidth = dropzoneBounds.width / 4
            const dropzoneIndex = Math.min(3, Math.max(0, Math.floor((event.clientX - dropzoneBounds.left) / dropzoneWidth)))

            setProgress((prev) => {
              const newProgress = [...prev]
              const increase = getRandomIncrease()
              newProgress[dropzoneIndex] = Math.min(newProgress[dropzoneIndex] + increase, 100)
              return newProgress
            })

            setGrid((prevGrid) => {
              const newGrid = prevGrid.map((row) => [...row])
              const neighbors = getNeighbors(
                draggedCell.row,
                draggedCell.col,
                newGrid.length,
                newGrid[0].length
              )
              neighbors.push([draggedCell.row, draggedCell.col])
              neighbors.forEach(([r, c]) => {
                newGrid[r][c] = { value: 0, delay: 0 }
              })
              return newGrid
            })

            // Reset styles and clear drag state
            const centerElement = getCachedElement(draggedCell.row, draggedCell.col)
            resetElementStyles(centerElement)

            getNeighbors(draggedCell.row, draggedCell.col, grid.length, grid[0].length).forEach(
              ([r, c]) => {
                const neighborElement = getCachedElement(r, c)
                resetElementStyles(neighborElement)
              }
            )

            setDraggedCell(null)
            return
          }
        }

        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current)
        }

        rafRef.current = requestAnimationFrame(() => {
          updateDraggedElements(deltaX, deltaY)
        })
      }
    },
    [
      draggedCell,
      updateDraggedElements,
      containerRef,
      scrollRef,
      rafRef,
      dropzoneRef,
      grid,
      getCachedElement,
      resetElementStyles,
    ]
  )

  const handleMouseUp = useCallback(() => {
    if (!draggedCell) return

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    const centerElement = getCachedElement(draggedCell.row, draggedCell.col)
    resetElementStyles(centerElement)

    getNeighbors(draggedCell.row, draggedCell.col, grid.length, grid[0].length).forEach(
      ([r, c]) => {
        const neighborElement = getCachedElement(r, c)
        resetElementStyles(neighborElement)
      }
    )

    setDraggedCell(null)
  }, [draggedCell, grid, getCachedElement, rafRef, resetElementStyles])

  const handleTouchStart = useCallback(
    (event: TouchEvent<HTMLDivElement>, rowIndex: number, colIndex: number) => {
      event.preventDefault()
      const element = event.currentTarget
      const touch = event.touches[0]
      setDraggedCell({
        row: rowIndex,
        col: colIndex,
        initialX: touch.clientX,
        initialY: touch.clientY,
      })

      const centerTransform = getRandomTransform()
      element.setAttribute('data-random-transform', JSON.stringify(centerTransform))
      updateElementTransforms(element, centerTransform, true)
      element.classList.add('cursor-grabbing', 'z-front')
      element.classList.remove('jiggle-horizontal', 'jiggle-vertical')

      getNeighbors(rowIndex, colIndex, grid.length, grid[0].length).forEach(([r, c]) => {
        const neighborElement = getCachedElement(r, c)
        if (neighborElement) {
          const neighborTransform = getRandomTransform()
          neighborElement.setAttribute('data-random-transform', JSON.stringify(neighborTransform))
          neighborElement.classList.remove('jiggle-horizontal-neighbor', 'jiggle-vertical-neighbor')
          neighborElement.classList.add('cursor-grabbing')
          updateElementTransforms(neighborElement, neighborTransform)
        }
      })
    },
    [grid, updateElementTransforms, getCachedElement]
  )

  const handleTouchMove = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const container = containerRef.current
      const scroll = scrollRef.current
      const dropzone = dropzoneRef.current

      if (container && scroll && draggedCell) {
        const touch = event.touches[0]
        const deltaX = touch.clientX - draggedCell.initialX
        const deltaY = touch.clientY - draggedCell.initialY

        // Check if dragged over dropzone
        if (dropzone) {
          const dropzoneBounds = dropzone.getBoundingClientRect()
          if (
            touch.clientY >= dropzoneBounds.top &&
            touch.clientY <= dropzoneBounds.bottom &&
            touch.clientX >= dropzoneBounds.left &&
            touch.clientX <= dropzoneBounds.right
          ) {
            // Auto release
            const dropzoneWidth = dropzoneBounds.width / 4
            const dropzoneIndex = Math.min(3, Math.max(0, Math.floor((touch.clientX - dropzoneBounds.left) / dropzoneWidth)))

            setProgress((prev) => {
              const newProgress = [...prev]
              const increase = getRandomIncrease()
              newProgress[dropzoneIndex] = Math.min(newProgress[dropzoneIndex] + increase, 100)
              return newProgress
            })

            setGrid((prevGrid) => {
              const newGrid = prevGrid.map((row) => [...row])
              const neighbors = getNeighbors(
                draggedCell.row,
                draggedCell.col,
                newGrid.length,
                newGrid[0].length
              )
              neighbors.push([draggedCell.row, draggedCell.col])
              neighbors.forEach(([r, c]) => {
                newGrid[r][c] = { value: 0, delay: 0 }
              })
              return newGrid
            })

            // Reset styles and clear drag state
            const centerElement = getCachedElement(draggedCell.row, draggedCell.col)
            resetElementStyles(centerElement)

            getNeighbors(draggedCell.row, draggedCell.col, grid.length, grid[0].length).forEach(
              ([r, c]) => {
                const neighborElement = getCachedElement(r, c)
                resetElementStyles(neighborElement)
              }
            )

            setDraggedCell(null)
            return
          }
        }

        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current)
        }

        rafRef.current = requestAnimationFrame(() => {
          updateDraggedElements(deltaX, deltaY)
        })
      }
    },
    [
      draggedCell,
      updateDraggedElements,
      containerRef,
      scrollRef,
      rafRef,
      dropzoneRef,
      grid,
      getCachedElement,
      resetElementStyles,
    ]
  )

  const handleTouchEnd = useCallback(() => {
    if (!draggedCell) return

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    const centerElement = getCachedElement(draggedCell.row, draggedCell.col)
    resetElementStyles(centerElement)

    getNeighbors(draggedCell.row, draggedCell.col, grid.length, grid[0].length).forEach(
      ([r, c]) => {
        const neighborElement = getCachedElement(r, c)
        resetElementStyles(neighborElement)
      }
    )

    setDraggedCell(null)
  }, [draggedCell, grid, getCachedElement, rafRef, resetElementStyles])

  const memoizedGrid = useMemo(() => grid, [grid])

  const renderCell = useCallback(
    (cell: { value: number; delay: number }, rowIndex: number, colIndex: number) => {
      if (cell.value === 0) {
        return <div key={`${rowIndex}-${colIndex}`} {...stylex.props(styles.cellEmpty)} />
      }

      const cellProps = stylex.props(styles.cell)
      return (
        <div
          key={`${rowIndex}-${colIndex}`}
          data-row={rowIndex}
          data-col={colIndex}
          className={[
            cellProps.className,
            'cell',
            !initialAnimationDone && isVisible ? 'cell-fade-in' : '',
            draggedCell ? 'dragging' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          style={{
            ...cellProps.style,
            ...(!initialAnimationDone && isVisible
              ? { animationDelay: `${cell.delay}s`, opacity: 0 }
              : { opacity: 1 }),
          }}
          onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
          onMouseLeave={() => handleMouseLeave(rowIndex, colIndex)}
          onMouseDown={(e) => handleMouseDown(e, rowIndex, colIndex)}
          onTouchStart={(e) => handleTouchStart(e, rowIndex, colIndex)}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {cell.value}
        </div>
      )
    },
    [
      initialAnimationDone,
      isVisible,
      draggedCell,
      handleMouseEnter,
      handleMouseLeave,
      handleMouseDown,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
    ]
  )

  if (memoizedGrid.length === 0 || !isVisible) {
    return <div {...stylex.props(styles.root)} />
  }

  return (
    <div {...stylex.props(styles.root)}>
      <div {...stylex.props(styles.game)}>
        <div
          ref={scrollRef}
          {...stylex.props(styles.scroll)}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
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
                {memoizedGrid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))
                )}
              </div>
            </div>
            <div ref={dropzoneRef} {...stylex.props(styles.dropzone)}>
              {[0, 1, 2, 3].map((index) => (
                <div key={index} {...stylex.props(styles.lane)}>
                  <div {...stylex.props(styles.laneInner)}>
                    <div {...stylex.props(styles.laneLabel)}>0{index + 1}</div>
                    <div {...stylex.props(styles.barFrame)}>
                      <div {...stylex.props(styles.barTrack)}>
                        <div
                          {...stylex.props(styles.barFill)}
                          style={{ transform: `scaleX(${progress[index] / 100})` }}
                        />
                        <div {...stylex.props(styles.barValue)}>{progress[index]}%</div>
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

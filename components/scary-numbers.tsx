"use client"

import { useState, useEffect, useRef, useCallback, useMemo, type MouseEvent } from "react"

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
.animate-fade-in {
  animation: fadeIn 0.7s ease-out forwards;
}
`

// Constants
const GRID_SIZE = { rows: 15, cols: 25 } as const
const ANIMATION_DELAY_RANGE = { min: 0.3, max: 0.9 } as const
const PROGRESS_INCREASE = { min: 10, max: 25 } as const
const TRANSFORM_CONFIG = {
  rotation: 360,
  scaleBase: 1,
  scaleRange: 1,
  offsetRange: 60,
} as const

// Utility functions
const getRandomTransform = () => ({
  rotation: Math.random() * TRANSFORM_CONFIG.rotation,
  scale: TRANSFORM_CONFIG.scaleBase + Math.random() * TRANSFORM_CONFIG.scaleRange,
  randomX: (Math.random() - 0.5) * TRANSFORM_CONFIG.offsetRange,
  randomY: (Math.random() - 0.5) * TRANSFORM_CONFIG.offsetRange,
})

const getRandomIncrease = () => 
  Math.floor(Math.random() * (PROGRESS_INCREASE.max - PROGRESS_INCREASE.min + 1) + PROGRESS_INCREASE.min)

const getNeighborOffsets = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],          [0, 1],
  [1, -1],  [1, 0],  [1, 1],
] as const

const getNeighbors = (rowIndex: number, colIndex: number, gridLength: number, gridWidth: number) =>
  getNeighborOffsets
    .map(([r, c]) => [rowIndex + r, colIndex + c])
    .filter(([r, c]) => r >= 0 && r < gridLength && c >= 0 && c < gridWidth)

export default function ScaryNumbers() {
  const [grid, setGrid] = useState<Array<Array<{ value: number; delay: number }>>>([])
  const [draggedCell, setDraggedCell] = useState<{
    row: number
    col: number
    initialX: number
    initialY: number
  } | null>(null)
  const [progress, setProgress] = useState([0, 0, 0, 0])
  const [initialAnimationDone, setInitialAnimationDone] = useState(false)
  
  // Consolidate all refs
  const refs = {
    container: useRef<HTMLDivElement>(null),
    scroll: useRef<HTMLDivElement>(null),
    dropzone: useRef<HTMLDivElement>(null),
    raf: useRef<number | null>(null),
    elementCache: useRef(new Map()),
  }

  // Initialize grid
  useEffect(() => {
    const initialGrid = Array(GRID_SIZE.rows).fill(null).map(() =>
      Array(GRID_SIZE.cols).fill(null).map(() => ({
        value: Math.floor(Math.random() * 9) + 1,
        delay: ANIMATION_DELAY_RANGE.min + Math.random() * (ANIMATION_DELAY_RANGE.max - ANIMATION_DELAY_RANGE.min),
      }))
    )
    setGrid(initialGrid)
    return () => refs.elementCache.current.clear()
  }, [])

  // Setup animations
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = hoverStyles
    document.head.appendChild(style)

    const maxDelay = Math.max(...grid.flat().map(cell => cell.delay))
    const timer = setTimeout(() => setInitialAnimationDone(true), (maxDelay + 0.5) * 1000)

    return () => {
      document.head.removeChild(style)
      clearTimeout(timer)
    }
  }, [grid])

  const getCachedElement = useCallback((row: number, col: number): HTMLElement | null => {
    const key = `${row}-${col}`
    if (!refs.elementCache.current.has(key)) {
      const element = document.querySelector(`[data-row="${row}"][data-col="${col}"]`) as HTMLElement
      if (element) refs.elementCache.current.set(key, element)
    }
    return refs.elementCache.current.get(key) || null
  }, [])

  const updateElementTransforms = useCallback((
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
  }, [])

  const handleMouseEnter = useCallback((rowIndex: number, colIndex: number) => {
    if (!draggedCell && grid[rowIndex][colIndex].value !== 0) {
      const centerElement = getCachedElement(rowIndex, colIndex)
      const jiggleClass = Math.random() < 0.5 ? "jiggle-horizontal" : "jiggle-vertical"
      centerElement?.classList.add(jiggleClass, "cursor-grab")

      getNeighbors(rowIndex, colIndex, grid.length, grid[0].length).forEach(([r, c]) => {
        if (grid[r][c].value !== 0) {
          const neighborElement = getCachedElement(r, c)
          neighborElement?.classList.add("cursor-grab")
          neighborElement?.classList.add(Math.random() < 0.5 ? "jiggle-horizontal-neighbor" : "jiggle-vertical-neighbor")
        }
      })
    }
  }, [draggedCell, grid, getCachedElement])

  const handleMouseLeave = useCallback((rowIndex: number, colIndex: number) => {
    if (!draggedCell && grid[rowIndex][colIndex].value !== 0) {
      const centerElement = getCachedElement(rowIndex, colIndex)
      centerElement?.classList.remove("jiggle-horizontal", "jiggle-vertical", "cursor-grab")

      getNeighbors(rowIndex, colIndex, grid.length, grid[0].length).forEach(([r, c]) => {
        if (grid[r][c].value !== 0) {
          const neighborElement = getCachedElement(r, c)
          neighborElement?.classList.remove(
            "cursor-grab", 
            "jiggle-horizontal-neighbor", 
            "jiggle-vertical-neighbor"
          )
        }
      })
    }
  }, [draggedCell, grid, getCachedElement])

  const handleMouseDown = useCallback((event: MouseEvent<HTMLDivElement>, rowIndex: number, colIndex: number) => {
    event.preventDefault()
    const element = event.currentTarget
    setDraggedCell({ row: rowIndex, col: colIndex, initialX: event.clientX, initialY: event.clientY })

    const centerTransform = getRandomTransform()
    element.setAttribute("data-random-transform", JSON.stringify(centerTransform))
    updateElementTransforms(element, centerTransform, true)
    element.classList.add("cursor-grabbing", "z-[1000]")
    element.classList.remove("jiggle-horizontal", "jiggle-vertical")

    getNeighbors(rowIndex, colIndex, grid.length, grid[0].length).forEach(([r, c]) => {
      const neighborElement = getCachedElement(r, c)
      if (neighborElement) {
        const neighborTransform = getRandomTransform()
        neighborElement.setAttribute("data-random-transform", JSON.stringify(neighborTransform))
        neighborElement.classList.remove("jiggle-horizontal-neighbor", "jiggle-vertical-neighbor")
        neighborElement.classList.add("cursor-grabbing")
        updateElementTransforms(neighborElement, neighborTransform)
      }
    })
  }, [grid, updateElementTransforms, getCachedElement])

  const updateDraggedElements = useCallback((deltaX: number, deltaY: number) => {
    if (!draggedCell) return

    const centerElement = getCachedElement(draggedCell.row, draggedCell.col)
    if (centerElement) {
      const currentTransform = centerElement.getAttribute("data-random-transform")
      if (currentTransform) {
        const { rotation, scale, randomX, randomY } = JSON.parse(currentTransform)
        updateElementTransforms(
          centerElement, 
          { rotation, scale, x: deltaX + randomX, y: deltaY + randomY },
          true
        )
      }
    }

    getNeighbors(draggedCell.row, draggedCell.col, grid.length, grid[0].length).forEach(([r, c]) => {
      const neighborElement = getCachedElement(r, c)
      if (neighborElement) {
        const currentTransform = neighborElement.getAttribute("data-random-transform")
        if (currentTransform) {
          const { rotation, scale, randomX, randomY } = JSON.parse(currentTransform)
          const baseOffsetX = (c - draggedCell.col) * 6
          const baseOffsetY = (r - draggedCell.row) * 6
          updateElementTransforms(
            neighborElement,
            { 
              rotation, 
              scale, 
              x: deltaX + baseOffsetX + randomX, 
              y: deltaY + baseOffsetY + randomY 
            }
          )
        }
      }
    })
  }, [draggedCell, grid, getCachedElement, updateElementTransforms])

  const handleMouseMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (refs.container.current && refs.scroll.current && draggedCell) {
      const deltaX = event.clientX - draggedCell.initialX
      const deltaY = event.clientY - draggedCell.initialY

      if (refs.raf.current !== null) {
        cancelAnimationFrame(refs.raf.current)
      }

      refs.raf.current = requestAnimationFrame(() => {
        updateDraggedElements(deltaX, deltaY)
      })
    }
  }, [draggedCell, updateDraggedElements])

  const resetElementStyles = useCallback((element: HTMLElement | null) => {
    if (!element) return
    element.style.removeProperty('--tx')
    element.style.removeProperty('--ty')
    element.style.removeProperty('--rotation')
    element.style.removeProperty('--scale')
    element.classList.remove('dragging', 'center-dragged', 'neighbor-dragged', 'cursor-grabbing')
    element.removeAttribute("data-random-transform")
  }, [])

  const handleMouseUp = useCallback((event: MouseEvent) => {
    if (!draggedCell) return

    if (refs.raf.current !== null) {
      cancelAnimationFrame(refs.raf.current)
      refs.raf.current = null
    }

    if (refs.dropzone.current) {
      const dropzoneBounds = refs.dropzone.current.getBoundingClientRect()
      if (
        event.clientX >= dropzoneBounds.left &&
        event.clientX <= dropzoneBounds.right &&
        event.clientY >= dropzoneBounds.top &&
        event.clientY <= dropzoneBounds.bottom
      ) {
        const dropzoneWidth = dropzoneBounds.width / 4
        const dropzoneIndex = Math.floor((event.clientX - dropzoneBounds.left) / dropzoneWidth)
        
        setProgress(prev => {
          const newProgress = [...prev]
          const increase = getRandomIncrease()
          newProgress[dropzoneIndex] = Math.min(newProgress[dropzoneIndex] + increase, 100)
          return newProgress
        })

        setGrid(prevGrid => {
          const newGrid = prevGrid.map(row => [...row])
          const neighbors = getNeighbors(draggedCell.row, draggedCell.col, newGrid.length, newGrid[0].length)
          neighbors.push([draggedCell.row, draggedCell.col])
          neighbors.forEach(([r, c]) => {
            newGrid[r][c] = { value: 0, delay: 0 }
          })
          return newGrid
        })
      }
    }

    const centerElement = getCachedElement(draggedCell.row, draggedCell.col)
    resetElementStyles(centerElement)

    getNeighbors(draggedCell.row, draggedCell.col, grid.length, grid[0].length).forEach(([r, c]) => {
      const neighborElement = getCachedElement(r, c)
      resetElementStyles(neighborElement)
    })

    setDraggedCell(null)
  }, [draggedCell, grid, getCachedElement, getRandomIncrease])

  const memoizedGrid = useMemo(() => grid, [grid])

  const renderCell = useCallback(
    (cell: { value: number; delay: number }, rowIndex: number, colIndex: number) => {
      if (cell.value === 0) {
        return <div key={`${rowIndex}-${colIndex}`} className="w-8 h-8" />
      }

      return (
        <div
          key={`${rowIndex}-${colIndex}`}
          data-row={rowIndex}
          data-col={colIndex}
          className={`cell w-8 h-8 flex items-center justify-center bg-transparent 
            hover:bg-transparent text-[#80ECFD] text-sm font-semibold rounded-md cursor-pointer
            transition-transform duration-200 ease-out will-change-transform
            ${!initialAnimationDone ? "animate-fade-in" : ""}
            ${draggedCell ? "transition-none" : ""}`}
          style={!initialAnimationDone ? { 
            animationDelay: `${cell.delay}s`,
            opacity: 0
          } : { 
            opacity: 1
          }}
          onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
          onMouseLeave={() => handleMouseLeave(rowIndex, colIndex)}
          onMouseDown={(e) => handleMouseDown(e, rowIndex, colIndex)}
        >
          {cell.value}
        </div>
      )
    },
    [initialAnimationDone, draggedCell, handleMouseEnter, handleMouseLeave, handleMouseDown],
  )

  if (memoizedGrid.length === 0) {
    return <div className="flex flex-col h-[600px] bg-[#040C15] dark overflow-hidden max-w-[800px] mx-auto" />
  }

  return (
    <div className="flex flex-col h-[600px] bg-[#040C15] dark overflow-hidden max-w-[800px] mx-auto">
      <div className="relative flex-1 overflow-hidden">
        <div
          ref={refs.scroll}
          className="absolute inset-0 overflow-hidden cursor-default scrollbar-hide select-none"
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="relative" onMouseMove={handleMouseMove}>
            <div
              ref={refs.container}
              className="grid gap-0 transition-transform duration-300 ease-out relative"
              style={{
                gridTemplateColumns: `repeat(${GRID_SIZE.cols}, 32px)`,
                gridTemplateRows: `repeat(${GRID_SIZE.rows}, 32px)`,
                WebkitMaskImage: 'radial-gradient(circle at center, black 65%, rgba(0, 0, 0, 0.2) 85%)',
                maskImage: 'radial-gradient(circle at center, black 65%, rgba(0, 0, 0, 0.2) 85%)',
              }}
            >
              {memoizedGrid.map((row, rowIndex) =>
                row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex)),
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        ref={refs.dropzone}
        className="w-full bg-[#040C15] flex items-stretch justify-center border-t-4 border-double border-t-[#80ECFD] overflow-hidden"
      >
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="w-1/4 flex items-center justify-center py-4 px-4">
            <div className="w-full">
              <div className="bg-[#040C15] border border-[#80ECFD] py-1 text-sm text-[#80ECFD] mb-2 tracking-wider w-full text-center">
                0{index + 1}
              </div>
              <div className="bg-[#040C15] border border-[#80ECFD] w-full relative">
                <div className="w-full h-[30px] bg-black/50 relative">
                  <div
                    className="absolute left-0 top-0 h-full bg-[#80ECFD] transition-[width] duration-300 ease-out"
                    style={{ width: `${progress[index]}%` }}
                  />
                  <div className="absolute top-1/2 left-2 -translate-y-1/2 text-sm text-black text-base z-10 py-1 leading-none">
                    {progress[index]}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


'use client'

import type React from 'react'
import { useCallback, useRef, useEffect } from 'react'

interface LettermarkProps {
  size: number
  parallaxStrength: number
  tiltStrength: number
  outerColor: string
  innerColor: string
}

const Lettermark: React.FC<LettermarkProps> = ({
  size,
  parallaxStrength,
  tiltStrength,
  outerColor,
  innerColor,
}) => {
  const svgRef = useRef<SVGSVGElement>(null)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current
      if (!svg) return

      const rect = svg.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5

      const slowFactor = 0.065 * parallaxStrength
      const fastFactor = 0.081 * parallaxStrength
      const tiltFactor = 20.58 * tiltStrength

      requestAnimationFrame(() => {
        svg.style.setProperty('--x-slow', `${x * size * slowFactor}px`)
        svg.style.setProperty('--y-slow', `${y * size * slowFactor}px`)
        svg.style.setProperty('--x-fast', `${x * size * fastFactor}px`)
        svg.style.setProperty('--y-fast', `${y * size * fastFactor}px`)
        svg.style.setProperty('--tilt-x', `${y * tiltFactor}deg`)
        svg.style.setProperty('--tilt-y', `${-x * tiltFactor}deg`)
      })
    },
    [size, parallaxStrength, tiltStrength]
  )

  const handleMouseLeave = useCallback(() => {
    const svg = svgRef.current
    if (!svg) return

    requestAnimationFrame(() => {
      svg.style.setProperty('--x-slow', '0px')
      svg.style.setProperty('--y-slow', '0px')
      svg.style.setProperty('--x-fast', '0px')
      svg.style.setProperty('--y-fast', '0px')
      svg.style.setProperty('--tilt-x', '0deg')
      svg.style.setProperty('--tilt-y', '0deg')
    })
  }, [])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    svg.addEventListener('mousemove', handleMouseMove as unknown as EventListener)
    svg.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      svg.removeEventListener('mousemove', handleMouseMove as unknown as EventListener)
      svg.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave])

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="-18 -18 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        cursor: 'pointer',
        padding: '1px',
        perspective: `${size * 2.6}px`,
        overflow: 'visible',
      }}
    >
      <path
        className="parallax-slow"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.0176 57.3943C25.0517 57.3943 30.1692 51.8914 31.9564 44.2698C32.5651 44.8578 33.214 45.4251 33.9016 45.9668C41.7345 52.1371 51.6248 52.6445 55.9923 47.1002C60.3598 41.5559 57.5506 32.0593 49.7178 25.8891C49.3101 25.568 48.8969 25.2622 48.4792 24.9718C50.6731 22.4309 52 19.1204 52 15.5C52 7.49187 45.5081 1 37.5 1C34.6812 1 32.0502 1.80435 29.8241 3.19606C27.5615 1.31373 24.6527 0.181641 21.4795 0.181641C14.269 0.181641 8.42383 6.02686 8.42383 13.2373C8.42383 13.7646 8.45508 14.2845 8.51584 14.7954C3.73594 16.0673 0.210938 20.4663 0.210938 25.6975C0.210938 29.7766 2.35424 33.3497 5.56455 35.3288C5.45648 36.2977 5.40039 37.2907 5.40039 38.3021C5.40039 48.8464 11.497 57.3943 19.0176 57.3943Z"
        fill={outerColor}
      />
      <path
        className="parallax-fast"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.9716 14.9794C15.8351 18.9298 15.7692 24.0987 18.8245 26.5245C21.8798 28.9504 26.8992 27.7145 30.0357 23.7641C33.1722 19.8137 33.2381 14.6448 30.1828 12.219C27.1275 9.79318 22.1081 11.0291 18.9716 14.9794Z"
        fill={innerColor}
      />
      <style jsx>{`
        .parallax-slow {
          transition: transform 0.2s ease-out;
          transform: translate(var(--x-slow, 0), var(--y-slow, 0)) rotateX(var(--tilt-x, 0))
            rotateY(var(--tilt-y, 0));
          transform-origin: center center;
        }
        .parallax-fast {
          transition: transform 0.1s ease-out;
          transform: translate(var(--x-fast, 0), var(--y-fast, 0));
        }
      `}</style>
    </svg>
  )
}

export default Lettermark

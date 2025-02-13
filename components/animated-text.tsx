'use client'

import { ReactNode, useEffect, useCallback } from 'react'
import { useProgress } from '../hooks/use-progress'

interface AnimatedTextProps {
  children: ReactNode
}

export default function AnimatedText({ children }: AnimatedTextProps) {
  const { progress } = useProgress()

  const updateIconVisibility = useCallback(
    (icon: Element, requiredProgress: number) => {
      const shouldShow = progress >= requiredProgress
      const classes = {
        add: shouldShow ? ['opacity-100'] : ['absolute', '-translate-x-4', 'opacity-0', 'blur-md'],
        remove: shouldShow
          ? ['absolute', '-translate-x-4', 'opacity-0', 'blur-md']
          : ['opacity-100'],
      }

      icon.classList.add(...classes.add)
      icon.classList.remove(...classes.remove)
    },
    [progress]
  )

  useEffect(() => {
    const icons = document.querySelectorAll<HTMLElement>('[data-progress]')

    icons.forEach((icon) => {
      const requiredProgress = parseInt(icon.dataset.progress || '0', 10)
      updateIconVisibility(icon, requiredProgress)
    })
  }, [progress, updateIconVisibility])

  return <>{children}</>
}

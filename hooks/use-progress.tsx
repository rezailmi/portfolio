'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface ProgressContextType {
  progress: number
  setProgress: (progress: number) => void
}

const ProgressContext = createContext<ProgressContextType | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(0)

  const handleSetProgress = (newProgress: number) => {
    // Ensure progress stays within 0-100 range
    setProgress(Math.max(0, Math.min(100, newProgress)))
  }

  return (
    <ProgressContext.Provider value={{ progress, setProgress: handleSetProgress }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress(): ProgressContextType {
  const context = useContext(ProgressContext)

  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }

  return context
}

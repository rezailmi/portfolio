'use client'

import { createContext, useContext, useState, useCallback, useMemo, useEffect, ReactNode } from 'react'

interface PageTitleContextType {
  title: string | null
  setTitle: (title: string | null) => void
}

const PageTitleContext = createContext<PageTitleContextType | null>(null)

export function PageTitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitleState] = useState<string | null>(null)

  const handleSetTitle = useCallback((newTitle: string | null) => {
    setTitleState(newTitle)
  }, [])

  const value = useMemo(
    () => ({ title, setTitle: handleSetTitle }),
    [title, handleSetTitle]
  )

  return <PageTitleContext.Provider value={value}>{children}</PageTitleContext.Provider>
}

export function usePageTitle(): PageTitleContextType {
  const context = useContext(PageTitleContext)

  if (!context) {
    throw new Error('usePageTitle must be used within a PageTitleProvider')
  }

  return context
}

export function PageTitle({ title }: { title: string }) {
  const { setTitle } = usePageTitle()

  useEffect(() => {
    setTitle(title)
    return () => setTitle(null)
  }, [title, setTitle])

  return null
}

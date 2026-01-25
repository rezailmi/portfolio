'use client'

import * as React from 'react'
import type { FeatureFlags } from '@/lib/feature-flags'

const FeatureFlagsContext = React.createContext<FeatureFlags | null>(null)

export function useFeatureFlags(): FeatureFlags {
  const context = React.useContext(FeatureFlagsContext)
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider')
  }
  return context
}

export function useFeatureFlag<K extends keyof FeatureFlags>(key: K): FeatureFlags[K] {
  const flags = useFeatureFlags()
  return flags[key]
}

export function FeatureFlagsProvider({
  flags,
  children,
}: {
  flags: FeatureFlags
  children: React.ReactNode
}) {
  return <FeatureFlagsContext.Provider value={flags}>{children}</FeatureFlagsContext.Provider>
}

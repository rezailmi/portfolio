'use client'

import {
  DirectEditProvider,
  DirectEditPanel,
  DirectEditToolbar,
} from 'direct-edit'

export function DirectEdit({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV !== 'development') {
    return <>{children}</>
  }

  return (
    <DirectEditProvider>
      {children}
      <DirectEditPanel />
      <DirectEditToolbar />
    </DirectEditProvider>
  )
}

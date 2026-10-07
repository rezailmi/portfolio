'use client'

import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

function Empty() {
  return null
}

// NODE_ENV is compile-time constant. Production builds drop the made-refine chunk.
const DirectEdit: ComponentType =
  process.env.NODE_ENV === 'development'
    ? dynamic(() => import('made-refine').then((m) => m.DirectEdit), { ssr: false })
    : Empty

export function DevTools() {
  if (process.env.NODE_ENV !== 'development') return null
  return <DirectEdit />
}

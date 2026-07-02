'use client'
import dynamic from 'next/dynamic'

const DirectEdit = dynamic(() => import('made-refine').then((m) => m.DirectEdit), {
  ssr: false,
})

export function DevTools() {
  if (process.env.NODE_ENV !== 'development') return null
  return <DirectEdit />
}

'use client'

import { DirectEditDemo, DirectEditProvider } from 'made-refine'

/** made-refine's demo panel still calls useDirectEditState; wrap it. */
export function EditDemo() {
  return (
    <DirectEditProvider>
      <DirectEditDemo />
    </DirectEditProvider>
  )
}

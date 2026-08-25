import * as stylex from '@stylexjs/stylex'
import { Suspense } from 'react'
import { connection } from 'next/server'
import { DirectEditDemo } from 'made-refine'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = {
  robots: { index: false, follow: false },
}

const styles = stylex.create({
  skeleton: {
    minHeight: '100dvh',
    width: '100%',
  },
})

async function DynamicDemo() {
  await connection()
  return <DirectEditDemo />
}

export default function EditPage() {
  return (
    <Suspense fallback={<Skeleton {...stylex.props(styles.skeleton)} />}>
      <DynamicDemo />
    </Suspense>
  )
}

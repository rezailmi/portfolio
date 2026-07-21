import { Suspense } from 'react'
import { connection } from 'next/server'
import { DirectEditDemo } from 'made-refine'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = {
  robots: { index: false, follow: false },
}

async function DynamicDemo() {
  await connection()
  return <DirectEditDemo />
}

export default function EditPage() {
  return (
    <Suspense fallback={<Skeleton className="min-h-dvh w-full" />}>
      <DynamicDemo />
    </Suspense>
  )
}

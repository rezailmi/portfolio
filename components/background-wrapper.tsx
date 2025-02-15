'use client'

import { useProgress } from '../hooks/use-progress'
import { cn } from '@/lib/utils'

export default function BackgroundWrapper({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { progress } = useProgress()

  return (
    <div className={cn('flex min-h-full flex-1 flex-col overflow-hidden rounded-xl', className)}>
      <div
        className={cn(
          'absolute inset-0 rounded-xl transition-opacity duration-1000',
          progress === 100
            ? "bg-[url('/img/bg-secret.png')] bg-cover bg-center bg-no-repeat opacity-100"
            : 'opacity-0'
        )}
      />
      <div className="relative flex-1">{children}</div>
    </div>
  )
}

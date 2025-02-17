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
    <div className={cn('relative overflow-hidden', className)}>
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-1000',
          progress === 100
            ? "bg-[url('/img/bg-secret.png')] bg-cover bg-center bg-no-repeat opacity-100"
            : 'opacity-0'
        )}
      />
      <div className="relative">{children}</div>
    </div>
  )
}

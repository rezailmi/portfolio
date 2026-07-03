'use client'

import Image from 'next/image'
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
          progress === 100 ? 'opacity-100' : 'opacity-0'
        )}
      >
        {progress === 100 && (
          <Image
            src="/img/bg-secret.png"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover object-center"
          />
        )}
      </div>
      <div className="relative">{children}</div>
    </div>
  )
}

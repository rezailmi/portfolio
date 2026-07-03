import { cn } from '@/lib/utils'

interface BlurTransitionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
}

export function BlurTransition({
  children,
  className,
  delay = 0,
  duration = 0.7,
  style,
  ...props
}: BlurTransitionProps) {
  return (
    <div
      className={cn('animate-blur-fade-in motion-reduce:animate-none', className)}
      style={{ animationDelay: `${delay}s`, animationDuration: `${duration}s`, ...style }}
      {...props}
    >
      {children}
    </div>
  )
}

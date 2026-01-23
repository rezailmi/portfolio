'use client'

import { motion, HTMLMotionProps } from 'motion/react'
import { cn } from '@/lib/utils'

interface BlurTransitionProps extends HTMLMotionProps<'div'> {
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
  ...props
}: BlurTransitionProps) {
  return (
    <motion.div
      initial={{ filter: 'blur(8px)', opacity: 0 }}
      animate={{ filter: 'blur(0px)', opacity: 1 }}
      transition={{
        delay,
        duration,
        ease: 'easeOut',
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

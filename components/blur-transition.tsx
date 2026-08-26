import * as stylex from '@stylexjs/stylex'
import { mq } from '@/lib/constants.stylex'
import { customClassName } from '@/lib/utils.stylex'

const blurFadeIn = stylex.keyframes({
  from: {
    filter: 'blur(8px)',
    opacity: 0,
  },
  to: {
    filter: 'blur(0px)',
    opacity: 1,
  },
})

const styles = stylex.create({
  root: {
    animationDuration: '0.7s',
    animationFillMode: 'backwards',
    animationName: {
      default: blurFadeIn,
      [mq.reduce]: 'none',
    },
    animationTimingFunction: 'ease-out',
  },
})

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
      {...stylex.props(styles.root, customClassName(className))}
      style={{ animationDelay: `${delay}s`, animationDuration: `${duration}s`, ...style }}
      {...props}
    >
      {children}
    </div>
  )
}

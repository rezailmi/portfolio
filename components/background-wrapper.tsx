'use client'

import Image from 'next/image'
import * as stylex from '@stylexjs/stylex'
import { useProgress } from '../hooks/use-progress'

const styles = stylex.create({
  root: {
    overflow: 'hidden',
    position: 'relative',
  },
  layer: {
    inset: 0,
    position: 'absolute',
    transition: 'opacity 1000ms',
  },
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },
  image: {
    objectFit: 'cover',
    objectPosition: 'center',
  },
  content: {
    position: 'relative',
  },
})

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  const { progress } = useProgress()
  const isRevealed = progress === 100

  return (
    <div {...stylex.props(styles.root)}>
      <div {...stylex.props(styles.layer, isRevealed ? styles.visible : styles.hidden)}>
        {isRevealed && (
          <Image
            src="/img/bg-secret.png"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            {...stylex.props(styles.image)}
          />
        )}
      </div>
      <div {...stylex.props(styles.content)}>{children}</div>
    </div>
  )
}

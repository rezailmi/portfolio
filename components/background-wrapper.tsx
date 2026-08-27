'use client'

import Image from 'next/image'
import * as stylex from '@stylexjs/stylex'
import { Box } from '@/components/box'
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
    <Box display="block" style={styles.root}>
      <Box display="block" style={[styles.layer, isRevealed ? styles.visible : styles.hidden]}>
        {isRevealed && (
          <Image
            src="/img/bg-secret.png"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            {...stylex.props(styles.image)}
          />
        )}
      </Box>
      <Box display="block" style={styles.content}>
        {children}
      </Box>
    </Box>
  )
}

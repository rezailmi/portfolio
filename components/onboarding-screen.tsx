'use client'

import { useEffect } from 'react'
import { ChevronRight } from 'lucide-react'
import * as stylex from '@stylexjs/stylex'

const typing = stylex.keyframes({
  from: { clipPath: 'inset(0 100% 0 0)' },
  to: { clipPath: 'inset(0 0 0 0)' },
})

const blink = stylex.keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0 },
})

const SM = '@media (min-width: 40rem)'

const styles = stylex.create({
  root: {
    alignItems: 'flex-start',
    backgroundColor: '#040C15',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    height: '100%',
    padding: '5%',
    paddingTop: '1rem',
    width: '100%',
    [SM]: {
      paddingTop: '2rem',
    },
  },
  title: {
    alignItems: 'center',
    color: '#80ECFD',
    display: 'flex',
    fontSize: '0.75rem',
    fontWeight: 500,
    gap: '0.25rem',
    [SM]: {
      fontSize: '0.875rem',
    },
  },
  icon: {
    height: '1rem',
    width: '1rem',
  },
  copy: {
    animationDuration: '2s',
    animationFillMode: 'backwards',
    animationName: typing,
    animationTimingFunction: 'steps(60, end)',
    color: '#80ECFD',
    fontSize: '0.75rem',
    maxWidth: 'min(32rem, 90%)',
    [SM]: {
      fontSize: '1rem',
    },
    '@media (prefers-reduced-motion: reduce)': {
      animationName: 'none',
    },
  },
  row: {
    alignItems: 'center',
    display: 'flex',
    gap: '0.5rem',
  },
  caret: {
    animationDuration: '1s',
    animationIterationCount: 'infinite',
    animationName: blink,
    animationTimingFunction: 'steps(1)',
    backgroundColor: '#80ECFD',
    height: '1rem',
    width: '0.5rem',
  },
  start: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: {
      default: 'color-mix(in srgb, #80ECFD 75%, transparent)',
      ':hover': '#80ECFD',
    },
    cursor: 'pointer',
    fontSize: '0.75rem',
    transition: 'color 150ms',
    [SM]: {
      fontSize: '1rem',
    },
  },
})

interface OnboardingScreenProps {
  onStart: () => void
}

export default function OnboardingScreen({ onStart }: OnboardingScreenProps) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        onStart()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onStart])

  return (
    <div {...stylex.props(styles.root)}>
      <h2 {...stylex.props(styles.title)}>
        <ChevronRight {...stylex.props(styles.icon)} />
        Playground
      </h2>
      <p {...stylex.props(styles.copy)}>Drag and drop the numbers into the progress bars.</p>
      <div {...stylex.props(styles.row)}>
        <span {...stylex.props(styles.caret)} />
        <button onClick={onStart} {...stylex.props(styles.start)}>
          Press enter
        </button>
      </div>
    </div>
  )
}

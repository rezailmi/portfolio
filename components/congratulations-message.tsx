'use client'

import { useEffect } from 'react'
import { PartyPopper } from 'lucide-react'
import * as stylex from '@stylexjs/stylex'

const fadeIn = stylex.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
})

const blink = stylex.keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0 },
})

const SM = '@media (min-width: 40rem)'

const styles = stylex.create({
  root: {
    alignItems: 'flex-start',
    animationName: fadeIn,
    animationDuration: '0.25s',
    backgroundImage: 'linear-gradient(to bottom, #172554, #1e3a8a)',
    borderRadius: '0.75rem',
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
  row: {
    alignItems: 'center',
    display: 'flex',
    gap: '0.5rem',
  },
  icon: {
    color: '#80ECFD',
    height: '1rem',
    width: '1rem',
    [SM]: {
      height: '1.5rem',
      width: '1.5rem',
    },
  },
  copy: {
    color: '#80ECFD',
    fontSize: '0.75rem',
    maxWidth: 'min(32rem, 90%)',
    [SM]: {
      fontSize: '1rem',
    },
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
  reset: {
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

interface CongratulationsMessageProps {
  onReset: () => void
}

export default function CongratulationsMessage({ onReset }: CongratulationsMessageProps) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === 'Escape') {
        onReset()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onReset])

  return (
    <div {...stylex.props(styles.root)}>
      <div {...stylex.props(styles.row)}>
        <PartyPopper {...stylex.props(styles.icon)} />
      </div>
      <p {...stylex.props(styles.copy)}>
        You&apos;ve unlocked all the secrets! Feel free to explore more. Try hovering over the icons
        below.
      </p>
      <div {...stylex.props(styles.row)}>
        <span {...stylex.props(styles.caret)} />
        <button onClick={onReset} {...stylex.props(styles.reset)}>
          Reset
        </button>
      </div>
    </div>
  )
}

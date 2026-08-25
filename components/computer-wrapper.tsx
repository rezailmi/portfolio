'use client'

import { useState, useEffect, Suspense, useCallback } from 'react'
import { Folder } from 'lucide-react'
import dynamic from 'next/dynamic'
import * as stylex from '@stylexjs/stylex'
import OnboardingScreen from './onboarding-screen'
import CongratulationsMessage from './congratulations-message'
import { useProgress } from '../hooks/use-progress'

const SM = '@media (min-width: 40rem)'
const MD = '@media (min-width: 48rem)'
const LG = '@media (min-width: 64rem)'

const fadeIn = stylex.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
})

const blink = stylex.keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0 },
})

const styles = stylex.create({
  loading: {
    backgroundColor: '#040C15',
    borderRadius: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    height: '420px',
    justifyContent: 'flex-start',
    marginInline: 'auto',
    maxWidth: '632px',
    padding: '2rem',
  },
  caret: {
    animationDuration: '0.3s',
    animationIterationCount: 'infinite',
    animationName: blink,
    animationTimingFunction: 'steps(1)',
    backgroundColor: '#80ECFD',
    height: '1rem',
    width: '0.5rem',
  },
  shell: {
    marginInline: 'auto',
    maxWidth: '776px',
    paddingInline: '1rem',
    position: 'relative',
    width: '100%',
    [SM]: {
      paddingInline: '1.5rem',
    },
    [LG]: {
      paddingInline: '2rem',
    },
  },
  frame: {
    backgroundImage: "url('/img/texture.png'), linear-gradient(to bottom, #e8e6dc, #d8d6cc)",
    backgroundRepeat: 'repeat',
    backgroundSize: '100px 100px, 100% 100%',
    borderColor: '#c4c2ba',
    borderRadius: '0.5rem',
    borderStyle: 'solid',
    borderWidth: '1px',
    padding: '1rem',
    paddingBottom: '6rem',
    position: 'relative',
    [SM]: {
      padding: '1.5rem',
      paddingBottom: '8rem',
    },
    [MD]: {
      paddingBottom: '10rem',
    },
  },
  outerBezel: {
    backgroundImage:
      'linear-gradient(217deg, rgba(173,169,155,0) 0%, #AAA99B 50%, #DFDDCA 52%, rgba(223,221,202,0) 100%), linear-gradient(143deg, #9B9A8E 0%, #B0AE9F 50%, #F2F1DB 52%, #E2E1D4 100%)',
    borderRadius: '0.5rem',
    boxShadow: '1px 1px 0px #CDCBC0',
    padding: '0.75rem',
  },
  innerBezel: {
    backgroundImage: 'linear-gradient(to bottom, #5a5854, #454341)',
    borderRadius: '1rem',
    padding: '0.5rem',
  },
  screen: {
    backgroundColor: '#1a1a1a',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    position: 'relative',
  },
  aspect: {
    paddingBottom: '75%',
  },
  screenFill: {
    display: 'flex',
    flexDirection: 'column',
    inset: 0,
    position: 'absolute',
  },
  menubar: {
    alignItems: 'center',
    backdropFilter: 'blur(4px)',
    backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
    borderTopLeftRadius: '0.75rem',
    borderTopRightRadius: '0.75rem',
    display: 'none',
    fontSize: '10px',
    height: '1.25rem',
    justifyContent: 'space-between',
    overflow: 'hidden',
    paddingInline: '0.5rem',
    [SM]: {
      fontSize: '0.75rem',
      height: '1.5rem',
    },
    [MD]: {
      display: 'flex',
    },
  },
  menubarLeft: {
    alignItems: 'center',
    display: 'flex',
    gap: '0.5rem',
  },
  folder: {
    color: '#000',
    height: '1rem',
    width: '1rem',
  },
  menubarLabel: {
    color: '#000',
    fontWeight: 500,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  fill: {
    height: '100%',
  },
  fade: {
    animationDuration: '0.25s',
    animationName: fadeIn,
    height: '100%',
    '@media (prefers-reduced-motion: reduce)': {
      animationName: 'none',
    },
  },
  overlay: {
    inset: 0,
    pointerEvents: 'none',
    position: 'absolute',
  },
  scanNoise: {
    backgroundImage:
      "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyIiBoZWlnaHQ9IjIiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')",
    backgroundRepeat: 'repeat',
    opacity: 0.3,
  },
  vignette: {
    boxShadow: 'inset 0 0 60px rgba(0,0,0,0.6)',
  },
  scanlines: {
    backgroundImage: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.25) 50%)',
    backgroundSize: '100% 4px',
    mixBlendMode: 'overlay',
  },
  drive: {
    backgroundImage: 'linear-gradient(to right, #1a1a1a, #2b2b2b, #1a1a1a)',
    bottom: '1rem',
    height: '2px',
    position: 'absolute',
    right: '2rem',
    width: '4rem',
    [SM]: {
      bottom: '1.5rem',
      height: '3px',
      right: '3rem',
      width: '6rem',
    },
    [MD]: {
      bottom: '2rem',
      width: '8rem',
    },
  },
  logoWrap: {
    bottom: '1rem',
    left: '1rem',
    position: 'absolute',
    [SM]: {
      bottom: '1.5rem',
      left: '1.5rem',
    },
    [MD]: {
      bottom: '2rem',
      left: '2rem',
    },
  },
  logo: {
    display: 'flex',
    height: '0.375rem',
    width: '1rem',
    [SM]: {
      height: '0.5rem',
      width: '1.25rem',
    },
    [MD]: {
      width: '1.5rem',
    },
  },
  stripe: {
    flex: 1,
  },
  cyan: { backgroundColor: '#7cc7e8' },
  green: { backgroundColor: '#41b54a' },
  yellow: { backgroundColor: '#f8d800' },
  orange: { backgroundColor: '#f86800' },
  red: { backgroundColor: '#f80000' },
})

const ScaryNumbers = dynamic(() => import('./scary-numbers'), {
  ssr: false,
  loading: () => <LoadingScreen />,
})

function LoadingScreen() {
  return (
    <div {...stylex.props(styles.loading)}>
      <span {...stylex.props(styles.caret)} />
    </div>
  )
}

export default function ComputerWrapper() {
  const [hasStarted, setHasStarted] = useState(false)
  const [showCongrats, setShowCongrats] = useState(false)
  const { progress: totalProgress, setProgress: setTotalProgress } = useProgress()

  useEffect(() => {
    if (totalProgress === 100) {
      const timer = setTimeout(() => setShowCongrats(true), 500)
      return () => clearTimeout(timer)
    }
    setShowCongrats(false)
  }, [totalProgress])

  const handleReset = useCallback(() => {
    setHasStarted(false)
    setShowCongrats(false)
    setTotalProgress(0)
  }, [setTotalProgress])

  return (
    <div {...stylex.props(styles.shell)}>
      <div {...stylex.props(styles.frame)}>
        <div {...stylex.props(styles.outerBezel)}>
          <div {...stylex.props(styles.innerBezel)}>
            <div {...stylex.props(styles.screen)}>
              <div {...stylex.props(styles.aspect)} />
              <div {...stylex.props(styles.screenFill)}>
                <div {...stylex.props(styles.menubar)}>
                  <div {...stylex.props(styles.menubarLeft)}>
                    <Folder {...stylex.props(styles.folder)} />
                    <span {...stylex.props(styles.menubarLabel)}>Reza</span>
                  </div>
                  <span {...stylex.props(styles.menubarLabel)}>{totalProgress}%</span>
                </div>
                <div {...stylex.props(styles.content)}>
                  {hasStarted ? (
                    <div {...stylex.props(styles.fill)}>
                      <Suspense fallback={<LoadingScreen />}>
                        <div
                          key={totalProgress === 100 && showCongrats ? 'congrats' : 'game'}
                          {...stylex.props(styles.fade)}
                        >
                          {totalProgress === 100 && showCongrats ? (
                            <CongratulationsMessage onReset={handleReset} />
                          ) : (
                            <ScaryNumbers onProgressChange={setTotalProgress} />
                          )}
                        </div>
                      </Suspense>
                    </div>
                  ) : (
                    <OnboardingScreen onStart={() => setHasStarted(true)} />
                  )}
                  <div {...stylex.props(styles.overlay, styles.scanNoise)} />
                  <div {...stylex.props(styles.overlay, styles.vignette)} />
                  <div {...stylex.props(styles.overlay, styles.scanlines)} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div {...stylex.props(styles.drive)} />

        <div {...stylex.props(styles.logoWrap)}>
          <div {...stylex.props(styles.logo)}>
            <div {...stylex.props(styles.stripe, styles.cyan)} />
            <div {...stylex.props(styles.stripe, styles.green)} />
            <div {...stylex.props(styles.stripe, styles.yellow)} />
            <div {...stylex.props(styles.stripe, styles.orange)} />
            <div {...stylex.props(styles.stripe, styles.red)} />
          </div>
        </div>
      </div>
    </div>
  )
}

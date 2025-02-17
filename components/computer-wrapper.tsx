'use client'

import { useState, useEffect, Suspense, useCallback } from 'react'
import { Folder } from 'lucide-react'
import dynamic from 'next/dynamic'
import OnboardingScreen from './onboarding-screen'
import CongratulationsMessage from './congratulations-message'
import { useProgress } from '../hooks/use-progress'

const ScaryNumbers = dynamic(() => import('./scary-numbers'), {
  ssr: false,
  loading: () => <LoadingScreen />,
})

function LoadingScreen() {
  return (
    <div className="mx-auto flex h-[420px] max-w-[632px] flex-col justify-start rounded-xl bg-[#040C15] p-8">
      <span className="h-4 w-2 animate-[blink_0.3s_steps(1)_infinite] bg-[#80ECFD]" />
    </div>
  )
}

interface ComputerWrapperProps {
  className?: string
}

export default function ComputerWrapper({ className }: ComputerWrapperProps) {
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
    <div className="relative mx-auto w-full max-w-[776px] px-4 sm:px-6 lg:px-8">
      {/* Monitor frame */}
      <div className="relative rounded-lg border border-[#c4c2ba] bg-[url('/img/texture.png'),linear-gradient(to_bottom,#e8e6dc,#d8d6cc)] bg-[length:100px_100px,100%_100%] bg-repeat p-4 pb-24 sm:p-6 sm:pb-32 md:pb-40">
        {/* Outer Screen bezel */}
        <div className="rounded-lg bg-[linear-gradient(217deg,rgba(173,169,155,0)_0%,#AAA99B_50%,#DFDDCA_52%,rgba(223,221,202,0)_100%),linear-gradient(143deg,#9B9A8E_0%,#B0AE9F_50%,#F2F1DB_52%,#E2E1D4_100%)] p-3 shadow-[1px_1px_0px_#CDCBC0]">
          {/* Inner Screen bezel */}
          <div className="rounded-2xl bg-gradient-to-b from-[#5a5854] to-[#454341] p-2">
            {/* Screen */}
            <div className={`relative overflow-hidden rounded-xl bg-[#1a1a1a] ${className}`}>
              {/* Aspect ratio container */}
              <div className="pb-[75%]" /> {/* 4:3 aspect ratio for better content visibility */}
              <div className="absolute inset-0 flex flex-col">
                {/* Menu bar */}
                <div className="hidden h-5 items-center justify-between overflow-hidden rounded-t-xl bg-gradient-to-b from-white/95 to-white/85 px-2 text-[10px] backdrop-blur-sm sm:h-6 sm:text-xs md:flex">
                  <div className="flex items-center space-x-2">
                    <Folder className="h-4 w-4 text-black" />
                    <span className="font-medium text-black">Reza</span>
                  </div>
                  <span className="font-medium text-black">{totalProgress}%</span>
                </div>
                {/* Screen content with scanline effect */}
                <div className="relative flex-1">
                  {hasStarted ? (
                    <div className="h-full">
                      <Suspense fallback={<LoadingScreen />}>
                        <div className="h-full transition-all duration-500">
                          {totalProgress === 100 && showCongrats ? (
                            <CongratulationsMessage onReset={handleReset} />
                          ) : (
                            <ScaryNumbers className="h-full" onProgressChange={setTotalProgress} />
                          )}
                        </div>
                      </Suspense>
                    </div>
                  ) : (
                    <OnboardingScreen onStart={() => setHasStarted(true)} />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyIiBoZWlnaHQ9IjIiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] bg-repeat opacity-30" />
                  <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.6)]" />
                  {/* CRT scanline effect */}
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] mix-blend-overlay" />
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute left-0 top-0 h-[3px] w-full animate-scanline bg-[rgba(255,255,255,0.3)] mix-blend-overlay" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disk drive slot */}
        <div className="absolute bottom-4 right-8 h-[2px] w-16 bg-gradient-to-r from-[#1a1a1a] via-[#2b2b2b] to-[#1a1a1a] sm:bottom-6 sm:right-12 sm:h-[3px] sm:w-24 md:bottom-8 md:w-32" />

        {/* Rainbow logo */}
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8">
          <div className="flex h-1.5 w-4 sm:h-2 sm:w-5 md:w-6">
            <div className="flex-1 bg-[#7cc7e8]" />
            <div className="flex-1 bg-[#41b54a]" />
            <div className="flex-1 bg-[#f8d800]" />
            <div className="flex-1 bg-[#f86800]" />
            <div className="flex-1 bg-[#f80000]" />
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, Suspense, useEffect } from 'react'
import ComputerWrapper from '@/components/computer-wrapper'
import { Sparkles, Rocket, History, Lightbulb, Target, Zap, Heart, PartyPopper } from 'lucide-react'
import dynamic from 'next/dynamic'

const ScaryNumbers = dynamic(() => import('@/components/scary-numbers'), {
  ssr: false,
  loading: () => (
    <div className="mx-auto flex h-[420px] max-w-[632px] flex-col justify-start rounded-xl bg-[#040C15] p-8">
      <span className="h-4 w-2 animate-[blink_0.3s_steps(1)_infinite] bg-[#80ECFD]" />
    </div>
  ),
})

export default function HomePage() {
  const [totalProgress, setTotalProgress] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !hasStarted) {
        setHasStarted(true)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [hasStarted])

  const OnboardingScreen = () => (
    <div className="mx-auto flex h-[420px] max-w-[632px] flex-col items-start space-y-6 rounded-xl bg-[#040C15] p-8">
      <h2 className="text-base font-bold text-[#80ECFD]">Welcome to my playground</h2>
      <p className="max-w-sm animate-[typing_3s_steps(120,end)] text-sm text-[#80ECFD]">
        Drag and drop the numbers into the progress bars to reveal more about me. Each number
        cluster you drop will unveil a part of my story.
      </p>
      <div className="flex items-center gap-x-2">
        <span className="animate-blink h-4 w-2 bg-[#80ECFD]" />
        <button onClick={() => setHasStarted(true)} className="text-[#80ECFD]/75">
          Press enter
        </button>
      </div>
    </div>
  )

  const CongratulationsMessage = () => (
    <div className="animate-fade-in mx-auto flex h-[420px] max-w-[632px] flex-col items-start space-y-6 rounded-xl bg-gradient-to-b from-blue-950 to-blue-900 p-8">
      <div className="flex items-center gap-x-2">
        <PartyPopper className="h-6 w-6 text-[#80ECFD]" />
      </div>
      <p className="max-w-sm text-sm text-[#80ECFD]">
        You&apos;ve unlocked all the secrets! Feel free to explore more. Try hovering over the
        colorful icons below.
      </p>
      <span className="animate-blink h-4 w-2 bg-[#80ECFD]" />
    </div>
  )

  return (
    <div className="min-h-[100vh] flex-1 md:min-h-min">
      <div className="px-2 sm:px-4 md:px-6 lg:px-8">
        <ComputerWrapper progress={totalProgress}>
          {hasStarted ? (
            <div className="mx-auto w-full max-w-[800px]">
              <Suspense
                fallback={
                  <div className="mx-auto flex h-[420px] max-w-[632px] flex-col justify-start rounded-xl bg-[#040C15] p-8">
                    <span className="animate-blink h-4 w-2 bg-[#80ECFD]" />
                  </div>
                }
              >
                <div className="transition-all duration-500">
                  {totalProgress === 100 ? (
                    <CongratulationsMessage />
                  ) : (
                    <ScaryNumbers onProgressChange={setTotalProgress} />
                  )}
                </div>
              </Suspense>
            </div>
          ) : (
            <OnboardingScreen />
          )}
        </ComputerWrapper>
      </div>
      <div className="mx-auto max-w-[776px] px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <h1 className="flex flex-wrap items-center gap-x-2 gap-y-1 text-2xl font-medium leading-relaxed">
            <span className="inline-flex items-center gap-x-1">
              Reza is a software designer
              <span
                className={`inline-flex rounded-lg bg-amber-100 p-1 transition-all duration-1000 ${totalProgress >= 15 ? 'opacity-100' : 'absolute -translate-x-4 opacity-0 blur-md'}`}
              >
                <Sparkles className="h-6 w-6 text-amber-600" />
              </span>
            </span>
            <span className="inline-flex items-center gap-x-1">
              and engineer
              <span
                className={`inline-flex rounded-lg bg-sky-100 p-1 transition-all duration-1000 ${totalProgress >= 25 ? 'opacity-100' : 'absolute -translate-x-4 opacity-0 blur-md'}`}
              >
                <Rocket className="h-6 w-6 text-sky-600" />
              </span>
            </span>
            <span>with a passion in building accessible, beautiful, and functional products.</span>
            <span className="inline-flex items-center gap-x-1">
              Since 2011,
              <span
                className={`inline-flex rounded-lg bg-purple-100 p-1 transition-all duration-1000 ${totalProgress >= 45 ? 'opacity-100' : 'absolute -translate-x-4 opacity-0 blur-md'}`}
              >
                <History className="h-6 w-6 text-purple-600" />
              </span>
            </span>
            <span className="inline-flex items-center gap-x-1">
              I&apos;ve been crafting digital experiences
              <span
                className={`inline-flex rounded-lg bg-yellow-100 p-1 transition-all duration-1000 ${totalProgress >= 55 ? 'opacity-100' : 'absolute -translate-x-4 opacity-0 blur-md'}`}
              >
                <Lightbulb className="h-6 w-6 text-yellow-600" />
              </span>
            </span>
            <span>that bridge the gap between complexity and simplicity.</span>
            <span className="inline-flex items-center gap-x-1">
              Specializing in building 0-1 products and design systems
              <span
                className={`inline-flex rounded-lg bg-red-100 p-1 transition-all duration-1000 ${totalProgress >= 72 ? 'opacity-100' : 'absolute -translate-x-4 opacity-0 blur-md'}`}
              >
                <Target className="h-6 w-6 text-red-600" />
              </span>
            </span>
            <span className="inline-flex items-center gap-x-1">
              where innovation meets practicality
              <span
                className={`inline-flex rounded-lg bg-blue-100 p-1 transition-all duration-1000 ${totalProgress >= 85 ? 'opacity-100' : 'absolute -translate-x-4 opacity-0 blur-md'}`}
              >
                <Zap className="h-6 w-6 text-blue-600" />
              </span>
            </span>
            <span>and ideas transform into reality.</span>
            <span>
              My approach combines strategic thinking with meticulous attention to detail, ensuring
              every pixel serves a purpose.
            </span>
            <span className="inline-flex items-center gap-x-1">
              Let&apos;s build something extraordinary together.
              <span
                className={`inline-flex rounded-lg bg-pink-100 p-1 transition-all duration-1000 ${totalProgress >= 100 ? 'opacity-100' : 'absolute -translate-x-4 opacity-0 blur-md'}`}
              >
                <Heart className="h-6 w-6 text-pink-600" />
              </span>
            </span>
          </h1>
        </div>
      </div>
    </div>
  )
}

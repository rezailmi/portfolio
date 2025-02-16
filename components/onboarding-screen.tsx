'use client'

import { useEffect } from 'react'
import { ChevronRight } from 'lucide-react'

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
    <div className="flex h-full w-full flex-col items-start space-y-6 bg-[#040C15] p-[5%] pt-4 sm:pt-8">
      <h2 className="flex items-center gap-x-1 text-xs font-medium text-[#80ECFD] sm:text-sm">
        <ChevronRight className="size-4" />
        Reza&apos;s Playground
      </h2>
      <p className="max-w-[min(32rem,90%)] animate-[typing_3s_steps(120,end)] text-xs text-[#80ECFD] sm:text-base">
        Drag and drop the numbers into the progress bars to reveal more about me. Each number
        cluster you drop will unveil a part of my story.
      </p>
      <div className="flex items-center gap-x-2">
        <span className="h-4 w-2 animate-blink bg-[#80ECFD]" />
        <button
          onClick={onStart}
          className="text-xs text-[#80ECFD]/75 transition-colors hover:text-[#80ECFD] sm:text-base"
        >
          Press enter
        </button>
      </div>
    </div>
  )
}

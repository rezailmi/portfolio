'use client'

import { useEffect } from 'react'

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
    <div className="mx-auto flex h-[420px] max-w-[632px] flex-col items-start space-y-6 rounded-xl bg-[#040C15] p-8">
      <h2 className="text-base font-bold text-[#80ECFD]">Welcome to my playground</h2>
      <p className="max-w-sm animate-[typing_3s_steps(120,end)] text-sm text-[#80ECFD]">
        Drag and drop the numbers into the progress bars to reveal more about me. Each number
        cluster you drop will unveil a part of my story.
      </p>
      <div className="flex items-center gap-x-2">
        <span className="h-4 w-2 animate-blink bg-[#80ECFD]" />
        <button onClick={onStart} className="text-[#80ECFD]/75">
          Press enter
        </button>
      </div>
    </div>
  )
}

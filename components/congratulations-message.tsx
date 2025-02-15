'use client'

import { useEffect } from 'react'
import { PartyPopper } from 'lucide-react'

interface CongratulationsMessageProps {
  onReset: () => void
}

export default function CongratulationsMessage({ onReset }: CongratulationsMessageProps) {
  useEffect(() => {
    const handleKeyPress = () => {
      onReset()
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onReset])

  return (
    <div className="flex h-full w-full animate-fade-in flex-col items-start space-y-6 rounded-xl bg-gradient-to-b from-blue-950 to-blue-900 p-[5%] pt-8">
      <div className="flex items-center gap-x-2">
        <PartyPopper className="h-6 w-6 text-[#80ECFD]" />
      </div>
      <p className="max-w-[min(32rem,90%)] text-sm text-[#80ECFD] sm:text-base">
        You&apos;ve unlocked all the secrets! Feel free to explore more. Try hovering over the icons
        below.
      </p>
      <div className="flex items-center gap-x-2">
        <span className="h-4 w-2 animate-blink bg-[#80ECFD]" />
        <button
          onClick={onReset}
          className="text-[#80ECFD]/75 transition-colors hover:text-[#80ECFD]"
        >
          Reset
        </button>
      </div>
    </div>
  )
}

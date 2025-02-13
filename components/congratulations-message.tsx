'use client'

import { PartyPopper } from 'lucide-react'

export default function CongratulationsMessage() {
  return (
    <div className="mx-auto flex h-[420px] max-w-[632px] animate-fade-in flex-col items-start space-y-6 rounded-xl bg-gradient-to-b from-blue-950 to-blue-900 p-8">
      <div className="flex items-center gap-x-2">
        <PartyPopper className="h-6 w-6 text-[#80ECFD]" />
      </div>
      <p className="max-w-sm text-sm text-[#80ECFD]">
        You&apos;ve unlocked all the secrets! Feel free to explore more. Try hovering over the icons
        below.
      </p>
      <span className="h-4 w-2 animate-blink bg-[#80ECFD]" />
    </div>
  )
}

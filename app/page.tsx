'use client'

import { useState } from 'react'
import ScaryNumbers from '@/components/scary-numbers'
import ComputerWrapper from '@/components/computer-wrapper'
import { Sparkles, Rocket, History, Lightbulb, Target, Zap, Heart } from 'lucide-react'

export default function HomePage() {
  const [totalProgress, setTotalProgress] = useState(0)

  return (
    <div className="min-h-[100vh] flex-1 md:min-h-min">
      <div className="px-2 sm:px-4 md:px-6 lg:px-8">
        <ComputerWrapper progress={totalProgress}>
          <div className="mx-auto w-full max-w-[800px]">
            <ScaryNumbers onProgressChange={setTotalProgress} />
          </div>
        </ComputerWrapper>
      </div>
      <div className="mx-auto max-w-[776px] px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <h1 className="text-2xl font-semibold leading-relaxed">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="relative flex items-center gap-x-1">
                Reza is a software designer
                <div
                  className={`rounded-lg bg-amber-100 p-1 transition-all duration-1000 ${totalProgress >= 15 ? 'opacity-100' : 'absolute -translate-x-4 opacity-0 blur-md'}`}
                >
                  <Sparkles className="h-6 w-6 text-amber-600" />
                </div>
              </span>
              <span className="relative flex items-center gap-x-1">
                and engineer
                <div
                  className={`rounded-lg bg-sky-100 p-1 transition-all duration-1000 ${totalProgress >= 25 ? 'opacity-100' : 'absolute -translate-x-4 opacity-0 blur-md'}`}
                >
                  <Rocket className="h-6 w-6 text-sky-600" />
                </div>
              </span>
              <span>with a passion for accessible products.</span>
              <span className="relative flex items-center gap-x-1">
                Since 2011,
                <div
                  className={`rounded-lg bg-purple-100 p-1 transition-all duration-1000 ${totalProgress >= 45 ? 'opacity-100' : 'absolute -translate-x-4 opacity-0 blur-md'}`}
                >
                  <History className="h-6 w-6 text-purple-600" />
                </div>
              </span>
              <span className="relative flex items-center gap-x-1">
                I&apos;ve been crafting digital experiences
                <div
                  className={`rounded-lg bg-yellow-100 p-1 transition-all duration-1000 ${totalProgress >= 55 ? 'opacity-100' : 'absolute -translate-x-4 opacity-0 blur-md'}`}
                >
                  <Lightbulb className="h-6 w-6 text-yellow-600" />
                </div>
              </span>
              <span>that bridge the gap between complexity and simplicity.</span>
              <span className="relative flex items-center gap-x-1">
                Specializing in creating 0-to-1 products,
                <div
                  className={`rounded-lg bg-red-100 p-1 transition-all duration-1000 ${totalProgress >= 72 ? 'opacity-100' : 'absolute -translate-x-4 opacity-0 blur-md'}`}
                >
                  <Target className="h-6 w-6 text-red-600" />
                </div>
              </span>
              <span className="relative flex items-center gap-x-1">
                where innovation meets practicality
                <div
                  className={`rounded-lg bg-blue-100 p-1 transition-all duration-1000 ${totalProgress >= 85 ? 'opacity-100' : 'absolute -translate-x-4 opacity-0 blur-md'}`}
                >
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
              </span>
              <span>and ideas transform into reality.</span>
              <span>
                My approach combines strategic thinking with meticulous attention to detail,
                ensuring every pixel serves a purpose.
              </span>
              <span className="relative flex items-center gap-x-1">
                Let&apos;s build something extraordinary together.
                <div
                  className={`rounded-lg bg-pink-100 p-1 transition-all duration-1000 ${totalProgress >= 100 ? 'opacity-100' : 'absolute -translate-x-4 opacity-0 blur-md'}`}
                >
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
              </span>
            </p>
          </h1>
        </div>
      </div>
    </div>
  )
}

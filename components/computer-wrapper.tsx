import { ReactNode } from 'react'
import { Folder } from 'lucide-react'

interface ComputerWrapperProps {
  children: ReactNode
  className?: string
  progress?: number
}

export default function ComputerWrapper({
  children,
  className,
  progress = 0,
}: ComputerWrapperProps) {
  return (
    <div className="relative mx-auto w-full max-w-[776px] px-4 sm:px-6 lg:px-8">
      {/* Monitor frame */}
      <div className="relative rounded-[3rem] border border-[#c4c2ba] bg-gradient-to-b from-[#e8e6dc] to-[#d8d6cc] p-4 pb-16 shadow-[0_0_15px_rgba(0,0,0,0.1),inset_0_3px_2px_rgba(255,255,255,0.8)] sm:p-6 sm:pb-24 md:pb-32">
        {/* Screen bezel */}
        <div className="rounded-3xl bg-gradient-to-b from-[#5a5854] to-[#454341] p-4 shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)]">
          {/* Screen */}
          <div
            className={`overflow-hidden rounded-xl bg-[#1a1a1a] shadow-[0_0_0_1px_rgba(0,0,0,0.2),inset_0_0_30px_rgba(0,0,0,0.4)] ${className}`}
          >
            {/* Menu bar */}
            <div className="flex h-5 items-center justify-between overflow-hidden rounded-t-xl border-b border-black/10 bg-gradient-to-b from-white/95 to-white/85 px-2 text-[10px] backdrop-blur-sm sm:h-6 sm:text-xs">
              <div className="flex items-center space-x-2">
                <Folder className="h-4 w-4 text-black" />
                <span className="font-medium text-black">Reza</span>
              </div>
              <span className="font-medium text-black">{progress}%</span>
            </div>
            {/* Screen content with scanline effect */}
            <div className="relative">
              {children}
              <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyIiBoZWlnaHQ9IjIiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] bg-repeat opacity-30" />
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.6)]" />
              {/* CRT scanline effect */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] mix-blend-overlay" />
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="animate-scanline absolute left-0 top-0 h-[3px] w-full bg-[rgba(255,255,255,0.3)] mix-blend-overlay" />
              </div>
            </div>
          </div>
        </div>

        {/* Disk drive slot */}
        <div className="absolute bottom-4 right-8 h-[2px] w-16 bg-gradient-to-r from-[#1a1a1a] via-[#2b2b2b] to-[#1a1a1a] sm:bottom-6 sm:right-12 sm:h-[3px] sm:w-24 md:bottom-8 md:w-32" />

        {/* Apple rainbow logo */}
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

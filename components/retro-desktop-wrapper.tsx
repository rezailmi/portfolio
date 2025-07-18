import { ReactNode } from 'react'
import { Folder } from 'lucide-react'

interface DasherD2WrapperProps {
  children: ReactNode
  className?: string
}

export default function DasherD2Wrapper({ children, className }: DasherD2WrapperProps) {
  return (
    <div className="relative mx-auto w-full max-w-[776px] px-4 sm:px-6 lg:px-8">
      {/* Monitor frame */}
      <div className="relative rounded-[3rem] bg-[#e2e0d5] p-4 pb-16 sm:p-6 sm:pb-24 md:pb-32">
        {/* Screen bezel */}
        <div className="rounded-3xl bg-[#504e4b] p-4">
          {/* Screen */}
          <div className={`overflow-hidden rounded-xl bg-[#1a1a1a] ${className}`}>
            {/* Menu bar */}
            <div className="flex h-5 items-center justify-between overflow-hidden border-b border-black/10 bg-white/90 px-2 text-[10px] sm:h-6 sm:text-xs">
              <div className="flex items-center space-x-2">
                <Folder className="h-4 w-4 text-black" />
                <span className="text-black">Reza</span>
              </div>
              <span className="text-black">0%</span>
            </div>
            {/* Screen content with scanline effect */}
            <div className="relative">
              {children}
              <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyIiBoZWlnaHQ9IjIiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] bg-repeat opacity-30" />
            </div>
          </div>
        </div>

        {/* Disk drive slot */}
        <div className="absolute bottom-4 right-8 h-[2px] w-16 bg-[#2b2b2b] sm:bottom-6 sm:right-12 sm:h-[3px] sm:w-24 md:bottom-8 md:w-32" />

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

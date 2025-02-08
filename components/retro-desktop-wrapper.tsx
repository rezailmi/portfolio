import { ReactNode } from 'react';
import { Command } from 'lucide-react';

interface RetroDesktopWrapperProps {
  children: ReactNode;
  className?: string;
}

export default function RetroDesktopWrapper({ children, className }: RetroDesktopWrapperProps) {
  return (
    <div className="relative w-full max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Monitor frame */}
      <div className="relative bg-[#e2e0d5] rounded-2xl p-4 sm:p-6 pb-16 sm:pb-24 md:pb-32">
        {/* Screen bezel */}
        <div className="bg-[#e2e0d5] rounded-xl p-4">
          {/* Screen */}
          <div className={`bg-[#1a1a1a] rounded-lg overflow-hidden ${className}`}>
            {/* Menu bar */}
            <div className="h-5 sm:h-6 bg-white border-b border-black/10 flex items-center px-2 space-x-2 sm:space-x-4 text-[10px] sm:text-xs overflow-hidden">
              <Command className="w-4 h-4 text-black" />
              <div className="flex space-x-4 text-black">
                <span>File</span>
                <span>Edit</span>
                <span>View</span>
                <span>Help</span>
              </div>
            </div>
            {/* Screen content with scanline effect */}
            <div className="relative">
              {children}
              <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyIiBoZWlnaHQ9IjIiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] bg-repeat opacity-30" />
            </div>
          </div>
        </div>
        
        {/* Disk drive slot */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-8 sm:right-12 w-16 sm:w-24 md:w-32 h-[2px] sm:h-[3px] bg-[#2b2b2b]" />
        
        {/* Apple rainbow logo */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8">
          <div className="w-4 sm:w-5 md:w-6 h-1.5 sm:h-2 flex">
            <div className="flex-1 bg-[#7cc7e8]" />
            <div className="flex-1 bg-[#41b54a]" />
            <div className="flex-1 bg-[#f8d800]" />
            <div className="flex-1 bg-[#f86800]" />
            <div className="flex-1 bg-[#f80000]" />
          </div>
        </div>
      </div>
    </div>
  );
}

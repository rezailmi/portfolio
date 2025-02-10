import ScaryNumbers from '@/components/scary-numbers'
import RetroDesktopWrapper from '@/components/retro-desktop-wrapper'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export default function HomePage() {
  return (
    <div className="min-h-[100vh] flex-1 md:min-h-min">
      <div className="p-4 sm:p-8">
        <h1 className="mb-4 text-2xl font-semibold">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="text-left">
                  <span>Reza is a software designer.</span>
                  <span className="blur-md">
                    Specializing in creating 0-to-1 products for startups,
                  </span>
                  <span className="blur-md">that deliver value and are a joy to use.</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>refine the numbers to decode</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h1>
      </div>
      <div className="px-2 sm:px-4 md:px-6 lg:px-8">
        <RetroDesktopWrapper>
          <div className="mx-auto w-full max-w-[800px]">
            <ScaryNumbers />
          </div>
        </RetroDesktopWrapper>
      </div>
    </div>
  )
}

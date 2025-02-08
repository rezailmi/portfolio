import ScaryNumbers from '@/components/scary-numbers'
import RetroDesktopWrapper from '@/components/retro-desktop-wrapper'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function HomePage() {
  return (
    <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="text-left">
                  <span>Reza is a software designer.</span>
                  <span className="blur-sm">Specializing in creating 0-to-1 products for startups,</span>
                  <span className="blur-sm">that deliver value and are a joy to use.</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>refine the numbers to decode</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h1>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <RetroDesktopWrapper>
          <div className="w-full max-w-[800px] mx-auto overflow-x-auto">
            <div className="min-w-[320px]">
              <ScaryNumbers />
            </div>
          </div>
        </RetroDesktopWrapper>
      </div>
    </div>
  )
}

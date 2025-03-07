import ComputerWrapper from '../components/computer-wrapper'
import { ProgressProvider } from '../hooks/use-progress'
import BackgroundWrapper from '@/components/background-wrapper'
import Image from 'next/image'
import { BlurTransition } from '@/components/blur-transition'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { MoreHorizontal } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-1">
      <div className="flex w-full flex-col space-y-4">
        {/* Introduction Section - Personal bio with animated text */}
        <div className="mx-auto w-full max-w-[776px] px-4 sm:px-6 lg:px-8">
          <div className="space-y-3 py-8">
            <h1 className="text-base font-medium">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>Reza Ilmi</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Software Designer + Engineer</p>
                </TooltipContent>
              </Tooltip>
            </h1>

            <BlurTransition delay={0.1}>
              <p>
                I&apos;m a software designer and engineer with a passion for crafting accessible,
                beautiful, and functional products.
              </p>
            </BlurTransition>
            <BlurTransition delay={0.15}>
              <p>
                With over a decade of experience in building digital experiences, I excel at
                bridging the gap between complexity and simplicity.
              </p>
            </BlurTransition>
            <BlurTransition delay={0.2}>
              <p>
                I specialize in building 0-1 products and design systems that deliver tangible
                results, combining strategic thinking with meticulous attention to detail to ensure
                every pixel serves a purpose.
              </p>
            </BlurTransition>
            <BlurTransition delay={0.25}>
              <p>Let&apos;s build something extraordinary together.</p>
            </BlurTransition>
          </div>
        </div>

        {/* Interactive Computer Demo Section */}
        <ProgressProvider>
          <BackgroundWrapper className="rounded-lg bg-sidebar py-12">
            <ComputerWrapper />
          </BackgroundWrapper>
        </ProgressProvider>

        {/* App Switcher Component - Interactive UI element */}
        <div className="flex items-center justify-center rounded-lg bg-sidebar px-4 py-24">
          <div className="flex w-fit space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Switch apps</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Apps</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Corporate footprint</DropdownMenuItem>
                <DropdownMenuItem>Product footprint</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="default">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Project Showcase - Data Table Image */}
        <div className="flex items-center justify-center rounded-lg bg-sidebar p-4">
          <Image
            src="/img/Project workspace - Data table.png"
            alt="Project workspace data table"
            width={1920}
            height={1080}
            className="h-auto w-full max-w-[712px] rounded-lg border"
          />
        </div>

        {/* Project Showcase - Contributors View Image */}
        <div className="flex items-center justify-center rounded-lg bg-sidebar p-4">
          <Image
            src="/img/Contributors default.png"
            alt="Contributors default view"
            width={1920}
            height={1080}
            className="h-auto w-full max-w-[712px] rounded-lg border"
          />
        </div>
      </div>
    </div>
  )
}

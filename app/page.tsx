import ComputerWrapper from '../components/computer-wrapper'
import { ProgressProvider } from '../hooks/use-progress'
import BackgroundWrapper from '../components/background-wrapper'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <ProgressProvider>
      <BackgroundWrapper className="flex min-h-full flex-1">
        <div className="flex w-full flex-col space-y-8">
          <div className="mx-auto w-full max-w-[776px] px-4 sm:px-6 lg:px-8">
            <div className="space-y-3 py-8">
              <p>Reza Ilmi</p>
              <h1 className="text-xl leading-relaxed">
                I'm a software designer and engineer with a passion for crafting accessible,
                beautiful, and functional products. With over a decade of experience in building
                digital experiences, I excel at bridging the gap between complexity and simplicity.
                I specialize in building 0-1 products and design systems that deliver tangible
                results, combining strategic thinking with meticulous attention to detail to ensure
                every pixel serves a purpose. Let's build something extraordinary together.
              </h1>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <ComputerWrapper />
          </div>
          <div className="flex items-center justify-center rounded-lg border px-4 py-20">
            <div className="w-fit">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Switch apps</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Apps</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Corporate footprint</DropdownMenuItem>
                  <DropdownMenuItem>Product footprint</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>More...</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <Image
              src="/img/Project workspace - Data table.png"
              alt="Project workspace data table"
              width={1920}
              height={1080}
              className="h-auto w-full rounded-xl"
            />
          </div>
          <div className="rounded-lg border p-4">
            <Image
              src="/img/Contributors default.png"
              alt="Contributors default view"
              width={1920}
              height={1080}
              className="h-auto w-full rounded-xl"
            />
          </div>
        </div>
      </BackgroundWrapper>
    </ProgressProvider>
  )
}

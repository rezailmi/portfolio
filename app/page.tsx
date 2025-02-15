import { Sparkles, Rocket, History, Lightbulb, Target, Zap, Heart } from 'lucide-react'
import ComputerWrapper from '../components/computer-wrapper'
import AnimatedText from '../components/animated-text'
import { ProgressProvider } from '../hooks/use-progress'
import BackgroundWrapper from '../components/background-wrapper'

export default function HomePage() {
  return (
    <ProgressProvider>
      <BackgroundWrapper className="flex min-h-full flex-1">
        <div className="px-2 sm:px-4 md:px-6 lg:px-8">
          <ComputerWrapper />
          <AnimatedText>
            <div className="mx-auto max-w-[776px] px-4 sm:px-6 lg:px-8">
              <div className="py-8">
                <h1 className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xl leading-relaxed">
                  <span className="inline-flex items-center gap-x-1">
                    I&apos;m a software designer
                    <span
                      className="inline-flex rounded-lg bg-amber-100 p-1 transition-all duration-1000"
                      data-progress="15"
                    >
                      <Sparkles className="h-6 w-6 text-amber-600" />
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-x-1">
                    + engineer.
                    <span
                      className="inline-flex rounded-lg bg-sky-100 p-1 transition-all duration-1000"
                      data-progress="25"
                    >
                      <Rocket className="h-6 w-6 text-sky-600" />
                    </span>
                  </span>
                  <span>
                    Being a hybrid, I pride myself in building accessible, beautiful, and functional
                    products.
                  </span>
                  <span className="inline-flex items-center gap-x-1">
                    Since 2011,
                    <span
                      className="inline-flex rounded-lg bg-purple-100 p-1 transition-all duration-1000"
                      data-progress="45"
                    >
                      <History className="h-6 w-6 text-purple-600" />
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-x-1">
                    I&apos;ve been crafting digital experiences
                    <span
                      className="inline-flex rounded-lg bg-yellow-100 p-1 transition-all duration-1000"
                      data-progress="55"
                    >
                      <Lightbulb className="h-6 w-6 text-yellow-600" />
                    </span>
                  </span>
                  <span>that bridge the gap between complexity and simplicity.</span>
                  <span className="inline-flex items-center gap-x-1">
                    Specializing in building 0-1 products and design systems
                    <span
                      className="inline-flex rounded-lg bg-red-100 p-1 transition-all duration-1000"
                      data-progress="72"
                    >
                      <Target className="h-6 w-6 text-red-600" />
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-x-1">
                    with a focus on real-world solutions
                    <span
                      className="inline-flex rounded-lg bg-blue-100 p-1 transition-all duration-1000"
                      data-progress="85"
                    >
                      <Zap className="h-6 w-6 text-blue-600" />
                    </span>
                  </span>
                  <span>and delivering tangible results.</span>
                  <span>
                    My approach combines strategic thinking with meticulous attention to detail,
                    ensuring every pixel serves a purpose.
                  </span>
                  <span className="inline-flex items-center gap-x-1">
                    Let&apos;s build something extraordinary together.
                    <span
                      className="inline-flex rounded-lg bg-pink-100 p-1 transition-all duration-1000"
                      data-progress="100"
                    >
                      <Heart className="h-6 w-6 text-pink-600" />
                    </span>
                  </span>
                </h1>
              </div>
            </div>
          </AnimatedText>
        </div>
      </BackgroundWrapper>
    </ProgressProvider>
  )
}

import * as stylex from '@stylexjs/stylex'
import ComputerWrapper from '@/components/computer-wrapper'
import { ProgressProvider } from '@/hooks/use-progress'
import BackgroundWrapper from '@/components/background-wrapper'
import Image from 'next/image'
import { BlurTransition } from '@/components/blur-transition'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { font, leading, mq } from '@/lib/constants.stylex'
import { colors, radius } from '@/lib/tokens.stylex'

const styles = stylex.create({
  page: {
    display: 'flex',
    flex: '1',
    minHeight: '100%',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
  },
  introContainer: {
    marginInline: 'auto',
    maxWidth: '776px',
    paddingInline: {
      default: '1rem',
      [mq.sm]: '1.5rem',
      [mq.lg]: '2rem',
    },
    width: '100%',
  },
  introContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    paddingBlock: '2rem',
  },
  introTitle: {
    fontSize: font.base,
    fontWeight: 500,
    lineHeight: leading.base,
  },
  computerSection: {
    backgroundColor: colors.sidebar,
    borderRadius: radius.lg,
    paddingBlock: '3rem',
  },
  showcase: {
    alignItems: 'center',
    backgroundColor: colors.sidebar,
    borderRadius: radius.lg,
    display: 'flex',
    justifyContent: 'center',
    padding: '1rem',
  },
  projectImage: {
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: '1px',
    height: 'auto',
    maxWidth: '712px',
    width: '100%',
  },
})

export default function HomePage() {
  return (
    <div {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.column)}>
        {/* Introduction Section - Personal bio with animated text */}
        <div {...stylex.props(styles.introContainer)}>
          <div {...stylex.props(styles.introContent)}>
            <h1 {...stylex.props(styles.introTitle)}>
              <Tooltip>
                <TooltipTrigger render={<span>Reza Ilmi</span>} />
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
          <div {...stylex.props(styles.computerSection)}>
            <BackgroundWrapper>
              <ComputerWrapper />
            </BackgroundWrapper>
          </div>
        </ProgressProvider>

        {/* Project Showcase - Data Table Image */}
        <div {...stylex.props(styles.showcase)}>
          <Image
            src="/img/Project-workspace-Data-table.png"
            alt="Project workspace data table"
            width={1920}
            height={1080}
            sizes="(max-width: 744px) 100vw, 712px"
            {...stylex.props(styles.projectImage)}
          />
        </div>

        {/* Project Showcase - Contributors View Image */}
        <div {...stylex.props(styles.showcase)}>
          <Image
            src="/img/Contributors-default.png"
            alt="Contributors default view"
            width={1920}
            height={1080}
            sizes="(max-width: 744px) 100vw, 712px"
            {...stylex.props(styles.projectImage)}
          />
        </div>
      </div>
    </div>
  )
}

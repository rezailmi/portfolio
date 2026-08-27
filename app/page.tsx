import * as stylex from '@stylexjs/stylex'
import ComputerWrapper from '@/components/computer-wrapper'
import { ProgressProvider } from '@/hooks/use-progress'
import BackgroundWrapper from '@/components/background-wrapper'
import Image from 'next/image'
import { BlurTransition } from '@/components/blur-transition'
import { Box } from '@/components/box'
import { Text } from '@/components/text'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { mq, space } from '@/lib/constants.stylex'
import { colors, radius } from '@/lib/tokens.stylex'

const styles = stylex.create({
  page: {
    minHeight: '100%',
  },
  introWidth: {
    marginInline: 'auto',
    maxWidth: '776px',
    paddingInline: {
      default: space.lg,
      [mq.sm]: space['2xl'],
      [mq.lg]: space['4xl'],
    },
    width: '100%',
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
    <Box display="flex" flex="1" style={styles.page}>
      <Box display="flex" flexDirection="column" gap="lg" width="full">
        <Box as="section" display="block" style={styles.introWidth}>
          <Box display="flex" flexDirection="column" gap="md" paddingBlock="4xl">
            <Text as="h1" variant="title">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Box as="span" display="inline">
                      Reza Ilmi
                    </Box>
                  }
                />
                <TooltipContent>
                  <p>Software Designer + Engineer</p>
                </TooltipContent>
              </Tooltip>
            </Text>

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
          </Box>
        </Box>

        <ProgressProvider>
          <Box
            as="section"
            display="block"
            backgroundColor="sidebar"
            borderRadius="lg"
            paddingBlock="6xl"
          >
            <BackgroundWrapper>
              <ComputerWrapper />
            </BackgroundWrapper>
          </Box>
        </ProgressProvider>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor="sidebar"
          borderRadius="lg"
          padding="lg"
        >
          <Image
            src="/img/Project-workspace-Data-table.png"
            alt="Project workspace data table"
            width={1920}
            height={1080}
            sizes="(max-width: 744px) 100vw, 712px"
            {...stylex.props(styles.projectImage)}
          />
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor="sidebar"
          borderRadius="lg"
          padding="lg"
        >
          <Image
            src="/img/Contributors-default.png"
            alt="Contributors default view"
            width={1920}
            height={1080}
            sizes="(max-width: 744px) 100vw, 712px"
            {...stylex.props(styles.projectImage)}
          />
        </Box>
      </Box>
    </Box>
  )
}

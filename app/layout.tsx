import type { Metadata } from 'next'
import Script from 'next/script'
import { GeistSans } from 'geist/font/sans'
import '@stylexswc/webpack-plugin/stylex.css'
import './globals.css'
import { AppSidebar } from '@/components/app-sidebar'
import { Breadcrumb } from '@/components/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { ClientSidebarProvider } from '@/components/client-sidebar-provider'
import type React from 'react'
import * as stylex from '@stylexjs/stylex'
import { mq } from '@/lib/constants.stylex'
import { colors } from '@/lib/tokens.stylex'
import { customClassName } from '@/lib/utils.stylex'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Analytics } from '@vercel/analytics/react'
import { featureFlags } from '@/lib/feature-flags'
import { FeatureFlagsProvider } from '@/components/feature-flags-provider'
import { DevTools } from '@/components/dev-tools'
import { PageTitleProvider } from '@/hooks/use-page-title'

const styles = stylex.create({
  body: {
    isolation: 'isolate',
    minHeight: '100vh',
    overflow: 'hidden',
    WebkitFontSmoothing: 'antialiased',
  },
  staticShell: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
  staticHeader: {
    alignItems: 'center',
    display: 'flex',
    flexShrink: 0,
    gap: '0.5rem',
    height: { default: '3.5rem', [mq.sm]: '4rem' },
    paddingInline: { default: '0.5rem', [mq.sm]: '1rem' },
  },
  triggerWrap: {
    marginLeft: { default: '-0.125rem', [mq.sm]: '-0.25rem' },
  },
  headerSep: {
    alignSelf: 'center',
    height: '1rem',
    marginRight: { default: '0.25rem', [mq.sm]: '0.5rem' },
  },
  headerEnd: {
    marginLeft: 'auto',
  },
  staticBody: {
    display: 'flex',
    flex: '1',
    minHeight: 0,
    overflow: 'hidden',
    position: 'relative',
  },
  scrollFull: {
    height: '100%',
  },
  staticMain: {
    padding: { default: '0.5rem', [mq.sm]: '1rem' },
  },
  stickyFrame: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    borderRadius: { default: 0, [mq.md]: '0.6875rem' },
  },
  stickyFill: {
    inset: 0,
    position: 'absolute',
  },
  stickyColumn: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
  },
  stickyHeader: {
    alignItems: 'center',
    borderTopLeftRadius: 'inherit',
    borderTopRightRadius: 'inherit',
    display: 'flex',
    flexShrink: 0,
    gap: '0.5rem',
    height: { default: '3.5rem', [mq.sm]: '4rem' },
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  blurStack: {
    inset: 0,
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: -1,
  },
  blurLayer: {
    inset: 0,
    position: 'absolute',
  },
  blur64: {
    backdropFilter: 'blur(64px)',
    maskImage: 'linear-gradient(to bottom, black, black 40%, transparent 60%)',
  },
  blur32: {
    backdropFilter: 'blur(32px)',
    maskImage: 'linear-gradient(to bottom, transparent 10%, black 30%, black 50%, transparent 70%)',
  },
  blur16: {
    backdropFilter: 'blur(16px)',
    maskImage: 'linear-gradient(to bottom, transparent 20%, black 40%, black 60%, transparent 80%)',
  },
  blur8: {
    backdropFilter: 'blur(8px)',
    maskImage: 'linear-gradient(to bottom, transparent 30%, black 50%, black 70%, transparent 90%)',
  },
  blur4: {
    backdropFilter: 'blur(4px)',
    maskImage: 'linear-gradient(to bottom, transparent 40%, black 60%, black 80%, transparent)',
  },
  blur2: {
    backdropFilter: 'blur(2px)',
    maskImage: 'linear-gradient(to bottom, transparent 60%, black 80%, transparent)',
  },
  blur1: {
    backdropFilter: 'blur(1px)',
    maskImage: 'linear-gradient(to bottom, transparent 70%, black, transparent)',
  },
  headerWash: {
    backgroundImage: `linear-gradient(to bottom, color-mix(in srgb, ${colors.background} 35%, transparent), color-mix(in srgb, ${colors.background} 15%, transparent), transparent)`,
  },
  stickyHeaderInner: {
    alignItems: 'center',
    display: 'flex',
    gap: '0.5rem',
    paddingInline: { default: '0.5rem', [mq.sm]: '1rem' },
    position: 'relative',
  },
  stickyMain: {
    flex: '1',
  },
  stickyMainInner: {
    display: 'flex',
    flexDirection: 'column',
    padding: { default: '0.5rem', [mq.sm]: '1rem' },
  },
  floatingToggle: {
    position: 'fixed',
    right: { default: '1rem', [mq.sm]: '1.5rem' },
    top: { default: '1rem', [mq.sm]: '1.25rem' },
    zIndex: 50,
  },
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rezailmi.com'),
  title: 'Reza Ilmi, Designer + Engineer',
  description: 'Software designer portfolio',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],

    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    title: 'Reza Ilmi',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

function HeaderControls() {
  return (
    <>
      <div {...stylex.props(styles.triggerWrap)}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger render={<SidebarTrigger />} />
            <TooltipContent side="bottom" align="start">
              Toggle sidebar
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div {...stylex.props(styles.headerSep)}>
        <Separator orientation="vertical" />
      </div>
      <Breadcrumb />
    </>
  )
}

function StaticHeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientSidebarProvider>
      <div {...stylex.props(styles.staticShell)}>
        <header {...stylex.props(styles.staticHeader)}>
          <HeaderControls />
          <div {...stylex.props(styles.headerEnd)}>
            <ThemeToggle />
          </div>
        </header>

        <div {...stylex.props(styles.staticBody)}>
          <AppSidebar />
          <SidebarInset>
            <ScrollArea style={{ height: '100%' }}>
              <main {...stylex.props(styles.staticMain)}>
                <TooltipProvider>{children}</TooltipProvider>
              </main>
            </ScrollArea>
          </SidebarInset>
        </div>
      </div>
    </ClientSidebarProvider>
  )
}

function StickyHeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientSidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div {...stylex.props(styles.stickyFrame)}>
          <div {...stylex.props(styles.stickyFill)}>
            <ScrollArea style={{ height: '100%' }}>
              <div {...stylex.props(styles.stickyColumn)}>
                <header {...stylex.props(styles.stickyHeader)}>
                  <div {...stylex.props(styles.blurStack)}>
                    <div {...stylex.props(styles.blurLayer, styles.blur64)} />
                    <div {...stylex.props(styles.blurLayer, styles.blur32)} />
                    <div {...stylex.props(styles.blurLayer, styles.blur16)} />
                    <div {...stylex.props(styles.blurLayer, styles.blur8)} />
                    <div {...stylex.props(styles.blurLayer, styles.blur4)} />
                    <div {...stylex.props(styles.blurLayer, styles.blur2)} />
                    <div {...stylex.props(styles.blurLayer, styles.blur1)} />
                    <div {...stylex.props(styles.blurLayer, styles.headerWash)} />
                  </div>
                  <div {...stylex.props(styles.stickyHeaderInner)}>
                    <HeaderControls />
                  </div>
                </header>
                <main {...stylex.props(styles.stickyMain)}>
                  <div {...stylex.props(styles.stickyMainInner)}>
                    <TooltipProvider>{children}</TooltipProvider>
                  </div>
                </main>
              </div>
            </ScrollArea>
          </div>
        </div>
      </SidebarInset>
      <div {...stylex.props(styles.floatingToggle)}>
        <ThemeToggle />
      </div>
    </ClientSidebarProvider>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-inset-header={featureFlags.insetHeader || undefined}
    >
      <body {...stylex.props(styles.body, customClassName(GeistSans.className))}>
        {process.env.NODE_ENV === 'development' && (
          <Script src="/made-refine-preload.js" strategy="beforeInteractive" />
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FeatureFlagsProvider flags={featureFlags}>
            <PageTitleProvider>
              {featureFlags.insetHeader ? (
                <StickyHeaderLayout>{children}</StickyHeaderLayout>
              ) : (
                <StaticHeaderLayout>{children}</StaticHeaderLayout>
              )}
            </PageTitleProvider>
            <DevTools />
          </FeatureFlagsProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

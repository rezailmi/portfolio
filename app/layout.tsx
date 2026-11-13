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
import { Analytics } from '@vercel/analytics/react'
import { DevTools } from '@/components/dev-tools'
import { PageTitleProvider } from '@/hooks/use-page-title'
import { SITE_ORIGIN } from '@/lib/site'

const styles = stylex.create({
  body: {
    isolation: 'isolate',
    minHeight: '100svh',
    WebkitFontSmoothing: 'antialiased',
  },
  triggerWrap: {
    marginLeft: { default: '-0.125rem', [mq.sm]: '-0.25rem' },
  },
  headerSep: {
    alignSelf: 'center',
    height: '1rem',
    marginRight: { default: '0.25rem', [mq.sm]: '0.5rem' },
  },
  header: {
    alignItems: 'center',
    backgroundColor: { default: 'transparent', [mq.solidSurfaces]: colors.background },
    borderTopLeftRadius: { default: 0, [mq.md]: '0.75rem' },
    borderTopRightRadius: { default: 0, [mq.md]: '0.75rem' },
    display: 'flex',
    height: { default: '3.5rem', [mq.sm]: '4rem' },
    left: 'var(--sidebar-gap, 0px)',
    position: 'fixed',
    right: { default: 0, [mq.md]: '0.5rem' },
    top: { default: 0, [mq.md]: '0.5rem' },
    zIndex: 30,
  },
  headerSpacer: {
    flexShrink: 0,
    height: { default: '3.5rem', [mq.sm]: '4rem' },
  },
  frame: {
    borderColor: colors.border,
    borderRadius: '0.75rem',
    borderStyle: 'solid',
    borderWidth: '1px',
    boxShadow: `0 0 0 100vmax ${colors.sidebar}`,
    bottom: '0.5rem',
    display: { default: 'none', [mq.md]: 'block' },
    left: 'var(--sidebar-gap, 0px)',
    pointerEvents: 'none',
    position: 'fixed',
    right: '0.5rem',
    top: '0.5rem',
    zIndex: 35,
  },
  // Runs past the header so the blur tapers to nothing instead of ending on a hard edge.
  // No ancestor may set backdrop-filter or a rounded overflow clip: either stops the layer
  // masks from applying. The frame's outer shadow already covers the header's corners.
  blurStack: {
    display: { default: 'block', [mq.solidSurfaces]: 'none' },
    height: 'calc(100% + 1.5rem)',
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: -1,
  },
  blurLayer: {
    inset: 0,
    position: 'absolute',
  },
  // Each step switches on above its threshold and compounds with the steps below it
  // (stacked backdrop filters read each other), so the combined blur follows an ease-in
  // curve: 0 at the bottom edge, ~24px at the top.
  blurStep1: {
    backdropFilter: 'blur(1.37px)',
    maskImage: 'linear-gradient(to top, transparent 0%, black 16.67%)',
  },
  blurStep2: {
    backdropFilter: 'blur(3.91px)',
    maskImage: 'linear-gradient(to top, transparent 16.67%, black 33.33%)',
  },
  blurStep3: {
    backdropFilter: 'blur(6.75px) saturate(1.4)',
    maskImage: 'linear-gradient(to top, transparent 33.33%, black 50%)',
  },
  blurStep4: {
    backdropFilter: 'blur(9.73px)',
    maskImage: 'linear-gradient(to top, transparent 50%, black 66.67%)',
  },
  blurStep5: {
    backdropFilter: 'blur(12.81px)',
    maskImage: 'linear-gradient(to top, transparent 66.67%, black 83.33%)',
  },
  blurStep6: {
    backdropFilter: 'blur(15.96px)',
    maskImage: 'linear-gradient(to top, transparent 83.33%, black 100%)',
  },
  // Smoothstep tint: dense enough behind the breadcrumb to keep it legible, then eases
  // out with no visible band where the slope changes
  headerWash: {
    backgroundImage: `linear-gradient(to bottom, color-mix(in srgb, ${colors.background} 90%, transparent) 30%, color-mix(in srgb, ${colors.background} 85%, transparent) 40%, color-mix(in srgb, ${colors.background} 72%, transparent) 50%, color-mix(in srgb, ${colors.background} 55%, transparent) 60%, color-mix(in srgb, ${colors.background} 35%, transparent) 70%, color-mix(in srgb, ${colors.background} 18%, transparent) 80%, color-mix(in srgb, ${colors.background} 5%, transparent) 90%, transparent 100%)`,
  },
  headerInner: {
    alignItems: 'center',
    display: 'flex',
    flex: '1',
    gap: '0.5rem',
    minWidth: 0,
    paddingInline: { default: '0.5rem', [mq.sm]: '1rem' },
    position: 'relative',
  },
  headerEnd: {
    marginLeft: 'auto',
  },
  main: {
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    padding: { default: '0.5rem', [mq.sm]: '1rem' },
  },
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
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

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ClientSidebarProvider>
      <AppSidebar />
      <div {...stylex.props(styles.frame)} />
      <SidebarInset>
        <div {...stylex.props(styles.headerSpacer)} />
        <header {...stylex.props(styles.header)}>
          <div {...stylex.props(styles.blurStack)} aria-hidden>
            <div {...stylex.props(styles.blurLayer, styles.blurStep1)} />
            <div {...stylex.props(styles.blurLayer, styles.blurStep2)} />
            <div {...stylex.props(styles.blurLayer, styles.blurStep3)} />
            <div {...stylex.props(styles.blurLayer, styles.blurStep4)} />
            <div {...stylex.props(styles.blurLayer, styles.blurStep5)} />
            <div {...stylex.props(styles.blurLayer, styles.blurStep6)} />
            <div {...stylex.props(styles.blurLayer, styles.headerWash)} />
          </div>
          <div {...stylex.props(styles.headerInner)}>
            <HeaderControls />
            <div {...stylex.props(styles.headerEnd)}>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main {...stylex.props(styles.main)}>
          <TooltipProvider>{children}</TooltipProvider>
        </main>
      </SidebarInset>
    </ClientSidebarProvider>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
          <PageTitleProvider>
            <AppShell>{children}</AppShell>
          </PageTitleProvider>
          {process.env.NODE_ENV === 'development' ? <DevTools /> : null}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

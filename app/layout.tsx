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
    backgroundColor: `color-mix(in srgb, ${colors.background} 82%, transparent)`,
    backdropFilter: 'blur(20px)',
    borderTopLeftRadius: { default: 0, [mq.md]: '0.75rem' },
    borderTopRightRadius: { default: 0, [mq.md]: '0.75rem' },
    display: 'flex',
    height: { default: '3.5rem', [mq.sm]: '4rem' },
    left: 'var(--sidebar-gap, 0px)',
    overflow: 'hidden',
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
  headerInner: {
    alignItems: 'center',
    display: 'flex',
    flex: '1',
    gap: '0.5rem',
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

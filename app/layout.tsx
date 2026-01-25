import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { AppSidebar } from '@/components/app-sidebar'
import { Breadcrumb } from '@/components/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import type React from 'react'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { cookies } from 'next/headers'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Analytics } from '@vercel/analytics/react'
import { ProgressBar } from '@/components/progress-bar'
import { AgentationToolbar } from '@/components/agentation'
import { featureFlags } from '@/lib/feature-flags'
import { FeatureFlagsProvider } from '@/components/feature-flags-provider'

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
}

function StaticHeaderLayout({
  children,
  defaultOpen,
}: {
  children: React.ReactNode
  defaultOpen: boolean
}) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <header className="flex h-14 shrink-0 items-center gap-2 px-2 sm:h-16 sm:px-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger render={<SidebarTrigger className="-ml-0.5 sm:-ml-1" />} />
            <TooltipContent side="bottom" align="start">
              Toggle sidebar
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Separator orientation="vertical" className="mr-1 h-4 sm:mr-2" />
        <Breadcrumb />
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <AppSidebar />
        <SidebarInset>
          <ScrollArea className="h-full">
            <main className="p-2 sm:p-4">
              <TooltipProvider>{children}</TooltipProvider>
            </main>
          </ScrollArea>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

function StickyHeaderLayout({
  children,
  defaultOpen,
}: {
  children: React.ReactNode
  defaultOpen: boolean
}) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <div className="relative flex h-full flex-col overflow-hidden rounded-none md:rounded-[.6875rem]">
          <div className="absolute inset-0">
            <ScrollArea className="h-full">
              <div className="flex min-h-full flex-col">
                <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 rounded-t-[inherit] sm:h-16">
                  <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute inset-0 backdrop-blur-[64px] backdrop-filter [mask-image:linear-gradient(to_bottom,black,black_40%,transparent_60%)]" />
                    <div className="absolute inset-0 backdrop-blur-[32px] backdrop-filter [mask-image:linear-gradient(to_bottom,transparent_10%,black_30%,black_50%,transparent_70%)]" />
                    <div className="absolute inset-0 backdrop-blur-[16px] backdrop-filter [mask-image:linear-gradient(to_bottom,transparent_20%,black_40%,black_60%,transparent_80%)]" />
                    <div className="absolute inset-0 backdrop-blur-[8px] backdrop-filter [mask-image:linear-gradient(to_bottom,transparent_30%,black_50%,black_70%,transparent_90%)]" />
                    <div className="absolute inset-0 backdrop-blur-[4px] backdrop-filter [mask-image:linear-gradient(to_bottom,transparent_40%,black_60%,black_80%,transparent)]" />
                    <div className="absolute inset-0 backdrop-blur-[2px] backdrop-filter [mask-image:linear-gradient(to_bottom,transparent_60%,black_80%,transparent)]" />
                    <div className="absolute inset-0 backdrop-blur-[1px] backdrop-filter [mask-image:linear-gradient(to_bottom,transparent_70%,black,transparent)]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/35 via-background/15 to-transparent" />
                  </div>
                  <div className="relative flex items-center gap-2 px-2 sm:px-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger render={<SidebarTrigger className="-ml-0.5 sm:-ml-1" />} />
                        <TooltipContent side="bottom" align="start">
                          Toggle sidebar
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Separator orientation="vertical" className="mr-1 h-4 sm:mr-2" />
                    <Breadcrumb />
                  </div>
                </header>
                <main className="flex-1">
                  <div className="flex flex-col p-2 sm:p-4">
                    <TooltipProvider>{children}</TooltipProvider>
                  </div>
                </main>
              </div>
            </ScrollArea>
          </div>
        </div>
      </SidebarInset>
      <div className="fixed right-4 top-4 z-50 sm:right-6 sm:top-5">
        <ThemeToggle />
      </div>
    </SidebarProvider>
  )
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const sidebarState = cookieStore.get('sidebar:state')
  const defaultOpen = sidebarState ? sidebarState.value === 'true' : true

  return (
    <html lang="en" suppressHydrationWarning data-inset-header={featureFlags.insetHeader || undefined}>
      <body className={cn('isolate min-h-screen overflow-hidden antialiased', GeistSans.className)}>
        <ProgressBar />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FeatureFlagsProvider flags={featureFlags}>
            {featureFlags.insetHeader ? (
              <StickyHeaderLayout defaultOpen={defaultOpen}>{children}</StickyHeaderLayout>
            ) : (
              <StaticHeaderLayout defaultOpen={defaultOpen}>{children}</StaticHeaderLayout>
            )}
          </FeatureFlagsProvider>
          <AgentationToolbar />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const sidebarState = cookieStore.get('sidebar:state')
  const defaultOpen = sidebarState ? sidebarState.value === 'true' : true

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('isolate min-h-screen overflow-hidden antialiased', GeistSans.className)}>
        <ProgressBar />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={defaultOpen}>
            {/* Static header */}
            <header className="flex h-14 shrink-0 items-center gap-2 px-2 sm:h-16 sm:px-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    render={<SidebarTrigger className="-ml-0.5 sm:-ml-1" />}
                  />
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

            {/* Main content wrapper */}
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
          <AgentationToolbar />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

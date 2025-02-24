import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { AppSidebar } from '../components/app-sidebar'
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

export const metadata: Metadata = {
  title: 'Reza Ilmi, Designer + Engineer',
  description: 'Software designer portfolio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const sidebarState = cookieStore.get('sidebar:state')
  const defaultOpen = sidebarState ? sidebarState.value === 'true' : true

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen overflow-hidden antialiased', GeistSans.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
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
                              <TooltipTrigger asChild>
                                <SidebarTrigger className="-ml-0.5 sm:-ml-1" />
                              </TooltipTrigger>
                              <TooltipContent side="bottom" align="start">
                                Toggle sidebar
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Separator orientation="vertical" className="mr-1 h-4 sm:mr-2" />
                          <Breadcrumb />
                        </div>
                        <div className="ml-auto mr-2 sm:mr-4">
                          <ThemeToggle />
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
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

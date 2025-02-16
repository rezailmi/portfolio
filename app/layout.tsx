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

export const metadata: Metadata = {
  title: 'Reza Ilmi, Designer + Engineer',
  description: 'Software designer portfolio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen overflow-x-hidden antialiased', GeistSans.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <div className="flex h-full flex-col overflow-clip rounded-[inherit]">
                <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 rounded-t-[inherit] sm:h-16">
                  <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute inset-0 backdrop-blur-[64px] backdrop-filter [mask-image:linear-gradient(to_bottom,black,black_30%,transparent_40%)]" />
                    <div className="absolute inset-0 backdrop-blur-[32px] backdrop-filter [mask-image:linear-gradient(to_bottom,transparent_10%,black_20%,black_40%,transparent_50%)]" />
                    <div className="absolute inset-0 backdrop-blur-[16px] backdrop-filter [mask-image:linear-gradient(to_bottom,transparent_15%,black_30%,black_50%,transparent_60%)]" />
                    <div className="absolute inset-0 backdrop-blur-[8px] backdrop-filter [mask-image:linear-gradient(to_bottom,transparent_20%,black_40%,black_60%,transparent_70%)]" />
                    <div className="absolute inset-0 backdrop-blur-[4px] backdrop-filter [mask-image:linear-gradient(to_bottom,transparent_40%,black_60%,black_80%,transparent_90%)]" />
                    <div className="absolute inset-0 backdrop-blur-[2px] backdrop-filter [mask-image:linear-gradient(to_bottom,transparent_60%,black_80%)]" />
                    <div className="absolute inset-0 backdrop-blur-[1px] backdrop-filter [mask-image:linear-gradient(to_bottom,transparent_70%,black_100%)]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/15 to-transparent" />
                  </div>
                  <div className="relative flex items-center gap-2 px-2 sm:px-4">
                    <SidebarTrigger className="-ml-0.5 sm:-ml-1" />
                    <Separator orientation="vertical" className="mr-1 h-4 sm:mr-2" />
                    <Breadcrumb />
                  </div>
                  <div className="ml-auto mr-2 sm:mr-4">
                    <ThemeToggle />
                  </div>
                </header>
                <main className="flex-1 overflow-y-auto">
                  <div className="flex flex-col gap-3 p-2 sm:gap-4 sm:p-4">{children}</div>
                </main>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

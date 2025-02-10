import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppSidebar } from '../components/app-sidebar'
import { Breadcrumb } from '@/components/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import type React from 'react'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Reza's Portfolio",
  description: 'Software designer portfolio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn('min-h-screen overflow-x-hidden bg-background antialiased', inter.className)}
      >
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
                <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 rounded-t-[inherit] border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:h-16">
                  <div className="flex items-center gap-2 px-2 sm:px-4">
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

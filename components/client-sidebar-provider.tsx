'use client'

import { useState } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { getSidebarDefaultOpen } from '@/components/sidebar-cookie'

export function ClientSidebarProvider({ children }: { children: React.ReactNode }) {
  const [defaultOpen] = useState(getSidebarDefaultOpen)
  return <SidebarProvider defaultOpen={defaultOpen}>{children}</SidebarProvider>
}

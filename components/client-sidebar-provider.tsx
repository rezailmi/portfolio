'use client'

import { useEffect, useState } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { getSidebarDefaultOpen } from '@/components/sidebar-cookie'

export function ClientSidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  useEffect(() => {
    setOpen(getSidebarDefaultOpen())
  }, [])
  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      {children}
    </SidebarProvider>
  )
}

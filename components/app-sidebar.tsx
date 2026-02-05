'use client'

import * as React from 'react'
import Link from 'next/link'
import { Home, LayoutDashboard, FileText, User, Map, PieChart, Frame } from 'lucide-react'
import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'

import { NavMain } from './nav-main'
import { NavProjects } from './nav-projects'
import Lettermark from './lettermark'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
}

const navItems: NavItem[] = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'Works', url: '/works', icon: LayoutDashboard },
  { title: 'Notes', url: '/notes', icon: FileText },
  { title: 'About', url: '/about', icon: User },
]

const projects = [
  { name: 'Design Engineering', url: '#', icon: Frame },
  { name: 'Sales & Marketing', url: '#', icon: PieChart },
  { name: 'Travel', url: '#', icon: Map },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  // Close mobile sidebar on route change
  React.useEffect(() => {
    setOpenMobile(false)
  }, [pathname, setOpenMobile])

  const navMainWithActiveState = navItems.map((item) => ({
    ...item,
    isActive: pathname === item.url,
  }))

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="-ml-1.5 mt-1 w-fit rounded-full px-0">
              <Link href="/" className="w-fit" aria-label="Home">
                <div className="flex items-start justify-start">
                  <Lettermark
                    size={64}
                    parallaxStrength={3.5}
                    tiltStrength={1.5}
                    outerColor="var(--foreground)"
                    innerColor="var(--sidebar-background)"
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainWithActiveState} />
        <NavProjects projects={projects} showProjects={false} />
      </SidebarContent>
    </Sidebar>
  )
}

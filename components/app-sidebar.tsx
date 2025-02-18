'use client'

import * as React from 'react'
import Link from 'next/link'
import { Command, Home, Briefcase, FileText, User, Map, PieChart, Frame } from 'lucide-react'
import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'

import { NavMain } from './nav-main'
import { NavProjects } from './nav-projects'

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
  { title: 'Works', url: '/works', icon: Briefcase },
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
            <SidebarMenuButton size="lg" asChild className="w-fit">
              <Link href="/" className="w-fit">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                {/* <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div> */}
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

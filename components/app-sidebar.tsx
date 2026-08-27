'use client'

import * as React from 'react'
import Link from 'next/link'
import { Home, LayoutDashboard, FileText, User, Map, PieChart, Frame } from 'lucide-react'
import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import * as stylex from '@stylexjs/stylex'

import { NavMain } from './nav-main'
import { NavProjects } from './nav-projects'
import Lettermark from './lettermark'

import { Box } from '@/components/box'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

const styles = stylex.create({
  brandLink: {
    width: 'fit-content',
  },
})

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
            <SidebarMenuButton
              size="lg"
              style={{
                borderRadius: 9999,
                marginLeft: '-0.375rem',
                marginTop: '0.25rem',
                paddingInline: 0,
                width: 'fit-content',
              }}
              render={
                <Link href="/" aria-label="Home" {...stylex.props(styles.brandLink)}>
                  <Box display="flex" alignItems="start" justifyContent="start">
                    <Lettermark
                      size={64}
                      parallaxStrength={3.5}
                      tiltStrength={1.5}
                      outerColor="var(--foreground)"
                      innerColor="var(--sidebar-background)"
                    />
                  </Box>
                </Link>
              }
            />
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

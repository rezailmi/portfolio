'use client'

import { Folder, MoreHorizontal, Share, Trash2, type LucideIcon } from 'lucide-react'
import * as stylex from '@stylexjs/stylex'
import { colors } from '@/lib/tokens.stylex'
import { a11y } from '@/lib/a11y'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

const styles = stylex.create({
  iconHidden: {
    display: {
      default: 'flex',
      ':is([data-collapsible=icon] *)': 'none',
    },
  },
  menu: {
    width: '12rem',
  },
  mutedIcon: {
    color: colors.mutedForeground,
  },
})

export function NavProjects({
  projects,
  showProjects = true,
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
  showProjects?: boolean
}) {
  const { isMobile } = useSidebar()

  return showProjects ? (
    <SidebarGroup className={stylex.props(styles.iconHidden).className}>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              render={
                <a href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </a>
              }
            />
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuAction>
                    <MoreHorizontal />
                    <span {...stylex.props(a11y.srOnly)}>More</span>
                  </SidebarMenuAction>
                }
              />
              <DropdownMenuContent
                className={stylex.props(styles.menu).className}
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
              >
                <DropdownMenuItem>
                  <Folder {...stylex.props(styles.mutedIcon)} />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share {...stylex.props(styles.mutedIcon)} />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 {...stylex.props(styles.mutedIcon)} />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton>
            <MoreHorizontal />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  ) : null
}

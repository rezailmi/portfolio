import type * as React from "react"

import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar"

export function NavSecondary({ ...props }: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>{/* Secondary navigation items removed */}</SidebarGroupContent>
    </SidebarGroup>
  )
}


'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import React from 'react'
import * as stylex from '@stylexjs/stylex'
import {
  Breadcrumb as UIBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { usePageTitle } from '@/hooks/use-page-title'

// Keep the trail on one line: ancestors keep their width, the current page truncates.
// The ui primitives merge StyleX styles passed through `style`.
const styles = stylex.create({
  nav: {
    minWidth: 0,
  },
  list: {
    flexWrap: 'nowrap',
    whiteSpace: 'nowrap',
  },
  currentItem: {
    minWidth: 0,
  },
  currentPage: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
})

const asStyle = (style: stylex.StyleXStyles) => style as unknown as React.CSSProperties

export function Breadcrumb() {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter((segment) => segment !== '')
  const { title: pageTitle } = usePageTitle()

  return (
    <UIBreadcrumb {...stylex.props(styles.nav)}>
      <BreadcrumbList style={asStyle(styles.list)}>
        {pathname === '/' ? (
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        ) : (
          pathSegments.map((segment, index) => {
            const href = `/${pathSegments.slice(0, index + 1).join('/')}`
            const isLast = index === pathSegments.length - 1
            const displayText =
              isLast && pageTitle ? pageTitle : segment.charAt(0).toUpperCase() + segment.slice(1)

            return (
              <React.Fragment key={href}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem style={isLast ? asStyle(styles.currentItem) : undefined}>
                  {isLast ? (
                    <BreadcrumbPage style={asStyle(styles.currentPage)} title={displayText}>
                      {displayText}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link href={href}>{displayText}</Link>} />
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            )
          })
        )}
      </BreadcrumbList>
    </UIBreadcrumb>
  )
}

'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import React from 'react'
import {
  Breadcrumb as UIBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { usePageTitle } from '@/hooks/use-page-title'

export function Breadcrumb() {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter((segment) => segment !== '')
  const { title: pageTitle } = usePageTitle()

  return (
    <UIBreadcrumb>
      <BreadcrumbList>
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
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{displayText}</BreadcrumbPage>
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

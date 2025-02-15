'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {
  Breadcrumb as UIBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export function Breadcrumb() {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter((segment) => segment !== '')
  const [pageTitle, setPageTitle] = useState<string>()

  useEffect(() => {
    // Get the page title from the document title
    const title = document.title.split('|')[0].trim()
    if (title && title !== 'Reza Ilmi, Designer + Engineer') {
      setPageTitle(title)
    }
  }, [pathname])

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
                    <BreadcrumbLink asChild>
                      <Link href={href}>{displayText}</Link>
                    </BreadcrumbLink>
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

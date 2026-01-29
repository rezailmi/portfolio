import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Direct Edit Panel',
  description: 'Showcase for the Direct Edit visual editing panel',
  robots: {
    index: false,
    follow: false,
  },
}

export default function EditLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

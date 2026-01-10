import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Base UI Components',
  description: 'Internal test page for Base UI components',
  robots: {
    index: false,
    follow: false,
  },
}

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

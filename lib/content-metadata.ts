import type { Metadata } from 'next'
import type { MDXContent } from '@/lib/content'

export function buildContentMetadata(item: MDXContent): Metadata {
  const ogImage = item.ogImage || item.coverImage
  return {
    title: item.title,
    description: item.description,
    openGraph: {
      title: item.title,
      description: item.description,
      type: 'article',
      publishedTime: item.date,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: item.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description: item.description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

import { notFound } from 'next/navigation'
import { getNoteBySlug, getNoteSlugs } from '@/lib/content'
import { ContentLayout } from '@/components/layout-content'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const slugs = getNoteSlugs()
  return slugs.map((slug) => ({ slug: slug.replace(/\.mdx$/, '') }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  try {
    const post = getNoteBySlug(slug)

    // TODO: Replace with your actual default OG image
    // Recommended dimensions: 1200x630px
    // Should be a public URL or a path in the public directory
    const defaultOGImage = 'https://your-default-og-image.jpg'

    return {
      title: post.title,
      description: post.description,
      openGraph: {
        title: post.title,
        description: post.description,
        type: 'article',
        publishedTime: post.date,
        images: [
          {
            url: post.ogImage || post.coverImage || defaultOGImage,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.description,
        images: [post.ogImage || post.coverImage || defaultOGImage],
      },
    }
  } catch {
    return {}
  }
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params
  try {
    const post = getNoteBySlug(slug)

    return <ContentLayout title={post.title} date={post.date} content={post.content} />
  } catch {
    notFound()
  }
}

import { notFound } from 'next/navigation'
import { getNoteBySlug, getNoteSlugs } from '@/lib/content'
import { buildContentMetadata } from '@/lib/content-metadata'
import { ContentLayout } from '@/components/layout-content'
import { Metadata } from 'next'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const slugs = getNoteSlugs()
  if (slugs.length === 0) {
    // Cache Components requires at least one param; the placeholder renders 404.
    return [{ slug: 'not-found' }]
  }
  return slugs.map((slug) => ({ slug: slug.replace(/\.mdx$/, '') }))
}

function noteExists(slug: string) {
  return getNoteSlugs().some((s) => s.replace(/\.mdx$/, '') === slug)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  if (!noteExists(slug)) {
    return {}
  }
  try {
    const post = getNoteBySlug(slug)
    return buildContentMetadata(post)
  } catch (error) {
    console.error(`generateMetadata failed for slug "${slug}":`, error)
    return {}
  }
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params
  if (!noteExists(slug)) {
    notFound()
  }
  try {
    const post = getNoteBySlug(slug)

    return <ContentLayout title={post.title} date={post.date} content={post.content} />
  } catch {
    notFound()
  }
}

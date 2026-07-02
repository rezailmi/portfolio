import { notFound } from 'next/navigation'
import { getWorkBySlug, getWorkSlugs } from '@/lib/content'
import { buildContentMetadata } from '@/lib/content-metadata'
import { ContentLayout } from '@/components/layout-content'
import { Metadata } from 'next'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const slugs = getWorkSlugs()
  return slugs.map((slug: string) => ({ slug: slug.replace(/\.mdx$/, '') }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const work = getWorkBySlug(slug)
    return buildContentMetadata(work)
  } catch (error) {
    console.error(`generateMetadata failed for slug "${slug}":`, error)
    return {}
  }
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params
  try {
    const work = getWorkBySlug(slug)

    return <ContentLayout title={work.title} date={work.date} content={work.content} />
  } catch {
    notFound()
  }
}

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
  return getWorkSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  if (!getWorkSlugs().includes(slug)) {
    return {}
  }
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
  if (!getWorkSlugs().includes(slug)) {
    notFound()
  }
  try {
    const work = getWorkBySlug(slug)

    return <ContentLayout title={work.title} date={work.date} content={work.content} />
  } catch {
    notFound()
  }
}

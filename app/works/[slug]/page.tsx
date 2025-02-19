import { notFound } from 'next/navigation'
import { getWorkBySlug, getWorkSlugs } from '@/lib/content'
import { ContentLayout } from '@/components/layout-content'
import { Metadata } from 'next'

interface Props {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const slugs = getWorkSlugs()
  return slugs.map((slug: string) => ({ slug: slug.replace(/\.mdx$/, '') }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const work = getWorkBySlug(params.slug)
    const metadata: Metadata = {
      title: work.title,
      description: work.description,
      openGraph: {
        title: work.title,
        description: work.description,
        type: 'article',
        publishedTime: work.date,
        images: work.coverImage
          ? [
              {
                url: work.coverImage,
                width: 1200,
                height: 630,
                alt: work.title,
              },
            ]
          : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: work.title,
        description: work.description,
        images: work.coverImage ? [work.coverImage] : undefined,
      },
    }

    return metadata
  } catch {
    return {}
  }
}

export default async function WorkPage({ params }: Props) {
  try {
    const work = getWorkBySlug(params.slug)

    return <ContentLayout title={work.title} date={work.date} content={work.content} />
  } catch {
    notFound()
  }
}

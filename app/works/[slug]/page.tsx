import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getWorkBySlug, getWorkSlugs } from '@/lib/works'
import { components } from '@/components/mdx-components'

interface Props {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const slugs = getWorkSlugs()
  return slugs.map((slug) => ({ slug: slug.replace(/\.mdx$/, '') }))
}

export async function generateMetadata({ params }: Props) {
  try {
    const work = getWorkBySlug(params.slug)

    return {
      title: work.title,
      description: work.description,
      openGraph: {
        title: work.title,
        description: work.description,
        type: 'article',
        publishedTime: work.date,
        images: [
          {
            url: work.coverImage,
            width: 1200,
            height: 630,
            alt: work.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: work.title,
        description: work.description,
        images: [work.coverImage],
      },
    }
  } catch {
    return {}
  }
}

export default async function WorkPage({ params }: Props) {
  try {
    const work = getWorkBySlug(params.slug)

    return (
      <article className="container mx-auto max-w-3xl px-4 py-4">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold">{work.title}</h1>
          <div className="text-sm text-muted-foreground">
            {new Date(work.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          {work.tags && work.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {work.tags.map((tag) => (
                <span key={tag} className="text-sm text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="prose max-w-none dark:prose-invert">
          <MDXRemote source={work.content} components={components} />
        </div>
      </article>
    )
  } catch {
    notFound()
  }
}

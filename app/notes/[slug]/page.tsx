import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getNoteBySlug, getNoteSlugs } from '@/lib/notes'
import { components } from '@/components/mdx-components'

interface Props {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const slugs = getNoteSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props) {
  try {
    const post = getNoteBySlug(params.slug)

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
  try {
    const post = getNoteBySlug(params.slug)

    return (
      <article className="container mx-auto max-w-3xl py-8">
        <div className="mb-4 text-sm text-muted-foreground">
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        <h1 className="mb-8 text-2xl font-semibold tracking-tight">{post.title}</h1>
        <div className="prose mt-8 max-w-none dark:prose-invert">
          <MDXRemote source={post.content} components={components} />
        </div>
      </article>
    )
  } catch {
    notFound()
  }
}

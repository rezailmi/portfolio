import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug, getPostSlugs } from '@/lib/mdx'
import { components } from '@/components/mdx-components'
import { type MDXComponents } from 'mdx/types'
import { cn } from '@/lib/utils'

interface Props {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const slugs = getPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props) {
  try {
    const post = getPostBySlug(params.slug)
    
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
      }
    }
  } catch (error) {
    return {}
  }
}

export default async function NotePage({ params }: Props) {
  try {
    const post = getPostBySlug(params.slug)

    return (
      <article className="container max-w-3xl py-8 mx-auto">
        <div className="text-sm text-muted-foreground mb-8">
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        <div className="prose dark:prose-invert max-w-none mt-8">
          <MDXRemote source={post.content} components={components} />
        </div>
      </article>
    )
  } catch (error) {
    notFound()
  }
} 
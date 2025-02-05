import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug, getPostSlugs } from '@/lib/mdx'
import { components } from '@/components/mdx-components'
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
    
    return {
      title: post.title,
      description: post.description,
      openGraph: {
        title: post.title,
        description: post.description,
        type: 'article',
        publishedTime: post.date,
      },
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
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
          <div className="text-sm text-muted-foreground">
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
        <div className={cn(
          'prose prose-neutral dark:prose-invert max-w-none mt-8',
          // Customizations
          'prose-headings:font-semibold prose-headings:tracking-tight',
          'prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl',
          'prose-a:text-primary hover:prose-a:opacity-80',
          'prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:rounded-md',
          'prose-pre:bg-muted prose-pre:border',
          'prose-blockquote:border-l-primary prose-blockquote:not-italic',
          'prose-img:rounded-lg prose-img:border',
          'prose-hr:border-border',
        )}>
          <MDXRemote source={post.content} components={components} />
        </div>
      </article>
    )
  } catch (error) {
    notFound()
  }
} 
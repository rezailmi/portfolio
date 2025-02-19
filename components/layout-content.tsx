import { MDXRemote } from 'next-mdx-remote/rsc'
import { components } from './mdx-components'

interface ContentLayoutProps {
  title: string
  date: string
  content: string
}

export function ContentLayout({ title, date, content }: ContentLayoutProps) {
  return (
    <article className="container mx-auto max-w-3xl px-4 py-4">
      <h1 className="mb-2 text-base font-medium">{title}</h1>
      <div className="mb-4 text-sm text-muted-foreground">
        {new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>
      <div className="prose mt-8 max-w-none dark:prose-invert">
        <MDXRemote source={content} components={components} />
      </div>
    </article>
  )
}

import { MDXRemote } from 'next-mdx-remote/rsc'
import { components } from './mdx-components'
import remarkGfm from 'remark-gfm'
import rehypePrism from 'rehype-prism-plus'

interface ContentLayoutProps {
  title: string
  date: string
  content: string
}

export function ContentLayout({ title, date, content }: ContentLayoutProps) {
  return (
    <article className="container prose mx-auto max-w-3xl p-4 dark:prose-invert prose-h1:text-base prose-h1:font-medium prose-h2:text-base prose-h2:font-medium prose-h3:text-base prose-h3:font-medium prose-strong:font-medium prose-code:rounded-md prose-code:border prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:text-sm prose-code:font-medium prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:mb-4 prose-pre:mt-4 prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:p-4 prose-pre:[background-color:hsl(var(--code-background))] [&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0">
      <div className="mb-10 flex flex-col">
        <h1 className="mb-2">{title}</h1>
        <time className="text-sm text-muted-foreground">
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
          })}
        </time>
      </div>
      <MDXRemote
        source={content}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [[rehypePrism, { ignoreMissing: true }]],
          },
        }}
      />
    </article>
  )
}

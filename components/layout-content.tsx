import { MDXRemote } from 'next-mdx-remote/rsc'
import { components } from './mdx-components'
import remarkGfm from 'remark-gfm'
import rehypePrism from 'rehype-prism-plus'
import { formatContentDate } from '@/lib/content'
import { PageTitle } from '@/hooks/use-page-title'
import * as stylex from '@stylexjs/stylex'
import { colors } from '@/lib/tokens.stylex'

const styles = stylex.create({
  article: {
    color: colors.foreground,
    fontSize: '1rem',
    lineHeight: 1.75,
    marginInline: 'auto',
    maxWidth: '48rem',
    padding: '1rem',
    width: '100%',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '2.5rem',
  },
  title: {
    fontSize: '1rem',
    fontWeight: 500,
    marginBottom: '0.5rem',
  },
  date: {
    color: colors.mutedForeground,
    fontSize: '0.875rem',
  },
})

interface ContentLayoutProps {
  title: string
  date: string
  content: string
}

export function ContentLayout({ title, date, content }: ContentLayoutProps) {
  return (
    <article {...stylex.props(styles.article)}>
      <PageTitle title={title} />
      <div {...stylex.props(styles.header)}>
        <h1 {...stylex.props(styles.title)}>{title}</h1>
        <time {...stylex.props(styles.date)}>{formatContentDate(date)}</time>
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

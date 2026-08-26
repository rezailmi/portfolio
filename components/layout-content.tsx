import { MDXRemote } from 'next-mdx-remote/rsc'
import { components } from './mdx-components'
import remarkGfm from 'remark-gfm'
import rehypePrism from 'rehype-prism-plus'
import { formatContentDate } from '@/lib/content'
import { PageTitle } from '@/hooks/use-page-title'
import * as stylex from '@stylexjs/stylex'
import { font, leading } from '@/lib/constants.stylex'
import { colors } from '@/lib/tokens.stylex'

const styles = stylex.create({
  article: {
    color: colors.proseBody,
    fontSize: font.base,
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
    color: colors.proseHeading,
    fontSize: font.base,
    fontWeight: 500,
    lineHeight: leading.base,
    marginBottom: '0.5rem',
  },
  date: {
    color: colors.mutedForeground,
    fontSize: font.sm,
    lineHeight: leading.sm,
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

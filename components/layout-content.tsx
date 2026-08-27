import { MDXRemote } from 'next-mdx-remote/rsc'
import { components } from './mdx-components'
import remarkGfm from 'remark-gfm'
import rehypePrism from 'rehype-prism-plus'
import { formatContentDate } from '@/lib/content'
import { PageTitle } from '@/hooks/use-page-title'
import * as stylex from '@stylexjs/stylex'
import { Box } from '@/components/box'
import { Text } from '@/components/text'
import { font, space } from '@/lib/constants.stylex'

const styles = stylex.create({
  article: {
    fontSize: font.base,
    lineHeight: 1.75,
    maxWidth: '48rem',
  },
  header: {
    marginBottom: space['5xl'],
  },
  title: {
    marginBottom: space.sm,
  },
})

export function ContentLayout({
  title,
  date,
  content,
}: {
  title: string
  date: string
  content: string
}) {
  return (
    <Box
      as="article"
      display="block"
      color="proseBody"
      marginInline="auto"
      padding="lg"
      width="full"
      style={styles.article}
    >
      <PageTitle title={title} />
      <Box display="flex" flexDirection="column" style={styles.header}>
        <Text as="h1" variant="title" color="proseHeading" style={styles.title}>
          {title}
        </Text>
        <Text as="time" variant="muted">
          {formatContentDate(date)}
        </Text>
      </Box>
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
    </Box>
  )
}

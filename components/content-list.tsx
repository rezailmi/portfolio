import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import * as stylex from '@stylexjs/stylex'
import { Box } from '@/components/box'
import { Text } from '@/components/text'
import { MDXContent, formatContentDate } from '@/lib/content'
import { leading, space } from '@/lib/constants.stylex'
import { colors, radius } from '@/lib/tokens.stylex'

const styles = stylex.create({
  inner: {
    maxWidth: '48rem',
  },
  title: {
    marginBottom: space['4xl'],
    paddingInline: space['2xl'],
  },
  empty: {
    paddingInline: space['2xl'],
  },
  item: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.muted,
    },
    borderRadius: radius.lg,
    display: 'block',
    textDecoration: 'none',
    transition: 'background-color 150ms',
  },
  itemHeader: {
    paddingBottom: space.lg,
    paddingInline: space['2xl'],
    paddingTop: space['2xl'],
  },
  date: {
    display: 'block',
    marginBottom: space.sm,
  },
  itemBody: {
    paddingBottom: space['2xl'],
    paddingInline: space['2xl'],
  },
  description: {
    color: colors.mutedForeground,
    lineHeight: leading.relaxed,
  },
  cover: {
    aspectRatio: '1.41 / 1',
    backgroundColor: colors.muted,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: '1px',
    marginTop: space.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  coverImage: {
    objectFit: 'fill',
  },
})

interface ContentListProps {
  items: MDXContent[]
  title: string
  emptyMessage: string
  hrefPrefix: string
  showCoverImages?: boolean
  emptyState?: ReactNode
}

export function ContentList({
  items,
  title,
  emptyMessage,
  hrefPrefix,
  showCoverImages = false,
  emptyState,
}: ContentListProps) {
  const header = (
    <Text as="h1" variant="listTitle" style={styles.title}>
      {title}
    </Text>
  )

  if (items.length === 0) {
    return (
      <Box display="flex" justifyContent="center">
        <Box
          display="block"
          paddingBlock="4xl"
          paddingInline="lg"
          width="full"
          style={styles.inner}
        >
          {header}
          {emptyState ?? (
            <Text variant="muted" style={styles.empty}>
              {emptyMessage}
            </Text>
          )}
        </Box>
      </Box>
    )
  }

  return (
    <Box display="flex" justifyContent="center">
      <Box display="block" paddingBlock="4xl" paddingInline="lg" width="full" style={styles.inner}>
        {header}
        <Box display="grid" gap="lg">
          {items.map((item, index) => (
            <Link
              key={item.slug}
              href={`${hrefPrefix}/${item.slug}`}
              {...stylex.props(styles.item)}
            >
              <Box display="flex" flexDirection="column" gap="fine" style={styles.itemHeader}>
                <Text as="h2" variant="title" color="foreground">
                  {item.title}
                </Text>
                <Text as="time" variant="muted" style={styles.date}>
                  {formatContentDate(item.date)}
                </Text>
              </Box>
              <Box display="block" style={styles.itemBody}>
                <p {...stylex.props(styles.description)}>{item.description}</p>
                {showCoverImages && item.coverImage && (
                  <div {...stylex.props(styles.cover)}>
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 736px"
                      {...stylex.props(styles.coverImage)}
                    />
                  </div>
                )}
              </Box>
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

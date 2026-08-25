import Image from 'next/image'
import Link from 'next/link'
import * as stylex from '@stylexjs/stylex'
import { MDXContent, formatContentDate } from '@/lib/content'
import { colors, radius } from '@/lib/tokens.stylex'

const styles = stylex.create({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  inner: {
    maxWidth: '48rem',
    paddingBlock: '2rem',
    paddingInline: '1rem',
    width: '100%',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 500,
    letterSpacing: '-0.025em',
    marginBottom: '2rem',
    paddingInline: '1.5rem',
  },
  empty: {
    color: colors.mutedForeground,
    paddingInline: '1.5rem',
  },
  grid: {
    display: 'grid',
    gap: '1rem',
  },
  item: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.muted,
    },
    borderRadius: radius.lg,
    display: 'block',
    paddingBlock: '1.5rem',
    textDecoration: 'none',
    transition: 'background-color 150ms',
  },
  itemHeader: {
    paddingBottom: '1rem',
    paddingInline: '1.5rem',
  },
  itemTitle: {
    color: colors.foreground,
    fontSize: '1rem',
    fontWeight: 500,
  },
  date: {
    color: colors.mutedForeground,
    display: 'block',
    fontSize: '0.875rem',
    marginBottom: '0.5rem',
  },
  description: {
    color: colors.mutedForeground,
    lineHeight: 1.625,
    paddingInline: '1.5rem',
  },
  cover: {
    aspectRatio: '1.41 / 1',
    backgroundColor: colors.muted,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: '1px',
    marginInline: '1.5rem',
    marginTop: '1rem',
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
  emptyState?: React.ReactNode
}

export function ContentList({
  items,
  title,
  emptyMessage,
  hrefPrefix,
  showCoverImages = false,
  emptyState,
}: ContentListProps) {
  if (items.length === 0) {
    return (
      <div {...stylex.props(styles.root)}>
        <div {...stylex.props(styles.inner)}>
          <h1 {...stylex.props(styles.title)}>{title}</h1>
          {emptyState ?? <p {...stylex.props(styles.empty)}>{emptyMessage}</p>}
        </div>
      </div>
    )
  }

  return (
    <div {...stylex.props(styles.root)}>
      <div {...stylex.props(styles.inner)}>
        <h1 {...stylex.props(styles.title)}>{title}</h1>
        <div {...stylex.props(styles.grid)}>
          {items.map((item, index) => (
            <Link key={item.slug} href={`${hrefPrefix}/${item.slug}`} {...stylex.props(styles.item)}>
              <div {...stylex.props(styles.itemHeader)}>
                <h2 {...stylex.props(styles.itemTitle)}>{item.title}</h2>
                <time {...stylex.props(styles.date)}>{formatContentDate(item.date)}</time>
              </div>
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
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

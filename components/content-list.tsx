import Image from 'next/image'
import Link from 'next/link'
import * as stylex from '@stylexjs/stylex'
import { MDXContent, formatContentDate } from '@/lib/content'
import { font, leading } from '@/lib/constants.stylex'
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
    fontSize: font.xl,
    fontWeight: 500,
    letterSpacing: '-0.025em',
    lineHeight: leading.lg,
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
    textDecoration: 'none',
    transition: 'background-color 150ms',
  },
  itemHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
    paddingBottom: '1rem',
    paddingInline: '1.5rem',
    paddingTop: '1.5rem',
  },
  itemTitle: {
    color: colors.foreground,
    fontSize: font.base,
    fontWeight: 500,
    lineHeight: leading.base,
  },
  date: {
    color: colors.mutedForeground,
    display: 'block',
    fontSize: font.sm,
    lineHeight: leading.sm,
    marginBottom: '0.5rem',
  },
  itemBody: {
    paddingBottom: '1.5rem',
    paddingInline: '1.5rem',
  },
  description: {
    color: colors.mutedForeground,
    lineHeight: 1.625,
  },
  cover: {
    aspectRatio: '1.41 / 1',
    backgroundColor: colors.muted,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: '1px',
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
              <div {...stylex.props(styles.itemBody)}>
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
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

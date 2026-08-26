import fs from 'fs'
import { imageSize } from 'image-size'
import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import path from 'path'
import { cache } from 'react'
import * as stylex from '@stylexjs/stylex'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { font, leading } from '@/lib/constants.stylex'
import { colors, radius } from '@/lib/tokens.stylex'

const styles = stylex.create({
  hidden: {
    display: 'none',
  },
  heading: {
    color: colors.proseHeading,
    fontSize: font.base,
    fontWeight: 500,
    lineHeight: leading.base,
    marginBlock: '2em 1em',
  },
  heading3: {
    color: colors.proseHeading,
    fontSize: font.base,
    fontWeight: 500,
    lineHeight: leading.base,
    marginBlock: '1.6em 0.6em',
  },
  paragraph: {
    color: colors.proseBody,
    marginBottom: '1.25em',
    marginTop: 0,
  },
  strong: {
    color: colors.proseHeading,
    fontWeight: 500,
  },
  list: {
    color: colors.proseBody,
    listStyleType: 'disc',
    marginBlock: '1.25em',
    paddingLeft: '1.625em',
  },
  orderedList: {
    color: colors.proseBody,
    listStyleType: 'decimal',
    marginBlock: '1.25em',
    paddingLeft: '1.625em',
  },
  listItem: {
    marginBlock: '0.5em',
    paddingLeft: '0.375em',
  },
  table: {
    borderCollapse: 'collapse',
    fontSize: font.sm,
    marginBlock: '1.5rem',
    width: '100%',
  },
  th: {
    borderBottomColor: colors.border,
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    color: colors.foreground,
    fontWeight: 500,
    paddingBlock: '0.5rem',
    paddingInline: '0.75rem',
    textAlign: 'left',
  },
  td: {
    borderBottomColor: colors.border,
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    paddingBlock: '0.5rem',
    paddingInline: '0.75rem',
  },
  taskCheckbox: {
    marginRight: '0.5rem',
    verticalAlign: 'middle',
  },
  link: {
    color: colors.foreground,
    textDecorationLine: 'underline',
    textUnderlineOffset: '3px',
  },
  inlineCode: {
    backgroundColor: colors.muted,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: '1px',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSize: font.sm,
    fontWeight: 500,
    paddingBlock: '0.125rem',
    paddingInline: '0.25rem',
  },
  pre: {
    backgroundColor: colors.codeBackground,
    borderRadius: radius.lg,
    color: colors.codeForeground,
    marginBlock: '1rem',
    overflowX: 'auto',
    padding: '1rem',
  },
  preCode: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    padding: 0,
  },
  image: {
    borderRadius: radius.md,
    height: 'auto',
    marginBlock: '2em',
    width: '100%',
  },
  blockquote: {
    borderLeftColor: colors.border,
    borderLeftStyle: 'solid',
    borderLeftWidth: '2px',
    color: colors.mutedForeground,
    marginBlock: '1rem',
    paddingLeft: '1rem',
  },
  hr: {
    borderColor: colors.border,
    borderStyle: 'solid',
    borderWidth: 0,
    borderTopWidth: '1px',
    marginBlock: '2rem',
  },
})

const OGImage = ({ src, alt = '' }: { src: string; alt?: string }) => (
  <Image src={src} alt={alt} width={1200} height={630} {...stylex.props(styles.hidden)} priority />
)

const FALLBACK = { width: 1440, height: 1024 }

const getImageDimensions = cache((src: string) => {
  if (!src.startsWith('/')) return FALLBACK
  try {
    const buffer = fs.readFileSync(path.join(process.cwd(), 'public', src))
    const { width, height } = imageSize(buffer)
    return width && height ? { width, height } : FALLBACK
  } catch {
    return FALLBACK
  }
})

const components: MDXComponents = {
  OGImage,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  h1: (props) => <h1 {...stylex.props(styles.heading)} {...props} />,
  h2: (props) => <h2 {...stylex.props(styles.heading)} {...props} />,
  h3: (props) => <h3 {...stylex.props(styles.heading3)} {...props} />,
  p: (props) => <p {...stylex.props(styles.paragraph)} {...props} />,
  strong: (props) => <strong {...stylex.props(styles.strong)} {...props} />,
  ul: (props) => <ul {...stylex.props(styles.list)} {...props} />,
  ol: (props) => <ol {...stylex.props(styles.orderedList)} {...props} />,
  li: (props) => <li {...stylex.props(styles.listItem)} {...props} />,
  table: (props) => <table {...stylex.props(styles.table)} {...props} />,
  th: (props) => <th {...stylex.props(styles.th)} {...props} />,
  td: (props) => <td {...stylex.props(styles.td)} {...props} />,
  input: (props) =>
    props.type === 'checkbox' ? (
      <input {...stylex.props(styles.taskCheckbox)} {...props} />
    ) : (
      <input {...props} />
    ),
  a: (props) => <a {...stylex.props(styles.link)} {...props} />,
  blockquote: (props) => <blockquote {...stylex.props(styles.blockquote)} {...props} />,
  hr: (props) => <hr {...stylex.props(styles.hr)} {...props} />,
  code: (props) => {
    const isBlock = typeof props.className === 'string' && props.className.includes('language-')
    return <code {...stylex.props(isBlock ? styles.preCode : styles.inlineCode)} {...props} />
  },
  pre: (props) => <pre {...stylex.props(styles.pre)} {...props} />,
  img: async ({ src, alt }: { src?: string; alt?: string }) => {
    const { width, height } = getImageDimensions(src || '')
    return (
      <Image
        src={src || ''}
        alt={alt || ''}
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw, 768px"
        {...stylex.props(styles.image)}
      />
    )
  },
}

export { components }

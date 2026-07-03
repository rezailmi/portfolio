import fs from 'fs'
import { imageSize } from 'image-size'
import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import path from 'path'
import { cache } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

// OGImage component for meta tags (hidden from content)
const OGImage = ({ src, alt = '' }: { src: string; alt?: string }) => (
  <Image src={src} alt={alt} width={1200} height={630} className="not-prose hidden" priority />
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
  img: async ({ src, alt }: { src?: string; alt?: string }) => {
    const { width, height } = getImageDimensions(src || '')
    return (
      <Image
        src={src || ''}
        alt={alt || ''}
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw, 768px"
        className="rounded-md"
        style={{
          width: '100%',
          height: 'auto',
        }}
      />
    )
  },
}

export { components }

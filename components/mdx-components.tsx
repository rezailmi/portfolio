import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
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

const components: MDXComponents = {
  OGImage,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <Image
      src={src || ''}
      alt={alt || ''}
      width={1080}
      height={1080}
      sizes="100vw"
      className="rounded-md"
      style={{
        width: '100%',
        height: 'auto',
      }}
    />
  ),
}

export { components }

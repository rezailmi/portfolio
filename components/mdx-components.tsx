import type { MDXComponents } from 'mdx/types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface OGImageProps {
  src: string
  alt?: string
  width?: number
  height?: number
}

const OGImage = ({ src, alt = "", width = 1200, height = 630 }: OGImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={{
        aspectRatio: 'auto',
        height: 'auto',
      }}
    />
  )
}

const components: MDXComponents = {
  OGImage,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
}

export { components }

import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { DetailedHTMLProps, ImgHTMLAttributes } from 'react'

type MDXImageProps = DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>

const MDXImage = (props: MDXImageProps) => {
  const { src, alt, title, className } = props

  if (!src) return null

  // Parse width, height, and className from title attribute
  const titleParams = title?.split(' ').reduce((acc: Record<string, string>, curr: string) => {
    const [key, value] = curr.split('=')
    if (key && value) {
      acc[key] = value.replace(/['"]/g, '')
    }
    return acc
  }, {})

  const width = titleParams?.width ? parseInt(titleParams.width) : 800
  const height = titleParams?.height ? parseInt(titleParams.height) : 400
  const customClassName = titleParams?.className?.replace(/['"]/g, '')

  // Check if the image is external
  const isExternal = src.startsWith('http')

  return (
    <Image
      src={src}
      alt={alt || ""}
      width={width}
      height={height}
      className={cn(
        "rounded-md border mx-auto my-6",
        customClassName || className
      )}
      quality={85}
      priority={titleParams?.priority === 'true'}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
      {...(isExternal && { unoptimized: true })}
    />
  )
}

interface OGImageProps {
  src: string
  alt?: string
  width?: number
  height?: number
}

const OGImage = ({ src, alt = "", width = 1200, height = 630 }: OGImageProps) => {
  return (
    <div className="not-prose my-6 w-full aspect-[1200/630] relative overflow-hidden rounded-lg border">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority
        sizes="(max-width: 1200px) 100vw, 1200px"
        unoptimized={src.startsWith('http')}
      />
    </div>
  )
}

const components = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        "mt-2 scroll-m-20 text-4xl font-bold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        "mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn(
        "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={cn(
        "mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground",
        className
      )}
      {...props}
    />
  ),
  img: MDXImage,
  OGImage,
  hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn("w-full", className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn("m-0 border-t p-0 even:bg-muted", className)}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
}

export { components } 
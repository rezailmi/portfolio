import Image from 'next/image'
import Link from 'next/link'
import { MDXContent, formatContentDate } from '@/lib/content'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

interface ContentListProps {
  items: MDXContent[]
  title: string
  emptyMessage: string
  hrefPrefix: string
  showCoverImages?: boolean
}

export function ContentList({
  items,
  title,
  emptyMessage,
  hrefPrefix,
  showCoverImages = false,
}: ContentListProps) {
  if (items.length === 0) {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-3xl px-4 py-8">
          <h1 className="mb-8 text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-xl text-muted-foreground">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl px-4 py-8">
        <h1 className="mb-8 px-6 text-xl font-medium tracking-tight">{title}</h1>
        <div className="grid gap-4">
          {items.map((item, index) => (
            <Link key={item.slug} href={`${hrefPrefix}/${item.slug}`}>
              <Card className="border-none shadow-none transition-colors hover:bg-muted">
                <CardHeader className="pb-4">
                  <h2 className="text-base font-medium">{item.title}</h2>
                  <time className="mb-2 block text-sm text-muted-foreground">
                    {formatContentDate(item.date)}
                  </time>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="leading-relaxed text-muted-foreground">{item.description}</p>
                  {showCoverImages && item.coverImage && (
                    <div className="relative mt-4 aspect-[1.41/1] overflow-hidden rounded-lg border bg-muted">
                      <Image
                        src={item.coverImage}
                        alt={item.title}
                        fill
                        priority={index === 0}
                        className="object-fill"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

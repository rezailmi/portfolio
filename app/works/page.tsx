import Image from 'next/image'
import Link from 'next/link'
import { getAllWorks } from '@/lib/content'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

export const metadata = {
  title: 'Works',
  description: 'A collection of my projects and works.',
}

export default function WorksPage() {
  const works = getAllWorks()

  if (works.length === 0) {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-3xl px-4 py-8">
          <h1 className="mb-8 text-2xl font-semibold tracking-tight">Works</h1>
          <p className="text-xl text-muted-foreground">No works to display yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl px-4 py-8">
        <h1 className="mb-8 px-6 text-xl font-medium tracking-tight">Works</h1>
        <div className="grid gap-4">
          {works.map((work) => (
            <Link key={work.slug} href={`/works/${work.slug}`}>
              <Card className="border-none shadow-none transition-colors hover:bg-muted">
                <CardHeader className="pb-4">
                  <h2 className="text-base font-medium">{work.title}</h2>
                  <time className="mb-2 block text-sm text-muted-foreground">
                    {new Date(work.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="leading-relaxed text-muted-foreground">{work.description}</p>
                  {work.coverImage && (
                    <div className="relative mt-4 aspect-[1.41/1] overflow-hidden rounded-lg border bg-muted">
                      <Image
                        src={work.coverImage}
                        alt={work.title}
                        fill
                        priority={works.indexOf(work) === 0}
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

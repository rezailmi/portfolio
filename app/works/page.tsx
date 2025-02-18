import Image from 'next/image'
import Link from 'next/link'
import { getAllWorks } from '@/lib/works'
import { Card, CardContent } from '@/components/ui/card'

export const metadata = {
  title: 'Works',
  description: 'A collection of my projects and works.',
}

export default function WorksPage() {
  const works = getAllWorks()

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl px-4 py-8">
        <h1 className="mb-8 px-6 text-xl font-medium">Works</h1>
        {works.length === 0 ? (
          <p className="text-xl text-muted-foreground">No works to display yet</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {works.map((work) => (
              <Link key={work.slug} href={`/works/${work.slug}`}>
                <Card className="border-none shadow-none transition-colors hover:bg-muted">
                  <CardContent className="p-6">
                    <h3 className="mb-2 text-lg font-semibold">{work.title}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">{work.description}</p>
                    <div className="space-y-4">
                      <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={work.coverImage}
                          alt={work.title}
                          fill
                          priority={works.indexOf(work) === 0}
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      {work.images && work.images.length > 0 && (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {work.images.map((image, index) => (
                            <div
                              key={index}
                              className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted sm:aspect-square"
                            >
                              <Image
                                src={image}
                                alt={`${work.title} - Image ${index + 1}`}
                                fill
                                priority={works.indexOf(work) === 0}
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

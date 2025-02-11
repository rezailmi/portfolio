import Image from 'next/image'
import Link from 'next/link'
import { getAllWorks } from '@/lib/works'

export default function WorksPage() {
  const works = getAllWorks()

  return (
    <div className="min-h-[100vh] flex-1 rounded-xl p-8 md:min-h-min">
      {works.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-xl text-muted-foreground">No works to display yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {works.map((work) => (
            <Link
              key={work.slug}
              href={`/works/${work.slug}`}
              className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
            >
              <Image
                src={work.coverImage}
                alt={work.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute bottom-0 p-4">
                  <h3 className="text-lg font-semibold text-white">{work.title}</h3>
                  <p className="text-sm text-white/80">{work.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

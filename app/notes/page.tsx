import Link from 'next/link'
import { getAllNotes } from '@/lib/content'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

export const metadata = {
  title: 'Notes',
  description: 'My collection of notes, thoughts, and writings.',
}

export default function NotesPage() {
  const posts = getAllNotes()

  if (posts.length === 0) {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-3xl px-4 py-8">
          <h1 className="mb-8 text-2xl font-semibold tracking-tight">Notes</h1>
          <p className="text-xl text-muted-foreground">No notes to show</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl px-4 py-8">
        <h1 className="mb-8 px-6 text-xl font-medium tracking-tight">Notes</h1>
        <div className="grid gap-4">
          {posts.map((post) => (
            <Link key={post.slug} href={`/notes/${post.slug}`}>
              <Card className="border-none shadow-none transition-colors hover:bg-muted">
                <CardHeader className="pb-4">
                  <h2 className="text-base font-medium">{post.title}</h2>
                  <time className="mb-2 block text-sm text-muted-foreground">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="leading-relaxed text-muted-foreground">{post.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

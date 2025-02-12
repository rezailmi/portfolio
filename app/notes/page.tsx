import Link from 'next/link'
import { getAllNotes } from '@/lib/notes'
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
        <h1 className="mb-8 px-6 text-2xl font-semibold tracking-tight">Notes</h1>
        <div className="grid gap-4">
          {posts.map((post) => (
            <Link key={post.slug} href={`/notes/${post.slug}`}>
              <Card className="border-none shadow-none transition-colors hover:bg-muted">
                <CardHeader className="p-6">
                  <time className="mb-2 block text-sm text-muted-foreground">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <h2 className="text-xl font-semibold tracking-tight">{post.title}</h2>
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

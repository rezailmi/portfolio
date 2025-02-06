import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

export const metadata = {
  title: 'Notes',
  description: 'My collection of notes, thoughts, and writings.',
}

export default async function NotesPage() {
  const posts = await getAllPosts()

  if (posts.length === 0) {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-3xl px-4 py-8">
          <h1 className="text-4xl font-bold tracking-tight mb-8">Notes</h1>
          <p className="text-xl text-muted-foreground">No notes to show</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl px-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Notes</h1>
        <div className="grid gap-4">
          {posts.map((post) => (
            <Link key={post.slug} href={`/notes/${post.slug}`}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader className="p-6">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {post.title}
                  </h2>
                  <time className="text-sm text-muted-foreground">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground leading-relaxed">
                    {post.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}


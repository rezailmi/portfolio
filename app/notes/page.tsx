import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'

export const metadata = {
  title: 'Notes',
  description: 'My collection of notes, thoughts, and writings.',
}

export default async function NotesPage() {
  const posts = await getAllPosts()

  if (posts.length === 0) {
    return (
      <div className="container max-w-3xl py-8 mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Notes</h1>
        <p className="text-xl text-muted-foreground">No notes to show</p>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl py-8 mx-auto">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Notes</h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/notes/${post.slug}`} className="space-y-3 block">
              <h2 className="text-2xl font-semibold tracking-tight group-hover:text-primary">
                {post.title}
              </h2>
              <div className="text-sm text-muted-foreground">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {post.description}
              </p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}


import { getAllNotes } from '@/lib/content'
import { ContentList } from '@/components/content-list'

export const metadata = {
  title: 'Notes',
  description: 'My collection of notes, thoughts, and writings.',
}

export default function NotesPage() {
  const posts = getAllNotes()

  return (
    <ContentList
      items={posts}
      title="Notes"
      emptyMessage="No notes to show"
      hrefPrefix="/notes"
    />
  )
}

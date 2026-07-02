import { getAllWorks } from '@/lib/content'
import { ContentList } from '@/components/content-list'

export const metadata = {
  title: 'Works',
  description: 'A collection of my projects and works.',
}

export default function WorksPage() {
  const works = getAllWorks()

  return (
    <ContentList
      items={works}
      title="Works"
      emptyMessage="No works to display yet"
      hrefPrefix="/works"
      showCoverImages
    />
  )
}

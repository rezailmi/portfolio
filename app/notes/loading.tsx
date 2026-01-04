import { Card, CardHeader, CardContent } from '@/components/ui/card'

export default function NotesLoading() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl px-4 py-8">
        <div className="mb-8 h-7 w-20 animate-pulse rounded bg-muted px-6" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-none shadow-none">
              <CardHeader className="pb-4">
                <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
                <div className="mt-2 h-4 w-32 animate-pulse rounded bg-muted" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}


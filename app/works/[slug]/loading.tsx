export default function WorkDetailLoading() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl px-4 py-8">
        <div className="mb-2 h-8 w-3/4 animate-pulse rounded bg-muted" />
        <div className="mb-8 h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="space-y-4">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
          <div className="mt-6 h-64 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  )
}


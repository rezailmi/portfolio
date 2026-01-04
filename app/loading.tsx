export default function RootLoading() {
  return (
    <div className="flex min-h-full flex-1 animate-pulse" aria-busy="true">
      <div className="flex w-full flex-col space-y-4 p-2 sm:p-4">
        <div className="h-8 w-1/3 rounded bg-muted" />
        <div className="h-4 w-1/2 rounded bg-muted" />
        <div className="h-64 rounded bg-muted" />
      </div>
      <span className="sr-only">Loading content...</span>
    </div>
  )
}


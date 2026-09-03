export default function PostCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-paper-dark/80 bg-paper-card" aria-hidden="true">
      <div className="aspect-[16/9] animate-pulse bg-paper-dark" />
      <div className="space-y-4 p-6">
        <div className="h-3 w-2/5 animate-pulse rounded-full bg-paper-dark" />
        <div className="space-y-2">
          <div className="h-6 w-full animate-pulse rounded bg-paper-dark" />
          <div className="h-6 w-4/5 animate-pulse rounded bg-paper-dark" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded-full bg-paper-dark" />
          <div className="h-3 w-11/12 animate-pulse rounded-full bg-paper-dark" />
          <div className="h-3 w-3/4 animate-pulse rounded-full bg-paper-dark" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-6 w-20 animate-pulse rounded-full bg-paper-dark" />
          <div className="h-6 w-24 animate-pulse rounded-full bg-paper-dark" />
        </div>
      </div>
    </div>
  )
}

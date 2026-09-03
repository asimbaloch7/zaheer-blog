export default function ArticleSkeleton() {
  return (
    <div className="page-wrap animate-pulse py-12" aria-label="Loading article">
      <div className="mx-auto max-w-3xl">
        <div className="h-3 w-32 rounded-full bg-paper-dark" />
        <div className="mt-6 h-12 w-full rounded-lg bg-paper-dark sm:h-16" />
        <div className="mt-3 h-12 w-4/5 rounded-lg bg-paper-dark sm:h-16" />
        <div className="mt-8 flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-paper-dark" />
          <div className="space-y-2">
            <div className="h-3 w-28 rounded-full bg-paper-dark" />
            <div className="h-3 w-44 rounded-full bg-paper-dark" />
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 aspect-[16/8] max-w-5xl rounded-2xl bg-paper-dark" />
      <div className="mx-auto mt-12 max-w-[68ch] space-y-4">
        <div className="h-4 w-full rounded-full bg-paper-dark" />
        <div className="h-4 w-11/12 rounded-full bg-paper-dark" />
        <div className="h-4 w-full rounded-full bg-paper-dark" />
        <div className="h-4 w-4/5 rounded-full bg-paper-dark" />
        <div className="mt-10 h-8 w-2/3 rounded bg-paper-dark" />
        <div className="h-4 w-full rounded-full bg-paper-dark" />
        <div className="h-4 w-10/12 rounded-full bg-paper-dark" />
      </div>
    </div>
  )
}

export default function Spinner({ label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center py-16" role="status">
      <span className="sr-only">{label}</span>
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-pine-200 border-t-pine-800" />
    </div>
  )
}

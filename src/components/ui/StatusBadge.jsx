export default function StatusBadge({ status }) {
  const published = status === 'published'
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${
        published
          ? 'bg-pine-100 text-pine-800'
          : 'bg-amber-100 text-amber-900'
      }`}
    >
      {published ? 'Published' : 'Draft'}
    </span>
  )
}

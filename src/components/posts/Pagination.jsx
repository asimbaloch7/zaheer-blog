export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        className="btn-secondary px-3 text-sm"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        Previous
      </button>
      {pages.map((item) => (
        <button
          key={item}
          type="button"
          className={`min-h-10 min-w-10 rounded-lg px-2 py-1.5 text-sm font-semibold transition-colors focus-ring ${
            item === page
              ? 'bg-pine-800 text-paper shadow-sm'
              : 'text-ink-muted hover:bg-pine-50 hover:text-pine-800'
          }`}
          onClick={() => onChange(item)}
          aria-current={item === page ? 'page' : undefined}
        >
          {item}
        </button>
      ))}
      <button
        type="button"
        className="btn-secondary px-3 text-sm"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </nav>
  )
}

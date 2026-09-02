import { author } from '../../config/author'
import { site } from '../../config/site'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-paper-dark bg-paper-card">
      <div className="page-wrap flex flex-col gap-3 py-8 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {author.name}. {site.shortTitle}.
        </p>
        <p className="max-w-md sm:text-right">
          Independent notes on microbes, methods, and the literature — not a journal of record.
        </p>
      </div>
    </footer>
  )
}

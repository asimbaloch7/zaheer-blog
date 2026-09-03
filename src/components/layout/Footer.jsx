import { Link } from 'react-router-dom'
import { author } from '../../config/author'
import { site } from '../../config/site'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-paper-dark bg-paper-card">
      <div className="page-wrap grid gap-10 py-12 sm:grid-cols-[1.4fr_0.6fr] sm:py-14">
        <div>
          <Link to="/" className="font-serif text-xl font-semibold tracking-[-0.02em] text-ink transition-colors hover:text-pine-800 focus-ring">
            {site.shortTitle}
          </Link>
          <p className="mt-3 max-w-lg text-sm leading-6 text-ink-muted">{site.tagline}</p>
        </div>
        <nav className="grid grid-cols-2 gap-3 text-sm sm:justify-self-end sm:text-right" aria-label="Footer navigation">
          <Link to="/" className="font-semibold text-ink-muted transition-colors hover:text-pine-800">Articles</Link>
          <Link to="/about" className="font-semibold text-ink-muted transition-colors hover:text-pine-800">About</Link>
          <a href={`mailto:${author.email}`} className="font-semibold text-ink-muted transition-colors hover:text-pine-800">Contact</a>
          <Link to="/admin/login" className="font-semibold text-ink-muted transition-colors hover:text-pine-800">Editor</Link>
        </nav>
      </div>
      <div className="border-t border-paper-dark/80">
        <div className="page-wrap flex flex-col gap-2 py-5 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {author.name}. All rights reserved.</p>
          <p>Thoughtful notes, carefully published.</p>
        </div>
      </div>
    </footer>
  )
}

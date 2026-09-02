import { Link } from 'react-router-dom'
import SEO from '../components/seo/SEO'

export default function NotFound() {
  return (
    <div className="page-wrap py-24 text-center">
      <SEO title="Page not found" noIndex />
      <p className="text-xs uppercase tracking-[0.22em] text-pine-700">404</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">Page not found</h1>
      <p className="mx-auto mt-4 max-w-md text-ink-muted">
        This address does not match a published note or page.
      </p>
      <Link to="/" className="btn-primary mt-8 inline-flex">
        Return to notes
      </Link>
    </div>
  )
}

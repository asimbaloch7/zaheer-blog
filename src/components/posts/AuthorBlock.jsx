import { Link } from 'react-router-dom'
import { author } from '../../config/author'
import { formatDate } from '../../utils/dates'
import { readingTimeLabel } from '../../utils/readingTime'

export default function AuthorBlock({ post, expanded = false }) {
  const published = formatDate(post.publishedAt || post.createdAt)
  const updated = formatDate(post.updatedAt)
  const wasUpdated =
    post.updatedAt &&
    post.publishedAt &&
    Math.abs(Date.parse(post.updatedAt) - Date.parse(post.publishedAt)) > 86400000

  return (
    <div
      className={
        expanded
          ? 'flex gap-4 rounded-2xl border border-paper-dark bg-paper-card p-5 sm:p-6'
          : 'flex items-center gap-3'
      }
    >
      <Link to="/about" className="shrink-0 rounded-full focus-ring">
        <img
          src={author.photo}
          alt={author.name}
          className={`${expanded ? 'h-14 w-14' : 'h-11 w-11'} rounded-full border border-paper-dark bg-pine-50 object-cover`}
        />
      </Link>
      <div className="min-w-0">
        <Link to="/about" className="font-semibold text-ink transition-colors hover:text-pine-800">
          {author.name}
        </Link>
        {expanded ? (
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-muted">
            {author.bio[0]}
          </p>
        ) : (
          <p className="mt-0.5 text-sm text-ink-muted">
            Published {published}
            {wasUpdated ? ` · Updated ${updated}` : ''}
            <span className="mx-1.5 text-ink-faint">·</span>
            {readingTimeLabel(post.readingTimeMinutes)}
          </p>
        )}
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/dates'
import { readingTimeLabel } from '../../utils/readingTime'
import { author } from '../../config/author'
import TagBadge from './TagBadge'

export default function PostCard({ post }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-paper-dark/90 bg-paper-card shadow-[0_1px_2px_rgba(28,25,23,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-pine-200 hover:shadow-[0_16px_40px_rgba(28,25,23,0.09)]">
      <Link
        to={`/post/${post.slug}`}
        className="block aspect-[16/9] overflow-hidden bg-pine-50 focus-ring"
        aria-label={`Read ${post.title}`}
      >
        {post.coverImageUrl ? (
          <img
            src={post.coverImageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#dceeea,transparent_45%),linear-gradient(135deg,#f0f7f6,#ebe6db)] transition-transform duration-500 group-hover:scale-[1.035]">
            <span className="font-serif text-sm italic text-pine-700">From the notebook</span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.13em] text-ink-faint">
          {formatDate(post.publishedAt)}
          <span className="mx-1.5">·</span>
          {readingTimeLabel(post.readingTimeMinutes)}
        </p>
        <h2 className="mt-3 font-serif text-[1.35rem] font-semibold leading-snug tracking-[-0.015em] text-ink">
          <Link to={`/post/${post.slug}`} className="rounded-sm transition-colors group-hover:text-pine-800 focus-ring">
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 line-clamp-3 flex-1 text-[0.9375rem] leading-6 text-ink-muted">
          {post.excerpt}
        </p>
        {post.tags?.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} tag={tag} to={`/?tag=${encodeURIComponent(tag)}`} />
            ))}
          </div>
        )}
        <div className="mt-5 flex items-center justify-between border-t border-paper-dark/80 pt-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <img
              src={author.photo}
              alt=""
              className="h-7 w-7 rounded-full border border-paper-dark bg-pine-50 object-cover"
            />
            <span className="truncate text-xs font-semibold text-ink-muted">{author.name}</span>
          </div>
          <span className="translate-x-0 text-sm text-pine-800 transition-transform duration-200 group-hover:translate-x-1">
            Read →
          </span>
        </div>
      </div>
    </article>
  )
}

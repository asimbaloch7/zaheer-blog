import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/dates'
import { readingTimeLabel } from '../../utils/readingTime'
import TagBadge from './TagBadge'

export default function PostCard({ post }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-paper-dark bg-paper-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link to={`/post/${post.slug}`} className="block aspect-[16/9] bg-pine-50">
        {post.coverImageUrl ? (
          <img
            src={post.coverImageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#dceeea,transparent_45%),linear-gradient(135deg,#f0f7f6,#ebe6db)]">
            <span className="font-serif text-sm italic text-pine-700">Untitled plate</span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs uppercase tracking-[0.14em] text-ink-faint">
          {formatDate(post.publishedAt)}
          <span className="mx-2">·</span>
          {readingTimeLabel(post.readingTimeMinutes)}
        </p>
        <h2 className="mt-2 font-serif text-xl leading-snug text-ink">
          <Link to={`/post/${post.slug}`} className="hover:text-pine-800">
            {post.title}
          </Link>
        </h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{post.excerpt}</p>
        {post.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} to={`/?tag=${encodeURIComponent(tag)}`} />
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

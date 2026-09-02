import { Link, useParams } from 'react-router-dom'
import SEO from '../components/seo/SEO'
import PostContent from '../components/posts/PostContent'
import References from '../components/posts/References'
import RelatedPosts from '../components/posts/RelatedPosts'
import TagBadge from '../components/posts/TagBadge'
import Spinner from '../components/ui/Spinner'
import { usePost } from '../hooks/usePost'
import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../hooks/useAuth'
import { getRelatedPosts } from '../firebase/posts'
import { formatDate } from '../utils/dates'
import { readingTimeLabel } from '../utils/readingTime'
import { excerptFromHtml } from '../utils/html'

export default function Post() {
  const { slug } = useParams()
  const { isAdmin, loading: authLoading } = useAuth()
  const { post, loading, error } = usePost({
    slug,
    includeDrafts: isAdmin,
    ready: !authLoading,
  })
  const { posts } = usePosts()

  if (loading) return <Spinner label="Loading post" />

  if (error || !post) {
    return (
      <div className="page-wrap py-20 text-center">
        <SEO title="Post not found" noIndex />
        <h1 className="font-serif text-3xl text-ink">This note was not found</h1>
        <p className="mt-3 text-ink-muted">It may be a draft, or the slug may have changed.</p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          Back to notes
        </Link>
      </div>
    )
  }

  if (post.status !== 'published' && !isAdmin) {
    return (
      <div className="page-wrap py-20 text-center">
        <SEO title="Unavailable" noIndex />
        <h1 className="font-serif text-3xl text-ink">This note is not public</h1>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          Back to notes
        </Link>
      </div>
    )
  }

  const related = getRelatedPosts(post, posts)
  const description = post.excerpt || excerptFromHtml(post.content)

  return (
    <article className="page-wrap py-10 md:py-14">
      <SEO
        title={post.title}
        description={description}
        path={`/post/${post.slug}`}
        image={post.coverImageUrl}
        type="article"
      />

      <header className="mx-auto max-w-[72ch]">
        {post.status === 'draft' && (
          <p className="mb-4 text-sm font-medium text-amber-800">Draft preview — not visible to readers.</p>
        )}
        <p className="text-xs uppercase tracking-[0.18em] text-ink-faint">
          {formatDate(post.publishedAt || post.updatedAt)}
          <span className="mx-2">·</span>
          {readingTimeLabel(post.readingTimeMinutes)}
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-ink md:text-[2.6rem]">
          {post.title}
        </h1>
        {post.tags?.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} to={`/?tag=${encodeURIComponent(tag)}`} />
            ))}
          </div>
        )}
        {isAdmin && (
          <Link to={`/admin/edit/${post.id}`} className="mt-4 inline-block text-sm text-pine-800">
            Edit this post
          </Link>
        )}
      </header>

      {post.coverImageUrl && (
        <figure className="mx-auto mt-8 max-w-4xl">
          <img
            src={post.coverImageUrl}
            alt=""
            className="w-full rounded-lg object-cover"
            loading="eager"
          />
        </figure>
      )}

      <div className="mx-auto mt-10 max-w-[72ch]">
        <PostContent html={post.content} />
        <References references={post.references} />
      </div>

      <RelatedPosts posts={related} />
    </article>
  )
}

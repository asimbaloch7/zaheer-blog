import { useMemo, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import SEO from '../components/seo/SEO'
import ArticleSkeleton from '../components/posts/ArticleSkeleton'
import AuthorBlock from '../components/posts/AuthorBlock'
import PostContent from '../components/posts/PostContent'
import ReadingProgress from '../components/posts/ReadingProgress'
import References from '../components/posts/References'
import RelatedPosts from '../components/posts/RelatedPosts'
import ShareButtons from '../components/posts/ShareButtons'
import TableOfContents from '../components/posts/TableOfContents'
import TagBadge from '../components/posts/TagBadge'
import BackToTop from '../components/ui/BackToTop'
import { usePost } from '../hooks/usePost'
import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../hooks/useAuth'
import { getRelatedPosts } from '../firebase/posts'
import { excerptFromHtml } from '../utils/html'
import { prepareArticle } from '../utils/article'

export default function Post() {
  const { slug } = useParams()
  const articleRef = useRef(null)
  const { isAdmin, loading: authLoading } = useAuth()
  const { post, loading, error } = usePost({
    slug,
    includeDrafts: isAdmin,
    ready: !authLoading,
  })
  const { posts } = usePosts()
  const prepared = useMemo(() => prepareArticle(post?.content), [post?.content])

  if (loading || authLoading) return <ArticleSkeleton />

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
    <article ref={articleRef} className="pb-16 pt-10 md:pb-24 md:pt-16">
      <ReadingProgress targetRef={articleRef} />
      <SEO
        title={post.title}
        description={description}
        path={`/post/${post.slug}`}
        image={post.coverImageUrl}
        type="article"
      />

      <header className="page-wrap mx-auto max-w-4xl">
        {post.status === 'draft' && (
          <p className="mb-5 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
            Draft preview — not visible to readers
          </p>
        )}
        {post.tags?.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} to={`/?tag=${encodeURIComponent(tag)}`} />
            ))}
          </div>
        )}
        <h1 className="text-balance font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.025em] text-ink sm:text-5xl md:text-[3.5rem]">
          {post.title}
        </h1>
        {description && (
          <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-ink-muted sm:text-xl">
            {description}
          </p>
        )}
        <div className="mt-8 flex flex-col gap-5 border-t border-paper-dark pt-6 sm:flex-row sm:items-center sm:justify-between">
          <AuthorBlock post={post} />
          <div className="lg:hidden">
            <ShareButtons title={post.title} />
          </div>
        </div>
        {isAdmin && (
          <Link to={`/admin/edit/${post.id}`} className="mt-5 inline-block text-sm font-semibold text-pine-800 focus-ring">
            Edit this post
          </Link>
        )}
      </header>

      {post.coverImageUrl && (
        <figure className="page-wrap mx-auto mt-10 max-w-6xl md:mt-12">
          <img
            src={post.coverImageUrl}
            alt=""
            className="max-h-[38rem] w-full rounded-2xl border border-paper-dark/70 object-cover shadow-sm"
            loading="eager"
          />
        </figure>
      )}

      <div className="page-wrap mx-auto mt-12 grid max-w-7xl gap-8 lg:grid-cols-[7rem_minmax(0,68ch)_13rem] lg:justify-center lg:gap-10">
        <aside className="hidden lg:block lg:pt-1">
          <div className="sticky top-28 hidden lg:flex lg:flex-col lg:items-center">
            <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ink-faint">
              Share
            </p>
            <ShareButtons title={post.title} vertical />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="lg:hidden">
            <TableOfContents headings={prepared.headings} />
          </div>
          <PostContent html={prepared.html} />
          <References references={post.references} />
          <div className="mt-12">
            <AuthorBlock post={post} expanded />
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <TableOfContents headings={prepared.headings} />
          </div>
        </aside>
      </div>

      <div className="page-wrap">
        <RelatedPosts posts={related} />
      </div>
      <BackToTop />
    </article>
  )
}

import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SEO from '../components/seo/SEO'
import PostCard from '../components/posts/PostCard'
import PostCardSkeleton from '../components/posts/PostCardSkeleton'
import Pagination from '../components/posts/Pagination'
import TagBadge from '../components/posts/TagBadge'
import { usePosts } from '../hooks/usePosts'
import { site } from '../config/site'
import { SUGGESTED_TAGS, POSTS_PER_PAGE } from '../utils/constants'

export default function Home() {
  const { posts, loading, error } = usePosts()
  const [searchParams, setSearchParams] = useSearchParams()
  const [queryInput, setQueryInput] = useState(searchParams.get('q') || '')
  const selectedTag = searchParams.get('tag') || ''
  const query = searchParams.get('q') || ''
  const page = Math.max(1, Number(searchParams.get('page') || 1))

  const availableTags = useMemo(() => {
    const fromPosts = posts.flatMap((post) => post.tags)
    return Array.from(new Set([...SUGGESTED_TAGS, ...fromPosts]))
  }, [posts])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return posts.filter((post) => {
      const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true
      const haystack = `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase()
      const matchesQuery = needle ? haystack.includes(needle) : true
      return matchesTag && matchesQuery
    })
  }, [posts, query, selectedTag])

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  )

  const updateParams = (next) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    setSearchParams(params)
  }

  const onSearch = (event) => {
    event.preventDefault()
    updateParams({ q: queryInput.trim(), page: '' })
  }

  return (
    <div className="pb-16 md:pb-24">
      <SEO description={site.description} path="/" />

      <section className="border-b border-paper-dark/80">
        <div className="page-wrap py-14 text-center sm:py-20 md:py-24">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-pine-700">
            A microbiology notebook
          </p>
          <h1 className="mx-auto mt-4 max-w-4xl text-balance font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-5xl md:text-6xl">
            {site.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-ink-muted">
            {site.tagline}
          </p>
        </div>
      </section>

      <div className="page-wrap pt-10 sm:pt-14">
        <div className="flex flex-col gap-6 border-b border-paper-dark pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-pine-700">
              Latest writing
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.02em] text-ink">
              Notes from the field
            </h2>
          </div>

          <form className="flex w-full max-w-md gap-2" onSubmit={onSearch}>
            <label className="sr-only" htmlFor="search">Search posts</label>
            <input
              id="search"
              className="input"
              value={queryInput}
              onChange={(event) => setQueryInput(event.target.value)}
              placeholder="Search articles"
            />
            <button type="submit" className="btn-primary shrink-0">Search</button>
          </form>
        </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <TagBadge
          tag="All fields"
          active={!selectedTag}
          onClick={() => updateParams({ tag: '', page: '' })}
        />
        {availableTags.map((tag) => (
          <TagBadge
            key={tag}
            tag={tag}
            active={selectedTag === tag}
            onClick={() =>
              updateParams({ tag: selectedTag === tag ? '' : tag, page: '' })
            }
          />
        ))}
      </div>

      {loading && (
        <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <PostCardSkeleton key={index} />
          ))}
        </div>
      )}
      {error && (
        <p className="mt-10 text-center text-sm text-red-800">{error}</p>
      )}

      {!loading && !error && pageItems.length === 0 && (
        <p className="mt-16 text-center text-ink-muted">
          No published notes match this filter yet.
        </p>
      )}

      <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onChange={(nextPage) => updateParams({ page: String(nextPage) })}
      />
      </div>
    </div>
  )
}

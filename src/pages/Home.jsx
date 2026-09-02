import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SEO from '../components/seo/SEO'
import PostCard from '../components/posts/PostCard'
import Pagination from '../components/posts/Pagination'
import TagBadge from '../components/posts/TagBadge'
import Spinner from '../components/ui/Spinner'
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
    <div className="page-wrap py-10 md:py-14">
      <SEO description={site.description} path="/" />

      <section className="mx-auto max-w-3xl text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-pine-700">A microbiology notebook</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-ink md:text-5xl">{site.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
          {site.tagline}
        </p>
      </section>

      <form className="mx-auto mt-10 flex max-w-xl gap-2" onSubmit={onSearch}>
        <label className="sr-only" htmlFor="search">
          Search posts
        </label>
        <input
          id="search"
          className="input"
          value={queryInput}
          onChange={(event) => setQueryInput(event.target.value)}
          placeholder="Search titles, excerpts, and tags"
        />
        <button type="submit" className="btn-primary shrink-0">
          Search
        </button>
      </form>

      <div className="mt-6 flex flex-wrap justify-center gap-1.5">
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

      {loading && <Spinner label="Loading posts" />}
      {error && (
        <p className="mt-10 text-center text-sm text-red-800">{error}</p>
      )}

      {!loading && !error && pageItems.length === 0 && (
        <p className="mt-16 text-center text-ink-muted">
          No published notes match this filter yet.
        </p>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
  )
}

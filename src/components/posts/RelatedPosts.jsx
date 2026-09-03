import PostCard from './PostCard'

export default function RelatedPosts({ posts }) {
  if (!posts?.length) return null

  return (
    <section className="mt-20 border-t border-paper-dark pt-12 md:mt-24 md:pt-14">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-pine-700">
        Continue reading
      </p>
      <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.02em] text-ink">
        Related articles
      </h2>
      <p className="mt-2 text-sm leading-6 text-ink-muted">
        More writing connected by topic and field.
      </p>
      <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}

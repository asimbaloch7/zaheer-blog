import PostCard from './PostCard'

export default function RelatedPosts({ posts }) {
  if (!posts?.length) return null

  return (
    <section className="mt-16 border-t border-paper-dark pt-10">
      <h2 className="font-serif text-2xl text-ink">Related notes</h2>
      <p className="mt-1 text-sm text-ink-muted">Other posts that share a subfield or method.</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}

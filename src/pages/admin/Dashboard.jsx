import { useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../../components/seo/SEO'
import Spinner from '../../components/ui/Spinner'
import StatusBadge from '../../components/ui/StatusBadge'
import ConfirmModal from '../../components/ui/ConfirmModal'
import { usePosts } from '../../hooks/usePosts'
import { deletePost } from '../../firebase/posts'
import { formatDate } from '../../utils/dates'

export default function Dashboard() {
  const { posts, loading, error, setPosts } = usePosts({ includeDrafts: true })
  const [pending, setPending] = useState(null)
  const [busy, setBusy] = useState(false)

  const onDelete = async () => {
    if (!pending) return
    setBusy(true)
    try {
      await deletePost(pending.id)
      setPosts((current) => current.filter((post) => post.id !== pending.id))
      setPending(null)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page-wrap py-10">
      <SEO title="Dashboard" path="/admin" noIndex />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-pine-700">Editor</p>
          <h1 className="mt-1 font-serif text-3xl text-ink">All notes</h1>
          <p className="mt-1 text-sm text-ink-muted">Drafts and published posts. Readers only see published work.</p>
        </div>
        <Link to="/admin/new" className="btn-primary">
          New post
        </Link>
      </div>

      {loading && <Spinner label="Loading posts" />}
      {error && <p className="mt-8 text-sm text-red-800">{error}</p>}

      {!loading && posts.length === 0 && (
        <p className="mt-12 text-ink-muted">No posts yet. Write the first note from the bench.</p>
      )}

      {posts.length > 0 && (
        <div className="mt-8 overflow-x-auto rounded-lg border border-paper-dark bg-paper-card">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-paper-dark bg-paper text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Updated</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-paper-dark last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{post.title || 'Untitled'}</p>
                    <p className="text-xs text-ink-faint">/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={post.status} />
                  </td>
                  <td className="hidden px-4 py-3 text-ink-muted md:table-cell">
                    {formatDate(post.updatedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link to={`/admin/edit/${post.id}`} className="text-pine-800 hover:underline">
                        Edit
                      </Link>
                      {post.status === 'published' && (
                        <Link to={`/post/${post.slug}`} className="text-ink-muted hover:underline">
                          View
                        </Link>
                      )}
                      <button
                        type="button"
                        className="text-red-800 hover:underline"
                        onClick={() => setPending(post)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={Boolean(pending)}
        title="Delete this post?"
        message={`“${pending?.title || 'Untitled'}” will be permanently removed. This cannot be undone.`}
        onCancel={() => setPending(null)}
        onConfirm={onDelete}
        busy={busy}
      />
    </div>
  )
}

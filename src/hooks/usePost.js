import { useEffect, useState } from 'react'
import { getPostById, getPostBySlug } from '../firebase/posts'
import { isFirebaseConfigured } from '../firebase/config'

export function usePost({ id, slug, includeDrafts = false, ready = true } = {}) {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(Boolean(id || slug))
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!ready) return
      if (!id && !slug) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      if (!isFirebaseConfigured) {
        setError('Firebase is not configured yet.')
        setLoading(false)
        return
      }

      try {
        const data = id
          ? await getPostById(id)
          : await getPostBySlug(slug, { includeDrafts })
        if (!cancelled) {
          setPost(data)
          if (!data) setError('Post not found.')
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load this post.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id, slug, includeDrafts, ready])

  return { post, loading, error }
}

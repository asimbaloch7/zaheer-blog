import { useEffect, useState } from 'react'
import { getAllPosts, getPublishedPosts } from '../firebase/posts'
import { isFirebaseConfigured } from '../firebase/config'

export function usePosts({ includeDrafts = false } = {}) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!isFirebaseConfigured) {
        setError('Firebase is not configured yet.')
        setLoading(false)
        return
      }

      try {
        const data = includeDrafts
          ? await getAllPosts()
          : await getPublishedPosts()
        if (!cancelled) setPosts(data)
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Unable to load posts.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [includeDrafts])

  return { posts, loading, error, setPosts }
}

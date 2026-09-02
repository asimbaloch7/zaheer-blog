import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from './config'
import { toIso } from '../utils/dates'

const POSTS = 'posts'

function requireDb() {
  if (!db) {
    throw new Error(
      'Firebase is not configured. Add your VITE_FIREBASE_* values to .env.',
    )
  }
  return db
}

export function serializePost(snapshot) {
  const data = snapshot.data() || {}
  return {
    id: snapshot.id,
    title: data.title || '',
    slug: data.slug || '',
    content: data.content || '',
    excerpt: data.excerpt || '',
    coverImageUrl: data.coverImageUrl || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    status: data.status === 'published' ? 'published' : 'draft',
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
    publishedAt: toIso(data.publishedAt),
    readingTimeMinutes: data.readingTimeMinutes || 1,
    references: Array.isArray(data.references) ? data.references : [],
  }
}

function sortByPublished(a, b) {
  const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0
  const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0
  return bTime - aTime
}

function sortByUpdated(a, b) {
  const aTime = a.updatedAt ? Date.parse(a.updatedAt) : 0
  const bTime = b.updatedAt ? Date.parse(b.updatedAt) : 0
  return bTime - aTime
}

export async function getPublishedPosts() {
  const firestore = requireDb()
  const snapshot = await getDocs(
    query(collection(firestore, POSTS), where('status', '==', 'published')),
  )
  return snapshot.docs.map(serializePost).sort(sortByPublished)
}

export async function getAllPosts() {
  const firestore = requireDb()
  const snapshot = await getDocs(collection(firestore, POSTS))
  return snapshot.docs.map(serializePost).sort(sortByUpdated)
}

export async function getPostBySlug(slug, { includeDrafts = false } = {}) {
  const firestore = requireDb()
  const constraints = [where('slug', '==', slug)]
  if (!includeDrafts) {
    constraints.push(where('status', '==', 'published'))
  }
  const snapshot = await getDocs(query(collection(firestore, POSTS), ...constraints))
  if (snapshot.empty) return null
  return serializePost(snapshot.docs[0])
}

export async function getPostById(id) {
  const firestore = requireDb()
  const snapshot = await getDoc(doc(firestore, POSTS, id))
  if (!snapshot.exists()) return null
  return serializePost(snapshot)
}

export async function isSlugTaken(slug, excludeId) {
  const firestore = requireDb()
  const snapshot = await getDocs(
    query(collection(firestore, POSTS), where('slug', '==', slug)),
  )
  return snapshot.docs.some((item) => item.id !== excludeId)
}

export async function createPost(payload) {
  const firestore = requireDb()
  const now = serverTimestamp()
  const ref = await addDoc(collection(firestore, POSTS), {
    ...payload,
    createdAt: now,
    updatedAt: now,
    publishedAt: payload.status === 'published' ? now : null,
  })
  return ref.id
}

export async function updatePost(id, payload, { publishNow = false, unpublish = false } = {}) {
  const firestore = requireDb()
  const next = {
    ...payload,
    updatedAt: serverTimestamp(),
  }

  if (publishNow) {
    next.publishedAt = serverTimestamp()
  }
  if (unpublish) {
    next.publishedAt = null
  }

  await updateDoc(doc(firestore, POSTS, id), next)
}

export async function deletePost(id) {
  const firestore = requireDb()
  await deleteDoc(doc(firestore, POSTS, id))
}

export function getRelatedPosts(post, catalog, limit = 3) {
  if (!post?.tags?.length) return []
  const tagSet = new Set(post.tags)
  return catalog
    .filter((item) => item.id !== post.id && item.status === 'published')
    .map((item) => ({
      post: item,
      overlap: item.tags.filter((tag) => tagSet.has(tag)).length,
    }))
    .filter((item) => item.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map((item) => item.post)
}

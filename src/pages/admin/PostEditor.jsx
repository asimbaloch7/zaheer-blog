import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import SEO from '../../components/seo/SEO'
import TiptapEditor from '../../components/editor/TiptapEditor'
import TagSelector from '../../components/editor/TagSelector'
import ConfirmModal from '../../components/ui/ConfirmModal'
import Spinner from '../../components/ui/Spinner'
import { usePost } from '../../hooks/usePost'
import {
  createPost,
  deletePost,
  isSlugTaken,
  updatePost,
} from '../../firebase/posts'
import { isCloudinaryConfigured, uploadImage, validateImageFile } from '../../cloudinary/upload'
import { slugify } from '../../utils/slug'
import { computeReadingTime } from '../../utils/readingTime'
import { excerptFromHtml } from '../../utils/html'

const emptyForm = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  coverImageUrl: '',
  tags: [],
  references: [{ text: '', url: '' }],
}

export default function PostEditor() {
  const { id } = useParams()
  const isNew = !id
  const navigate = useNavigate()
  const { post, loading, error } = usePost({ id })
  const [form, setForm] = useState(emptyForm)
  const [slugTouched, setSlugTouched] = useState(false)
  const [slugLocked, setSlugLocked] = useState(false)
  const [saving, setSaving] = useState('')
  const [notice, setNotice] = useState('')
  const [formError, setFormError] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [loadedId, setLoadedId] = useState(null)
  const [hadPublishedAt, setHadPublishedAt] = useState(false)

  if (post && loadedId !== post.id) {
    setLoadedId(post.id)
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      coverImageUrl: post.coverImageUrl,
      tags: post.tags,
      references: post.references.length ? post.references : [{ text: '', url: '' }],
    })
    setSlugTouched(true)
    setSlugLocked(Boolean(post.publishedAt || post.status === 'published'))
    setHadPublishedAt(Boolean(post.publishedAt))
  }

  const hydrated = isNew || loadedId === id

  const pageTitle = isNew ? 'New post' : 'Edit post'

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const onTitleChange = (value) => {
    setForm((current) => ({
      ...current,
      title: value,
      slug: slugLocked || slugTouched ? current.slug : slugify(value),
    }))
  }

  const onSlugChange = (value) => {
    setSlugTouched(true)
    updateField('slug', slugify(value))
  }

  const onCoverChange = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const invalid = validateImageFile(file)
    if (invalid) {
      setFormError(invalid)
      return
    }
    try {
      const url = await uploadImage(file, 'covers')
      updateField('coverImageUrl', url)
    } catch (err) {
      setFormError(err.message)
    }
  }

  const onUploadInlineImage = async (file) => {
    const invalid = validateImageFile(file)
    if (invalid) {
      setFormError(invalid)
      return null
    }
    return uploadImage(file, 'inline')
  }

  const updateReference = (index, key, value) => {
    setForm((current) => ({
      ...current,
      references: current.references.map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      ),
    }))
  }

  const payloadFromForm = (status) => {
    const slug = slugify(form.slug || form.title)
    const excerpt = form.excerpt.trim() || excerptFromHtml(form.content)
    return {
      title: form.title.trim(),
      slug,
      content: form.content,
      excerpt,
      coverImageUrl: form.coverImageUrl,
      tags: form.tags,
      status,
      readingTimeMinutes: computeReadingTime(form.content),
      references: form.references
        .map((item) => ({ text: item.text.trim(), url: item.url.trim() }))
        .filter((item) => item.text),
    }
  }

  const save = async (status) => {
    setFormError('')
    setNotice('')
    const payload = payloadFromForm(status)

    if (!payload.title) {
      setFormError('A title is required.')
      return
    }
    if (!payload.slug) {
      setFormError('A URL slug is required.')
      return
    }

    const taken = await isSlugTaken(payload.slug, id)
    if (taken) {
      setFormError('That slug is already in use. Choose another.')
      return
    }

    setSaving(status)
    try {
      if (isNew) {
        const createdId = await createPost(payload)
        setNotice(status === 'published' ? 'Published.' : 'Draft saved.')
        if (status === 'published') {
          setSlugLocked(true)
          setHadPublishedAt(true)
        }
        navigate(`/admin/edit/${createdId}`, { replace: true })
      } else {
        const publishNow = status === 'published' && !hadPublishedAt
        await updatePost(id, payload, { publishNow })
        if (status === 'published') {
          setSlugLocked(true)
          setHadPublishedAt(true)
        }
        setNotice(status === 'published' ? 'Published.' : 'Draft saved.')
      }
    } catch (err) {
      setFormError(err.message || 'Unable to save.')
    } finally {
      setSaving('')
    }
  }

  const onDelete = async () => {
    if (!id) return
    setDeleting(true)
    try {
      await deletePost(id)
      navigate('/admin')
    } catch (err) {
      setFormError(err.message)
      setDeleting(false)
    }
  }

  if (!isNew && loading) return <Spinner label="Loading editor" />
  if (!isNew && error) {
    return (
      <div className="page-wrap py-16">
        <p className="text-red-800">{error}</p>
        <Link to="/admin" className="btn-secondary mt-4 inline-flex">
          Back to dashboard
        </Link>
      </div>
    )
  }
  if (!isNew && !hydrated) return <Spinner label="Loading editor" />

  return (
    <div className="page-wrap py-10">
      <SEO title={pageTitle} noIndex />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link to="/admin" className="text-sm text-pine-800 hover:underline">
            ← Dashboard
          </Link>
          <h1 className="mt-2 font-serif text-3xl text-ink">{pageTitle}</h1>
        </div>
        {!isNew && (
          <button type="button" className="btn-danger" onClick={() => setDeleteOpen(true)}>
            Delete
          </button>
        )}
      </div>

      {!isCloudinaryConfigured && (
        <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Cloudinary environment variables are missing. Cover and in-post images will not upload until
          you add <code>VITE_CLOUDINARY_CLOUD_NAME</code> and <code>VITE_CLOUDINARY_UPLOAD_PRESET</code>.
        </p>
      )}
      {formError && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">{formError}</p>
      )}
      {notice && (
        <p className="mt-4 rounded-md bg-pine-50 px-3 py-2 text-sm text-pine-800">{notice}</p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-5">
          <div>
            <label className="label" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              className="input mt-1"
              value={form.title}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="e.g. Biofilm formation in Pseudomonas aeruginosa"
            />
          </div>

          <div>
            <label className="label" htmlFor="slug">
              Slug
            </label>
            <input
              id="slug"
              className="input mt-1"
              value={form.slug}
              onChange={(event) => onSlugChange(event.target.value)}
              disabled={slugLocked}
            />
            <p className="mt-1 text-xs text-ink-faint">
              {slugLocked
                ? 'Locked after first publish so existing links keep working.'
                : 'Generated from the title; you can edit it until the first publish.'}
            </p>
          </div>

          <div>
            <label className="label">Content</label>
            <div className="mt-1">
              <TiptapEditor
                key={id || 'new'}
                content={form.content}
                onChange={(html) => updateField('content', html)}
                onUploadImage={onUploadInlineImage}
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="excerpt">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              className="input mt-1 min-h-[5rem]"
              maxLength={280}
              value={form.excerpt}
              onChange={(event) => updateField('excerpt', event.target.value)}
              placeholder="Short summary for the listing page (~150–200 characters)."
            />
          </div>
        </div>

        <aside className="space-y-6">
          <div>
            <p className="label">Cover image</p>
            {form.coverImageUrl && (
              <img
                src={form.coverImageUrl}
                alt=""
                className="mt-2 w-full rounded-md object-cover"
              />
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="mt-2 block w-full text-sm"
              onChange={onCoverChange}
            />
            {form.coverImageUrl && (
              <button
                type="button"
                className="mt-2 text-sm text-ink-muted hover:underline"
                onClick={() => updateField('coverImageUrl', '')}
              >
                Remove cover
              </button>
            )}
          </div>

          <div>
            <p className="label">Tags</p>
            <div className="mt-2">
              <TagSelector value={form.tags} onChange={(tags) => updateField('tags', tags)} />
            </div>
          </div>

          <div>
            <p className="label">References</p>
            <p className="mt-1 text-xs text-ink-faint">
              Citation text plus a DOI, PubMed, or journal URL.
            </p>
            <div className="mt-3 space-y-3">
              {form.references.map((item, index) => (
                <div key={index} className="rounded-md border border-paper-dark p-3">
                  <textarea
                    className="input min-h-[4rem] text-sm"
                    placeholder="Author. Title. Journal. Year. DOI."
                    value={item.text}
                    onChange={(event) => updateReference(index, 'text', event.target.value)}
                  />
                  <input
                    className="input mt-2 text-sm"
                    placeholder="https://doi.org/…"
                    value={item.url}
                    onChange={(event) => updateReference(index, 'url', event.target.value)}
                  />
                  {form.references.length > 1 && (
                    <button
                      type="button"
                      className="mt-2 text-xs text-ink-muted hover:underline"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          references: current.references.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn-secondary mt-3 w-full text-sm"
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  references: [...current.references, { text: '', url: '' }],
                }))
              }
            >
              Add reference
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="btn-secondary"
              disabled={Boolean(saving)}
              onClick={() => save('draft')}
            >
              {saving === 'draft' ? 'Saving…' : 'Save as draft'}
            </button>
            <button
              type="button"
              className="btn-primary"
              disabled={Boolean(saving)}
              onClick={() => save('published')}
            >
              {saving === 'published' ? 'Publishing…' : 'Publish'}
            </button>
          </div>
        </aside>
      </div>

      <ConfirmModal
        open={deleteOpen}
        title="Delete this post?"
        message="This permanently removes the post. This cannot be undone."
        onCancel={() => setDeleteOpen(false)}
        onConfirm={onDelete}
        busy={deleting}
      />
    </div>
  )
}

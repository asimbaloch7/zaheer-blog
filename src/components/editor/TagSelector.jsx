import { useMemo, useState } from 'react'
import { SUGGESTED_TAGS } from '../../utils/constants'
import TagBadge from '../posts/TagBadge'

export default function TagSelector({ value, onChange }) {
  const [draft, setDraft] = useState('')
  const selected = value || []

  const options = useMemo(() => {
    const extra = (value || []).filter((tag) => !SUGGESTED_TAGS.includes(tag))
    return [...SUGGESTED_TAGS, ...extra]
  }, [value])

  const toggle = (tag) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((item) => item !== tag))
    } else {
      onChange([...selected, tag])
    }
  }

  const addCustom = (event) => {
    event.preventDefault()
    const tag = draft.trim()
    if (!tag) return
    if (!selected.includes(tag)) onChange([...selected, tag])
    setDraft('')
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((tag) => (
          <TagBadge
            key={tag}
            tag={tag}
            active={selected.includes(tag)}
            onClick={toggle}
          />
        ))}
      </div>
      <form className="mt-3 flex gap-2" onSubmit={addCustom}>
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Add a custom tag"
          className="input"
        />
        <button type="submit" className="btn-secondary shrink-0">
          Add tag
        </button>
      </form>
    </div>
  )
}

import { slugify } from './slug'

export function prepareArticle(html) {
  if (!html || typeof DOMParser === 'undefined') {
    return { html: html || '', headings: [] }
  }

  const document = new DOMParser().parseFromString(html, 'text/html')
  const usedIds = new Set()
  const headings = Array.from(document.querySelectorAll('h2, h3')).map(
    (heading, index) => {
      const level = Number(heading.tagName.slice(1))
      const text = heading.textContent.trim()
      const baseId = slugify(text) || `section-${index + 1}`
      let id = baseId
      let suffix = 2

      while (usedIds.has(id)) {
        id = `${baseId}-${suffix}`
        suffix += 1
      }

      usedIds.add(id)
      heading.id = id

      const anchor = document.createElement('a')
      anchor.href = `#${id}`
      anchor.className = 'heading-anchor'
      anchor.setAttribute('aria-label', `Link to ${text}`)
      anchor.textContent = '#'
      heading.appendChild(anchor)

      return {
        id,
        level,
        text,
      }
    },
  )

  return { html: document.body.innerHTML, headings }
}

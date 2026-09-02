export function formatDate(value) {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function toIso(value) {
  if (!value) return null
  if (typeof value.toDate === 'function') {
    return value.toDate().toISOString()
  }
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'string') return value
  return null
}

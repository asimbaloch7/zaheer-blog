import { WORDS_PER_MINUTE } from './constants'
import { stripHtml } from './html'

export function computeReadingTime(html) {
  const text = stripHtml(html)
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE) || 1)
}

export function readingTimeLabel(minutes) {
  const value = Number(minutes) || 1
  return `${value} min read`
}

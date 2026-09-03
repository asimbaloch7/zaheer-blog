import { useEffect, useRef } from 'react'
import hljs from 'highlight.js/lib/common'
import 'highlight.js/styles/github-dark.css'

export default function PostContent({ html }) {
  const contentRef = useRef(null)

  useEffect(() => {
    const root = contentRef.current
    if (!root) return undefined

    const cleanups = []

    root.querySelectorAll('pre code').forEach((block) => {
      if (!block.dataset.highlighted) hljs.highlightElement(block)

      const pre = block.parentElement
      if (!pre || pre.querySelector('.code-copy-button')) return

      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'code-copy-button'
      button.textContent = 'Copy'
      button.setAttribute('aria-label', 'Copy code')

      const copy = async () => {
        await navigator.clipboard.writeText(block.textContent || '')
        button.textContent = 'Copied'
        window.setTimeout(() => {
          button.textContent = 'Copy'
        }, 1500)
      }

      button.addEventListener('click', copy)
      pre.appendChild(button)
      cleanups.push(() => button.removeEventListener('click', copy))
    })

    return () => cleanups.forEach((cleanup) => cleanup())
  }, [html])

  return (
    <div
      ref={contentRef}
      className="post-content"
      dangerouslySetInnerHTML={{ __html: html || '' }}
    />
  )
}

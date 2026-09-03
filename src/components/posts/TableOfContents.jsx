import { useEffect, useState } from 'react'

export default function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState(headings[0]?.id || '')

  useEffect(() => {
    if (!headings.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-18% 0px -72% 0px' },
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 2) return null

  const list = (
    <ol className="mt-4 space-y-2.5 border-l border-paper-dark">
      {headings.map((heading) => (
        <li key={heading.id} className={heading.level === 3 ? 'pl-6' : 'pl-4'}>
          <a
            href={`#${heading.id}`}
            className={`block text-[0.8125rem] leading-snug transition-colors ${
              activeId === heading.id
                ? 'font-semibold text-pine-800'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ol>
  )

  return (
    <>
      <details className="mb-8 rounded-xl border border-paper-dark bg-paper-card p-4 lg:hidden">
        <summary className="cursor-pointer text-sm font-semibold text-ink">On this page</summary>
        {list}
      </details>
      <nav className="hidden lg:block" aria-label="Table of contents">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink-faint">
          On this page
        </p>
        {list}
      </nav>
    </>
  )
}

import { useState } from 'react'

function ShareIcon({ type }) {
  if (type === 'link') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" />
      </svg>
    )
  }
  return <span className="text-xs font-bold">{type === 'x' ? 'X' : 'in'}</span>
}

export default function ShareButtons({ title, vertical = false }) {
  const [copied, setCopied] = useState(false)
  const url = typeof window === 'undefined' ? '' : window.location.href

  const copy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const links = [
    {
      label: 'Share on X',
      type: 'x',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: 'Share on LinkedIn',
      type: 'linkedin',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  ]

  return (
    <div className={vertical ? 'flex flex-col items-center gap-2' : 'flex flex-wrap items-center gap-2'}>
      {!vertical && (
        <span className="mr-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
          Share
        </span>
      )}
      {links.map((link) => (
        <a
          key={link.type}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          title={link.label}
          className="social-button"
        >
          <ShareIcon type={link.type} />
        </a>
      ))}
      <button
        type="button"
        className="social-button"
        onClick={copy}
        aria-label="Copy article link"
        title={copied ? 'Copied' : 'Copy link'}
      >
        <ShareIcon type="link" />
      </button>
      {copied && <span className="text-xs font-medium text-pine-800">Copied</span>}
    </div>
  )
}

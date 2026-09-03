import { Link } from 'react-router-dom'

export default function TagBadge({ tag, to, active = false, onClick }) {
  const classes = `inline-flex min-h-7 items-center rounded-full border px-3 py-1 text-[0.7rem] font-semibold tracking-wide transition-all duration-200 focus-ring ${
    active
      ? 'border-pine-800 bg-pine-800 text-paper shadow-sm'
      : 'border-pine-200/80 bg-pine-50/80 text-pine-800 hover:-translate-y-px hover:border-pine-700 hover:bg-pine-100'
  }`

  if (onClick) {
    return (
      <button type="button" className={classes} onClick={() => onClick(tag)}>
        {tag}
      </button>
    )
  }

  if (to) {
    return (
      <Link to={to} className={classes}>
        {tag}
      </Link>
    )
  }

  return <span className={classes}>{tag}</span>
}

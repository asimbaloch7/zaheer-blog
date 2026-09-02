import { Link } from 'react-router-dom'

export default function TagBadge({ tag, to, active = false, onClick }) {
  const classes = `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition ${
    active
      ? 'border-pine-800 bg-pine-800 text-paper'
      : 'border-pine-200 bg-pine-50 text-pine-800 hover:border-pine-700'
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

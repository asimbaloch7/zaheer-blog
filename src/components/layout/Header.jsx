import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { site } from '../../config/site'
import { useAuth } from '../../hooks/useAuth'

const navLinkClass = ({ isActive }) =>
  `relative rounded-md px-1 py-2 text-sm font-semibold tracking-wide transition-colors duration-200 after:absolute after:inset-x-1 after:bottom-0 after:h-0.5 after:origin-left after:rounded-full after:bg-pine-700 after:transition-transform ${
    isActive
      ? 'text-pine-800 after:scale-x-100'
      : 'text-ink-muted after:scale-x-0 hover:text-ink hover:after:scale-x-100'
  }`

export default function Header() {
  const { isAdmin, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-paper-dark/80 bg-paper-card/90 shadow-[0_1px_0_rgba(28,25,23,0.02)] backdrop-blur-xl">
      <div className="page-wrap flex h-[4.5rem] items-center justify-between">
        <Link to="/" className="group rounded-sm focus-ring">
          <span className="block text-[0.625rem] font-semibold uppercase tracking-[0.24em] text-pine-700">
            Independent publication
          </span>
          <span className="font-serif text-xl font-semibold tracking-[-0.02em] text-ink transition-colors group-hover:text-pine-800">
            {site.shortTitle}
          </span>
        </Link>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-paper-dark bg-paper-card text-ink transition hover:border-pine-200 hover:text-pine-800 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            {open ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          <NavLink to="/" className={navLinkClass} end>
            Notes
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          {isAdmin ? (
            <>
              <NavLink to="/admin" className={navLinkClass}>
                Dashboard
              </NavLink>
              <button
                type="button"
                className="rounded-md px-1 py-2 text-sm font-semibold text-ink-muted transition-colors hover:text-ink focus-ring"
                onClick={logout}
              >
                Sign out
              </button>
            </>
          ) : (
            <NavLink to="/admin/login" className={navLinkClass}>
              Admin
            </NavLink>
          )}
        </nav>
      </div>

      {open && (
        <nav className="page-wrap flex flex-col gap-1 border-t border-paper-dark py-4 md:hidden" aria-label="Mobile navigation">
          <NavLink to="/" className={navLinkClass} end onClick={close}>
            Notes
          </NavLink>
          <NavLink to="/about" className={navLinkClass} onClick={close}>
            About
          </NavLink>
          {isAdmin ? (
            <>
              <NavLink to="/admin" className={navLinkClass} onClick={close}>
                Dashboard
              </NavLink>
              <button
                type="button"
                className="text-left text-sm text-ink-muted"
                onClick={() => {
                  close()
                  logout()
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <NavLink to="/admin/login" className={navLinkClass} onClick={close}>
              Admin
            </NavLink>
          )}
        </nav>
      )}
    </header>
  )
}

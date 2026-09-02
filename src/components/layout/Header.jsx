import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { site } from '../../config/site'
import { useAuth } from '../../hooks/useAuth'

const navLinkClass = ({ isActive }) =>
  `text-sm tracking-wide transition ${
    isActive ? 'text-pine-800' : 'text-ink-muted hover:text-ink'
  }`

export default function Header() {
  const { isAdmin, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="border-b border-paper-dark bg-paper-card/90 backdrop-blur">
      <div className="page-wrap flex items-center justify-between py-4">
        <Link to="/" className="group">
          <span className="block text-[0.65rem] uppercase tracking-[0.22em] text-pine-700">
            Microbiology
          </span>
          <span className="font-serif text-xl text-ink group-hover:text-pine-800">
            {site.shortTitle}
          </span>
        </Link>

        <button
          type="button"
          className="inline-flex rounded-md border border-paper-dark px-3 py-1.5 text-sm md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          Menu
        </button>

        <nav className="hidden items-center gap-6 md:flex">
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
                className="text-sm text-ink-muted hover:text-ink"
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
        <nav className="flex flex-col gap-3 border-t border-paper-dark px-5 py-4 md:hidden">
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

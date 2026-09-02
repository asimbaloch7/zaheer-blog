import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import SEO from '../../components/seo/SEO'
import { useAuth } from '../../hooks/useAuth'
import { isFirebaseConfigured } from '../../firebase/config'
import { site } from '../../config/site'

export default function Login() {
  const { user, loading, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const from = location.state?.from?.pathname || '/admin'

  if (!loading && user) {
    return <Navigate to={from} replace />
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(friendlyAuthError(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-wrap flex justify-center py-16">
      <SEO title="Admin login" path="/admin/login" noIndex />
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-lg border border-paper-dark bg-paper-card p-8 shadow-sm"
      >
        <p className="text-xs uppercase tracking-[0.22em] text-pine-700">{site.shortTitle}</p>
        <h1 className="mt-2 font-serif text-3xl text-ink">Editor sign-in</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Single-author access. There is no public registration.
        </p>

        {!isFirebaseConfigured && (
          <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Firebase environment variables are missing. Add them to <code>.env</code> before signing in.
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
        )}

        <label className="mt-6 block text-sm font-medium text-ink" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className="input mt-1"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label className="mt-4 block text-sm font-medium text-ink" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          className="input mt-1"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit" className="btn-primary mt-6 w-full" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

function friendlyAuthError(error) {
  const code = error?.code || ''
  if (code.includes('unauthorized-domain')) {
    return 'This domain is not authorized in Firebase Authentication settings.'
  }
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
    return 'Email or password is incorrect.'
  }
  if (code.includes('too-many-requests')) {
    return 'Too many attempts. Wait a moment and try again.'
  }
  return error?.message || 'Unable to sign in.'
}

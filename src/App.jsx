import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Spinner from './components/ui/Spinner'
import Home from './pages/Home'
import Post from './pages/Post'
import About from './pages/About'
import NotFound from './pages/NotFound'

const Login = lazy(() => import('./pages/admin/Login'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const PostEditor = lazy(() => import('./pages/admin/PostEditor'))

function AdminFallback() {
  return <Spinner label="Loading editor" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/post/:slug" element={<Post />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<AdminFallback />}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Suspense fallback={<AdminFallback />}>
                  <Dashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/new"
            element={
              <ProtectedRoute>
                <Suspense fallback={<AdminFallback />}>
                  <PostEditor />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit/:id"
            element={
              <ProtectedRoute>
                <Suspense fallback={<AdminFallback />}>
                  <PostEditor />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

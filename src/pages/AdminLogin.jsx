import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { LockIcon } from '../components/Icons.jsx'

export default function AdminLogin() {
  const { signIn, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const err = await signIn(email, password)
    setLoading(false)
    if (err) {
      setError('Email atau password salah.')
      return
    }
    navigate('/')
  }

  if (isAdmin) {
    return (
      <div className="container login-wrap">
        <div className="panel" style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: 16 }}>Kamu sudah login sebagai admin.</p>
          <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Kembali ke Feed
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container login-wrap">
      <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <LockIcon /> akses admin
      </div>
      <h1 className="page-title" style={{ fontSize: 'clamp(26px, 5vw, 34px)' }}>
        Masuk
      </h1>
      <p className="subtitle">Khusus kamu — untuk mengelola dan menghapus kenangan.</p>

      <form onSubmit={handleSubmit} className="panel" style={{ marginTop: 24 }}>
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        {error && <div className="error-text">{error}</div>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>

      <div className="footer-admin-link">
        <Link to="/" className="btn-ghost-small">
          ← Kembali ke feed
        </Link>
      </div>
    </div>
  )
}

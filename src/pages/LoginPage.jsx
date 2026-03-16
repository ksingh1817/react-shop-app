import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Button, Input } from '@/components/ui'
import { useToast } from '@/components/ui'

export function LoginPage() {
  const [form, setForm] = useState({ username: 'emilys', password: 'emilyspass' })
  const { login, loading, error, clearError } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const { push } = useToast()

  const from = location.state?.from?.pathname || '/'

  const handleChange = (e) => {
    clearError()
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { ok } = await login(form.username, form.password)
    if (ok) {
      push('Welcome back!', 'success')
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card animate-in">
        <div className="auth-card__header">
          <div className="auth-card__logo">◆</div>
          <h1 className="auth-card__title">Sign in</h1>
          <p className="auth-card__sub">Welcome back to ShopDummy</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="e.g. emilys"
            autoComplete="username"
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <Button type="submit" loading={loading} fullWidth>
            Sign in
          </Button>
        </form>

        <p className="auth-card__footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">Create one</Link>
        </p>

        <div className="auth-hint">
          <p>Demo credentials pre-filled ↑</p>
          <p>Try: emilys / emilyspass</p>
        </div>
      </div>
    </div>
  )
}

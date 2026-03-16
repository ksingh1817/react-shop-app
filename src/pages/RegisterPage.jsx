import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input } from '@/components/ui'
import { useToast } from '@/components/ui'

const FIELDS = [
  { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'Jane' },
  { name: 'lastName',  label: 'Last Name',  type: 'text', placeholder: 'Doe' },
  { name: 'email',     label: 'Email',      type: 'email', placeholder: 'jane@example.com' },
  { name: 'username',  label: 'Username',   type: 'text', placeholder: 'janedoe' },
  { name: 'password',  label: 'Password',   type: 'password', placeholder: '••••••••' },
  { name: 'confirm',   label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
]

export function RegisterPage() {
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { push } = useToast()

  const validate = () => {
    const e = {}
    if (!form.firstName?.trim()) e.firstName = 'Required'
    if (!form.lastName?.trim())  e.lastName  = 'Required'
    if (!form.email?.includes('@')) e.email = 'Invalid email'
    if (!form.username?.trim()) e.username = 'Required'
    if ((form.password?.length ?? 0) < 6) e.password = 'Min 6 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const handleChange = (e) => {
    setErrors(prev => ({ ...prev, [e.target.name]: '' }))
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    // DummyJSON has no real registration — simulate success
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    push('Account created! Please sign in.', 'success')
    navigate('/login')
  }

  return (
    <div className="auth-page">
      <div className="auth-card animate-in" style={{ maxWidth: 480 }}>
        <div className="auth-card__header">
          <div className="auth-card__logo">◆</div>
          <h1 className="auth-card__title">Create account</h1>
          <p className="auth-card__sub">Join ShopDummy today</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form auth-form--grid">
          {FIELDS.map(f => (
            <Input
              key={f.name}
              label={f.label}
              name={f.name}
              type={f.type}
              placeholder={f.placeholder}
              value={form[f.name] || ''}
              onChange={handleChange}
              error={errors[f.name]}
              className={f.name === 'email' || f.name === 'username' ? 'col-span-2' : ''}
            />
          ))}
          <Button type="submit" loading={loading} fullWidth className="col-span-2">
            Create account
          </Button>
        </form>

        <p className="auth-card__footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>

        <div className="auth-hint">
          <p>Note: DummyJSON doesn't support real registration.</p>
          <p>After "registering", use the demo credentials to login.</p>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   src/components/ui/index.jsx
   Shared primitives: Button, Input, Badge, Spinner, Toast, etc.
───────────────────────────────────────────────────────────── */
import React, { createContext, useContext, useState, useCallback } from 'react'

/* ── Button ── */
export function Button({
  children, variant = 'primary', size = 'md',
  loading, icon, fullWidth, className = '', ...props
}) {
  const base = `btn btn--${variant} btn--${size}${fullWidth ? ' btn--full' : ''} ${className}`
  return (
    <button className={base} disabled={loading || props.disabled} {...props}>
      {loading ? <Spinner size={16} /> : icon}
      {children}
    </button>
  )
}

/* ── Input ── */
export function Input({ label, error, icon, className = '', ...props }) {
  return (
    <div className={`field ${className}`}>
      {label && <label className="field__label">{label}</label>}
      <div className="field__wrap">
        {icon && <span className="field__icon">{icon}</span>}
        <input className={`field__input${icon ? ' field__input--icon' : ''}${error ? ' field__input--error' : ''}`} {...props} />
      </div>
      {error && <p className="field__error">{error}</p>}
    </div>
  )
}

/* ── Badge ── */
export function Badge({ children, color = 'default' }) {
  return <span className={`badge badge--${color}`}>{children}</span>
}

/* ── Spinner ── */
export function Spinner({ size = 24 }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        strokeDasharray="42" strokeDashoffset="12" />
    </svg>
  )
}

/* ── Skeleton ── */
export function Skeleton({ width, height, radius = 8, style = {} }) {
  return (
    <div className="skeleton" style={{ width, height, borderRadius: radius, ...style }} />
  )
}

/* ── Toast system ── */
const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const push = useCallback((msg, type = 'info', duration = 3000) => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration)
  }, [])

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="toast-stack">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast--${t.type} animate-in`}>{t.msg}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  return useContext(ToastCtx)
}

/* ── Modal ── */
export function Modal({ open, onClose, title, children, width = 480 }) {
  if (!open) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: width }} onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">{title}</h3>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  )
}

/* ── Stars rating ── */
export function Stars({ rating = 0, max = 5 }) {
  return (
    <span className="stars">
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < Math.round(rating) ? 'star star--on' : 'star'}>★</span>
      ))}
      <span className="stars__num">{rating.toFixed(1)}</span>
    </span>
  )
}

/* ── Empty state ── */
export function Empty({ icon = '🛒', title, message }) {
  return (
    <div className="empty">
      <div className="empty__icon">{icon}</div>
      <h3 className="empty__title">{title}</h3>
      {message && <p className="empty__msg">{message}</p>}
    </div>
  )
}

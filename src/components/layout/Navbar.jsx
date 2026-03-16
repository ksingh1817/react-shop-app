import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'

export function Navbar() {
  const { user, logout } = useAuthStore()
  const items = useCartStore(s => s.items)
  const count = items.reduce((s, i) => s + i.quantity, 0)
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__logo">◆</span>
          <span>ShopDummy</span>
        </Link>

        <nav className="navbar__links">
          <NavLink to="/products" className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}>
            Products
          </NavLink>
          {user && (
            <NavLink to="/profile" className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}>
              Profile
            </NavLink>
          )}
        </nav>

        <div className="navbar__actions">
          <Link to="/cart" className="navbar__cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {count > 0 && <span className="navbar__badge">{count}</span>}
          </Link>

          {user ? (
            <div className="navbar__user">
              <Link to="/profile" className="navbar__avatar">
                {user.image
                  ? <img src={user.image} alt={user.firstName} />
                  : <span>{(user.firstName || 'U')[0]}</span>
                }
              </Link>
              <button className="navbar__link" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="navbar__auth">
              <Link to="/login" className="navbar__link">Login</Link>
              <Link to="/register" className="btn btn--primary btn--sm">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

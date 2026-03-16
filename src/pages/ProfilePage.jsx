import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Badge, Button } from '@/components/ui'
import { useToast } from '@/components/ui'
import { useCartStore } from '@/store/cartStore'

const InfoRow = ({ label, value }) => (
  <div className="profile-row">
    <span className="profile-row__label">{label}</span>
    <span className="profile-row__value">{value ?? '—'}</span>
  </div>
)

export function ProfilePage() {
  const { user, logout } = useAuthStore()
  const clearCart = useCartStore(s => s.clearCart)
  const navigate = useNavigate()
  const { push } = useToast()

  if (!user) return null

  const handleLogout = () => {
    logout()
    clearCart()
    push('Signed out successfully', 'info')
    navigate('/login')
  }

  return (
    <div className="page profile-page animate-in">
      <div className="page__header">
        <h1 className="page__title">Profile</h1>
      </div>

      <div className="profile-layout">
        <div className="profile-card">
          <div className="profile-hero">
            {user.image
              ? <img src={user.image} alt={user.firstName} className="profile-avatar" />
              : <div className="profile-avatar profile-avatar--fallback">{(user.firstName || 'U')[0]}</div>
            }
            <div>
              <h2 className="profile-name">{user.firstName} {user.lastName}</h2>
              <p className="profile-username">@{user.username}</p>
              <Badge color="accent">{user.role || 'user'}</Badge>
            </div>
          </div>

          <div className="profile-section">
            <h3 className="profile-section__title">Contact</h3>
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Phone" value={user.phone} />
          </div>

          <div className="profile-section">
            <h3 className="profile-section__title">Personal</h3>
            <InfoRow label="Age" value={user.age} />
            <InfoRow label="Gender" value={user.gender} />
            <InfoRow label="Birth Date" value={user.birthDate} />
          </div>

          {user.address && (
            <div className="profile-section">
              <h3 className="profile-section__title">Address</h3>
              <InfoRow label="Street" value={user.address.address} />
              <InfoRow label="City" value={user.address.city} />
              <InfoRow label="State" value={user.address.state} />
              <InfoRow label="Country" value={user.address.country} />
            </div>
          )}

          {user.company && (
            <div className="profile-section">
              <h3 className="profile-section__title">Company</h3>
              <InfoRow label="Name" value={user.company.name} />
              <InfoRow label="Department" value={user.company.department} />
              <InfoRow label="Title" value={user.company.title} />
            </div>
          )}

          <div className="profile-actions">
            <Button variant="danger" onClick={handleLogout}>
              Sign out
            </Button>
          </div>
        </div>

        <div className="profile-token-card">
          <h3 className="profile-section__title">JWT Token</h3>
          <p className="token-label">Access Token</p>
          <pre className="token-box">{useAuthStore.getState().accessToken}</pre>
          <p className="token-label" style={{marginTop: '12px'}}>Refresh Token</p>
          <pre className="token-box">{useAuthStore.getState().refreshToken}</pre>
        </div>
      </div>
    </div>
  )
}

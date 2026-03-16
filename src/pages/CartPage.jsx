import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { CartItem } from '@/components/cart/CartItem'
import { Empty, Button } from '@/components/ui'
import { cartApi } from '@/api'
import { useToast } from '@/components/ui'

export function CartPage() {
  const { items, cartId, clearCart, setCartId } = useCartStore()
  const { user } = useAuthStore()
  const { push } = useToast()
  const [syncing, setSyncing] = useState(false)

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const count = items.reduce((s, i) => s + i.quantity, 0)

  const handleSync = async () => {
    if (!user) { push('Please sign in to sync your cart', 'info'); return }
    setSyncing(true)
    try {
      let result
      if (cartId) {
        result = await cartApi.update(cartId, items)
      } else {
        result = await cartApi.create(user.id, items)
        setCartId(result.id)
      }
      push(`Cart synced! (Cart #${result.id})`, 'success')
    } catch {
      push('Sync failed. Please try again.', 'error')
    } finally {
      setSyncing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="page animate-in">
        <div className="page__header">
          <h1 className="page__title">Cart</h1>
        </div>
        <Empty
          icon="🛒"
          title="Your cart is empty"
          message="Browse products and add some items!"
        />
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page animate-in">
      <div className="page__header">
        <h1 className="page__title">Cart</h1>
        <p className="page__sub">{count} item{count !== 1 ? 's' : ''}</p>
      </div>

      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items">
          {items.map(item => <CartItem key={item.id} item={item} />)}
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h2 className="cart-summary__title">Order Summary</h2>

          <div className="cart-summary__rows">
            {items.map(item => (
              <div key={item.id} className="cart-summary__row">
                <span className="cart-summary__name">
                  {item.title} <span className="cart-summary__qty">×{item.quantity}</span>
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="cart-summary__divider" />

          <div className="cart-summary__total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <Button fullWidth onClick={handleSync} loading={syncing}>
            {cartId ? 'Update Server Cart' : 'Sync to Server'}
          </Button>

          {!user && (
            <p className="cart-summary__hint">
              <Link to="/login" className="auth-link">Sign in</Link> to sync your cart
            </p>
          )}

          {cartId && (
            <p className="cart-summary__hint">Cart ID: #{cartId}</p>
          )}

          <button className="cart-summary__clear" onClick={clearCart}>
            Clear cart
          </button>
        </div>
      </div>
    </div>
  )
}

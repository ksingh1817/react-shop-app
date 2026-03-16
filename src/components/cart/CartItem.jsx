import React from 'react'
import { useCartStore } from '@/store/cartStore'

export function CartItem({ item }) {
  const { removeItem, setQuantity } = useCartStore()

  return (
    <div className="cart-item">
      <img src={item.thumbnail} alt={item.title} className="cart-item__img" />
      <div className="cart-item__info">
        <p className="cart-item__title">{item.title}</p>
        <p className="cart-item__price">${item.price.toFixed(2)} each</p>
      </div>
      <div className="cart-item__qty">
        <button
          className="qty-btn"
          onClick={() => setQuantity(item.id, item.quantity - 1)}
          aria-label="Decrease"
        >−</button>
        <span className="qty-num">{item.quantity}</span>
        <button
          className="qty-btn"
          onClick={() => setQuantity(item.id, item.quantity + 1)}
          disabled={item.quantity >= (item.stock ?? 99)}
          aria-label="Increase"
        >+</button>
      </div>
      <p className="cart-item__subtotal">${(item.price * item.quantity).toFixed(2)}</p>
      <button className="cart-item__remove" onClick={() => removeItem(item.id)} aria-label="Remove">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  )
}

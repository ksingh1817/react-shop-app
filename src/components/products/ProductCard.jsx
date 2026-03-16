import React from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import { Badge, Stars, Button } from '@/components/ui'
import { useToast } from '@/components/ui'

export function ProductCard({ product }) {
  const addItem = useCartStore(s => s.addItem)
  const { push } = useToast()

  const handleAdd = (e) => {
    e.preventDefault()
    addItem(product)
    push(`"${product.title}" added to cart`, 'success')
  }

  const discount = product.discountPercentage
  const discountedPrice = product.price * (1 - discount / 100)

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card__img-wrap">
        <img src={product.thumbnail} alt={product.title} className="product-card__img" loading="lazy" />
        {discount > 0 && (
          <Badge color="accent">−{Math.round(discount)}%</Badge>
        )}
      </div>
      <div className="product-card__body">
        <p className="product-card__cat">{product.category}</p>
        <h3 className="product-card__title">{product.title}</h3>
        <Stars rating={product.rating} />
        <div className="product-card__footer">
          <div className="product-card__prices">
            <span className="product-card__price">${discountedPrice.toFixed(2)}</span>
            {discount > 0 && (
              <span className="product-card__orig">${product.price}</span>
            )}
          </div>
          <button className="product-card__add" onClick={handleAdd} aria-label="Add to cart">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </Link>
  )
}

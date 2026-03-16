import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProductsStore } from '@/store/productsStore'
import { useCartStore } from '@/store/cartStore'
import { Badge, Stars, Button, Spinner } from '@/components/ui'
import { useToast } from '@/components/ui'

export function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { selectedProduct: product, loading, fetchProduct } = useProductsStore()
  const addItem = useCartStore(s => s.addItem)
  const { push } = useToast()
  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    fetchProduct(id)
    setActiveImg(0)
    setQty(1)
  }, [id])

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
        <Spinner size={40} />
      </div>
    )
  }

  if (!product) return null

  const discounted = product.price * (1 - product.discountPercentage / 100)
  const images = product.images?.length ? product.images : [product.thumbnail]

  const handleAdd = () => {
    addItem(product, qty)
    push(`${qty}× "${product.title}" added to cart`, 'success')
  }

  const stockColor = product.stock > 20 ? 'green' : product.stock > 5 ? 'yellow' : 'red'

  return (
    <div className="page animate-in">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="detail-layout">
        {/* Gallery */}
        <div className="detail-gallery">
          <div className="detail-gallery__main">
            <img src={images[activeImg]} alt={product.title} className="detail-gallery__img" />
            {product.discountPercentage > 0 && (
              <Badge color="accent">−{Math.round(product.discountPercentage)}%</Badge>
            )}
          </div>
          {images.length > 1 && (
            <div className="detail-gallery__thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`detail-gallery__thumb${i === activeImg ? ' detail-gallery__thumb--active' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="detail-info">
          <p className="detail-cat">{product.category}</p>
          <h1 className="detail-title">{product.title}</h1>
          <p className="detail-brand">by {product.brand}</p>

          <Stars rating={product.rating} />

          <div className="detail-prices">
            <span className="detail-price">${discounted.toFixed(2)}</span>
            {product.discountPercentage > 0 && (
              <span className="detail-orig">${product.price}</span>
            )}
          </div>

          <p className="detail-desc">{product.description}</p>

          <div className="detail-meta">
            <div className="detail-meta__item">
              <span className="detail-meta__label">Stock</span>
              <Badge color={stockColor}>{product.stock} left</Badge>
            </div>
            {product.sku && (
              <div className="detail-meta__item">
                <span className="detail-meta__label">SKU</span>
                <span className="detail-meta__val">{product.sku}</span>
              </div>
            )}
            {product.warrantyInformation && (
              <div className="detail-meta__item">
                <span className="detail-meta__label">Warranty</span>
                <span className="detail-meta__val">{product.warrantyInformation}</span>
              </div>
            )}
            {product.shippingInformation && (
              <div className="detail-meta__item">
                <span className="detail-meta__label">Shipping</span>
                <span className="detail-meta__val">{product.shippingInformation}</span>
              </div>
            )}
          </div>

          <div className="detail-tags">
            {product.tags?.map(t => <Badge key={t}>{t}</Badge>)}
          </div>

          <div className="detail-add">
            <div className="qty-control">
              <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span className="qty-num">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
            </div>
            <Button onClick={handleAdd} disabled={product.stock === 0}>
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>

          {/* Reviews */}
          {product.reviews?.length > 0 && (
            <div className="reviews">
              <h3 className="reviews__title">Reviews</h3>
              {product.reviews.map((r, i) => (
                <div key={i} className="review">
                  <div className="review__header">
                    <span className="review__name">{r.reviewerName}</span>
                    <Stars rating={r.rating} />
                  </div>
                  <p className="review__comment">{r.comment}</p>
                  <p className="review__date">{new Date(r.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

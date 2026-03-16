import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProductsStore } from '@/store/productsStore'
import { ProductCard } from '@/components/products/ProductCard'
import { Skeleton } from '@/components/ui'

export function HomePage() {
  const { products, loading, fetchProducts, setCategory } = useProductsStore()

  useEffect(() => {
    fetchProducts()
  }, [])

  const featured = products.slice(0, 4)

  return (
    <div className="home animate-in">
      {/* Hero */}
      <section className="hero">
        <div className="hero__content">
          <div className="hero__label">Powered by DummyJSON</div>
          <h1 className="hero__title">
            Shop<br />
            <span className="hero__title--accent">Differently.</span>
          </h1>
          <p className="hero__sub">
            A full-stack React demo with JWT auth, Zustand state management,
            and a real product catalog.
          </p>
          <div className="hero__actions">
            <Link to="/products" className="btn btn--primary btn--lg">
              Browse Products
            </Link>
            <Link to="/register" className="btn btn--ghost btn--lg">
              Create Account
            </Link>
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__badge">
            <span className="hero__badge-num">194</span>
            <span className="hero__badge-label">Products</span>
          </div>
        </div>
      </section>

      {/* Category chips */}
      <section className="home-section">
        <h2 className="home-section__title">Browse by Category</h2>
        <div className="cat-chips">
          {['smartphones', 'laptops', 'fragrances', 'skincare', 'groceries', 'furniture'].map(c => (
            <Link
              key={c}
              to="/products"
              className="cat-chip"
              onClick={() => setCategory(c)}
            >
              {c}
            </Link>
          ))}
          <Link to="/products" className="cat-chip cat-chip--all">View All →</Link>
        </div>
      </section>

      {/* Featured */}
      <section className="home-section">
        <div className="home-section__header">
          <h2 className="home-section__title">Featured Products</h2>
          <Link to="/products" className="home-section__link">View all →</Link>
        </div>
        <div className="product-grid product-grid--4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="product-card">
                  <Skeleton height={200} radius={12} style={{ width: '100%' }} />
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <Skeleton height={12} width="50%" />
                    <Skeleton height={16} width="80%" />
                  </div>
                </div>
              ))
            : featured.map(p => <ProductCard key={p.id} product={p} />)
          }
        </div>
      </section>

      {/* Features strip */}
      <section className="features-strip">
        {[
          { icon: '🔐', title: 'JWT Auth', desc: 'Token + refresh token flow' },
          { icon: '🗃️', title: 'Zustand', desc: 'Global state with persistence' },
          { icon: '⚡', title: 'Vite', desc: 'Lightning-fast HMR dev server' },
          { icon: '🛒', title: 'Cart Sync', desc: 'Local & server cart support' },
        ].map(f => (
          <div key={f.title} className="feature-card">
            <span className="feature-card__icon">{f.icon}</span>
            <h3 className="feature-card__title">{f.title}</h3>
            <p className="feature-card__desc">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  )
}

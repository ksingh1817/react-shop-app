import React, { useEffect, useState } from 'react'
import { useProductsStore } from '@/store/productsStore'
import { ProductCard } from '@/components/products/ProductCard'
import { Spinner, Skeleton, Empty, Button } from '@/components/ui'
import { useDebounce } from '@/hooks/useDebounce'

export function ProductsPage() {
  const {
    products, total, categories, loading,
    search, category, sortBy, order, limit, skip,
    fetchProducts, fetchCategories,
    setSearch, setCategory, setSort, setPage,
  } = useProductsStore()

  const [searchInput, setSearchInput] = useState(search)
  const debounced = useDebounce(searchInput, 400)

  useEffect(() => { fetchCategories() }, [])
  useEffect(() => { setSearch(debounced) }, [debounced])
  useEffect(() => { fetchProducts() }, [search, category, sortBy, order, skip])

  const totalPages = Math.ceil(total / limit)
  const currentPage = Math.floor(skip / limit) + 1

  return (
    <div className="page animate-in">
      <div className="page__header">
        <h1 className="page__title">Products</h1>
        <p className="page__sub">{total} items</p>
      </div>

      {/* Filters bar */}
      <div className="filters-bar">
        <div className="filters-bar__search">
          <svg className="filters-bar__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="filters-bar__input"
            placeholder="Search products…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button className="filters-bar__clear" onClick={() => { setSearchInput(''); setSearch('') }}>✕</button>
          )}
        </div>

        <div className="filters-bar__right">
          <select
            className="filters-bar__select"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>

          <select
            className="filters-bar__select"
            value={`${sortBy}-${order}`}
            onChange={e => {
              const [s, o] = e.target.value.split('-')
              setSort(s, o)
            }}
          >
            <option value="title-asc">Name A–Z</option>
            <option value="title-desc">Name Z–A</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="rating-desc">Rating ↓</option>
          </select>
        </div>
      </div>

      {/* Active filters */}
      {(category || search) && (
        <div className="active-filters">
          {category && (
            <button className="filter-chip" onClick={() => setCategory('')}>
              {category} ✕
            </button>
          )}
          {search && (
            <button className="filter-chip" onClick={() => { setSearchInput(''); setSearch('') }}>
              "{search}" ✕
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="product-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="product-card product-card--skeleton">
              <Skeleton height={220} radius={12} style={{ width: '100%' }} />
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Skeleton height={12} width="50%" />
                <Skeleton height={16} width="80%" />
                <Skeleton height={12} width="40%" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <Empty icon="🔍" title="No products found" message="Try adjusting your search or filters" />
      ) : (
        <div className="product-grid">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {/* Pagination */}
      {!search && !category && totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination__btn"
            disabled={currentPage === 1}
            onClick={() => setPage(skip - limit)}
          >← Prev</button>
          <span className="pagination__info">Page {currentPage} of {totalPages}</span>
          <button
            className="pagination__btn"
            disabled={currentPage === totalPages}
            onClick={() => setPage(skip + limit)}
          >Next →</button>
        </div>
      )}
    </div>
  )
}

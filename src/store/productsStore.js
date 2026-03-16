import { create } from 'zustand'
import { productsApi } from '@/api'

export const useProductsStore = create((set, get) => ({
  products: [],
  total: 0,
  categories: [],
  selectedProduct: null,
  loading: false,
  error: null,

  // Filters
  search: '',
  category: '',
  sortBy: 'title',
  order: 'asc',
  limit: 20,
  skip: 0,

  /* ── fetch products ── */
  fetchProducts: async () => {
    const { search, category, limit, skip, sortBy, order } = get()
    set({ loading: true, error: null })
    try {
      let data
      if (search) {
        data = await productsApi.search(search)
      } else if (category) {
        data = await productsApi.getByCategory(category)
      } else {
        data = await productsApi.getAll({ limit, skip, sortBy, order })
      }
      set({ products: data.products, total: data.total, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  /* ── fetch one product ── */
  fetchProduct: async (id) => {
    set({ loading: true, selectedProduct: null, error: null })
    try {
      const product = await productsApi.getOne(id)
      set({ selectedProduct: product, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  /* ── fetch categories ── */
  fetchCategories: async () => {
    try {
      const data = await productsApi.getCategories()
      set({ categories: data })
    } catch {}
  },

  /* ── filter helpers ── */
  setSearch: (search) => set({ search, skip: 0 }),
  setCategory: (category) => set({ category, search: '', skip: 0 }),
  setSort: (sortBy, order) => set({ sortBy, order }),
  setPage: (skip) => set({ skip }),
}))

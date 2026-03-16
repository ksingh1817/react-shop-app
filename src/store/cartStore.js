import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],       // [{ id, title, price, thumbnail, quantity, stock }]
      cartId: null,    // synced server cart id

      /* ── computed helpers ── */
      get count() { return get().items.reduce((s, i) => s + i.quantity, 0) },
      get total() { return get().items.reduce((s, i) => s + i.price * i.quantity, 0) },

      /* ── add / update quantity ── */
      addItem: (product, qty = 1) => {
        set((state) => {
          const existing = state.items.find(i => i.id === product.id)
          if (existing) {
            return {
              items: state.items.map(i =>
                i.id === product.id
                  ? { ...i, quantity: Math.min(i.quantity + qty, i.stock ?? 99) }
                  : i
              ),
            }
          }
          return {
            items: [
              ...state.items,
              {
                id: product.id,
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail,
                stock: product.stock,
                quantity: qty,
              },
            ],
          }
        })
      },

      /* ── remove one item ── */
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter(i => i.id !== id) })),

      /* ── set exact quantity ── */
      setQuantity: (id, quantity) => {
        if (quantity < 1) return get().removeItem(id)
        set((state) => ({
          items: state.items.map(i =>
            i.id === id ? { ...i, quantity: Math.min(quantity, i.stock ?? 99) } : i
          ),
        }))
      },

      /* ── clear all ── */
      clearCart: () => set({ items: [], cartId: null }),

      setCartId: (id) => set({ cartId: id }),
    }),
    {
      name: 'shop-cart',
      partialize: (state) => ({ items: state.items, cartId: state.cartId }),
    }
  )
)

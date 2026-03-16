import axios from 'axios'

const BASE = 'https://dummyjson.com'

export const api = axios.create({ baseURL: BASE })

// Attach stored token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// On 401, clear auth and redirect
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

/* ─── Auth ──────────────────────────────────────────────── */
export const authApi = {
  login: (username, password) =>
    api.post('/auth/login', { username, password, expiresInMins: 60 }).then(r => r.data),

  getMe: () =>
    api.get('/auth/me').then(r => r.data),

  refresh: (refreshToken) =>
    api.post('/auth/refresh', { refreshToken, expiresInMins: 60 }).then(r => r.data),
}

/* ─── Products ──────────────────────────────────────────── */
export const productsApi = {
  getAll: (params = {}) =>
    api.get('/products', { params }).then(r => r.data),

  getOne: (id) =>
    api.get(`/products/${id}`).then(r => r.data),

  search: (q) =>
    api.get('/products/search', { params: { q } }).then(r => r.data),

  getCategories: () =>
    api.get('/products/categories').then(r => r.data),

  getByCategory: (cat) =>
    api.get(`/products/category/${cat}`).then(r => r.data),
}

/* ─── Cart ──────────────────────────────────────────────── */
export const cartApi = {
  getByUser: (userId) =>
    api.get(`/carts/user/${userId}`).then(r => r.data),

  create: (userId, products) =>
    api.post('/carts/add', {
      userId,
      products: products.map(p => ({ id: p.id, quantity: p.quantity })),
    }).then(r => r.data),

  update: (cartId, products) =>
    api.put(`/carts/${cartId}`, {
      merge: true,
      products: products.map(p => ({ id: p.id, quantity: p.quantity })),
    }).then(r => r.data),

  delete: (cartId) =>
    api.delete(`/carts/${cartId}`).then(r => r.data),
}

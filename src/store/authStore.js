import { create } from 'zustand'
import { authApi } from '@/api'

const TOKEN_KEY = 'accessToken'
const REFRESH_KEY = 'refreshToken'

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: localStorage.getItem(TOKEN_KEY) || null,
  refreshToken: localStorage.getItem(REFRESH_KEY) || null,
  loading: false,
  error: null,

  /* ── login ── */
  login: async (username, password) => {
    set({ loading: true, error: null })
    try {
      const data = await authApi.login(username, password);
     // console.log("data",data);
      const { accessToken, refreshToken, ...user } = data
     // localStorage.setItem(TOKEN_KEY,  token)
      localStorage.setItem(TOKEN_KEY,  accessToken)
      localStorage.setItem(REFRESH_KEY, refreshToken)
      set({ user, accessToken, refreshToken, loading: false })
      return { ok: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      set({ loading: false, error: msg })
      return { ok: false, error: msg }
    }
  },

  /* ── logout ── */
  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
    set({ user: null, accessToken: null, refreshToken: null, error: null })
  },

  /* ── fetchMe (hydrate on app load) ── */
  fetchMe: async () => {
    if (!get().accessToken) return
    set({ loading: true })
    try {
      const user = await authApi.getMe()
      set({ user, loading: false })
    } catch {
      get().logout()
      set({ loading: false })
    }
  },

  /* ── refresh token ── */
  refreshAccessToken: async () => {
    const rt = get().refreshToken
    if (!rt) return false
    try {
      const data = await authApi.refresh(rt)
      localStorage.setItem(TOKEN_KEY, data.accessToken)
      localStorage.setItem(REFRESH_KEY, data.refreshToken)
      set({ accessToken: data.accessToken, refreshToken: data.refreshToken })
      return true
    } catch {
      get().logout()
      return false
    }
  },

  clearError: () => set({ error: null }),
}))

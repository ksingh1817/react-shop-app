import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Navbar } from '@/components/layout/Navbar'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ToastProvider } from '@/components/ui'

import { HomePage }          from '@/pages/HomePage'
import { LoginPage }         from '@/pages/LoginPage'
import { RegisterPage }      from '@/pages/RegisterPage'
import { ProfilePage }       from '@/pages/ProfilePage'
import { ProductsPage }      from '@/pages/ProductsPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { CartPage }          from '@/pages/CartPage'

function AppShell() {
  const { fetchMe, token } = useAuthStore()

  // Hydrate user from token on first load
  useEffect(() => {
    if (token) fetchMe()
  }, [])

  return (
    <div className="app">
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/"               element={<HomePage />} />
          <Route path="/login"          element={<LoginPage />} />
          <Route path="/register"       element={<RegisterPage />} />
          <Route path="/products"       element={<ProductsPage />} />
          <Route path="/products/:id"   element={<ProductDetailPage />} />
          <Route path="/cart"           element={<CartPage />} />
          <Route path="/profile"        element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          <Route path="*"               element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppShell />
      </ToastProvider>
    </BrowserRouter>
  )
}

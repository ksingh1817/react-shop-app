# ShopDummy — React + Vite + Zustand + DummyJSON

A production-grade frontend demo integrating user auth, JWT handling, product catalog, and cart management.

## Quick Start

```bash
npm install
npm run dev
```

Open https://react-shop-application.netlify.app/ — demo credentials are pre-filled on the login page.

**Demo user:** `emilys` / `emilyspass`

---

## Project Structure

```
src/
├── api/
│   └── index.js              # Axios instance + interceptors + all API calls
│
├── store/
│   ├── authStore.js          # Zustand: login, logout, fetchMe, token refresh
│   ├── cartStore.js          # Zustand: add/remove/update, persisted to localStorage
│   └── productsStore.js      # Zustand: product list, filters, search, pagination
│
├── hooks/
│   └── useDebounce.js        # Debounce hook for search input
│
├── components/
│   ├── ui/index.jsx          # Button, Input, Badge, Spinner, Skeleton, Toast, Modal, Stars, Empty
│   ├── layout/
│   │   └── Navbar.jsx        # Sticky nav with cart badge, user avatar, auth links
│   ├── auth/
│   │   └── ProtectedRoute.jsx
│   ├── products/
│   │   └── ProductCard.jsx
│   └── cart/
│       └── CartItem.jsx
│
├── pages/
│   ├── HomePage.jsx           # Hero, category chips, featured products, feature strip
│   ├── LoginPage.jsx          # Auth form with error handling + redirect-after-login
│   ├── RegisterPage.jsx       # Validated multi-field form (simulated — DummyJSON limitation)
│   ├── ProfilePage.jsx        # Full user info, JWT token display, logout
│   ├── ProductsPage.jsx       # Grid + search + category filter + sort + pagination
│   ├── ProductDetailPage.jsx  # Gallery, reviews, qty selector, add to cart
│   └── CartPage.jsx           # Line items, qty controls, order summary, server sync
│
├── App.jsx                    # BrowserRouter + route tree + auth hydration on load
├── main.jsx
├── index.css                  # CSS design system (variables, animations, resets)
└── components.css             # All component styles
```

---

## Architecture

### JWT Flow
1. `POST /auth/login` returns `{ token, refreshToken, ...user }`
2. Both tokens stored in `localStorage`
3. Axios request interceptor attaches `Authorization: Bearer <token>` to every request
4. Axios response interceptor catches `401` → clears auth → redirects to `/login`
5. On app load, `fetchMe()` rehydrates the user object from `GET /auth/me`
6. `refreshAccessToken()` can be called manually or on expiry to get a new token pair

### Cart Persistence
- Cart state lives in Zustand with `persist` middleware → survives page refresh
- "Sync to Server" button calls `POST /carts/add` or `PUT /carts/:id` to save server-side
- Cart is cleared on logout

### Protected Routes
- `<ProtectedRoute>` wraps `/profile`; redirects to `/login` with `state.from` preserved
- After login, user is sent back to the page they originally requested

### State Management
| Store         | Persisted | Key responsibilities |
|---------------|-----------|----------------------|
| `authStore`   | ✗ (token in localStorage) | login/logout/fetchMe/refresh |
| `cartStore`   | ✓ (`shop-cart`) | items CRUD, server sync |
| `productsStore` | ✗ | fetch/filter/search/paginate |

---

## API Reference (DummyJSON)

| Endpoint | Method | Used for |
|----------|--------|----------|
| `/auth/login` | POST | Login, get JWT |
| `/auth/me` | GET | Fetch current user (JWT required) |
| `/auth/refresh` | POST | Refresh access token |
| `/products` | GET | Paginated product list |
| `/products/:id` | GET | Single product |
| `/products/search?q=` | GET | Search products |
| `/products/categories` | GET | Category list |
| `/products/category/:cat` | GET | Products by category |
| `/carts/user/:userId` | GET | User's carts |
| `/carts/add` | POST | Create cart |
| `/carts/:id` | PUT | Update cart |
| `/carts/:id` | DELETE | Delete cart |

---

## Notes

- **Registration**: DummyJSON has no real `POST /users` registration endpoint. The registration form validates and simulates success, then prompts the user to log in with demo credentials.
- **Cart sync**: DummyJSON cart mutations return success but don't truly persist server-side between sessions. The local Zustand cart is the source of truth.
- **Token expiry**: Default `expiresInMins: 60` is passed at login. Call `refreshAccessToken()` from `authStore` to renew before expiry.

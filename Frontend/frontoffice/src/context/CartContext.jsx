import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const CartContext = createContext({ items: [], addToCart: () => {}, removeFromCart: () => {}, updateQuantity: () => {}, clearCart: () => {}, itemCount: 0 })

const STORAGE_KEY = 'cart_items'

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // Validate items have the expected shape (reject old/corrupt data)
    const valid = parsed.filter(i => i.key && i.productId && i.nom && typeof i.price === 'number')
    if (valid.length !== parsed.length) {
      localStorage.removeItem(STORAGE_KEY)
      return valid
    }
    return valid
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return []
  }
}

function saveCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Quota exceeded — silently ignore, cart still works in memory
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)

  useEffect(() => { saveCart(items) }, [items])

  // Sync across tabs
  useEffect(() => {
    const handler = (e) => {
      if (e.key === STORAGE_KEY) setItems(e.newValue ? JSON.parse(e.newValue) : [])
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const addToCart = useCallback((product, color, size, price, image, quantity = 1) => {
    setItems(prev => {
      const key = `${product.id}-${color}-${size}`
      const existing = prev.find(i => i.key === key)
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i)
      }
      return [...prev, {
        key,
        productId: product.id,
        nom: product.nom,
        slug: product.slug,
        color,
        size,
        price,
        image,
        quantity,
      }]
    })
  }, [])

  const removeFromCart = useCallback((key) => {
    setItems(prev => prev.filter(i => i.key !== key))
  }, [])

  const updateQuantity = useCallback((key, quantity) => {
    if (quantity < 1) return
    setItems(prev => prev.map(i => i.key === key ? { ...i, quantity } : i))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)

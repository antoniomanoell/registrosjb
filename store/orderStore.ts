import { create } from 'zustand'

export interface CartItem {
  itemId: string
  itemName: string
  unitPrice: number
  quantity: number
}

interface OrderStore {
  cart: CartItem[]
  addItem: (item: { id: string; name: string; price: number }) => void
  removeItem: (itemId: string) => void
  decrementItem: (itemId: string) => void
  clearCart: () => void
  total: () => number
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  cart: [],
  addItem: (item) => {
    set((state) => {
      const existing = state.cart.find((c) => c.itemId === item.id)
      if (existing) {
        return {
          cart: state.cart.map((c) =>
            c.itemId === item.id ? { ...c, quantity: c.quantity + 1 } : c
          ),
        }
      }
      return {
        cart: [
          ...state.cart,
          { itemId: item.id, itemName: item.name, unitPrice: item.price, quantity: 1 },
        ],
      }
    })
  },
  removeItem: (itemId) => {
    set((state) => ({ cart: state.cart.filter((c) => c.itemId !== itemId) }))
  },
  decrementItem: (itemId) => {
    set((state) => {
      const item = state.cart.find((c) => c.itemId === itemId)
      if (!item) return state
      if (item.quantity <= 1) {
        return { cart: state.cart.filter((c) => c.itemId !== itemId) }
      }
      return {
        cart: state.cart.map((c) =>
          c.itemId === itemId ? { ...c, quantity: c.quantity - 1 } : c
        ),
      }
    })
  },
  clearCart: () => set({ cart: [] }),
  total: () => {
    const { cart } = get()
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  },
}))

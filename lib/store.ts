import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
    productId: string
    productName: string
    price: number
    username: string
    quantity: number
}

interface CartStore {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (productId: string) => void
    clearCart: () => void
}

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            items: [],
            addItem: (item) => set((state) => ({ items: [...state.items, item] })),
            removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.productId !== id) })),
            clearCart: () => set({ items: [] }),
        }),
        {
            name: 'cart-storage', // unique name for localStorage key
        }
    )
)


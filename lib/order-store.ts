import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Order {
    id: string
    customerId: string
    customerName: string
    customerEmail: string
    whatsapp: string
    productId: string
    productName: string
    amount: number
    status: 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled'
    date: string
    robloxUsername: string
    paymentMethod: string
    redeemCode?: string // Optional field for gift card codes
}

interface OrderStore {
    orders: Order[]
    addOrder: (order: Omit<Order, 'id' | 'date'>) => string
    updateOrderStatus: (id: string, status: Order['status'], redeemCode?: string) => void
    deleteOrder: (id: string) => void
    getOrderById: (id: string) => Order | undefined
    getOrdersByCustomer: (customerId: string) => Order[]
}

const initialOrders: Order[] = [
    {
        id: "ORD-12345",
        customerId: "user-1",
        customerName: "User1",
        customerEmail: "user1@example.com",
        whatsapp: "081234567890",
        productId: "robux-500",
        productName: "500 Robux",
        amount: 50000,
        status: "paid",
        date: new Date().toISOString(),
        robloxUsername: "RobloxUser123",
        paymentMethod: "QRIS"
    },
    {
        id: "ORD-67890",
        customerId: "user-2",
        customerName: "User2",
        customerEmail: "user2@example.com",
        whatsapp: "081298765432",
        productId: "prem-450",
        productName: "Premium 450",
        amount: 60000,
        status: "pending",
        date: new Date(Date.now() - 86400000).toISOString(),
        robloxUsername: "GamerPro456",
        paymentMethod: "Bank Transfer"
    },
    {
        id: "ORD-11223",
        customerId: "user-3",
        customerName: "User3",
        customerEmail: "user3@example.com",
        whatsapp: "081234509876",
        productId: "robux-1000",
        productName: "1000 Robux",
        amount: 95000,
        status: "completed",
        date: new Date(Date.now() - 172800000).toISOString(),
        robloxUsername: "CoolPlayer789",
        paymentMethod: "QRIS",
        redeemCode: "RBX-1234-5678-9012"
    },
]

export const useOrderStore = create<OrderStore>()(
    persist(
        (set, get) => ({
            orders: initialOrders,
            addOrder: (order) => {
                const id = `ORD-${Date.now()}`
                const newOrder: Order = {
                    ...order,
                    id,
                    date: new Date().toISOString()
                }
                set((state) => ({
                    orders: [...state.orders, newOrder]
                }))
                return id
            },
            updateOrderStatus: (id, status, redeemCode) => {
                set((state) => ({
                    orders: state.orders.map((o) =>
                        o.id === id ? { ...o, status, redeemCode: redeemCode || o.redeemCode } : o
                    )
                }))
            },
            deleteOrder: (id) => {
                set((state) => ({
                    orders: state.orders.filter((o) => o.id !== id)
                }))
            },
            getOrderById: (id) => {
                return get().orders.find((o) => o.id === id)
            },
            getOrdersByCustomer: (customerId) => {
                return get().orders.filter((o) => o.customerId === customerId)
            }
        }),
        {
            name: 'order-storage'
        }
    )
)


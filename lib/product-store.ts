import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Product {
    id: string
    name: string
    price: number
    category: string
    description: string
    image: string
    stock: number
    status: 'active' | 'low_stock' | 'out_of_stock'
    sales: number
}

interface ProductStore {
    products: Product[]
    addProduct: (product: Omit<Product, 'id' | 'sales'>) => void
    updateProduct: (id: string, product: Partial<Product>) => void
    deleteProduct: (id: string) => void
    getProductById: (id: string) => Product | undefined
}

const initialProducts: Product[] = [
    // Robux 5 Hari Roblox
    {
        id: "robux-5hari-1",
        name: "1 Robux",
        price: 140,
        category: "Robux 5 Hari",
        description: "Robux 5 Hari Roblox - Proses cepat dan aman",
        image: "/images/robux-5-hari.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-5hari-100",
        name: "100 Robux",
        price: 13800,
        category: "Robux 5 Hari",
        description: "Robux 5 Hari Roblox - Proses cepat dan aman",
        image: "/images/robux-5-hari.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-5hari-500",
        name: "500 Robux",
        price: 70800,
        category: "Robux 5 Hari",
        description: "Robux 5 Hari Roblox - Proses cepat dan aman",
        image: "/images/robux-5-hari.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-5hari-1000",
        name: "1000 Robux",
        price: 140000,
        category: "Robux 5 Hari",
        description: "Robux 5 Hari Roblox - Proses cepat dan aman",
        image: "/images/robux-5-hari.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-5hari-1500",
        name: "1500 Robux",
        price: 212500,
        category: "Robux 5 Hari",
        description: "Robux 5 Hari Roblox - Proses cepat dan aman",
        image: "/images/robux-5-hari.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-5hari-2000",
        name: "2000 Robux",
        price: 283000,
        category: "Robux 5 Hari",
        description: "Robux 5 Hari Roblox - Proses cepat dan aman",
        image: "/images/robux-5-hari.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-5hari-3000",
        name: "3000 Robux",
        price: 425000,
        category: "Robux 5 Hari",
        description: "Robux 5 Hari Roblox - Proses cepat dan aman",
        image: "/images/robux-5-hari.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-5hari-4000",
        name: "4000 Robux",
        price: 566000,
        category: "Robux 5 Hari",
        description: "Robux 5 Hari Roblox - Proses cepat dan aman",
        image: "/images/robux-5-hari.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-5hari-5000",
        name: "5000 Robux",
        price: 707000,
        category: "Robux 5 Hari",
        description: "Robux 5 Hari Roblox - Proses cepat dan aman",
        image: "/images/robux-5-hari.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-5hari-6000",
        name: "6000 Robux",
        price: 849000,
        category: "Robux 5 Hari",
        description: "Robux 5 Hari Roblox - Proses cepat dan aman",
        image: "/images/robux-5-hari.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-5hari-7000",
        name: "7000 Robux",
        price: 990000,
        category: "Robux 5 Hari",
        description: "Robux 5 Hari Roblox - Proses cepat dan aman",
        image: "/images/robux-5-hari.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-5hari-8000",
        name: "8000 Robux",
        price: 1131000,
        category: "Robux 5 Hari",
        description: "Robux 5 Hari Roblox - Proses cepat dan aman",
        image: "/images/robux-5-hari.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-5hari-9000",
        name: "9000 Robux",
        price: 1273000,
        category: "Robux 5 Hari",
        description: "Robux 5 Hari Roblox - Proses cepat dan aman",
        image: "/images/robux-5-hari.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-5hari-10000",
        name: "10000 Robux",
        price: 1420000,
        category: "Robux 5 Hari",
        description: "Robux 5 Hari Roblox - Proses cepat dan aman",
        image: "/images/robux-5-hari.png",
        stock: 100,
        status: 'active',
        sales: 0
    },

    // Robux Gift Card Roblox
    {
        id: "robux-giftcard-100",
        name: "100 Robux",
        price: 49190,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-200",
        name: "200 Robux",
        price: 51500,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-250",
        name: "250 Robux",
        price: 47300,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-400",
        name: "400 Robux",
        price: 77000,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-500",
        name: "500 Robux",
        price: 97800,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-800",
        name: "800 Robux",
        price: 149000,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-1000",
        name: "1000 Robux",
        price: 180000,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-1200",
        name: "1200 Robux",
        price: 230000,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-1500",
        name: "1500 Robux",
        price: 298990,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-1600",
        name: "1600 Robux",
        price: 319940,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-1700",
        name: "1700 Robux",
        price: 345000,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-2000",
        name: "2000 Robux",
        price: 355990,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-2200",
        name: "2200 Robux",
        price: 475000,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-2500",
        name: "2500 Robux",
        price: 487190,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-2700",
        name: "2700 Robux",
        price: 520700,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-3000",
        name: "3000 Robux",
        price: 604990,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-3600",
        name: "3600 Robux",
        price: 788590,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-4000",
        name: "4000 Robux",
        price: 769900,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-4500",
        name: "4500 Robux",
        price: 748000,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-5250",
        name: "5250 Robux",
        price: 1058700,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-7000",
        name: "7000 Robux",
        price: 1451390,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-8000",
        name: "8000 Robux",
        price: 1632300,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-10000",
        name: "10000 Robux",
        price: 1478000,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-11000",
        name: "11000 Robux",
        price: 1921290,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-13000",
        name: "13000 Robux",
        price: 2399690,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-14000",
        name: "14000 Robux",
        price: 2399390,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-16000",
        name: "16000 Robux",
        price: 2885390,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-17000",
        name: "17000 Robux",
        price: 3000100,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-22500",
        name: "22500 Robux",
        price: 3873490,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-24000",
        name: "24000 Robux",
        price: 4185390,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-34000",
        name: "34000 Robux",
        price: 5775190,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-36000",
        name: "36000 Robux",
        price: 6702590,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-giftcard-48000",
        name: "48000 Robux",
        price: 7887290,
        category: "Robux Gift Card",
        description: "Robux Gift Card Roblox - Instant delivery",
        image: "/images/robux-gift-card.png",
        stock: 100,
        status: 'active',
        sales: 0
    },

    // Robux Via Login Roblox
    {
        id: "robux-login-80",
        name: "80 Robux",
        price: 15400,
        category: "Robux Via Login",
        description: "Robux Via Login Roblox - Proses 1-24 jam",
        image: "/images/robux-via-login.png",
        stock: 50,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-login-400",
        name: "400 Robux",
        price: 63000,
        category: "Robux Via Login",
        description: "Robux Via Login Roblox - Proses 1-24 jam",
        image: "/images/robux-via-login.png",
        stock: 50,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-login-500",
        name: "500 Robux",
        price: 75000,
        category: "Robux Via Login",
        description: "Robux Via Login Roblox - Proses 1-24 jam",
        image: "/images/robux-via-login.png",
        stock: 50,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-login-800",
        name: "800 Robux",
        price: 134348,
        category: "Robux Via Login",
        description: "Robux Via Login Roblox - Proses 1-24 jam",
        image: "/images/robux-via-login.png",
        stock: 50,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-login-1000",
        name: "1000 Robux",
        price: 150000,
        category: "Robux Via Login",
        description: "Robux Via Login Roblox - Proses 1-24 jam",
        image: "/images/robux-via-login.png",
        stock: 50,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-login-1500",
        name: "1500 Robux",
        price: 224000,
        category: "Robux Via Login",
        description: "Robux Via Login Roblox - Proses 1-24 jam",
        image: "/images/robux-via-login.png",
        stock: 50,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-login-1700",
        name: "1700 Robux",
        price: 269000,
        category: "Robux Via Login",
        description: "Robux Via Login Roblox - Proses 1-24 jam",
        image: "/images/robux-via-login.png",
        stock: 50,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-login-2000",
        name: "2000 Robux",
        price: 300000,
        category: "Robux Via Login",
        description: "Robux Via Login Roblox - Proses 1-24 jam",
        image: "/images/robux-via-login.png",
        stock: 50,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-login-4500",
        name: "4500 Robux",
        price: 675000,
        category: "Robux Via Login",
        description: "Robux Via Login Roblox - Proses 1-24 jam",
        image: "/images/robux-via-login.png",
        stock: 50,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-login-10000",
        name: "10000 Robux",
        price: 1487384,
        category: "Robux Via Login",
        description: "Robux Via Login Roblox - Proses 1-24 jam",
        image: "/images/robux-via-login.png",
        stock: 50,
        status: 'active',
        sales: 0
    },
    {
        id: "robux-login-22500",
        name: "22500 Robux",
        price: 2969432,
        category: "Robux Via Login",
        description: "Robux Via Login Roblox - Proses 1-24 jam",
        image: "/images/robux-via-login.png",
        stock: 50,
        status: 'active',
        sales: 0
    },
]

export const useProductStore = create<ProductStore>()(
    persist(
        (set, get) => ({
            products: initialProducts,
            addProduct: (product) => {
                const newProduct: Product = {
                    ...product,
                    id: `product-${Date.now()}`,
                    sales: 0
                }
                set((state) => ({
                    products: [...state.products, newProduct]
                }))
            },
            updateProduct: (id, updatedProduct) => {
                set((state) => ({
                    products: state.products.map((p) =>
                        p.id === id ? { ...p, ...updatedProduct } : p
                    )
                }))
            },
            deleteProduct: (id) => {
                set((state) => ({
                    products: state.products.filter((p) => p.id !== id)
                }))
            },
            getProductById: (id) => {
                return get().products.find((p) => p.id === id)
            }
        }),
        {
            name: 'product-storage'
        }
    )
)

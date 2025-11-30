import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'admin' | 'user' | null

interface User {
    id: string
    email: string
    name: string
    role: UserRole
}

interface AuthStore {
    user: User | null
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<boolean>
    logout: () => void
}

// Mock users for demo
const MOCK_USERS = [
    { id: '1', email: 'admin@abibshop.com', password: 'admin123', name: 'Admin', role: 'admin' as UserRole },
    { id: '2', email: 'user@example.com', password: 'user123', name: 'User Demo', role: 'user' as UserRole },
]

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            login: async (email: string, password: string) => {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500))

                const foundUser = MOCK_USERS.find(
                    u => u.email === email && u.password === password
                )

                if (foundUser) {
                    const { password: _, ...userWithoutPassword } = foundUser
                    set({ user: userWithoutPassword, isAuthenticated: true })
                    return true
                }
                return false
            },
            logout: () => set({ user: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage',
        }
    )
)

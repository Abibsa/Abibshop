import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
    id: string
    name: string
    email: string
    password: string
    role: 'admin' | 'user'
    status: 'active' | 'banned' | 'inactive'
    joinDate: string
    lastLogin: string
}

interface UserStore {
    users: User[]
    addUser: (user: Omit<User, 'id' | 'joinDate' | 'lastLogin'>) => void
    updateUser: (id: string, user: Partial<User>) => void
    deleteUser: (id: string) => void
    banUser: (id: string) => void
    unbanUser: (id: string) => void
    getUserById: (id: string) => User | undefined
}

const initialUsers: User[] = [
    {
        id: "admin-1",
        name: "Admin User",
        email: "admin@abibshop.com",
        password: "admin123",
        role: "admin",
        status: "active",
        joinDate: "2023-01-01",
        lastLogin: new Date().toISOString()
    },
    {
        id: "user-1",
        name: "John Doe",
        email: "user@example.com",
        password: "user123",
        role: "user",
        status: "active",
        joinDate: "2023-05-15",
        lastLogin: new Date(Date.now() - 3600000).toISOString()
    },
    {
        id: "user-2",
        name: "Jane Smith",
        email: "jane@example.com",
        password: "user123",
        role: "user",
        status: "active",
        joinDate: "2023-06-20",
        lastLogin: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: "user-3",
        name: "Gamer Pro",
        email: "gamer@example.com",
        password: "user123",
        role: "user",
        status: "active",
        joinDate: "2023-11-10",
        lastLogin: new Date(Date.now() - 7200000).toISOString()
    },
]

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            users: initialUsers,
            addUser: (user) => {
                const newUser: User = {
                    ...user,
                    id: `user-${Date.now()}`,
                    joinDate: new Date().toISOString(),
                    lastLogin: new Date().toISOString()
                }
                set((state) => ({
                    users: [...state.users, newUser]
                }))
            },
            updateUser: (id, updatedUser) => {
                set((state) => ({
                    users: state.users.map((u) =>
                        u.id === id ? { ...u, ...updatedUser } : u
                    )
                }))
            },
            deleteUser: (id) => {
                set((state) => ({
                    users: state.users.filter((u) => u.id !== id)
                }))
            },
            banUser: (id) => {
                set((state) => ({
                    users: state.users.map((u) =>
                        u.id === id ? { ...u, status: 'banned' as const } : u
                    )
                }))
            },
            unbanUser: (id) => {
                set((state) => ({
                    users: state.users.map((u) =>
                        u.id === id ? { ...u, status: 'active' as const } : u
                    )
                }))
            },
            getUserById: (id) => {
                return get().users.find((u) => u.id === id)
            }
        }),
        {
            name: 'user-storage'
        }
    )
)

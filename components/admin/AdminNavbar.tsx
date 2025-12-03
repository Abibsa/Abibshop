"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingCart,
    Settings,
    LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/auth-store"
import { useRouter } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"

export default function AdminNavbar() {
    const pathname = usePathname()
    const router = useRouter()
    const { logout } = useAuthStore()

    const navItems = [
        {
            title: "Dashboard",
            href: "/admin",
            icon: <LayoutDashboard className="h-4 w-4" />
        },
        {
            title: "Pengguna",
            href: "/admin/users",
            icon: <Users className="h-4 w-4" />
        },
        {
            title: "Produk",
            href: "/admin/products",
            icon: <Package className="h-4 w-4" />
        },
        {
            title: "Pesanan",
            href: "/admin/orders",
            icon: <ShoppingCart className="h-4 w-4" />
        },
    ]

    const handleLogout = () => {
        logout()
        router.push("/")
    }

    return (
        <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/admin" className="flex items-center gap-2 font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        <span>Admin Panel</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted",
                                    pathname === item.href
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                {item.icon}
                                {item.title}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ModeToggle />
                    <Button variant="ghost" size="icon" className="text-muted-foreground" asChild>
                        <Link href="/settings">
                            <Settings className="h-5 w-5" />
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </div>
        </nav>
    )
}

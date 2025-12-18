"use client"

import Link from "next/link"
import { ShoppingCart, Menu, User, LogOut, LayoutDashboard, Settings } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { authService } from "@/services/auth.service"
import { useCartStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const { items } = useCartStore()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    // Auth State
    const [user, setUser] = useState<any>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        setMounted(true)

        // Check initial session
        const checkUser = async () => {
            try {
                const { data: { user: authUser } } = await supabase.auth.getUser()
                if (authUser) {
                    const profile = await authService.getProfile(authUser.id)
                    setUser({ ...authUser, ...profile, name: profile.full_name || authUser.email })
                    setIsAuthenticated(true)
                } else {
                    setUser(null)
                    setIsAuthenticated(false)
                }
            } catch (error) {
                console.error("Error checking user:", error)
            }
        }

        checkUser()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const profile = await authService.getProfile(session.user.id)
                setUser({ ...session.user, ...profile, name: profile.full_name || session.user.email })
                setIsAuthenticated(true)
            } else {
                setUser(null)
                setIsAuthenticated(false)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const navLinks = [
        { name: "Beranda", href: "/" },
        { name: "Produk", href: "/products" },
        { name: "Cek Pesanan", href: "/tracking" },
    ]

    const handleLogout = async () => {
        await authService.signOut()
        router.push("/")
        router.refresh()
    }

    const cartItemCount = items.length

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 md:h-16 items-center justify-between px-3 md:px-6">
                {/* Logo */}
                <div className="flex items-center gap-2 md:gap-4">
                    <Link href="/" className="flex items-center">
                        <span className="text-base md:text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            AbibShop
                        </span>
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex md:items-center md:gap-4 lg:gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-xs lg:text-sm font-medium transition-colors hover:text-primary whitespace-nowrap"
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Cart Button - Desktop */}
                    <Button size="sm" variant="outline" asChild className="relative h-8 lg:h-9 text-xs lg:text-sm">
                        <Link href="/checkout">
                            <ShoppingCart className="mr-1.5 lg:mr-2 h-3.5 w-3.5 lg:h-4 lg:w-4" />
                            <span className="hidden lg:inline">Keranjang</span>
                            {mounted && cartItemCount > 0 && (
                                <Badge className="absolute -top-2 -right-2 h-4 w-4 lg:h-5 lg:w-5 p-0 flex items-center justify-center bg-red-500 text-white text-[10px] lg:text-xs border-0">
                                    {cartItemCount}
                                </Badge>
                            )}
                        </Link>
                    </Button>

                    {/* Theme Toggle - Desktop */}
                    <ModeToggle />

                    {/* User Menu - Desktop */}
                    {isAuthenticated && user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="gap-1.5 lg:gap-2 h-8 lg:h-9 text-xs lg:text-sm">
                                    <User className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                                    <span className="max-w-[80px] lg:max-w-none truncate">{user.name}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium truncate">{user.name}</span>
                                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {user.role === 'admin' && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin" className="cursor-pointer">
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            Dashboard Admin
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild>
                                    <Link href="/my-orders" className="cursor-pointer">
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        Pesanan Saya
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/settings" className="cursor-pointer">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Pengaturan
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button size="sm" asChild className="gradient-primary h-8 lg:h-9 text-xs lg:text-sm">
                            <Link href="/login">
                                <User className="mr-1.5 lg:mr-2 h-3.5 w-3.5 lg:h-4 lg:w-4" />
                                Login
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Mobile Menu */}
                <div className="flex md:hidden items-center gap-2">
                    {/* Cart Button - Mobile */}
                    <Button size="icon" variant="ghost" asChild className="relative h-9 w-9">
                        <Link href="/checkout">
                            <ShoppingCart className="h-4 w-4" />
                            {mounted && cartItemCount > 0 && (
                                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-white text-[9px] border-0">
                                    {cartItemCount}
                                </Badge>
                            )}
                        </Link>
                    </Button>


                    {/* Theme Toggle - Mobile */}
                    <ModeToggle />

                    {/* Hamburger Menu */}
                    {mounted && (
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
                                <div className="flex flex-col h-full">
                                    <SheetHeader className="px-6 py-4 border-b">
                                        <SheetTitle>Menu AbibShop</SheetTitle>
                                    </SheetHeader>
                                    <div className="flex-1 overflow-y-auto px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            {/* Navigation Links */}
                                            {navLinks.map((link) => (
                                                <Link
                                                    key={link.name}
                                                    href={link.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className="text-sm font-medium transition-colors hover:text-primary hover:bg-accent px-3 py-2.5 rounded-md"
                                                >
                                                    {link.name}
                                                </Link>
                                            ))}
                                        </div>

                                        {/* User Section */}
                                        {isAuthenticated && user ? (
                                            <div className="border-t pt-4 mt-4">
                                                <div className="px-3 mb-4">
                                                    <p className="text-sm font-medium truncate">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                </div>
                                                {user.role === 'admin' && (
                                                    <Button
                                                        variant="outline"
                                                        className="w-full mb-2 justify-start h-9 text-sm"
                                                        asChild
                                                    >
                                                        <Link href="/admin" onClick={() => setIsOpen(false)}>
                                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                                            Dashboard Admin
                                                        </Link>
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    className="w-full mb-2 justify-start h-9 text-sm"
                                                    asChild
                                                >
                                                    <Link href="/my-orders" onClick={() => setIsOpen(false)}>
                                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                                        Pesanan Saya
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="w-full mb-2 justify-start h-9 text-sm"
                                                    asChild
                                                >
                                                    <Link href="/settings" onClick={() => setIsOpen(false)}>
                                                        <Settings className="mr-2 h-4 w-4" />
                                                        Pengaturan
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    className="w-full h-9 text-sm"
                                                    onClick={() => {
                                                        handleLogout()
                                                        setIsOpen(false)
                                                    }}
                                                >
                                                    <LogOut className="mr-2 h-4 w-4" />
                                                    Logout
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="border-t pt-4 mt-4">
                                                <Button className="w-full gradient-primary h-10" asChild>
                                                    <Link href="/login" onClick={() => setIsOpen(false)}>
                                                        <User className="mr-2 h-4 w-4" />
                                                        Login
                                                    </Link>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    )}
                </div>
            </div>
        </nav >
    )
}

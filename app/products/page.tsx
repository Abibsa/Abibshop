"use client"

import Link from "next/link"
import { useState, useMemo, useEffect, Suspense } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { productService } from "@/services/product.service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Sparkles, ShoppingBag, Package, Loader2 } from "lucide-react"
import { Database } from "@/lib/supabase/database.types"

type Product = Database['public']['Tables']['products']['Row']

function ProductsContent() {
    const searchParams = useSearchParams()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getProducts()
                setProducts(data)
            } catch (error) {
                console.error("Error fetching products:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    useEffect(() => {
        const category = searchParams.get("category")
        if (category) {
            setSelectedCategory(category)
        }
    }, [searchParams])

    const categories = useMemo(() => {
        const uniqueCategories = Array.from(new Set(products.map(p => p.category)))
        return ["All", ...uniqueCategories]
    }, [products])

    const filteredProducts = products.filter((product) => {
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
        // Assuming stock > 0 means available for now
        const isAvailable = product.stock > 0
        return matchesCategory && matchesSearch && isAvailable
    })

    const getCategoryGradient = (category: string) => {
        const gradients: Record<string, string> = {
            "All": "from-blue-600 to-purple-600",
            "Robux": "from-purple-600 to-pink-600",
            "Robux 5 Hari": "from-purple-600 to-pink-600",
            "Robux Gift Card": "from-pink-600 to-red-600",
            "Robux Via Login": "from-orange-600 to-yellow-600",
            "Premium": "from-green-600 to-teal-600",
            "Item": "from-cyan-600 to-blue-600",
        }
        return gradients[category] || "from-blue-600 to-purple-600"
    }

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <section className="relative py-8 md:py-16 overflow-hidden">
                <div className="absolute inset-0 gradient-mesh opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />

                <div className="container relative z-10 px-3 md:px-6">
                    <div className="text-center max-w-3xl mx-auto animate-slide-up">
                        <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 mb-3 md:mb-4 rounded-full bg-primary/10 border border-primary/20">
                            <ShoppingBag className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                            <span className="text-xs md:text-sm font-medium text-primary">Semua Produk</span>
                        </div>
                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Katalog Produk
                            </span>
                        </h1>
                        <p className="text-sm md:text-base lg:text-lg text-muted-foreground px-4">
                            Pilih produk Roblox favoritmu dengan harga terbaik
                        </p>
                    </div>
                </div>
            </section>

            <div className="container py-4 md:py-10 px-3 md:px-6">
                <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6 md:mb-8 justify-between items-center">
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                onClick={() => setSelectedCategory(category)}
                                size="sm"
                                className={`whitespace-nowrap transition-all text-xs md:text-sm h-8 md:h-9 ${selectedCategory === category
                                    ? `bg-gradient-to-r ${getCategoryGradient(category)} text-white hover:opacity-90`
                                    : "hover-lift"
                                    }`}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-2.5 md:left-3 top-2.5 md:top-3 h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari produk..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8 md:pl-10 hover-lift h-9 md:h-10 text-xs md:text-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
                    {filteredProducts.map((product, index) => (
                        <Card
                            key={product.id}
                            className="flex flex-col justify-between hover-lift border-2 group overflow-hidden relative animate-scale-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className={`absolute top-0 right-0 px-2 md:px-3 py-0.5 md:py-1 bg-gradient-to-r ${getCategoryGradient(product.category)} text-white text-[10px] md:text-xs font-bold rounded-bl-lg z-10`}>
                                {product.category}
                            </div>

                            <CardHeader className="pb-2 md:pb-4 px-2 md:px-6 pt-2 md:pt-6">
                                <div className="aspect-[4/3] md:aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-md md:rounded-lg mb-1.5 md:mb-4 flex items-center justify-center text-muted-foreground relative overflow-hidden group-hover:scale-105 transition-transform">
                                    {product.image_url ? (
                                        <Image
                                            src={product.image_url}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                        />
                                    ) : (
                                        <>
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all" />
                                            <Sparkles className="h-5 w-5 md:h-10 md:w-10 lg:h-12 lg:w-12 text-primary relative z-10" />
                                        </>
                                    )}
                                </div>
                                <CardTitle className="text-[11px] md:text-base lg:text-lg group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-0.5">
                                    {product.name}
                                </CardTitle>
                                <CardDescription className="line-clamp-1 text-[9px] md:text-sm leading-tight hidden md:block">
                                    {product.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="pb-1.5 md:pb-4 px-2 md:px-6">
                                <p className="text-xs md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                                    Rp {product.price.toLocaleString("id-ID")}
                                </p>
                                <div className="flex items-center gap-1 md:gap-2 mt-0.5 md:mt-2">
                                    <Package className="h-2 w-2 md:h-4 md:w-4 text-muted-foreground" />
                                    <span className="text-[9px] md:text-sm text-muted-foreground truncate">
                                        {product.category}
                                    </span>
                                </div>
                            </CardContent>

                            <CardFooter className="px-2 md:px-6 pb-2 md:pb-6 pt-0">
                                <Button
                                    asChild
                                    className="w-full gradient-primary group/btn h-7 md:h-10 text-[10px] md:text-sm px-2"
                                    disabled={product.stock <= 0}
                                >
                                    <Link href={`/products/${product.id}`}>
                                        <ShoppingBag className="mr-0.5 md:mr-2 h-2.5 w-2.5 md:h-4 md:w-4" />
                                        <span className="hidden md:inline">Beli Sekarang</span>
                                        <span className="md:hidden">Beli</span>
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12 md:py-20">
                        <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-muted mb-3 md:mb-4">
                            <Search className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-base md:text-xl font-semibold mb-1 md:mb-2">Produk tidak ditemukan</h3>
                        <p className="text-xs md:text-sm text-muted-foreground px-4">Coba kata kunci lain atau pilih kategori berbeda</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <ProductsContent />
        </Suspense>
    )
}

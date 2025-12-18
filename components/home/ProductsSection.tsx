"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Sparkles, ShoppingBag, Loader2 } from "lucide-react"
import { productService } from "@/services/product.service"
import { Database } from "@/lib/supabase/database.types"

type Product = Database['public']['Tables']['products']['Row']

export default function ProductsSection() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getProducts()
                setProducts(data.slice(0, 6)) // Get top 6
            } catch (error) {
                console.error("Error fetching products:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    const popularProducts = products

    const getBadgeGradient = (index: number) => {
        const gradients = [
            "from-blue-600 to-purple-600",
            "from-purple-600 to-pink-600",
            "from-pink-600 to-red-600",
            "from-orange-600 to-yellow-600",
            "from-green-600 to-teal-600",
            "from-cyan-600 to-blue-600",
        ]
        return gradients[index % gradients.length]
    }

    const getBadgeText = (index: number) => {
        const badges = ["Terlaris", "Hemat", "Premium", "Populer", "Best Deal", "Hot"]
        return badges[index % badges.length]
    }

    return (
        <section className="py-8 md:py-16 bg-gradient-to-b from-background to-muted/20">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-8 md:mb-12 animate-slide-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 mb-3 md:mb-4 rounded-full bg-primary/10 border border-primary/20">
                        <ShoppingBag className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                        <span className="text-xs md:text-sm font-medium text-primary">Produk Terpopuler</span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Pilihan Favorit Customer
                        </span>
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
                        Produk Robux terlaris dengan harga terbaik dan proses tercepat
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 max-w-6xl mx-auto">
                    {popularProducts.map((product, index) => (
                        <Card
                            key={product.id}
                            className="hover-lift overflow-hidden border-2 group relative animate-scale-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className={`absolute top-0 right-0 px-2 md:px-3 py-0.5 md:py-1 bg-gradient-to-r ${getBadgeGradient(index)} text-white text-[10px] md:text-xs font-bold rounded-bl-lg z-10`}>
                                {getBadgeText(index)}
                            </div>
                            <CardHeader className="pb-2 md:pb-4 p-3 md:p-6">
                                <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-md md:rounded-lg mb-2 md:mb-4 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform">
                                    {product.image_url ? (
                                        <Image
                                            src={product.image_url}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <>
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all" />
                                            <Sparkles className="h-8 w-8 md:h-12 md:w-12 text-primary relative z-10" />
                                        </>
                                    )}
                                </div>
                                <CardTitle className="text-sm md:text-xl group-hover:text-primary transition-colors line-clamp-1">{product.name}</CardTitle>
                                <CardDescription className="line-clamp-1 text-xs md:text-sm">{product.category}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-3 md:p-6 pt-0">
                                <p className="text-base md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Rp {product.price.toLocaleString("id-ID")}
                                </p>
                            </CardContent>
                            <CardFooter className="p-3 md:p-6 pt-0">
                                <Button className="w-full h-8 md:h-10 text-xs md:text-base group-hover:scale-105 transition-transform gradient-primary" asChild>
                                    <Link href={`/products`}>
                                        <ShoppingBag className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                                        Beli
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="text-center mt-8 md:mt-10 animate-slide-up" style={{ animationDelay: "0.6s" }}>
                    <Button variant="outline" size="lg" asChild className="hover-lift border-2 h-10 md:h-12 text-sm md:text-base">
                        <Link href="/products">
                            Lihat Semua Produk
                            <Sparkles className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}


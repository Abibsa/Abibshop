"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Sparkles, ShoppingBag } from "lucide-react"
import { useProductStore } from "@/lib/product-store"

export default function ProductsSection() {
    const { products } = useProductStore()

    // Get 6 popular products (mix from different categories)
    const popularProducts = products
        .filter(p => p.status === 'active')
        .slice(0, 6)

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
        <section className="py-16 bg-gradient-to-b from-background to-muted/20">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-12 animate-slide-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-primary/10 border border-primary/20">
                        <ShoppingBag className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Produk Terpopuler</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Pilihan Favorit Customer
                        </span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Produk Robux terlaris dengan harga terbaik dan proses tercepat
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {popularProducts.map((product, index) => (
                        <Card
                            key={product.id}
                            className="hover-lift overflow-hidden border-2 group relative animate-scale-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className={`absolute top-0 right-0 px-3 py-1 bg-gradient-to-r ${getBadgeGradient(index)} text-white text-xs font-bold rounded-bl-lg z-10`}>
                                {getBadgeText(index)}
                            </div>
                            <CardHeader className="pb-4">
                                <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all" />
                                    <Sparkles className="h-12 w-12 text-primary relative z-10" />
                                </div>
                                <CardTitle className="text-xl group-hover:text-primary transition-colors">{product.name}</CardTitle>
                                <CardDescription className="line-clamp-1">{product.category}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Rp {product.price.toLocaleString("id-ID")}
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full group-hover:scale-105 transition-transform gradient-primary" asChild>
                                    <Link href={`/products/${product.id}`}>
                                        <ShoppingBag className="mr-2 h-4 w-4" />
                                        Beli Sekarang
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="text-center mt-10 animate-slide-up" style={{ animationDelay: "0.6s" }}>
                    <Button variant="outline" size="lg" asChild className="hover-lift border-2">
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


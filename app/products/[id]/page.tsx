"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { productService } from "@/services/product.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useCartStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShoppingCart, Sparkles, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Database } from "@/lib/supabase/database.types"

type Product = Database['public']['Tables']['products']['Row']

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { addItem } = useCartStore()

    const [product, setProduct] = useState<Product | null>(null)
    const [username, setUsername] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProduct = async () => {
            if (params.id) {
                try {
                    const found = await productService.getProductById(params.id as string)
                    setProduct(found || null)
                } catch (error) {
                    console.error("Error fetching product:", error)
                } finally {
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [params.id])

    const handleBuy = () => {
        if (!username) {
            toast.error("Mohon isi username Roblox Anda!")
            return
        }
        if (product) {
            addItem({
                productId: product.id,
                productName: product.name,
                price: product.price,
                username: username,
                quantity: 1,
            })
            router.push("/checkout")
        }
    }

    const handleAddToCart = () => {
        if (!username) {
            toast.error("Mohon isi username Roblox Anda!")
            return
        }
        if (product) {
            addItem({
                productId: product.id,
                productName: product.name,
                price: product.price,
                username: username,
                quantity: 1,
            })
            toast.success("Produk berhasil ditambahkan ke keranjang!")
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="container py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h2>
                <Button asChild>
                    <Link href="/products">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Katalog
                    </Link>
                </Button>
            </div>
        )
    }

    const getStatusBadge = () => {
        if (product.stock <= 0) {
            return <Badge variant="destructive">Stok Habis</Badge>
        }
        if (product.stock < 10) {
            return <Badge className="bg-yellow-500 hover:bg-yellow-600">Stok Terbatas</Badge>
        }
        return <Badge className="bg-green-500 hover:bg-green-600">Tersedia</Badge>
    }

    return (
        <div className="min-h-screen">
            {/* Header with Gradient */}
            <section className="relative py-8 overflow-hidden border-b">
                <div className="absolute inset-0 gradient-mesh opacity-20" />
                <div className="container relative z-10 px-4 md:px-6">
                    <Button variant="ghost" asChild className="mb-4">
                        <Link href="/products">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Katalog
                        </Link>
                    </Button>
                </div>
            </section>

            <div className="container py-10 px-4 md:px-6 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Image Section */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl flex items-center justify-center relative overflow-hidden group border-2 shadow-lg">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all" />
                            <Sparkles className="h-32 w-32 text-primary relative z-10" />
                        </div>
                        <Card className="border-2">
                            <CardHeader>
                                <CardTitle className="text-sm">Informasi Penting</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground space-y-2">
                                <div className="flex items-start gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                                    <p>Proses otomatis 24/7</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                                    <p>100% aman dan legal</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                                    <p>Customer service siap membantu</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Details Section */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">{product.category}</Badge>
                                {getStatusBadge()}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {product.name}
                            </h1>
                            <p className="text-3xl md:text-4xl font-bold text-primary">
                                Rp {product.price.toLocaleString("id-ID")}
                            </p>
                        </div>

                        <Card className="border-2 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-b">
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5 text-primary" />
                                    Form Pemesanan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <p className="text-sm text-muted-foreground">{product.description}</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-base font-semibold">
                                        Username Roblox <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="username"
                                        placeholder="Masukkan username Roblox..."
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="text-base h-12"
                                    />
                                    <p className="text-xs text-muted-foreground flex items-start gap-1">
                                        <span className="text-yellow-600">⚠️</span>
                                        Pastikan username benar. Kesalahan input bukan tanggung jawab kami.
                                    </p>
                                </div>

                                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                        Cara Pemesanan:
                                    </h4>
                                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                                        <li>Masukkan Username Roblox dengan benar</li>
                                        <li>Klik tombol "Beli Sekarang"</li>
                                        <li>Lakukan pembayaran sesuai instruksi</li>
                                        <li>Tunggu proses selesai (10-30 menit)</li>
                                    </ol>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="w-full text-base h-12 border-primary text-primary hover:bg-primary/10"
                                        onClick={handleAddToCart}
                                        disabled={product.stock <= 0}
                                    >
                                        <ShoppingCart className="mr-2 h-5 w-5" />
                                        + Keranjang
                                    </Button>
                                    <Button
                                        size="lg"
                                        className="w-full text-base h-12 gradient-primary hover:opacity-90 transition-opacity"
                                        onClick={handleBuy}
                                        disabled={product.stock <= 0}
                                    >
                                        Beli Langsung
                                    </Button>
                                </div>
                                {product.stock > 0 && (
                                    <p className="text-xs text-center text-muted-foreground">
                                        Stok tersedia: {product.stock} unit
                                    </p>
                                )}
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

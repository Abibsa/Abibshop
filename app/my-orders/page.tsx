"use client"

import { useEffect, useState } from "react"
import { authService } from "@/services/auth.service"
import { orderService } from "@/services/order.service"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Loader2, Search, ArrowRight, CheckCircle, Copy, Clock, Key } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Database } from "@/lib/supabase/database.types"

type Order = Database['public']['Tables']['orders']['Row']

export default function MyOrdersPage() {
    const router = useRouter()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [copiedId, setCopiedId] = useState<string | null>(null)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const user = await authService.getCurrentUser()
                if (!user) {
                    router.push("/login")
                    return
                }

                const { orders: allOrders } = await orderService.getOrders()
                // Filter client side for now as RLS might return everything depending on setup
                // Ideally backend should filter, but let's be safe
                const userOrders = allOrders.filter((o: any) => o.user_id === user.id || o.customer_email === user.email)

                // Sort by date desc
                userOrders.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

                setOrders(userOrders)
            } catch (error) {
                console.error("Error fetching orders:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [router])

    const filteredOrders = orders.filter(order =>
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(text)
        setTimeout(() => setCopiedId(null), 2000)
    }

    if (loading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-muted/40 py-8 lg:py-12">
            <div className="container px-4 md:px-6 max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Pesanan Saya</h1>
                        <p className="text-muted-foreground mt-1">
                            Riwayat pembelian dan status pesanan Anda
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/products">
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Belanja Lagi
                        </Link>
                    </Button>
                </div>

                {orders.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center py-16 text-center animate-scale-in">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Belum ada pesanan</h3>
                        <p className="text-muted-foreground max-w-sm mb-6">
                            Anda belum melakukan pembelian apapun. Yuk mulai belanja kebutuhan game Anda!
                        </p>
                        <Button size="lg" className="gradient-primary hover-lift" asChild>
                            <Link href="/products">Lihat Produk</Link>
                        </Button>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari pesanan (ID Order atau Nama Produk)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-background"
                            />
                        </div>

                        <div className="grid gap-4">
                            {filteredOrders.map((order, index) => (
                                <Card key={order.id} className={`overflow-hidden hover:shadow-md transition-shadow animate-slide-up`} style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-bold text-lg">{order.order_number}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => copyToClipboard(order.order_number)}
                                                    >
                                                        {copiedId === order.order_number ? (
                                                            <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                                                        ) : (
                                                            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                                        )}
                                                    </Button>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    <span>{new Date(order.created_at).toLocaleString('id-ID')}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    className={`
                                                        ${order.status === 'completed' && 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200'}
                                                        ${order.status === 'processing' && 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200'}
                                                        ${order.status === 'pending' && 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200'}
                                                        ${order.status === 'cancelled' && 'bg-red-100 text-red-700 hover:bg-red-100 border-red-200'}
                                                        px-3 py-1 text-xs font-semibold uppercase tracking-wider
                                                    `}
                                                    variant="outline"
                                                >
                                                    {order.status === 'completed' && "Selesai"}
                                                    {order.status === 'processing' && "Diproses"}
                                                    {order.status === 'pending' && "Menunggu Pembayaran"}
                                                    {order.status === 'cancelled' && "Dibatalkan"}
                                                    {order.status === 'failed' && "Gagal"}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 py-4 border-t border-b border-dashed my-4">
                                            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-2xl">
                                                📦
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-lg">{order.product_name}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Roblox User: {order.game_username}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-muted-foreground">Total Pembayaran</p>
                                                <p className="font-bold text-lg text-primary">
                                                    Rp {order.total_amount.toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                                {order.payment_method && (
                                                    <div className="text-xs px-2.5 py-1 rounded-full bg-muted border font-medium uppercase">
                                                        {order.payment_method}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                                <Button variant="outline" size="sm" className="flex-1 sm:flex-none" asChild>
                                                    <Link href={`/order/${order.order_number}`}>
                                                        Detail Pesanan <ArrowRight className="ml-2 h-3 w-3" />
                                                    </Link>
                                                </Button>
                                                {order.status === 'pending' && (
                                                    <Button size="sm" className="flex-1 sm:flex-none gradient-primary" asChild>
                                                        <Link href={`/order/${order.order_number}`}>
                                                            Bayar Sekarang
                                                        </Link>
                                                    </Button>
                                                )}
                                                {order.status === 'completed' && (
                                                    <Button size="sm" variant="secondary" className="flex-1 sm:flex-none" asChild>
                                                        <Link href={`/products`}>
                                                            Beli Lagi
                                                        </Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

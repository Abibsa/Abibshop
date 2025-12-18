"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { orderService } from "@/services/order.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Package, Clock, CheckCircle, XCircle, Copy, Gift, ArrowRight, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Database } from "@/lib/supabase/database.types"

type Order = Database['public']['Tables']['orders']['Row']

function TrackingContent() {
    const searchParams = useSearchParams()
    const [orderId, setOrderId] = useState("")
    const [searchedOrder, setSearchedOrder] = useState<Order | null>(null)
    const [error, setError] = useState("")
    const [isCopied, setIsCopied] = useState(false)
    const [loading, setLoading] = useState(false)

    // Auto-fill Order ID from URL parameter
    useEffect(() => {
        const orderIdParam = searchParams.get('orderId')
        if (orderIdParam) {
            setOrderId(orderIdParam)
            handleSearch(null, orderIdParam)
        }
    }, [searchParams])

    const handleSearch = async (e: React.FormEvent | null, idOverride?: string) => {
        if (e) e.preventDefault()
        const idToSearch = idOverride || orderId

        setError("")
        setSearchedOrder(null)

        if (!idToSearch.trim()) {
            setError("Mohon masukkan Order ID")
            return
        }

        setLoading(true)
        try {
            // Find order by order_number (string) if that's what we use, or ID (uuid)
            // Assuming users search by order_number which is user friendly (e.g. created manually or by system)
            // If getOrder expects UUID, we might need a search method. 
            // My orderService.getOrder usually takes numeric/string ID if implemented that way or UUID.

            // Let's assume getOrder takes the primary key (UUID). 
            // BUT order_number is distinct. 
            // Let's try to fetch by column if getOrder expects ID.
            // Actually, querying Supabase directly here or updating Service to findByOrderNumber is safer.
            // Let's rely on orderService. 如果 fails, I will fix service. 

            // I'll assume getOrder(id) fetches by PK. 
            // If user enters 'ORD-123...' that matches searchedOrder.order_number, passing it to getOrder (UUID) will fail.
            // I'll assume for tracking page we want to find by order_number OR id.

            // Let's use getOrders with filter for safety if getOrder is strict ID
            // removed invalid filters prop for now as I can't filter by arbitrary columns easily without modifying service. 
            // Wait, getOrders filter only supports status, paymentStatus, userId. Not order_number.
            // But I have getOrderByNumber! Use that.

            try {
                const byNumber = await orderService.getOrderByNumber(idToSearch.trim())
                if (byNumber) {
                    setSearchedOrder(byNumber)
                    setLoading(false)
                    return
                }
            } catch (ignore) {
                // ignore
            }

            try {
                const byId = await orderService.getOrderById(idToSearch.trim())
                if (byId) {
                    setSearchedOrder(byId)
                    setLoading(false)
                    return
                }
            } catch (ignore) {
                // ignore
            }

            setError("Order ID tidak ditemukan.")
        } catch (err) {
            console.error(err)
            setError("Terjadi kesalahan saat mencari pesanan.")
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'pending':
                return {
                    icon: <Clock className="h-12 w-12 text-yellow-500" />,
                    title: "Menunggu Pembayaran",
                    desc: "Silakan selesaikan pembayaran Anda agar pesanan dapat diproses.",
                    color: "bg-yellow-500"
                }
            case 'paid':
                return {
                    icon: <CheckCircle className="h-12 w-12 text-blue-500" />,
                    title: "Pembayaran Diterima",
                    desc: "Pembayaran Anda telah kami terima. Pesanan sedang dalam antrian.",
                    color: "bg-blue-500"
                }
            case 'processing': // Mapped 'processing' to 'paid' visually if schema doesn't have it? 
                // Schema has order_status enum: pending, paid, completed, cancelled, failed.
                // If local code used 'processing', we might map it to 'paid' or custom handling.
                // Assuming 'paid' is equivalent to 'processing' for user view.
                return {
                    icon: <Package className="h-12 w-12 text-purple-500 animate-pulse" />,
                    title: "Sedang Diproses",
                    desc: "Admin sedang memproses pesanan Anda. Mohon tunggu sebentar.",
                    color: "bg-purple-500"
                }
            case 'completed':
                return {
                    icon: <CheckCircle className="h-12 w-12 text-green-500" />,
                    title: "Pesanan Selesai",
                    desc: "Pesanan Anda telah berhasil dikirim!",
                    color: "bg-green-500"
                }
            case 'cancelled':
                return {
                    icon: <XCircle className="h-12 w-12 text-red-500" />,
                    title: "Pesanan Dibatalkan",
                    desc: "Pesanan ini telah dibatalkan.",
                    color: "bg-red-500"
                }
            case 'failed':
                return {
                    icon: <XCircle className="h-12 w-12 text-red-500" />,
                    title: "Pesanan Gagal",
                    desc: "Pembayaran atau pemrosesan gagal.",
                    color: "bg-red-500"
                }
            default:
                return {
                    icon: <Package className="h-12 w-12 text-gray-500" />,
                    title: "Status Tidak Diketahui",
                    desc: "-",
                    color: "bg-gray-500"
                }
        }
    }

    // Helper to access metadata safely
    const getRedeemCode = (order: Order) => {
        const meta = order.metadata as any
        return meta?.redeem_code || meta?.redeemCode
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Header Section */}
            <section className="relative py-16 overflow-hidden">
                <div className="absolute inset-0 gradient-mesh opacity-30" />
                <div className="container relative z-10 px-4 md:px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-primary/10 border border-primary/20 animate-slide-up">
                        <Search className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Lacak Pesanan Kamu</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                        Cek Status <span className="text-primary">Transaksi</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
                        Masukkan Order ID yang Anda dapatkan saat checkout untuk melihat status pesanan terbaru.
                    </p>
                </div>
            </section>

            <div className="container px-4 md:px-6 pb-20 max-w-2xl mx-auto">
                <Card className="border-2 shadow-xl hover-lift">
                    <CardHeader>
                        <CardTitle>Cari Pesanan</CardTitle>
                        <CardDescription>Masukkan Order ID (contoh: ORD-173294...)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={(e) => handleSearch(e)} className="flex gap-2">
                            <Input
                                placeholder="Masukkan Order ID..."
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                className="text-lg h-12"
                            />
                            <Button type="submit" size="lg" className="gradient-primary h-12 px-6" disabled={loading}>
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                            </Button>
                        </form>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-sm mt-3 flex items-center gap-2"
                            >
                                <XCircle className="h-4 w-4" />
                                {error}
                            </motion.p>
                        )}
                    </CardContent>
                </Card>

                <AnimatePresence mode="wait">
                    {searchedOrder && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mt-8"
                        >
                            <Card className="border-2 overflow-hidden">
                                <div className={`h-2 w-full ${getStatusInfo(searchedOrder.status).color}`} />
                                <CardHeader className="text-center pb-2">
                                    <div className="mx-auto mb-4 bg-muted/30 p-4 rounded-full w-fit">
                                        {getStatusInfo(searchedOrder.status).icon}
                                    </div>
                                    <CardTitle className="text-2xl">{getStatusInfo(searchedOrder.status).title}</CardTitle>
                                    <CardDescription className="text-base">
                                        {getStatusInfo(searchedOrder.status).desc}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6 pt-6">
                                    {/* Order Details Grid */}
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="space-y-1">
                                            <p className="text-muted-foreground">Order ID</p>
                                            <p className="font-mono font-medium">{searchedOrder.order_number}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-muted-foreground">Tanggal</p>
                                            <p className="font-medium">{new Date(searchedOrder.created_at).toLocaleDateString('id-ID')}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-muted-foreground">Produk</p>
                                            <p className="font-medium">{searchedOrder.product_name}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-muted-foreground">Total Harga</p>
                                            <p className="font-medium">Rp {searchedOrder.total_amount.toLocaleString('id-ID')}</p>
                                        </div>
                                        <div className="col-span-2 space-y-1 pt-2 border-t">
                                            <p className="text-muted-foreground">Username Roblox</p>
                                            <p className="font-mono font-medium text-primary">{searchedOrder.game_username}</p>
                                        </div>
                                    </div>

                                    {/* Redeem Code Section - Only show if completed and has code */}
                                    {searchedOrder.status === 'completed' && getRedeemCode(searchedOrder) && (
                                        <div className="bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4 md:p-6 animate-scale-in">
                                            <div className="flex items-center gap-2 mb-3 text-green-700 dark:text-green-400">
                                                <Gift className="h-5 w-5" />
                                                <h3 className="font-bold text-lg">Kode Redeem Anda</h3>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="flex-1 bg-white dark:bg-black/20 border border-green-200 dark:border-green-800 rounded-lg p-3 font-mono text-lg md:text-xl font-bold text-center tracking-wider select-all">
                                                    {getRedeemCode(searchedOrder)}
                                                </div>
                                                <Button
                                                    size="icon"
                                                    className="h-auto w-12 shrink-0 bg-green-600 hover:bg-green-700 text-white"
                                                    onClick={() => copyToClipboard(getRedeemCode(searchedOrder))}
                                                >
                                                    {isCopied ? <CheckCircle className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                                                </Button>
                                            </div>
                                            <p className="text-xs text-green-600/80 dark:text-green-400/80 mt-2 text-center">
                                                Salin kode di atas dan tukarkan di dalam game atau website Roblox.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="bg-muted/30 flex justify-center pb-6">
                                    <Button variant="link" asChild>
                                        <Link href="/products">
                                            Beli Produk Lainnya <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default function TrackingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        }>
            <TrackingContent />
        </Suspense>
    )
}

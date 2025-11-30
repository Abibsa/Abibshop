"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { useOrderStore } from "@/lib/order-store"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Copy, CheckCircle, ArrowLeft, Clock, XCircle } from "lucide-react"
import Link from "next/link"

export default function MyOrdersPage() {
    const { user, isAuthenticated } = useAuthStore()
    const { orders } = useOrderStore()
    const router = useRouter()
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (mounted && !isAuthenticated) {
            router.push('/login')
        }
    }, [isAuthenticated, router, mounted])

    if (!mounted || !isAuthenticated || !user) {
        return null
    }

    const myOrders = orders.filter(order =>
        order.customerEmail === user.email || order.customerId === user.id
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(text)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { label: 'Menunggu', color: 'bg-yellow-500', icon: Clock },
            paid: { label: 'Dibayar', color: 'bg-blue-500', icon: Package },
            processing: { label: 'Diproses', color: 'bg-purple-500', icon: Package },
            completed: { label: 'Selesai', color: 'bg-green-500', icon: CheckCircle },
            cancelled: { label: 'Dibatalkan', color: 'bg-red-500', icon: XCircle },
        }
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
        const Icon = config.icon

        return (
            <Badge className={`${config.color} text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5`}>
                <Icon className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                {config.label}
            </Badge>
        )
    }

    return (
        <div className="min-h-screen">
            <section className="relative py-4 md:py-8 overflow-hidden border-b">
                <div className="absolute inset-0 gradient-mesh opacity-20" />
                <div className="container relative z-10 px-3 md:px-6">
                    <Button variant="ghost" asChild className="mb-2 md:mb-4 h-8 md:h-10 text-xs md:text-sm">
                        <Link href="/">
                            <ArrowLeft className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                            Kembali
                        </Link>
                    </Button>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Pesanan Saya
                    </h1>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">Riwayat semua pesanan Anda</p>
                </div>
            </section>

            <div className="container py-4 md:py-10 px-3 md:px-6 max-w-4xl">
                {myOrders.length === 0 ? (
                    <Card className="border-2">
                        <CardContent className="flex flex-col items-center justify-center py-12 md:py-16 px-4">
                            <Package className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mb-3 md:mb-4" />
                            <h2 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">Belum Ada Pesanan</h2>
                            <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6 text-center">Anda belum memiliki riwayat pesanan</p>
                            <Button asChild className="gradient-primary h-9 md:h-10 text-xs md:text-sm">
                                <Link href="/products">
                                    <Package className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                                    Mulai Belanja
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3 md:space-y-4">
                        <div className="flex items-center justify-between mb-3 md:mb-6">
                            <p className="text-xs md:text-sm text-muted-foreground">
                                Total {myOrders.length} pesanan
                            </p>
                        </div>

                        {myOrders.map((order) => (
                            <Card key={order.id} className="border-2 hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-2 md:pb-3 px-3 md:px-6 pt-3 md:pt-6">
                                    <div className="flex items-start justify-between gap-2 md:gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 mb-1 md:mb-2">
                                                <CardTitle className="text-sm md:text-lg truncate">{order.productName}</CardTitle>
                                                {getStatusBadge(order.status)}
                                            </div>
                                            <CardDescription className="space-y-0.5 md:space-y-1">
                                                <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                                                    <span className="font-mono text-[10px] md:text-xs bg-muted px-1.5 md:px-2 py-0.5 md:py-1 rounded break-all">
                                                        {order.id}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-5 w-5 md:h-6 md:w-6"
                                                        onClick={() => copyToClipboard(order.id)}
                                                    >
                                                        {copiedId === order.id ? (
                                                            <CheckCircle className="h-2.5 w-2.5 md:h-3 md:w-3 text-green-600" />
                                                        ) : (
                                                            <Copy className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                                        )}
                                                    </Button>
                                                </div>
                                                <p className="text-[10px] md:text-xs">
                                                    {new Date(order.date).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </CardDescription>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-base md:text-xl lg:text-2xl font-bold text-primary">
                                                Rp {order.amount.toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0 px-3 md:px-6 pb-3 md:pb-6">
                                    <div className="grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm mb-3 md:mb-4">
                                        <div>
                                            <p className="text-muted-foreground text-[10px] md:text-xs">Username Roblox</p>
                                            <p className="font-mono font-semibold text-xs md:text-sm truncate">{order.robloxUsername}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-[10px] md:text-xs">Metode Pembayaran</p>
                                            <p className="font-semibold text-xs md:text-sm truncate">{order.paymentMethod}</p>
                                        </div>
                                    </div>

                                    {order.status === 'completed' && order.redeemCode && (
                                        <div className="bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-2.5 md:p-4 mb-3 md:mb-4">
                                            <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                                                <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                                                <p className="font-semibold text-xs md:text-sm text-green-900 dark:text-green-100">
                                                    Kode Redeem
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1.5 md:gap-2">
                                                <code className="flex-1 bg-white dark:bg-gray-900 px-2 md:px-3 py-1.5 md:py-2 rounded border font-mono text-sm md:text-base lg:text-lg font-bold text-green-600 break-all">
                                                    {order.redeemCode}
                                                </code>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0"
                                                    onClick={() => copyToClipboard(order.redeemCode!)}
                                                >
                                                    {copiedId === order.redeemCode ? (
                                                        <CheckCircle className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-600" />
                                                    ) : (
                                                        <Copy className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full h-9 md:h-10 text-xs md:text-sm"
                                    >
                                        <Link href={`/tracking?orderId=${order.id}`}>
                                            <Package className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                                            Lihat Detail Pesanan
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

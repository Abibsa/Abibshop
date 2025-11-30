"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { useProductStore } from "@/lib/product-store"
import { useOrderStore } from "@/lib/order-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DollarSign,
    ShoppingCart,
    Clock,
    CheckCircle,
    Eye,
    Edit,
    Trash2,
    TrendingUp,
} from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
    const router = useRouter()
    const { user, isAuthenticated } = useAuthStore()
    const { orders } = useOrderStore()
    const { products } = useProductStore()

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'admin') {
            router.push('/login')
        }
    }, [isAuthenticated, user, router])

    const stats = {
        totalRevenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.amount, 0),
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        completedOrders: orders.filter(o => o.status === 'completed').length,
    }

    const statsCards = [
        {
            title: "Total Revenue",
            value: `Rp ${stats.totalRevenue.toLocaleString('id-ID')}`,
            description: "Dari pesanan selesai",
            icon: <DollarSign className="h-5 w-5" />,
            gradient: "from-green-500 to-emerald-500",
            bgGradient: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
        },
        {
            title: "Total Orders",
            value: stats.totalOrders.toString(),
            description: "Semua pesanan",
            icon: <ShoppingCart className="h-5 w-5" />,
            gradient: "from-blue-500 to-cyan-500",
            bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20"
        },
        {
            title: "Pending",
            value: stats.pendingOrders.toString(),
            description: "Menunggu pembayaran",
            icon: <Clock className="h-5 w-5" />,
            gradient: "from-orange-500 to-yellow-500",
            bgGradient: "from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20"
        },
        {
            title: "Completed",
            value: stats.completedOrders.toString(),
            description: "Pesanan selesai",
            icon: <CheckCircle className="h-5 w-5" />,
            gradient: "from-purple-500 to-pink-500",
            bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20"
        },
    ]

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
            pending: { variant: "outline", label: "Pending" },
            paid: { variant: "default", label: "Paid" },
            processing: { variant: "secondary", label: "Processing" },
            completed: { variant: "secondary", label: "Completed" },
        }
        const config = variants[status] || { variant: "outline", label: status }
        return <Badge variant={config.variant}>{config.label}</Badge>
    }

    if (!isAuthenticated || user?.role !== 'admin') {
        return null
    }

    // Get recent orders (last 5)
    const recentOrders = orders.slice(0, 5)

    return (
        <div className="container py-10 px-4 md:px-6">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard Admin</h1>
                <p className="text-muted-foreground">Selamat datang kembali, {user?.name}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsCards.map((stat, index) => (
                    <Card
                        key={index}
                        className={`hover-lift border-2 overflow-hidden relative animate-scale-in bg-gradient-to-br ${stat.bgGradient}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}>
                                {stat.icon}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Orders Table */}
            <Card className="border-2 shadow-lg hover-lift">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl">Pesanan Terbaru</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">Daftar pesanan terkini dari customer</p>
                        </div>
                        <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="font-semibold">Order ID</TableHead>
                                    <TableHead className="font-semibold">Customer</TableHead>
                                    <TableHead className="font-semibold">Product</TableHead>
                                    <TableHead className="font-semibold">Username Roblox</TableHead>
                                    <TableHead className="font-semibold">Amount</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold">Date</TableHead>
                                    <TableHead className="text-right font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentOrders.map((order) => (
                                    <TableRow
                                        key={order.id}
                                        className="hover:bg-muted/50 transition-colors"
                                    >
                                        <TableCell className="font-medium font-mono text-sm">{order.id}</TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{order.customerName}</p>
                                                <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{order.productName}</TableCell>
                                        <TableCell className="font-mono text-sm text-primary">{order.robloxUsername}</TableCell>
                                        <TableCell className="font-semibold">Rp {order.amount.toLocaleString('id-ID')}</TableCell>
                                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString('id-ID')}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button size="sm" variant="ghost" className="hover:bg-blue-100 dark:hover:bg-blue-900/20" asChild>
                                                    <Link href={`/admin/orders`}>
                                                        <Eye className="h-4 w-4 text-blue-600" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/services/auth.service"
import { orderService } from "@/services/order.service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, ShoppingCart, Filter, Eye, Edit, Trash2, Gift, Loader2 } from "lucide-react"
import { Database } from "@/lib/supabase/database.types"
import { toast } from "sonner"

type Order = Database['public']['Tables']['orders']['Row']

export default function AdminOrdersPage() {
    const router = useRouter()

    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [newStatus, setNewStatus] = useState("")
    const [redeemCode, setRedeemCode] = useState("") // Keeping redeemCode state although not in DB, for potential metadata usage

    useEffect(() => {
        const init = async () => {
            try {
                const user = await authService.getCurrentUser()
                const isAdmin = user ? await authService.isAdmin(user.id) : false

                if (!isAdmin) {
                    router.push('/login')
                    return
                }

                const { orders: data } = await orderService.getOrders()
                // Sort by new
                const sorted = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                setOrders(sorted)
            } catch (error) {
                console.error("Error loading orders:", error)
            } finally {
                setLoading(false)
            }
        }
        init()
    }, [router])

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.game_username.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === "all" || order.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
            pending: { variant: "outline", label: "Pending" },
            paid: { variant: "default", label: "Paid" },
            processing: { variant: "secondary", label: "Processing" },
            completed: { variant: "secondary", label: "Completed" },
            cancelled: { variant: "destructive", label: "Cancelled" },
            failed: { variant: "destructive", label: "Failed" }
        }
        const config = variants[status] || { variant: "outline", label: status }
        return <Badge variant={config.variant}>{config.label}</Badge>
    }

    const handleEditOrder = (order: Order) => {
        setSelectedOrder(order)
        setNewStatus(order.status)
        // Check metadata for redeem code if needed
        const metadata = order.metadata as any
        setRedeemCode(metadata?.redeem_code || "")
        setIsEditDialogOpen(true)
    }

    const handleUpdateStatus = async () => {
        if (selectedOrder) {
            try {
                // Prepare metadata if redeem code is present
                const currentMeta = (selectedOrder.metadata as any) || {}
                const updates: any = { status: newStatus as any }

                if (newStatus === 'completed' && redeemCode) {
                    updates.metadata = { ...currentMeta, redeem_code: redeemCode }
                }

                await orderService.updateOrder(selectedOrder.id, updates)

                // Refresh list
                const { orders: data } = await orderService.getOrders()
                const sorted = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                setOrders(sorted)

                setIsEditDialogOpen(false)
                toast.success("Status pesanan berhasil diperbarui")
            } catch (error) {
                console.error("Error updating order:", error)
                toast.error("Gagal memperbarui pesanan")
            }
        }
    }

    const handleDeleteOrder = async (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus pesanan ini?")) {
            try {
                await orderService.deleteOrder(id)
                setOrders(orders.filter(o => o.id !== id))
                toast.success("Pesanan dihapus")
            } catch (error) {
                console.error("Error deleting order:", error)
                toast.error("Gagal menghapus pesanan")
            }
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="container py-10 px-4 md:px-6">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Kelola Pesanan</h1>
                <p className="text-muted-foreground">Pantau dan kelola semua transaksi pelanggan</p>
            </div>

            {/* Filters */}
            <Card className="border-2 shadow-lg mb-6">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari order ID, customer, atau username..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Filter Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Orders Table */}
            <Card className="border-2 shadow-lg">
                <CardHeader className="border-b bg-muted/30">
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                        Daftar Pesanan ({filteredOrders.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.map((order) => (
                                    <TableRow key={order.id} className="hover:bg-muted/50">
                                        <TableCell className="font-medium font-mono text-sm">{order.order_number}</TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{order.customer_name}</p>
                                                <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{order.product_name}</span>
                                                {(order.metadata as any)?.redeem_code && (
                                                    <span className="text-xs text-green-600 flex items-center gap-1">
                                                        <Gift className="h-3 w-3" /> Code Sent
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm text-primary">{order.game_username}</TableCell>
                                        <TableCell className="text-sm uppercase">{order.payment_method || '-'}</TableCell>
                                        <TableCell className="font-semibold">Rp {order.total_amount.toLocaleString('id-ID')}</TableCell>
                                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(order.created_at).toLocaleDateString('id-ID')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="hover:bg-purple-100 dark:hover:bg-purple-900/20"
                                                    onClick={() => handleEditOrder(order)}
                                                >
                                                    <Edit className="h-4 w-4 text-purple-600" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="hover:bg-red-100 dark:hover:bg-red-900/20"
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {filteredOrders.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            Tidak ada pesanan ditemukan
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Order Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Status Pesanan</DialogTitle>
                        <DialogDescription>
                            Ubah status pesanan {selectedOrder?.order_number}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Customer</Label>
                            <p className="text-sm font-medium">{selectedOrder?.customer_name}</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Product</Label>
                            <p className="text-sm font-medium">{selectedOrder?.product_name}</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Username Roblox</Label>
                            <p className="text-sm font-mono">{selectedOrder?.game_username}</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={newStatus} onValueChange={setNewStatus}>
                                <SelectTrigger id="status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                    <SelectItem value="failed">Failed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {newStatus === 'completed' && (
                            <div className="space-y-2 animate-slide-up">
                                <Label htmlFor="redeemCode" className="flex items-center gap-2 text-green-600">
                                    <Gift className="h-4 w-4" />
                                    Kode Redeem (Opsional)
                                </Label>
                                <Input
                                    id="redeemCode"
                                    placeholder="Masukkan kode gift card..."
                                    value={redeemCode}
                                    onChange={(e) => setRedeemCode(e.target.value)}
                                    className="border-green-200 focus:border-green-500"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Kode ini akan muncul di halaman tracking customer
                                </p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleUpdateStatus} className="gradient-primary">
                            Simpan Perubahan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

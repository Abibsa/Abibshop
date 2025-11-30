"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { useOrderStore } from "@/lib/order-store"
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
import { Search, ShoppingCart, Filter, Eye, Edit, Trash2, Gift } from "lucide-react"

export default function AdminOrdersPage() {
    const router = useRouter()
    const { user, isAuthenticated } = useAuthStore()
    const { orders, updateOrderStatus, deleteOrder } = useOrderStore()
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedOrder, setSelectedOrder] = useState<any>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [newStatus, setNewStatus] = useState("")
    const [redeemCode, setRedeemCode] = useState("")

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'admin') {
            router.push('/login')
        }
    }, [isAuthenticated, user, router])

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.robloxUsername.toLowerCase().includes(searchQuery.toLowerCase())
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
        }
        const config = variants[status] || { variant: "outline", label: status }
        return <Badge variant={config.variant}>{config.label}</Badge>
    }

    const handleEditOrder = (order: any) => {
        setSelectedOrder(order)
        setNewStatus(order.status)
        setRedeemCode(order.redeemCode || "")
        setIsEditDialogOpen(true)
    }

    const handleUpdateStatus = () => {
        if (selectedOrder) {
            updateOrderStatus(selectedOrder.id, newStatus as any, redeemCode)
            setIsEditDialogOpen(false)
        }
    }

    const handleDeleteOrder = (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus pesanan ini?")) {
            deleteOrder(id)
        }
    }

    if (!isAuthenticated || user?.role !== 'admin') {
        return null
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
                                        <TableCell className="font-medium font-mono text-sm">{order.id}</TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{order.customerName}</p>
                                                <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{order.productName}</span>
                                                {order.redeemCode && (
                                                    <span className="text-xs text-green-600 flex items-center gap-1">
                                                        <Gift className="h-3 w-3" /> Code Sent
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm text-primary">{order.robloxUsername}</TableCell>
                                        <TableCell className="text-sm">{order.paymentMethod}</TableCell>
                                        <TableCell className="font-semibold">Rp {order.amount.toLocaleString('id-ID')}</TableCell>
                                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(order.date).toLocaleDateString('id-ID')}
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
                            Ubah status pesanan {selectedOrder?.id}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Customer</Label>
                            <p className="text-sm font-medium">{selectedOrder?.customerName}</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Product</Label>
                            <p className="text-sm font-medium">{selectedOrder?.productName}</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Username Roblox</Label>
                            <p className="text-sm font-mono">{selectedOrder?.robloxUsername}</p>
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


"use client"

import { useState } from "react"
import { useProductStore } from "@/lib/product-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Search,
    Package,
    Plus,
    MoreVertical,
    Trash2,
    Edit,
    Tag
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ProductsManagement() {
    const [searchTerm, setSearchTerm] = useState("")
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [formData, setFormData] = useState({
        name: "",
        price: 0,
        category: "",
        description: "",
        image: "/images/robux.png",
        stock: 0,
        status: "active" as "active" | "low_stock" | "out_of_stock"
    })

    const { products, updateProduct, deleteProduct, addProduct } = useProductStore()

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
            case 'low_stock':
                return <Badge className="bg-yellow-500 hover:bg-yellow-600">Low Stock</Badge>
            case 'out_of_stock':
                return <Badge variant="destructive">Out of Stock</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const handleEdit = (product: any) => {
        setSelectedProduct(product)
        setFormData({
            name: product.name,
            price: product.price,
            category: product.category,
            description: product.description,
            image: product.image,
            stock: product.stock,
            status: product.status
        })
        setIsEditDialogOpen(true)
    }

    const handleDelete = (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
            deleteProduct(id)
        }
    }

    const handleSaveEdit = () => {
        if (selectedProduct) {
            updateProduct(selectedProduct.id, formData)
            setIsEditDialogOpen(false)
            setSelectedProduct(null)
        }
    }

    const handleAddProduct = () => {
        addProduct(formData)
        setIsAddDialogOpen(false)
        setFormData({
            name: "",
            price: 0,
            category: "",
            description: "",
            image: "/images/robux.png",
            stock: 0,
            status: "active"
        })
    }

    return (
        <div className="container py-10 px-4 md:px-6">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Manajemen Produk</h1>
                    <p className="text-muted-foreground">Kelola katalog produk, harga, dan stok</p>
                </div>
                <Button className="gradient-primary" onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Produk
                </Button>
            </div>

            <Card className="border-2 shadow-lg">
                <CardHeader className="border-b bg-muted/30">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-primary" />
                            Daftar Produk ({products.length})
                        </CardTitle>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Cari produk..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Sales</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.map((product) => (
                                    <TableRow key={product.id} className="hover:bg-muted/50">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{product.name}</span>
                                                <span className="text-xs text-muted-foreground font-mono">{product.id}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-normal">
                                                <Tag className="w-3 h-3 mr-1" />
                                                {product.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            Rp {product.price.toLocaleString('id-ID')}
                                        </TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell>{getStatusBadge(product.status)}</TableCell>
                                        <TableCell>{product.sales}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleEdit(product)}>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit Product
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => handleDelete(product.id)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Product Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Produk</DialogTitle>
                        <DialogDescription>
                            Ubah informasi produk {selectedProduct?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Nama Produk</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-price">Harga (Rp)</Label>
                                <Input
                                    id="edit-price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-stock">Stok</Label>
                                <Input
                                    id="edit-stock"
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-category">Kategori</Label>
                            <Input
                                id="edit-category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-description">Deskripsi</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleSaveEdit} className="gradient-primary">
                            Simpan Perubahan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Product Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Tambah Produk Baru</DialogTitle>
                        <DialogDescription>
                            Tambahkan produk baru ke katalog
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="add-name">Nama Produk</Label>
                            <Input
                                id="add-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Contoh: 500 Robux"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="add-price">Harga (Rp)</Label>
                                <Input
                                    id="add-price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                                    placeholder="50000"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="add-stock">Stok</Label>
                                <Input
                                    id="add-stock"
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                    placeholder="100"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="add-category">Kategori</Label>
                            <Input
                                id="add-category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                placeholder="Robux, Premium, Item"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="add-description">Deskripsi</Label>
                            <Textarea
                                id="add-description"
                                value={formData.description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Deskripsi produk..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleAddProduct} className="gradient-primary">
                            Tambah Produk
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

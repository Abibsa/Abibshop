"use client"

import { useState } from "react"
import { useUserStore } from "@/lib/user-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Search,
    User,
    Shield,
    MoreVertical,
    Trash2,
    UserCheck,
    UserX,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function UsersManagement() {
    const [searchTerm, setSearchTerm] = useState("")
    const { users, deleteUser, banUser, unbanUser, updateUser } = useUserStore()

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
            case 'banned':
                return <Badge variant="destructive">Banned</Badge>
            case 'inactive':
                return <Badge variant="secondary">Inactive</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const getRoleBadge = (role: string) => {
        return role === 'admin'
            ? <Badge variant="default" className="bg-purple-600 hover:bg-purple-700"><Shield className="w-3 h-3 mr-1" /> Admin</Badge>
            : <Badge variant="outline"><User className="w-3 h-3 mr-1" /> User</Badge>
    }

    const handleToggleRole = (userId: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin'
        updateUser(userId, { role: newRole as 'admin' | 'user' })
    }

    const handleToggleBan = (userId: string, currentStatus: string) => {
        if (currentStatus === 'banned') {
            unbanUser(userId)
        } else {
            banUser(userId)
        }
    }

    const handleDelete = (userId: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus user ini?")) {
            deleteUser(userId)
        }
    }

    return (
        <div className="container py-10 px-4 md:px-6">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Manajemen Pengguna</h1>
                <p className="text-muted-foreground">Kelola semua pengguna terdaftar di platform</p>
            </div>

            <Card className="border-2 shadow-lg">
                <CardHeader className="border-b bg-muted/30">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            Daftar Pengguna ({users.length})
                        </CardTitle>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Cari nama atau email..."
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
                                    <TableHead>User Info</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Joined Date</TableHead>
                                    <TableHead>Last Login</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id} className="hover:bg-muted/50">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{user.name}</span>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                                        <TableCell>{new Date(user.joinDate).toLocaleDateString('id-ID')}</TableCell>
                                        <TableCell>{new Date(user.lastLogin).toLocaleDateString('id-ID')}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleToggleRole(user.id, user.role)}>
                                                        <Shield className="mr-2 h-4 w-4" />
                                                        {user.role === 'admin' ? 'Set as User' : 'Set as Admin'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className={user.status === 'banned' ? 'text-green-600' : 'text-orange-600'}
                                                        onClick={() => handleToggleBan(user.id, user.status)}
                                                    >
                                                        {user.status === 'banned' ? (
                                                            <><UserCheck className="mr-2 h-4 w-4" /> Unban User</>
                                                        ) : (
                                                            <><UserX className="mr-2 h-4 w-4" /> Ban User</>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => handleDelete(user.id)}
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
        </div>
    )
}
